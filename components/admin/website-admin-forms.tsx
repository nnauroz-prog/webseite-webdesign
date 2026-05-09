"use client";

import { useActionState } from "react";

import { FieldError, FormStatus } from "@/components/dashboard/form-status";
import { SectionCard } from "@/components/dashboard/section-card";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  adminUpdateWebsitePublishAction,
  adminUpdateWebsiteSlugAction,
  adminUpdateWebsiteTemplateAction,
  initialAdminState,
} from "@/lib/actions/admin";
import type { TemplateRow, WebsiteRow } from "@/types/website";

export function AdminPublishForm({ website }: { website: WebsiteRow }) {
  const [state, formAction] = useActionState(
    adminUpdateWebsitePublishAction,
    initialAdminState,
  );
  return (
    <form action={formAction}>
      <SectionCard
        title="Veröffentlichung"
        description="Macht die Website öffentlich erreichbar oder schaltet sie auf privat."
        footer={
          <>
            <FormStatus state={state} />
            <SubmitButton label="Speichern" />
          </>
        }
      >
        <input type="hidden" name="website_id" value={website.id} />
        <div className="flex items-center justify-between gap-4 rounded-lg border p-4">
          <div>
            <div className="text-sm font-medium">
              {website.is_active ? "Öffentlich" : "Privat"}
            </div>
            <p className="text-muted-foreground mt-0.5 text-sm">
              Aktuelle URL:{" "}
              <span className="text-foreground font-mono">
                /site/{website.slug}
              </span>
            </p>
          </div>
          <Switch name="is_active" defaultChecked={website.is_active} />
        </div>
      </SectionCard>
    </form>
  );
}

export function AdminSlugForm({ website }: { website: WebsiteRow }) {
  const [state, formAction] = useActionState(
    adminUpdateWebsiteSlugAction,
    initialAdminState,
  );
  return (
    <form action={formAction}>
      <SectionCard
        title="URL ändern"
        description="Achtung: Bestehende Links auf die alte URL funktionieren danach nicht mehr."
        footer={
          <>
            <FormStatus state={state} />
            <SubmitButton label="URL speichern" />
          </>
        }
      >
        <input type="hidden" name="website_id" value={website.id} />
        <div className="space-y-2">
          <Label htmlFor={`slug-${website.id}`}>URL-Kürzel</Label>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">/site/</span>
            <Input
              id={`slug-${website.id}`}
              name="slug"
              defaultValue={website.slug}
              required
              minLength={3}
              maxLength={63}
              pattern="[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
            />
          </div>
          <FieldError message={state.fieldErrors?.slug} />
        </div>
      </SectionCard>
    </form>
  );
}

export function AdminTemplateForm({
  website,
  templates,
}: {
  website: WebsiteRow;
  templates: TemplateRow[];
}) {
  const [state, formAction] = useActionState(
    adminUpdateWebsiteTemplateAction,
    initialAdminState,
  );
  return (
    <form action={formAction}>
      <SectionCard
        title="Template"
        description="Bestimmt das visuelle Erscheinungsbild der Website."
        footer={
          <>
            <FormStatus state={state} />
            <SubmitButton label="Template übernehmen" />
          </>
        }
      >
        <input type="hidden" name="website_id" value={website.id} />
        <div className="space-y-2">
          <Label htmlFor={`tpl-${website.id}`}>Template</Label>
          <select
            id={`tpl-${website.id}`}
            name="template_id"
            defaultValue={website.template_id ?? ""}
            className="border-input bg-background focus-visible:ring-ring focus-visible:ring-offset-background flex h-10 w-full rounded-md border px-3 text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <option value="">Standard (kein Template)</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} · {t.industry}
              </option>
            ))}
          </select>
        </div>
      </SectionCard>
    </form>
  );
}
