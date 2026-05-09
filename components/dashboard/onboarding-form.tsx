"use client";

import { useActionState } from "react";

import { FieldError, FormStatus } from "@/components/dashboard/form-status";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createWebsiteAction, initialState } from "@/lib/actions/website";
import type { TemplateRow } from "@/types/website";

export function OnboardingForm({ templates }: { templates: TemplateRow[] }) {
  const [state, formAction] = useActionState(createWebsiteAction, initialState);

  return (
    <form action={formAction} className="space-y-5">
      <FormStatus state={state} />

      <div className="space-y-2">
        <Label htmlFor="business_name">Firmenname</Label>
        <Input
          id="business_name"
          name="business_name"
          required
          maxLength={120}
          placeholder="Pflegedienst Sonnenschein"
          aria-invalid={Boolean(state.fieldErrors?.business_name) || undefined}
        />
        <FieldError message={state.fieldErrors?.business_name} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug">URL-Kürzel</Label>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground text-sm">/site/</span>
          <Input
            id="slug"
            name="slug"
            required
            minLength={3}
            maxLength={63}
            placeholder="pflegedienst-sonnenschein"
            pattern="[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
            aria-invalid={Boolean(state.fieldErrors?.slug) || undefined}
          />
        </div>
        <p className="text-muted-foreground text-xs">
          Kleinbuchstaben, Zahlen und Bindestriche. Wird Teil der öffentlichen
          URL.
        </p>
        <FieldError message={state.fieldErrors?.slug} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="industry">Branche</Label>
        <Input
          id="industry"
          name="industry"
          maxLength={60}
          placeholder="Pflegedienst, Arztpraxis, Friseur, …"
        />
        <FieldError message={state.fieldErrors?.industry} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="template_id">Template</Label>
        <select
          id="template_id"
          name="template_id"
          className="border-input bg-background focus-visible:ring-ring focus-visible:ring-offset-background flex h-10 w-full rounded-md border px-3 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          defaultValue=""
        >
          <option value="">Später auswählen</option>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} · {t.industry}
            </option>
          ))}
        </select>
        <FieldError message={state.fieldErrors?.template_id} />
      </div>

      <SubmitButton label="Website anlegen" pendingLabel="Wird angelegt …" />
    </form>
  );
}
