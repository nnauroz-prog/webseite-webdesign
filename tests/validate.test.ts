import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { addDays, berlinDateIso } from "@/lib/admin/berlin-time";
import { templatesFor } from "@/lib/admin/reply-templates";
import {
  parseConfirm,
  parseContact,
  parseDeleteReason,
  parseId,
  parseIsoDate,
  parseLostReason,
  parseNext,
  parseNote,
  parseNotes,
  parseOutcome,
  parseSnapshot,
  parseStatus,
  parseStoredDate,
  parseFingerprint,
  parseQuery,
  parseTemplateId,
  REPLY_TEMPLATE_IDS,
} from "@/lib/admin/validate";
import { makeLead } from "@/tests/helpers";

const UUID = "3f2b8c1e-9d4a-4b6e-8f1a-2c3d4e5f6a7b";
const now = new Date("2026-10-31T12:00:00Z");
const today = berlinDateIso(now);

describe("Whitelists", () => {
  it("parseId", () => {
    assert.equal(parseId(UUID), UUID);
    assert.equal(parseId(UUID.toUpperCase()), UUID);
    assert.equal(parseId("x"), null);
    assert.equal(parseId(`${UUID}?x`), null);
    assert.equal(parseId(undefined), null);
  });

  it("Status, Ergebnis, Gründe", () => {
    assert.equal(parseStatus("in_arbeit"), "in_arbeit");
    assert.equal(parseStatus("geloescht"), null);
    assert.equal(parseOutcome("gewonnen"), "gewonnen");
    assert.equal(parseOutcome("vielleicht"), null);
    assert.equal(parseLostReason("preis"), "preis");
    assert.equal(parseLostReason("Preis"), null);
    assert.equal(parseDeleteReason("anfrage_person"), "anfrage_person");
    assert.equal(parseDeleteReason("alles"), null);
  });

  it("parseContact gegen CONTACT_RESULTS", () => {
    assert.deepEqual(parseContact("anruf", "mailbox"), {
      kanal: "anruf",
      ergebnis: "mailbox",
    });
    assert.deepEqual(parseContact("mail", "gesendet"), {
      kanal: "mail",
      ergebnis: "gesendet",
    });
    assert.equal(parseContact("anruf", "xyz"), null);
    assert.equal(parseContact("mail", "erreicht"), null);
    assert.equal(parseContact("fax", "gesendet"), null);
    assert.equal(parseContact("toString", "x"), null);
  });

  it("parseConfirm", () => {
    assert.equal(parseConfirm("ja"), true);
    assert.equal(parseConfirm("on"), false);
    assert.equal(parseConfirm(null), false);
  });
});

describe("Daten", () => {
  it("parseIsoDate: echtes Datum, gestern bis +400 Tage", () => {
    assert.equal(parseIsoDate(today, now), today);
    assert.equal(parseIsoDate(addDays(today, -1), now), addDays(today, -1));
    assert.equal(parseIsoDate(addDays(today, -2), now), null);
    assert.equal(parseIsoDate(addDays(today, 400), now), addDays(today, 400));
    assert.equal(parseIsoDate(addDays(today, 401), now), null);
    assert.equal(parseIsoDate("2026-02-30", now), null);
    assert.equal(parseIsoDate("2026-11-4", now), null);
    assert.equal(parseIsoDate("2026-11-04T00:00", now), null);
  });

  it("parseStoredDate: ohne Bezug auf heute, 2020 bis 2100", () => {
    assert.equal(parseStoredDate(addDays(today, -3)), addDays(today, -3));
    assert.equal(parseStoredDate("2020-01-01"), "2020-01-01");
    assert.equal(parseStoredDate("2019-12-31"), null);
    assert.equal(parseStoredDate("2101-01-01"), null);
    assert.equal(parseStoredDate("2026-13-01"), null);
  });

  it("Rückgängig mit überfälliger Wiedervorlage (heute −3) ist gültig", () => {
    const overdue = addDays(today, -3);
    assert.equal(parseIsoDate(overdue, now), null); // für neue Eingaben zu alt
    assert.deepEqual(
      parseSnapshot({
        status: "in_arbeit",
        follow_up_on: overdue,
        outcome: null,
        lost_reason: null,
      }),
      {
        status: "in_arbeit",
        follow_up_on: overdue,
        outcome: null,
        lost_reason: null,
      },
    );
  });

  it("parseSnapshot prüft jedes Feld", () => {
    assert.deepEqual(
      parseSnapshot({
        status: "erledigt",
        outcome: "verloren",
        lost_reason: "preis",
      }),
      {
        status: "erledigt",
        follow_up_on: null,
        outcome: "verloren",
        lost_reason: "preis",
      },
    );
    assert.equal(parseSnapshot({ status: "erledigt", outcome: "xyz" }), null);
    assert.equal(
      parseSnapshot({ status: "neu", follow_up_on: "morgen" }),
      null,
    );
    assert.equal(
      parseSnapshot({ status: "neu", lost_reason: "<script>" }),
      null,
    );
    assert.equal(parseSnapshot({ status: "weg" }), null);
    assert.equal(parseSnapshot(null), null);
  });
});

