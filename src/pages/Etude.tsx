import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useContent } from '../content/ContentProvider';
import { Icon, PageHero, ROUTES } from '../components/ui';
import { ACCEPT_ATTR, MAX_FILES, checkFile, submitLead, uploadsConfigured, type LeadInput } from '../lib/atlas';
import { readOrigin, track } from '../lib/analytics';

type Values = Omit<LeadInput, 'files' | 'landingPage' | 'referrer'>;

const EMPTY: Values = {
  specialty: '', service: '', country: '', products: '', needDate: '',
  supplierKnown: 'non', supplierName: '',
  name: '', role: '', company: '', email: '', phone: '', source: '',
};

/** Champs obligatoires de chaque étape. */
const REQUIRED: Record<number, (keyof Values)[]> = {
  0: ['specialty', 'service', 'country', 'products'],
  1: [],
  2: ['name', 'role', 'company', 'email', 'phone'],
};

export default function Etude() {
  const c = useContent();
  const e = c.etude;
  const { search } = useLocation();

  const params = useMemo(() => new URLSearchParams(search), [search]);
  // Le préremplissage est appliqué après l'hydratation : le HTML pré-rendu ne
  // connaît pas les paramètres de l'adresse, et React ne réécrit la valeur
  // d'une liste déroulante que si l'état change après le premier rendu.
  const [values, setValues] = useState<Values>(EMPTY);
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState('');
  const [step, setStep] = useState(0);
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ ref: string; attachmentsSent: number } | null>(null);

  // Contrôle anti-robots sans image à déchiffrer : un envoi immédiat est refusé.
  const openedAt = useRef(Date.now());
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const sp = params.get('specialite');
    const sv = params.get('service');
    if (sp || sv) setValues(v => ({ ...v, specialty: sp ?? v.specialty, service: sv ?? v.service }));
  }, [params]);

  useEffect(() => { track('form_open'); }, []);
  useEffect(() => { track(`form_step_${step + 1}` as 'form_step_1'); }, [step]);

  const set = (k: keyof Values) => (ev: { target: { value: string } }) =>
    setValues(v => ({ ...v, [k]: ev.target.value }));

  const missing = REQUIRED[step].filter(k => !values[k].trim());

  const goNext = () => {
    setTouched(true);
    if (missing.length) return;
    setTouched(false);
    setStep(s => Math.min(2, s + 1));
    headingRef.current?.focus();
  };
  const goBack = () => { setTouched(false); setStep(s => Math.max(0, s - 1)); headingRef.current?.focus(); };

  const onFiles = (list: FileList | null) => {
    if (!list) return;
    const picked = [...files, ...Array.from(list)].slice(0, MAX_FILES);
    for (const f of picked) {
      const err = checkFile(f);
      if (err) { setFileError(err); return; }
    }
    if (files.length + list.length > MAX_FILES) setFileError(`${MAX_FILES} fichiers au plus.`);
    else setFileError('');
    setFiles(picked);
  };

  const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const fd = new FormData(ev.currentTarget);
    if (fd.get('website')) { setStatus('sent'); setResult({ ref: '', attachmentsSent: 0 }); return; } // pot de miel
    if (Date.now() - openedAt.current < 4000) { setError('Envoi trop rapide. Vérifiez vos informations et réessayez.'); return; }

    setTouched(true);
    if (REQUIRED[2].some(k => !values[k].trim())) return;

    setStatus('sending');
    setError('');
    const origin = readOrigin();
    try {
      const res = await submitLead({ ...values, files, landingPage: origin.landing, referrer: origin.referrer });
      setResult(res);
      setStatus('sent');
      track('form_sent', { specialite: values.specialty, pays: values.country });
      window.scrollTo(0, 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus('idle');
    }
  };

  if (status === 'sent') {
    return (
      <>
        <PageHero hero={e.hero} crumb="Demander une étude" />
        <section className="sec bg-white on-light" data-screen-label="Merci">
          <div className="wrap thanks-page" role="status">
            <Icon name="check_circle" />
            <h2 className="h2">{e.thanksTitle}</h2>
            {result?.ref && (
              <p className="thanks-ref"><span className="label">{e.thanksRef}</span><strong>{result.ref}</strong></p>
            )}
            <p className="lead">{e.thanksText}</p>
            {result && result.attachmentsSent > 0 && (
              <p>{result.attachmentsSent} fichier(s) reçu(s) avec votre demande.</p>
            )}
            {files.length > 0 && result?.attachmentsSent === 0 && (
              <p className="form-note">
                Vos fichiers n'ont pas pu être transmis automatiquement. Nous vous les demanderons par e-mail.
              </p>
            )}
            <Link to={ROUTES.home} className="btn btn-navy">Revenir à l'accueil<Icon name="arrow_forward" size={20} /></Link>
          </div>
        </section>
      </>
    );
  }

  const serviceOptions = [...c.solutions.items.map(i => i.title), e.serviceUnknown];

  return (
    <>
      <PageHero hero={e.hero} crumb="Demander une étude" />
      <section className="sec bg-sand on-light" data-screen-label="Formulaire">
        <div className="wrap form-wrap">

          <ol className="form-steps" aria-label="Avancement">
            {e.stepLabels.map((label, i) => (
              <li key={i} className={i === step ? 'current' : i < step ? 'done' : ''} aria-current={i === step ? 'step' : undefined}>
                <span className="dot">{i < step ? <Icon name="check" size={18} /> : i + 1}</span>
                <span>{label}</span>
              </li>
            ))}
          </ol>
          <div className="form-progress" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={3}>
            <div style={{ width: `${((step + 1) / 3) * 100}%` }} />
          </div>

          <form className="form guided" onSubmit={onSubmit} noValidate>
            <h2 className="sr-only" ref={headingRef} tabIndex={-1}>{e.stepLabels[step]}</h2>

            {/* Étape 1 */}
            <div hidden={step !== 0} className="fields">
              <div className="field">
                <label htmlFor="f-specialty">{e.specialtyLabel} <span aria-hidden="true">*</span></label>
                <select id="f-specialty" value={values.specialty} onChange={set('specialty')} required
                  aria-invalid={touched && !values.specialty ? true : undefined}>
                  <option value="">Choisir</option>
                  {e.specialtyOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                {touched && !values.specialty && <span className="field-error">{e.required}</span>}
              </div>

              <div className="field">
                <label htmlFor="f-service">{e.serviceLabel} <span aria-hidden="true">*</span></label>
                <select id="f-service" value={values.service} onChange={set('service')} required
                  aria-invalid={touched && !values.service ? true : undefined}>
                  <option value="">Choisir</option>
                  {serviceOptions.map(o => <option key={o} value={o}>{o}</option>)}
                  {values.service && !serviceOptions.includes(values.service) && <option value={values.service}>{values.service}</option>}
                </select>
                {touched && !values.service && <span className="field-error">{e.required}</span>}
              </div>

              <div className="field">
                <label htmlFor="f-country">{e.countryLabel} <span aria-hidden="true">*</span></label>
                <select id="f-country" value={values.country} onChange={set('country')} required
                  aria-invalid={touched && !values.country ? true : undefined}>
                  <option value="">Choisir</option>
                  {e.countryOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                {touched && !values.country && <span className="field-error">{e.required}</span>}
              </div>

              <div className="field full">
                <label htmlFor="f-products">{e.productsLabel} <span aria-hidden="true">*</span></label>
                <textarea id="f-products" rows={4} maxLength={5000} value={values.products} onChange={set('products')}
                  required aria-describedby="h-products" aria-invalid={touched && !values.products ? true : undefined} />
                <span className="field-hint" id="h-products">{e.productsHint}</span>
                {touched && !values.products && <span className="field-error">{e.required}</span>}
              </div>

              <div className="field">
                <label htmlFor="f-date">{e.dateLabel}</label>
                <input id="f-date" type="date" value={values.needDate} onChange={set('needDate')} />
              </div>

              <div className="field">
                <label htmlFor="f-supplier">{e.supplierLabel}</label>
                <select id="f-supplier" value={values.supplierKnown} onChange={set('supplierKnown')}>
                  <option value="non">Non</option>
                  <option value="oui">Oui</option>
                </select>
              </div>

              {values.supplierKnown === 'oui' && (
                <div className="field full">
                  <label htmlFor="f-supplier-name">{e.supplierNameLabel}</label>
                  <input id="f-supplier-name" maxLength={200} value={values.supplierName} onChange={set('supplierName')} />
                </div>
              )}
            </div>

            {/* Étape 2 */}
            <div hidden={step !== 1} className="fields">
              <div className="field full">
                <label htmlFor="f-files">{e.filesLabel}</label>
                <input id="f-files" type="file" multiple accept={ACCEPT_ATTR}
                  disabled={!uploadsConfigured}
                  onChange={ev => onFiles(ev.target.files)} aria-describedby="h-files" />
                <span className="field-hint" id="h-files">{e.filesHint}</span>
                {!uploadsConfigured && (
                  <span className="form-note">
                    L'envoi de pièces jointes n'est pas encore actif sur ce site. Décrivez vos documents à l'étape précédente,
                    nous vous les demanderons par e-mail dès le premier contact.
                  </span>
                )}
                {fileError && <span className="field-error" role="alert">{fileError}</span>}
                {files.length > 0 && (
                  <ul className="file-list">
                    {files.map((f, i) => (
                      <li key={i}>
                        <Icon name="description" size={20} />
                        <span>{f.name}</span>
                        <span className="size">{Math.round(f.size / 1024)} ko</span>
                        <button type="button" className="btn-reset remove" onClick={() => setFiles(fs => fs.filter((_, j) => j !== i))}
                          aria-label={`Retirer ${f.name}`}><Icon name="close" size={20} /></button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Étape 3 */}
            <div hidden={step !== 2} className="fields">
              <div className="field">
                <label htmlFor="f-name">{e.nameLabel} <span aria-hidden="true">*</span></label>
                <input id="f-name" autoComplete="name" maxLength={200} value={values.name} onChange={set('name')} required
                  aria-invalid={touched && !values.name ? true : undefined} />
                {touched && !values.name && <span className="field-error">{e.required}</span>}
              </div>
              <div className="field">
                <label htmlFor="f-role">{e.roleLabel} <span aria-hidden="true">*</span></label>
                <input id="f-role" autoComplete="organization-title" maxLength={200} value={values.role} onChange={set('role')} required
                  aria-invalid={touched && !values.role ? true : undefined} />
                {touched && !values.role && <span className="field-error">{e.required}</span>}
              </div>
              <div className="field">
                <label htmlFor="f-company">{e.companyLabel} <span aria-hidden="true">*</span></label>
                <input id="f-company" autoComplete="organization" maxLength={200} value={values.company} onChange={set('company')} required
                  aria-invalid={touched && !values.company ? true : undefined} />
                {touched && !values.company && <span className="field-error">{e.required}</span>}
              </div>
              <div className="field">
                <label htmlFor="f-email">{e.emailLabel} <span aria-hidden="true">*</span></label>
                <input id="f-email" type="email" autoComplete="email" maxLength={254} value={values.email} onChange={set('email')} required
                  aria-invalid={touched && !values.email ? true : undefined} />
                {touched && !values.email && <span className="field-error">{e.required}</span>}
              </div>
              <div className="field">
                <label htmlFor="f-phone">{e.phoneLabel} <span aria-hidden="true">*</span></label>
                <input id="f-phone" type="tel" autoComplete="tel" maxLength={50} placeholder="+225" value={values.phone} onChange={set('phone')} required
                  aria-invalid={touched && !values.phone ? true : undefined} />
                {touched && !values.phone && <span className="field-error">{e.required}</span>}
              </div>
              <div className="field">
                <label htmlFor="f-source">{e.sourceLabel}</label>
                <select id="f-source" value={values.source} onChange={set('source')}>
                  <option value="">Choisir</option>
                  {e.sourceOptions.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              </div>

              <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />

              <label className="consent full">
                <input type="checkbox" required />
                <span>{e.consent} <Link to={ROUTES.privacy}>Lire la politique de confidentialité</Link></span>
              </label>
            </div>

            {error && <div className="form-error" role="alert">{error}</div>}

            <div className="form-actions">
              {step > 0 && <button type="button" className="btn btn-outline-navy" onClick={goBack}><Icon name="arrow_back" size={20} />{e.back}</button>}
              {step < 2
                ? <button type="button" className="btn btn-navy" onClick={goNext}>{e.next}<Icon name="arrow_forward" size={20} /></button>
                : <button type="submit" className="btn btn-navy" disabled={status === 'sending'}>{status === 'sending' ? e.sending : e.submit}</button>}
            </div>
            {touched && missing.length > 0 && (
              <p className="form-error" role="alert">Complétez les champs obligatoires de cette étape.</p>
            )}
          </form>
        </div>
      </section>
    </>
  );
}
