import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getPaketBySlug } from "@/lib/pakete-data";
import { CONTACT_EMAIL } from "@/lib/site";
import type { VertikalLanding } from "@/lib/vertikal-landings";

/**
 * VerticalLanding: Renderer für die Branchen-Landingpages (/pflege,
 * /praxen). Bewusst anders gebaut als /branchen/[slug]:
 *   - Kopf mit Steckbrief (Paket, Preis, Dauer) statt Bild
 *   - typische Probleme als drei Zeitungsspalten
 *   - Bauteile als Verzeichnis mit Haarlinien
 *   - Ablauf als Linie mit drei Halten (echte Reihenfolge)
 *   - Fragen offen gesetzt, Frage links, Antwort rechts
 *   - Abschluss mit Telefonnummer statt Fragesatz
 */
const ARROW = <ArrowRight className="h-4 w-4" aria-hidden="true" />;

const ZAHLWORT = ["null", "eine", "zwei", "drei", "vier", "fünf", "sechs"];

export function VerticalLanding({
  data,
  faq,
}: {
  data: VertikalLanding;
  /** Fragen aus den Branchen-Daten. Werden offen gesetzt, wenn vorhanden. */
  faq?: { q: string; a: string }[];
}) {
  const inquiryHref = `/anfrage?branche=${data.inquirySlug}&paket=${data.recommendedPackage}`;
  const wochen = ZAHLWORT[data.process.length] ?? String(data.process.length);

  return (
    <>
      <Hero data={data} inquiryHref={inquiryHref} wochen={wochen} />
      <Pains data={data} />
      <Bauteile data={data} />
      <Process data={data} wochen={wochen} />
      {faq && faq.length > 0 ? <Faq faq={faq} /> : null}
      <Closer data={data} inquiryHref={inquiryHref} />
    </>
  );
}

/** Überschrift und optionaler Zusatz als ein Satz, ohne grauen Zweitteil. */
function joinLine(main: string, extra?: string) {
  return extra ? `${main} ${extra}` : main;
}

