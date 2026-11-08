import { Fragment, type ComponentProps } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { scrollToId, segments } from '../lib/site';

/** Texte éditable avec *italique*, **gras** et sauts de ligne. Aucun HTML n'est interprété. */
export function Rich({ text }: { text: string }) {
  return (
    <>
      {segments(text).map((s, i) => {
        if (s.kind === 'br') return <br key={i} />;
        if (s.kind === 'em') return <em key={i}>{s.t}</em>;
        if (s.kind === 'strong') return <strong key={i}>{s.t}</strong>;
        return <Fragment key={i}>{s.t}</Fragment>;
      })}
    </>
  );
}

const LINKABLE = /([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|\+\d{3}(?: \d{2}){5})/g;

/** Texte brut où les adresses e-mail et les numéros de téléphone deviennent des liens. */
export function Linkified({ text }: { text: string }) {
  const parts = String(text ?? '').split(LINKABLE);
  return (
    <>
      {parts.map((p, i) => {
        if (i % 2 === 0) return <Fragment key={i}>{p}</Fragment>;
        const href = p.includes('@') ? `mailto:${p}` : `tel:${p.replace(/\s/g, '')}`;
        return <a key={i} className="link-u" href={href}>{p}</a>;
      })}
    </>
  );
}

type HashLinkProps = Omit<ComponentProps<typeof Link>, 'to'> & { to: string };

/**
 * Lien interne qui sait viser une ancre (« /#contact »). Sur la page courante,
 * il fait défiler sans recharger, même si l'ancre est déjà dans l'adresse.
 */
export function HashLink({ to, onClick, ...rest }: HashLinkProps) {
  const { pathname } = useLocation();
  const [path, id] = to.split('#');
  return (
    <Link
      to={to}
      {...rest}
      onClick={e => {
        onClick?.(e);
        if (e.defaultPrevented || !id || (path || '/') !== pathname || e.metaKey || e.ctrlKey || e.shiftKey) return;
        if (!document.getElementById(id)) return;
        e.preventDefault();
        if (window.location.hash !== `#${id}`) window.history.pushState(window.history.state, '', `#${id}`);
        scrollToId(id);
      }}
    />
  );
}


/** Titre de hero : chaque ligne monte dans son masque (jambages préservés). */
export function HeroTitle({ lines, className }: { lines: string[]; className: string }) {
  return (
    <h1 className={className}>
      {lines.map((l, i) => (
        <span className="line-mask" key={i}><span className="line" style={{ animationDelay: `${250 + i * 140}ms` }}><Rich text={l} /></span></span>
      ))}
    </h1>
  );
}
