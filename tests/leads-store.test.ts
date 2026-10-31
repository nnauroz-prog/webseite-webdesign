import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";

import { addDays, berlinDateIso } from "@/lib/admin/berlin-time";
import { DbError, explainDbError } from "@/lib/admin/db-errors";
import { parseIsoDate, parseSnapshot } from "@/lib/admin/validate";
import { SERVICE_KEY, startMock } from "@/tests/supabase-mock.mjs";

type Mock = Awaited<ReturnType<typeof startMock>>;
type Store = typeof import("@/lib/leads-store");

let mock: Mock;
let store: Store;

const lead = {
  kind: "anfrage" as const,
  subject: "Neue Anfrage von Lisa Weber",
  replyTo: "lisa@example.de",
  fields: [
    ["Name", "Lisa Weber"],
    ["E-Mail", "lisa@example.de"],
  ] as [string, string][],
};

before(async () => {
  mock = await startMock({ mode: "v1" });
  process.env.NEXT_PUBLIC_SUPABASE_URL = mock.url;
  process.env.SUPABASE_SERVICE_ROLE_KEY = SERVICE_KEY;
  store = await import("@/lib/leads-store");
});

after(async () => {
  await mock.close();
});

// Leise: erwartete Fehler werden in leads-store geloggt.
const quiet = () => {
  const original = console.error;
  console.error = () => {};
  return () => {
    console.error = original;
  };
};

function lastRequest(method: string) {
  return [...mock.requests].reverse().find((r) => r.method === method)!;
}

/** Läuft für v1 und v2 identisch: das Insert setzt keine neuen Spalten voraus. */
async function saveAndDeliver() {
  const id = await store.saveLead(lead);
  assert.ok(id);
  const post = lastRequest("POST");
  assert.deepEqual(Object.keys(post.body as object).sort(), [
    "fields",
    "kind",
    "reply_to",
    "subject",
  ]);
  await store.recordDelivery(id, { via: "resend" });
  const row = await store.getLead(id);
  assert.equal(row?.delivered_via, "resend");
  assert.equal(row?.status, "neu");
  await store.recordDelivery(id, { error: "network: x".repeat(100) });
  assert.equal((await store.getLead(id))?.delivery_error?.length, 500);
  return id;
}

describe("leads-store gegen Mock v1 (nur erste Migration)", () => {
  beforeEach(() => mock.reset("v1"));

  it("saveLead und recordDelivery", async () => {
    await saveAndDeliver();
  });

  it("listLeads und getLead liefern Zeilen ohne neue Felder", async () => {
    const a = mock.seedLead({ created_at: "2026-10-01T10:00:00.000Z" });
    const b = mock.seedLead({
      created_at: "2026-10-02T10:00:00.000Z",
      status: "erledigt",
    });
    const all = await store.listLeads();
    assert.deepEqual(
      all.map((l) => l.id),
      [b.id, a.id],
    );
    assert.ok(!("follow_up_on" in all[0]));
    assert.deepEqual(
      (await store.listLeads("erledigt")).map((l) => l.id),
      [b.id],
    );
    assert.equal((await store.getLead(a.id))?.id, a.id);
    assert.equal(
      await store.getLead("00000000-0000-4000-8000-000000000000"),
      null,
    );
    assert.deepEqual(await store.countByStatus(), {
      neu: 1,
      in_arbeit: 0,
      erledigt: 1,
      archiviert: 0,
    });
  });

  it("updateLead({status}) klappt, follow_up_on wirft DbError PGRST204", async () => {
    const a = mock.seedLead();
    assert.deepEqual(await store.updateLead(a.id, { status: "in_arbeit" }), {
      found: true,
    });
    await assert.rejects(
      () => store.updateLead(a.id, { follow_up_on: "2026-11-04" }),
      (err: unknown) => {
        assert.ok(err instanceof DbError);
        assert.equal(err.code, "PGRST204");
        assert.equal(explainDbError(err).kind, "missing_schema_v2");
        return true;
      },
    );
  });

  it("listEvents → null, addEvent → false ohne Fehler, listDeletions → null", async () => {
    const a = mock.seedLead();
    assert.equal(await store.listEvents(a.id), null);
    assert.equal(
      await store.addEvent(a.id, "admin@sitalo.de", "status", {
        from: "neu",
        to: "in_arbeit",
      }),
      false,
    );
    assert.equal(await store.listDeletions(), null);
  });

  it("deleteLead löscht archivierte Anfragen, ohne Protokoll", async () => {
    const restore = quiet();
    try {
      const a = mock.seedLead({ status: "archiviert" });
      assert.deepEqual(
        await store.deleteLead(a.id, "admin@sitalo.de", "spam"),
        { deleted: true, logged: false },
      );
      assert.equal(mock.tables.leads.length, 0);
    } finally {
      restore();
    }
  });

  it("listLeadsByReplyTo ohne Migration", async () => {
    const a = mock.seedLead({ reply_to: "x@example.de" });
    const b = mock.seedLead({ reply_to: "X@Example.de" });
    assert.deepEqual(
      (await store.listLeadsByReplyTo("x@example.de", a.id)).map((l) => l.id),
      [b.id],
    );
  });
});

