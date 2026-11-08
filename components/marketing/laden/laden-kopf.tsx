import Link from "next/link";

import { MehrLink } from "@/components/marketing/apple/mehr-link";
import { cn } from "@/lib/utils";

import s from "./laden.module.css";

/**
 * Kopf der Startseite wie der Kopf eines Ladens: links die H1 (Such-
 * begriff, unverändert), die große Zeile „Websites.“ mit grauem Satz und
 * die beiden Aktionen (Anfrage als Hauptweg, Preise); rechts zwei kleine
 * Hilfe-Hinweise als reine Textzeilen mit Link. Der Hauptweg ist das
 * Anfrageformular, das Telefon die Alternative.
 */
export function LadenKopf() {
  return (
    <section id="start" className={cn("inhalt", s.kopf)} aria-labelledby="start-titel">
      <div className={s.kopfRaster}>
        <div data-auftritt="titel">
          {/* Zwei Teile, die einzeln nicht umbrechen: bei 320 px zwei Zeilen statt Ausblenden. */}
          <h1 id="start-titel" className={s.kennzeile}>
            <span>Website erstellen lassen ·</span>{" "}
            <span>Webdesign aus Hamburg</span>
          </h1>
          <p className={s.gross}>
            Websites.
            <span className={s.grossGrau}>Für Betriebe. Zum Festpreis.</span>
          </p>
          <div className={s.kopfAktionen}>
            <Link href="/anfrage" className="btn-signal">
              Anfrage schreiben
            </Link>
            <MehrLink href="#preise" frei>
              Preise ansehen
            </MehrLink>
          </div>
        </div>
        <div className={s.hilfe}>
          <p className={s.hilfeZeile}>
            Drei Pflichtfelder, Antwort meist am selben Werktag.{" "}
            <Link href="/anfrage">
              Zum Anfrageformular<span aria-hidden="true"> ›</span>
            </Link>
          </p>
          <p className={s.hilfeZeile}>
            Lieber am Telefon?{" "}
            <a href="tel:+491607621876">
              0160&nbsp;7621876<span aria-hidden="true"> ›</span>
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
