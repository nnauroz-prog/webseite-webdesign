import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Domain wird eingerichtet",
  robots: { index: false, follow: false },
};

/**
 * Placeholder shown to visitors when DNS for a custom domain points at us
 * but we haven't finished verifying / activating the host yet. The
 * middleware rewrites unverified custom-domain requests here.
 */
export default function DomainPendingPage() {
  return (
    <main className="bg-background flex min-h-screen flex-1 items-center justify-center px-6 py-16">
      <div className="text-center">
        <div className="bg-accent text-accent-foreground mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>
        <h1 className="mt-5 text-2xl font-semibold tracking-tight">
          Diese Seite wird gerade eingerichtet.
        </h1>
        <p className="text-muted-foreground mx-auto mt-3 max-w-md text-pretty">
          Die Domain ist bei uns hinterlegt, wird aber gerade noch verbunden.
          Das kann bis zu 24 Stunden dauern, bis DNS-Änderungen weltweit
          aktiv sind. Bitte später erneut probieren.
        </p>
      </div>
    </main>
  );
}
