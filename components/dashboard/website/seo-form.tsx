"use client";

import { useActionState } from "react";

import { FieldError, FormStatus } from "@/components/dashboard/form-status";
import { SectionCard } from "@/components/dashboard/section-card";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateSeoAction } from "@/lib/actions/website";
import { initialState } from "@/lib/actions/states";
import type { WebsiteRow } from "@/types/website";

export function SeoForm({ website }: { website: WebsiteRow }) {
  const [state, formAction] = useActionState(updateSeoAction, initialState);

  return (
    <form action={formAction}>
      <SectionCard
        title="SEO"
        description="Was Google und Vorschau-Bots in Suche und Social-Sharing anzeigen."
        footer={
          <>
            <FormStatus state={state} />
            <SubmitButton label="Speichern" />
          </>
        }
      >
        <div className="space-y-2">
          <Label htmlFor="seo_title">SEO-Titel</Label>
          <Input
            id="seo_title"
            name="seo_title"
            defaultValue={website.seo_title ?? ""}
            maxLength={70}
          />
          <p className="text-muted-foreground text-xs">
            Empfohlen: 50–60 Zeichen.
          </p>
          <FieldError message={state.fieldErrors?.seo_title} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="seo_description">SEO-Beschreibung</Label>
          <Textarea
            id="seo_description"
            name="seo_description"
            rows={3}
            maxLength={180}
            defaultValue={website.seo_description ?? ""}
          />
          <p className="text-muted-foreground text-xs">
            Empfohlen: 140–160 Zeichen.
          </p>
          <FieldError message={state.fieldErrors?.seo_description} />
        </div>
      </SectionCard>
    </form>
  );
}
