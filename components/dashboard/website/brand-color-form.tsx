"use client";

import { useActionState, useState } from "react";

import { FieldError, FormStatus } from "@/components/dashboard/form-status";
import { SectionCard } from "@/components/dashboard/section-card";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialState } from "@/lib/actions/states";
import { updateBrandColorAction } from "@/lib/actions/website";
import { cn } from "@/lib/utils";
import type { WebsiteRow } from "@/types/website";

const PRESETS: Array<{ name: string; value: string }> = [
  { name: "Eichengrün", value: "#2a4d3e" },
  { name: "Marine", value: "#1e3a5f" },
  { name: "Weinrot", value: "#7a2828" },
  { name: "Sand", value: "#9a7e3c" },
  { name: "Slate", value: "#3d4a52" },
  { name: "Pflaume", value: "#553a5e" },
  { name: "Espresso", value: "#3a2a1c" },
  { name: "Türkis", value: "#1d6469" },
];

/**
 * Lets a customer override their template's primary color with their
 * own brand color. Empty value resets to template default. We render
 * the chosen color as `--primary` inline on the public site wrapper.
 */
export function BrandColorForm({ website }: { website: WebsiteRow }) {
  const [state, formAction] = useActionState(
    updateBrandColorAction,
    initialState,
  );
  // Local mirror so the swatch + native picker stay in sync without a
  // round-trip on every keystroke.
  const [color, setColor] = useState<string>(
    website.brand_primary_color ?? "",
  );

  const hasOverride = color.trim().length > 0;

  return (
    <form action={formAction}>
      <SectionCard
        title="Eigene Farbe"
        description="Überschreibt die Hauptfarbe deines Templates. Tipp: dunkle Töne wirken seriöser und sorgen für gute Lesbarkeit auf den Buttons."
        footer={
          <>
            <FormStatus state={state} />
            <SubmitButton label="Farbe speichern" />
          </>
        }
      >
        <input
          type="hidden"
          name="brand_primary_color"
          value={color}
        />

        <div className="space-y-3">
          <Label>Farbe wählen</Label>
          <div className="flex flex-wrap items-center gap-3">
            {/* Native color picker */}
            <label
              className="border-border bg-background flex h-12 w-12 cursor-pointer items-center justify-center overflow-hidden rounded-lg border shadow-sm transition hover:shadow-md"
              style={{ backgroundColor: color || undefined }}
              title="Farbe wählen"
            >
              <input
                type="color"
                value={color || "#3a2a1c"}
                onChange={(e) => setColor(e.target.value.toLowerCase())}
                className="h-full w-full cursor-pointer opacity-0"
                aria-label="Farbe wählen"
              />
            </label>
            {/* Hex text input — keeps the picker in sync */}
            <Input
              value={color}
              onChange={(e) => setColor(e.target.value.toLowerCase())}
              placeholder="#2a4d3e"
              maxLength={7}
              className="font-mono w-32"
              spellCheck={false}
              autoCapitalize="none"
              autoCorrect="off"
            />
            {hasOverride && (
              <button
                type="button"
                onClick={() => setColor("")}
                className="text-muted-foreground hover:text-foreground text-xs underline-offset-4 hover:underline"
              >
                Auf Template-Farbe zurücksetzen
              </button>
            )}
          </div>
          <FieldError message={state.fieldErrors?.brand_primary_color} />
        </div>

        <div className="space-y-2">
          <Label className="text-xs uppercase tracking-wide text-muted-foreground">
            Vorgeschlagene Töne
          </Label>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setColor(p.value)}
                className={cn(
                  "group relative inline-flex h-8 w-8 items-center justify-center rounded-full ring-offset-2 transition hover:scale-105",
                  color === p.value
                    ? "ring-foreground/40 ring-2"
                    : "ring-border ring-1",
                )}
                style={{ backgroundColor: p.value }}
                title={`${p.name} (${p.value})`}
                aria-label={p.name}
              />
            ))}
          </div>
        </div>
      </SectionCard>
    </form>
  );
}
