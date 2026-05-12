import type { MetadataRoute } from "next";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ||
  "https://webseite-webdesign.vercel.app";

const ROUTES = [
  "",
  "/leistungen",
  "/branchen",
  "/ablauf",
  "/pakete",
  "/faq",
  "/kontakt",
  "/anfrage",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return ROUTES.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: path === "" ? 1 : 0.7,
  }));
}
