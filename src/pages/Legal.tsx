import { useContent } from '../content/ContentProvider';

/**
 * Les mentions et la politique sont du texte brut édité dans la console.
 * Une ligne non suivie d'un point final et suivie d'un paragraphe est traitée
 * comme un intertitre, pour rester lisible sans balisage dans la console.
 */
function Body({ text }: { text: string }) {
  const blocks = String(text ?? '').split(/\n{2,}/).filter(Boolean);
  return (
    <div className="legal-body">
      {blocks.map((block, i) => {
        const lines = block.split('\n');
        const isHeading = lines.length > 1 && !/[.:!?]$/.test(lines[0].trim());
        return (
          <section key={i}>
            {isHeading
              ? <><h2>{lines[0]}</h2>{lines.slice(1).map((l, j) => <p key={j}>{l}</p>)}</>
              : lines.map((l, j) => <p key={j}>{l}</p>)}
          </section>
        );
      })}
    </div>
  );
}

export default function Legal({ kind }: { kind: 'mentions' | 'privacy' }) {
  const { legal } = useContent();
  const title = kind === 'mentions' ? legal.mentionsTitle : legal.privacyTitle;
  const body = kind === 'mentions' ? legal.mentions : legal.privacy;
  return (
    <section className="legal bg-white on-light" data-screen-label={title}>
      <div className="wrap">
        <h1>{title}</h1>
        <Body text={body} />
      </div>
    </section>
  );
}
