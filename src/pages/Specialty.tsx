import { Link } from 'react-router-dom';
import { useContent } from '../content/ContentProvider';
import { BrandNotice, CtaBand, Icon, PageHero, etudeHref, pad } from '../components/ui';
import { BRAND_NOTICE, type Family } from '../content/defaults';

/** Familles de produits et marques. Rien n'est affiché tant que la console est vide. */
function Families({ title, note, families }: { title: string; note: string; families: Family[] }) {
  return (
    <section className="sec-sm bg-white on-light" data-screen-label="Ce que nous fournissons">
      <div className="wrap stack" style={{ gap: 'clamp(32px,4vw,56px)' }}>
        <h2 className="h2" data-reveal="0">{title}</h2>
        {families.length === 0 ? (
          <p className="lead content-pending">{note}</p>
        ) : (
          <>
            <div className="families">
              {families.map((f, i) => (
                <div className="family" key={i} data-reveal={(i % 3) * 90}>
                  <h3>{f.title}</h3>
                  <p>{f.items}</p>
                  {f.brands && <p className="brands"><span className="label">Marques</span>{f.brands}</p>}
                </div>
              ))}
            </div>
            <BrandNotice text={BRAND_NOTICE} />
          </>
        )}
      </div>
    </section>
  );
}

export default function Specialty({ kind }: { kind: 'equipement' | 'industriel' }) {
  const c = useContent();
  const s = kind === 'equipement' ? c.equipement : c.industriel;
  const crumb = kind === 'equipement' ? 'Équiper votre site' : 'Sites industriels';
  const specialty = kind === 'equipement' ? c.etude.specialtyOptions[0] : c.etude.specialtyOptions[1];

  return (
    <>
      <PageHero hero={s.hero} crumb={crumb} />

      <section className="sec bg-sand on-light" data-screen-label="Votre problème">
        <div className="wrap head-grid">
          <h2 className="h2" data-reveal="0">{s.problemTitle}</h2>
          <p className="lead">{s.problemText}</p>
        </div>
      </section>

      <section className="sec bg-navy" data-screen-label="Notre solution">
        <div className="wrap stack" style={{ gap: 'clamp(40px,5vw,64px)' }}>
          <h2 className="h2" data-reveal="0">{s.solutionTitle}</h2>
          <div className="solution-steps">
            {s.solutionSteps.map((x, i) => (
              <div className="solution-step" key={i} data-reveal={(i % 3) * 110}>
                <span className="num">{pad(i)}</span>
                <h3>{x.title}</h3>
                <p>{x.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec-sm bg-sand on-light" data-screen-label="Rémunération">
        <div className="wrap head-grid">
          <h2 className="h2" data-reveal="0">{s.pricingTitle}</h2>
          <p className="lead">{s.pricingText}</p>
        </div>
      </section>

      <Families title={s.familiesTitle} note={s.familiesNote} families={s.families} />

      {kind === 'equipement' && 'exampleTitle' in s && (
        <>
          <section className="sec-sm bg-sand on-light" data-screen-label="Exemple de mission">
            <div className="wrap example" data-reveal="0">
              <Icon name="lightbulb" />
              <div className="stack" style={{ gap: 10 }}>
                <span className="label">{s.exampleTitle}</span>
                <p>{s.exampleText}</p>
              </div>
            </div>
          </section>
          <section className="sec-sm bg-white on-light" data-screen-label="Étapes d'un projet">
            <div className="wrap stack" style={{ gap: 'clamp(28px,3vw,44px)' }}>
              <h2 className="h2" data-reveal="0">{s.stepsTitle}</h2>
              <ol className="ordered-steps">
                {s.steps.map((step, i) => (
                  <li key={i} data-reveal={(i % 4) * 80}><span>{pad(i)}</span>{step}</li>
                ))}
              </ol>
            </div>
          </section>
        </>
      )}

      {kind === 'industriel' && 'complianceTitle' in s && (
        <section className="sec-sm bg-sand on-light" data-screen-label="Donneurs d'ordre">
          <div className="wrap callout" data-reveal="0">
            <Icon name="verified_user" />
            <div className="stack" style={{ gap: 10 }}>
              <h2>{s.complianceTitle}</h2>
              <p>{s.complianceText}</p>
            </div>
          </div>
        </section>
      )}

      <section className="sec-sm bg-white on-light" data-screen-label="Appel à l'action">
        <div className="wrap" style={{ textAlign: 'center' }}>
          <Link to={etudeHref({ specialty })} className="btn btn-navy" data-reveal="0">
            {s.cta}<Icon name="arrow_forward" size={20} />
          </Link>
        </div>
      </section>

      <CtaBand context={crumb} />
    </>
  );
}
