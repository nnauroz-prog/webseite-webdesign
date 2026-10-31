import { NextRequest, NextResponse } from "next/server";

import {
  deliverLead,
  LeadDeliveryError,
  type LeadKind,
} from "@/lib/lead-mail";
import { recordDelivery, saveLead } from "@/lib/leads-store";
import { SITE_URL } from "@/lib/site";

/**
 * POST /api/anfrage — nimmt Anfrage-, Audit- und Termin-Formulare
 * entgegen und stellt sie per Mail zu (siehe lib/lead-mail.ts).
 *
 * Body: { kind, subject, fields: [label, value][], replyTo, hp }
 * `hp` ist das Honeypot-Feld. Ist es gefüllt, antworten wir mit Erfolg
 * (Bots sollen nichts merken), loggen den Fall aber (ohne Personendaten)
 * — so ist im Vercel-Log sichtbar, falls echte Besucher hineinlaufen.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const KINDS: LeadKind[] = ["anfrage", "audit", "termin"];
const MAX_FIELDS = 16;
const MAX_LABEL = 60;
const MAX_VALUE = 4000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RATE_LIMIT_MAX = 8;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (record.count >= RATE_LIMIT_MAX) return false;
  record.count++;
  return true;
}

function clientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

/** www.sitalo.de und sitalo.de gelten beide als eigene Seite. */
function originAllowed(req: NextRequest): boolean {
  const raw = req.headers.get("origin") ?? req.headers.get("referer");
  if (!raw) return true; // curl / Server-zu-Server-Tests
  let host: string;
  try {
    host = new URL(raw).hostname;
  } catch {
    return false;
  }
  const site = new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ).hostname;
  const bare = (h: string) => h.replace(/^www\./, "");
  return (
    bare(host) === bare(site) ||
    host === "localhost" ||
    host.endsWith(".vercel.app")
  );
}

const FALLBACK_HINT =
  "Bitte schreiben Sie uns direkt an info@sitalo.de oder rufen Sie an — wir melden uns.";

function fail(status: number, error: string) {
  return NextResponse.json({ ok: false, error }, { status });
}

export async function POST(req: NextRequest) {
  if (!originAllowed(req)) return fail(403, "Nicht erlaubt.");
  if (!checkRateLimit(clientIp(req))) {
    return fail(
      429,
      `Sie haben in der letzten Stunde schon mehrere Anfragen gesendet. ${FALLBACK_HINT}`,
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail(400, "Ungültige Anfrage.");
  }
  const b = body as Record<string, unknown>;

  const kind = b.kind as LeadKind;
  if (!KINDS.includes(kind)) return fail(400, "Ungültige Anfrage.");

  const replyTo = typeof b.replyTo === "string" ? b.replyTo.trim() : "";
  if (!EMAIL_RE.test(replyTo) || replyTo.length > 200) {
    return fail(400, "Bitte prüfen Sie Ihre E-Mail-Adresse.");
  }

  const subject =
    typeof b.subject === "string"
      ? b.subject.replace(/[\r\n]+/g, " ").trim().slice(0, 200)
      : "";
  if (!subject) return fail(400, "Ungültige Anfrage.");

  if (!Array.isArray(b.fields) || b.fields.length > MAX_FIELDS) {
    return fail(400, "Ungültige Anfrage.");
  }
  const fields: [string, string][] = [];
  for (const entry of b.fields) {
    if (
      !Array.isArray(entry) ||
      typeof entry[0] !== "string" ||
      typeof entry[1] !== "string"
    ) {
      return fail(400, "Ungültige Anfrage.");
    }
    const label = entry[0].trim().slice(0, MAX_LABEL);
    const value = entry[1].trim().slice(0, MAX_VALUE);
    if (label && value) fields.push([label, value]);
  }
  if (fields.length === 0) return fail(400, "Ungültige Anfrage.");

  const hp = typeof b.hp === "string" ? b.hp.trim() : "";
  if (hp) {
    // Ohne Personendaten: nur Art, Länge des Inhalts und Mail-Domain.
    const domain = replyTo.split("@")[1] ?? "";
    console.warn("[anfrage] Honeypot gefüllt — nicht zugestellt", {
      kind,
      hpLaenge: hp.length,
      domain,
    });
    return NextResponse.json({ ok: true });
  }

  const lead = { kind, subject, fields, replyTo };

  // Erst speichern, dann mailen: Scheitert die Mail, ist die Anfrage
  // trotzdem im Admin-Bereich (/admin) und geht nicht verloren.
  const leadId = await saveLead(lead);

  try {
    const via = await deliverLead(
      lead,
      leadId ? { adminUrl: `${SITE_URL}/admin/anfragen/${leadId}` } : undefined,
    );
    console.info("[anfrage] zugestellt", { kind, via, gespeichert: Boolean(leadId) });
    if (leadId) await recordDelivery(leadId, { via });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const reason = err instanceof LeadDeliveryError ? err.reason : "network";
    const message = err instanceof Error ? err.message : String(err);
    console.error("[anfrage] Zustellung fehlgeschlagen", {
      kind,
      reason,
      message,
      gespeichert: Boolean(leadId),
    });
    if (leadId) {
      await recordDelivery(leadId, { error: `${reason}: ${message}` });
      // Gespeichert ist gespeichert — für den Besucher ist die
      // Anfrage angekommen, sie steht im Admin-Bereich.
      return NextResponse.json({ ok: true });
    }
    return fail(
      reason === "not_configured" ? 503 : 502,
      `Ihre Nachricht konnte gerade nicht zugestellt werden. ${FALLBACK_HINT}`,
    );
  }
}
