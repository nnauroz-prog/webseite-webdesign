"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  adminDeleteTemplateAction,
  adminToggleTemplateAction,
} from "@/lib/actions/admin";
import type { TemplateRow as TemplateModel } from "@/types/website";

export function TemplateRow({ template }: { template: TemplateModel }) {
  const [pending, start] = useTransition();
  const [deleting, startDelete] = useTransition();

  function toggle() {
    const fd = new FormData();
    fd.append("id", template.id);
    if (!template.is_active) fd.append("is_active", "on");
    start(() => {
      void adminToggleTemplateAction(undefined, fd);
    });
  }

  function remove() {
    if (
      !confirm(
        `Template „${template.name}" wirklich löschen? Zugewiesene Websites fallen auf den Default-Look zurück.`,
      )
    ) {
      return;
    }
    const fd = new FormData();
    fd.append("id", template.id);
    startDelete(() => {
      void adminDeleteTemplateAction(undefined, fd);
    });
  }

  return (
    <tr className="hover:bg-muted/30">
      <td className="px-4 py-3">
        <div className="font-medium">{template.name}</div>
        <div className="text-muted-foreground text-xs">
          industry: {template.industry}
        </div>
      </td>
      <td className="px-4 py-3 text-sm">
        <span
          className={
            template.is_active
              ? "text-emerald-700 dark:text-emerald-400"
              : "text-muted-foreground"
          }
        >
          {template.is_active ? "aktiv" : "inaktiv"}
        </span>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="inline-flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={pending}
            onClick={toggle}
          >
            {pending ? "…" : template.is_active ? "Deaktivieren" : "Aktivieren"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={deleting}
            onClick={remove}
          >
            {deleting ? "Lösche …" : "Löschen"}
          </Button>
        </div>
      </td>
    </tr>
  );
}
