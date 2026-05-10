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
  removeLogoAction,
  uploadLogoAction,
} from "@/lib/actions/website";
import { initialState } from "@/lib/actions/states";
import type { WebsiteRow } from "@/types/website";

export function LogoForm({ website }: { website: WebsiteRow }) {
  const [state, formAction] = useActionState(uploadLogoAction, initialState);
  const [removing, startRemove] = useTransition();

  return (
    <SectionCard
      title="Logo"
      description="JPG, PNG, WebP oder AVIF. Maximal 4 MB."
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

        <form action={formAction} className="flex-1 space-y-3">
          <FormStatus state={state} />
          <div className="space-y-2">
            <Label htmlFor="logo">Neues Logo hochladen</Label>
            <Input
              id="logo"
              name="logo"
              type="file"
              accept="image/png,image/jpeg,image/webp,image/avif"
              required
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <SubmitButton label="Hochladen" pendingLabel="Lade hoch …" />
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
