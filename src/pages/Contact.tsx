import { useState, type FormEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useContent } from '../content/ContentProvider';
import { Icon, Rich, ROUTES, whatsappHref } from '../components/ui';
import { submitLead } from '../lib/atlas';

export default function Contact() {
  const { contact: c, settings: s } = useContent();
  const location = useLocation();
  const preset = (location.state as { service?: string } | null)?.service ?? '';
  const [open, setOpen] = useState(0);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');
  const wa = whatsappHref(s.whatsapp);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    if (f.get('website')) { setStatus('sent'); return; } // pot de miel anti-robots
    const get = (k: string) => String(f.get(k) ?? '').trim();
    setStatus('sending');
    setError('');
    try {
      await submitLead({
        name: get('name'), company: get('company'), email: get('email'), phone: get('phone'),
        service: get('service') || preset, message: get('message'), page: 'contact',
      });
      setStatus('sent');
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus('idle');
    }
  };

  return (
    <>
      <section className="contact bg-navy" data-screen-label="Contact">
        <div className="wrap contact-grid">
          <div className="stack" style={{ gap: 28 }}>
            <span className="eyebrow" data-reveal="0">{c.eyebrow}</span>
            <h1 data-reveal="80"><Rich text={c.title} /></h1>
            <p className="contact-intro">{c.text}</p>
            {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="wa-btn"><Icon name="chat" />WhatsApp · {s.whatsappLabel}</a>}
            <div className="offices">
              <div><span className="label">Guangzhou</span><span>{s.addressGuangzhou}</span><span>{s.phoneGuangzhou}</span></div>
              <div><span className="label">Abidjan</span><span>{s.addressAbidjan}</span><span>{s.phoneAbidjan}</span></div>
              <div><span className="label">E-mail · Web</span><a href={`mailto:${s.email}`} style={{ color: 'inherit' }}>{s.email}</a><span>{s.website}</span></div>
            </div>
          </div>

          {status === 'sent' ? (
            <div className="thanks" role="status">
              <span className="serif">{c.thanksTitle}</span>
              <span>{c.thanksText}</span>
            </div>
          ) : (
            <form className="form" data-reveal="100" onSubmit={onSubmit} style={{ position: 'relative' }}>
              <label className="sr-only" htmlFor="f-name">{c.placeholderName}</label>
              <input id="f-name" name="name" required minLength={2} maxLength={200} autoComplete="name" placeholder={c.placeholderName} />
              <label className="sr-only" htmlFor="f-company">{c.placeholderCompany}</label>
              <input id="f-company" name="company" required maxLength={200} autoComplete="organization" placeholder={c.placeholderCompany} />
              <label className="sr-only" htmlFor="f-email">{c.placeholderEmail}</label>
              <input id="f-email" name="email" type="email" required maxLength={254} autoComplete="email" placeholder={c.placeholderEmail} />
              <label className="sr-only" htmlFor="f-phone">{c.placeholderPhone}</label>
              <input id="f-phone" name="phone" type="tel" required maxLength={50} autoComplete="tel" placeholder={c.placeholderPhone} />
              <label className="sr-only" htmlFor="f-service">{c.placeholderService}</label>
              <select id="f-service" name="service" defaultValue={c.serviceOptions.includes(preset) ? preset : ''}>
                <option value="">{c.placeholderService}</option>
                {c.serviceOptions.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
              <label className="sr-only" htmlFor="f-message">{c.placeholderMessage}</label>
              <textarea id="f-message" name="message" required rows={4} maxLength={5000} placeholder={c.placeholderMessage} />
              <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
              <label className="consent">
                <input type="checkbox" required />
                <span>{c.consent} <Link to={ROUTES.privacy} style={{ color: 'var(--gold-dark)' }}>Lire la politique</Link></span>
              </label>
              {error && <div className="form-error" role="alert">{error}</div>}
              <button type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Envoi…' : c.submit}</button>
            </form>
          )}
        </div>
      </section>

      <section className="sec bg-white" data-screen-label="FAQ">
        <div className="wrap faq-grid">
          <h2 data-reveal="80">{c.faqTitle}</h2>
          <div className="faq">
            {c.faq.map((f, i) => (
              <div className="faq-item" key={i}>
                <button aria-expanded={open === i} onClick={() => setOpen(o => (o === i ? -1 : i))}>
                  <span>{f.q}</span><span aria-hidden="true">{open === i ? '−' : '+'}</span>
                </button>
                {open === i && <p>{f.a}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
