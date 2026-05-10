"use client";

import Image from "next/image";
import { useActionState, useTransition } from "react";

import { FormStatus } from "@/components/dashboard/form-status";
import { SectionCard } from "@/components/dashboard/section-card";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  removeAboutImageAction,
  uploadAboutImageAction,
} from "@/lib/actions/website";
import { initialState } from "@/lib/actions/states";
import type { WebsiteRow } from "@/types/website";

export function AboutImageForm({ website }: { website: WebsiteRow }) {
  const [state, formAction] = useActionState(
    uploadAboutImageAction,
    initialState,
  );
  const [removing, startRemove] = useTransition();

  return (
    <SectionCard
      title="Über-uns-Bild"
      description="Foto, das neben dem Über-uns-Text auf der Site steht (Räume, Team-Foto, Praxis von außen)."
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

        <form action={formAction} className="flex-1 space-y-3">
          <FormStatus state={state} />
          <div className="space-y-2">
            <Label htmlFor="about_image">Bild hochladen</Label>
            <Input
              id="about_image"
              name="about_image"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif"
              required
            />
            <p className="text-muted-foreground text-xs">
              JPG, PNG, WebP oder AVIF. Max. 4 MB. Wird im Über-uns-Bereich
              neben dem Text angezeigt.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <SubmitButton label="Hochladen" pendingLabel="Lade hoch …" />
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
    </SectionCard>
  );
}
