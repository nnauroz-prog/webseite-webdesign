import Link from "next/link";

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

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <header className="border-border/60 border-b">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <span className="text-sm font-semibold tracking-tight">SitePilot</span>
          <nav className="flex items-center gap-2">
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

      <section className="mx-auto flex w-full max-w-5xl flex-col items-center px-6 py-20 text-center sm:py-28">
        <span className="border-border bg-secondary text-secondary-foreground mb-6 inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium">
          SitePilot · für lokale Unternehmen
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
            href="/login"
            className="border-border bg-background hover:bg-secondary inline-flex h-11 items-center justify-center rounded-md border px-6 text-sm font-medium transition"
          >
            Zum Kunden-Login
          </Link>
        </div>
        <p className="text-muted-foreground mt-6 text-xs">
          Keine Kreditkarte. Keine versteckten Kosten. In 10 Minuten online.
        </p>
      </section>

      <section className="border-border/60 bg-secondary/30 border-y">
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
                className={`border-border bg-background relative overflow-hidden rounded-lg border p-6`}
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
              <span className="text-muted-foreground/60 text-sm font-mono">
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

      <section className="border-border/60 bg-secondary/30 border-y">
        <div className="mx-auto w-full max-w-6xl px-6 py-20">
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
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl px-6 py-20 text-center">
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
            href="/login"
            className="border-border bg-background hover:bg-secondary inline-flex h-11 items-center justify-center rounded-md border px-6 text-sm font-medium transition"
          >
            Ich habe schon ein Konto
          </Link>
        </div>
      </section>

      <footer className="border-border border-t">
        <div className="text-muted-foreground mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-xs">
          <span>© {new Date().getFullYear()} SitePilot</span>
          <span>Made for local businesses.</span>
        </div>
      </footer>
    </main>
  );
}
