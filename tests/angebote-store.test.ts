import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";

import type { AngebotInhalt } from "@/lib/admin/angebote";
import type { LeadRow } from "@/lib/leads-meta";

import {
  ANGEBOT_PUBLIC_COLUMNS,
  angebotAusAnfrage,
  paketPositionen,
} from "@/lib/admin/angebote";
import { berlinDateIso } from "@/lib/admin/berlin-time";
import { DbError, explainDbError } from "@/lib/admin/db-errors";
import { SERVICE_KEY, startMock } from "@/tests/supabase-mock.mjs";

type Mock = Awaited<ReturnType<typeof startMock>>;
type Store = typeof import("@/lib/angebote-store");

let mock: Mock;
let store: Store;

const ADMIN = "admin@sitalo.de";
// So, 1.11.2026, 11:00 in Hamburg
const NOW = new Date("2026-11-01T10:00:00Z");
const YEAR = berlinDateIso(new Date()).slice(0, 4);

before(async () => {
  mock = await startMock({ mode: "v3" });
  process.env.NEXT_PUBLIC_SUPABASE_URL = mock.url;
  process.env.SUPABASE_SERVICE_ROLE_KEY = SERVICE_KEY;
  delete process.env.ANGEBOT_UST_SATZ;
  store = await import("@/lib/angebote-store");
});

after(async () => {
  await mock.close();
});

const quiet = () => {
  const original = console.error;
  const calls: unknown[][] = [];
  console.error = (...args: unknown[]) => {
    calls.push(args);
  };
  return {
    calls,
    restore() {
      console.error = original;
    },
  };
};

/** Die Attrappe liefert lose Zeilen; hier als Anfrage typisiert. */
const asLead = (row: Record<string, unknown>) => row as unknown as LeadRow;

function seedLead(): LeadRow {
  return asLead(
    mock.seedLead({
      reply_to: "jana@example.de",
      fields: [
        ["Name", "Jana Petersen"],
        ["E-Mail", "jana@example.de"],
        ["Firma", "Pflegedienst Elbblick"],
        ["Paket-Wunsch", "Business-Auftritt"],
      ],
    }),
  );
}

/** Angebot anlegen und (optional) senden. */
async function created(opts: { senden?: boolean } = {}) {
  const lead = seedLead();
  const a = await store.createAngebot(lead, ADMIN, { now: NOW });
  if (!opts.senden) return { lead, a };
  const sent = await store.markAngebotSent(a.id, ADMIN, NOW);
  assert.ok(sent.ok);
  return { lead, a: sent.angebot };
}

const events = (leadId: string) =>
  mock.tables.lead_events
    .filter((e) => e.lead_id === leadId && e.action === "angebot")
    .map((e) => ({ actor: e.actor, ...e.detail }));

