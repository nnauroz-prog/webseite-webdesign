import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  cardModel,
  dayLabel,
  firstNoteLine,
  relativeDay,
  sqlEditorUrl,
} from "@/lib/admin/card-model";
import { followUpChips, followUpView, isPastDate } from "@/lib/admin/follow-up";
import {
  eventText,
  hasOutcomeEvent,
  outcomeText,
  timelineLines,
} from "@/lib/admin/timeline";

import { makeLead } from "@/tests/helpers";

// Samstag, 31.10.2026, 15:00 in Hamburg (MEZ)
const SAT = new Date("2026-10-31T14:00:00Z");

describe("followUpChips", () => {
  it("rechnet ab Samstag mit Werktagen und schiebt Wochen auf Werktage", () => {
    assert.deepEqual(
      followUpChips(SAT).map((c) => c.label),
      [
        "Nächster Werktag (Mo 2.11.)",
        "In 3 Werktagen (Mi 4.11.)",
        "In einer Woche (Mo 9.11.)",
        "In 2 Wochen (Mo 16.11.)",
      ],
    );
    assert.equal(followUpChips(SAT)[0].iso, "2026-11-02");
  });

  it("zeigt rund um Ostern keinen Tag doppelt", () => {
    // Di 31.3.2026: Karfreitag 3.4. und Ostermontag 6.4. sind frei,
    // „In 3 Werktagen“ und „In einer Woche“ fallen beide auf Di 7.4.
    const chips = followUpChips(new Date("2026-03-31T10:00:00Z"));
    assert.deepEqual(
      chips.map((c) => c.iso),
      ["2026-04-01", "2026-04-07", "2026-04-14"],
    );
    assert.equal(new Set(chips.map((c) => c.iso)).size, chips.length);
  });

  it("hat über zwei Jahre nie doppelte Tage", () => {
    for (let d = 0; d < 730; d++) {
      const now = new Date(Date.UTC(2026, 0, 1, 10) + d * 86_400_000);
      const isos = followUpChips(now).map((c) => c.iso);
      assert.equal(new Set(isos).size, isos.length, now.toISOString());
    }
  });
});

describe("isPastDate", () => {
  it("erkennt Daten vor heute, nicht heute, Zukunft oder Unsinn", () => {
    assert.equal(isPastDate("2026-10-24", "2026-10-31"), true);
    assert.equal(isPastDate("2026-10-31", "2026-10-31"), false);
    assert.equal(isPastDate("2026-11-02", "2026-10-31"), false);
    assert.equal(isPastDate("gestern", "2026-10-31"), false);
    assert.equal(isPastDate(null, "2026-10-31"), false);
  });
});

describe("followUpView", () => {
  it("fällig, heute und künftig", () => {
    assert.deepEqual(followUpView("2026-10-29", SAT), {
      iso: "2026-10-29",
      day: "Do 29.10.",
      due: true,
      hint: "fällig seit 2 Tagen",
    });
    assert.equal(followUpView("2026-10-30", SAT).hint, "fällig seit 1 Tag");
    assert.equal(followUpView("2026-10-31", SAT).hint, "heute fällig");
    assert.equal(followUpView("2026-11-01", SAT).hint, "morgen");
    assert.equal(followUpView("2026-11-04", SAT).due, false);
  });
});

describe("cardModel", () => {
  it("zeigt Frist nur bei neu und Wiedervorlage nur offen", () => {
    const neu = cardModel(
      makeLead({
        created_at: "2026-10-30T08:00:00Z",
        fields: [
          ["Name", "Lisa Weber"],
          ["Firma", "Weber GmbH"],
          ["Telefon", "+49 (0)40 123 456"],
        ],
      }),
      SAT,
    );
    assert.equal(neu.name, "Lisa Weber");
    assert.equal(neu.firma, "Weber GmbH");
    assert.equal(neu.tel, "tel:+4940123456");
    assert.ok(neu.due);

    const erledigt = cardModel(
      makeLead({ status: "erledigt", follow_up_on: "2026-11-02", outcome: "verloren" }),
      SAT,
    );
    assert.equal(erledigt.due, null);
    assert.equal(erledigt.followUp, null);
    assert.deepEqual(erledigt.outcome, { label: "Kein Auftrag", won: false });

    const wv = cardModel(makeLead({ status: "in_arbeit", follow_up_on: "2026-10-30" }), SAT);
    assert.equal(wv.followUp, "Wiedervorlage Fr 30.10.");
    assert.equal(wv.followUpDue, true);
  });

  it("kommt ohne notes aus (Suchtreffer) und ohne Namen", () => {
    const lead = makeLead({ fields: [], reply_to: "x@y.de" });
    const hit: Partial<typeof lead> = { ...lead };
    delete hit.notes;
    assert.equal(cardModel(hit as typeof lead, SAT).name, "x@y.de");
  });
});

