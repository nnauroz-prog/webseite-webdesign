import Link from "next/link";

import { ContainerMotiv, PAKET_TON } from "@/components/marketing/apple/container-motiv";
import { MehrLink } from "@/components/marketing/apple/mehr-link";
import { PAKETE, type Paket } from "@/lib/pakete-data";
import { TAFEL_ZEILEN } from "@/lib/pakete-tafel";

/**
 * Die vier Pakete als „Modelle“ (Startseite #preise und /pakete),
 * Server-Komponente ohne Script. Styles: app/apple.css, Block 15.
 *
 * Je Karte oben ein Produktbild: gestapelte Container in der Paketfarbe
 * (1 bis 4, rein bildlich), darunter ein weicher Bodenschatten. Die
 * Bildzone ist fest hoch, damit alle Namen auf einer Linie stehen; die
 * Container werden mit wachsendem Stapel flacher (data-anzahl), so füllt
 * jeder Stapel die Zone etwa gleich.
 * Danach Eyebrow (nur Business: „Unsere Empfehlung“, sonst ein leerer
 * Platzhalter gleicher Höhe), Name, ein Satz, „ab …“, Monatsbeitrag und
 * die Aktionen „Anfragen“ (Pille) und „Mehr erfahren ›“.
 *
 * Der Satz ist für Starter, Business und Premium derselbe wie auf der
 * Abfahrtstafel (lib/pakete-tafel.ts), für Studio der erste Satz der
 * Paketbeschreibung.
 *
 * Mobil ein Regal zum Wischen (Anschnitt der nächsten Karte, fokussier-
 * bar), ab 640 px zwei, ab 1068 px vier Spalten. Die Komponente bringt
 * ihre Breite selbst mit: außerhalb eines .inhalt-Containers einsetzen.
 *
 * flaeche: Karten weiß (auf #f5f5f7) oder hell (auf Weiß).
 * idPrefix: gesetzt (auch leer), bekommt jede Karte die id
 * `${idPrefix}${slug}`, z. B. für die Anker /pakete#business.
 */

function satzVon(p: Paket) {
  const tafel = TAFEL_ZEILEN.find((z) => z.slug === p.slug);
  if (tafel) return tafel.desc;
  // Erster Satz der Beschreibung, wortgleich.
  const ende = p.description.indexOf(". ");
  return ende === -1 ? p.description : p.description.slice(0, ende + 1);
}

export function PaketKacheln({
  idPrefix,
  flaeche = "weiss",
  className = "",
}: {
  idPrefix?: string;
  flaeche?: "weiss" | "hell";
  className?: string;
}) {
  return (
    <div data-auftritt="" className={`modelle ${className}`} tabIndex={0} role="region" aria-label="Pakete">
      <ul role="list">
        {PAKETE.map((p, i) => {
          const nameId = `kachel-${p.slug}-name`;
          const ton = PAKET_TON[p.slug] ?? "zink";
          return (
            <li key={p.slug}>
              <article
                id={idPrefix !== undefined ? `${idPrefix}${p.slug}` : undefined}
                className={`karte modell-karte ${flaeche === "weiss" ? "karte-weiss" : ""}`}
              >
                <div className="modell-bild" data-anzahl={i + 1} aria-hidden="true">
                  <ContainerMotiv stapel={Array.from({ length: i + 1 }, () => ton)} />
                </div>
                {p.highlight ? (
                  <p className="t-eyebrow modell-eyebrow">Unsere Empfehlung</p>
                ) : (
                  <span className="modell-eyebrow block" aria-hidden="true" />
                )}
                <h3 id={nameId} className="t-karte mt-1">
                  {p.name}
                </h3>
                <p className="modell-satz">{satzVon(p)}</p>
                <p className="modell-preis">{p.setup}</p>
                <p className="modell-monat">{p.monthly}</p>
                <div className="modell-aktionen">
                  <Link href={`/anfrage?paket=${p.slug}`} aria-describedby={nameId} className="btn-signal btn-mittel">
                    Anfragen
                  </Link>
                  <MehrLink href={`/pakete/${p.slug}`} kontext={p.name} groesse="klein">
                    Mehr erfahren
                  </MehrLink>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