function Hero({
  data,
  inquiryHref,
  wochen,
}: {
  data: VertikalLanding;
  inquiryHref: string;
  wochen: string;
}) {
  const paket = getPaketBySlug(data.recommendedPackage);
  const facts: { k: string; v: string }[] = [];
  if (paket) {
    facts.push({ k: "Paket", v: paket.name });
    facts.push({ k: "Einmalig", v: paket.setup });
    facts.push({ k: "Monatlich", v: paket.monthly.replace(/\s*\/\s*Monat$/, "") });
  }
  facts.push({ k: "Dauer", v: `etwa ${wochen} Wochen` });
  facts.push({ k: "Vor dem Start", v: "Test-Link für Sie" });

  return (
    <section className="border-border border-b">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 pt-12 pb-16 sm:px-6 sm:pt-16 sm:pb-20 lg:grid-cols-12 lg:gap-8 lg:pt-20 lg:pb-24">
        <div className="min-w-0 lg:col-span-7">
          <p className="label-mono text-muted-foreground">{data.eyebrow}</p>
          <h1 className="mt-6 text-balance text-[2.4rem] leading-[0.98] tracking-[-0.038em] sm:text-6xl lg:text-[4.1rem]">
            {joinLine(data.headline, data.headlineItalic)}
          </h1>
          <p className="mt-6 max-w-xl text-pretty text-[17px] leading-relaxed text-[#33383a] sm:mt-8 sm:text-[18px]">
            {data.subhead}
          </p>
          <div className="mt-8 flex flex-wrap gap-3 sm:mt-9">
            <Link href={inquiryHref} className="btn-signal grow sm:grow-0">
              Anfrage schreiben {ARROW}
            </Link>
            <Link href={`/branchen/${data.brancheSlug}`} className="btn-line grow sm:grow-0">
              Musterseite ansehen
            </Link>
          </div>
        </div>

        <aside className="bg-card border-foreground self-end border-t-2 lg:col-span-4 lg:col-start-9">
          <h2 className="label-mono text-muted-foreground px-5 pt-5">Auf einen Blick</h2>
          <dl className="divide-border mt-2 divide-y px-5 pb-1">
            {facts.map((f) => (
              <div key={f.k} className="flex items-baseline justify-between gap-6 py-3">
                <dt className="text-muted-foreground text-[14px]">{f.k}</dt>
                <dd className="text-right text-[15.5px] font-semibold tabular-nums">{f.v}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  );
}

function Pains({ data }: { data: VertikalLanding }) {
  return (
    <section className="border-border border-b">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
        <h2 className="max-w-3xl text-balance text-[2.2rem] leading-[1.0] tracking-[-0.032em] sm:text-5xl">
          Woran es meistens hakt
        </h2>
        <ul className="mt-12 grid gap-10 sm:mt-16 md:grid-cols-3 md:gap-8">
          {data.pains.map((pain) => (
            <li key={pain.headline} className="border-foreground border-t-2 pt-5">
              <h3 className="text-balance text-[20px] leading-snug tracking-[-0.015em] sm:text-[21px]">
                {pain.headline}
              </h3>
              <p className="text-muted-foreground mt-3 text-pretty text-[15.5px] leading-relaxed">{pain.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Bauteile({ data }: { data: VertikalLanding }) {
  return (
    <section className="bg-card border-border border-b">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-20 sm:px-6 sm:py-28 lg:grid-cols-12 lg:gap-8">
        <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
          <h2 className="text-balance text-[2.2rem] leading-[1.0] tracking-[-0.032em] sm:text-5xl">
            Was auf die Seite kommt
          </h2>
          <p className="text-muted-foreground mt-5 max-w-sm text-[16.5px] leading-relaxed">
            Welche Teile Ihr Betrieb davon braucht, klären wir im ersten Gespräch.
          </p>
        </div>
        <dl className="border-foreground border-t lg:col-span-8">
          {data.bauteile.map((bt) => (
            <div
              key={bt.name}
              className="border-border grid gap-2 border-b py-5 sm:grid-cols-[13rem_1fr] sm:gap-8 sm:py-6"
            >
              <dt className="text-[17px] font-semibold leading-snug tracking-[-0.01em]">{bt.name}</dt>
              <dd className="text-muted-foreground text-pretty text-[15.5px] leading-relaxed">{bt.what}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Process({ data, wochen }: { data: VertikalLanding; wochen: string }) {
  return (
    <section className="grain bg-foreground text-background">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 className="text-balance text-[2.4rem] leading-[0.98] tracking-[-0.034em] sm:text-6xl lg:col-span-7">
            In {wochen} Wochen online
          </h2>
          <p className="text-stahl-hell max-w-md text-[17px] leading-relaxed lg:col-span-4 lg:col-start-9">
            Den Tag, an dem die Seite online geht, legen wir im ersten Gespräch fest.
          </p>
        </div>
        <ol className="border-background/25 mt-14 grid gap-10 border-l pl-7 sm:mt-20 md:grid-cols-3 md:gap-8 md:border-t md:border-l-0 md:pl-0">
          {data.process.map((step) => (
            <li key={step.woche} className="relative md:pt-8">
              <span
                aria-hidden="true"
                className="bg-gold absolute top-[4px] -left-[34px] h-[11px] w-[11px] md:-top-[6px] md:left-0"
              />
              <p className="label-mono text-gold">{step.woche}</p>
              <p className="text-background/85 mt-3 max-w-sm text-pretty text-[16px] leading-relaxed">{step.what}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Faq({ faq }: { faq: { q: string; a: string }[] }) {
  return (
    <section className="border-border border-b">
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
        <h2 className="text-balance text-[2.2rem] leading-[1.0] tracking-[-0.032em] sm:text-5xl">
          Fragen vor dem Auftrag
        </h2>
        <dl className="mt-12 sm:mt-14">
          {faq.map((item) => (
            <div
              key={item.q}
              className="border-foreground grid gap-3 border-t py-6 sm:grid-cols-12 sm:gap-8 sm:py-7"
            >
              <dt className="text-[18px] font-semibold leading-snug tracking-[-0.01em] sm:col-span-5">{item.q}</dt>
              <dd className="text-muted-foreground text-pretty text-[15.5px] leading-relaxed sm:col-span-7">
                {item.a}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Closer({ data, inquiryHref }: { data: VertikalLanding; inquiryHref: string }) {
  return (
    <section className="bg-card border-foreground border-t">
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-20 sm:px-6 sm:py-28 lg:grid-cols-12 lg:items-end lg:gap-8">
        <h2 className="text-balance text-[2.2rem] leading-[1.02] tracking-[-0.032em] sm:text-5xl lg:col-span-7">
          {joinLine(data.schlussZitat, data.schlussZitatItalic)}
        </h2>
        <div className="lg:col-span-4 lg:col-start-9">
          <p className="label-mono text-muted-foreground">Telefon</p>
          <a
            href="tel:+491607621876"
            className="hover:text-gold-ink mt-2 inline-block text-[2.1rem] leading-none tracking-[-0.03em] whitespace-nowrap tabular-nums transition-colors sm:text-[2.5rem]"
            style={{ fontStretch: "115%", fontWeight: 760 }}
          >
            0160 7621876
          </a>
          <p className="text-muted-foreground mt-4 text-[15.5px] leading-relaxed">
            Wir antworten meist am selben Werktag. Schriftlich geht es an{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="text-foreground decoration-gold underline decoration-[1.5px] underline-offset-4"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href={inquiryHref} className="btn-signal grow sm:grow-0">
              Anfrage schreiben {ARROW}
            </Link>
            <Link href="/termin" className="btn-line grow sm:grow-0">
              Gesprächstermin buchen
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
