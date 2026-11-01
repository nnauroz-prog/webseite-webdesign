import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { AngebotPosition } from "@/lib/admin/angebote";

import {
  absaetze,
  absenderAdresse,
  aktualisiertNachSenden,
  KUNDEN_MELDUNGEN,
  mengeText,
  nichtMehrOnline,
  positionsGruppen,
  rueckfrageMailHref,
  statusKasten,
} from "@/app/angebot/angebot-seite";
import { kundenAnsicht } from "@/lib/admin/angebote";

// So, 1.11.2026, 11:00 in Hamburg
const NOW = new Date("2026-11-01T10:00:00Z");

const pos = (p: Partial<AngebotPosition>): AngebotPosition => ({
  id: "p-x",
  titel: "Leistung",
  beschreibung: "",
  menge: 1,
  preis_cent: 1000,
  art: "einmalig",
  ...p,
});

describe("absenderAdresse", () => {
  it("leer oder nicht gesetzt: keine Zeilen", () => {
    assert.deepEqual(absenderAdresse(undefined), []);
    assert.deepEqual(absenderAdresse(""), []);
    assert.deepEqual(absenderAdresse("  \n | "), []);
  });

  it("trennt an Umbruch, geschriebenem \\n und |", () => {
    assert.deepEqual(absenderAdresse("Musterweg 1\n20095 Hamburg"), [
      "Musterweg 1",
      "20095 Hamburg",
    ]);
    assert.deepEqual(absenderAdresse("Musterweg 1\\n20095 Hamburg"), [
      "Musterweg 1",
      "20095 Hamburg",
    ]);
    assert.deepEqual(absenderAdresse(" Musterweg 1 | 20095  Hamburg "), [
      "Musterweg 1",
      "20095 Hamburg",
    ]);
  });

  it("Komma bleibt in der Zeile, Steuerzeichen fallen weg, höchstens 4 × 80", () => {
    assert.deepEqual(absenderAdresse("Musterweg 1, 20095 Hamburg"), [
      "Musterweg 1, 20095 Hamburg",
    ]);
    assert.deepEqual(absenderAdresse("A\u0007B"), ["A B"]);
    const viele = absenderAdresse("1|2|3|4|5|6");
    assert.deepEqual(viele, ["1", "2", "3", "4"]);
    assert.equal(absenderAdresse("x".repeat(200))[0].length, 80);
  });
});

describe("positionsGruppen", () => {
  it("erst einmalig, dann monatlich, durchnummeriert, mit Netto", () => {
    const g = positionsGruppen([
      pos({ id: "m1", art: "monatlich", preis_cent: 7900 }),
      pos({ id: "e1", menge: 5, preis_cent: 9000 }),
      pos({ id: "e2", preis_cent: 0 }),
    ]);
    assert.deepEqual(
      g.map((x) => [
        x.art,
        x.titel,
        x.positionen.map((p) => [p.id, p.nr, p.netto]),
      ]),
      [
        [
          "einmalig",
          "Einmalige Leistungen",
          [
            ["e1", 1, 45000],
            ["e2", 2, 0],
          ],
        ],
        ["monatlich", "Monatliche Leistungen", [["m1", 3, 7900]]],
      ],
    );
  });

  it("leere Gruppen fallen weg", () => {
    assert.deepEqual(
      positionsGruppen([pos({ art: "monatlich" })]).map((x) => x.art),
      ["monatlich"],
    );
    assert.deepEqual(positionsGruppen([]), []);
  });
});

describe("Texte", () => {
  it("absaetze: Leerzeile trennt, einzelner Umbruch bleibt", () => {
    assert.deepEqual(
      absaetze("Guten Tag,\n\nZeile 1\nZeile 2\r\n\r\n\n  Ende  "),
      ["Guten Tag,", "Zeile 1\nZeile 2", "Ende"],
    );
    assert.deepEqual(absaetze("  \n\n "), []);
  });

  it("mengeText nur ab 2", () => {
    assert.equal(mengeText(1), "");
    assert.equal(mengeText(5), "5 ×");
  });

  it("rueckfrageMailHref: nur die Nummer im Betreff", () => {
    assert.equal(
      rueckfrageMailHref("A-2026-0001"),
      "mailto:info@sitalo.de?subject=Frage%20zum%20Angebot%20A-2026-0001",
    );
  });

  it("aktualisiertNachSenden: erst ab einer Minute nach dem Senden", () => {
    const sent_at = "2026-11-01T10:00:00Z";
    assert.equal(
      aktualisiertNachSenden({ sent_at, updated_at: "2026-11-01T09:59:58Z" }),
      false,
    );
    assert.equal(
      aktualisiertNachSenden({ sent_at, updated_at: "2026-11-01T10:00:30Z" }),
      false,
    );
    assert.equal(
      aktualisiertNachSenden({ sent_at, updated_at: "2026-11-02T08:00:00Z" }),
      true,
    );
    assert.equal(
      aktualisiertNachSenden({
        sent_at: null,
        updated_at: "2026-11-02T08:00:00Z",
      }),
      false,
    );
  });

  it("Meldungen: Kunden in Sie-Form mit Telefon, Admin in du-Form", () => {
    // Die Nummer steht mit geschütztem Leerzeichen (bricht nicht um).
    assert.match(KUNDEN_MELDUNGEN.technik, /0160\s7621876/);
    assert.match(KUNDEN_MELDUNGEN.bestaetigt, /Häkchen/);
    assert.match(KUNDEN_MELDUNGEN.admin, /^Du bist als Admin angemeldet/);
    for (const [k, v] of Object.entries(KUNDEN_MELDUNGEN)) {
      if (k === "admin") continue;
      assert.doesNotMatch(v, /\b(du|dein|dich)\b/i, k);
    }
  });
});

