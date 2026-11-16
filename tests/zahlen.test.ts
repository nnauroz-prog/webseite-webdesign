import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";

import type { ZahlenAngebot, ZahlenEvent } from "@/lib/admin/zahlen";
import type { LeadKind } from "@/lib/leads-meta";

import {
  angebotLage,
  angeboteZahlen,
  anfragenZahlen,
  antwortFensterIds,
  antwortZahlen,
  anzahl,
  ergebnisZahlen,
  ersteReaktionen,
  formatAnteil,
  formatDauer,
  formatEuroGanz,
  istReaktion,
  kalenderwoche,
  leseAb,
  median,
  wochenSpanne,
  wochenStart,
  zeitraeume,
} from "@/lib/admin/zahlen";
import { SERVICE_KEY, startMock } from "@/tests/supabase-mock.mjs";

// Mo, 16.11.2026, 11:00 in Hamburg (MEZ, UTC+1)
const NOW = new Date("2026-11-16T10:00:00Z");
const MIN = 60_000;
const H = 60 * MIN;
const D = 24 * H;

const lead = (
  created_at: string,
  kind: LeadKind = "anfrage",
  id = created_at,
) => ({
  id,
  created_at,
  kind,
});

describe("Zeiträume (Hamburg, Wochen ab Montag)", () => {
  it("Montag der Woche", () => {
    assert.equal(wochenStart("2026-11-16"), "2026-11-16"); // Mo
    assert.equal(wochenStart("2026-11-22"), "2026-11-16"); // So
    assert.equal(wochenStart("2026-11-01"), "2026-10-26"); // So → Mo davor
  });

  it("Kalenderwoche nach ISO 8601, auch über den Jahreswechsel", () => {
    assert.equal(kalenderwoche("2026-11-16"), 47);
    assert.equal(kalenderwoche("2026-01-01"), 1); // Do
    assert.equal(kalenderwoche("2025-12-29"), 1); // Mo vor Neujahr
    assert.equal(kalenderwoche("2027-01-01"), 53); // 2026 hat 53 Wochen
    assert.equal(kalenderwoche("2027-01-04"), 1);
    assert.equal(kalenderwoche("2021-01-03"), 53); // So, gehört zu 2020
  });

  it("Zeiträume zu einem Zeitpunkt", () => {
    const z = zeitraeume(NOW);
    assert.equal(z.heute, "2026-11-16");
    assert.equal(z.woche, "2026-11-16");
    assert.equal(z.vorwoche, "2026-11-09");
    assert.equal(z.monat, "2026-11-01");
    assert.equal(z.vormonat, "2026-10-01");
    assert.equal(z.jahr, "2026-01-01");
    assert.equal(z.wochen.length, 12);
    assert.equal(z.wochen[0], "2026-08-31");
    assert.equal(z.wochen[11], "2026-11-16");
  });

  it("Tageswechsel nach Hamburger Zeit, nicht nach UTC", () => {
    // So 23:30 UTC = Mo 0:30 in Hamburg
    assert.equal(
      zeitraeume(new Date("2026-11-15T23:30:00Z")).woche,
      "2026-11-16",
    );
    assert.equal(
      zeitraeume(new Date("2026-11-15T22:30:00Z")).woche,
      "2026-11-09",
    );
  });

  it("im Januar liegt der Vormonat im Vorjahr", () => {
    const z = zeitraeume(new Date("2027-01-05T10:00:00Z"));
    assert.equal(z.vormonat, "2026-12-01");
    assert.equal(z.jahr, "2027-01-01");
  });

  it("gelesen wird ab dem frühesten nötigen Tag", () => {
    // November: 1. Januar ist der früheste (Mitternacht in Hamburg).
    assert.equal(leseAb(NOW).toISOString(), "2025-12-31T23:00:00.000Z");
    // Januar: 90 Tage zurück liegt vor der Balkenreihe und dem Vormonat.
    const jan = new Date("2027-01-05T10:00:00Z");
    assert.equal(leseAb(jan).getTime(), jan.getTime() - 90 * D);
  });

  it("Wochenspanne und Monatswechsel", () => {
    assert.equal(wochenSpanne("2026-11-02"), "2.–8.11.");
    assert.equal(wochenSpanne("2026-10-26"), "26.10.–1.11.");
  });
});

