/**
 * Sprechstunde-Datums-Logik.
 *
 * Konzept: jeden ersten Donnerstag im Monat von 17:00 bis 18:30
 * Uhr (Europe/Berlin) sind wir per Telefon erreichbar — auch für
 * Leute, die nie Kunde werden. Die Datums-Berechnung läuft
 * server-seitig zur Build-Zeit (force-static), liefert daher die
 * nächste Sprechstunde stabil pro Build.
 *
 * Hinweis: zur Sicherheit gegen vergangene Termine wird gegen
 * Europe/Berlin-„heute" verglichen — wenn am ersten Donnerstag
 * morgens jemand die Seite öffnet, soll sie noch der heutige
 * Tag sein, nicht der nächste Monat.
 */

export const SPRECHSTUNDE_BEGINN_HHMM = "17:00";
export const SPRECHSTUNDE_ENDE_HHMM = "18:30";
export const SPRECHSTUNDE_RUFNUMMER = "0152 24437370";

export type SprechstundeTermin = {
  /** ISO-Datum yyyy-mm-dd. */
  iso: string;
  /** Beispiel: „Donnerstag, 5. Juni 2026". */
  longLabel: string;
  /** Beispiel: „Do · 5. Juni". */
  shortLabel: string;
};

/** Liefert die nächsten drei Sprechstunden-Termine ab heute. */
export function nextSprechstunden(count = 3): SprechstundeTermin[] {
  const today = berlinToday();
  const out: SprechstundeTermin[] = [];
  let year = today.getFullYear();
  let month = today.getMonth();

  while (out.length < count) {
    const firstThursday = firstThursdayOf(year, month);
    if (firstThursday >= today) {
      out.push(toTermin(firstThursday));
    }
    month += 1;
    if (month > 11) {
      month = 0;
      year += 1;
    }
  }
  return out;
}

function berlinToday(): Date {
  // Tagesgrenze in Europe/Berlin — wir konstruieren explizit aus
  // Y/M/D-Komponenten, damit kein UTC-Drift bei der Sommerzeit
  // entsteht.
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const y = parseInt(parts.find((p) => p.type === "year")!.value, 10);
  const m = parseInt(parts.find((p) => p.type === "month")!.value, 10);
  const d = parseInt(parts.find((p) => p.type === "day")!.value, 10);
  return new Date(y, m - 1, d);
}

function firstThursdayOf(year: number, monthIdx: number): Date {
  const first = new Date(year, monthIdx, 1);
  const offset = (4 - first.getDay() + 7) % 7; // 4 = Donnerstag
  return new Date(year, monthIdx, 1 + offset);
}

function toTermin(d: Date): SprechstundeTermin {
  const iso = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const longLabel = d.toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const shortLabel = d.toLocaleDateString("de-DE", {
    weekday: "short",
    day: "numeric",
    month: "long",
  });
  return { iso, longLabel, shortLabel };
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Themen, die immer wieder kommen — wir nennen sie konkret,
 *  damit niemand denkt, „meine Frage ist zu klein". */
export const TYPISCHE_THEMEN: string[] = [
  "Mein bestehender Anbieter ist nicht mehr erreichbar. Wie komme ich an meine Inhalte?",
  "Lohnt sich ein eigenes CMS oder reicht eine handgepflegte Seite für meinen Betrieb?",
  "Mein Google-Eintrag sieht traurig aus. Was sind die ersten drei Schritte?",
  "Wie unterscheide ich ein faires Wartungs-Angebot von einem überteuerten?",
  "Mein Kontaktformular sammelt Spam. Was hilft wirklich?",
  "Brauche ich ein Cookie-Banner? Wann ja, wann nein?",
];
