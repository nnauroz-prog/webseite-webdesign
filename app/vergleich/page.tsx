import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Minus, X } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { EditorialEyebrow } from "@/components/marketing/editorial-eyebrow";

export const metadata: Metadata = {
  title: "Vergleich — Wix, Squarespace, Jimdo, Eigenbau mit KI",
  description:
    "Ehrlicher Vergleich: Wann lohnt sich ein Baukasten, wann KI-Eigenbau, wann ein Atelier wie Sitalo. Für lokale Unternehmen in Deutschland.",
  alternates: { canonical: "/vergleich" },
};

/**
 * `/vergleich` — ausgebaute Vergleichsseite.
 *
 * Tiefer als die alte BaukastenComparison-Komponente: vergleicht
 * Sitalo gegen Wix, Squarespace, Jimdo UND „Selbst mit ChatGPT/
 * Cursor". Letzteres ist der zeitgenössische Wettbewerber, den
 * andere Agenturen ignorieren.
 *
 * Ehrlich gerahmt: wir sind nicht für jeden besser. Wir sagen
 * jedem Profil ehrlich, welche Option zu ihm passt — auch wenn
 * das Sitalo ist nicht ist.
 */
export default function VergleichPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Vergleich" />
      <main id="main" tabIndex={-1} className="flex-1">
        <Hero />
        <QuickGuide />
        <DeepDives />
        <TableSummary />
        <FinalCta />
      </main>
      <MarketingFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="bg-gold/10 pointer-events-none absolute -top-32 left-1/2 -z-10 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full blur-[60px] sm:blur-[120px]"
      />
      <div className="mx-auto w-full max-w-7xl px-6 pt-16 pb-12 text-center sm:pt-28 sm:pb-16 lg:pt-36">
        <EditorialEyebrow>Ehrlicher Vergleich</EditorialEyebrow>
        <h1 className="mx-auto mt-6 max-w-4xl text-balance text-5xl font-semibold leading-[1.0] tracking-[-0.04em] sm:text-7xl lg:text-[5.5rem]">
          Was passt zu Ihnen,
          <br />
          <span className="serif-italic text-muted-foreground font-normal">
            was nicht.
          </span>
        </h1>
        <p className="text-muted-foreground mx-auto mt-8 max-w-2xl text-pretty text-lg leading-relaxed sm:text-xl">
          Wir sind nicht für jeden die richtige Wahl. Hier steht
          ehrlich, wann ein Baukasten reicht, wann ChatGPT-Eigenbau
          eine Option ist — und wann ein Atelier wie unseres
          tatsächlich Sinn ergibt.
        </p>
      </div>
    </section>
  );
}

function QuickGuide() {
  return (
    <section className="border-border/40 border-t">
      <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-24">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <QuickCard
            label="Wix oder Squarespace"
            condition="Wenn Sie viel Zeit haben und es Spaß macht."
            detail="Werkzeuge zum Selbstbauen. Günstig, wenn Sie Stunden investieren wollen — auf Mobile, SEO, Texten, Bildern."
          />
          <QuickCard
            label="ChatGPT oder Cursor"
            condition="Wenn Sie technisch sind und gerne basteln."
            detail="Mit KI kommen Sie weiter als noch vor zwei Jahren. Sie brauchen aber jemanden, der Domains, Hosting, DSGVO, Mobile-Tests und Updates macht."
          />
          <QuickCard
            label="Sitalo (wir)"
            highlight
            condition="Wenn Sie Ihren Laden führen wollen, nicht Ihre Seite."
            detail="Drei Sachen schicken, fertig. Person für Person, kein Funnel. Mobile, SEO, Updates, Hosting — alles aus einer Hand."
          />
        </div>
      </div>
    </section>
  );
}

function QuickCard({
  label,
  condition,
  detail,
  highlight,
}: {
  label: string;
  condition: string;
  detail: string;
  highlight?: boolean;
}) {
  return (
    <article
      className={`flex flex-col gap-4 rounded-3xl border p-7 ${
        highlight
          ? "bg-foreground text-background border-foreground"
          : "border-border/60 bg-card/60"
      }`}
    >
      <p
        className={`font-mono text-[10px] uppercase tracking-[0.22em] ${
          highlight ? "text-background/65" : "text-muted-foreground"
        }`}
      >
        {label}
      </p>
      <p className="serif text-2xl leading-snug tracking-[-0.01em]">
        {condition}
      </p>
      <p
        className={`text-[14.5px] leading-relaxed ${
          highlight ? "text-background/75" : "text-foreground/75"
        }`}
      >
        {detail}
      </p>
    </article>
  );
}

