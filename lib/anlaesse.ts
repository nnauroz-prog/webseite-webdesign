/**
 * Anlässe im Jahr für die tagesaktuellen Posts (lib/posts-aktuell.ts):
 * Feiertage in Hamburg, Tage des Handels, Jahreszeiten und belegte
 * Hamburger Termine. Der Lauf am Morgen fragt hier, was heute und in den
 * nächsten Tagen ansteht (anlaesseFuer, naechsteAnlaesse).
 *
 * - Alles wird aus dem Datum gerechnet, nichts aus der Uhr: Beim Laden
 *   des Moduls passiert nichts, die Jahre werden erst bei Bedarf gebaut.
 * - Feste Termine aus Hamburg stehen in TERMINE_HAMBURG, jeder mit Quelle.
 *   Nur Daten eintragen, die eine Quelle wirklich nennt; NUR UNTEN
 *   ANHÄNGEN.
 * - Namen sind kurz, deutsch und ohne Ziffern („Erster Advent“), damit
 *   sie unverändert als Anlass auf eine Karte passen (höchstens 28 Zeichen).
 *
 * Regeln prüft tests/anlaesse.test.ts.
 */

export type AnlassArt =
  | "feiertag"
  | "handel"
  | "jahreszeit"
  | "hamburg"
  | "aktion"
  | "frist";

export type Anlass = {
  /** Kalendertag yyyy-mm-dd */
  datum: string;
  /** Kurz, deutsch, ohne Ziffern, höchstens 28 Zeichen: „Erster Advent“ */
  name: string;
  art: AnlassArt;
  /** Ein kurzer Satz: warum der Tag für die Website kleiner Betriebe zählt. */
  hinweis?: string;
};

/** Ein fester Termin in Hamburg, eintägig oder über mehrere Tage. */
export type HamburgTermin = {
  /** Erster Tag, yyyy-mm-dd */
  start: string;
  /** Letzter Tag, yyyy-mm-dd (bei eintägigen Terminen weglassen) */
  ende?: string;
  /** Anlass am ersten Tag: „Winterdom beginnt“ */
  name: string;
  /** Anlass an den Tagen dazwischen: „Winterdom läuft“ (weglassen: keiner) */
  laeuft?: string;
  /** Anlass am letzten Tag: „Letzter Tag Winterdom“ (weglassen: keiner) */
  schluss?: string;
  hinweis?: string;
  /** Seite, auf der das Datum steht (https) */
  quelle: string;
};

/**
 * Belegte Termine in Hamburg. Jeder Eintrag hat eine Quelle, auf der
 * genau diese Daten stehen. NUR UNTEN ANHÄNGEN, nichts erfinden; ändert
 * der Veranstalter ein Datum, den Eintrag mit neuer Quelle berichtigen.
 */
export const TERMINE_HAMBURG: readonly HamburgTermin[] = [
  {
    start: "2026-11-06",
    ende: "2026-12-06",
    name: "Winterdom beginnt",
    laeuft: "Winterdom läuft",
    schluss: "Letzter Tag Winterdom",
    hinweis:
      "Volksfest auf dem Heiligengeistfeld, viel Betrieb rund um St. Pauli.",
    quelle: "https://www.hamburg.de/freizeit/dom/termine-337422",
  },
  {
    start: "2026-11-23",
    ende: "2026-12-23",
    name: "Weihnachtsmarkt eröffnet",
    laeuft: "Weihnachtsmarktzeit",
    schluss: "Letzter Weihnachtsmarkttag",
    hinweis:
      "Weihnachtsmarkt auf dem Rathausmarkt: viel Betrieb in der Innenstadt, gesucht wird unterwegs.",
    quelle:
      "https://www.hamburg-tourism.de/sehen-erleben/veranstaltungen/veranstaltungskalender/historischer-weihnachtsmarkt-auf-dem-rathausmarkt-1/",
  },
  {
    start: "2027-03-19",
    ende: "2027-04-18",
    name: "Frühlingsdom beginnt",
    laeuft: "Frühlingsdom läuft",
    schluss: "Letzter Tag Frühlingsdom",
    hinweis:
      "Volksfest auf dem Heiligengeistfeld, viel Betrieb rund um St. Pauli.",
    quelle: "https://www.hamburg.de/freizeit/dom/bewerbung-337432",
  },
  {
    start: "2027-05-06",
    ende: "2027-05-09",
    name: "Hafengeburtstag beginnt",
    laeuft: "Hafengeburtstag läuft",
    schluss: "Letzter Tag Hafengeburtstag",
    hinweis:
      "Großes Hafenfest an den Landungsbrücken, viele Gäste in der Stadt.",
    quelle: "https://www.hamburg-tourism.de/hafengeburtstag-2027/",
  },
  {
    start: "2027-07-23",
    ende: "2027-08-29",
    name: "Sommerdom beginnt",
    laeuft: "Sommerdom läuft",
    schluss: "Letzter Tag Sommerdom",
    hinweis:
      "Volksfest auf dem Heiligengeistfeld, viel Betrieb rund um St. Pauli.",
    quelle: "https://www.hamburg.de/freizeit/dom/bewerbung-337432",
  },
  {
    start: "2027-11-05",
    ende: "2027-12-05",
    name: "Winterdom beginnt",
    laeuft: "Winterdom läuft",
    schluss: "Letzter Tag Winterdom",
    hinweis:
      "Volksfest auf dem Heiligengeistfeld, viel Betrieb rund um St. Pauli.",
    quelle: "https://www.hamburg.de/freizeit/dom/bewerbung-337432",
  },
];

