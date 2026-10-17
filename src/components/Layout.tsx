import { useEffect, useLayoutEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useContent, isPreview } from '../content/ContentProvider';
import { Icon, ROUTES, type PageKey } from './ui';

const LOGO = '/images/logo-gbs-white.png';
const INTRO_MS = 2600;

const NAV: [PageKey, string][] = [
  ['approche', 'Notre approche'], ['services', 'Services'], ['methode', 'Méthode'],
  ['secteurs', 'Secteurs'], ['about', 'Qui nous sommes'],
];
const NAV_ALL: [PageKey, string][] = [['home', 'Accueil'], ...NAV, ['contact', 'Contact']];

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** L'intro ne se joue qu'une fois par session, jamais en aperçu console. */
function shouldPlayIntro(enabled: boolean) {
  if (!enabled || isPreview || reducedMotion() || !('IntersectionObserver' in window)) return false;
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
      if (!introPlaying && d >= 1500) d -= 1500;
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
    }), 3800);
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
  const [playIntro] = useState(() => shouldPlayIntro(intro.enabled !== false));
  const [introVisible, setIntroVisible] = useState(playIntro);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    if (!introVisible) return;
    const t = window.setTimeout(() => setIntroVisible(false), INTRO_MS + 100);
    return () => clearTimeout(t);
  }, [introVisible]);

  useLayoutEffect(() => { window.scrollTo(0, 0); setMenu(false); }, [pathname]);
  useReveal(pathname, playIntro);
  useScrollEffects(setScrolled);

  // Pages à fond clair en haut : l'en-tête reste opaque pour garder le logo lisible.
  const lightTop = pathname === ROUTES.mentions || pathname === ROUTES.privacy;
  const year = new Date().getFullYear();
  const animClass = `anim${playIntro ? '' : ' no-intro'}`;

  return (
    <div className={animClass}>
      {introVisible && (
        <div className="intro" aria-hidden="true">
          <div className="intro-panel top" /><div className="intro-panel bot" />
          <div className="intro-center">
            <img src={LOGO} alt="" />
            <div className="intro-line" />
            <div className="intro-tag"><span>{intro.cityFrom}</span><i /><span>{intro.cityTo}</span></div>
          </div>
        </div>
      )}

      <header className={`header${scrolled || menu || lightTop ? ' solid' : ''}${scrolled ? ' scrolled' : ''}`}>
        <div className="header-bar">
          <Link to={ROUTES.home} className="header-logo" aria-label="Gulf Bridge Sourcing, accueil"><img src={LOGO} alt="Gulf Bridge Sourcing" /></Link>
          <nav className="nav" aria-label="Navigation principale">
            {NAV.map(([k, label]) => <NavLink key={k} to={ROUTES[k]}>{label}</NavLink>)}
            <Link to={ROUTES.contact} className="btn btn-gold">{settings.ctaLabel}<Icon name="arrow_forward" /></Link>
          </nav>
          <button className="btn-reset menu-btn" aria-label="Menu" aria-expanded={menu} onClick={() => setMenu(m => !m)}>
            <Icon name={menu ? 'close' : 'menu'} />
          </button>
        </div>
        {menu && (
          <nav className="mobile-menu" aria-label="Navigation mobile">
            {NAV_ALL.map(([k, label]) => <NavLink key={k} to={ROUTES[k]} end>{label}<Icon name="arrow_forward" /></NavLink>)}
            <Link to={ROUTES.contact} className="btn btn-gold">{settings.ctaLabel}</Link>
          </nav>
        )}
      </header>

      <main><Outlet /></main>

      <footer className="footer">
        <div className="wrap">
          <div className="footer-top">
            <img src={LOGO} alt="Gulf Bridge Sourcing" />
            <nav aria-label="Plan du site">
              {NAV_ALL.map(([k, label]) => <Link key={k} to={ROUTES[k]}>{label}</Link>)}
            </nav>
          </div>
          <div className="footer-bottom">
            <span>
              <span>Gulf Bridge Sourcing · {settings.legalName} · RCCM {settings.rccm} · Licence Chine {settings.chinaLicence}</span>
              <span>Guangzhou : {settings.addressGuangzhou} · Abidjan : {settings.addressAbidjan} · <a href={`mailto:${settings.email}`}>{settings.email}</a> · {settings.phoneAbidjan}</span>
            </span>
            <span className="footer-links">
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
