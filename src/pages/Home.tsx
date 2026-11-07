import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../content/ContentProvider';
import { CtaBand, Icon, ReportPages, Rich, ROUTES, etudeHref, segments, pad } from '../components/ui';
import { track } from '../lib/analytics';

function HeroTitle({ text }: { text: string }) {
  // Chaque mot apparaît à son tour, après l'animation d'ouverture.
  const words: { w: string; em: boolean }[] = [];
  for (const seg of segments(text)) {
    for (const w of seg.t.split(/\s+/).filter(Boolean)) {
      // La ponctuation qui suit un accent reste collée au mot précédent.
      if (/^[,.;:!?)\u00BB\u2026]+$/.test(w) && words.length) words[words.length - 1].w += w;
      else words.push({ w, em: seg.em });
    }
  }
  return (
    <h1>
      {words.map((x, i) => (
        <Fragment key={i}>
          {i > 0 && ' '}
          <span data-reveal={950 + i * 30}>{x.em ? <em className="hl">{x.w}</em> : x.w}</span>
        </Fragment>
      ))}
    </h1>
  );
}

export default function Home() {
  const c = useContent();
  const h = c.home_hero;
  const ms = h.milestones ?? [];
  const specPaths: Record<string, string> = { equipement: ROUTES.equipement, industriel: ROUTES.industriel };

  return (
    <>
      {/* 1. En-tête */}
      <section className="home-hero" data-screen-label="En-tête">
        <div className="cover kb-hero"><img src={h.image} alt="" /></div>
        <div className="shade" />
        <div className="home-hero-inner">
          <span className="eyebrow" data-reveal="0">{h.eyebrow}</span>
          <HeroTitle text={h.title} />
          <p className="home-hero-text" data-reveal="1180">{h.text}</p>
          <div data-reveal="1260" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to={etudeHref()} className="btn btn-gold">{c.settings.ctaLabel}<Icon name="arrow_forward" size={20} /></Link>
            <Link to={ROUTES.methode} className="btn btn-ghost">{h.ctaSecondary}</Link>
          </div>
          <span className="home-hero-note" data-reveal="1320">{h.note}</span>
        </div>
        <div className="scroll-hint" aria-hidden="true"><span>Défiler</span><Icon name="south" className="float" /></div>
        <div className="route">
          <div className="route-grid">
            <div className="route-end">
              <Icon name="factory" />
              <div className="stack" style={{ gap: 2 }}><span className="label">{h.fromLabel}</span><span className="serif">{h.fromCity}</span></div>
            </div>
            <div className="route-line" aria-hidden="true">
              <span className="route-dot pulse" />
              <div className="route-track">
                <span className="route-dash" />
                {ms.map((m, i) => {
                  const left = `${Math.round(((i + 1) / (ms.length + 1)) * 100)}%`;
                  return (
                    <span key={i}>
                      <span className="route-tick" style={{ left }} />
                      <span className="route-tick-label" style={{ left }}>{m}</span>
                    </span>
                  );
                })}
                <span className="trail" />
                <span className="sail"><span><Icon name="directions_boat" className="bob" /></span></span>
              </div>
              <span className="route-dot pulse" />
            </div>
            <div className="route-end right">
              <div className="stack" style={{ gap: 2 }}><span className="label">{h.toLabel}</span><span className="serif">{h.toCity}</span></div>
              <Icon name="anchor" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Les six problèmes */}
      <section className="sec bg-white on-light" data-screen-label="Les six problèmes">
        <div className="wrap stack" style={{ gap: 'clamp(48px,6vw,80px)' }}>
          <div className="stack" style={{ gap: 20, maxWidth: 960 }}>
            <span className="eyebrow" data-reveal="0">{c.home_problems.eyebrow}</span>
            <h2 className="h2" data-reveal="80"><Rich text={c.home_problems.title} /></h2>
          </div>
          <div className="problems">
            {c.home_problems.items.map((p, i) => (
              <div className="problem" key={i} data-reveal={(i % 3) * 110}>
                <span className="num">{pad(i)}</span>
                <blockquote>{p.problem}</blockquote>
                <p><span className="label">Ce que nous faisons</span>{p.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Les deux spécialités */}
      <section className="specialties" data-screen-label="Les deux spécialités">
        {c.home_specialties.items.map((s, i) => (
          <article className="specialty-card" key={i}>
            <div className={`cover${i === 0 ? ' kb' : ''}`}><img src={s.image} alt="" loading="lazy" /></div>
            <div className="shade" />
            <div className="body" data-reveal="100">
              <span className="label">{s.geo}</span>
              <h3>{s.title}</h3>
              <p>{s.clients}</p>
              <p className="offer"><Icon name="sell" size={18} />{s.offer}</p>
              <Link to={specPaths[s.page] ?? ROUTES.home} className="link-under on-dark">{s.link}<Icon name="arrow_forward" /></Link>
            </div>
          </article>
        ))}
      </section>

      {/* 4. Les deux verrous */}
      <section className="sec-sm bg-navy" data-screen-label="Les deux verrous">
        <div className="wrap head-grid">
          <h2 className="h2" data-reveal="0"><Rich text={c.home_locks.title} /></h2>
          <div className="locks">
            {c.home_locks.locks.map((l, i) => (
              <div className="lock" key={i} data-reveal={i * 110}>
                <span className="label">Verrou {i + 1}</span><span>{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. La preuve */}
      <section className="sec bg-white on-light" data-screen-label="Le rapport d'inspection">
        <div className="wrap report-block">
          <div className="stack" style={{ gap: 14 }} data-reveal="0">
            <div className="report-stage"><ReportPages /></div>
            <div className="report-captions">
              {c.report.captions.slice(0, 3).map((cap, i) => <span key={i}><i>{pad(i)}</i>{cap}</span>)}
            </div>
          </div>
          <div className="stack" style={{ gap: 24 }}>
            <span className="eyebrow" data-reveal="0">{c.report.eyebrow}</span>
            <h2 className="h2" style={{ fontSize: 'clamp(32px,3.6vw,52px)' }} data-reveal="80"><Rich text={c.report.title} /></h2>
            <p className="lead">{c.report.text}</p>
            <Link
              to={etudeHref({ service: 'Modèle de rapport' })}
              onClick={() => track('report_request')}
              className="btn btn-navy" style={{ alignSelf: 'flex-start' }}
            >
              <Icon name="mail" size={22} />{c.report.link}
            </Link>
          </div>
        </div>
      </section>

      {/* 6. La fondatrice */}
      <section className="founder-band bg-sand on-light" data-screen-label="Citation de la fondatrice">
        <div className="inner" data-reveal="0">
          <div className="quote">
            <p><Rich text={c.home_founder.quote} /></p>
            <span>{c.home_founder.author}</span>
          </div>
          <Link to={ROUTES.about} className="link-under">{c.home_founder.linkLabel}<Icon name="arrow_forward" /></Link>
        </div>
      </section>

      {/* 7. Un premier pas sans risque */}
      <section className="sec-sm bg-navy" data-screen-label="Premier pas">
        <div className="wrap split-2">
          <div className="stack" style={{ gap: 20 }}>
            <span className="eyebrow" data-reveal="0">{c.home_firststep.eyebrow}</span>
            <h2 className="h2" data-reveal="80"><Rich text={c.home_firststep.title} /></h2>
          </div>
          <div className="stack" style={{ gap: 24 }} data-reveal="120">
            <p>{c.home_firststep.text}</p>
            <p className="deduction"><Icon name="percent" size={20} />{c.home_firststep.deduction}</p>
            <Link to={etudeHref({ service: 'Vérification de fournisseur' })} className="btn btn-gold" style={{ alignSelf: 'flex-start' }}>
              {c.home_firststep.cta}<Icon name="arrow_forward" size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Autres secteurs */}
      <section className="others-line bg-white on-light" data-screen-label="Autres secteurs">
        <div className="wrap inner">
          <p>{c.home_others.text}</p>
          <Link to={ROUTES.autres} className="link-under">{c.home_others.link}<Icon name="arrow_forward" /></Link>
        </div>
      </section>

      {/* 9. Appel final */}
      <CtaBand context="accueil" />
    </>
  );
}
