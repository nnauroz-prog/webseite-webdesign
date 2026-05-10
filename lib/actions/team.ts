"use server";

import { revalidatePath } from "next/cache";

import {
  fail,
  flattenZodErrors,
  ok,
  type ActionState,
} from "@/lib/actions/shared";
import { deleteStorageObjectByPublicUrl, uploadImage } from "@/lib/storage";
import { requireCurrentWebsite } from "@/lib/supabase/auth";
import {
  createTeamMemberSchema,
  deleteTeamMemberSchema,
  teamImageSchema,
  updateTeamMemberSchema,
} from "@/lib/validations/team";
import type { TeamMemberRow } from "@/types/website";


export async function createTeamMemberAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = createTeamMemberSchema.safeParse({
    name: formData.get("name"),
    role: formData.get("role"),
    bio: formData.get("bio"),
    sort_order: formData.get("sort_order") ?? 0,
  });
  if (!parsed.success) {
    return fail("Bitte prüfe deine Angaben.", flattenZodErrors(parsed.error));
  }

  const { supabase, website } = await requireCurrentWebsite();
  const { error } = await supabase.from("team_members").insert({
    website_id: website.id,
    name: parsed.data.name,
    role: parsed.data.role ?? null,
    bio: parsed.data.bio ?? null,
    sort_order: parsed.data.sort_order,
  });
  if (error) return fail(error.message);

  revalidatePath("/dashboard/team");
  revalidatePath(`/site/${website.slug}`, "layout");
  return ok("Teammitglied hinzugefügt.");
}

export async function updateTeamMemberAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = updateTeamMemberSchema.safeParse({
    id: formData.get("id"),
    name: formData.get("name"),
    role: formData.get("role"),
    bio: formData.get("bio"),
    sort_order: formData.get("sort_order") ?? 0,
  });
  if (!parsed.success) {
    return fail("Bitte prüfe deine Angaben.", flattenZodErrors(parsed.error));
  }

  const { supabase, website } = await requireCurrentWebsite();
  const { error } = await supabase
    .from("team_members")
    .update({
      name: parsed.data.name,
      role: parsed.data.role ?? null,
      bio: parsed.data.bio ?? null,
      sort_order: parsed.data.sort_order,
    })
    .eq("id", parsed.data.id)
    .eq("website_id", website.id);
  if (error) return fail(error.message);

  revalidatePath("/dashboard/team");
  revalidatePath(`/site/${website.slug}`, "layout");
  return ok("Teammitglied aktualisiert.");
}

export async function deleteTeamMemberAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = deleteTeamMemberSchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) return fail("Ungültiges Teammitglied.");

  const { supabase, website } = await requireCurrentWebsite();

  // Get image_url first so we can delete it after the row removal succeeds.
  const { data: existing } = await supabase
    .from("team_members")
    .select("image_url")
    .eq("id", parsed.data.id)
    .eq("website_id", website.id)
    .maybeSingle();

  const { error } = await supabase
    .from("team_members")
    .delete()
    .eq("id", parsed.data.id)
    .eq("website_id", website.id);
  if (error) return fail(error.message);

  if (existing) {
    await deleteStorageObjectByPublicUrl(
      supabase,
      "team-images",
      (existing as { image_url: string | null }).image_url,
    );
  }

  revalidatePath("/dashboard/team");
  revalidatePath(`/site/${website.slug}`, "layout");
  return ok("Teammitglied gelöscht.");
}

export async function uploadTeamImageAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  try {
    const parsedId = teamImageSchema.safeParse({
      member_id: formData.get("member_id"),
    });
    if (!parsedId.success) return fail("Ungültiges Teammitglied.");

    const file = formData.get("image");
    if (!(file instanceof File) || file.size === 0) {
      return fail("Bitte wähle eine Bilddatei aus.");
    }

    const { supabase, user, website } = await requireCurrentWebsite();

    // Verify the member belongs to the user's website (defense in depth on
    // top of RLS) and grab the previous image URL for cleanup.
    const { data: member } = await supabase
      .from("team_members")
      .select("id, image_url")
      .eq("id", parsedId.data.member_id)
      .eq("website_id", website.id)
      .maybeSingle();
    if (!member) return fail("Teammitglied nicht gefunden.");

    const result = await uploadImage({
      supabase,
      bucket: "team-images",
      file,
      userId: user.id,
      subPath: `${website.id}/team/${parsedId.data.member_id}`,
    });
    if (!result.ok) return fail(result.message);

    const { error } = await supabase
      .from("team_members")
      .update({ image_url: result.publicUrl })
      .eq("id", parsedId.data.member_id)
      .eq("website_id", website.id);
    if (error) {
      await deleteStorageObjectByPublicUrl(
        supabase,
        "team-images",
        result.publicUrl,
      );
      return fail(error.message);
    }

    await deleteStorageObjectByPublicUrl(
      supabase,
      "team-images",
      (member as Pick<TeamMemberRow, "image_url">).image_url,
    );

    revalidatePath("/dashboard/team");
    revalidatePath(`/site/${website.slug}`, "layout");
    return ok("Foto aktualisiert.");
  } catch (err) {
    console.error("[uploadTeamImageAction] thrown", {
      message: err instanceof Error ? err.message : String(err),
      stack: err instanceof Error ? err.stack : undefined,
    });
    return fail(
      err instanceof Error
        ? `Foto-Upload fehlgeschlagen: ${err.message}`
        : "Foto-Upload gerade nicht möglich.",
    );
  }
}
