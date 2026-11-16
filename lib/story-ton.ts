/**
 * Ton zum Film eines Posts (lib/story-bild.ts): wenige leise Geräusche,
 * die zu dem passen, was im Bild geschieht. Alles wird gerechnet, es
 * gibt keine Aufnahmen und keine Dateien:
 *
 * - ein kaum hörbarer Grund wie ruhiges Wasser,
 * - das Geräusch zum Auftritt der Pointe: dumpfes Aufsetzen (Kran),
 *   Anflug und Schlag (Presse), zwei Klacks (Klapptafel), Abreißen
 *   (Klebeband), Stiftstrich (Marker),
 * - bei Mythos die Striche durch den Irrtum und das Blatt, das sich
 *   heraufschiebt,
 * - ein kurzes, fernes Schiffshorn, wenn das Schiff anlegt.
 *
 * Reines Rechnen ohne Browser: läuft auch in den Tests. Das Story-Studio
 * (/admin/story) spielt den Ton zur Vorschau ab und schreibt ihn auf
 * Wunsch ins Video (lib/story-video.ts). Auf der Website gibt es keinen
 * Ton.
 */
import type { Auftritt } from "@/lib/story-variante";

/** Was der Ton über einen Film wissen muss. */
export type FilmTon = {
  auftritt: Auftritt;
  /** Gewicht der Pointe (0,35 bis 1; 0 = keine Pointe auf Farbstreifen) */
  masse: number;
  /** Zahl der Farbstreifen der Pointe */
  streifen: number;
  /** Sekunde, in der die Pointe da ist */
  schlag: number;
  /** Sekunde, in der das Schiff anlegt */
  anlegen: number;
  /** Fährt ein Schiff ein? (Leuchtturm und Kran stehen: kein Horn) */
  schiff: boolean;
  /** Sekunde eines Aufdrucks am Anfang (Stempel, Lesezeichen), sonst null */
  druck: number | null;
  /** Mythos: Sekunden, in denen ein Strich durch eine Zeile zieht */
  striche: number[];
  /** Mythos: Ein Blatt schiebt sich herauf und setzt bei schlag auf. */
  blatt: boolean;
  /** Startwert für das Rauschen (gleicher Wert, gleicher Ton) */
  saat: number;
};

/** Abtastrate des Tons. */
export const TON_RATE = 48000;

/** Gleichmäßiges Rauschen zwischen -1 und 1, aus einem Startwert. */
function rauschen(saat: number) {
  let v = (Math.abs(Math.floor(saat)) % 2147483646) + 1;
  return () => {
    v = (v * 16807) % 2147483647;
    return (v / 2147483647) * 2 - 1;
  };
}

type FilterArt = "tief" | "hoch" | "band";
/** Filter zweiter Ordnung; Frequenz und Güte lassen sich im Lauf ändern. */
function filter(art: FilterArt, f: number, q: number) {
  let [b0, b1, b2, a1, a2] = [0, 0, 0, 0, 0];
  let [x1, x2, y1, y2] = [0, 0, 0, 0];
  const setze = (frequenz: number, guete = q) => {
    const w = (2 * Math.PI * Math.min(frequenz, TON_RATE * 0.45)) / TON_RATE;
    const [c, alpha] = [Math.cos(w), Math.sin(w) / (2 * guete)];
    const a0 = 1 + alpha;
    if (art === "tief") [b0, b1, b2] = [(1 - c) / 2, 1 - c, (1 - c) / 2];
    else if (art === "hoch")
      [b0, b1, b2] = [(1 + c) / 2, -(1 + c), (1 + c) / 2];
    else [b0, b1, b2] = [alpha, 0, -alpha];
    [b0, b1, b2, a1, a2] = [
      b0 / a0,
      b1 / a0,
      b2 / a0,
      (-2 * c) / a0,
      (1 - alpha) / a0,
    ];
  };
  setze(f);
  return {
    setze,
    schritt: (x: number) => {
      const y = b0 * x + b1 * x1 + b2 * x2 - a1 * y1 - a2 * y2;
      [x2, x1, y2, y1] = [x1, x, y1, y];
      return y;
    },
  };
}

/**
 * Schreibt ein Geräusch in den Ton: probe(s, u) liefert den Wert zur
 * Sekunde s seit Beginn (u = Anteil der Dauer, 0 bis 1).
 */
function mische(
  ton: Float32Array,
  ab: number,
  dauer: number,
  probe: (s: number, u: number) => number,
) {
  const start = Math.round(ab * TON_RATE);
  const n = Math.round(dauer * TON_RATE);
  for (let i = 0; i < n; i++) {
    const j = start + i;
    if (j < 0) continue;
    if (j >= ton.length) break;
    ton[j] += probe(i / TON_RATE, i / n);
  }
}

/**
 * Dumpfer Schlag: ein Ton, der schnell tiefer wird und ausklingt, dazu
 * ein kurzer Körper aus tiefem Rauschen. Die Obertöne sorgen dafür, dass
 * er auch auf dem kleinen Lautsprecher eines Handys zu hören ist.
 */