const TAG_MS = 24 * 60 * 60 * 1000;

const BERLIN_ISO = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Berlin",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Zeitpunkt (UTC, Mitternacht) eines Kalendertags. */
function utc(jahr: number, monat: number, tag: number): number {
  return Date.UTC(jahr, monat - 1, tag);
}

function iso(t: number): string {
  return new Date(t).toISOString().slice(0, 10);
}

/** yyyy-mm-dd prüfen und in Zahlen zerlegen; wirft bei falschem Datum. */
function zerlege(datum: string): [number, number, number] {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(datum);
  const t = m ? utc(Number(m[1]), Number(m[2]), Number(m[3])) : NaN;
  if (!m || Number.isNaN(t) || iso(t) !== datum)
    throw new RangeError(`Kein Kalendertag (yyyy-mm-dd): ${datum}`);
  return [Number(m[1]), Number(m[2]), Number(m[3])];
}

/**
 * Ostersonntag im gregorianischen Kalender (Algorithmus nach Meeus,
 * Jones und Butcher), als yyyy-mm-dd.
 */
export function ostersonntag(jahr: number): string {
  const a = jahr % 19;
  const b = Math.floor(jahr / 100);
  const c = jahr % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const monat = Math.floor((h + l - 7 * m + 114) / 31);
  const tag = ((h + l - 7 * m + 114) % 31) + 1;
  return iso(utc(jahr, monat, tag));
}

/**
 * Der n-te Wochentag (0 = Sonntag) eines Monats; n = -1 ist der letzte.
 */
function nterWochentag(
  jahr: number,
  monat: number,
  wochentag: number,
  n: number,
): number {
  if (n > 0) {
    const erster = utc(jahr, monat, 1);
    const versatz = (wochentag - new Date(erster).getUTCDay() + 7) % 7;
    return erster + (versatz + (n - 1) * 7) * TAG_MS;
  }
  const letzter = utc(jahr, monat + 1, 0);
  const zurueck = (new Date(letzter).getUTCDay() - wochentag + 7) % 7;
  return letzter - zurueck * TAG_MS;
}

/**
 * Periodische Glieder für Tagundnachtgleichen und Sonnenwenden
 * (Meeus, Astronomical Algorithms, Tabelle 27.C): A, B, C.
 */
const PERIODEN: readonly (readonly [number, number, number])[] = [
  [485, 324.96, 1934.136],
  [203, 337.23, 32964.467],
  [199, 342.08, 20.186],
  [182, 27.85, 445267.112],
  [156, 73.14, 45036.886],
  [136, 171.52, 22518.443],
  [77, 222.54, 65928.934],
  [74, 296.72, 3034.906],
  [70, 243.58, 9037.513],
  [58, 119.81, 33718.147],
  [52, 297.17, 150.678],
  [50, 21.02, 2281.226],
  [45, 247.54, 29929.562],
  [44, 325.15, 31555.956],
  [29, 60.93, 4443.417],
  [18, 155.12, 67555.328],
  [17, 288.79, 4562.452],
  [16, 198.04, 62894.029],
  [14, 199.76, 31436.921],
  [12, 95.39, 14577.848],
  [12, 287.11, 31931.756],
  [12, 320.81, 34777.259],
  [9, 227.73, 1222.114],
  [8, 15.45, 16859.074],
];

