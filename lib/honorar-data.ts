/**
 * Datenmodell für /honorar — Open-Book-Honorar-Modell.
 *
 * Wir legen offen, wie unsere Pakete-Preise zustande kommen:
 * Stundensatz, Aufwand pro Paket, was im Stundensatz enthalten
 * ist, was nicht abgerechnet wird, was zusätzlich kostet.
 *
 * Bewusst keine Aufschläge oder Versteck-Marge. Wenn man weiß,
 * dass wir ungefähr 99 € pro Stunde nehmen, und Business etwa
 * neun Stunden Aufbau braucht, ergibt sich die 899-€-Zahl
 * öffentlich nachvollziehbar.
 */

import { getPaketBySlug, type Paket } from "@/lib/pakete-data";

export const STUNDENSATZ_EUR = 99;

export type HonorarPaket = {
  slug: Paket["slug"];
  name: string;
  setup: string;
  /** Geschätzter netto-Aufwand in Stunden bis Live-Schaltung. */
  stundenSetup: number;
  /** Was in diesen Stunden steckt — als Posten-Liste, jede Zeile
   *  eine konkrete Tätigkeit. */
  setupPosten: { label: string; stunden: number }[];
  monthly: string;
  /** Was im monatlichen Betrag wirklich drinsteckt. */
  monatlichPosten: string[];
};

export function honorarPaket(slug: Paket["slug"]): HonorarPaket | null {
  const p = getPaketBySlug(slug);
  if (!p) return null;

  // Stunden-Schätzungen sind unsere durchschnittlichen Werte
  // aus laufender Arbeit, gerundet auf halbe Stunden. Sie ergeben
  // multipliziert mit STUNDENSATZ_EUR ungefähr die offiziellen
  // Setup-Preise — ohne exakt aufzugehen, weil wir bei jedem
  // Projekt anders investieren.
  const profiles: Record<
    Paket["slug"],
    { stundenSetup: number; setupPosten: HonorarPaket["setupPosten"]; monatlichPosten: string[] }
  > = {
    starter: {
      stundenSetup: 5,
      setupPosten: [
        { label: "Strukturplan und Inhalts-Sichtung", stunden: 1 },
        { label: "Bau der Onepage-Sektionen", stunden: 2 },
        { label: "Bildoptimierung und Mobile-Tests", stunden: 1 },
        { label: "Hosting-Setup, Domain, SSL", stunden: 1 },
      ],
      monatlichPosten: [
        "Hosting in der EU, SSL, Backups, Monitoring",
        "Sicherheits- und Plattform-Updates",
        "Eine kleine Änderung pro Monat",
        "Antwort auf Mails meist am selben Tag",
      ],
    },
    business: {
      stundenSetup: 9,
      setupPosten: [
        { label: "Strukturplan, Inhalts-Architektur, Stadtteil-SEO", stunden: 1.5 },
        { label: "Bau mehrseitiger Struktur (Leistungen, Team, Kontakt)", stunden: 4 },
        { label: "Bildoptimierung, Galerie, Mobile-Tests", stunden: 1.5 },
        { label: "Google-Business-Profil, lokale SEO-Basis", stunden: 1 },
        { label: "Hosting-Setup, Domain, SSL, Übergabe", stunden: 1 },
      ],
      monatlichPosten: [
        "Hosting in der EU, SSL, Backups, Monitoring",
        "Sicherheits- und Plattform-Updates",
        "Drei kleine Änderungen pro Monat",
        "Monatlicher Performance-Check",
        "Antwort auf Mails meist am selben Tag",
      ],
    },
    premium: {
      stundenSetup: 15,
      setupPosten: [
        { label: "Strukturplan, Inhalts-Architektur, lokale SEO", stunden: 2 },
        { label: "Bau mehrseitiger Struktur mit eigener Note", stunden: 6 },
        { label: "Verwaltbare Inhalte (Speisekarte, Termine, Aktuelles)", stunden: 3 },
        { label: "Bildbearbeitung, Galerie, Mobile-Tests, Tonalität", stunden: 2 },
        { label: "Google-Business-Profil, lokale SEO-Basis", stunden: 1 },
        { label: "Hosting-Setup, Domain, SSL, persönliche Übergabe", stunden: 1 },
      ],
      monatlichPosten: [
        "Hosting in der EU, SSL, Backups, Monitoring",
        "Sicherheits- und Plattform-Updates",
        "Sechs kleine Änderungen pro Monat",
        "Wöchentlicher Performance-Check",
        "Vorrangige Antwort, meist innerhalb von 4 Stunden",
        "Telefonischer Direktdraht bei Notfällen",
      ],
    },
  };

  const profile = profiles[p.slug];
  return {
    slug: p.slug,
    name: p.name,
    setup: p.setup,
    stundenSetup: profile.stundenSetup,
    setupPosten: profile.setupPosten,
    monthly: p.monthly,
    monatlichPosten: profile.monatlichPosten,
  };
}

export const NICHT_ABGERECHNET: string[] = [
  "Erstgespräch (30–60 Minuten), persönlich oder per Video",
  "Audit Ihrer aktuellen Seite, drei bis fünf konkrete Punkte per Mail",
  "Kurze Beratungs-Fragen per Mail oder Telefon, wenn Sie schon Kunde sind",
  "Empfehlung an einen anderen Anbieter, wenn wir glauben, jemand passt besser",
];

export const ZUSATZ_ABGERECHNET: { posten: string; preis: string }[] = [
  {
    posten: "Größere Erweiterungen (neuer Bereich, neue Funktion)",
    preis: "Stundensatz, vorab verbindlich beziffert",
  },
  {
    posten: "Saisonale Aktionen, Eventseiten, Sonderkampagnen",
    preis: "Projektbezogen, kein Aufschlag auf den monatlichen Beitrag",
  },
  {
    posten: "Texterstellung von Grund auf",
    preis: "Wir empfehlen eine Hamburger Lektorin und vermitteln",
  },
  {
    posten: "Foto-Shooting",
    preis: "Wir empfehlen einen Hamburger Fotografen und vermitteln",
  },
  {
    posten: "Logo-Entwicklung",
    preis: "Wir empfehlen eine Designerin aus unserem Netzwerk",
  },
];
