"use client";

import { useActionState } from "react";

import { FormStatus } from "@/components/dashboard/form-status";
import { SectionCard } from "@/components/dashboard/section-card";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Label } from "@/components/ui/label";
import { initialState, updateTemplateAction } from "@/lib/actions/website";
import type { TemplateRow, WebsiteRow } from "@/types/website";

export function TemplateForm({
  website,
  templates,
}: {
  website: WebsiteRow;
  templates: TemplateRow[];
}) {
  const [state, formAction] = useActionState(
    updateTemplateAction,
    initialState,
  );

  return (
    <form action={formAction}>
      <SectionCard
        title="Template"
        description="Bestimmt das visuelle Erscheinungsbild deiner öffentlichen Website."
        footer={
          <>
            <FormStatus state={state} />
            <SubmitButton label="Template übernehmen" />
          </>
        }
      >
        <div className="space-y-2">
          <Label htmlFor="template_id">Verwendetes Template</Label>
          <select
            id="template_id"
            name="template_id"
            className="border-input bg-background focus-visible:ring-ring focus-visible:ring-offset-background flex h-10 w-full rounded-md border px-3 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
            defaultValue={website.template_id ?? ""}
          >
            <option value="">Standard (kein Template)</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} · {t.industry}
              </option>
            ))}
          </select>
          <p className="text-muted-foreground text-xs">
            Templates beeinflussen Farben, Hero-Layout und Wording. Änderungen
            werden sofort sichtbar.
          </p>
        </div>
      </SectionCard>
    </form>
  );
}
