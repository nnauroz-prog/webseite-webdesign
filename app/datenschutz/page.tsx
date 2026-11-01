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
 * Datenschutzerklärung nach DSGVO. Beschrieben sind nur Dienste, die
 * der Code wirklich einsetzt: Vercel (Hosting), Supabase (Speicherung
 * der Anfragen, lib/leads-store.ts), Resend (Benachrichtigungs-Mail,
 * lib/lead-mail.ts), Google PageSpeed Insights (Speed-Check,
 * app/api/speed-check), Plausible (components/marketing/plausible-script.tsx).
 * Schriften kommen über next/font von der eigenen Domain. Kommt ein
 * Dienst dazu oder fällt einer weg, hier anpassen und STAND erneuern.
 * Die Anschrift trägt der Inhaber vor dem Launch ein.
 *
 * Links Titel, Stand und Inhaltsverzeichnis (auf breiten Schirmen
 * mitlaufend), rechts die nummerierten Abschnitte. Die Nummern
 * bleiben, weil Abschnitte aufeinander verweisen.
 */
const STAND = { iso: "2026-11-01", text: "1. November 2026" };

const ABSCHNITTE = [
  { id: "verantwortlich", titel: "Verantwortliche Stelle" },
  { id: "hosting", titel: "Besuch der Website und Hosting" },
  { id: "anfragen", titel: "Anfragen, Durchsicht und Termine" },
  { id: "ladezeit-test", titel: "Ladezeit-Test" },
  { id: "statistik", titel: "Besucherstatistik" },
  { id: "schriften", titel: "Schriften" },
  { id: "cookies", titel: "Cookies und lokaler Speicher" },
  { id: "usa", titel: "Übermittlung in die USA" },
  { id: "speicherdauer", titel: "Speicherdauer" },
  { id: "rechte", titel: "Ihre Rechte" },
  { id: "verschluesselung", titel: "Verschlüsselung" },
] as const;

type AbschnittId = (typeof ABSCHNITTE)[number]["id"];

const nr = (id: AbschnittId) => ABSCHNITTE.findIndex((a) => a.id === id) + 1;

const LINK = "underline underline-offset-4 hover:text-foreground";

