import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { EditorState } from "@/app/admin/anfragen/[id]/angebot/[angebotId]/editor-model";
import type { AngebotInhalt } from "@/lib/admin/angebote";

import {
  aendern,
  formAus,
  formKey,
  mengeZahl,
  paketAus,
  paketWaehlen,
  payloadAus,
  preisCent,
  stateAus,
  stateAusEntwurf,
  summenAus,
  zeileNetto,
} from "@/app/admin/anfragen/[id]/angebot/[angebotId]/editor-model";
import {
  betragZeile,
  steuerZeile,
} from "@/app/admin/anfragen/[id]/angebot-format";
import {
  angebotAusAnfrage,
  berechneSummen,
  parseAngebotInhalt,
  standardEinleitung,
  standardTitel,
  ustHinweis,
} from "@/lib/admin/angebote";

// So, 1.11.2026, 12:00 in Hamburg
const NOW = new Date("2026-11-01T11:00:00Z");

function inhalt(): AngebotInhalt {
  return angebotAusAnfrage(
    {
      fields: [
        ["Name", "Jana Petersen"],
        ["Firma", "Pflegedienst Elbblick"],
        ["E-Mail", "jana@example.de"],
        ["Paket-Wunsch", "Business"],
      ],
      reply_to: "jana@example.de",
    },
    { now: NOW },
  );
}

const MONATSBEITRAG = "Der Monatsbeitrag beginnt mit dem Livegang.";

describe("Editor-Modell: Formular und Speichern", () => {
  it("Felder als Text, Speichern ergibt wieder denselben Inhalt", () => {
    const i = inhalt();
    const f = formAus(i);
    assert.deepEqual(
      f.zeilen.map((z) => [z.menge, z.preis, z.art]),
      [
        ["1", "899", "einmalig"],
        ["1", "79", "monatlich"],
      ],
    );
    const parsed = parseAngebotInhalt(payloadAus(f));
    assert.ok(parsed.ok);
    assert.deepEqual(parsed.inhalt, i);
  });

  it("versteht Preise wie „1.299,50“ und „1299.5“; leere neue Zeilen fallen beim Speichern weg", () => {
    const s = aendern(stateAus(inhalt()), (f) => ({
      ...f,
      zeilen: [
        ...f.zeilen,
        {
          id: "p-neu1",
          titel: "Logo",
          beschreibung: "",
          menge: "2",
          preis: "1299.5",
          art: "einmalig",
        },
        {
          id: "p-leer",
          titel: "",
          beschreibung: "",
          menge: "1",
          preis: "",
          art: "einmalig",
        },
      ],
    }));
    const parsed = parseAngebotInhalt(payloadAus(s.form));
    assert.ok(parsed.ok);
    assert.equal(parsed.inhalt.positionen.length, 3);
    assert.equal(parsed.inhalt.positionen[2].preis_cent, 129950);
    assert.equal(parsed.inhalt.positionen[2].menge, 2);
    assert.equal(zeileNetto(s.form.zeilen[2]), 259900);
  });

  it("formKey erkennt Änderungen, nicht aber gleiche Inhalte", () => {
    const a = formAus(inhalt());
    const b = formAus(inhalt());
    assert.equal(formKey(a), formKey(b));
    assert.notEqual(formKey(a), formKey({ ...b, titel: `${b.titel}!` }));
  });

  it("Menge und Preis: Grenzen wie beim Speichern", () => {
    assert.equal(mengeZahl("3"), 3);
    assert.equal(mengeZahl("0"), null);
    assert.equal(mengeZahl("1000"), null);
    assert.equal(mengeZahl(""), null);
    assert.equal(preisCent("1.299,50"), 129950);
    assert.equal(preisCent("1.000.001"), null);
    assert.equal(preisCent("abc"), null);
  });

  it("Live-Summen zählen nur gültige Zeilen", () => {
    const s = aendern(stateAus(inhalt()), (f) => ({
      ...f,
      zeilen: [
        ...f.zeilen,
        {
          id: "p-x",
          titel: "Fotos",
          beschreibung: "",
          menge: "1",
          preis: "1,2,3",
          art: "einmalig",
        },
      ],
    }));
    const summen = summenAus(s.form);
    assert.deepEqual(summen, berechneSummen(inhalt().positionen, 19));
    assert.equal(summen.einmalig.netto, 89900);
    assert.equal(summen.monatlich.brutto, 9401);
  });
});

