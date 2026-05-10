"use client";

import { useActionState, useEffect, useRef } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitLeadAction } from "@/lib/actions/leads";
import { initialLeadState } from "@/lib/actions/states";
import { SubmitButton } from "@/components/dashboard/submit-button";

export function SiteContactForm({ slug }: { slug: string }) {
  const [state, formAction] = useActionState(
    submitLeadAction,
    initialLeadState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  // When the server signals the form is deactivated (preview mode, or
  // toggle flipped after the page was rendered), drop the fields and
  // show only the alert — leaving empty inputs below the error looks
  // broken.
  const serverDisabled =
    state.status === "error" &&
    typeof state.message === "string" &&
    state.message.includes("nicht verfügbar");

  if (serverDisabled) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{state.message}</AlertDescription>
      </Alert>
    );
  }

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <input type="hidden" name="slug" value={slug} />

      {/* Honeypot — visually hidden, ignored by humans, filled by bots. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="website_url">Website (bitte leer lassen)</label>
        <input
          id="website_url"
          name="website_url"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {state.status === "error" && state.message && (
        <Alert variant="destructive">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}
      {state.status === "success" && state.message && (
        <Alert variant="success">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="lead-name">Name</Label>
          <Input
            id="lead-name"
            name="name"
            required
            maxLength={120}
            autoComplete="name"
            aria-invalid={Boolean(state.fieldErrors?.name) || undefined}
          />
          {state.fieldErrors?.name && (
            <p className="text-destructive text-sm">{state.fieldErrors.name}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lead-email">E-Mail</Label>
          <Input
            id="lead-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            aria-invalid={Boolean(state.fieldErrors?.email) || undefined}
          />
          {state.fieldErrors?.email && (
            <p className="text-destructive text-sm">
              {state.fieldErrors.email}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="lead-phone">Telefon (optional)</Label>
        <Input
          id="lead-phone"
          name="phone"
          type="tel"
          maxLength={40}
          autoComplete="tel"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lead-message">Nachricht</Label>
        <Textarea
          id="lead-message"
          name="message"
          required
          rows={5}
          minLength={10}
          maxLength={4000}
          aria-invalid={Boolean(state.fieldErrors?.message) || undefined}
        />
        {state.fieldErrors?.message && (
          <p className="text-destructive text-sm">
            {state.fieldErrors.message}
          </p>
        )}
      </div>

      <SubmitButton label="Nachricht senden" pendingLabel="Wird gesendet …" />
    </form>
  );
}
