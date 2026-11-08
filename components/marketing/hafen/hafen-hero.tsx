import Link from "next/link";

import { MehrLink } from "@/components/marketing/apple/mehr-link";
import { Containerbruecke } from "@/components/marketing/hafen/containerbruecke";
import { WARTUNG_PREISE } from "@/lib/pakete-data";

import s from "./hero.module.css";
import { HeroBuehne } from "./hero-buehne";
import { pegelHub, pegelStand, pegelStPauli, pegelText } from "./pegel";

/* Auftakt der Zeichnung (hero.module.css, „Auftakt“): läuft vor dem
   ersten Bild, damit Stadt und Horizont gar nicht erst sichtbar sind,
   wenn sie gleich danach einblenden. Nur mit JS, nur ohne reduzierte
   Bewegung und nur, wenn es einen IntersectionObserver gibt. */
const AUFTAKT_SCRIPT = `(function(){try{var h=document.currentScript.parentNode;document.documentElement.classList.add("js");if(window.matchMedia("(prefers-reduced-motion: no-preference)").matches&&"IntersectionObserver" in window)h.setAttribute("data-auftakt","warten")}catch(e){}})()`;

const PEGEL_QUELLE = "Messwert von PEGELONLINE, Wasserstraßen- und Schifffahrtsverwaltung des Bundes";

/* ------------------------------------------------------------------
 * Kopf der Startseite, zentriert wie eine Produktseite: kleine Kennzeile
 * (die H1 mit dem Suchbegriff), riesige Botschaft, grauer Untertitel,
 * Pille + Chevron-Link. Darunter die Containerbrücke als großes
 * „Produktbild“ in einem gerundeten Rahmen (am Handy randlos), darunter
 * Bildunterschrift mit Pegel und zwei Nebenlinks als Fußnote.
 *
 * Der Pegel St. Pauli kommt live von PEGELONLINE (alle zehn Minuten).
 * Bei 1440 × 900 stehen Kranspitze, Ausleger und Spreader im ersten
 * Bild, das Schiff kommt beim Scrollen; bei 390 × 844 ragt die
 * Kranspitze ins erste Bild.
 * ---------------------------------------------------------------- */
export async function HafenHero() {
  const pegel = await pegelStPauli();
  const hub = pegelHub(pegel);

  return (
    <HeroBuehne id="start" className={s.hero}>
      <div className={`${s.copy} inhalt`}>
        {/* Die H1 trägt den Suchbegriff (für Google), der große Satz
            darunter ist die Botschaft (für Menschen). Eine Zeile mit
            Mittelpunkt; unter 375 px ist die erste Hälfte nur für
            Screenreader da (hero.module.css, .kennzeile). */}
        <h1 className={s.kennzeile}>
          <span className={s.kennzeileErste}>Website erstellen lassen</span>
          <span className={s.kennzeileErste}>{" ·"}</span> <span>Webdesign aus Hamburg</span>
        </h1>
        <p className={`t-hero ${s.botschaft}`}>Wir bauen Websites für Betriebe.</p>
        <p className={s.unter}>
          Ein kleines Büro in Hamburg, das bundesweit arbeitet. Den Festpreis kennen Sie vor dem Start, Ihre Seite
          sehen Sie vorher auf einem Test-Link.
        </p>
        <div className={`aktionen ${s.aktionen}`}>
          <Link href="/anfrage" className="btn-signal btn-gross">
            Anfrage schreiben
          </Link>
          <MehrLink href="#preise">Preise ansehen</MehrLink>
        </div>
      </div>

      {/* Erst nach dem Text: Die Botschaft (LCP) wird nicht von einem
          Script im Parser aufgehalten, die Zeichnung aber schon im
          Wartezustand gemalt. Das Script braucht die Bühne als Elternteil. */}
      <script dangerouslySetInnerHTML={{ __html: AUFTAKT_SCRIPT }} />

      {/* Produktbild: Himmel nach Tageszeit und Zeichnung im Rahmen. */}
      <div className={s.rahmen}>
        <div className={s.licht} aria-hidden="true">
          <i className={s.lichtMorgen} />
          <i className={s.lichtAbend} />
          <i className={s.lichtNacht} />
        </div>
        <Containerbruecke hub={hub} />
      </div>

      <div className={`${s.fuss} inhalt`}>
        <p className={s.caption}>
          <span>
            Blick <span className="hidden sm:inline">von Steinwerder </span>über die Elbe, frei gezeichnet.
          </span>
          {pegel ? (
            <span className={s.pegel} title={PEGEL_QUELLE}>
              <span className={s.pegelPunkt} aria-hidden="true" />
              Pegel St. Pauli: {pegelText(pegel)}
              <span className="hidden sm:inline">, Stand {pegelStand(pegel)} Uhr</span>
            </span>
          ) : null}
        </p>
        <p className={s.nebenZeile}>
          <MehrLink href="/wartung" groesse="klein" frei={false}>
            Schon eine Website? Pflege ab {WARTUNG_PREISE.basis} im Monat
          </MehrLink>
          <MehrLink href="/audit" groesse="klein" frei={false}>
            Kostenlose Durchsicht Ihrer Website
          </MehrLink>
        </p>
      </div>
    </HeroBuehne>
  );
}
