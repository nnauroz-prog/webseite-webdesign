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
          § 04 · Was wir zusagen
        </p>
      </div>
      <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:py-32">
        {/* Bewusst keine Eyebrow-Zeile hier — bricht das gleiche
            Header-Schema, das jede andere Sektion hat. */}
        <div className="max-w-3xl">
          <h2 className="text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl lg:text-[3.75rem] lg:leading-[1.02]">
            Sie wissen, was Sie kriegen. Vor der ersten Rechnung.
          </h2>
        </div>

        <p className="text-foreground/85 mt-14 max-w-3xl text-pretty text-lg leading-[1.6] sm:text-xl sm:leading-[1.55]">
          <span className="serif text-ink-petrol float-left mr-3 text-[5.5rem] leading-[0.85] font-normal tracking-[-0.04em] sm:text-[6.5rem]">
            S
          </span>
          ie schreiben uns. Eine Mail, ein Anruf, was Ihnen lieber
          ist. Spätestens am nächsten Tag haben Sie eine Antwort —
          von uns, nicht von einem Ticket-System. Wir reden mit
          Ihnen, bevor wir irgendwas anfangen. Wenn es passt, gut.
          Wenn nicht, sagen wir's auch.
        </p>

        <div className="mt-10 grid gap-10 sm:gap-12 lg:grid-cols-2 lg:gap-16">
          <p className="text-foreground/80 text-pretty text-[16px] leading-[1.7]">
            Vorher gibt's einen Festpreis, schwarz auf weiß. Eine
            ordentliche Korrekturrunde danach, gesammelt — Sie
            schicken alles auf einmal, wir setzen's in einem Rutsch
            um. Dann geht die Seite live.
          </p>
          <p className="text-foreground/80 text-pretty text-[16px] leading-[1.7]">
            Nach dem Launch sind wir nicht weg. Hosting, kleine
            Änderungen, neue Texte — Sie schreiben uns eine Mail,
            wir kümmern uns. Und wenn was nicht stimmt, sagen Sie's:
            wir bessern nach. Da steht nix Kleingedrucktes, das Sie
            hält.
          </p>
        </div>

        <div className="border-ink-petrol/60 mt-16 max-w-4xl border-l-2 pl-6 sm:mt-20 sm:pl-10">
          <p className="serif text-foreground text-balance text-3xl leading-[1.2] tracking-[-0.015em] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]">
            Am Ende ist das hier kein Software-Projekt.
            <br />
            <span className="serif-italic text-muted-foreground">
              Sondern Vertrauen, das wir nicht verlieren wollen.
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
