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
    "Senden Sie uns kurz, was Sie brauchen — wir melden uns innerhalb von 24 Stunden mit einem persönlichen Angebot.",
  alternates: { canonical: "/anfrage" },
};

const TRUST = [
  "Antwort innerhalb von 24 Stunden — meistens deutlich schneller",
  "Persönlicher Ansprechpartner aus dem Hamburger Atelier",
  "Unverbindlich & kostenlos — kein Vertrag, kein Druck",
  "Erste Einschätzung mit ehrlichem Preisrahmen",
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
          {/* Dezenter Gold-Halo links oben — konsistent mit Hero-
              Sprache der restlichen Site. */}
          <div
            aria-hidden="true"
            className="bg-gold/10 pointer-events-none absolute -top-32 -left-20 -z-10 h-[28rem] w-[28rem] rounded-full blur-[60px] sm:blur-[120px]"
          />
          <div className="mx-auto grid w-full max-w-7xl gap-16 px-6 py-20 sm:py-28 lg:grid-cols-[1fr_1.2fr] lg:gap-20 lg:py-32">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="text-muted-foreground inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em]">
                <span
                  aria-hidden="true"
                  className="bg-gold gold-pulse inline-block h-1 w-6"
                />
                Drei Schritte, zwei Minuten
              </p>
              <h1 className="mt-6 text-balance text-5xl font-semibold leading-[1.0] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                Erzählen Sie uns,
                <br />
                <span className="serif-italic text-muted-foreground font-normal">
                  was Sie vorhaben.
                </span>
              </h1>
              <p className="text-muted-foreground mt-8 max-w-lg text-pretty text-lg leading-relaxed">
                Branche, Art der Seite, ein paar Kontaktdaten. Mehr
                brauchen wir jetzt nicht. Wir melden uns innerhalb von
                24 Stunden persönlich aus dem Hamburger Atelier —
                meist deutlich schneller — mit ehrlichem Preisrahmen
                und konkretem nächstem Schritt.
              </p>

              <ul className="divide-border/60 mt-10 divide-y border-y">
                {TRUST.map((item) => (
                  <li
                    key={item}
                    className="text-foreground/85 flex items-baseline gap-4 py-3.5 text-[15px]"
                  >
                    <span
                      aria-hidden="true"
                      className="bg-ink-olive mt-2 inline-block h-1 w-1 shrink-0 rounded-full"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <p className="serif-italic text-foreground/75 mt-10 max-w-md text-pretty text-lg leading-snug">
                — Sie schicken drei Sachen, wir liefern den Rest.
                Übermorgen sind Sie online.
              </p>

              <div className="border-border/60 mt-10 border-t pt-8">
                <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.25em]">
                  Lieber direkt
                </p>
                <div className="mt-4 flex flex-wrap gap-2.5">
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

            <div>
              <InquiryForm
                initialPackage={initialPackage}
                initialIndustry={initialIndustry}
                initialMessage={initialMessage}
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
