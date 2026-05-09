import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 py-24 text-center">
        <span className="border-border bg-secondary text-secondary-foreground mb-6 inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium">
          SitePilot · MVP
        </span>
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          Professionelle Webseiten für lokale Unternehmen.
        </h1>
        <p className="text-muted-foreground mt-6 max-w-2xl text-lg text-pretty">
          Pflegedienste, Arztpraxen, Friseure, Handwerker — wir liefern eine
          fertige Website, du verwaltest Inhalte selbst über ein klares
          Dashboard.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/login"
            className="bg-primary text-primary-foreground inline-flex h-11 items-center justify-center rounded-md px-6 text-sm font-medium transition hover:opacity-90"
          >
            Zum Kunden-Login
          </Link>
          <Link
            href="/register"
            className="border-border bg-background hover:bg-secondary inline-flex h-11 items-center justify-center rounded-md border px-6 text-sm font-medium transition"
          >
            Konto anlegen
          </Link>
        </div>
      </section>
      <footer className="border-border border-t">
        <div className="text-muted-foreground mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-6 text-xs">
          <span>© {new Date().getFullYear()} SitePilot</span>
          <span>Made for local businesses.</span>
        </div>
      </footer>
    </main>
  );
}
