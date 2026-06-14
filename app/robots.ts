import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";


export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // API-Routes (Form-Endpoints, Speed-Check-Proxy) und Next-internals
        // ausschließen — keine User-relevanten Inhalte, kein SEO-Wert.
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
