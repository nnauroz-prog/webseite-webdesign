import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { dueState, replyDue } from "@/lib/admin/reply-due";

const iso = (d: Date) => d.toISOString();
const Z = (s: string) => new Date(s);

describe("replyDue: Anfrage", () => {
  it("Fr 10:00 → Ziel 14:00, spätestens Mo 12:00", () => {
    const r = replyDue("anfrage", Z("2026-10-30T09:00:00Z"));
    assert.equal(iso(r.ziel), "2026-10-30T13:00:00.000Z");
    assert.equal(iso(r.spaetestens), "2026-11-02T11:00:00.000Z");
  });

  it("Fr 17:30 → Ziel = spätestens = Mo 12:00 (Ziel nur bis 18:00 am selben Tag)", () => {
    const r = replyDue("anfrage", Z("2026-10-30T16:30:00Z"));
    assert.equal(iso(r.ziel), "2026-11-02T11:00:00.000Z");
    assert.equal(iso(r.spaetestens), "2026-11-02T11:00:00.000Z");
  });

  it("Fr 15:00 → Mo 12:00", () => {
    const r = replyDue("anfrage", Z("2026-10-30T14:00:00Z"));
    assert.equal(iso(r.ziel), "2026-11-02T11:00:00.000Z");
  });

  it("Grenzfall 14:00 → 18:00, 14:01 → nächster Werktag 12:00", () => {
    const a = replyDue("anfrage", Z("2026-11-03T13:00:00Z")); // Di 14:00
    assert.equal(iso(a.ziel), "2026-11-03T17:00:00.000Z");
    assert.equal(iso(a.spaetestens), "2026-11-04T11:00:00.000Z");
    const b = replyDue("anfrage", Z("2026-11-03T13:01:00Z")); // Di 14:01
    assert.equal(iso(b.ziel), "2026-11-04T11:00:00.000Z");
  });

  it("Sa 31.10. 11:00 → Mo 2.11. 12:00", () => {
    const r = replyDue("anfrage", Z("2026-10-31T10:00:00Z"));
    assert.equal(iso(r.ziel), "2026-11-02T11:00:00.000Z");
    assert.equal(iso(r.spaetestens), "2026-11-02T11:00:00.000Z");
  });

  it("Di 3.11. 07:00 → Di 3.11. 12:00", () => {
    const r = replyDue("anfrage", Z("2026-11-03T06:00:00Z"));
    assert.equal(iso(r.spaetestens), "2026-11-03T11:00:00.000Z");
    assert.equal(iso(r.ziel), "2026-11-03T11:00:00.000Z");
  });

  it("Mi 5.5.2027 19:00 → Fr 7.5.2027 12:00 (Himmelfahrt übersprungen)", () => {
    const r = replyDue("anfrage", Z("2027-05-05T17:00:00Z"));
    assert.equal(iso(r.spaetestens), "2027-05-07T10:00:00.000Z");
  });

  it("Fr 26.3.2027 20:00 (Karfreitag) → Di 30.3.2027 12:00 MESZ (Ostermontag, Zeitumstellung)", () => {
    const r = replyDue("anfrage", Z("2027-03-26T19:00:00Z"));
    assert.equal(iso(r.spaetestens), "2027-03-30T10:00:00.000Z");
    assert.equal(iso(r.ziel), "2027-03-30T10:00:00.000Z");
  });
});

describe("replyDue: Audit und Termin", () => {
  it("Audit: zwei Werktage, Ostermontag übersprungen, über die Zeitumstellung (Sa 27.3. → Mi 31.3. 18:00 MESZ)", () => {
    const r = replyDue("audit", Z("2027-03-27T09:00:00Z"));
    assert.equal(iso(r.spaetestens), "2027-03-31T16:00:00.000Z");
    assert.equal(iso(r.ziel), iso(r.spaetestens));
  });

  it("Termin Mo 17:59 → 18:00 am selben Tag, Mo 18:01 → Di 18:00", () => {
    assert.equal(
      iso(replyDue("termin", Z("2026-11-02T16:59:00Z")).spaetestens),
      "2026-11-02T17:00:00.000Z",
    );
    assert.equal(
      iso(replyDue("termin", Z("2026-11-02T17:01:00Z")).spaetestens),
      "2026-11-03T17:00:00.000Z",
    );
  });

  it("Termin am Wochenende → nächster Werktag 18:00", () => {
    assert.equal(
      iso(replyDue("termin", Z("2026-10-31T10:00:00Z")).spaetestens),
      "2026-11-02T17:00:00.000Z",
    );
  });
});

describe("dueState", () => {
  const created = Z("2026-10-30T09:00:00Z"); // Fr 10:00

  it("offen", () => {
    const s = dueState("anfrage", created, Z("2026-10-30T10:00:00Z"));
    assert.equal(s.level, "offen");
    assert.equal(s.label, "Antwort bis 14:00");
    assert.equal(s.sortKey, Z("2026-11-02T11:00:00Z").getTime());
  });

  it("ziel_verpasst", () => {
    const s = dueState("anfrage", created, Z("2026-10-30T14:00:00Z"));
    assert.equal(s.level, "ziel_verpasst");
    assert.equal(s.label, "4-Std-Ziel verpasst · Antwort spätestens Mo 12:00");
  });

  it("ueberfaellig mit Min, Std und Tagen", () => {
    assert.equal(
      dueState("anfrage", created, Z("2026-11-02T11:40:00Z")).label,
      "Antwort überfällig seit 40 Min",
    );
    const s = dueState("anfrage", created, Z("2026-11-02T13:00:00Z"));
    assert.equal(s.level, "ueberfaellig");
    assert.equal(s.label, "Antwort überfällig seit 2 Std");
    assert.equal(
      dueState("anfrage", created, Z("2026-11-03T12:00:00Z")).label,
      "Antwort überfällig seit 1 Tag",
    );
    assert.equal(
      dueState("anfrage", created, Z("2026-11-05T12:00:00Z")).label,
      "Antwort überfällig seit 3 Tagen",
    );
  });

  it("Termin: „Bestätigen bis 18:00“", () => {
    const s = dueState(
      "termin",
      Z("2026-11-02T09:00:00Z"),
      Z("2026-11-02T10:00:00Z"),
    );
    assert.equal(s.label, "Bestätigen bis 18:00");
    const late = dueState(
      "termin",
      Z("2026-11-02T09:00:00Z"),
      Z("2026-11-02T19:00:00Z"),
    );
    assert.equal(late.label, "Bestätigung überfällig seit 2 Std");
  });
});
