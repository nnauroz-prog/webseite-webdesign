import Link from "next/link";

export default function SiteNotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-24 text-center">
      <p className="text-muted-foreground text-sm tracking-wide uppercase">
        404
      </p>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
        Diese Website ist nicht erreichbar.
      </h1>
      <p className="text-muted-foreground mt-3 max-w-md">
        Möglicherweise existiert die Adresse nicht oder die Website wurde
        deaktiviert.
      </p>
      <Link
        href="/"
        className="bg-primary text-primary-foreground hover:bg-primary/90 mt-8 inline-flex h-11 items-center justify-center rounded-md px-6 text-sm font-medium transition"
      >
        Zur Startseite
      </Link>
    </main>
  );
}
