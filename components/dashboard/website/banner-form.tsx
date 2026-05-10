"use client";

import { useActionState } from "react";

import { FieldError, FormStatus } from "@/components/dashboard/form-status";
import { SectionCard } from "@/components/dashboard/section-card";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { initialState } from "@/lib/actions/states";
import { updateBannerAction } from "@/lib/actions/website";
import type { WebsiteRow } from "@/types/website";

/**
 * Sticky promo banner that sits above the public site's header.
 * Common US-SaaS pattern for announcements, seasonal offers, or
 * "Heute geschlossen". Disabled by default; the switch controls
 * whether the banner is rendered at all.
 */
export function BannerForm({ website }: { website: WebsiteRow }) {
  const [state, formAction] = useActionState(updateBannerAction, initialState);

  return (
    <form action={formAction}>
      <SectionCard
        title="Hinweis-Banner"
        description="Schmaler Balken ganz oben auf deiner Seite — perfekt für Aktionen, Feiertage oder besondere Hinweise."
        footer={
          <>
            <FormStatus state={state} />
            <SubmitButton label="Banner speichern" />
          </>
        }
      >
        <div className="flex items-start justify-between gap-4 rounded-lg border p-4">
          <div>
            <div className="text-sm font-medium">Banner anzeigen</div>
            <p className="text-muted-foreground mt-0.5 text-sm">
              Wenn aus, ist der Balken unsichtbar — Text bleibt gespeichert.
            </p>
          </div>
          <Switch
            name="banner_enabled"
            defaultChecked={website.banner_enabled}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="banner_text">Text</Label>
          <Input
            id="banner_text"
            name="banner_text"
            placeholder="Sommer-Aktion: 20 % auf alle Behandlungen bis 31.08."
            defaultValue={website.banner_text ?? ""}
            maxLength={200}
          />
          <FieldError message={state.fieldErrors?.banner_text} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="banner_link">Link (optional)</Label>
          <Input
            id="banner_link"
            name="banner_link"
            placeholder="#kontakt oder https://…"
            defaultValue={website.banner_link ?? ""}
            inputMode="url"
            autoCapitalize="none"
            spellCheck={false}
          />
          <p className="text-muted-foreground text-xs">
            Wohin der Klick führt. Erlaubt: <code>/seite</code>,{" "}
            <code>#anker</code>, <code>https://…</code>, <code>mailto:</code>{" "}
            oder <code>tel:</code>. Leer = kein Link.
          </p>
          <FieldError message={state.fieldErrors?.banner_link} />
        </div>
      </SectionCard>
    </form>
  );
}
