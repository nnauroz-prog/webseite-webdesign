import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { PageHero } from "@/components/marketing/page-hero";
import { PAKETE, PREIS_HINWEIS_KURZ, getPaketBySlug, type Paket } from "@/lib/pakete-data";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Pakete & Preise — Websites ab 499\u00A0€",
  description:
    "Websites ab 499\u00A0€ einmalig, dazu ab 49\u00A0€ im Monat für Hosting und kleine Änderungen. Den Festpreis bekommen Sie vor Auftrag schriftlich.",
  alternates: { canonical: "/pakete" },
};

type Slug = Paket["slug"];

const STARTER = getPaketBySlug("starter");
const STARTER_SETUP = STARTER?.setup ?? "ab 499\u00A0€";
/** „ab 49 € / Monat" → „ab 49 €" */
const STARTER_MONTHLY = (STARTER?.monthly ?? "ab 49\u00A0€ / Monat").replace(/\s*\/\s*Monat$/, "");

/** „ab 2.499 €" → „2.499 €", „ab 79 € / Monat" → „79 €" */
function betrag(label: string) {
  return label.replace(/^ab\s*/, "").replace(/\s*\/\s*Monat$/, "");
}

const ARROW = <ArrowRight className="h-4 w-4" aria-hidden="true" />;

/** Richtwert bis online aus pakete-data, „meist 5–10 Werktage“. */
function dauer(slug: Slug) {
  return getPaketBySlug(slug)?.dauer ?? "–";
}

function gross(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Vergleich als Tabelle: Pakete sind Spalten, Leistungen sind Zeilen.
 * Preise kommen aus lib/pakete-data.ts, die Zeilen fassen die
 * Leistungslisten dort zusammen. Ein Strich heißt: nicht in diesem Paket.
 * Die Dauer folgt den kanonischen Richtwerten (ab vollständigen
 * Unterlagen), siehe auch pakete-data detailIntro.
 */
const ZEILEN: { label: string; werte: Record<Slug, string> }[] = [
  {
    label: "Umfang",
    werte: {
      starter: "Eine Seite mit allem Wichtigen",
      business: "Bis zu fünf Unterseiten",
      premium: "Eigene Struktur nach Ihrem Bedarf",
      studio: "Bis zu zwölf Bereiche oder Seiten",
    },
  },
  {
    label: "Typisch dabei",
    werte: {
      starter: "Kontaktformular, Anruf-Knopf, Karte und Öffnungszeiten",
      business: "Team mit Fotos, Leistungen, Galerie, Formular für Bewerbung oder Terminanfrage",
      premium: "Formulare für Kontakt, Bewerbung und Online-Buchung",
      studio: "Neues Erscheinungsbild: Schrift, Farben und Bildsprache, bis zu drei Korrekturrunden",
    },
  },
  {
    label: "Inhalte selbst pflegen",
    werte: {
      starter: "–",
      business: "–",
      premium: "Auf Wunsch: Speisekarte, Angebote, Termine",
      studio: "In bis zu zwölf Bereichen",
    },
  },
  {
    label: "Google-Profil und lokale Suche",
    werte: { starter: "–", business: "Richten wir ein", premium: "Richten wir ein", studio: "Richten wir ein" },
  },
  {
    label: "Kleine Änderungen im Monat",
    werte: { starter: "Bis zu 1", business: "Bis zu 3", premium: "Bis zu 6", studio: "Bis zu 10" },
  },
  {
    label: "Dauer bis online",
    werte: {
      starter: gross(dauer("starter")),
      business: gross(dauer("business")),
      premium: gross(dauer("premium")),
      studio: gross(dauer("studio")),
    },
  },
  {
    label: "Persönliches Treffen",
    werte: {
      starter: "In Hamburg auf Wunsch, sonst Telefon oder Video",
      business: "In Hamburg auf Wunsch, sonst Telefon oder Video",
      premium: "In Hamburg auf Wunsch, sonst Telefon oder Video",
      studio: "Vor dem Entwurf, in Hamburg oder bei Ihnen",
    },
  },
];

export default function PaketePage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader tone="dark" />
      <main id="main" tabIndex={-1} className="flex-1">
        <PageHero
          crumb="Pakete"
          eyebrow="Pakete und Preise"
          title={`Website-Pakete ${STARTER_SETUP}`}
          meta={
            <span className="text-stahl-hell font-mono text-[12px]">
              {PREIS_HINWEIS_KURZ} · Mindestlaufzeit 6 Monate
            </span>
          }
        >
          Dazu kommt ein Monatsbeitrag {STARTER_MONTHLY} für
          Hosting, Updates und kleine Änderungen. Den Festpreis bekommen Sie schriftlich, bevor wir anfangen.
        </PageHero>
        <Vergleich />
        <Monatsbeitrag />
        <Weiterlesen />
        <Abschluss />
      </main>
      <MarketingFooter />
    </div>
  );
}

