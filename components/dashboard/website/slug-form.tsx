"use client";

import { useActionState } from "react";

import { FieldError, FormStatus } from "@/components/dashboard/form-status";
import { SectionCard } from "@/components/dashboard/section-card";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateSlugAction } from "@/lib/actions/website";
import { initialState } from "@/lib/actions/states";
import type { WebsiteRow } from "@/types/website";

export function SlugForm({ website }: { website: WebsiteRow }) {
  const [state, formAction] = useActionState(updateSlugAction, initialState);

  return (
    <form action={formAction}>
      <SectionCard
        title="URL ändern"
        description="Achtung: Bestehende Links auf die alte URL funktionieren danach nicht mehr."
        footer={
          <>
            <FormStatus state={state} />
            <SubmitButton label="URL speichern" />
          </>
        }
      >
        <div className="space-y-2">
          <Label htmlFor="slug">URL-Kürzel</Label>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">/site/</span>
            <Input
              id="slug"
              name="slug"
              defaultValue={website.slug}
              required
              minLength={3}
              maxLength={63}
              pattern="[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
            />
          </div>
          <p className="text-muted-foreground text-xs">
            Nur Kleinbuchstaben, Zahlen und Bindestriche.
          </p>
          <FieldError message={state.fieldErrors?.slug} />
        </div>
      </SectionCard>
    </form>
  );
}
