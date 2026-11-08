import Link from "next/link";

import { cn } from "@/lib/utils";

import { MehrLink } from "./mehr-link";

/**
 * Schwarzer Abschluss vor dem Fuß (Startseite, /pakete): große
 * Überschrift, grauer Satz, Pille + Textlink. Texte kommen von der
 * Seite (vorhandene Sätze), hier nur die Gestalt.
 */
export function Abschluss({
  id = "kontakt",
  titel,
  unter,
  pille = { href: "/anfrage", label: "Anfrage schreiben" },
  link,
  zwischen,
  children,
  className,
  style,
}: {
  id?: string;
  titel: React.ReactNode;
  unter?: React.ReactNode;
  pille?: { href: string; label: string };
  link?: { href: string; label: string };
  /** Zwischen Überschrift und Satz, z. B. die Telefonnummer groß. */
  zwischen?: React.ReactNode;
  /** Zusätzlicher Inhalt unter den Aktionen (z. B. Kontaktzeile). */
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-titel`} style={style} className={cn("flaeche-schwarz abschnitt abschluss", className)}>
      <div className="inhalt abschnitt-kopf">
        <h2 id={`${id}-titel`} className="t-abschnitt" data-auftritt="titel">
          {titel}
        </h2>
        {zwischen ? <div className="mt-6 sm:mt-8">{zwischen}</div> : null}
        {unter ? <p className="t-unter abschluss-unter">{unter}</p> : null}
        <div className="aktionen mt-8">
          <Link href={pille.href} className="btn-signal btn-gross">
            {pille.label}
          </Link>
          {link ? (
            <MehrLink href={link.href} groesse="unter">
              {link.label}
            </MehrLink>
          ) : null}
        </div>
        {children ? <div className="mt-10">{children}</div> : null}
      </div>
    </section>
  );
}
