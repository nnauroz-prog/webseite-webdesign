import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  addDays,
  addWorkdays,
  berlinDateIso,
  berlinTime,
  berlinWallToUtc,
  formatDayTime,
  formatHeaderDay,
  formatLongDay,
  formatMoment,
  formatShortDay,
  isWorkday,
  nextWorkday,
  relativeTime,
  workdayOnOrAfter,
} from "@/lib/admin/berlin-time";
import { BLOCKED_DATES } from "@/lib/calendar-availability";

describe("berlinDateIso / berlinWallToUtc", () => {
  it("rechnet den Kalendertag in Hamburg, nicht in UTC", () => {
    assert.equal(berlinDateIso(new Date("2026-10-31T23:30:00Z")), "2026-11-01");
    assert.equal(berlinDateIso(new Date("2026-10-31T22:59:00Z")), "2026-10-31");
    // Sommerzeit: +2 h
    assert.equal(berlinDateIso(new Date("2026-07-14T22:30:00Z")), "2026-07-15");
  });

  it("wandelt Hamburger Wandzeit DST-sicher in UTC", () => {
    assert.equal(
      berlinWallToUtc("2026-11-03", "10:00").toISOString(),
      "2026-11-03T09:00:00.000Z",
    );
    assert.equal(
      berlinWallToUtc("2026-07-01", "10:00").toISOString(),
      "2026-07-01T08:00:00.000Z",
    );
    // Tag nach der Umstellung auf Sommerzeit (28.3.2027)
    assert.equal(
      berlinWallToUtc("2027-03-29", "12:00").toISOString(),
      "2027-03-29T10:00:00.000Z",
    );
    // Am Tag der Umstellung auf Winterzeit (25.10.2026)
    assert.equal(
      berlinWallToUtc("2026-10-25", "12:00").toISOString(),
      "2026-10-25T11:00:00.000Z",
    );
    assert.equal(
      berlinWallToUtc("2026-10-25", "00:30").toISOString(),
      "2026-10-24T22:30:00.000Z",
    );
  });

  it("berlinTime", () => {
    assert.equal(berlinTime(new Date("2026-10-31T13:05:00Z")), "14:05");
  });
});

describe("Werktage", () => {
  it("Wochenende und Hamburger Feiertage sind keine Werktage", () => {
    assert.equal(isWorkday("2026-10-30"), true); // Fr
    assert.equal(isWorkday("2026-10-31"), false); // Sa (und Reformationstag)
    assert.equal(isWorkday("2027-01-01"), false); // Neujahr (Fr)
    assert.equal(isWorkday("2025-10-03"), false); // Tag der Deutschen Einheit (Fr)
    assert.equal(isWorkday("2027-03-26"), false); // Karfreitag
    assert.equal(isWorkday("2027-03-29"), false); // Ostermontag
  });

  it("addWorkdays über Wochenende und Feiertage", () => {
    assert.equal(addWorkdays("2026-10-30", 1), "2026-11-02");
    assert.equal(addWorkdays("2026-10-30", 2), "2026-11-03");
    assert.equal(addWorkdays("2026-12-31", 1), "2027-01-04"); // 1.1. ist Freitag
    assert.equal(addWorkdays("2025-10-02", 1), "2025-10-06"); // 3.10. ist Freitag
    assert.equal(addWorkdays("2026-11-03", 0), "2026-11-03");
    assert.equal(nextWorkday("2026-10-31"), "2026-11-02");
    assert.equal(workdayOnOrAfter("2026-11-02"), "2026-11-02");
    assert.equal(workdayOnOrAfter("2026-11-01"), "2026-11-02");
  });

  it("respektiert BLOCKED_DATES", () => {
    BLOCKED_DATES.push("2026-11-04");
    try {
      assert.equal(isWorkday("2026-11-04"), false);
      assert.equal(nextWorkday("2026-11-03"), "2026-11-05");
    } finally {
      BLOCKED_DATES.splice(BLOCKED_DATES.indexOf("2026-11-04"), 1);
    }
    assert.equal(nextWorkday("2026-11-03"), "2026-11-04");
  });

  it("addDays über Monats- und Jahresgrenzen", () => {
    assert.equal(addDays("2026-12-30", 3), "2027-01-02");
    assert.equal(addDays("2026-03-01", -1), "2026-02-28");
  });
});

describe("Formate", () => {
  it("formatShortDay / formatLongDay / formatHeaderDay / formatDayTime", () => {
    assert.equal(formatShortDay("2026-11-04"), "Mi 4.11.");
    assert.equal(formatLongDay("2026-11-03"), "Dienstag, 3. November");
    assert.equal(
      formatLongDay("2026-11-03", true),
      "Dienstag, 3. November 2026",
    );
    assert.equal(
      formatHeaderDay(new Date("2026-10-31T13:05:00Z")),
      "Sa, 31. Oktober",
    );
    assert.equal(
      formatDayTime(new Date("2026-11-02T11:00:00Z")),
      "Mo 2.11. 12:00",
    );
  });

  it("formatMoment: heute nur Uhrzeit, diese Woche Wochentag", () => {
    const now = new Date("2026-10-30T09:00:00Z"); // Fr 10:00
    assert.equal(formatMoment(new Date("2026-10-30T14:10:00Z"), now), "15:10");
    assert.equal(
      formatMoment(new Date("2026-11-02T11:00:00Z"), now),
      "Mo 12:00",
    );
    assert.equal(
      formatMoment(new Date("2026-11-20T11:00:00Z"), now),
      "Fr 20.11. 12:00",
    );
  });

  it("relativeTime", () => {
    const now = new Date("2026-10-31T13:05:00Z"); // Sa 14:05
    assert.equal(
      relativeTime(new Date("2026-10-31T13:04:30Z"), now),
      "gerade eben",
    );
    assert.equal(
      relativeTime(new Date("2026-10-31T13:00:00Z"), now),
      "vor 5 Min",
    );
    assert.equal(
      relativeTime(new Date("2026-10-31T12:40:00Z"), now),
      "vor 25 Min",
    );
    assert.equal(
      relativeTime(new Date("2026-10-31T08:00:00Z"), now),
      "heute 09:00",
    );
    assert.equal(
      relativeTime(new Date("2026-10-30T17:40:00Z"), now),
      "gestern 18:40",
    );
    assert.equal(
      relativeTime(new Date("2026-10-26T10:00:00Z"), now),
      "Mo 26.10.",
    );
    assert.equal(
      relativeTime(new Date("2025-08-12T10:00:00Z"), now),
      "12.08.25",
    );
  });
});
