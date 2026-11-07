import { useContent } from '../content/ContentProvider';
import { CtaBand, Icon, PageHero, Rich } from '../components/ui';

export default function About() {
  const { about: a, settings } = useContent();
  return (
    <>
      <PageHero hero={a.hero} crumb="Qui nous sommes" />

      <section className="bg-navy" data-screen-label="La fondatrice">
        <div className="founder">
          <span className="eyebrow" data-reveal="0">{a.eyebrow}</span>
          <h2 data-reveal="80"><Rich text={a.title} /></h2>
          <div className="founder-sig">
            <span><span className="serif">{a.founderName}</span><span className="label">{a.founderRole}</span></span>
          </div>
          <p className="founder-bio">{a.bio}</p>
        </div>
      </section>

      <section className="sec bg-sand on-light" data-screen-label="Les deux sociétés">
        <div className="wrap stack" style={{ gap: 'clamp(32px,4vw,56px)' }}>
          <div className="head-grid">
            <h2 className="h2" data-reveal="0"><Rich text={a.companiesTitle} /></h2>
            <p className="lead">{a.companiesIntro}</p>
          </div>
          <div className="companies">
            {a.companies.map((co, i) => (
              <div className="company" key={i} data-reveal={i * 110}>
                <span className="label">{co.city}</span>
                <h3>{co.name}</h3>
                <p>{co.text}</p>
                {!co.registered && <span className="company-pending"><Icon name="schedule" size={18} />Immatriculation en cours. Les mentions légales seront complétées dès son immatriculation.</span>}
              </div>
            ))}
          </div>
          <div className="agents" data-reveal="0">
            <Icon name="public" />
            <div className="stack" style={{ gap: 8 }}>
              <h3>{a.agentsTitle}</h3>
              <p>{a.agentsText}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sec-sm bg-white on-light" data-screen-label="Notre taille">
        <div className="wrap stack" style={{ gap: 'clamp(32px,4vw,52px)' }}>
          <h2 className="h2" data-reveal="0" style={{ maxWidth: 820 }}><Rich text={a.sizeTitle} /></h2>
          <div className="tiles tiles-360">
            {a.sizePoints.map((p, i) => (
              <div className="tile" key={i} data-reveal={(i % 3) * 110}>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
              </div>
            ))}
          </div>
          <p className="contact-line">
            <Icon name="mail" size={20} />
            <a href={`mailto:${settings.email}`}>{settings.email}</a>
          </p>
        </div>
      </section>

      <CtaBand context="qui nous sommes" />
    </>
  );
}
