import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * Apple-Textlink in Orange mit „›“ (.link-chevron, app/apple.css), z. B.
 * „Mehr erfahren ›“. kontext ergänzt für Screenreader, worum es geht
 * (gegen mehrere gleichlautende Links auf einer Seite).
 *
 * frei: freistehend mit 44 px Tippfläche (min-height).
 * groesse: "text" 17 px (Standard), "klein" 14 px in Karten,
 * "unter" 21 px für Hero-Aktionen.
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
    "link-chevron",
    frei && "link-chevron-frei",
    groesse === "klein" && "text-[14px] tracking-[-0.016em]",
    groesse === "text" && "text-[17px] tracking-[-0.022em]",
    groesse === "unter" && "text-[19px] tracking-[-0.012em] sm:text-[21px]",
    className,
  );
  const inhalt = (
    <>
      {children}
      {kontext ? <span className="sr-only"> {kontext}</span> : null}
      <span aria-hidden="true" className="chev">
        ›
      </span>
    </>
  );
  // Anker, tel:, mailto: und externe Ziele ohne next/link.
  if (/^(#|tel:|mailto:|https?:)/.test(href)) {
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
