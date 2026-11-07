import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Containerbruecke } from "@/components/marketing/hafen/containerbruecke";
import { WARTUNG_PREISE } from "@/lib/pakete-data";

import s from "./hero.module.css";
import { HeroBuehne } from "./hero-buehne";
import { pegelHub, pegelStand, pegelStPauli, pegelText } from "./pegel";

const ARROW = <ArrowRight className="h-4 w-4" aria-hidden="true" />;

const BOTSCHAFT = ["Wir", "bauen", "Websites", "für", "Betriebe."];

function NebenLinks() {
  return (
    <>
      <Link href="/wartung" className={s.neben}>
        Schon eine Website? Pflege ab {WARTUNG_PREISE.basis} im Monat
      </Link>
      <Link href="/audit" className={s.neben}>
        Kostenlose Durchsicht Ihrer Website
      </Link>
    </>
  );
}

/* Auftakt der Zeichnung (hero.module.css, „Auftakt“): läuft vor dem
   ersten Bild, damit Stadt und Horizont gar nicht erst sichtbar sind,
   wenn sie gleich danach einblenden. Nur mit JS, nur ohne reduzierte
   Bewegung und nur, wenn es einen IntersectionObserver gibt. */
const AUFTAKT_SCRIPT = `(function(){try{var h=document.currentScript.parentNode;document.documentElement.classList.add("js");if(window.matchMedia("(prefers-reduced-motion: no-preference)").matches&&"IntersectionObserver" in window)h.setAttribute("data-auftakt","warten")}catch(e){}})()`;

/* ------------------------------------------------------------------
 * Kopf: Hafen-Plakat. Links die Botschaft, unten rechts die
 * Containerbrücke im Ladebetrieb, am Horizont Hamburg im Dunst.
 * Der Pegel St. Pauli kommt live von PEGELONLINE (alle zehn Minuten).
 *
 * Am Handy ist die Textspalte bewusst knapp: Bei 390 × 844 sollen
 * Beschriftung und Schiffsdeck schon im ersten Bild stehen. Die beiden
 * Nebenlinks folgen dort erst unter der Zeichnung.
 * ---------------------------------------------------------------- */
