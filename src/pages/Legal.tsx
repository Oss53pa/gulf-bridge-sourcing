import { useContent } from '../content/ContentProvider';

export default function Legal({ kind }: { kind: 'mentions' | 'privacy' }) {
  const { legal } = useContent();
  const title = kind === 'mentions' ? legal.mentionsTitle : legal.privacyTitle;
  const body = kind === 'mentions' ? legal.mentions : legal.privacy;
  return (
    <section className="legal bg-white on-light" data-screen-label={title}>
      <div className="wrap">
        <h1>{title}</h1>
        <div className="legal-body">{body}</div>
      </div>
    </section>
  );
}
