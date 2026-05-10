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
  removeHeroImageAction,
  uploadHeroImageAction,
} from "@/lib/actions/website";
import { initialState } from "@/lib/actions/states";
import type { WebsiteRow } from "@/types/website";

export function HeroImageForm({ website }: { website: WebsiteRow }) {
  const [state, formAction] = useActionState(
    uploadHeroImageAction,
    initialState,
  );
  const [removing, startRemove] = useTransition();

  return (
    <SectionCard
      title="Hero-Hintergrundbild"
      description="Großes Bild im Header-Bereich. Empfohlen: 2400×1200 px, querformatig."
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

        <form action={formAction} className="space-y-3">
          <FormStatus state={state} />
          <div className="space-y-2">
            <Label htmlFor="hero_image">Bild hochladen</Label>
            <Input
              id="hero_image"
              name="hero_image"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif"
              required
            />
            <p className="text-muted-foreground text-xs">
              JPG, PNG, WebP oder AVIF. Max. 4 MB. Wird über die volle Breite
              und in dunklerer Tönung als Hintergrund eingesetzt.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <SubmitButton label="Hochladen" pendingLabel="Lade hoch …" />
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
    </SectionCard>
  );
}
