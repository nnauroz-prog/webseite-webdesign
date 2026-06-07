import Link from "next/link";
import { ArrowRight, Calendar, Eye, Package, Sparkles, Zap } from "lucide-react";

/**
 * Atelier-Suite — Magazin-Spread der interaktiven Werkzeuge auf
 * der Homepage. Macht sichtbar, dass es nicht nur drei Pakete
 * gibt, sondern eine ganze Toolset-Suite, die meiste Konkurrenz
 * nicht hat.
 *
 * Layout: 12-Spalten-Grid, eine große Aufmacher-Karte links (Speed-
 * Check), vier kleinere Karten rechts (Quiz, Rechner, Audit, Termin).
 * Auf Mobile stapeln alle zu Single-Column.
 *
 * Bewusst editorial, nicht App-Showcase: serif italic Headlines,
 * Mono-Eyebrows, Hairline-Trennungen, kein „App-Store"-Lärm.
 */

type Tool = {
  href: string;
  eyebrow: string;
  title: string;
  body: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Optional badge wie „Live" oder „Neu". */
  badge?: string;
};

const HERO_TOOL: Tool = {
  href: "/check",
  eyebrow: "I — Speed-Check",
  title: "Wie schnell ist Ihre Seite?",
  body: "Live-Lighthouse-Test in 30 Sekunden. Performance, SEO, Accessibility, Best Practices als vier Ringe — plus Core Web Vitals. Ohne Kontaktdaten, ohne PDF, ohne Vertriebs-Anruf danach.",
  icon: Zap,
  badge: "Live",
};

const SIDE_TOOLS: Tool[] = [
  {
    href: "/empfehlung",
    eyebrow: "II — Paket-Quiz",
    title: "Welches Paket passt?",
    body: "Fünf Fragen, eine ehrliche Empfehlung mit ausformulierter Begründung. Wir geben Ihnen Starter, Business oder Premium — und sagen warum.",
    icon: Sparkles,
  },
  {
    href: "/rechner",
    eyebrow: "III — 3-Jahres-Rechner",
    title: "Was kostet es über 3 Jahre?",
    body: "Drei Slider, fünf Balken. Sitalo gegen Wix, Squarespace, Jimdo, ChatGPT-Selbstbau. Eigenzeit als echtes Geld eingerechnet.",
    icon: Package,
  },
  {
    href: "/audit",
    eyebrow: "IV — Persönlicher Audit",
    title: "Drei Punkte zu Ihrer Seite.",
    body: "Wir gucken einmal mit der Hand drauf, schreiben Ihnen eine ehrliche Mail innerhalb 48 Stunden. Kein Funnel, kein Auto-Responder.",
    icon: Eye,
  },
  {
    href: "/termin",
    eyebrow: "V — Termin-Buchung",
    title: "30 Minuten, direkt buchen.",
    body: "Tag und Uhrzeit selbst wählen. Bestätigung per Mail mit Kalender-Anhang in 15 Minuten. Kein E-Mail-Pingpong vorab.",
    icon: Calendar,
  },
];

