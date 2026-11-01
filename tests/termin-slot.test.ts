import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { freeSlotChoices, parseTerminSlot } from "@/lib/admin/termin-slot";

describe("parseTerminSlot", () => {
  it("liest den Betreff aus termin-booking.tsx", () => {
    const slot = parseTerminSlot({
      subject: "Terminbuchung von Lisa Weber — 2026-11-03 10:00",
      fields: [],
    });
    assert.ok(slot);
    assert.equal(slot.start.toISOString(), "2026-11-03T09:00:00.000Z");
    assert.equal(slot.end.toISOString(), "2026-11-03T09:30:00.000Z");
    assert.equal(slot.dateIso, "2026-11-03");
    assert.equal(slot.time, "10:00");
  });

  it("Sommerzeit wird berücksichtigt", () => {
    const slot = parseTerminSlot({
      subject: "Terminbuchung von X — 2027-06-15 14:30",
      fields: [],
    });
    assert.equal(slot?.start.toISOString(), "2027-06-15T12:30:00.000Z");
  });

  it("Fallback über das Feld „Wunsch-Slot“, wenn der Betreff abgeschnitten ist", () => {
    const slot = parseTerminSlot({
      subject: "Terminbuchung von Lisa Weber mit einem sehr langen Namen —",
      fields: [
        ["Wunsch-Slot", "Dienstag, 3. November 2026 um 10:00 Uhr (30 Min)"],
      ],
    });
    assert.equal(slot?.start.toISOString(), "2026-11-03T09:00:00.000Z");
    assert.equal(slot?.time, "10:00");
    const maerz = parseTerminSlot({
      subject: "x",
      fields: [["Wunsch-Slot", "Montag, 1. März 2027 um 9:30 Uhr (30 Min)"]],
    });
    assert.equal(maerz?.dateIso, "2027-03-01");
    assert.equal(maerz?.time, "09:30");
  });

  it("Unlesbares ergibt null", () => {
    assert.equal(
      parseTerminSlot({ subject: "Neue Anfrage von X", fields: [] }),
      null,
    );
    assert.equal(
      parseTerminSlot({
        subject: "Terminbuchung — 2026-02-31 10:00",
        fields: [],
      }),
      null,
    );
    assert.equal(
      parseTerminSlot({
        subject: "x",
        fields: [["Wunsch-Slot", "irgendwann nächste Woche"]],
      }),
      null,
    );
  });
});

describe("freeSlotChoices", () => {
  it("überspringt Wochenende, Feiertage und zu knappe Zeiten", () => {
    // Fr 30.10.2026, 15:30 in Hamburg: heute nur noch 17:30+ → nichts mehr frei
    const days = freeSlotChoices(new Date("2026-10-30T14:30:00Z"), 3);
    assert.deepEqual(
      days.map((d) => d.dateIso),
      ["2026-11-02", "2026-11-03", "2026-11-04"],
    );
    assert.equal(days[0].times[0], "10:00");

    // Morgens: heute ab Vorlauf (MIN_LEAD_MINUTES = 120)
    const morning = freeSlotChoices(new Date("2026-11-02T08:30:00Z"), 1); // 9:30
    assert.equal(morning[0].dateIso, "2026-11-02");
    assert.equal(morning[0].times[0], "11:30");
  });
});
