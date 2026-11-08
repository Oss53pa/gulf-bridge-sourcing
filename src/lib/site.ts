/** Routes, navigation et utilitaires sans composant React. */

export const ROUTES = {
  home: '/',
  about: '/qui-sommes-nous',
  legal: '/mentions-legales',
} as const;

/** Anciennes adresses, redirigées vers la section correspondante. */
export const LEGACY_REDIRECTS: Record<string, string> = {
  '/notre-approche': '/#confiance',
  '/services': '/#services',
  '/methode': '/#methode',
  '/secteurs': '/#profil',
  '/contact': '/#contact',
  '/confidentialite': '/mentions-legales#confidentialite',
};

/** Liens de navigation (en-tête, menu mobile, pied de page). */
export const NAV: { to: string; label: string }[] = [
  { to: '/#enjeux', label: 'Enjeux' },
  { to: '/#methode', label: 'Méthode' },
  { to: '/#services', label: 'Services' },
  { to: '/#produits', label: 'Produits' },
  { to: ROUTES.about, label: 'Qui sommes-nous' },
];
export const CONTACT_HREF = '/#contact';

export const pad = (i: number) => String(i + 1).padStart(2, '0');
export const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];

type Seg = { t: string; kind: 'text' | 'em' | 'strong' | 'br' };

/** Découpe « texte *italique* **gras** » (et les retours à la ligne) en segments. */
export function segments(text: string): Seg[] {
  return String(text ?? '').split(/(\*\*[^*]+\*\*|\*[^*]+\*|\n)/g).filter(Boolean).map((s): Seg => {
    if (s === '\n') return { t: '', kind: 'br' };
    if (s.startsWith('**') && s.endsWith('**') && s.length > 4) return { t: s.slice(2, -2), kind: 'strong' };
    if (s.startsWith('*') && s.endsWith('*') && s.length > 2) return { t: s.slice(1, -1), kind: 'em' };
    return { t: s, kind: 'text' };
  });
}

export const digits = (raw: string) => (raw || '').replace(/[^0-9]/g, '');
export const whatsappHref = (raw: string) => (digits(raw) ? `https://wa.me/${digits(raw)}` : '');
export const telHref = (raw: string) => (digits(raw) ? `tel:+${digits(raw)}` : '');

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Position de l'élément dans le document, sans le décalage dû aux sections
 * collantes (position: sticky), qui fausse scrollIntoView et les ancres natives.
 */
function documentTop(el: HTMLElement): number {
  const sec = el.closest<HTMLElement>('[data-stack]');
  if (!sec || !sec.parentElement) return el.getBoundingClientRect().top + window.scrollY;
  let top = sec.parentElement.getBoundingClientRect().top + window.scrollY;
  for (const s of Array.from(sec.parentElement.children) as HTMLElement[]) {
    if (s === sec) break;
    top += s.offsetHeight;
  }
  return top + (el === sec ? 0 : el.getBoundingClientRect().top - sec.getBoundingClientRect().top);
}

/** Fait défiler jusqu'à l'élément d'id donné. Renvoie false s'il n'existe pas. */
export function scrollToId(id: string, smooth = true): boolean {
  const el = document.getElementById(id);
  if (!el) return false;
  // Une section pleine largeur se cale sur le haut de l'écran ; un bloc intérieur laisse la place de l'en-tête.
  const offset = el.hasAttribute('data-stack') || el.tagName === 'SECTION' ? 0 : 100;
  window.scrollTo({ top: Math.max(0, documentTop(el) - offset), behavior: smooth && !reducedMotion() ? 'smooth' : 'auto' });
  return true;
}

