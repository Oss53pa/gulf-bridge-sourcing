import { Link } from 'react-router-dom';
import { useContent } from '../content/ContentProvider';
import { CtaBand, Icon, PageHero, Rich, etudeHref, pad } from '../components/ui';

export default function Solutions() {
  const { solutions: s } = useContent();
  return (
    <>
      <PageHero hero={s.hero} crumb="Nos solutions" />
      <section className="sec bg-sand on-light" data-screen-label="Nos solutions">
        <div className="wrap stack" style={{ gap: 'clamp(40px,5vw,64px)' }}>
          <div className="head-grid">
            <div className="stack" style={{ gap: 20 }}>
              <span className="eyebrow" data-reveal="0">{s.eyebrow}</span>
              <h2 className="h2" data-reveal="80"><Rich text={s.title} /></h2>
            </div>
            <div className="aside-navy">
              <span className="label">{s.asideLabel}</span>
              <span>{s.asideText}</span>
            </div>
          </div>

          <div className="solution-list">
            {s.items.map((x, i) => (
              <article className="solution" key={x.key} data-reveal={(i % 3) * 110}>
                <div className="title"><i>{pad(i)}</i><h3>{x.title}</h3></div>
                <p className="solution-problem">{x.problem}</p>
                <p>{x.text}</p>
                <p className="solution-deliverable"><span className="label">Vous recevez</span>{x.deliverable}</p>
                <Link to={etudeHref({ service: x.title })} className="link-under">
                  Demander cette solution<Icon name="arrow_forward" />
                </Link>
              </article>
            ))}
          </div>

          <p className="note-line">{s.note}</p>
          <p className="content-pending">{s.pendingNote}</p>
        </div>
      </section>
      <CtaBand context="nos solutions" />
    </>
  );
}
