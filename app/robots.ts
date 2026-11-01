import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // API-Routen (Formulare, Ladezeit-Test) und der Mitgliederbereich
        // gehören nicht in die Suche.
        // Die Angebote für Kunden (/angebot/<token>) sind hier bewusst
        // NICHT gesperrt: Sie tragen noindex (Meta und X-Robots-Tag).
        // Eine Sperre in robots.txt würde Google daran hindern, dieses
        // noindex zu lesen; eine irgendwo verlinkte Adresse könnte dann
        // ohne Inhalt in den Ergebnissen landen.
        // /_next/ bleibt bewusst offen: Dort liegen Schriften, Stile und
        // Skripte. Google braucht sie, um die Seiten wie ein Besucher zu
        // sehen (Rendering, Mobilfreundlichkeit).
        disallow: ["/api/", "/admin"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
