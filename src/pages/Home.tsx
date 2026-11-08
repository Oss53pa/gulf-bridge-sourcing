import { useEffect, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../content/ContentProvider';
import { defaults, type Audience, type AudienceContent, type ServiceKey } from '../content/defaults';
import { HashLink, HeroTitle, Rich } from '../components/ui';
import { ROMAN, ROUTES, pad, scrollToId, telHref, whatsappHref } from '../lib/site';
import ContactForm from '../components/ContactForm';
import { submitReportRequest } from '../lib/atlas';

const arr = <T,>(v: T[] | undefined, fallback: T[]): T[] => (Array.isArray(v) ? v : fallback);

function ReportForm() {
  const { accueil_rapport: r } = useContent();
  const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = String(new FormData(e.currentTarget).get('email') ?? '').trim();
    setState('sending');
    setError('');
    try { await submitReportRequest(email); setState('sent'); }
    catch (err) { setError(err instanceof Error ? err.message : "L'envoi a échoué."); setState('idle'); }
  };
  if (state === 'sent') return <div className="report-sent" role="status">{r.thanks}</div>;
  return (
    <form className="report-form" onSubmit={onSubmit}>
      <label htmlFor="rapport-email">{r.formLabel}</label>
      <div className="report-row">
        <input id="rapport-email" type="email" name="email" required maxLength={254} autoComplete="email" placeholder={r.placeholder} />
        <button type="submit" className="btn btn-ink" disabled={state === 'sending'}>{state === 'sending' ? r.sending : r.submit}</button>
      </div>
      {error && <span className="field-error dark" role="alert">{error}</span>}
      <span className="report-note">{r.privacyNote} <HashLink to={`${ROUTES.legal}#confidentialite`} className="link-u">{r.privacyLink}</HashLink></span>
    </form>
  );
}

