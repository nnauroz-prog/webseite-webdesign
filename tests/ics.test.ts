import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

import {
  foldLine,
  icsDocument,
  icsEscape,
  icsUtcStamp,
  VTIMEZONE_BERLIN,
} from "@/lib/ics";

const bytes = (s: string) => new TextEncoder().encode(s).length;

/** Frühere Faltung aus app/sprechstunde/termine.ics/route.ts (nach Zeichen). */
function oldFoldLine(line: string): string {
  if (line.length <= 70) return line;
  const parts: string[] = [];
  let rest = line;
  parts.push(rest.slice(0, 70));
  rest = rest.slice(70);
  while (rest.length > 0) {
    parts.push(" " + rest.slice(0, 69));
    rest = rest.slice(69);
  }
  return parts.join("\r\n");
}

const unfold = (doc: string) => doc.replace(/\r\n /g, "");

describe("foldLine", () => {
  it("ist für ASCII identisch mit der früheren Faltung", () => {
    for (let len = 0; len < 400; len += 7) {
      const line = "DESCRIPTION:" + "abcdefghij".repeat(40).slice(0, len);
      assert.equal(foldLine(line), oldFoldLine(line));
    }
  });

  it("faltet nach UTF-8-Bytes: Umlaute bleiben ≤ 75 Oktette", () => {
    const line = `SUMMARY:Erstgespräch: ${"ÄÖÜäöüß".repeat(6)}`;
    const folded = foldLine(line);
    for (const l of folded.split("\r\n"))
      assert.ok(bytes(l) <= 75, `${bytes(l)} Bytes: ${l}`);
    assert.equal(unfold(folded), line);
  });

  it("trennt nie mitten in einem Zeichen (Emoji)", () => {
    const line = `DESCRIPTION:${"😀".repeat(60)}`;
    const folded = foldLine(line);
    for (const l of folded.split("\r\n")) {
      assert.ok(bytes(l) <= 75);
      assert.ok(
        !/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/.test(
          l,
        ),
      );
    }
    assert.equal(unfold(folded), line);
  });
});

describe("icsEscape", () => {
  it("maskiert wie bisher", () => {
    assert.equal(icsEscape("a\\b;c,d\ne"), "a\\\\b\\;c\\,d\\ne");
  });

  it("ein nacktes \\r erzeugt keine eigene Kalenderzeile", () => {
    for (const name of [
      "Max\rURL:https://evil.example",
      "Max\r\nATTENDEE:mailto:x@y.de",
      "Max\n\rBEGIN:VALARM",
    ]) {
      const doc = icsDocument([
        "BEGIN:VEVENT",
        `SUMMARY:${icsEscape(name)}`,
        "END:VEVENT",
      ]);
      const lines = unfold(doc).split("\r\n").filter(Boolean);
      assert.deepEqual(
        lines.map((l) => l.split(/[:;]/)[0]),
        ["BEGIN", "SUMMARY", "END"],
      );
      assert.ok(!doc.replace(/\r\n/g, "").includes("\r"));
      assert.ok(!doc.replace(/\r\n/g, "").includes("\n"));
    }
  });

  it("entfernt übrige Steuerzeichen (Tab ist in TEXT erlaubt)", () => {
    assert.equal(icsEscape("a\u0000b\u0007c\u001bd\u007fe\tf"), "abcde\tf");
  });

  it("Name mit 40 Umlauten: jede Zeile ≤ 75 Bytes", () => {
    const doc = icsDocument([
      `SUMMARY:${icsEscape(`Erstgespräch: ${"ü".repeat(40)} (Sitalo Webdesign)`)}`,
    ]);
    for (const l of doc.split("\r\n")) assert.ok(bytes(l) <= 75);
  });
});

describe("Helfer", () => {
  it("icsUtcStamp und VTIMEZONE", () => {
    assert.equal(
      icsUtcStamp(new Date("2026-10-31T14:12:05.123Z")),
      "20261031T141205Z",
    );
    assert.equal(VTIMEZONE_BERLIN[0], "BEGIN:VTIMEZONE");
    assert.equal(VTIMEZONE_BERLIN.at(-1), "END:VTIMEZONE");
  });
});

describe("app/sprechstunde/termine.ics", () => {
  it("liefert byte-gleich dieselbe Datei wie vor der Umstellung auf lib/ics.ts", async (t) => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    t.mock.timers.enable({
      apis: ["Date"],
      now: new Date("2026-10-31T12:00:00Z"),
    });
    const { GET } = await import("@/app/sprechstunde/termine.ics/route");
    const body = await GET().text();
    const expected = readFileSync(
      new URL("./fixtures/sprechstunde-2026-10-31.ics", import.meta.url),
      "utf8",
    );
    assert.equal(body, expected);
  });
});

describe("app/termin/kalender.ics (öffentlich, ohne Personendaten)", () => {
  async function get(query: string) {
    const { GET } = await import("@/app/termin/kalender.ics/route");
    return GET(
      new Request(`https://www.sitalo.de/termin/kalender.ics${query}`),
    );
  }

  it("liefert einen Termin mit Zeitzone, DTSTAMP und gefalteten Zeilen", async (t) => {
    t.mock.timers.enable({
      apis: ["Date"],
      now: new Date("2026-10-31T12:00:00Z"),
    });
    const res = await get("?start=2026-11-03T10:00");
    assert.equal(res.status, 200);
    assert.equal(
      res.headers.get("content-type"),
      "text/calendar; charset=utf-8",
    );
    assert.match(
      res.headers.get("content-disposition") ?? "",
      /filename="sitalo-termin-2026-11-03-1000\.ics"/,
    );
    const body = await res.text();
    assert.ok(body.endsWith("\r\n"));
    assert.ok(body.includes("BEGIN:VTIMEZONE\r\nTZID:Europe/Berlin"));
    assert.ok(body.includes("DTSTART;TZID=Europe/Berlin:20261103T100000\r\n"));
    assert.ok(body.includes("DTEND;TZID=Europe/Berlin:20261103T103000\r\n"));
    assert.ok(body.includes("DTSTAMP:20261031T120000Z\r\n"));
    assert.ok(body.includes("UID:termin-2026-11-03-1000@sitalo.de\r\n"));
    assert.ok(body.includes("SUMMARY:Erstgespräch mit Sitalo Webdesign\r\n"));
    for (const l of body.split("\r\n")) assert.ok(bytes(l) <= 75);
  });

  it("lehnt ungültige Zeiten ab", async (t) => {
    t.mock.timers.enable({
      apis: ["Date"],
      now: new Date("2026-10-31T12:00:00Z"),
    });
    for (const q of [
      "",
      "?start=abc",
      "?start=2026-11-03T10:15", // nicht in SLOT_TIMES
      "?start=2026-11-03T12:00", // Mittagspause
      "?start=2026-11-07T10:00", // Samstag
      "?start=2026-12-25T10:00", // Feiertag
      "?start=2026-02-30T10:00", // kein echtes Datum
      "?start=2027-01-05T10:00", // mehr als 60 Tage voraus
      "?start=2026-10-28T10:00", // vorbei
      "?start=2026-11-03T10:00%0D%0AURL:x",
    ]) {
      assert.equal((await get(q)).status, 404, q);
    }
  });
});
