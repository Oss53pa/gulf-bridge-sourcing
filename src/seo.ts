/**
 * Titres, descriptions, image de partage et données structurées, par page.
 * Utilisé à la fois par le pré-rendu (scripts/prerender.mjs) et par la
 * navigation côté client, pour que le robot et le visiteur voient la même chose.
 */
import type { SiteContent } from './content/defaults';
import { ROUTES, type PageKey } from './components/ui';

export interface PageMeta {
  path: string;
  title: string;
  description: string;
  image: string;
  crumb: string;
  noindex?: boolean;
}

const clip = (s: string, n = 300) => {
  const t = String(s ?? '').replace(/\*/g, '').replace(/\s+/g, ' ').trim();
  return t.length <= n ? t : `${t.slice(0, n - 1).trimEnd()}…`;
};

export function pageMetas(c: SiteContent): Record<PageKey, PageMeta> {
  const img = c.seo.defaultOgImage;
  return {
    home: {
      path: ROUTES.home, crumb: 'Accueil',
      title: "Votre bureau d'achat en Chine",
      description: clip(c.home_hero.text),
      image: c.home_hero.image || img,
    },
    equipement: {
      path: ROUTES.equipement, crumb: 'Équiper votre site',
      title: 'Équiper votre site avant son ouverture',
      description: clip(c.equipement.hero.text),
      image: c.equipement.hero.image || img,
    },
    industriel: {
      path: ROUTES.industriel, crumb: 'Sites industriels',
      title: 'Approvisionner vos sites industriels',
      description: clip(c.industriel.hero.text),
      image: c.industriel.hero.image || img,
    },
    autres: {
      path: ROUTES.autres, crumb: 'Autres secteurs',
      title: 'Autres secteurs, traités sur demande',
      description: clip(c.autres.hero.text),
      image: c.autres.hero.image || img,
    },
    solutions: {
      path: ROUTES.solutions, crumb: 'Nos solutions',
      title: 'Nos solutions',
      description: clip(c.solutions.hero.text),
      image: c.solutions.hero.image || img,
    },
    methode: {
      path: ROUTES.methode, crumb: 'Méthode et garanties',
      title: 'Méthode et garanties',
      description: clip(c.methode.hero.text),
      image: c.methode.hero.image || img,
    },
    about: {
      path: ROUTES.about, crumb: 'Qui nous sommes',
      title: 'Qui nous sommes',
      description: clip(c.about.hero.text),
      image: c.about.hero.image || img,
    },
    etude: {
      path: ROUTES.etude, crumb: 'Demander une étude',
      title: 'Demander une étude',
      description: clip(c.etude.hero.text),
      image: img,
    },
    contact: {
      path: ROUTES.contact, crumb: 'Contact',
      title: 'Contact et questions fréquentes',
      description: clip(c.contact.hero.text),
      image: img,
    },
    mentions: {
      path: ROUTES.mentions, crumb: c.legal.mentionsTitle,
      title: c.legal.mentionsTitle,
      description: "Éditeur, hébergeur et marques citées du site Gulf Bridge Sourcing.",
      image: img, noindex: true,
    },
    privacy: {
      path: ROUTES.privacy, crumb: c.legal.privacyTitle,
      title: c.legal.privacyTitle,
      description: 'Données collectées, finalité, durée de conservation et vos droits.',
      image: img, noindex: true,
    },
  };
}

export const fullTitle = (c: SiteContent, m: PageMeta) =>
  m.path === ROUTES.home ? `${m.title} | ${c.seo.siteName}` : `${m.title} | ${c.seo.siteName}`;

/**
 * Données structurées : Organization pour la marque, LocalBusiness pour
 * chacun des deux bureaux, FAQPage sur la page Contact.
 * Un bureau n'est publié que si son adresse est renseignée dans la console.
 */
export function jsonLd(c: SiteContent, key: PageKey): object[] {
  const base = c.seo.baseUrl.replace(/\/$/, '');
  const placeholder = (v: string) => !v || /^\[.*\]$/.test(v.trim());

  const offices = [
    { id: 'guangzhou', name: `${c.seo.siteName}, Guangzhou`, address: c.settings.addressGuangzhou, phone: c.settings.phoneGuangzhou, city: 'Guangzhou', country: 'CN' },
    { id: 'abidjan', name: `${c.seo.siteName}, Abidjan`, address: c.settings.addressAbidjan, phone: c.settings.phoneAbidjan, city: 'Abidjan', country: 'CI' },
  ];

  const org = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${base}/#organization`,
    name: c.seo.siteName,
    url: base,
    logo: `${base}/images/logo-gbs-white.png`,
    description: c.seo.description,
    email: c.settings.email,
    areaServed: ["Côte d'Ivoire", 'Gabon', 'Cameroun'],
    ...(c.settings.linkedin ? { sameAs: [c.settings.linkedin] } : {}),
  };

  const locals = offices
    .filter(o => !placeholder(o.address))
    .map(o => ({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${base}/#${o.id}`,
      name: o.name,
      parentOrganization: { '@id': `${base}/#organization` },
      url: base,
      email: c.settings.email,
      ...(placeholder(o.phone) ? {} : { telephone: o.phone }),
      address: { '@type': 'PostalAddress', streetAddress: o.address, addressLocality: o.city, addressCountry: o.country },
    }));

  const out: object[] = [org, ...locals];

  if (key === 'contact') {
    out.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: c.contact.faq.map(f => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    });
  }
  return out;
}
