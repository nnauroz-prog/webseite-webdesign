import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { MehrLink } from "@/components/marketing/apple/mehr-link";
import { cn } from "@/lib/utils";

import b from "./briefkarte.module.css";

/**
 * Briefkarte: gemeinsamer Abschluss der Seiten, als runde Karte (Radius
 * 18/28 px). ton="hell": weiße Karte auf #f5f5f7 (Unterseiten),
 * ton="dunkel": #1d1d1f (Startseite). Aufgebaut wie ein Brief: Mono-
 * Briefkopf mit Absender und Ort, eine sachliche Aussage, dann die
 * Kontaktwege wie Adresszeilen. Die Telefonnummer steht groß in der
 * Systemschrift, schriftlich geht es über /anfrage. Keine E-Mail-Adresse.
 *
 * foto: optional ein letzter Fotomoment in der rechten Kartenhälfte
 * (next/image, lazy). Genau eine gefüllte Pille, daneben höchstens ein
 * Textlink.
 */
export function Briefkarte({
  id = "kontakt",
  title,
  children,
  inquiryHref = "/anfrage",
  knopf = "Anfrage schreiben",
  link,
  ton = "hell",
  foto,
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
  ton?: "hell" | "dunkel";
  /** muster: Gerätefoto mit frei erfundenem Betrieb, bekommt eine Mono-Notiz. */
  foto?: { src: string; alt: string; position?: string; muster?: boolean };
  className?: string;
}) {
  const zweiter = link && link.href !== inquiryHref ? link : null;
  const dunkel = ton === "dunkel";
  return (
    <section
      id={id}
      aria-labelledby={`${id}-titel`}
      className={cn(b.abschnitt, "scroll-mt-24", className)}
    >
      <div className="inhalt">
        <div
          data-ein=""
          className={cn(
            b.brief,
            dunkel && cn("on-dark", b.dunkel),
            foto && b.mitFoto,
          )}
          data-flaeche-dunkel={dunkel ? "" : undefined}
        >
          <div className={b.inhalt}>
            {/* Poststempel: schlägt beim Einblenden der Karte einmal auf.
                Reiner Schmuck der Briefkarte, trägt keinen Inhalt. */}
            <svg
              className={b.stempel}
              viewBox="0 0 150 96"
              aria-hidden="true"
              focusable="false"
            >
              <defs>
                <path id={`${id}-st-oben`} d="M14 48a34 34 0 0 1 68 0" />
                <path id={`${id}-st-unten`} d="M17 50a31 31 0 0 0 62 0" />
              </defs>
              <circle cx="48" cy="48" r="43" />
              <circle cx="48" cy="48" r="26" />
              <text>
                <textPath
                  href={`#${id}-st-oben`}
                  startOffset="50%"
                  textAnchor="middle"
                >
                  HAMBURG
                </textPath>
              </text>
              <text>
                <textPath
                  href={`#${id}-st-unten`}
                  startOffset="50%"
                  textAnchor="middle"
                >
                  SITALO
                </textPath>
              </text>
              <path d="M34 48h28M48 34v28" className={b.stempelKreuz} />
              <path
                d="M95 34q7 -6 14 0t14 0t14 0t13 0M95 48q7 -6 14 0t14 0t14 0t13 0M95 62q7 -6 14 0t14 0t14 0t13 0"
                className={b.stempelWellen}
              />
            </svg>
            <p className={cn("notiz-mono", b.kopf)}>
              <span>Sitalo Webdesign · Hamburg</span>
              <span aria-hidden="true" className="hidden sm:inline">
                Kontor · Anfrage
              </span>
            </p>
            <div className={b.raster}>
              <div className={b.text}>
                <h2 id={`${id}-titel`} className={b.titel}>
                  {title}
                </h2>
                {children ? <p className={b.satz}>{children}</p> : null}
              </div>
              <div className={b.wege}>
                <p className="kennzeile-mono">Telefon</p>
                <a
                  href="tel:+491607621876"
                  className={b.nummer}
                  data-wuerfel=""
                  aria-label="0160 7621876"
                >
                  0160&nbsp;7621876
                </a>
                <dl className={b.liste}>
                  <div>
                    <dt className="notiz-mono">Schriftlich</dt>
                    <dd>
                      <Link href="/anfrage" className={b.listeLink}>
                        Anfrageformular, drei Pflichtfelder
                      </Link>
                    </dd>
                  </div>
                  <div>
                    <dt className="notiz-mono">Antwort</dt>
                    <dd>meist am selben Werktag</dd>
                  </div>
                </dl>
                <div className={b.aktion}>
                  <Link href={inquiryHref} className="btn-signal">
                    {knopf}
                  </Link>
                  {zweiter ? (
                    <MehrLink href={zweiter.href} className={b.zweiter}>
                      {zweiter.label}
                    </MehrLink>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          {foto ? (
            <div className={b.foto} data-para="">
              <Image
                src={foto.src}
                alt={foto.alt}
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 490px, (min-width: 734px) 92vw, 100vw"
                className={b.fotoBild}
                style={
                  foto.position ? { objectPosition: foto.position } : undefined
                }
              />
              {foto.muster ? (
                <p className={cn("notiz-mono", b.fotoNotiz)}>
                  Musterseite, frei erfunden
                </p>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