/** Mittlere Zeitpunkte (Meeus, Tabelle 27.B, Jahre 2000 bis 3000). */
const MITTEL: readonly (readonly number[])[] = [
  [2451623.80984, 365242.37404, 0.05169, -0.00411, -0.00057],
  [2451716.56767, 365241.62603, 0.00325, 0.00888, -0.0003],
  [2451810.21715, 365242.01767, -0.11575, 0.00337, 0.00078],
  [2451900.05952, 365242.74049, -0.06223, -0.00823, 0.00032],
];

/**
 * Kalendarischer Beginn einer Jahreszeit (0 Frühling, 1 Sommer, 2 Herbst,
 * 3 Winter): der Tag der Tagundnachtgleiche oder Sonnenwende in Hamburger
 * Zeit. Gerechnet statt fest eingetragen, weil der Tag wandert: Der Herbst
 * beginnt 2026 am 23.9., der Winter 2027 erst am 22.12. Genauigkeit:
 * wenige Minuten.
 */
export function jahreszeitBeginn(jahr: number, welche: 0 | 1 | 2 | 3): string {
  const y = (jahr - 2000) / 1000;
  const k = MITTEL[welche];
  const jde0 = k[0] + k[1] * y + k[2] * y ** 2 + k[3] * y ** 3 + k[4] * y ** 4;
  const t = (jde0 - 2451545) / 36525;
  const grad = Math.PI / 180;
  const w = (35999.373 * t - 2.47) * grad;
  const dl = 1 + 0.0334 * Math.cos(w) + 0.0007 * Math.cos(2 * w);
  const s = PERIODEN.reduce(
    (summe, [a, b, c]) => summe + a * Math.cos((b + c * t) * grad),
    0,
  );
  const jde = jde0 + (0.00001 * s) / dl;
  // Terrestrische Zeit zu Weltzeit: rund siebzig Sekunden Unterschied.
  const ms = (jde - 2440587.5) * TAG_MS - 70_000;
  return BERLIN_ISO.format(new Date(ms));
}

type Roh = Omit<Anlass, "datum"> & { t: number };

