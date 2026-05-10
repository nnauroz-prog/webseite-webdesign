import Link from "next/link";
import {
  ArrowRight,
  Check,
  ClipboardEdit,
  Globe2,
  Inbox,
  Minus,
  X,
} from "lucide-react";

import { SitaloLogo } from "@/components/sitalo-logo";

const features = [
  {
    title: "Fertige Branchen-Templates",
    body: "Pflege, Arzt, Friseur, Handwerk — passende Layouts, Farben und Inhalte. Kein leeres Blatt, kein Designer nötig.",
  },
  {
    title: "Dashboard statt Code",
    body: "Texte, Bilder, Services, Team und Galerie selbst pflegen. Kein WordPress, keine Plugins, keine Updates.",
  },
  {
    title: "Kontakt- & Bewerbungs­formulare",
    body: "Anfragen und Bewerbungen landen direkt in deinem Posteingang. Spam-geschützt, DSGVO-konform.",
  },
  {
    title: "Eigene Domain & SEO",
    body: "Saubere URL, schnelle Ladezeit, Sitemap, Meta-Tags. Bereit für Google ab Tag eins.",
  },
  {
    title: "Impressum & Datenschutz",
    body: "Pflichtseiten automatisch eingebunden. Du trägst deine Daten ein, der Rest läuft.",
  },
  {
    title: "Bilder einfach hochladen",
    body: "Logo, Team-Fotos, Galerie — direkt im Dashboard. Optimiert für Web, sofort live.",
  },
];

const steps = [
  {
    n: "01",
    title: "Konto anlegen",
    body: "Email, Passwort, fertig. Keine Kreditkarte für den Start.",
  },
  {
    n: "02",
    title: "Branche & Inhalte wählen",
    body: "Wähle deine Branche, fülle ein paar Felder im Dashboard aus.",
  },
  {
    n: "03",
    title: "Veröffentlichen",
    body: "Ein Klick — deine Website ist live unter deinem Slug.",
  },
];

const industries = [
  { label: "Pflegedienste", color: "from-emerald-500/20 to-emerald-500/0" },
  { label: "Arztpraxen", color: "from-sky-500/20 to-sky-500/0" },
  { label: "Friseure & Barber", color: "from-zinc-700/30 to-zinc-700/0" },
  { label: "Handwerk", color: "from-amber-500/20 to-amber-500/0" },
];

