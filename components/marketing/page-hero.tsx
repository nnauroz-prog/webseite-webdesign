import { Children, isValidElement } from "react";
import Link from "next/link";

import { MehrLink } from "@/components/marketing/apple/mehr-link";
import { cn } from "@/lib/utils";

/**
 * Seitenkopf der Werkzeug-Seiten (Durchsicht, Termin, Auswahl …):
 * linksbündig wie SeitenKopf der übrigen Unterseiten, Mono-Kennzeile,
 * große Überschrift (title dunkel, accent grau), kurzer grauer
 * Untertitel, darunter Pille + „… ›“-Link. Die Brotkrumen stehen im
 * Fuß (MarketingFooter crumb=…), nicht mehr oben.
 *
 * children: kurzer Text (bis ca. 200 Zeichen) wird Untertitel in
 * 21–24 px. Längere Einleitungen rutschen automatisch unter die
 * Aktionen in normalen 17-px-Fließtext (Wortlaut bleibt), damit der
 * Kopf nie zum Textblock wird.
 *
 * aktionen: Standard ist „Anfrage schreiben“ + „Preise ansehen ›“.
 * false blendet sie aus (Formularseiten), eigene Knoten ersetzen sie.
 *
 * Kontrast: Seiten übergeben in meta teils noch text-stahl-hell bzw.
 * text-background/60 aus der dunklen Zeit; die werden in app/apple.css
 * (.seitenkopf) auf das Apple-Grau gezogen.
 */
export function PageHero({
  eyebrow,
  title,
  accent,
  children,
  meta,
  aktionen,
}: {
  /** Name der Seite – steht jetzt in den Brotkrumen im Fuß. */
  crumb?: string;
  eyebrow: string;
  /** Erster, dunkler Teil der Überschrift. */
  title: string;
  /** Zweiter, grauer Teil der Überschrift. */
  accent?: string;
  /** Einleitender Absatz. */
  children?: React.ReactNode;
  /** Kleine Zeile unter den Aktionen (z. B. Kontaktwege). */
  meta?: React.ReactNode;
  aktionen?: React.ReactNode | false;
}) {
  const lang = children ? textLaenge(children) > 200 : false;
  const knoepfe =
    aktionen === false
      ? null
      : (aktionen ?? (
          <>
            <Link href="/anfrage" className="btn-signal">
              Anfrage schreiben
            </Link>
            <MehrLink href="/pakete" groesse="unter">
              Preise ansehen
            </MehrLink>
          </>
        ));
  return (
    <section className="seitenkopf flaeche-weiss relative">
      {/* Gleiche Breite und Rinne wie der Inhalt der Werkzeug-Seiten
          (max-w-6xl, px-5/6), damit Kopf und Inhalt auf einer Kante stehen. */}
      <div className="mx-auto w-full max-w-6xl px-5 pt-10 pb-12 text-left sm:px-6 sm:pt-14 sm:pb-16 lg:pt-16 lg:pb-20">
        <p className="kennzeile-mono">{eyebrow}</p>
        <h1 className="mt-3 max-w-[18ch] text-[clamp(2.5rem,1.6rem+3.6vw,4.5rem)] leading-[1.05] font-bold tracking-[-0.025em] text-balance text-[#1d1d1f] sm:tracking-[-0.03em]">
          {title}
          {accent ? (
            <>
              {" "}
              <span className="text-muted-foreground">{accent}</span>
            </>
          ) : null}
        </h1>
        {children && !lang ? (
          <p className="t-unter mt-4 sm:mt-5">{children}</p>
        ) : null}
        {knoepfe ? (
          <div className="aktionen mt-7 justify-start sm:mt-8">{knoepfe}</div>
        ) : null}
        {children && lang ? (
          <p
            className={cn(
              "text-muted-foreground max-w-[40em] text-[17px] leading-[1.47] tracking-[-0.022em] text-pretty",
              knoepfe ? "mt-10 sm:mt-12" : "mt-5 sm:mt-6",
            )}
          >
            {children}
          </p>
        ) : null}
        {meta ? (
          <div className="seitenkopf-meta text-muted-foreground mt-6 text-[14px] leading-[1.43]">
            {meta}
          </div>
        ) : null}
      </div>
    </section>
  );
}

/** Ungefähre Zeichenzahl eines React-Knotens (nur Text, rekursiv). */
function textLaenge(knoten: React.ReactNode): number {
  let n = 0;
  Children.forEach(knoten, (k) => {
    if (typeof k === "string" || typeof k === "number") n += String(k).length;
    else if (isValidElement<{ children?: React.ReactNode }>(k))
      n += textLaenge(k.props.children);
  });
  return n;
}
