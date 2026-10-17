import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../content/ContentProvider';
import { CtaBand, Icon, ReportPages, Rich, ROUTES, segments, pad, type PageKey } from '../components/ui';

function HeroTitle({ text }: { text: string }) {
  // Chaque mot apparaît à son tour, après l'intro.
  const words = segments(text).flatMap(s => s.t.split(/\s+/).filter(Boolean).map(w => ({ w, em: s.em })));
  return (
    <h1>
      {words.map((x, i) => (
        <Fragment key={i}>
          {i > 0 && ' '}
          <span data-reveal={1750 + i * 60}>{x.em ? <em className="hl">{x.w}</em> : x.w}</span>
        </Fragment>
      ))}
    </h1>
  );
}

export default function Home() {
  const c = useContent();
  const h = c.home_hero;
  const ms = h.milestones ?? [];
  return (
    <>
      <section className="home-hero" data-screen-label="Hero">
        <div className="cover kb-hero"><img src={h.image} alt="" /></div>
        <div className="shade" />
        <div className="home-hero-inner">
          <span className="eyebrow" data-reveal="0">{h.eyebrow}</span>
          <HeroTitle text={h.title} />
          <p className="home-hero-text" data-reveal="2450">{h.text}</p>
          <div data-reveal="2650" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to={ROUTES.contact} className="btn btn-gold">{c.settings.ctaLabel}<Icon name="arrow_forward" size={20} /></Link>
            <Link to={ROUTES.methode} className="btn btn-ghost">{h.ctaSecondary}</Link>
          </div>
          <span className="home-hero-note" data-reveal="2750">{h.note}</span>
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

      <section className="sec bg-white on-light" data-screen-label="Constat">
        <div className="wrap stack" style={{ gap: 'clamp(48px,6vw,80px)' }}>
          <div className="head-grid" style={{ gap: '32px 80px' }}>
            <h2 className="h2" data-reveal="80"><Rich text={c.home_constat.title} /></h2>
            <div className="stack" style={{ gap: 12 }}>
              <p className="lead">{c.home_constat.text}</p>
              {c.home_constat.footnotes.length > 0 && (
                <span className="footnotes">{c.home_constat.footnotes.map((f, i) => <span key={i}>{f}</span>)}</span>
              )}
            </div>
          </div>
          <div className="risks">
            {c.home_constat.risks.map((r, i) => (
              <div className="risk" key={i} data-reveal={(i % 3) * 110}>
                <span className="num">{pad(i)}</span>
                <h3>{r.title}</h3>
                <p>{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="audience" data-screen-label="Pour qui">
        {c.home_audience.items.map((a, i) => (
          <div className="audience-card" key={i}>
            <div className={`cover${i === 0 ? ' kb' : ''}`}><img src={a.image} alt="" loading="lazy" /></div>
            <div className="shade" />
            <div className="body" data-reveal="100">
              <h3>{a.title}</h3>
              <p>{a.text}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="founder-band bg-white on-light" data-screen-label="Fondatrice accueil">
        <div className="inner" data-reveal="0">
          <div className="quote">
            <p><Rich text={c.home_founder.quote} /></p>
            <span>{c.home_founder.author}</span>
          </div>
          <Link to={ROUTES.about} className="link-under">{c.home_founder.linkLabel}<Icon name="arrow_forward" /></Link>
        </div>
      </section>

      <section className="sec-sm bg-sand" data-screen-label="Jeune entreprise">
        <div className="wrap split">
          <div className="panel-navy" data-reveal="0">
            <span className="eyebrow">{c.home_startup.eyebrow}</span>
            <h2><Rich text={c.home_startup.title} /></h2>
            <div className="stack">
              {c.home_startup.points.map((p, i) => (
                <div className="point" key={i}><span className="serif">{p.title}</span><span>{p.text}</span></div>
              ))}
            </div>
          </div>
          <div className="panel-white on-light" data-reveal="120">
            <ReportPages />
            <div className="stack" style={{ gap: 6 }}>
              <span className="label">{c.home_startup.reportEyebrow}</span>
              <span className="serif" style={{ fontSize: 26, lineHeight: 1.15 }}>{c.home_startup.reportTitle}</span>
              <span style={{ fontSize: 15, lineHeight: 1.55, color: 'var(--ink-2)' }}>{c.home_startup.reportText}</span>
            </div>
            <Link to={ROUTES.contact} state={{ service: 'Modèle de rapport' }} className="link-under" style={{ alignSelf: 'flex-start', marginTop: 'auto' }}>
              {c.home_startup.reportLink}<Icon name="arrow_forward" />
            </Link>
          </div>
        </div>
      </section>

      <section className="positioning" data-screen-label="Positionnement">
        <div className="cover kb"><img src={c.home_positioning.image} alt="" loading="lazy" /></div>
        <div className="shade" />
        <div className="inner">
          <span className="bar" />
          <p className="big" data-reveal="100"><Rich text={c.home_positioning.title} /></p>
          <p data-reveal="200">{c.home_positioning.text}</p>
        </div>
      </section>

      <section className="sec-sm bg-white on-light" data-screen-label="Explorer">
        <div className="wrap stack" style={{ gap: 40 }}>
          <div className="stack" style={{ gap: 20 }}>
            <span className="eyebrow" data-reveal="0">{c.home_explore.eyebrow}</span>
            <h2 className="h2" data-reveal="80">{c.home_explore.title}</h2>
          </div>
          <div className="explore">
            {c.home_explore.cards.map((card, i) => (
              <Link key={i} to={ROUTES[(card.page as PageKey)] ?? ROUTES.home} className="explore-card" data-reveal={i * 100}>
                <Icon name={card.icon} />
                <span className="stack" style={{ gap: 10 }}>
                  <span className="serif">{card.title}</span>
                  <span className="sub">{card.text}</span>
                  <span className="go">Découvrir<Icon name="arrow_forward" /></span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
