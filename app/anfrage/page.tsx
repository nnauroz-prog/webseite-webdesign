import type { Metadata } from "next";

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
  const formspreeId = process.env.FORMSPREE_FORM_ID?.trim() || undefined;

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />

      <main className="flex-1">
        <section className="border-border/40 border-b">
          <div className="mx-auto grid w-full max-w-7xl gap-16 px-6 py-20 sm:py-28 lg:grid-cols-[1fr_1.2fr] lg:gap-20 lg:py-32">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <h1 className="text-5xl font-semibold leading-[1.0] tracking-[-0.04em] text-balance sm:text-6xl lg:text-7xl">
                Lassen Sie uns
                <br />
                <span className="serif-italic text-muted-foreground font-normal">
                  Ihre Seite bauen.
                </span>
              </h1>
              <p className="text-muted-foreground mt-8 max-w-lg text-pretty text-lg leading-relaxed">
                Sagen Sie mir kurz, was Sie brauchen. Ich melde mich
                persönlich innerhalb von 24 Stunden — mit einem klaren
                Vorschlag, was möglich ist und was es kostet.
              </p>

              <ul className="divide-border/60 mt-10 divide-y">
                {TRUST.map((item) => (
                  <li
                    key={item}
                    className="text-foreground/85 flex items-baseline gap-4 py-3 text-[15px]"
                  >
                    <span className="text-muted-foreground/70 font-mono text-xs">
                      ·
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="border-border/60 mt-10 border-t pt-8">
                <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.25em]">
                  Lieber direkt
                </p>
                <a
                  href="mailto:info@sitalo.de"
                  className="text-foreground mt-3 inline-block text-lg underline underline-offset-4 hover:no-underline"
                >
                  info@sitalo.de
                </a>
              </div>
            </div>

            <div>
              <InquiryForm
                initialPackage={initialPackage}
                formspreeId={formspreeId}
              />
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
