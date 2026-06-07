import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export const metadata: Metadata = {
  title: "Wer zu uns kommt — Auswahl · Sitalo",
  description:
    "Wir nehmen pro Monat höchstens drei neue Aufträge an. Hier steht, wen wir bewusst nehmen und wen nicht — und wie wir entscheiden.",
  alternates: { canonical: "/auswahl" },
};

/**
 * `/auswahl` — Aufnahmekriterien.
 *
 * Premium-Positionierung durch Verknappungs-Logik: wir wählen
 * aus, nicht der Kunde. Sehr distinktiv, kein lokaler Wett-
 * bewerber hat sowas.
 *
 * Tonalität strikt editorial — keine FAQ-Liste, keine
 * Bullet-Salat. Drei Sektionen mit serifen Statements, eine
 * Liste mit klaren Ja/Nein-Kriterien, eine Prozess-Beschreibung.
 *
 * Schluss: bewusst kein „Jetzt anfragen"-Hammer. Wer das hier
 * gelesen hat, weiß schon was zu tun ist.
 */
export default function AuswahlPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Auswahl" />
      <main className="flex-1">
        <Hero />
        <CriteriaList />
        <Process />
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
          Aufnahmekriterien · Stand Juni 2026
        </p>
        <h1 className="serif text-foreground mt-8 text-balance text-5xl font-normal leading-[0.98] tracking-[-0.02em] sm:text-6xl lg:text-7xl">
          Wer zu uns kommt.
        </h1>
        <p className="serif-italic text-muted-foreground mt-4 text-balance text-3xl leading-snug tracking-[-0.01em] sm:text-4xl">
          Und wer nicht.
        </p>

        <div className="border-foreground/15 mt-12 border-l-2 pl-6">
          <p className="text-foreground/85 text-pretty text-[17px] leading-[1.7]">
            Wir nehmen pro Monat höchstens drei neue Aufträge an. Das ist
            keine Marketing-Geste, sondern eine arithmetische Realität:
            ein Atelier mit unserer Arbeitsdichte kann nicht mehr
            seriös begleiten. Diese Knappheit hat eine Konsequenz —
            wir können nicht jeden bauen, der anfragt.
          </p>
          <p className="text-foreground/85 mt-5 text-pretty text-[17px] leading-[1.7]">
            Was hier steht, ist keine Sales-Disqualifikations-Liste,
            sondern eine ehrliche Beschreibung dessen, mit wem wir gut
            arbeiten — und mit wem wir es lieber nicht versuchen. Wenn
            Sie sich erkennen, freuen wir uns. Wenn nicht, sparen wir
            beiden Zeit.
          </p>
        </div>
      </div>
    </section>
  );
}

type Criterion = {
  ja: string;
  nein: string;
};

const CRITERIA: Criterion[] = [
  {
    ja: "Lokales Unternehmen mit Geschäft in Hamburg oder Umland.",
    nein: "Reine Tech-Plays ohne physischen Standort, Investor-getriebene Startups.",
  },
  {
    ja: "Inhaber-geführt, klare Entscheidungswege.",
    nein: "Komitee-Strukturen mit Reviews durch fünf Stakeholder.",
  },
  {
    ja: "Eine Vorstellung davon, wer der Kunde ist und was er will.",
    nein: "Mach-mal-kreativ-Mandate ohne Zielgruppen-Kontur.",
  },
  {
    ja: "Bereitschaft, die drei Sachen (Logo, Texte, Bilder) selbst beizubringen oder begleitet zu erarbeiten.",
    nein: "Erwartung, dass wir auch Marken-Identität, Texterstellung und Foto-Shooting machen.",
  },
  {
    ja: "Drei bis sechs Monate Horizont für den ersten Aufbau, dann laufende Pflege.",
    nein: "Übermorgen live, danach nie wieder anfassen.",
  },
  {
    ja: "Branchen, in denen wir Erfahrung haben: Gastronomie, Pflege, Praxen, Friseur, Handwerk, Kanzlei, Fitness.",
    nein: "Branchen mit Sonderregulierung, die wir nicht kennen (Pharma-Direktvertrieb, Versicherungs-Vertrieb, Krypto).",
  },
];

