import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { PageHero } from "@/components/marketing/page-hero";
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

const ARROW = <ArrowRight className="h-4 w-4" aria-hidden="true" />;

const eur = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const stunden = (h: number) => h.toFixed(1).replace(".", ",");

/**
 * `/honorar` — offene Kalkulation.
 *
 * Stundensatz, Aufwand je Paket als Rechenblatt, was wir nicht
 * abrechnen und was zusätzlich kostet. Zahlen aus lib/honorar-data.ts.
 */
export default function HonorarPage() {
  const pakete: HonorarPaket[] = getAllPaketSlugs()
    .map((slug) => honorarPaket(slug as Paket["slug"]))
    .filter((p): p is HonorarPaket => p !== null);

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader tone="dark" />
      <main id="main" tabIndex={-1} className="flex-1">
        <PageHero crumb="Honorar" eyebrow="Offene Kalkulation" title="Unser Honorar, offen vorgerechnet">
          Hier rechnen wir vor, wie unsere Paketpreise zustande kommen, und zeigen, was wir gar nicht abrechnen. Ihr
          Angebot bekommen Sie trotzdem einzeln und schriftlich, bevor wir anfangen.
        </PageHero>
        <Stundensatz />
        <Kalkulation pakete={pakete} />
        <NichtAbgerechnet />
        <Zusatz />
        <Schluss />
      </main>
      <MarketingFooter />
    </div>
  );
}

/* ------------------------------------------------------------------
 * Der Stundensatz als große Zahl, daneben was er abdeckt.
 * ---------------------------------------------------------------- */
