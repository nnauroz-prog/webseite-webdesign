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
  addBlockSchema,
  dataSchemaFor,
  deleteBlockSchema,
  reorderBlockSchema,
  updateBlockSchema,
  type BlockType,
} from "@/lib/validations/blocks";

/** Empty default payload for each block type — what we save on "Add". */
function defaultDataFor(type: BlockType): Record<string, unknown> {
  switch (type) {
    case "faq":
      return {
        title: "",
        items: [
          { question: "Beispiel-Frage?", answer: "Beispiel-Antwort." },
        ],
      };
    case "testimonials":
      return {
        title: "",
        items: [
          {
            name: "Max Muster",
            role: "Kunde",
            quote: "Wir sind sehr zufrieden mit dem Service.",
          },
        ],
      };
    case "opening_hours":
      return {
        title: "Öffnungszeiten",
        text: "Mo–Fr: 9:00–18:00 Uhr\nSa: 10:00–14:00 Uhr\nSonntag geschlossen",
      };
    case "cta_banner":
      return {
        headline: "Bereit für den nächsten Schritt?",
        subtitle: "Schreib uns — wir melden uns zeitnah zurück.",
        button_label: "Kontakt aufnehmen",
        button_href: "#kontakt",
      };
    case "map":
      return {
        title: "So finden Sie uns",
        address: "Musterstraße 1, 10115 Berlin",
      };
    case "video":
      return {
        title: "",
        url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        caption: "",
      };
    case "stats":
      return {
        title: "",
        items: [
          { value: "20+", label: "Jahre Erfahrung" },
          { value: "500+", label: "Zufriedene Kunden" },
          { value: "24/7", label: "Erreichbar" },
        ],
      };
    case "rich_text":
      return {
        title: "",
        body: "Schreibe hier deinen Text. Eine Leerzeile beginnt einen neuen Absatz.\n\nLängere Texte sind hier ideal, wenn du detailliert über deine Arbeit, Werte oder Geschichte erzählen möchtest.",
      };
  }
}

// ---------------------------------------------------------------------------
//  addBlockAction — appends a new block of the chosen type to the page.
// ---------------------------------------------------------------------------
export async function addBlockAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = addBlockSchema.safeParse({
    page_id: formData.get("page_id"),
    type: formData.get("type"),
  });
  if (!parsed.success) {
    return fail("Ungültige Eingabe.", flattenZodErrors(parsed.error));
  }

  const { supabase, website } = await requireCurrentWebsite();

  // Confirm the page belongs to this website (defense in depth — RLS
  // already enforces it but the explicit check yields a clearer error).
  const { data: page } = await supabase
    .from("pages")
    .select("id, slug")
    .eq("id", parsed.data.page_id)
    .eq("website_id", website.id)
    .maybeSingle();
  if (!page) return fail("Seite nicht gefunden.");

  const { data: max } = await supabase
    .from("page_blocks")
    .select("sort_order")
    .eq("page_id", parsed.data.page_id)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const nextOrder =
    ((max as { sort_order: number } | null)?.sort_order ?? 0) + 10;

  const { error } = await supabase.from("page_blocks").insert({
    website_id: website.id,
    page_id: parsed.data.page_id,
    type: parsed.data.type,
    data: defaultDataFor(parsed.data.type),
    sort_order: nextOrder,
    is_published: true,
  });
  if (error) return fail(error.message);

  revalidatePath("/dashboard/pages");
  revalidatePath(
    `/site/${website.slug}/${(page as { slug: string }).slug}`,
  );
  return ok("Block hinzugefügt.");
}

