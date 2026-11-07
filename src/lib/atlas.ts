/**
 * Accès au backend Atlas Studio (projet Supabase partagé) via PostgREST,
 * avec la clé publique anon uniquement. Le contenu est en lecture seule ;
 * les demandes passent par la RPC submit_client_site_lead.
 *
 * Limite connue : la RPC accepte huit champs texte et aucun fichier. Les
 * champs structurés du formulaire guidé (spécialité, pays, quantités, date,
 * fournisseur, origine) sont donc écrits dans un bloc lisible du message,
 * en attendant la migration décrite dans supabase/README.md.
 */
import { SITE_ID } from '../content/defaults';

const URL_ = (import.meta.env.VITE_ATLAS_SUPABASE_URL as string | undefined)?.replace(/\/$/, '');
const KEY = import.meta.env.VITE_ATLAS_SUPABASE_ANON_KEY as string | undefined;
const UPLOAD_URL = (import.meta.env.VITE_LEAD_UPLOAD_URL as string | undefined)?.replace(/\/$/, '');

export const atlasConfigured = Boolean(URL_ && KEY);
/** Le téléversement n'est actif que si la fonction d'envoi est déployée. */
export const uploadsConfigured = Boolean(UPLOAD_URL && atlasConfigured);

const headers = (): Record<string, string> => ({
  apikey: KEY ?? '',
  Authorization: `Bearer ${KEY ?? ''}`,
  'Content-Type': 'application/json',
});

export type RemoteContent = Record<string, Record<string, unknown>>;

export async function fetchContent(signal?: AbortSignal): Promise<RemoteContent> {
  if (!atlasConfigured) return {};
  const res = await fetch(
    `${URL_}/rest/v1/client_site_content?site_id=eq.${SITE_ID}&select=key,data`,
    { headers: headers(), signal },
  );
  if (!res.ok) throw new Error(`Contenu indisponible (${res.status})`);
  const rows = (await res.json()) as { key: string; data: Record<string, unknown> }[];
  return Object.fromEntries(rows.map(r => [r.key, r.data ?? {}]));
}

/* ------------------------------------------------------ Pièces jointes */

export const MAX_FILES = 5;
export const MAX_FILE_BYTES = 10 * 1024 * 1024;