function Stundensatz() {
  return (
    <section>
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:items-end lg:gap-8">
        <div className="lg:col-span-5">
          <p className="label-mono text-muted-foreground">Stundensatz, netto</p>
          <p
            className="mt-4 text-[6rem] leading-[0.85] tracking-[-0.05em] sm:text-[9rem]"
            style={{ fontStretch: "118%", fontWeight: 780 }}
          >
            {STUNDENSATZ_EUR} €
          </p>
        </div>
        <div className="text-foreground/85 space-y-5 text-[16.5px] leading-[1.7] lg:col-span-6 lg:col-start-7">
          <h2 className="text-foreground text-[1.6rem] leading-[1.15] tracking-[-0.02em] sm:text-[1.9rem]">
            Von dieser Zahl leiten sich alle Paketpreise ab.
          </h2>
          <p>
            Darin stecken die Arbeitszeit, Lizenzen für unsere Werkzeuge und ein Puffer für die Stunden, die wir nicht
            abrechnen. Welche das sind, steht weiter unten. Das Hosting zahlen Sie getrennt über den Monatsbeitrag.
          </p>
          <p className="text-muted-foreground text-[15.5px]">
            Fahrten innerhalb Hamburgs stellen wir nicht in Rechnung. Liegt das Treffen im Paket Studio außerhalb Hamburgs,
            nennen wir die Reisekosten vorher im Festpreis. Bereitstellungspauschalen gibt es bei uns nicht.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Je Paket ein Rechenblatt: Posten, Stunden, Summe × Stundensatz.
 * ---------------------------------------------------------------- */
function Kalkulation({ pakete }: { pakete: HonorarPaket[] }) {
  return (
    <section id="kalkulation" className="bg-card border-foreground scroll-mt-20 border-t">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
          <h2 className="text-balance text-[2rem] leading-[1.02] tracking-[-0.032em] sm:text-[2.6rem] lg:col-span-7">
            Was in jedem Paket steckt
          </h2>
          <p className="text-muted-foreground max-w-md text-[15.5px] leading-relaxed lg:col-span-5">
            Die Stunden sind unsere Richtwerte je Paket, gerundet auf halbe Stunden. Deshalb weicht die Summe leicht vom
            Paketpreis ab.
          </p>
        </div>
        <nav aria-label="Pakete auf dieser Seite" className="mt-8">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[12.5px]">
            {pakete.map((p) => (
              <li key={p.slug}>
                <a href={`#${p.slug}`} className="hover:text-foreground text-muted-foreground underline decoration-[var(--border)] underline-offset-4 hover:decoration-current">
                  {p.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-10 grid gap-8 md:grid-cols-2 lg:mt-12 lg:gap-x-10 lg:gap-y-12">
          {pakete.map((p) => (
            <Rechenblatt key={p.slug} paket={p} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Rechenblatt({ paket }: { paket: HonorarPaket }) {
  const summe = paket.setupPosten.reduce((acc, p) => acc + p.stunden, 0);
  return (
    <article id={paket.slug} className="bg-background border-border flex scroll-mt-24 flex-col border">
      <header className="border-foreground flex items-baseline justify-between gap-4 border-t-[3px] px-5 pt-4 pb-3 sm:px-6">
        <h3 className="text-[1.35rem] leading-tight tracking-[-0.02em]">
          <Link href={`/pakete/${paket.slug}`} className="hover:underline">
            {paket.name}
          </Link>
        </h3>
        <span className="text-muted-foreground shrink-0 text-[14px]">{paket.setup}</span>
      </header>

      <div className="px-5 sm:px-6">
      <table className="w-full border-collapse text-[14.5px]">
        <caption className="sr-only">Aufbau {paket.name}: Posten und Stunden</caption>
        <thead>
          <tr className="border-border border-b">
            <th scope="col" className="label-mono text-muted-foreground py-2 pr-3 text-left text-[10.5px] font-medium">
              Aufbau
            </th>
            <th scope="col" className="label-mono text-muted-foreground py-2 text-right text-[10.5px] font-medium">
              Stunden
            </th>
          </tr>
        </thead>
        <tbody>
          {paket.setupPosten.map((p) => (
            <tr key={p.label} className="border-border border-b">
              <td className="text-foreground/85 py-2.5 pr-3 leading-snug">{p.label}</td>
              <td className="py-2.5 text-right font-mono text-[13px] whitespace-nowrap">{stunden(p.stunden)} h</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-foreground border-t-2">
            <th scope="row" className="pt-3 pr-3 text-left font-semibold">
              Summe
            </th>
            <td className="pt-3 text-right font-mono text-[13px] font-semibold whitespace-nowrap">{stunden(summe)} h</td>
          </tr>
          <tr>
            <td className="text-muted-foreground pt-1 pb-1 pr-3 text-[13.5px]">
              × {STUNDENSATZ_EUR} € Stundensatz
            </td>
            <td className="serif pt-1 pb-1 text-right text-[1.2rem] whitespace-nowrap">{eur.format(Math.round(summe * STUNDENSATZ_EUR))}</td>
          </tr>
        </tfoot>
      </table>
      </div>

      <div className="border-border mt-5 border-t px-5 pt-4 pb-5 sm:px-6">
        <p className="label-mono text-muted-foreground text-[10.5px]">Monatlich · {paket.monthly}</p>
        <ul className="mt-3 space-y-1.5">
          {paket.monatlichPosten.map((m) => (
            <li key={m} className="text-foreground/85 flex items-start gap-2.5 text-[14px] leading-snug">
              <span aria-hidden="true" className="bg-foreground/60 mt-[7px] inline-block h-1 w-1 shrink-0" />
              <span>{m}</span>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------
 * Was wir nicht abrechnen: dunkle Fläche, ruhige Liste.
 * ---------------------------------------------------------------- */
function NichtAbgerechnet() {
  return (
    <section className="grain bg-foreground text-background">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <h2 className="text-balance text-[2rem] leading-[1.02] tracking-[-0.032em] sm:text-[2.6rem]">Was wir nicht abrechnen</h2>
          <p className="text-stahl-hell mt-5 max-w-md text-[16px] leading-relaxed">
            Diese Stunden stehen auf keiner Rechnung. Wenn Sie eine davon brauchen, fragen Sie einfach.
          </p>
        </div>
        <ul className="border-background/25 border-t lg:col-span-6 lg:col-start-7">
          {NICHT_ABGERECHNET.map((item) => (
            <li key={item} className="border-background/15 text-background/90 border-b py-5 text-[16.5px] leading-[1.6]">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Was zusätzlich kostet, als zweispaltige Liste.
 * ---------------------------------------------------------------- */
function Zusatz() {
  return (
    <section>
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <h2 className="max-w-3xl text-balance text-[2rem] leading-[1.02] tracking-[-0.032em] sm:text-[2.6rem]">
          Was über das Paket hinaus kostet
        </h2>
        <p className="text-muted-foreground mt-5 max-w-xl text-[15.5px] leading-relaxed">
          Den Betrag nennen wir Ihnen, bevor wir anfangen. Manches bieten wir gar nicht an, auch das steht hier.
        </p>
        <dl className="border-foreground mt-10 border-t-[3px] lg:mt-12">
          <div className="border-border hidden grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] gap-8 border-b py-3 sm:grid">
            <dt className="label-mono text-muted-foreground text-[11px]">Posten</dt>
            <dd className="label-mono text-muted-foreground text-[11px]">Abrechnung</dd>
          </div>
          {ZUSATZ_ABGERECHNET.map((row) => (
            <div key={row.posten} className="border-border grid gap-1 border-b py-5 sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] sm:gap-8">
              <dt className="text-[16.5px] leading-snug font-semibold tracking-[-0.01em]">{row.posten}</dt>
              <dd className="text-muted-foreground text-[15px] leading-relaxed">{row.preis}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Schluss: Nachfragen ausdrücklich erwünscht.
 * ---------------------------------------------------------------- */
function Schluss() {
  return (
    <section className="bg-card border-foreground border-t">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:items-end lg:gap-8">
        <div className="lg:col-span-7">
          <h2 className="text-balance text-[2rem] leading-[1.05] tracking-[-0.03em] sm:text-[2.6rem]">
            Fragen Sie nach, wenn Ihnen eine Stundenzahl seltsam vorkommt.
          </h2>
          <p className="text-muted-foreground mt-5 max-w-xl text-[16px] leading-relaxed">
            Wir erklären, woher die Schätzung kommt. Ändern sich Tarife oder Aufwände, passen wir diese Seite an.
            Telefon{" "}
            <a href="tel:+491607621876" className="text-foreground font-semibold whitespace-nowrap underline-offset-4 hover:underline">
              0160 7621876
            </a>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
          <Link href="/termin" className="btn-signal grow sm:grow-0">
            Termin buchen {ARROW}
          </Link>
          <Link href="/pakete" className="btn-line grow sm:grow-0">
            Zu den Paketen
          </Link>
        </div>
      </div>
    </section>
  );
}
