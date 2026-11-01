import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { Angebot, AngebotPosition } from "@/lib/admin/angebote";

import {
  ANGEBOT_GRENZEN,
  ANGEBOT_PUBLIC_COLUMNS,
  angebotAusAnfrage,
  angebotAusZeile,
  angebotEventText,
  angebotHinweis,
  angebotRohAusFormData,
  angeboteNachAnfrage,
  angebotUrl,
  base64Url,
  berechneSummen,
  centAusPreistext,
  centZuEingabe,
  darfWechseln,
  editorPfad,
  erzeugeToken,
  formatDatumLang,
  formatEuro,
  formatZeitpunkt,
  hinweisKontext,
  honeypotLeer,
  inhaberBenachrichtigung,
  kundenBestaetigung,
  istAbgelaufen,
  istBearbeitbar,
  kannAnnehmen,
  kundenAnsicht,
  kundenMail,
  kundenMailHref,
  leerePosition,
  neuePositionId,
  oeffentlicheSicht,
  paketAusAnfrage,
  paketAusPositionen,
  paketPositionen,
  paketSlugAus,
  paketWechseln,
  parseAblehnGrund,
  parseAngebotInhalt,
  parseAnnahmeName,
  parseDatum,
  parseEuroEingabe,
  parseToken,
  parseUstSatz,
  parseZeitstempel,
  preisSatz,
  sendeProbleme,
  standardHinweise,
  statusZeile,
  syncHinweise,
  teilenDaten,
  ustSatzAusUmgebung,
} from "@/lib/admin/angebote";
import { eventText } from "@/lib/admin/timeline";
import { PAKETE } from "@/lib/pakete-data";
import { PACKAGE_LABELS } from "@/lib/validations/inquiries";

import { makeLead } from "@/tests/helpers";

// So, 1.11.2026, 11:00 in Hamburg
const NOW = new Date("2026-11-01T10:00:00Z");

const lead = makeLead({
  reply_to: "jana.petersen@example.de",
  fields: [
    ["Name", "Jana Petersen"],
    ["E-Mail", "jana.petersen@example.de"],
    ["Telefon", "040 123"],
    ["Firma", "Pflegedienst Elbblick"],
    ["Paket-Wunsch", "Premium-System"],
  ],
});

function angebot(partial: Partial<Angebot> = {}): Angebot {
  const inhalt = angebotAusAnfrage(lead, { now: NOW });
  return {
    id: "a1",
    lead_id: lead.id,
    nummer: "A-2026-0001",
    token: "T".repeat(43),
    status: "entwurf",
    created_at: "2026-11-01T10:00:00.000Z",
    updated_at: "2026-11-01T10:00:00.000Z",
    sent_at: null,
    first_viewed_at: null,
    accepted_at: null,
    declined_at: null,
    angenommen_von: null,
    abgelehnt_grund: null,
    ...inhalt,
    ...partial,
  };
}

const pos = (p: Partial<AngebotPosition>): AngebotPosition => ({
  id: "p-x",
  titel: "Extra",
  beschreibung: "",
  menge: 1,
  preis_cent: 0,
  art: "einmalig",
  ...p,
});

