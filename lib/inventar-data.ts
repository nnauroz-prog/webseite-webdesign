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
    title: "Was wir bauen mit",
    intro:
      "Werkzeuge, die wir täglich am Schreibtisch verwenden. Drei Dinge sind uns wichtig: stabil, schnell, in zehn Jahren noch da.",
    items: [
      {
        name: "Next.js",
        what: "Web-Framework für moderne Sites mit eingebautem Performance-Profil.",
        why: "Etabliert, von Vercel und der Open-Source-Community gepflegt, sauberer Migrations-Pfad zwischen Major-Versionen. Vor allem: gut testbar und gut deploybar.",
        since: "Seit 2022",
      },
      {
        name: "React",
        what: "Komponentenmodell der Wahl.",
        why: "Größte Talent-Basis, geringstes Risiko der Verwaisung. Wenn wir morgen wegfallen, finden Sie überall jemanden, der weitermacht.",
      },
      {
        name: "TypeScript",
        what: "Typsicheres JavaScript.",
        why: "Hält uns ehrlich. Fängt zur Bauzeit Fehler ein, die sonst beim Kunden landen würden.",
      },
      {
        name: "Tailwind CSS",
        what: "Utility-First CSS-Framework.",
        why: "Sieht beim ersten Blick verschwurbelt aus, ist beim zweiten Blick aber die schnellste Methode, ein konsistentes Design-System sauber durchzuziehen.",
      },
      {
        name: "Cormorant Garamond",
        what: "Serif-Schriftfamilie für Editorial-Akzente.",
        why: "Italic-Schnitt mit echtem Charakter. Wirkt nicht wie eine Tech-Serif, wirkt wie eine Druckerei-Serif. Genau das wollen wir.",
      },
      {
        name: "Geist Sans und Mono",
        what: "Sans-Familie für Lese-Text und Mono für Code-Marker.",
        why: "Klar, ruhig, gut aus der Vercel-Schmiede. Lädt schnell, sieht in zehn Jahren noch nicht alt aus.",
      },
    ],
  },
  {
    slug: "hosting",
    title: "Wo wir hosten",
    intro:
      "Daten bleiben in der EU. Keine US-Cloud-Detour bei deutschen Kunden. Vier Bausteine, die zusammen ein dichtes Netz ergeben.",
    items: [
      {
        name: "Vercel",
        what: "Edge-Hosting für Next.js-Anwendungen.",
        why: "Wir betreiben hier unsere eigenen Projekte und die meisten Kunden-Sites. Frankfurt-Edge-Standort als DSGVO-konformer Default. Pro-Plan für Production.",
      },
      {
        name: "Hetzner",
        what: "Backup-Hosting und private File-Storage.",
        why: "Falls jemand explizit nichts in der Cloud will: bei Hetzner können wir komplett deutsche Infrastruktur fahren. Auch unsere Off-Site-Backups laufen hier.",
      },
      {
        name: "Cloudflare",
        what: "CDN-Layer und DNS für eigene Domains.",
        why: "DDoS-Schutz und CDN für statische Assets. Wir nutzen es bewusst sparsam — kein Cloudflare-Captcha, kein Bot-Fight-Mode für normale Besucher.",
      },
      {
        name: "Eigene Backups",
        what: "Tägliche Snapshots, 30 Tage rückrollbar.",
        why: "Selbst wenn Vercel und Hetzner gleichzeitig ausfallen sollten, liegt der letzte Stand jeder Kunden-Seite zusätzlich bei uns. Keine Geisel-Software, keine fremden Treuhänder.",
      },
    ],
  },
  {
    slug: "werkzeug",
    title: "Was wir am Schreibtisch nutzen",
    intro:
      "Geräte und Software, die wir wirklich verwenden — keine Awards-Ausstellung.",
    items: [
      {
        name: "MacBook Pro M-Serie",
        what: "Hauptgerät seit drei Jahren.",
        why: "Lautlos auch unter Last, Akku den ganzen Tag. Für uns das beste Werkzeug im aktuellen Markt.",
      },
      {
        name: "iPhone und Android (Pixel)",
        what: "Mobile-Tests immer auf beiden Plattformen.",
        why: "Safari und Chrome sind nicht dasselbe. Wer nur auf einem testet, übersieht regelmäßig Layout-Brüche beim anderen.",
      },
      {
        name: "Visual Studio Code mit Vim-Bindings",
        what: "Editor.",
        why: "Vim, weil Maus-greifen-wieder-Tastatur den Schreibfluss bricht. VSCode, weil Plugin-Ökosystem und Git-Integration den Alltag tragen.",
      },
      {
        name: "Cursor",
        what: "KI-unterstütztes Schreiben bei klar abgegrenzten Aufgaben.",
        why: "Nützlich für repetitive Refactors und Boilerplate. Nicht nützlich für Entscheidungen über Architektur — die bleiben menschlich.",
      },
    ],
  },
  {
    slug: "lieferanten",
    title: "Wen wir empfehlen",
    intro:
      "Wir machen nicht alles selbst. Was nicht in unser Atelier passt, geben wir gerne weiter — an Menschen, mit denen wir gut zusammenarbeiten.",
    items: [
      {
        name: "Logo-Design",
        what: "Wenn Sie noch kein Logo haben oder ein altes ersetzen wollen.",
        why: "Wir kennen zwei Hamburger Designer, die für lokale Unternehmen ehrlich arbeiten. Nennen wir Ihnen auf Anfrage — keine Provision, keine versteckte Verrechnung.",
      },
      {
        name: "Foto-Shooting",
        what: "Wenn Sie keine ordentlichen Bilder vom Raum oder Team haben.",
        why: "Bei der Hamburger Fotografenszene gibt es echte Profis, die für Mittagsmenüpreise eines Cafés einen halben Tag liefern. Wir vermitteln.",
      },
      {
        name: "Texterstellung",
        what: "Wenn die Über-uns-Seite seit Jahren leer ist.",
        why: "Wir helfen beim Skelett. Für die richtige editoriale Hand bei längeren Texten gibt es zwei Frei-Lektorinnen in Hamburg, mit denen wir gut können.",
      },
    ],
  },
];

