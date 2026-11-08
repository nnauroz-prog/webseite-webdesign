import Link from "next/link";

import { MehrLink } from "@/components/marketing/apple/mehr-link";
import { cn } from "@/lib/utils";

import s from "./laden.module.css";

/**
 * Kopf der Startseite: die H1 (Suchbegriff, unverändert), die große
 * Zeile „Websites.“ mit grauem Satz, die beiden Aktionen (Anfrage als
 * Hauptweg, Preise) und darunter die Telefonnummer als zweiter Weg.
 * Direkt darunter folgt die Kran-Bühne als erstes großes Bild.
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
          <p className={s.kopfTel}>
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
