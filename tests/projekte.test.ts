import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { AngebotPosition } from "@/lib/admin/angebote";
import type { ProjektAngebot, ProjektRow } from "@/lib/admin/projekte";

import {
  fortschritt,
  fortschrittText,
  mitSchritt,
  monatlichBrutto,
  parsePflegeBis,
  parsePflegeSeit,
  parseProjektDatum,
  parseProjektNotiz,
  parseSchritt,
  parseSchrittDatum,
  pflegeAktiv,
  pflegeSeit,
  pflegeUebersicht,
  PROJEKT_NOTIZ_MAX,
  PROJEKT_SCHRITTE,
  projektAusZeile,
  projektSicht,
  projektSichten,
  schritteAusDb,
  sortiereProjekte,
} from "@/lib/admin/projekte";

// Mo, 16.11.2026, 11:00 in Hamburg
const NOW = new Date("2026-11-16T10:00:00Z");

const pos = (
  art: AngebotPosition["art"],
  preis_cent: number,
  menge = 1,
): AngebotPosition => ({
  id: `p-${art}-${preis_cent}`,
  titel: art,
  beschreibung: "",
  menge,
  preis_cent,
  art,
});

let n = 0;
function angebot(partial: Partial<ProjektAngebot> = {}): ProjektAngebot {
  n += 1;
  return {
    id: `00000000-0000-4000-8000-${String(n).padStart(12, "0")}`,
    lead_id: `10000000-0000-4000-8000-${String(n).padStart(12, "0")}`,
    nummer: `A-2026-${String(n).padStart(4, "0")}`,
    status: "angenommen",
    titel: "Angebot: Website",
    kunde_name: "Tom Berger",
    kunde_firma: "Salon Hanseschnitt",
    accepted_at: "2026-11-10T09:00:00Z",
    positionen: [pos("einmalig", 99900), pos("monatlich", 9900)],
    ust_satz: 19,
    ...partial,
  };
}

function projekt(
  a: ProjektAngebot,
  partial: Partial<ProjektRow> = {},
): ProjektRow {
  return {
    id: `p-${a.id}`,
    angebot_id: a.id,
    lead_id: a.lead_id,
    created_at: "2026-11-11T09:00:00Z",
    updated_at: "2026-11-11T09:00:00Z",
    schritte: {},
    livegang_am: null,
    pflege_seit: null,
    pflege_bis: null,
    notiz: null,
    ...partial,
  };
}

describe("Schritte und Fortschritt", () => {
  it("fünf Schritte in fester Reihenfolge", () => {
    assert.deepEqual(PROJEKT_SCHRITTE, [
      "anzahlung",
      "inhalte",
      "entwurf",
      "korrektur",
      "livegang",
    ]);
  });

  it("zählt erledigte Schritte und nennt den ersten offenen", () => {
    assert.deepEqual(fortschritt({}), {
      erledigt: 0,
      gesamt: 5,
      naechster: "anzahlung",
      fertig: false,
    });
    const f = fortschritt({
      anzahlung: "2026-11-10",
      inhalte: "2026-11-12",
      korrektur: "2026-11-14",
    });
    assert.equal(f.erledigt, 3);
    // Lücke: Entwurf fehlt noch, obwohl Korrektur schon abgehakt ist.
    assert.equal(f.naechster, "entwurf");
    assert.equal(fortschrittText(f), "3 von 5");
    const alle = Object.fromEntries(
      PROJEKT_SCHRITTE.map((s) => [s, "2026-11-15"]),
    );
    assert.deepEqual(fortschritt(alle), {
      erledigt: 5,
      gesamt: 5,
      naechster: null,
      fertig: true,
    });
  });

  it("mitSchritt: abhaken, Datum ändern, öffnen; Livegang setzt livegang_am", () => {
    const a = mitSchritt({}, "inhalte", "2026-11-12");
    assert.deepEqual(a, { schritte: { inhalte: "2026-11-12" } });
    const b = mitSchritt(a.schritte, "anzahlung", "2026-11-10");
    // Gespeichert in der Reihenfolge der Schritte.
    assert.deepEqual(Object.keys(b.schritte), ["anzahlung", "inhalte"]);
    assert.deepEqual(mitSchritt(b.schritte, "inhalte", null), {
      schritte: { anzahlung: "2026-11-10" },
    });
    assert.deepEqual(mitSchritt(b.schritte, "livegang", "2026-11-16"), {
      schritte: {
        anzahlung: "2026-11-10",
        inhalte: "2026-11-12",
        livegang: "2026-11-16",
      },
      livegang_am: "2026-11-16",
    });
    assert.deepEqual(mitSchritt({ livegang: "2026-11-16" }, "livegang", null), {
      schritte: {},
      livegang_am: null,
    });
    // Das Original bleibt unverändert.
    assert.deepEqual(a.schritte, { inhalte: "2026-11-12" });
  });

  it("schritteAusDb: nur bekannte Schritte mit echtem Datum", () => {
    assert.deepEqual(
      schritteAusDb({
        anzahlung: "2026-11-10",
        inhalte: "2026-02-30",
        entwurf: 5,
        hack: "2026-11-10",
      }),
      { anzahlung: "2026-11-10" },
    );
    assert.deepEqual(schritteAusDb(null), {});
    assert.deepEqual(schritteAusDb(["anzahlung"]), {});
  });

  it("projektAusZeile prüft Daten und Schritte", () => {
    const p = projektAusZeile({
      id: "x",
      angebot_id: "a",
      lead_id: "l",
      schritte: { livegang: "2026-11-16" },
      livegang_am: "2026-11-16",
      pflege_seit: "kaputt",
      pflege_bis: null,
      notiz: 42,
    });
    assert.equal(p.livegang_am, "2026-11-16");
    assert.equal(p.pflege_seit, null);
    assert.equal(p.notiz, null);
    assert.deepEqual(p.schritte, { livegang: "2026-11-16" });
  });
});

