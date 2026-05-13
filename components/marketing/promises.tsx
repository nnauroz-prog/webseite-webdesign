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
    title: "Antwort in 24 Stunden.",
    body: "Meistens schneller. Persönlich. Direkt von uns, nicht von einer Support-Hotline.",
  },
  {
    title: "Festpreis vorab — schwarz auf weiß.",
    body: "Bevor wir starten, wissen Sie genau, was es kostet. Keine Nachträge. Kein böses Erwachen.",
  },
  {
    title: "Eine Korrekturrunde, alle Wünsche gesammelt.",
    body: "Sie schicken Ihre Anmerkungen in einer Mail, wir setzen sie sauber um. Kein endloses Hin und Her — weil das nervt, Sie wie uns.",
  },
  {
    title: "Nach dem Launch bleiben wir da.",
    body: "Hosting, Updates, kleine Änderungen — alles über uns. Sie schreiben, wir kümmern uns.",
  },
  {
    title: "Wenn's nicht passt, sagen Sie's.",
    body: "Wir bessern nach, bis es stimmt. Innerhalb des Vereinbarten — ohne kleingedruckte Wenns und Abers.",
  },
];

export function Promises() {
  return (
    <section className="border-border/40 border-t">
      <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.4fr] lg:gap-24">
          <div>
            <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.3em]">
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
              Fünf Zusagen — keine Werbephrasen. Wenn wir eine davon
              nicht halten, sagen Sie's. Wir gleichen aus.
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
