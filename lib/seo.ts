import type { Metadata } from "next";

/** Das Bild aus app/opengraph-image.tsx (gleiche Maße und Beschreibung). */
const DEFAULT_OG_IMAGE = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: "Sitalo Webdesign aus Hamburg: Websites für Betriebe in ganz Deutschland, Festpreis ab 599 €.",
};

/**
 * Open-Graph-Angaben für eine Seite.
 *
 * Next führt Metadaten nur flach zusammen: Ein eigenes `openGraph` auf
 * einer Seite ersetzt das aus `app/layout.tsx` vollständig. Deshalb
 * bringt dieser Helfer url, locale und siteName immer mit. Fehlen
 * title oder description, übernimmt Next die Werte der Seite.
 * Bilder kommen aus der opengraph-image-Datei im Ordner der Seite. Hat
 * die Seite keine eigene, `defaultImage: true` setzen: Sonst fiele mit
 * dem eigenen openGraph auch das Bild aus app/opengraph-image.tsx weg.
 */
export function ogFor(
  path: string,
  title?: string,
  description?: string,
  type: "website" | "article" = "website",
  {
    defaultImage = false,
    publishedTime,
    modifiedTime,
    tags,
  }: {
    defaultImage?: boolean;
    /** Nur bei type "article". */
    publishedTime?: string;
    modifiedTime?: string;
    tags?: string[];
  } = {},
): NonNullable<Metadata["openGraph"]> {
  const basis = {
    url: path,
    locale: "de_DE",
    siteName: "Sitalo Webdesign",
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    ...(defaultImage ? { images: [DEFAULT_OG_IMAGE] } : {}),
  };
  if (type === "website") return { ...basis, type };
  return {
    ...basis,
    type,
    ...(publishedTime ? { publishedTime } : {}),
    ...(modifiedTime ? { modifiedTime } : {}),
    ...(tags ? { tags } : {}),
  };
}