describe("Eingaben", () => {
  it("parseSchritt nur bekannte Schritte", () => {
    assert.equal(parseSchritt("livegang"), "livegang");
    assert.equal(parseSchritt("Livegang"), null);
    assert.equal(parseSchritt(1), null);
  });

  it("parseSchrittDatum: echtes Datum, nicht in der Zukunft", () => {
    assert.equal(parseSchrittDatum("2026-11-16", NOW), "2026-11-16");
    assert.equal(parseSchrittDatum("2026-11-01", NOW), "2026-11-01");
    assert.equal(parseSchrittDatum("2026-11-17", NOW), null);
    assert.equal(parseSchrittDatum("2026-02-30", NOW), null);
    assert.equal(parseSchrittDatum("2019-12-31", NOW), null);
    assert.equal(parseSchrittDatum(null, NOW), null);
  });

  it("parseProjektDatum 2020 bis 2100", () => {
    assert.equal(parseProjektDatum("2020-01-01"), "2020-01-01");
    assert.equal(parseProjektDatum("2101-01-01"), null);
    assert.equal(parseProjektDatum("16.11.2026"), null);
  });

  it("parseProjektNotiz: getrimmt, leer wird null, Länge begrenzt", () => {
    assert.deepEqual(parseProjektNotiz("  Fotos kommen Freitag \r\n"), {
      notiz: "Fotos kommen Freitag",
    });
    assert.deepEqual(parseProjektNotiz("   "), { notiz: null });
    assert.deepEqual(parseProjektNotiz("x".repeat(PROJEKT_NOTIZ_MAX)), {
      notiz: "x".repeat(PROJEKT_NOTIZ_MAX),
    });
    assert.equal(parseProjektNotiz("x".repeat(PROJEKT_NOTIZ_MAX + 1)), null);
    assert.equal(parseProjektNotiz(null), null);
  });

  it("parsePflegeBis / parsePflegeSeit: Ende nicht vor Beginn, höchstens ein Jahr voraus", () => {
    assert.equal(parsePflegeBis("2026-12-31", "2026-11-10", NOW), "2026-12-31");
    assert.equal(parsePflegeBis("2026-11-09", "2026-11-10", NOW), null);
    assert.equal(parsePflegeBis("2026-11-10", "2026-11-10", NOW), "2026-11-10");
    assert.equal(parsePflegeBis("2028-01-01", null, NOW), null);
    assert.equal(
      parsePflegeSeit("2026-11-20", "2026-11-30", NOW),
      "2026-11-20",
    );
    assert.equal(parsePflegeSeit("2026-12-01", "2026-11-30", NOW), null);
    assert.equal(parsePflegeSeit("2026-12-01", null, NOW), "2026-12-01");
  });
});