function dumpf(
  ton: Float32Array,
  ab: number,
  a: {
    von: number;
    bis: number;
    dauer: number;
    pegel: number;
    anschlag: number;
    saat: number;
  },
) {
  const r = rauschen(a.saat);
  const tief = filter("tief", 520, 0.8);
  let phase = 0;
  mische(ton, ab, a.dauer, (s) => {
    const f = a.bis + (a.von - a.bis) * Math.exp(-s / 0.035);
    phase += (2 * Math.PI * f) / TON_RATE;
    const huelle = Math.min(1, s / a.anschlag) * Math.exp(-s / (a.dauer / 4.5));
    const koerper = tief.schritt(r()) * Math.exp(-s / 0.045) * 0.9;
    return (
      a.pegel *
      (huelle *
        (Math.sin(phase) +
          0.45 * Math.sin(2 * phase) +
          0.2 * Math.sin(3 * phase)) +
        koerper * Math.min(1, s / a.anschlag))
    );
  });
}

/** Kurzer Klack: helles Rauschen mit hartem Einsatz, darunter ein „Tok“. */
function klack(ton: Float32Array, ab: number, pegel: number, saat: number) {
  const r = rauschen(saat);
  const band = filter("band", 2400, 1.4);
  mische(ton, ab, 0.12, (s) => {
    const hell = band.schritt(r()) * Math.exp(-s / 0.016) * 2.2;
    const tok = Math.sin(2 * Math.PI * 310 * s) * Math.exp(-s / 0.03) * 0.5;
    return pegel * Math.min(1, s / 0.001) * (hell + tok);
  });
}

/**
 * Abreißen eines Klebebands: Rauschen, das heller und lauter wird und
 * dabei knistert; am Ende ein kleiner Klack, wenn das Band ab ist.
 */
function reissen(
  ton: Float32Array,
  ab: number,
  dauer: number,
  pegel: number,
  saat: number,
) {
  const r = rauschen(saat);
  const band = filter("band", 900, 2.2);
  let knister = 1;
  let zaehler = 0;
  mische(ton, ab, dauer, (s, u) => {
    band.setze(900 * (3800 / 900) ** u);
    // Alle zweieinhalb Millisekunden eine neue Stärke: Das knistert.
    if (zaehler-- <= 0) {
      zaehler = Math.round(TON_RATE * 0.0025);
      knister = 0.35 + 0.65 * Math.abs(r());
    }
    const huelle = u ** 1.4 * Math.min(1, (1 - u) / 0.04);
    return pegel * 3 * band.schritt(r()) * huelle * knister;
  });
  klack(ton, ab + dauer - 0.01, pegel * 0.7, saat + 5);
}

/** Strich mit dem Filzstift: ein weiches, helles Wischen mit leichtem Zittern. */
function strich(
  ton: Float32Array,
  ab: number,
  dauer: number,
  pegel: number,
  saat: number,
) {
  const r = rauschen(saat);
  const band = filter("band", 2800, 0.9);
  const hoch = filter("hoch", 1200, 0.7);
  mische(ton, ab, dauer, (s, u) => {
    const huelle = Math.sin(Math.PI * u) ** 0.6;
    const zittern = 1 + 0.22 * Math.sin(2 * Math.PI * 38 * s);
    return pegel * 2.4 * hoch.schritt(band.schritt(r())) * huelle * zittern;
  });
}

/** Anflug: tiefes Rauschen, das anschwillt und heller wird, dann abbricht. */
function anflug(
  ton: Float32Array,
  ab: number,
  dauer: number,
  pegel: number,
  saat: number,
) {
  const r = rauschen(saat);
  const tief = filter("tief", 250, 0.9);
  mische(ton, ab, dauer, (_s, u) => {
    tief.setze(250 * (1400 / 250) ** u);
    const huelle = u * u * Math.min(1, (1 - u) / 0.06);
    return pegel * 2.5 * tief.schritt(r()) * huelle;
  });
}

/**
 * Schiffshorn in der Ferne: zwei tiefe Stimmen (eine große Terz
 * auseinander) mit Obertönen, weich im Einsatz, mit Nachhall.
 */
