import type { Metadata } from "next";
import Link from "next/link";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export const metadata: Metadata = {
  title: "Impressum — Sitalo Webdesign",
  description: "Anbieterkennzeichnung gemäß § 5 TMG.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/impressum" },
};

/**
 * PLATZHALTER-IMPRESSUM.
 *
 * Die Werte in eckigen Klammern müssen mit den echten
 * Unternehmensdaten ersetzt werden, bevor die Seite live geht.
 * Pflichtangaben nach § 5 TMG bzw. § 18 MStV. Bei Unsicherheit
 * Impressums-Generator (e-recht24.de) oder Anwalt nutzen.
 */
export default function ImpressumPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />

      <main className="flex-1">
        <section className="border-border/40 border-b py-16 sm:py-24">
          <div className="mx-auto w-full max-w-3xl px-6">
            <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.22em]">
              Rechtliches
            </p>
            <h1 className="mt-4 text-balance text-3xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-4xl">
              Impressum
            </h1>

            <div className="border-warning/60 bg-warning/10 text-warning-foreground mt-8 rounded-xl border p-4 text-sm">
              <strong>Hinweis für den Betreiber:</strong> Bitte alle Platzhalter
              [...] mit echten Daten ersetzen, bevor die Seite live geht. Sonst
              bestehen Abmahnrisiken.
            </div>

            <div className="prose prose-sm sm:prose-base mt-10 max-w-none space-y-6 text-[15px] leading-relaxed">
              <h2 className="text-lg font-semibold tracking-tight">
                Angaben gemäß § 5 TMG
              </h2>
              <p className="text-muted-foreground">
                [Firmenname / Inhaber]
                <br />
                [Straße und Hausnummer]
                <br />
                [PLZ Ort]
                <br />
                Deutschland
              </p>

              <h2 className="text-lg font-semibold tracking-tight">Kontakt</h2>
              <p className="text-muted-foreground">
                Telefon: [Telefonnummer]
                <br />
                E-Mail: [Kontakt-E-Mail]
              </p>

              <h2 className="text-lg font-semibold tracking-tight">
                Umsatzsteuer-ID
              </h2>
              <p className="text-muted-foreground">
                Umsatzsteuer-Identifikationsnummer nach § 27 a
                Umsatzsteuergesetz: [USt-IdNr.] — falls nicht vorhanden,
                Hinweis auf Kleinunternehmerregelung gemäß § 19 UStG.
              </p>

              <h2 className="text-lg font-semibold tracking-tight">
                Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV
              </h2>
              <p className="text-muted-foreground">
                [Name]
                <br />
                [Anschrift wie oben]
              </p>

              <h2 className="text-lg font-semibold tracking-tight">
                Haftung für Inhalte
              </h2>
              <p>
                Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene
                Inhalte auf diesen Seiten nach den allgemeinen Gesetzen
                verantwortlich. Nach §§ 8 bis 10 TMG sind wir als
                Diensteanbieter jedoch nicht verpflichtet, übermittelte oder
                gespeicherte fremde Informationen zu überwachen oder nach
                Umständen zu forschen, die auf eine rechtswidrige Tätigkeit
                hinweisen.
              </p>

              <h2 className="text-lg font-semibold tracking-tight">
                EU-Streitschlichtung
              </h2>
              <p>
                Die Europäische Kommission stellt eine Plattform zur
                Online-Streitbeilegung (OS) bereit:{" "}
                <a
                  href="https://ec.europa.eu/consumers/odr/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  ec.europa.eu/consumers/odr
                </a>
                .
              </p>
              <p>
                Wir sind nicht bereit oder verpflichtet, an
                Streitbeilegungsverfahren vor einer
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </div>

            <p className="text-muted-foreground mt-12 text-sm">
              <Link
                href="/datenschutz"
                className="hover:text-foreground underline"
              >
                Datenschutzerklärung
              </Link>
            </p>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
