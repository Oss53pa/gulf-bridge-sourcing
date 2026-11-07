import { useEffect, useLayoutEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useContent, isPreview } from '../content/ContentProvider';
import { Icon, INTRO_MS, ROUTES, etudeHref, whatsappHref, type PageKey } from './ui';
import { track } from '../lib/analytics';

// Logo en WebP, redimensionné pour l'affichage réel. Le PNG reste pour l'icône d'onglet.
const LOGO = '/images/logo-gbs-white.webp';
const LOGO_W = 770;
const LOGO_H = 400;

const NAV: [PageKey, string][] = [
  ['equipement', 'Équiper votre site'],
  ['industriel', 'Sites industriels'],
  ['autres', 'Autres secteurs'],
  ['solutions', 'Nos solutions'],
  ['methode', 'Méthode et garanties'],
  ['about', 'Qui nous sommes'],
];
const NAV_ALL: [PageKey, string][] = [['home', 'Accueil'], ...NAV, ['contact', 'Contact']];

const hasWindow = typeof window !== 'undefined';
/** useLayoutEffect n'existe pas au rendu serveur. */
const useIsoLayoutEffect = hasWindow ? useLayoutEffect : useEffect;
const reducedMotion = () => hasWindow && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * L'animation d'ouverture : moins d'une seconde, sur l'accueil seulement, une
 * fois par session, jamais en aperçu console, et désactivée si le téléphone
 * demande de réduire les animations. Désactivée par défaut dans le contenu.
 */
function shouldPlayIntro(enabled: boolean) {
  if (!enabled || !hasWindow || isPreview || reducedMotion() || !('IntersectionObserver' in window)) return false;
  if (window.location.pathname !== '/') return false; // jamais ailleurs que sur l'accueil
  try {
    if (sessionStorage.getItem('gbs-intro') === '1') return false;
    sessionStorage.setItem('gbs-intro', '1');
  } catch { /* stockage indisponible */ }
  return true;
}

/** Apparition au défilement des éléments [data-reveal="délai ms"]. */
function useReveal(path: string, introPlaying: boolean) {
  useEffect(() => {
    if (reducedMotion() || isPreview || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.remove('rv-hidden');
      io.unobserve(e.target);
    }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    const setup = () => document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-rv])').forEach(el => {
      el.setAttribute('data-rv', '1');
      let d = Number(el.getAttribute('data-reveal') || 0);
      if (!introPlaying && d >= INTRO_MS) d -= INTRO_MS;
      el.classList.add('rv-hidden', 'rv-ready');
      el.style.transitionDelay = `${d}ms`;
      io.observe(el);
    });
    setup();
    const mo = new MutationObserver(setup);
    mo.observe(document.body, { childList: true, subtree: true });

    // Filet de sécurité : rien ne reste invisible au-dessus de la ligne de flottaison.
    const safety = window.setTimeout(() => document.querySelectorAll<HTMLElement>('.rv-hidden').forEach(el => {
      if (el.getBoundingClientRect().top < window.innerHeight) el.classList.remove('rv-hidden');
    }), 2600);
    const showAll = () => document.querySelectorAll('.rv-hidden').forEach(el => el.classList.remove('rv-hidden'));
    window.addEventListener('beforeprint', showAll);
    return () => { io.disconnect(); mo.disconnect(); clearTimeout(safety); window.removeEventListener('beforeprint', showAll); };
  }, [path, introPlaying]);
}

/** Barre de progression de la méthode, liée au défilement. */
function useScrollEffects(setScrolled: (v: boolean) => void) {
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      document.querySelectorAll<HTMLElement>('[data-progress]').forEach(el => {
        const r = el.parentElement!.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (window.innerHeight * 0.85 - r.top) / (window.innerHeight * 0.6)));
        el.style.width = `${p * 100}%`;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [setScrolled]);
}

