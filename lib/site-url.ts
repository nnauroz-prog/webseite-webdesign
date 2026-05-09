/**
 * Resolves the canonical app URL for absolute links (auth callbacks,
 * password reset emails, OG images, etc.).
 *
 * Priority:
 *   1. NEXT_PUBLIC_APP_URL (explicit override, recommended in production)
 *   2. VERCEL_PROJECT_PRODUCTION_URL (set automatically on Vercel)
 *   3. http://localhost:3000 (local dev fallback)
 */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_APP_URL;
  if (explicit) return stripTrailingSlash(explicit);

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

function stripTrailingSlash(value: string): string {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}
