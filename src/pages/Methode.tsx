import { Link } from 'react-router-dom';
import { useContent } from '../content/ContentProvider';
import { CtaBand, Icon, PageHero, ReportPages, Rich, ROUTES, pad } from '../components/ui';

export default function Methode() {
  const { methode: m, report } = useContent();
  return (
    <>
      <PageHero hero={m.hero} crumb="Méthode" />
      <section className="sec bg-navy" data-screen-label="Méthode">
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

      <section className="sec bg-white on-light" data-screen-label="Rapport">
        <div className="wrap report-block">
          <div className="stack" style={{ gap: 14 }} data-reveal="0">
            <div className="report-stage"><ReportPages /></div>
            <div className="report-captions">
              {report.captions.slice(0, 3).map((cap, i) => <span key={i}><i>{pad(i)}</i>{cap}</span>)}
            </div>
            <span style={{ padding: '0 16px', fontSize: 12, color: 'var(--muted)' }}>{m.reportCaption}</span>
          </div>
          <div className="stack" style={{ gap: 24 }}>
            <span className="eyebrow" data-reveal="0">{m.reportEyebrow}</span>
            <h2 className="h2" style={{ fontSize: 'clamp(32px,3.6vw,52px)', lineHeight: 1.02 }} data-reveal="80"><Rich text={m.reportTitle} /></h2>
            <p style={{ fontSize: 17.5, lineHeight: 1.65, color: 'var(--ink-2)' }}>{m.reportText}</p>
            <Link to={ROUTES.contact} state={{ service: 'Modèle de rapport' }} className="btn btn-navy" style={{ alignSelf: 'flex-start' }}>
              <Icon name="mail" size={22} />{m.reportButton}
            </Link>
          </div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
