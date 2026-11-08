import type { CSSProperties } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { HamburgZeile } from "@/components/marketing/hafen/hamburg-zeile";
import s from "@/components/marketing/hafen/start.module.css";

const BOTSCHAFT = ["Wir", "bauen", "Websites", "für", "Betriebe."];

/**
 * Kopf der Startseite. Die H1 trägt den Suchbegriff (für Google) als
 * Mono-Kennzeile mit orangem Quadrat, der große Satz darunter ist die
 * Botschaft (für Menschen); seine Wörter steigen einzeln aus einer
 * Maske (nur CSS, start.module.css). Danach der persönliche Absatz, die
 * Begrüßung nach Tageszeit, genau ein Knopf und die Telefonnummer als
 * Textlink. Im 12er-Raster über 7 Spalten, linksbündig.
 */
export function LadenKopf() {
  return (
    <section id="start" className={`inhalt ${s.kopf}`} aria-labelledby="start-titel">
      <div className={s.kopfText}>
        <h1 id="start-titel" className={s.kennzeile}>
          <span aria-hidden="true" className={s.quadrat} />
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
          Ein kleines Büro in Hamburg, das bundesweit arbeitet. Den Festpreis kennen Sie vor dem Start, Ihre Seite
          sehen Sie vorher auf einem Test-Link.
        </p>
        <div className={s.aktionen}>
          <Link href="/anfrage" className="btn-signal">
            Anfrage schreiben <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <a href="tel:+491607621876" className={s.telLink}>
            <span className={s.telLabel}>oder anrufen</span>
            <span className={s.telNummer}>0160&nbsp;7621876</span>
          </a>
        </div>
        <HamburgZeile className={s.gruss} />
      </div>
    </section>
  );
}