export default function Home() {
  const c = useContent();
  const { site, accueil_hero: h, accueil_profil: pf, accueil_enjeux: en, accueil_methode: m, accueil_services: sv,
    accueil_produits: pr, accueil_rapport: rp, accueil_confiance: cf, accueil_fondatrice: fd, accueil_contact: ct } = c;

  const initial: Audience = site.defaultAudience === 'site' ? 'site' : 'ouverture';
  const [aud, setAud] = useState<Audience>(initial);
  const [showAll, setShowAll] = useState(false);
  const [service, setService] = useState<ServiceKey | string>('sourcing');
  const [sector, setSector] = useState<string>(initial);
  const [changed, setChanged] = useState(0); // relance l'apparition en fondu après un changement de profil

  // Valeur par défaut modifiée dans la console après le chargement.
  useEffect(() => { setAud(initial); setSector(initial); }, [initial]);

  const profile: AudienceContent = { ...defaults.accueil_profils[aud], ...(c.accueil_profils[aud] ?? {}) };
  const problems = arr(profile.problems, defaults.accueil_profils[aud].problems);
  const catalog = arr(profile.catalog, defaults.accueil_profils[aud].catalog);
  const visible = showAll ? catalog : catalog.slice(0, pr.visibleRows || 6);
  const wa = whatsappHref(site.whatsapp);

  const choose = (k: Audience) => {
    if (k !== aud) { setAud(k); setSector(k); setShowAll(false); setChanged(n => n + 1); }
    window.setTimeout(() => {
      if (window.location.hash !== '#enjeux') window.history.pushState(window.history.state, '', '#enjeux');
      scrollToId('enjeux');
    }, 60);
  };

  const profileLine = (
    <div className="profile-line">
      <span>{en.profileLabel}</span><strong>{profile.label}</strong><a href="#profil">{en.changeLabel}</a>
    </div>
  );

  return (
    <>
      {/* Hero */}
      <section className="hero on-dark" data-screen-label="Hero">
        <img className="hero-img kb" src={h.image} alt="" fetchPriority="high" />
        <div className="hero-shade" />
        <div className="hero-in">
          <span className="eyebrow fade" style={{ animationDelay: '150ms' }}>{h.eyebrow}</span>
          <HeroTitle lines={arr(h.titleLines, defaults.accueil_hero.titleLines)} className="hero-title" />
          <div className="hero-row">
            <div className="hero-copy fade" style={{ animationDelay: '1000ms' }}>
              <p>{h.text}</p>
              <div className="btn-row">
                <HashLink to="/#contact" className="btn btn-ivory">{site.ctaLabel}</HashLink>
                {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-outline">WhatsApp</a>}
              </div>
              <span className="hero-note">{h.note}</span>
            </div>
            <div className="hero-guarantee fade" style={{ animationDelay: '1250ms' }}>
              <span className="eyebrow">{h.guaranteeLabel}</span>
              <p>{h.guarantee}</p>
            </div>
          </div>
        </div>
        <div className="hero-band">
          <div className="route fade" style={{ animationDelay: '1600ms' }}>
            <div className="route-end">
              <span className="route-label">{h.routeFromLabel}</span>
              <span className="route-city">{h.routeFrom}</span>
            </div>
            <div className="route-track" aria-hidden="true">
              <span className="route-dash" />
              <span className="route-line" />
              <span className="route-cap" />
              <span className="route-cap end" />
              {arr(h.routeMilestones, []).map((ms, i, all) => {
                const left = `${Math.round(((i + 1) / (all.length + 1)) * 100)}%`;
                return (
                  <span key={i}>
                    <span className="route-tick" style={{ left }} />
                    <span className="route-tick-label" style={{ left }}>{ms}</span>
                  </span>
                );
              })}
              <span className="route-run"><span className="route-dot"><span /></span></span>
            </div>
            <div className="route-end">
              <span className="route-label">{h.routeToLabel}</span>
              <span className="route-city">{h.routeTo}</span>
            </div>
          </div>
        </div>
      </section>

      {/* I. Profil */}
      <section id="profil" className="sec profil" data-screen-label="Profil">
        <div className="wrap col" style={{ gap: 'clamp(36px,4vw,56px)' }}>
          <div className="head-row">
            <div className="col" style={{ gap: 22 }}>
              <span className="eyebrow" data-reveal="0">{pf.eyebrow}</span>
              <h2 className="h2 h2-profil" data-reveal="80">{pf.title}</h2>
            </div>
            <p className="head-aside" data-reveal="150">{pf.text}</p>
          </div>
          <div className="profil-grid">
            {arr(pf.cards, defaults.accueil_profil.cards).map(card => {
              const on = card.key === aud;
              return (
                <button key={card.key} type="button" className={`profil-card${on ? ' on' : ''}`} aria-pressed={on} onClick={() => choose(card.key)}>
                  <img src={card.image} alt="" loading="lazy" />
                  <span className="profil-shade" />
                  <span className="profil-ring" />
                  <span className="profil-body">
                    <span className="eyebrow">{card.tag}</span>
                    <span className="profil-title">{card.title}</span>
                    <span className="profil-text">{card.text}</span>
                    <span className="profil-chip">{on ? pf.selectedLabel : pf.chooseLabel}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* II. Enjeux */}
      <section id="enjeux" className="sec sec-sand" data-screen-label="Enjeux">
        <div className="wrap split">
          <div className="split-side">
            <div className="sticky col" style={{ gap: 32 }}>
              <span className="eyebrow">{en.eyebrowPrefix}{profile.eyebrow}</span>
              <h2 className="h2 h2-split">{profile.title}</h2>
              {profileLine}
              <p className="context">{en.context}</p>
              <div className="footnotes">{arr(en.footnotes, []).map((f, i) => <span key={i}>{f}</span>)}</div>
            </div>
          </div>
          <div className="split-main problems">
            {problems.map((p, i) => (
              <article key={`${aud}-${changed}-${i}`} className={`problem${changed ? ' swap' : ''}`} style={changed ? { animationDelay: `${i * 80}ms` } : undefined}>
                <span className="problem-n">{ROMAN[i]}</span>
                <div className="col" style={{ gap: 20 }}>
                  <h3 className="problem-q">« {p.q} »</h3>
                  <div className="problem-grid">
                    <p className="muted">{p.pain}</p>
                    <div className="answer">
                      <span className="eyebrow tight">{en.answerLabel}</span>
                      <p>{p.answer}</p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* III. Méthode */}
      <section id="methode" className="sec sec-dark on-dark" data-screen-label="Méthode">
        <div className="wrap col" style={{ gap: 'clamp(64px,7vw,112px)' }}>
          <div className="head-row" style={{ gap: '40px clamp(40px,6vw,120px)' }}>
            <div className="col" style={{ gap: 28, maxWidth: 760 }}>
              <span className="eyebrow" data-reveal="0">{m.eyebrow}</span>
              <h2 className="h2 h2-xl" data-reveal="80"><Rich text={m.title} /></h2>
              <p className="lead-dark" data-reveal="150">{m.text}</p>
            </div>
            <div className="locks" data-reveal="200">
              {arr(m.locks, []).map((l, i) => (
                <div className="lock" key={i}><span className="eyebrow">Verrou {i + 1}</span><span className="lock-text">{l}</span></div>
              ))}
            </div>
          </div>
          <div className="col">
            <div className="progress" aria-hidden="true"><div data-progress="" /></div>
            <ol className="steps">
              {arr(m.steps, defaults.accueil_methode.steps).map((s, i) => (
                <li key={i} data-reveal={i * 90}>
                  <span className="eyebrow">{m.stepLabel} {pad(i)}</span>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                  {s.rule && <span className="step-rule">{s.rule}</span>}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* IV. Services */}
      <section id="services" className="sec" data-screen-label="Services">
        <div className="wrap col" style={{ gap: 'clamp(56px,6vw,96px)' }}>
          <div className="head-row" style={{ gap: '32px 80px' }}>
            <div className="col" style={{ gap: 28 }}>
              <span className="eyebrow" data-reveal="0">{sv.eyebrow}</span>
              <h2 className="h2 h2-services" data-reveal="80"><Rich text={sv.title} /></h2>
            </div>
            <p className="head-aside" data-reveal="150"><Rich text={sv.text} /></p>
          </div>
          <div className="cols3">
            {arr(sv.items, defaults.accueil_services.items).map((s, i) => (
              <article key={i} className="col3" data-reveal={i * 120}>
                <span className="big-n">{pad(i)}</span>
                <h3 className="h3">{s.title}</h3>
                <p className="muted">{s.text}</p>
                <div className="deliverable">
                  <span className="eyebrow tight">{sv.deliverableLabel}</span>
                  <span>{s.deliverable}</span>
                </div>
                <HashLink to="/#contact" className="link-action" onClick={() => setService(s.key)}>{sv.linkLabel}</HashLink>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* V. Produits */}
      <section id="produits" className="sec sec-sand" data-screen-label="Produits">
        <div className="wrap split">
          <div className="split-side">
            <div className="sticky col" style={{ gap: 32 }}>
              <span className="eyebrow">{pr.eyebrowPrefix}{profile.catLabel}</span>
              <h2 className="h2 h2-split">{pr.title}</h2>
              {profileLine}
              <p className="disclaimer">{pr.disclaimer}</p>
            </div>
          </div>
          <div className="split-main col" style={{ gap: 28 }}>
            <div className="catalog">
              {visible.map((p, i) => (
                <div key={`${aud}-${changed}-${i}`} className={`cat-row${changed ? ' swap-fade' : ''}`} style={changed ? { animationDelay: `${i * 40}ms` } : undefined}>
                  <span className="cat-name">{p.cat}</span>
                  <div className="cat-detail">
                    {p.brands && <span className="cat-brands">{p.brands}</span>}
                    {p.note && <span className="cat-note">{p.note}</span>}
                  </div>
                </div>
              ))}
            </div>
            {catalog.length > (pr.visibleRows || 6) && (
              <button type="button" className="btn-line" aria-expanded={showAll} onClick={() => setShowAll(v => !v)}>
                {showAll ? pr.showLessLabel : pr.showAllLabel.replace('{n}', String(catalog.length))}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* VI. Rapport */}
      <section id="rapport" className="sec" data-screen-label="Rapport">
        <div className="wrap rapport">
          <div className="fan" data-fan-wrap="">
            <div className="fan-grid">
              {arr(rp.pages, defaults.accueil_rapport.pages).slice(0, 3).map((pg, i) => (
                <figure key={i} className={`fan-${i}`}>
                  <div className="sheet"><img src={pg.image} alt={pg.caption} loading="lazy" width={1055} height={1491} /></div>
                  <figcaption>{pg.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
          <div className="rapport-copy col" style={{ gap: 28 }}>
            <span className="eyebrow" data-reveal="0">{rp.eyebrow}</span>
            <h2 className="h2 h2-rapport" data-reveal="80">{rp.title}</h2>
            <p className="muted lh175" data-reveal="150">{rp.text}</p>
            <ReportForm />
          </div>
        </div>
      </section>

      {/* VII. Premier dossier */}
      <section id="confiance" className="sec" data-screen-label="Premier dossier">
        <div className="wrap col" style={{ gap: 'clamp(56px,6vw,96px)' }}>
          <div className="head-row" style={{ gap: '28px 80px' }}>
            <div className="col" style={{ gap: 28, maxWidth: 820 }}>
              <span className="eyebrow" data-reveal="0">{cf.eyebrow}</span>
              <h2 className="h2 h2-confiance" data-reveal="80">{cf.title}</h2>
            </div>
            <p className="head-aside" data-reveal="150">{cf.text}</p>
          </div>
          <div className="cols3">
            {arr(cf.commitments, defaults.accueil_confiance.commitments).map((x, i) => (
              <article key={i} className="col3 col3-tight" data-reveal={i * 120}>
                <span className="eyebrow tight">{x.tag}</span>
                <h3 className="h3 h3-sm">{x.title}</h3>
                {x.text && <p className="muted">{x.text}</p>}
                {arr(x.list, []).length > 0 && <ul className="bullets">{x.list.map((li, j) => <li key={j}>{li}</li>)}</ul>}
              </article>
            ))}
          </div>
          <div className="col" style={{ gap: 28 }}>
            <div className="cases-head">
              <h3 className="h3 h3-cases" data-reveal="0">{cf.casesTitle}</h3>
              <span className="disclaimer" data-reveal="80">{cf.casesDisclaimer}</span>
            </div>
            <div className="cases">
              {arr(cf.cases, defaults.accueil_confiance.cases).map((x, i) => (
                <article key={i} className="case" data-reveal={i * 120}>
                  <span className="eyebrow tight">{x.tag}</span>
                  <h4>{x.title}</h4>
                  <p><strong>{cf.stakeLabel} </strong>{x.stake}</p>
                  <p><strong>{cf.answerLabel} </strong>{x.answer}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VIII. Fondatrice */}
      <section id="fondatrice" className="sec sec-sand founder-sec" data-screen-label="Fondatrice">
        <div className="founder">
          <div className="founder-photo" data-reveal="0"><img src={fd.image} alt={fd.imageAlt} loading="lazy" width={800} height={1000} /></div>
          <div className="founder-copy col" style={{ gap: 28 }}>
            <span className="eyebrow" data-reveal="0">{fd.eyebrow}</span>
            <p className="founder-quote" data-reveal="80"><Rich text={fd.quote} /></p>
            <div className="col" style={{ gap: 10, maxWidth: 640 }} data-reveal="150">
              <span className="founder-name">{fd.name}</span>
              <p className="muted">{fd.bio}</p>
            </div>
            <Link to={ROUTES.about} className="link-action" data-reveal="200">{fd.linkLabel}</Link>
          </div>
        </div>
      </section>

      {/* IX. Contact */}
      <section id="contact" className="sec sec-dark on-dark" data-screen-label="Contact">
        <div className="wrap contact">
          <div className="contact-side col" style={{ gap: 32 }}>
            <span className="eyebrow" data-reveal="0">{ct.eyebrow}</span>
            <h2 className="h2 h2-contact" data-reveal="80"><Rich text={ct.title} /></h2>
            <p className="lead-dark" data-reveal="150">{ct.text}</p>
            <div className="contact-list" data-reveal="200">
              {wa && <a href={wa} target="_blank" rel="noopener noreferrer"><span className="eyebrow">{ct.whatsappLabel}</span><span>{site.whatsapp}</span></a>}
              {telHref(site.phone) && <a href={telHref(site.phone)}><span className="eyebrow">{ct.phoneLabel}</span><span>{site.phone}</span></a>}
              <a href={`mailto:${site.email}`} className="wrap-row"><span className="eyebrow">{ct.emailLabel}</span><span>{site.email}</span></a>
            </div>
          </div>
          <div className="contact-main">
            <ContactForm sector={sector} onSector={setSector} service={service} onService={setService} />
          </div>
        </div>
      </section>
    </>
  );
}
