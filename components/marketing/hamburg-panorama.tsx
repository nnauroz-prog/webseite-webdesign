import Image from "next/image";

import { HamburgSkyline } from "@/components/marketing/hamburg-skyline";

/**
 * Hamburg-Panorama als Linienzeichnung über die volle Breite (Startseite,
 * oben im dunklen Abschnitt der Ladeliste). Ränder laufen weich in den
 * Hintergrund aus.
 *
 * Solange kein eigenes Panorama-Bild hinterlegt ist, steht hier die
 * gezeichnete Silhouette. Für ein Bild: Datei nach
 * public/images/hamburg-panorama.webp legen (breit, ca. 2400×900) und
 * PANORAMA_IMAGE unten setzen. Nur Bilder mit eigenen Rechten —
 * keine Übernahmen von anderen Websites.
 */
const PANORAMA_IMAGE: { src: string; alt: string } | null = null;

/* Ränder laufen weich aus: am Handy 6 %, sonst 12 % je Seite. */
const FADE =
  "[mask-image:linear-gradient(to_right,transparent,#000_6%,#000_94%,transparent),linear-gradient(to_bottom,#000_70%,transparent)] sm:[mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent),linear-gradient(to_bottom,#000_70%,transparent)] [mask-composite:intersect]";

export function HamburgPanorama({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <div className="relative overflow-hidden">
      {PANORAMA_IMAGE ? (
        <div className={`relative mx-auto aspect-[8/3] w-full max-w-[1600px] ${FADE}`}>
          <Image
            src={PANORAMA_IMAGE.src}
            alt={PANORAMA_IMAGE.alt}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ) : (
        <div className={`mx-auto w-full max-w-[1600px] px-0 sm:px-6 sm:pt-4 ${FADE}`}>
          {/* Am Handy ein Ausschnitt statt der Totale: Landungsbrücken,
              Michel, Fernsehturm und Elbphilharmonie groß, Mitte bei 58 %
              der Zeichnung, unten bündig. hh-tiefe schiebt das Bild beim
              Scrollen leise nach (app/globals.css). */}
          <div className="relative h-[176px] overflow-hidden sm:h-auto sm:overflow-visible">
            <div className="hh-tiefe absolute inset-0 sm:static">
              {/* Auf dunklem Grund gehen nach dem Zeichnen die Lichter an. */}
              <HamburgSkyline
                lights={tone === "dark"}
                className={`absolute bottom-0 left-1/2 block h-[220px] w-[1100px] max-w-none -translate-x-[58%] sm:static sm:h-auto sm:w-full sm:translate-x-0 sm:aspect-[1600/320] ${tone === "dark" ? "text-gold" : "text-foreground/75"}`}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
