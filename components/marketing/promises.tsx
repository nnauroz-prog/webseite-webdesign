import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * „Worauf Sie sich verlassen können" — Editorial-Long-Form-Prosa
 * statt eines 5-Karten-Grids. Bewusst weniger AI-Template-Rhythmus.
 *
 * Fünf Zusagen werden als zusammenhängender Text mit eingebauten
 * Numeral-Akzenten formuliert, plus ein Pull-Quote in der Mitte
 * als visueller Bruch. Wirkt wie ein redaktioneller Artikel, nicht
 * wie ein Feature-Grid.
 */
export function Promises() {
  return (
    <section className="border-border/40 relative overflow-hidden border-t">
      <div
        aria-hidden="true"
        className="bg-gold/8 pointer-events-none absolute -top-32 right-[-10%] -z-10 h-[28rem] w-[28rem] rounded-full blur-[120px]"
      />
      {/* Marginalia rechts — wie ein redaktioneller Kapitel-Marker
          am Rand einer Buchseite. Nur Desktop. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-6 hidden -translate-y-1/2 lg:block"
      >
        <p
          className="text-muted-foreground/45 font-mono text-[10px] tracking-[0.4em] uppercase"
          style={{
            writingMode: "vertical-rl",
          }}
        >
          § 04 · Die fünf Zusagen
        </p>
      </div>
      <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:py-32">
        <div className="max-w-3xl">
          <p className="text-muted-foreground inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em]">
            <span
              aria-hidden="true"
              className="bg-gold gold-pulse inline-block h-1 w-6"
            />
            Worauf Sie sich verlassen können
          </p>
          <h2 className="mt-6 text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
            Fünf Zusagen.
            <br />
            <span className="serif-italic text-muted-foreground font-normal">
              Kein Kleingedrucktes.
            </span>
          </h2>
        </div>

        <p className="text-foreground/85 mt-14 max-w-3xl text-pretty text-lg leading-[1.6] sm:text-xl sm:leading-[1.55]">
          <span className="serif text-ink-petrol float-left mr-3 text-[5.5rem] leading-[0.85] font-normal tracking-[-0.04em] sm:text-[6.5rem]">
            E
          </span>
          rstens: Sie schreiben uns, und{" "}
          <strong className="text-foreground font-semibold">
            binnen 24 Stunden
          </strong>{" "}
          haben Sie eine Antwort von uns persönlich. Meistens
          deutlich schneller — kein Ticket, kein Support-Chat,
          niemand der „Ihre Anfrage wurde weitergeleitet" schreibt.
          Sie reden direkt mit den Leuten, die Ihre Seite bauen.
        </p>

        <div className="mt-10 grid gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="space-y-6">
            <p className="text-foreground/80 text-pretty text-[16px] leading-[1.7]">
              <strong className="text-ink-petrol font-semibold">
                Zweitens:
              </strong>{" "}
              bevor wir loslegen, wissen Sie genau, was es kostet.
              Festpreis vorab, schwarz auf weiß. Keine Nachträge,
              keine bösen Überraschungen am Ende. Wenn sich der
              Umfang während des Projekts ändert, sprechen wir
              darüber — bevor wir etwas berechnen.
            </p>
            <p className="text-foreground/80 text-pretty text-[16px] leading-[1.7]">
              <strong className="text-ink-petrol font-semibold">
                Drittens:
              </strong>{" "}
              eine saubere Korrekturrunde, gesammelt. Sie gehen die
              Seite in Ruhe durch, schicken uns alle Änderungswünsche
              in einer Mail — nicht zwölf Stück über zwei Wochen
              verteilt. Wir setzen das in einem Rutsch um. Erst dann
              geht die Seite live.
            </p>
          </div>
          <div className="space-y-6">
            <p className="text-foreground/80 text-pretty text-[16px] leading-[1.7]">
              <strong className="text-ink-petrol font-semibold">
                Viertens:
              </strong>{" "}
              nach dem Launch bleiben wir Ihr Ansprechpartner. Für
              Hosting, kleine Änderungen, Erweiterungen. Sie schreiben
              uns eine Mail, wir kümmern uns. Kein Wechsel zwischen
              drei Dienstleistern, kein „dafür sind wir nicht
              zuständig".
            </p>
            <p className="text-foreground/80 text-pretty text-[16px] leading-[1.7]">
              <strong className="text-ink-petrol font-semibold">
                Fünftens:
              </strong>{" "}
              wenn etwas nicht passt, sagen Sie es uns. Wir bessern
              nach, bis es stimmt — innerhalb des Vereinbarten, ohne
              kleingedruckte Wenns und Abers. Wir gewinnen Kunden,
              weil unsere Arbeit passt, nicht weil sie nicht weg
              können.
            </p>
          </div>
        </div>

        <div className="border-ink-petrol/60 mt-16 max-w-4xl border-l-2 pl-6 sm:mt-20 sm:pl-10">
          <p className="serif text-foreground text-balance text-3xl leading-[1.2] tracking-[-0.015em] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
            Eine Website zu bauen ist Vertrauen,
            <br />
            <span className="serif-italic text-muted-foreground">
              keine Software-Lieferung.
            </span>
          </p>
        </div>

        <div className="mt-12 flex flex-col items-start gap-4 sm:mt-14 sm:flex-row sm:items-center">
          <Link
            href="/anfrage"
            className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium tracking-tight transition-all"
          >
            Anfrage starten
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/atelier"
            className="text-muted-foreground hover:text-foreground inline-flex h-12 items-center text-[14px] font-medium underline-offset-4 hover:underline"
          >
            Mehr über das Atelier
          </Link>
        </div>
      </div>
    </section>
  );
}
