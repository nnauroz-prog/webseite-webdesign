"use client";

import Image from "next/image";
import { useActionState, useRef, useState, useTransition } from "react";

import { AiImageButton } from "@/components/dashboard/ai-image-button";
import { FormStatus } from "@/components/dashboard/form-status";
import { SectionCard } from "@/components/dashboard/section-card";
import { StockPhotoButton } from "@/components/dashboard/website/stock-photo-button";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  removeAboutImageAction,
  uploadAboutImageAction,
} from "@/lib/actions/website";
import { initialState } from "@/lib/actions/states";
import { processImageForUpload } from "@/lib/image-processing";
import type { WebsiteRow } from "@/types/website";

export function AboutImageForm({ website }: { website: WebsiteRow }) {
  const [state, formAction] = useActionState(
    uploadAboutImageAction,
    initialState,
  );
  const [removing, startRemove] = useTransition();
  const [processing, setProcessing] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    const fileInput = formRef.current?.querySelector<HTMLInputElement>(
      'input[name="about_image"]',
    );
    const file = fileInput?.files?.[0];
    if (!file) return;

    e.preventDefault();
    setClientError(null);
    setProcessing(true);
    try {
      const result = await processImageForUpload(file, { maxSize: 1800 });
      if (!result.ok) {
        setClientError(result.message);
        return;
      }
      const fd = new FormData();
      fd.append("about_image", result.file);
      formAction(fd);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <SectionCard
      title="Über-uns-Bild"
      description="Foto neben dem Über-uns-Text. iPhone-Foto oder JPG/PNG — wir verkleinern automatisch."
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="bg-muted relative h-40 w-full shrink-0 overflow-hidden rounded-lg border sm:h-44 sm:w-56">
          {website.about_image_url ? (
            <Image
              src={website.about_image_url}
              alt="Über-uns-Vorschau"
              fill
              sizes="(min-width: 640px) 224px, 100vw"
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="text-muted-foreground flex h-full items-center justify-center text-center text-xs">
              Kein Bild
            </div>
          )}
        </div>

        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="flex-1 space-y-3"
        >
          {clientError ? (
            <p className="text-destructive bg-destructive/10 rounded-md px-3 py-2 text-sm">
              {clientError}
            </p>
          ) : null}
          <FormStatus state={state} />
          <div className="space-y-2">
            <Label htmlFor="about_image">Bild hochladen</Label>
            <Input
              id="about_image"
              name="about_image"
              type="file"
              accept="image/*"
              required
            />
            <p className="text-muted-foreground text-xs">
              Beliebiges Bildformat. Wir resizen auf 1800 px und konvertieren
              zu JPEG.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <SubmitButton
              label={processing ? "Verarbeite Bild …" : "Hochladen"}
              pendingLabel="Lade hoch …"
            />
            {website.about_image_url && (
              <Button
                type="button"
                variant="outline"
                disabled={removing}
                onClick={() =>
                  startRemove(() => {
                    void removeAboutImageAction();
                  })
                }
              >
                {removing ? "Entferne …" : "Bild entfernen"}
              </Button>
            )}
          </div>
        </form>
      </div>

      <AiImageButton
        kind="about"
        placeholder="Z.B. Authentisches Team-Foto eines deutschen Friseursalons, vier Personen lächelnd, Tageslicht, hochformat."
      />

      <StockPhotoButton
        kind="about"
        defaultQuery={website.industry ?? website.business_name}
      />
    </SectionCard>
  );
}
