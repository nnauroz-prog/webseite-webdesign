/**
 * Datenmodell für /honorar, die offen vorgerechnete Kalkulation.
 *
 * Wir zeigen, wie die Paketpreise zustande kommen: Stundensatz,
 * Aufwand je Paket, was nicht abgerechnet wird, was zusätzlich kostet.
 * Wer weiß, dass wir 99 € pro Stunde nehmen und Business etwa neun
 * Stunden Aufbau braucht, kann die 899 € selbst nachrechnen.
 *
 * Monatliche Posten folgen lib/pakete-data.ts (Änderungen pro Monat,
 * Hosting in der EU, Antwortzeiten). Ändert sich dort etwas, hier
 * nachziehen.
 */

import { getPaketBySlug, type Paket } from "@/lib/pakete-data";

export const STUNDENSATZ_EUR = 99;

export type HonorarPaket = {
  slug: Paket["slug"];
  name: string;
  setup: string;
  /** Geschätzter netto-Aufwand in Stunden bis Live-Schaltung. */
  stundenSetup: number;
  /** Was in diesen Stunden steckt, jede Zeile eine konkrete Tätigkeit. */
  setupPosten: { label: string; stunden: number }[];
  monthly: string;
  /** Was im monatlichen Betrag wirklich drinsteckt. */
  monatlichPosten: string[];
};

export function honorarPaket(slug: Paket["slug"]): HonorarPaket | null {
  const p = getPaketBySlug(slug);
  if (!p) return null;

  // Stunden sind Richtwerte je Paket, gerundet auf halbe Stunden.
  // Mal STUNDENSATZ_EUR ergeben sie ungefähr die Paketpreise, ohne
  // exakt aufzugehen, weil jedes Projekt etwas anders verläuft.
  const profiles: Record<
    Paket["slug"],
    { stundenSetup: number; setupPosten: HonorarPaket["setupPosten"]; monatlichPosten: string[] }
  > = {
    starter: {
      stundenSetup: 5,
      setupPosten: [
        { label: "Seitenplan und Sichtung Ihrer Unterlagen", stunden: 1 },
        { label: "Bau der Seite mit allen Abschnitten", stunden: 2 },
        { label: "Bilder aufbereiten, Test auf echten Handys", stunden: 1 },
        { label: "Hosting einrichten, Domain, SSL", stunden: 1 },
      ],
      monatlichPosten: [
        "Hosting in der EU, SSL, automatische Backups, Überwachung",
        "Sicherheits- und Software-Updates",
        "Eine kleine Änderung pro Monat",
        "Antwort meist am selben Werktag",
      ],
    },
    business: {
      stundenSetup: 9,
      setupPosten: [
        { label: "Seitenplan, Gliederung, Suchbegriffe für Ihren Ort", stunden: 1.5 },
        { label: "Bau der Unterseiten (Leistungen, Team, Kontakt)", stunden: 4 },
        { label: "Bilder aufbereiten, Galerie, Test auf echten Handys", stunden: 1.5 },
        { label: "Google-Unternehmensprofil, Grundlagen für die lokale Suche", stunden: 1 },
        { label: "Hosting einrichten, Domain, SSL, Übergabe", stunden: 1 },
      ],
      monatlichPosten: [
        "Hosting in der EU, SSL, automatische Backups, Überwachung",
        "Sicherheits- und Software-Updates",
        "Drei kleine Änderungen pro Monat",
        "Ladezeit-Prüfung einmal im Monat",
        "Antwort meist am selben Werktag",
      ],
    },
    premium: {
      stundenSetup: 25,
      setupPosten: [
        { label: "Seitenplan, Gliederung, Suchbegriffe für Ihren Ort", stunden: 3 },
        { label: "Bau der Unterseiten, auf Ihren Bedarf angepasst", stunden: 10 },
        { label: "Bereiche zum Selbstpflegen (Speisekarte, Termine, Aktuelles)", stunden: 5 },
        { label: "Bilder bearbeiten, Galerie, Texte, Test auf echten Handys", stunden: 3 },
        { label: "Google-Unternehmensprofil, Grundlagen für die lokale Suche", stunden: 2 },
        { label: "Hosting, Domain, SSL, Übergabe mit Einweisung", stunden: 2 },
      ],
      monatlichPosten: [
        "Hosting in der EU, SSL, automatische Backups, Überwachung",
        "Sicherheits- und Software-Updates",
        "Sechs kleine Änderungen pro Monat",
        "Ladezeit-Prüfung jede Woche",
        "Vorrang bei Anfragen, Antwort meist am selben Werktag",
        "Bei einem Notfall erreichen Sie uns direkt am Telefon",
      ],
    },
    studio: {
      stundenSetup: 35,
      setupPosten: [
        { label: "Treffen vor Ort, Briefing, Gespräch über Ihre Marke", stunden: 3 },
        { label: "Konzept und eigene Gestaltung von Grund auf", stunden: 6 },
        { label: "Bau der Seiten (bis zu 12 Bereiche)", stunden: 14 },
        { label: "Bereiche zum Selbstpflegen, auf Ihren Ablauf zugeschnitten", stunden: 5 },
        { label: "Bilder, Schrift, Texte, bis zu drei Korrekturrunden", stunden: 4 },
        { label: "Google-Unternehmensprofil, lokale Suche, Übergabe", stunden: 3 },
      ],
      monatlichPosten: [
        "Hosting in der EU, SSL, automatische Backups, Überwachung",
        "Sicherheits- und Software-Updates",
        "Zehn kleine Änderungen pro Monat",
        "Einmal im Quartal ein Gespräch über die Seite (60 Minuten)",
        "Vorrang bei kurzfristigen Anfragen, Antwort meist am selben Werktag",
        "Direkter Draht zu der Person, die Ihre Seite gebaut hat",
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
  "Das erste Gespräch (30 bis 60 Minuten), vor Ort, am Telefon oder per Video",
  "Der Check Ihrer bisherigen Seite: drei bis fünf konkrete Punkte per Mail",
  "Kurze Fragen per Mail oder Telefon, wenn Sie schon Kunde sind",
  "Der Hinweis auf einen anderen Anbieter, wenn der besser zu Ihnen passt",
];

export const ZUSATZ_ABGERECHNET: { posten: string; preis: string }[] = [
  {
    posten: "Größere Erweiterungen, etwa ein neuer Bereich oder eine neue Funktion",
    preis: "Nach Stundensatz, den Betrag nennen wir vorher verbindlich",
  },
  {
    posten: "Saisonale Aktionen und Seiten für einzelne Veranstaltungen",
    preis: "Als eigenes kleines Projekt, der Monatsbeitrag bleibt gleich",
  },
  {
    posten: "Texte von Grund auf, ohne Stichpunkte von Ihnen",
    preis: "Wir vermitteln an eine Lektorin aus Hamburg",
  },
  {
    posten: "Foto-Shooting",
    preis: "Wir vermitteln an einen Fotografen aus Hamburg",
  },
  {
    posten: "Ein neues Logo",
    preis: "Wir vermitteln an eine Grafikdesignerin, mit der wir zusammenarbeiten",
  },
];
