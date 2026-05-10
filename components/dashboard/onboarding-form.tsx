"use client";

import { useActionState, useState } from "react";

import { FieldError, FormStatus } from "@/components/dashboard/form-status";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialState } from "@/lib/actions/states";
import { createWebsiteAction } from "@/lib/actions/website";
import { ALL_TEMPLATE_KEYS, getTemplateMeta, type TemplateKey } from "@/lib/templates";
import { cn } from "@/lib/utils";
import type { TemplateRow } from "@/types/website";

const SAMPLE_FOR_KEY: Record<TemplateKey, { headline: string; bullet: string }> = {
  default: {
    headline: "Willkommen bei [Firmenname]",
    bullet: "3 Beispiel-Leistungen, leerer Team-Bereich",
  },
  pflegedienst: {
    headline: "Pflege mit Herz, Erfahrung und Verlässlichkeit",
    bullet: "5 Pflege-Leistungen, 3 Mitarbeiter:innen, 24/7-Öffnungszeiten",
  },
  arztpraxis: {
    headline: "Moderne Medizin, persönliche Betreuung",
    bullet: "5 Praxis-Leistungen, 2 Ärzt:innen, geteilte Sprechzeiten",
  },
  friseur: {
    headline: "Stil, Schnitt und Präzision",
    bullet: "4 Salon-Leistungen mit Preisen, 2 Friseur:innen",
  },
  physio: {
    headline: "Bewegung. Therapie. Lebensqualität.",
    bullet: "5 Therapie-Leistungen, 2 Therapeut:innen",
  },
  zahnarzt: {
    headline: "Sanfte Zahnmedizin für ein gesundes Lächeln",
    bullet: "5 Behandlungen, 2 Zahnärzt:innen, geteilte Sprechstunden",
  },
  reinigung: {
    headline: "Saubere Räume. Zuverlässig. Gründlich.",
    bullet: "5 Service-Pakete, 24/7-Notdienst",
  },
  schreiner: {
    headline: "Maßarbeit aus Holz",
    bullet: "5 Schreiner-Leistungen, 2 Mitarbeiter, Werkstatt-Zeiten",
  },
  kosmetik: {
    headline: "Auszeit für Sie und Ihre Haut",
    bullet: "5 Behandlungen, 1 Kosmetikerin",
  },
};

export function OnboardingForm({ templates }: { templates: TemplateRow[] }) {
  const [state, formAction] = useActionState(createWebsiteAction, initialState);
  const [selectedKey, setSelectedKey] = useState<TemplateKey>("pflegedienst");

  // Map a template key to the matching DB row id (templates seeded by schema.sql).
  const templateIdByIndustry = new Map<string, string>();
  for (const t of templates) {
    if (t.industry) templateIdByIndustry.set(t.industry, t.id);
  }
  const selectedTemplateId = templateIdByIndustry.get(selectedKey) ?? "";

  return (
    <form action={formAction} className="space-y-6">
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

      {/* Visual template picker — replaces the old dropdown */}
      <div className="space-y-3">
        <Label>Branche</Label>
        <p className="text-muted-foreground text-xs">
          Wähle deine Branche — wir richten Theme, Beispiel-Leistungen,
          Team-Texte und Öffnungszeiten passend ein.
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {ALL_TEMPLATE_KEYS.map((key) => {
            const meta = getTemplateMeta(key);
            const sample = SAMPLE_FOR_KEY[key];
            const active = selectedKey === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedKey(key)}
                className={cn(
                  "border-border bg-background hover:border-foreground/40 group relative flex flex-col rounded-xl border p-4 text-left transition-colors",
                  active && "ring-primary border-primary ring-2",
                )}
                data-template={key}
              >
                {/* color swatch derived from the template's CSS theme */}
                <div className="bg-primary mb-3 h-10 w-full rounded-md" />
                <div className="text-foreground text-sm font-semibold">
                  {meta.label}
                </div>
                <div className="text-muted-foreground mt-1 line-clamp-2 text-xs text-pretty">
                  {sample.bullet}
                </div>
                {active ? (
                  <span className="bg-primary text-primary-foreground absolute -top-2 -right-2 inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold">
                    ✓
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
        <input type="hidden" name="industry" value={selectedKey} />
        <input type="hidden" name="template_id" value={selectedTemplateId} />
        <FieldError message={state.fieldErrors?.industry} />
        <FieldError message={state.fieldErrors?.template_id} />
      </div>

      <div className="border-border bg-muted/30 rounded-lg border p-4">
        <p className="text-muted-foreground text-xs tracking-wide uppercase">
          Vorschau
        </p>
        <p className="text-foreground mt-2 text-base font-semibold tracking-tight">
          {SAMPLE_FOR_KEY[selectedKey].headline}
        </p>
        <p className="text-muted-foreground mt-1 text-sm">
          {SAMPLE_FOR_KEY[selectedKey].bullet}
        </p>
      </div>

      <SubmitButton
        label="Website anlegen — mit Beispiel-Inhalten"
        pendingLabel="Wird angelegt …"
      />
    </form>
  );
}