/* ------------------------------------------------------------------
 * Vergleichstabelle. Ab md als echte Tabelle, darunter je Paket ein
 * Block mit denselben Angaben.
 * ---------------------------------------------------------------- */
function Vergleich() {
  return (
    <section id="vergleich" className="scroll-mt-20">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
          <h2 className="text-[2rem] leading-[1.02] tracking-[-0.032em] sm:text-[2.6rem]">Die vier Pakete im Vergleich</h2>
          <p className="text-muted-foreground max-w-md text-[15px] leading-relaxed">
            Wir empfehlen meistens Business. Wenn Starter reicht, sagen wir Ihnen das auch.
          </p>
        </div>

        {/* Tabelle ab md */}
        <div className="mt-10 hidden md:block lg:mt-12">
          <table className="w-full table-fixed border-collapse text-left">
            <caption className="sr-only">Pakete im Vergleich: Preise und Leistungen</caption>
            <colgroup>
              <col className="w-[19%]" />
              <col />
              <col />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr>
                <td className="border-foreground border-t-[3px] pt-4 align-top">
                  <span className="label-mono text-muted-foreground text-[11px]">Paket</span>
                </td>
                {PAKETE.map((p) => (
                  <th
                    key={p.slug}
                    id={p.slug}
                    scope="col"
                    className={`scroll-mt-24 border-t-[3px] px-4 pt-4 pb-2 align-top ${p.highlight ? "border-gold bg-card" : "border-foreground"}`}
                  >
                    <Link href={`/pakete/${p.slug}`} className="text-[1.35rem] leading-tight tracking-[-0.02em] hover:underline lg:text-[1.5rem]" style={{ fontStretch: "110%", fontWeight: 720 }}>
                      {p.name}
                    </Link>
                    {p.highlight ? (
                      <span className="label-mono text-gold mt-1 block text-[10.5px]">Unsere Empfehlung</span>
                    ) : null}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-[14.5px] leading-snug hyphens-auto [hyphenate-limit-chars:14_6_6]">
              <tr className="border-border border-b">
                <th scope="row" className="py-5 pr-4 align-baseline font-semibold">
                  Einmalig
                </th>
                {PAKETE.map((p) => (
                  <td key={p.slug} className={`px-4 py-5 align-baseline ${p.highlight ? "bg-card" : ""}`}>
                    <span className="text-muted-foreground mr-1.5 text-[13px]">ab</span>
                    <span className="serif text-[1.55rem] leading-none tracking-[-0.03em] whitespace-nowrap lg:text-[1.9rem] xl:text-[2.2rem]">
                      {betrag(p.setup)}
                    </span>
                  </td>
                ))}
              </tr>
              <tr className="border-border border-b">
                <th scope="row" className="py-4 pr-4 align-baseline font-semibold">
                  Monatlich
                </th>
                {PAKETE.map((p) => (
                  <td key={p.slug} className={`px-4 py-4 align-baseline ${p.highlight ? "bg-card" : ""}`}>
                    <span className="text-muted-foreground mr-1.5 text-[13px]">ab</span>
                    <span className="serif text-[1.25rem] whitespace-nowrap">{betrag(p.monthly)}</span>
                  </td>
                ))}
              </tr>
              {ZEILEN.map((z) => (
                <tr key={z.label} className="border-border border-b">
                  <th scope="row" className="py-4 pr-4 align-top font-semibold">
                    {z.label}
                  </th>
                  {PAKETE.map((p) => (
                    <td
                      key={p.slug}
                      className={`px-4 py-4 align-top ${p.highlight ? "bg-card" : ""} ${
                        z.werte[p.slug] === "–" ? "text-muted-foreground" : "text-foreground/85"
                      }`}
                    >
                      {z.werte[p.slug]}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="border-border border-b">
                <th scope="row" className="py-4 pr-4 align-top font-semibold">
                  Typisches Projekt
                </th>
                {PAKETE.map((p) => (
                  <td key={p.slug} className={`text-foreground/85 px-4 py-4 align-top ${p.highlight ? "bg-card" : ""}`}>
                    {p.examples[0]}
                  </td>
                ))}
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <td className="pt-6 pr-4 align-top">
                  <span className="text-muted-foreground block text-[13px] leading-snug">Preise zzgl. MwSt.</span>
                  <span className="text-muted-foreground mt-2 block text-[13px] leading-snug">
                    Dauer jeweils ab vollständigen Unterlagen.
                  </span>
                </td>
                {PAKETE.map((p) => (
                  <td key={p.slug} className={`px-4 pt-6 pb-6 align-top ${p.highlight ? "bg-card" : ""}`}>
                    <Link
                      href={`/anfrage?paket=${p.slug}`}
                      className={`${p.highlight ? "btn-signal" : "btn-line"} h-11 w-full px-3 text-[14px]`}
                    >
                      Anfragen {ARROW}
                    </Link>
                    <Link
                      href={`/pakete/${p.slug}`}
                      className="text-muted-foreground hover:text-foreground mt-3 inline-block text-[13.5px] underline decoration-[var(--border)] underline-offset-4 hover:decoration-current"
                    >
                      Alles zu {p.name}
                    </Link>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Mobil: je Paket ein Block */}
        <div className="mt-10 space-y-12 md:hidden">
          {PAKETE.map((p) => (
            <PaketMobil key={p.slug} p={p} />
          ))}
          <p className="text-muted-foreground text-[13px]">
            Preise zzgl. MwSt. Dauer jeweils ab vollständigen Unterlagen.
          </p>
        </div>
      </div>
    </section>
  );
}

/**
 * Ein Paket für schmale Bildschirme. Zeilen, die in diesem Paket nur
 * einen Strich hätten, fasst eine Notiz unter der Liste zusammen; so
 * zeigt jeder Block, was drin ist, und bleibt kurz.
 */
function PaketMobil({ p }: { p: Paket }) {
  const dabei = ZEILEN.filter((z) => z.werte[p.slug] !== "–");
  const spaeter = ZEILEN.filter((z) => z.werte[p.slug] === "–");
  return (
    <article className={`border-t-[3px] pt-4 ${p.highlight ? "border-gold" : "border-foreground"}`}>
      <div className="flex items-baseline justify-between gap-4">
        <h3 className="text-[1.4rem] leading-tight tracking-[-0.02em]">
          <Link href={`/pakete/${p.slug}`}>{p.name}</Link>
        </h3>
        {p.highlight ? <span className="label-mono text-gold shrink-0 text-[10.5px]">Unsere Empfehlung</span> : null}
      </div>
      <p className="mt-3 flex flex-wrap items-baseline gap-x-2">
        <span className="text-muted-foreground text-[13px]">ab</span>
        <span className="serif text-[2.2rem] leading-none tracking-[-0.03em]">{betrag(p.setup)}</span>
        <span className="text-muted-foreground text-[14px]">einmalig, dann ab {betrag(p.monthly)} im Monat</span>
      </p>
      <dl className="border-border mt-5 border-t text-[14.5px]">
        {dabei.map((z) => (
          <div key={z.label} className="border-border grid grid-cols-[8.5rem_minmax(0,1fr)] gap-3 border-b py-3">
            <dt className="text-muted-foreground text-[13.5px]">{z.label}</dt>
            <dd>{z.werte[p.slug]}</dd>
          </div>
        ))}
        <div className="border-border grid grid-cols-[8.5rem_minmax(0,1fr)] gap-3 border-b py-3">
          <dt className="text-muted-foreground text-[13.5px]">Typisches Projekt</dt>
          <dd>{p.examples[0]}</dd>
        </div>
      </dl>
      {spaeter.length > 0 ? (
        <p className="text-muted-foreground mt-3 text-[13.5px] leading-relaxed">
          Erst in einem größeren Paket: {spaeter.map((z) => z.label).join(", ")}.
        </p>
      ) : null}
      <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
        <Link href={`/anfrage?paket=${p.slug}`} className={`${p.highlight ? "btn-signal" : "btn-line"} h-11 text-[14.5px]`}>
          {p.name} anfragen {ARROW}
        </Link>
        <Link href={`/pakete/${p.slug}`} className="text-[14.5px] font-semibold underline-offset-4 hover:underline">
          Alle Details
        </Link>
      </div>
    </article>
  );
}

/* ------------------------------------------------------------------
 * Monatsbeitrag in Klartext.
 * ---------------------------------------------------------------- */
function Monatsbeitrag() {
  return (
    <section className="bg-card border-foreground border-t">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <p className="label-mono text-muted-foreground">Monatsbeitrag · {STARTER_MONTHLY}</p>
          <h2 className="mt-5 text-balance text-[2rem] leading-[1.02] tracking-[-0.032em] sm:text-[2.6rem]">
            Was nach dem Start jeden Monat dazukommt
          </h2>
        </div>
        <div className="text-foreground/85 space-y-5 text-[16.5px] leading-[1.7] lg:col-span-6 lg:col-start-7 lg:pt-1">
          <p>
            Ihre Seite liegt auf einem Server in der EU. Das SSL-Zertifikat verlängert sich von selbst, Sicherheits-Updates
            spielen wir ein. Gesichert wird jeden Tag, die Backups reichen 30 Tage zurück.
          </p>
          <p>
            Kleine Änderungen sind ebenfalls im Beitrag: neue Öffnungszeiten, ein anderes Foto, ein neuer Name im Team.
            Starter hat eine pro Monat, Business drei, Premium sechs und Studio zehn. Sie schicken uns eine Mail, wir setzen
            es um.
          </p>
          <p>
            Domain und E-Mail-Adressen richten wir auf Wunsch mit ein. Größere Erweiterungen beziffern wir vorher. Der Vertrag
            läuft mindestens sechs Monate und ist danach monatlich kündbar.
          </p>
          <p className="pt-1">
            <Link href="/wartung" className="inline-flex items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline">
              Mehr zu Wartung und Pflege {ARROW}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Querverweise zu Empfehlung, Kalkulation und Rechner.
 * ---------------------------------------------------------------- */
const VERWEISE = [
  { href: "/empfehlung", label: "Empfehlung", text: "Fünf Fragen zu Betrieb und Zeitplan, danach schlagen wir ein Paket vor." },
  { href: "/honorar", label: "Kalkulation", text: "Stundensatz und Stunden je Paket: So kommen die Preise zustande." },
  { href: "/rechner", label: "3-Jahres-Rechner", text: "Die Gesamtkosten über drei Jahre neben Wix, Squarespace und Jimdo." },
];

function Weiterlesen() {
  return (
    <section className="border-border border-t">
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
        <ul className="grid gap-x-8 sm:grid-cols-3">
          {VERWEISE.map((v) => (
            <li key={v.href} className="border-border border-t">
              <Link href={v.href} className="group block py-5">
                <span className="label-mono text-muted-foreground text-[11px]">{v.label}</span>
                <span className="mt-2 flex items-start justify-between gap-4 text-[15.5px] leading-snug">
                  <span className="group-hover:underline group-hover:underline-offset-4">{v.text}</span>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Abschluss: Telefonnummer groß, daneben Mail und Anfrage.
 * ---------------------------------------------------------------- */
function Abschluss() {
  return (
    <section className="grain bg-foreground text-background">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:items-end lg:gap-8">
        <div className="lg:col-span-7">
          <h2 className="text-stahl-hell text-balance text-[1.5rem] leading-[1.15] tracking-[-0.02em] sm:text-[1.9rem]">
            Welches Paket passt, klären wir am Telefon.
          </h2>
          <a
            href="tel:+491607621876"
            className="hover:text-gold mt-5 inline-block text-[2.4rem] leading-none tracking-[-0.035em] whitespace-nowrap transition-colors sm:text-[4rem] lg:text-[4.4rem]"
            style={{ fontStretch: "118%", fontWeight: 780 }}
          >
            0160&nbsp;7621876
          </a>
        </div>
        <div className="lg:col-span-4 lg:col-start-9">
          <p className="text-stahl-hell text-[16px] leading-relaxed">
            Wer lieber schreibt, schickt eine Mail oder die Anfrage. Wir antworten meist am selben Werktag.
          </p>
          <a href={`mailto:${CONTACT_EMAIL}`} className="border-gold mt-5 inline-block border-b-[1.5px] pb-0.5 text-[18px] font-semibold">
            {CONTACT_EMAIL}
          </a>
          <div className="mt-7">
            <Link href="/anfrage" className="btn-signal">
              Anfrage schreiben {ARROW}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