/** Alle gerechneten Anlässe eines Jahres (ohne die Hamburger Termine). */
function gerechnet(jahr: number): Roh[] {
  const ostern = utc(...zerlege(ostersonntag(jahr)));
  const nachOstern = (tage: number) => ostern + tage * TAG_MS;
  // Vierter Advent: der letzte Sonntag vor dem 25. Dezember.
  const weihnachten = utc(jahr, 12, 25);
  const vierterAdvent =
    weihnachten - (new Date(weihnachten).getUTCDay() || 7) * TAG_MS;
  const advent = (n: number) => vierterAdvent - (4 - n) * 7 * TAG_MS;
  // Thanksgiving in den USA: vierter Donnerstag im November.
  const thanksgiving = nterWochentag(jahr, 11, 4, 4);
  const jz = (welche: 0 | 1 | 2 | 3) =>
    utc(...zerlege(jahreszeitBeginn(jahr, welche)));

  return [
    {
      t: utc(jahr, 1, 1),
      name: "Neujahr",
      art: "feiertag",
      hinweis: "Feiertag: Viele suchen online, wer schon wieder geöffnet hat.",
    },
    {
      t: utc(jahr, 2, 14),
      name: "Valentinstag",
      art: "handel",
      hinweis:
        "Gesucht werden Geschenkideen und freie Tische, oft kurzfristig am Handy.",
    },
    {
      t: jz(0),
      name: "Frühlingsanfang",
      art: "jahreszeit",
      hinweis: "Saisonwechsel: Fotos und Angebote auf der Website auffrischen.",
    },
    {
      t: nterWochentag(jahr, 3, 0, -1),
      name: "Zeitumstellung",
      art: "jahreszeit",
      hinweis:
        "Die Uhren springen vor, die Abende werden hell: guter Moment für neue Fotos.",
    },
    {
      t: nachOstern(-2),
      name: "Karfreitag",
      art: "feiertag",
      hinweis:
        "Stiller Feiertag: Sonderzeiten vorher auf Website und Karteneintrag stellen.",
    },
    {
      t: ostern,
      name: "Ostersonntag",
      art: "feiertag",
      hinweis:
        "Osterwochenende: Öffnungszeiten an allen Stellen gleich halten.",
    },
    {
      t: nachOstern(1),
      name: "Ostermontag",
      art: "feiertag",
      hinweis:
        "Feiertag: Wer offen hat oder Notdienst macht, sagt es am besten online.",
    },
    {
      t: utc(jahr, 5, 1),
      name: "Tag der Arbeit",
      art: "feiertag",
      hinweis: "Feiertag: geänderte Zeiten vorher auf der Website ankündigen.",
    },
    {
      t: nterWochentag(jahr, 5, 0, 2),
      name: "Muttertag",
      art: "handel",
      hinweis:
        "In den Tagen davor wird nach Geschenken, Blumen und freien Tischen gesucht.",
    },
    {
      t: nachOstern(39),
      name: "Christi Himmelfahrt",
      art: "feiertag",
      hinweis:
        "Feiertag mitten in der Woche: Brückentag und Zeiten früh online klären.",
    },
    {
      t: nachOstern(39),
      name: "Vatertag",
      art: "handel",
      hinweis:
        "Ausflugstag: Lokale gewinnen mit klaren Zeiten und Reservierung.",
    },
    {
      t: nachOstern(49),
      name: "Pfingstsonntag",
      art: "feiertag",
      hinweis: "Langes Wochenende: Sonderzeiten und Vertretung online angeben.",
    },
    {
      t: nachOstern(50),
      name: "Pfingstmontag",
      art: "feiertag",
      hinweis: "Feiertag: Wer erreichbar ist, sagt es am besten gleich vorn.",
    },
    {
      t: jz(1),
      name: "Sommeranfang",
      art: "jahreszeit",
      hinweis:
        "Längster Tag: Urlaubszeiten und Vertretung früh online angeben.",
    },
    {
      t: jz(2),
      name: "Herbstanfang",
      art: "jahreszeit",
      hinweis: "Saisonwechsel: Sommerfotos und Sommerangebote austauschen.",
    },
    {
      t: utc(jahr, 10, 3),
      name: "Tag der Deutschen Einheit",
      art: "feiertag",
      hinweis: "Feiertag: Öffnungszeiten und Erreichbarkeit vorher anpassen.",
    },
    {
      t: nterWochentag(jahr, 10, 0, -1),
      name: "Zeitumstellung",
      art: "jahreszeit",
      hinweis:
        "Ab jetzt wird es früh dunkel, gesucht wird abends am Handy und auf dem Sofa.",
    },
    {
      // Seit 2018 gesetzlicher Feiertag in Hamburg.
      t: utc(jahr, 10, 31),
      name: "Reformationstag",
      art: "feiertag",
      hinweis:
        "Feiertag in Hamburg: Sonderzeiten auf Website und Karteneintrag.",
    },
    {
      t: utc(jahr, 10, 31),
      name: "Halloween",
      art: "handel",
      hinweis: "Für Cafés und Läden ein Anlass für ein kleines Saisonangebot.",
    },
    {
      // Stiller Tag: Posts eher ruhig halten.
      t: advent(1) - 7 * TAG_MS,
      name: "Totensonntag",
      art: "feiertag",
      hinweis: "Stiller Tag: lieber ruhige Posts, keine lauten Aktionen.",
    },
    {
      t: thanksgiving + TAG_MS,
      name: "Black Friday",
      art: "aktion",
      hinweis:
        "Rabattwoche im Handel: Wer nicht mitmacht, fällt mit Klarheit statt Countdown auf.",
    },
    {
      t: advent(1),
      name: "Erster Advent",
      art: "feiertag",
      hinweis:
        "Die Adventszeit beginnt: Gutscheine und Zeiten bis Weihnachten zeigen.",
    },
    {
      t: thanksgiving + 4 * TAG_MS,
      name: "Cyber Monday",
      art: "aktion",
      hinweis:
        "Letzter großer Rabatttag: Postfächer sind voll, Klarheit fällt auf.",
    },
    {
      t: advent(2),
      name: "Zweiter Advent",
      art: "feiertag",
      hinweis: "Adventssonntag: Zeiten bis Weihnachten auf einen Blick zeigen.",
    },
    {
      t: utc(jahr, 12, 6),
      name: "Nikolaus",
      art: "handel",
      hinweis: "Kleiner Anlass für Gutscheine und kleine Aufmerksamkeiten.",
    },
    {
      t: advent(3),
      name: "Dritter Advent",
      art: "feiertag",
      hinweis:
        "Adventssonntag: Wer Gutscheine verkauft, sagt es jetzt deutlich.",
    },
    {
      t: advent(4),
      name: "Vierter Advent",
      art: "feiertag",
      hinweis:
        "Letzter Adventssonntag: Zeiten zwischen den Jahren gehören vorn hin.",
    },
    {
      t: jz(3),
      name: "Winteranfang",
      art: "jahreszeit",
      hinweis:
        "Kürzester Tag: Zeiten über die Feiertage gehören auf die Startseite.",
    },
    {
      // Kein gesetzlicher Feiertag, aber viele Betriebe schließen mittags.
      t: utc(jahr, 12, 24),
      name: "Heiligabend",
      art: "feiertag",
      hinweis:
        "Viele schließen mittags: Zeiten bis Neujahr früh online stellen.",
    },
    {
      t: utc(jahr, 12, 25),
      name: "Erster Weihnachtstag",
      art: "feiertag",
      hinweis: "Feiertag: Erreichbarkeit und Notdienst klar angeben.",
    },
    {
      t: utc(jahr, 12, 26),
      name: "Zweiter Weihnachtstag",
      art: "feiertag",
      hinweis: "Feiertag: Zeiten bis Neujahr gesammelt an einer Stelle zeigen.",
    },
    {
      // Kein gesetzlicher Feiertag, für viele ein kurzer Arbeitstag.
      t: utc(jahr, 12, 31),
      name: "Silvester",
      art: "feiertag",
      hinweis: "Kurzer Arbeitstag: Rückkehr im neuen Jahr online ankündigen.",
    },
  ];
}

