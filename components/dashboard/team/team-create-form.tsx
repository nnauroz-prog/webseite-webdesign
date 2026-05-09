"use client";

import { useActionState, useEffect, useRef } from "react";

import { FieldError, FormStatus } from "@/components/dashboard/form-status";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createTeamMemberAction, initialTeamState } from "@/lib/actions/team";

export function TeamCreateForm() {
  const [state, formAction] = useActionState(
    createTeamMemberAction,
    initialTeamState,
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="space-y-4">
      <FormStatus state={state} />
      <div className="grid gap-4 sm:grid-cols-[1fr_1fr_120px]">
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" required maxLength={120} />
          <FieldError message={state.fieldErrors?.name} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Rolle</Label>
          <Input
            id="role"
            name="role"
            maxLength={120}
            placeholder="z.B. Pflegedienstleitung"
          />
          <FieldError message={state.fieldErrors?.role} />
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
        <Label htmlFor="bio">Kurz-Bio</Label>
        <Textarea id="bio" name="bio" rows={3} maxLength={2000} />
        <FieldError message={state.fieldErrors?.bio} />
      </div>
      <SubmitButton
        label="Teammitglied anlegen"
        pendingLabel="Wird angelegt …"
      />
    </form>
  );
}