export const INVENTAR_NOT_USED: InventarItem[] = [
  {
    name: "WordPress",
    what: "Selbst-gehostetes CMS.",
    why: "Sicherheits-Updates jeden Monat, Plugin-Kollisionen jedes halbe Jahr, Performance-Anpassungen jedes Quartal. Bei Done-for-You-Pflege ist das ein Fass ohne Boden.",
  },
  {
    name: "Webflow",
    what: "Hosted-Builder mit Designer-UI.",
    why: "Schöner Editor, schöne Output, aber: Migration weg ist eine Sackgasse. Wir wollen keine Kunden vom Schicksal einer Builder-Firma abhängig machen.",
  },
  {
    name: "Google Analytics",
    what: "Verbreitestes Web-Tracking-Tool.",
    why: "DSGVO-Aufwand zu hoch im Verhältnis zum Nutzen. Wir setzen Plausible oder gar nichts ein — wenn ein Kunde es will, machen wir es ordentlich.",
  },
  {
    name: "Newsletter-Tools mit Tracker-Pixeln",
    what: "Mailchimp, ActiveCampaign, Sendinblue.",
    why: "Für lokale Hamburger Unternehmen schlicht überdimensioniert. Wenn überhaupt nötig: eine einfache Mailingliste mit Opt-out-Link, ohne Pixel.",
  },
  {
    name: "Live-Chat-Widgets",
    what: "Intercom, Crisp, Drift.",
    why: "Suggeriert Verfügbarkeit, die wir nicht halten. Wer uns erreichen will, hat Telefon und Mail — beides funktioniert.",
  },
  {
    name: "Cookie-Banner-Skripte von Drittanbietern",
    what: "OneTrust, Cookiebot, Usercentrics.",
    why: "Wir bauen Seiten, die ohne Tracking-Cookies auskommen. Dann braucht es auch kein Drei-Klick-Modal beim Eintritt.",
  },
];
