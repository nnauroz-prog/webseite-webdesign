import assert from "node:assert/strict";
import { describe, it } from "node:test";

import type { LeadRow } from "@/lib/leads-meta";

import { mailtoHref } from "@/lib/admin/links";
import { templatesFor } from "@/lib/admin/reply-templates";
import { makeLead } from "@/tests/helpers";

const now = new Date("2026-10-30T10:00:00Z");

function bodies(
  lead: LeadRow,
  picks = [] as { dateIso: string; time: string }[],
) {
  return templatesFor(lead, now, picks);
}

function assertClean(
  lead: LeadRow,
  picks?: { dateIso: string; time: string }[],
) {
  for (const t of bodies(lead, picks)) {
    assert.ok(!/undefined|null|\(\s*\)/.test(t.body), `${t.id}: ${t.body}`);
    assert.ok(!t.body.includes("["), `${t.id} enthält [: ${t.body}`);
    assert.ok(!t.body.includes("—"), `${t.id} enthält Gedankenstrich`);
    assert.ok(t.body.length <= 1800, `${t.id} zu lang`);
    assert.ok(t.subject.startsWith("Re: "));
    assert.ok(
      t.body.includes(
        "Viele Grüße\nSitalo Webdesign\n+49 160 7621876 · sitalo.de",
      ),
    );
  }
}

const anfrage = makeLead({
  kind: "anfrage",
  subject: "Neue Anfrage von Lisa Weber (Weber Bau)",
  fields: [
    ["Name", "Lisa Weber"],
    ["E-Mail", "lisa@example.de"],
    ["Telefon", "0176 1234567"],
    ["Firma", "Weber Bau"],
    ["Branche", "Handwerker"],
    ["Paket-Wunsch", "Business-Auftritt"],
    ["Wunschzeitraum", "Innerhalb von 1 Monat"],
    ["Nachricht", "Wir brauchen eine neue Website."],
  ],
});

