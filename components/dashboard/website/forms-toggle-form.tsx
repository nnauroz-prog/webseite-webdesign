"use client";

import { useActionState } from "react";

import { FormStatus } from "@/components/dashboard/form-status";
import { SectionCard } from "@/components/dashboard/section-card";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Switch } from "@/components/ui/switch";
import { initialState, updateFormsAction } from "@/lib/actions/website";
import type { WebsiteRow } from "@/types/website";

export function FormsToggleForm({ website }: { website: WebsiteRow }) {
  const [state, formAction] = useActionState(updateFormsAction, initialState);

  return (
    <form action={formAction}>
      <SectionCard
        title="Formulare"
        description="Aktiviere oder deaktiviere die öffentlichen Formulare auf deiner Website."
        footer={
          <>
            <FormStatus state={state} />
            <SubmitButton label="Speichern" />
          </>
        }
      >
        <ToggleRow
          name="contact_form_enabled"
          title="Kontaktformular"
          description="Besucher können dir Anfragen schicken."
          defaultChecked={website.contact_form_enabled}
        />
        <ToggleRow
          name="application_form_enabled"
          title="Bewerbungsformular"
          description="Besucher können sich auf offene Stellen bewerben."
          defaultChecked={website.application_form_enabled}
        />
      </SectionCard>
    </form>
  );
}

function ToggleRow({
  name,
  title,
  description,
  defaultChecked,
}: {
  name: string;
  title: string;
  description: string;
  defaultChecked: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
      <div>
        <div className="text-sm font-medium">{title}</div>
        <p className="text-muted-foreground mt-0.5 text-sm">{description}</p>
      </div>
      <Switch name={name} defaultChecked={defaultChecked} />
    </div>
  );
}
