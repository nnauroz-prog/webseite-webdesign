import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { notesFingerprint, prependNoteLine } from "@/lib/admin/notes";

const now = new Date("2026-10-31T13:12:00Z"); // 14:12 in Hamburg

describe("prependNoteLine", () => {
  it("setzt die Zeile mit Berlin-Zeit oben an", () => {
    assert.equal(
      prependNoteLine("", "Rückruf vereinbart", now),
      "31.10. 14:12 · Rückruf vereinbart",
    );
    assert.equal(
      prependNoteLine("30.10. 09:00 · alt", "neu", now),
      "31.10. 14:12 · neu\n30.10. 09:00 · alt",
    );
    // Sommerzeit
    assert.equal(
      prependNoteLine("", "x", new Date("2026-07-01T08:05:00Z")),
      "1.7. 10:05 · x",
    );
  });

  it("macht aus mehrzeiligem Text eine Zeile", () => {
    assert.equal(
      prependNoteLine("", "Zeile 1\r\nZeile 2\n\n", now),
      "31.10. 14:12 · Zeile 1 · Zeile 2",
    );
  });

  it("kürzt über 5000 Zeichen von hinten an Zeilengrenzen", () => {
    const old = Array.from(
      { length: 100 },
      (_, i) => `${String(i).padStart(3, "0")} ${"x".repeat(55)}`,
    ).join("\n");
    assert.ok(old.length > 5000);
    const result = prependNoteLine(old, "neu", now);
    assert.ok(result.length <= 5000);
    const lines = result.split("\n");
    assert.equal(lines[0], "31.10. 14:12 · neu");
    assert.ok(lines[1].startsWith("000 "));
    // nur ganze Zeilen
    for (const l of lines.slice(1)) assert.equal(l.length, 59);
  });
});

describe("notesFingerprint", () => {
  it("ist stabil und unterscheidet minimale Änderungen", () => {
    assert.equal(notesFingerprint("abc"), notesFingerprint("abc"));
    assert.match(notesFingerprint("abc"), /^[0-9a-f]{8}$/);
    assert.notEqual(notesFingerprint("abc"), notesFingerprint("abd"));
    assert.notEqual(notesFingerprint("abc"), notesFingerprint("abc "));
    assert.notEqual(notesFingerprint("ä"), notesFingerprint("a"));
    // FNV-1a-Referenzwerte
    assert.equal(notesFingerprint(""), "811c9dc5");
    assert.equal(notesFingerprint("a"), "e40c292c");
  });
});
