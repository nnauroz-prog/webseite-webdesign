"use client";

import { useActionState, useEffect, useRef } from "react";

import { FieldError, FormStatus } from "@/components/dashboard/form-status";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createServiceAction } from "@/lib/actions/services";
import { initialServiceState } from "@/lib/actions/states";

export function ServiceCreateForm() {
  const [state, formAction] = useActionState(
    createServiceAction,
    initialServiceState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <FormStatus state={state} />
      <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
        <div className="space-y-2">
          <Label htmlFor="title">Titel</Label>
          <Input
            id="title"
            name="title"
            required
            maxLength={120}
            placeholder="Grundpflege"
          />
          <FieldError message={state.fieldErrors?.title} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sort_order">Reihenfolge</Label>
          <Input
            id="sort_order"
            name="sort_order"
            type="number"
            min={0}
            max={9999}
            defaultValue={0}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Beschreibung</Label>
        <Textarea
          id="description"
          name="description"
          rows={3}
          maxLength={2000}
        />
        <FieldError message={state.fieldErrors?.description} />
      </div>
      <SubmitButton label="Leistung anlegen" pendingLabel="Wird angelegt …" />
    </form>
  );
}
