import { useContent } from '../content/ContentProvider';
import { CtaBand, Icon, PageHero } from '../components/ui';

export default function Secteurs() {
  const { secteurs: s } = useContent();
  return (
    <>
      <PageHero hero={s.hero} crumb="Secteurs" />
      <section className="sec-sm bg-sand" data-screen-label="Liste secteurs">
        <div className="wrap tiles tiles-400">
          {s.items.map((x, i) => (
            <div className="tile" key={i} data-reveal={(i % 3) * 110}>
              <span className="tile-icon"><Icon name={x.icon} /></span>
              <h2>{x.title}</h2>
              <p>{x.text}</p>
              {x.example && (
                <div className="tile-foot">
                  <Icon name="lightbulb" />
                  <span><span className="label">{s.exampleLabel}</span>{x.example}</span>
                </div>
              )}
            </div>
          ))}
          <div className="tile dark" data-reveal={(s.items.length % 3) * 110}>
            <span className="tile-icon"><Icon name="anchor" /></span>
            <h2>{s.portsTitle}</h2>
            <p>{s.portsText}</p>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
