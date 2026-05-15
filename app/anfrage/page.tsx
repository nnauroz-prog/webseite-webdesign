import type { Metadata } from "next";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
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
    "Drei Felder, fertig. Wir melden uns persönlich aus dem Hamburger Atelier — meist noch am selben Tag.",
  alternates: { canonical: "/anfrage" },
};

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
  searchParams: Promise<{
    paket?: string;
    vorhaben?: string;
    branche?: string;
  }>;
}) {
  const params = await searchParams;
  const initialPackage = resolveInitialPackage(params.paket);
  const initialMessage = params.vorhaben?.toString().trim().slice(0, 500);
  const initialIndustry = params.branche?.toString().trim().slice(0, 40);
  const formspreeId = process.env.FORMSPREE_FORM_ID?.trim() || undefined;

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Anfrage" />

      <main className="flex-1">
        <section className="border-border/40 relative overflow-hidden border-b">
          {/* Dezenter Gold-Halo — konsistent mit Hero-Sprache. */}
          <div
            aria-hidden="true"
            className="bg-gold/10 pointer-events-none absolute -top-32 left-1/2 -z-10 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full blur-[60px] sm:blur-[120px]"
          />
          {/* Single-Column statt 2-Column-Hero: das Formular ist der
              Hauptakt, nicht ein Side-Show neben langem Marketing-Text.
              Mobile wie Desktop: Form so weit oben wie möglich. */}
          <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-24 lg:py-28">
            <div className="text-center">
              <p className="text-muted-foreground inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em]">
                <span
                  aria-hidden="true"
                  className="bg-gold gold-pulse inline-block h-1 w-6"
                />
                Drei Felder · ein Klick
              </p>
              <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
                Anfrage senden.
              </h1>
              <p className="text-muted-foreground mx-auto mt-6 max-w-lg text-pretty text-base leading-relaxed sm:text-lg">
                Antwort meist noch am selben Tag — persönlich aus dem
                Hamburger Atelier. Kein Vertrag, der gleich mitkommt.
              </p>
            </div>

            {/* Form — Hauptakt, direkt nach Header. */}
            <div className="mt-10 sm:mt-12">
              <InquiryForm
                initialPackage={initialPackage}
                initialIndustry={initialIndustry}
                initialMessage={initialMessage}
                formspreeId={formspreeId}
              />
            </div>

            {/* Lieber-direkt-Strip unterhalb — sekundärer Weg, nicht
                den Hero blockierend. */}
            <div className="border-border/60 mt-10 flex flex-col items-center gap-4 border-t pt-8 text-center sm:flex-row sm:justify-center sm:gap-3">
              <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.25em]">
                Lieber direkt
              </p>
              <div className="flex flex-wrap justify-center gap-2.5">
                <a
                  href="tel:+4915224437370"
                  className="border-foreground/30 text-foreground hover:bg-foreground hover:text-background inline-flex h-10 items-center rounded-full border px-5 text-[13px] font-medium tracking-tight transition-all"
                >
                  Anrufen
                </a>
                <a
                  href="mailto:info@sitalo.de"
                  className="border-foreground/30 text-foreground hover:bg-foreground hover:text-background inline-flex h-10 items-center rounded-full border px-5 text-[13px] font-medium tracking-tight transition-all"
                >
                  Schreiben
                </a>
                <a
                  href="/sitalo-kontakt.vcf"
                  download="Sitalo-Webdesign.vcf"
                  className="border-foreground/30 text-foreground hover:bg-foreground hover:text-background inline-flex h-10 items-center rounded-full border px-5 text-[13px] font-medium tracking-tight transition-all"
                >
                  Speichern
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
