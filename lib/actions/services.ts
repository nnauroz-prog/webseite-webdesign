"use server";

import { revalidatePath } from "next/cache";

import {
  fail,
  flattenZodErrors,
  idleState,
  ok,
  type ActionState,
} from "@/lib/actions/shared";
import { requireCurrentWebsite } from "@/lib/supabase/auth";
import {
  createServiceSchema,
  deleteServiceSchema,
  updateServiceSchema,
} from "@/lib/validations/services";

export const initialServiceState: ActionState = idleState;

export async function createServiceAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = createServiceSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    sort_order: formData.get("sort_order") ?? 0,
  });
  if (!parsed.success) {
    return fail("Bitte prüfe deine Angaben.", flattenZodErrors(parsed.error));
  }

  const { supabase, website } = await requireCurrentWebsite();
  const { error } = await supabase.from("services").insert({
    website_id: website.id,
    title: parsed.data.title,
    description: parsed.data.description ?? null,
    sort_order: parsed.data.sort_order,
  });
  if (error) return fail(error.message);

  revalidatePath("/dashboard/services");
  revalidatePath(`/site/${website.slug}`, "layout");
  return ok("Leistung hinzugefügt.");
}

export async function updateServiceAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = updateServiceSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    description: formData.get("description"),
    sort_order: formData.get("sort_order") ?? 0,
  });
  if (!parsed.success) {
    return fail("Bitte prüfe deine Angaben.", flattenZodErrors(parsed.error));
  }

  const { supabase, website } = await requireCurrentWebsite();
  const { error } = await supabase
    .from("services")
    .update({
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      sort_order: parsed.data.sort_order,
    })
    .eq("id", parsed.data.id)
    .eq("website_id", website.id);
  if (error) return fail(error.message);

  revalidatePath("/dashboard/services");
  revalidatePath(`/site/${website.slug}`, "layout");
  return ok("Leistung aktualisiert.");
}

export async function deleteServiceAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = deleteServiceSchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) return fail("Ungültige Leistung.");

  const { supabase, website } = await requireCurrentWebsite();
  const { error } = await supabase
    .from("services")
    .delete()
    .eq("id", parsed.data.id)
    .eq("website_id", website.id);
  if (error) return fail(error.message);

  revalidatePath("/dashboard/services");
  revalidatePath(`/site/${website.slug}`, "layout");
  return ok("Leistung gelöscht.");
}
