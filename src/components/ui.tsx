import { Fragment, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../content/ContentProvider';
import type { PageHero as PageHeroData } from '../content/defaults';

export const ROUTES = {
  home: '/',
  approche: '/notre-approche',
  services: '/services',
  methode: '/methode',
  secteurs: '/secteurs',
  about: '/qui-sommes-nous',
  contact: '/contact',
  mentions: '/mentions-legales',
  privacy: '/confidentialite',
} as const;
export type PageKey = keyof typeof ROUTES;

export function Icon({ name, className = '', size }: { name: string; className?: string; size?: number }) {
  return <span aria-hidden="true" className={`ms ${className}`} style={size ? { fontSize: size } : undefined}>{name}</span>;
}

/** Découpe « texte *accent* texte » en segments. */
export function segments(text: string): { t: string; em: boolean }[] {
  return String(text ?? '').split(/(\*[^*]+\*)/g).filter(Boolean)
    .map(s => (s.startsWith('*') && s.endsWith('*') ? { t: s.slice(1, -1), em: true } : { t: s, em: false }));
}

/** Texte avec *accents* en italique doré. */
export function Rich({ text }: { text: string }) {
  return <>{segments(text).map((s, i) => (s.em ? <em key={i} className="hl">{s.t}</em> : <Fragment key={i}>{s.t}</Fragment>))}</>;
}

export const pad = (i: number) => String(i + 1).padStart(2, '0');

export function Eyebrow({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return <span className="eyebrow" data-reveal={delay}>{children}</span>;
}

export function PageHero({ hero, crumb }: { hero: PageHeroData; crumb: string }) {
  return (
    <section className="page-hero" data-screen-label={crumb}>
      {hero.image && <div className="cover kb"><img src={hero.image} alt="" /></div>}
      <div className="shade" />
      <div className="page-hero-inner">
        <nav className="crumbs" aria-label="Fil d'Ariane" data-reveal="0">
          <Link to={ROUTES.home}>Accueil</Link><Icon name="chevron_right" /><span>{crumb}</span>
        </nav>
        <h1 data-reveal="120"><Rich text={hero.title} /></h1>
        {hero.text && <p data-reveal="260">{hero.text}</p>}
      </div>
      <div className="page-hero-rule" />
    </section>
  );
}

export function whatsappHref(raw: string) {
  const digits = (raw || '').replace(/[^0-9]/g, '');
  return digits ? `https://wa.me/${digits}` : '';
}

export function CtaBand() {
  const { cta, settings } = useContent();
  const wa = whatsappHref(settings.whatsapp);
  return (
    <section className="cta" data-screen-label="CTA">
      <Icon name="directions_boat" className="cta-boat" />
      <div className="inner">
        <div className="stack" style={{ gap: 14, maxWidth: 760 }}>
          <h2 data-reveal="0"><Rich text={cta.title} /></h2>
          <span className="text" data-reveal="120">{cta.text}</span>
        </div>
        <div data-reveal="200" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to={ROUTES.contact} className="btn btn-navy">{settings.ctaLabel}<Icon name="arrow_forward" /></Link>
          {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-outline-navy"><Icon name="chat" size={20} />WhatsApp</a>}
        </div>
      </div>
    </section>
  );
}

export function ReportPages() {
  const { report } = useContent();
  return (
    <div className="report-pages">
      {report.images.slice(0, 3).map((src, i) => (
        <div className="report-page" key={i}><img src={src} alt={report.captions[i] ?? `Page ${i + 1} du rapport`} loading="lazy" /></div>
      ))}
    </div>
  );
}
