import Image from "next/image";
import Link from "next/link";

import type { WebsiteRow } from "@/types/website";

export function SiteHeader({ website }: { website: WebsiteRow }) {
  return (
    <header className="border-border/60 bg-background/85 sticky top-0 z-30 border-b backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
        <Link
          href={`/site/${website.slug}`}
          className="flex items-center gap-3"
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
        {website.contact_form_enabled || website.phone || website.email ? (
          <a
            href="#kontakt"
            className="bg-primary text-primary-foreground hover:bg-primary/90 hidden h-9 items-center justify-center rounded-md px-4 text-sm font-medium transition sm:inline-flex"
          >
            Kontakt
          </a>
        ) : null}
      </div>
    </header>
  );
}
