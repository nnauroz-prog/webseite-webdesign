import type { Metadata } from "next";

import { InquiryForm } from "@/components/marketing/inquiry-form";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { PageHero } from "@/components/marketing/page-hero";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { PREIS_HINWEIS } from "@/lib/pakete-data";
import {
  INQUIRY_PACKAGES,
  type InquiryPackage,
} from "@/lib/validations/inquiries";

export const metadata: Metadata = {
  title: "Website anfragen",
  description:
    "Name, E-Mail und eine kurze Beschreibung genügen. Wir antworten aus Hamburg, meist am selben Werktag.",
  alternates: { canonical: "/anfrage" },
};

/**
 * Apple-Formen für das Anfrageformular. inquiry-form.tsx ist gesperrt
 * (Lead-Logik); diese Regeln greifen nur, solange dort noch die alten
 * Klassen stehen: Karten bekommen 18/28 px, der weiche Schatten fällt
 * weg, Pillen bleiben Pillen, Felder 12 px.
 */
const FORM_HAFEN =
  "[&_.rounded-3xl]:rounded-[18px] lg:[&_.rounded-3xl]:rounded-[28px] [&_.rounded-2xl]:rounded-[18px] [&_.shadow-xl]:shadow-none [&_.ring-1]:ring-0 [&_.shadow-md]:shadow-none [&_.rounded-md]:rounded-[12px]";

/** Was nach dem Absenden passiert. Echte Reihenfolge, daher nummeriert. */
const DANACH: { title: string; body: string }[] = [
  {
    title: "Wir antworten",
    body: "Meist am selben Werktag, per Mail oder am Telefon.",
  },
  {
    title: "Eine Viertelstunde Gespräch",
    body: "Am Telefon, per Video oder in Hamburg. Danach kennen Sie Umfang und Termin.",
  },
  {
    title: "Festpreis schriftlich",
    body: "Sie bekommen den Preis, bevor wir anfangen. Erst dann entscheiden Sie.",
  },
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

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader tone="dark" />

      <main id="main" tabIndex={-1} className="flex-1">
        <PageHero
          crumb="Anfrage" aktionen={false}
          eyebrow="Website anfragen"
          title="Erzählen Sie uns, was Sie vorhaben."
        >
          Name, E-Mail und eine kurze Beschreibung genügen. Ob Sie danach bei
          uns bauen lassen, entscheiden Sie, wenn das Angebot vorliegt.
        </PageHero>

        <section aria-label="Anfrageformular" className="flaeche-hell">
          <div className="mx-auto w-full max-w-[1200px] px-[max(var(--rinne),env(safe-area-inset-left))] py-12 sm:py-16 lg:py-20">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
              <div className="min-w-0 lg:col-span-7">
                <div className={`karte karte-weiss p-5 sm:p-8 lg:p-10 ${FORM_HAFEN}`}>
                  <InquiryForm
                    initialPackage={initialPackage}
                    initialIndustry={initialIndustry}
                    initialMessage={initialMessage}
                  />
                </div>
              </div>

              <div className="space-y-3 lg:col-span-5 lg:col-start-8">
                <div className="karte karte-weiss p-7 sm:p-8">
                  <h2 className="t-karte text-[21px]">Danach</h2>
                  <ol className="mt-3 divide-y divide-[var(--border)]">
                    {DANACH.map((s, i) => (
                      <li
                        key={s.title}
                        className="grid grid-cols-[2.5rem_1fr] py-4"
                      >
                        <span
                          aria-hidden="true"
                          className="bg-gold text-foreground inline-flex h-7 w-7 items-center justify-center rounded-full text-[13px] font-semibold tabular-nums"
                        >
                          {i + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-foreground text-[15.5px] font-semibold">
                            {s.title}
                          </p>
                          <p className="text-muted-foreground mt-1 text-[14px] leading-relaxed">
                            {s.body}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="karte karte-weiss p-7 sm:p-8">
                  <h2 className="t-karte text-[21px]">Lieber direkt</h2>
                  <a
                    href="tel:+491607621876"
                    className="text-foreground hover:text-gold-ink mt-3 inline-flex min-h-11 items-center text-[32px] leading-none font-semibold tracking-[-0.025em] whitespace-nowrap tabular-nums transition-colors"
                  >
                    0160&nbsp;7621876
                  </a>
                  <dl className="mt-6 space-y-2.5 text-[14.5px]">
                    <div className="flex gap-3">
                      <dt className="label-mono text-muted-foreground w-20 shrink-0 pt-0.5">Kontakt</dt>
                      <dd className="min-w-0">
                        <a
                          href="/sitalo-kontakt.vcf"
                          download="Sitalo-Webdesign.vcf"
                          className="text-gold-ink underline underline-offset-2 hover:decoration-2"
                        >
                          Im Adressbuch speichern
                        </a>
                      </dd>
                    </div>
                  </dl>
                </div>

                <p className="text-muted-foreground px-2 pt-3 text-[12px] leading-[1.33]">
                  {PREIS_HINWEIS}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter crumb="Anfrage" />
    </div>
  );
}
