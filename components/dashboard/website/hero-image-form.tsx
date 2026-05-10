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
  removeHeroImageAction,
  uploadHeroImageAction,
} from "@/lib/actions/website";
import { initialState } from "@/lib/actions/states";
import { processImageForUpload } from "@/lib/image-processing";
import type { WebsiteRow } from "@/types/website";

export function HeroImageForm({ website }: { website: WebsiteRow }) {
  const [state, formAction] = useActionState(
    uploadHeroImageAction,
    initialState,
  );
  const [removing, startRemove] = useTransition();
  const [processing, setProcessing] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    const fileInput = formRef.current?.querySelector<HTMLInputElement>(
      'input[name="hero_image"]',
    );
    const file = fileInput?.files?.[0];
    if (!file) return;

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
      fd.append("hero_image", result.file);
      formAction(fd);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <SectionCard
      title="Hero-Hintergrundbild"
      description="Großes Bild im Header-Bereich. iPhone-Foto oder JPG/PNG — wir verkleinern automatisch."
    >
      <div className="flex flex-col gap-5">
        <div className="bg-muted relative h-44 w-full overflow-hidden rounded-lg border">
          {website.hero_image_url ? (
            <Image
              src={website.hero_image_url}
              alt="Hero-Vorschau"
              fill
              sizes="(min-width: 1024px) 700px, 100vw"
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="text-muted-foreground flex h-full items-center justify-center text-xs">
              Kein Hero-Bild — der Hero zeigt nur Text + Logo
            </div>
          )}
        </div>

        <form
          ref={formRef}
          onSubmit={onSubmit}
          className="space-y-3"
        >
          {clientError ? (
            <p className="text-destructive bg-destructive/10 rounded-md px-3 py-2 text-sm">
              {clientError}
            </p>
          ) : null}
          <FormStatus state={state} />
          <div className="space-y-2">
            <Label htmlFor="hero_image">Bild hochladen</Label>
            <Input
              id="hero_image"
              name="hero_image"
              type="file"
              accept="image/*"
              required
            />
            <p className="text-muted-foreground text-xs">
              Beliebiges Bildformat. Wir resizen auf 2400 px und konvertieren
              zu JPEG, damit es auf jedem Browser funktioniert.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <SubmitButton
              label={processing ? "Verarbeite Bild …" : "Hochladen"}
              pendingLabel="Lade hoch …"
            />
            {website.hero_image_url && (
              <Button
                type="button"
                variant="outline"
                disabled={removing}
                onClick={() =>
                  startRemove(() => {
                    void removeHeroImageAction();
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
        kind="hero"
        placeholder="Z.B. Helle, einladende Aufnahme einer modernen Arztpraxis bei Tageslicht, weite Perspektive, kein Text, redaktioneller Stil."
      />

      <StockPhotoButton
        kind="hero"
        defaultQuery={website.industry ?? website.business_name}
      />
    </SectionCard>
  );
}
