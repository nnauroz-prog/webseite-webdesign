"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { Sparkles } from "lucide-react";

import { FormStatus } from "@/components/dashboard/form-status";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { initialState } from "@/lib/actions/states";
import { generateAiImageAction } from "@/lib/actions/ai-image";
import type { ImageKind } from "@/lib/ai-images";

/**
 * Inline "✨ KI generieren" panel embedded in the upload forms.
 *
 * Collapsible:
 *   - Shows a single "KI-Bild generieren" button by default.
 *   - On click, expands a textarea where the user can type or
 *     refine the prompt. An empty textarea uses our industry-aware
 *     default (built server-side).
 */
export function AiImageButton({
  kind,
  placeholder,
}: {
  kind: ImageKind;
  placeholder: string;
}) {
  const [state, formAction] = useActionState(
    generateAiImageAction,
    initialState,
  );
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <div className="border-border/60 bg-secondary/40 mt-4 rounded-lg border-2 border-dashed p-4">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="hover:text-primary inline-flex items-center gap-2 text-sm font-medium transition-colors"
        >
          <span className="from-primary inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br to-amber-700 text-white">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          Lass das Bild von KI generieren
        </button>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="border-primary/40 bg-primary/[0.04] mt-4 rounded-lg border-2 p-4"
    >
      <input type="hidden" name="kind" value={kind} />

      <div className="mb-3 flex items-center justify-between gap-2">
        <span className="text-foreground inline-flex items-center gap-2 text-sm font-semibold">
          <span className="from-primary inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br to-amber-700 text-white">
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          KI generieren
        </span>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-muted-foreground hover:text-foreground text-xs underline-offset-4 hover:underline"
        >
          Abbrechen
        </button>
      </div>

      <div className="space-y-2">
        <Label htmlFor={`ai-prompt-${kind}`}>
          Beschreibung (optional)
        </Label>
        <Textarea
          id={`ai-prompt-${kind}`}
          name="prompt"
          rows={3}
          maxLength={1500}
          placeholder={placeholder}
          className="text-sm"
        />
        <p className="text-muted-foreground text-xs">
          Leer lassen, um eine passende Beschreibung anhand deiner Branche
          automatisch zu nutzen. Generierung dauert 5-15 Sekunden.
        </p>
      </div>

      <div className="mt-3">
        <FormStatus state={state} />
      </div>

      <div className="mt-3">
        <GenerateButton />
      </div>
    </form>
  );
}

function GenerateButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      <Sparkles className="mr-2 h-4 w-4" />
      {pending ? "Generiere Bild …" : "Bild jetzt generieren"}
    </Button>
  );
}
