import Link from "next/link";
import {
  ArrowRight,
  Check,
  ClipboardEdit,
  Globe2,
  HeartHandshake,
  Inbox,
  Lock,
  Minus,
  Sparkles,
  Star,
  X,
  Zap,
} from "lucide-react";

import { SitaloLogo } from "@/components/sitalo-logo";
import { TemplatePreview } from "@/components/dashboard/template-preview";
import {
  ALL_TEMPLATE_KEYS,
  getTemplateMeta,
} from "@/lib/templates";

const stats = [
  { value: "30 Min.", label: "bis online" },
  { value: "10", label: "Branchen-Designs" },
  { value: "ab 9 €", label: "pro Monat", highlight: true },
  { value: "DSGVO", label: "EU-gehostet" },
];

const features = [
  {
    icon: Sparkles,
    title: "Branchen-Designs in echt",
    body: "10 fertige Designs, abgestimmt auf Pflege, Praxis, Handwerk, Gastro, Anwalt — du wählst aus, der Rest steht schon.",
  },
  {
    icon: ClipboardEdit,
    title: "Im Dashboard pflegen",
    body: "Texte, Logos, Team, Galerie, Leistungen — alles über einfache Formulare. Kein Code, kein WordPress, kein Updates.",
  },
  {
    icon: Inbox,
    title: "Anfragen direkt im Postfach",
    body: "Kontakt- und Bewerbungsformular landen mit Status-Workflow im Dashboard. Spam-Schutz inklusive.",
  },
  {
    icon: Globe2,
    title: "Eigene Domain & SEO",
    body: "Verbinde deine .de-Domain. Google Search Console, Sitemap, Schema.org — alles vorbereitet.",
  },
  {
    icon: Zap,
    title: "30 Minuten bis live",
    body: "Wirklich. Konto anlegen, Branche wählen, Daten eintragen, klicken — fertig.",
  },
  {
    icon: Lock,
    title: "DSGVO ohne Stress",
    body: "Pflichtseiten Impressum + Datenschutz automatisch. EU-Hosting bei Vercel + Supabase.",
  },
  {
    icon: HeartHandshake,
    title: "7 Tage gratis testen",
    body: "Keine Kreditkarte beim Start. Erst zahlen, wenn du wirklich live gehst.",
  },
  {
    icon: Star,
    title: "Premium-Optik",
    body: "Apple-grade Typografie, sofort responsive, Lighthouse > 90. Sieht aus wie Agentur — kostet wie Software.",
  },
];

const steps = [
  {
    n: "01",
    title: "Konto anlegen",
    body: "Email, Passwort, los. Keine Kreditkarte nötig — der Demo-Modus ist gratis.",
    accent: "from-primary/20 to-transparent",
  },
  {
    n: "02",
    title: "Branche wählen & Inhalte ergänzen",
    body: "Wähle aus 10 Designs. Beispiel-Inhalte stehen schon — du tauschst Texte und Bilder gegen deine.",
    accent: "from-amber-500/20 to-transparent",
  },
  {
    n: "03",
    title: "Veröffentlichen",
    body: "Ein Klick — deine Site ist live. Bei Bedarf eigene Domain. 7 Tage gratis.",
    accent: "from-emerald-500/20 to-transparent",
  },
];

const comparison = [
  {
    feature: "Zeit bis online",
    diy: "2–8 Wochen",
    agency: "4–12 Wochen",
    sitalo: "30 Minuten",
  },
  { feature: "Einmalkosten", diy: "0–500 €", agency: "1.500–6.000 €", sitalo: "0 €" },
  { feature: "Monatliche Kosten", diy: "10–30 €", agency: "30–150 €", sitalo: "ab 9 €" },
  { feature: "Inhalte selbst pflegen", diy: "true", agency: "false", sitalo: "true" },
  { feature: "Pflichtseiten (DSGVO)", diy: "false", agency: "minus", sitalo: "true" },
  { feature: "Branchen-Designs", diy: "false", agency: "minus", sitalo: "true" },
  { feature: "Updates & Wartung", diy: "false", agency: "minus", sitalo: "true" },
  { feature: "Eigene Domain", diy: "true", agency: "true", sitalo: "true" },
] as const;

