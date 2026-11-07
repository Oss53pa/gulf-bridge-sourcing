import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { defaults, type SiteContent } from './defaults';
import { fetchContent, type RemoteContent } from '../lib/atlas';

const ContentContext = createContext<SiteContent>(defaults);

/** Fusion section par section : une valeur distante remplace la valeur par défaut. */
export function merge(remote: RemoteContent): SiteContent {
  const out: Record<string, unknown> = {};
  for (const [key, base] of Object.entries(defaults)) {
    const r = remote[key];
    if (!r || typeof r !== 'object') { out[key] = base; continue; }
    const section: Record<string, unknown> = { ...(base as Record<string, unknown>) };
    for (const [k, v] of Object.entries(r)) if (v !== undefined && v !== null) section[k] = v;
    out[key] = section;
  }
  return out as SiteContent;
}

/** Origines autorisées à envoyer un brouillon (aperçu en direct de la console). */
const PREVIEW_ORIGINS = ((import.meta.env.VITE_CONSOLE_ORIGINS as string | undefined) ?? 'https://atlas-studio.org,http://localhost:5173')
  .split(',').map(s => s.trim()).filter(Boolean);

export const isPreview = typeof window !== 'undefined'
  && window.parent !== window
  && new URLSearchParams(window.location.search).has('preview');

/**
 * Instantané du contenu figé dans le HTML au moment de la construction
 * (voir scripts/prerender.mjs). Le visiteur et le robot voient le même texte :
 * aucun nouvel appel réseau n'est fait en production, donc aucun scintillement.
 * Une publication depuis la console ne s'affiche qu'après une reconstruction.
 */
declare global {
  interface Window { __GBS_CONTENT__?: RemoteContent }
}

function snapshot(): RemoteContent {
  if (typeof window === 'undefined') return {};
  const s = window.__GBS_CONTENT__;
  return s && typeof s === 'object' ? s : {};
}

export function ContentProvider({ children, initial }: { children: ReactNode; initial?: RemoteContent }) {
  const [remote, setRemote] = useState<RemoteContent>(() => initial ?? snapshot());
  const [drafts, setDrafts] = useState<RemoteContent>({});

  // En aperçu console et en développement seulement : le contenu est relu en direct.
  const live = isPreview || import.meta.env.DEV;

  useEffect(() => {
    if (!live) return;
    const ctrl = new AbortController();
    fetchContent(ctrl.signal)
      .then(setRemote)
      .catch(err => { if (err?.name !== 'AbortError') console.warn('[contenu]', err); });
    return () => ctrl.abort();
  }, [live]);

  useEffect(() => {
    if (!isPreview) return;
    const onMessage = (e: MessageEvent) => {
      if (!PREVIEW_ORIGINS.includes(e.origin)) return;
      const m = e.data;
      if (m?.type === 'atlas-site-draft' && typeof m.key === 'string' && m.data && typeof m.data === 'object') {
        setDrafts(d => ({ ...d, [m.key]: m.data }));
      } else if (m?.type === 'atlas-site-go' && typeof m.path === 'string' && m.path.startsWith('/')) {
        window.history.pushState(null, '', m.path + window.location.search);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    };
    window.addEventListener('message', onMessage);
    for (const origin of PREVIEW_ORIGINS) window.parent.postMessage({ type: 'atlas-site-ready' }, origin);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const value = useMemo(() => merge({ ...remote, ...drafts }), [remote, drafts]);
  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export const useContent = () => useContext(ContentContext);
