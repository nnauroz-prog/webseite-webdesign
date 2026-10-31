import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { LeadStatus } from "@/lib/leads-meta";

import { contactPatch, restorePatch, statusPatch } from "@/lib/admin/patches";
import { LEAD_STATUSES } from "@/lib/leads-meta";

const NEW_COLUMNS = ["follow_up_on", "outcome", "lost_reason"];

function hasNewColumn(patch: object): boolean {
  return Object.keys(patch).some((k) => NEW_COLUMNS.includes(k));
}

describe("statusPatch", () => {
  it("v1: nur der Status, nie neue Spalten", () => {
    for (const s of LEAD_STATUSES) {
      assert.deepEqual(statusPatch(s, false), { status: s });
    }
  });

  it("v2: Erledigt und Archiviert leeren nur die Wiedervorlage", () => {
    for (const s of ["erledigt", "archiviert"] as LeadStatus[]) {
      assert.deepEqual(statusPatch(s, true), { status: s, follow_up_on: null });
    }
  });

  it("v2: Neu und In Arbeit leeren nur das Ergebnis", () => {
    for (const s of ["neu", "in_arbeit"] as LeadStatus[]) {
      assert.deepEqual(statusPatch(s, true), {
        status: s,
        outcome: null,
        lost_reason: null,
      });
    }
  });
});

describe("contactPatch", () => {
  const anruf = (ergebnis: "erreicht" | "mailbox" | "nicht_erreicht") =>
    ({ kanal: "anruf", ergebnis }) as const;
  const gesendet = { kanal: "mail", ergebnis: "gesendet" } as const;

  it("Erreicht und Mail gesendet: nur neu wird In Arbeit", () => {
    for (const v2 of [false, true]) {
      assert.deepEqual(contactPatch({ status: "neu" }, anruf("erreicht"), null, v2).patch, {
        status: "in_arbeit",
      });
      assert.deepEqual(contactPatch({ status: "neu" }, gesendet, "telefonat", v2).patch, {
        status: "in_arbeit",
      });
      for (const s of ["in_arbeit", "erledigt", "archiviert"] as LeadStatus[]) {
        assert.deepEqual(contactPatch({ status: s }, anruf("erreicht"), null, v2).patch, {});
        assert.deepEqual(contactPatch({ status: s }, gesendet, null, v2).patch, {});
      }
    }
  });

  it("Mailbox und Nicht erreicht ändern nichts", () => {
    for (const v2 of [false, true]) {
      for (const e of ["mailbox", "nicht_erreicht"] as const) {
        const plan = contactPatch({ status: "neu" }, anruf(e), null, v2);
        assert.deepEqual(plan.patch, {});
        assert.equal(plan.isAbsage, false);
        assert.equal(plan.askReason, false);
      }
    }
  });

  it("Absage mit v2: Erledigt, Kein Auftrag, Wiedervorlage leer, Grund fragen", () => {
    const plan = contactPatch({ status: "neu" }, gesendet, "absage", true);
    assert.deepEqual(plan.patch, {
      status: "erledigt",
      follow_up_on: null,
      outcome: "verloren",
      lost_reason: null,
    });
    assert.equal(plan.isAbsage, true);
    assert.equal(plan.askReason, true);
  });

  it("Absage ohne v2: nur Erledigt, keine neuen Spalten, kein Grund", () => {
    const plan = contactPatch({ status: "in_arbeit" }, gesendet, "absage", false);
    assert.deepEqual(plan.patch, { status: "erledigt" });
    assert.equal(hasNewColumn(plan.patch), false);
    assert.equal(plan.isAbsage, true);
    assert.equal(plan.askReason, false);
  });

  it("Absage bei Erledigt oder Archiviert lässt den Status stehen", () => {
    for (const s of ["erledigt", "archiviert"] as LeadStatus[]) {
      assert.equal(contactPatch({ status: s }, gesendet, "absage", true).patch.status, undefined);
      assert.deepEqual(contactPatch({ status: s }, gesendet, "absage", false).patch, {});
    }
  });

  it("v1 sendet in keinem Fall neue Spalten", () => {
    const contacts = [anruf("erreicht"), anruf("mailbox"), anruf("nicht_erreicht"), gesendet];
    for (const s of LEAD_STATUSES) {
      for (const c of contacts) {
        for (const vorlage of [null, "absage", "telefonat"] as const) {
          const { patch } = contactPatch({ status: s }, c, vorlage, false);
          assert.equal(hasNewColumn(patch), false, `${s} ${c.ergebnis} ${vorlage}`);
        }
      }
    }
  });
});

describe("restorePatch", () => {
  const snap = {
    status: "in_arbeit" as LeadStatus,
    follow_up_on: "2026-11-04",
    outcome: null,
    lost_reason: null,
  };

  it("v2: stellt alle Felder wieder her, Grund nur bei verloren", () => {
    assert.deepEqual(restorePatch(snap, true), {
      status: "in_arbeit",
      follow_up_on: "2026-11-04",
      outcome: null,
      lost_reason: null,
    });
    assert.deepEqual(
      restorePatch(
        { status: "erledigt", follow_up_on: null, outcome: "gewonnen", lost_reason: "preis" },
        true,
      ),
      { status: "erledigt", follow_up_on: null, outcome: "gewonnen", lost_reason: null },
    );
    assert.deepEqual(
      restorePatch(
        { status: "erledigt", follow_up_on: null, outcome: "verloren", lost_reason: "preis" },
        true,
      ),
      { status: "erledigt", follow_up_on: null, outcome: "verloren", lost_reason: "preis" },
    );
  });

  it("v1: nur der Status; Schnappschuss mit neuen Feldern ist ungültig", () => {
    assert.deepEqual(restorePatch({ ...snap, follow_up_on: null }, false), {
      status: "in_arbeit",
    });
    assert.equal(restorePatch(snap, false), null);
    assert.equal(restorePatch({ ...snap, follow_up_on: null, outcome: "gewonnen" }, false), null);
  });
});
