import type { MetadataRoute } from "next";

import { getAllBrancheSlugs } from "@/lib/branchen-data";
import { JOURNAL_POSTS } from "@/lib/journal-data";
import { getAllPaketSlugs } from "@/lib/pakete-data";
import { getAllStandortSlugs } from "@/lib/standorte-data";
import { SITE_URL } from "@/lib/site";


const STATIC_ROUTES = [
  "",
  "/leistungen",
  "/branchen",
  "/ablauf",
  "/pakete",
  "/honorar",
  "/standorte",
  "/atelier",
  "/jetzt",
  "/faq",
  "/kontakt",
  "/anfrage",
  // Werkzeuge / Lead-Magnete
  "/audit",
  "/check",
  "/empfehlung",
  "/termin",
  "/sprechstunde",
  "/rechner",
  // Produkte / Vergleich
  "/wartung",
  "/vergleich",
  // Editorial / Identität
  "/journal",
  "/manifest",
  "/auswahl",
  "/inventar",
  "/lexikon",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));

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
