"use client";

import { useEffect, useState } from "react";

/**
 * Zeit-bewusste Hamburg-Begrüßung. Zeigt SSR-seitig einen neutralen
 * Platzhalter („Aus Hamburg") und schwenkt nach Mount auf die
 * passende Tageszeit:
 *
 *   05–10  Guten Morgen aus Hamburg
 *   10–12  Guten Vormittag aus Hamburg
 *   12–17  Guten Tag aus Hamburg
 *   17–22  Guten Abend aus Hamburg
 *   22–05  Spät am Schreibtisch — aus Hamburg
 *
 * Wirkt subtil aber unverkennbar lebendig — die Seite weiß, dass
 * es 11:42 ist. Keine Template-Aussage.
 */
export function HamburgGreeting({ className }: { className?: string }) {
  const [greeting, setGreeting] = useState<string>("Aus Hamburg");

  useEffect(() => {
    const update = () => {
      const hourStr = new Intl.DateTimeFormat("de-DE", {
        timeZone: "Europe/Berlin",
        hour: "2-digit",
        hour12: false,
      }).format(new Date());
      const hour = parseInt(hourStr, 10);
      if (hour >= 5 && hour < 10) setGreeting("Guten Morgen aus Hamburg");
      else if (hour >= 10 && hour < 12) setGreeting("Guten Vormittag aus Hamburg");
      else if (hour >= 12 && hour < 17) setGreeting("Guten Tag aus Hamburg");
      else if (hour >= 17 && hour < 22) setGreeting("Guten Abend aus Hamburg");
      else setGreeting("Spät am Schreibtisch — aus Hamburg");
    };
    update();
    // Alle 5 Minuten checken, falls jemand mit offenem Tab über
    // die Tageszeitgrenze rutscht.
    const id = window.setInterval(update, 5 * 60 * 1000);
    return () => window.clearInterval(id);
  }, []);

  return <span className={className}>{greeting}</span>;
}
