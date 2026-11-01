import type { Metadata } from "next";

import { InquiryForm } from "@/components/marketing/inquiry-form";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { PageHero } from "@/components/marketing/page-hero";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import {
  INQUIRY_PACKAGES,
  type InquiryPackage,
} from "@/lib/validations/inquiries";

export const metadata: Metadata = {
  title: "Website anfragen",
  description:
    "Das Formular hat drei Felder. Wir antworten aus Hamburg, meist am selben Werktag.",
  alternates: { canonical: "/anfrage" },
};

/**
 * Hafen-Formen für das Anfrageformular. inquiry-form.tsx ist gesperrt
 * (Lead-Logik); diese Regeln greifen nur, solange dort noch die alten
 * Klassen stehen: große Rundungen werden kantig, der weiche Schatten
 * fällt weg, Pillen-Knöpfe werden zu 2 px. Wird das Formular selbst
 * umgestellt, laufen die Regeln ins Leere.
 */
const FORM_HAFEN =
  "[&_.rounded-3xl]:rounded-[3px] [&_.rounded-2xl]:rounded-[3px] [&_.shadow-xl]:shadow-none [&_.ring-1]:ring-0 [&_.h-12.rounded-full]:rounded-[2px] [&_.h-11.rounded-full]:rounded-[2px] [&_.shadow-md]:shadow-none";

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
          crumb="Anfrage"
          eyebrow="Website anfragen"
          title="Erzählen Sie uns, was Sie vorhaben."
        >
          Das Formular hat drei Felder. Ob Sie danach bei uns bauen lassen,
          entscheiden Sie, wenn das Angebot vorliegt.
        </PageHero>

        <section aria-label="Anfrageformular">
          <div className="mx-auto w-full max-w-6xl px-5 pt-10 pb-16 sm:px-6 sm:pt-14 sm:pb-24">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
              <div className="min-w-0 lg:col-span-7">
                <div className={FORM_HAFEN}>
                  <InquiryForm
                    initialPackage={initialPackage}
                    initialIndustry={initialIndustry}
                    initialMessage={initialMessage}
                  />
                </div>
              </div>

              <aside className="space-y-12 lg:col-span-4 lg:col-start-9 lg:pt-10">
                <div>
                  <h2 className="label-mono text-muted-foreground">Danach</h2>
                  <ol className="border-foreground mt-5 border-t">
                    {DANACH.map((s, i) => (
                      <li
                        key={s.title}
                        className="border-border grid grid-cols-[2.5rem_1fr] border-b py-4"
                      >
                        <span className="text-gold pt-0.5 font-mono text-[12.5px] font-semibold tabular-nums">
                          {String(i + 1).padStart(2, "0")}
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

                <div>
                  <h2 className="label-mono text-muted-foreground">Lieber direkt</h2>
                  <a
                    href="tel:+491607621876"
                    className="text-foreground hover:text-gold mt-4 block text-[2rem] leading-none tracking-[-0.03em] whitespace-nowrap transition-colors sm:text-[2.25rem]"
                    style={{ fontStretch: "118%", fontWeight: 780 }}
                  >
                    0160&nbsp;7621876
                  </a>
                  <dl className="mt-6 space-y-2.5 text-[14.5px]">
                    <div className="flex gap-3">
                      <dt className="label-mono text-muted-foreground w-20 shrink-0 pt-0.5">Mail</dt>
                      <dd className="min-w-0">
                        <a
                          href="mailto:info@sitalo.de"
                          className="text-foreground font-semibold underline-offset-4 hover:underline"
                        >
                          info@sitalo.de
                        </a>
                      </dd>
                    </div>
                    <div className="flex gap-3">
                      <dt className="label-mono text-muted-foreground w-20 shrink-0 pt-0.5">Kontakt</dt>
                      <dd className="min-w-0">
                        <a
                          href="/sitalo-kontakt.vcf"
                          download="Sitalo-Webdesign.vcf"
                          className="text-foreground font-semibold underline-offset-4 hover:underline"
                        >
                          Im Adressbuch speichern
                        </a>
                      </dd>
                    </div>
                  </dl>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
