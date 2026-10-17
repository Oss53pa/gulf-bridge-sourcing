import { useContent } from '../content/ContentProvider';
import { CtaBand, Icon, PageHero, Rich } from '../components/ui';

export default function About() {
  const { about: a } = useContent();
  return (
    <>
      <PageHero hero={a.hero} crumb="Qui nous sommes" />
      <section className="bg-navy" data-screen-label="Fondatrice">
        <div className="founder">
          <span className="eyebrow" data-reveal="0">{a.eyebrow}</span>
          <h2 data-reveal="80"><Rich text={a.title} /></h2>
          <div className="founder-sig">
            <span><span className="serif">{a.founderName}</span><span className="label">{a.founderRole}</span></span>
          </div>
          <p className="founder-bio">{a.bio}</p>
          <div className="places">
            {a.places.map((p, i) => (
              <div className="place" key={i}><span className="label">{p.title}</span><span>{p.text}</span></div>
            ))}
          </div>
        </div>
      </section>
      <section className="sec-sm bg-sand on-light" data-screen-label="Engagements">
        <div className="wrap stack" style={{ gap: 'clamp(40px,5vw,64px)' }}>
          <div className="stack" style={{ gap: 20, maxWidth: 900 }}>
            <span className="eyebrow" data-reveal="0">{a.commitmentsEyebrow}</span>
            <h2 className="h2" data-reveal="80"><Rich text={a.commitmentsTitle} /></h2>
          </div>
          <div className="commitments">
            {a.commitments.map((c, i) => (
              <div className="commitment" key={i} data-reveal={(i % 3) * 110}>
                <span><Icon name={c.icon} /></span>
                <div><h3>{c.title}</h3><p>{c.text}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