/** Types acceptés : extension et type MIME doivent concorder. */
export const ACCEPTED_FILES: { ext: string; mime: string[] }[] = [
  { ext: 'pdf', mime: ['application/pdf'] },
  { ext: 'jpg', mime: ['image/jpeg'] },
  { ext: 'jpeg', mime: ['image/jpeg'] },
  { ext: 'png', mime: ['image/png'] },
  { ext: 'docx', mime: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'] },
  { ext: 'xlsx', mime: ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'] },
];

export const ACCEPT_ATTR = ACCEPTED_FILES.map(f => `.${f.ext}`).join(',');

/**
 * Contrôle côté navigateur : confort de saisie seulement.
 * Le contrôle qui protège réellement est celui de la fonction d'envoi, qui
 * vérifie les octets du fichier, borne la taille et régénère le nom.
 */
export function checkFile(file: File): string | null {
  const ext = (file.name.split('.').pop() ?? '').toLowerCase();
  const rule = ACCEPTED_FILES.find(f => f.ext === ext);
  if (!rule) return `${file.name} : format refusé. Formats acceptés : PDF, JPG, PNG, DOCX, XLSX.`;
  if (file.type && !rule.mime.includes(file.type)) return `${file.name} : le contenu ne correspond pas à l'extension.`;
  if (file.size > MAX_FILE_BYTES) return `${file.name} : fichier trop lourd. 10 Mo au plus.`;
  if (file.size === 0) return `${file.name} : fichier vide.`;
  return null;
}

export interface UploadedFile { name: string; size: number; path: string }

/** Envoie les fichiers à la fonction contrôlée, qui renvoie leur emplacement privé. */
async function uploadFiles(files: File[], ref: string): Promise<UploadedFile[]> {
  if (!files.length) return [];
  if (!uploadsConfigured) throw new Error("L'envoi de pièces jointes n'est pas encore actif.");
  const body = new FormData();
  body.append('site_id', SITE_ID);
  body.append('ref', ref);
  for (const f of files) body.append('files', f, f.name);
  const res = await fetch(`${UPLOAD_URL}`, {
    method: 'POST',
    headers: { apikey: KEY ?? '', Authorization: `Bearer ${KEY ?? ''}` },
    body,
  });
  if (!res.ok) {
    if (res.status === 429) throw new Error('Trop de fichiers envoyés. Réessayez dans une heure.');
    throw new Error("Les pièces jointes n'ont pas pu être envoyées. Réessayez sans fichier et nous vous les demanderons par e-mail.");
  }
  const out = await res.json();
  return Array.isArray(out?.files) ? (out.files as UploadedFile[]) : [];
}

/* -------------------------------------------------------- Demandes */

export interface LeadInput {
  /* Étape 1 */
  specialty: string;
  service: string;
  country: string;
  products: string;
  needDate: string;
  supplierKnown: string;
  supplierName: string;
  /* Étape 2 */
  files: File[];
  /* Étape 3 */
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  source: string;
  /* Contexte */
  landingPage: string;
  referrer: string;
}

/** Référence courte, affichée au visiteur et reprise dans le message. */
export function newRef(): string {
  const d = new Date();
  const ymd = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
  const rnd = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `GBS-${ymd}-${rnd}`;
}

/** Bloc lisible repris dans le message, en attendant les colonnes dédiées. */
function composeMessage(lead: LeadInput, ref: string, files: UploadedFile[]): string {
  const line = (k: string, v: string) => (v ? `${k} : ${v}\n` : '');
  let m = `Référence : ${ref}\n`;
  m += line('Spécialité ou secteur', lead.specialty);
  m += line('Service souhaité', lead.service);
  m += line('Pays de livraison', lead.country);
  m += line('Date de besoin', lead.needDate);
  m += line('Fournisseur déjà identifié', lead.supplierKnown === 'oui' ? (lead.supplierName || 'oui') : 'non');
  m += line('Fonction', lead.role);
  m += line('Origine', lead.source);
  m += line("Page d'arrivée", lead.landingPage);
  m += line('Provenance', lead.referrer);
  m += `\nProduits et quantités :\n${lead.products}\n`;
  if (files.length) {
    m += `\nPièces jointes (${files.length}) :\n`;
    for (const f of files) m += `- ${f.name} (${Math.round(f.size / 1024)} ko) : ${f.path}\n`;
  }
  return m.trim();
}

export interface LeadResult { ref: string; attachmentsSent: number }

export async function submitLead(lead: LeadInput): Promise<LeadResult> {
  if (!atlasConfigured) throw new Error("Le formulaire n'est pas encore relié. Écrivez-nous par e-mail.");
  const ref = newRef();

  let uploaded: UploadedFile[] = [];
  if (lead.files.length && uploadsConfigured) uploaded = await uploadFiles(lead.files, ref);

  const res = await fetch(`${URL_}/rest/v1/rpc/submit_client_site_lead`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      p_site_id: SITE_ID,
      p_name: lead.name,
      p_email: lead.email,
      p_company: lead.company,
      p_phone: lead.phone,
      p_service: [lead.specialty, lead.service].filter(Boolean).join(' / '),
      p_message: composeMessage(lead, ref, uploaded),
      p_page: lead.landingPage || '/demander-une-etude',
    }),
  });
  if (!res.ok) {
    let msg = "L'envoi a échoué. Réessayez ou écrivez-nous par e-mail.";
    try {
      const body = await res.json();
      if (body?.code === '54000') msg = 'Trop de demandes envoyées. Réessayez dans une heure.';
      else if (body?.code === '22023' && typeof body.message === 'string') msg = `Vérifiez le formulaire : ${body.message}.`;
    } catch { /* corps non JSON */ }
    throw new Error(msg);
  }
  return { ref, attachmentsSent: uploaded.length };
}