export default function Layout() {
  const { settings, intro } = useContent();
  const { pathname } = useLocation();
  // Décidée après l'hydratation seulement : le HTML pré-rendu ne contient
  // jamais l'animation, et le premier rendu du navigateur doit lui être
  // identique, sinon React rejette le HTML et reconstruit toute la page.
  const [playIntro, setPlayIntro] = useState(false);
  const [introVisible, setIntroVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    if (!shouldPlayIntro(intro.enabled !== false)) return;
    setPlayIntro(true);
    setIntroVisible(true);
  }, [intro.enabled]);

  useEffect(() => {
    if (!introVisible) return;
    const t = window.setTimeout(() => setIntroVisible(false), INTRO_MS + 100);
    return () => clearTimeout(t);
  }, [introVisible]);

  useIsoLayoutEffect(() => { window.scrollTo(0, 0); setMenu(false); }, [pathname]);
  useReveal(pathname, playIntro);
  useScrollEffects(setScrolled);

  // Pages à fond clair en haut : l'en-tête reste opaque pour garder le logo lisible.
  const lightTop = pathname === ROUTES.mentions || pathname === ROUTES.privacy;
  const year = new Date().getFullYear();
  const animClass = `anim${playIntro ? '' : ' no-intro'}`;
  const wa = whatsappHref(settings.whatsapp, pathname);

  return (
    <div className={animClass}>
      <a href="#contenu" className="skip-link">Aller au contenu</a>

      {introVisible && (
        <div className="intro" aria-hidden="true">
          <div className="intro-panel top" /><div className="intro-panel bot" />
          <div className="intro-center">
            <img src={LOGO} alt="" width={LOGO_W} height={LOGO_H} />
            <div className="intro-line" />
            <div className="intro-tag"><span>{intro.cityFrom}</span><i /><span>{intro.cityTo}</span></div>
          </div>
        </div>
      )}

      <header className={`header${scrolled || menu || lightTop ? ' solid' : ''}${scrolled ? ' scrolled' : ''}`}>
        <div className="header-bar">
          <Link to={ROUTES.home} className="header-logo" aria-label="Gulf Bridge Sourcing, accueil"><img src={LOGO} alt="Gulf Bridge Sourcing" width={LOGO_W} height={LOGO_H} /></Link>
          <nav className="nav" aria-label="Navigation principale">
            {NAV.map(([k, label]) => <NavLink key={k} to={ROUTES[k]}>{label}</NavLink>)}
            <Link to={etudeHref()} className="btn btn-gold">{settings.ctaLabel}<Icon name="arrow_forward" /></Link>
          </nav>
          <button className="btn-reset menu-btn" aria-label="Menu" aria-expanded={menu} onClick={() => setMenu(m => !m)}>
            <Icon name={menu ? 'close' : 'menu'} />
          </button>
        </div>
        {menu && (
          <nav className="mobile-menu" aria-label="Navigation mobile">
            {NAV_ALL.map(([k, label]) => <NavLink key={k} to={ROUTES[k]} end>{label}<Icon name="arrow_forward" /></NavLink>)}
            <Link to={etudeHref()} className="btn btn-gold">{settings.ctaLabel}</Link>
          </nav>
        )}
      </header>

      <main id="contenu"><Outlet /></main>

      {wa && (
        <a className="wa-float" href={wa} target="_blank" rel="noopener noreferrer"
          aria-label="Écrire sur WhatsApp" onClick={() => track('whatsapp_click', { page: pathname })}>
          <Icon name="chat" />
        </a>
      )}

      <footer className="footer">
        <div className="wrap">
          <div className="footer-top">
            <img src={LOGO} alt="Gulf Bridge Sourcing" width={LOGO_W} height={LOGO_H} loading="lazy" />
            <nav aria-label="Plan du site">
              {NAV_ALL.map(([k, label]) => <Link key={k} to={ROUTES[k]}>{label}</Link>)}
              <Link to={ROUTES.etude}>{settings.ctaLabel}</Link>
              {settings.clientPortalUrl && (
                <a href={settings.clientPortalUrl} onClick={() => track('client_portal_click')}>Espace client</a>
              )}
            </nav>
          </div>
          <div className="footer-bottom">
            <span className="stack" style={{ gap: 4 }}>
              <span>Gulf Bridge Sourcing, {settings.legalNameCi}, RCCM {settings.rccm}</span>
              <span>
                Guangzhou : {settings.addressGuangzhou}. Abidjan : {settings.addressAbidjan}.{' '}
                <a href={`mailto:${settings.email}`}>{settings.email}</a>, {settings.phoneAbidjan}
              </span>
            </span>
            <span className="footer-links">
              <Link to={ROUTES.contact}>Contact</Link>
              <Link to={ROUTES.mentions}>Mentions légales</Link>
              <Link to={ROUTES.privacy}>Confidentialité</Link>
              {settings.linkedin && <a href={settings.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
            </span>
            <span>© {year} Gulf Bridge Sourcing</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
