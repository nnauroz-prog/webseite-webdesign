import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { buildToday } from "@/lib/admin/today";

import { makeLead } from "@/tests/helpers";

const termin = (
  date: string,
  time: string,
  status: "neu" | "in_arbeit" | "erledigt" | "archiviert" = "neu",
) =>
  makeLead({
    kind: "termin",
    status,
    subject: `Terminbuchung von Lisa Weber — ${date} ${time}`,
    created_at: "2026-10-28T09:00:00.000Z",
  });

describe("buildToday", () => {
  // Freitag, 30.10.2026, 10:00 in Hamburg
  const now = new Date("2026-10-30T09:00:00Z");

  const a = makeLead({ created_at: "2026-10-30T08:30:00.000Z" }); // Fr 9:30 → Mo 12:00
  const b = makeLead({ created_at: "2026-10-29T18:00:00.000Z" }); // Do 19:00 → Fr 12:00
  const c = makeLead({ kind: "audit", created_at: "2026-10-29T09:00:00.000Z" }); // → zwei Werktage → Mo 18:00
  const erledigt = makeLead({
    status: "erledigt",
    created_at: "2026-10-20T09:00:00.000Z",
  });
  const archiviert = makeLead({
    status: "archiviert",
    created_at: "2026-10-19T09:00:00.000Z",
  });
  const heute = termin("2026-10-30", "14:00");
  const montag = termin("2026-11-02", "10:00", "in_arbeit");
  const mittwoch = termin("2026-11-04", "10:00");
  const terminErledigt = termin("2026-10-30", "11:00", "erledigt");
  const wvAlt = makeLead({ status: "in_arbeit", follow_up_on: "2026-10-28" });
  const wvHeute = makeLead({ status: "in_arbeit", follow_up_on: "2026-10-30" });
  const wvSpaeter = makeLead({
    status: "in_arbeit",
    follow_up_on: "2026-11-05",
  });
  const wvNochSpaeter = makeLead({
    status: "neu",
    follow_up_on: "2026-11-20",
    created_at: "2026-10-01T09:00:00.000Z",
  });
  const wvErledigt = makeLead({
    status: "erledigt",
    follow_up_on: "2026-10-01",
  });
  // Altbestand ohne Migration: Feld fehlt ganz
  const v1 = makeLead({ status: "in_arbeit" });
  delete (v1 as Partial<typeof v1>).follow_up_on;

  const view = buildToday(
    [
      a,
      b,
      c,
      erledigt,
      archiviert,
      heute,
      montag,
      mittwoch,
      terminErledigt,
      wvAlt,
      wvHeute,
      wvSpaeter,
      wvNochSpaeter,
      wvErledigt,
      v1,
    ],
    now,
  );

  it("melden: nur status neu, nach spätestens sortiert", () => {
    const ids = view.melden.map((l) => l.id);
    assert.ok(
      !ids.includes(erledigt.id) &&
        !ids.includes(archiviert.id) &&
        !ids.includes(wvAlt.id),
    );
    // wvNochSpaeter (Eingang 1.10.), die beiden neuen Termine (Mi 28.10.
    // 18:00), dann b (Fr 12:00), a (Mo 12:00), c (Mo 18:00)
    assert.deepEqual(ids, [
      wvNochSpaeter.id,
      heute.id,
      mittwoch.id,
      b.id,
      a.id,
      c.id,
    ]);
  });

  it("termine: heute plus 2 Werktage (freitags also bis Dienstag), nur neu/in_arbeit", () => {
    assert.deepEqual(
      view.termine.map((t) => t.lead.id),
      [heute.id, montag.id],
    );
    assert.equal(view.termine[1].slot.dateIso, "2026-11-02");
  });

  it("wiedervorlagen: fällig (≤ heute), offen, älteste zuerst", () => {
    assert.deepEqual(
      view.wiedervorlagen.map((l) => l.id),
      [wvAlt.id, wvHeute.id],
    );
  });

  it("naechsteWiedervorlage: kleinstes künftiges Datum", () => {
    assert.equal(view.naechsteWiedervorlage, "2026-11-05");
  });

  it("leere Liste ergibt leere Abschnitte ohne naechsteWiedervorlage", () => {
    const empty = buildToday([], now);
    assert.deepEqual(empty, { melden: [], termine: [], wiedervorlagen: [] });
  });

  it("Montag sieht Termine bis Mittwoch", () => {
    const monday = new Date("2026-11-02T07:00:00Z");
    const v = buildToday(
      [montag, mittwoch, termin("2026-11-05", "10:00")],
      monday,
    );
    assert.deepEqual(
      v.termine.map((t) => t.slot.dateIso),
      ["2026-11-02", "2026-11-04"],
    );
  });
});
