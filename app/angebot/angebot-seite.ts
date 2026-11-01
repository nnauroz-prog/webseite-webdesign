/**
 * Kundenseite /angebot/[token]: reine Bausteine (ohne Server- oder
 * Next-Importe), damit sie unter node --test laufen.
 *
 * Alles hier ist für Kunden sichtbar und steht in Sie-Form. Einzige
 * Ausnahme sind die Vorschau-Hinweise für den eingeloggten Inhaber
 * (du-Form), die nur ihm angezeigt werden.
 */

import type {
  AngebotOeffentlich,
  AngebotPosition,
  KundenAnsicht,
  PositionArt,
} from "@/lib/admin/angebote";

import { berlinDateIso } from "@/lib/admin/berlin-time";
import {
  ANGEBOT_KONTAKT,
  formatDatumLang,
  formatZeitpunktLang,
  positionNetto,
} from "@/lib/admin/angebote";

// ---------------------------------------------------------------------
// Absender
// ---------------------------------------------------------------------

/**
 * ANGEBOT_ABSENDER_ADRESSE → Zeilen für den Briefkopf. Trennzeichen:
 * Zeilenumbruch, ein geschriebenes „\n“ (so landen Umbrüche oft in
 * Umgebungsvariablen) oder „|“. Leer oder nicht gesetzt → [] (dann
 * steht im Briefkopf nur „Hamburg“). Höchstens 4 Zeilen à 80 Zeichen.
 */
export function absenderAdresse(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split(/\r?\n|\\n|\|/)
    .map((z) =>
      z
        .replace(/[\u0000-\u001F\u007F]+/g, " ")
        .replace(/\s+/g, " ")
        .trim(),
    )
    .filter(Boolean)
    .slice(0, 4)
    .map((z) => z.slice(0, 80));
}

// ---------------------------------------------------------------------
// Positionen und Texte
// ---------------------------------------------------------------------

export type SeitenPosition = AngebotPosition & {
  /** Laufende Nummer über alle Gruppen (1, 2, 3 …). */
  nr: number;
  /** menge × preis_cent */
  netto: number;
};

export type PositionsGruppe = {
  art: PositionArt;
  titel: string;
  positionen: SeitenPosition[];
};

const GRUPPEN_TITEL: Record<PositionArt, string> = {
  einmalig: "Einmalige Leistungen",
  monatlich: "Monatliche Leistungen",
};

/**
 * Positionen für die Tabelle: erst einmalig, dann monatlich (Reihenfolge
 * innerhalb der Gruppe wie im Editor), durchnummeriert. Leere Gruppen
 * fallen weg.
 */
export function positionsGruppen(
  positionen: readonly AngebotPosition[],
): PositionsGruppe[] {
  let nr = 0;
  const out: PositionsGruppe[] = [];
  for (const art of ["einmalig", "monatlich"] as const) {
    const liste = positionen
      .filter((p) => p.art === art)
      .map((p) => ({ ...p, nr: ++nr, netto: positionNetto(p) }));
    if (liste.length)
      out.push({ art, titel: GRUPPEN_TITEL[art], positionen: liste });
  }
  return out;
}

/** Text in Absätze (Leerzeile trennt); einzelne Umbrüche bleiben im Absatz. */
export function absaetze(text: string): string[] {
  return text
    .replace(/\r\n?/g, "\n")
    .split(/\n[ \t]*\n+/)
    .map((a) => a.trim())
    .filter(Boolean);
}

/** „5 ×“ nur, wenn mehr als eins; sonst "". */
export function mengeText(menge: number): string {
  return menge > 1 ? `${menge} ×` : "";
}

// ---------------------------------------------------------------------
// Status
// ---------------------------------------------------------------------

/** Wurde das Angebot nach dem Senden noch inhaltlich geändert? */
export function aktualisiertNachSenden(
  a: Pick<AngebotOeffentlich, "sent_at" | "updated_at">,
): boolean {
  if (!a.sent_at || !a.updated_at) return false;
  // Eine Minute Spielraum: Speichern und Senden direkt hintereinander.
  return Date.parse(a.updated_at) - Date.parse(a.sent_at) > 60_000;
}

export type StatusKasten = {
  ton: "erfolg" | "hinweis" | "ende" | "vorschau";
  titel: string;
  text: string;
};

/**
 * Hinweis über bzw. unter dem Angebot je nach Stand. null bei einem
 * offenen Angebot (dann gibt es die Annahme-Formulare).
 */
