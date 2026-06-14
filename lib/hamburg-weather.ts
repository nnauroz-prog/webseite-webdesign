/**
 * Aktuelle Hamburg-Wetterdaten von der Open-Meteo-API. Kein
 * API-Key nötig (https://open-meteo.com), Daten kommen vom DWD.
 *
 * Server-seitig gecacht für 1 Stunde — der Eindruck „live" bleibt
 * bestehen, ohne dass wir bei jedem Request den Upstream stressen.
 *
 * Bei Netzwerk-/Fetch-Fehlern gibt die Funktion `null` zurück.
 * Die UI-Komponente rendert dann eine ruhige Fallback-Karte ohne
 * Wetterdaten — Hamburg-Identität bleibt sichtbar, aber kein
 * „Fehler aufgetreten"-Theater.
 */

export type HamburgWeather = {
  temperatureC: number;
  windKmh: number;
  conditionKey: WeatherConditionKey;
  conditionLabel: string;
  /** ISO-Timestamp der Messung (Europe/Berlin). */
  observedAt: string;
};

export type WeatherConditionKey =
  | "klar"
  | "leicht-bewoelkt"
  | "bewoelkt"
  | "nebel"
  | "nieselregen"
  | "regen"
  | "schnee"
  | "gewitter";

// Hamburg-Innenstadt-Koordinaten (Rathausmarkt).
const LAT = 53.5511;
const LON = 9.9937;

const ENDPOINT =
  `https://api.open-meteo.com/v1/forecast` +
  `?latitude=${LAT}&longitude=${LON}` +
  `&current=temperature_2m,weather_code,wind_speed_10m` +
  `&timezone=Europe%2FBerlin`;

export async function getHamburgWeather(): Promise<HamburgWeather | null> {
  try {
    // 5-Sekunden-Timeout — Open-Meteo antwortet normalerweise in
    // 100–300 ms. Wenn der Endpoint hängt, blockieren wir nicht den
    // ganzen Page-Render auf Vercel (das Edge-Limit liegt bei 25 s).
    const res = await fetch(ENDPOINT, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(5_000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      current?: {
        temperature_2m?: number;
        weather_code?: number;
        wind_speed_10m?: number;
        time?: string;
      };
    };
    const c = data.current;
    if (
      !c ||
      typeof c.temperature_2m !== "number" ||
      typeof c.weather_code !== "number"
    ) {
      return null;
    }
    const { key, label } = weatherCodeToCondition(c.weather_code);
    return {
      temperatureC: Math.round(c.temperature_2m),
      windKmh: Math.round(c.wind_speed_10m ?? 0),
      conditionKey: key,
      conditionLabel: label,
      observedAt: c.time ?? new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

/**
 * WMO Weather-Codes auf hanseatisch-gedimmte Beschreibungen mappen.
 * https://open-meteo.com/en/docs (Weather variable documentation).
 * Keine „leichter Regen mit Sonnenphasen"-Vollständigkeit — die
 * Kategorien sind absichtlich grob, damit das Etikett klein bleibt.
 */
function weatherCodeToCondition(code: number): {
  key: WeatherConditionKey;
  label: string;
} {
  if (code === 0) return { key: "klar", label: "Klar" };
  if (code === 1 || code === 2) return { key: "leicht-bewoelkt", label: "Leicht bewölkt" };
  if (code === 3) return { key: "bewoelkt", label: "Bewölkt" };
  if (code === 45 || code === 48) return { key: "nebel", label: "Nebel" };
  if (code >= 51 && code <= 57) return { key: "nieselregen", label: "Nieselregen" };
  if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82))
    return { key: "regen", label: "Regen" };
  if ((code >= 71 && code <= 77) || code === 85 || code === 86)
    return { key: "schnee", label: "Schnee" };
  if (code >= 95) return { key: "gewitter", label: "Gewitter" };
  return { key: "bewoelkt", label: "Bewölkt" };
}
