import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Clock,
  Image as ImageIcon,
  MessageCircle,
  Minus,
  Send,
  Sparkles,
  Wrench,
  X,
} from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { MarketingWhatsapp } from "@/components/marketing/marketing-whatsapp";
import { TemplatePreview } from "@/components/dashboard/template-preview";
import { ALL_TEMPLATE_KEYS, getTemplateMeta } from "@/lib/templates";

export const metadata: Metadata = {
  title: "Sitalo — Ihre professionelle Website. Fertig in 48 Stunden.",
  description:
    "Sitalo erstellt Websites für lokale Unternehmen — schnell, persönlich, ohne Baukasten-Stress. Sie liefern Logo, Bilder und Texte. Wir übernehmen den Rest.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "Sitalo — Ihre professionelle Website. Fertig in 48 Stunden.",
    description:
      "Wir bauen Ihre Website fertig — keine Technik, kein Stress. In 1–2 Werktagen online.",
    siteName: "Sitalo Webdesign",
    locale: "de_DE",
  },
};

const TRUST_LINE = [
  "Keine Registrierung nötig",
  "Persönliche Umsetzung",
  "Mobil optimiert",
  "Für lokale Unternehmen",
];

const TRUST_BAR = [
  { label: "48h Umsetzung möglich", icon: "clock" as const },
  { label: "Persönlicher Ansprechpartner", icon: "user" as const },
  { label: "Keine Registrierung nötig", icon: "check" as const },
  { label: "Mobil optimiert", icon: "device" as const },
];

const PROBLEMS = [
  "Veraltete Website, die niemand mehr besucht",
  "Mobil sieht alles kaputt aus",
  "Keine Zeit, sich mit Baukästen zu beschäftigen",
  "Kontakt-Formular geht ins Nichts oder existiert gar nicht",
  "Bei Google nicht zu finden",
  "Wix angefangen, Projekt liegt seit Monaten halb fertig",
];

const SOLUTIONS = [
  {
    icon: ImageIcon,
    title: "Onepager & Mehrseitige Sites",
    body: "Vom kompakten Onepager bis zur vollständigen Unternehmens-Website mit Team, Leistungen und Galerie.",
  },
  {
    icon: MessageCircle,
    title: "Kontakt, WhatsApp, Maps",
    body: "Anfragen kommen direkt aufs Handy. WhatsApp-Knopf, Google-Maps-Einbettung, Öffnungszeiten — alles drin.",
  },
  {
    icon: Sparkles,
    title: "SEO & Hosting inklusive",
    body: "Saubere SEO-Basis, schnelles Hosting, mobile Optimierung und Wartung. Sie müssen nichts selbst einrichten.",
  },
  {
    icon: Wrench,
    title: "Optionaler Kundenbereich",
    body: "Auf Wunsch ein eigener Login, in dem Sie Inhalte, Speisekarte oder Buchungen selbst pflegen können.",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Anfrage senden",
    body: "Kurz das Formular ausfüllen oder eine WhatsApp schicken — wir melden uns innerhalb von 24 Stunden.",
  },
  {
    number: "02",
    title: "Daten liefern",
    body: "Logo, Bilder, Texte, Öffnungszeiten, Leistungen, Kontaktdaten. Was Sie nicht haben, finden wir gemeinsam.",
  },
  {
    number: "03",
    title: "Website geht online",
    body: "Wir bauen, Sie geben frei, wir veröffentlichen. In den meisten Fällen 1–2 Werktage nach Datenlieferung.",
  },
];

const COMPARISON: Array<{
  point: string;
  wix: string;
  sitalo: string;
}> = [
  {
    point: "Wer baut die Website?",
    wix: "Sie selbst",
    sitalo: "Wir bauen für Sie",
  },
  {
    point: "Texte & Inhalte",
    wix: "Sie schreiben selbst",
    sitalo: "Wir helfen bei Aufbau & Darstellung",
  },
  {
    point: "Design & Struktur",
    wix: "Sie wählen aus Templates",
    sitalo: "Persönlich an Ihr Unternehmen angepasst",
  },
  {
    point: "Technik (Domain, SEO, Mobil, Formulare)",
    wix: "Sie richten alles selbst ein",
    sitalo: "Komplett übernommen",
  },
  {
    point: "Zeitaufwand für Sie",
    wix: "Mehrere Wochen, oft länger",
    sitalo: "1–2 Stunden für die Daten",
  },
  {
    point: "Ergebnis hängt ab von",
    wix: "Ihren Design- und Tech-Skills",
    sitalo: "Unserer Arbeit",
  },
  {
    point: "Persönlicher Ansprechpartner",
    wix: "Support-Hotline",
    sitalo: "Direkter Kontakt zu uns",
  },
];