describe("Pakete", () => {
  it("bildet die Formular-Labels, Namen und Slugs ab; „Empfehlung gewünscht“ ergibt keins", () => {
    assert.equal(paketSlugAus(PACKAGE_LABELS.starter), "starter");
    assert.equal(paketSlugAus(PACKAGE_LABELS.business), "business");
    assert.equal(paketSlugAus(PACKAGE_LABELS.premium), "premium");
    assert.equal(paketSlugAus(PACKAGE_LABELS.studio), "studio");
    assert.equal(paketSlugAus(PACKAGE_LABELS.unsicher), null);
    assert.equal(paketSlugAus("Premium"), "premium");
    assert.equal(paketSlugAus("  sitalo   studio "), "studio");
    assert.equal(paketSlugAus("business"), "business");
    assert.equal(paketSlugAus("Paket Starter (ab 499 €)"), "starter");
    assert.equal(paketSlugAus("Etwas ganz anderes"), null);
    assert.equal(paketSlugAus(undefined), null);
  });

  it("Paket aus „Paket“ vor „Paket-Wunsch“, sonst Business", () => {
    assert.equal(paketAusAnfrage(lead), "premium");
    assert.equal(
      paketAusAnfrage({
        fields: [
          ["Paket", "Starter"],
          ["Paket-Wunsch", "Premium-System"],
        ],
      }),
      "starter",
    );
    assert.equal(
      paketAusAnfrage({ fields: [["Paket-Wunsch", "Empfehlung gewünscht"]] }),
      "business",
    );
    assert.equal(paketAusAnfrage({ fields: [] }), "business");
  });

  it("Preise kommen ausschließlich aus lib/pakete-data.ts", () => {
    const erwartet = {
      starter: [49900, 4900],
      business: [89900, 7900],
      premium: [249900, 17900],
      studio: [349000, 24900],
    };
    for (const p of PAKETE) {
      const [einmalig, monatlich] = paketPositionen(p.slug);
      assert.deepEqual(
        [einmalig.preis_cent, monatlich.preis_cent],
        erwartet[p.slug],
      );
      assert.equal(einmalig.preis_cent, centAusPreistext(p.setup));
      assert.equal(einmalig.titel, `Website-Paket ${p.name}`);
      assert.equal(einmalig.art, "einmalig");
      assert.equal(einmalig.id, `paket-${p.slug}-einmalig`);
      assert.equal(
        monatlich.titel,
        `Monatsbeitrag ${p.name}: Hosting, Updates, kleine Änderungen`,
      );
      assert.equal(monatlich.art, "monatlich");
      assert.ok(einmalig.beschreibung.includes(" · "));
      assert.ok(!/hosting|kleine änderung/i.test(einmalig.beschreibung));
      assert.ok(monatlich.beschreibung.includes("Hosting in der EU"));
      assert.ok(
        einmalig.beschreibung.length <= ANGEBOT_GRENZEN.positionBeschreibung,
      );
    }
    assert.equal(centAusPreistext("ab 2.499 €"), 249900);
    assert.equal(centAusPreistext("ab 49 € / Monat"), 4900);
  });

  it("Paketwechsel ersetzt nur die Paket-Positionen an ihrer Stelle", () => {
    const eigene = pos({
      id: "p-eigen",
      titel: "Logo-Anpassung",
      preis_cent: 15000,
    });
    const start = [...paketPositionen("business"), eigene];
    const next = paketWechseln(start, "studio");
    assert.deepEqual(
      next.map((p) => p.id),
      ["paket-studio-einmalig", "paket-studio-monatlich", "p-eigen"],
    );
    assert.equal(next[2], eigene);
    assert.equal(paketAusPositionen(next), "studio");

    // Eigene Position vorn, Monatsbeitrag entfernt: bleibt so.
    const ohneMonat = [eigene, paketPositionen("business")[0]];
    assert.deepEqual(
      paketWechseln(ohneMonat, "starter").map((p) => p.id),
      ["p-eigen", "paket-starter-einmalig"],
    );

    // Gar keine Paket-Position: beide nach vorn.
    assert.deepEqual(
      paketWechseln([eigene], "premium").map((p) => p.id),
      ["paket-premium-einmalig", "paket-premium-monatlich", "p-eigen"],
    );
    assert.equal(paketAusPositionen([eigene]), null);
  });
});

describe("angebotAusAnfrage", () => {
  it("Standard-Angebot mit Kunde, zwei Paket-Positionen, Texten und 30 Tagen Gültigkeit", () => {
    const a = angebotAusAnfrage(lead, { now: NOW });
    assert.equal(a.kunde_name, "Jana Petersen");
    assert.equal(a.kunde_firma, "Pflegedienst Elbblick");
    assert.equal(a.kunde_email, "jana.petersen@example.de");
    assert.equal(a.titel, "Angebot: Website für Pflegedienst Elbblick");
    assert.ok(a.einleitung.startsWith("Guten Tag Jana Petersen,\n\n"));
    assert.ok(a.einleitung.includes("Sie"));
    assert.ok(!/Herr|Frau/.test(a.einleitung));
    assert.deepEqual(
      a.positionen.map((p) => p.id),
      ["paket-premium-einmalig", "paket-premium-monatlich"],
    );
    assert.equal(a.ust_satz, 19);
    assert.equal(a.gueltig_bis, "2026-12-01");
    for (const teil of [
      "Festpreise",
      "Test-Link",
      "meist 2–3 Wochen ab vollständigen Unterlagen",
      "Der Monatsbeitrag beginnt mit dem Livegang",
      "Mindestlaufzeit 6 Monate, danach monatlich kündbar",
      "netto zuzüglich 19 % Umsatzsteuer",
      "gilt bis zum 1. Dezember 2026",
    ])
      assert.ok(a.hinweise.includes(teil), teil);
    // Erfüllt die eigene Prüfung bis auf nichts.
    assert.deepEqual(parseAngebotInhalt(a), { ok: true, inhalt: a });
  });

  it("Gültig bis zählt ab dem Hamburger Kalendertag", () => {
    // 31.10. 23:30 UTC ist in Hamburg schon der 1.11.
    const a = angebotAusAnfrage(lead, {
      now: new Date("2026-10-31T23:30:00Z"),
    });
    assert.equal(a.gueltig_bis, "2026-12-01");
  });

  it("ohne Name und Firma: neutrale Anrede und Titel; unsichere Adresse fällt weg", () => {
    const a = angebotAusAnfrage(
      {
        reply_to: "ute@firma.de?bcc=fremd@evil.de",
        fields: [["Nachricht", "Hallo"]],
      },
      { now: NOW, ustSatz: 0, paket: "starter" },
    );
    assert.equal(a.kunde_name, "");
    assert.equal(a.kunde_firma, null);
    assert.equal(a.kunde_email, null);
    assert.equal(a.titel, "Angebot: Ihre neue Website");
    assert.ok(a.einleitung.startsWith("Guten Tag,\n\n"));
    assert.ok(a.einleitung.includes("für Ihre neue Website"));
    assert.ok(
      a.hinweise.includes("Gemäß § 19 UStG wird keine Umsatzsteuer berechnet."),
    );
    assert.ok(!a.hinweise.includes("19 %"));
    assert.ok(a.hinweise.includes("oft 1–2 Werktage"));
  });

  it("E-Mail aus reply_to, wenn das Feld fehlt; Name als Titel ohne Firma", () => {
    const a = angebotAusAnfrage(
      {
        reply_to: "lars@tischlerei-wendt.de",
        fields: [["Name", "Lars Wendt"]],
      },
      { now: NOW },
    );
    assert.equal(a.kunde_email, "lars@tischlerei-wendt.de");
    assert.equal(a.titel, "Angebot: Website für Lars Wendt");
    assert.equal(paketAusPositionen(a.positionen), "business");
  });

  it("USt-Standard aus ANGEBOT_UST_SATZ: nur '0' ergibt 0", () => {
    assert.equal(ustSatzAusUmgebung("0"), 0);
    assert.equal(ustSatzAusUmgebung(" 0 "), 0);
    assert.equal(ustSatzAusUmgebung("19"), 19);
    assert.equal(ustSatzAusUmgebung(undefined), 19);
    assert.equal(ustSatzAusUmgebung("7"), 19);
  });
});

