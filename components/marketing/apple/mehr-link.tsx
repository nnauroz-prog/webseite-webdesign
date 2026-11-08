import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Textlink der Werkstatt: dunkle Schrift, orange Linie, die sich beim
 * Hover von links aufzieht, und ein Pfeil →, der ein Stück nach rechts
 * gleitet (.link-pfeil, app/globals.css). Das letzte Wort und der Pfeil
 * brechen nie getrennt um. kontext ergänzt für Screenreader, worum es
 * geht (gegen mehrere gleichlautende Links auf einer Seite).
 *
 * frei: freistehend mit 44 px Tippfläche.
 * groesse: "text" 17 px (Standard), "klein" 14 px in Karten,
 * "unter" 19/21 px für Kopf-Aktionen.
 */
export function MehrLink({
  href,
  children,
  kontext,
  frei = true,
  groesse = "text",
  className,
}: {
  href: string;
  children: React.ReactNode;
  kontext?: string;
  frei?: boolean;
  groesse?: "text" | "klein" | "unter";
  className?: string;
}) {
  const klassen = cn(
    "link-pfeil font-semibold",
    frei && "inline-block leading-6",
    groesse === "klein" && "text-[14px] tracking-[-0.01em]",
    groesse === "text" && "text-[16px] tracking-[-0.012em]",
    groesse === "unter" && "text-[17px] tracking-[-0.012em] sm:text-[19px]",
    className,
  );
  const inhalt = (
    <>
      {children}
      {/* geschütztes Leerzeichen: Der Pfeil bricht nie allein um. */}
      {" "}
      <span aria-hidden="true" className="pfeil">
        →
      </span>
      {kontext ? <span className="sr-only"> {kontext}</span> : null}
    </>
  );
  // Anker und tel: ohne next/link.
  if (/^(#|tel:|https?:)/.test(href)) {
    return (
      <a href={href} className={klassen}>
        {inhalt}
      </a>
    );
  }
  return (
    <Link href={href} className={klassen}>
      {inhalt}
    </Link>
  );
}
