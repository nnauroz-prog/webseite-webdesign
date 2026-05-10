"use client";

import { useActionState, useState } from "react";
import { Check } from "lucide-react";

import { FormStatus } from "@/components/dashboard/form-status";
import { SectionCard } from "@/components/dashboard/section-card";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { TemplatePreview } from "@/components/dashboard/template-preview";
import { ALL_TEMPLATE_KEYS, getTemplateMeta } from "@/lib/templates";
import { updateTemplateAction } from "@/lib/actions/website";
import { initialState } from "@/lib/actions/states";
import { cn } from "@/lib/utils";
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

  // Resolve current selection from the website row.
  const initialTemplateId = website.template_id ?? "";
  const [selectedTemplateId, setSelectedTemplateId] =
    useState(initialTemplateId);

  // Index templates by industry so we can pair each TemplateKey with the
  // matching DB row id (the field actually stored on the website).
  const idByIndustry = new Map<string, string>();
  for (const t of templates) {
    if (t.industry) idByIndustry.set(t.industry, t.id);
  }

  return (
    <form action={formAction}>
      <SectionCard
        title="Design auswählen"
        description="10 fertige Designs, abgestimmt auf typische Branchen. Klick aufs Bild — Farben, Hero-Layout und Wording werden übernommen. Du kannst danach noch alles individuell anpassen."
        footer={
          <>
            <FormStatus state={state} />
            <SubmitButton label="Design übernehmen" />
          </>
        }
      >
        <input
          type="hidden"
          name="template_id"
          value={selectedTemplateId}
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {/* "Standard" tile — no template */}
          <button
            type="button"
            onClick={() => setSelectedTemplateId("")}
            className={cn(
              "group relative flex flex-col gap-3 rounded-xl border p-3 text-left transition-all",
              selectedTemplateId === ""
                ? "ring-primary border-primary bg-primary/5 ring-2"
                : "border-border bg-card hover:border-foreground/30 hover:shadow-sm",
            )}
          >
            <TemplatePreview templateKey="default" hero="centered" />
            <div>
              <div className="text-foreground text-sm font-semibold">
                Standard
              </div>
              <div className="text-muted-foreground mt-0.5 text-xs">
                Neutrales Layout ohne Branchen-Theme
              </div>
            </div>
            {selectedTemplateId === "" ? (
              <ActiveBadge />
            ) : null}
          </button>

          {ALL_TEMPLATE_KEYS.map((key) => {
            const meta = getTemplateMeta(key);
            const id = idByIndustry.get(key) ?? "";
            if (!id) return null; // template not in DB (e.g. seed missing)
            const active = selectedTemplateId === id;
            // Also show a tick if the website's CURRENT template resolves
            // here even when the user hasn't clicked yet (initial state).
            const wasInitiallySelected =
              !active && id === initialTemplateId;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedTemplateId(id)}
                className={cn(
                  "group relative flex flex-col gap-3 rounded-xl border p-3 text-left transition-all",
                  active
                    ? "ring-primary border-primary bg-primary/5 ring-2"
                    : "border-border bg-card hover:border-foreground/30 hover:shadow-sm",
                )}
              >
                <TemplatePreview templateKey={key} hero={meta.hero} />
                <div>
                  <div className="text-foreground text-sm font-semibold">
                    {meta.label}
                  </div>
                  <div className="text-muted-foreground mt-0.5 line-clamp-2 text-xs text-pretty">
                    {meta.defaultHeroSubtitle}
                  </div>
                </div>
                {active || wasInitiallySelected ? <ActiveBadge /> : null}
              </button>
            );
          })}
        </div>
      </SectionCard>
    </form>
  );
}

function ActiveBadge() {
  return (
    <span className="bg-primary text-primary-foreground absolute -top-2 -right-2 inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold">
      <Check className="h-3 w-3" />
    </span>
  );
}