describe("Hinweise synchron halten", () => {
  const a = angebotAusAnfrage(lead, { now: NOW });
  const k = hinweisKontext(a);

  it("ersetzt Datum, Steuersatz und Dauer, wenn sie noch wortgleich dastehen", () => {
    const text = syncHinweise(a.hinweise, k, {
      ...k,
      gueltig_bis: "2026-12-24",
      ust_satz: 0,
      paket: "starter",
    });
    assert.ok(text.includes("gilt bis zum 24. Dezember 2026"));
    assert.ok(!text.includes("1. Dezember 2026"));
    assert.ok(text.includes("§ 19 UStG"));
    assert.ok(text.includes("oft 1–2 Werktage"));
    assert.equal(
      text,
      standardHinweise({
        ...k,
        gueltig_bis: "2026-12-24",
        ust_satz: 0,
        paket: "starter",
      }),
    );
  });

  it("entfernt den Monatsbeitrag-Absatz und fügt ihn wieder an seiner Stelle ein", () => {
    const ohne = syncHinweise(a.hinweise, k, { ...k, monatlich: false });
    assert.ok(!ohne.includes("Monatsbeitrag"));
    assert.ok(!ohne.includes("\n\n\n"));
    const wieder = syncHinweise(ohne, { ...k, monatlich: false }, k);
    assert.equal(wieder, a.hinweise);
  });

  it("lässt eigenen Text in Ruhe", () => {
    const eigen =
      "Zahlung: 50 % bei Auftrag.\n\nDieses Angebot gilt bis zum 1. Dezember 2026.";
    assert.equal(
      syncHinweise(eigen, k, { ...k, gueltig_bis: "2026-12-10" }),
      "Zahlung: 50 % bei Auftrag.\n\nDieses Angebot gilt bis zum 10. Dezember 2026.",
    );
    assert.equal(
      syncHinweise("Nur Eigenes.", k, { ...k, monatlich: false }),
      "Nur Eigenes.",
    );
    assert.equal(syncHinweise("", { ...k, monatlich: false }, k), "");
    assert.equal(syncHinweise(a.hinweise, k, k), a.hinweise);
  });
});

describe("Beträge", () => {
  it("formatEuro: de-DE mit geschütztem Leerzeichen vor €", () => {
    assert.equal(formatEuro(0), "0,00 €");
    assert.equal(formatEuro(5), "0,05 €");
    assert.equal(formatEuro(89900), "899,00 €");
    assert.equal(formatEuro(129950), "1.299,50 €");
    assert.equal(formatEuro(100_000_000), "1.000.000,00 €");
    assert.equal(formatEuro(-1050), "-10,50 €");
  });

  it("parseEuroEingabe: deutsche und englische Schreibweise", () => {
    const ok: [string, number][] = [
      ["1.299,50", 129950],
      ["1299.5", 129950],
      ["1299,5", 129950],
      ["1299,50 €", 129950],
      ["1.299", 129900],
      ["2.499", 249900],
      ["1.000.000", 100_000_000],
      ["1,299.50", 129950],
      ["899", 89900],
      [" 899 € ", 89900],
      ["0", 0],
      ["0,99", 99],
      [",5", 50],
      ["12.5", 1250],
      ["1299,", 129900],
    ];
    for (const [input, cent] of ok)
      assert.equal(parseEuroEingabe(input), cent, input);
    for (const bad of [
      "",
      " ",
      "€",
      "abc",
      "-5",
      "1,2,3",
      "1.2.3",
      "12,3456",
      "1.299.5",
      "1,299,50",
      "1e3",
      "1.299,50,1",
      // Komma ist das Dezimalzeichen: drei Nachkommastellen sind ein
      // Tippfehler, kein Tausenderbetrag (sonst 1.000-facher Preis).
      "1,299",
      "0,499",
      "12,345",
      "1,000,000",
      "0.499",
      "0.499,50",
    ])
      assert.equal(parseEuroEingabe(bad), null, bad);
    assert.equal(parseEuroEingabe(12 as unknown), null);
  });

  it("centZuEingabe ist umkehrbar", () => {
    for (const cent of [0, 50, 89900, 129950, 249900, 100_000_000, 12345678]) {
      assert.equal(parseEuroEingabe(centZuEingabe(cent)), cent, String(cent));
    }
    assert.equal(centZuEingabe(129950), "1.299,50");
    assert.equal(centZuEingabe(89900), "899");
  });

  it("Summen getrennt nach einmalig und monatlich, USt je Summe gerundet", () => {
    const positionen = [
      pos({ menge: 1, preis_cent: 89900 }),
      pos({ menge: 3, preis_cent: 3333 }),
      pos({ art: "monatlich", preis_cent: 7900 }),
    ];
    const s = berechneSummen(positionen, 19);
    assert.deepEqual(s.einmalig, { netto: 99899, ust: 18981, brutto: 118880 });
    assert.deepEqual(s.monatlich, { netto: 7900, ust: 1501, brutto: 9401 });
    const k = berechneSummen(positionen, 0);
    assert.deepEqual(k.einmalig, { netto: 99899, ust: 0, brutto: 99899 });
    assert.equal(k.ust_satz, 0);
    assert.deepEqual(berechneSummen([], 19).einmalig, {
      netto: 0,
      ust: 0,
      brutto: 0,
    });
  });

  it("preisSatz", () => {
    const beide = berechneSummen(paketPositionen("business"), 19);
    assert.equal(
      preisSatz(beide),
      "899,00 € einmalig und 79,00 € im Monat, jeweils zuzüglich 19 % Umsatzsteuer",
    );
    assert.equal(
      preisSatz(berechneSummen([paketPositionen("starter")[0]], 0)),
      "499,00 € einmalig, ohne Umsatzsteuer (§ 19 UStG)",
    );
    assert.equal(preisSatz(berechneSummen([], 19)), "");
  });
});

