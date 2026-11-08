import { useContent } from '../content/ContentProvider';
import { defaults } from '../content/defaults';
import { HashLink, HeroTitle, Rich } from '../components/ui';
import { ROMAN, whatsappHref } from '../lib/site';

const arr = <T,>(v: T[] | undefined, fallback: T[]): T[] => (Array.isArray(v) ? v : fallback);
const LOWER_ROMAN = ['i.', 'ii.', 'iii.', 'iv.', 'v.', 'vi.'];

export default function About() {
  const { site, qsn_hero: h, qsn_fondatrice: f, qsn_citation: q, qsn_bureaux: b, qsn_ports: p, qsn_taille: t, qsn_contact: ct } = useContent();
  const wa = whatsappHref(site.whatsapp);
  return (
    <>
      {/* Hero */}
      <section className="hero hero-about on-dark" data-screen-label="Qui sommes-nous">
        <img className="hero-img kb" src={h.image} alt="" fetchPriority="high" />
        <div className="hero-shade" />
        <div className="hero-in">
          <span className="eyebrow wide fade" style={{ animationDelay: '200ms' }}>{h.eyebrow}</span>
          <HeroTitle lines={arr(h.titleLines, defaults.qsn_hero.titleLines)} className="hero-title hero-title-about" />
          <div className="about-hero-grid">
            <p className="about-hero-text fade" style={{ animationDelay: '1100ms' }}>{h.text}</p>
            <p className="about-hero-statement fade" style={{ animationDelay: '1300ms' }}><Rich text={h.statement} /></p>
          </div>
        </div>
      </section>

      {/* I. La fondatrice */}
      <section className="sec sec-about" data-screen-label="La fondatrice">
        <div className="bio">
          <div className="bio-side">
            <div className="bio-photo"><img src={f.image} alt={f.imageAlt} loading="lazy" width={800} height={1000} /></div>
            <div className="bio-name">
              <span className="serif">{f.name}</span>
              <span className="eyebrow wide">{f.role}</span>
            </div>
          </div>
          <div className="bio-main">
            <span className="eyebrow wide" data-reveal="0">{f.eyebrow}</span>
            <p className="bio-lead" data-reveal="100">{f.lead}</p>
            <div className="employers" data-reveal="150">
              {arr(f.employers, []).map((e, i) => <span key={i}>{e.name}{e.note && <> <span className="employer-note">{e.note}</span></>}</span>)}
            </div>
            <div className="col bio-text" style={{ gap: 28 }}>
              {arr(f.paragraphs, []).map((x, i) => <p key={i} data-reveal="0">{x}</p>)}
            </div>
            <div className="specialties" data-reveal="0">
              {arr(f.specialties, []).map((s, i) => (
                <div key={i}><span className="spec-n">{LOWER_ROMAN[i]}</span><span className="spec-t">{s}</span></div>
              ))}
            </div>
            <p className="bio-text" data-reveal="0">{f.conclusion}</p>
          </div>
        </div>
      </section>

      {/* Citation */}
      <section className="sec sec-sand sec-about citation" data-screen-label="Citation">
        <div className="citation-in">
          <span className="rule-short" data-reveal="0" />
          <p className="citation-q" data-reveal="100"><Rich text={q.quote} /></p>
          <span className="eyebrow wide muted-label" data-reveal="200">{q.author}</span>
        </div>
      </section>

      {/* II. Deux bureaux */}
      <section className="sec sec-dark sec-about on-dark" data-screen-label="Deux bureaux">
        <div className="wrap col" style={{ gap: 'clamp(72px,8vw,120px)' }}>
          <div className="col" style={{ gap: 36 }}>
            <span className="eyebrow wide" data-reveal="0">{b.eyebrow}</span>
            <h2 className="h2 h2-xl" data-reveal="100"><Rich text={b.title} /></h2>
          </div>
          <div className="offices">
            {arr(b.offices, defaults.qsn_bureaux.offices).map((o, i) => (
              <div key={i} className="office" data-reveal={i * 150}>
                <span className="eyebrow wide">{o.tag}</span>
                <h3>{o.city}</h3>
                <p>{o.text}</p>
              </div>
            ))}
          </div>
          <div className="offices-foot" data-reveal="0">
            <p className="offices-statement">{b.statement}</p>
            <p className="offices-note">{b.note}</p>
          </div>
        </div>
      </section>

      {/* III. Gabon et Cameroun */}
      <section className="sec sec-about" data-screen-label="Gabon et Cameroun">
        <div className="wrap ports">
          <div className="ports-list col" style={{ gap: 36 }}>
            <span className="eyebrow wide" data-reveal="0">{p.eyebrow}</span>
            <div className="ports-rows">
              {arr(p.ports, defaults.qsn_ports.ports).map((x, i) => (
                <div key={i} className="port" data-reveal={i * 100}><span className="port-name">{x.name}</span><span className="eyebrow wide muted-label">{x.country}</span></div>
              ))}
            </div>
          </div>
          <div className="ports-copy col" style={{ gap: 24 }}>
            <p className="ports-statement" data-reveal="0">{p.statement}</p>
            <p className="muted lh185" data-reveal="100">{p.text}</p>
          </div>
        </div>
      </section>

      {/* IV. Notre taille */}
      <section className="sec sec-sand sec-about" data-screen-label="Notre taille">
        <div className="wrap split">
          <div className="split-side">
            <div className="sticky sticky-140 col" style={{ gap: 36 }}>
              <span className="eyebrow wide">{t.eyebrow}</span>
              <h2 className="h2 h2-taille">{t.title}</h2>
            </div>
          </div>
          <div className="split-main problems">
            {arr(t.points, defaults.qsn_taille.points).map((s, i) => (
              <article key={i} className="size-point" data-reveal={i * 100}>
                <span className="size-n">{ROMAN[i]}</span>
                <div className="col" style={{ gap: 14 }}>
                  <h3>{s.title}</h3>
                  <p>{s.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="sec sec-dark sec-about about-cta on-dark" data-screen-label="CTA">
        <img src={ct.image} alt="" loading="lazy" />
        <div className="about-cta-shade" />
        <div className="about-cta-in">
          <span className="eyebrow wide" data-reveal="0">{ct.eyebrow}</span>
          <h2 className="about-cta-title" data-reveal="100"><Rich text={ct.title} /></h2>
          <div className="about-cta-actions" data-reveal="200">
            <HashLink to="/#contact" className="btn btn-ivory">{site.ctaLabel}</HashLink>
            {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="link-wa">WhatsApp</a>}
          </div>
          <span className="about-cta-note" data-reveal="250">{ct.note}</span>
        </div>
      </section>
    </>
  );
}
