import type { MetadataRoute } from "next";

import { getAllBrancheSlugs } from "@/lib/branchen-data";
import { JOURNAL_POSTS } from "@/lib/journal-data";
import { getAllPaketSlugs } from "@/lib/pakete-data";
import { getAllStandortSlugs } from "@/lib/standorte-data";
import { SITE_URL } from "@/lib/site";

/**
 * Statische Routen mit ihrer SEO-Priorität und Change-Frequency.
 *
 * Priorität ist relativ innerhalb der Site (nicht absolut gegen
 * andere Sites). Logik:
 *   1.0  Startseite (einziger 1.0-Eintrag)
 *   0.9  Conversion-Routen (Anfrage, Branchen-Hub, Pakete-Hub,
 *        Standorte-Hub, Vertikal-Landings) — die Routen, die
 *        Anfragen direkt generieren
 *   0.8  Detail-Conversion-Routen (Kontakt, Termin, Sprechstunde)
 *   0.7  Trust- und Tool-Routen (Wartung, Honorar, Audit,
 *        Empfehlung, Rechner, Ablauf, Leistungen, FAQ, Vergleich)
 *   0.6  Editorial-Wert / Wandel (Jetzt, Erreichbarkeit, Journal-
 *        Index)
 *   0.5  Identitäts-Seiten (Atelier, Manifest, Auswahl, Inventar,
 *        Lexikon)
 *
 * ChangeFrequency reflektiert die echte Update-Kadenz, nicht eine
 * Wunsch-Crawl-Häufigkeit. Crawler ignorieren übertriebene Werte.
 */
const STATIC_ROUTES: Array<{
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}> = [
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  // Conversion-Hubs
  { path: "/anfrage", priority: 0.9, changeFrequency: "monthly" },
  { path: "/branchen", priority: 0.9, changeFrequency: "monthly" },
  { path: "/pakete", priority: 0.9, changeFrequency: "monthly" },
  { path: "/standorte", priority: 0.9, changeFrequency: "monthly" },
  { path: "/pflege", priority: 0.9, changeFrequency: "monthly" },
  { path: "/praxen", priority: 0.9, changeFrequency: "monthly" },
  // Detail-Conversion-Routen
  { path: "/kontakt", priority: 0.8, changeFrequency: "monthly" },
  { path: "/termin", priority: 0.8, changeFrequency: "monthly" },
  { path: "/sprechstunde", priority: 0.8, changeFrequency: "weekly" },
  // Trust- und Tool-Routen
  { path: "/wartung", priority: 0.7, changeFrequency: "monthly" },
  { path: "/honorar", priority: 0.7, changeFrequency: "monthly" },
  { path: "/audit", priority: 0.7, changeFrequency: "monthly" },
  { path: "/check", priority: 0.7, changeFrequency: "monthly" },
  { path: "/empfehlung", priority: 0.7, changeFrequency: "monthly" },
  { path: "/rechner", priority: 0.7, changeFrequency: "monthly" },
  { path: "/ablauf", priority: 0.7, changeFrequency: "monthly" },
  { path: "/leistungen", priority: 0.7, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
  { path: "/vergleich", priority: 0.7, changeFrequency: "monthly" },
  // Editorial-Wert / Wandel
  { path: "/jetzt", priority: 0.6, changeFrequency: "monthly" },
  { path: "/erreichbarkeit", priority: 0.6, changeFrequency: "yearly" },
  { path: "/journal", priority: 0.6, changeFrequency: "weekly" },
  // Identitäts-Seiten — selten Update, Brand-Substanz
  { path: "/atelier", priority: 0.5, changeFrequency: "yearly" },
  { path: "/manifest", priority: 0.5, changeFrequency: "yearly" },
  { path: "/auswahl", priority: 0.5, changeFrequency: "yearly" },
  { path: "/inventar", priority: 0.5, changeFrequency: "yearly" },
  { path: "/lexikon", priority: 0.5, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map(
    ({ path, priority, changeFrequency }) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency,
      priority,
    }),
  );

  const brancheEntries: MetadataRoute.Sitemap = getAllBrancheSlugs().map(
    (slug) => ({
      url: `${SITE_URL}/branchen/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    }),
  );

  const paketEntries: MetadataRoute.Sitemap = getAllPaketSlugs().map(
    (slug) => ({
      url: `${SITE_URL}/pakete/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    }),
  );

  const standortEntries: MetadataRoute.Sitemap = getAllStandortSlugs().map(
    (slug) => ({
      url: `${SITE_URL}/standorte/${slug}`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    }),
  );

  // Journal-Posts mit echtem Publikations-Datum als lastModified —
  // ehrlicher für Crawler als ein pauschales "now".
  const journalEntries: MetadataRoute.Sitemap = JOURNAL_POSTS.map((post) => ({
    url: `${SITE_URL}/journal/${post.slug}`,
    lastModified: new Date(post.publishedAt),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [
    ...staticEntries,
    ...brancheEntries,
    ...paketEntries,
    ...standortEntries,
    ...journalEntries,
  ];
}
