"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import { FieldError, FormStatus } from "@/components/dashboard/form-status";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialState } from "@/lib/actions/states";
import { createPageAction } from "@/lib/actions/pages";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 63);
}

export function PageCreateForm() {
  const [state, formAction] = useActionState(createPageAction, initialState);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
      setTitle("");
      setSlug("");
      setSlugTouched(false);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <FormStatus state={state} />

      <div className="space-y-2">
        <Label htmlFor="page_title">Titel</Label>
        <Input
          id="page_title"
          name="title"
          required
          maxLength={120}
          placeholder="z.B. Über uns"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (!slugTouched) setSlug(slugify(e.target.value));
          }}
          aria-invalid={Boolean(state.fieldErrors?.title) || undefined}
        />
        <FieldError message={state.fieldErrors?.title} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="page_slug">URL-Kürzel</Label>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground shrink-0 text-sm">
            /site/.../
          </span>
          <Input
            id="page_slug"
            name="slug"
            required
            minLength={1}
            maxLength={63}
            placeholder="ueber-uns"
            pattern="[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value.toLowerCase());
              setSlugTouched(true);
            }}
            aria-invalid={Boolean(state.fieldErrors?.slug) || undefined}
            className="font-mono"
          />
        </div>
        <p className="text-muted-foreground text-xs">
          Wird automatisch aus dem Titel abgeleitet, kannst du überschreiben.
        </p>
        <FieldError message={state.fieldErrors?.slug} />
      </div>

      <SubmitButton label="Seite anlegen" pendingLabel="Wird angelegt …" />
    </form>
  );
}