export async function HafenHero() {
  const pegel = await pegelStPauli();
  const hub = pegelHub(pegel);

  return (
    <>
      <HeroBuehne id="start" className={`${s.hero} scroll-mt-20`}>
        {/* Himmel nach Tageszeit, hinter Zeichnung und Text */}
        <div className={s.licht} aria-hidden="true">
          <i className={s.lichtMorgen} />
          <i className={s.lichtAbend} />
          <i className={s.lichtNacht} />
        </div>

        <div className={`${s.copy} mx-auto w-full max-w-6xl px-5 pt-4 sm:px-6 sm:pt-14 lg:pt-16`}>
          <div className="lg:max-w-[31rem] xl:max-w-[35rem]" data-kb="copy">
            {/* Die H1 trägt den Suchbegriff (für Google), der große Satz
                darunter ist die Botschaft (für Menschen). */}
            {/* Am Handy zwei gesetzte Zeilen, ab sm eine Zeile mit Mittelpunkt.
                Der Trenner ist am Handy nur für Screenreader da; der Text
                bleibt Wort für Wort derselbe. */}
            <h1 className="label-mono text-muted-foreground flex items-start gap-3 leading-[1.5] sm:leading-relaxed">
              <span aria-hidden="true" className={s.quadrat} />
              <span className={s.hTitel}>
                <span className="block sm:inline">Website erstellen lassen</span>
                <span className="sr-only sm:not-sr-only"> · </span>
                <span className="block sm:inline">Webdesign aus Hamburg</span>
              </span>
            </h1>
            <p
              className="mt-4 text-balance text-[2.75rem] leading-[0.95] tracking-[-0.04em] sm:mt-8 sm:text-[4rem] lg:text-[3.6rem] xl:text-[4.4rem]"
              style={{ fontStretch: "112%", fontWeight: 790 }}
            >
              {BOTSCHAFT.map((w, i) => (
                <span key={w}>
                  <span className={s.wort}>
                    <span className={s.wortIn} style={{ "--i": i } as CSSProperties}>
                      {w}
                    </span>
                  </span>
                  {i < BOTSCHAFT.length - 1 ? " " : null}
                </span>
              ))}
            </p>
            <p
              className={`${s.folgtText} mt-4 max-w-[33em] text-pretty text-[16px] leading-[1.5] text-[#33383a] sm:mt-8 sm:text-[18px] sm:leading-relaxed`}
              style={{ "--d": "420ms" } as CSSProperties}
            >
              Ein kleines Büro in Hamburg, das bundesweit arbeitet. Den Festpreis kennen Sie vor dem Start, Ihre
              Seite sehen Sie vorher auf einem Test-Link.
            </p>
            {/* Am Handy stehen beide Knöpfe nebeneinander, wenn sie passen
                (ab etwa 384 px), sonst untereinander. */}
            <div
              className={`${s.folgt} ${s.knoepfe} mt-5 flex flex-wrap gap-2 sm:mt-9 sm:gap-3`}
              style={{ "--d": "540ms" } as CSSProperties}
            >
              <Link href="/anfrage" className="btn-signal grow sm:grow-0">
                Anfrage schreiben {ARROW}
              </Link>
              <Link href="#preise" className="btn-line grow sm:grow-0">
                Preise ansehen
              </Link>
            </div>
            <p
              className={`${s.folgt} text-muted-foreground mt-6 hidden flex-wrap gap-x-5 gap-y-3 text-[14px] sm:flex`}
              style={{ "--d": "640ms" } as CSSProperties}
            >
              <NebenLinks />
            </p>
          </div>
        </div>

        {/* Erst nach der Textspalte: Der Absatz (LCP) wird nicht von einem
            Script im Parser aufgehalten, die Zeichnung aber schon im
            Wartezustand gemalt. */}
        <script dangerouslySetInnerHTML={{ __html: AUFTAKT_SCRIPT }} />
        <Containerbruecke hub={hub} />

        {/* Am Rechner steht die Bildunterschrift in der Zeichnung. */}
        <div className={`${s.unterschrift} hidden sm:block`}>
          <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
            <p className={s.caption}>
              <span>Blick von Steinwerder über die Elbe, frei gezeichnet.</span>
              {pegel ? (
                <span
                  className={s.pegel}
                  title="Messwert von PEGELONLINE, Wasserstraßen- und Schifffahrtsverwaltung des Bundes"
                >
                  <span className={s.pegelPunkt} aria-hidden="true" />
                  Pegel St. Pauli: {pegelText(pegel)}, Stand {pegelStand(pegel)} Uhr
                </span>
              ) : null}
            </p>
          </div>
        </div>

        {/* Kopfende: gezeichnete Kaikante statt einer Linie */}
        <div className={s.kaikante} aria-hidden="true" />
      </HeroBuehne>
      {/* Nur am Handy: Bildunterschrift und Nebenlinks als eigener Block
          unter der Kaikante. */}
      <div className={`${s.nebenBlock} px-5 pt-6 pb-10 sm:hidden`}>
        <p className={s.caption}>
          <span>Blick über die Elbe, frei gezeichnet.</span>
          {pegel ? (
            <span
              className={s.pegel}
              title="Messwert von PEGELONLINE, Wasserstraßen- und Schifffahrtsverwaltung des Bundes"
            >
              <span className={s.pegelPunkt} aria-hidden="true" />
              Pegel St. Pauli: {pegelText(pegel)}
            </span>
          ) : null}
        </p>
        <p className="border-border text-muted-foreground mt-4 flex flex-col items-start border-t pt-2 text-[14px]">
          <NebenLinks />
        </p>
      </div>
    </>
  );
}
