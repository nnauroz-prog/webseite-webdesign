import { Containerbruecke } from "@/components/marketing/hafen/containerbruecke";
import { AUFTAKT_SCRIPT, PEGEL_QUELLE } from "@/components/marketing/hafen/hafen-hero";
import heroStil from "@/components/marketing/hafen/hero.module.css";
import { HeroBuehne } from "@/components/marketing/hafen/hero-buehne";
import { pegelHub, pegelStand, pegelStPauli, pegelText } from "@/components/marketing/hafen/pegel";
import s from "@/components/marketing/hafen/start.module.css";

/**
 * Der Kran direkt unter dem Kopf: randlos über die volle Breite, Himmel
 * nach dem Sonnenstand über Hamburg (HeroBuehne, hero-licht.ts), unten
 * eine gezeichnete Kaikante. Die Zeichnung bleibt beim Scrollen am
 * Rechner höchstens 24 px zurück (data-tiefe). Darunter die
 * Bildunterschrift in Mono mit dem Pegel St. Pauli live (alle zehn
 * Minuten). Die Container tragen ihre Nummern ab „SITALO 000599“.
 *
 * Die Zeichnung ist nicht das LCP-Element und lädt ohne Priorität;
 * sie ist reines Inline-SVG.
 */
export async function KranBanner() {
  const pegel = await pegelStPauli();
  const hub = pegelHub(pegel);
  return (
    <figure className={s.kran}>
      <HeroBuehne className={`${heroStil.hero} ${s.kranBuehne}`}>
        {/* Wartezustand des Auftakts vor dem ersten Bild; braucht die Bühne als Elternteil. */}
        <script dangerouslySetInnerHTML={{ __html: AUFTAKT_SCRIPT }} />
        <div className={heroStil.licht} aria-hidden="true">
          <i className={heroStil.lichtMorgen} />
          <i className={heroStil.lichtAbend} />
          <i className={heroStil.lichtNacht} />
        </div>
        <div className={s.kranBild} data-tiefe="">
          <Containerbruecke hub={hub} />
        </div>
        <div className={s.kaikante} aria-hidden="true" />
      </HeroBuehne>
      <figcaption className={`inhalt ${s.kranUnterschrift}`}>
        <span>
          Blick <span className="hidden sm:inline">von Steinwerder </span>über die Elbe, frei gezeichnet.
        </span>
        {pegel ? (
          <span title={PEGEL_QUELLE}>
            <span className={s.pegelPunkt} aria-hidden="true" />
            Pegel St.&nbsp;Pauli: {pegelText(pegel)}
            <span className="hidden sm:inline">, Stand {pegelStand(pegel)}&nbsp;Uhr</span>
          </span>
        ) : null}
      </figcaption>
    </figure>
  );
}
