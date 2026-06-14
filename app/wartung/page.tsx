import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { EditorialEyebrow } from "@/components/marketing/editorial-eyebrow";

export const metadata: Metadata = {
  title: "Wartung & Pflege",
  description:
    "Hosting, Updates, kleine Änderungen — auch für Websites, die wir nicht selbst gebaut haben. Klare Konditionen, nach 6 Monaten monatlich kündbar.",
  alternates: { canonical: "/wartung" },
};

/**
 * `/wartung` — eigenständige Produkt-Seite für laufende Pflege.
 *
 * Zielgruppe: Inhaber existierender Websites (nicht von uns gebaut),
 * die einen verlässlichen Wartungs-Partner suchen, statt jedes Mal
 * jemand neuen zu beauftragen.
 *
 * Ausdrücklich kein Re-Launch-Pitch — wer den Anlass für einen
 * Neubau sucht, landet auf /anfrage. Hier geht es um den ruhigen
 * Hintergrund-Dienst.
 */

type Plan = {
  slug: string;
  name: string;
  monthly: string;
  description: string;
  highlight?: boolean;
  contents: string[];
  limits: string[];
};

const PLANS: Plan[] = [
  {
    slug: "basis",
    name: "Basis",
    monthly: "ab 49 € / Monat",
    description:
      "Damit Ihre Seite läuft, sicher ist und immer auf dem aktuellen Stand bleibt.",
    contents: [
      "Hosting in Deutschland (Umzug auf Wunsch inklusive)",
      "SSL-Zertifikat, automatisch verlängert",
      "Sicherheits- und Software-Updates monatlich",
      "Tägliche Backups, 30 Tage rückrollbar",
      "Eine kleine Inhalts-Änderung pro Monat",
      "Antwort auf Mails meist am selben Tag",
    ],
    limits: [
      "Keine größeren Layout-Umbauten",
      "Maximal eine Änderungsrunde pro Monat",
      "Keine Neuentwicklung von Funktionen",
    ],
  },
  {
    slug: "plus",
    name: "Plus",
    monthly: "ab 99 € / Monat",
    description:
      "Wenn die Seite öfter atmet — neue Speisekarte, neue Aktion, neue Mitarbeiter.",
    highlight: true,
    contents: [
      "Alles aus Basis",
      "Bis zu drei kleine Änderungen pro Monat",
      "Monatlicher Health-Check (Performance, Mobile, Formulare)",
      "Priorisierte Antwort, meist innerhalb von 4 Stunden",
      "Saisonale Anpassungen (Weihnachten, Sommerpause) inklusive",
      "Telefonischer Direktdraht bei Notfällen",
    ],
    limits: [
      "Keine SEO-Kampagnen, keine bezahlten Anzeigen",
      "Maximal drei Änderungsrunden pro Monat",
      "Neue Bereiche (eigene Seite) auf Stundenbasis dazu",
    ],
  },
];

export default function WartungPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Wartung & Pflege" />
      <main id="main" tabIndex={-1} className="flex-1">
        <Hero />
        <Plans />
        <ForWhom />
        <Faq />
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
        <EditorialEyebrow>Wartung & Pflege</EditorialEyebrow>
        <h1 className="mx-auto mt-6 max-w-4xl text-balance text-5xl font-semibold leading-[1.0] tracking-[-0.04em] sm:text-7xl lg:text-[6rem]">
          Für die Seite,
          <br />
          <span className="serif-italic text-muted-foreground font-normal">
            die schon läuft.
          </span>
        </h1>
        <p className="text-muted-foreground mx-auto mt-8 max-w-xl text-pretty text-lg leading-relaxed sm:text-xl">
          Hosting, Updates, kleine Änderungen — auch wenn wir die
          Seite nicht selbst gebaut haben. Klare monatliche
          Konditionen, nach sechs Monaten monatlich kündbar.
        </p>
        <ul className="text-muted-foreground mx-auto mt-8 inline-flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px] sm:text-[14px]">
          <li className="inline-flex items-center gap-2">
            <span className="bg-ink-olive inline-block h-1 w-1 rounded-full" />
            Auch für WordPress, Wix, Squarespace
          </li>
          <li className="inline-flex items-center gap-2">
            <span className="bg-ink-olive inline-block h-1 w-1 rounded-full" />
            Umzug aufs Sitalo-Hosting kostenlos
          </li>
          <li className="inline-flex items-center gap-2">
            <span className="bg-ink-olive inline-block h-1 w-1 rounded-full" />
            Monatlich kündbar nach 6 Monaten
          </li>
        </ul>
      </div>
    </section>
  );
}

