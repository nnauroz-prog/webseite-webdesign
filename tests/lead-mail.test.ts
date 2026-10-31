import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import type { Lead } from "@/lib/leads-meta";

import { deliverLead } from "@/lib/lead-mail";

const lead: Lead = {
  kind: "anfrage",
  subject: "Neue Anfrage von Lisa Weber",
  fields: [
    ["Name", "Lisa Weber"],
    ["Nachricht", "Hallo"],
  ],
  replyTo: "lisa@example.de",
};
const URL_ =
  "https://www.sitalo.de/admin/anfragen/3f2b8c1e-9d4a-4b6e-8f1a-2c3d4e5f6a7b";

describe("deliverLead mit Direktlink", () => {
  const realFetch = globalThis.fetch;
  const env = { ...process.env };
  let sent: { url: string; body: Record<string, unknown> }[] = [];

  beforeEach(() => {
    sent = [];
    globalThis.fetch = (async (url: string, init: RequestInit) => {
      sent.push({ url: String(url), body: JSON.parse(String(init.body)) });
      return new Response("{}", { status: 200 });
    }) as typeof fetch;
  });
  afterEach(() => {
    globalThis.fetch = realFetch;
    process.env = { ...env };
  });

  it("Resend: Link vor der Fußzeile", async () => {
    process.env.RESEND_API_KEY = "re_test";
    delete process.env.FORMSPREE_FORM_ID;
    assert.equal(await deliverLead(lead, { adminUrl: URL_ }), "resend");
    const text = String(sent[0].body.text);
    assert.ok(
      text.includes(
        `Im Admin öffnen (Vorlagen, Status, Wiedervorlage):\n${URL_}\n\n—\nGesendet über sitalo.de`,
      ),
    );
  });

  it("Resend: ohne Option unverändert", async () => {
    process.env.RESEND_API_KEY = "re_test";
    await deliverLead(lead);
    const text = String(sent[0].body.text);
    assert.ok(!text.includes("Im Admin öffnen"));
    assert.ok(text.endsWith("\n\n—\nGesendet über sitalo.de (anfrage)"));
  });

  it("Formspree: eigenes Feld „Im Admin öffnen“", async () => {
    delete process.env.RESEND_API_KEY;
    process.env.FORMSPREE_FORM_ID = "abc";
    assert.equal(await deliverLead(lead, { adminUrl: URL_ }), "formspree");
    assert.equal(sent[0].body["Im Admin öffnen"], URL_);
    assert.equal(sent[0].body.Name, "Lisa Weber");
  });
});