const testimonials = [
  {
    initials: "MH",
    name: "Marie Hoffmann",
    role: "Inhaberin, Pflegedienst Sonnenschein",
    quote:
      "Ich war innerhalb eines Vormittags online. Was eine Agentur in 6 Wochen nicht geschafft hat, lief bei Sitalo in einer Stunde — inklusive Bewerbungsformular für Pflegekräfte.",
  },
  {
    initials: "DS",
    name: "Dr. Stefan Berg",
    role: "Anwaltskanzlei Berg & Partner",
    quote:
      "Klar, schnell, professionell. Mandantenanfragen kommen direkt ins Dashboard mit Status — keine verlorenen Mails mehr. Das sieht nach 5.000 € Agentur aus.",
  },
  {
    initials: "LK",
    name: "Lukas Krause",
    role: "Friseur Krause Hannover",
    quote:
      "Termine über die Website, eigene Domain, Galerie meiner Arbeit — und ich brauchte keine einzige Zeile Code. Beste 9 € im Monat.",
  },
];

const faq = [
  {
    q: "Brauche ich technische Vorkenntnisse?",
    a: "Nein. Wenn du eine E-Mail schreiben kannst, kannst du auch deine Sitalo-Website pflegen. Alles läuft über einfache Formulare im Dashboard.",
  },
  {
    q: "Was kostet das genau?",
    a: "Drei Pakete ab 9 € pro Monat, monatlich kündbar. Keine Einrichtungsgebühr. Solange du nicht veröffentlichst, kostet es nichts — der Demo-Modus ist gratis.",
  },
  {
    q: "Kann ich meine eigene Domain benutzen?",
    a: "Ja, im Premium-Paket. Du verbindest deine Domain (z. B. meinepflege.de) per CNAME — wir liefern dir die genaue Anleitung im Dashboard.",
  },
  {
    q: "Was passiert nach den 7 kostenlosen Tagen?",
    a: "Wenn du keine Zahlungsmethode hinzufügst, geht deine öffentliche Website automatisch offline. Deine Inhalte bleiben gespeichert — du kannst jederzeit erneut buchen und mit einem Klick wieder live gehen.",
  },
  {
    q: "Ist das DSGVO-konform?",
    a: "Ja. Hosting in der EU (Vercel + Supabase EU-Region), Pflichtseiten Impressum & Datenschutz sind eingebaut, du füllst nur deine Daten ein. Kontaktformular speichert nur, was nötig ist.",
  },
  {
    q: "Wie schnell bin ich live?",
    a: "Im Schnitt 30 Minuten. Die meiste Zeit geht für deine eigenen Inhalte drauf — Texte, Logo, Team-Fotos. Das Design steht ab Sekunde 1.",
  },
  {
    q: "Was ist mit Google? Werde ich gefunden?",
    a: "Wir liefern alle SEO-Grundlagen (Sitemap, Schema.org, Meta-Tags) und eine Schritt-für-Schritt-Anleitung für Google Search Console + Google Business Profile — der wichtigste Hebel für lokale Suche.",
  },
  {
    q: "Kann ich mehr als eine Seite haben?",
    a: "Ja. Lege beliebig viele Unterseiten wie „Über uns”, „Karriere”, „Standorte” an — mit FAQ-, Testimonial-, Karte-, Video-, Statistik- und Aufruf-Blöcken pro Seite.",
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      {/* ===== Sticky header ===== */}
      <header className="border-border/40 bg-background/85 sticky top-0 z-40 border-b backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-3.5">
          <Link href="/" aria-label="Sitalo Webdesign">
            <SitaloLogo size="md" priority />
          </Link>
          <nav className="hidden items-center gap-1 text-sm md:flex">
            <NavLink href="#designs">Designs</NavLink>
            <NavLink href="#funktionen">Funktionen</NavLink>
            <NavLink href="#vergleich">Vergleich</NavLink>
            <NavLink href="/pricing">Preise</NavLink>
            <NavLink href="#faq">FAQ</NavLink>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hover:bg-secondary hidden h-9 items-center justify-center rounded-full px-4 text-sm font-medium transition sm:inline-flex"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-primary text-primary-foreground inline-flex h-9 items-center justify-center rounded-full px-5 text-sm font-medium transition-all hover:scale-[1.02] hover:shadow-md"
            >
              Kostenlos starten
            </Link>
          </div>
        </div>
      </header>

      {/* ===== Hero ===== */}
      <section className="relative isolate overflow-hidden">
        <div className="bg-gradient-to-b from-secondary/40 via-background to-background pointer-events-none absolute inset-0 -z-10" />
        <div
          aria-hidden
          className="bg-primary/5 pointer-events-none absolute -top-40 left-1/2 -z-10 h-[600px] w-[800px] -translate-x-1/2 rounded-full blur-3xl"
        />

        <div className="mx-auto flex w-full max-w-7xl flex-col items-center px-6 pt-20 pb-12 text-center sm:pt-32">
          <Link
            href="#designs"
            className="border-border bg-background/60 text-muted-foreground mb-8 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium tracking-wide backdrop-blur-sm transition-colors hover:text-foreground"
          >
            <span className="bg-emerald-500 inline-block h-1.5 w-1.5 animate-pulse rounded-full" />
            Neu: 10 fertige Branchen-Designs zur Auswahl
            <ArrowRight className="h-3 w-3" />
          </Link>

          <h1 className="text-foreground mx-auto max-w-4xl text-5xl font-semibold leading-[1.05] tracking-[-0.03em] text-balance sm:text-6xl md:text-[80px]">
            Eine Website, die wie Agentur aussieht.
            <span className="text-muted-foreground/80 mt-1 block">
              Aber wie Software kostet.
            </span>
          </h1>

          <p className="text-muted-foreground mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-pretty sm:text-xl">
            Pflegedienste, Arztpraxen, Friseure, Restaurants, Anwälte — wähle
            ein Design, trage deine Inhalte ein, klick veröffentlichen.
            <strong className="text-foreground"> 7 Tage gratis</strong>, keine
            Kreditkarte.
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/register"
              className="bg-primary text-primary-foreground group inline-flex h-12 items-center justify-center rounded-full px-7 text-[15px] font-medium tracking-tight shadow-lg transition-all hover:scale-[1.03] hover:shadow-xl"
            >
              Jetzt kostenlos starten
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="#designs"
              className="border-border bg-background hover:bg-secondary inline-flex h-12 items-center justify-center rounded-full border px-7 text-[15px] font-medium tracking-tight transition-all hover:scale-[1.02]"
            >
              Designs ansehen
            </Link>
          </div>

          <p className="text-muted-foreground/80 mt-6 text-xs">
            Keine Kreditkarte · 7 Tage testen · Monatlich kündbar
          </p>
        </div>

        {/* Browser mockup with sample sites */}
        <div className="mx-auto w-full max-w-6xl px-6 pb-24 sm:pb-32">
          <div className="relative">
            <div
              aria-hidden
              className="bg-primary/10 pointer-events-none absolute -inset-4 -z-10 rounded-[40px] blur-2xl"
            />
            <div className="bg-card ring-border/60 overflow-hidden rounded-2xl border shadow-2xl ring-1">
              {/* Browser chrome */}
              <div className="bg-secondary/80 flex items-center gap-2 border-b px-4 py-3">
                <span className="bg-destructive/70 h-2.5 w-2.5 rounded-full" />
                <span className="bg-warning/70 h-2.5 w-2.5 rounded-full" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
                <div className="bg-background/80 text-muted-foreground mx-auto flex h-6 max-w-md flex-1 items-center justify-center rounded-full px-3 text-[11px] font-mono">
                  pflegedienst-sonnenschein.de
                </div>
              </div>
              {/* Embedded preview — pflegedienst as the showcase */}
              <div className="p-3 sm:p-6">
                <TemplatePreview
                  templateKey="pflegedienst"
                  hero="centered"
                  personality="soft"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Stats strip ===== */}
      <section className="border-border/60 bg-secondary/20 border-y">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-px overflow-hidden border-x sm:grid-cols-4">
          {stats.map((s) => (
            <Stat key={s.label} {...s} />
          ))}
        </div>
      </section>

      {/* ===== Designs Showcase ===== */}
      <section id="designs" className="py-28 sm:py-36">
        <div className="mx-auto w-full max-w-7xl px-6">
          <header className="mx-auto max-w-3xl text-center">
            <p className="text-muted-foreground text-[11px] font-medium tracking-[0.2em] uppercase">
              Designs
            </p>
            <h2 className="mt-3 text-4xl font-semibold leading-[1.1] tracking-[-0.025em] sm:text-6xl">
              10 echte Designs.
              <br className="hidden sm:block" />
              <span className="text-muted-foreground/80">
                Nicht nur Farb-Varianten.
              </span>
            </h2>
            <p className="text-muted-foreground mx-auto mt-6 max-w-xl text-pretty">
              Fünf Persönlichkeiten — soft, klinisch, editorial, handwerklich,
              klassisch — kombiniert mit drei Hero-Layouts und Branchen-Farben.
              Sonnen für Pflege, Noir für Friseur, Oxford für Anwalt, Werkstatt
              für Schreinerei. Tausche was du tauschen willst.
            </p>
          </header>

          <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {ALL_TEMPLATE_KEYS.map((key) => {
              const meta = getTemplateMeta(key);
              return (
                <div
                  key={key}
                  className="border-border bg-card group overflow-hidden rounded-2xl border p-3 transition-all hover:-translate-y-1 hover:shadow-xl"
                >
                  <TemplatePreview
                    templateKey={key}
                    hero={meta.hero}
                    personality={meta.personality}
                  />
                  <div className="mt-3 px-2 pb-2">
                    <div className="flex items-baseline justify-between gap-2">
                      <h3 className="text-base font-semibold tracking-tight">
                        {meta.label}
                      </h3>
                      <span className="text-muted-foreground/70 text-[10px] tracking-[0.18em] uppercase">
                        {meta.industry}
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-1 line-clamp-2 text-xs text-pretty">
                      {meta.vibe}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              href="/register"
              className="border-border bg-background hover:bg-secondary inline-flex h-11 items-center justify-center rounded-full border px-6 text-sm font-medium transition-all hover:scale-[1.02]"
            >
              Mein Design auswählen
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Feature spotlights ===== */}
      <section id="funktionen" className="border-border/60 border-y bg-secondary/30 py-28 sm:py-36">
        <div className="mx-auto w-full max-w-6xl px-6">
          <header className="mx-auto max-w-3xl text-center">
            <p className="text-muted-foreground text-[11px] font-medium tracking-[0.2em] uppercase">
              Funktionen
            </p>
            <h2 className="mt-3 text-4xl font-semibold leading-[1.1] tracking-[-0.025em] sm:text-6xl">
              Alles drin.
              <br className="hidden sm:block" />
              <span className="text-muted-foreground/80">Ohne Plugin-Hölle.</span>
            </h2>
          </header>

          <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, body }) => (
              <article
                key={title}
                className="bg-background border-border rounded-2xl border p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <span className="bg-primary/10 text-primary mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-lg font-semibold tracking-tight">
                  {title}
                </h3>
                <p className="text-muted-foreground mt-2 text-[14px] leading-relaxed text-pretty">
                  {body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Walkthrough ===== */}
      <section className="py-28 sm:py-36">
        <div className="mx-auto w-full max-w-6xl px-6">
          <header className="mx-auto max-w-3xl text-center">
            <p className="text-muted-foreground text-[11px] font-medium tracking-[0.2em] uppercase">
              So funktioniert&apos;s
            </p>
            <h2 className="mt-3 text-4xl font-semibold leading-[1.1] tracking-[-0.025em] sm:text-6xl">
              Drei Schritte.
              <br className="hidden sm:block" />
              <span className="text-muted-foreground/80">Eine Website.</span>
            </h2>
          </header>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {steps.map((step) => (
              <div
                key={step.n}
                className="border-border bg-card group relative overflow-hidden rounded-3xl border p-8 transition-all hover:-translate-y-1 hover:shadow-xl"
              >
                <div
                  aria-hidden
                  className={`pointer-events-none absolute -top-12 -right-12 h-40 w-40 rounded-full bg-gradient-to-br ${step.accent} blur-2xl`}
                />
                <span className="text-foreground/40 relative font-mono text-sm tracking-widest">
                  {step.n}
                </span>
                <h3 className="relative mt-4 text-2xl font-semibold tracking-tight">
                  {step.title}
                </h3>
                <p className="text-muted-foreground relative mt-3 text-[15px] leading-relaxed text-pretty">
                  {step.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Comparison ===== */}
      <section
        id="vergleich"
        className="border-border/60 border-y bg-secondary/30 py-28 sm:py-36"
      >
        <div className="mx-auto w-full max-w-5xl px-6">
          <header className="mx-auto max-w-3xl text-center">
            <p className="text-muted-foreground text-[11px] font-medium tracking-[0.2em] uppercase">
              Vergleich
            </p>
            <h2 className="mt-3 text-4xl font-semibold leading-[1.1] tracking-[-0.025em] sm:text-6xl">
              Selber bauen.
              <br className="hidden sm:block" />
              Agentur. <span className="text-primary">Sitalo.</span>
            </h2>
            <p className="text-muted-foreground mx-auto mt-6 max-w-xl text-pretty">
              Drei Wege. Ein Vergleich. Sehr ehrlich.
            </p>
          </header>

          <div className="mt-16 overflow-x-auto">
            <table className="border-border bg-background ring-border/60 min-w-full overflow-hidden rounded-3xl border text-sm shadow-sm ring-1">
              <thead className="bg-muted/50 text-muted-foreground text-left text-[11px] tracking-[0.15em] uppercase">
                <tr>
                  <th className="px-6 py-5">Kriterium</th>
                  <th className="px-6 py-5">Selber bauen</th>
                  <th className="px-6 py-5">Agentur</th>
                  <th className="text-foreground bg-primary/8 px-6 py-5">
                    <span className="inline-flex items-center gap-1.5">
                      <Sparkles className="text-primary h-3.5 w-3.5" />
                      Sitalo
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border/60 divide-y">
                {comparison.map((row) => (
                  <tr key={row.feature}>
                    <td className="px-6 py-4 font-medium">{row.feature}</td>
                    <td className="text-muted-foreground px-6 py-4">
                      <Cell value={row.diy} />
                    </td>
                    <td className="text-muted-foreground px-6 py-4">
                      <Cell value={row.agency} />
                    </td>
                    <td className="bg-primary/8 px-6 py-4 font-medium">
                      <Cell value={row.sitalo} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== Testimonials ===== */}
      <section className="py-28 sm:py-36">
        <div className="mx-auto w-full max-w-6xl px-6">
          <header className="mx-auto max-w-3xl text-center">
            <p className="text-muted-foreground text-[11px] font-medium tracking-[0.2em] uppercase">
              Was Kunden sagen
            </p>
            <h2 className="mt-3 text-4xl font-semibold leading-[1.1] tracking-[-0.025em] sm:text-6xl">
              Echte Stimmen.
              <br className="hidden sm:block" />
              <span className="text-muted-foreground/80">Echte Sites.</span>
            </h2>
          </header>

          <div className="mt-16 grid gap-6 lg:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="border-border bg-card relative flex flex-col rounded-3xl border p-8 shadow-sm"
              >
                <div className="text-amber-500 flex gap-0.5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <blockquote className="text-foreground/90 mt-5 text-[16px] leading-[1.6] text-pretty">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t pt-5">
                  <span className="from-primary inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br to-amber-700 text-sm font-semibold text-white">
                    {t.initials}
                  </span>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-muted-foreground text-xs">
                      {t.role}
                    </div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Pricing teaser ===== */}
      <section className="border-border/60 border-y bg-secondary/30 py-28 sm:py-36">
        <div className="mx-auto w-full max-w-5xl px-6">
          <header className="mx-auto max-w-3xl text-center">
            <p className="text-muted-foreground text-[11px] font-medium tracking-[0.2em] uppercase">
              Preise
            </p>
            <h2 className="mt-3 text-4xl font-semibold leading-[1.1] tracking-[-0.025em] sm:text-6xl">
              Drei Pakete.
              <br className="hidden sm:block" />
              <span className="text-muted-foreground/80">Monatlich kündbar.</span>
            </h2>
            <p className="text-muted-foreground mx-auto mt-6 max-w-xl text-pretty">
              7 Tage gratis testen. Keine Einrichtungsgebühr. Keine versteckten
              Kosten.
            </p>
          </header>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <PriceCard
              name="Basic"
              price="9"
              tagline="Eine professionelle Website. Live in Minuten."
              features={[
                "1 öffentliche Website",
                "Kontaktformular DSGVO-konform",
                "10 Branchen-Designs",
                "SEO-Grundlagen + Sitemap",
              ]}
            />
            <PriceCard
              name="Pro"
              price="19"
              tagline="Plus aktive Recruiting-Funktion."
              features={[
                "Alles aus Basic",
                "Bewerbungsformular",
                "Erweiterte SEO-Felder",
                "8 Block-Typen pro Seite",
                "E-Mail-Support",
              ]}
              highlight
            />
            <PriceCard
              name="Premium"
              price="39"
              tagline="Eigene Domain & Setup-Service."
              features={[
                "Alles aus Pro",
                "Eigene Domain (CNAME)",
                "Priorisierter Support",
                "Setup-Service inklusive",
                "Performance-Report",
              ]}
            />
          </div>

          <div className="mt-12 flex justify-center">
            <Link
              href="/pricing"
              className="text-foreground hover:text-primary inline-flex items-center gap-1.5 text-sm font-medium underline-offset-4 hover:underline"
            >
              Vollständige Pakete vergleichen
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="py-28 sm:py-36">
        <div className="mx-auto w-full max-w-3xl px-6">
          <header className="text-center">
            <p className="text-muted-foreground text-[11px] font-medium tracking-[0.2em] uppercase">
              FAQ
            </p>
            <h2 className="mt-3 text-4xl font-semibold leading-[1.1] tracking-[-0.025em] sm:text-6xl">
              Häufige Fragen.
            </h2>
          </header>

          <div className="bg-card ring-border/60 mt-16 divide-y rounded-3xl border shadow-sm ring-1">
            {faq.map(({ q, a }) => (
              <details
                key={q}
                className="group p-7 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium tracking-tight">
                  <span>{q}</span>
                  <span className="text-muted-foreground transition-transform group-open:rotate-90">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </summary>
                <p className="text-muted-foreground mt-4 text-[15px] leading-relaxed text-pretty">
                  {a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Final CTA ===== */}
      <section className="px-6 pb-32">
        <div className="from-primary/15 via-primary/5 ring-primary/20 relative mx-auto w-full max-w-5xl overflow-hidden rounded-[40px] bg-gradient-to-br to-amber-700/15 p-12 text-center shadow-xl ring-1 sm:p-16">
          <div
            aria-hidden
            className="bg-primary/15 pointer-events-none absolute -top-20 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full blur-3xl"
          />
          <h2 className="text-foreground text-4xl font-semibold leading-[1.05] tracking-[-0.025em] text-balance sm:text-6xl">
            Bereit, online zu gehen?
          </h2>
          <p className="text-muted-foreground mx-auto mt-6 max-w-xl text-pretty sm:text-lg">
            Konto anlegen, Branche wählen, ausfüllen, klicken. 7 Tage gratis,
            keine Kreditkarte.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/register"
              className="bg-primary text-primary-foreground group inline-flex h-12 items-center justify-center rounded-full px-7 text-[15px] font-medium tracking-tight shadow-lg transition-all hover:scale-[1.03] hover:shadow-xl"
            >
              Jetzt kostenlos starten
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/pricing"
              className="border-border bg-background hover:bg-secondary inline-flex h-12 items-center justify-center rounded-full border px-7 text-[15px] font-medium tracking-tight transition-all hover:scale-[1.02]"
            >
              Pakete ansehen
            </Link>
          </div>
        </div>
      </section>

      {/* ===== Rich footer ===== */}
      <footer className="border-border bg-secondary/20 border-t">
        <div className="mx-auto w-full max-w-7xl px-6 py-16">
          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <SitaloLogo size="md" />
              <p className="text-muted-foreground mt-5 max-w-xs text-sm leading-relaxed">
                Die Website-Plattform für lokale Dienstleister in Deutschland.
                Schnell, ehrlich, monatlich kündbar.
              </p>
            </div>

            <FooterCol title="Produkt">
              <FooterLink href="#designs">Designs</FooterLink>
              <FooterLink href="#funktionen">Funktionen</FooterLink>
              <FooterLink href="/pricing">Preise</FooterLink>
              <FooterLink href="#vergleich">Vergleich</FooterLink>
            </FooterCol>

            <FooterCol title="Konto">
              <FooterLink href="/register">Kostenlos starten</FooterLink>
              <FooterLink href="/login">Login</FooterLink>
              <FooterLink href="/forgot-password">Passwort vergessen</FooterLink>
            </FooterCol>

            <FooterCol title="Rechtliches">
              <FooterLink href="/impressum">Impressum</FooterLink>
              <FooterLink href="/datenschutz">Datenschutz</FooterLink>
              <FooterLink href="/agb">AGB</FooterLink>
            </FooterCol>
          </div>

          <div className="border-border/60 text-muted-foreground mt-12 flex flex-col items-center justify-between gap-3 border-t pt-8 text-xs sm:flex-row">
            <span>© {new Date().getFullYear()} Sitalo Webdesign</span>
            <span>Made for local businesses · EU-gehostet · DSGVO-konform</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

function NavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-muted-foreground hover:bg-secondary hover:text-foreground inline-flex h-9 items-center justify-center rounded-full px-3.5 transition-colors"
    >
      {children}
    </Link>
  );
}

function Stat({
  value,
  label,
  highlight,
}: {
  value: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`bg-background flex flex-col items-center justify-center gap-1.5 px-6 py-10 text-center ${highlight ? "bg-primary/5" : ""}`}
    >
      <span className="text-3xl font-semibold tracking-[-0.02em] tabular-nums sm:text-4xl">
        {value}
      </span>
      <span className="text-muted-foreground text-[11px] font-medium tracking-[0.15em] uppercase">
        {label}
      </span>
    </div>
  );
}

function PriceCard({
  name,
  price,
  tagline,
  features,
  highlight,
}: {
  name: string;
  price: string;
  tagline: string;
  features: string[];
  highlight?: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col rounded-3xl border p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ${
        highlight
          ? "ring-primary border-primary bg-card ring-2"
          : "border-border bg-card"
      }`}
    >
      {highlight ? (
        <span className="bg-primary text-primary-foreground absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-bold tracking-[0.15em] uppercase">
          Beliebt
        </span>
      ) : null}
      <h3 className="text-2xl font-semibold tracking-tight">{name}</h3>
      <p className="text-muted-foreground mt-1.5 text-sm">{tagline}</p>
      <div className="mt-6 flex items-baseline gap-1">
        <span className="text-5xl font-semibold tracking-[-0.04em]">
          {price}
        </span>
        <span className="text-foreground/70 text-lg">€</span>
        <span className="text-muted-foreground text-sm">/ Monat</span>
      </div>
      <ul className="mt-7 flex flex-1 flex-col gap-3 text-sm">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <Check className="text-primary mt-0.5 h-4 w-4 shrink-0" />
            <span className="text-pretty">{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterCol({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h4 className="text-foreground text-[11px] font-semibold tracking-[0.2em] uppercase">
        {title}
      </h4>
      <ul className="mt-4 space-y-2.5 text-sm">{children}</ul>
    </div>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-muted-foreground hover:text-foreground transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}

function Cell({ value }: { value: string }) {
  if (value === "true") {
    return (
      <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-300">
        <Check className="h-4 w-4" />
        <span className="font-medium">Ja</span>
      </span>
    );
  }
  if (value === "false") {
    return (
      <span className="text-muted-foreground inline-flex items-center gap-1.5">
        <X className="h-4 w-4" />
        <span>Nein</span>
      </span>
    );
  }
  if (value === "minus") {
    return (
      <span className="text-muted-foreground inline-flex items-center gap-1.5">
        <Minus className="h-4 w-4" />
        <span>Aufpreis</span>
      </span>
    );
  }
  return <span>{value}</span>;
}
