"use client";

import { useActionState, useEffect, useRef } from "react";

import { FieldError, FormStatus } from "@/components/dashboard/form-status";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadGalleryImageAction } from "@/lib/actions/gallery";
import { initialGalleryState } from "@/lib/actions/states";

export function GalleryUploader() {
  const [state, formAction] = useActionState(
    uploadGalleryImageAction,
    initialGalleryState,
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
          <Label htmlFor="image">Bilddatei</Label>
          <Input
            id="image"
            name="image"
            type="file"
            accept="image/png,image/jpeg,image/webp,image/avif"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="alt_text">Alternativtext</Label>
          <Input
            id="alt_text"
            name="alt_text"
            maxLength={200}
            placeholder="z.B. Empfangsbereich der Praxis"
          />
          <FieldError message={state.fieldErrors?.alt_text} />
        </div>
      </div>
      <SubmitButton label="Bild hochladen" pendingLabel="Lade hoch …" />
    </form>
  );
}