function CriteriaList() {
  return (
    <section className="border-border/40 border-b">
      <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-24">
        <p className="text-muted-foreground inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span
            aria-hidden="true"
            className="bg-gold inline-block h-px w-10"
          />
          Was passt — was nicht
        </p>
        <h2 className="serif text-foreground mt-8 text-balance text-4xl font-normal leading-[1.05] tracking-[-0.02em] sm:text-5xl">
          Sechs Kriterien,
          <span className="serif-italic text-muted-foreground">
            {" "}
            zweispaltig gelesen.
          </span>
        </h2>

        <ol className="mt-16 space-y-14 sm:space-y-16">
          {CRITERIA.map((c, i) => (
            <li key={i} className="grid gap-6 sm:grid-cols-[3rem_1fr] sm:gap-8">
              <span
                aria-hidden="true"
                className="serif-italic text-gold text-3xl font-normal leading-none tabular-nums sm:text-4xl"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="space-y-5">
                <CriterionRow icon="ja" text={c.ja} />
                <CriterionRow icon="nein" text={c.nein} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function CriterionRow({
  icon,
  text,
}: {
  icon: "ja" | "nein";
  text: string;
}) {
  return (
    <p className="flex items-start gap-3">
      <span
        className={`mt-1 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
          icon === "ja"
            ? "border-foreground/30 text-foreground"
            : "border-muted-foreground/30 text-muted-foreground/70"
        }`}
      >
        {icon === "ja" ? (
          <Check className="h-3 w-3" aria-hidden="true" />
        ) : (
          <X className="h-3 w-3" aria-hidden="true" />
        )}
      </span>
      <span
        className={`text-pretty text-[16.5px] leading-[1.6] ${
          icon === "ja" ? "text-foreground/85" : "text-muted-foreground"
        }`}
      >
        {text}
      </span>
    </p>
  );
}

const STEPS: { roman: string; title: string; body: string }[] = [
  {
    roman: "I",
    title: "Audit-Mail oder kurze Anfrage",
    body: "Wir gucken uns Ihre aktuelle Seite einmal mit der Hand an oder lesen, was Sie geschrieben haben. Drei bis fünf Punkte zurück per Mail, persönlich. Das ist unsere erste Filterung — und Ihre erste Probe, ob unser Stil passt.",
  },
  {
    roman: "II",
    title: "30-Minuten-Gespräch",
    body: "Wir telefonieren oder sitzen kurz zusammen, wenn Sie in Hamburg sind. Kein Sales-Pitch — wir wollen verstehen, was Sie bauen, wer Ihr Kunde ist, was Sie schon haben und was fehlt. Sie wollen verstehen, wie wir arbeiten und ob wir liefern können.",
  },
  {
    roman: "III",
    title: "Verbindliche Empfehlung — von uns oder zu jemand anderem",
    body: "Wenn wir glauben, gut passen zu können, schicken wir Ihnen unsere Empfehlung mit Paket-Vorschlag, Zeitplan und Preis. Wenn nicht, sagen wir das offen — und nennen Ihnen jemanden, der besser zu Ihrem Vorhaben passt. Letzteres passiert in etwa einem von vier Fällen.",
  },
];

function Process() {
  return (
    <section className="border-border/40 border-b">
      <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-24">
        <p className="text-muted-foreground inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span
            aria-hidden="true"
            className="bg-gold inline-block h-px w-10"
          />
          Wie wir entscheiden
        </p>
        <h2 className="serif text-foreground mt-8 text-balance text-4xl font-normal leading-[1.05] tracking-[-0.02em] sm:text-5xl">
          Drei Schritte,
          <span className="serif-italic text-muted-foreground"> kein Funnel.</span>
        </h2>

        <ol className="divide-border/40 mt-14 divide-y">
          {STEPS.map((s) => (
            <li
              key={s.roman}
              className="grid items-baseline gap-4 py-10 sm:grid-cols-[3.5rem_1fr] sm:gap-8 sm:py-12"
            >
              <span
                aria-hidden="true"
                className="serif-italic text-gold text-3xl font-normal leading-none tabular-nums sm:text-4xl"
              >
                {s.roman}.
              </span>
              <div>
                <h3 className="serif text-foreground text-balance text-2xl font-normal leading-[1.2] tracking-[-0.015em] sm:text-3xl">
                  {s.title}
                </h3>
                <p className="text-muted-foreground mt-4 text-pretty text-[16px] leading-[1.65]">
                  {s.body}
                </p>
              </div>
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
      <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28">
        <p className="serif text-foreground text-balance text-3xl font-normal leading-[1.25] tracking-[-0.01em] sm:text-4xl">
          Wenn Sie sich gewünscht haben, dass jemand klar sagt:{" "}
          <span className="serif-italic text-muted-foreground">
            wir können das, das andere besser
          </span>{" "}
          — dann sind Sie hier richtig.
        </p>

        <div className="border-border/40 mt-12 flex flex-col gap-4 border-t pt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <p className="text-muted-foreground text-[14px] leading-relaxed">
            Beide möglichen nächsten Schritte sind unverbindlich. Wir
            erwarten keine Anfrage, wenn das hier nicht zu Ihnen passt.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <Link
              href="/audit"
              className="border-foreground/30 text-foreground hover:bg-foreground hover:text-background inline-flex h-11 items-center rounded-full border px-5 text-[14px] font-medium tracking-tight transition-all"
            >
              Audit anfordern
            </Link>
            <Link
              href="/termin"
              className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-11 items-center gap-2 rounded-full px-5 text-[14px] font-medium tracking-tight"
            >
              30 Minuten reden
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
