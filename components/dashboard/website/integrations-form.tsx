"use client";

import { useActionState } from "react";

import { FieldError, FormStatus } from "@/components/dashboard/form-status";
import { SectionCard } from "@/components/dashboard/section-card";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialState } from "@/lib/actions/states";
import { updateIntegrationsAction } from "@/lib/actions/website";
import type { WebsiteRow } from "@/types/website";

export function IntegrationsForm({ website }: { website: WebsiteRow }) {
  const [state, formAction] = useActionState(
    updateIntegrationsAction,
    initialState,
  );

  return (
    <form action={formAction}>
      <SectionCard
        title="Suchmaschinen & Analyse"
        description="Verifizierungs-Codes und Tracking-IDs aus Google Search Console, Bing Webmaster Tools und Google Analytics."
        footer={
          <>
            <FormStatus state={state} />
            <SubmitButton label="Speichern" />
          </>
        }
      >
        <div className="space-y-2">
          <Label htmlFor="seo_google_site_verification">
            Google Search Console Verification
          </Label>
          <Input
            id="seo_google_site_verification"
            name="seo_google_site_verification"
            placeholder="abc123_yourcodeXYZ"
            defaultValue={website.seo_google_site_verification ?? ""}
            className="font-mono text-xs"
          />
          <p className="text-muted-foreground text-xs">
            Aus Google Search Console → „HTML-Tag" Methode. Nur den Wert
            zwischen <code>content=&quot;…&quot;</code> einfügen.
          </p>
          <FieldError
            message={state.fieldErrors?.seo_google_site_verification}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="seo_bing_site_verification">
            Bing Webmaster Tools Verification
          </Label>
          <Input
            id="seo_bing_site_verification"
            name="seo_bing_site_verification"
            placeholder="optional"
            defaultValue={website.seo_bing_site_verification ?? ""}
            className="font-mono text-xs"
          />
          <p className="text-muted-foreground text-xs">
            Aus Bing Webmaster Tools → Meta-Tag Methode. Optional — Bing
            akzeptiert auch Sitemaps.
          </p>
          <FieldError
            message={state.fieldErrors?.seo_bing_site_verification}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="analytics_ga4_id">
            Google Analytics 4 (Measurement-ID)
          </Label>
          <Input
            id="analytics_ga4_id"
            name="analytics_ga4_id"
            placeholder="G-XXXXXXXXXX"
            defaultValue={website.analytics_ga4_id ?? ""}
            className="font-mono text-xs"
          />
          <p className="text-muted-foreground text-xs">
            Beginnt mit „G-". Aus Google Analytics → Verwaltung → Datenströme
            → Web. Wir laden gtag.js automatisch nur auf der öffentlichen
            Seite, nie im Vorschau-Modus.
          </p>
          <FieldError message={state.fieldErrors?.analytics_ga4_id} />
        </div>
      </SectionCard>
    </form>
  );
}
