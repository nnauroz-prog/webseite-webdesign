import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Send } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { EditorialEyebrow } from "@/components/marketing/editorial-eyebrow";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Das Atelier — wer wir sind und warum wir das machen",
  description:
    "Eine kleine Hamburger Werkstatt für Websites. Was wir glauben, wie wir arbeiten, warum „drei Sachen reichen\" mehr ist als ein Slogan.",
  alternates: { canonical: "/atelier" },
};

/* ============================================================
 * Editorial Manifesto-/About-Seite. Bewusst keine Team-Fotos,
 * keine erfundenen Awards, keine Bio. Stattdessen: was wir glauben,
 * wie wir arbeiten, warum. Persönlich als Werkstatt-Stimme, nicht
 * als Einzelperson. Bringt das Vertrauen, das Besucher brauchen
 * bevor sie eine Anfrage abschicken.
 * ============================================================ */
export default function AtelierPage() {
  const aboutPageLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Das Atelier — Sitalo Webdesign",
    description:
      "Über das Sitalo-Atelier in Hamburg — Glaubenssätze, Arbeitsweise, warum Hamburg, welche Schriften und Werkzeuge.",
    url: `${SITE_URL}/atelier`,
    mainEntity: { "@id": `${SITE_URL}/#business` },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Sitalo", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Atelier",
        item: `${SITE_URL}/atelier`,
      },
    ],
  };

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Das Atelier" />
      <main id="main" tabIndex={-1} className="flex-1">
        <Hero />
        <Glaubenssaetze />
        <WieWirArbeiten />
        <WarumHamburg />
        <Schriften />
        <FinalCta />
      </main>
      <MarketingFooter />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([aboutPageLd, breadcrumbLd]),
        }}
      />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="aurora pointer-events-none absolute inset-0 -z-10">
        <span />
        <span />
        <span />
      </div>
      <div className="mx-auto grid w-full max-w-6xl items-center gap-10 px-5 pt-14 pb-12 sm:px-6 sm:pt-20 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <div>
          <EditorialEyebrow>Wer wir sind</EditorialEyebrow>
          <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-6xl">
            Sitalo ist{" "}
            <span className="serif-italic text-muted-foreground font-normal">eine kleine Werkstatt.</span>
          </h1>
          <p className="text-muted-foreground mt-5 max-w-xl text-pretty text-base leading-relaxed sm:text-lg">
            Kein Konzern, kein Callcenter, kein Verkaufsteam. Ein Atelier in Hamburg, das Websites für
            Betriebe baut, die ihr Handwerk gut können.
          </p>
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-black/5">
          <Image
            src="/images/workspace-prints.webp"
            alt="Sitalo-Atelier in Hamburg — Schreibtisch mit gerahmten Design-Drucken und MacBook."
            fill
            priority
            sizes="(min-width: 1024px) 480px, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

const GLAUBENSSATZE = [
  { n: "01", title: "Eine Website ist Handwerk.", body: "Keine Vorlage, keine zwei Sitalo-Seiten sehen gleich aus." },
  { n: "02", title: "Tempo vor Perfektion.", body: "Lieber bald eine gute Seite als in drei Monaten eine perfekte." },
  { n: "03", title: "Lokal vor generisch.", body: "Wir bauen für die Suche Ihrer Kunden in Ihrer Gegend." },
  { n: "04", title: "Persönlich vor Masse.", body: "Wenige Kunden gleichzeitig, und am Telefon ist ein Mensch." },
  { n: "05", title: "Ehrlich vor Versprechen.", body: "Kein „Platz 1 bei Google“ — sondern eine sauber gebaute Seite." },
];