describe("statusKasten", () => {
  const basis = {
    gueltig_bis: "2026-12-01",
    accepted_at: null,
    declined_at: null,
    angenommen_von: null,
  };

  it("offen: kein Kasten", () => {
    const a = { ...basis, status: "gesendet" as const };
    assert.equal(statusKasten(a, kundenAnsicht(a, NOW), NOW), null);
  });

  it("abgelaufen: mit Datum, kein Annehmen", () => {
    const a = {
      ...basis,
      status: "gesendet" as const,
      gueltig_bis: "2026-10-31",
    };
    const k = statusKasten(a, kundenAnsicht(a, NOW), NOW);
    assert.equal(k?.titel, "Dieses Angebot ist abgelaufen");
    assert.match(k?.text ?? "", /31\. Oktober 2026/);
    assert.match(k?.text ?? "", /nicht mehr annehmen/);
  });

  it("der letzte Tag gilt noch", () => {
    const a = {
      ...basis,
      status: "gesendet" as const,
      gueltig_bis: "2026-11-01",
    };
    assert.equal(statusKasten(a, kundenAnsicht(a, NOW), NOW), null);
  });

  it("zurückgezogen: nicht mehr gültig", () => {
    const k = statusKasten(basis, "zurueckgezogen", NOW);
    assert.equal(k?.titel, "Dieses Angebot ist nicht mehr gültig");
    assert.equal(k?.ton, "ende");
  });

  it("angenommen heute: Danke und Starttermin am selben Werktag", () => {
    const k = statusKasten(
      {
        ...basis,
        accepted_at: "2026-11-01T09:30:00Z",
        angenommen_von: "Tom Berger",
      },
      "angenommen",
      NOW,
    );
    assert.equal(
      k?.text,
      "Angenommen am 1. November 2026 um 10:30 Uhr von Tom Berger. Danke für Ihren Auftrag! Wir melden uns meist noch am selben Werktag mit dem Starttermin. Für Ihre Unterlagen können Sie das Angebot oben als PDF speichern.",
    );
  });

  it("angenommen früher: ohne Zusage für heute", () => {
    const k = statusKasten(
      {
        ...basis,
        accepted_at: "2026-10-20T09:30:00Z",
        angenommen_von: "Tom Berger",
      },
      "angenommen",
      NOW,
    );
    assert.match(
      k?.text ?? "",
      /^Angenommen am 20\. Oktober 2026 um 11:30 Uhr von Tom Berger\./,
    );
    assert.doesNotMatch(k?.text ?? "", /selben Werktag/);
  });

  it("abgelehnt: Datum in Hamburger Zeit", () => {
    const k = statusKasten(
      { ...basis, declined_at: "2026-10-31T23:30:00Z" },
      "abgelehnt",
      NOW,
    );
    assert.match(k?.text ?? "", /am 1\. November 2026 abgelehnt/);
  });

  it("Entwurf: Vorschau-Hinweis für den Admin", () => {
    const k = statusKasten(basis, "entwurf", NOW);
    assert.equal(k?.ton, "vorschau");
    assert.match(k?.text ?? "", /du/);
  });
});

describe("nichtMehrOnline", () => {
  const leer = { accepted_at: null, declined_at: null, gueltig_bis: "2026-12-01" };

  it("offen und Entwurf: immer online", () => {
    const spaet = new Date("2029-01-01T10:00:00Z");
    assert.equal(nichtMehrOnline(leer, "offen", spaet), false);
    assert.equal(nichtMehrOnline(leer, "entwurf", spaet), false);
  });

  it("angenommen: ein Jahr voll, danach nur die Nummer", () => {
    const a = { ...leer, accepted_at: "2026-11-02T13:05:00Z" };
    assert.equal(
      nichtMehrOnline(a, "angenommen", new Date("2027-11-01T13:05:00Z")),
      false,
    );
    assert.equal(
      nichtMehrOnline(a, "angenommen", new Date("2027-11-03T13:05:00Z")),
      true,
    );
  });

  it("abgelehnt und abgelaufen", () => {
    const d = { ...leer, declined_at: "2026-11-02T13:05:00Z" };
    assert.equal(nichtMehrOnline(d, "abgelehnt", new Date("2027-12-01T00:00:00Z")), true);
    assert.equal(nichtMehrOnline(leer, "abgelaufen", new Date("2027-11-30T10:00:00Z")), false);
    assert.equal(nichtMehrOnline(leer, "abgelaufen", new Date("2027-12-03T10:00:00Z")), true);
  });
});
