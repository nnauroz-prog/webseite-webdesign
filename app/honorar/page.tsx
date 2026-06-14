import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import {
  honorarPaket,
  NICHT_ABGERECHNET,
  STUNDENSATZ_EUR,
  ZUSATZ_ABGERECHNET,
  type HonorarPaket,
} from "@/lib/honorar-data";
import { getAllPaketSlugs, type Paket } from "@/lib/pakete-data";

export const metadata: Metadata = {
  title: "Honorar — offen vorgerechnet",
  description:
    "Wie unsere Preise zustande kommen. Stundensatz, Aufwand pro Paket, was im Stundensatz enthalten ist, was nicht abgerechnet wird. Open-Book-Honorar-Modell.",
  alternates: { canonical: "/honorar" },
};

/**
 * `/honorar` — Open-Book-Honorar-Modell.
 *
 * Premium-Geste durch radikale Preis-Transparenz. Andere Agenturen
 * geben keine Stundensätze raus; wir legen Stundensatz, Aufwand
 * pro Paket, Posten-Liste und Nicht-Abgerechnetes komplett offen.
 *
 * Liest sich wie das Notizbuch einer Werkstatt, nicht wie ein
 * Angebot. Bewusst keine Add-on-Tabelle mit Lockpreisen.
 */
export default function HonorarPage() {
  const pakete: HonorarPaket[] = getAllPaketSlugs()
    .map((slug) => honorarPaket(slug as Paket["slug"]))
    .filter((p): p is HonorarPaket => p !== null);

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Honorar" />
      <main id="main" tabIndex={-1} className="flex-1">
        <Hero />
        <Stundensatz />
        {pakete.map((p) => (
          <PaketBlock key={p.slug} paket={p} />
        ))}
        <NichtAbgerechnetBlock />
        <ZusatzBlock />
        <ClosingNote />
      </main>
      <MarketingFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="border-border/40 border-b">
      <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28 lg:py-32">
        <p className="text-muted-foreground inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span
            aria-hidden="true"
            className="bg-gold inline-block h-px w-10"
          />
          Open-Book · Stand Juni 2026
        </p>
        <h1 className="serif text-foreground mt-8 text-balance text-5xl font-normal leading-[0.98] tracking-[-0.02em] sm:text-6xl lg:text-7xl">
          Honorar.
        </h1>
        <p className="serif-italic text-muted-foreground mt-4 text-balance text-3xl leading-snug tracking-[-0.01em] sm:text-4xl">
          Offen vorgerechnet.
        </p>
        <div className="border-foreground/15 mt-12 border-l-2 pl-6">
          <p className="text-foreground/85 text-pretty text-[17px] leading-[1.7]">
            Die meisten Agenturen geben keinen Stundensatz heraus
            und keinen Aufwandsbericht. Wir geben beides. Auf dieser
            Seite steht, wie aus einem Stundensatz und einer
            Stundenzahl die offiziellen Paketpreise werden — und was
            wir bewusst nicht abrechnen, weil es kein Geschäft sein
            soll.
          </p>
          <p className="text-foreground/85 mt-5 text-pretty text-[17px] leading-[1.7]">
            Diese Seite ist kein Angebot. Sie ist ein Notizbuch der
            Werkstatt.
          </p>
        </div>
      </div>
    </section>
  );
}

function Stundensatz() {
  return (
    <section className="border-border/40 border-b">
      <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-24">
        <p className="text-muted-foreground inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span
            aria-hidden="true"
            className="bg-gold inline-block h-px w-10"
          />
          Eine Zahl, von der alles abgeleitet ist
        </p>
        <p className="serif text-foreground mt-8 text-balance text-4xl font-normal leading-[1.05] tracking-[-0.02em] sm:text-5xl">
          Unser Stundensatz beträgt{" "}
          <span className="serif-italic text-gold">
            {STUNDENSATZ_EUR} Euro netto.
          </span>
        </p>
        <p className="text-foreground/85 mt-8 max-w-2xl text-pretty text-[16.5px] leading-[1.65]">
          Diese Zahl ist für Hamburger Verhältnisse weder besonders
          hoch noch besonders niedrig. Sie deckt den eigentlichen
          Arbeitsaufwand, die Werkzeug-Lizenzen, das Hosting, die
          Lebenshaltung in einer mittleren Großstadt — und einen
          kleinen Puffer für die Stunden, die wir kostenlos für
          Beratung und Audits geben (siehe unten).
        </p>
        <p className="text-muted-foreground mt-5 max-w-2xl text-pretty text-[15px] leading-[1.65]">
          Wir rechnen niemals Wegezeit innerhalb Hamburgs, kein
          Reisepauschalen, keine Bereitstellungspauschalen. Wer
          versucht, sich darum zu drücken, hat verstanden, dass die
          eigentlichen Zahlen meist kleiner sind als die Aufschläge.
        </p>
      </div>
    </section>
  );
}

