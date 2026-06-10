import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";
import { formatDate, getAllPostSlugs, getPost } from "@/lib/journal-data";

export const runtime = "nodejs";
export const alt = "Sitalo Journal — Essay aus dem Hamburger Atelier.";
export const size = OG_SIZE;
export const contentType = "image/png";

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

/**
 * Per-Post-OG: Essay-Titel als Italic-Hauptzeile (die Titel sind
 * Thesen, keine Keywords — sie tragen die Serif gut), Journal-
 * Marker als Bold-Zeile darüber.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) {
    return editorialOgImage({
      variant: "espresso",
      eyebrow: "SITALO · JOURNAL",
      headlineBold: "Journal.",
      headlineItalic: "Aus dem Atelier.",
      subline: "Essays aus echten Hamburger Projekten.",
      urlPill: "sitalo.de/journal",
    });
  }
  return editorialOgImage({
    variant: "espresso",
    eyebrow: `SITALO · JOURNAL · ${formatDate(post.publishedAt).toUpperCase()}`,
    headlineBold: "Journal.",
    headlineItalic: post.title,
    subline: post.dek,
    urlPill: `sitalo.de/journal`,
  });
}
