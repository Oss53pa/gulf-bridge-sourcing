import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useContent } from './content/ContentProvider';
import Layout from './components/Layout';
import { LEGACY_REDIRECTS, ROUTES, type PageKey } from './components/ui';
import { fullTitle, jsonLd, pageMetas } from './seo';
import { captureOrigin } from './lib/analytics';
import Home from './pages/Home';
import Specialty from './pages/Specialty';
import Autres from './pages/Autres';
import Solutions from './pages/Solutions';
import Methode from './pages/Methode';
import About from './pages/About';
import Etude from './pages/Etude';
import Contact from './pages/Contact';
import Legal from './pages/Legal';
import NotFound from './pages/NotFound';

const KEY_BY_PATH: Record<string, PageKey> = Object.fromEntries(
  (Object.entries(ROUTES) as [PageKey, string][]).map(([k, p]) => [p, k]),
);

/**
 * Titre, description, image de partage, adresse canonique et données
 * structurées. Le pré-rendu écrit déjà ces balises dans le HTML ; ce
 * composant les met à jour lors d'une navigation dans le navigateur.
 */
function Head() {
  const c = useContent();
  const { pathname } = useLocation();

  useEffect(() => {
    const key = KEY_BY_PATH[pathname];
    if (!key) return;
    const meta = pageMetas(c)[key];
    const base = c.seo.baseUrl.replace(/\/$/, '');

    document.title = fullTitle(c, meta);

    const setMeta = (sel: string, attr: string, value: string) => {
      let el = document.head.querySelector<HTMLMetaElement>(sel);
      if (!el) {
        el = document.createElement('meta');
        const [name, val] = sel.replace(/^meta\[|\]$/g, '').split('=');
        el.setAttribute(name, val.replace(/"/g, ''));
        document.head.appendChild(el);
      }
      el.setAttribute(attr, value);
    };

    setMeta('meta[name="description"]', 'content', meta.description);
    setMeta('meta[property="og:title"]', 'content', meta.title);
    setMeta('meta[property="og:description"]', 'content', meta.description);
    setMeta('meta[property="og:image"]', 'content', `${base}${meta.image}`);
    setMeta('meta[property="og:url"]', 'content', `${base}${meta.path}`);
    setMeta('meta[name="robots"]', 'content', meta.noindex ? 'noindex,follow' : 'index,follow');

    let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) { link = document.createElement('link'); link.rel = 'canonical'; document.head.appendChild(link); }
    link.href = `${base}${meta.path}`;

    let ld = document.head.querySelector<HTMLScriptElement>('script[type="application/ld+json"]');
    if (!ld) { ld = document.createElement('script'); ld.type = 'application/ld+json'; document.head.appendChild(ld); }
    ld.textContent = JSON.stringify(jsonLd(c, key));
  }, [pathname, c]);

  return null;
}

export default function App() {
  useEffect(() => { captureOrigin(); }, []);
  return (
    <>
      <Head />
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path={ROUTES.equipement} element={<Specialty kind="equipement" />} />
          <Route path={ROUTES.industriel} element={<Specialty kind="industriel" />} />
          <Route path={ROUTES.autres} element={<Autres />} />
          <Route path={ROUTES.solutions} element={<Solutions />} />
          <Route path={ROUTES.methode} element={<Methode />} />
          <Route path={ROUTES.about} element={<About />} />
          <Route path={ROUTES.etude} element={<Etude />} />
          <Route path={ROUTES.contact} element={<Contact />} />
          <Route path={ROUTES.mentions} element={<Legal kind="mentions" />} />
          <Route path={ROUTES.privacy} element={<Legal kind="privacy" />} />
          {/* Anciennes adresses : le 301 est servi par Cloudflare (public/_redirects).
              Cette règle ne sert qu'à une navigation interne vers un ancien lien. */}
          {Object.entries(LEGACY_REDIRECTS).map(([from, to]) => (
            <Route key={from} path={from} element={<Navigate to={to} replace />} />
          ))}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
