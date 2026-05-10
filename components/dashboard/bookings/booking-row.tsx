"use client";

import { useActionState } from "react";
import { Calendar, Clock, Phone, Tag } from "lucide-react";

import { FormStatus } from "@/components/dashboard/form-status";
import { StatusPill } from "@/components/dashboard/status-pill";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { updateBookingStatusAction } from "@/lib/actions/bookings";
import { initialBookingState } from "@/lib/actions/states";
import type {
  BookingRow as BookingModel,
  BookingStatus,
} from "@/types/website";

const LABELS: Record<BookingStatus, string> = {
  new: "Neu",
  confirmed: "Bestätigt",
  declined: "Abgelehnt",
  cancelled: "Storniert",
  completed: "Abgeschlossen",
};

const ORDER: BookingStatus[] = [
  "new",
  "confirmed",
  "declined",
  "cancelled",
  "completed",
];

export function BookingRow({ booking }: { booking: BookingModel }) {
  const [state, formAction] = useActionState(
    updateBookingStatusAction,
    initialBookingState,
  );

  return (
    <article className="rounded-lg border p-5">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-base leading-tight font-semibold">
            {booking.customer_name}
          </h3>
          <p className="text-muted-foreground mt-0.5 text-sm">
            <a
              href={`mailto:${booking.customer_email}`}
              className="hover:text-foreground hover:underline"
            >
              {booking.customer_email}
            </a>
            {booking.customer_phone ? (
              <>
                {" · "}
                <a
                  href={`tel:${booking.customer_phone.replace(/\s+/g, "")}`}
                  className="hover:text-foreground hover:underline inline-flex items-center gap-1"
                >
                  <Phone className="h-3 w-3" />
                  {booking.customer_phone}
                </a>
              </>
            ) : null}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusPill status={booking.status} label={LABELS[booking.status]} />
          <time
            dateTime={booking.created_at}
            className="text-muted-foreground text-xs"
          >
            {formatDate(booking.created_at)}
          </time>
        </div>
      </header>

      {/* Wunsch-Termin + Service */}
      <dl className="text-foreground/90 mt-4 grid gap-3 text-sm sm:grid-cols-3">
        <div className="flex items-center gap-2">
          <Calendar className="text-muted-foreground h-4 w-4 shrink-0" />
          <div>
            <dt className="text-muted-foreground text-[11px] tracking-wide uppercase">
              Datum
            </dt>
            <dd className="font-medium">
              {formatDateOnly(booking.preferred_date)}
            </dd>
          </div>
        </div>
        {booking.preferred_time ? (
          <div className="flex items-center gap-2">
            <Clock className="text-muted-foreground h-4 w-4 shrink-0" />
            <div>
              <dt className="text-muted-foreground text-[11px] tracking-wide uppercase">
                Uhrzeit
              </dt>
              <dd className="font-medium">
                {booking.preferred_time.slice(0, 5)} Uhr
              </dd>
            </div>
          </div>
        ) : null}
        {booking.service_title ? (
          <div className="flex items-center gap-2">
            <Tag className="text-muted-foreground h-4 w-4 shrink-0" />
            <div>
              <dt className="text-muted-foreground text-[11px] tracking-wide uppercase">
                Leistung
              </dt>
              <dd className="font-medium">{booking.service_title}</dd>
            </div>
          </div>
        ) : null}
      </dl>

      {booking.message ? (
        <p className="text-foreground/90 bg-secondary/40 mt-4 rounded-md p-3 text-sm leading-relaxed whitespace-pre-line">
          {booking.message}
        </p>
      ) : null}

      <form
        action={formAction}
        className="mt-5 flex flex-wrap items-center gap-3 border-t pt-4"
      >
        <input type="hidden" name="id" value={booking.id} />
        <label
          htmlFor={`status-${booking.id}`}
          className="text-muted-foreground text-xs tracking-wide uppercase"
        >
          Status
        </label>
        <select
          id={`status-${booking.id}`}
          name="status"
          defaultValue={booking.status}
          className="border-input bg-background h-9 rounded-md border px-3 text-sm shadow-sm"
        >
          {ORDER.map((s) => (
            <option key={s} value={s}>
              {LABELS[s]}
            </option>
          ))}
        </select>
        <SubmitButton label="Speichern" variant="outline" size="sm" />
        <div className="ml-auto">
          <FormStatus state={state} />
        </div>
      </form>
    </article>
  );
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

function formatDateOnly(iso: string) {
  try {
    return new Date(`${iso}T00:00:00`).toLocaleDateString("de-DE", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
