import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { getPaketBySlug } from "@/lib/pakete-data";
import { CONTACT_EMAIL } from "@/lib/site";
import type { VertikalLanding } from "@/lib/vertikal-landings";

/**
 * VerticalLanding: Renderer für die Branchen-Landingpages (/pflege,
 * /praxen). Bewusst anders gebaut als /branchen/[slug]:
 *   - Kopf mit Steckbrief (Paket, Preis, Dauer aus pakete-data) statt Bild
 *   - typische Probleme als Zeitungsseite: Aufmacher und Spalte
 *   - Bauteile als Verzeichnis mit Haarlinien
 *   - Ablauf als Linie mit drei Halten (echte Reihenfolge)
 *   - Fragen offen gesetzt, Frage links, Antwort rechts
 *   - Abschluss als Briefkarte (siehe unten, auch von /branchen und
 *     /standorte genutzt)
 */
const ARROW = <ArrowRight className="h-4 w-4" aria-hidden="true" />;

export function VerticalLanding({
  data,
  faq,
}: {
  data: VertikalLanding;
  /** Fragen aus den Branchen-Daten. Werden offen gesetzt, wenn vorhanden. */
  faq?: { q: string; a: string }[];
}) {
  const inquiryHref = `/anfrage?branche=${data.inquirySlug}&paket=${data.recommendedPackage}`;
  // Dauer kommt aus dem empfohlenen Paket, damit Steckbrief, Ablauf und
  // FAQ derselben Seite dieselbe Zahl nennen.
  const dauer = getPaketBySlug(data.recommendedPackage)?.dauer ?? null;

  return (
    <>
      <Hero data={data} inquiryHref={inquiryHref} dauer={dauer} />
      <Pains data={data} />
      <Bauteile data={data} />
      <Process data={data} dauer={dauer} />
      {faq && faq.length > 0 ? <Faq faq={faq} /> : null}
      <Briefkarte title={joinLine(data.schlussZitat, data.schlussZitatItalic)} inquiryHref={inquiryHref}>
        Für ein erstes Gespräch reicht meist eine Viertelstunde am Telefon. Danach kennen Sie den Festpreis und den
        Termin, an dem die Seite online geht.
      </Briefkarte>
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
  dauer,
}: {
  data: VertikalLanding;
  inquiryHref: string;
  dauer: string | null;
}) {
  const paket = getPaketBySlug(data.recommendedPackage);
  const facts: { k: string; v: string }[] = [];
  if (paket) {
    facts.push({ k: "Paket", v: paket.name });
    facts.push({ k: "Einmalig", v: paket.setup });
    facts.push({ k: "Monatlich", v: paket.monthly.replace(/\s*\/\s*Monat$/, "") });
  }
  if (dauer) facts.push({ k: "Dauer bis online", v: dauer });
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
          {/* Verweis auf die Geldseite; „erstellen lassen" im Ankertext,
              weil die Seite diesen Begriff bundesweit führt. */}
          <p className="border-border border-t px-5 py-3.5 text-[14px] leading-snug">
            <Link
              href="/website-erstellen-lassen"
              className="text-foreground inline-flex items-center gap-1 font-semibold underline decoration-[var(--border)] underline-offset-4 hover:decoration-current"
            >
              Preise und Ablauf: Website erstellen lassen
              <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            </Link>
          </p>
        </aside>
      </div>
    </section>
  );
}

/**
 * Typische Probleme wie eine Zeitungsseite gesetzt: das wichtigste als
 * Aufmacher links, die übrigen als Spalte rechts, getrennt durch eine
 * Spaltenlinie. So stehen nicht drei gleiche Kästen nebeneinander.
 */
