import type { CSSProperties } from "react";
import Link from "next/link";

import { getPaketBySlug } from "@/lib/pakete-data";

import { StapelMotor } from "./stapel-motor";

/**
 * Leistungen als Containerstapel. Zwei 40-Fuß-Container für das, was
 * jede Website ausmacht, darunter 20-Fuß-Container für Zusätze.
 *
 * Bewegung (Styles: app/hafen.css, Block „Leistungen“):
 * - Einlaufen: Jeder Container hängt am Spreader, wird abgesenkt, setzt
 *   weich auf, die Twistlocks lösen und der Spreader fährt hoch. Am
 *   Rechner läuft der ganze Stapel ein, untere Reihe zuerst, wie beim
 *   Stauen an Bord. Mobil Reihe für Reihe, sobald sie ins Bild kommt.
 * - Zeiger und Tastaturfokus: Spreader kommt herunter, dockt an, die
 *   Eckbeschläge leuchten und der Container hebt sich ein Stück.
 * Ohne Script, bei reduzierter Bewegung oder wenn der Stapel beim Laden
 * schon im Bild ist, stehen alle Container sofort da.
 *
 * Server-Komponente: Texte und Preise werden nicht hydriert. Die kleine
 * Client-Hülle StapelMotor (stapel-motor.tsx) setzt nur Beobachter und
 * Attribute.
 */

const MONTHLY = getPaketBySlug("starter")?.monthly.replace(/\s*\/\s*Monat$/, "").replace(/^ab/, "Ab") ?? "Ab 49\u00A0€";

type Box = {
  title: string;
  text: string;
  /** Linke Beschriftung: in welchem Paket der Container mitfährt. */
  tag: string;
  size: "40" | "20";
  tone: "signal" | "teer" | "gruen" | "zink" | "rost" | "weiss";
  href: string;
};

const BOXES: Box[] = [
  {
    title: "Die Website selbst",
    text: "Für Ihren Betrieb gestaltet, mit Ihrem Logo, Ihren Farben und Fotos, und direkt im Code gebaut, ohne Baukasten. Sie läuft auf dem Handy so gut wie am Rechner und lädt auch bei schwachem Mobilfunk zügig.",
    tag: "In jedem Paket",
    size: "40",
    tone: "signal",
    href: "/leistungen",
  },
  {
    title: "Hosting und Pflege",
    text: "Server in der EU, Sicherheits-Updates und Backups übernehmen wir. Kleine Änderungen sind im Monatsbeitrag enthalten: Sie schreiben uns, wir setzen sie um.",
    tag: `${MONTHLY} im Monat`,
    size: "40",
    tone: "teer",
    href: "/wartung",
  },
  {
    title: "Texte",
    text: "Sie schicken Stichpunkte, wir formulieren daraus die Texte. Sie lesen gegen und geben frei.",
    tag: "In jedem Paket",
    size: "20",
    tone: "gruen",
    href: "/ablauf",
  },
  {
    title: "Anfragen",
    text: "Kontaktformular mit Spamschutz und ein Anruf-Knopf, der auf dem Handy direkt wählt.",
    tag: "In jedem Paket",
    size: "20",
    tone: "zink",
    href: "/leistungen",
  },
  {
    title: "Bei Google",
    text: "Titel und Beschreibung für jede Seite, Sitemap und saubere Technik. Damit Google versteht, was Sie anbieten und wo.",
    tag: "Ab Business",
    size: "20",
    tone: "rost",
    href: "/pakete/business",
  },
  {
    title: "Selbst pflegen",
    text: "Speisekarte, Wochenangebot oder Termine ändern Sie selbst, ohne uns anzurufen.",
    tag: "Premium",
    size: "20",
    tone: "weiss",
    href: "/pakete/premium",
  },
];

/** Am Rechner: untere Reihe (20 Fuß) zuerst, dann die 40-Fuß-Container. */
function stackDelay(i: number) {
  return BOXES[i].size === "40" ? 560 + i * 170 : (i - 2) * 120;
}

export function ContainerStack() {
  return (
    <StapelMotor delays={BOXES.map((_, i) => stackDelay(i))}>
      <div className="grid grid-cols-2 gap-1.5 lg:grid-cols-12">
        {BOXES.map((b, i) => {
          const big = b.size === "40";
          return (
            <article
              key={b.title}
              className={`box box-${b.tone} ${big ? "col-span-2 lg:col-span-6" : "col-span-2 sm:col-span-1 lg:col-span-3"}`}
              style={{ "--z": BOXES.length - i } as CSSProperties}
            >
              {/* Spreader mit Kopfstück und Hubseilen, darunter die
                  leuchtenden Eckbeschläge und der Schatten aufs Deck. */}
              <span className="box-gear" aria-hidden="true">
                <span className="box-rope" />
                <span className="box-rope" />
                <span className="box-head" />
                <span className="box-spreader">
                  <span className="box-beam" />
                  <span className="box-half">
                    <i />
                  </span>
                  <span className="box-half">
                    <i />
                  </span>
                </span>
              </span>
              <span className="box-locks" aria-hidden="true" />
              <span className="box-shade" aria-hidden="true" />

              <p className="box-code">
                <span>{b.tag}</span>
                <span aria-hidden="true">{b.size} ft</span>
              </p>
              <h3
                className={`pt-6 leading-[1.08] tracking-[-0.022em] sm:pt-10 lg:pt-14 ${
                  big ? "text-[1.75rem] sm:text-[2.1rem]" : "text-[1.4rem] sm:text-[1.6rem]"
                }`}
              >
                <Link href={b.href} className="box-link">
                  {b.title}
                </Link>
              </h3>
              <p className={`mt-2.5 max-w-[32em] leading-relaxed ${big ? "text-[16px]" : "text-[15px]"}`}>{b.text}</p>
            </article>
          );
        })}
      </div>
      {/* Deck und Wasserpass unter dem Stapel */}
      <div aria-hidden="true" className="bg-foreground relative mt-1.5 h-[18px]">
        <span className="absolute inset-x-0 top-[5px] h-px bg-white/15" />
      </div>
      <div aria-hidden="true" className="bg-ink-olive h-2.5 opacity-90" />
    </StapelMotor>
  );
}