type DeepDive = {
  id: string;
  label: string;
  tagline: string;
  goodFor: string[];
  watchOut: string[];
  realCost: string;
};

const DEEP_DIVES: DeepDive[] = [
  {
    id: "wix",
    label: "Wix",
    tagline: "Baukasten mit großer Vorlagen-Bibliothek.",
    goodFor: [
      "Einzelpersonen, die ihre Seite selbst bauen wollen",
      "Sehr einfache Visitenkarten-Seiten",
      "Wenn Sie SEO und Mobil-Optimierung selbst lernen möchten",
    ],
    watchOut: [
      "Migration weg von Wix ist aufwändig — Sie sind langfristig gebunden",
      "Performance auf Mobile oft Mittelmaß, was lokale SEO bremst",
      "Templates sehen schnell nach Wix-Template aus",
    ],
    realCost:
      "Ab ca. 15 € / Monat. Realistischer Mehraufwand: 10–40 Stunden Eigenarbeit für Aufbau, Pflege monatlich 1–3 Stunden — je nachdem wie oft sich was ändert.",
  },
  {
    id: "squarespace",
    label: "Squarespace",
    tagline: "Visuell stärker als Wix, schwächer in DE-Spezifika.",
    goodFor: [
      "Portfolios (Fotografen, Designer, Architekten)",
      "Wenn Ihnen Optik wichtiger ist als Konfigurierbarkeit",
      "Wenn Sie mit englischen Hilfe-Artikeln klarkommen",
    ],
    watchOut: [
      "Deutsche Lokalisierung lückenhaft (Impressum, AGB, Datenschutz)",
      "Support komplett auf Englisch, Zeitzone US",
      "Mobile-Eingaben (Telefon, Routen, Speisekarten) erfordern Eigenleistung",
    ],
    realCost:
      "Ab ca. 16 € / Monat. Im Vergleich zu Wix etwas weniger Pflegeaufwand, aber dafür höherer Initialaufwand für die deutsche Rechts-Konformität.",
  },
  {
    id: "jimdo",
    label: "Jimdo",
    tagline: "Deutschestes Baukasten-System, aber technisch eingeschränkt.",
    goodFor: [
      "Sehr kleine lokale Betriebe (Friseur, Bäckerei) mit einfachem Bedarf",
      "Wenn Sie DSGVO-Standardtexte direkt aus dem System brauchen",
      "Wenn Sie KI-gestützten Aufbau ausprobieren möchten",
    ],
    watchOut: [
      "Layouts wirken oft veraltet, Mobile-Erlebnis weniger ausgereift",
      "Wenig Spielraum für eigene Identität — alle Jimdo-Seiten ähneln sich",
      "Migration weg ist schwer, Code-Export limitiert",
    ],
    realCost:
      "Ab ca. 9 € / Monat. Günstigster Einstieg, aber begrenzte Decke nach oben.",
  },
  {
    id: "ki-eigenbau",
    label: "ChatGPT oder Cursor (KI-Eigenbau)",
    tagline: "Die ehrliche Neue: Sie schreiben Prompts, KI baut.",
    goodFor: [
      "Tech-affine Inhaber, die Spaß am Basteln haben",
      "Schnelle Prototypen, MVP-Phase",
      "Wenn Sie Code lesen können oder lernen wollen",
    ],
    watchOut: [
      "Domain, Hosting, SSL, DSGVO, E-Mail-Routing — alles weiterhin manuell",
      "Updates und Security-Patches sind Ihre Verantwortung",
      "KI-Output ist oft Bauchgefühl ohne Mobil- und SEO-Reflex; Tests fehlen meist",
      "Wenn die Seite live geht und etwas bricht, gibt es niemanden, den Sie anrufen können",
    ],
    realCost:
      "Tool-Kosten ca. 0–30 € / Monat. Realistisch: 30–80 Stunden Lernzeit + laufender Pflegeaufwand. Risiko-Faktor: hoch, wenn die Seite kritisch fürs Geschäft ist.",
  },
];

