import Link from "next/link";

import { PAKETE, type Paket } from "@/lib/pakete-data";
import { TAFEL_ZEILEN } from "@/lib/pakete-tafel";

/**
 * Die vier Pakete als große Kacheln, nebeneinander wie eine Modellreihe
 * (Startseite #preise und /pakete). Server-Komponente ohne Script.
 *
 * Je Kachel: ein 40-Fuß-Container in der Paketfarbe als Produktbild
 * (.kachel-box, app/hafen.css, Block „Paket-Kacheln“), Name, ein Satz,
 * Preis „ab …“ mit Monatsbeitrag und zwei Aktionen. Der Satz ist für
 * Starter, Business und Premium derselbe wie auf der Abfahrtstafel
 * (lib/pakete-tafel.ts), für Studio der erste Satz der Paketbeschreibung.
 * Die Preisblöcke stehen unten (mt-auto), damit alle auf einer Linie
 * liegen. Mobil untereinander, kein Karussell.
 *
 * flaeche: Die Kachel hebt sich vom Abschnitt ab (Karte auf Elbnebel,
 * Elbnebel auf Karte).
 *
 * idPrefix: gesetzt (auch leer), bekommt jede Kachel die id
 * `${idPrefix}${slug}`, z. B. für die Anker /pakete#business.
 */

const TON: Record<Paket["slug"], string> = {
  starter: "",
  business: "kachel-box-signal",
  premium: "kachel-box-teer",
  studio: "kachel-box-gruen",
};

function satzVon(p: Paket) {
  const tafel = TAFEL_ZEILEN.find((z) => z.slug === p.slug);
  if (tafel) return tafel.desc;
  // Erster Satz der Beschreibung, wortgleich.
  const ende = p.description.indexOf(". ");
  return ende === -1 ? p.description : p.description.slice(0, ende + 1);
}

/** „ab 2.999 €" → „2.999 €" */
function betrag(setup: string) {
  return setup.replace(/^ab\s*/, "");
}

export function PaketKacheln({
  idPrefix,
  flaeche = "bg-card",
  className = "",
}: {
  idPrefix?: string;
  /** Fläche der Kacheln; auf einem Abschnitt in bg-card: "bg-background". */
  flaeche?: "bg-card" | "bg-background";
  className?: string;
}) {
  return (
    <div data-reveal="stagger" className={`grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 ${className}`}>
      {PAKETE.map((p) => {
        const nameId = `kachel-${p.slug}-name`;
        return (
          <article
            key={p.slug}
            id={idPrefix !== undefined ? `${idPrefix}${p.slug}` : undefined}
            className={`kachel ${flaeche} flex scroll-mt-[calc(var(--kopf-h)+32px)] flex-col rounded-[3px] px-7 pt-8 pb-7 lg:px-6 lg:pt-10 ${
              p.highlight ? "ring-gold ring-2" : "ring-foreground/[.08] ring-1"
            }`}
          >
            <div className="flex min-h-[44px] items-start justify-between gap-3">
              <span className={`kachel-box ${TON[p.slug]}`} aria-hidden="true" />
              {p.highlight ? <span className="label-mono text-gold pt-0.5 text-[11px]">Unsere Empfehlung</span> : null}
            </div>
            <h3 id={nameId} className="mt-8 text-[1.75rem] leading-[1.08] tracking-[-0.03em] lg:text-[2rem]">
              {p.name}
            </h3>
            <p className="text-muted-foreground mt-3 max-w-[26ch] text-[16px] leading-snug">{satzVon(p)}</p>
            <div className="mt-auto pt-8">
              <p className="flex items-baseline gap-2">
                <span className="text-muted-foreground text-[15px]">ab</span>
                <span className="serif text-[2.5rem] leading-none tracking-[-0.03em] tabular-nums lg:text-[3rem]">
                  {betrag(p.setup)}
                </span>
              </p>
              <p className="text-muted-foreground mt-2 text-[14.5px]">{p.monthly}</p>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href={`/anfrage?paket=${p.slug}`}
                aria-describedby={nameId}
                className={`${p.highlight ? "btn-signal" : "btn-line"} btn-ruhig`}
              >
                Anfragen
              </Link>
              <Link
                href={`/pakete/${p.slug}`}
                aria-describedby={nameId}
                className="link-pfeil link-pfeil-zeile text-gold-ink my-0 text-[15px] font-semibold"
              >
                Mehr erfahren&nbsp;<span className="pfeil" aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