export function AtelierSuite() {
  return (
    <section
      id="werkzeuge"
      className="border-border/40 relative overflow-hidden border-t scroll-mt-20"
    >
      {/* Dezenter Gold-Halo rechts oben — atmosphärischer Anker. */}
      <div
        aria-hidden="true"
        className="bg-gold/8 pointer-events-none absolute -top-32 right-[-10%] h-[28rem] w-[28rem] rounded-full blur-[80px] sm:blur-[140px]"
      />
      <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32">
        {/* Editorial-Header */}
        <div className="grid items-end gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="text-muted-foreground inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] sm:text-[11px]">
              <span
                aria-hidden="true"
                className="bg-gold gold-pulse inline-block h-1 w-6"
              />
              Werkzeugkasten · V Stück, alle nutzbar
            </p>
            <h2 className="mt-6 text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
              Fünf Werkzeuge,
              <br />
              <span className="serif-italic text-muted-foreground font-normal">
                die andere als Beratung verkaufen.
              </span>
            </h2>
          </div>
          <p className="text-foreground/75 max-w-md text-pretty text-[15.5px] leading-relaxed">
            Wir haben sie für uns gebaut, weil wir sie ständig
            gebraucht haben. Sie sind hier offen für jeden — kein
            Login, kein Newsletter, kein Trichter. Wenn etwas davon
            Sinn ergibt, ergibt es Sinn.
          </p>
        </div>

        {/* Magazin-Grid: 1 großer Aufmacher links, 4 kleinere rechts.
            Auf Mobile alles gestapelt. */}
        <div className="mt-14 grid gap-5 sm:mt-16 lg:grid-cols-12">
          <HeroCard tool={HERO_TOOL} />
          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-6">
            {SIDE_TOOLS.map((t) => (
              <SideCard key={t.href} tool={t} />
            ))}
          </div>
        </div>

        {/* Editorial-Schluss-Strip mit Querverweisen auf Journal +
            Manifest — gehören semantisch dazu, wären als sechste
            und siebte Karte aber Lärm. */}
        <div className="border-border/40 mt-14 flex flex-col gap-4 border-t pt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:pt-10">
          <p className="text-muted-foreground text-[13.5px] leading-relaxed">
            Aus dem Atelier auch:{" "}
            <Link
              href="/journal"
              className="text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
            >
              Journal
            </Link>{" "}
            (Beobachtungen aus echten Projekten) und{" "}
            <Link
              href="/manifest"
              className="text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
            >
              Manifest
            </Link>{" "}
            (acht Sätze über das, was wir tun und was nicht).
          </p>
          <Link
            href="/vergleich"
            className="text-foreground inline-flex shrink-0 items-center gap-2 text-[14px] font-medium underline-offset-[6px] hover:underline"
          >
            Vergleich: Sitalo vs Wix vs Squarespace vs Jimdo vs DIY
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function HeroCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  return (
    <Link
      href={tool.href}
      className="group bg-foreground text-background ring-foreground/10 relative col-span-12 flex flex-col gap-6 overflow-hidden rounded-3xl p-8 ring-1 transition-shadow hover:shadow-[0_24px_60px_-20px_rgb(0_0_0/0.4)] sm:p-10 lg:col-span-6"
    >
      {/* Schwacher Gold-Glow innerhalb der Karte. */}
      <div
        aria-hidden="true"
        className="bg-gold/20 pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full blur-[80px]"
      />
      <div className="relative flex items-start justify-between gap-4">
        <span className="border-background/25 inline-flex h-12 w-12 items-center justify-center rounded-full border">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        {tool.badge && (
          <span className="bg-gold text-foreground inline-flex h-6 items-center rounded-full px-2.5 font-mono text-[10px] uppercase tracking-[0.18em]">
            {tool.badge}
          </span>
        )}
      </div>
      <p className="text-background/65 relative font-mono text-[10px] uppercase tracking-[0.22em]">
        {tool.eyebrow}
      </p>
      <h3 className="serif relative text-balance text-3xl font-normal leading-[1.1] tracking-[-0.02em] sm:text-4xl lg:text-[2.75rem]">
        {tool.title}
      </h3>
      <p className="text-background/80 relative text-pretty text-[15.5px] leading-relaxed">
        {tool.body}
      </p>
      <span className="text-background relative mt-auto inline-flex items-center gap-2 text-[14.5px] font-medium underline-offset-[6px] group-hover:underline">
        Tool öffnen
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}

function SideCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  return (
    <Link
      href={tool.href}
      className="group border-border/60 bg-card/50 ring-foreground/5 hover:border-foreground/30 hover:bg-card/70 flex flex-col gap-4 rounded-3xl border p-6 ring-1 transition-all sm:p-7"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="border-border/60 text-foreground/75 inline-flex h-10 w-10 items-center justify-center rounded-full border">
          <Icon className="h-4 w-4" aria-hidden="true" />
        </span>
      </div>
      <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.22em]">
        {tool.eyebrow}
      </p>
      <h3 className="serif text-foreground text-balance text-2xl font-normal leading-[1.15] tracking-[-0.015em]">
        {tool.title}
      </h3>
      <p className="text-foreground/75 text-pretty text-[14.5px] leading-relaxed">
        {tool.body}
      </p>
      <span className="text-foreground mt-auto inline-flex items-center gap-2 text-[13.5px] font-medium underline-offset-[5px] group-hover:underline">
        Öffnen
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