describe("parseAngebotInhalt", () => {
  const gueltig = () => {
    const a = angebotAusAnfrage(lead, { now: NOW });
    return { ...a, ust_satz: "19", positionen: JSON.stringify(a.positionen) };
  };

  it("nimmt Formularwerte (Text, JSON) an und normalisiert", () => {
    const raw = {
      ...gueltig(),
      kunde_name: "  Jana \n Petersen ",
      kunde_firma: "   ",
      kunde_email: " Info@Bäckerei-Müller.de ",
      einleitung: "Hallo\r\nWelt  ",
      positionen: [
        {
          id: "p-1",
          titel: " Logo ",
          beschreibung: "",
          menge: "2",
          preis: "1.299,50",
          art: "einmalig",
        },
        {
          id: "p-2",
          titel: "",
          beschreibung: "",
          preis: "",
          menge: 1,
          art: "einmalig",
        }, // leer → weg
        {
          id: "p-1",
          titel: "Doppelte ID",
          beschreibung: "x",
          menge: 1,
          preis_cent: 500,
          art: "monatlich",
        },
      ],
    };
    const r = parseAngebotInhalt(raw);
    assert.ok(r.ok, JSON.stringify(!r.ok && r.fehler));
    if (!r.ok) return;
    assert.equal(r.inhalt.kunde_name, "Jana Petersen");
    assert.equal(r.inhalt.kunde_firma, null);
    assert.match(
      r.inhalt.kunde_email ?? "",
      /^Info@xn--bckerei-mller-[a-z0-9]+\.de$/,
    );
    assert.equal(r.inhalt.einleitung, "Hallo\nWelt");
    assert.equal(r.inhalt.ust_satz, 19);
    assert.equal(r.inhalt.positionen.length, 2);
    assert.deepEqual(
      { ...r.inhalt.positionen[0] },
      {
        id: "p-1",
        titel: "Logo",
        beschreibung: "",
        menge: 2,
        preis_cent: 129950,
        art: "einmalig",
      },
    );
    assert.notEqual(r.inhalt.positionen[1].id, "p-1");
    assert.match(r.inhalt.positionen[1].id, /^p-[A-Za-z0-9_-]{12}$/);
  });

  it("meldet Fehler je Feld (Positionen mit ihrem Index)", () => {
    const r = parseAngebotInhalt({
      ...gueltig(),
      kunde_name: "",
      titel: "x".repeat(161),
      kunde_email: "kunde@firma.de?bcc=fremd@evil.de",
      gueltig_bis: "2026-02-30",
      ust_satz: "7",
      einleitung: "x".repeat(2001),
      positionen: [
        { id: "a", titel: "Gut", menge: 1, preis_cent: 100, art: "einmalig" },
        {
          id: "b",
          titel: "",
          beschreibung: "nur Text",
          menge: 0,
          preis: "1.000.000,01",
          art: "jährlich",
        },
      ],
    });
    assert.equal(r.ok, false);
    if (r.ok) return;
    assert.deepEqual(Object.keys(r.fehler).sort(), [
      "einleitung",
      "gueltig_bis",
      "kunde_email",
      "kunde_name",
      "positionen.1.art",
      "positionen.1.menge",
      "positionen.1.preis_cent",
      "positionen.1.titel",
      "titel",
      "ust_satz",
    ]);
    assert.equal(r.fehler.kunde_name, "Name fehlt.");
    assert.equal(r.fehler.titel, "Höchstens 160 Zeichen.");
    assert.equal(r.fehler.einleitung, "Höchstens 2.000 Zeichen.");
    assert.equal(r.fehler["positionen.1.menge"], "Menge: 1 bis 999.");
  });

  it("Grenzen: Menge 1–999, Betrag 0 bis 1.000.000 €, höchstens 30 Positionen", () => {
    const one = (p: Record<string, unknown>) =>
      parseAngebotInhalt({
        ...gueltig(),
        positionen: [
          {
            id: "a",
            titel: "T",
            art: "einmalig",
            menge: 1,
            preis_cent: 0,
            ...p,
          },
        ],
      });
    assert.ok(one({ menge: 999, preis_cent: 100_000_000 }).ok);
    assert.ok(!one({ menge: 1000 }).ok);
    assert.ok(!one({ menge: 1.5 }).ok);
    assert.ok(!one({ preis_cent: 100_000_001 }).ok);
    assert.ok(!one({ preis_cent: -1 }).ok);
    assert.ok(!one({ preis_cent: 12.5 }).ok);
    assert.ok(one({ preis_cent: "0" }).ok);
    const viele = Array.from({ length: 31 }, (_, i) => ({
      id: `p${i}`,
      titel: `P${i}`,
      menge: 1,
      preis_cent: 1,
      art: "einmalig",
    }));
    const r = parseAngebotInhalt({ ...gueltig(), positionen: viele });
    assert.equal(r.ok, false);
    if (!r.ok) assert.equal(r.fehler.positionen, "Höchstens 30 Positionen.");
    assert.ok(
      parseAngebotInhalt({ ...gueltig(), positionen: viele.slice(0, 30) }).ok,
    );
  });

  it("Keine Positionen sind beim Speichern erlaubt (erst beim Senden nicht)", () => {
    const r = parseAngebotInhalt({ ...gueltig(), positionen: "[]" });
    assert.ok(r.ok);
    const kaputt = parseAngebotInhalt({
      ...gueltig(),
      positionen: "{kein json",
    });
    assert.equal(kaputt.ok, false);
    assert.ok(!parseAngebotInhalt(null).ok);
    assert.ok(!parseAngebotInhalt({ ...gueltig(), kunde_name: 5 }).ok);
  });

  it("angebotRohAusFormData liest das Editor-Formular", () => {
    const a = angebotAusAnfrage(lead, { now: NOW });
    const fd = new FormData();
    fd.set("kunde_name", a.kunde_name);
    fd.set("kunde_firma", a.kunde_firma ?? "");
    fd.set("kunde_email", a.kunde_email ?? "");
    fd.set("titel", a.titel);
    fd.set("einleitung", a.einleitung);
    fd.set("hinweise", a.hinweise);
    fd.set("gueltig_bis", a.gueltig_bis);
    fd.set("ust_satz", "19");
    fd.set("positionen", JSON.stringify(a.positionen));
    fd.set("fremd", "wird ignoriert");
    const raw = angebotRohAusFormData(fd);
    assert.ok(!("fremd" in raw));
    assert.deepEqual(parseAngebotInhalt(raw), { ok: true, inhalt: a });
  });

  it("Einzelprüfungen", () => {
    assert.equal(parseUstSatz("0"), 0);
    assert.equal(parseUstSatz(19), 19);
    assert.equal(parseUstSatz("19 %"), null);
    assert.equal(parseDatum("2026-12-01"), "2026-12-01");
    assert.equal(parseDatum("2026-13-01"), null);
    assert.equal(parseDatum("2019-12-01"), null);
    assert.equal(
      parseZeitstempel("2026-11-01T10:00:00.123456+00:00"),
      "2026-11-01T10:00:00.123456+00:00",
    );
    assert.equal(
      parseZeitstempel("2026-11-01T10:00:00.000Z"),
      "2026-11-01T10:00:00.000Z",
    );
    assert.equal(parseZeitstempel("gestern"), null);
    assert.equal(parseAnnahmeName("  Jana   Petersen "), "Jana Petersen");
    assert.equal(parseAnnahmeName("J"), null);
    assert.equal(parseAnnahmeName("x".repeat(121)), null);
    assert.equal(parseAnnahmeName(undefined), null);
    assert.deepEqual(parseAblehnGrund(""), { grund: null });
    assert.deepEqual(parseAblehnGrund(undefined), { grund: null });
    assert.deepEqual(parseAblehnGrund(" Zu teuer \r\n"), { grund: "Zu teuer" });
    assert.equal(parseAblehnGrund("x".repeat(501)), null);
    assert.equal(parseAblehnGrund(5), null);
    assert.ok(honeypotLeer(""));
    assert.ok(honeypotLeer(null));
    assert.ok(!honeypotLeer("http://spam"));
  });
});