const PACKAGES = [
  {
    name: "Starter-Projekt",
    badge: "Schnell online",
    setup: "ab 499 €",
    monthly: "ab 49 € / Monat",
    description:
      "Eine moderne Seite, alles Wichtige auf einen Blick. Perfekt für Einzelunternehmer und kleine Betriebe.",
    bullets: [
      "Moderne Onepage-Website",
      "Mobil optimiert",
      "Kontaktformular",
      "WhatsApp-Button",
      "Google Maps & Öffnungszeiten",
      "Impressum & Datenschutz",
      "Hosting inklusive",
      "Kleine monatliche Änderungen",
    ],
  },
  {
    name: "Business-Auftritt",
    badge: "Beliebteste Wahl",
    highlight: true,
    setup: "ab 899 €",
    monthly: "ab 79 € / Monat",
    description:
      "Mehrere Sektionen, Team, Leistungen, Galerie. Für lokale Unternehmen, die professionell auftreten wollen.",
    bullets: [
      "Hochwertige Mehrseiten-Website",
      "Mehrere professionelle Sektionen",
      "SEO-Grundlagen",
      "Bilder- & Bildbearbeitung",
      "Kontaktformular & WhatsApp",
      "Google Maps",
      "Texte gemeinsam erarbeitet",
      "Laufende Betreuung",
    ],
  },
  {
    name: "Premium-System",
    badge: "Mit Kundenbereich",
    setup: "ab 1.499 €",
    monthly: "ab 129 € / Monat",
    description:
      "Premium-Design mit Kundenbereich oder verwaltbaren Inhalten. Speisekarte, Wochenangebot, Buchungen — alles selbst pflegbar.",
    bullets: [
      "Premium-Design",
      "Individuelle Anpassung",
      "Kundenbereich oder verwaltbare Inhalte",
      "Speisekarte / Wochenangebot / Leistungen",
      "Formularsystem (Kontakt, Bewerbung, Buchung)",
      "Stärkere SEO-Basis",
      "Laufender Support",
      "Erweiterte Wartung",
    ],
  },
];

const REASONS = [
  {
    title: "Persönlich statt anonym",
    body: "Direkter Ansprechpartner. Keine Ticket-Hotline, keine Chatbots.",
  },
  {
    title: "Keine Technik für Sie",
    body: "Wir kümmern uns um Domain, SEO, Mobil-Optimierung und Veröffentlichung.",
  },
  {
    title: "Schnelle Lieferung",
    body: "In den meisten Fällen sind Sie 1–2 Werktage nach Datenlieferung online.",
  },
  {
    title: "Lokale Unternehmen im Fokus",
    body: "Wir kennen die Erwartungen Ihrer Kunden — nicht die von Tech-Startups.",
  },
  {
    title: "Auf Wunsch Kundenbereich",
    body: "Wenn Sie selbst Inhalte ändern wollen: kein Problem, wir richten das ein.",
  },
  {
    title: "Langfristige Wartung",
    body: "Updates, Backups, kleine Änderungen — übernehmen wir laufend.",
  },
];

