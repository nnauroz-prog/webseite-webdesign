import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";

import type { Angebot } from "@/lib/admin/angebote";

import { sendeAngebotBenachrichtigung } from "@/lib/angebot-mail";
import { LeadDeliveryError } from "@/lib/lead-mail";

const LEAD = "3f2b8c1e-9d4a-4b6e-8f1a-2c3d4e5f6a7b";
const TOKEN = "geheimer_token_der_nie_in_mails_steht_0000";

const angebot: Pick<
  Angebot,
  | "lead_id"
  | "nummer"
  | "token"
  | "kunde_name"
  | "kunde_firma"
  | "kunde_email"
  | "positionen"
  | "ust_satz"
  | "accepted_at"
  | "declined_at"
  | "angenommen_von"
  | "abgelehnt_grund"
> = {
  lead_id: LEAD,
  nummer: "A-2026-0007",
  token: TOKEN,
  kunde_name: "Jana Petersen",
  kunde_firma: "Pflegedienst Elbblick",
  kunde_email: "jana@example.de",
  positionen: [
    {
      id: "paket-business-einmalig",
      titel: "Website-Paket Business",
      beschreibung: "",
      menge: 1,
      preis_cent: 89900,
      art: "einmalig",
    },
  ],
  ust_satz: 19,
  accepted_at: "2026-11-01T13:02:00Z",
  declined_at: null,
  angenommen_von: "Jana Petersen",
  abgelehnt_grund: null,
};

describe("sendeAngebotBenachrichtigung", () => {
  const realFetch = globalThis.fetch;
  const env = { ...process.env };
  let sent: { url: string; body: Record<string, unknown> }[] = [];
  let status = 200;

  beforeEach(() => {
    sent = [];
    status = 200;
    globalThis.fetch = (async (url: string, init: RequestInit) => {
      sent.push({ url: String(url), body: JSON.parse(String(init.body)) });
      return new Response(status === 200 ? "{}" : "nope", { status });
    }) as typeof fetch;
    delete process.env.RESEND_API_KEY;
    delete process.env.FORMSPREE_FORM_ID;
    delete process.env.LEAD_MAIL_TO;
    delete process.env.LEAD_MAIL_FROM;
  });
  afterEach(() => {
    globalThis.fetch = realFetch;
    process.env = { ...env };
  });

  it("Resend: an LEAD_MAIL_TO, Betreff mit Nummer und Kunde, Antwort an den Kunden", async () => {
    process.env.RESEND_API_KEY = "re_test";
    process.env.LEAD_MAIL_TO = "chef@example.de";
    const via = await sendeAngebotBenachrichtigung(
      "angenommen",
      angebot,
      "https://www.sitalo.de",
    );
    assert.equal(via, "resend");
    assert.equal(sent.length, 1);
    const b = sent[0].body;
    assert.equal(sent[0].url, "https://api.resend.com/emails");
    assert.deepEqual(b.to, ["chef@example.de"]);
    assert.equal(b.reply_to, "jana@example.de");
    assert.equal(
      b.subject,
      "Angebot A-2026-0007 angenommen: Pflegedienst Elbblick (Jana Petersen)",
    );
    const text = String(b.text);
    assert.ok(text.includes(`https://www.sitalo.de/admin/anfragen/${LEAD}`));
    assert.ok(text.includes("Angenommen von: Jana Petersen"));
    assert.ok(!JSON.stringify(b).includes(TOKEN), "Token in der Mail");
  });

  it("ohne Kunden-Mail kein reply_to; Ablehnung mit Grund", async () => {
    process.env.RESEND_API_KEY = "re_test";
    await sendeAngebotBenachrichtigung("abgelehnt", {
      ...angebot,
      kunde_email: null,
      declined_at: "2026-11-01T13:05:00Z",
      abgelehnt_grund: "Zu teuer",
    });
    const b = sent[0].body;
    assert.equal("reply_to" in b, false);
    assert.match(String(b.subject), /^Angebot A-2026-0007 abgelehnt: /);
    assert.match(String(b.text), /Grund:\nZu teuer/);
    assert.deepEqual(b.to, ["info@sitalo.de"]);
  });

  it("Formspree als Ersatz", async () => {
    process.env.FORMSPREE_FORM_ID = "abc";
    const via = await sendeAngebotBenachrichtigung("angenommen", angebot);
    assert.equal(via, "formspree");
    assert.equal(sent[0].url, "https://formspree.io/f/abc");
    assert.match(
      String(sent[0].body._subject),
      /^Angebot A-2026-0007 angenommen/,
    );
    assert.equal(sent[0].body._replyto, "jana@example.de");
    assert.ok(!JSON.stringify(sent[0].body).includes(TOKEN));
  });

  it("Fehler als LeadDeliveryError (abgelehnt, nicht eingerichtet, Netz)", async () => {
    process.env.RESEND_API_KEY = "re_test";
    status = 401;
    await assert.rejects(
      sendeAngebotBenachrichtigung("angenommen", angebot),
      (e: unknown) =>
        e instanceof LeadDeliveryError && e.reason === "provider_rejected",
    );

    delete process.env.RESEND_API_KEY;
    await assert.rejects(
      sendeAngebotBenachrichtigung("angenommen", angebot),
      (e: unknown) =>
        e instanceof LeadDeliveryError && e.reason === "not_configured",
    );

    process.env.RESEND_API_KEY = "re_test";
    globalThis.fetch = (async () => {
      throw new TypeError("fetch failed");
    }) as typeof fetch;
    await assert.rejects(
      sendeAngebotBenachrichtigung("angenommen", angebot),
      (e: unknown) => e instanceof LeadDeliveryError && e.reason === "network",
    );
  });
});
