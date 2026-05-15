import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * „Sie wissen, was Sie kriegen" — Bento-Spread mit fünf Zusagen
 * als modulare Tiles. Vorher Editorial-Long-Form-Prosa, jetzt
 * Linear-Style Bento-Grid passend zur Hero-Sektion.
 *
 * 12-Spalten-Grid mit asymmetrischer Verteilung — eine große
 * Hero-Tile mit Pull-Quote + Anfrage-CTA, vier kleine Zusagen-
 * Tiles in zwei Reihen.
 */

const ZUSAGEN = [
  {
    n: "01",
    title: "Antwort am selben Tag",
    body: "Spätestens am nächsten Werktag haben Sie uns — persönlich, nicht aus einem Ticket-System.",
  },
  {
    n: "02",
    title: "Festpreis vorab",
    body: "Schwarz auf weiß, keine Nachträge am Ende. Wenn sich was ändert, reden wir vorher drüber.",
  },
  {
    n: "03",
    title: "Eine saubere Korrekturrunde",
    body: "Alles auf einmal, nicht zwölf Mails über zwei Wochen. Wir setzen's in einem Rutsch um.",
  },
  {
    n: "04",
    title: "Nach dem Launch nicht weg",
    body: "Hosting, kleine Änderungen, neue Texte — Sie schreiben uns, wir kümmern uns. Punkt.",
  },
];

export function Promises() {
  return (
    <section className="border-border/40 relative overflow-hidden border-t">
      {/* Atmosphärische Halos — Gold links oben, dezent */}
      <div
        aria-hidden="true"
        className="glow-orb -top-32 -left-32 h-[36rem] w-[36rem] -z-10"
        style={{ background: "oklch(0.85 0.18 85 / 0.10)" }}
      />

      <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:py-32">
        {/* Header zentriert wie Hero-Sektion */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="status-badge">
            <span className="status-badge-dot" aria-hidden="true" />
            <span>Vier Zusagen · kein Kleingedrucktes</span>
          </span>
          <h2 className="mt-7 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl lg:text-[3.75rem] lg:leading-[1.02]">
            Sie wissen, was Sie kriegen.{" "}
            <span className="gradient-gold">Vor der ersten Rechnung.</span>
          </h2>
        </div>

        {/* Bento-Grid: vier Zusagen-Tiles + große Quote-Tile mit CTA */}
        <div className="mt-14 grid grid-cols-12 gap-3 sm:mt-16 sm:gap-4">
          {ZUSAGEN.map((z, i) => (
            <article
              key={z.n}
              className={
                // i=0,3 nimmt 7 Spalten, i=1,2 nimmt 5 — schräge Asymmetrie
                i === 0 || i === 3
                  ? "bento col-span-12 p-6 sm:p-7 lg:col-span-7"
                  : "bento col-span-12 p-6 sm:p-7 lg:col-span-5"
              }
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                {z.n} — Zusage
              </p>
              <h3 className="text-foreground mt-3 text-xl font-semibold tracking-[-0.015em] sm:text-2xl">
                {z.title}
              </h3>
              <p className="text-muted-foreground mt-3 text-pretty text-[14.5px] leading-relaxed">
                {z.body}
              </p>
            </article>
          ))}

          {/* Große Quote-Tile mit CTA — spannt die volle Breite, dunkler
              akzentuiert als die anderen Tiles für visuelle Hierarchie. */}
          <article className="bento relative col-span-12 overflow-hidden p-7 sm:p-9 lg:p-10">
            <div
              aria-hidden="true"
              className="glow-orb -bottom-32 -right-32 h-[24rem] w-[24rem]"
              style={{ background: "oklch(0.78 0.14 215 / 0.10)" }}
            />
            <div className="relative grid items-end gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                  05 — Bottom line
                </p>
                <p className="text-foreground mt-4 text-balance text-2xl font-semibold leading-[1.25] tracking-[-0.02em] sm:text-3xl lg:text-[2.25rem] lg:leading-[1.2]">
                  Am Ende ist das hier kein Software-Projekt.{" "}
                  <span className="gradient-gold">
                    Sondern Vertrauen, das wir nicht verlieren wollen.
                  </span>
                </p>
              </div>
              <div className="flex flex-col items-start gap-3 sm:items-end">
                <Link
                  href="/anfrage"
                  className="bg-gold text-background hover:bg-gold/90 group inline-flex h-12 items-center justify-center rounded-full px-7 text-[15px] font-medium tracking-tight shadow-[0_0_24px_-4px_oklch(0.85_0.18_85/0.4)] transition-all hover:shadow-[0_0_32px_-2px_oklch(0.85_0.18_85/0.6)]"
                >
                  Anfrage senden
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href="/atelier"
                  className="text-muted-foreground hover:text-foreground inline-flex h-10 items-center text-[14px] font-medium underline-offset-4 hover:underline"
                >
                  Mehr über das Atelier →
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
