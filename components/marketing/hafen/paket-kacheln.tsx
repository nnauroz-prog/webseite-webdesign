import Link from "next/link";

import { PAKETE, type Paket } from "@/lib/pakete-data";
import { TAFEL_ZEILEN } from "@/lib/pakete-tafel";

/**
 * Die vier Pakete als Kacheln, nebeneinander wie eine Modellreihe
 * (/pakete). Server-Komponente ohne Script.
 *
 * Je Kachel als Produktbild ein 40-Fuß-Container in der Paketfarbe
 * (.kachel-box, app/hafen.css, Block „Paket-Kacheln“) mit Wellblech-
 * Rippen und Eckbeschlägen, darunter die Kennung in Mono
 * („40 FT · SITALO 002999“, die Ziffern sind der Festpreis). Dann Name,
 * ein Satz, Preis „ab …“ mit Monatsbeitrag und zwei Aktionen. Der Satz
 * ist für Starter, Business und Premium derselbe wie auf der
 * Abfahrtstafel (lib/pakete-tafel.ts), für Studio der erste Satz der
 * Paketbeschreibung. Mobil untereinander, kein Karussell.
 *
 * Nur die empfohlene Kachel hat einen gefüllten Knopf, die anderen eine
 * Linie: höchstens ein gefüllter Knopf je Bildschirm.
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

/** „ab 2.999 €" → „SITALO 002999" (Containernummer aus dem Festpreis). */
export function kennung(setup: string) {
  const ziffern = setup.replace(/\D+/g, "");
  return `SITALO ${ziffern.padStart(6, "0")}`;
}

export function PaketKacheln({
  idPrefix,
  className = "",
}: {
  idPrefix?: string;
  className?: string;
}) {
  return (
    <div className={`grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 ${className}`}>
      {PAKETE.map((p) => {
        const nameId = `kachel-${p.slug}-name`;
        return (
          <article
            key={p.slug}
            id={idPrefix !== undefined ? `${idPrefix}${p.slug}` : undefined}
            className={`kachel group relative flex scroll-mt-[calc(var(--kopf-h)+32px)] flex-col rounded-[6px] bg-[#fafaf8] px-6 pt-7 pb-6 ${
              p.highlight ? "ring-gold ring-2" : "ring-1 ring-[#1b1d1e]/10"
            }`}
          >
            <div className="min-h-[64px]">
              <span className={`kachel-box ${TON[p.slug]}`} aria-hidden="true" />
              <span className="mt-2 block font-mono text-[10.5px] tracking-[0.12em] whitespace-nowrap text-[#565b5d] uppercase">
                40&nbsp;FT · {kennung(p.setup)}
              </span>
            </div>
            <p
              className={`text-gold-ink mt-6 h-4 font-mono text-[10.5px] leading-4 font-medium tracking-[0.14em] uppercase`}
              aria-hidden={p.highlight ? undefined : true}
            >
              {p.highlight ? "Unsere Empfehlung" : ""}
            </p>
            <h3
              id={nameId}
              className="mt-1 text-[1.75rem] leading-[1.06] font-[740] tracking-[-0.028em] [font-stretch:116%] lg:text-[1.9rem]"
            >
              {p.name}
            </h3>
            <p className="text-muted-foreground mt-3 max-w-[28ch] text-[15.5px] leading-snug text-pretty">{satzVon(p)}</p>
            <div className="mt-auto pt-8">
              <p className="flex items-baseline gap-2">
                <span className="text-muted-foreground text-[15px]">ab</span>
                <span className="text-[2.4rem] leading-none font-[760] tracking-[-0.03em] tabular-nums [font-stretch:112%]">
                  {betrag(p.setup)}
                </span>
              </p>
              <p className="text-muted-foreground mt-2 font-mono text-[12px]">dazu {p.monthly}</p>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
              <Link
                href={`/anfrage?paket=${p.slug}`}
                aria-describedby={nameId}
                className={`${p.highlight ? "btn-signal" : "btn-line"} btn-klein`}
              >
                Anfragen
              </Link>
              <Link
                href={`/pakete/${p.slug}`}
                aria-describedby={nameId}
                className="link-pfeil text-[15px] font-semibold"
              >
                Im Einzelnen&nbsp;<span className="pfeil" aria-hidden="true">→</span>
              </Link>
            </div>
          </article>
        );
      })}
    </div>
  );
}