describe("Texte", () => {
  it("parseNote: getrimmt, 1 bis 500 Zeichen", () => {
    assert.equal(parseNote("  Angebot geschickt "), "Angebot geschickt");
    assert.equal(parseNote("   "), null);
    assert.equal(parseNote("x".repeat(500))?.length, 500);
    assert.equal(parseNote("x".repeat(501)), null);
    assert.equal(parseNote(42), null);
  });

  it("parseNotes: bis 5000 Zeichen, leer erlaubt", () => {
    assert.equal(parseNotes(""), "");
    assert.equal(parseNotes("a\r\nb"), "a\nb");
    assert.equal(parseNotes("x".repeat(5001)), null);
  });
});

describe("parseNext (Weiterleitung nach dem Login)", () => {
  it("erlaubt nur /admin und /admin/anfragen/<uuid>", () => {
    assert.equal(parseNext("/admin"), "/admin");
    assert.equal(
      parseNext(`/admin/anfragen/${UUID}`),
      `/admin/anfragen/${UUID}`,
    );
  });

  it("verhindert offene Weiterleitungen", () => {
    for (const bad of [
      "//evil.example",
      "/\\evil.example",
      "https://evil.example/admin",
      "/admin/../x",
      "/admin//evil.example",
      "/admin/anfragen/x",
      `/admin/anfragen/${UUID}/../../x`,
      `/admin/anfragen/${UUID}?x=1`,
      "/admin/login",
      "admin",
      "",
      null,
    ]) {
      assert.equal(parseNext(bad), null, String(bad));
    }
  });
});

describe("parseTemplateId", () => {
  it("kennt alle Vorlagen-IDs aus templatesFor", () => {
    const now = new Date("2026-10-31T12:00:00Z");
    const ids = new Set<string>();
    for (const kind of ["anfrage", "audit", "termin"] as const) {
      for (const status of ["neu", "in_arbeit"] as const) {
        for (const t of templatesFor(makeLead({ kind, status }), now))
          ids.add(t.id);
      }
    }
    for (const id of ids) assert.equal(parseTemplateId(id), id);
    assert.deepEqual([...ids].sort(), [...REPLY_TEMPLATE_IDS].sort());
  });

  it("lehnt Unbekanntes ab", () => {
    for (const bad of ["", "ABSAGE", "absage ", "x", null, 1]) {
      assert.equal(parseTemplateId(bad), null);
    }
  });
});

describe("parseFingerprint und parseQuery", () => {
  it("Fingerabdruck: genau 8 Hex-Zeichen", () => {
    assert.equal(parseFingerprint("0a1b2c3d"), "0a1b2c3d");
    for (const bad of ["0A1B2C3D", "0a1b2c3", "0a1b2c3dz", "", null]) {
      assert.equal(parseFingerprint(bad), null);
    }
  });

  it("Suchbegriff: getrimmt, ≤ 100 Zeichen", () => {
    assert.equal(parseQuery("  Lisa   Weber "), "Lisa Weber");
    assert.equal(parseQuery(null), "");
    assert.equal(parseQuery("x".repeat(101)), null);
  });
});
