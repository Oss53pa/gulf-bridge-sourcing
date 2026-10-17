/**
 * Accès au backend Atlas Studio (projet Supabase partagé) via PostgREST,
 * avec la clé publique anon. Le contenu est en lecture seule ; les demandes
 * de contact passent par la RPC submit_client_site_lead.
 */
import { SITE_ID } from '../content/defaults';

const URL_ = (import.meta.env.VITE_ATLAS_SUPABASE_URL as string | undefined)?.replace(/\/$/, '');
const KEY = import.meta.env.VITE_ATLAS_SUPABASE_ANON_KEY as string | undefined;

export const atlasConfigured = Boolean(URL_ && KEY);

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

export interface LeadInput {
  name: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  message: string;
  page: string;
}

export async function submitLead(lead: LeadInput): Promise<void> {
  if (!atlasConfigured) throw new Error("Le formulaire n'est pas encore relié. Écrivez-nous par e-mail.");
  const res = await fetch(`${URL_}/rest/v1/rpc/submit_client_site_lead`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      p_site_id: SITE_ID,
      p_name: lead.name,
      p_email: lead.email,
      p_company: lead.company,
      p_phone: lead.phone,
      p_service: lead.service,
      p_message: lead.message,
      p_page: lead.page,
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
}
