/**
 * Pièces jointes du formulaire « Demander une étude ».
 * NON DÉPLOYÉE. Voir supabase/README.md.
 *
 * Le navigateur ne détient que la clé publique anon : il ne doit jamais écrire
 * dans le stockage. Cette fonction est la seule à écrire, avec la clé de
 * service, et elle vérifie tout avant de le faire.
 *
 * Variables attendues :
 *   SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY   fournies par la plateforme
 *   ALLOWED_ORIGIN                            https://gulfbridgesourcing.com
 *   MAX_FILES         défaut 5
 *   MAX_FILE_BYTES    défaut 10485760
 *   RATE_PER_HOUR     défaut 20
 */
import { createClient } from 'jsr:@supabase/supabase-js@2';

const BUCKET = 'client-site-lead-files';
const SITE_ID = 'gulf-bridge-sourcing';

const num = (k: string, d: number) => Number(Deno.env.get(k) ?? d) || d;
const MAX_FILES = num('MAX_FILES', 5);
const MAX_FILE_BYTES = num('MAX_FILE_BYTES', 10 * 1024 * 1024);
const RATE_PER_HOUR = num('RATE_PER_HOUR', 20);
const ALLOWED_ORIGIN = Deno.env.get('ALLOWED_ORIGIN') ?? '';

/**
 * Type réel du fichier, lu sur ses premiers octets. L'extension et le type
 * déclaré par le navigateur ne sont pas des preuves.
 */
const SIGNATURES: { ext: string; mime: string; test: (b: Uint8Array) => boolean }[] = [
  { ext: 'pdf', mime: 'application/pdf', test: b => b[0] === 0x25 && b[1] === 0x50 && b[2] === 0x44 && b[3] === 0x46 },
  { ext: 'jpg', mime: 'image/jpeg', test: b => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { ext: 'png', mime: 'image/png', test: b => b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47 },
  // DOCX et XLSX sont des archives ZIP : la distinction se fait sur le contenu.
  { ext: 'zip', mime: 'application/zip', test: b => b[0] === 0x50 && b[1] === 0x4b && (b[2] === 0x03 || b[2] === 0x05 || b[2] === 0x07) },
];

const OOXML: Record<string, { ext: string; mime: string }> = {
  'word/': { ext: 'docx', mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
  'xl/': { ext: 'xlsx', mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
};

/** Reconnaît un DOCX ou un XLSX sans décompresser : on cherche le premier nom d'entrée. */
function ooxmlKind(bytes: Uint8Array): { ext: string; mime: string } | null {
  const head = new TextDecoder('latin1').decode(bytes.subarray(0, Math.min(bytes.length, 4096)));
  for (const [prefix, kind] of Object.entries(OOXML)) if (head.includes(prefix)) return kind;
  return null;
}

async function identify(file: File): Promise<{ ext: string; mime: string } | null> {
  const bytes = new Uint8Array(await file.slice(0, 4096).arrayBuffer());
  if (bytes.length < 4) return null;
  for (const s of SIGNATURES) {
    if (!s.test(bytes)) continue;
    if (s.ext !== 'zip') return { ext: s.ext, mime: s.mime };
    return ooxmlKind(bytes); // une archive ZIP qui n'est ni DOCX ni XLSX est refusée
  }
  return null;
}

/** Limitation de débit, en mémoire du processus. Fenêtre glissante d'une heure. */
const hits = new Map<string, number[]>();
function overRate(ip: string): boolean {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter(t => now - t < 3_600_000);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear(); // garde-fou mémoire
  return list.length > RATE_PER_HOUR;
}

const cors = (origin: string) => ({
  'Access-Control-Allow-Origin': origin,
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  Vary: 'Origin',
});

/** Message générique côté client : aucun détail technique ne sort d'ici. */
const fail = (status: number, origin: string) =>
  new Response(JSON.stringify({ error: 'refusé' }), {
    status, headers: { ...cors(origin), 'Content-Type': 'application/json' },
  });

Deno.serve(async req => {
  const origin = req.headers.get('origin') ?? '';
  const ok = ALLOWED_ORIGIN && origin === ALLOWED_ORIGIN;

  if (req.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(ok ? origin : '') });
  if (!ok) return fail(403, '');
  if (req.method !== 'POST') return fail(405, origin);

  const ip = req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'inconnue';
  if (overRate(ip)) return fail(429, origin);

  let form: FormData;
  try { form = await req.formData(); } catch { return fail(400, origin); }

  if (form.get('site_id') !== SITE_ID) return fail(400, origin);
  const ref = String(form.get('ref') ?? '');
  if (!/^GBS-\d{8}-[A-Z0-9]{5}$/.test(ref)) return fail(400, origin);

  const files = form.getAll('files').filter((f): f is File => f instanceof File);
  if (files.length === 0 || files.length > MAX_FILES) return fail(400, origin);

  const client = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { auth: { persistSession: false } },
  );

  const out: { name: string; size: number; path: string }[] = [];
  for (const [i, file] of files.entries()) {
    if (file.size === 0 || file.size > MAX_FILE_BYTES) return fail(413, origin);

    const kind = await identify(file);
    if (!kind) return fail(415, origin);

    // Le nom est régénéré : rien du nom d'origine n'atteint le stockage.
    const path = `${SITE_ID}/${ref}/${String(i + 1).padStart(2, '0')}-${crypto.randomUUID()}.${kind.ext}`;
    const { error } = await client.storage.from(BUCKET).upload(path, file, {
      contentType: kind.mime, upsert: false,
    });
    if (error) {
      console.error('upload', { ref, index: i, code: error.name }); // ni nom de fichier, ni donnée personnelle
      return fail(500, origin);
    }
    // Le nom d'origine est renvoyé au site pour affichage, jamais utilisé comme chemin.
    out.push({ name: file.name.slice(0, 300), size: file.size, path });
  }

  return new Response(JSON.stringify({ files: out }), {
    status: 200, headers: { ...cors(origin), 'Content-Type': 'application/json' },
  });
});
