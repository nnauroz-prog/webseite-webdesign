"use server";

import { revalidatePath } from "next/cache";

import {
  fail,
  flattenZodErrors,
  ok,
  type ActionState,
} from "@/lib/actions/shared";
import { requireCurrentWebsite } from "@/lib/supabase/auth";
import {
  createPageSchema,
  deletePageSchema,
  updatePageSchema,
} from "@/lib/validations/pages";

// ---------------------------------------------------------------------------
//  createPageAction
// ---------------------------------------------------------------------------
export async function createPageAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = createPageSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    body: formData.get("body"),
  });
  if (!parsed.success) {
    return fail("Bitte prüfe deine Angaben.", flattenZodErrors(parsed.error));
  }

  const { supabase, website } = await requireCurrentWebsite();

  // sort_order = max(existing) + 10 so new pages land at the end without
  // colliding when the user reorders.
  const { data: max } = await supabase
    .from("pages")
    .select("sort_order")
    .eq("website_id", website.id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder =
    ((max as { sort_order: number } | null)?.sort_order ?? 0) + 10;

  const { error } = await supabase.from("pages").insert({
    website_id: website.id,
    title: parsed.data.title,
    slug: parsed.data.slug,
    body: parsed.data.body ?? "",
    sort_order: nextOrder,
    is_published: true,
    show_in_nav: true,
  });

  if (error) {
    if (error.code === "23505" || /duplicate/i.test(error.message)) {
      return fail("Dieses URL-Kürzel wird bereits auf deiner Site genutzt.");
    }
    return fail(error.message);
  }

  revalidatePath("/dashboard/pages");
  revalidatePath(`/site/${website.slug}`, "layout");
  return ok("Seite angelegt.");
}

// ---------------------------------------------------------------------------
//  updatePageAction
// ---------------------------------------------------------------------------
export async function updatePageAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = updatePageSchema.safeParse({
    id: formData.get("id"),
    title: formData.get("title"),
    slug: formData.get("slug"),
    body: formData.get("body"),
    is_published: formData.get("is_published"),
    show_in_nav: formData.get("show_in_nav"),
  });
  if (!parsed.success) {
    return fail("Bitte prüfe deine Angaben.", flattenZodErrors(parsed.error));
  }

  const { supabase, website } = await requireCurrentWebsite();
  const { error } = await supabase
    .from("pages")
    .update({
      title: parsed.data.title,
      slug: parsed.data.slug,
      body: parsed.data.body ?? "",
      is_published: parsed.data.is_published,
      show_in_nav: parsed.data.show_in_nav,
    })
    .eq("id", parsed.data.id)
    .eq("website_id", website.id);

  if (error) {
    if (error.code === "23505" || /duplicate/i.test(error.message)) {
      return fail("Dieses URL-Kürzel wird bereits auf deiner Site genutzt.");
    }
    return fail(error.message);
  }

  revalidatePath("/dashboard/pages");
  revalidatePath(`/site/${website.slug}`, "layout");
  return ok("Seite gespeichert.");
}

// ---------------------------------------------------------------------------
//  deletePageAction
// ---------------------------------------------------------------------------
export async function deletePageAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = deletePageSchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) return fail("Ungültige Seite.");

  const { supabase, website } = await requireCurrentWebsite();
  const { error } = await supabase
    .from("pages")
    .delete()
    .eq("id", parsed.data.id)
    .eq("website_id", website.id);
  if (error) return fail(error.message);

  revalidatePath("/dashboard/pages");
  revalidatePath(`/site/${website.slug}`, "layout");
  return ok("Seite gelöscht.");
}
