import { Fragment, type CSSProperties } from "react";

/**
 * Überschrift, deren Wörter einzeln aus einer Maske steigen (Server-
 * Komponente, ohne Zeilenmessung im Browser). Jedes Wort steht in
 * `<span class="rv-w"><span style="--w:i">Wort</span></span>`, dazwischen
 * echte Leerzeichen: Der Text, die Umbrüche und der Name für Screen-
 * reader bleiben genau wie ohne Komponente.
 *
 * Gedacht für Überschriften mit data-reveal="rise" (RevealRoot). Die
 * Bewegung steht in app/hafen.css, Block „Reveal“: Startzustand nur
 * unter html.js-reveal, bei reduzierter Bewegung gar nicht.
 *
 * Nur für schlichten Text. Enthält eine Überschrift weitere Elemente,
 * bleibt sie ohne Steigend; dort begrenzt rv-rise den Weg auf 0,9 em.
 */
export function Steigend({ text }: { text: string }) {
  const woerter = text.split(" ").filter(Boolean);
  return (
    <>
      {woerter.map((w, i) => (
        <Fragment key={i}>
          {i > 0 ? " " : null}
          <span className="rv-w">
            <span style={{ "--w": i } as CSSProperties}>{w}</span>
          </span>
        </Fragment>
      ))}
    </>
  );
}
