/**
 * Spruch des Tages für /journal: kurze Gedanken zur eigenen Website.
 *
 * Jeden Tag steht automatisch ein anderer Spruch oben (spruchFuer). Die
 * Reihenfolge ergibt sich aus dem Datum in Hamburg, nicht aus der Liste:
 * Neue Sprüche einfach unten anhängen.
 *
 * Regeln für neue Sprüche (prüft tests/sprueche.test.ts):
 * - höchstens 120 Zeichen, der Zusatz höchstens 110
 * - keine erfundenen Zahlen, Kunden, Bewertungen oder Auszeichnungen
 * - Sie-Form, ruhiger Ton, kein Werbe-Deutsch
 * - jeder Spruch nur einmal
 */

export type SpruchThema =
  | "eindruck"
  | "google"
  | "texte"
  | "handy"
  | "vertrauen"
  | "tempo"
  | "pflege"
  | "anfrage";

export type Spruch = {
  /** Der Satz, der groß auf der Karte steht. */
  text: string;
  /** Ein kurzer Satz dazu, klein darunter. */
  zusatz?: string;
  thema: SpruchThema;
};

export const THEMA_LABEL: Record<SpruchThema, string> = {
  eindruck: "Erster Eindruck",
  google: "Gefunden werden",
  texte: "Texte",
  handy: "Am Handy",
  vertrauen: "Vertrauen",
  tempo: "Tempo",
  pflege: "Pflege",
  anfrage: "Anfragen",
};