function horn(ton: Float32Array, ab: number, dauer: number, pegel: number) {
  const stimmen: [number, number[]][] = [
    [123.5, [0.5, 1, 0.7, 0.45, 0.3, 0.2, 0.08, 0.1]],
    [123.9, [0.2, 0.35, 0.25, 0.15]],
    [155.6, [0.3, 0.5, 0.3, 0.15]],
  ];
  const tief = filter("tief", 1100, 0.7);
  const roh = new Float32Array(Math.round((dauer + 1.4) * TON_RATE));
  mische(roh, 0, dauer + 0.5, (s) => {
    const huelle =
      s < dauer ? Math.min(1, s / 0.14) ** 1.5 : Math.exp(-(s - dauer) / 0.11);
    let wert = 0;
    for (const [f, teile] of stimmen)
      teile.forEach((staerke, i) => {
        wert += staerke * Math.sin(2 * Math.PI * f * (i + 1) * s);
      });
    return tief.schritt(wert) * huelle * 0.2;
  });
  // Nachhall wie über dem Wasser: vier Verzögerungen mit Rückführung.
  const hall = new Float32Array(roh.length);
  for (const [zeit, rueck] of [
    [0.0297, 0.78],
    [0.0371, 0.76],
    [0.0411, 0.74],
    [0.0437, 0.72],
  ]) {
    const d = Math.round(zeit * TON_RATE);
    const linie = new Float32Array(roh.length);
    for (let i = 0; i < roh.length; i++) {
      linie[i] = roh[i] + (i >= d ? linie[i - d] * rueck : 0);
      hall[i] += linie[i] * 0.25;
    }
  }
  mische(ton, ab, roh.length / TON_RATE, (s) => {
    const i = Math.round(s * TON_RATE);
    return pegel * (roh[i] * 0.75 + hall[i] * 0.3);
  });
}

/**
 * Rechnet den Ton eines Films: eine Spur, dauer Sekunden lang, Werte
 * zwischen -1 und 1 (höchstens 0,8).
 */
export function filmTon(
  info: FilmTon,
  dauer: number,
): Float32Array<ArrayBuffer> {
  const ton = new Float32Array(Math.round(dauer * TON_RATE));
  const { schlag, masse, saat } = info;

  // Grund: sehr leises, gedämpftes Rauschen, das langsam an- und
  // abschwillt wie ruhiges Wasser.
  const r = rauschen(saat + 1);
  const wasser = filter("tief", 1100, 0.7);
  const ohneTiefen = filter("hoch", 260, 0.7);
  mische(ton, 0, dauer, (s) => {
    const schwall =
      0.55 +
      0.3 * Math.sin(2 * Math.PI * 0.23 * s + 1) +
      0.15 * Math.sin(2 * Math.PI * 0.41 * s);
    return 0.07 * ohneTiefen.schritt(wasser.schritt(r())) * schwall;
  });

  // Aufdruck am Anfang (Stempel, Lesezeichen).
  if (info.druck !== null)
    dumpf(ton, info.druck, {
      von: 170,
      bis: 95,
      dauer: 0.2,
      pegel: 0.12,
      anschlag: 0.004,
      saat: saat + 2,
    });

  if (info.blatt) {
    // Mythos: die Striche, dann das Blatt.
    info.striche.forEach((zeit, i) =>
      strich(ton, zeit, 0.17, 0.05, saat + 10 + i),
    );
    anflug(ton, schlag - 0.9, 0.84, 0.03, saat + 3);
    dumpf(ton, schlag, {
      von: 160,
      bis: 80,
      dauer: 0.3,
      pegel: 0.16,
      anschlag: 0.01,
      saat: saat + 4,
    });
  } else if (masse > 0) {
    // Jeder Streifen nach dem ersten kommt fünf Bilder später.
    const enden = Array.from(
      { length: Math.max(1, Math.min(4, info.streifen)) },
      (_, nr) => schlag + (nr * 5) / 30,
    );
    if (info.auftritt === "kran")
      dumpf(ton, schlag, {
        von: 170,
        bis: 85,
        dauer: 0.3,
        pegel: 0.16 + 0.08 * masse,
        anschlag: 0.014,
        saat: saat + 4,
      });
    else if (info.auftritt === "presse") {
      anflug(ton, schlag - 0.75, 0.69, 0.035, saat + 3);
      dumpf(ton, schlag, {
        von: 150,
        bis: 62,
        dauer: 0.42,
        pegel: 0.2 + 0.08 * masse,
        anschlag: 0.003,
        saat: saat + 4,
      });
      klack(ton, schlag, 0.05, saat + 6);
    } else if (info.auftritt === "klappe")
      enden.forEach((ende, nr) => {
        klack(ton, ende - 7 / 30, 0.16, saat + 20 + nr);
        klack(ton, ende, 0.24, saat + 30 + nr);
      });
    else if (info.auftritt === "abziehen")
      enden.forEach((ende, nr) =>
        reissen(ton, ende - 0.6, 0.6, 0.15, saat + 40 + nr),
      );
    else
      enden.forEach((ende, nr) =>
        strich(ton, ende - 0.45, 0.45, 0.06, saat + 50 + nr),
      );
  }

  // Das Schiff legt an: ein kurzes Horn aus der Ferne.
  if (info.schiff) horn(ton, info.anlegen - 0.4, 0.7, 0.2);

  // Insgesamt etwas anheben, weich ein- und ausblenden, nie übersteuern.
  const [ein, aus] = [0.03 * TON_RATE, 0.3 * TON_RATE];
  let spitze = 0;
  for (let i = 0; i < ton.length; i++) {
    ton[i] *= 1.6 * Math.min(1, i / ein, (ton.length - 1 - i) / aus);
    spitze = Math.max(spitze, Math.abs(ton[i]));
  }
  if (spitze > 0.8) for (let i = 0; i < ton.length; i++) ton[i] *= 0.8 / spitze;
  return ton;
}
