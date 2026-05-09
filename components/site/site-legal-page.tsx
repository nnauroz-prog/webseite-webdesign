import Link from "next/link";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import type { TemplateKey } from "@/lib/templates";
import type { WebsiteRow } from "@/types/website";

export function SiteLegalPage({
  website,
  title,
  body,
  templateKey,
}: {
  website: WebsiteRow;
  title: string;
  body: string;
  templateKey: TemplateKey;
}) {
  return (
    <div
      data-template={templateKey}
      className="bg-background flex min-h-screen flex-1 flex-col"
    >
      <SiteHeader website={website} />
      <main className="flex-1">
        <article className="mx-auto w-full max-w-3xl px-6 py-16">
          <Link
            href={`/site/${website.slug}`}
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            ← Zurück zur Startseite
          </Link>
          <h1 className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl">
            {title}
          </h1>
          <div className="text-muted-foreground prose-sm mt-8 space-y-4 leading-relaxed">
            {body.split(/\n{2,}/).map((paragraph, i) => (
              <p key={i} className="whitespace-pre-line">
                {paragraph}
              </p>
            ))}
          </div>
        </article>
      </main>
      <SiteFooter website={website} />
    </div>
  );
}
