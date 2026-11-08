import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ContentProvider, useContent } from './content/ContentProvider';
import Layout from './components/Layout';
import { LEGACY_REDIRECTS, ROUTES } from './lib/site';
import Home from './pages/Home';
import About from './pages/About';
import Legal from './pages/Legal';

/** Titre et description de chaque page, éditables dans la console (section SEO). */
function Seo() {
  const { seo_pages: s } = useContent();
  const { pathname } = useLocation();
  useEffect(() => {
    const page = pathname === ROUTES.about ? [s.titleAbout, s.descAbout]
      : pathname === ROUTES.legal ? [s.titleLegal, s.descLegal]
      : [s.titleHome, s.descHome];
    document.title = page[0];
    document.querySelector('meta[name="description"]')?.setAttribute('content', page[1]);
  }, [pathname, s]);
  return null;
}

export default function App() {
  return (
    <ContentProvider>
      <BrowserRouter>
        <Seo />
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path={ROUTES.about} element={<About />} />
            <Route path={ROUTES.legal} element={<Legal />} />
            {Object.entries(LEGACY_REDIRECTS).map(([from, to]) => (
              <Route key={from} path={from} element={<Navigate to={to} replace />} />
            ))}
            <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ContentProvider>
  );
}
