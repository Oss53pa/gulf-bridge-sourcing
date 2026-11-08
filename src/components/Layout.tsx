import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useContent, isPreview } from '../content/ContentProvider';
import { HashLink } from './ui';
import { CONTACT_HREF, NAV, ROUTES, scrollToId, whatsappHref } from '../lib/site';
import { useReveal, useScrollState, useStacking } from '../lib/effects';

const LOGO = '/images/logo-gbs-white.png';

export default function Layout() {
  const { site } = useContent();
  const { pathname, hash } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  const wa = whatsappHref(site.whatsapp);

  // Changement de page : haut de page, ou section demandée par l'ancre.
  useLayoutEffect(() => {
    setMenu(false);
    const id = decodeURIComponent(hash.slice(1));
    if (!id) { window.scrollTo(0, 0); return; }
    const raf = requestAnimationFrame(() => { if (!scrollToId(id, false)) window.scrollTo(0, 0); });
    return () => cancelAnimationFrame(raf);
  }, [pathname, hash]);

  // Liens vers une ancre de la page courante : défilement maîtrisé (compatible avec les sections collantes).
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.('a[href*="#"]') as HTMLAnchorElement | null;
      if (!a || a.target === '_blank') return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;
      const id = decodeURIComponent(url.hash.slice(1));
      if (!document.getElementById(id)) return;
      e.preventDefault();
      setMenu(false);
      if (window.location.hash !== url.hash) window.history.pushState(window.history.state, '', url.hash);
      scrollToId(id);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // Menu mobile : Échap pour fermer, défilement bloqué, focus géré.
  useEffect(() => {
    if (!menu) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenu(false); };
    const mq = window.matchMedia('(min-width: 960px)');
    const onMq = () => { if (mq.matches) setMenu(false); };
    window.addEventListener('keydown', onKey);
    mq.addEventListener?.('change', onMq);
    const btn = menuBtn.current;
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener('keydown', onKey);
      mq.removeEventListener?.('change', onMq);
      btn?.focus();
    };
  }, [menu]);

  const onScrolled = useCallback((v: boolean) => setScrolled(v), []);
  useScrollState(onScrolled, pathname);
  useReveal(pathname, !isPreview);
  useStacking(pathname, site.stacking !== false && !isPreview, site.stackingMobile !== false);

  const solidTop = pathname === ROUTES.legal;
  const closeMenu = () => setMenu(false);

  return (
    <div className="site">
      <a className="skip" href="#contenu">Aller au contenu</a>
      <header className={`header${scrolled || solidTop ? ' solid' : ''}`}>
        <div className="header-bar">
          <Link to={ROUTES.home} className="header-logo"><img src={LOGO} alt="Gulf Bridge Sourcing, retour à l'accueil" width={89} height={46} /></Link>
          <nav className="nav" aria-label="Navigation principale">
            {NAV.map(n => (
              <HashLink key={n.to} to={n.to} className={n.to === pathname ? 'current' : undefined} aria-current={n.to === pathname ? 'page' : undefined}>{n.label}</HashLink>
            ))}
            <HashLink to={CONTACT_HREF} className="nav-cta">{site.ctaLabel}</HashLink>
          </nav>
          <button ref={menuBtn} type="button" className="menu-btn" aria-label="Ouvrir le menu" aria-expanded={menu} aria-controls="menu-mobile" onClick={() => setMenu(true)}>Menu</button>
        </div>
      </header>

      {menu && (
        <div id="menu-mobile" className="menu" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="menu-top">
            <img src={LOGO} alt="Gulf Bridge Sourcing" width={89} height={46} />
            <button ref={closeBtn} type="button" className="menu-btn" onClick={closeMenu}>Fermer</button>
          </div>
          <nav className="menu-nav" aria-label="Navigation principale">
            {NAV.map(n => (
              <HashLink key={n.to} to={n.to} onClick={closeMenu} aria-current={n.to === pathname ? 'page' : undefined}>{n.label}</HashLink>
            ))}
          </nav>
          <div className="menu-actions">
            <HashLink to={CONTACT_HREF} className="btn btn-ivory" onClick={closeMenu}>{site.ctaLabel}</HashLink>
            {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-outline">WhatsApp</a>}
          </div>
        </div>
      )}

      <main id="contenu" tabIndex={-1}><Outlet /></main>

      <footer className="footer">
        <div className="wrap footer-in">
          <div className="footer-top">
            <img src={LOGO} alt="Gulf Bridge Sourcing" width={116} height={60} loading="lazy" />
            <nav aria-label="Pied de page">
              {NAV.map(n => <HashLink key={n.to} to={n.to}>{n.label}</HashLink>)}
              <HashLink to={CONTACT_HREF}>Contact</HashLink>
            </nav>
          </div>
          <div className="footer-bottom">
            <span>{site.footerLine}</span>
            <span className="footer-legal">
              <Link to={ROUTES.legal}>Mentions légales</Link>
              <HashLink to={`${ROUTES.legal}#confidentialite`}>Confidentialité</HashLink>
              <span>{site.copyright}</span>
            </span>
          </div>
        </div>
      </footer>

      <div className="mobile-bar">
        <HashLink to={CONTACT_HREF}>{site.ctaLabel}</HashLink>
        {wa && <a href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
      </div>
    </div>
  );
}
