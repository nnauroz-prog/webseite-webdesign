import type { Metadata, Viewport } from "next";
import Link from "next/link";

import { AdminLifecycle } from "@/app/admin/admin-lifecycle";
import { LogoutButton } from "@/app/admin/logout-button";
import { RefreshButton } from "@/app/admin/refresh-button";
import { RenderKick } from "@/app/admin/render-kick";
import { getAdminEmail } from "@/lib/admin/auth";
import { ADMIN_THEME_COLOR } from "@/lib/admin/theme";
import { SitaloLogo } from "@/components/sitalo-logo";

// Immer pro Request rendern — das Root-Layout setzt revalidate = 3600
// (ISR) für die Marketing-Seiten; hier darf nichts zwischengespeichert
// werden.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  // absolute: sonst hängt das Root-Template „ · Sitalo“ noch einmal an.
  title: { absolute: "Sitalo Admin", template: "%s · Sitalo Admin" },
  robots: { index: false, follow: false },
  // Home-Bildschirm-App: appleWebApp.capable erzeugt in Next 16 nur
  // „mobile-web-app-capable“; iOS vor 26 braucht zusätzlich die
  // apple-Variante, sonst öffnet das Symbol nicht als eigene App.
  appleWebApp: { capable: true, title: "Sitalo", statusBarStyle: "default" },
  // Safari macht sonst aus jeder Nummer im Text selbst einen Anruf-Link.
  // Angerufen wird über die eigenen Knöpfe, damit danach „Erreicht?“
  // kommt.
  formatDetection: { telephone: false, email: false, address: false },
  other: { "apple-mobile-web-app-capable": "yes" },
};

export const viewport: Viewport = {
  themeColor: ADMIN_THEME_COLOR,
  viewportFit: "cover",
};

/**
 * Seitenränder mit Safe-Area: viewportFit „cover“ zieht die Seite unter
 * Notch und Home-Indikator, im Querformat auch seitlich.
 */
const GUTTER =
  "pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const email = await getAdminEmail();

  return (
    <div
      data-admin=""
      // Unten Platz für Kontakt-/Rückgängig-Streifen (--strip-h) und,
      // auf der Detailseite, für die feste Daumenleiste (ihre Safe-Area
      // steckt schon im Fuß). Ab lg steht die Leiste im Inhalt.
      className="bg-background flex min-h-dvh flex-col pb-[var(--strip-h,0px)] has-[[data-thumb-bar]]:pb-[calc(3.5rem+var(--strip-h,0px))] lg:has-[[data-thumb-bar]]:pb-0"
    >
      <AdminLifecycle />
      <RenderKick />
      <header className="bg-foreground text-background pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex h-12 w-full max-w-2xl items-center justify-between gap-3 pr-[max(0.25rem,env(safe-area-inset-right))] pl-[max(1rem,env(safe-area-inset-left))] lg:max-w-5xl">
          <Link
            href="/admin"
            // Startseite frisch: eine offene Suche wird geschlossen.
            data-admin-home=""
            aria-label="Sitalo Admin, Übersicht"
            className="inline-flex h-11 items-center gap-3"
          >
            <SitaloLogo size="sm" tone="light" hideTaglineOnMobile />
            <span className="label-mono text-stahl-hell text-[11px]">Admin</span>
          </Link>
          {email ? <RefreshButton /> : null}
        </div>
      </header>
      <main
        id="main"
        tabIndex={-1}
        className={`mx-auto w-full max-w-2xl flex-1 pt-4 pb-8 outline-none lg:max-w-5xl lg:pt-6 ${GUTTER}`}
      >
        {children}
      </main>
      {email ? (
        <footer
          className={`border-border mx-auto w-full max-w-2xl border-t pt-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] lg:max-w-5xl ${GUTTER}`}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-muted-foreground min-w-0 truncate text-[13px]">
              Angemeldet als {email}
            </span>
            <LogoutButton />
          </div>
        </footer>
      ) : null}
    </div>
  );
}
