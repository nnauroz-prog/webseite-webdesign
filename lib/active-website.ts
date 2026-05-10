import { cookies } from "next/headers";

/**
 * Cookie that stores which of the user's websites is currently
 * "active" in the dashboard. Empty / missing → fall back to the
 * oldest website (the user's first one).
 *
 * Stored on the server via a non-HttpOnly cookie so server actions
 * can rotate it without an extra client round-trip.
 */
const COOKIE_NAME = "sitalo_active_website";

const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  // 1 year — UX-only state, no security implication.
  maxAge: 60 * 60 * 24 * 365,
  path: "/",
};

/** Read the active-website-id cookie if set. */
export async function getActiveWebsiteId(): Promise<string | null> {
  const store = await cookies();
  const v = store.get(COOKIE_NAME)?.value?.trim();
  return v && v.length > 0 ? v : null;
}

/** Set the active-website-id cookie. Call from a server action. */
export async function setActiveWebsiteId(id: string): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, id, COOKIE_OPTIONS);
}

/** Clear the active-website cookie (e.g. after deleting a website). */
export async function clearActiveWebsiteId(): Promise<void> {
  const store = await cookies();
  store.set(COOKIE_NAME, "", { ...COOKIE_OPTIONS, maxAge: 0 });
}
