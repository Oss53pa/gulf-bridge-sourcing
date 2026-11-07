/**
 * Génère chaque page du site en HTML complet, lisible sans JavaScript.
 *
 * Le contenu de la console Atlas Studio est relu ici, au moment de la
 * construction, et figé dans le HTML. Le visiteur et le robot voient donc
 * exactement le même texte, sans appel réseau et sans scintillement.
 *
 * Conséquence à connaître : une publication depuis la console ne s'affiche
 * en ligne qu'après une nouvelle construction (Deploy Hook Cloudflare).
 *
 *   npm run build   # vite build, build SSR, puis ce script
 */
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const DIST = path.join(ROOT, 'dist');
const SSR = path.join(ROOT, 'dist-ssr', 'entry-server.js');
const SITE_ID = 'gulf-bridge-sourcing';

/* ------------------------------------------------- variables d'environnement */

async function loadEnv() {
  const env = { ...process.env };
  for (const file of ['.env', '.env.local', '.env.production', '.env.production.local']) {
    const p = path.join(ROOT, file);
    if (!existsSync(p)) continue;
    const text = await readFile(p, 'utf8');
    for (const line of text.split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
  return env;
}

/* ----------------------------------------------- contenu de la console */

async function fetchContent(env) {
  const url = env.VITE_ATLAS_SUPABASE_URL?.replace(/\/$/, '');
  const key = env.VITE_ATLAS_SUPABASE_ANON_KEY;
  if (!url || !key) {
    console.warn('[prerender] console non configurée : le site est généré avec le contenu par défaut.');
    return {};
  }
  const res = await fetch(`${url}/rest/v1/client_site_content?site_id=eq.${SITE_ID}&select=key,data`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!res.ok) throw new Error(`[prerender] contenu indisponible (${res.status}). Construction interrompue.`);
  const rows = await res.json();
  const out = Object.fromEntries(rows.map(r => [r.key, r.data ?? {}]));
  console.log(`[prerender] ${Object.keys(out).length} section(s) relue(s) depuis la console.`);
  return out;
}


/**
 * Sections supprimées par la refonte du 7 novembre 2026. Si la console les
 * contient encore, c'est qu'elle n'a pas été réalimentée : les sections
 * conservées (legal, contact, about, seo, methode, home_hero...) y portent
 * alors l'ancien contenu, qui écrase le nouveau champ par champ. Le site
 * repartirait en ligne avec Vercel comme hébergeur, la commission 70 / 30,
 * le délai de 48 heures et « une seule société ».
 */
const SECTIONS_SUPPRIMEES = [
  'approche', 'services', 'secteurs',
  'home_constat', 'home_audience', 'home_explore', 'home_positioning', 'home_startup',
];

function checkConsole(remote) {
  const stale = SECTIONS_SUPPRIMEES.filter(k => k in remote);
  if (!stale.length) return;
  console.error('\n[prerender] la console contient encore le contenu de l\'ancien site.');
  console.error(`  Sections obsolètes trouvées : ${stale.join(', ')}`);
  console.error('  Les sections conservées portent donc aussi l\'ancien texte et écraseraient');
  console.error('  les corrections du cahier des charges (hébergeur, commission, délai, sociétés).');
  console.error('\n  Réalimentez la console avant de construire :');
  console.error('    node scripts/seed-content.ts --force > seed.sql');
  console.error('    puis appliquez seed.sql, et supprimez les lignes obsolètes :');
  console.error(`    delete from public.client_site_content where site_id = '${SITE_ID}'`);
  console.error(`      and key in (${stale.map(k => `'${k}'`).join(', ')});\n`);
  process.exit(1);
}

/* ------------------------------------------------------------- écriture */

function buildPage(template, { head, html }, snapshotTag) {
  let out = template.replace(
    /<!--gbs-head-start-->[\s\S]*?<!--gbs-head-end-->/,
    `${head}`,
  );
  out = out.replace('<div id="root"><!--gbs-app--></div>', `<div id="root">${html}</div>`);
  if (snapshotTag) out = out.replace('<script type="module"', `${snapshotTag}\n    <script type="module"`);
  return out;
}

async function writePage(routePath, content) {
  const dir = routePath === '/' ? DIST : path.join(DIST, routePath.replace(/^\//, ''));
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, 'index.html'), content, 'utf8');
}

function sitemap(pages, base) {
  const now = new Date().toISOString().slice(0, 10);
  const urls = pages
    .filter(p => !p.noindex)
    .map(p => `  <url>\n    <loc>${base}${p.path === '/' ? '/' : p.path}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${p.path === '/' ? '1.0' : '0.8'}</priority>\n  </url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

/**
 * En-têtes de sécurité. La politique de sécurité du contenu n'autorise que
 * ce dont le site a besoin : ses propres fichiers, les polices Google, le
 * backend Atlas Studio et la mesure d'audience de l'hébergeur.
 */
function headers(env, inlineHashes = []) {
  const supabase = (env.VITE_ATLAS_SUPABASE_URL || '').replace(/\/$/, '');
  if (!supabase) console.warn("[prerender] VITE_ATLAS_SUPABASE_URL absent : la politique de sécurité du contenu bloquera l'envoi du formulaire.");
  const upload = (env.VITE_LEAD_UPLOAD_URL || '').replace(/\/$/, '');
  const analytics = (env.VITE_ANALYTICS_ENDPOINT || '').replace(/\/$/, '');
  const consoleOrigins = (env.VITE_CONSOLE_ORIGINS || 'https://atlas-studio.org,http://localhost:5173')
    .split(',').map(s => s.trim()).filter(Boolean);

  const connect = ["'self'", supabase, upload, analytics, 'https://cloudflareinsights.com']
    .filter(Boolean);
  const origin = (u) => { try { return new URL(u).origin; } catch { return ''; } };
  const connectSrc = [...new Set(connect.map(c => (c.startsWith('http') ? origin(c) : c)))].filter(Boolean);

  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "img-src 'self' data:",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    `script-src 'self' https://static.cloudflareinsights.com${inlineHashes.map(h => ` '${h}'`).join('')}`,
    `connect-src ${connectSrc.join(' ')}`,
    `frame-ancestors 'self' ${consoleOrigins.join(' ')}`,
    'upgrade-insecure-requests',
  ].join('; ');

  return `# Généré par scripts/prerender.mjs. Ne pas modifier à la main.
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  Content-Security-Policy: ${csp}

/assets/*
  Cache-Control: public, max-age=31536000, immutable

/images/*
  Cache-Control: public, max-age=604800
`;
}

/**
 * La police d'icônes est réduite aux icônes listées dans index.html. Une icône
 * ajoutée depuis la console sans être ajoutée à cette liste ne s'afficherait
 * pas : la construction le signale plutôt que de laisser un vide sur la page.
 */
function checkIcons(template, pages) {
  const m = template.match(/icon_names=([a-z0-9_,]+)/);
  if (!m) { console.warn('[prerender] liste icon_names absente de index.html.'); return; }
  const allowed = new Set(m[1].split(','));
  const used = new Set();
  for (const page of pages) {
    for (const found of page.html.matchAll(/class="ms[^"]*"[^>]*>([a-z0-9_]+)</g)) used.add(found[1]);
  }
  const missing = [...used].filter(i => !allowed.has(i)).sort();
  if (missing.length) {
    console.warn(`[prerender] icônes absentes de la police réduite, elles ne s'afficheront pas : ${missing.join(', ')}`);
    console.warn("[prerender] ajoutez-les au paramètre icon_names dans index.html.");
  }
}


/**
 * Contrôle du contenu avant publication, repris des critères de recette
 * (sections 8 et 15 du cahier des charges). Le contenu venant de la console,
 * ces règles se vérifient ici et nulle part ailleurs. Un manquement arrête la
 * construction : il vaut mieux corriger le texte dans la console que publier
 * une page qui échouera à la recette.
 */
const MARQUES_RESTREINTES = ['Hikvision', 'Dahua', 'Huawei', 'TP-Link', 'Growatt', 'Yutong'];
const OUTILS = /\b(claude|chatgpt|openai|copilot|gemini|lovable|bolt\.new|v0\.dev|webflow|squarespace|wix)\b|g[ée]n[ée]r[ée] (?:par|avec)|generated by/i;

function visibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&#x27;/g, "'").replace(/&amp;/g, '&').replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ');
}

function checkWording(pages) {
  const faults = [];
  const add = (path, rule) => faults.push(`${path} : ${rule}`);

  for (const page of pages) {
    const text = visibleText(page.html);

    // Tirets longs et points médians décoratifs.
    for (const [ch, nom] of [['—', 'tiret long'], ['–', 'tiret demi-cadratin'],
                             ['·', 'point médian'], ['•', 'puce décorative']]) {
      if (text.includes(ch)) {
        const i = text.indexOf(ch);
        add(page.path, `${nom} interdit, vers « ${text.slice(Math.max(0, i - 40), i + 40).trim()} »`);
      }
    }

    // Mention d'un outil de création ou de fabrication automatique.
    const outil = text.match(OUTILS);
    if (outil) add(page.path, `mention d'outil interdite : « ${outil[0]} »`);

    // Vocabulaire : un texte à valeur contractuelle qui emploie « centrale
    // d'achat » doit porter la qualification « bureau d'achat » ou « mandataire ».
    if (page.path === '/mentions-legales' || page.path === '/confidentialite') {
      if (/centrale d['’]achat/i.test(text) && !/mandataire|bureau d['’]achat/i.test(text)) {
        add(page.path, "« centrale d'achat » employé dans un texte à valeur contractuelle sans la qualification « bureau d'achat » ou « mandataire »");
      }
    }

    // Le délai de premier contact est de 1 jour ouvré depuis la décision 2.
    if (/48\s*(h|heures)\s*ouvr/i.test(text)) {
      add(page.path, "délai de 48 heures ouvrées, remplacé par 1 jour ouvré (décision 2)");
    }

    // Les mentions légales citent l'hébergeur réel, et plus Vercel.
    if (/\bVercel\b/i.test(text)) add(page.path, "Vercel cité alors que le site est hébergé par Cloudflare");
    if (page.path === '/mentions-legales' && !/H[ée]bergement/i.test(text)) {
      add(page.path, "rubrique « Hébergement » absente des mentions légales");
    }

    // Aucune marque sous sanctions ou restrictions sur la page des sites industriels.
    if (page.path === '/sites-industriels') {
      for (const m of MARQUES_RESTREINTES) {
        if (new RegExp(`\\b${m.replace('-', '[- ]?')}\\b`, 'i').test(text)) {
          add(page.path, `marque visée par des sanctions ou des restrictions : ${m}`);
        }
      }
    }
  }

  if (faults.length) {
    console.error('\n[prerender] contenu non conforme au cahier des charges :');
    for (const f of faults) console.error(`  - ${f}`);
    console.error('\nCorrigez le texte dans la console Atlas Studio, puis relancez la construction.\n');
    process.exit(1);
  }
  console.log('[prerender] contenu conforme : typographie, marques et vocabulaire.');
}

/* ----------------------------------------------------------------- main */

async function main() {
  const env = await loadEnv();
  if (!existsSync(SSR)) throw new Error(`[prerender] ${SSR} manquant. Lancez d'abord « npm run build:ssr ».`);

  const template = await readFile(path.join(DIST, 'index.html'), 'utf8');
  if (!template.includes('<!--gbs-app-->')) throw new Error('[prerender] marqueur <!--gbs-app--> absent de index.html.');

  const remote = await fetchContent(env);
  checkConsole(remote);
  const { renderAll, renderNotFound } = await import(SSR);
  const pages = renderAll(remote);

  // Instantané du contenu, pour que l'hydratation retrouve le même texte.
  const inlineHashes = [];
  let snapshotTag = '';
  if (Object.keys(remote).length) {
    const code = `window.__GBS_CONTENT__=${JSON.stringify(remote).replace(/</g, '\\u003c')}`;
    inlineHashes.push(`sha256-${createHash('sha256').update(code, 'utf8').digest('base64')}`);
    snapshotTag = `<script>${code}</script>`;
  }

  // Jeton de mesure d'audience de l'hébergeur, sans cookie.
  const token = env.VITE_CF_ANALYTICS_TOKEN?.trim();
  const beacon = token
    ? `<script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"${token}"}'></script>`
    : '';

  let base = 'https://gulfbridgesourcing.com';
  for (const page of pages) {
    let html = buildPage(template, page, snapshotTag);
    if (beacon) html = html.replace('</body>', `  ${beacon}\n  </body>`);
    await writePage(page.path, html);
    const m = page.head.match(/<link rel="canonical" href="([^"]+)"/);
    if (m && page.path === '/') base = m[1].replace(/\/$/, '') || base;
  }
  console.log(`[prerender] ${pages.length} page(s) générée(s) en HTML.`);
  checkIcons(template, pages);
  checkWording(pages);

  const nf = renderNotFound(remote);
  let nfHtml = buildPage(template, nf, snapshotTag);
  if (beacon) nfHtml = nfHtml.replace('</body>', `  ${beacon}\n  </body>`);
  await writeFile(path.join(DIST, '404.html'), nfHtml, 'utf8');

  const metas = pages.map(p => ({ path: p.path, noindex: /noindex/.test(p.head) }));
  await writeFile(path.join(DIST, 'sitemap.xml'), sitemap(metas, base), 'utf8');
  await writeFile(path.join(DIST, '_headers'), headers(env, inlineHashes), 'utf8');

  await rm(path.join(ROOT, 'dist-ssr'), { recursive: true, force: true });
  console.log('[prerender] sitemap.xml, 404.html et _headers écrits.');
}

main().catch(err => { console.error(err); process.exit(1); });
