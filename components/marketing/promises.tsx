import Link from "next/link";
import { ArrowRight, Clock, FileText, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";

/**
 * "Worauf Sie sich verlassen können" — fünf konkrete Zusagen.
 * Bewusst keine Mitbewerber-Vergleiche, keine "Garantien" (rechtlich
 * heikel), sondern klar formulierte Erwartungen, die wir auch wirklich
 * halten.
 *
 * Editorial gestaltet: jede Zusage als eigene Karte mit Serifen-
 * Nummer, ruhigem Icon und Gold-Akzent. Asymmetrisches Layout, damit
 * es sich nicht wie eine Standard-Feature-Liste anfühlt.
 */
const PROMISES = [
  {
    icon: Clock,
    title: "Antwort in 24 Stunden.",
    body: "Meistens schneller. Persönlich. Direkt von uns, nicht von einer Support-Hotline.",
  },
  {
    icon: FileText,
    title: "Festpreis vorab — schwarz auf weiß.",
    body: "Bevor wir starten, wissen Sie genau, was es kostet. Keine Nachträge. Kein böses Erwachen.",
  },
  {
    icon: MessageCircle,
    title: "Eine Korrekturrunde, alle Wünsche gesammelt.",
    body: "Sie schicken Ihre Anmerkungen in einer Mail, wir setzen sie sauber um. Kein endloses Hin und Her — weil das nervt, Sie wie uns.",
  },
  {
    icon: ShieldCheck,
    title: "Nach dem Launch bleiben wir da.",
    body: "Hosting, Updates, kleine Änderungen — alles über uns. Sie schreiben, wir kümmern uns.",
  },
  {
    icon: Sparkles,
    title: "Wenn's nicht passt, sagen Sie's.",
    body: "Wir bessern nach, bis es stimmt. Innerhalb des Vereinbarten — ohne kleingedruckte Wenns und Abers.",
  },
];

export function Promises() {
  return (
    <section className="border-border/40 relative overflow-hidden border-t">
      {/* Dezenter Gold-Halo rechts oben für Brand-Atmosphäre */}
      <div
        aria-hidden="true"
        className="bg-gold/8 pointer-events-none absolute -top-32 right-[-10%] -z-10 h-[28rem] w-[28rem] rounded-full blur-[120px]"
      />
      <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32">
        <div className="max-w-2xl">
          <p className="text-muted-foreground inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em]">
            <span
              aria-hidden="true"
              className="bg-gold inline-block h-1 w-8"
            />
            Unsere fünf Versprechen
          </p>
          <h2 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
            Worauf Sie
            <br />
            <span className="serif-italic text-muted-foreground font-normal">
              sich verlassen können.
            </span>
          </h2>
          <p className="text-muted-foreground mt-8 max-w-md text-pretty text-lg leading-relaxed">
            Fünf Zusagen — keine Werbephrasen. Wenn wir eine davon nicht
            halten, sagen Sie's. Wir gleichen aus.
          </p>
        </div>

        {/* Karten-Grid: asymmetrisch — erste Karte breit, dann 2x2. */}
        <ul className="mt-16 grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {PROMISES.map((p, i) => {
            const Icon = p.icon;
            // Erste Karte spannt auf Desktop über 2 Spalten — größere
            // Bühne für die wichtigste Zusage ("24h Antwort").
            const wide = i === 0;
            return (
              <li
                key={p.title}
                className={
                  wide
                    ? "border-border/60 bg-foreground text-background ring-foreground/10 relative overflow-hidden rounded-3xl border p-7 ring-1 sm:p-9 lg:col-span-2 lg:p-10"
                    : "border-border/60 bg-card/60 ring-foreground/5 relative flex flex-col overflow-hidden rounded-3xl border p-6 ring-1 transition-shadow duration-500 hover:shadow-[0_24px_60px_-30px_rgb(0_0_0/0.25)] sm:p-7"
                }
              >
                {wide ? (
                  <>
                    <div
                      aria-hidden="true"
                      className="bg-gold/15 pointer-events-none absolute -top-20 -right-16 h-72 w-72 rounded-full blur-[80px]"
                    />
                    <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
                      <span className="bg-background/10 text-background relative z-10 inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ring-1 ring-white/10">
                        <Icon className="h-6 w-6" aria-hidden="true" />
                      </span>
                      <div className="relative z-10">
                        <div className="flex items-center gap-3">
                          <span className="serif text-background/30 text-[1.4rem] font-normal leading-none tracking-[-0.04em]">
                            01
                          </span>
                          <span
                            aria-hidden="true"
                            className="bg-background/20 inline-block h-px w-8"
                          />
                          <span className="text-background/55 text-[10px] font-medium uppercase tracking-[0.25em]">
                            Versprechen
                          </span>
                        </div>
                        <h3 className="serif mt-4 text-3xl font-normal leading-[1.15] tracking-[-0.02em] sm:text-4xl">
                          {p.title}
                        </h3>
                        <p className="text-background/75 mt-4 max-w-xl text-pretty text-[15px] leading-relaxed sm:text-base">
                          {p.body}
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start justify-between gap-3">
                      <span className="bg-secondary/60 text-foreground/85 inline-flex h-11 w-11 items-center justify-center rounded-xl">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="serif text-foreground/15 text-[2rem] font-normal leading-none tracking-[-0.04em]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="text-foreground mt-6 text-xl font-medium leading-snug tracking-[-0.015em] sm:text-[1.35rem]">
                      {p.title}
                    </h3>
                    <p className="text-muted-foreground mt-3 text-pretty text-[15px] leading-relaxed">
                      {p.body}
                    </p>
                  </>
                )}
              </li>
            );
          })}
        </ul>

        <div className="mt-14 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Link
            href="/anfrage"
            className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium tracking-tight transition-all"
          >
            Anfrage starten
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/faq"
            className="text-muted-foreground hover:text-foreground inline-flex h-12 items-center text-[14px] font-medium underline-offset-4 hover:underline"
          >
            Häufige Fragen
          </Link>
        </div>
      </div>
    </section>
  );
}