function Pains({ data }: { data: VertikalLanding }) {
  const [lead, ...rest] = data.pains;
  if (!lead) return null;
  return (
    <section className="border-border border-b">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <h2 className="max-w-3xl text-balance text-[2.2rem] leading-[1.0] tracking-[-0.032em] sm:text-5xl">
          Woran es meistens hakt
        </h2>
        <div className="border-foreground mt-12 grid border-t-2 sm:mt-16 lg:grid-cols-12">
          <article className="pt-6 pb-8 lg:col-span-7 lg:pr-10 lg:pb-2">
            <h3 className="max-w-xl text-balance text-[26px] leading-[1.06] tracking-[-0.028em] sm:text-[36px] lg:text-[40px]">
              {lead.headline}
            </h3>
            <p className="text-muted-foreground mt-5 max-w-lg text-pretty text-[16.5px] leading-relaxed sm:text-[18px]">
              {lead.body}
            </p>
          </article>
          {rest.length > 0 ? (
            <div className="divide-border border-border divide-y border-t lg:col-span-5 lg:border-t-0 lg:border-l lg:pl-10">
              {rest.map((pain) => (
                <article key={pain.headline} className="py-6">
                  <h3 className="text-balance text-[19px] leading-snug tracking-[-0.015em] sm:text-[20px]">
                    {pain.headline}
                  </h3>
                  <p className="text-muted-foreground mt-2.5 text-pretty text-[15.5px] leading-relaxed">{pain.body}</p>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function Bauteile({ data }: { data: VertikalLanding }) {
  return (
    <section className="bg-card border-border border-b">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:gap-8">
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

function Process({ data, dauer }: { data: VertikalLanding; dauer: string | null }) {
  return (
    <section className="grain bg-foreground text-background">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 className="text-balance text-[2.4rem] leading-[0.98] tracking-[-0.034em] sm:text-6xl lg:col-span-7">
            So läuft es ab
          </h2>
          <p className="text-stahl-hell max-w-md text-[17px] leading-relaxed lg:col-span-4 lg:col-start-9">
            {dauer
              ? `Bis die Seite online ist, vergehen ${dauer}, gezählt ab dem Tag, an dem Fotos und Stichpunkte bei uns sind. `
              : null}
            Wie schnell es geht, hängt vor allem davon ab, wann die Unterlagen kommen.
          </p>
        </div>
        <ol className="border-background/25 mt-14 grid gap-10 border-l pl-7 sm:mt-20 md:grid-cols-3 md:gap-8 md:border-t md:border-l-0 md:pl-0">
          {data.process.map((step) => (
            <li key={step.schritt} className="relative md:pt-8">
              <span
                aria-hidden="true"
                className="bg-gold absolute top-[4px] -left-[34px] h-[11px] w-[11px] md:-top-[6px] md:left-0"
              />
              <p className="label-mono text-gold">{step.schritt}</p>
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
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
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

/**
 * Briefkarte: gemeinsamer Abschluss der Branchen- und Stadtteilseiten.
 * Aufgebaut wie eine Karte aus dem Kontor: Briefkopf mit Absender und
 * Ort, links eine sachliche Aussage zur Seite, rechts die Kontaktwege
 * wie Adresszeilen. Die Telefonnummer steht groß in Tabellenziffern,
 * kein Fragesatz.
 */
export function Briefkarte({
  title,
  children,
  inquiryHref = "/anfrage",
}: {
  /** Aussage der Seite, ein normaler Satz. */
  title: string;
  /** Ein, zwei Sätze darunter. */
  children?: React.ReactNode;
  inquiryHref?: string;
}) {
  return (
    <section className="border-border border-t">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <div className="bg-card border-foreground border">
          <div className="border-border label-mono text-muted-foreground flex items-center justify-between gap-4 border-b px-5 py-3 sm:px-8">
            <span>Sitalo Webdesign</span>
            <span>Hamburg</span>
          </div>
          <div className="grid lg:grid-cols-12">
            <div className="flex flex-col justify-between gap-8 px-5 py-9 sm:px-8 sm:py-12 lg:col-span-7 lg:pr-12">
              <h2 className="max-w-2xl text-balance text-[1.9rem] leading-[1.04] tracking-[-0.03em] sm:text-[2.6rem] lg:text-[2.85rem]">
                {title}
              </h2>
              {children ? (
                <p className="text-muted-foreground max-w-lg text-pretty text-[16.5px] leading-relaxed">{children}</p>
              ) : null}
            </div>
            <div className="border-border border-t px-5 py-9 sm:px-8 sm:py-12 lg:col-span-5 lg:border-t-0 lg:border-l">
              <p className="label-mono text-muted-foreground">Telefon</p>
              <a
                href="tel:+491607621876"
                className="hover:text-gold mt-3 inline-block text-[2.1rem] leading-none tracking-[-0.03em] whitespace-nowrap transition-colors sm:text-[2.6rem]"
                style={{ fontStretch: "118%", fontWeight: 780 }}
              >
                0160&nbsp;7621876
              </a>
              <dl className="border-border mt-7 border-t text-[15px]">
                <div className="border-border flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 border-b py-2.5">
                  <dt className="text-muted-foreground">E-Mail</dt>
                  <dd>
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="font-semibold underline decoration-[var(--border)] underline-offset-4 hover:decoration-current"
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </dd>
                </div>
                <div className="border-border flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 border-b py-2.5">
                  <dt className="text-muted-foreground">Antwort</dt>
                  <dd>meist am selben Werktag</dd>
                </div>
              </dl>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href={inquiryHref} className="btn-signal grow sm:grow-0">
                  Anfrage schreiben {ARROW}
                </Link>
                <Link href="/termin" className="btn-line grow sm:grow-0">
                  Termin buchen
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