function DeepDives() {
  return (
    <section className="border-border/40 border-t">
      <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-24">
        <div className="mb-12 max-w-3xl">
          <p className="text-muted-foreground inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] sm:text-[11px]">
            <span
              aria-hidden="true"
              className="bg-gold gold-pulse inline-block h-1 w-6"
            />
            Die vier Alternativen im Detail
          </p>
          <h2 className="mt-6 text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl">
            Wie wir die Konkurrenz
            <br />
            <span className="serif-italic text-muted-foreground font-normal">
              ehrlich einschätzen.
            </span>
          </h2>
        </div>

        <div className="space-y-16 sm:space-y-20">
          {DEEP_DIVES.map((d) => (
            <DeepDiveBlock key={d.id} d={d} />
          ))}
        </div>
      </div>
    </section>
  );
}

function DeepDiveBlock({ d }: { d: DeepDive }) {
  return (
    <article id={d.id} className="scroll-mt-24">
      <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-16">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.22em]">
            Alternative
          </p>
          <h3 className="mt-3 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
            {d.label}
          </h3>
          <p className="text-foreground/75 mt-3 text-pretty text-[15.5px] leading-relaxed">
            {d.tagline}
          </p>
        </div>
        <div className="space-y-6">
          <Block title="Wofür gut" icon="check">
            <ul className="space-y-2.5">
              {d.goodFor.map((p) => (
                <li
                  key={p}
                  className="text-foreground/85 flex items-start gap-3 text-[14.5px] leading-relaxed"
                >
                  <Check className="text-foreground/70 mt-1 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </Block>
          <Block title="Worauf achten" icon="minus">
            <ul className="space-y-2.5">
              {d.watchOut.map((p) => (
                <li
                  key={p}
                  className="text-foreground/75 flex items-start gap-3 text-[14.5px] leading-relaxed"
                >
                  <Minus className="text-muted-foreground/70 mt-1 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </Block>
          <Block title="Realistische Kosten">
            <p className="text-foreground/80 text-[14.5px] leading-relaxed">
              {d.realCost}
            </p>
          </Block>
        </div>
      </div>
    </article>
  );
}

function Block({
  title,
  children,
}: {
  title: string;
  icon?: "check" | "minus";
  children: React.ReactNode;
}) {
  return (
    <div className="border-border/50 border-l-2 pl-5">
      <p className="text-muted-foreground/80 mb-3 font-mono text-[10px] uppercase tracking-[0.22em]">
        {title}
      </p>
      {children}
    </div>
  );
}

type TableRow = {
  feature: string;
  wix: "yes" | "partial" | "no";
  squarespace: "yes" | "partial" | "no";
  jimdo: "yes" | "partial" | "no";
  ki: "yes" | "partial" | "no";
  sitalo: "yes" | "partial" | "no";
};

const TABLE: TableRow[] = [
  {
    feature: "Persönlicher Ansprechpartner",
    wix: "no",
    squarespace: "no",
    jimdo: "no",
    ki: "no",
    sitalo: "yes",
  },
  {
    feature: "Mobile sauber out-of-the-box",
    wix: "partial",
    squarespace: "partial",
    jimdo: "partial",
    ki: "no",
    sitalo: "yes",
  },
  {
    feature: "Lokale SEO-Basis korrekt",
    wix: "partial",
    squarespace: "no",
    jimdo: "partial",
    ki: "no",
    sitalo: "yes",
  },
  {
    feature: "DSGVO-Konformität in DE",
    wix: "partial",
    squarespace: "partial",
    jimdo: "yes",
    ki: "no",
    sitalo: "yes",
  },
  {
    feature: "Sie schreiben Texte selbst",
    wix: "yes",
    squarespace: "yes",
    jimdo: "yes",
    ki: "yes",
    sitalo: "no",
  },
  {
    feature: "Sie kümmern sich um Updates",
    wix: "no",
    squarespace: "no",
    jimdo: "no",
    ki: "yes",
    sitalo: "no",
  },
  {
    feature: "Migration weg möglich",
    wix: "no",
    squarespace: "partial",
    jimdo: "no",
    ki: "yes",
    sitalo: "yes",
  },
  {
    feature: "Antwort auf E-Mail innerhalb 4 h",
    wix: "no",
    squarespace: "no",
    jimdo: "no",
    ki: "no",
    sitalo: "yes",
  },
];

function TableSummary() {
  return (
    <section className="border-border/40 border-t">
      <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-24">
        <div className="max-w-3xl">
          <p className="text-muted-foreground inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] sm:text-[11px]">
            <span
              aria-hidden="true"
              className="bg-gold gold-pulse inline-block h-1 w-6"
            />
            Kurz-Übersicht
          </p>
          <h2 className="mt-6 text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-4xl">
            Acht Kriterien, fünf Optionen.
          </h2>
        </div>

        <div className="mt-10 -mx-6 overflow-x-auto px-6 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[720px] border-collapse text-left text-[13.5px]">
            <thead>
              <tr className="border-border/40 border-b">
                <th className="text-muted-foreground py-3 pr-4 font-mono text-[10px] uppercase tracking-[0.18em]">
                  Kriterium
                </th>
                <th className="text-muted-foreground py-3 px-3 text-center font-mono text-[10px] uppercase tracking-[0.18em]">
                  Wix
                </th>
                <th className="text-muted-foreground py-3 px-3 text-center font-mono text-[10px] uppercase tracking-[0.18em]">
                  Squarespace
                </th>
                <th className="text-muted-foreground py-3 px-3 text-center font-mono text-[10px] uppercase tracking-[0.18em]">
                  Jimdo
                </th>
                <th className="text-muted-foreground py-3 px-3 text-center font-mono text-[10px] uppercase tracking-[0.18em]">
                  KI-Eigenbau
                </th>
                <th className="text-foreground bg-foreground/[0.03] py-3 px-3 text-center font-mono text-[10px] uppercase tracking-[0.18em]">
                  Sitalo
                </th>
              </tr>
            </thead>
            <tbody>
              {TABLE.map((row) => (
                <tr key={row.feature} className="border-border/30 border-b">
                  <td className="text-foreground/85 py-3 pr-4">{row.feature}</td>
                  <Cell value={row.wix} />
                  <Cell value={row.squarespace} />
                  <Cell value={row.jimdo} />
                  <Cell value={row.ki} />
                  <Cell value={row.sitalo} highlight />
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-muted-foreground mt-6 max-w-2xl text-[13px] leading-relaxed">
          ✓ erfüllt · ~ bedingt · — fehlt typisch. Bewertung aus unserer
          eigenen Arbeit mit Hamburger Lokal-Kunden, die von einer
          dieser Optionen zu uns gewechselt sind. Stand:{" "}
          {new Date().toLocaleDateString("de-DE", {
            month: "long",
            year: "numeric",
            timeZone: "Europe/Berlin",
          })}
          .
        </p>
      </div>
    </section>
  );
}

function Cell({
  value,
  highlight,
}: {
  value: "yes" | "partial" | "no";
  highlight?: boolean;
}) {
  const cls = highlight ? "bg-foreground/[0.03]" : "";
  if (value === "yes") {
    return (
      <td className={`text-foreground py-3 px-3 text-center ${cls}`}>
        <Check className="mx-auto h-4 w-4" aria-label="erfüllt" />
      </td>
    );
  }
  if (value === "partial") {
    return (
      <td className={`text-muted-foreground/70 py-3 px-3 text-center ${cls}`}>
        <Minus className="mx-auto h-4 w-4" aria-label="bedingt" />
      </td>
    );
  }
  return (
    <td className={`text-muted-foreground/40 py-3 px-3 text-center ${cls}`}>
      <X className="mx-auto h-3.5 w-3.5" aria-label="fehlt" />
    </td>
  );
}

function FinalCta() {
  return (
    <section className="border-border/40 border-t">
      <div className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-28">
        <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.3em]">
              Unsicher, was zu Ihnen passt?
            </p>
            <h2 className="mt-6 text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
              Schicken Sie uns Ihre aktuelle Seite.
              <br />
              <span className="serif-italic text-muted-foreground font-normal">
                Wir sagen ehrlich, was Sinn ergibt.
              </span>
            </h2>
          </div>
          <Link
            href="/audit"
            className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-12 items-center gap-2 rounded-full px-7 text-[15px] font-medium tracking-tight"
          >
            Kostenlosen Audit anfordern
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
