import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Containerbruecke } from "@/components/marketing/hafen/containerbruecke";

import s from "./hero.module.css";
import { HeroBuehne } from "./hero-buehne";
import { pegelHub, pegelStand, pegelStPauli, pegelText } from "./pegel";

const ARROW = <ArrowRight className="h-4 w-4" aria-hidden="true" />;

const BOTSCHAFT = ["Wir", "bauen", "Websites", "für", "Betriebe."];

const NEBEN = "hover:text-foreground underline decoration-[var(--border)] underline-offset-4 hover:decoration-current";

function NebenLinks() {
  return (
    <>
      <Link href="/wartung" className={NEBEN}>
        Schon eine Website? Pflege ab 49 € im Monat
      </Link>
      <Link href="/audit" className={NEBEN}>
        Kostenlose Durchsicht Ihrer Website
      </Link>
    </>
  );
}

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

        <div className={`${s.copy} mx-auto w-full max-w-6xl px-5 pt-8 sm:px-6 sm:pt-14 lg:pt-16`}>
          <div className="lg:max-w-[31rem] xl:max-w-[35rem]" data-kb="copy">
            {/* Die H1 trägt den Suchbegriff (für Google), der große Satz
                darunter ist die Botschaft (für Menschen). */}
            <h1 className="label-mono text-muted-foreground flex items-start gap-3 leading-relaxed">
              <span aria-hidden="true" className="bg-gold mt-[5px] inline-block h-2.5 w-2.5 shrink-0" />
              Website erstellen lassen · Webdesign aus Hamburg
            </h1>
            <p
              className="mt-5 text-balance text-[2.75rem] leading-[0.95] tracking-[-0.04em] sm:mt-8 sm:text-[4rem] lg:text-[3.6rem] xl:text-[4.4rem]"
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
              className={`${s.folgt} mt-5 max-w-[33em] text-pretty text-[16.5px] leading-relaxed text-[#33383a] sm:mt-8 sm:text-[18px]`}
              style={{ "--d": "420ms" } as CSSProperties}
            >
              Ein kleines Büro in Hamburg, das bundesweit arbeitet. Den Festpreis kennen Sie vor dem Start, Ihre
              Seite sehen Sie vorher auf einem Test-Link.
            </p>
            <div className={`${s.folgt} mt-6 flex flex-wrap gap-3 sm:mt-9`} style={{ "--d": "540ms" } as CSSProperties}>
              <Link href="/anfrage" className="btn-signal grow sm:grow-0">
                Anfrage schreiben {ARROW}
              </Link>
              <Link href="#preise" className="btn-line grow sm:grow-0">
                Preise ansehen
              </Link>
            </div>
            <p
              className={`${s.folgt} text-muted-foreground mt-6 hidden flex-wrap gap-x-5 gap-y-1.5 text-[14px] sm:flex`}
              style={{ "--d": "640ms" } as CSSProperties}
            >
              <NebenLinks />
            </p>
          </div>
        </div>

        <Containerbruecke hub={hub} />

        <div className={s.unterschrift}>
          <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
            <p className={s.caption}>
              <span className="hidden sm:inline">Blick von Steinwerder über die Elbe, frei gezeichnet.</span>
              <span className="sm:hidden">Steinwerder, frei gezeichnet.</span>
              {pegel ? (
                <span
                  className={s.pegel}
                  title="Messwert von PEGELONLINE, Wasserstraßen- und Schifffahrtsverwaltung des Bundes"
                >
                  <span className={s.pegelPunkt} aria-hidden="true" />
                  Pegel St. Pauli: {pegelText(pegel)}
                  <span className="hidden sm:inline">, Stand {pegelStand(pegel)} Uhr</span>
                </span>
              ) : null}
            </p>
          </div>
        </div>
      </HeroBuehne>
      {/* Nur am Handy: die Nebenlinks unter der Zeichnung. */}
      <p className="text-muted-foreground flex flex-col gap-1.5 px-5 pt-5 pb-8 text-[14px] sm:hidden">
        <NebenLinks />
      </p>
    </>
  );
}