const walkthrough = [
  {
    icon: ClipboardEdit,
    title: "Inhalte im Dashboard pflegen",
    body: "Felder ausfüllen wie in einem Online-Formular: Firmenname, Telefon, Leistungen, Team-Fotos, Galerie. Keine HTML-Datei, keine Plugins, keine FTP-Zugänge.",
    bullets: [
      "Logo per Drag & Drop hochladen",
      "Leistungen mit Drag-Sort sortieren",
      "Team-Mitglieder mit Foto & Rolle",
    ],
  },
  {
    icon: Globe2,
    title: "Öffentliche Website rendern",
    body: "Aus deinen Eingaben entsteht eine moderne, schnelle und mobil-optimierte Website. Optimiert für Google, mit korrektem Impressum und Datenschutz.",
    bullets: [
      "Lighthouse-Score > 90",
      "OpenGraph & Twitter-Cards",
      "Automatische Sitemap & robots.txt",
    ],
  },
  {
    icon: Inbox,
    title: "Anfragen direkt verwalten",
    body: "Kontaktformular und Bewerbungsformular landen im Dashboard. Status-Workflow von neu über kontaktiert bis abgeschlossen.",
    bullets: [
      "Honeypot-Spam-Schutz",
      "Status pro Anfrage setzen",
      "Bewerbungs-Inbox separat",
    ],
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
  { feature: "Monatliche Kosten", diy: "10–30 €", agency: "30–150 €", sitalo: "ab 29 €" },
  { feature: "Inhalte selbst pflegen", diy: "true", agency: "false", sitalo: "true" },
  { feature: "Pflichtseiten (DSGVO)", diy: "false", agency: "minus", sitalo: "true" },
  { feature: "Branchen-Template", diy: "false", agency: "minus", sitalo: "true" },
  { feature: "Updates & Wartung", diy: "false", agency: "minus", sitalo: "true" },
] as const;

const valueShifts = [
  {
    before: "Kunden googlen dich — finden nichts.",
    after: "Du bist auf der ersten Seite mit einer professionellen Online-Präsenz.",
  },
  {
    before: "Anfragen kommen über WhatsApp und gehen unter.",
    after: "Kontaktformular landet im Dashboard — mit Status pro Anfrage.",
  },
  {
    before: "Bewerber:innen rufen an, du bist im Termin.",
    after: "Bewerbungen kommen mit allen Infos schriftlich rein.",
  },
  {
    before: "Du zahlst eine Agentur jeden Monat für Mini-Änderungen.",
    after: "Telefonnummer geändert? Drei Klicks im Dashboard, fertig.",
  },
];

const faq = [
  {
    q: "Brauche ich technische Vorkenntnisse?",
    a: "Nein. Wenn du eine E-Mail schreiben kannst, kannst du auch deine Sitalo-Website pflegen. Alles läuft über ein einfaches Formular im Dashboard.",
  },
  {
    q: "Was kostet das genau?",
    a: "Drei Pakete ab 29 € pro Monat, monatlich kündbar. Keine Einrichtungsgebühr. Solange du nicht veröffentlichst, kostet es nichts — der Demo-Modus ist gratis.",
  },
  {
    q: "Kann ich meine eigene Domain benutzen?",
    a: "Ja, im Premium-Paket. Du verbindest deine Domain (z. B. meinepflege.de) per CNAME — wir liefern dir die genaue Anleitung.",
  },
  {
    q: "Was passiert, wenn ich kündige?",
    a: "Deine öffentliche Website geht offline. Deine Inhalte im Dashboard bleiben erhalten — du kannst jederzeit erneut buchen und mit einem Klick wieder live gehen.",
  },
  {
    q: "Ist das DSGVO-konform?",
    a: "Ja. Hosting in der EU (Vercel + Supabase EU-Region), Pflichtseiten Impressum & Datenschutz sind bereits eingebaut, du füllst nur deine Daten ein. Kontaktformular speichert nur, was nötig ist.",
  },
  {
    q: "Wie lange dauert es, bis ich live bin?",
    a: "Im Schnitt 30 Minuten von der Registrierung bis zur veröffentlichten Website. Die meiste Zeit geht für deine eigenen Inhalte drauf — Texte, Logo, Team-Fotos.",
  },
];

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <header className="border-border/60 border-b">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" aria-label="Sitalo Webdesign">
            <SitaloLogo size="md" priority />
          </Link>
          <nav className="flex items-center gap-2">
            <Link
              href="/pricing"
              className="hover:bg-secondary hidden h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition sm:inline-flex"
            >
              Preise
            </Link>
            <Link
              href="/login"
              className="hover:bg-secondary inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-primary text-primary-foreground inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition hover:opacity-90"
            >
              Kostenlos starten
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 py-20 text-center sm:py-28">
        <span className="border-border bg-secondary text-secondary-foreground mb-6 inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium">
          Sitalo · für lokale Unternehmen
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          Eine professionelle Website. Ohne Agentur. Ohne Code.
        </h1>
        <p className="text-muted-foreground mt-6 max-w-2xl text-lg text-pretty">
          Pflegedienste, Arztpraxen, Friseure, Handwerker — wähle ein Template,
          trage deine Inhalte ein, klick auf Veröffentlichen. Fertig.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/register"
            className="bg-primary text-primary-foreground inline-flex h-11 items-center justify-center rounded-md px-6 text-sm font-medium transition hover:opacity-90"
          >
            Jetzt kostenlos starten
          </Link>
          <Link
            href="/pricing"
            className="border-border bg-background hover:bg-secondary inline-flex h-11 items-center justify-center rounded-md border px-6 text-sm font-medium transition"
          >
            Preise ansehen
          </Link>
        </div>
        <p className="text-muted-foreground mt-6 text-xs">
          Keine Kreditkarte. Keine versteckten Kosten. In 30 Minuten online.
        </p>
      </section>

      {/* Stats / trust strip */}
      <section className="border-border/60 border-y">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-px overflow-hidden border-x sm:grid-cols-4">
          <Stat value="30 Min." label="bis online" />
          <Stat value="0 €" label="Einrichtungs­gebühr" />
          <Stat value="DSGVO" label="EU-Hosting inklusive" />
          <Stat value="ab 29 €" label="pro Monat" highlight />
        </div>
      </section>

      {/* Industries */}
      <section className="bg-secondary/30">
        <div className="mx-auto w-full max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
              Für wen
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Gemacht für lokale Dienstleister.
            </h2>
            <p className="text-muted-foreground mt-4 text-pretty">
              Du bietest einen Service vor Ort an und brauchst eine seriöse,
              schnelle Online-Präsenz — ohne dich mit Technik herumzuschlagen.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {industries.map((ind) => (
              <div
                key={ind.label}
                className="border-border bg-background relative overflow-hidden rounded-lg border p-6"
              >
                <div
                  className={`from-current pointer-events-none absolute inset-0 bg-gradient-to-br ${ind.color}`}
                  aria-hidden="true"
                />
                <span className="relative text-sm font-medium">
                  {ind.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3 steps */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
            So funktioniert&apos;s
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Drei Schritte bis zur Website.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.n}
              className="border-border bg-background relative rounded-lg border p-6"
            >
              <span className="text-muted-foreground/60 font-mono text-sm">
                {step.n}
              </span>
              <h3 className="mt-3 text-lg font-semibold tracking-tight">
                {step.title}
              </h3>
              <p className="text-muted-foreground mt-2 text-sm text-pretty">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Deep walkthrough */}
      <section className="bg-secondary/30 border-border/60 border-y">
        <div className="mx-auto w-full max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
              Im Detail
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Vom Login bis zur Anfrage — alles aus einer Hand.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {walkthrough.map(({ icon: Icon, title, body, bullets }) => (
              <div
                key={title}
                className="border-border bg-background flex flex-col rounded-2xl border p-6"
              >
                <span className="bg-secondary text-foreground inline-flex h-10 w-10 items-center justify-center rounded-lg">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-tight">
                  {title}
                </h3>
                <p className="text-muted-foreground mt-2 text-sm text-pretty">
                  {body}
                </p>
                <ul className="text-muted-foreground mt-5 space-y-2 text-sm">
                  {bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2">
                      <Check className="text-foreground/70 mt-0.5 h-4 w-4 shrink-0" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
            Was du bekommst
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Alles drin. Direkt nutzbar.
          </h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="border-border bg-background rounded-lg border p-6"
            >
              <h3 className="text-base font-semibold tracking-tight">
                {f.title}
              </h3>
              <p className="text-muted-foreground mt-2 text-sm text-pretty">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-secondary/30 border-border/60 border-y">
        <div className="mx-auto w-full max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
              Vergleich
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Selber bauen, Agentur, oder Sitalo.
            </h2>
            <p className="text-muted-foreground mt-4 text-pretty">
              Drei Wege zur Unternehmens-Website. Mit ehrlichem Vergleich.
            </p>
          </div>
          <div className="mt-12 overflow-x-auto">
            <table className="border-border bg-background min-w-full overflow-hidden rounded-xl border text-sm">
              <thead className="bg-muted/50 text-muted-foreground text-left text-xs tracking-wide uppercase">
                <tr>
                  <th className="px-5 py-4">Kriterium</th>
                  <th className="px-5 py-4">Selber bauen</th>
                  <th className="px-5 py-4">Agentur</th>
                  <th className="text-foreground bg-primary/5 px-5 py-4">
                    Sitalo
                  </th>
                </tr>
              </thead>
              <tbody className="divide-border divide-y">
                {comparison.map((row) => (
                  <tr key={row.feature}>
                    <td className="px-5 py-4 font-medium">{row.feature}</td>
                    <td className="text-muted-foreground px-5 py-4">
                      <Cell value={row.diy} />
                    </td>
                    <td className="text-muted-foreground px-5 py-4">
                      <Cell value={row.agency} />
                    </td>
                    <td className="bg-primary/5 px-5 py-4">
                      <Cell value={row.sitalo} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Value shifts (before / after) */}
      <section className="mx-auto w-full max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
            Was sich für dich ändert
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Vorher. Nachher.
          </h2>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {valueShifts.map(({ before, after }) => (
            <div
              key={before}
              className="border-border bg-background rounded-2xl border p-6"
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300">
                  <X className="h-3.5 w-3.5" />
                </span>
                <p className="text-muted-foreground text-sm text-pretty">
                  {before}
                </p>
              </div>
              <div className="mt-4 flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
                  <Check className="h-3.5 w-3.5" />
                </span>
                <p className="text-foreground text-sm font-medium text-pretty">
                  {after}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-secondary/30 border-border/60 border-y">
        <div className="mx-auto w-full max-w-3xl px-6 py-20">
          <div className="text-center">
            <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
              Häufige Fragen
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
              Was Kunden uns oft fragen.
            </h2>
          </div>
          <div className="mt-12 divide-y rounded-2xl border bg-background">
            {faq.map(({ q, a }) => (
              <details
                key={q}
                className="group p-6 [&_summary::-webkit-details-marker]:hidden"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-base font-medium">
                  <span>{q}</span>
                  <span className="text-muted-foreground transition-transform group-open:rotate-90">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </summary>
                <p className="text-muted-foreground mt-3 text-sm text-pretty">
                  {a}
                </p>
              </details>
            ))}
          </div>
          <p className="text-muted-foreground mt-8 text-center text-sm">
            Frage nicht dabei? Schreib uns eine kurze Nachricht — wir antworten
            innerhalb von 24 Stunden.
          </p>
        </div>
      </section>

      {/* About */}
      <section className="mx-auto w-full max-w-3xl px-6 py-20 text-center">
        <p className="text-muted-foreground text-sm font-medium tracking-wide uppercase">
          Wer steckt dahinter
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          Klein, fokussiert, erreichbar.
        </h2>
        <p className="text-muted-foreground mt-6 text-pretty">
          Sitalo ist ein kleines, eigenständiges Software-Produkt — keine
          Agentur mit Vertriebsabteilung. Wir bauen Tools, die lokale
          Dienstleister tatsächlich nutzen können, ohne IT-Abteilung. Wenn du
          Fragen hast, antwortet derselbe Mensch, der den Code geschrieben hat.
        </p>
      </section>

      {/* Final CTA */}
      <section className="mx-auto w-full max-w-4xl px-6 pb-24 text-center">
        <div className="border-border bg-secondary/40 rounded-3xl border p-12">
          <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            Bereit, online zu gehen?
          </h2>
          <p className="text-muted-foreground mx-auto mt-4 max-w-xl text-pretty">
            Erstelle dein Konto, fülle dein Profil aus, geh live. Du brauchst
            nichts zu installieren.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/register"
              className="bg-primary text-primary-foreground inline-flex h-11 items-center justify-center rounded-md px-6 text-sm font-medium transition hover:opacity-90"
            >
              Jetzt kostenlos starten
            </Link>
            <Link
              href="/pricing"
              className="border-border bg-background hover:bg-secondary inline-flex h-11 items-center justify-center rounded-md border px-6 text-sm font-medium transition"
            >
              Pakete ansehen
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-border border-t">
        <div className="text-muted-foreground mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-xs">
          <span>© {new Date().getFullYear()} Sitalo</span>
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/pricing" className="hover:text-foreground">
              Preise
            </Link>
            <Link href="/login" className="hover:text-foreground">
              Login
            </Link>
            <Link href="/register" className="hover:text-foreground">
              Registrieren
            </Link>
          </nav>
          <span>Made for local businesses.</span>
        </div>
      </footer>
    </main>
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
      className={`bg-background flex flex-col items-center justify-center gap-1 px-6 py-8 text-center ${highlight ? "bg-primary/5" : ""}`}
    >
      <span className="text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
        {value}
      </span>
      <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
        {label}
      </span>
    </div>
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
