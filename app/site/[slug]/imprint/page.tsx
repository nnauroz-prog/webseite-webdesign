import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteLegalPage } from "@/components/site/site-legal-page";
import { getPublicSite } from "@/lib/site-data";
import { resolveTemplateKey } from "@/lib/templates";

type RouteParams = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getPublicSite(slug);
  if (!data) return { title: "Nicht gefunden" };
  return {
    title: { absolute: `Impressum · ${data.website.business_name}` },
    robots: { index: false, follow: true },
  };
}

export default async function ImprintPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const data = await getPublicSite(slug);
  if (!data) notFound();

  const text = data.website.imprint_text?.trim();
  if (!text) notFound();

  return (
    <SiteLegalPage
      website={data.website}
      title="Impressum"
      body={text}
      templateKey={resolveTemplateKey(data.template)}
    />
  );
}