describe("Anfragen zählen", () => {
  it("Woche, Vorwoche, Monat, Vormonat und Art", () => {
    const z = anfragenZahlen(
      [
        lead("2026-11-16T08:00:00Z", "anfrage"), // diese Woche, November
        lead("2026-11-15T23:30:00Z", "termin"), // Mo 0:30 → diese Woche
        lead("2026-11-15T22:30:00Z", "audit"), // So 23:30 → Vorwoche
        lead("2026-11-10T09:00:00Z", "anfrage"), // Vorwoche
        lead("2026-11-02T09:00:00Z", "anfrage"), // November, ältere Woche
        lead("2026-10-31T23:30:00Z", "audit"), // So 1.11. 0:30 (MEZ) → November
        lead("2026-10-31T22:30:00Z", "anfrage"), // Sa 31.10. 23:30 → Oktober
        lead("2026-10-05T09:00:00Z", "termin"), // Oktober
        lead("2026-09-01T09:00:00Z", "anfrage"), // nur in der Balkenreihe
        lead("2026-01-02T09:00:00Z", "anfrage"), // außerhalb von allem
      ],
      NOW,
    );
    assert.deepEqual(z.dieseWoche, {
      alle: 2,
      anfrage: 1,
      audit: 0,
      termin: 1,
    });
    assert.deepEqual(z.letzteWoche, {
      alle: 2,
      anfrage: 1,
      audit: 1,
      termin: 0,
    });
    assert.deepEqual(z.dieserMonat, {
      alle: 6,
      anfrage: 3,
      audit: 2,
      termin: 1,
    });
    assert.deepEqual(z.letzterMonat, {
      alle: 2,
      anfrage: 1,
      audit: 0,
      termin: 1,
    });
    assert.equal(z.monatName, "November");
    assert.equal(z.vormonatName, "Oktober");
  });

  it("zwölf Wochen, die laufende zuletzt, mit KW und Maximum", () => {
    const z = anfragenZahlen(
      [
        lead("2026-11-16T08:00:00Z"),
        lead("2026-11-03T08:00:00Z"),
        lead("2026-11-04T08:00:00Z"),
        lead("2026-11-05T08:00:00Z", "audit"),
        lead("2026-08-31T08:00:00Z"),
        lead("2026-08-30T08:00:00Z"), // So davor: nicht mehr drin
      ],
      NOW,
    );
    assert.equal(z.wochen.length, 12);
    assert.equal(z.wochen[0].montag, "2026-08-31");
    assert.equal(z.wochen[0].kw, 36);
    assert.equal(z.wochen[0].zahlen.alle, 1);
    assert.equal(z.wochen[11].kw, 47);
    assert.equal(z.wochen[11].laufend, true);
    assert.equal(z.wochen[10].laufend, false);
    assert.deepEqual(z.wochen[9].zahlen, {
      alle: 3,
      anfrage: 2,
      audit: 1,
      termin: 0,
    });
    assert.equal(z.max, 3);
    assert.equal(z.summe, 5);
  });

  it("ohne Anfragen: alles 0, Maximum 1 (keine Division durch 0)", () => {
    const z = anfragenZahlen([], NOW);
    assert.equal(z.summe, 0);
    assert.equal(z.max, 1);
    assert.equal(z.dieseWoche.alle, 0);
  });

  it("kaputte oder künftige Zeitstempel zählen nicht", () => {
    const z = anfragenZahlen(
      [lead("kein Datum"), lead("2026-11-20T08:00:00Z")],
      NOW,
    );
    assert.equal(z.dieseWoche.alle, 0);
    assert.equal(z.summe, 0);
  });
});

// Business-Paket: 899 € einmalig, 79 € monatlich (brutto, 19 %)
const business = [
  { menge: 1, preis_cent: 89900, art: "einmalig" as const },
  { menge: 1, preis_cent: 7900, art: "monatlich" as const },
];
const angebot = (p: Partial<ZahlenAngebot>): ZahlenAngebot => ({
  status: "gesendet",
  gueltig_bis: "2026-12-01",
  accepted_at: null,
  positionen: business,
  ust_satz: 19,
  ...p,
});

