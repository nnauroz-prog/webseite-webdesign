"use client";

import { useActionState, useEffect, useRef } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitBookingAction } from "@/lib/actions/bookings";
import { initialBookingState } from "@/lib/actions/states";
import { SubmitButton } from "@/components/dashboard/submit-button";
import type { ServiceRow } from "@/types/website";

/**
 * Public booking form. Wired to submitBookingAction (anon-callable
 * via the bookings: public can submit RLS policy + the schema's
 * is_active && booking_form_enabled gate).
 */
export function SiteBookingForm({
  slug,
  services,
}: {
  slug: string;
  services: ServiceRow[];
}) {
  const [state, formAction] = useActionState(
    submitBookingAction,
    initialBookingState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  // Min-date for the date picker — today, in the user's local TZ.
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minDate = today.toISOString().split("T")[0];

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <input type="hidden" name="slug" value={slug} />

      {/* Honeypot — visually hidden, ignored by humans, filled by bots. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="booking-website_url">Website (bitte leer lassen)</label>
        <input
          id="booking-website_url"
          name="website_url"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {state.status === "error" && state.message ? (
        <Alert variant="destructive">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      ) : null}
      {state.status === "success" && state.message ? (
        <Alert variant="success">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="booking-name">Name</Label>
          <Input
            id="booking-name"
            name="customer_name"
            required
            maxLength={120}
            autoComplete="name"
            aria-invalid={
              Boolean(state.fieldErrors?.customer_name) || undefined
            }
          />
          {state.fieldErrors?.customer_name ? (
            <p className="text-destructive text-sm">
              {state.fieldErrors.customer_name}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="booking-email">E-Mail</Label>
          <Input
            id="booking-email"
            name="customer_email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={
              Boolean(state.fieldErrors?.customer_email) || undefined
            }
          />
          {state.fieldErrors?.customer_email ? (
            <p className="text-destructive text-sm">
              {state.fieldErrors.customer_email}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="booking-phone">Telefon (optional)</Label>
        <Input
          id="booking-phone"
          name="customer_phone"
          type="tel"
          maxLength={40}
          autoComplete="tel"
        />
      </div>

      {services.length > 0 ? (
        <div className="space-y-2">
          <Label htmlFor="booking-service">Leistung (optional)</Label>
          <select
            id="booking-service"
            name="service_id"
            className="border-input bg-background focus-visible:ring-ring h-10 w-full rounded-md border px-3 text-sm shadow-sm focus-visible:ring-2 focus-visible:outline-none"
            defaultValue=""
          >
            <option value="">Bitte wählen — oder im Nachrichtenfeld beschreiben</option>
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="booking-date">Wunsch-Datum</Label>
          <Input
            id="booking-date"
            name="preferred_date"
            type="date"
            required
            min={minDate}
            aria-invalid={
              Boolean(state.fieldErrors?.preferred_date) || undefined
            }
          />
          {state.fieldErrors?.preferred_date ? (
            <p className="text-destructive text-sm">
              {state.fieldErrors.preferred_date}
            </p>
          ) : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="booking-time">Wunsch-Uhrzeit (optional)</Label>
          <Input
            id="booking-time"
            name="preferred_time"
            type="time"
            aria-invalid={
              Boolean(state.fieldErrors?.preferred_time) || undefined
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="booking-message">Nachricht (optional)</Label>
        <Textarea
          id="booking-message"
          name="message"
          rows={4}
          maxLength={4000}
          placeholder="Beschreibe kurz dein Anliegen oder besondere Wünsche."
          aria-invalid={Boolean(state.fieldErrors?.message) || undefined}
        />
      </div>

      <SubmitButton label="Termin anfragen" pendingLabel="Wird gesendet …" />
    </form>
  );
}
