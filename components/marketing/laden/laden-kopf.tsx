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
        Ein kleines Büro in{" "}
        <Link href="/standorte" className="underline-offset-4 hover:underline">
          Hamburg
        </Link>
        , das bundesweit arbeitet.
      </p>
      {/* Die Zusagen als kleine Marken statt als Fließtext. */}
      <ul role="list" className={s.fakten}>
        <li style={{ "--i": 0 } as CSSProperties}>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M4 12.5 12.5 4H20v7.5L11.5 20z" />
            <circle cx="16" cy="8" r="1.4" />
          </svg>
          Festpreis vor dem Start
        </li>
        <li style={{ "--i": 1 } as CSSProperties}>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          Erst ansehen per Test-Link
        </li>
        <li style={{ "--i": 2 } as CSSProperties}>
          <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
            <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2 2A16 16 0 0 1 4.500 5.500a2 2 0 0 1 2-2z" />
          </svg>
          Sie sprechen mit uns selbst
        </li>
      </ul>
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
