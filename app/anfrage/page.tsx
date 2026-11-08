import type { Metadata } from "next";

import a from "@/components/marketing/hafen/atelier.module.css";
import { InquiryForm } from "@/components/marketing/inquiry-form";
import { Brotkrumen, UnterseiteMain, unterseiteStil as u } from "@/components/marketing/laden/unterseite";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
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
      <MarketingHeader cta={false} />

      <UnterseiteMain>
        {/* Kopf kompakt: Formular bleibt am Handy nah am Falz. Ab 1024 px
            rechts eine Notiz aus dem Büro statt eines Fotos. */}
        <section className="inhalt pt-5 sm:pt-7">
          <Brotkrumen krumen="Anfrage" />
          <div className="mt-8 grid items-end gap-8 sm:mt-12 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-14">
            <div>
              <p className={u.eyebrow}>Kontor · Website anfragen</p>
              <h1 className={`${u.titel} max-w-[15ch]!`}>Erzählen Sie uns, was Sie vorhaben.</h1>
              <p className={u.unter}>
                Name, E-Mail und eine kurze Beschreibung genügen. Ob Sie danach bei uns bauen lassen, entscheiden Sie,
                wenn das Angebot vorliegt.
              </p>
            </div>
            <aside className={`${a.notizbuch} hidden lg:block`} aria-label="Notiz">
              <p className={a.notizDatum}>Notiz · Hamburg</p>
              <p className={a.notizText}>
                Zwei, drei Sätze reichen. Was fehlt, fragen wir in der Antwort, oder wir rufen kurz an.
              </p>
            </aside>
          </div>
        </section>

        <section aria-label="Anfrageformular" className="inhalt pt-8 pb-16 sm:pt-12 sm:pb-24">
          <div className="grid gap-5 lg:grid-cols-12 lg:gap-5">
            <div className="min-w-0 lg:col-span-7">
              <InquiryForm
                initialPackage={initialPackage}
                initialIndustry={initialIndustry}
                initialMessage={initialMessage}
              />
            </div>

            <div className="space-y-3 lg:col-span-5">
              <div className="on-dark grain rounded-[6px] bg-[#1b1d1e] p-7 text-[#f3f2ee] sm:p-8" data-flaeche-dunkel="">
                <h2 className={a.eyebrow}>Danach · drei Halte</h2>
                <ol className="mt-3 divide-y divide-white/15">
                  {DANACH.map((s, i) => (
                    <li key={s.title} className="grid grid-cols-[2.5rem_1fr] py-4">
                      <span aria-hidden="true" className="font-mono text-[13px] leading-[22px] text-[#a3a8a9] tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[17px] leading-[22px] font-semibold">{s.title}</p>
                        <p className="mt-1 text-[14px] leading-[20px] text-[#a1a1a6]">{s.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="kante-stark border-border rounded-b-[6px] border-x border-b bg-[#fafaf8] p-7 sm:p-8">
                <h2 className={a.eyebrow}>Lieber direkt</h2>
                <a
                  href="tel:+491607621876"
                  className="text-foreground mt-3 inline-flex min-h-11 items-center text-[32px] leading-none font-[760] tracking-[-0.03em] whitespace-nowrap tabular-nums [font-stretch:116%] hover:underline hover:decoration-[var(--gold)] hover:decoration-2 hover:underline-offset-8"
                >
                  0160&nbsp;7621876
                </a>
                <p className="mt-4 text-[14px]">
                  <a
                    href="/sitalo-kontakt.vcf"
                    download="Sitalo-Webdesign.vcf"
                    className="link-pfeil font-semibold"
                  >
                    Im Adressbuch speichern&nbsp;<span className="pfeil" aria-hidden="true">→</span>
                  </a>
                </p>
              </div>

              <p className={`${a.mono} px-1 pt-3`}>{PREIS_HINWEIS}</p>
            </div>
          </div>
        </section>
      </UnterseiteMain>

      <MarketingFooter crumb="Anfrage" ohnePreisHinweis />
    </div>
  );
}