describe("Token und IDs", () => {
  it("Token: 43 Zeichen base64url, jedes Mal anders", () => {
    const seen = new Set<string>();
    for (let i = 0; i < 200; i++) {
      const t = erzeugeToken();
      assert.match(t, /^[A-Za-z0-9_-]{43}$/);
      assert.equal(parseToken(t), t);
      seen.add(t);
    }
    assert.equal(seen.size, 200);
  });

  it("base64Url entspricht Buffer#toString('base64url')", () => {
    for (let n = 0; n < 40; n++) {
      const bytes = new Uint8Array(n);
      globalThis.crypto.getRandomValues(bytes);
      assert.equal(base64Url(bytes), Buffer.from(bytes).toString("base64url"));
    }
  });

  it("parseToken lehnt alles andere ab", () => {
    for (const bad of [
      undefined,
      "",
      "kurz",
      "a".repeat(31),
      "a".repeat(129),
      `${"a".repeat(42)}/`,
      `${"a".repeat(42)}=`,
      5,
    ])
      assert.equal(parseToken(bad), null);
  });

  it("Positions-IDs", () => {
    assert.match(neuePositionId(), /^p-[A-Za-z0-9_-]{12}$/);
    assert.notEqual(neuePositionId(), neuePositionId());
    const leer = leerePosition("monatlich");
    assert.equal(leer.art, "monatlich");
    assert.equal(leer.menge, 1);
    assert.equal(leer.preis_cent, 0);
  });
});

