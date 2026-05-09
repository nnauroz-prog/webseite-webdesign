import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SiteLegalPage } from "@/components/site/site-legal-page";
import { getPublicSite } from "@/lib/site-data";

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
    title: { absolute: `Datenschutz · ${data.website.business_name}` },
    robots: { index: false, follow: true },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const data = await getPublicSite(slug);
  if (!data) notFound();

  const text = data.website.privacy_text?.trim();
  if (!text) notFound();

  return (
    <SiteLegalPage website={data.website} title="Datenschutz" body={text} />
  );
}