describe("Editor-Modell: Paket wählen", () => {
  it("tauscht nur die Paket-Zeilen, eigene bleiben samt Text", () => {
    const start = aendern(stateAus(inhalt()), (f) => ({
      ...f,
      zeilen: [
        f.zeilen[0],
        {
          id: "p-eigen",
          titel: "Texte schreiben",
          beschreibung: "",
          menge: "1",
          preis: "250,",
          art: "einmalig",
        },
        f.zeilen[1],
      ],
    }));
    const next = aendern(start, (f) => paketWaehlen(f, "premium"));
    assert.deepEqual(
      next.form.zeilen.map((z) => z.id),
      ["paket-premium-einmalig", "p-eigen", "paket-premium-monatlich"],
    );
    assert.equal(next.form.zeilen[0].preis, "2.499");
    assert.equal(next.form.zeilen[2].preis, "179");
    // Eigene Zeile unverändert, auch mit halb getipptem Preis.
    assert.equal(next.form.zeilen[1].preis, "250,");
    assert.equal(paketAus(next.form), "premium");
  });

  it("dasselbe Paket noch einmal lässt angepasste Preise stehen", () => {
    const s = aendern(stateAus(inhalt()), (f) => ({
      ...f,
      zeilen: f.zeilen.map((z, i) => (i === 0 ? { ...z, preis: "799" } : z)),
    }));
    const f2 = paketWaehlen(s.form, "business");
    assert.equal(f2, s.form);
    assert.equal(f2.zeilen[0].preis, "799");
  });

  it("passt die Dauer im Ablauf-Satz an das neue Paket an", () => {
    const s = stateAus(inhalt());
    assert.match(s.form.hinweise, /5–10 Werktage|5-10 Werktage/);
    const next = aendern(s, (f) => paketWaehlen(f, "premium"));
    assert.doesNotMatch(next.form.hinweise, /5–10 Werktage|5-10 Werktage/);
    assert.equal(next.kontext.paket, "premium");
  });
});