const FAQ = [
  {
    question: "Muss ich mich registrieren?",
    answer:
      "Nein. Für eine Anfrage reicht das Formular oder WhatsApp. Der Kundenbereich ist nur für bestehende Kunden oder auf Wunsch verfügbar.",
  },
  {
    question: "Wie schnell ist meine Website fertig?",
    answer:
      "In den meisten Fällen innerhalb von 1–2 Werktagen nach vollständiger Datenlieferung. Für größere Projekte besprechen wir den Zeitplan vorab.",
  },
  {
    question: "Was muss ich liefern?",
    answer:
      "Logo, Bilder, Texte, Leistungen, Öffnungszeiten, Kontaktdaten — und falls vorhanden Ihre aktuelle Website. Was fehlt, klären wir gemeinsam.",
  },
  {
    question: "Kann ich später Inhalte ändern?",
    answer:
      "Ja. Entweder übernehmen wir Änderungen für Sie (in der monatlichen Betreuung enthalten) oder Sie erhalten optional einen Kundenbereich, in dem Sie alles selbst pflegen können.",
  },
  {
    question: "Was ist besser: Wix oder Sitalo?",
    answer:
      "Wix ist gut, wenn Sie selbst bauen möchten. Sitalo ist besser, wenn Sie eine fertige professionelle Website möchten und keine Zeit für Technik, Design und Einrichtung haben. Wir liefern das fertige Ergebnis statt nur das Werkzeug.",
  },
  {
    question: "Gibt es monatliche Kosten?",
    answer:
      "Ja, wenn Hosting, Wartung, Änderungen und Support über uns laufen sollen. Die monatlichen Kosten hängen vom Paket ab (49 €, 79 € oder 129 €) und sind jederzeit zum Monatsende kündbar.",
  },
  {
    question: "Sind Impressum und Datenschutz dabei?",
    answer:
      "Wir integrieren die entsprechenden Seiten und Bereiche technisch. Rechtssichere Inhalte (Impressums-Text, Datenschutzerklärung) sollten Sie selbst oder von einem geeigneten Anbieter beziehen — wir können bei Bedarf Empfehlungen aussprechen.",
  },
  {
    question: "Was passiert nach dem Launch?",
    answer:
      "Sie erhalten laufende Betreuung im monatlichen Paket: kleine Änderungen, Updates, Sicherheits-Patches, Backups. Größere Erweiterungen besprechen wir im Einzelfall.",
  },
];

/**
 * Industry value props — replaces the chip list with per-trade
 * "what you get" cards. Same trades, just communicated as outcomes.
 */
const INDUSTRY_VALUE: Array<{
  name: string;
  body: string;
}> = [
  {
    name: "Pflegedienste",
    body: "Leistungen, Kontakt, Bewerbungen und Vertrauen auf einen Blick.",
  },
  {
    name: "Arzt- & Zahnarztpraxen",
    body: "Seriöser Auftritt, Sprechzeiten, Leistungen und klare Patienteninformation.",
  },
  {
    name: "Friseure & Kosmetikstudios",
    body: "Bilder, Leistungen, Preise und Termin-Anfragen hochwertig präsentieren.",
  },
  {
    name: "Cafés & Restaurants",
    body: "Speisekarte, Öffnungszeiten, Wochenangebote und Reservierungs-Anfragen.",
  },
  {
    name: "Handwerker",
    body: "Projekte, Galerie, Anfahrt und schnelle Kontaktmöglichkeiten.",
  },
  {
    name: "Reinigungsfirmen",
    body: "Leistungspakete, Angebotsanfrage und 24/7-Erreichbarkeit klar dargestellt.",
  },
  {
    name: "Kanzleien",
    body: "Rechtsgebiete, Anwält:innen und vertrauliche Erstberatungs-Anfrage.",
  },
  {
    name: "Fitnessstudios",
    body: "Kursplan, Probetraining und Mitgliedschafts-Anfragen ohne Hürden.",
  },
];

export default function HomePage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <main className="flex-1">
        <Hero />
        <TrustBar />
        <Problems />
        <Solutions />
        <Steps />
        <Comparison />
        <Industries />
        <Showcase />
        <Examples />
        <Pricing />
        <Why />
        <Faq />
        <FinalCta />
      </main>
      <MarketingFooter />
      <MarketingWhatsapp />
    </div>
  );
}

/* ---------- Sections ---------- */

