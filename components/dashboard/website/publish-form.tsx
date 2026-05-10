"use client";

import Link from "next/link";
import { useActionState } from "react";

import { FormStatus } from "@/components/dashboard/form-status";
import { SectionCard } from "@/components/dashboard/section-card";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Switch } from "@/components/ui/switch";
import { updatePublishAction } from "@/lib/actions/website";
import { initialState } from "@/lib/actions/states";
import type { WebsiteRow } from "@/types/website";

export function PublishForm({ website }: { website: WebsiteRow }) {
  const [state, formAction] = useActionState(updatePublishAction, initialState);

  return (
    <form action={formAction}>
      <SectionCard
        title="Veröffentlichen"
        description="Solange privat, ist deine Website nicht öffentlich erreichbar."
        footer={
          <>
            <FormStatus state={state} />
            <SubmitButton label="Speichern" />
          </>
        }
      >
        <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
          <div>
            <div className="text-sm font-medium">
              {website.is_active ? "Öffentlich" : "Privat"}
            </div>
            <p className="text-muted-foreground mt-0.5 text-sm">
              Öffentliche URL:{" "}
              <Link
                href={`/site/${website.slug}`}
                target="_blank"
                rel="noreferrer"
                className="text-foreground font-mono underline"
              >
                /site/{website.slug}
              </Link>
            </p>
          </div>
          <Switch name="is_active" defaultChecked={website.is_active} />
        </div>
      </SectionCard>
    </form>
  );
}
