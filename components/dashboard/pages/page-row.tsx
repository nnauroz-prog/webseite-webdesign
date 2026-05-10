"use client";

import Link from "next/link";
import { useActionState, useState, useTransition } from "react";
import { ChevronDown, Eye, EyeOff, ExternalLink, Trash2 } from "lucide-react";

import { BlockManager } from "@/components/dashboard/blocks/block-manager";
import { FieldError, FormStatus } from "@/components/dashboard/form-status";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { initialState } from "@/lib/actions/states";
import {
  deletePageAction,
  updatePageAction,
} from "@/lib/actions/pages";
import { cn } from "@/lib/utils";
import type {
  PageBlockRow,
  PageRow as PageModel,
} from "@/types/website";

export type AvailableImage = { label: string; url: string };

export function PageRow({
  page,
  blocks,
  websiteSlug,
  availableImages,
}: {
  page: PageModel;
  blocks: PageBlockRow[];
  websiteSlug: string;
  availableImages?: AvailableImage[];
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction] = useActionState(updatePageAction, initialState);
  const [pending, startTransition] = useTransition();

  return (
    <div className="bg-card overflow-hidden rounded-xl border">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="hover:bg-secondary -mx-2 flex flex-1 items-center gap-3 rounded px-2 py-1 text-left transition"
        >
          <span
            className={cn(
              "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
              page.is_published
                ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                : "bg-amber-500/15 text-amber-700 dark:text-amber-300",
            )}
            title={page.is_published ? "Veröffentlicht" : "Entwurf"}
          >
            {page.is_published ? (
              <Eye className="h-3.5 w-3.5" />
            ) : (
              <EyeOff className="h-3.5 w-3.5" />
            )}
          </span>
          <div className="min-w-0">
            <div className="text-foreground font-medium">{page.title}</div>
            <div className="text-muted-foreground truncate font-mono text-xs">
              /site/{websiteSlug}/{page.slug}
            </div>
          </div>
          <ChevronDown
            className={cn(
              "ml-auto h-4 w-4 transition-transform",
              open && "rotate-180",
            )}
          />
        </button>
        <div className="flex items-center gap-1">
          <Button asChild variant="ghost" size="sm">
            <Link
              href={`/site/${websiteSlug}/${page.slug}`}
              target="_blank"
              rel="noreferrer"
              aria-label="In neuem Tab öffnen"
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={pending}
            aria-label="Seite löschen"
            onClick={() => {
              if (
                !confirm(`Seite „${page.title}” wirklich löschen?`)
              )
                return;
              const fd = new FormData();
              fd.append("id", page.id);
              startTransition(() => {
                void deletePageAction(undefined, fd);
              });
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {open ? (
        <form action={formAction} className="border-t p-4">
          <input type="hidden" name="id" value={page.id} />

          <FormStatus state={state} />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`title-${page.id}`}>Titel</Label>
              <Input
                id={`title-${page.id}`}
                name="title"
                required
                maxLength={120}
                defaultValue={page.title}
                aria-invalid={Boolean(state.fieldErrors?.title) || undefined}
              />
              <FieldError message={state.fieldErrors?.title} />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`slug-${page.id}`}>URL-Kürzel</Label>
              <Input
                id={`slug-${page.id}`}
                name="slug"
                required
                minLength={1}
                maxLength={63}
                pattern="[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
                defaultValue={page.slug}
                className="font-mono"
                aria-invalid={Boolean(state.fieldErrors?.slug) || undefined}
              />
              <FieldError message={state.fieldErrors?.slug} />
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Label htmlFor={`body-${page.id}`}>Inhalt</Label>
            <Textarea
              id={`body-${page.id}`}
              name="body"
              rows={10}
              maxLength={40000}
              defaultValue={page.body}
              placeholder={"Schreib deinen Text — leere Zeilen trennen Absätze."}
              aria-invalid={Boolean(state.fieldErrors?.body) || undefined}
            />
            <FieldError message={state.fieldErrors?.body} />
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="is_published"
                defaultChecked={page.is_published}
                value="true"
                className="h-4 w-4"
              />
              <span>Veröffentlicht</span>
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="show_in_nav"
                defaultChecked={page.show_in_nav}
                value="true"
                className="h-4 w-4"
              />
              <span>In Navigation anzeigen</span>
            </label>
          </div>

          <div className="mt-4">
            <SubmitButton label="Speichern" />
          </div>
        </form>
      ) : null}

      {open ? (
        <div className="border-t bg-secondary/20 p-4">
          <BlockManager
            pageId={page.id}
            blocks={blocks}
            availableImages={availableImages}
          />
        </div>
      ) : null}
    </div>
  );
}
