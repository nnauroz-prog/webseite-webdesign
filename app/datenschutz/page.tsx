import type { Metadata } from "next";
import Link from "next/link";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Datenschutzerklärung von Sitalo Webdesign.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/datenschutz" },
};

/**
 * Datenschutzerklärung nach DSGVO. Die Anschrift wird vor dem
 * offiziellen Launch durch die echten Daten ersetzt — bis dahin
 * „folgt in Kürze". Bei Unsicherheit zur Vollständigkeit: Generator
 * (e-recht24.de) oder Datenschutzbeauftragten konsultieren.
 *
 * Links Titel und Inhaltsverzeichnis (auf breiten Schirmen
 * mitlaufend), rechts die nummerierten Abschnitte. Die Nummern
 * bleiben, weil Abschnitt 6 auf Punkt 1 verweist.
 */
const ABSCHNITTE = [
  { id: "verantwortlich", titel: "Verantwortliche Stelle" },
  { id: "erhebung", titel: "Erhebung und Verarbeitung von Daten" },
  { id: "dienstleister", titel: "Verarbeitung durch Dienstleister" },
  { id: "cookies", titel: "Cookies & Tracking" },
  { id: "speicherdauer", titel: "Speicherdauer" },
  { id: "rechte", titel: "Ihre Rechte" },
  { id: "ssl", titel: "SSL-Verschlüsselung" },
] as const;

type AbschnittId = (typeof ABSCHNITTE)[number]["id"];

export default function DatenschutzPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Datenschutz" />

      <main id="main" tabIndex={-1} className="flex-1">
        <section>
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:px-6 sm:py-20 lg:grid-cols-12 lg:gap-8">
            <div className="lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
              <p className="label-mono text-muted-foreground">Rechtliches</p>
              <h1 className="mt-4 text-balance text-[2.3rem] leading-[1.0] tracking-[-0.04em] sm:text-[3rem]">
                Datenschutz&shy;erklärung
              </h1>
              <p className="text-muted-foreground mt-5 max-w-sm text-pretty text-[15.5px] leading-relaxed">
                Welche Daten beim Besuch dieser Website und bei einer Anfrage anfallen, wer sie verarbeitet und welche
                Rechte Sie haben.
              </p>
              <nav aria-label="Inhalt" className="mt-8 hidden lg:block">
                <ol className="border-border border-t">
                  {ABSCHNITTE.map((a, i) => (
                    <li key={a.id} className="border-border border-b">
                      <a
                        href={`#${a.id}`}
                        className="text-muted-foreground hover:text-foreground flex gap-3 py-2 text-[14px] transition-colors"
                      >
                        <span className="font-mono text-[12px] tabular-nums leading-[1.6]">{i + 1}.</span>
                        {a.titel}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>

            <div className="text-foreground/85 min-w-0 max-w-2xl text-[16px] leading-relaxed lg:col-span-8">
              <div className="border-foreground border-t-2" />

              <Abschnitt id="verantwortlich">
                <p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p>
                <p className="border-border text-foreground border-l-2 pl-4">
                  Sitalo
                  <br />
                  Inhaber: Nadim Nauroz
                  <br />
                  Anschrift: folgt in Kürze
                  <br />
                  E-Mail:{" "}
                  <a href="mailto:info@sitalo.de" className="underline underline-offset-4">
                    info@sitalo.de
                  </a>
                </p>
              </Abschnitt>

              <Abschnitt id="erhebung">
                <p>
                  Wenn Sie unser Anfrageformular ausfüllen, übermitteln Sie uns personenbezogene Daten (Name,
                  E-Mail-Adresse, optional Firma, Branche, Telefon, Angaben zu Ihrem Projekt). Diese Daten verarbeiten
                  wir ausschließlich zur Bearbeitung Ihrer Anfrage und für die anschließende Kommunikation mit Ihnen.
                </p>
                <p>
                  Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Anbahnung eines Vertragsverhältnisses) sowie Art. 6
                  Abs. 1 lit. f DSGVO (berechtigtes Interesse an effizienter Anfragebearbeitung).
                </p>
              </Abschnitt>

              <Abschnitt id="dienstleister">
                <p>
                  Das Anfrageformular wird technisch über Formspree (Formspree, Inc., USA) bereitgestellt. Formspree
                  empfängt die Formulareingaben in unserem Auftrag und leitet sie per E-Mail an uns weiter. Beim Aufruf
                  des Formulars werden technische Daten (IP-Adresse, Zeitstempel) an Formspree übertragen. Weitere
                  Informationen unter{" "}
                  <a
                    href="https://formspree.io/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-words underline underline-offset-4"
                  >
                    formspree.io/legal/privacy-policy
                  </a>
                  .
                </p>
                <p>
                  Die Website wird auf Servern von Vercel Inc. (USA) gehostet. Beim Aufruf der Seite werden
                  Verbindungsdaten (IP-Adresse, Datum, Uhrzeit, User-Agent) verarbeitet. Weitere Informationen unter{" "}
                  <a
                    href="https://vercel.com/legal/privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-words underline underline-offset-4"
                  >
                    vercel.com/legal/privacy-policy
                  </a>
                  .
                </p>
              </Abschnitt>

              <Abschnitt id="cookies">
                <p>
                  Diese Website setzt <strong className="text-foreground font-semibold">keine Tracking-Cookies</strong>,
                  kein Google Analytics, kein Facebook Pixel und keine vergleichbaren Drittanbieter-Tracker. Es werden
                  ausschließlich technisch notwendige Cookies verwendet (etwa für die Sprach- oder Theme-Einstellungen),
                  die keiner Einwilligung bedürfen.
                </p>
              </Abschnitt>

              <Abschnitt id="speicherdauer">
                <p>
                  Anfragedaten speichern wir, bis der Zweck der Verarbeitung entfällt — typischerweise bis zum
                  Abschluss der Geschäftsanbahnung oder Ablauf gesetzlicher Aufbewahrungsfristen.
                </p>
              </Abschnitt>

              <Abschnitt id="rechte">
                <p>
                  Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung,
                  Datenübertragbarkeit und Widerspruch gegen die Verarbeitung Ihrer personenbezogenen Daten. Anfragen
                  richten Sie bitte an die unter Punkt 1 genannte verantwortliche Stelle. Es besteht außerdem das Recht
                  zur Beschwerde bei einer Datenschutzaufsichtsbehörde.
                </p>
              </Abschnitt>

              <Abschnitt id="ssl">
                <p>Diese Website nutzt durchgehend SSL/TLS-Verschlüsselung zum Schutz der Datenübertragung.</p>
              </Abschnitt>

              <p className="text-muted-foreground pt-6 font-mono text-[12.5px]">
                Stand: aktuell ·{" "}
                <Link href="/impressum" className="hover:text-foreground underline underline-offset-4">
                  Impressum
                </Link>
              </p>
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}

function Abschnitt({ id, children }: { id: AbschnittId; children: React.ReactNode }) {
  const index = ABSCHNITTE.findIndex((a) => a.id === id);
  const titel = ABSCHNITTE[index].titel;
  return (
    <section id={id} aria-labelledby={`${id}-titel`} className="border-border scroll-mt-24 border-b py-8 sm:py-10">
      <h2 id={`${id}-titel`} className="text-foreground flex items-baseline gap-4 text-[1.3rem] leading-tight tracking-[-0.02em] sm:text-[1.5rem]">
        <span className="text-muted-foreground font-mono text-[13px] font-medium tabular-nums">{index + 1}.</span>
        {titel}
      </h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}
