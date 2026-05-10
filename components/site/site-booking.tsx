import { CalendarCheck } from "lucide-react";

import { SiteBookingForm } from "@/components/site/site-booking-form";
import type { ServiceRow, WebsiteRow } from "@/types/website";

/**
 * Online-booking section. Renders only when the owner enabled the
 * booking form on the website. Apple-grade typography, generous
 * spacing, refined card chrome — same idioms as SiteContact.
 */
export function SiteBooking({
  website,
  services,
}: {
  website: WebsiteRow;
  services: ServiceRow[];
}) {
  if (!website.booking_form_enabled) return null;

  return (
    <section
      id="termin"
      className="bg-secondary/30 border-border/60 border-b py-28 sm:py-36"
    >
      <div className="mx-auto w-full max-w-5xl px-6">
        <header className="mx-auto max-w-2xl text-center">
          <p className="text-muted-foreground text-[11px] font-medium tracking-[0.2em] uppercase">
            Online-Termin
          </p>
          <h2 className="mt-3 text-4xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-5xl">
            Termin anfragen
          </h2>
          <p className="text-muted-foreground mx-auto mt-5 max-w-xl text-pretty">
            Wähle Datum, Uhrzeit und gewünschte Leistung — wir bestätigen
            zeitnah.
          </p>
        </header>

        <div className="bg-card ring-border/50 mx-auto mt-12 max-w-3xl rounded-3xl border p-8 shadow-xl ring-1 sm:p-10">
          <div className="mb-6 flex items-center gap-3">
            <span className="bg-primary/10 text-primary inline-flex h-10 w-10 items-center justify-center rounded-full">
              <CalendarCheck className="h-5 w-5" />
            </span>
            <div>
              <h3 className="text-base font-semibold tracking-tight">
                {website.business_name}
              </h3>
              <p className="text-muted-foreground text-xs">
                Termin online anfragen — keine Bestätigung im Voraus nötig.
              </p>
            </div>
          </div>
          <SiteBookingForm slug={website.slug} services={services} />
        </div>
      </div>
    </section>
  );
}