describe("angebote-store gegen Mock v3", () => {
  beforeEach(() => mock.reset("v3"));

  it("createAngebot: Entwurf aus der Anfrage, Nummer fortlaufend, Token zufällig, Verlauf", async () => {
    const lead = seedLead();
    const a = await store.createAngebot(lead, ADMIN, { now: NOW });
    assert.equal(a.lead_id, lead.id);
    assert.equal(a.nummer, `A-${YEAR}-0001`);
    assert.equal(a.status, "entwurf");
    assert.match(a.token, /^[A-Za-z0-9_-]{43}$/);
    assert.equal(a.kunde_name, "Jana Petersen");
    assert.equal(a.ust_satz, 19);
    assert.equal(a.gueltig_bis, "2026-12-01");
    assert.deepEqual(
      a.positionen.map((p) => p.preis_cent),
      paketPositionen("business").map((p) => p.preis_cent),
    );
    const post = mock.requests.find(
      (r) => r.method === "POST" && r.url.startsWith("/rest/v1/angebote"),
    );
    assert.deepEqual(Object.keys(post?.body as object).sort(), [
      "einleitung",
      "gueltig_bis",
      "hinweise",
      "kunde_email",
      "kunde_firma",
      "kunde_name",
      "lead_id",
      "positionen",
      "titel",
      "token",
      "ust_satz",
    ]);
    const b = await store.createAngebot(lead, ADMIN, { now: NOW });
    assert.equal(b.nummer, `A-${YEAR}-0002`);
    assert.notEqual(b.token, a.token);
    assert.deepEqual(events(lead.id), [
      { actor: ADMIN, was: "erstellt", nummer: a.nummer },
      { actor: ADMIN, was: "erstellt", nummer: b.nummer },
    ]);
  });

  it("createAngebot: USt-Standard aus ANGEBOT_UST_SATZ, eigener Inhalt möglich", async () => {
    const lead = seedLead();
    process.env.ANGEBOT_UST_SATZ = "0";
    try {
      const a = await store.createAngebot(lead, ADMIN, { now: NOW });
      assert.equal(a.ust_satz, 0);
      assert.ok(a.hinweise.includes("§ 19 UStG"));
    } finally {
      delete process.env.ANGEBOT_UST_SATZ;
    }
    const inhalt: AngebotInhalt = {
      ...angebotAusAnfrage(lead, { now: NOW }),
      titel: "Eigener Titel",
    };
    assert.equal(
      (await store.createAngebot(lead, ADMIN, { inhalt })).titel,
      "Eigener Titel",
    );
  });

  it("createAngebot: unbekannte Anfrage → DbError 23503", async () => {
    await assert.rejects(
      () =>
        store.createAngebot(
          {
            id: "00000000-0000-4000-8000-000000000000",
            fields: [],
            reply_to: "",
          },
          ADMIN,
        ),
      (err: unknown) => err instanceof DbError && err.code === "23503",
    );
  });

  it("getAngeboteByLead (neueste zuerst), getAngebotById, listAngeboteKurz", async () => {
    const { lead, a } = await created();
    const b = await store.createAngebot(lead, ADMIN, { now: NOW });
    const other = await created();
    assert.deepEqual(
      (await store.getAngeboteByLead(lead.id))?.map((x) => x.id),
      [b.id, a.id],
    );
    assert.deepEqual(await store.getAngeboteByLead(seedLead().id), []);
    assert.equal((await store.getAngebotById(a.id))?.nummer, a.nummer);
    assert.equal(
      await store.getAngebotById("00000000-0000-4000-8000-000000000000"),
      null,
    );
    const kurz = await store.listAngeboteKurz();
    assert.deepEqual(
      kurz?.map((k) => k.id),
      [other.a.id, b.id, a.id],
    );
    assert.ok(kurz && !("token" in kurz[0]) && !("positionen" in kurz[0]));
  });

  it("getAngebotByToken: nur Angebotsfelder; ungültiger Token fragt gar nicht erst", async () => {
    const { a } = await created();
    const pub = await store.getAngebotByToken(a.token);
    assert.ok(pub);
    assert.deepEqual(
      Object.keys(pub).sort(),
      [...ANGEBOT_PUBLIC_COLUMNS].sort(),
    );
    assert.equal(pub.nummer, a.nummer);
    assert.deepEqual(pub.positionen, a.positionen);
    const get = [...mock.requests].reverse().find((r) => r.method === "GET")!;
    assert.ok(!get.url.includes("lead_id") && !get.url.includes("kunde_email"));

    mock.requests.length = 0;
    assert.equal(await store.getAngebotByToken("kurz"), null);
    assert.equal(await store.getAngebotByToken("../../etc/passwd"), null);
    assert.equal(mock.requests.length, 0);
    assert.equal(await store.getAngebotByToken("b".repeat(43)), null);
  });

  it("updateAngebot: speichert Inhalt, updated_at nur bei inhaltlicher Änderung", async () => {
    const { a } = await created();
    const inhalt: AngebotInhalt = {
      kunde_name: a.kunde_name,
      kunde_firma: a.kunde_firma,
      kunde_email: a.kunde_email,
      titel: "Neuer Titel",
      einleitung: a.einleitung,
      hinweise: a.hinweise,
      positionen: a.positionen,
      ust_satz: a.ust_satz,
      gueltig_bis: a.gueltig_bis,
    };
    const r = await store.updateAngebot(a.id, inhalt, {
      expectedUpdatedAt: a.updated_at,
    });
    assert.ok(r.ok);
    assert.equal(r.angebot.titel, "Neuer Titel");
    assert.notEqual(r.angebot.updated_at, a.updated_at);

    // Veralteter Stand (anderes Gerät hat inzwischen gespeichert) → konflikt.
    const stale = await store.updateAngebot(
      a.id,
      { ...inhalt, titel: "Alt" },
      { expectedUpdatedAt: a.updated_at },
    );
    assert.equal(stale.ok, false);
    if (!stale.ok) {
      assert.equal(stale.grund, "konflikt");
      assert.equal(stale.angebot?.titel, "Neuer Titel");
    }
    // Ohne erwarteten Stand: einfach speichern.
    assert.ok(
      (await store.updateAngebot(a.id, { ...inhalt, titel: "Ohne Prüfung" }))
        .ok,
    );

    // Senden ändert updated_at nicht.
    const before = (await store.getAngebotById(a.id))!;
    const sent = await store.markAngebotSent(a.id, ADMIN, NOW);
    assert.ok(sent.ok);
    assert.equal(sent.angebot.updated_at, before.updated_at);

    // Nach dem Senden weiter bearbeitbar.
    assert.ok(
      (await store.updateAngebot(a.id, { ...inhalt, titel: "Nach dem Senden" }))
        .ok,
    );

    const gone = await store.updateAngebot(
      "00000000-0000-4000-8000-000000000000",
      inhalt,
    );
    assert.deepEqual(gone, { ok: false, grund: "nicht_gefunden" });
  });

  it("updateAngebot schreibt nur Inhaltsfelder, auch wenn ein volles Angebot kommt", async () => {
    const { a } = await created({ senden: true });
    const r = await store.updateAngebot(a.id, {
      ...a,
      status: "entwurf",
      token: "x".repeat(43),
      nummer: "A-1999-0001",
      titel: "Nur das zählt",
    } as typeof a);
    assert.ok(r.ok);
    assert.equal(r.angebot.titel, "Nur das zählt");
    assert.equal(r.angebot.status, "gesendet");
    assert.equal(r.angebot.token, a.token);
    assert.equal(r.angebot.nummer, a.nummer);
    const patch = [...mock.requests]
      .reverse()
      .find((q) => q.method === "PATCH")!;
    assert.deepEqual(Object.keys(patch.body as object).sort(), [
      "einleitung",
      "gueltig_bis",
      "hinweise",
      "kunde_email",
      "kunde_firma",
      "kunde_name",
      "positionen",
      "titel",
      "ust_satz",
    ]);
  });

  it("updateAngebot: nach Annahme gesperrt", async () => {
    const { a } = await created({ senden: true });
    assert.ok((await store.acceptAngebot(a.token, "Jana Petersen", a.updated_at, NOW)).ok);
    const r = await store.updateAngebot(a.id, { ...a, titel: "Zu spät" });
    assert.equal(r.ok, false);
    if (!r.ok) {
      assert.equal(r.grund, "gesperrt");
      assert.equal(r.angebot?.status, "angenommen");
      assert.equal(r.angebot?.titel, a.titel);
    }
  });

  it("markAngebotSent: prüft vorher, setzt sent_at, erneutes Senden im Verlauf", async () => {
    const { lead, a } = await created();
    await store.updateAngebot(a.id, {
      ...a,
      positionen: [],
      gueltig_bis: "2026-10-30",
    });
    const r = await store.markAngebotSent(a.id, ADMIN, NOW);
    assert.equal(r.ok, false);
    if (!r.ok) {
      assert.equal(r.grund, "unvollstaendig");
      assert.deepEqual(r.probleme, [
        "Es gibt noch keine Position.",
        "„Gültig bis“ liegt in der Vergangenheit.",
      ]);
    }
    assert.equal((await store.getAngebotById(a.id))?.status, "entwurf");

    await store.updateAngebot(a.id, a);
    const ok = await store.markAngebotSent(a.id, ADMIN, NOW);
    assert.ok(ok.ok);
    assert.equal(ok.angebot.status, "gesendet");
    assert.equal(ok.angebot.sent_at, NOW.toISOString());
    const later = new Date("2026-11-03T09:00:00Z");
    const again = await store.markAngebotSent(a.id, ADMIN, later);
    assert.ok(again.ok);
    assert.equal(again.angebot.sent_at, later.toISOString());
    assert.deepEqual(events(lead.id).slice(1), [
      { actor: ADMIN, was: "gesendet", nummer: a.nummer },
      { actor: ADMIN, was: "gesendet", nummer: a.nummer, erneut: true },
    ]);
    assert.deepEqual(
      await store.markAngebotSent(
        "00000000-0000-4000-8000-000000000000",
        ADMIN,
        NOW,
      ),
      {
        ok: false,
        grund: "nicht_gefunden",
      },
    );
  });

  it("markAngebotViewed: nur beim ersten Aufruf und nur wenn gesendet", async () => {
    const { lead, a } = await created();
    assert.equal(await store.markAngebotViewed(a.token, NOW), false); // Entwurf
    await store.markAngebotSent(a.id, ADMIN, NOW);
    const before = (await store.getAngebotById(a.id))!;
    const t1 = new Date("2026-11-02T08:00:00Z");
    assert.equal(await store.markAngebotViewed(a.token, t1), true);
    assert.equal(
      await store.markAngebotViewed(a.token, new Date("2026-11-02T09:00:00Z")),
      false,
    );
    const after = (await store.getAngebotById(a.id))!;
    assert.equal(after.first_viewed_at, t1.toISOString());
    assert.equal(after.updated_at, before.updated_at);
    assert.deepEqual(
      events(lead.id).filter((e) => e.was === "angesehen"),
      [{ actor: "kunde", was: "angesehen", nummer: a.nummer }],
    );
    assert.equal(await store.markAngebotViewed("kein-token"), false);
    // Patch enthält nur first_viewed_at (keine IP, keine Gerätedaten).
    const patches = mock.requests.filter(
      (r) => r.method === "PATCH" && "first_viewed_at" in (r.body as object),
    );
    for (const p of patches)
      assert.deepEqual(Object.keys(p.body as object), ["first_viewed_at"]);
  });

  it("acceptAngebot: nur aus 'gesendet', nicht abgelaufen, Name geprüft", async () => {
    const { lead, a } = await created({ senden: true });
    assert.deepEqual(await store.acceptAngebot(a.token, "J", a.updated_at, NOW), {
      ok: false,
      grund: "ungueltig",
    });
    // Letzter Tag (1.12., 23:30 in Hamburg) zählt noch.
    const lastDay = new Date("2026-12-01T22:30:00Z");
    const r = await store.acceptAngebot(a.token, "  Jana   Petersen ", a.updated_at, lastDay);
    assert.ok(r.ok);
    assert.equal(r.angebot.status, "angenommen");
    assert.equal(r.angebot.angenommen_von, "Jana Petersen");
    assert.equal(r.angebot.accepted_at, lastDay.toISOString());
    assert.equal(r.angebot.lead_id, lead.id);

    // Doppelter Klick: gesperrt, Stand „angenommen“.
    const twice = await store.acceptAngebot(a.token, "Jana Petersen", a.updated_at, lastDay);
    assert.equal(twice.ok, false);
    if (!twice.ok) {
      assert.equal(twice.grund, "gesperrt");
      assert.equal(twice.angebot?.status, "angenommen");
    }
    assert.deepEqual(
      events(lead.id).filter((e) => e.was === "angenommen"),
      [{ actor: "kunde", was: "angenommen", nummer: a.nummer }],
    );
  });

  it("acceptAngebot: nur die Fassung, die der Kunde gesehen hat", async () => {
    const { lead, a } = await created({ senden: true });
    const gesehen = a.updated_at;
    // Inhaber ändert den Preis, während der Kunde die Seite offen hat.
    const teurer = await store.updateAngebot(a.id, {
      ...a,
      positionen: a.positionen.map((p, i) =>
        i === 0 ? { ...p, preis_cent: p.preis_cent + 40_000 } : p,
      ),
    });
    assert.ok(teurer.ok);
    assert.notEqual(teurer.angebot.updated_at, gesehen);

    const alt = await store.acceptAngebot(a.token, "Jana Petersen", gesehen, NOW);
    assert.equal(alt.ok, false);
    if (!alt.ok) {
      assert.equal(alt.grund, "geaendert");
      assert.equal(alt.angebot?.status, "gesendet");
    }
    assert.equal((await store.getAngebotById(a.id))?.status, "gesendet");
    assert.deepEqual(
      events(lead.id).filter((e) => e.was === "angenommen"),
      [],
    );

    // Mit dem neuen Stand klappt es.
    const neu = await store.acceptAngebot(
      a.token,
      "Jana Petersen",
      teurer.angebot.updated_at,
      NOW,
    );
    assert.ok(neu.ok);
    assert.equal(neu.angebot.positionen[0].preis_cent, teurer.angebot.positionen[0].preis_cent);

    // Ohne gültigen Stand: ungültig, nichts gespeichert.
    const { a: b } = await created({ senden: true });
    assert.deepEqual(
      await store.acceptAngebot(b.token, "Jana Petersen", "gestern", NOW),
      { ok: false, grund: "ungueltig" },
    );
  });

  it("acceptAngebot: abgelaufen, Entwurf, zurückgezogen, unbekannt", async () => {
    const { a } = await created({ senden: true });
    const expired = await store.acceptAngebot(a.token, "Jana Petersen", a.updated_at, new Date("2026-12-01T23:30:00Z"),
    );
    assert.equal(expired.ok, false);
    if (!expired.ok) assert.equal(expired.grund, "abgelaufen");
    assert.equal((await store.getAngebotById(a.id))?.status, "gesendet");

    const draft = await created();
    const d = await store.acceptAngebot(draft.a.token, "Jana Petersen", draft.a.updated_at, NOW);
    assert.equal(!d.ok && d.grund, "gesperrt");

    assert.ok((await store.withdrawAngebot(a.id, ADMIN)).ok);
    const w = await store.acceptAngebot(a.token, "Jana Petersen", a.updated_at, NOW);
    assert.equal(!w.ok && w.grund, "gesperrt");
    assert.equal(!w.ok && w.angebot?.status, "zurueckgezogen");

    assert.deepEqual(
      await store.acceptAngebot("c".repeat(43), "Jana Petersen", a.updated_at, NOW),
      {
        ok: false,
        grund: "nicht_gefunden",
      },
    );
    assert.deepEqual(await store.acceptAngebot("kurz", "Jana Petersen", a.updated_at, NOW), {
      ok: false,
      grund: "nicht_gefunden",
    });
  });

  it("declineAngebot (Kunde) mit Grund; Verlauf ohne Grund", async () => {
    const { lead, a } = await created({ senden: true });
    assert.deepEqual(
      await store.declineAngebot(a.token, "x".repeat(501), NOW),
      { ok: false, grund: "ungueltig" },
    );
    const r = await store.declineAngebot(a.token, " Zu teuer ", NOW);
    assert.ok(r.ok);
    assert.equal(r.angebot.status, "abgelehnt");
    assert.equal(r.angebot.abgelehnt_grund, "Zu teuer");
    assert.equal(r.angebot.declined_at, NOW.toISOString());
    const ev = events(lead.id).find((e) => e.was === "abgelehnt");
    assert.deepEqual(ev, {
      actor: "kunde",
      was: "abgelehnt",
      nummer: a.nummer,
    });
    const again = await store.declineAngebot(a.token, null, NOW);
    assert.equal(!again.ok && again.grund, "gesperrt");
  });

  it("withdrawAngebot und markAngebotDeclined (Admin) nur aus 'gesendet'", async () => {
    const { a } = await created();
    const w = await store.withdrawAngebot(a.id, ADMIN);
    assert.equal(!w.ok && w.grund, "gesperrt");
    await store.markAngebotSent(a.id, ADMIN, NOW);
    const ok = await store.withdrawAngebot(a.id, ADMIN);
    assert.ok(ok.ok);
    assert.equal(ok.angebot.status, "zurueckgezogen");

    const b = (await created({ senden: true })).a;
    const d = await store.markAngebotDeclined(
      b.id,
      ADMIN,
      "Am Telefon abgesagt",
      NOW,
    );
    assert.ok(d.ok);
    assert.equal(d.angebot.status, "abgelehnt");
    assert.equal(d.angebot.abgelehnt_grund, "Am Telefon abgesagt");
    assert.deepEqual(
      await store.markAngebotDeclined(
        "00000000-0000-4000-8000-000000000000",
        ADMIN,
      ),
      {
        ok: false,
        grund: "nicht_gefunden",
      },
    );
  });

  it("removeAngebotEntwurf: nur Entwürfe", async () => {
    const { lead, a } = await created();
    const b = (await created({ senden: true })).a;
    assert.deepEqual(await store.removeAngebotEntwurf(b.id, ADMIN), {
      removed: false,
    });
    assert.deepEqual(await store.removeAngebotEntwurf(a.id, ADMIN), {
      removed: true,
    });
    assert.equal(await store.getAngebotById(a.id), null);
    assert.ok(events(lead.id).some((e) => e.was === "verworfen"));
  });

  it("logAngebotMailFehler schreibt einen Verlaufseintrag", async () => {
    const { lead, a } = await created();
    await store.logAngebotMailFehler(a);
    assert.deepEqual(events(lead.id).at(-1), {
      actor: "system",
      was: "mail_fehler",
      nummer: a.nummer,
    });
  });

  it("Anfrage löschen nimmt ihre Angebote mit (on delete cascade)", async () => {
    const { lead } = await created();
    mock.tables.leads[0].status = "archiviert";
    const leads = await import("@/lib/leads-store");
    assert.deepEqual(await leads.deleteLead(lead.id, ADMIN, "spam"), {
      deleted: true,
      logged: true,
    });
    assert.equal(mock.tables.angebote.length, 0);
  });

  it("Logs enthalten nie den Token", async () => {
    const { a } = await created({ senden: true });
    process.env.SUPABASE_SERVICE_ROLE_KEY = "falsch";
    const log = quiet();
    try {
      assert.equal(await store.markAngebotViewed(a.token, NOW), false);
    } finally {
      log.restore();
      process.env.SUPABASE_SERVICE_ROLE_KEY = SERVICE_KEY;
    }
    assert.ok(log.calls.length > 0);
    assert.ok(!JSON.stringify(log.calls).includes(a.token));
  });
});