function Hero() {
  const whatsappHref = buildWhatsappHref();

  return (
    <section className="border-border/40 relative overflow-hidden border-b">
      <div
        className="from-secondary/40 absolute inset-0 -z-10 bg-gradient-to-b to-transparent"
        aria-hidden="true"
      />
      <div className="mx-auto w-full max-w-6xl px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.22em]">
            Webdesign-Service · Lokale Unternehmen
          </p>
          <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.025em] sm:text-6xl">
            Sie schicken uns Ihre Daten.
            <br />
            <span className="text-primary">Wir bauen Ihre Website.</span>
          </h1>
          <p className="text-muted-foreground mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed sm:text-xl">
            Logo, Bilder, Texte und Kontaktdaten reichen aus. Wir übernehmen
            Design, Technik, Mobiloptimierung und Veröffentlichung — meist
            innerhalb von 48 Stunden.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/anfrage"
              className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-12 items-center justify-center rounded-full px-7 text-[15px] font-medium tracking-tight shadow-md transition-all hover:shadow-lg"
            >
              Website anfragen
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="border-[#25D366]/40 text-[#128C7E] hover:bg-[#25D366]/10 inline-flex h-12 items-center justify-center gap-2 rounded-full border bg-white px-7 text-[15px] font-medium tracking-tight transition-colors"
              >
                <WhatsappGlyph className="h-4 w-4" />
                WhatsApp schreiben
              </a>
            ) : null}
            <Link
              href="#beispiele"
              className="text-muted-foreground hover:text-foreground inline-flex h-12 items-center justify-center px-4 text-sm font-medium underline-offset-4 hover:underline"
            >
              Beispiele ansehen
            </Link>
          </div>

          <ul className="text-muted-foreground mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm">
            {TRUST_LINE.map((item) => (
              <li
                key={item}
                className="inline-flex items-center gap-2 whitespace-nowrap"
              >
                <span className="bg-primary inline-block h-1 w-1 rounded-full" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function TrustBar() {
  return (
    <div className="border-border/40 bg-background border-b">
      <ul className="text-muted-foreground mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-6 py-5 text-sm">
        {TRUST_BAR.map((item) => (
          <li
            key={item.label}
            className="inline-flex items-center gap-2 whitespace-nowrap"
          >
            <Check className="text-emerald-600 h-3.5 w-3.5" />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

function buildWhatsappHref(): string | null {
  const raw = process.env.NEXT_PUBLIC_SITALO_WHATSAPP_NUMBER?.trim();
  if (!raw) return null;
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.length < 6) return null;
  const message =
    process.env.NEXT_PUBLIC_SITALO_WHATSAPP_MESSAGE?.trim() ||
    "Hallo, ich interessiere mich für eine professionelle Website. Können Sie mir ein Angebot machen?";
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

function WhatsappGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M16.001 3.2c-7.067 0-12.8 5.733-12.8 12.8 0 2.241.586 4.434 1.7 6.366L3.2 28.8l6.601-1.728a12.79 12.79 0 0 0 6.198 1.577h.002c7.067 0 12.799-5.732 12.799-12.799 0-3.422-1.332-6.638-3.752-9.057a12.726 12.726 0 0 0-9.047-3.593zm0 23.342h-.002a10.591 10.591 0 0 1-5.4-1.479l-.387-.229-4.014 1.051 1.07-3.915-.252-.4a10.587 10.587 0 0 1-1.624-5.668c0-5.866 4.775-10.641 10.641-10.641 2.842 0 5.514 1.108 7.525 3.12a10.557 10.557 0 0 1 3.116 7.527c0 5.866-4.774 10.634-10.673 10.634zm5.834-7.967c-.32-.16-1.893-.934-2.187-1.04-.293-.107-.507-.16-.72.16s-.827 1.04-1.014 1.254c-.187.214-.374.241-.694.08-.32-.16-1.353-.499-2.578-1.591-.953-.85-1.597-1.9-1.784-2.22-.187-.32-.02-.493.14-.652.143-.143.32-.374.48-.561.16-.187.213-.32.32-.534.107-.214.054-.4-.026-.561-.08-.16-.72-1.733-.987-2.373-.26-.622-.524-.538-.72-.548-.187-.01-.4-.012-.614-.012a1.18 1.18 0 0 0-.854.4c-.293.32-1.12 1.094-1.12 2.667 0 1.574 1.147 3.094 1.307 3.307.16.213 2.254 3.44 5.466 4.825.764.329 1.36.526 1.826.674.766.244 1.464.21 2.014.127.615-.092 1.893-.774 2.16-1.521.267-.748.267-1.387.187-1.521-.08-.134-.293-.213-.614-.374z" />
    </svg>
  );
}

function Problems() {
  return (
    <section className="bg-secondary/30 border-border/40 border-b py-20 sm:py-28">
      <div className="mx-auto w-full max-w-5xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.2em]">
            Kennen Sie das?
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            Eine eigene Website ist überfällig — aber irgendwas hält Sie auf.
          </h2>
        </header>
        <ul className="mt-12 grid gap-3 sm:grid-cols-2">
          {PROBLEMS.map((problem) => (
            <li
              key={problem}
              className="bg-card border-border/60 flex items-start gap-3 rounded-xl border p-5 shadow-sm"
            >
              <span className="text-destructive/80 mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center">
                <X className="h-4 w-4" />
              </span>
              <span className="text-foreground/85 text-[15px] leading-relaxed">
                {problem}
              </span>
            </li>
          ))}
        </ul>
        <div className="mx-auto mt-10 max-w-xl text-center">
          <p className="text-foreground text-lg font-medium">
            Wir übernehmen das für Sie.
          </p>
          <Link
            href="/anfrage"
            className="text-primary mt-3 inline-flex items-center gap-1 text-sm font-medium hover:underline"
          >
            Jetzt anfragen
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Solutions() {
  return (
    <section
      id="leistungen"
      className="border-border/40 border-b py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.2em]">
            Was Sitalo macht
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            Webdesign-Service mit eigenem System.
          </h2>
          <p className="text-muted-foreground mt-4 text-lg text-pretty">
            Wir erstellen moderne Websites für lokale Unternehmen — schnell,
            persönlich, professionell. Ohne Baukasten-Stress.
          </p>
        </header>
        <ul className="mt-12 grid gap-px overflow-hidden rounded-2xl border bg-border/60 sm:grid-cols-2">
          {SOLUTIONS.map(({ icon: Icon, title, body }) => (
            <li
              key={title}
              className="bg-card flex flex-col gap-3 p-7 sm:p-8"
            >
              <span className="bg-primary/10 text-primary inline-flex h-10 w-10 items-center justify-center rounded-lg">
                <Icon className="h-5 w-5" />
              </span>
              <h3 className="text-lg font-semibold tracking-tight">{title}</h3>
              <p className="text-muted-foreground text-[15px] leading-relaxed">
                {body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Steps() {
  return (
    <section
      id="ablauf"
      className="bg-secondary/20 border-border/40 border-b py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-5xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.2em]">
            So einfach geht's
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            In 3 Schritten zur fertigen Website.
          </h2>
        </header>
        <ol className="mt-12 grid gap-6 sm:grid-cols-3">
          {STEPS.map((step) => (
            <li
              key={step.number}
              className="bg-card border-border/60 flex flex-col rounded-2xl border p-7 shadow-sm"
            >
              <span className="text-primary text-sm font-mono font-medium tracking-widest">
                {step.number}
              </span>
              <h3 className="mt-3 text-lg font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="text-muted-foreground mt-2 text-[15px] leading-relaxed">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
        <div className="mt-10 text-center">
          <Link
            href="/anfrage"
            className="bg-foreground text-background hover:bg-foreground/90 inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-medium tracking-tight shadow-md transition-all hover:shadow-lg"
          >
            Jetzt Anfrage senden
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function Comparison() {
  return (
    <section
      id="vergleich"
      className="border-border/40 border-b py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-5xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.2em]">
            Selbst bauen oder bauen lassen?
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            Wix oder Sitalo — was passt besser zu Ihnen?
          </h2>
          <p className="text-muted-foreground mt-4 text-lg text-pretty">
            Wix ist stark, wenn Sie Ihre Website selbst erstellen möchten. Sitalo
            ist für Unternehmer, die eine professionelle Website wollen, ohne
            sich selbst mit Design, Technik und Einrichtung zu beschäftigen.
          </p>
        </header>

        <div className="mt-12 overflow-hidden rounded-2xl border shadow-sm">
          <div className="bg-muted/40 grid grid-cols-3 border-b">
            <div className="p-5 text-sm font-medium" />
            <div className="border-l p-5 text-center">
              <span className="text-muted-foreground text-xs font-medium uppercase tracking-[0.18em]">
                Wix
              </span>
              <p className="mt-1 text-sm font-medium">Werkzeug zum Selbstbauen</p>
            </div>
            <div className="bg-foreground text-background border-l p-5 text-center">
              <span className="text-background/70 text-xs font-medium uppercase tracking-[0.18em]">
                Sitalo
              </span>
              <p className="mt-1 text-sm font-semibold">Fertige Website</p>
            </div>
          </div>
          <div className="divide-y">
            {COMPARISON.map((row) => (
              <div
                key={row.point}
                className="grid grid-cols-3 text-sm"
              >
                <div className="text-foreground/80 p-5 font-medium">
                  {row.point}
                </div>
                <div className="text-muted-foreground border-l p-5 text-center">
                  <span className="inline-flex items-center gap-2">
                    <Minus className="text-muted-foreground/60 h-3.5 w-3.5" />
                    {row.wix}
                  </span>
                </div>
                <div className="border-l p-5 text-center font-medium">
                  <span className="inline-flex items-center gap-2">
                    <Check className="text-emerald-600 h-3.5 w-3.5" />
                    {row.sitalo}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-foreground text-background mx-auto mt-10 max-w-3xl rounded-2xl p-6 text-center shadow-xl sm:p-8">
          <p className="text-background/70 text-[11px] font-medium uppercase tracking-[0.22em]">
            Kurz gesagt
          </p>
          <p className="mt-2 text-balance text-xl font-semibold leading-snug sm:text-2xl">
            Wix liefert das Werkzeug.
            <br className="sm:hidden" /> Sitalo liefert die fertige Website.
          </p>
        </div>
      </div>
    </section>
  );
}

function Industries() {
  return (
    <section className="bg-secondary/20 border-border/40 border-b py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.2em]">
            Branchen
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            Websites für lokale Unternehmen, die professionell wirken müssen.
          </h2>
          <p className="text-muted-foreground mt-4 text-lg text-pretty">
            Wir nutzen bewährte Premium-Strukturen für verschiedene Branchen und
            passen Design, Texte und Inhalte individuell an Ihr Unternehmen an.
          </p>
        </header>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {INDUSTRY_VALUE.map((row) => (
            <li
              key={row.name}
              className="bg-card border-border/60 flex flex-col gap-2 rounded-2xl border p-6 shadow-sm"
            >
              <h3 className="text-base font-semibold tracking-tight">
                {row.name}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {row.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/**
 * Alstercafé Showcase. Real example project explicitly labelled as
 * "Beispielprojekt" — no fake customer testimonials, no implied
 * endorsement. Demonstrates the Premium-System with managed menu /
 * weekly-special content.
 */
function Showcase() {
  return (
    <section
      id="showcase"
      className="border-border/40 border-b py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.2em]">
            Beispielprojekt
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            Café-Webseite mit Speisekarte & Wochenangebot
          </h2>
          <p className="text-muted-foreground mt-4 text-lg text-pretty">
            Für ein Café kann Sitalo nicht nur eine schöne Website erstellen,
            sondern auch verwaltbare Inhalte wie Speisekarte, Wochenangebot
            oder Mittagstisch integrieren.
          </p>
        </header>

        <div className="border-border/60 bg-card mt-12 grid gap-0 overflow-hidden rounded-3xl border shadow-xl lg:grid-cols-[1.1fr_1fr]">
          <div className="bg-foreground text-background relative flex aspect-[4/3] flex-col justify-end overflow-hidden p-8 sm:aspect-auto sm:p-10">
            <div
              aria-hidden="true"
              className="bg-primary/40 absolute inset-x-0 top-0 h-[60%] opacity-50 blur-3xl"
            />
            <div className="relative">
              <p className="text-background/60 text-[10px] font-medium uppercase tracking-[0.25em]">
                Alstercafé · Hamburg
              </p>
              <h3 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-5xl">
                Frischer Kaffee.
                <br />
                Wechselndes Wochenangebot.
              </h3>
              <p className="text-background/75 mt-5 max-w-sm text-base leading-relaxed">
                Onepager mit großem Hero, Speisekarte als verwaltbarer Inhalt,
                Wochenangebot mit Mittagstisch, Öffnungszeiten und Anfahrt.
              </p>
              <p className="text-background/60 mt-6 text-xs">
                Beispielprojekt zur Darstellung des Premium-Systems.
              </p>
            </div>
          </div>

          <div className="flex flex-col p-8 sm:p-10">
            <dl className="grid gap-4 sm:grid-cols-2">
              <ShowcaseFact label="Branche" value="Café / Gastronomie" />
              <ShowcaseFact label="Umsetzung" value="Onepager + Kundenbereich" />
              <ShowcaseFact label="Gerät" value="Mobil-optimiert" />
              <ShowcaseFact label="Inhalte" value="Selbst pflegbar" />
            </dl>

            <ul className="mt-7 space-y-2.5 text-sm">
              {[
                "Onepager mit großem Hero und Atmosphäre-Bildern",
                "Speisekarte als verwaltbarer Inhalt im Kundenbereich",
                "Wochenangebot + Mittagstisch wöchentlich änderbar",
                "Öffnungszeiten, Google Maps, Telefon-Direktwahl",
                "Reservierungs-Anfrage per Formular oder WhatsApp",
                "Bilder-Galerie der Räumlichkeiten",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check className="text-emerald-600 mt-0.5 h-4 w-4 shrink-0" />
                  <span className="text-foreground/85">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto pt-8">
              <Link
                href="/anfrage"
                className="bg-foreground text-background hover:bg-foreground/90 inline-flex h-11 w-full items-center justify-center rounded-full px-5 text-sm font-medium tracking-tight transition-colors sm:w-auto"
              >
                Ähnliche Website anfragen
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ShowcaseFact({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border/60 rounded-xl border p-4">
      <dt className="text-muted-foreground text-[10px] font-medium uppercase tracking-[0.18em]">
        {label}
      </dt>
      <dd className="mt-1 text-sm font-medium">{value}</dd>
    </div>
  );
}

function Examples() {
  // We surface the in-house template gallery as visual examples — they
  // are the actual designs we ship for the listed industries. No fake
  // customer logos.
  const featured = ALL_TEMPLATE_KEYS.slice(0, 6).map(getTemplateMeta);

  return (
    <section
      id="beispiele"
      className="border-border/40 border-b py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.2em]">
            Beispiele
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            So sehen die Designs aus.
          </h2>
          <p className="text-muted-foreground mt-4 text-lg text-pretty">
            Auswahl unserer Premium-Vorlagen. Die finale Umsetzung passen wir
            individuell an Ihr Unternehmen, Ihre Farben und Ihre Inhalte an.
          </p>
        </header>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((meta) => (
            <li
              key={meta.key}
              className="border-border bg-card flex flex-col overflow-hidden rounded-2xl border shadow-sm"
            >
              <TemplatePreview
                templateKey={meta.key}
                hero={meta.hero}
                personality={meta.personality}
              />
              <div className="border-t p-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-base font-semibold tracking-tight">
                    {meta.label}
                  </h3>
                  <span className="text-muted-foreground text-xs uppercase tracking-[0.15em]">
                    {meta.industry}
                  </span>
                </div>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {meta.vibe}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Pricing() {
  return (
    <section
      id="preise"
      className="bg-secondary/30 border-border/40 border-b py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-6xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.2em]">
            Preise
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            Klare Pakete. Faire Preise.
          </h2>
          <p className="text-muted-foreground mt-4 text-lg text-pretty">
            Einmalige Erstellung + monatliche Betreuung. Sie zahlen nur für das,
            was Sie wirklich brauchen.
          </p>
        </header>

        <ul className="mt-12 grid gap-6 lg:grid-cols-3">
          {PACKAGES.map((p) => (
            <li
              key={p.name}
              className={`flex flex-col rounded-2xl border p-7 shadow-sm sm:p-8 ${
                p.highlight
                  ? "bg-foreground text-background border-foreground"
                  : "bg-card"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p
                    className={`text-[10px] font-medium uppercase tracking-[0.18em] ${
                      p.highlight ? "text-background/70" : "text-muted-foreground"
                    }`}
                  >
                    {p.badge}
                  </p>
                  <h3 className="mt-1 text-xl font-semibold tracking-tight">
                    {p.name}
                  </h3>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-3xl font-semibold tracking-tight">
                  {p.setup}
                </p>
                <p
                  className={`text-sm ${
                    p.highlight ? "text-background/70" : "text-muted-foreground"
                  }`}
                >
                  einmalig · zzgl. {p.monthly}
                </p>
              </div>
              <p
                className={`mt-5 text-sm leading-relaxed ${
                  p.highlight ? "text-background/85" : "text-muted-foreground"
                }`}
              >
                {p.description}
              </p>
              <ul className="mt-6 space-y-2.5 text-sm">
                {p.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5">
                    <Check
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        p.highlight ? "text-background" : "text-emerald-600"
                      }`}
                    />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-7">
                <Link
                  href="/anfrage"
                  className={`inline-flex h-11 w-full items-center justify-center rounded-full px-5 text-sm font-medium tracking-tight transition-colors ${
                    p.highlight
                      ? "bg-background text-foreground hover:bg-background/90"
                      : "bg-foreground text-background hover:bg-foreground/90"
                  }`}
                >
                  Anfragen
                </Link>
              </div>
            </li>
          ))}
        </ul>

        <p className="text-muted-foreground mx-auto mt-8 max-w-2xl text-center text-sm">
          Die finalen Kosten hängen vom Umfang, vorhandenen Inhalten und
          gewünschten Funktionen ab. Mehr Details auf der{" "}
          <Link
            href="/pricing"
            className="hover:text-foreground underline"
          >
            Preise-Seite
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

function Why() {
  return (
    <section className="border-border/40 border-b py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.2em]">
            Warum Sitalo
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            Persönlich. Schnell. Komplett.
          </h2>
        </header>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((reason) => (
            <li
              key={reason.title}
              className="bg-card border-border/60 rounded-2xl border p-6"
            >
              <h3 className="text-base font-semibold tracking-tight">
                {reason.title}
              </h3>
              <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                {reason.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Faq() {
  return (
    <section
      id="faq"
      className="bg-secondary/20 border-border/40 border-b py-20 sm:py-28"
    >
      <div className="mx-auto w-full max-w-3xl px-6">
        <header className="text-center">
          <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.2em]">
            FAQ
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
            Häufige Fragen
          </h2>
        </header>
        <dl className="mt-10 space-y-3">
          {FAQ.map((item) => (
            <details
              key={item.question}
              className="bg-card border-border/60 group rounded-xl border p-5 open:shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium">
                {item.question}
                <span className="text-muted-foreground transition-transform group-open:rotate-180">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path
                      d="M6 9l6 6 6-6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </summary>
              <p className="text-muted-foreground mt-3 text-[15px] leading-relaxed text-pretty">
                {item.answer}
              </p>
            </details>
          ))}
        </dl>
      </div>
    </section>
  );
}

function FinalCta() {
  const whatsappHref = buildWhatsappHref();
  return (
    <section className="bg-foreground text-background py-20 sm:py-28">
      <div className="mx-auto w-full max-w-4xl px-6 text-center">
        <h2 className="text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-5xl">
          Bereit für eine Website,
          <br />
          die professionell wirkt und Kunden bringt?
        </h2>
        <p className="text-background/70 mx-auto mt-5 max-w-xl text-pretty text-lg">
          Schicken Sie uns Ihre Anfrage. Wir melden uns innerhalb von 24 Stunden
          mit einem klaren Vorschlag — persönlich, nicht von einer Hotline.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/anfrage"
            className="bg-background text-foreground hover:bg-background/90 group inline-flex h-12 items-center justify-center rounded-full px-7 text-[15px] font-medium tracking-tight shadow-md transition-all hover:shadow-lg"
          >
            Jetzt Website anfragen
            <Send className="ml-2 h-4 w-4" />
          </Link>
          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="border-background/40 bg-background/10 text-background hover:bg-background/20 inline-flex h-12 items-center justify-center gap-2 rounded-full border px-7 text-[15px] font-medium tracking-tight backdrop-blur-md transition-colors"
            >
              <WhatsappGlyph className="h-4 w-4" />
              Direkt per WhatsApp schreiben
            </a>
          ) : null}
        </div>
        <p className="text-background/60 mt-6 inline-flex items-center gap-2 text-sm">
          <Clock className="h-4 w-4" />
          Antwort innerhalb von 24 Stunden, persönlich.
        </p>
      </div>
    </section>
  );
}
