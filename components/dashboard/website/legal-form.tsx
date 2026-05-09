"use client";

import { useActionState } from "react";

import { FieldError, FormStatus } from "@/components/dashboard/form-status";
import { SectionCard } from "@/components/dashboard/section-card";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { initialState, updateLegalAction } from "@/lib/actions/website";
import type { WebsiteRow } from "@/types/website";

export function LegalForm({ website }: { website: WebsiteRow }) {
  const [state, formAction] = useActionState(updateLegalAction, initialState);

  return (
    <form action={formAction}>
      <SectionCard
        title="Impressum & Datenschutz"
        description="Pflichtangaben für jede gewerbliche Website."
        footer={
          <>
            <FormStatus state={state} />
            <SubmitButton label="Speichern" />
          </>
        }
      >
        <div className="space-y-2">
          <Label htmlFor="imprint_text">Impressum</Label>
          <Textarea
            id="imprint_text"
            name="imprint_text"
            rows={6}
            maxLength={8000}
            defaultValue={website.imprint_text ?? ""}
          />
          <FieldError message={state.fieldErrors?.imprint_text} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="privacy_text">Datenschutzerklärung</Label>
          <Textarea
            id="privacy_text"
            name="privacy_text"
            rows={10}
            maxLength={12000}
            defaultValue={website.privacy_text ?? ""}
          />
          <FieldError message={state.fieldErrors?.privacy_text} />
        </div>
      </SectionCard>
    </form>
  );
}
