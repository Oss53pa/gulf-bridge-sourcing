import { useContent } from '../content/ContentProvider';
import { BrandNotice, CtaBand, Icon, PageHero } from '../components/ui';
import { BRAND_NOTICE } from '../content/defaults';

export default function Autres() {
  const { autres: a } = useContent();
  return (
    <>
      <PageHero hero={a.hero} crumb="Autres secteurs" />

      <section className="sec bg-sand on-light" data-screen-label="Liste des secteurs">
        <div className="wrap stack" style={{ gap: 'clamp(28px,3vw,44px)' }}>
          <div className="tiles tiles-400">
            {a.items.map((x, i) => (
              <article className="tile" key={i} data-reveal={(i % 3) * 110}>
                <span className="tile-icon"><Icon name={x.icon} /></span>
                <h2>{x.title}</h2>
                <p className="tile-problem">{x.problem}</p>
                <p><span className="label">Notre solution</span>{x.solution}</p>
                <div className="tile-foot">
                  <Icon name="inventory_2" />
                  <span><span className="label">Produits</span>{x.products}</span>
                </div>
              </article>
            ))}
          </div>
          <BrandNotice text={BRAND_NOTICE} />
        </div>
      </section>

      <section className="sec-sm bg-navy" data-screen-label="Ports">
        <div className="wrap stack" style={{ gap: 28 }}>
          <h2 className="h2" data-reveal="0">{a.portsTitle}</h2>
          <p style={{ maxWidth: 760 }} data-reveal="80">{a.portsText}</p>
          <ul className="ports" data-reveal="140">
            {a.ports.map(p => <li key={p}><Icon name="anchor" size={20} />{p}</li>)}
          </ul>
        </div>
      </section>

      <section className="sec-sm bg-white on-light" data-screen-label="Conformité">
        <div className="wrap head-grid">
          <h2 className="h2" data-reveal="0">{a.complianceTitle}</h2>
          <p className="lead">{a.complianceText}</p>
        </div>
      </section>

      <section className="sec-sm bg-sand on-light" data-screen-label="Exclusions">
        <div className="wrap stack" style={{ gap: 24, maxWidth: 900 }}>
          <h2 className="h2" data-reveal="0">{a.exclusionsTitle}</h2>
          <ul className="exclusions">
            {a.exclusions.map((x, i) => <li key={i} data-reveal={(i % 4) * 70}><Icon name="block" size={20} />{x}</li>)}
          </ul>
        </div>
      </section>

      <CtaBand context="autres secteurs" />
    </>
  );
}