function PaketBlock({ paket }: { paket: HonorarPaket }) {
  const setupSum = paket.setupPosten.reduce((acc, p) => acc + p.stunden, 0);
  return (
    <section
      id={paket.slug}
      className="border-border/40 border-b scroll-mt-20"
    >
      <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-24">
        <p className="text-muted-foreground inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span
            aria-hidden="true"
            className="bg-gold inline-block h-px w-10"
          />
          Paket {paket.name}
        </p>
        <h2 className="serif text-foreground mt-6 text-balance text-4xl font-normal leading-[1.05] tracking-[-0.02em] sm:text-5xl">
          {paket.setup}{" "}
          <span className="serif-italic text-muted-foreground">
            — was darin steckt.
          </span>
        </h2>

        <div className="border-foreground/15 mt-10 border-l-2 pl-6">
          <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.22em]">
            Setup-Aufwand · ca. {paket.stundenSetup} Stunden
          </p>
          <ol className="mt-5 space-y-3">
            {paket.setupPosten.map((p, i) => (
              <li
                key={i}
                className="flex items-baseline justify-between gap-4 text-[15.5px]"
              >
                <span className="text-foreground/85">{p.label}</span>
                <span className="text-muted-foreground font-mono text-[12.5px] tabular-nums shrink-0">
                  {p.stunden.toFixed(1).replace(".", ",")} h
                </span>
              </li>
            ))}
            <li className="border-border/40 mt-4 flex items-baseline justify-between gap-4 border-t pt-4 text-[15.5px] font-medium">
              <span className="text-foreground">Summe</span>
              <span className="text-foreground font-mono text-[13px] tabular-nums shrink-0">
                {setupSum.toFixed(1).replace(".", ",")} h ·{" "}
                {Math.round(setupSum * STUNDENSATZ_EUR)} €
              </span>
            </li>
          </ol>
          <p className="text-muted-foreground mt-4 text-[13.5px] leading-relaxed">
            Die offizielle Zahl auf /pakete ist „{paket.setup}" — die
            Setup-Summe oben weicht typisch leicht ab, weil wir uns
            bei jedem Projekt anders verteilen.
          </p>
        </div>

        <div className="border-foreground/15 mt-10 border-l-2 pl-6">
          <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.22em]">
            Monatlich · {paket.monthly}
          </p>
          <ul className="mt-5 space-y-2.5">
            {paket.monatlichPosten.map((m, i) => (
              <li
                key={i}
                className="text-foreground/85 flex items-start gap-3 text-[15px] leading-relaxed"
              >
                <span
                  aria-hidden="true"
                  className="bg-gold mt-2 inline-block h-1 w-1 shrink-0 rounded-full"
                />
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function NichtAbgerechnetBlock() {
  return (
    <section className="bg-foreground text-background border-foreground/10 border-b">
      <div className="mx-auto w-full max-w-3xl px-6 py-24 sm:py-28">
        <p className="text-background/65 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span
            aria-hidden="true"
            className="bg-gold inline-block h-px w-10"
          />
          Was wir nicht abrechnen
        </p>
        <h2 className="serif mt-8 text-balance text-4xl font-normal leading-[1.05] tracking-[-0.02em] sm:text-5xl">
          Vier Posten, die{" "}
          <span className="serif-italic text-background/65">
            kein Geschäft sein sollen.
          </span>
        </h2>
        <p className="text-background/75 mt-6 max-w-lg text-pretty text-[16px] leading-relaxed">
          Diese Stunden tauchen in keinem Stundenzettel auf, weil sie
          bewusst nicht in den Stundensatz eingerechnet sind. Wenn
          Sie eine davon brauchen, fragen Sie einfach.
        </p>
        <ol className="border-background/15 mt-12 divide-y divide-background/15 border-t border-b">
          {NICHT_ABGERECHNET.map((item, i) => (
            <li
              key={i}
              className="flex items-baseline gap-6 py-6 sm:py-7"
            >
              <span
                aria-hidden="true"
                className="serif-italic text-background/45 text-xl font-normal leading-none tabular-nums w-8"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-background/90 text-pretty text-[16px] leading-[1.65]">
                {item}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ZusatzBlock() {
  return (
    <section className="border-border/40 border-b">
      <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-24">
        <p className="text-muted-foreground inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span
            aria-hidden="true"
            className="bg-gold inline-block h-px w-10"
          />
          Was wir zusätzlich abrechnen
        </p>
        <h2 className="serif text-foreground mt-6 text-balance text-3xl font-normal leading-[1.1] tracking-[-0.02em] sm:text-4xl">
          Über den Paket-Umfang hinaus,{" "}
          <span className="serif-italic text-muted-foreground">
            immer vorab beziffert.
          </span>
        </h2>
        <ol className="divide-border/40 mt-12 divide-y">
          {ZUSATZ_ABGERECHNET.map((row, i) => (
            <li
              key={i}
              className="grid items-baseline gap-2 py-6 sm:grid-cols-[1.4fr_1fr] sm:gap-8 sm:py-7"
            >
              <p className="text-foreground text-[16px] font-medium leading-snug tracking-[-0.01em] sm:text-[17px]">
                {row.posten}
              </p>
              <p className="text-muted-foreground text-[14.5px] leading-relaxed sm:text-right">
                {row.preis}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ClosingNote() {
  return (
    <section>
      <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-24">
        <p className="serif text-foreground text-balance text-3xl font-normal leading-[1.25] tracking-[-0.01em] sm:text-4xl">
          Wenn Sie an einer einzelnen Stundenzahl zweifeln,{" "}
          <span className="serif-italic text-muted-foreground">
            fragen Sie nach.
          </span>
        </p>
        <p className="text-muted-foreground mt-6 max-w-2xl text-pretty text-[15.5px] leading-relaxed">
          Wir erklären gerne, woher die Schätzung kommt. Diese Seite
          aktualisieren wir mit jeder Tarif- oder Aufwandsänderung —
          und merken in der Versionsangabe oben, wann.
        </p>
        <div className="border-border/40 mt-12 flex flex-col gap-4 border-t pt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <Link
            href="/pakete"
            className="text-foreground inline-flex items-center gap-2 text-[14.5px] font-medium underline-offset-[6px] hover:underline"
          >
            Zurück zu den Paketen
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/termin"
            className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-11 items-center gap-2 rounded-full px-5 text-[14px] font-medium tracking-tight"
          >
            30-Minuten-Termin buchen
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