describe("Editor-Modell: Standardtexte bleiben passend", () => {
  it("Umsatzsteuer 0 tauscht den USt-Satz in den Hinweisen", () => {
    const s = stateAus(inhalt());
    assert.ok(s.form.hinweise.includes(ustHinweis(19)));
    const next = aendern(s, (f) => ({ ...f, ust_satz: 0 }));
    assert.ok(next.form.hinweise.includes(ustHinweis(0)));
    assert.ok(!next.form.hinweise.includes(ustHinweis(19)));
  });

  it("Monatsbeitrag-Satz verschwindet ohne monatliche Position und kommt wieder", () => {
    const s = stateAus(inhalt());
    assert.ok(s.form.hinweise.includes(MONATSBEITRAG));
    const ohne = aendern(s, (f) => ({
      ...f,
      zeilen: f.zeilen.filter((z) => z.art !== "monatlich"),
    }));
    assert.ok(!ohne.form.hinweise.includes(MONATSBEITRAG));
    assert.doesNotMatch(ohne.form.hinweise, /\n\n\n/);
    const wieder = aendern(ohne, (f) => ({
      ...f,
      zeilen: [
        ...f.zeilen,
        {
          id: "p-m",
          titel: "Pflege",
          beschreibung: "",
          menge: "1",
          preis: "30",
          art: "monatlich",
        },
      ],
    }));
    assert.ok(wieder.form.hinweise.includes(MONATSBEITRAG));
  });

  it("Gültig bis: ein kurz leeres Datumsfeld hinterlässt keinen kaputten Satz", () => {
    const s = stateAus(inhalt());
    assert.ok(
      s.form.hinweise.includes("Dieses Angebot gilt bis zum 1. Dezember 2026."),
    );
    const leer = aendern(s, (f) => ({ ...f, gueltig_bis: "" }));
    assert.equal(leer.form.hinweise, s.form.hinweise);
    const neu = aendern(leer, (f) => ({ ...f, gueltig_bis: "2026-12-15" }));
    assert.ok(
      neu.form.hinweise.includes(
        "Dieses Angebot gilt bis zum 15. Dezember 2026.",
      ),
    );
    assert.ok(!neu.form.hinweise.includes("1. Dezember 2026"));
  });

  it("eigene Sätze in den Hinweisen bleiben stehen", () => {
    const s = aendern(stateAus(inhalt()), (f) => ({
      ...f,
      hinweise: `${f.hinweise}\n\nFotos macht der Kunde selbst.`,
    }));
    const next = aendern(s, (f) => ({ ...f, ust_satz: 0 }));
    assert.ok(next.form.hinweise.endsWith("Fotos macht der Kunde selbst."));
  });

  it("Titel und Einleitung folgen Name und Firma, solange sie Standard sind", () => {
    const s = stateAus(inhalt());
    const next = aendern(s, (f) => ({
      ...f,
      kunde_firma: "Pflege Elbblick GmbH",
    }));
    assert.equal(
      next.form.titel,
      standardTitel("Jana Petersen", "Pflege Elbblick GmbH"),
    );
    assert.equal(
      next.form.einleitung,
      standardEinleitung("Jana Petersen", "Pflege Elbblick GmbH"),
    );

    const eigen = aendern(s, (f) => ({ ...f, titel: "Relaunch der Website" }));
    const danach = aendern(eigen, (f) => ({ ...f, kunde_name: "Jana P." }));
    assert.equal(danach.form.titel, "Relaunch der Website");
    assert.equal(
      danach.form.einleitung,
      standardEinleitung("Jana P.", "Pflegedienst Elbblick"),
    );
  });
});

describe("Editor-Modell: Entwurf aus dem Sitzungsspeicher", () => {
  it("übernimmt einen gespeicherten Zustand", () => {
    const s = aendern(stateAus(inhalt()), (f) => ({ ...f, titel: "Neu" }));
    const back = stateAusEntwurf(JSON.parse(JSON.stringify(s)));
    assert.ok(back);
    assert.equal(formKey(back.form), formKey(s.form));
    assert.deepEqual(back.kontext, s.kontext);
  });

  it("verwirft fremde oder kaputte Daten", () => {
    const s: EditorState = stateAus(inhalt());
    assert.equal(stateAusEntwurf(null), null);
    assert.equal(stateAusEntwurf("x"), null);
    assert.equal(stateAusEntwurf({ form: s.form }), null);
    assert.equal(
      stateAusEntwurf({ form: { ...s.form, ust_satz: 7 }, kontext: s.kontext }),
      null,
    );
    assert.equal(
      stateAusEntwurf({
        form: { ...s.form, zeilen: [{ ...s.form.zeilen[0], art: "jährlich" }] },
        kontext: s.kontext,
      }),
      null,
    );
    assert.equal(
      stateAusEntwurf({ form: { ...s.form, titel: 3 }, kontext: s.kontext }),
      null,
    );
  });
});

describe("Angebots-Zeilen im Admin", () => {
  it("Betrag und Steuer kurz", () => {
    // formatEuro setzt ein geschütztes Leerzeichen vor €.
    assert.equal(
      betragZeile(berechneSummen(inhalt().positionen, 19)),
      "899,00\u00a0€ einmalig · 79,00\u00a0€ monatlich",
    );
    assert.equal(betragZeile(berechneSummen([], 19)), "Noch ohne Betrag");
    assert.equal(steuerZeile(19), "netto, zzgl. 19 % USt");
    assert.equal(steuerZeile(0), "ohne USt (§ 19 UStG)");
  });
});
