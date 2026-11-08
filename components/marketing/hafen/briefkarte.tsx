import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import a from "./atelier.module.css";

/**
 * Briefkarte: gemeinsamer Abschluss der Unterseiten. Aufgebaut wie eine
 * Karte aus dem Kontor: Mono-Briefkopf mit Absender und Ort, links eine
 * sachliche Aussage zur Seite, rechts die Kontaktwege wie Adresszeilen.
 * Die Telefonnummer steht groß, schriftlich geht es über /anfrage.
 * Keine E-Mail-Adresse, kein Foto.
 *
 * Genau ein gefüllter Knopf (Anfrage), daneben höchstens ein Textlink.
 */
export function Briefkarte({
  id = "kontakt",
  title,
  children,
  inquiryHref = "/anfrage",
  knopf = "Anfrage schreiben",
  link,
  className,
}: {
  id?: string;
  /** Aussage der Seite, ein normaler Satz. */
  title: ReactNode;
  /** Ein, zwei Sätze darunter. */
  children?: ReactNode;
  inquiryHref?: string;
  knopf?: string;
  /** Zweiter Weg als Textlink, z. B. Termin oder Musterseiten. */
  link?: { href: string; label: string } | null;
  className?: string;
}) {
  const zweiter = link && link.href !== inquiryHref ? link : null;
  return (
    <section id={id} aria-labelledby={`${id}-titel`} className={cn(a.briefAbschnitt, "scroll-mt-24", className)}>
      <div className="inhalt">
        <div className={a.brief}>
          <p className={a.briefKopf}>
            <span>Sitalo Webdesign · Hamburg</span>
            <span aria-hidden="true" className="hidden sm:inline">
              Brief Nr. 1
            </span>
          </p>
          <div className={a.briefRaster}>
            <div className={a.briefText}>
              <h2 id={`${id}-titel`} className={a.briefTitel}>
                {title}
              </h2>
              {children ? <p className={a.briefSatz}>{children}</p> : null}
            </div>
            <div className={a.briefWege}>
              <p className={a.eyebrow}>Telefon</p>
              <a href="tel:+491607621876" className={a.briefNummer}>
                0160&nbsp;7621876
              </a>
              <dl className={a.briefListe}>
                <div>
                  <dt>Schriftlich</dt>
                  <dd>
                    <Link href="/anfrage" className="link-pfeil font-semibold">
                      Anfrageformular, drei Pflichtfelder
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt>Antwort</dt>
                  <dd>meist am selben Werktag</dd>
                </div>
              </dl>
              <div className={a.briefAktion}>
                <Link href={inquiryHref} className="btn-signal">
                  {knopf}
                </Link>
                {zweiter ? (
                  <Link href={zweiter.href} className="link-pfeil text-[15px] font-semibold">
                    {zweiter.label}
                  </Link>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
