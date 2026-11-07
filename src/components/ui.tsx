import { Fragment, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../content/ContentProvider';
import type { PageHero as PageHeroData } from '../content/defaults';

export const ROUTES = {
  home: '/',
  equipement: '/equiper-votre-site',
  industriel: '/sites-industriels',
  autres: '/autres-secteurs',
  solutions: '/solutions',
  methode: '/methode',
  about: '/qui-sommes-nous',
  etude: '/demander-une-etude',
  contact: '/contact',
  mentions: '/mentions-legales',
  privacy: '/confidentialite',
} as const;
export type PageKey = keyof typeof ROUTES;

/** Durée de l'animation d'ouverture. Elle doit rester sous la seconde. */
export const INTRO_MS = 900;

/** Toutes les adresses du site, dans l'ordre du plan du site. */
export const ALL_ROUTES: PageKey[] = [
  'home', 'equipement', 'industriel', 'autres', 'solutions',
  'methode', 'about', 'etude', 'contact', 'mentions', 'privacy',
];

/** Anciennes adresses, redirigées de façon permanente (301). */
export const LEGACY_REDIRECTS: Record<string, string> = {
  '/approche': ROUTES.methode,
  '/notre-approche': ROUTES.methode,
  '/services': ROUTES.solutions,
  '/secteurs': ROUTES.autres,
};

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
    <section className={`page-hero${hero.image ? '' : ' page-hero-plain'}`} data-screen-label={crumb}>
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

/** Lien WhatsApp, avec un message indiquant la page d'origine. */
export function whatsappHref(raw: string, context?: string) {
  const digits = (raw || '').replace(/[^0-9]/g, '');
  if (!digits) return '';
  const text = context ? `?text=${encodeURIComponent(`Bonjour, je vous écris depuis la page ${context} du site Gulf Bridge Sourcing.`)}` : '';
  return `https://wa.me/${digits}${text}`;
}

/**
 * Lien vers le formulaire guidé, avec la spécialité ou le service préremplis.
 * Les valeurs passent par l'adresse pour survivre au pré-rendu et au partage.
 */
export function etudeHref(params: { specialty?: string; service?: string } = {}) {
  const q = new URLSearchParams();
  if (params.specialty) q.set('specialite', params.specialty);
  if (params.service) q.set('service', params.service);
  const s = q.toString();
  return s ? `${ROUTES.etude}?${s}` : ROUTES.etude;
}

export function CtaBand({ context }: { context?: string }) {
  const { cta, settings } = useContent();
  const wa = whatsappHref(settings.whatsapp, context);
  return (
    <section className="cta" data-screen-label="Appel final">
      <Icon name="directions_boat" className="cta-boat" />
      <div className="inner">
        <div className="stack" style={{ gap: 14, maxWidth: 760 }}>
          <h2 data-reveal="0"><Rich text={cta.title} /></h2>
          <span className="text" data-reveal="120">{cta.text}</span>
        </div>
        <div data-reveal="200" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to={etudeHref()} className="btn btn-navy">{settings.ctaLabel}<Icon name="arrow_forward" /></Link>
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

/** Avertissement obligatoire sur toute page citant des marques. */
export function BrandNotice({ text }: { text: string }) {
  return <p className="brand-notice">{text}</p>;
}
