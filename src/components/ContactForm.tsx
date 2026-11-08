import { useState, type FormEvent, type ReactNode } from 'react';
import { useContent } from '../content/ContentProvider';
import { HashLink } from './ui';
import { ROUTES, whatsappHref } from '../lib/site';
import { submitLead } from '../lib/atlas';

type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

/** Limites côté client, alignées sur la RPC (message ≤ 5000 caractères au total). */
const MAX = { name: 200, role: 120, company: 200, email: 254, whatsapp: 50, project: 3000, supplier: 300, source: 200 };

/** Champ avec libellé et message d'erreur. Défini hors du formulaire pour que React ne le remonte pas à chaque rendu. */
function F({ label, required, wide, children, name, error }: { label: string; required?: boolean; wide?: boolean; children: ReactNode; name: string; error?: string }) {
  return (
    <div className={`field${wide ? ' wide' : ''}`}>
      <label htmlFor={`f-${name}`}>{label}{required && <span aria-hidden="true"> *</span>}</label>
      {children}
      {error && <span className="field-error" id={`err-${name}`}>{error}</span>}
    </div>
  );
}

interface Props {
  sector: string;
  onSector: (v: string) => void;
  service: string;
  onService: (v: string) => void;
}

export default function ContactForm({ sector, onSector, service, onService }: Props) {
  const { accueil_contact: c, site } = useContent();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [failure, setFailure] = useState('');
  const wa = whatsappHref(site.whatsapp);

  const messageFor = (el: Field) => {
    const v = el.validity;
    if (v.valueMissing) return c.errorRequired;
    if (v.typeMismatch && el.type === 'email') return c.errorEmail;
    if (v.tooLong) return c.errorTooLong;
    if (v.tooShort) return c.errorRequired;
    if (v.badInput || v.rangeUnderflow || v.rangeOverflow) return c.errorDate;
    return el.validationMessage;
  };

  const onInvalid = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // pas de bulle native : le message s'affiche sous le champ
    const el = e.target as Field;
    setErrors(prev => ({ ...prev, [el.name]: messageFor(el) }));
  };

  const clearError = (e: FormEvent<HTMLFormElement>) => {
    const el = e.target as Field;
    if (errors[el.name] && el.validity?.valid) setErrors(prev => { const n = { ...prev }; delete n[el.name]; return n; });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.querySelector<HTMLElement>(':invalid')?.focus();
      return;
    }
    const f = new FormData(form);
    if (f.get('website')) { setStatus('sent'); return; } // pot de miel anti-robots
    const get = (k: string) => String(f.get(k) ?? '').trim();
    const label = (opts: { value: string; label: string }[], v: string) => opts.find(o => o.value === v)?.label ?? v;
    const details: [string, string][] = [
      [c.labelRole, get('fonction')],
      [c.labelCountry, get('pays')],
      [c.labelSector, label(c.sectors, get('secteur'))],
      [c.labelDate, get('date')],
      [c.labelSupplier, get('fournisseur')],
      [c.labelSource, get('source')],
    ];
    const message = [get('projet'), '', ...details.filter(([, v]) => v).map(([k, v]) => `${k} : ${v}`)].join('\n').slice(0, 5000);

    setStatus('sending');
    setFailure('');
    try {
      await submitLead({
        name: get('nom'), company: get('entreprise'), email: get('email'), phone: get('whatsapp'),
        service: label(c.services, get('service')), message, page: 'accueil',
      });
      setStatus('sent');
    } catch (err) {
      setFailure(err instanceof Error ? err.message : "L'envoi a échoué. Réessayez ou écrivez-nous par e-mail.");
      setStatus('idle');
    }
  };

  if (status === 'sent') {
    return (
      <div className="sent" role="status">
        <span className="eyebrow">{c.sentLabel}</span>
        <p className="sent-title">{c.sentTitle}</p>
        <p className="sent-text">{c.sentText}</p>
      </div>
    );
  }

  const err = (name: string) => errors[name] ? { 'aria-invalid': true as const, 'aria-describedby': `err-${name}` } : {};

  return (
    <form className="form" noValidate onSubmit={onSubmit} onInvalidCapture={onInvalid} onInputCapture={clearError} onChangeCapture={clearError}>
      <F label={c.labelName} required name="nom" error={errors.nom}>
        <input id="f-nom" name="nom" required minLength={2} maxLength={MAX.name} autoComplete="name" {...err('nom')} />
      </F>
      <F label={c.labelRole} name="fonction" error={errors.fonction}>
        <input id="f-fonction" name="fonction" maxLength={MAX.role} autoComplete="organization-title" />
      </F>
      <F label={c.labelCompany} required name="entreprise" error={errors.entreprise}>
        <input id="f-entreprise" name="entreprise" required maxLength={MAX.company} autoComplete="organization" {...err('entreprise')} />
      </F>
      <F label={c.labelEmail} required name="email" error={errors.email}>
        <input id="f-email" name="email" type="email" required maxLength={MAX.email} autoComplete="email" {...err('email')} />
      </F>
      <F label={c.labelWhatsapp} name="whatsapp" error={errors.whatsapp}>
        <input id="f-whatsapp" name="whatsapp" type="tel" maxLength={MAX.whatsapp} autoComplete="tel" placeholder={c.placeholderWhatsapp} {...err('whatsapp')} />
      </F>
      <F label={c.labelCountry} name="pays" error={errors.pays}>
        <select id="f-pays" name="pays" defaultValue={c.countries[0]}>
          {c.countries.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      </F>
      <F label={c.labelSector} name="secteur" error={errors.secteur}>
        <select id="f-secteur" name="secteur" value={sector} onChange={e => onSector(e.target.value)}>
          {c.sectors.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </F>
      <F label={c.labelService} name="service" error={errors.service}>
        <select id="f-service" name="service" value={service} onChange={e => onService(e.target.value)}>
          {c.services.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      </F>
      <F label={c.labelProject} required wide name="projet" error={errors.projet}>
        <textarea id="f-projet" name="projet" required rows={4} maxLength={MAX.project} placeholder={c.placeholderProject} {...err('projet')} />
      </F>
      <F label={c.labelDate} name="date" error={errors.date}>
        <input id="f-date" name="date" type="date" min="2020-01-01" max="2100-12-31" {...err('date')} />
      </F>
      <F label={c.labelSupplier} name="fournisseur" error={errors.fournisseur}>
        <input id="f-fournisseur" name="fournisseur" maxLength={MAX.supplier} placeholder={c.placeholderSupplier} />
      </F>
      <div className="field wide">
        <span className="field-label">{c.labelFiles}</span>
        <p className="field-note">{c.filesNote}</p>
      </div>
      <F label={c.labelSource} wide name="source" error={errors.source}>
        <input id="f-source" name="source" maxLength={MAX.source} />
      </F>
      <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="form-foot">
        <p className="consent">
          {c.consent}{' '}
          <HashLink to={`${ROUTES.legal}#confidentialite`}>{c.consentLink}</HashLink>
        </p>
        <button type="submit" className="btn btn-ivory" disabled={status === 'sending'}>{status === 'sending' ? c.sending : c.submit}</button>
      </div>
      {failure && (
        <p className="form-failure" role="alert">
          {failure}{wa && <> <a href={wa} target="_blank" rel="noopener noreferrer">WhatsApp</a></>}
        </p>
      )}
    </form>
  );
}