describe("angebote-store ohne Tabelle (Mock v2, Stand beim Inhaber)", () => {
  beforeEach(() => mock.reset("v2"));

  it("Listen liefern null, Kundenseite null, Öffnen false – ohne Fehler", async () => {
    const lead = asLead(mock.seedLead());
    assert.equal(await store.getAngeboteByLead(lead.id), null);
    assert.equal(await store.listAngeboteKurz(), null);
    assert.equal(await store.getAngebotByToken("a".repeat(43)), null);
    const log = quiet();
    try {
      assert.equal(await store.markAngebotViewed("a".repeat(43)), false);
    } finally {
      log.restore();
    }
    assert.equal(log.calls.length, 0);
  });

  it("Admin-Aktionen werfen DbError mit verständlicher Erklärung", async () => {
    const lead = asLead(mock.seedLead());
    await assert.rejects(
      () => store.createAngebot(lead, ADMIN),
      (err: unknown) => {
        assert.ok(err instanceof DbError);
        assert.equal(err.code, "PGRST205");
        const e = explainDbError(err);
        assert.equal(e.kind, "missing_schema_angebote");
        assert.ok(e.hint.includes("20261102000000_angebote.sql"));
        return true;
      },
    );
    await assert.rejects(
      () => store.getAngebotById("00000000-0000-4000-8000-000000000000"),
      (err: unknown) =>
        err instanceof DbError &&
        explainDbError(err).kind === "missing_schema_angebote",
    );
  });
});

describe("angebote-store ohne Konfiguration", () => {
  it("Lesen null, Schreiben DbError", async () => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    try {
      assert.equal(await store.getAngeboteByLead("x"), null);
      assert.equal(await store.getAngebotByToken("a".repeat(43)), null);
      assert.equal(await store.markAngebotViewed("a".repeat(43)), false);
      await assert.rejects(
        () => store.createAngebot({ id: "x", fields: [], reply_to: "" }, ADMIN),
        (err: unknown) =>
          err instanceof DbError && /nicht konfiguriert/.test(err.message),
      );
    } finally {
      process.env.NEXT_PUBLIC_SUPABASE_URL = url;
    }
  });
});