// ---------------------------------------------------------------------------
//  updateBlockAction — saves block data + publish toggle.
// ---------------------------------------------------------------------------
export async function updateBlockAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = updateBlockSchema.safeParse({
    id: formData.get("id"),
    data: formData.get("data"),
    is_published: formData.get("is_published"),
  });
  if (!parsed.success) {
    return fail("Ungültige Eingabe.", flattenZodErrors(parsed.error));
  }

  let json: unknown;
  try {
    json = JSON.parse(parsed.data.data);
  } catch {
    return fail("Block-Daten sind beschädigt. Lade die Seite neu.");
  }

  const { supabase, website } = await requireCurrentWebsite();

  const { data: existing } = await supabase
    .from("page_blocks")
    .select("type, page_id")
    .eq("id", parsed.data.id)
    .eq("website_id", website.id)
    .maybeSingle();
  if (!existing) return fail("Block nicht gefunden.");

  const row = existing as { type: BlockType; page_id: string | null };
  const validation = dataSchemaFor(row.type).safeParse(json);
  if (!validation.success) {
    return fail("Bitte prüfe die Block-Daten.", flattenZodErrors(validation.error));
  }

  const { error } = await supabase
    .from("page_blocks")
    .update({
      data: validation.data,
      is_published: parsed.data.is_published,
    })
    .eq("id", parsed.data.id)
    .eq("website_id", website.id);
  if (error) return fail(error.message);

  revalidatePath("/dashboard/pages");
  revalidatePath(`/site/${website.slug}`, "layout");
  return ok("Block gespeichert.");
}

// ---------------------------------------------------------------------------
//  deleteBlockAction
// ---------------------------------------------------------------------------
export async function deleteBlockAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = deleteBlockSchema.safeParse({ id: formData.get("id") });
  if (!parsed.success) return fail("Ungültiger Block.");

  const { supabase, website } = await requireCurrentWebsite();
  const { error } = await supabase
    .from("page_blocks")
    .delete()
    .eq("id", parsed.data.id)
    .eq("website_id", website.id);
  if (error) return fail(error.message);

  revalidatePath("/dashboard/pages");
  revalidatePath(`/site/${website.slug}`, "layout");
  return ok("Block gelöscht.");
}

// ---------------------------------------------------------------------------
//  reorderBlockAction — swaps sort_order with the immediate neighbour.
// ---------------------------------------------------------------------------
export async function reorderBlockAction(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = reorderBlockSchema.safeParse({
    id: formData.get("id"),
    direction: formData.get("direction"),
  });
  if (!parsed.success) return fail("Ungültige Sortierung.");

  const { supabase, website } = await requireCurrentWebsite();

  const { data: current } = await supabase
    .from("page_blocks")
    .select("id, page_id, sort_order")
    .eq("id", parsed.data.id)
    .eq("website_id", website.id)
    .maybeSingle();
  if (!current) return fail("Block nicht gefunden.");

  const c = current as {
    id: string;
    page_id: string | null;
    sort_order: number;
  };
  const ascending = parsed.data.direction === "down";

  // Find the neighbour (next greater sort_order for "down", smaller for "up").
  const { data: neighbour } = ascending
    ? await supabase
        .from("page_blocks")
        .select("id, sort_order")
        .eq("page_id", c.page_id)
        .gt("sort_order", c.sort_order)
        .order("sort_order", { ascending: true })
        .limit(1)
        .maybeSingle()
    : await supabase
        .from("page_blocks")
        .select("id, sort_order")
        .eq("page_id", c.page_id)
        .lt("sort_order", c.sort_order)
        .order("sort_order", { ascending: false })
        .limit(1)
        .maybeSingle();

  if (!neighbour) return ok("Schon am Rand.");

  const n = neighbour as { id: string; sort_order: number };
  // Swap.
  await supabase
    .from("page_blocks")
    .update({ sort_order: n.sort_order })
    .eq("id", c.id)
    .eq("website_id", website.id);
  await supabase
    .from("page_blocks")
    .update({ sort_order: c.sort_order })
    .eq("id", n.id)
    .eq("website_id", website.id);

  revalidatePath("/dashboard/pages");
  revalidatePath(`/site/${website.slug}`, "layout");
  return ok("Reihenfolge aktualisiert.");
}
