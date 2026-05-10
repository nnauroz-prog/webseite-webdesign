"use client";

import Image from "next/image";
import { useActionState, useRef, useState, useTransition } from "react";

import { FormStatus } from "@/components/dashboard/form-status";
import { SectionCard } from "@/components/dashboard/section-card";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  removeLogoAction,
  uploadLogoAction,
} from "@/lib/actions/website";
import { initialState } from "@/lib/actions/states";
import { processImageForUpload } from "@/lib/image-processing";
import type { WebsiteRow } from "@/types/website";

export function LogoForm({ website }: { website: WebsiteRow }) {
  const [state, formAction] = useActionState(uploadLogoAction, initialState);
  const [removing, startRemove] = useTransition();
  const [processing, setProcessing] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  /**
   * Intercept submit, downscale + JPEG-encode the picked file in the
   * browser, then submit a fresh FormData with the smaller file. This
   * is what makes phone photos (3-5 MB / HEIC) "just work" — they get
   * turned into a normal JPEG ≤ 1.5 MB before the server even sees them.
   */
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    const fileInput = formRef.current?.querySelector<HTMLInputElement>(
      'input[name="logo"]',
    );
    const file = fileInput?.files?.[0];
    if (!file) return; // let the native required-validation handle it

    e.preventDefault();
    setClientError(null);
    setProcessing(true);
    try {
      const result = await processImageForUpload(file, { maxSize: 1600 });
      if (!result.ok) {
        setClientError(result.message);
        return;
      }
      const fd = new FormData();
      fd.append("logo", result.file);
      formAction(fd);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <SectionCard
      title="Logo"
      description="JPG, PNG, WebP, AVIF oder iPhone-Foto. Wir verkleinern automatisch — du musst dir keine Sorgen um die Dateigröße machen."
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="bg-muted flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-lg border">
          {website.logo_url ? (
            <Image
              src={website.logo_url}
              alt={`${website.business_name} Logo`}
              width={112}
              height={112}
              className="h-full w-full object-contain"
              unoptimized
            />
          ) : (
            <span className="text-muted-foreground text-xs">Kein Logo</span>
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
            <Label htmlFor="logo">Neues Logo hochladen</Label>
            <Input
              id="logo"
              name="logo"
              type="file"
              accept="image/*"
              required
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <SubmitButton
              label={processing ? "Verarbeite Bild …" : "Hochladen"}
              pendingLabel="Lade hoch …"
            />
            {website.logo_url && (
              <Button
                type="button"
                variant="outline"
                disabled={removing}
                onClick={() =>
                  startRemove(() => {
                    void removeLogoAction();
                  })
                }
              >
                {removing ? "Entferne …" : "Logo entfernen"}
              </Button>
            )}
          </div>
        </form>
      </div>
    </SectionCard>
  );
}
