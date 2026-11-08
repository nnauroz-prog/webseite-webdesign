import type { CSSProperties } from "react";
import Link from "next/link";

import { HamburgZeile } from "@/components/marketing/hafen/hamburg-zeile";

import { KranBanner } from "./kran-banner";
import s from "./laden.module.css";

const BOTSCHAFT = ["Wir", "bauen", "Websites", "für", "Betriebe."];

/**
 * Kopf der Startseite in der Kran-Karte (KranBanner). Die H1 trägt den
 * Suchbegriff (für Google) als kleine Mono-Kennzeile mit orangem Punkt,
 * der große Satz darunter ist die Botschaft (für Menschen); seine Wörter
 * steigen einzeln aus einer Maske (nur CSS, nur ohne reduzierte
 * Bewegung). Danach der persönliche Absatz, genau eine Pille, die
 * Telefonnummer als Mono-Textlink und der Gruß nach Tageszeit.
 */
export function LadenKopf() {
  return (
    <KranBanner>
      <h1 id="start-titel" className={`kennzeile-mono ${s.kennzeile}`}>
        <span className={s.kennzeileText}>
          <span className="whitespace-nowrap">Website erstellen lassen ·</span>{" "}
          <span className="whitespace-nowrap">Webdesign aus Hamburg</span>
        </span>
      </h1>
      <p className={s.botschaft}>
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
      <p className={s.absatz}>
        Ein kleines Büro in Hamburg, das bundesweit arbeitet. Den Festpreis kennen Sie vor dem Start, Ihre Seite sehen
        Sie vorher auf einem Test-Link.
      </p>
      <div className={s.aktionen}>
        <Link href="/anfrage" className="btn-signal">
          Anfrage schreiben
        </Link>
        <a href="tel:+491607621876" className={s.telLink}>
          <span className={s.telLabel}>oder anrufen</span>
          <span className={s.telNummer}>0160&nbsp;7621876</span>
        </a>
      </div>
      <HamburgZeile className={`notiz-mono ${s.gruss}`} />
    </KranBanner>
  );
}