describe("Pflege", () => {
  it("monatlicher Betrag aus den Positionen (brutto)", () => {
    assert.equal(monatlichBrutto(angebot()), 9900);
    assert.equal(
      monatlichBrutto(
        angebot({
          positionen: [pos("monatlich", 7900), pos("monatlich", 1000, 2)],
        }),
      ),
      9900,
    );
    assert.equal(
      monatlichBrutto(angebot({ positionen: [pos("einmalig", 59900)] })),
      0,
    );
  });

  it("Beginn: gespeichert, sonst Livegang, sonst Annahme", () => {
    const a = angebot();
    assert.equal(pflegeSeit(null, "2026-11-10"), "2026-11-10");
    assert.equal(
      pflegeSeit(projekt(a, { livegang_am: "2026-11-14" }), "2026-11-10"),
      "2026-11-14",
    );
    assert.equal(
      pflegeSeit(
        projekt(a, { livegang_am: "2026-11-14", pflege_seit: "2026-12-01" }),
        "2026-11-10",
      ),
      "2026-12-01",
    );
  });

  it("läuft nur mit Monatsbeitrag und solange das Ende in der Zukunft liegt", () => {
    const heute = "2026-11-16";
    assert.equal(pflegeAktiv(9900, null, heute), true);
    assert.equal(pflegeAktiv(9900, "2026-11-30", heute), true);
    assert.equal(pflegeAktiv(9900, heute, heute), false);
    assert.equal(pflegeAktiv(9900, "2026-11-01", heute), false);
    assert.equal(pflegeAktiv(0, null, heute), false);
  });

  it("Übersicht: laufende mit Summe, beendete getrennt, ohne Monatsbeitrag gar nicht", () => {
    const a1 = angebot({ kunde_firma: "A" });
    const a2 = angebot({
      kunde_firma: "B",
      positionen: [pos("einmalig", 249900), pos("monatlich", 17900)],
    });
    const a3 = angebot({ kunde_firma: "C" });
    const a4 = angebot({
      kunde_firma: "D",
      positionen: [pos("einmalig", 59900)],
    });
    const sichten = projektSichten(
      [a1, a2, a3, a4],
      [
        projekt(a1, { livegang_am: "2026-11-12" }),
        projekt(a3, { pflege_bis: "2026-11-15" }),
      ],
      NOW,
    );
    const u = pflegeUebersicht(sichten);
    assert.deepEqual(
      u.aktiv.map((p) => p.kunde),
      // Nach Beginn: B (Annahme 10.11.) vor A (Livegang 12.11.)
      ["B", "A"],
    );
    assert.equal(u.summeMonatlich, 9900 + 17900);
    assert.deepEqual(
      u.beendet.map((p) => p.kunde),
      ["C"],
    );
  });
});

describe("Sicht und Sortierung", () => {
  it("projektSicht: Kunde, Ansprechpartner, Summen, Annahmetag in Hamburg", () => {
    const a = angebot({ accepted_at: "2026-11-09T23:30:00Z" });
    const p = projektSicht(a, null, NOW);
    assert.equal(p.kunde, "Salon Hanseschnitt");
    assert.equal(p.ansprechpartner, "Tom Berger");
    // 23:30 UTC ist in Hamburg schon der 10.11.
    assert.equal(p.angenommenAm, "2026-11-10");
    assert.equal(p.summen.einmalig.brutto, 99900);
    assert.equal(p.pflege.monatlich, 9900);
    assert.equal(p.pflege.seit, "2026-11-10");
    assert.equal(p.pflege.aktiv, true);
    assert.equal(p.fortschritt.naechster, "anzahlung");

    const ohneFirma = projektSicht(
      angebot({ kunde_firma: null, kunde_name: "Anna Brandt" }),
      null,
      NOW,
    );
    assert.equal(ohneFirma.kunde, "Anna Brandt");
    assert.equal(ohneFirma.ansprechpartner, null);
  });

  it("nur angenommene Angebote werden Projekte; je Angebot das passende Projekt", () => {
    const a1 = angebot();
    const a2 = angebot({ status: "gesendet" });
    const sichten = projektSichten(
      [a1, a2],
      [projekt(a1, { schritte: { anzahlung: "2026-11-11" } })],
      NOW,
    );
    assert.equal(sichten.length, 1);
    assert.equal(sichten[0].angebot.id, a1.id);
    assert.equal(sichten[0].fortschritt.erledigt, 1);
  });

  it("in Arbeit nach nächstem Schritt, dann länger angenommen zuerst; fertig zuletzt live zuerst", () => {
    const alle = Object.fromEntries(
      PROJEKT_SCHRITTE.map((s) => [s, "2026-11-01"]),
    );
    const a = angebot({
      kunde_firma: "Entwurf",
      accepted_at: "2026-11-01T09:00:00Z",
    });
    const b = angebot({
      kunde_firma: "Anzahlung neu",
      accepted_at: "2026-11-14T09:00:00Z",
    });
    const c = angebot({
      kunde_firma: "Anzahlung alt",
      accepted_at: "2026-11-02T09:00:00Z",
    });
    const d = angebot({ kunde_firma: "Fertig früh" });
    const e = angebot({ kunde_firma: "Fertig spät" });
    const sichten = projektSichten(
      [a, b, c, d, e],
      [
        projekt(a, {
          schritte: { anzahlung: "2026-11-02", inhalte: "2026-11-05" },
        }),
        projekt(d, { schritte: { ...alle, livegang: "2026-11-03" } }),
        projekt(e, { schritte: { ...alle, livegang: "2026-11-12" } }),
      ],
      NOW,
    );
    const { inArbeit, fertig } = sortiereProjekte(sichten);
    assert.deepEqual(
      inArbeit.map((p) => p.kunde),
      ["Anzahlung alt", "Anzahlung neu", "Entwurf"],
    );
    assert.deepEqual(
      fertig.map((p) => p.kunde),
      ["Fertig spät", "Fertig früh"],
    );
  });
});
