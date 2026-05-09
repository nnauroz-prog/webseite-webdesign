"use client";

import { useActionState } from "react";

import { FieldError, FormStatus } from "@/components/dashboard/form-status";
import { SectionCard } from "@/components/dashboard/section-card";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { initialState, updateAboutAction } from "@/lib/actions/website";
import type { WebsiteRow } from "@/types/website";

export function AboutForm({ website }: { website: WebsiteRow }) {
  const [state, formAction] = useActionState(updateAboutAction, initialState);

  return (
    <form action={formAction}>
      <SectionCard
        title="Über uns"
        description="Erzähle in zwei bis drei Absätzen, was dein Unternehmen ausmacht."
        footer={
          <>
            <FormStatus state={state} />
            <SubmitButton label="Speichern" />
          </>
        }
      >
        <div className="space-y-2">
          <Label htmlFor="about_text">Text</Label>
          <Textarea
            id="about_text"
            name="about_text"
            rows={8}
            maxLength={4000}
            defaultValue={website.about_text ?? ""}
          />
          <FieldError message={state.fieldErrors?.about_text} />
        </div>
      </SectionCard>
    </form>
  );
}