describe("leads-store gegen Mock v2 (nach 20261101000000_admin_ausbau.sql)", () => {
  beforeEach(() => mock.reset("v2"));

  it("saveLead und recordDelivery laufen identisch", async () => {
    const id = await saveAndDeliver();
    const row = await store.getLead(id);
    assert.equal(row?.follow_up_on, null);
    assert.equal(row?.outcome, null);
  });

  it("follow_up_on, outcome und lost_reason setzen und zurücklesen", async () => {
    const a = mock.seedLead();
    assert.deepEqual(
      await store.updateLead(a.id, { follow_up_on: "2026-11-04" }),
      { found: true },
    );
    assert.deepEqual(
      await store.updateLead(a.id, {
        status: "erledigt",
        follow_up_on: null,
        outcome: "verloren",
        lost_reason: "preis",
      }),
      { found: true },
    );
    const row = await store.getLead(a.id);
    assert.equal(row?.follow_up_on, null);
    assert.equal(row?.outcome, "verloren");
    assert.equal(row?.lost_reason, "preis");
    // updated_at wie per Trigger
    assert.notEqual(row?.updated_at, a.created_at);
  });

  it("updateLead auf eine unbekannte ID → found: false", async () => {
    assert.deepEqual(
      await store.updateLead("00000000-0000-4000-8000-000000000000", {
        status: "erledigt",
      }),
      { found: false },
    );
  });

  it("Rückgängig mit überfälliger Wiedervorlage stellt Status und Datum wieder her", async () => {
    const overdue = addDays(berlinDateIso(new Date()), -3);
    const a = mock.seedLead({ status: "in_arbeit", follow_up_on: overdue });
    const before = await store.getLead(a.id);
    const snapshot = {
      status: before!.status,
      follow_up_on: before!.follow_up_on ?? null,
      outcome: before!.outcome ?? null,
      lost_reason: before!.lost_reason ?? null,
    };
    // Statuswechsel auf Erledigt leert die Wiedervorlage
    await store.updateLead(a.id, { status: "erledigt", follow_up_on: null });
    assert.equal((await store.getLead(a.id))?.follow_up_on, null);

    // Für neue Eingaben wäre das Datum zu alt, als Schnappschuss ist es gültig
    assert.equal(parseIsoDate(overdue, new Date()), null);
    const checked = parseSnapshot(snapshot);
    assert.ok(checked);
    assert.deepEqual(await store.updateLead(a.id, checked), { found: true });
    const restored = await store.getLead(a.id);
    assert.equal(restored?.status, "in_arbeit");
    assert.equal(restored?.follow_up_on, overdue);
  });

  it("listLeadsByReplyTo: Groß-/Kleinschreibung egal, eigene ID ausgeschlossen, keine Adresse in der URL", async () => {
    const own = mock.seedLead({
      reply_to: "Kunde@Example.de",
      created_at: "2026-10-03T10:00:00.000Z",
    });
    const older = mock.seedLead({
      reply_to: "kunde@example.de",
      created_at: "2026-10-01T10:00:00.000Z",
    });
    const newer = mock.seedLead({
      reply_to: "KUNDE@example.de",
      created_at: "2026-10-05T10:00:00.000Z",
    });
    mock.seedLead({ reply_to: "andere@example.de" });
    const hits = await store.listLeadsByReplyTo(own.reply_to, own.id);
    assert.deepEqual(
      hits.map((h) => h.id),
      [newer.id, older.id],
    );
    assert.deepEqual(Object.keys(hits[0]).sort(), [
      "created_at",
      "id",
      "kind",
      "status",
      "subject",
    ]);
    assert.deepEqual(await store.listLeadsByReplyTo("  ", own.id), []);
    for (const r of mock.requests)
      assert.ok(!r.url.includes("@") && !r.url.includes("%40"), r.url);
  });

  it("addEvent und listEvents: neueste zuerst", async () => {
    const a = mock.seedLead();
    assert.equal(
      await store.addEvent(a.id, "admin@sitalo.de", "status", {
        from: "neu",
        to: "in_arbeit",
      }),
      true,
    );
    assert.equal(
      await store.addEvent(a.id, "admin@sitalo.de", "kontakt", {
        kanal: "anruf",
        ergebnis: "mailbox",
      }),
      true,
    );
    const events = await store.listEvents(a.id);
    assert.deepEqual(
      events?.map((e) => e.action),
      ["kontakt", "status"],
    );
    assert.deepEqual(events?.[1].detail, { from: "neu", to: "in_arbeit" });
    assert.equal(events?.[0].actor, "admin@sitalo.de");
  });

  it("addEvent wirft nie (z. B. unbekannte Anfrage)", async () => {
    const restore = quiet();
    try {
      assert.equal(
        await store.addEvent(
          "00000000-0000-4000-8000-000000000000",
          "a",
          "notiz",
        ),
        false,
      );
    } finally {
      restore();
    }
  });

  it("deleteLead: Anfrage weg, Verlauf per Cascade weg, Protokoll ohne Personendaten", async () => {
    const a = mock.seedLead({
      status: "archiviert",
      kind: "termin",
      reply_to: "lisa@example.de",
      fields: [
        ["Name", "Lisa Weber"],
        ["Telefon", "0176 1234567"],
      ],
      notes: "INTERN",
    });
    const other = mock.seedLead();
    await store.addEvent(a.id, "admin@sitalo.de", "status", {
      from: "erledigt",
      to: "archiviert",
    });
    await store.addEvent(other.id, "admin@sitalo.de", "status", {
      from: "neu",
      to: "in_arbeit",
    });

    assert.deepEqual(
      await store.deleteLead(a.id, "admin@sitalo.de", "anfrage_person"),
      { deleted: true, logged: true },
    );
    assert.equal(await store.getLead(a.id), null);
    assert.equal(mock.tables.lead_events.length, 1);
    assert.equal(mock.tables.lead_events[0].lead_id, other.id);

    assert.equal(mock.tables.lead_deletions.length, 1);
    const row = mock.tables.lead_deletions[0];
    assert.equal(row.lead_id, a.id);
    assert.equal(row.lead_kind, "termin");
    assert.equal(row.lead_created_at, a.created_at);
    assert.equal(row.reason, "anfrage_person");
    assert.equal(row.deleted_by, "admin@sitalo.de");
    const text = JSON.stringify(row);
    for (const pii of ["Lisa", "lisa@example.de", "0176", "INTERN"])
      assert.ok(!text.includes(pii), pii);

    const log = await store.listDeletions(20);
    assert.deepEqual(Object.keys(log![0]).sort(), [
      "deleted_at",
      "lead_kind",
      "reason",
    ]);
  });

  it("deleteLead löscht keine Anfrage, die nicht (mehr) archiviert ist", async () => {
    const a = mock.seedLead({ status: "in_arbeit" });
    assert.deepEqual(await store.deleteLead(a.id, "admin@sitalo.de", "spam"), {
      deleted: false,
      logged: false,
    });
    assert.ok(await store.getLead(a.id));
    assert.deepEqual(
      await store.deleteLead(
        "00000000-0000-4000-8000-000000000000",
        "admin@sitalo.de",
        "spam",
      ),
      { deleted: false, logged: false },
    );
    assert.equal(mock.tables.lead_deletions.length, 0);
  });
});