describe("Tage und Notizen", () => {
  it("relativeDay und dayLabel", () => {
    assert.equal(relativeDay("2026-10-31", SAT), "heute");
    assert.equal(relativeDay("2026-11-03", SAT), "in 3 Tagen");
    assert.equal(relativeDay("2026-10-29", SAT), "vor 2 Tagen");
    assert.equal(dayLabel("2026-11-01", SAT), "Morgen");
    assert.equal(dayLabel("2026-11-02", SAT), "Mo 2.11.");
  });
  it("firstNoteLine", () => {
    assert.equal(firstNoteLine("\n  31.10. 14:12 · Angebot\nalt"), "31.10. 14:12 · Angebot");
    assert.equal(firstNoteLine(""), undefined);
  });
});

describe("sqlEditorUrl", () => {
  it("Projekt-Link nur für {ref}.supabase.co", () => {
    assert.equal(
      sqlEditorUrl("https://abcdefghijklmnop1234.supabase.co"),
      "https://supabase.com/dashboard/project/abcdefghijklmnop1234/sql/new",
    );
    assert.equal(sqlEditorUrl("http://localhost:54321"), "https://supabase.com/dashboard");
    assert.equal(sqlEditorUrl(undefined), "https://supabase.com/dashboard");
    assert.equal(sqlEditorUrl("https://evil.example/x.supabase.co"), "https://supabase.com/dashboard");
  });
});

describe("Verlauf", () => {
  const ev = (action: string, detail: Record<string, unknown>, at = "2026-10-31T13:02:00Z") => ({
    id: `${action}-${at}`,
    lead_id: "l",
    created_at: at,
    actor: "admin@sitalo.de",
    action: action as "status",
    detail,
  });

  it("Zeilentexte", () => {
    assert.equal(eventText(ev("status", { from: "neu", to: "in_arbeit" })), "Status: Neu → In Arbeit");
    assert.equal(
      eventText(ev("status", { from: "erledigt", to: "neu", rueckgaengig: true })),
      "Status: Erledigt → Neu (rückgängig)",
    );
    assert.equal(eventText(ev("kontakt", { kanal: "anruf", ergebnis: "mailbox" })), "Anruf: Mailbox");
    assert.equal(
      eventText(ev("kontakt", { kanal: "mail", ergebnis: "gesendet", vorlage: "absage" })),
      "Mail gesendet: Freundliche Absage",
    );
    assert.equal(eventText(ev("wiedervorlage", { am: "2026-11-04" })), "Wiedervorlage auf Mi 4.11.");
    assert.equal(eventText(ev("wiedervorlage", { am: null })), "Wiedervorlage entfernt");
    assert.equal(
      eventText(ev("ergebnis", { outcome: "verloren", lost_reason: "preis" })),
      "Ergebnis: Kein Auftrag (Preis)",
    );
    assert.equal(outcomeText(null, null), "ohne Angabe");
    assert.equal(outcomeText("gewonnen", "preis"), "Auftrag erhalten");
    // Fremde Werte erscheinen nicht roh.
    assert.equal(eventText(ev("status", { from: "<b>", to: "neu" })), "Status: ? → Neu");
  });

  it("blendet Notiz-Ereignisse aus, unten immer Zustellung und Eingang", () => {
    const lines = timelineLines(
      [
        ev("notizen", { zeichen: 12 }, "2026-10-31T13:05:00Z"),
        ev("notiz", { zeichen: 3 }, "2026-10-31T13:04:00Z"),
        ev("status", { from: "neu", to: "in_arbeit" }),
      ],
      { created_at: "2026-10-30T08:00:00Z", delivered_via: "resend", delivery_error: null },
    );
    assert.deepEqual(
      lines.map((l) => l.text),
      ["Status: Neu → In Arbeit", "Benachrichtigung über Resend", "Eingegangen"],
    );
    assert.equal(lines[0].time, "31.10., 14:02");
    const failed = timelineLines([], {
      created_at: "2026-10-30T08:00:00Z",
      delivered_via: null,
      delivery_error: "x",
    });
    assert.equal(failed[0].text, "Benachrichtigung fehlgeschlagen");
  });

  it("hasOutcomeEvent", () => {
    assert.equal(hasOutcomeEvent(null), false);
    assert.equal(hasOutcomeEvent([ev("ergebnis", { outcome: null })]), true);
  });
});
