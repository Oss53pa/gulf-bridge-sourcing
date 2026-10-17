import { useContent } from '../content/ContentProvider';
import { CtaBand, Icon, PageHero, Rich, pad } from '../components/ui';

export default function Approche() {
  const { approche: a } = useContent();
  return (
    <>
      <PageHero hero={a.hero} crumb="Notre approche" />
      <section className="sec bg-sand on-light" data-screen-label="Ce qui nous distingue">
        <div className="wrap stack" style={{ gap: 'clamp(48px,6vw,80px)' }}>
          <div className="head-grid">
            <div className="stack" style={{ gap: 20 }}>
              <span className="eyebrow" data-reveal="0">{a.eyebrow}</span>
              <h2 className="h2" data-reveal="80"><Rich text={a.title} /></h2>
            </div>
            <p className="lead">{a.text}</p>
          </div>
          <div className="tiles tiles-360">
            {a.items.map((x, i) => (
              <div className="tile" key={i} data-reveal={(i % 3) * 110}>
                <span className="num">{pad(i)}</span>
                <h3>{x.title}</h3>
                <p>{x.text}</p>
                <div className="tile-foot">
                  <Icon name="task_alt" />
                  <span><span className="label">Vous recevez</span>{x.deliverable}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
