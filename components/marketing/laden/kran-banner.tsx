import type { ReactNode } from "react";

import { Containerbruecke } from "@/components/marketing/hafen/containerbruecke";
import { AUFTAKT_SCRIPT, PEGEL_QUELLE } from "@/components/marketing/hafen/hafen-hero";
import heroStil from "@/components/marketing/hafen/hero.module.css";
import { HeroBuehne } from "@/components/marketing/hafen/hero-buehne";
import { pegelHub, pegelStand, pegelStPauli, pegelText } from "@/components/marketing/hafen/pegel";
import { cn } from "@/lib/utils";

import s from "./laden.module.css";

/**
 * Kopf-Bühne der Startseite: eine große runde Karte (Radius 18/28 px,
 * Verlauf Weiß nach #f5f5f7) über die Breite des Inhaltsrasters. Links
 * steht der Text (children, aus LadenKopf), rechts die Containerbrücke
 * mit Himmel nach dem Sonnenstand über Hamburg (HeroBuehne,
 * hero-licht.ts), Ladezyklus und hochzählendem Containeretikett. Unten
 * in der Karte die Kaikante als schmales Teerband, vom Radius beschnitten.
 *
 * Ab 1024 px sitzt die Zeichnung bündig am rechten Kartenrand unter dem
 * Text (data-tiefe: beim Scrollen höchstens 24 px zurück, nie bei
 * reduzierter Bewegung). Das Tageslicht liegt nur hinter der Zeichnung,
 * die Textspalte bleibt hell. Darunter Text oben, Zeichnung darunter.
 *
 * Unter der Karte die Bildunterschrift als Mono-Notiz mit dem Pegel
 * St. Pauli live (alle zehn Minuten). Die Zeichnung ist reines Inline-SVG
 * und nicht das LCP-Element.
 */
export async function KranBanner({ children }: { children: ReactNode }) {
  const pegel = await pegelStPauli();
  const hub = pegelHub(pegel);
  return (
    <div className={cn("inhalt", s.kopfAbschnitt)}>
      <HeroBuehne id="start" className={cn(heroStil.hero, s.kopfKarte)}>
        {/* Wartezustand des Auftakts vor dem ersten Bild; braucht die Bühne als Elternteil. */}
        <script dangerouslySetInnerHTML={{ __html: AUFTAKT_SCRIPT }} />
        <div className={cn(heroStil.licht, s.kranLicht)} aria-hidden="true">
          <i className={heroStil.lichtMorgen} />
          <i className={heroStil.lichtAbend} />
          <i className={heroStil.lichtNacht} />
        </div>
        <div className={s.kopfText}>{children}</div>
        <div className={s.kranBild} data-tiefe="">
          <Containerbruecke hub={hub} />
        </div>
        <div className={s.kaikante} aria-hidden="true" />
      </HeroBuehne>
      <p className={cn("notiz-mono", s.kranUnterschrift)}>
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
      </p>
    </div>
  );
}
