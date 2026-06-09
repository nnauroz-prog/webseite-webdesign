import { JOURNAL_POSTS } from "@/lib/journal-data";
import { SITE_URL } from "@/lib/site";

/**
 * RSS-2.0-Feed für das Journal.
 *
 * Statisch generiert — ändert sich nur bei neuem Build, was für
 * unsere Posting-Kadenz (wenige Essays pro Monat) genau richtig
 * ist. Feed-Reader, die Hamburger Lokal-Themen abonnieren wollen,
 * bekommen einen sauberen Kanal.
 */


export const dynamic = "force-static";

function escapeXml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function GET() {
  const items = JOURNAL_POSTS.map((post) => {
    const url = `${SITE_URL}/journal/${post.slug}`;
    const pubDate = new Date(post.publishedAt).toUTCString();
    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.dek)}</description>
      <pubDate>${pubDate}</pubDate>
      ${post.tags.map((t) => `<category>${escapeXml(t)}</category>`).join("\n      ")}
    </item>`;
  }).join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Sitalo Journal</title>
    <link>${SITE_URL}/journal</link>
    <atom:link href="${SITE_URL}/journal/feed.xml" rel="self" type="application/rss+xml"/>
    <description>Essays aus dem Hamburger Atelier — Beobachtungen aus echten Projekten mit lokalen Unternehmen.</description>
    <language>de-DE</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