describe("templatesFor: Anfrage", () => {
  it("Paket, Firma, Wunschzeitraum und Telefon im Telefonat-Vorschlag", () => {
    const t = bodies(anfrage, [{ dateIso: "2026-11-03", time: "10:00" }]).find(
      (x) => x.id === "telefonat",
    )!;
    assert.equal(t.slots, 1);
    assert.equal(t.subject, "Re: Neue Anfrage von Lisa Weber (Weber Bau)");
    assert.ok(
      t.body.startsWith(
        "Guten Tag Lisa Weber,\n\nvielen Dank für Ihre Anfrage für Weber Bau.",
      ),
    );
    assert.ok(
      t.body.includes(
        "Sie interessieren sich für das Paket Business (ab 899 €).",
      ),
    );
    assert.ok(t.body.includes("Ihr Wunschzeitraum: Innerhalb von 1 Monat."));
    assert.ok(t.body.includes("am Dienstag, 3. November, um 10:00 Uhr?"));
    assert.ok(t.body.includes("unter 0176 1234567"));
    assert.ok(t.body.includes("https://www.sitalo.de/termin"));
    assertClean(anfrage, [{ dateIso: "2026-11-03", time: "10:00" }]);
  });

  it("ohne gewählte Zeit wird offen gefragt (kein Platzhalter)", () => {
    const t = bodies(anfrage).find((x) => x.id === "telefonat")!;
    assert.ok(t.body.includes("Wann passt es Ihnen"));
    assertClean(anfrage);
  });

  it("„Empfehlung gewünscht“ ergibt den Empfehlungssatz", () => {
    const lead = makeLead({
      fields: [
        ["Name", "Max"],
        ["Paket-Wunsch", "Empfehlung gewünscht"],
      ],
    });
    const t = bodies(lead).find((x) => x.id === "telefonat")!;
    assert.ok(
      t.body.includes("Welches Paket passt, klären wir gern gemeinsam."),
    );
    assert.ok(!t.body.includes("Sie interessieren sich"));
  });

  it("ohne Telefon, Firma und Name fallen die Sätze ganz weg", () => {
    const lead = makeLead({
      subject: "Neue Anfrage",
      fields: [["Nachricht", "Hallo"]],
    });
    const all = bodies(lead, [{ dateIso: "2026-11-03", time: "10:00" }]);
    const t = all.find((x) => x.id === "telefonat")!;
    assert.ok(t.body.startsWith("Guten Tag,\n\nvielen Dank für Ihre Anfrage."));
    assert.ok(!t.body.includes("unter "));
    assert.ok(!t.body.includes("Paket"));
    assertClean(lead, [{ dateIso: "2026-11-03", time: "10:00" }]);
  });

  it("Rückfragen nennen konkrete Fragen zu fehlenden Angaben", () => {
    const lead = makeLead({
      fields: [
        ["Name", "Max"],
        ["Nachricht", "Hallo"],
      ],
    });
    const t = bodies(lead).find((x) => x.id === "rueckfragen")!;
    assert.ok(t.body.includes("1. In welcher Branche sind Sie tätig?"));
    assert.ok(t.body.includes("Bis wann soll die neue Website online sein?"));
    assert.ok(t.body.includes("Gibt es bereits eine Website oder Domain?"));
    const full = bodies(anfrage).find((x) => x.id === "rueckfragen")!;
    assert.ok(!full.body.includes("Branche"));
    assert.ok(
      full.body.includes("1. Gibt es bereits eine Website oder Domain?"),
    );
  });

  it("Nachfassen nur bei in_arbeit; Absage und Leere Mail immer", () => {
    assert.deepEqual(
      bodies(anfrage).map((t) => t.id),
      ["telefonat", "rueckfragen", "absage", "leer"],
    );
    const inArbeit = { ...anfrage, status: "in_arbeit" as const };
    assert.deepEqual(
      bodies(inArbeit).map((t) => t.id),
      ["telefonat", "rueckfragen", "nachfassen", "absage", "leer"],
    );
    assertClean(inArbeit);
  });

  it("überlange Angaben werden auf 1.800 Zeichen gekürzt und mailtoHref bleibt gültig", () => {
    const lead = makeLead({
      fields: [
        ["Name", "M"],
        ["Firma", "F".repeat(4000)],
      ],
    });
    for (const t of bodies(lead)) {
      assert.ok(t.body.length <= 1800);
      assert.ok(
        mailtoHref(lead.reply_to, t.subject, t.body)?.startsWith(
          "mailto:lisa@example.de?subject=",
        ),
      );
    }
  });
});

describe("templatesFor: Audit", () => {
  it("nennt die echte Zusage aus replyDue", () => {
    const lead = makeLead({
      kind: "audit",
      subject: "Audit-Anfrage von Max für https://example.de",
      created_at: "2026-10-30T09:15:00.000Z", // Fr 10:15 → So 1.11. 10:15
      fields: [
        ["Audit-URL", "https://example.de"],
        ["Name", "Max Muster"],
        ["E-Mail", "max@example.de"],
      ],
    });
    const list = bodies(lead);
    assert.deepEqual(
      list.map((t) => t.id),
      ["audit_eingang", "absage", "leer"],
    );
    assert.ok(list[0].body.includes("für https://example.de"));
    // Auf den Tag gerundet, ohne Uhrzeit.
    assert.ok(
      list[0].body.includes(
        "Ihre Einschätzung bekommen Sie bis Sonntag, 1. November.",
      ),
    );
    assertClean(lead);
  });

  it("nennt keine Frist mitten in der Nacht und keine vergangene", () => {
    const nachts = makeLead({
      kind: "audit",
      created_at: "2026-10-31T00:28:00.000Z", // Sa 01:28 → Mo 2.11. 01:28
      fields: [["Name", "Max Muster"]],
    });
    const body = templatesFor(nachts, new Date("2026-10-31T10:00:00Z"))[0].body;
    assert.ok(body.includes("bis Montag, 2. November."), body);
    assert.ok(!/\d{2}:\d{2} Uhr/.test(body), body);

    const alt = makeLead({
      kind: "audit",
      created_at: "2026-10-30T09:00:00.000Z", // Fr 10:00 → So 1.11. 10:00
      fields: [["Name", "Max Muster"]],
    });
    // Mo 2.11. 9:00: Frist vorbei → nächster Werktag (Di 3.11.).
    const spaet = templatesFor(alt, new Date("2026-11-02T08:00:00Z"))[0].body;
    assert.ok(spaet.includes("bis Dienstag, 3. November."), spaet);
    assert.ok(!spaet.includes("Sonntag"), spaet);
  });
});

