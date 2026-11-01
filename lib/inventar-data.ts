/**
 * Datenmodell für /inventar — was wir verwenden, was wir nicht
 * verwenden, mit Begründung pro Eintrag.
 *
 * Bewusst statisch, pflegbar im Code. Reihenfolge im Array
 * bestimmt Reihenfolge auf der Seite — wichtige Einträge oben.
 */

export type InventarItem = {
  /** Was es ist — Produkt, Tool, Firma. */
  name: string;
  /** Eine Zeile Kontext, was es macht. */
  what: string;
  /** Begründung, warum wir es verwenden — eine bis zwei Sätze. */
  why: string;
  /** Optional: Status-Marker, etwa „Seit 2024" oder „Neu". */
  since?: string;
};

export type InventarSection = {
  slug: string;
  title: string;
  /** Kontext-Zeile unter dem Titel. */
  intro: string;
  items: InventarItem[];
};

export const INVENTAR_USED: InventarSection[] = [
  {
    slug: "code-bau",
    title: "Womit wir bauen",
    intro:
      "Werkzeuge, mit denen wir jeden Tag arbeiten. Wir wählen sie danach aus, ob sie stabil laufen, schnell laden und in zehn Jahren noch gepflegt werden.",
    items: [
      {
        name: "Next.js",
        what: "Grundgerüst für Websites, das Seiten schnell ausliefert.",
        why: "Weit verbreitet und von Vercel und vielen freiwilligen Entwicklern gepflegt. Neue Versionen lassen sich planbar einspielen.",
        since: "Seit 2022",
      },
      {
        name: "React",
        what: "Baukastensystem für die Bestandteile einer Seite.",
        why: "Sehr viele Entwickler kennen es. Wenn Sie die Seite später jemand anderem übergeben, findet sich leicht jemand, der weitermacht.",
      },
      {
        name: "TypeScript",
        what: "JavaScript mit Typprüfung.",
        why: "Viele Fehler fallen schon beim Bauen auf und nicht erst, wenn ein Besucher auf Ihrer Seite ist.",
      },
      {
        name: "Tailwind CSS",
        what: "Werkzeug für die Gestaltung im Code.",
        why: "Abstände, Farben und Schriftgrößen bleiben damit auf jeder Seite gleich, auch wenn später etwas dazukommt.",
      },
      {
        name: "Mona Sans",
        what: "Schrift für Überschriften und Text.",
        why: "Eine breite, kräftige Grotesk, die auf dem Handy gut lesbar bleibt. Sie ist frei lizenziert und lädt von unserem eigenen Server.",
      },
      {
        name: "IBM Plex Mono",
        what: "Schrift für Beschriftungen und Zahlen.",
        why: "Gleich breite Zeichen, gut für Preise, Uhrzeiten und kleine Beschriftungen. Ebenfalls frei lizenziert.",
      },
    ],
  },
  {
    slug: "hosting",
    title: "Wo Ihre Seite liegt",
    intro:
      "Ihre Seite liegt auf Servern in der EU. Diese Dienste nutzen wir dafür.",
    items: [
      {
        name: "Vercel",
        what: "Hosting für Websites, die mit Next.js gebaut sind.",
        why: "Hier laufen unsere eigene Seite und die meisten Kundenseiten. Wir wählen dabei einen Serverstandort in der EU.",
      },
      {
        name: "Hetzner",
        what: "Server in Deutschland für Backups und Dateien.",
        why: "Wenn Sie ausdrücklich nur Server in Deutschland möchten, können wir Ihre Seite ganz bei Hetzner betreiben. Unsere zusätzlichen Backups liegen ebenfalls dort.",
      },
      {
        name: "Cloudflare",
        what: "Verwaltung von Domains und Schutz vor Überlastung.",
        why: "Wir nutzen es sparsam. Besucher Ihrer Seite müssen dadurch keine Prüfaufgaben lösen, um zu beweisen, dass sie kein Roboter sind.",
      },
      {
        name: "Eigene Backups",
        what: "Jeden Tag eine Sicherung, 30 Tage zurück.",
        why: "Fällt ein Anbieter aus, liegt der letzte Stand Ihrer Seite zusätzlich bei uns.",
      },
    ],
  },
  {
    slug: "werkzeug",
    title: "Am Schreibtisch",
    intro:
      "Geräte und Programme, die wir im Alltag verwenden.",
    items: [
      {
        name: "MacBook Pro",
        what: "Das Hauptgerät.",
        why: "Leise auch bei viel Arbeit, und der Akku hält einen Arbeitstag.",
      },
      {
        name: "iPhone und Android-Handy",
        what: "Jede Seite wird auf beiden getestet.",
        why: "Safari und Chrome zeigen Seiten nicht immer gleich an. Wer nur auf einem Gerät testet, übersieht Fehler auf dem anderen.",
      },
      {
        name: "Visual Studio Code",
        what: "Editor für den Code.",
        why: "Läuft stabil, und die Verbindung zur Versionsverwaltung ist eingebaut. Jede Änderung an Ihrer Seite lässt sich so nachvollziehen.",
      },
      {
        name: "Plausible Analytics",
        what: "Besucherstatistik ohne Cookies.",
        why: "Wir sehen, welche Seiten gelesen werden und wie oft jemand auf die Telefonnummer tippt. Personenbezogene Daten werden dabei nicht gespeichert, deshalb braucht es keinen Cookie-Banner. Für Kundenseiten empfehlen wir es, wenn Sie überhaupt eine Statistik brauchen.",
      },
    ],
  },
  {
    slug: "lieferanten",
    title: "Wen wir empfehlen",
    intro:
      "Manches machen wir nicht selbst. Dafür nennen wir Ihnen auf Wunsch Leute aus Hamburg.",
    items: [
      {
        name: "Logo-Gestaltung",
        what: "Wenn Sie noch kein Logo haben oder ein altes ersetzen wollen.",
        why: "Wir nennen Ihnen Grafikdesigner, die für kleine Betriebe arbeiten. Eine Provision bekommen wir dafür nicht.",
      },
      {
        name: "Fotos",
        what: "Wenn Sie Bilder vom Raum oder vom Team brauchen.",
        why: "Für viele Seiten reichen gute Handyfotos. Wenn nicht, nennen wir Ihnen Fotografen aus Hamburg.",
      },
      {
        name: "Lektorat",
        what: "Wenn längere Texte besonders sorgfältig werden sollen.",
        why: "Die Texte für Ihre Seite formulieren wir aus Ihren Stichpunkten. Für lange Texte, etwa eine Chronik, empfehlen wir ein Lektorat.",
      },
    ],
  },
];

