import { editorialOgImage, OG_SIZE } from "@/lib/og-editorial";
import { formatDate, getAllPostSlugs, getPost } from "@/lib/journal-data";

export const runtime = "nodejs";
export const alt = "Sitalo Journal: Beitrag aus Hamburg.";
export const size = OG_SIZE;
export const contentType = "image/png";

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

/** Vorschaubild je Beitrag: Titel als Überschrift, Vorspann darunter. */
export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) {
    return editorialOgImage({
      variant: "dunkel",
      eyebrow: "Sitalo · Journal",
      headline: "Journal",
      subline: "Texte über Preise, Baukästen und die Suche bei Google.",
      url: "sitalo.de/journal",
    });
  }
  return editorialOgImage({
    variant: "dunkel",
    eyebrow: `Sitalo · Journal · ${formatDate(post.publishedAt)}`,
    headline: post.title,
    subline: post.dek,
    url: `sitalo.de/journal/${post.slug}`,
  });
}
