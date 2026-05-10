"use client";

import { useActionState, useTransition } from "react";

import { FieldError, FormStatus } from "@/components/dashboard/form-status";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteServiceAction,
  updateServiceAction,
} from "@/lib/actions/services";
import { initialServiceState } from "@/lib/actions/states";
import type { ServiceRow as ServiceModel } from "@/types/website";

export function ServiceRow({ service }: { service: ServiceModel }) {
  const [updateState, updateAction] = useActionState(
    updateServiceAction,
    initialServiceState,
  );
  const [deleting, startDelete] = useTransition();

  return (
    <div className="space-y-3 rounded-lg border p-4">
      <form action={updateAction} className="space-y-4">
        <input type="hidden" name="id" value={service.id} />
        <FormStatus state={updateState} />
        <div className="grid gap-4 sm:grid-cols-[1fr_120px]">
          <div className="space-y-2">
            <Label htmlFor={`title-${service.id}`}>Titel</Label>
            <Input
              id={`title-${service.id}`}
              name="title"
              defaultValue={service.title}
              required
              maxLength={120}
            />
            <FieldError message={updateState.fieldErrors?.title} />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`sort-${service.id}`}>Reihenfolge</Label>
            <Input
              id={`sort-${service.id}`}
              name="sort_order"
              type="number"
              min={0}
              max={9999}
              defaultValue={service.sort_order}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`desc-${service.id}`}>Beschreibung</Label>
          <Textarea
            id={`desc-${service.id}`}
            name="description"
            rows={3}
            maxLength={2000}
            defaultValue={service.description ?? ""}
          />
          <FieldError message={updateState.fieldErrors?.description} />
        </div>
        <div className="flex justify-end">
          <SubmitButton label="Aktualisieren" />
        </div>
      </form>

      <div className="flex justify-end border-t pt-3">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={deleting}
          onClick={() => {
            if (!confirm("Diese Leistung wirklich löschen?")) return;
            const fd = new FormData();
            fd.append("id", service.id);
            startDelete(() => {
              void deleteServiceAction(undefined, fd);
            });
          }}
        >
          {deleting ? "Lösche …" : "Leistung löschen"}
        </Button>
      </div>
    </div>
  );
}
