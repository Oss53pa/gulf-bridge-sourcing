import { useContent } from '../content/ContentProvider';
import { defaults, type LegalBlock } from '../content/defaults';
import { HashLink, Linkified } from '../components/ui';
import { ROUTES } from '../lib/site';

const blocks = (v: LegalBlock[] | undefined, fallback: LegalBlock[]) => (Array.isArray(v) ? v : fallback);

function Block({ b }: { b: LegalBlock }) {
  return (
    <section className="legal-block">
      <h3>{b.title}</h3>
      {(b.paragraphs ?? []).map((p, i) => <p key={`p${i}`}><Linkified text={p} /></p>)}
      {(b.list ?? []).length > 0 && <ul>{b.list.map((li, i) => <li key={i}><Linkified text={li} /></li>)}</ul>}
      {(b.after ?? []).map((p, i) => <p key={`a${i}`}><Linkified text={p} /></p>)}
    </section>
  );
}

export default function Legal() {
  const { mentions_legales: l } = useContent();
  return (
    <div className="legal">
      <div className="legal-in">
        <aside className="legal-toc">
          <nav aria-label="Sommaire">
            <span className="eyebrow wide">{l.tocLabel}</span>
            <HashLink to={`${ROUTES.legal}#mentions`}>{l.mentionsTitle}</HashLink>
            <HashLink to={`${ROUTES.legal}#confidentialite`}>{l.privacyTitle}</HashLink>
          </nav>
        </aside>
        <div className="legal-main">
          <article id="mentions" data-screen-label="Mentions légales">
            <h1>{l.mentionsTitle}</h1>
            {blocks(l.mentions, defaults.mentions_legales.mentions).map((b, i) => <Block key={i} b={b} />)}
            <p className="legal-date">{l.updatedLabel}</p>
          </article>
          <article id="confidentialite" data-screen-label="Confidentialité">
            <h2>{l.privacyTitle}</h2>
            {blocks(l.privacy, defaults.mentions_legales.privacy).map((b, i) => <Block key={i} b={b} />)}
            <p className="legal-date">{l.updatedLabel}</p>
          </article>
        </div>
      </div>
    </div>
  );
}
