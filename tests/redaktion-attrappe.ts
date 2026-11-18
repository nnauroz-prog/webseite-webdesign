/**
 * Attrappen für die Tests der Redaktion (tests/redaktion*.test.ts): ein
 * Modell, das vorbereitete Antworten gibt und jede Anfrage mitschreibt,
 * dazu eine gültige und eine ungültige Serie.
 */
import type { RedaktionKontext } from "@/lib/redaktion/kontext";
import type { Idee, SerienEntwurf } from "@/lib/redaktion/lesen";
import type {
  ModellAnfrage,
  ModellAntwort,
  RedaktionModell,
} from "@/lib/redaktion/modell";
import type { RedaktionEreignis } from "@/lib/redaktion/vertrag";
import type { StorySerie } from "@/lib/story-serie";

import { baueKontext } from "@/lib/redaktion/kontext";

/** Hält alle Regeln ein (prüft tests/redaktion-ablauf.test.ts). */
export const GUTE_SERIE: StorySerie = {
  titel: "Black Friday",
  folien: [
    {
      rolle: "aufhaenger",
      kicker: "Hot Take",
      text: "Der beste Rabatt nützt nichts, wenn niemand den Laden findet.",
      betont: "niemand den Laden findet",
      zusatz: "Gesucht wird am Handy, entschieden in Sekunden.",
      thema: "google",
    },
    {
      rolle: "problem",
      kicker: "Red Flag",
      text: "Die Aktion hängt im Schaufenster, die Website schweigt.",
      betont: "die Website schweigt",
      zusatz: "Wer vorher online schaut, erfährt von nichts.",
      thema: "pflege",
    },
    {
      rolle: "loesung",
      kicker: "Green Flag",
      text: "Ein Satz auf der Startseite sagt, was diese Woche gilt.",
      betont: "was diese Woche gilt",
      zusatz: "Dazu Öffnungszeiten und der Weg. Mehr braucht es nicht.",
      thema: "eindruck",
    },
    {
      rolle: "einladung",
      kicker: "Kurz gesagt",
      text: "Erzählen Sie kurz, was Ihre Website können soll.",
      betont: "können soll",
      zusatz: "Wir melden uns und sagen ehrlich, was sinnvoll ist.",
      thema: "anfrage",
    },
  ],
};

/** Eine zweite gültige Serie mit ganz anderen Sätzen. */
export const ANDERE_SERIE: StorySerie = {
  titel: "Offen oder zu",
  folien: [
    {
      rolle: "aufhaenger",
      kicker: "POV",
      text: "Feiertag, Hunger, Handy raus. Hat das Café heute auf?",
      betont: "heute auf",
      zusatz: "Die Antwort entscheidet, wohin der Spaziergang führt.",
      thema: "handy",
    },
    {
      rolle: "problem",
      kicker: "Mal ehrlich",
      text: "Im Netz stehen noch die Zeiten vom vorigen Sommer.",
      betont: "vom vorigen Sommer",
      zusatz: "Vor verschlossener Tür kommt niemand ein zweites Mal.",
      thema: "vertrauen",
    },
    {
      rolle: "loesung",
      kicker: "Merken",
      text: "Feiertage gehören vorab auf die erste Seite.",
      betont: "auf die erste Seite",
      zusatz: "Eine Zeile genügt: geöffnet oder geschlossen.",
      thema: "pflege",
    },
    {
      rolle: "einladung",
      kicker: "Reminder",
      text: "Schreiben Sie uns, wo es bei Ihrer Seite hakt.",
      betont: "hakt",
      zusatz: "Eine kurze Nachricht reicht. Den Rest klären wir im Gespräch.",
      thema: "anfrage",
    },
  ],
};

/**
 * Verletzt harte Regeln: Bild 1 ist zu lang und nennt eine Zahl, die
 * Pointe von Bild 2 steht nicht im Satz, Bild 4 duzt.
 */
export const SCHLECHTE_SERIE: SerienEntwurf = {
  titel: "Black Friday",
  folien: [
    {
      ...GUTE_SERIE.folien[0],
      text: "Der beste Rabatt von 50 Prozent nützt überhaupt nichts, wenn niemand den Laden im Netz findet.",
      betont: "im Netz findet",
    },
    { ...GUTE_SERIE.folien[1], betont: "die Seite schweigt" },
    GUTE_SERIE.folien[2],
    {
      ...GUTE_SERIE.folien[3],
      text: "Erzähl kurz, was deine Website können soll.",
    },
  ],
};

export const IDEE: Idee = {
  titel: "Black Friday",
  winkel: "Der Rabatt ist nicht das Problem, sondern dass niemand davon weiß.",
  szene: "Jemand sucht am Handy nach dem Laden und findet nichts zur Aktion.",
  bogen: [
    {
      rolle: "aufhaenger",
      inhalt: "Rabatt ohne Auffindbarkeit bringt nichts.",
    },
    { rolle: "problem", inhalt: "Die Aktion steht nur im Schaufenster." },
    { rolle: "loesung", inhalt: "Ein Satz auf der Startseite genügt." },
    { rolle: "einladung", inhalt: "Kurz anfragen, wir melden uns." },
  ],
};

/** Antwort des Modells mit JSON-Inhalt. */
export function antwort(wert: unknown, stopp = "end_turn"): ModellAntwort {
  return { text: JSON.stringify(wert), stopp };
}

export type Schritt =
  | ModellAntwort
  | Error
  | ((anfrage: ModellAnfrage) => ModellAntwort | Promise<ModellAntwort>);

/**
 * Modell-Attrappe: gibt die vorbereiteten Schritte der Reihe nach zurück
 * (Fehler werden geworfen) und schreibt jede Anfrage mit.
 */
export function attrappe(schritte: Schritt[]): RedaktionModell & {
  anfragen: ModellAnfrage[];
} {
  const anfragen: ModellAnfrage[] = [];
  let i = 0;
  return {
    anfragen,
    async frage(anfrage) {
      anfragen.push(anfrage);
      const schritt = schritte[i++];
      if (schritt === undefined)
        throw new Error(`Attrappe: keine Antwort für Aufruf ${i}`);
      if (schritt instanceof Error) throw schritt;
      return typeof schritt === "function" ? schritt(anfrage) : schritt;
    },
  };
}

/** Sammelt die Zeilen, die die Redaktion ans Studio schickt. */
export function sammler(): {
  ereignisse: RedaktionEreignis[];
  sende: (e: RedaktionEreignis) => void;
  /** „idee:laeuft“, „idee:fertig“ …, zuletzt „serie“ oder „fehler:<code>“. */
  folge: () => string[];
} {
  const ereignisse: RedaktionEreignis[] = [];
  return {
    ereignisse,
    sende: (e) => {
      ereignisse.push(e);
    },
    folge: () =>
      ereignisse.map((e) =>
        e.typ === "schritt"
          ? `${e.schritt}:${e.stand}`
          : e.typ === "fehler"
            ? `fehler:${e.code}`
            : "serie",
      ),
  };
}

/** Unterlagen für den Black Friday 2026, ohne Karten aus dem Code. */
export function testKontext(
  quellen: Partial<Parameters<typeof baueKontext>[2]> = {},
  datum = "2026-11-27",
): RedaktionKontext {
  return baueKontext(datum, new Date("2026-11-17T09:00:00Z"), {
    karten: {},
    serienAktuell: {},
    gespeichert: [],
    vorrat: [],
    ...quellen,
  });
}
