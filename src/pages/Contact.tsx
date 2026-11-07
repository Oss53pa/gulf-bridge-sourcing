import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useContent } from '../content/ContentProvider';
import { Icon, PageHero, ROUTES, etudeHref, whatsappHref } from '../components/ui';
import { track } from '../lib/analytics';

export default function Contact() {
  const { contact: c, settings: s } = useContent();
  const [open, setOpen] = useState(-1);
  const wa = whatsappHref(s.whatsapp, 'contact');

  return (
    <>
      <PageHero hero={c.hero} crumb="Contact" />

      <section className="sec bg-navy" data-screen-label="Coordonnées">
        <div className="wrap contact-grid">
          <div className="stack" style={{ gap: 28 }}>
            <span className="eyebrow" data-reveal="0">{c.eyebrow}</span>
            <div className="offices">
              <div>
                <span className="label">Guangzhou</span>
                <span>{s.addressGuangzhou}</span>
                <span>{s.phoneGuangzhou}</span>
                <span className="tz">UTC+8</span>
              </div>
              <div>
                <span className="label">Abidjan</span>
                <span>{s.addressAbidjan}</span>
                <span>{s.phoneAbidjan}</span>
                <span className="tz">UTC+0</span>
              </div>
              <div>
                <span className="label">E-mail</span>
                <a href={`mailto:${s.email}`}>{s.email}</a>
                <span>{s.website}</span>
              </div>
            </div>
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="wa-btn" onClick={() => track('whatsapp_click', { page: 'contact' })}>
                <Icon name="chat" />WhatsApp, {s.whatsappLabel}
              </a>
            )}
          </div>

          <div className="panel-outline" data-reveal="100">
            <h2>{c.ctaTitle}</h2>
            <p>{c.ctaText}</p>
            <Link to={etudeHref()} className="btn btn-gold">{c.ctaLabel}<Icon name="arrow_forward" size={20} /></Link>
            <span className="form-note">{s.responsePromise}</span>
          </div>
        </div>
      </section>

      <section className="sec bg-white on-light" data-screen-label="Questions fréquentes">
        <div className="wrap faq-grid">
          <h2 className="h2" data-reveal="0">{c.faqTitle}</h2>
          <div className="faq">
            {c.faq.map((f, i) => (
              <div className="faq-item" key={i}>
                <h3>
                  <button aria-expanded={open === i} aria-controls={`faq-${i}`} id={`faq-b-${i}`}
                    onClick={() => setOpen(o => (o === i ? -1 : i))}>
                    <span>{f.q}</span>
                    <Icon name={open === i ? 'remove' : 'add'} size={22} />
                  </button>
                </h3>
                <div id={`faq-${i}`} role="region" aria-labelledby={`faq-b-${i}`} hidden={open !== i}>
                  <p>{f.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec-sm bg-sand on-light" data-screen-label="Espace client">
        <div className="wrap" style={{ textAlign: 'center' }}>
          {s.clientPortalUrl
            ? <a href={s.clientPortalUrl} className="btn btn-navy" onClick={() => track('client_portal_click')}><Icon name="lock" size={20} />Espace client</a>
            : <p className="form-note">L'espace client ouvrira avec la mise en service du portail. Le lien figurera ici et dans le pied de page.</p>}
          <p style={{ marginTop: 16 }}><Link to={ROUTES.mentions} className="link-under">Mentions légales<Icon name="arrow_forward" /></Link></p>
        </div>
      </section>
    </>
  );
}
