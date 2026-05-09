import { Clock, MapPin, Phone } from "lucide-react";

import type { TemplateMeta } from "@/lib/templates";
import type { WebsiteRow } from "@/types/website";

/**
 * Split hero used by templates that benefit from prominent appointment /
 * contact info next to the headline (e.g., a doctor's office). Falls back
 * gracefully when contact fields are missing.
 */
export function SiteHeroSplit({
  website,
  meta,
}: {
  website: WebsiteRow;
  meta: TemplateMeta;
}) {
  const title = website.hero_title?.trim() || website.business_name;
  const subtitle = website.hero_subtitle?.trim() || meta.defaultHeroSubtitle;
  const phone = website.phone?.trim();
  const address = website.address?.trim();
  const hours = website.opening_hours?.text?.trim();

  return (
    <section className="border-border/60 bg-accent/30 relative overflow-hidden border-b">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 py-20 sm:py-24 lg:grid-cols-[1.2fr_1fr]">
        <div>
          {website.industry && (
            <span className="bg-primary/10 text-primary inline-flex items-center rounded-full px-3 py-1 text-xs font-medium tracking-wide uppercase">
              {website.industry}
            </span>
          )}
          <h1 className="mt-5 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {title}
          </h1>
          <p className="text-muted-foreground mt-5 max-w-xl text-lg leading-relaxed text-pretty">
            {subtitle}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#kontakt"
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-11 items-center justify-center rounded-md px-6 text-sm font-medium transition"
            >
              {meta.primaryCtaLabel}
            </a>
            {phone && (
              <a
                href={`tel:${phone.replace(/\s+/g, "")}`}
                className="bg-background hover:bg-secondary inline-flex h-11 items-center justify-center rounded-md border px-6 text-sm font-medium transition"
              >
                Anrufen
              </a>
            )}
          </div>
        </div>

        <aside className="bg-card rounded-2xl border p-6 shadow-sm">
          <h2 className="text-base font-semibold tracking-tight">
            Sprechzeiten &amp; Kontakt
          </h2>
          <ul className="mt-5 space-y-4 text-sm">
            {hours && (
              <SidebarRow
                icon={<Clock className="h-4 w-4" />}
                title="Öffnungszeiten"
              >
                <span className="whitespace-pre-line">{hours}</span>
              </SidebarRow>
            )}
            {phone && (
              <SidebarRow icon={<Phone className="h-4 w-4" />} title="Telefon">
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  className="hover:underline"
                >
                  {phone}
                </a>
              </SidebarRow>
            )}
            {address && (
              <SidebarRow icon={<MapPin className="h-4 w-4" />} title="Adresse">
                <span className="whitespace-pre-line">{address}</span>
              </SidebarRow>
            )}
            {!hours && !phone && !address && (
              <li className="text-muted-foreground text-sm">
                Kontaktdaten folgen.
              </li>
            )}
          </ul>
        </aside>
      </div>
    </section>
  );
}

function SidebarRow({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      <span className="bg-primary/10 text-primary mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
        {icon}
      </span>
      <div>
        <div className="text-muted-foreground text-xs tracking-wide uppercase">
          {title}
        </div>
        <div className="mt-0.5 leading-relaxed">{children}</div>
      </div>
    </li>
  );
}
