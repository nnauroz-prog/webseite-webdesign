/**
 * Live-Pegel der Elbe am Pegel St. Pauli (PEGELONLINE, Wasserstraßen- und
 * Schifffahrtsverwaltung des Bundes). Öffentlich, ohne Schlüssel.
 *
 * Nur auf dem Server aufrufen. Der Wert wird zehn Minuten gecacht; fällt
 * der Dienst aus oder liefert er Unplausibles, kommt `null` zurück und die
 * Bildunterschrift bleibt wie bisher.
 *
 * Zum Testen in der Entwicklung: PEGEL_MOCK="584,1" (Wert in cm, Trend)
 * oder PEGEL_MOCK="aus" für den Fall ohne Wert. In Produktion wird die
 * Variable nicht ausgewertet.
 */

const URL_ST_PAULI =
  "https://www.pegelonline.wsv.de/webservices/rest-api/v2/stations/ST.%20PAULI/W/currentmeasurement.json";

/** Mittlerer Wasserstand bei St. Pauli grob zwischen Niedrig- und Hochwasser (cm über Pegelnull). */
const MITTEL_CM = 500;
const MAX_ALTER_MS = 6 * 60 * 60 * 1000;

export type Pegel = {
  /** Wasserstand in cm über Pegelnull. */
  cm: number;
  /** 1 steigend (Flut), -1 fallend (Ebbe), 0 Stillwasser, null unbekannt. */
  trend: 1 | 0 | -1 | null;
  /** Zeitpunkt der Messung (ISO). */
  zeit: string;
};

function pruefen(roh: unknown, jetzt: number): Pegel | null {
  if (!roh || typeof roh !== "object") return null;
  const { value, trend, timestamp } = roh as Record<string, unknown>;
  const cm = typeof value === "number" ? value : Number.NaN;
  if (!Number.isFinite(cm) || cm < 0 || cm > 1300) return null;
  const zeit = typeof timestamp === "string" ? Date.parse(timestamp) : Number.NaN;
  if (!Number.isFinite(zeit) || jetzt - zeit > MAX_ALTER_MS || zeit - jetzt > 10 * 60 * 1000) return null;
  const tr = trend === 1 || trend === 0 || trend === -1 ? trend : null;
  return { cm, trend: tr, zeit: new Date(zeit).toISOString() };
}

function attrappe(): Pegel | null | undefined {
  if (process.env.NODE_ENV !== "development") return undefined;
  const mock = process.env.PEGEL_MOCK?.trim();
  if (!mock) return undefined;
  if (mock === "aus") return null;
  const [w, t] = mock.split(",").map((s) => Number(s.trim()));
  return pruefen({ value: w, trend: Number.isFinite(t) ? t : null, timestamp: new Date().toISOString() }, Date.now());
}

export async function pegelStPauli(): Promise<Pegel | null> {
  const test = attrappe();
  if (test !== undefined) return test;
  try {
    const res = await fetch(URL_ST_PAULI, {
      next: { revalidate: 600 },
      signal: AbortSignal.timeout(3000),
      headers: { accept: "application/json" },
    });
    if (!res.ok) return null;
    return pruefen(await res.json(), Date.now());
  } catch {
    return null;
  }
}

/** „5,84 m · Flut“ */
export function pegelText(p: Pegel) {
  const m = (p.cm / 100).toFixed(2).replace(".", ",");
  const tide = p.trend === 1 ? "Flut" : p.trend === -1 ? "Ebbe" : p.trend === 0 ? "Stillwasser" : null;
  return tide ? `${m} m · ${tide}` : `${m} m`;
}

const UHRZEIT = new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin", hour: "2-digit", minute: "2-digit" });

/** Uhrzeit der Messung in Hamburg, „14:20“. Nur auf dem Server aufrufen. */
export function pegelStand(p: Pegel) {
  return UHRZEIT.format(new Date(p.zeit));
}

/**
 * Hub der Wasserlinie in Zeichnungseinheiten: höheres Wasser hebt Elbe und
 * Schiff um höchstens 5 Einheiten, niedriges senkt sie. Kai und Kran bleiben.
 */
export function pegelHub(p: Pegel | null) {
  if (!p) return 0;
  const h = (p.cm - MITTEL_CM) / 50;
  return Math.round(Math.max(-5, Math.min(5, h)) * 2) / 2;
}
