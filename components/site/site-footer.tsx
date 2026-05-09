import Link from "next/link";

import type { WebsiteRow } from "@/types/website";

export function SiteFooter({ website }: { website: WebsiteRow }) {
  const year = new Date().getFullYear();
  const showImprint = !!website.imprint_text?.trim();
  const showPrivacy = !!website.privacy_text?.trim();

  return (
    <footer className="bg-muted/30 py-10">
      <div className="text-muted-foreground mx-auto flex w-full max-w-6xl flex-col gap-4 px-6 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {year} {website.business_name}
        </p>
        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {showImprint && (
            <Link
              href={`/site/${website.slug}/imprint`}
              className="hover:text-foreground transition-colors"
            >
              Impressum
            </Link>
          )}
          {showPrivacy && (
            <Link
              href={`/site/${website.slug}/privacy`}
              className="hover:text-foreground transition-colors"
            >
              Datenschutz
            </Link>
          )}
        </nav>
      </div>
    </footer>
  );
}
