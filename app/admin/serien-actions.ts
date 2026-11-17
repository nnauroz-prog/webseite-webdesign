"use server";

import { requireAdmin } from "@/lib/admin/auth";

export type SerienActionResult = { ok: true } | { ok: false; error: string };

/** Hakt eine Serie als gepostet ab oder nimmt den Haken zurück. */
export async function serieGepostetAction(
  id: string,
  gepostet: boolean,
): Promise<SerienActionResult> {
  await requireAdmin();
  void id;
  void gepostet;
  return { ok: false, error: "Geht nach dem Datenbank-Update." };
}

/** Löscht eine Serie aus den Aufträgen. */
export async function serieLoeschenAction(
  id: string,
): Promise<SerienActionResult> {
  await requireAdmin();
  void id;
  return { ok: false, error: "Geht nach dem Datenbank-Update." };
}
