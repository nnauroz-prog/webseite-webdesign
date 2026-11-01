import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { foldText, matchLead, relatedLeads } from "@/lib/admin/search";
import { makeLead } from "@/tests/helpers";

describe("foldText", () => {
  it("faltet Umlaute und Groß-/Kleinschreibung", () => {
    assert.equal(foldText("Müller Straße ÄÖÜ"), "mueller strasse aeoeue");
    assert.equal(foldText("Café  René"), "cafe rene");
    // zerlegte Umlaute (NFD) wie aus manchen Tastaturen
    assert.equal(foldText("Müller"), "mueller");
  });
});

describe("matchLead", () => {
  const lead = makeLead({
    subject: "Neue Anfrage von Jörg Müller (Bäckerei Straße)",
    reply_to: "joerg@baeckerei.de",
    status: "archiviert",
    notes: "31.10. 14:12 · Angebot geschickt",
    fields: [
      ["Name", "Jörg Müller"],
      ["Telefon", "+49 176 1234567"],
      ["Firma", "Bäckerei Straße"],
      ["Audit-URL", "https://baeckerei-mueller.de"],
    ],
  });

  it("findet über gefaltete Umlaute", () => {
    assert.ok(matchLead(lead, "mueller"));
    assert.ok(matchLead(lead, "MÜLLER"));
    assert.ok(matchLead(lead, "strasse"));
    assert.ok(matchLead(lead, "jörg müller"));
    assert.ok(!matchLead(lead, "meier"));
    assert.ok(!matchLead(lead, "   "));
  });

  it("Telefon: nur Ziffern, 0176 ↔ +49 176", () => {
    assert.ok(matchLead(lead, "0176 123"));
    assert.ok(matchLead(lead, "0176/1234567"));
    assert.ok(matchLead(lead, "+49 176 1234"));
    assert.ok(!matchLead(lead, "0171 123"));
    const landline = makeLead({
      fields: [
        ["Name", "X"],
        ["Telefon", "+49 (0)40 123 456"],
      ],
    });
    assert.ok(matchLead(landline, "040 123"));
    const national = makeLead({
      fields: [
        ["Name", "X"],
        ["Telefon", "0176 1234567"],
      ],
    });
    assert.ok(matchLead(national, "+49 176 123"));
  });

  it("Treffer in Notizen, Audit-URL und E-Mail; archivierte werden gefunden", () => {
    assert.ok(matchLead(lead, "angebot geschickt"));
    assert.ok(matchLead(lead, "baeckerei-mueller.de"));
    assert.ok(matchLead(lead, "joerg@"));
  });
});

describe("relatedLeads", () => {
  it("behandelt Groß-/Kleinschreibung und 0176/+49 176 gleich, ohne die Anfrage selbst", () => {
    const me = makeLead({
      reply_to: "Lisa@Example.de",
      fields: [
        ["Name", "Lisa"],
        ["Telefon", "0176 1234567"],
      ],
    });
    const sameMail = makeLead({
      reply_to: "lisa@example.de",
      fields: [["Name", "L"]],
    });
    const samePhone = makeLead({
      reply_to: "andere@example.de",
      fields: [["Telefon", "+49 176 1234567"]],
    });
    const other = makeLead({
      reply_to: "max@example.de",
      fields: [["Telefon", "0176 7654321"]],
    });
    const result = relatedLeads(me, [me, sameMail, samePhone, other]);
    assert.deepEqual(
      result.map((l) => l.id),
      [sameMail.id, samePhone.id],
    );
  });
});
