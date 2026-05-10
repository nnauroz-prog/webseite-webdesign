"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { AiImageButton } from "@/components/dashboard/ai-image-button";
import { FieldError, FormStatus } from "@/components/dashboard/form-status";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { uploadGalleryImageAction } from "@/lib/actions/gallery";
import { initialGalleryState } from "@/lib/actions/states";
import { processImageForUpload } from "@/lib/image-processing";

export function GalleryUploader() {
  const [state, formAction] = useActionState(
    uploadGalleryImageAction,
    initialGalleryState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [processing, setProcessing] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    const fileInput = formRef.current?.querySelector<HTMLInputElement>(
      'input[name="image"]',
    );
    const file = fileInput?.files?.[0];
    if (!file) return;
    const altInput = formRef.current?.querySelector<HTMLInputElement>(
      'input[name="alt_text"]',
    );

    e.preventDefault();
    setClientError(null);
    setProcessing(true);
    try {
      const result = await processImageForUpload(file, { maxSize: 2400 });
      if (!result.ok) {
        setClientError(result.message);
        return;
      }
      const fd = new FormData();
      fd.append("image", result.file);
      fd.append("alt_text", altInput?.value ?? "");
      formAction(fd);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="space-y-4"
      >
        {clientError ? (
          <p className="text-destructive bg-destructive/10 rounded-md px-3 py-2 text-sm">
            {clientError}
          </p>
        ) : null}
        <FormStatus state={state} />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="image">Bilddatei</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              required
            />
            <p className="text-muted-foreground text-xs">
              Beliebiges Format — wird automatisch zu JPEG verkleinert.
            </p>
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
        <SubmitButton
          label={processing ? "Verarbeite Bild …" : "Bild hochladen"}
          pendingLabel="Lade hoch …"
        />
      </form>

      {/* Outside the upload form so the embedded <form> in
          AiImageButton doesn't nest. */}
      <AiImageButton
        kind="gallery"
        placeholder="Z.B. Detailaufnahme eines frischen Schnittes im Salon, weiches Licht, redaktioneller Stil."
      />
    </>
  );
}