/** Die Tage eines Hamburger Termins als Anlässe. */
function terminTage(termin: HamburgTermin): Anlass[] {
  const start = utc(...zerlege(termin.start));
  const ende = termin.ende ? utc(...zerlege(termin.ende)) : start;
  const tage: Anlass[] = [];
  for (let t = start; t <= ende; t += TAG_MS) {
    const name =
      t === start ? termin.name : t === ende ? termin.schluss : termin.laeuft;
    if (!name) continue;
    tage.push({
      datum: iso(t),
      name,
      art: "hamburg",
      ...(termin.hinweis ? { hinweis: termin.hinweis } : {}),
    });
  }
  return tage;
}

const JAHRE = new Map<number, readonly Anlass[]>();

/** Alle Anlässe eines Jahres, nach Datum sortiert. */
export function anlaesseImJahr(jahr: number): readonly Anlass[] {
  const fertig = JAHRE.get(jahr);
  if (fertig) return fertig;
  const vorne = `${String(jahr).padStart(4, "0")}-`;
  const alle: Anlass[] = [
    ...gerechnet(jahr).map(({ t, ...rest }) => ({ datum: iso(t), ...rest })),
    ...TERMINE_HAMBURG.flatMap(terminTage).filter((a) =>
      a.datum.startsWith(vorne),
    ),
  ];
  // Stabil sortiert: Am selben Tag bleibt die Reihenfolge von oben.
  const sortiert = alle
    .map((a, i) => [a, i] as const)
    .sort(([a, i], [b, j]) => a.datum.localeCompare(b.datum) || i - j)
    .map(([a]) => Object.freeze(a));
  JAHRE.set(jahr, Object.freeze(sortiert));
  return sortiert;
}

/** Was an einem Kalendertag (yyyy-mm-dd) ansteht. */
export function anlaesseFuer(datum: string): Anlass[] {
  const [jahr] = zerlege(datum);
  return anlaesseImJahr(jahr).filter((a) => a.datum === datum);
}

/**
 * Anlässe ab einem Kalendertag (yyyy-mm-dd, mitgezählt) für die
 * nächsten tage Tage, nach Datum sortiert. Läuft ein Termin über mehrere
 * Tage („Winterdom läuft“), steht er nur einmal da: am ersten Tag im
 * Zeitraum.
 */
export function naechsteAnlaesse(datum: string, tage = 14): Anlass[] {
  const [j, m, d] = zerlege(datum);
  const start = utc(j, m, d);
  const ende = start + (Math.max(1, Math.floor(tage)) - 1) * TAG_MS;
  const bis = iso(ende);
  const jahre = new Set([j, new Date(ende).getUTCFullYear()]);
  const gesehen = new Set<string>();
  const liste: Anlass[] = [];
  for (const jahr of [...jahre].sort((a, b) => a - b)) {
    for (const a of anlaesseImJahr(jahr)) {
      if (a.datum < datum || a.datum > bis) continue;
      const laeuft = TERMINE_HAMBURG.some((t) => t.laeuft === a.name);
      if (laeuft && gesehen.has(a.name)) continue;
      gesehen.add(a.name);
      liste.push(a);
    }
  }
  return liste;
}
