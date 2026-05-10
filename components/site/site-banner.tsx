import type { WebsiteRow } from "@/types/website";

/**
 * Sticky promo banner that sits above the SiteHeader. Common US-SaaS
 * pattern — used for announcements ("20 % Sommerrabatt"), shipping
 * notices, or "Heute geschlossen wegen Feiertag". The whole banner is
 * a link when the customer provided one; otherwise plain text.
 *
 * Renders nothing unless the customer enabled it AND filled in text.
 */
export function SiteBanner({ website }: { website: WebsiteRow }) {
  if (!website.banner_enabled) return null;
  const text = website.banner_text?.trim();
  if (!text) return null;

  const href = website.banner_link?.trim() || null;

  const className =
    "bg-foreground text-background relative w-full px-4 py-2 text-center text-sm font-medium tracking-wide";

  if (!href) {
    return (
      <div className={className} role="region" aria-label="Hinweis">
        {text}
      </div>
    );
  }

  const isExternal = /^https?:\/\//i.test(href);

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={`${className} hover:bg-foreground/90 inline-block transition-colors`}
    >
      {text}
      <span aria-hidden="true" className="ml-1.5 inline-block">
        →
      </span>
    </a>
  );
}