export const SPRUECHE: Spruch[] = [
  {
    text: "Ihre Website ist das Schaufenster, das nie schließt.",
    zusatz: "Auch abends um zehn schaut jemand hinein.",
    thema: "eindruck",
  },
  {
    text: "Wer gesucht wird, sollte auch gefunden werden.",
    zusatz: "Dafür muss auf der Seite stehen, was Sie anbieten und wo.",
    thema: "google",
  },
  {
    text: "Schreiben Sie, wie Sie am Tresen reden.",
    zusatz: "Das versteht jeder, und es klingt nach Ihnen.",
    thema: "texte",
  },
  {
    text: "Ein Tipp auf die Nummer, und das Telefon klingelt.",
    zusatz: "So einfach soll es am Handy sein.",
    thema: "handy",
  },
  {
    text: "Ein Gesicht auf der Seite schafft mehr Vertrauen als zehn Versprechen.",
    thema: "vertrauen",
  },
  {
    text: "Eine langsame Seite ist wie eine klemmende Ladentür.",
    zusatz: "Man probiert es einmal und geht dann weiter.",
    thema: "tempo",
  },
  {
    text: "Neue Öffnungszeiten? Zuerst auf die Website, dann an die Tür.",
    thema: "pflege",
  },
  {
    text: "Machen Sie es leicht, Sie zu erreichen.",
    zusatz: "Der Rest ergibt sich im Gespräch.",
    thema: "anfrage",
  },
  {
    text: "Der erste Blick entscheidet.",
    zusatz: "Der zweite kommt nur, wenn der erste gefallen hat.",
    thema: "eindruck",
  },
  {
    text: "Google liest Text, keine Gedanken.",
    zusatz: "Schreiben Sie hin, was Sie anbieten.",
    thema: "google",
  },
  {
    text: "Kurze Sätze. Klare Worte.",
    zusatz: "Mehr braucht eine Website selten.",
    thema: "texte",
  },
  {
    text: "Was am Handy nicht mit dem Daumen geht, geht gar nicht.",
    thema: "handy",
  },
  {
    text: "Vertrauen entsteht, bevor das Telefon klingelt.",
    zusatz: "Auf der Seite, beim Lesen, in Ruhe.",
    thema: "vertrauen",
  },
  {
    text: "Niemand wartet auf eine Website.",
    zusatz: "Man tippt einfach auf den nächsten Treffer.",
    thema: "tempo",
  },
  {
    text: "Eine Website ist kein Schild.",
    zusatz: "Sie will gepflegt werden wie ein Schaufenster.",
    thema: "pflege",
  },
  {
    text: "Drei Felder im Formular reichen.",
    zusatz: "Alles Weitere klärt man am Telefon.",
    thema: "anfrage",
  },
  {
    text: "Wer nicht zeigt, was er kann, wird nicht gefragt.",
    thema: "eindruck",
  },
  {
    text: "Ihr Stadtteil gehört auf die Seite.",
    zusatz: "Dort sucht Ihre Kundschaft.",
    thema: "google",
  },
  {
    text: "‚Herzlich willkommen‘ sagt nichts.",
    zusatz: "‚Wir reparieren Ihre Heizung, auch am Wochenende‘ sagt alles.",
    thema: "texte",
  },
  {
    text: "Der Anruf-Knopf gehört nach oben.",
    zusatz: "Nicht ins Impressum.",
    thema: "handy",
  },
  {
    text: "Ehrliche Fotos, echte Namen, klare Preise.",
    zusatz: "Mehr Werbung braucht ein guter Betrieb selten.",
    thema: "vertrauen",
  },
  {
    text: "Tempo ist Höflichkeit. Auch im Netz.",
    thema: "tempo",
  },
  {
    text: "Updates sind wie Ölwechsel.",
    zusatz: "Unspektakulär, aber man sollte sie nicht auslassen.",
    thema: "pflege",
  },
  {
    text: "Jeder Klick mehr ist eine Anfrage weniger.",
    thema: "anfrage",
  },
  {
    text: "Eine gute Startseite beantwortet drei Fragen.",
    zusatz: "Was machen Sie? Wo? Und wie erreicht man Sie?",
    thema: "eindruck",
  },
  {
    text: "Öffnungszeiten als Bild kann Google nicht lesen.",
    zusatz: "Als Text schon.",
    thema: "google",
  },
  {
    text: "Fachwörter beeindrucken Kollegen.",
    zusatz: "Kunden überzeugt, was sie verstehen.",
    thema: "texte",
  },
  {
    text: "Kleine Schrift ist höflich gemeint und wird nie gelesen.",
    thema: "handy",
  },
  {
    text: "Zeigen Sie, wer ans Telefon geht.",
    zusatz: "Dann ruft man lieber an.",
    thema: "vertrauen",
  },
  {
    text: "Schnell laden heißt: Bilder klein halten, Ballast weglassen.",
    thema: "tempo",
  },
  {
    text: "‚Aktuelles‘ von vor drei Jahren ist nichts Aktuelles.",
    thema: "pflege",
  },
  {
    text: "Die beste Website endet mit einem Anruf.",
    thema: "anfrage",
  },
  {
    text: "Weniger auf der Seite heißt nicht weniger Betrieb.",
    zusatz: "Es heißt: Man findet, was zählt.",
    thema: "eindruck",
  },
  {
    text: "Den ersten Platz bei Google kann niemand versprechen.",
    zusatz: "Eine saubere Seite schon.",
    thema: "google",
  },
  {
    text: "Ein Preis auf der Seite spart zwei Anrufe.",
    zusatz: "Den neugierigen und den enttäuschten.",
    thema: "texte",
  },
  {
    text: "Wer an der Bushaltestelle sucht, hat keine Geduld für Menüs.",
    thema: "handy",
  },
  {
    text: "Impressum und Datenschutz sind keine Kür.",
    zusatz: "Sie zeigen, dass Sie es ernst meinen.",
    thema: "vertrauen",
  },
  {
    text: "Jede Sekunde Ladezeit ist eine Sekunde Zweifel.",
    thema: "tempo",
  },
  {
    text: "Ein Backup bemerkt man erst, wenn es fehlt.",
    thema: "pflege",
  },
  {
    text: "Sagen Sie, was nach der Anfrage passiert.",
    zusatz: "Das nimmt die Scheu vor dem Absenden.",
    thema: "anfrage",
  },
  {
    text: "Ein gutes Foto vom eigenen Laden schlägt jedes gekaufte Bild.",
    thema: "eindruck",
  },
  {
    text: "Wer empfohlen wird, wird gegoogelt.",
    zusatz: "Sorgen Sie dafür, dass man dann etwas Gutes findet.",
    thema: "google",
  },
  {
    text: "Sagen Sie zuerst, was Sie tun.",
    zusatz: "Dann, warum Sie es gut können.",
    thema: "texte",
  },
  {
    text: "Viele sehen Ihre Seite zuerst auf dem Handy.",
    zusatz: "Dort muss sie stimmen.",
    thema: "handy",
  },
  {
    text: "Wer nichts zu verbergen hat, schreibt die Preise dazu.",
    thema: "vertrauen",
  },
  {
    text: "Ballast auf der Seite ist wie Gepäck im Flur.",
    zusatz: "Alle müssen erst daran vorbei.",
    thema: "tempo",
  },
  {
    text: "Die Seite ist fertig, wenn sie online geht.",
    zusatz: "Dann fängt sie an zu arbeiten.",
    thema: "pflege",
  },
  {
    text: "Wer fragt, hat schon Interesse.",
    zusatz: "Antworten Sie, solange es warm ist.",
    thema: "anfrage",
  },
  {
    text: "Aufgeräumt wirkt verlässlich.",
    zusatz: "Das gilt für die Werkstatt und für die Website.",
    thema: "eindruck",
  },
  {
    text: "Jede Leistung verdient ihre eigene Überschrift.",
    zusatz: "So finden Menschen und Suchmaschinen sie wieder.",
    thema: "google",
  },
  {
    text: "Eine Überschrift ist ein Versprechen.",
    zusatz: "Der Text darunter löst es ein.",
    thema: "texte",
  },
  {
    text: "Am Handy zählt, was ohne Zoomen lesbar ist.",
    thema: "handy",
  },
  {
    text: "Eine veraltete Seite erzählt auch etwas.",
    zusatz: "Nur selten etwas Gutes.",
    thema: "vertrauen",
  },
  {
    text: "Ein Bild, das lädt und lädt, verkauft nichts.",
    thema: "tempo",
  },
  {
    text: "Fragen, die am Telefon immer kommen, gehören auf die Website.",
    thema: "pflege",
  },
  {
    text: "Ein Knopf, ein Ziel.",
    zusatz: "Zwei Knöpfe, ein Zögern.",
    thema: "anfrage",
  },
  {
    text: "Niemand liest eine Website. Man überfliegt sie.",
    zusatz: "Bauen Sie sie dafür.",
    thema: "eindruck",
  },
  {
    text: "Mundpropaganda beginnt heute oft mit einer Suche.",
    thema: "google",
  },
  {
    text: "Streichen Sie jeden Satz, den Ihr Mitbewerber genauso schreiben könnte.",
    thema: "texte",
  },
  {
    text: "Der Daumen ist ungeduldig.",
    zusatz: "Große Knöpfe, kurze Wege.",
    thema: "handy",
  },
  {
    text: "Zeigen Sie Ihre Arbeit.",
    zusatz: "Vorher, nachher, fertig.",
    thema: "vertrauen",
  },
  {
    text: "Was oben steht, wird gesehen.",
    zusatz: "Was unten steht, wird gesucht.",
    thema: "eindruck",
  },
  {
    text: "Einmal richtig gebaut hält länger als dreimal schnell geflickt.",
    thema: "pflege",
  },
  {
    text: "Gute Websites drängeln nicht. Sie laden ein.",
    thema: "anfrage",
  },
  {
    text: "Auch ein kleiner Betrieb darf groß auftreten.",
    zusatz: "Nur nicht laut.",
    thema: "eindruck",
  },
  {
    text: "Eine Website ersetzt kein gutes Handwerk.",
    zusatz: "Sie sorgt dafür, dass man davon erfährt.",
    thema: "vertrauen",
  },
  {
    text: "Im Hafen gilt: erst festmachen, dann laden.",
    zusatz: "Bei der Website: erst die Inhalte, dann die Gestaltung.",
    thema: "texte",
  },
  {
    text: "Gestaltung ist, wenn man nichts suchen muss.",
    thema: "eindruck",
  },
  {
    text: "Ihre Seite muss nicht alles können.",
    zusatz: "Sie muss das Richtige können.",
    thema: "eindruck",
  },
  {
    text: "Die eigene Domain ist die Adresse. Die Website ist das Haus.",
    thema: "vertrauen",
  },
];

