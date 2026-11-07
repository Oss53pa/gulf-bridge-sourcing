import { Link } from 'react-router-dom';
import { useContent } from '../content/ContentProvider';
import { Icon, ROUTES, whatsappHref } from '../components/ui';

export default function NotFound() {
  const { settings } = useContent();
  const wa = whatsappHref(settings.whatsapp, 'page introuvable');
  return (
    <section className="legal bg-white on-light" data-screen-label="Page introuvable">
      <div className="wrap stack" style={{ gap: 24, maxWidth: 680 }}>
        <h1>Cette page n'existe pas</h1>
        <p className="lead">Le lien est peut-être ancien. Reprenez depuis l'accueil, ou écrivez-nous.</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link to={ROUTES.home} className="btn btn-navy">Accueil<Icon name="arrow_forward" size={20} /></Link>
          {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-outline-navy"><Icon name="chat" size={20} />WhatsApp</a>}
          <a href={`mailto:${settings.email}`} className="btn btn-outline-navy"><Icon name="mail" size={20} />{settings.email}</a>
        </div>
      </div>
    </section>
  );
}
