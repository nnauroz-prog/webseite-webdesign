import type { Metadata } from "next";

import Image from "next/image";

import { InquiryForm } from "@/components/marketing/inquiry-form";
import { UnterseiteMain, unterseiteStil as u } from "@/components/marketing/laden/unterseite";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { Produktleiste } from "@/components/marketing/produktleiste";
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
      <Produktleiste titel="Anfrage" links={[]} />

      <UnterseiteMain>
        {/* Kopf kompakt: Formular bleibt am Handy über dem Falz. Ab 1024 px
            rechts ein kleines Bild. */}
        <section className="inhalt pt-10 sm:pt-14 lg:pt-16">
          <div className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-14">
            <div>
              <p className={u.eyebrow}>Website anfragen</p>
              <h1 className={`${u.titel} !mx-0 !max-w-[15ch] text-left`}>Erzählen Sie uns, was Sie vorhaben.</h1>
              <p className={`${u.unter} !mx-0 text-left`}>
                Name, E-Mail und eine kurze Beschreibung genügen. Ob Sie danach bei uns bauen lassen, entscheiden Sie,
                wenn das Angebot vorliegt.
              </p>
            </div>
            <div className="relative hidden aspect-[4/5] w-[320px] overflow-hidden rounded-[28px] bg-[#e8e8ed] lg:block">
              <Image
                src="/images/cafe-eimsbuettel.webp"
                alt="Café-Tisch mit zwei Stühlen an einer Kopfsteinpflasterstraße in Eimsbüttel"
                fill
                sizes="320px"
                className="object-cover"
                style={{ objectPosition: "45% 50%" }}
              />
            </div>
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
              <div className="on-dark rounded-[18px] bg-black p-7 text-[#f5f5f7] sm:rounded-[28px] sm:p-8" data-flaeche-dunkel="">
                <h2 className="text-[21px] leading-[25px] font-bold">Danach</h2>
                <ol className="mt-3 divide-y divide-white/15">
                  {DANACH.map((s, i) => (
                    <li key={s.title} className="grid grid-cols-[2.5rem_1fr] py-4">
                      <span
                        aria-hidden="true"
                        className="text-[24px] leading-[24px] font-bold text-[#ff9f5a] tabular-nums"
                      >
                        {i + 1}
                      </span>
                      <div className="min-w-0">
                        <p className="text-[17px] leading-[22px] font-semibold">{s.title}</p>
                        <p className="mt-1 text-[14px] leading-[20px] text-[#a1a1a6]">{s.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="rounded-[18px] bg-white p-7 shadow-[0_4px_16px_rgb(0_0_0/0.06)] sm:rounded-[28px] sm:p-8">
                <h2 className="text-[21px] leading-[25px] font-bold">Lieber direkt</h2>
                <a
                  href="tel:+491607621876"
                  className="text-foreground hover:text-gold-ink mt-3 inline-flex min-h-11 items-center text-[32px] leading-none font-semibold tracking-[-0.025em] whitespace-nowrap tabular-nums transition-colors"
                >
                  0160&nbsp;7621876
                </a>
                <p className="mt-4 text-[14px]">
                  <a
                    href="/sitalo-kontakt.vcf"
                    download="Sitalo-Webdesign.vcf"
                    className="text-gold-ink inline-flex min-h-11 items-center font-semibold underline-offset-2 hover:underline"
                  >
                    Im Adressbuch speichern
                  </a>
                </p>
              </div>

              <p className="px-2 pt-3 text-[12px] leading-[1.33] text-[#6e6e73]">{PREIS_HINWEIS}</p>
            </div>
          </div>
        </section>
      </UnterseiteMain>

      <MarketingFooter crumb="Anfrage" />
    </div>
  );
}
