import type { Metadata } from "next";
import Link from "next/link";

import { logout } from "@/app/admin/actions";
import { getAdminEmail } from "@/lib/admin/auth";

// Immer pro Request rendern — das Root-Layout setzt revalidate = 3600
// (ISR) für die Marketing-Seiten; hier darf nichts zwischengespeichert
// werden.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const email = await getAdminEmail();

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <header className="border-border/60 bg-background/90 sticky top-0 z-30 border-b backdrop-blur">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/admin" className="flex items-baseline gap-2">
            <span className="serif text-lg tracking-tight">Sitalo</span>
            <span className="text-muted-foreground text-[13px]">
              Anfragen
            </span>
          </Link>
          {email ? (
            <div className="flex items-center gap-3">
              <span className="text-muted-foreground hidden text-[13px] sm:inline">
                {email}
              </span>
              <form action={logout}>
                <button
                  type="submit"
                  className="border-border text-foreground/80 hover:text-foreground hover:border-foreground/40 h-9 rounded-full border px-4 text-[13px] font-medium transition-colors"
                >
                  Abmelden
                </button>
              </form>
            </div>
          ) : null}
        </div>
      </header>
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-10">
        {children}
      </main>
    </div>
  );
}
