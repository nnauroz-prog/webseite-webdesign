import type { Metadata } from "next";
import Link from "next/link";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Anbieterkennzeichnung gemäß § 5 TMG.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/impressum" },
};

/**
 * Impressum nach § 5 TMG / § 18 MStV. Anschrift und Steuer-Angaben
 * sind aktuell mit „folgt in Kürze" markiert und werden vor dem
 * offiziellen Launch durch die echten Daten ersetzt.
 *
 * Gesetzt wie ein Datenblatt: links Titel und Verweis auf den
 * Datenschutz, rechts die Angaben als Tabelle mit Mono-Beschriftung.
 */
export default function ImpressumPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Impressum" />

      <main id="main" tabIndex={-1} className="flex-1">
        <section>
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:px-6 sm:py-20 lg:grid-cols-12 lg:gap-8">
            <div className="lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
              <p className="label-mono text-muted-foreground">Rechtliches</p>
              <h1 className="mt-4 text-[2.6rem] leading-[0.98] tracking-[-0.04em] sm:text-[3.6rem]">Impressum</h1>
              <Link
                href="/datenschutz"
                className="text-muted-foreground hover:text-foreground mt-6 inline-block font-mono text-[12.5px] underline underline-offset-4"
              >
                Zur Datenschutzerklärung
              </Link>
            </div>

            <div className="min-w-0 lg:col-span-8">
              <dl className="border-foreground border-t-2">
                <Row label="Angaben gemäß § 5 TMG">
                  Sitalo
                  <br />
                  Inhaber: Nadim Nauroz
                  <br />
                  Anschrift: folgt in Kürze
                  <br />
                  Deutschland
                </Row>
                <Row label="Kontakt">
                  Telefon:{" "}
                  <a href="tel:+491607621876" className="underline underline-offset-4">
                    0160 7621876
                  </a>
                  <br />
                  E-Mail:{" "}
                  <a href="mailto:info@sitalo.de" className="underline underline-offset-4">
                    info@sitalo.de
                  </a>
                </Row>
                <Row label="Umsatzsteuer-ID">folgt in Kürze</Row>
                <Row label="Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV">
                  Nadim Nauroz
                  <br />
                  Anschrift: folgt in Kürze
                </Row>
              </dl>

              <div className="text-foreground/85 mt-14 max-w-2xl space-y-10 text-[16px] leading-relaxed">
                <div>
                  <h2 className="text-foreground text-[1.35rem] leading-tight tracking-[-0.02em]">Haftung für Inhalte</h2>
                  <p className="mt-3">
                    Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den
                    allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
                    verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen
                    zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
                  </p>
                </div>
                <div>
                  <h2 className="text-foreground text-[1.35rem] leading-tight tracking-[-0.02em]">EU-Streitschlichtung</h2>
                  <p className="mt-3">
                    Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{" "}
                    <a
                      href="https://ec.europa.eu/consumers/odr/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4"
                    >
                      ec.europa.eu/consumers/odr
                    </a>
                    .
                  </p>
                  <p className="mt-3">
                    Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
                    Verbraucherschlichtungsstelle teilzunehmen.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-border grid gap-x-8 gap-y-2 border-b py-5 sm:grid-cols-[14rem_minmax(0,1fr)]">
      <dt className="label-mono text-muted-foreground pt-0.5 leading-relaxed">{label}</dt>
      <dd className="text-[16px] leading-relaxed">{children}</dd>
    </div>
  );
}
