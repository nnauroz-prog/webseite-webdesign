import type { MetadataRoute } from "next";

import { getAllBrancheSlugs } from "@/lib/branchen-data";
import { getAllPaketSlugs } from "@/lib/pakete-data";
import { getAllStandortSlugs } from "@/lib/standorte-data";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ||
  "https://webseite-webdesign.vercel.app";

const STATIC_ROUTES = [
  "",
  "/leistungen",
  "/branchen",
  "/ablauf",
  "/pakete",
  "/standorte",
  "/faq",
  "/kontakt",
  "/anfrage",
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

  return [
    ...staticEntries,
    ...brancheEntries,
    ...paketEntries,
    ...standortEntries,
  ];
}