function Glaubenssaetze() {
  return (
    <section className="border-border/40 bg-secondary/30 border-t">
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
        <h2 className="rise text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Was wir glauben.</h2>
        <ol className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {GLAUBENSSATZE.map((g) => (
            <li key={g.n} className="border-border/60 border-t pt-4">
              <p className="text-gold font-mono text-[11px] tracking-[0.2em]">{g.n}</p>
              <p className="mt-1 text-[17px] font-semibold tracking-tight">{g.title}</p>
              <p className="text-muted-foreground mt-1 text-[14.5px] leading-relaxed">{g.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

const ARBEITSWEISE = [
  { title: "Wenige Projekte gleichzeitig", body: "Genug, um mit jedem Kunden persönlich zu reden." },
  { title: "Schnell ein Ergebnis", body: "Kleine Seiten stehen oft nach 1–2 Werktagen." },
  { title: "Danach bleiben wir da", body: "Fester Ansprechpartner, kleine Änderungen im Monatsbeitrag." },
  { title: "Was wir nicht machen", body: "Werbekampagnen und Newsletter — dafür empfehlen wir Kolleg:innen." },
];

function WieWirArbeiten() {
  return (
    <section className="border-border/40 border-t">
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-6 sm:py-16">
        <h2 className="rise text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Wie wir arbeiten.</h2>
        <ul className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
          {ARBEITSWEISE.map((a) => (
            <li key={a.title} className="flex gap-3">
              <Check className="text-gold mt-1 h-4 w-4 shrink-0" aria-hidden="true" />
              <div>
                <p className="text-[16px] font-semibold tracking-tight">{a.title}</p>
                <p className="text-muted-foreground mt-0.5 text-[14.5px] leading-relaxed">{a.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function WarumHamburg() {
  return (
    <section className="bg-foreground text-background relative overflow-hidden">
      <div aria-hidden="true" className="aurora aurora-dark pointer-events-none absolute inset-0">
        <span />
        <span />
        <span />
      </div>
      <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
        <div>
          <p className="text-background/55 text-[11px] font-medium uppercase tracking-[0.3em]">Warum Hamburg</p>
          <p className="serif mt-5 text-balance text-3xl leading-[1.2] sm:text-4xl">
            Hier wohnen und arbeiten wir.{" "}
            <span className="serif-italic text-background/70">Und kennen die Stadtteile nicht aus dem Lehrbuch.</span>
          </p>
          <p className="text-background/75 mt-5 max-w-lg text-[15px] leading-relaxed">
            Für Kunden außerhalb Hamburgs läuft alles genauso — per Telefon, Video und Mail.
          </p>
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-white/10">
          <Image
            src="/images/hamburg-speicherstadt.webp"
            alt="Hamburg Speicherstadt zur goldenen Stunde — historische Backsteinspeicher entlang der Kanäle."
            fill
            sizes="(min-width: 1024px) 400px, 100vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}

/**
 * Schriften des Ateliers — Quersteg zur Identitäts-Familie.
 * Manifest, Auswahl, Inventar, Lexikon, Journal: fünf Seiten,
 * die zusammen das Selbstverständnis tragen. Hier als ruhiges
 * Register, wie ein Schriftenverzeichnis am Ende eines Katalogs.
 */
const SCHRIFTEN: { href: string; title: string; line: string }[] = [
  {
    href: "/manifest",
    title: "Manifest",
    line: "Acht Sätze. Was wir tun, was wir nicht tun.",
  },
  {
    href: "/auswahl",
    title: "Auswahl",
    line: "Wer zu uns kommt — und wer nicht. Sechs Kriterien.",
  },
  {
    href: "/inventar",
    title: "Inventar",
    line: "Werkzeuge, Hosting, Lieferanten. Offen gelistet, begründet.",
  },
  {
    href: "/lexikon",
    title: "Lexikon",
    line: "Sechzehn Webbegriffe in Klartext, ohne Einschüchterung.",
  },
  {
    href: "/honorar",
    title: "Honorar",
    line: "Stundensatz, Aufwand pro Paket, was wir nicht abrechnen.",
  },
  {
    href: "/journal",
    title: "Journal",
    line: "Essays aus echten Projekten. Beobachtung statt Ratgeber.",
  },
];

function Schriften() {
  return (
    <section className="border-border/40 border-b">
      <div className="mx-auto w-full max-w-5xl px-6 py-20 sm:py-24">
        <p className="text-muted-foreground inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span aria-hidden="true" className="bg-gold inline-block h-px w-10" />
          Schriften des Ateliers
        </p>
        <h2 className="serif text-foreground mt-6 text-balance text-3xl font-normal leading-[1.1] tracking-[-0.02em] sm:text-4xl">
          Fünf Seiten, die unser Selbstverständnis tragen.
        </h2>
        <ol className="divide-border/40 mt-10 divide-y">
          {SCHRIFTEN.map((s, i) => (
            <li key={s.href}>
              <Link
                href={s.href}
                className="group flex flex-col gap-1.5 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10 sm:py-7"
              >
                <span className="flex items-baseline gap-5">
                  <span
                    aria-hidden="true"
                    className="serif-italic text-gold text-xl font-normal leading-none tabular-nums"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-foreground text-xl font-medium tracking-[-0.01em] sm:text-2xl">
                    {s.title}
                  </span>
                </span>
                <span className="text-muted-foreground pl-10 text-[14.5px] leading-relaxed group-hover:text-foreground sm:pl-0 sm:text-right transition-colors">
                  {s.line}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section>
      <div className="border-border/40 mx-auto w-full max-w-6xl border-t px-5 py-14 sm:px-6 sm:py-20">
        <div className="flex flex-col items-start gap-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="serif text-foreground max-w-2xl text-balance text-3xl leading-[1.2] tracking-[-0.02em] sm:text-4xl">
            Passt das zu Ihnen?{" "}
            <span className="serif-italic text-muted-foreground">Schreiben Sie uns kurz.</span>
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/anfrage"
              className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium tracking-tight"
            >
              Website anfragen
              <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/kontakt"
              className="border-foreground/30 text-foreground hover:bg-foreground hover:text-background inline-flex h-12 items-center rounded-full border px-6 text-[15px] font-medium tracking-tight transition-colors"
            >
              Kontakt
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
