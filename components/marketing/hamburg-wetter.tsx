import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Cloudy,
  Sun,
} from "lucide-react";

import { getHamburgWeather, type WeatherConditionKey } from "@/lib/hamburg-weather";

/**
 * Hamburg-Wetter — kleine Live-Karte mit dem aktuellen Wetter am
 * Rathausmarkt. Server-Komponente; die Daten werden 1 Stunde
 * gecacht (siehe lib/hamburg-weather.ts).
 *
 * Beweis-Geste statt rhetorischer Locality: „aus Hamburg" wird
 * verifizierbar, weil die Karte zeigt, was draußen jetzt los ist.
 *
 * Bei Netzwerk-/Fetch-Fehlern (oder ohne Connectivity beim Build)
 * rendert die Karte ohne Wetterdaten — Hamburg-Identität bleibt
 * sichtbar als ruhige Brand-Geste, kein Fehler-Theater.
 */

const ICONS: Record<
  WeatherConditionKey,
  React.ComponentType<{ className?: string }>
> = {
  klar: Sun,
  "leicht-bewoelkt": Cloud,
  bewoelkt: Cloudy,
  nebel: CloudFog,
  nieselregen: CloudDrizzle,
  regen: CloudRain,
  schnee: CloudSnow,
  gewitter: CloudLightning,
};

export async function HamburgWetter() {
  const weather = await getHamburgWeather();

  return (
    <div className="border-border/60 bg-card/40 ring-foreground/5 relative overflow-hidden rounded-2xl border p-5 ring-1">
      <div
        aria-hidden="true"
        className="bg-gold/8 pointer-events-none absolute -top-12 -right-8 h-32 w-32 rounded-full blur-[40px]"
      />
      <div className="relative flex items-center justify-between gap-3">
        <p className="text-muted-foreground inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em]">
          <span
            aria-hidden="true"
            className="bg-gold gold-pulse inline-block h-1.5 w-1.5 rounded-full"
          />
          Hamburg, jetzt
        </p>
        <p className="text-muted-foreground/70 font-mono text-[10px] uppercase tracking-[0.22em]">
          53.55° N
        </p>
      </div>

      {weather ? (
        <WeatherBody weather={weather} />
      ) : (
        <FallbackBody />
      )}
    </div>
  );
}

function WeatherBody({
  weather,
}: {
  weather: NonNullable<Awaited<ReturnType<typeof getHamburgWeather>>>;
}) {
  const Icon = ICONS[weather.conditionKey];
  return (
    <div className="relative mt-5 flex items-end justify-between gap-4">
      <div>
        <p className="serif text-foreground text-5xl font-normal leading-none tracking-[-0.03em] sm:text-6xl">
          {weather.temperatureC}°
        </p>
        <p className="text-foreground/85 mt-3 text-[14px] leading-snug">
          {weather.conditionLabel}
        </p>
        <p className="text-muted-foreground mt-1 text-[12px] leading-snug">
          Wind {weather.windKmh} km/h
        </p>
      </div>
      <span className="text-gold/80 border-gold/20 inline-flex h-14 w-14 items-center justify-center rounded-full border">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
    </div>
  );
}

function FallbackBody() {
  return (
    <div className="relative mt-5">
      <p className="serif text-foreground/85 text-2xl font-normal leading-snug tracking-[-0.015em]">
        Hamburg,{" "}
        <span className="serif-italic text-muted-foreground">
          die Stadt am Wasser.
        </span>
      </p>
      <p className="text-muted-foreground mt-3 text-[13.5px] leading-relaxed">
        Wetterdaten sind gerade nicht erreichbar — wir sitzen
        trotzdem hier am Rathausmarkt.
      </p>
    </div>
  );
}