const TAG_MS = 24 * 60 * 60 * 1000;
/** Tag 0 der Zählung. Davor und danach läuft die Liste im Kreis. */
const START = Date.UTC(2026, 10, 1);

const BERLIN_ISO = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Berlin",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});
const BERLIN_LANG = new Intl.DateTimeFormat("de-DE", {
  timeZone: "UTC",
  weekday: "short",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

/** Kalendertag in Hamburg als yyyy-mm-dd. */
export function tagInHamburg(jetzt: Date): string {
  return BERLIN_ISO.format(jetzt);
}

function tagNummer(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return Math.round((Date.UTC(y, m - 1, d) - START) / TAG_MS);
}

/** Der Spruch für einen Kalendertag (yyyy-mm-dd). Gleicher Tag, gleicher Spruch. */
export function spruchFuer(iso: string): Spruch {
  const n = SPRUECHE.length;
  return SPRUECHE[((tagNummer(iso) % n) + n) % n];
}

export type SpruchTag = Spruch & {
  /** yyyy-mm-dd */
  datum: string;
  /** „Sa., 14.11.2026“ */
  datumText: string;
  /** Tag im Monat, für die große Ziffer im Hintergrund */
  tagImMonat: string;
};

/** Heute und die Tage davor, heute zuerst. */
export function spruecheBis(jetzt: Date, anzahl = 7): SpruchTag[] {
  const [y, m, d] = tagInHamburg(jetzt).split("-").map(Number);
  const heute = Date.UTC(y, m - 1, d);
  return Array.from({ length: anzahl }, (_, i) => {
    const tag = new Date(heute - i * TAG_MS);
    const datum = tag.toISOString().slice(0, 10);
    return {
      ...spruchFuer(datum),
      datum,
      datumText: BERLIN_LANG.format(tag),
      tagImMonat: String(tag.getUTCDate()),
    };
  });
}
