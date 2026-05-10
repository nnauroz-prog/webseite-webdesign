"use client";

import { useActionState } from "react";

import { FieldError, FormStatus } from "@/components/dashboard/form-status";
import { SectionCard } from "@/components/dashboard/section-card";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { initialState } from "@/lib/actions/states";
import { updateWhatsappAction } from "@/lib/actions/website";
import type { WebsiteRow } from "@/types/website";

/**
 * Configure the floating WhatsApp button shown on the public site.
 * Leaving the number empty hides the button entirely. The message is
 * pre-filled into the chat so visitors don't have to think about what
 * to write.
 */
export function WhatsappForm({ website }: { website: WebsiteRow }) {
  const [state, formAction] = useActionState(
    updateWhatsappAction,
    initialState,
  );

  return (
    <form action={formAction}>
      <SectionCard
        title="WhatsApp-Button"
        description="Schwebender WhatsApp-Knopf unten rechts auf deiner Seite. Direkter Draht — Anfragen kommen sofort aufs Handy."
        footer={
          <>
            <FormStatus state={state} />
            <SubmitButton label="WhatsApp speichern" />
          </>
        }
      >
        <div className="space-y-2">
          <Label htmlFor="whatsapp_number">Nummer</Label>
          <Input
            id="whatsapp_number"
            name="whatsapp_number"
            placeholder="+49 170 1234567"
            defaultValue={website.whatsapp_number ?? ""}
            inputMode="tel"
            autoComplete="tel"
            maxLength={20}
          />
          <p className="text-muted-foreground text-xs">
            Mit Ländercode (z.B. +49 für Deutschland). Leer lassen, um den
            Button zu deaktivieren.
          </p>
          <FieldError message={state.fieldErrors?.whatsapp_number} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsapp_message">Vorgefüllte Nachricht</Label>
          <Textarea
            id="whatsapp_message"
            name="whatsapp_message"
            rows={3}
            placeholder={`Hallo ${website.business_name}, ich habe eine Frage:`}
            defaultValue={website.whatsapp_message ?? ""}
            maxLength={400}
          />
          <p className="text-muted-foreground text-xs">
            Wird automatisch ins Chatfenster eingefügt, wenn jemand klickt.
            Leer lassen für unseren Vorschlag.
          </p>
          <FieldError message={state.fieldErrors?.whatsapp_message} />
        </div>
      </SectionCard>
    </form>
  );
}
