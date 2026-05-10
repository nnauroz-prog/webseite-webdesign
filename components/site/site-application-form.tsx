"use client";

import { useActionState, useEffect, useRef } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitApplicationAction } from "@/lib/actions/applications";
import { initialApplicationState } from "@/lib/actions/states";
import { SubmitButton } from "@/components/dashboard/submit-button";

export function SiteApplicationForm({ slug }: { slug: string }) {
  const [state, formAction] = useActionState(
    submitApplicationAction,
    initialApplicationState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <input type="hidden" name="slug" value={slug} />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="ap-website_url">Website (bitte leer lassen)</label>
        <input
          id="ap-website_url"
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
          <Label htmlFor="ap-name">Name</Label>
          <Input
            id="ap-name"
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
          <Label htmlFor="ap-email">E-Mail</Label>
          <Input
            id="ap-email"
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ap-phone">Telefon (optional)</Label>
          <Input
            id="ap-phone"
            name="phone"
            type="tel"
            maxLength={40}
            autoComplete="tel"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ap-position">Gewünschte Position</Label>
          <Input
            id="ap-position"
            name="desired_position"
            maxLength={120}
            placeholder="z.B. Pflegefachkraft (m/w/d)"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="ap-message">Anschreiben / Kurzprofil</Label>
        <Textarea
          id="ap-message"
          name="message"
          required
          rows={6}
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

      <SubmitButton label="Bewerbung senden" pendingLabel="Wird gesendet …" />
    </form>
  );
}