describe("templatesFor: Termin", () => {
  const lead = makeLead({
    kind: "termin",
    subject: "Terminbuchung von Lisa Weber — 2026-11-03 10:00",
    fields: [
      ["Wunsch-Slot", "Dienstag, 3. November 2026 um 10:00 Uhr (30 Min)"],
      ["Name", "Lisa Weber"],
      ["E-Mail", "lisa@example.de"],
    ],
  });

  it("Termin bestätigen: Wunsch-Slot, Formate, Kalender-Link, kein Anhang", () => {
    const t = bodies(lead).find((x) => x.id === "termin_bestaetigen")!;
    assert.ok(
      t.body.includes("am Dienstag, 3. November, um 10:00 Uhr (30 Minuten)"),
    );
    assert.ok(t.body.includes("Telefon, Video-Call oder vor Ort in Hamburg?"));
    assert.ok(
      t.body.includes(
        "Für Ihren Kalender: https://www.sitalo.de/termin/kalender.ics?start=2026-11-03T10:00",
      ),
    );
    assert.ok(!/anhang|angehängt/i.test(t.body));
    assertClean(lead);
  });

  it("Anderen Termin vorschlagen: zwei gewählte Zeiten mit Kalender-Links", () => {
    const picks = [
      { dateIso: "2026-11-04", time: "14:00" },
      { dateIso: "2026-11-05", time: "10:30" },
    ];
    const t = bodies(lead, picks).find((x) => x.id === "termin_alternativ")!;
    assert.equal(t.slots, 2);
    assert.ok(t.body.includes("1. Mittwoch, 4. November, um 14:00 Uhr"));
    assert.ok(t.body.includes("2. Donnerstag, 5. November, um 10:30 Uhr"));
    assert.ok(t.body.includes("kalender.ics?start=2026-11-05T10:30"));
    assertClean(lead, picks);
    const ohne = bodies(lead).find((x) => x.id === "termin_alternativ")!;
    assert.ok(ohne.body.includes("Welche Zeiten passen Ihnen"));
    assertClean(lead);
  });

  it("vergangener Termin: kein „Termin bestätigen“, passender Text", () => {
    const later = new Date("2026-11-04T10:00:00Z");
    const list = templatesFor(lead, later);
    assert.deepEqual(
      list.map((t) => t.id),
      ["termin_alternativ", "absage", "leer"],
    );
    assert.ok(list[0].body.includes("nicht mehr rechtzeitig bestätigen"));
    assert.ok(!list[0].body.includes("schon vergeben"));
    // Kurz vor dem Ende des Termins noch bestätigbar.
    const during = templatesFor(lead, new Date("2026-11-03T09:20:00Z"));
    assert.ok(during.some((t) => t.id === "termin_bestaetigen"));
  });

  it("ohne lesbaren Slot kein Kalender-Link", () => {
    const vague = makeLead({
      kind: "termin",
      subject: "Terminbuchung",
      fields: [["Name", "X"]],
    });
    const t = bodies(vague).find((x) => x.id === "termin_bestaetigen")!;
    assert.ok(!t.body.includes("kalender.ics"));
    assertClean(vague);
  });
});
