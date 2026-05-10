import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { BlockRenderer } from "@/components/site/blocks/block-renderer";
import { PreviewBanner } from "@/components/site/preview-banner";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { getPublicSite } from "@/lib/site-data";
import { getCustomPage, listPageBlocks } from "@/lib/page-data";
import { getSiteUrl } from "@/lib/site-url";
import { resolveTemplateKey } from "@/lib/templates";

type RouteParams = { slug: string; pageSlug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug, pageSlug } = await params;
  const data = await getPublicSite(slug);
  if (!data) return { title: "Nicht gefunden" };
  const page = await getCustomPage(data.website.id, pageSlug);
  if (!page) return { title: "Nicht gefunden" };

  const url = `${getSiteUrl()}/site/${slug}/${pageSlug}`;
  return {
    title: { absolute: `${page.title} · ${data.website.business_name}` },
    description: page.body
      ? truncate(page.body.replace(/\s+/g, " "), 160)
      : `${page.title} — ${data.website.business_name}`,
    robots:
      data.website.is_active && page.is_published
        ? { index: true, follow: true }
        : { index: false, follow: false },
    alternates: { canonical: url },
  };
}

export default async function CustomPageRoute({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug, pageSlug } = await params;
  const data = await getPublicSite(slug);
  if (!data) notFound();

  const page = await getCustomPage(data.website.id, pageSlug);
  // 404 if page doesn't exist OR isn't published (and viewer isn't owner).
  // The owner-preview flag mirrors how the home route already gates drafts.
  if (!page) notFound();
  if (!page.is_published && !data.isPreview) notFound();

  const { website, isPreview } = data;
  const templateKey = resolveTemplateKey(data.template);
  const blocks = await listPageBlocks(page.id);
  const hasBody = Boolean(page.body?.trim());
  const hasBlocks = blocks.length > 0;

  return (
    <div
      data-template={templateKey}
      className="bg-background flex min-h-screen flex-1 flex-col"
    >
      {isPreview && <PreviewBanner />}
      <SiteHeader website={website} />
      <main className="flex-1">
        <article className="border-border/60 mx-auto w-full max-w-3xl border-b px-6 py-16 sm:py-20">
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            {page.title}
          </h1>
          {hasBody ? (
            <div className="text-foreground/90 mt-8 space-y-5 text-base leading-relaxed">
              {page.body.split(/\n{2,}/).map((paragraph, i) => (
                <p key={i} className="whitespace-pre-line">
                  {paragraph}
                </p>
              ))}
            </div>
          ) : !hasBlocks ? (
            <p className="text-muted-foreground mt-8 text-sm">
              Diese Seite hat noch keinen Inhalt.
            </p>
          ) : null}
        </article>
        <BlockRenderer blocks={blocks} />
      </main>
      <SiteFooter website={website} />
    </div>
  );
}

function truncate(value: string, max: number): string {
  if (value.length <= max) return value;
  return value.slice(0, max - 1).trimEnd() + "…";
}
