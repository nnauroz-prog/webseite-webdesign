import Image from "next/image";

import { HamburgSkyline } from "@/components/marketing/hamburg-skyline";

/**
 * Hamburg-Panorama unter dem Hero, über die volle Breite, Ränder laufen
 * weich in den Hintergrund aus.
 *
 * Solange kein eigenes Panorama-Bild hinterlegt ist, steht hier die
 * gezeichnete Silhouette. Für ein Bild: Datei nach
 * public/images/hamburg-panorama.webp legen (breit, ca. 2400×900) und
 * PANORAMA_IMAGE unten setzen. Nur Bilder mit eigenen Rechten —
 * keine Übernahmen von anderen Websites.
 */
const PANORAMA_IMAGE: { src: string; alt: string } | null = null;

const FADE =
  "[mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent),linear-gradient(to_bottom,#000_70%,transparent)] [mask-composite:intersect]";

export function HamburgPanorama() {
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
        <div className={`mx-auto w-full max-w-[1600px] px-0 pt-4 sm:px-6 ${FADE}`}>
          <HamburgSkyline className="text-foreground/75 block h-[150px] w-full sm:h-auto sm:aspect-[1600/320]" />
        </div>
      )}
    </div>
  );
}
