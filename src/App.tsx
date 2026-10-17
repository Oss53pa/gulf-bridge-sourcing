import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { ContentProvider, useContent } from './content/ContentProvider';
import Layout from './components/Layout';
import { ROUTES } from './components/ui';
import Home from './pages/Home';
import Approche from './pages/Approche';
import Services from './pages/Services';
import Methode from './pages/Methode';
import Secteurs from './pages/Secteurs';
import About from './pages/About';
import Contact from './pages/Contact';
import Legal from './pages/Legal';

/** Titre et description de chaque page, éditables dans la console (section SEO). */
function Seo() {
  const { seo, legal } = useContent();
  const { pathname } = useLocation();
  useEffect(() => {
    const titles: Record<string, string> = {
      [ROUTES.home]: seo.titleHome, [ROUTES.approche]: seo.titleApproche, [ROUTES.services]: seo.titleServices,
      [ROUTES.methode]: seo.titleMethode, [ROUTES.secteurs]: seo.titleSecteurs, [ROUTES.about]: seo.titleAbout,
      [ROUTES.contact]: seo.titleContact, [ROUTES.mentions]: legal.mentionsTitle, [ROUTES.privacy]: legal.privacyTitle,
    };
    document.title = `${titles[pathname] ?? seo.titleHome} | ${seo.siteName}`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', seo.description);
  }, [pathname, seo, legal]);
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
            <Route path={ROUTES.approche} element={<Approche />} />
            <Route path={ROUTES.services} element={<Services />} />
            <Route path={ROUTES.methode} element={<Methode />} />
            <Route path={ROUTES.secteurs} element={<Secteurs />} />
            <Route path={ROUTES.about} element={<About />} />
            <Route path={ROUTES.contact} element={<Contact />} />
            <Route path={ROUTES.mentions} element={<Legal kind="mentions" />} />
            <Route path={ROUTES.privacy} element={<Legal kind="privacy" />} />
            <Route path="*" element={<Navigate to={ROUTES.home} replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ContentProvider>
  );
}
