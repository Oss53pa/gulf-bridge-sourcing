/**
 * Point d'entrée du rendu à la construction (voir scripts/prerender.mjs).
 * Chaque adresse du site est transformée en HTML complet, lisible sans
 * JavaScript, avec ses balises de titre, de description et de partage.
 */
import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';
import { ContentProvider } from './content/ContentProvider';
import { merge } from './content/ContentProvider';
import { fullTitle, jsonLd, pageMetas } from './seo';
import { ALL_ROUTES, ROUTES, type PageKey } from './components/ui';
import type { RemoteContent } from './lib/atlas';

export interface RenderedPage {
  key: PageKey;
  path: string;
  html: string;
  head: string;
}

const esc = (s: string) => String(s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function renderAll(remote: RemoteContent): RenderedPage[] {
  const content = merge(remote);
  const metas = pageMetas(content);
  const base = content.seo.baseUrl.replace(/\/$/, '');

  return ALL_ROUTES.map(key => {
    const meta = metas[key];
    const html = renderToString(
      <StrictMode>
        <ContentProvider initial={remote}>
          <StaticRouter location={meta.path}>
            <App />
          </StaticRouter>
        </ContentProvider>
      </StrictMode>,
    );

    const head = [
      `<title>${esc(fullTitle(content, meta))}</title>`,
      `<meta name="description" content="${esc(meta.description)}" />`,
      `<meta name="robots" content="${meta.noindex ? 'noindex,follow' : 'index,follow'}" />`,
      `<link rel="canonical" href="${esc(base + meta.path)}" />`,
      `<meta property="og:type" content="website" />`,
      `<meta property="og:site_name" content="${esc(content.seo.siteName)}" />`,
      `<meta property="og:locale" content="fr_FR" />`,
      `<meta property="og:title" content="${esc(meta.title)}" />`,
      `<meta property="og:description" content="${esc(meta.description)}" />`,
      `<meta property="og:url" content="${esc(base + meta.path)}" />`,
      `<meta property="og:image" content="${esc(base + meta.image)}" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<script type="application/ld+json">${JSON.stringify(jsonLd(content, key)).replace(/</g, '\\u003c')}</script>`,
    ].join('\n    ');

    return { key, path: meta.path, html, head };
  });
}

/** Page d'erreur sobre, servie par Cloudflare pour toute adresse inconnue. */
export function renderNotFound(remote: RemoteContent): { html: string; head: string } {
  const content = merge(remote);
  const html = renderToString(
    <StrictMode>
      <ContentProvider initial={remote}>
        <StaticRouter location="/adresse-inconnue">
          <App />
        </StaticRouter>
      </ContentProvider>
    </StrictMode>,
  );
  const head = [
    `<title>${esc(`Page introuvable | ${content.seo.siteName}`)}</title>`,
    `<meta name="robots" content="noindex,nofollow" />`,
  ].join('\n    ');
  return { html, head };
}

export { ROUTES };
