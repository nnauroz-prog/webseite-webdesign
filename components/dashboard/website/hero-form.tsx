"use client";

import { useActionState } from "react";

import { FieldError, FormStatus } from "@/components/dashboard/form-status";
import { SectionCard } from "@/components/dashboard/section-card";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { initialState, updateHeroAction } from "@/lib/actions/website";
import type { WebsiteRow } from "@/types/website";

export function HeroForm({ website }: { website: WebsiteRow }) {
  const [state, formAction] = useActionState(updateHeroAction, initialState);

  return (
    <form action={formAction}>
      <SectionCard
        title="Hero"
        description="Großer Aufmacher-Text oben auf deiner Website."
        footer={
          <>
            <FormStatus state={state} />
            <SubmitButton label="Speichern" />
          </>
        }
      >
        <div className="space-y-2">
          <Label htmlFor="hero_title">Überschrift</Label>
          <Input
            id="hero_title"
            name="hero_title"
            defaultValue={website.hero_title ?? ""}
            maxLength={120}
            placeholder="z.B. Pflege mit Herz, in Ihrer Nachbarschaft"
          />
          <FieldError message={state.fieldErrors?.hero_title} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="hero_subtitle">Untertext</Label>
          <Textarea
            id="hero_subtitle"
            name="hero_subtitle"
            rows={3}
            maxLength={300}
            defaultValue={website.hero_subtitle ?? ""}
          />
          <FieldError message={state.fieldErrors?.hero_subtitle} />
        </div>
      </SectionCard>
    </form>
  );
}
