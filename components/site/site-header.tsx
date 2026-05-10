import Image from "next/image";
import Link from "next/link";

import { listNavPages } from "@/lib/page-data";
import type { WebsiteRow } from "@/types/website";

export async function SiteHeader({ website }: { website: WebsiteRow }) {
  const navPages = await listNavPages(website.id);

  return (
    <header className="border-border/60 bg-background/85 sticky top-0 z-30 border-b backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-6">
        <Link
          href={`/site/${website.slug}`}
          className="flex shrink-0 items-center gap-3"
        >
          {website.logo_url ? (
            <span className="bg-muted inline-flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md border">
              <Image
                src={website.logo_url}
                alt={`${website.business_name} Logo`}
                width={36}
                height={36}
                className="h-full w-full object-contain"
                unoptimized
              />
            </span>
          ) : null}
          <span className="text-base font-semibold tracking-tight">
            {website.business_name}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 text-sm md:flex">
          {navPages.map((p) => (
            <Link
              key={p.id}
              href={`/site/${website.slug}/${p.slug}`}
              className="hover:bg-secondary inline-flex h-9 items-center justify-center rounded-md px-3 transition"
            >
              {p.title}
            </Link>
          ))}
          {website.contact_form_enabled || website.phone || website.email ? (
            <Link
              href={`/site/${website.slug}#kontakt`}
              className="bg-primary text-primary-foreground hover:bg-primary/90 ml-1 inline-flex h-9 items-center justify-center rounded-md px-4 font-medium transition"
            >
              Kontakt
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
