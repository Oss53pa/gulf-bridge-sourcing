import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { defaults, type SiteContent } from './defaults';
import { fetchContent, type RemoteContent } from '../lib/atlas';

const CACHE_KEY = 'gbs-content-v1';
const ContentContext = createContext<SiteContent>(defaults);

/** Fusion section par section : une valeur distante remplace la valeur par défaut. */
function merge(remote: RemoteContent): SiteContent {
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

function readCache(): RemoteContent {
  try { return JSON.parse(localStorage.getItem(CACHE_KEY) || '{}'); } catch { return {}; }
}

/** Origines autorisées à envoyer un brouillon (aperçu en direct de la console). */
const PREVIEW_ORIGINS = ((import.meta.env.VITE_CONSOLE_ORIGINS as string | undefined) ?? 'https://atlas-studio.org,http://localhost:5173')
  .split(',').map(s => s.trim()).filter(Boolean);

export const isPreview = typeof window !== 'undefined'
  && window.parent !== window
  && new URLSearchParams(window.location.search).has('preview');

export function ContentProvider({ children }: { children: ReactNode }) {
  const [remote, setRemote] = useState<RemoteContent>(readCache);
  const [drafts, setDrafts] = useState<RemoteContent>({});

  useEffect(() => {
    const ctrl = new AbortController();
    fetchContent(ctrl.signal)
      .then(r => {
        setRemote(r);
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(r)); } catch { /* stockage indisponible */ }
      })
      .catch(err => { if (err?.name !== 'AbortError') console.warn('[contenu]', err); });
    return () => ctrl.abort();
  }, []);

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
