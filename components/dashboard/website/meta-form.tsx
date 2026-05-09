"use client";

import { useActionState } from "react";

import { FieldError, FormStatus } from "@/components/dashboard/form-status";
import { SectionCard } from "@/components/dashboard/section-card";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { initialState, updateWebsiteMetaAction } from "@/lib/actions/website";
import type { WebsiteRow } from "@/types/website";

export function MetaForm({ website }: { website: WebsiteRow }) {
  const [state, formAction] = useActionState(
    updateWebsiteMetaAction,
    initialState,
  );

  return (
    <form action={formAction}>
      <SectionCard
        title="Stammdaten"
        description="Diese Angaben erscheinen im Footer und auf den Kontaktbereichen deiner Website."
        footer={
          <>
            <FormStatus state={state} />
            <SubmitButton label="Speichern" />
          </>
        }
      >
        <div className="space-y-2">
          <Label htmlFor="business_name">Firmenname</Label>
          <Input
            id="business_name"
            name="business_name"
            defaultValue={website.business_name}
            required
            maxLength={120}
          />
          <FieldError message={state.fieldErrors?.business_name} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="industry">Branche</Label>
            <Input
              id="industry"
              name="industry"
              defaultValue={website.industry ?? ""}
              maxLength={60}
            />
            <FieldError message={state.fieldErrors?.industry} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              defaultValue={website.phone ?? ""}
              maxLength={40}
            />
            <FieldError message={state.fieldErrors?.phone} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Kontakt-E-Mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={website.email ?? ""}
            />
            <FieldError message={state.fieldErrors?.email} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              name="address"
              defaultValue={website.address ?? ""}
              maxLength={500}
            />
            <FieldError message={state.fieldErrors?.address} />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="opening_hours_text">Öffnungszeiten</Label>
          <Textarea
            id="opening_hours_text"
            name="opening_hours_text"
            rows={4}
            maxLength={500}
            defaultValue={website.opening_hours?.text ?? ""}
            placeholder="Mo–Fr 8:00–18:00 Uhr&#10;Sa 9:00–13:00 Uhr"
          />
          <FieldError message={state.fieldErrors?.opening_hours_text} />
        </div>
      </SectionCard>
    </form>
  );
}
