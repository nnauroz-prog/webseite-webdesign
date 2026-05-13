import Link from "next/link";
import { ArrowRight } from "lucide-react";

/**
 * "Was Sie versprochen bekommen" — ehrliche, positiv formulierte
 * Selbst-Zusage. Bewusst keine Konkurrenz-Vergleiche und keine
 * "Garantien" (rechtlich heikel), sondern klar formulierte
 * Erwartungen, die wir auch wirklich halten.
 *
 * Editorial gestaltet: nummerierte Hairline-Liste mit ruhiger
 * Typografie, ohne Sterne oder Pfeil-Icons.
 */
const PROMISES = [
  {
    title: "Ich antworte innerhalb von 24 Stunden.",
    body: "Meistens deutlich schneller. Persönlich, von mir, nicht von einer Hotline.",
  },
  {
    title: "Sie bekommen einen verbindlichen Preis vorab.",
    body: "Schwarz auf weiß, bevor wir starten. Kein böses Erwachen am Ende.",
  },
  {
    title: "Wir korrigieren in einer Runde, sauber.",
    body: "Sie schicken alle Anmerkungen gesammelt, ich setze sie um. Kein endloses Hin und Her.",
  },
  {
    title: "Nach dem Launch bleibe ich Ihr Ansprechpartner.",
    body: "Hosting, Updates, kleine Änderungen — alles über mich. Keine Tickets, keine Hotline.",
  },
  {
    title: "Wenn etwas nicht passt, sagen Sie es.",
    body: "Ich mache nach, bis es stimmt. Im Rahmen des Vereinbarten, ohne Wenn und Aber.",
  },
];

export function Promises() {
  return (
    <section className="border-border/40 border-t">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.4fr] lg:gap-24">
          <div>
            <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.3em]">
              Versprechen
            </p>
            <h2 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
              Was Sie
              <br />
              <span className="serif-italic text-muted-foreground font-normal">
                von mir bekommen.
              </span>
            </h2>
            <p className="text-muted-foreground mt-8 max-w-md text-pretty text-lg leading-relaxed">
              Fünf Dinge, die ich Ihnen zusage. Keine Werbephrasen — nur
              Sachen, die ich auch wirklich halte.
            </p>
            <Link
              href="/anfrage"
              className="bg-foreground text-background hover:bg-foreground/90 group mt-10 inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium tracking-tight transition-all"
            >
              Anfrage starten
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <ol className="divide-border/60 -mt-4 divide-y">
            {PROMISES.map((p, i) => (
              <li key={p.title} className="grid gap-6 py-8 sm:grid-cols-[auto_1fr] sm:gap-10">
                <span className="text-muted-foreground/70 font-mono text-sm tracking-[0.2em]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="text-foreground text-xl font-medium leading-snug tracking-[-0.015em] sm:text-2xl">
                    {p.title}
                  </h3>
                  <p className="text-muted-foreground mt-3 max-w-2xl text-[15px] leading-relaxed sm:text-base">
                    {p.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