describe("Angebote zählen", () => {
  it("Lage: offen nur gesendet und noch gültig", () => {
    assert.equal(
      angebotLage({ status: "entwurf", gueltig_bis: "2026-12-01" }, NOW),
      "entwurf",
    );
    assert.equal(
      angebotLage({ status: "gesendet", gueltig_bis: "2026-11-16" }, NOW),
      "offen",
    );
    assert.equal(
      angebotLage({ status: "gesendet", gueltig_bis: "2026-11-15" }, NOW),
      "nicht_angenommen",
    );
    assert.equal(
      angebotLage({ status: "abgelehnt", gueltig_bis: "2026-12-01" }, NOW),
      "nicht_angenommen",
    );
    assert.equal(
      angebotLage({ status: "zurueckgezogen", gueltig_bis: "2026-12-01" }, NOW),
      "nicht_angenommen",
    );
    assert.equal(
      angebotLage({ status: "angenommen", gueltig_bis: "2026-01-01" }, NOW),
      "angenommen",
    );
  });

  it("offen, angenommen im Monat und im Jahr, Quote und Pflege", () => {
    const z = angeboteZahlen(
      [
        angebot({}), // offen
        angebot({
          positionen: [
            ...business,
            { menge: 5, preis_cent: 9000, art: "einmalig" },
          ],
        }), // offen, 899 + 450
        angebot({ status: "entwurf" }), // zählt nirgends
        angebot({ status: "gesendet", gueltig_bis: "2026-11-01" }), // abgelaufen
        angebot({ status: "abgelehnt" }),
        angebot({
          status: "angenommen",
          accepted_at: "2026-11-03T12:00:00Z",
        }),
        angebot({
          status: "angenommen",
          accepted_at: "2026-10-31T23:30:00Z", // 1.11. 0:30 in Hamburg
          positionen: [{ menge: 1, preis_cent: 59900, art: "einmalig" }],
        }),
        angebot({
          status: "angenommen",
          accepted_at: "2026-03-10T12:00:00Z",
          positionen: [
            { menge: 1, preis_cent: 249900, art: "einmalig" },
            { menge: 1, preis_cent: 17900, art: "monatlich" },
          ],
        }),
        angebot({ status: "angenommen", accepted_at: "2025-12-20T12:00:00Z" }),
      ],
      NOW,
    );
    assert.deepEqual(z.offen, {
      anzahl: 2,
      einmalig: 89900 * 2 + 45000,
      monatlich: 7900 * 2,
    });
    assert.deepEqual(z.angenommenMonat, {
      anzahl: 2,
      einmalig: 89900 + 59900,
      monatlich: 7900,
    });
    assert.deepEqual(z.angenommenJahr, {
      anzahl: 3,
      einmalig: 89900 + 59900 + 249900,
      monatlich: 7900 + 17900,
    });
    assert.equal(z.monatName, "November");
    assert.equal(z.jahr, 2026);
    // entschieden: abgelaufen, abgelehnt, 4× angenommen
    assert.equal(z.entschieden, 6);
    assert.equal(z.angenommen, 4);
    assert.equal(z.quote, 4 / 6);
    // Pflege: angenommen mit Monatsbeitrag (ohne das reine Einmal-Angebot)
    assert.deepEqual(z.pflege, { anzahl: 3, monatlich: 7900 + 17900 + 7900 });
  });

  it("keine Quote unter drei entschiedenen Angeboten", () => {
    const z = angeboteZahlen(
      [
        angebot({ status: "angenommen", accepted_at: "2026-11-03T12:00:00Z" }),
        angebot({ status: "zurueckgezogen" }),
        angebot({}),
      ],
      NOW,
    );
    assert.equal(z.entschieden, 2);
    assert.equal(z.quote, null);
  });

  it("ohne Umsatzsteuer: Brutto gleich Netto, Summen bleiben gleich", () => {
    const z = angeboteZahlen([angebot({ ust_satz: 0 })], NOW);
    assert.equal(z.offen.einmalig, 89900);
  });
});

const ev = (
  lead_id: string,
  created_at: string,
  action: ZahlenEvent["action"],
  detail: Record<string, unknown>,
): ZahlenEvent => ({ lead_id, created_at, action, detail });

