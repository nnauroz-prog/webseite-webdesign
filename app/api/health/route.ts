import { NextResponse } from "next/server";

/**
 * GET /api/health
 *
 * Diagnostic endpoint. Returns whether the runtime sees the env vars we
 * need, plus the length and a short prefix of the URLs (never secrets)
 * so the operator can spot typos / wrong values without leaking keys.
 *
 * Visit https://<your-domain>/api/health to verify config from outside.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
  const stripeSecret = process.env.STRIPE_SECRET_KEY ?? "";
  const stripeWebhook = process.env.STRIPE_WEBHOOK_SECRET ?? "";

  return NextResponse.json({
    runtime: process.version,
    env: {
      NEXT_PUBLIC_SUPABASE_URL: presence(supabaseUrl, { showPrefix: true }),
      NEXT_PUBLIC_SUPABASE_ANON_KEY: presence(supabaseAnon),
      SUPABASE_SERVICE_ROLE_KEY: presence(serviceRole),
      NEXT_PUBLIC_APP_URL: presence(appUrl, { showPrefix: true }),
      STRIPE_SECRET_KEY: presence(stripeSecret),
      STRIPE_WEBHOOK_SECRET: presence(stripeWebhook),
    },
  });
}

function presence(
  value: string,
  opts: { showPrefix?: boolean } = {},
): {
  set: boolean;
  length: number;
  prefix?: string;
  trailingWhitespace?: boolean;
} {
  if (!value) return { set: false, length: 0 };
  const trimmed = value.trim();
  return {
    set: true,
    length: value.length,
    prefix: opts.showPrefix ? value.slice(0, 20) : undefined,
    trailingWhitespace: value !== trimmed ? true : undefined,
  };
}
