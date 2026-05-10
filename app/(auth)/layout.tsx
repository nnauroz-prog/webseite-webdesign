import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-1 flex-col">
      <header className="border-border/60 border-b">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="text-sm font-semibold tracking-tight">
            ← Sitalo
          </Link>
          <nav className="text-muted-foreground flex items-center gap-5 text-sm">
            <Link
              href="/pricing"
              className="hover:text-foreground hidden transition-colors sm:inline"
            >
              Preise
            </Link>
            <Link href="/" className="hover:text-foreground transition-colors">
              Startseite
            </Link>
          </nav>
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">{children}</div>
      </div>

      <footer className="border-border/60 border-t">
        <div className="text-muted-foreground mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-6 text-xs">
          <span>© {new Date().getFullYear()} Sitalo</span>
          <span>Made for local businesses.</span>
        </div>
      </footer>
    </main>
  );
}
