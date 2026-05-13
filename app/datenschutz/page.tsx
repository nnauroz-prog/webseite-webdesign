import type { Metadata } from "next";
import Link from "next/link";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export const metadata: Metadata = {
  title: "Datenschutz — Sitalo Webdesign",
  description: "Datenschutzerklärung von Sitalo Webdesign.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/datenschutz" },
};

/**
 * PLATZHALTER-DATENSCHUTZERKLÄRUNG.
 *
 * Diese Seite muss vor dem produktiven Betrieb durch eine
 * rechtssichere Datenschutzerklärung ersetzt werden — entweder
 * selbst formuliert oder über einen Anbieter wie e-recht24.de,
 * activeMind, Datenschutzgenerator etc.
 *
 * Die Werte in eckigen Klammern [...] müssen mit den echten
 * Unternehmensdaten ausgetauscht werden, bevor die Seite live
 * geht.
 */
export default function DatenschutzPage() {
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
              Datenschutzerklärung
            </h1>

            <div className="border-warning/60 bg-warning/10 text-warning-foreground mt-8 rounded-xl border p-4 text-sm">
              <strong>Hinweis für den Betreiber:</strong> Diese Seite enthält
              Platzhalter. Bitte vor dem Livegang durch eine rechtssichere
              Fassung ersetzen — z. B. über e-recht24.de oder einen
              Datenschutzbeauftragten.
            </div>

            <div className="prose prose-sm sm:prose-base mt-10 max-w-none space-y-6 text-[15px] leading-relaxed">
              <h2 className="text-lg font-semibold tracking-tight">
                1. Verantwortliche Stelle
              </h2>
              <p>
                Verantwortlich für die Datenverarbeitung auf dieser Website
                ist:
              </p>
              <p className="text-muted-foreground">
                Sitalo
                <br />
                Inhaber: Nadim Nauroz
                <br />
                [BITTE ERGÄNZEN: Straße und Hausnummer]
                <br />
                [BITTE ERGÄNZEN: PLZ Ort]
                <br />
                E-Mail:{" "}
                <a
                  href="mailto:info@sitalo.de"
                  className="hover:text-foreground underline"
                >
                  info@sitalo.de
                </a>
              </p>

              <h2 className="text-lg font-semibold tracking-tight">
                2. Erhebung und Verarbeitung von Daten
              </h2>
              <p>
                Wenn Sie unser Anfrageformular ausfüllen, übermitteln Sie uns
                personenbezogene Daten (Name, E-Mail-Adresse, optional Firma,
                Branche, Telefon, Angaben zu Ihrem Projekt). Diese Daten
                verarbeiten wir ausschließlich zur Bearbeitung Ihrer Anfrage
                und für die anschließende Kommunikation mit Ihnen.
              </p>
              <p>
                Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Anbahnung
                eines Vertragsverhältnisses) sowie Art. 6 Abs. 1 lit. f DSGVO
                (berechtigtes Interesse an effizienter Anfragebearbeitung).
              </p>

              <h2 className="text-lg font-semibold tracking-tight">
                3. Verarbeitung durch Dienstleister
              </h2>
              <p>
                Das Anfrageformular wird technisch über Formspree
                (Formspree, Inc., USA) bereitgestellt. Formspree empfängt die
                Formulareingaben in unserem Auftrag und leitet sie per
                E-Mail an uns weiter. Beim Aufruf des Formulars werden
                technische Daten (IP-Adresse, Zeitstempel) an Formspree
                übertragen. Weitere Informationen unter{" "}
                <a
                  href="https://formspree.io/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  formspree.io/legal/privacy-policy
                </a>
                .
              </p>
              <p>
                Die Website wird auf Servern von Vercel Inc. (USA) gehostet.
                Beim Aufruf der Seite werden Verbindungsdaten (IP-Adresse,
                Datum, Uhrzeit, User-Agent) verarbeitet. Weitere
                Informationen unter{" "}
                <a
                  href="https://vercel.com/legal/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  vercel.com/legal/privacy-policy
                </a>
                .
              </p>

              <h2 className="text-lg font-semibold tracking-tight">
                4. Speicherdauer
              </h2>
              <p>
                Anfragedaten speichern wir, bis der Zweck der Verarbeitung
                entfällt — typischerweise bis zum Abschluss der
                Geschäftsanbahnung oder Ablauf gesetzlicher
                Aufbewahrungsfristen.
              </p>

              <h2 className="text-lg font-semibold tracking-tight">
                5. Ihre Rechte
              </h2>
              <p>
                Sie haben jederzeit das Recht auf Auskunft, Berichtigung,
                Löschung, Einschränkung der Verarbeitung,
                Datenübertragbarkeit und Widerspruch gegen die Verarbeitung
                Ihrer personenbezogenen Daten. Anfragen richten Sie bitte an
                die unter Punkt 1 genannte verantwortliche Stelle. Es besteht
                außerdem das Recht zur Beschwerde bei einer
                Datenschutzaufsichtsbehörde.
              </p>

              <h2 className="text-lg font-semibold tracking-tight">
                6. SSL-Verschlüsselung
              </h2>
              <p>
                Diese Website nutzt SSL-Verschlüsselung zum Schutz der
                Datenübertragung.
              </p>
            </div>

            <p className="text-muted-foreground mt-12 text-sm">
              Stand: November 2026. ·{" "}
              <Link href="/impressum" className="hover:text-foreground underline">
                Impressum
              </Link>
            </p>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