export default function DatenschutzPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Datenschutz" />

      <main id="main" tabIndex={-1} className="flex-1">
        <section>
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:px-6 sm:py-20 lg:grid-cols-12 lg:gap-8">
            {/* Mitlaufend nur, wenn die Spalte samt Inhaltsverzeichnis in die Fensterhöhe passt. */}
            <div className="lg:top-24 lg:col-span-4 lg:self-start lg:[@media(min-height:860px)]:sticky">
              <p className="label-mono text-muted-foreground">Rechtliches</p>
              <h1 className="mt-4 text-balance text-[2.3rem] leading-[1.0] tracking-[-0.04em] sm:text-[3rem]">
                Datenschutz&shy;erklärung
              </h1>
              <p className="text-foreground mt-5 font-mono text-[13px]">
                Stand: <time dateTime={STAND.iso}>{STAND.text}</time>
              </p>
              <p className="text-muted-foreground mt-4 max-w-sm text-pretty text-[15.5px] leading-relaxed">
                Welche Daten beim Besuch dieser Website, bei einer Anfrage und beim Ladezeit-Test anfallen, wer sie
                verarbeitet und welche Rechte Sie haben.
              </p>
              <nav aria-label="Inhalt" className="mt-8">
                <ol className="border-border border-t">
                  {ABSCHNITTE.map((a, i) => (
                    <li key={a.id} className="border-border border-b">
                      <a
                        href={`#${a.id}`}
                        className="text-muted-foreground hover:text-foreground flex gap-3 py-2 text-[14px] transition-colors"
                      >
                        <span className="w-5 shrink-0 font-mono text-[12px] tabular-nums leading-[1.6]">{i + 1}.</span>
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
                  <a href="mailto:info@sitalo.de" className={LINK}>
                    info@sitalo.de
                  </a>
                </p>
                <p>
                  Weitere Angaben finden Sie im{" "}
                  <Link href="/impressum" className={LINK}>
                    Impressum
                  </Link>
                  .
                </p>
              </Abschnitt>

              <Abschnitt id="hosting">
                <p>
                  Die Website wird von Vercel gehostet und von Servern in der EU ausgeliefert. Bei jedem Aufruf
                  verarbeitet Vercel die Verbindungsdaten, die dafür technisch nötig sind: IP-Adresse, Datum und
                  Uhrzeit, aufgerufene Adresse, die zuvor besuchte Seite (Referrer) sowie Browser und Betriebssystem.
                  Diese Protokolle dienen der Auslieferung, der Fehlersuche und der Abwehr von Angriffen.
                </p>
                <p>
                  Zum Schutz vor Missbrauch zählen wir außerdem, wie oft eine IP-Adresse innerhalb einer Stunde die
                  Formulare oder den Ladezeit-Test nutzt. Dieser Zähler liegt nur im Arbeitsspeicher des Servers und wird
                  nicht dauerhaft gespeichert.
                </p>
                <Dienst
                  name="Vercel"
                  anbieter="Vercel Inc., USA"
                  zeilen={[
                    ["Zweck", "Hosting und Auslieferung der Website, Sicherheit"],
                    [
                      "Rechtsgrundlage",
                      "Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse ist eine sichere und stabile Website.",
                    ],
                    ["Drittland", <UsaVerweis key="usa" />],
                  ]}
                  hinweise="https://vercel.com/legal/privacy-policy"
                />
              </Abschnitt>

              <Abschnitt id="anfragen">
                <p>
                  Wenn Sie das Anfrageformular, das Formular für die kostenlose Durchsicht oder die Terminbuchung nutzen, verarbeiten wir Ihre
                  Angaben (Name, E-Mail, optional Telefon, Firma, Branche, Paket- und Zeitwunsch, Website-Adresse,
                  Nachricht, gewählter Termin), um Ihre Anfrage zu beantworten oder den Termin zu bestätigen.
                  Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO. Das gilt genauso, wenn Sie uns eine E-Mail schreiben
                  oder anrufen.
                </p>
                <p>
                  Dafür setzen wir zwei Dienste ein. Supabase speichert jede Anfrage in einer Datenbank, damit sie nicht
                  verloren geht, auch wenn eine Mail einmal nicht ankommt. Resend schickt uns eine Benachrichtigungs-Mail
                  mit Ihren Angaben. Zugriff auf die gespeicherten Anfragen haben nur wir, nach Anmeldung mit Passwort.
                </p>
                <Dienst
                  name="Supabase"
                  anbieter="Supabase Inc., USA"
                  zeilen={[
                    ["Zweck", "Speicherung von Anfragen, Durchsicht-Anfragen und Terminwünschen"],
                    ["Rechtsgrundlage", "Art. 6 Abs. 1 lit. b DSGVO"],
                    ["Drittland", <UsaVerweis key="usa" />],
                  ]}
                  hinweise="https://supabase.com/privacy"
                />
                <Dienst
                  name="Resend"
                  anbieter="Resend Inc., USA"
                  zeilen={[
                    ["Zweck", "Versand der Benachrichtigungs-Mail zu Ihrer Anfrage an unser Postfach"],
                    ["Rechtsgrundlage", "Art. 6 Abs. 1 lit. b DSGVO"],
                    ["Drittland", <UsaVerweis key="usa" />],
                  ]}
                  hinweise="https://resend.com/legal/privacy-policy"
                />
              </Abschnitt>

              <Abschnitt id="ladezeit-test">
                <p>
                  Mit dem{" "}
                  <Link href="/check" className={LINK}>
                    Ladezeit-Test
                  </Link>{" "}
                  können Sie die Ladezeit einer Website messen. Die eingegebene Adresse senden wir von unserem Server an
                  die PageSpeed-Insights-Schnittstelle von Google. Google ruft die Seite auf und liefert die Messwerte
                  zurück. Ihre IP-Adresse erfährt Google dabei nicht, denn die Anfrage stellt unser Server.
                </p>
                <p>
                  Ist Google gerade ausgelastet, ruft unser Server die Seite selbst einmal auf und misst die Grundwerte.
                  Adresse und Ergebnis legen wir nicht ab.
                </p>
                <Dienst
                  name="Google PageSpeed Insights"
                  anbieter="Google LLC, USA"
                  zeilen={[
                    ["Zweck", "Messung der von Ihnen eingegebenen Website"],
                    ["Daten", "die eingegebene Website-Adresse"],
                    ["Rechtsgrundlage", "Art. 6 Abs. 1 lit. b DSGVO, weil Sie die Messung selbst anfordern"],
                    ["Drittland", <UsaVerweis key="usa" />],
                  ]}
                  hinweise="https://policies.google.com/privacy"
                />
              </Abschnitt>

              <Abschnitt id="statistik">
                <p>
                  Um zu sehen, welche Seiten gelesen werden, nutzen wir Plausible Analytics. Ihr Browser lädt dazu ein
                  kleines Script von Plausible. Plausible setzt keine Cookies und speichert keine personenbezogenen
                  Daten.
                </p>
                <p>
                  Erfasst werden die aufgerufene Seite, die Herkunftsseite, Land, Gerätetyp, Browser und
                  Betriebssystem, Klicks auf Links zu anderen Websites und, dass ein Formular abgeschickt wurde. Bei
                  Anfragen kommen Branche, Paket- und Zeitwunsch hinzu, nie Name, E-Mail-Adresse oder Nachricht.
                </p>
                <p>
                  Um Besuche zu zählen, bildet Plausible aus IP-Adresse und Browserkennung einen nicht umkehrbaren
                  Prüfwert, der jeden Tag neu entsteht. Die IP-Adresse selbst wird nicht gespeichert, ein Rückschluss auf
                  Sie ist nicht möglich.
                </p>
                <Dienst
                  name="Plausible Analytics"
                  anbieter="Plausible Insights OÜ, Estland"
                  zeilen={[
                    ["Zweck", "cookielose Reichweitenmessung"],
                    [
                      "Rechtsgrundlage",
                      "Art. 6 Abs. 1 lit. f DSGVO. Unser berechtigtes Interesse ist, zu erkennen, welche Inhalte genutzt werden, und die Website danach zu verbessern.",
                    ],
                    ["Speicherort", "Server in der EU"],
                  ]}
                  hinweise="https://plausible.io/data-policy"
                />
              </Abschnitt>

              <Abschnitt id="schriften">
                <p>
                  Die Schriften dieser Website werden zusammen mit den Seiten von unserer eigenen Domain geladen. Beim
                  Besuch entsteht keine Verbindung zu Google Fonts oder einem anderen Schriftanbieter.
                </p>
              </Abschnitt>

              <Abschnitt id="cookies">
                <p>
                  Diese Website setzt für Besucher keine Cookies. Die Besucherstatistik mit Plausible arbeitet ohne
                  Cookies, deshalb gibt es auch keinen Cookie-Banner.
                </p>
                <p>
                  Die{" "}
                  <Link href="/empfehlung" className={LINK}>
                    Paket-Empfehlung
                  </Link>{" "}
                  merkt sich Ihre Antworten nur lokal in Ihrem Browser (localStorage), damit Sie später an derselben
                  Stelle weitermachen können. Die Antworten werden nicht an uns übertragen. Sie löschen sie mit „Neu
                  beginnen“ oder über die Einstellungen Ihres Browsers.
                </p>
                <p>
                  Nur unser eigener, passwortgeschützter Verwaltungsbereich verwendet ein Anmelde-Cookie. Besucher der
                  Website betrifft das nicht.
                </p>
              </Abschnitt>

              <Abschnitt id="usa">
                <p>
                  Vercel, Supabase, Resend und Google haben ihren Sitz in den USA. Bei der Nutzung dieser Dienste können
                  Daten in die USA übermittelt werden.
                </p>
                <p>
                  Die Übermittlung in die USA stützen wir auf das EU-US Data Privacy Framework, soweit der Anbieter
                  zertifiziert ist, und im Übrigen auf EU-Standardvertragsklauseln (Art. 46 Abs. 2 lit. c DSGVO).
                </p>
                <p>Plausible verarbeitet die Daten in der EU.</p>
              </Abschnitt>

              <Abschnitt id="speicherdauer">
                <p>
                  Anfragen und Termine speichern wir, solange wir sie zur Bearbeitung brauchen. Auf Wunsch löschen wir
                  sie sofort (Art. 17 DSGVO), eine Mail an{" "}
                  <a href="mailto:info@sitalo.de" className={LINK}>
                    info@sitalo.de
                  </a>{" "}
                  genügt. Gesetzliche Aufbewahrungsfristen bleiben unberührt, wenn daraus ein Auftrag wird.
                </p>
                <p>
                  Die Verbindungsdaten in den Server-Protokollen löscht Vercel nach kurzer Zeit automatisch. Plausible
                  hält nur zusammengefasste Zahlen ohne Bezug zu einzelnen Personen fest.
                </p>
              </Abschnitt>

              <Abschnitt id="rechte">
                <p>Sie haben jederzeit das Recht auf:</p>
                <ul className="border-border text-foreground border-t">
                  {[
                    ["Auskunft", "Art. 15 DSGVO"],
                    ["Berichtigung", "Art. 16 DSGVO"],
                    ["Löschung", "Art. 17 DSGVO"],
                    ["Einschränkung der Verarbeitung", "Art. 18 DSGVO"],
                    ["Datenübertragbarkeit", "Art. 20 DSGVO"],
                  ].map(([recht, artikel]) => (
                    <li
                      key={recht}
                      className="border-border flex flex-wrap items-baseline justify-between gap-x-4 border-b py-2.5"
                    >
                      <span>{recht}</span>
                      <span className="text-muted-foreground font-mono text-[12.5px]">{artikel}</span>
                    </li>
                  ))}
                </ul>
                <p>
                  Eine Mail an{" "}
                  <a href="mailto:info@sitalo.de" className={LINK}>
                    info@sitalo.de
                  </a>{" "}
                  genügt.
                </p>
                <h3 className="text-foreground pt-2 text-[1.05rem] leading-snug">Widerspruch</h3>
                <p>
                  Soweit wir Daten auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO verarbeiten (Hosting, Sicherheit,
                  Besucherstatistik), können Sie dieser Verarbeitung aus Gründen, die sich aus Ihrer besonderen
                  Situation ergeben, jederzeit widersprechen (Art. 21 DSGVO).
                </p>
                <h3 className="text-foreground pt-2 text-[1.05rem] leading-snug">Beschwerde</h3>
                <p>
                  Sie können sich außerdem bei einer Datenschutz-Aufsichtsbehörde beschweren, zum Beispiel bei der für
                  uns zuständigen Behörde: Der Hamburgische Beauftragte für Datenschutz und Informationsfreiheit (
                  <a href="https://datenschutz-hamburg.de" target="_blank" rel="noopener noreferrer" className={LINK}>
                    datenschutz-hamburg.de
                  </a>
                  ).
                </p>
                <p>Eine automatisierte Entscheidung im Einzelfall einschließlich Profiling findet nicht statt.</p>
              </Abschnitt>

              <Abschnitt id="verschluesselung">
                <p>
                  Alle Seiten und Formulare werden verschlüsselt per TLS übertragen. Sie erkennen das an „https://“ in
                  der Adresszeile Ihres Browsers.
                </p>
              </Abschnitt>

              <p className="text-muted-foreground pt-6 font-mono text-[12.5px]">
                <Link href="/impressum" className={LINK}>
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
      <h2
        id={`${id}-titel`}
        className="text-foreground flex items-baseline gap-4 text-[1.3rem] leading-tight tracking-[-0.02em] sm:text-[1.5rem]"
      >
        <span className="text-muted-foreground font-mono text-[13px] font-medium tabular-nums">{index + 1}.</span>
        {titel}
      </h2>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

/**
 * Steckbrief eines Dienstes: Name und Anbieter oben, darunter die
 * Angaben als Tabelle. Unter 640 px stehen Beschriftung und Wert
 * untereinander.
 */
function Dienst({
  name,
  anbieter,
  zeilen,
  hinweise,
}: {
  name: string;
  anbieter: string;
  zeilen: [string, React.ReactNode][];
  hinweise: string;
}) {
  const alle: [string, React.ReactNode][] = [
    ...zeilen,
    ["Datenschutz", <AnbieterLink key="link" href={hinweise} text={hinweise.replace(/^https:\/\/(www\.)?/, "")} />],
  ];
  return (
    <div className="border-border bg-card rounded-[3px] border">
      <div className="border-border flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b px-4 py-3 sm:px-5">
        <h3 className="text-foreground text-[1.05rem] leading-snug">{name}</h3>
        <p className="label-mono text-muted-foreground">{anbieter}</p>
      </div>
      <dl className="px-4 text-[15px] sm:px-5">
        {alle.map(([label, wert]) => (
          <div
            key={label}
            className="border-border grid gap-x-6 gap-y-0.5 border-b py-3 last:border-b-0 sm:grid-cols-[9.5rem_minmax(0,1fr)]"
          >
            <dt className="label-mono text-muted-foreground pt-[3px] leading-relaxed">{label}</dt>
            <dd className="text-foreground/85 min-w-0">{wert}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function AnbieterLink({ href, text }: { href: string; text: string }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={`break-words ${LINK}`}>
      {text}
    </a>
  );
}

function UsaVerweis() {
  return (
    <>
      Sitz in den USA, siehe{" "}
      <a href="#usa" className={LINK}>
        Abschnitt {nr("usa")}
      </a>
    </>
  );
}
