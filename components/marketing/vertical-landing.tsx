import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { EditorialEyebrow } from "@/components/marketing/editorial-eyebrow";
import { MagneticButton } from "@/components/marketing/magnetic-button";
import type { VertikalLanding } from "@/lib/vertikal-landings";

/**
 * VerticalLanding — Renderer für die konversion-orientierten
 * Vertikal-Landings (/pflege, /praxen). Bewusst andere Struktur als
 * /branchen/[slug]:
 *   - Hero mit direktem CTA, kein Archive-Breadcrumb
 *   - Pain-first (drei Probleme, die diese Branche kennt)
 *   - Bauteile als knappe Liste, nicht als Feature-Grid
 *   - Prozess als Drei-Wochen-Sequenz mit beobachtbaren Etappen
 *   - Stadtteil-Anker für lokales Vertrauen
 *   - Schluss-Zitat im Serif-Stil
 *
 * Keine emotionalen Atmosphäre-Bilder, kein Karussell, kein Related-
 * Branchen — das gehört aufs /branchen-Archiv. Hier zählt: in 90
 * Sekunden klar, dann CTA.
 */
export function VerticalLanding({
  data,
  faq,
}: {
  data: VertikalLanding;
  /** Optional FAQ aus den Branchen-Daten — wenn vorhanden, wird
   *  zwischen Stadtteilen und Closer eine FAQ-Sektion gerendert.
   *  Quelle: branchen-data.ts via brancheSlug, damit die FAQ-
   *  Antworten einmal gepflegt und mehrfach genutzt werden. */
  faq?: { q: string; a: string }[];
}) {
  const inquiryHref = `/anfrage?branche=${data.inquirySlug}&paket=${data.recommendedPackage}`;

  return (
    <>
      <Hero data={data} inquiryHref={inquiryHref} />
      <Pains data={data} />
      <Bauteile data={data} />
      <Process data={data} />
      <Stadtteile data={data} />
      {faq && faq.length > 0 ? <Faq faq={faq} /> : null}
      <Closer data={data} inquiryHref={inquiryHref} />
    </>
  );
}

