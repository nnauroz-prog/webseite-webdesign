import type { Metadata } from "next";

import Image from "next/image";
import Link from "next/link";

import { InquiryForm } from "@/components/marketing/inquiry-form";
import { UnterseiteMain } from "@/components/marketing/laden/unterseite";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { Produktleiste } from "@/components/marketing/produktleiste";
import { PREIS_HINWEIS } from "@/lib/pakete-data";
import {
  INQUIRY_PACKAGES,
  type InquiryPackage,
} from "@/lib/validations/inquiries";

import a from "./anfrage.module.css";

export const metadata: Metadata = {
  title: "Website anfragen",
  description:
    "Name, E-Mail und eine kurze Beschreibung genügen. Wir antworten aus Hamburg, meist am selben Werktag.",
  alternates: { canonical: "/anfrage" },
};

/** Was nach dem Absenden passiert. Echte Reihenfolge, daher nummeriert. */
const DANACH: { title: string; body: string }[] = [
  {
    title: "Wir melden uns",
    body: "meist am selben Werktag, per Mail oder am Telefon.",
  },
  {
    title: "Kurzes Gespräch",
    body: "eine Viertelstunde am Telefon, per Video oder in Hamburg.",
  },
  {
    title: "Festpreis schriftlich",
    body: "bevor wir anfangen. Erst dann entscheiden Sie.",
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
        {/* Kopf bewusst kurz: am Handy steht das erste Feld früh im Bild. */}
        <section className={`inhalt ${a.kopf}`}>
          <p className="kennzeile-mono">Anfrage · Hamburg</p>
          <h1 className={a.titel}>Erzählen Sie uns, was Sie vorhaben.</h1>
          <p className={a.satz}>
            Ein paar Zeilen genügen. Wir lesen jede Anfrage selbst und melden uns persönlich, ohne Verkaufsgespräch.
          </p>
          <p className={a.versprechen}>
            <span aria-hidden="true" className={a.punkt} />
            Antwort meist am selben Werktag
          </p>
        </section>

        <section aria-label="Anfrageformular" className={`inhalt ${a.bereich}`}>
          <div className={a.raster}>
            <div className="min-w-0">
              <InquiryForm
                initialPackage={initialPackage}
                initialIndustry={initialIndustry}
                initialMessage={initialMessage}
              />
            </div>

            <aside className={a.seite} aria-label="Andere Wege und Ablauf">
              <div className={a.telefon}>
                <p className="kennzeile-mono">Lieber sprechen</p>
                <a href="tel:+491607621876" className={a.nummer}>
                  0160&nbsp;7621876
                </a>
                <p className={a.klein}>
                  <a href="/sitalo-kontakt.vcf" download="Sitalo-Webdesign.vcf">
                    Im Adressbuch speichern
                  </a>
                </p>
              </div>

              <div className={a.notiz}>
                <h2 className="notiz-mono uppercase tracking-[0.12em]">Was danach passiert</h2>
                <ol className={`notiz-mono ${a.schritte}`}>
                  {DANACH.map((s) => (
                    <li key={s.title}>
                      <span>
                        <strong>{s.title}</strong>, {s.body}
                      </span>
                    </li>
                  ))}
                </ol>
                <p className={`notiz-mono ${a.datenschutz}`}>
                  Datenschutz: Ihre Angaben nutzen wir nur, um Ihre Anfrage zu beantworten. Mehr in der{" "}
                  <Link href="/datenschutz">Datenschutzerklärung</Link>.
                </p>
              </div>

              <figure className={a.foto}>
                <div className={a.fotoRahmen}>
                  <Image
                    src="/images/cafe-eimsbuettel.webp"
                    alt="Café-Tisch mit zwei Stühlen an einer Kopfsteinpflasterstraße in Eimsbüttel"
                    fill
                    loading="lazy"
                    sizes="(min-width: 1068px) 340px, 30vw"
                    className="object-cover"
                    style={{ objectPosition: "45% 50%" }}
                  />
                </div>
                <figcaption className={`notiz-mono ${a.fotoNotiz}`}>Eimsbüttel, Hamburg</figcaption>
              </figure>

              <p className={a.hinweis}>{PREIS_HINWEIS}</p>
            </aside>
          </div>
        </section>
      </UnterseiteMain>

      <MarketingFooter crumb="Anfrage" />
    </div>
  );
}
