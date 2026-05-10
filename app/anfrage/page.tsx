import type { Metadata } from "next";
import Link from "next/link";

import { InquiryForm } from "@/components/marketing/inquiry-form";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import {
  INQUIRY_PACKAGES,
  type InquiryPackage,
} from "@/lib/validations/inquiries";

export const metadata: Metadata = {
  title: "Website anfragen — Sitalo",
  description:
    "Senden Sie uns kurz, was Sie brauchen — wir melden uns innerhalb von 24 Stunden mit einem persönlichen Angebot.",
  alternates: { canonical: "/anfrage" },
};

const TRUST = [
  "Antwort innerhalb von 24 Stunden",
  "Persönlicher Ansprechpartner",
  "Unverbindlich & kostenlos",
];

/**
 * Read the `?paket=` query parameter and clamp it to a valid
 * `InquiryPackage` value. Unknown values are dropped so we never
 * preselect garbage.
 */
function resolveInitialPackage(
  raw: string | string[] | undefined,
): InquiryPackage | undefined {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return undefined;
  return (INQUIRY_PACKAGES as readonly string[]).includes(value)
    ? (value as InquiryPackage)
    : undefined;
}

export default async function AnfragePage({
  searchParams,
}: {
  searchParams: Promise<{ paket?: string }>;
}) {
  const params = await searchParams;
  const initialPackage = resolveInitialPackage(params.paket);

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />

      <main className="flex-1">
        <section className="border-border/40 border-b py-16 sm:py-24">
          <div className="mx-auto grid w-full max-w-6xl gap-12 px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
            <div className="space-y-8">
              <div>
                <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.2em]">
                  Anfrage
                </p>
                <h1 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-5xl">
                  Lass uns deine Website bauen.
                </h1>
                <p className="text-muted-foreground mt-5 text-lg leading-relaxed text-pretty">
                  Sag uns kurz, was du brauchst. Wir melden uns persönlich
                  innerhalb von 24 Stunden — mit einem klaren Vorschlag, was
                  möglich ist und was es kostet.
                </p>
              </div>

              <ul className="space-y-3">
                {TRUST.map((item) => (
                  <li
                    key={item}
                    className="text-foreground/80 flex items-center gap-3 text-sm"
                  >
                    <span className="bg-primary/10 text-primary inline-flex h-6 w-6 items-center justify-center rounded-full">
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      >
                        <path
                          d="M5 13l4 4L19 7"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="border-border/60 bg-secondary/30 rounded-2xl border p-6">
                <h2 className="text-base font-semibold tracking-tight">
                  Lieber direkt schreiben?
                </h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  Schreib uns eine E-Mail — wir antworten oft noch am selben
                  Tag.
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <a
                    href="mailto:hallo@sitalo.de"
                    className="border-border bg-background hover:bg-secondary inline-flex h-10 items-center justify-center rounded-full border px-4 text-sm"
                  >
                    hallo@sitalo.de
                  </a>
                </div>
                <p className="text-muted-foreground mt-3 text-xs">
                  Bestehender Kunde?{" "}
                  <Link
                    href="/login"
                    className="hover:text-foreground underline"
                  >
                    Zum Kundenlogin
                  </Link>
                </p>
              </div>
            </div>

            <div>
              <InquiryForm initialPackage={initialPackage} />
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