describe("Status", () => {
  it("Übergänge", () => {
    assert.ok(darfWechseln("entwurf", "gesendet"));
    assert.ok(darfWechseln("gesendet", "gesendet"));
    assert.ok(darfWechseln("gesendet", "angenommen"));
    assert.ok(darfWechseln("gesendet", "abgelehnt"));
    assert.ok(darfWechseln("gesendet", "zurueckgezogen"));
    assert.ok(!darfWechseln("entwurf", "angenommen"));
    assert.ok(!darfWechseln("entwurf", "zurueckgezogen"));
    assert.ok(!darfWechseln("angenommen", "gesendet"));
    assert.ok(!darfWechseln("zurueckgezogen", "gesendet"));
    assert.ok(!darfWechseln("abgelehnt", "angenommen"));
    assert.ok(istBearbeitbar("entwurf"));
    assert.ok(istBearbeitbar("gesendet"));
    assert.ok(!istBearbeitbar("angenommen"));
    assert.ok(!istBearbeitbar("abgelehnt"));
    assert.ok(!istBearbeitbar("zurueckgezogen"));
  });

  it("gültig bis einschließlich (Hamburger Tag)", () => {
    // 1.12. 23:30 in Hamburg: noch gültig; 2.12. 00:30: abgelaufen.
    assert.ok(!istAbgelaufen("2026-12-01", new Date("2026-12-01T22:30:00Z")));
    assert.ok(istAbgelaufen("2026-12-01", new Date("2026-12-01T23:30:00Z")));
  });

  it("Kundenansicht", () => {
    const a = angebot({ status: "gesendet" });
    assert.equal(kundenAnsicht(a, NOW), "offen");
    assert.ok(kannAnnehmen(a, NOW));
    assert.equal(
      kundenAnsicht(a, new Date("2026-12-02T10:00:00Z")),
      "abgelaufen",
    );
    assert.ok(!kannAnnehmen(a, new Date("2026-12-02T10:00:00Z")));
    for (const s of [
      "entwurf",
      "angenommen",
      "abgelehnt",
      "zurueckgezogen",
    ] as const) {
      assert.equal(kundenAnsicht({ ...a, status: s }, NOW), s);
      assert.ok(!kannAnnehmen({ ...a, status: s }, NOW));
    }
  });

  it("sendeProbleme", () => {
    assert.deepEqual(sendeProbleme(angebot(), NOW), []);
    assert.deepEqual(sendeProbleme(angebot({ status: "gesendet" }), NOW), []);
    assert.deepEqual(
      sendeProbleme(
        angebot({ kunde_name: " ", positionen: [], gueltig_bis: "2026-10-31" }),
        NOW,
      ),
      [
        "Der Name des Kunden fehlt.",
        "Es gibt noch keine Position.",
        "„Gültig bis“ liegt in der Vergangenheit.",
      ],
    );
    assert.deepEqual(sendeProbleme(angebot({ status: "angenommen" }), NOW), [
      "Ein Angebot im Status „Angenommen“ lässt sich nicht mehr senden.",
    ]);
    // Ohne E-Mail trotzdem sendebereit (Teilen, Link kopieren).
    assert.deepEqual(sendeProbleme(angebot({ kunde_email: null }), NOW), []);
  });

  it("statusZeile", () => {
    assert.equal(statusZeile(angebot(), NOW), "Entwurf");
    const sent = angebot({
      status: "gesendet",
      sent_at: "2026-11-01T13:02:00Z",
    });
    assert.equal(statusZeile(sent, NOW), "Gesendet am 1.11., 14:02");
    assert.equal(
      statusZeile({ ...sent, first_viewed_at: "2026-11-02T08:15:00Z" }, NOW),
      "Vom Kunden geöffnet am 2.11., 09:15",
    );
    assert.equal(
      statusZeile(sent, new Date("2026-12-05T10:00:00Z")),
      "Gesendet am 1.11., 14:02 · abgelaufen",
    );
    assert.equal(
      statusZeile(
        angebot({
          status: "angenommen",
          accepted_at: "2026-11-03T09:00:00Z",
          angenommen_von: "Jana Petersen",
        }),
        NOW,
      ),
      "Angenommen am 3.11., 10:00 von Jana Petersen",
    );
    assert.equal(
      statusZeile(
        angebot({ status: "abgelehnt", declined_at: "2026-11-03T09:00:00Z" }),
        NOW,
      ),
      "Abgelehnt am 3.11., 10:00",
    );
    assert.equal(
      statusZeile(angebot({ status: "zurueckgezogen" }), NOW),
      "Zurückgezogen",
    );
    assert.equal(
      formatZeitpunkt("2025-12-31T22:59:00Z", NOW),
      "31.12.2025, 23:59",
    );
  });

  it("Hinweis auf der Karte: angenommen vor gesendet, Entwürfe still", () => {
    const k = (
      status: Angebot["status"],
      first_viewed_at: string | null = null,
      nummer = "A-2026-0001",
    ) => ({
      status,
      first_viewed_at,
      nummer,
    });
    assert.equal(angebotHinweis([]), null);
    assert.equal(
      angebotHinweis([k("entwurf"), k("zurueckgezogen"), k("abgelehnt")]),
      null,
    );
    assert.deepEqual(angebotHinweis([k("gesendet")]), {
      status: "gesendet",
      text: "Angebot gesendet",
      nummer: "A-2026-0001",
    });
    assert.equal(
      angebotHinweis([k("gesendet", "2026-11-01T10:00:00Z")])?.text,
      "Angebot geöffnet",
    );
    assert.deepEqual(
      angebotHinweis([k("gesendet"), k("angenommen", null, "A-2026-0002")]),
      {
        status: "angenommen",
        text: "Angebot angenommen",
        nummer: "A-2026-0002",
      },
    );
    const map = angeboteNachAnfrage([
      { lead_id: "x", n: 1 },
      { lead_id: "y", n: 2 },
      { lead_id: "x", n: 3 },
    ]);
    assert.deepEqual(
      map.get("x")?.map((r) => r.n),
      [1, 3],
    );
  });
});