export function statusKasten(
  a: Pick<
    AngebotOeffentlich,
    "gueltig_bis" | "accepted_at" | "declined_at" | "angenommen_von"
  >,
  ansicht: KundenAnsicht,
  now: Date,
): StatusKasten | null {
  switch (ansicht) {
    case "offen":
      return null;
    case "entwurf":
      return {
        ton: "vorschau",
        titel: "Entwurf, noch nicht gesendet",
        text: "So sieht der Kunde das Angebot, sobald du es gesendet hast. Ohne Anmeldung ist diese Seite bis dahin nicht erreichbar.",
      };
    case "angenommen": {
      const heute =
        a.accepted_at &&
        berlinDateIso(new Date(a.accepted_at)) === berlinDateIso(now);
      const wann = a.accepted_at
        ? ` am ${formatZeitpunktLang(a.accepted_at)}`
        : "";
      const wer = a.angenommen_von ? ` von ${a.angenommen_von}` : "";
      return {
        ton: "erfolg",
        titel: "Angebot angenommen",
        text: `Angenommen${wann}${wer}. ${
          heute
            ? "Danke für Ihren Auftrag! Wir melden uns meist noch am selben Werktag mit dem Starttermin. Für Ihre Unterlagen können Sie das Angebot oben als PDF speichern."
            : "Danke für Ihren Auftrag. Bei Fragen erreichen Sie uns unter den Kontaktdaten unten."
        }`,
      };
    }
    case "abgelehnt": {
      const wann = a.declined_at
        ? ` am ${formatDatumLang(berlinDateIso(new Date(a.declined_at)))}`
        : "";
      return {
        ton: "ende",
        titel: "Angebot abgelehnt",
        text: `Dieses Angebot wurde${wann} abgelehnt. Danke für Ihre Rückmeldung. Wenn Sie es sich anders überlegen oder Fragen haben, rufen Sie uns gern an.`,
      };
    }
    case "abgelaufen":
      return {
        ton: "hinweis",
        titel: "Dieses Angebot ist abgelaufen",
        text: `Es galt bis zum ${formatDatumLang(a.gueltig_bis)}, deshalb lässt es sich nicht mehr annehmen. Rufen Sie uns an oder schreiben Sie uns, dann schicken wir Ihnen ein aktuelles Angebot.`,
      };
    case "zurueckgezogen":
      return {
        ton: "ende",
        titel: "Dieses Angebot ist nicht mehr gültig",
        text: "Wir haben es zurückgezogen. Wenn Sie Fragen dazu haben oder ein neues Angebot möchten, rufen Sie uns an oder schreiben Sie uns.",
      };
  }
}

/** Wie lange ein abgeschlossenes Angebot online vollständig sichtbar bleibt. */
export const ONLINE_TAGE_NACH_ABSCHLUSS = 365;

/**
 * Datensparsamkeit: Ein Jahr nach Annahme, Ablehnung oder Ablauf zeigt
 * der Link nur noch die Nummer, ohne Namen, Positionen und Preise.
 * Offene Angebote und Entwürfe sind nie betroffen; zurückgezogene
 * zeigen ohnehin nur die Nummer.
 */
export function nichtMehrOnline(
  a: Pick<AngebotOeffentlich, "accepted_at" | "declined_at" | "gueltig_bis">,
  ansicht: KundenAnsicht,
  now: Date,
): boolean {
  let ende: number | null = null;
  if (ansicht === "angenommen" && a.accepted_at)
    ende = Date.parse(a.accepted_at);
  else if (ansicht === "abgelehnt" && a.declined_at)
    ende = Date.parse(a.declined_at);
  else if (ansicht === "abgelaufen")
    ende = Date.parse(`${a.gueltig_bis}T23:59:59+01:00`);
  if (ende === null || Number.isNaN(ende)) return false;
  return now.getTime() - ende > ONLINE_TAGE_NACH_ABSCHLUSS * 86_400_000;
}

export const NICHT_MEHR_ONLINE: StatusKasten = {
  ton: "ende",
  titel: "Dieses Angebot ist nicht mehr online abrufbar",
  text: "Abgeschlossene Angebote zeigen wir ein Jahr danach zum Schutz Ihrer Daten nicht mehr online. Wenn Sie eine Kopie brauchen, rufen Sie uns an oder schreiben Sie uns.",
};

/** mailto für Rückfragen zum Angebot (Betreff nur mit Nummer). */
export function rueckfrageMailHref(nummer: string): string {
  return `mailto:${ANGEBOT_KONTAKT.email}?subject=${encodeURIComponent(
    `Frage zum Angebot ${nummer}`,
  )}`;
}

// ---------------------------------------------------------------------
// Annehmen und Ablehnen (Antworten der Server Actions)
// ---------------------------------------------------------------------

export type KundenAktionFeld = "name" | "bestaetigt" | "grund";

export type KundenAktionState =
  | { status: "leer" }
  | { status: "ok" }
  | { status: "fehler"; meldung: string; feld?: KundenAktionFeld };

export const AKTION_LEER: KundenAktionState = { status: "leer" };

const ANRUFEN = `Rufen Sie uns gern an: ${ANGEBOT_KONTAKT.telefon}.`;

/** Fehlertexte der Kundenseite (Sie-Form; „admin“ in du-Form für den Inhaber). */
export const KUNDEN_MELDUNGEN = {
  name: "Bitte geben Sie Ihren Namen ein (mindestens 2 Zeichen).",
  bestaetigt:
    "Bitte setzen Sie das Häkchen, damit wir wissen, dass Sie das Angebot annehmen möchten.",
  grund:
    "Der Grund ist zu lang. Bitte fassen Sie sich kürzer (höchstens 500 Zeichen).",
  nicht_gefunden: `Dieses Angebot haben wir nicht gefunden. ${ANRUFEN}`,
  abgelaufen: `Dieses Angebot ist abgelaufen und lässt sich nicht mehr annehmen. ${ANRUFEN}`,
  gesperrt: `Dieses Angebot lässt sich nicht mehr ändern. ${ANRUFEN}`,
  geaendert:
    "Wir haben das Angebot eben noch einmal aktualisiert. Bitte sehen Sie sich den neuen Stand oben kurz an und nehmen Sie es dann erneut an.",
  technik: `Das hat gerade nicht geklappt. Bitte versuchen Sie es noch einmal. ${ANRUFEN}`,
  admin:
    "Du bist als Admin angemeldet. In der Vorschau lässt sich das Angebot nicht annehmen oder ablehnen.",
} as const;
