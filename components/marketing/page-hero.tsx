import { Children, isValidElement } from "react";
import Link from "next/link";

import { MehrLink } from "@/components/marketing/apple/mehr-link";
import a from "@/components/marketing/hafen/atelier.module.css";
import { Brotkrumen } from "@/components/marketing/laden/unterseite";
import { cn } from "@/lib/utils";

/**
 * Einheitlicher Seitenkopf für Unterseiten im Atelier-Satz: Papier,
 * linksbündig auf der Satzkante, Mono-Brotkrumen (crumb), Hafenwort in
 * Mono mit orangem Quadrat, breite einfarbige Überschrift (accent mit
 * kleinem orangem Unterstrich),
 * ein Absatz, höchstens ein gefüllter Knopf plus ein Textlink.
 *
 * children: kurzer Text (bis ca. 200 Zeichen) steht direkt unter der
 * H1. Längere Einleitungen rutschen unter die Aktionen in normalen
 * Fließtext (Wortlaut bleibt), damit der Kopf nie zum Textblock wird.
 *
 * aktionen: Standard ist „Anfrage schreiben“ + „Preise ansehen →“.
 * false blendet sie aus (Formularseiten), eigene Knoten ersetzen sie.
 */
export function PageHero({
  crumb,
  eyebrow,
  title,
  accent,
  children,
  meta,
  aktionen,
}: {
  /** Name der Seite in den Mono-Brotkrumen. */
  crumb?: string;
  eyebrow: string;
  /** Erster, dunkler Teil der Überschrift. */
  title: string;
  /** Zweiter Teil der Überschrift, gleiche Farbe, orange unterstrichen. */
  accent?: string;
  /** Einleitender Absatz. */
  children?: React.ReactNode;
  /** Kleine Zeile unter den Aktionen (z. B. Kontaktwege). */
  meta?: React.ReactNode;
  aktionen?: React.ReactNode | false;
}) {
  const lang = children ? textLaenge(children) > 200 : false;
  const knoepfe =
    aktionen === false ? null : (aktionen ?? (
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
    <section className="seitenkopf relative">
      <div className="inhalt pt-5 pb-14 sm:pt-7 sm:pb-[72px] lg:pb-24">
        {crumb ? <Brotkrumen krumen={crumb} /> : null}
        <div className="mt-10 max-w-[48rem] sm:mt-14">
          <p className={a.eyebrow}>{eyebrow}</p>
          <h1 className="mt-5 max-w-[20ch] text-balance text-[clamp(2.4rem,1.6rem+3.4vw,4.1rem)] leading-[1.02] font-[760] tracking-[-0.032em] text-[#1b1d1e] [font-stretch:116%]">
            {title}
            {accent ? (
              <>
                {" "}
                <span className="underline decoration-[var(--gold)] decoration-[0.07em] underline-offset-[0.14em]">{accent}</span>
              </>
            ) : null}
          </h1>
          {children && !lang ? (
            <p className="text-muted-foreground mt-5 max-w-[36em] text-[18px] leading-[1.5] text-pretty sm:mt-6 sm:text-[19px]">
              {children}
            </p>
          ) : null}
          {knoepfe ? <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3 sm:mt-8">{knoepfe}</div> : null}
          {children && lang ? (
            <p
              className={cn(
                "text-muted-foreground max-w-[40em] text-[17px] leading-[1.55] text-pretty",
                knoepfe ? "mt-10 sm:mt-12" : "mt-5 sm:mt-6",
              )}
            >
              {children}
            </p>
          ) : null}
          {meta ? (
            <div className="seitenkopf-meta text-muted-foreground mt-6 font-mono text-[12px] leading-[1.6]">{meta}</div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

/** Ungefähre Zeichenzahl eines React-Knotens (nur Text, rekursiv). */
function textLaenge(knoten: React.ReactNode): number {
  let n = 0;
  Children.forEach(knoten, (k) => {
    if (typeof k === "string" || typeof k === "number") n += String(k).length;
    else if (isValidElement<{ children?: React.ReactNode }>(k)) n += textLaenge(k.props.children);
  });
  return n;
}