describe("Antwortzeit", () => {
  it("was als erste Reaktion zählt", () => {
    const r = (
      action: ZahlenEvent["action"],
      detail: Record<string, unknown>,
    ) => istReaktion({ action, detail });
    assert.equal(r("status", { from: "neu", to: "in_arbeit" }), true);
    assert.equal(r("status", { from: "neu", to: "erledigt" }), true);
    assert.equal(
      r("status", { from: "neu", to: "in_arbeit", rueckgaengig: true }),
      false,
    );
    assert.equal(r("status", { from: "in_arbeit", to: "erledigt" }), false);
    assert.equal(r("kontakt", { kanal: "anruf", ergebnis: "erreicht" }), true);
    assert.equal(r("kontakt", { kanal: "anruf", ergebnis: "mailbox" }), false);
    assert.equal(
      r("kontakt", { kanal: "anruf", ergebnis: "nicht_erreicht" }),
      false,
    );
    assert.equal(r("kontakt", { kanal: "mail", ergebnis: "gesendet" }), true);
    assert.equal(
      r("angebot", { was: "freigegeben", nummer: "A-2026-0001" }),
      true,
    );
    assert.equal(
      r("angebot", { was: "gesendet", nummer: "A-2026-0001" }),
      true,
    );
    assert.equal(
      r("angebot", { was: "erstellt", nummer: "A-2026-0001" }),
      false,
    );
    assert.equal(r("wiedervorlage", { am: "2026-11-20" }), false);
    assert.equal(r("notiz", {}), false);
  });

  it("früheste Reaktion je Anfrage, egal in welcher Reihenfolge gelesen", () => {
    const m = ersteReaktionen([
      ev("a", "2026-11-10T12:00:00Z", "kontakt", { ergebnis: "gesendet" }),
      ev("a", "2026-11-10T10:00:00Z", "status", {
        from: "neu",
        to: "in_arbeit",
      }),
      ev("a", "2026-11-10T09:00:00Z", "kontakt", { ergebnis: "mailbox" }),
      ev("b", "2026-11-11T09:00:00Z", "angebot", { was: "erstellt" }),
    ]);
    assert.equal(m.get("a"), Date.parse("2026-11-10T10:00:00Z"));
    assert.equal(m.has("b"), false);
  });

  it("Einträge vor dem Eingang zählen nicht (eine Minute Spielraum)", () => {
    const events = [
      ev("a", "2026-11-10T08:00:00Z", "kontakt", { ergebnis: "gesendet" }),
      ev("a", "2026-11-10T08:59:30Z", "status", {
        from: "neu",
        to: "in_arbeit",
      }),
      ev("a", "2026-11-10T11:00:00Z", "kontakt", { ergebnis: "erreicht" }),
    ];
    const eingang = new Map([["a", Date.parse("2026-11-10T09:00:00Z")]]);
    assert.equal(
      ersteReaktionen(events, eingang).get("a"),
      Date.parse("2026-11-10T08:59:30Z"),
    );
    const spaeter = new Map([["a", Date.parse("2026-11-10T10:00:00Z")]]);
    assert.equal(
      ersteReaktionen(events, spaeter).get("a"),
      Date.parse("2026-11-10T11:00:00Z"),
    );
  });

  it("Median", () => {
    assert.equal(median([]), null);
    assert.equal(median([5]), 5);
    assert.equal(median([9, 1, 5]), 5);
    assert.equal(median([4, 1, 3, 2]), 2.5);
  });

  it("Median, Ziel und ohne Reaktion über die letzten 90 Tage", () => {
    const leads = [
      // Di 10.11. 10:00 (Werktag) → Ziel 14:00; Reaktion nach 1 Std → im Ziel
      lead("2026-11-10T09:00:00Z", "anfrage", "a"),
      // Di 10.11. 10:00 → Ziel 14:00; Reaktion nach 5 Std → nicht im Ziel
      lead("2026-11-10T09:00:00Z", "anfrage", "b"),
      // Website-Check Mo 9.11. 10:00 → Ziel Mi 11.11. 18:00; nach 2 Tagen → im Ziel
      lead("2026-11-09T09:00:00Z", "audit", "c"),
      // ohne Reaktion
      lead("2026-11-12T09:00:00Z", "anfrage", "d"),
      // älter als 90 Tage: zählt nicht
      lead("2026-08-01T09:00:00Z", "anfrage", "alt"),
    ];
    const events = [
      ev("a", "2026-11-10T10:00:00Z", "kontakt", { ergebnis: "erreicht" }),
      ev("b", "2026-11-10T14:00:00Z", "status", {
        from: "neu",
        to: "in_arbeit",
      }),
      ev("c", "2026-11-11T09:00:00Z", "angebot", { was: "gesendet" }),
      ev("d", "2026-11-12T10:00:00Z", "kontakt", { ergebnis: "mailbox" }),
      ev("alt", "2026-08-01T10:00:00Z", "kontakt", { ergebnis: "erreicht" }),
    ];
    const z = antwortZahlen(leads, events, NOW);
    assert.equal(z.anfragen, 4);
    assert.equal(z.beantwortet, 3);
    assert.equal(z.ohneReaktion, 1);
    assert.equal(z.imZiel, 2);
    assert.equal(z.medianMs, 5 * H);
    assert.equal(z.anteilImZiel, 2 / 3);
    assert.deepEqual(antwortFensterIds(leads, NOW), ["a", "b", "c", "d"]);
  });

  it("unter drei beantworteten: keine Werte (Noch zu wenig Daten)", () => {
    const z = antwortZahlen(
      [
        lead("2026-11-10T09:00:00Z", "anfrage", "a"),
        lead("2026-11-11T09:00:00Z", "termin", "b"),
      ],
      [
        ev("a", "2026-11-10T10:00:00Z", "kontakt", { ergebnis: "erreicht" }),
        ev("b", "2026-11-11T10:00:00Z", "kontakt", { ergebnis: "gesendet" }),
      ],
      NOW,
    );
    assert.equal(z.beantwortet, 2);
    assert.equal(z.medianMs, null);
    assert.equal(z.anteilImZiel, null);
  });
});

