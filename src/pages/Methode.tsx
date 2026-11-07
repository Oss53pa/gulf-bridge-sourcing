import { Link } from 'react-router-dom';
import { useContent } from '../content/ContentProvider';
import { CtaBand, Icon, PageHero, ReportPages, Rich, etudeHref, pad } from '../components/ui';
import { track } from '../lib/analytics';

export default function Methode() {
  const { methode: m, report } = useContent();
  return (
    <>
      <PageHero hero={m.hero} crumb="Méthode et garanties" />

      <section className="sec bg-navy" data-screen-label="Les sept étapes">
        <div className="wrap stack" style={{ gap: 'clamp(48px,6vw,80px)' }}>
          <div className="head-grid">
            <div className="stack" style={{ gap: 20 }}>
              <span className="eyebrow" data-reveal="0">{m.eyebrow}</span>
              <h2 className="h2" data-reveal="80"><Rich text={m.title} /></h2>
            </div>
            <div className="locks">
              {m.locks.map((l, i) => (
                <div className="lock" key={i}><span className="label">Verrou {i + 1}</span><span>{l}</span></div>
              ))}
            </div>
          </div>
          <div className="progress"><div data-progress="1" /></div>
          <div className="steps">
            {m.steps.map((s, i) => (
              <div className="step" key={i} data-reveal={(i % 3) * 110}>
                <span className="rule-line" />
                <span className="num">{pad(i)}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
                {s.rule && <span className="rule">{s.rule}</span>}
              </div>
            ))}
          </div>
          <p className="method-note">{m.note}</p>
        </div>
      </section>

      <section className="sec bg-sand on-light" data-screen-label="Les six engagements">
        <div className="wrap stack" style={{ gap: 'clamp(40px,5vw,64px)' }}>
          <div className="stack" style={{ gap: 20, maxWidth: 960 }}>
            <span className="eyebrow" data-reveal="0">{m.commitmentsEyebrow}</span>
            <h2 className="h2" data-reveal="80"><Rich text={m.commitmentsTitle} /></h2>
          </div>
          <div className="tiles tiles-360">
            {m.commitments.map((x, i) => (
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

      <section className="sec bg-white on-light" data-screen-label="Le rapport d'inspection">
        <div className="wrap report-block">
          <div className="stack" style={{ gap: 14 }} data-reveal="0">
            <div className="report-stage"><ReportPages /></div>
            <div className="report-captions">
              {report.captions.slice(0, 3).map((cap, i) => <span key={i}><i>{pad(i)}</i>{cap}</span>)}
            </div>
          </div>
          <div className="stack" style={{ gap: 24 }}>
            <span className="eyebrow" data-reveal="0">{report.eyebrow}</span>
            <h2 className="h2" style={{ fontSize: 'clamp(32px,3.6vw,52px)' }} data-reveal="80"><Rich text={report.title} /></h2>
            <p className="lead">{report.text}</p>
            <Link
              to={etudeHref({ service: 'Modèle de rapport' })}
              onClick={() => track('report_request')}
              className="btn btn-navy" style={{ alignSelf: 'flex-start' }}
            >
              <Icon name="mail" size={22} />{report.link}
            </Link>
          </div>
        </div>
      </section>

      <section className="sec-sm bg-sand on-light" data-screen-label="Conformité à l'arrivée">
        <div className="wrap head-grid">
          <h2 className="h2" data-reveal="0">{m.complianceTitle}</h2>
          <p className="lead">{m.complianceText}</p>
        </div>
      </section>

      <CtaBand context="méthode" />
    </>
  );
}