function Hero({
  data,
  inquiryHref,
}: {
  data: VertikalLanding;
  inquiryHref: string;
}) {
  return (
    <section className="border-border/40 relative overflow-hidden border-b">
      <div
        aria-hidden="true"
        className="bg-gold/10 pointer-events-none absolute -top-32 -left-20 -z-10 h-[28rem] w-[28rem] rounded-full blur-[60px] sm:blur-[120px]"
      />
      <div className="mx-auto w-full max-w-5xl px-6 pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32">
        <EditorialEyebrow>{data.eyebrow}</EditorialEyebrow>
        <h1 className="mt-6 text-balance text-[2.75rem] font-semibold leading-[1.0] tracking-[-0.035em] sm:text-6xl lg:text-[5.25rem] lg:tracking-[-0.04em]">
          {data.headline}
          {data.headlineItalic && (
            <>
              <br />
              <span className="serif-italic text-muted-foreground font-normal">
                {data.headlineItalic}
              </span>
            </>
          )}
        </h1>
        <p className="text-foreground/80 mt-8 max-w-2xl text-pretty text-lg leading-relaxed sm:text-xl">
          {data.subhead}
        </p>
        <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
          <MagneticButton
            href={inquiryHref}
            className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium tracking-tight"
          >
            Website anfragen
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </MagneticButton>
          <Link
            href={`/branchen/${data.brancheSlug}`}
            className="text-foreground inline-flex h-12 items-center text-[15px] font-medium underline-offset-[6px] hover:underline"
          >
            Alle Details ansehen
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Pains({ data }: { data: VertikalLanding }) {
  return (
    <section className="border-border/40 border-b">
      <div className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-28">
        <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.3em]">
          Drei Probleme, die wir oft hören
        </p>
        <h2 className="mt-6 text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-4xl lg:text-5xl">
          Woran es meistens hakt.
        </h2>
        <ol className="divide-border/60 mt-12 divide-y">
          {data.pains.map((pain, i) => (
            <li key={pain.headline} className="grid gap-4 py-8 sm:grid-cols-[3rem_1fr] sm:gap-8 sm:py-10">
              <p className="text-muted-foreground/80 font-mono text-[11px] uppercase tracking-[0.2em]">
                {String(i + 1).padStart(2, "0")}
              </p>
              <div>
                <h3 className="text-foreground text-xl font-semibold tracking-[-0.015em] sm:text-2xl">
                  {pain.headline}
                </h3>
                <p className="text-foreground/75 mt-3 max-w-2xl text-pretty text-[15.5px] leading-relaxed sm:text-base">
                  {pain.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Bauteile({ data }: { data: VertikalLanding }) {
  return (
    <section className="border-border/40 border-b">
      <div className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-28">
        <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.3em]">
          Was wir bauen
        </p>
        <h2 className="mt-6 text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-4xl lg:text-5xl">
          Die Bauteile,
          <br />
          <span className="serif-italic text-muted-foreground font-normal">
            konkret.
          </span>
        </h2>
        <ul className="divide-border/60 mt-12 divide-y">
          {data.bauteile.map((bt) => (
            <li key={bt.name} className="grid gap-3 py-6 sm:grid-cols-[14rem_1fr] sm:gap-8 sm:py-7">
              <p className="text-foreground text-[16px] font-medium tracking-[-0.005em] sm:text-[17px]">
                {bt.name}
              </p>
              <p className="text-foreground/75 max-w-2xl text-pretty text-[15px] leading-relaxed">
                {bt.what}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Process({ data }: { data: VertikalLanding }) {
  return (
    <section className="bg-secondary/40 border-border/40 border-b">
      <div className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-28">
        <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.3em]">
          So läuft das ab
        </p>
        <h2 className="mt-6 text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-4xl lg:text-5xl">
          Drei Wochen,
          <br />
          <span className="serif-italic text-muted-foreground font-normal">
            beobachtbar.
          </span>
        </h2>
        <ol className="mt-12 grid gap-6 sm:grid-cols-3">
          {data.process.map((step) => (
            <li
              key={step.woche}
              className="border-border/60 bg-card/60 ring-foreground/5 rounded-2xl border p-6 ring-1"
            >
              <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.25em]">
                {step.woche}
              </p>
              <p className="text-foreground/85 mt-3 text-pretty text-[15px] leading-relaxed">
                {step.what}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Stadtteile({ data }: { data: VertikalLanding }) {
  return (
    <section className="border-border/40 border-b">
      <div className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-24">
        <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.3em]">
          Hamburg-Anker
        </p>
        <h2 className="mt-6 text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-4xl">
          Stadtteile, in denen wir
          <br />
          <span className="serif-italic text-muted-foreground font-normal">
            schon gearbeitet haben.
          </span>
        </h2>
        <ul className="mt-10 flex flex-wrap gap-2.5">
          {data.stadtteile.map((s) => (
            <li
              key={s}
              className="border-border/60 text-foreground/80 inline-flex h-9 items-center rounded-full border px-4 text-[14px]"
            >
              {s}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Faq({ faq }: { faq: { q: string; a: string }[] }) {
  return (
    <section className="border-border/40 border-b">
      <div className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-28">
        <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.3em]">
          Häufige Fragen
        </p>
        <h2 className="mt-6 text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-4xl lg:text-5xl">
          Was Inhaber typischerweise fragen.
        </h2>
        <dl className="divide-border/60 mt-12 divide-y">
          {faq.map((item) => (
            <details key={item.q} className="group py-6">
              <summary className="text-foreground flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-medium tracking-[-0.01em] sm:text-xl">
                {item.q}
                <span className="text-muted-foreground transition-transform group-open:rotate-45">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.5}
                    className="h-5 w-5"
                    aria-hidden="true"
                  >
                    <path d="M12 5v14M5 12h14" strokeLinecap="round" />
                  </svg>
                </span>
              </summary>
              <p className="text-muted-foreground mt-4 max-w-2xl text-pretty text-[15px] leading-relaxed">
                {item.a}
              </p>
            </details>
          ))}
        </dl>
      </div>
    </section>
  );
}

function Closer({
  data,
  inquiryHref,
}: {
  data: VertikalLanding;
  inquiryHref: string;
}) {
  return (
    <section>
      <div className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-28">
        <div className="border-ink-petrol/60 max-w-3xl border-l-2 pl-6 sm:pl-10">
          <p className="serif text-foreground text-balance text-3xl leading-[1.2] tracking-[-0.015em] sm:text-4xl lg:text-5xl">
            {data.schlussZitat}
            {data.schlussZitatItalic && (
              <>
                <br />
                <span className="serif-italic text-muted-foreground">
                  {data.schlussZitatItalic}
                </span>
              </>
            )}
          </p>
        </div>
        <div className="mt-12 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Link
            href={inquiryHref}
            className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-14 items-center rounded-full px-8 text-base font-medium tracking-tight transition-all"
          >
            Website anfragen
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/sprechstunde"
            className="text-foreground inline-flex h-14 items-center text-[15px] font-medium underline-offset-[6px] hover:underline"
          >
            Lieber kurz telefonieren
          </Link>
        </div>
      </div>
    </section>
  );
}