describe("Ergebnis", () => {
  it("nur Anfragen seit dem 1. Januar (Hamburger Zeit)", () => {
    const z = ergebnisZahlen(
      [
        { created_at: "2026-11-01T09:00:00Z", outcome: "gewonnen" },
        { created_at: "2026-03-01T09:00:00Z", outcome: "verloren" },
        { created_at: "2026-02-01T09:00:00Z", outcome: null },
        { created_at: "2025-12-31T23:30:00Z", outcome: "gewonnen" }, // 1.1. 0:30
        { created_at: "2025-12-31T22:30:00Z", outcome: "gewonnen" }, // Vorjahr
        { created_at: "2026-05-01T09:00:00Z" }, // ohne Spalte (v1)
      ],
      NOW,
    );
    assert.deepEqual(z, { jahr: 2026, gewonnen: 2, verloren: 1 });
  });
});

describe("Anzeige", () => {
  it("Dauer in Worten", () => {
    assert.equal(formatDauer(0), "1 Min");
    assert.equal(formatDauer(35 * MIN), "35 Min");
    assert.equal(formatDauer(2 * H + 10 * MIN), "2 Std 10 Min");
    assert.equal(formatDauer(3 * H), "3 Std");
    assert.equal(formatDauer(14 * H + 20 * MIN), "14 Std");
    assert.equal(formatDauer(D + 4 * H), "1 Tag 4 Std");
    assert.equal(formatDauer(2 * D), "2 Tage");
    assert.equal(formatDauer(5 * D + 3 * H), "5 Tage");
  });

  it("Anteil, Euro und Anzahl", () => {
    assert.equal(formatAnteil(2 / 3), "67 %");
    assert.equal(formatEuroGanz(349700), "3.497 €");
    assert.equal(formatEuroGanz(349750), "3.497,50 €");
    assert.equal(formatEuroGanz(0), "0 €");
    assert.equal(anzahl(1, "Angebot", "Angebote"), "1 Angebot");
    assert.equal(anzahl(0, "Angebot", "Angebote"), "0 Angebote");
  });
});

// --- Lesen (Attrappe von PostgREST) -----------------------------------

type Mock = Awaited<ReturnType<typeof startMock>>;
type Store = typeof import("@/lib/admin/zahlen-store");

