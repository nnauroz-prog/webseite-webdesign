"use client";

import { useActionState, useEffect, useRef } from "react";

import { FieldError, FormStatus } from "@/components/dashboard/form-status";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  adminCreateTemplateAction,
  initialAdminState,
} from "@/lib/actions/admin";

export function TemplateCreateForm() {
  const [state, formAction] = useActionState(
    adminCreateTemplateAction,
    initialAdminState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <FormStatus state={state} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="tpl-name">Name</Label>
          <Input
            id="tpl-name"
            name="name"
            required
            maxLength={120}
            placeholder="z.B. Pflegedienst Modern"
          />
          <FieldError message={state.fieldErrors?.name} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tpl-industry">Branche</Label>
          <Input
            id="tpl-industry"
            name="industry"
            required
            maxLength={60}
            placeholder="pflegedienst | arztpraxis | friseur | …"
          />
          <p className="text-muted-foreground text-xs">
            Klein geschrieben, ohne Sonderzeichen. Bestimmt das visuelle Theme.
          </p>
          <FieldError message={state.fieldErrors?.industry} />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="tpl-preview">Vorschau-Bild URL (optional)</Label>
        <Input
          id="tpl-preview"
          name="preview_image_url"
          type="url"
          maxLength={2000}
          placeholder="https://…"
        />
        <FieldError message={state.fieldErrors?.preview_image_url} />
      </div>
      <SubmitButton label="Template anlegen" pendingLabel="Wird angelegt …" />
    </form>
  );
}
