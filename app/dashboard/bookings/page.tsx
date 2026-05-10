import type { Metadata } from "next";
import { CalendarCheck } from "lucide-react";

import { BookingRow } from "@/components/dashboard/bookings/booking-row";
import { EmptyState } from "@/components/dashboard/empty-state";
import { requireCurrentWebsite } from "@/lib/supabase/auth";
import type { BookingRow as BookingModel } from "@/types/website";

export const metadata: Metadata = { title: "Termine" };

export default async function BookingsPage() {
  const { supabase, website } = await requireCurrentWebsite();

  const { data } = await supabase
    .from("bookings")
    .select("*")
    .eq("website_id", website.id)
    // Latest preferred_date first; tie-break on creation timestamp.
    .order("preferred_date", { ascending: true })
    .order("created_at", { ascending: false });

  const bookings = (data as BookingModel[] | null) ?? [];

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Termine</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Online-Buchungen aus dem Termin-Formular deiner Website.
        </p>
      </div>

      {!website.booking_form_enabled ? (
        <EmptyState
          icon={CalendarCheck}
          tone="rose"
          title="Online-Termine sind aktuell deaktiviert"
          description="Aktiviere das Termin-Formular in den Website-Einstellungen, damit Kunden online buchen können."
          primaryAction={{
            label: "Formular aktivieren",
            href: "/dashboard/website",
          }}
        />
      ) : bookings.length === 0 ? (
        <EmptyState
          icon={CalendarCheck}
          tone="rose"
          title="Noch keine Buchungen"
          description="Sobald jemand über deine Website einen Termin anfragt, erscheint die Buchung hier — du bekommst zusätzlich eine E-Mail."
          primaryAction={{
            label: "Vorschau öffnen",
            href: `/site/${website.slug}#termin`,
          }}
        />
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <BookingRow key={b.id} booking={b} />
          ))}
        </div>
      )}
    </div>
  );
}