describe("Lesen für /admin/zahlen", () => {
  let mock: Mock;
  let store: Store;

  before(async () => {
    mock = await startMock({ mode: "v3" });
    process.env.NEXT_PUBLIC_SUPABASE_URL = mock.url;
    process.env.SUPABASE_SERVICE_ROLE_KEY = SERVICE_KEY;
    store = await import("@/lib/admin/zahlen-store");
  });

  after(async () => {
    await mock.close();
  });

  beforeEach(() => mock.reset("v3"));

  it("Anfragen ab Datum, nur Zählspalten, mit Ergebnis bei v2", async () => {
    mock.seedLead({
      created_at: "2026-11-10T09:00:00.000Z",
      outcome: "gewonnen",
    });
    mock.seedLead({ created_at: "2025-06-01T09:00:00.000Z" });
    const r = await store.leadsFuerZahlen(
      new Date("2026-01-01T00:00:00Z"),
      true,
    );
    assert.equal(r.rows.length, 1);
    assert.equal(r.gekappt, false);
    assert.deepEqual(Object.keys(r.rows[0]).sort(), [
      "created_at",
      "id",
      "kind",
      "outcome",
      "status",
    ]);
    const url = mock.requests.at(-1)?.url ?? "";
    assert.match(url, /created_at=gte\./);
    assert.doesNotMatch(url, /reply_to|fields|notes/);
  });

  it("ohne Datenbank-Update (v1): ohne outcome lesbar", async () => {
    mock.reset("v1");
    mock.seedLead({ created_at: "2026-11-10T09:00:00.000Z" });
    const r = await store.leadsFuerZahlen(
      new Date("2026-01-01T00:00:00Z"),
      false,
    );
    assert.equal(r.rows.length, 1);
    assert.equal(r.rows[0].outcome, undefined);
  });

  it("Verlauf in Blöcken über .in(), nur Reaktions-Aktionen", async () => {
    const ids: string[] = [];
    for (let i = 0; i < 150; i++) {
      const l = mock.seedLead({ created_at: "2026-11-10T09:00:00.000Z" });
      ids.push(l.id as string);
    }
    const t = (n: number) =>
      new Date(Date.parse("2026-11-10T10:00:00Z") + n * MIN).toISOString();
    mock.tables.lead_events.push(
      {
        id: "e1",
        lead_id: ids[0],
        created_at: t(2),
        actor: "x",
        action: "kontakt",
        detail: { ergebnis: "erreicht" },
      },
      {
        id: "e2",
        lead_id: ids[149],
        created_at: t(1),
        actor: "x",
        action: "status",
        detail: { from: "neu", to: "in_arbeit" },
      },
      {
        id: "e3",
        lead_id: ids[0],
        created_at: t(0),
        actor: "x",
        action: "notizen",
        detail: { zeichen: 3 },
      },
    );
    const before = mock.requests.length;
    const r = await store.reaktionenFuerZahlen(ids);
    assert.ok(r);
    const reqs = mock.requests.slice(before);
    assert.equal(reqs.length, 2);
    for (const q of reqs) {
      assert.match(decodeURIComponent(q.url), /lead_id=in\.\(/);
      assert.match(
        decodeURIComponent(q.url),
        /action=in\.\(status,kontakt,angebot\)/,
      );
    }
    assert.deepEqual(r.rows.map((e) => e.action).sort(), ["kontakt", "status"]);
    assert.equal(r.gekappt, false);
    assert.deepEqual(await store.reaktionenFuerZahlen([]), {
      rows: [],
      gekappt: false,
    });
  });

  it("fehlende Tabellen: null statt Fehler", async () => {
    mock.reset("v1");
    assert.equal(
      await store.reaktionenFuerZahlen([
        "00000000-0000-4000-8000-000000000001",
      ]),
      null,
    );
    assert.equal(await store.angeboteFuerZahlen(), null);
  });

  it("Angebote ohne Kundendaten, Positionen geprüft", async () => {
    mock.seedAngebot({
      status: "angenommen",
      accepted_at: "2026-11-03T12:00:00.000Z",
      ust_satz: 0,
      positionen: [
        {
          id: "p1",
          titel: "Paket",
          beschreibung: "",
          menge: 1,
          preis_cent: 89900,
          art: "einmalig",
        },
        { kaputt: true },
      ],
    });
    const r = await store.angeboteFuerZahlen();
    assert.ok(r);
    assert.equal(r.rows.length, 1);
    assert.equal(r.rows[0].status, "angenommen");
    assert.equal(r.rows[0].ust_satz, 0);
    assert.equal(r.rows[0].positionen.length, 1);
    const url = mock.requests.at(-1)?.url ?? "";
    assert.doesNotMatch(url, /kunde_|token|titel|einleitung/);
  });
});