describe("Texte rund ums Senden", () => {
  const a = angebot({ status: "gesendet" });

  it("Kunden-Mail: Betreff, Sie-Form, Preis, Gültigkeit, Link", () => {
    const m = kundenMail(a, "https://www.sitalo.de");
    assert.equal(m.subject, "Ihr Angebot A-2026-0001 von Sitalo Webdesign");
    assert.ok(m.body.startsWith("Guten Tag Jana Petersen,"));
    assert.ok(m.body.includes(`https://www.sitalo.de/angebot/${a.token}`));
    assert.ok(
      m.body.includes(
        "2.499,00 € einmalig und 179,00 € im Monat, jeweils zuzüglich 19 % Umsatzsteuer",
      ),
    );
    assert.ok(m.body.includes("gilt bis zum 1. Dezember 2026"));
    assert.ok(!/ /.test(m.body));
    assert.ok(!/\bdu\b|\bdein/i.test(m.body));
    const href = kundenMailHref(a, "https://www.sitalo.de");
    assert.ok(
      href?.startsWith(
        "mailto:jana.petersen@example.de?subject=Ihr%20Angebot%20A-2026-0001",
      ),
    );
    assert.equal(kundenMailHref({ ...a, kunde_email: null }), null);
    assert.equal(
      kundenMailHref({ ...a, kunde_email: "x@y.de?bcc=z@evil.de" }),
      null,
    );
  });

  it("Teilen und Links", () => {
    const t = teilenDaten(a, "https://www.sitalo.de");
    assert.equal(t.url, `https://www.sitalo.de/angebot/${a.token}`);
    assert.equal(t.title, "Ihr Angebot A-2026-0001 von Sitalo Webdesign");
    assert.ok(t.text.includes("Gültig bis zum 1. Dezember 2026."));
    assert.equal(angebotUrl("abc", "https://x.de"), "https://x.de/angebot/abc");
    assert.equal(editorPfad("l1", "a1"), "/admin/anfragen/l1/angebot/a1");
  });

  it("Benachrichtigung an den Inhaber, ohne Token", () => {
    const n = inhaberBenachrichtigung(
      "angenommen",
      {
        ...a,
        accepted_at: "2026-11-02T13:05:00Z",
        angenommen_von: "J. Petersen",
      },
      "https://www.sitalo.de",
    );
    assert.equal(
      n.subject,
      "Angebot A-2026-0001 angenommen: Pflegedienst Elbblick (Jana Petersen)",
    );
    assert.ok(n.text.includes("Angenommen von: J. Petersen"));
    assert.ok(n.text.includes("2. November 2026 um 14:05 Uhr"));
    assert.ok(
      n.text.includes(`https://www.sitalo.de/admin/anfragen/${a.lead_id}`),
    );
    assert.ok(!n.text.includes(a.token));
    const d = inhaberBenachrichtigung("abgelehnt", {
      ...a,
      kunde_firma: null,
      declined_at: "2026-11-02T13:05:00Z",
      abgelehnt_grund: "Zu teuer",
    });
    assert.equal(d.subject, "Angebot A-2026-0001 abgelehnt: Jana Petersen");
    assert.ok(d.text.includes("Grund:\nZu teuer"));
  });

  it("Bestätigung an den Kunden: Beleg mit Positionen, Summen, Hinweisen, Link", () => {
    const b = kundenBestaetigung(
      {
        ...a,
        accepted_at: "2026-11-02T13:05:00Z",
        angenommen_von: "J. Petersen",
      },
      "https://www.sitalo.de",
    );
    assert.equal(b.subject, "Bestätigung: Angebot A-2026-0001 angenommen");
    assert.ok(b.text.startsWith("Guten Tag Jana Petersen,"));
    assert.ok(b.text.includes("Angenommen am: 2. November 2026 um 14:05 Uhr"));
    assert.ok(b.text.includes("Angenommen von: J. Petersen"));
    assert.ok(b.text.includes("Einmalige Leistungen:"));
    assert.ok(b.text.includes("Monatliche Leistungen:"));
    // Premium: 2.499 € einmalig, 179 € im Monat, je mit USt und brutto.
    assert.ok(
      b.text.includes(
        "Summe einmalig: 2.499,00 € netto + 474,81 € USt (19 %) = 2.973,81 €",
      ),
      b.text,
    );
    assert.ok(
      b.text.includes(
        "Summe monatlich: 179,00 € netto + 34,01 € USt (19 %) = 213,01 € im Monat",
      ),
    );
    assert.ok(
      b.text.includes(
        `Hinweise:\n${a.hinweise.trim().replace(/[\u00A0\u202F]/g, " ")}`,
      ),
    );
    assert.ok(b.text.includes(`https://www.sitalo.de/angebot/${a.token}`));
    assert.ok(!/\u00A0/.test(b.text));
    assert.ok(!/\bdu\b|\bdein/i.test(b.text));

    const klein = kundenBestaetigung({ ...a, ust_satz: 0 });
    assert.ok(
      klein.text.includes(
        "Summe einmalig: 2.499,00 € (keine Umsatzsteuer nach § 19 UStG)",
      ),
    );
  });

  it("Datumsformate", () => {
    assert.equal(formatDatumLang("2026-12-01"), "1. Dezember 2026");
  });
});