function Plans() {
  return (
    <section className="border-border/40 border-t">
      <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-24">
        <div className="grid gap-8 md:grid-cols-2 lg:gap-10">
          {PLANS.map((plan) => (
            <PlanCard key={plan.slug} plan={plan} />
          ))}
        </div>

        <p className="text-muted-foreground mx-auto mt-12 max-w-2xl text-center text-[13.5px] leading-relaxed">
          Alle Preise zzgl. MwSt. Einmaliges Onboarding ab 199 € — wir
          gucken uns Ihre Seite an, sichern den Bestand und richten
          alles für die laufende Pflege ein. Bei einem Umzug auf
          unser Hosting fällt das Onboarding weg.
        </p>
      </div>
    </section>
  );
}

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <article
      className={`relative flex flex-col gap-6 rounded-3xl border p-7 sm:p-9 ${
        plan.highlight
          ? "bg-foreground text-background border-foreground"
          : "border-border/60 bg-card/60"
      }`}
    >
      {plan.highlight && (
        <span className="bg-gold text-foreground absolute -top-3 left-7 inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em]">
          Häufigste Wahl
        </span>
      )}
      <header>
        <p
          className={`font-mono text-[10px] uppercase tracking-[0.22em] ${
            plan.highlight ? "text-background/65" : "text-muted-foreground"
          }`}
        >
          Wartung {plan.name}
        </p>
        <p className="mt-3 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
          {plan.monthly}
        </p>
        <p
          className={`mt-3 text-[15px] leading-relaxed ${
            plan.highlight ? "text-background/75" : "text-foreground/75"
          }`}
        >
          {plan.description}
        </p>
      </header>

      <ul className="space-y-2.5">
        {plan.contents.map((item) => (
          <li
            key={item}
            className="flex items-start gap-3 text-[14.5px] leading-relaxed"
          >
            <span
              className={`mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
                plan.highlight ? "bg-background/15" : "bg-foreground/8"
              }`}
            >
              <Check
                className={`h-3 w-3 ${
                  plan.highlight ? "text-background" : "text-foreground/70"
                }`}
                aria-hidden="true"
              />
            </span>
            <span
              className={
                plan.highlight ? "text-background/90" : "text-foreground/85"
              }
            >
              {item}
            </span>
          </li>
        ))}
      </ul>

      <div
        className={`mt-2 border-t pt-4 ${
          plan.highlight ? "border-background/15" : "border-border/50"
        }`}
      >
        <p
          className={`font-mono text-[10px] uppercase tracking-[0.18em] ${
            plan.highlight ? "text-background/55" : "text-muted-foreground"
          }`}
        >
          Was nicht drin ist
        </p>
        <ul className="mt-3 space-y-2">
          {plan.limits.map((limit) => (
            <li
              key={limit}
              className="flex items-start gap-3 text-[13.5px] leading-relaxed"
            >
              <X
                className={`mt-1 h-3 w-3 shrink-0 ${
                  plan.highlight ? "text-background/45" : "text-muted-foreground/60"
                }`}
                aria-hidden="true"
              />
              <span
                className={
                  plan.highlight ? "text-background/70" : "text-foreground/65"
                }
              >
                {limit}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <Link
        href={`/anfrage?vorhaben=Wartung+${plan.name}`}
        className={`mt-auto inline-flex h-12 items-center justify-center gap-2 rounded-full px-6 text-[14.5px] font-medium tracking-tight transition-all ${
          plan.highlight
            ? "bg-background text-foreground hover:bg-background/90"
            : "bg-foreground text-background hover:bg-foreground/90"
        }`}
      >
        Wartung anfragen
        <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}

function ForWhom() {
  return (
    <section className="border-border/40 border-t">
      <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
        <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
          <div className="lg:sticky lg:top-24">
            <p className="text-muted-foreground inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] sm:text-[11px]">
              <span
                aria-hidden="true"
                className="bg-gold gold-pulse inline-block h-1 w-6"
              />
              Für wen sinnvoll
            </p>
            <h2 className="mt-6 text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-4xl lg:text-5xl">
              Drei typische Fälle,
              <br />
              <span className="serif-italic text-muted-foreground font-normal">
                in denen wir helfen.
              </span>
            </h2>
          </div>
          <ul className="divide-border/40 divide-y">
            <CaseItem
              title="Der Vorgänger ist nicht mehr da"
              body="Ihr ursprünglicher Webdesigner ist verschwunden, krank, in Rente — und niemand kümmert sich. Wir übernehmen, dokumentieren den Bestand, sichern alles und führen weiter."
            />
            <CaseItem
              title="Die Seite läuft, aber sie altert"
              body="Das letzte Update ist 18 Monate her, das SSL-Zertifikat läuft demnächst aus, Plugins sind veraltet. Wir bringen alles auf Stand, ohne Re-Launch."
            />
            <CaseItem
              title="Sie wollen jemanden, der einfach ans Telefon geht"
              body="Wenn am Freitagnachmittag das Kontaktformular streikt, brauchen Sie keine Ticket-Nummer. Sie brauchen jemanden, der ranngeht und es macht."
            />
          </ul>
        </div>
      </div>
    </section>
  );
}

function CaseItem({ title, body }: { title: string; body: string }) {
  return (
    <li className="py-6 sm:py-7">
      <p className="text-foreground text-lg font-medium tracking-[-0.01em] sm:text-xl">
        {title}
      </p>
      <p className="text-muted-foreground mt-1.5 text-[15px] leading-relaxed">
        {body}
      </p>
    </li>
  );
}

function Faq() {
  const items = [
    {
      q: "Können Sie auch Wix oder Squarespace warten?",
      a: "Ja. Wir machen Inhalts-Pflege, Backups (per Export), Performance-Checks und kleinere Layout-Anpassungen auch auf den Baukasten-Systemen. Den Hosting-Teil bezahlt in dem Fall weiterhin Wix bzw. Squarespace direkt.",
    },
    {
      q: "Was passiert mit meiner Domain?",
      a: "Die Domain bleibt auf Ihren Namen registriert — wir verwalten nur die DNS-Einträge auf Wunsch. Sie behalten jederzeit die volle Kontrolle.",
    },
    {
      q: "Kann ich kündigen, wenn ich nicht zufrieden bin?",
      a: "Ja, zum Ende eines jeden Monats nach den ersten sechs Monaten. Wir liefern Ihnen den kompletten Bestand (Seite, Datenbank, Inhalte) als Export für einen sauberen Übergang.",
    },
    {
      q: "Was kostet die Aufstockung von Basis auf Plus?",
      a: "Differenz monatlich, anteilig. Sie können jederzeit hoch oder runter wechseln — ohne neue Mindestlaufzeit.",
    },
    {
      q: "Übernehmen Sie auch Sites mit Online-Shop?",
      a: "Bis ungefähr 30 Artikel ja. Größere Shops mit Lagerverwaltung, Versand-APIs oder ähnlichem empfehlen wir lieber an spezialisierte Shop-Wartungs-Partner weiter.",
    },
  ];
  return (
    <section className="border-border/40 border-t">
      <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-24">
        <p className="text-muted-foreground inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] sm:text-[11px]">
          <span
            aria-hidden="true"
            className="bg-gold gold-pulse inline-block h-1 w-6"
          />
          Häufige Fragen
        </p>
        <h2 className="mt-6 text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-4xl">
          Wartungs-FAQ.
        </h2>
        <dl className="divide-border/50 mt-10 divide-y">
          {items.map((item) => (
            <div key={item.q} className="py-6">
              <dt className="text-foreground text-lg font-medium tracking-[-0.01em]">
                {item.q}
              </dt>
              <dd className="text-muted-foreground mt-2 text-[15px] leading-relaxed">
                {item.a}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="border-border/40 border-t">
      <div className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-28">
        <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.3em]">
              Unverbindlich
            </p>
            <h2 className="mt-6 text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl">
              Wir gucken uns Ihre Seite
              <br />
              <span className="serif-italic text-muted-foreground font-normal">
                vorher kostenlos an.
              </span>
            </h2>
          </div>
          <Link
            href="/audit"
            className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-12 items-center gap-2 rounded-full px-7 text-[15px] font-medium tracking-tight"
          >
            Audit anfordern
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
