import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildTerminIcs, terminIcsFilename } from "@/lib/admin/termin-ics";
import { parseTerminSlot } from "@/lib/admin/termin-slot";
import { makeLead } from "@/tests/helpers";

const bytes = (s: string) => new TextEncoder().encode(s).length;
const unfold = (doc: string) => doc.replace(/\r\n /g, "");
const now = new Date("2026-10-31T13:12:00Z");

function terminLead(fields: [string, string][], notes = "") {
  return makeLead({
    id: "3f2b8c1e-9d4a-4b6e-8f1a-2c3d4e5f6a7b",
    kind: "termin",
    subject: "Terminbuchung von Lisa Weber — 2026-11-03 10:00",
    reply_to: "lisa@example.de",
    fields,
    notes,
  });
}

describe("Termin-Kalenderdatei im Admin", () => {
  const lead = terminLead(
    [
      ["Wunsch-Slot", "Dienstag, 3. November 2026 um 10:00 Uhr (30 Min)"],
      ["Name", "Lisa Weber"],
      ["E-Mail", "lisa@example.de"],
      ["Telefon", "0176 1234567"],
      ["Notiz", "Bitte kurz vorher anrufen"],
    ],
    "INTERN: Preis eher knapp",
  );
  const slot = parseTerminSlot(lead)!;
  const doc = buildTerminIcs(lead, slot, now);
  const flat = unfold(doc);

  it("UID, Zeiten mit TZID und DTSTAMP", () => {
    assert.match(
      flat,
      /\r\nUID:3f2b8c1e-9d4a-4b6e-8f1a-2c3d4e5f6a7b@sitalo\.de\r\n/,
    );
    assert.match(flat, /\r\nDTSTART;TZID=Europe\/Berlin:20261103T100000\r\n/);
    assert.match(flat, /\r\nDTEND;TZID=Europe\/Berlin:20261103T103000\r\n/);
    assert.match(flat, /\r\nDTSTAMP:20261031T131200Z\r\n/);
    assert.match(flat, /BEGIN:VTIMEZONE/);
    assert.equal(terminIcsFilename(slot), "termin-2026-11-03-1000.ics");
  });

  it("DESCRIPTION nur aus Wunsch-Slot, Telefon und Notiz (Formular)", () => {
    assert.match(flat, /SUMMARY:Erstgespräch: Lisa Weber \(Sitalo Webdesign\)/);
    assert.match(
      flat,
      /DESCRIPTION:Wunsch-Slot: Dienstag\\, 3\. November 2026 um 10:00 Uhr \(30 Min\)\\nTelefon: 0176 1234567\\nNotiz: Bitte kurz vorher anrufen\r\n/,
    );
  });

  it("keine internen Notizen, keine E-Mail, kein Link", () => {
    assert.ok(!doc.includes("INTERN"));
    assert.ok(!flat.includes("lisa@example.de"));
    assert.ok(!/\r\n(URL|LOCATION|ATTENDEE|ORGANIZER)[:;]/.test(flat));
    assert.ok(!flat.includes("/admin"));
  });

  it("eingeschleuste Zeilen bleiben Text, Zeilen ≤ 75 Bytes", () => {
    const evil = terminLead([
      ["Name", "Eva\rURL:https://evil.example\r\nBEGIN:VALARM"],
      ["Telefon", "040 123\nATTENDEE:mailto:x@evil.example"],
      ["Notiz", "Grüße aus Hamburg 🎉 ".repeat(8)],
    ]);
    const out = buildTerminIcs(evil, parseTerminSlot(evil)!, now);
    const lines = unfold(out).split("\r\n");
    assert.ok(!lines.some((l) => /^(URL|ATTENDEE|BEGIN:VALARM)/.test(l)));
    for (const line of out.split("\r\n")) assert.ok(bytes(line) <= 75, line);
  });

  it("ohne Name und ohne Zusatzfelder", () => {
    const bare = terminLead([["E-Mail", "x@example.de"]]);
    const out = unfold(buildTerminIcs(bare, parseTerminSlot(bare)!, now));
    assert.match(out, /SUMMARY:Erstgespräch \(Sitalo Webdesign\)/);
    assert.ok(!out.includes("DESCRIPTION"));
  });
});
