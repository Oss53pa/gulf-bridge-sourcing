/**
 * Mesure d'audience sans cookie et sans donnée personnelle.
 *
 * Les visites sont comptées par l'outil de l'hébergeur (Cloudflare Web
 * Analytics), chargé depuis index.html si un jeton est configuré. Les
 * événements du cahier des charges (section 14) sont envoyés à un point
 * d'entrée optionnel ; sans ce point d'entrée, la fonction ne fait rien.
 *
 * Rien de ce qui est envoyé ici ne permet d'identifier une personne.
 */

const ENDPOINT = (import.meta.env.VITE_ANALYTICS_ENDPOINT as string | undefined)?.trim();

export type TrackEvent =
  | 'form_open' | 'form_step_1' | 'form_step_2' | 'form_step_3' | 'form_sent'
  | 'whatsapp_click' | 'plaquette_download' | 'report_request' | 'client_portal_click';

export function track(event: TrackEvent, props: Record<string, string> = {}): void {
  if (typeof window === 'undefined') return;
  const payload = { event, path: window.location.pathname, ...props, ts: Date.now() };
  try {
    if (!ENDPOINT) return;
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });
    if (navigator.sendBeacon) navigator.sendBeacon(ENDPOINT, blob);
    else void fetch(ENDPOINT, { method: 'POST', body: blob, keepalive: true });
  } catch { /* la mesure ne doit jamais casser une page */ }
}

const KEY = 'gbs-origin';

/** Page d'arrivée et provenance de la visite, gardées le temps de la session. */
export function captureOrigin(): void {
  if (typeof window === 'undefined') return;
  try {
    if (sessionStorage.getItem(KEY)) return;
    const q = new URLSearchParams(window.location.search);
    const campaign = ['utm_source', 'utm_medium', 'utm_campaign']
      .map(k => q.get(k)).filter(Boolean).join(' ');
    sessionStorage.setItem(KEY, JSON.stringify({
      landing: window.location.pathname,
      referrer: campaign || (document.referrer ? new URL(document.referrer).hostname : 'direct'),
    }));
  } catch { /* stockage indisponible */ }
}

export function readOrigin(): { landing: string; referrer: string } {
  if (typeof window === 'undefined') return { landing: '', referrer: '' };
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* stockage indisponible */ }
  return { landing: window.location.pathname, referrer: 'direct' };
}