export const INVENTAR_NOT_USED: InventarItem[] = [
  {
    name: "WordPress",
    what: "Weit verbreitetes System zum Verwalten von Websites.",
    why: "Es braucht jeden Monat Sicherheits-Updates, und Erweiterungen vertragen sich nicht immer. Wenn wir die Pflege übernehmen, kostet das Zeit, die Sie über den Monatsbeitrag bezahlen würden.",
  },
  {
    name: "Webflow",
    what: "Gehosteter Baukasten für Gestalter.",
    why: "Der Editor ist gut. Ein späterer Umzug zu einem anderen Anbieter ist aber aufwendig, und davon wollen wir Ihre Seite nicht abhängig machen.",
  },
  {
    name: "Google Analytics",
    what: "Das bekannteste Werkzeug für Besucherstatistik.",
    why: "Der Aufwand für den Datenschutz ist hoch im Verhältnis zum Nutzen. Wir setzen stattdessen Plausible ein oder gar nichts. Wenn Sie Google Analytics ausdrücklich möchten, richten wir es mit Einwilligungsabfrage und Vertrag zur Auftragsverarbeitung ein.",
  },
  {
    name: "Newsletter-Dienste mit Zählpixeln",
    what: "Etwa Mailchimp, ActiveCampaign oder Brevo.",
    why: "Für lokale Betriebe meist zu groß. Wenn Sie einen Newsletter brauchen, reicht eine einfache Mailingliste mit Abmeldelink.",
  },
  {
    name: "Live-Chat auf der Seite",
    what: "Etwa Intercom, Crisp oder Drift.",
    why: "Ein Chatfenster verspricht, dass jederzeit jemand antwortet. Das können wir nicht halten. Wer uns erreichen will, ruft an oder schreibt eine Mail.",
  },
  {
    name: "Cookie-Banner von Drittanbietern",
    what: "Etwa OneTrust, Cookiebot oder Usercentrics.",
    why: "Unsere Seiten kommen ohne Tracking-Cookies aus. Dann braucht es auch keinen Banner, den Besucher erst wegklicken müssen.",
  },
];
