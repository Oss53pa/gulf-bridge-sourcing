import { useContent } from '../content/ContentProvider';
import { CtaBand, PageHero, Rich, pad } from '../components/ui';

export default function Services() {
  const { services: s } = useContent();
  return (
    <>
      <PageHero hero={s.hero} crumb="Services" />
      <section className="sec bg-sand on-light" data-screen-label="Services">
        <div className="wrap stack" style={{ gap: 'clamp(40px,5vw,64px)' }}>
          <div className="head-grid">
            <div className="stack" style={{ gap: 20 }}>
              <span className="eyebrow" data-reveal="0">{s.eyebrow}</span>
              <h2 className="h2" data-reveal="80"><Rich text={s.title} /></h2>
            </div>
            <div className="aside-navy">
              <span className="label" style={{ color: 'var(--gold)' }}>{s.asideLabel}</span>
              <span>{s.asideText}</span>
            </div>
          </div>
          <div className="service-list">
            {s.items.map((x, i) => (
              <div className="service" key={i} data-reveal={(i % 3) * 110}>
                <div className="title"><i>{pad(i)}</i><h3>{x.title}</h3></div>
                <p>{x.text}</p>
                <p><span className="label">Vous recevez</span>{x.deliverable}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