describe("Zeilen und Verlauf", () => {
  it("angebotAusZeile: kaputte Positionen fallen weg, Steuersatz 0/19", () => {
    const a = angebotAusZeile({
      ...angebot(),
      ust_satz: "0",
      positionen: [
        {
          id: "ok",
          titel: "Gut",
          beschreibung: null,
          menge: 1,
          preis_cent: 100,
          art: "einmalig",
        },
        { id: "x", titel: "Art fehlt", menge: 1, preis_cent: 1 },
        "Unsinn",
        {
          id: "y",
          titel: "Menge krumm",
          menge: 1.5,
          preis_cent: 1,
          art: "monatlich",
        },
      ],
    });
    assert.equal(a.ust_satz, 0);
    assert.deepEqual(a.positionen, [
      {
        id: "ok",
        titel: "Gut",
        beschreibung: "",
        menge: 1,
        preis_cent: 100,
        art: "einmalig",
      },
    ]);
    assert.deepEqual(angebotAusZeile(null).positionen, []);
    assert.equal(angebotAusZeile({ status: "quatsch" }).status, "entwurf");
  });

  it("oeffentlicheSicht: keine Anfrage-ID, kein Token, keine E-Mail", () => {
    const o = oeffentlicheSicht(angebot()) as Record<string, unknown>;
    assert.deepEqual(Object.keys(o).sort(), [...ANGEBOT_PUBLIC_COLUMNS].sort());
    for (const k of [
      "id",
      "lead_id",
      "token",
      "kunde_email",
      "first_viewed_at",
      "abgelehnt_grund",
    ])
      assert.ok(!(k in o), k);
  });

  it("Verlaufszeilen ohne Inhalte", () => {
    const ev = (detail: Record<string, unknown>) => ({
      action: "angebot" as const,
      detail,
    });
    assert.equal(
      eventText(ev({ was: "erstellt", nummer: "A-2026-0001" })),
      "Angebot A-2026-0001 erstellt",
    );
    assert.equal(
      eventText(ev({ was: "gesendet", nummer: "A-2026-0001" })),
      "Angebot A-2026-0001 gesendet",
    );
    assert.equal(
      eventText(ev({ was: "gesendet", nummer: "A-2026-0001", erneut: true })),
      "Angebot A-2026-0001 erneut gesendet",
    );
    assert.equal(
      eventText(ev({ was: "angesehen", nummer: "A-2026-0001" })),
      "Angebot A-2026-0001 vom Kunden geöffnet",
    );
    assert.equal(
      eventText(ev({ was: "angenommen", nummer: "A-2026-0001" })),
      "Angebot A-2026-0001 angenommen",
    );
    assert.equal(
      eventText(ev({ was: "abgelehnt", nummer: "A-2026-0001" })),
      "Angebot A-2026-0001 abgelehnt",
    );
    assert.equal(
      eventText(ev({ was: "zurueckgezogen", nummer: "A-2026-0001" })),
      "Angebot A-2026-0001 zurückgezogen",
    );
    assert.equal(
      eventText(ev({ was: "verworfen", nummer: "A-2026-0001" })),
      "Angebot A-2026-0001 (Entwurf) verworfen",
    );
    assert.equal(
      eventText(ev({ was: "mail_fehler", nummer: "A-2026-0001" })),
      "Benachrichtigung zu Angebot A-2026-0001 fehlgeschlagen",
    );
    // Fremde Werte erscheinen nicht.
    assert.equal(
      angebotEventText({ was: "<b>", nummer: "<script>" }),
      "Angebot",
    );
  });
});