describe("leads-store: Fehler", () => {
  it("fehlende Tabelle leads → DbError, erklärt als missing_table_leads", async () => {
    mock.reset("v0");
    await assert.rejects(
      () => store.listLeads(),
      (err: unknown) => {
        assert.ok(err instanceof DbError);
        assert.equal(err.code, "PGRST205");
        assert.equal(explainDbError(err).kind, "missing_table_leads");
        return true;
      },
    );
    // saveLead wirft trotzdem nie (die Mail geht weiter raus)
    const restore = quiet();
    try {
      assert.equal(await store.saveLead(lead), null);
    } finally {
      restore();
    }
  });

  it("falscher Schlüssel → DbError, erklärt als auth", async () => {
    mock.reset("v2");
    process.env.SUPABASE_SERVICE_ROLE_KEY = "falsch";
    try {
      await assert.rejects(
        () => store.listLeads(),
        (err: unknown) => explainDbError(err).kind === "auth",
      );
    } finally {
      process.env.SUPABASE_SERVICE_ROLE_KEY = SERVICE_KEY;
    }
  });

  it("nicht erreichbar → DbError, erklärt als network", async () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    process.env.NEXT_PUBLIC_SUPABASE_URL = "http://127.0.0.1:9";
    try {
      await assert.rejects(
        () => store.getLead("00000000-0000-4000-8000-000000000000"),
        (err: unknown) => explainDbError(err).kind === "network",
      );
    } finally {
      process.env.NEXT_PUBLIC_SUPABASE_URL = url;
    }
  });
});
