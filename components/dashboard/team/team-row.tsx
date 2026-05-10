"use client";

import Image from "next/image";
import { useActionState, useRef, useState, useTransition } from "react";

import { FieldError, FormStatus } from "@/components/dashboard/form-status";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  deleteTeamMemberAction,
  updateTeamMemberAction,
  uploadTeamImageAction,
} from "@/lib/actions/team";
import { initialTeamState } from "@/lib/actions/states";
import { processImageForUpload } from "@/lib/image-processing";
import type { TeamMemberRow as TeamModel } from "@/types/website";

export function TeamRow({ member }: { member: TeamModel }) {
  const [updateState, updateAction] = useActionState(
    updateTeamMemberAction,
    initialTeamState,
  );
  const [imageState, imageAction] = useActionState(
    uploadTeamImageAction,
    initialTeamState,
  );
  const [deleting, startDelete] = useTransition();
  const [processing, setProcessing] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);
  const imageFormRef = useRef<HTMLFormElement>(null);

  async function onImageSubmit(e: React.FormEvent<HTMLFormElement>) {
    const fileInput = imageFormRef.current?.querySelector<HTMLInputElement>(
      'input[name="image"]',
    );
    const file = fileInput?.files?.[0];
    if (!file) return;

    e.preventDefault();
    setClientError(null);
    setProcessing(true);
    try {
      const result = await processImageForUpload(file, { maxSize: 1200 });
      if (!result.ok) {
        setClientError(result.message);
        return;
      }
      const fd = new FormData();
      fd.append("member_id", member.id);
      fd.append("image", result.file);
      imageAction(fd);
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div className="space-y-4 rounded-lg border p-4">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="bg-muted flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-md border">
          {member.image_url ? (
            <Image
              src={member.image_url}
              alt={member.name}
              width={96}
              height={96}
              className="h-full w-full object-cover"
              unoptimized
            />
          ) : (
            <span className="text-muted-foreground text-xs">Kein Foto</span>
          )}
        </div>
        <form
          ref={imageFormRef}
          onSubmit={onImageSubmit}
          className="flex-1 space-y-2"
        >
          <input type="hidden" name="member_id" value={member.id} />
          {clientError ? (
            <p className="text-destructive bg-destructive/10 rounded-md px-3 py-2 text-sm">
              {clientError}
            </p>
          ) : null}
          <FormStatus state={imageState} />
          <Label htmlFor={`image-${member.id}`}>Foto</Label>
          <div className="flex flex-wrap items-center gap-2">
            <Input
              id={`image-${member.id}`}
              name="image"
              type="file"
              accept="image/*"
              className="flex-1"
              required
            />
            <SubmitButton
              label={processing ? "Verarbeite Bild …" : "Foto hochladen"}
              pendingLabel="Lade hoch …"
              variant="outline"
              size="sm"
            />
          </div>
        </form>
      </div>

      <form action={updateAction} className="space-y-4">
        <input type="hidden" name="id" value={member.id} />
        <FormStatus state={updateState} />
        <div className="grid gap-4 sm:grid-cols-[1fr_1fr_120px]">
          <div className="space-y-2">
            <Label htmlFor={`name-${member.id}`}>Name</Label>
            <Input
              id={`name-${member.id}`}
              name="name"
              defaultValue={member.name}
              required
              maxLength={120}
            />
            <FieldError message={updateState.fieldErrors?.name} />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`role-${member.id}`}>Rolle</Label>
            <Input
              id={`role-${member.id}`}
              name="role"
              defaultValue={member.role ?? ""}
              maxLength={120}
            />
            <FieldError message={updateState.fieldErrors?.role} />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`sort-${member.id}`}>Reihenfolge</Label>
            <Input
              id={`sort-${member.id}`}
              name="sort_order"
              type="number"
              min={0}
              max={9999}
              defaultValue={member.sort_order}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`bio-${member.id}`}>Kurz-Bio</Label>
          <Textarea
            id={`bio-${member.id}`}
            name="bio"
            rows={3}
            maxLength={2000}
            defaultValue={member.bio ?? ""}
          />
          <FieldError message={updateState.fieldErrors?.bio} />
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
            if (!confirm(`„${member.name}" wirklich löschen?`)) return;
            const fd = new FormData();
            fd.append("id", member.id);
            startDelete(() => {
              void deleteTeamMemberAction(undefined, fd);
            });
          }}
        >
          {deleting ? "Lösche …" : "Teammitglied löschen"}
        </Button>
      </div>
    </div>
  );
}
