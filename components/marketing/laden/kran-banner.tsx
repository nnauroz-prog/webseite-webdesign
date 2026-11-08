import Link from "next/link";

import { MehrLink } from "@/components/marketing/apple/mehr-link";
import { Containerbruecke } from "@/components/marketing/hafen/containerbruecke";
import { AUFTAKT_SCRIPT, PEGEL_QUELLE } from "@/components/marketing/hafen/hafen-hero";
import heroStil from "@/components/marketing/hafen/hero.module.css";
import { HeroBuehne } from "@/components/marketing/hafen/hero-buehne";
import { pegelHub, pegelStand, pegelStPauli, pegelText } from "@/components/marketing/hafen/pegel";
import { cn } from "@/lib/utils";

import s from "./laden.module.css";

/**
 * Große Banner-Karte direkt unter der Bildreihe: die Containerbrücke mit
 * Himmel nach Tageszeit (HeroBuehne, Zeitleiste und Auftakt wie bisher
 * im Kopf der Seite), volle Inhaltsbreite. Text oben links: Eyebrow,
 * kurzer Titel, zwei Aktionen. Kein gestreckter Karten-Link: Pille und
 * Link sind eigene Ziele. Unten rechts der Pegel St. Pauli live.
 */
export async function KranBanner() {
  const pegel = await pegelStPauli();
  const hub = pegelHub(pegel);
  return (
    <section className={cn("inhalt", s.bannerAbschnitt)} aria-labelledby="banner-titel">
      <article className={cn(s.karte, s.banner)}>
        <HeroBuehne className={cn(heroStil.hero, s.buehne)}>
          {/* Wartezustand des Auftakts vor dem ersten Bild; braucht die Bühne als Elternteil. */}
          <script dangerouslySetInnerHTML={{ __html: AUFTAKT_SCRIPT }} />
          <div className={heroStil.licht} aria-hidden="true">
            <i className={heroStil.lichtMorgen} />
            <i className={heroStil.lichtAbend} />
            <i className={heroStil.lichtNacht} />
          </div>
          <div className={s.buehneBild}>
            <Containerbruecke hub={hub} />
          </div>
        </HeroBuehne>
        <div className={cn(s.text, s.bannerText)}>
          <p className={s.eyebrow}>Webdesign aus Hamburg</p>
          <h2 id="banner-titel" className={s.titelBanner}>
            Test-Link vor dem Start.
          </h2>
          <p className={s.zeileBanner}>Erst ansehen, dann freigeben.</p>
          <div className={s.bannerAktionen}>
            <Link href="/anfrage" className="btn-signal">
              Anfrage schreiben
            </Link>
            <MehrLink href="/website-erstellen-lassen" frei>
              Preise und Ablauf
            </MehrLink>
          </div>
        </div>
        {pegel ? (
          <p className={s.unterschrift} title={PEGEL_QUELLE}>
            <span className={s.pegelPunkt} aria-hidden="true" />
            Pegel St. Pauli: {pegelText(pegel)}, Stand {pegelStand(pegel)} Uhr
          </p>
        ) : null}
      </article>
    </section>
  );
}
