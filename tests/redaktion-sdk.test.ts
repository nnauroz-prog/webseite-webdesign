/**
 * Der Anschluss der Redaktion mit dem echten SDK, aber gegen einen
 * lokalen Server statt der API: Der Server antwortet im Strom-Format der
 * Messages API (Server-Sent Events) und schreibt mit, was das SDK
 * wirklich schickt. So ist geprüft, dass Anfrage, Strom, Fehlerklassen
 * und Abbruch mit der installierten SDK-Version zusammenpassen, ohne
 * dass ein Schlüssel nötig ist oder etwas das Haus verlässt.
 */
import assert from "node:assert/strict";
import http from "node:http";
import { after, before, beforeEach, describe, it } from "node:test";

import Anthropic from "@anthropic-ai/sdk";

import type { RedaktionModell } from "@/lib/redaktion/modell";

import { redaktionAblauf } from "@/lib/redaktion/ablauf";
import { anthropicModell } from "@/lib/redaktion/anthropic";
import { ModellFehler } from "@/lib/redaktion/modell";
import {
  SCHEMA_IDEE,
  SCHEMA_SERIE,
  SYSTEM_LEKTOR,
  SYSTEM_SCOUT,
  SYSTEM_TEXTERIN,
} from "@/lib/redaktion/prompts";
import { pruefeSerie } from "@/lib/story-serie";
import {
  ANDERE_SERIE,
  GUTE_SERIE,
  IDEE,
  sammler,
  testKontext,
} from "@/tests/redaktion-attrappe";

type Anfrage = {
  pfad: string;
  methode: string;
  kopf: http.IncomingHttpHeaders;
  body: Record<string, unknown>;
};

/** Was der Server auf die nächste(n) Anfrage(n) antwortet. */
type Antwort =
  | { art: "strom"; text: string; stopp?: string; stueck?: number }
  | {
      art: "status";
      status: number;
      typ: string;
      kopf?: Record<string, string>;
    }
  | { art: "fehler_im_strom"; typ: string }
  | { art: "haengt" };

const SCHLUESSEL = "attrappe-kein-echter-schluessel";

let server: http.Server;
let url = "";
let anfragen: Anfrage[] = [];
/** Antwort je Anfrage; die Funktion sieht den Body und wählt aus. */
let antworte: (body: Record<string, unknown>, nr: number) => Antwort;

const sse = (ereignis: string, daten: unknown) =>
  `event: ${ereignis}\ndata: ${JSON.stringify(daten)}\n\n`;

function stromKopf(res: http.ServerResponse, modell: unknown) {
  res.writeHead(200, {
    "content-type": "text/event-stream",
    "request-id": "req_attrappe",
  });
  res.write(
    sse("message_start", {
      type: "message_start",
      message: {
        id: "msg_attrappe",
        type: "message",
        role: "assistant",
        model: modell,
        content: [],
        stop_reason: null,
        stop_sequence: null,
        usage: { input_tokens: 100, output_tokens: 1 },
      },
    }),
  );
}

before(async () => {
  server = http.createServer((req, res) => {
    let roh = "";
    req.on("data", (c) => (roh += c));
    req.on("end", () => {
      const body = JSON.parse(roh || "{}") as Record<string, unknown>;
      anfragen.push({
        pfad: req.url ?? "",
        methode: req.method ?? "",
        kopf: req.headers,
        body,
      });
      const a = antworte(body, anfragen.length);
      if (a.art === "status") {
        res.writeHead(a.status, {
          "content-type": "application/json",
          "request-id": "req_attrappe",
          ...a.kopf,
        });
        res.end(
          JSON.stringify({
            type: "error",
            error: { type: a.typ, message: "Attrappe" },
          }),
        );
        return;
      }
      stromKopf(res, body.model);
      if (a.art === "haengt") return; // Verbindung offen lassen
      if (a.art === "fehler_im_strom") {
        res.end(
          sse("error", {
            type: "error",
            error: { type: a.typ, message: "Attrappe" },
          }),
        );
        return;
      }
      // Erst ein (leerer) Block Nachdenken, dann der Text in Stücken.
      res.write(
        sse("content_block_start", {
          type: "content_block_start",
          index: 0,
          content_block: { type: "thinking", thinking: "", signature: "" },
        }),
      );
      res.write(
        sse("content_block_delta", {
          type: "content_block_delta",
          index: 0,
          delta: { type: "signature_delta", signature: "sig" },
        }),
      );
      res.write(
        sse("content_block_stop", { type: "content_block_stop", index: 0 }),
      );
      res.write(
        sse("content_block_start", {
          type: "content_block_start",
          index: 1,
          content_block: { type: "text", text: "" },
        }),
      );
      const stueck = a.stueck ?? 37;
      for (let i = 0; i < a.text.length; i += stueck)
        res.write(
          sse("content_block_delta", {
            type: "content_block_delta",
            index: 1,
            delta: { type: "text_delta", text: a.text.slice(i, i + stueck) },
          }),
        );
      res.write(
        sse("content_block_stop", { type: "content_block_stop", index: 1 }),
      );
      res.write(
        sse("message_delta", {
          type: "message_delta",
          delta: { stop_reason: a.stopp ?? "end_turn", stop_sequence: null },
          usage: { output_tokens: 200 },
        }),
      );
      res.end(sse("message_stop", { type: "message_stop" }));
    });
  });
  await new Promise<void>((bereit) => server.listen(0, "127.0.0.1", bereit));
  const adresse = server.address();
  assert.ok(adresse && typeof adresse === "object");
  url = `http://127.0.0.1:${adresse.port}`;
});

after(async () => {
  server.closeAllConnections();
  await new Promise((zu) => server.close(zu));
});

beforeEach(() => {
  anfragen = [];
  antworte = () => ({ art: "strom", text: JSON.stringify(IDEE) });
});

/** Die Redaktion am echten SDK, das mit dem lokalen Server spricht. */
function modell(): RedaktionModell {
  return anthropicModell(new Anthropic({ baseURL: url, apiKey: SCHLUESSEL }));
}

const ANFRAGE = {
  modell: "claude-opus-5-5",
  system: SYSTEM_SCOUT,
  nutzer: "## Unterlagen\nTag der Serie: Freitag, 27. November 2026",
  schema: SCHEMA_IDEE,
  maxTokens: 8000,
  aufwand: "low" as const,
};

describe("anthropicModell mit dem echten SDK", () => {
  it("schickt eine Strom-Anfrage an /v1/messages und setzt die Antwort zusammen", async () => {
    const antwort = await modell().frage(ANFRAGE);
    assert.deepEqual(JSON.parse(antwort.text), IDEE);
    assert.equal(antwort.stopp, "end_turn");
    assert.equal(anfragen.length, 1);
    const a = anfragen[0];
    assert.equal(a.methode, "POST");
    assert.equal(a.pfad, "/v1/messages");
    assert.equal(a.kopf["x-api-key"], SCHLUESSEL);
    assert.ok(a.kopf["anthropic-version"]);
    assert.deepEqual(a.body, {
      model: "claude-opus-5-5",
      max_tokens: 8000,
      system: [
        {
          type: "text",
          text: SYSTEM_SCOUT,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: ANFRAGE.nutzer }],
      thinking: { type: "adaptive" },
      output_config: {
        effort: "low",
        format: { type: "json_schema", schema: SCHEMA_IDEE },
      },
      stream: true,
    });
    // Der Schlüssel steht nur im Kopf, nie im Body.
    assert.ok(!JSON.stringify(a.body).includes(SCHLUESSEL));
  });

  it("Umlaute, Anführungszeichen und Stückelung mitten im Zeichen kommen heil an", async () => {
    const text = JSON.stringify(ANDERE_SERIE);
    antworte = () => ({ art: "strom", text, stueck: 1 });
    const antwort = await modell().frage({ ...ANFRAGE, schema: SCHEMA_SERIE });
    assert.equal(antwort.text, text);
    assert.deepEqual(JSON.parse(antwort.text), ANDERE_SERIE);
  });

  it("reicht refusal und max_tokens als Grund durch", async () => {
    for (const stopp of ["refusal", "max_tokens"]) {
      antworte = () => ({ art: "strom", text: "", stopp });
      assert.deepEqual(await modell().frage(ANFRAGE), { text: "", stopp });
    }
  });

  it("ordnet Fehlerantworten der API ein, ohne sie zu wiederholen (4xx)", async () => {
    for (const [status, typ, art] of [
      [400, "invalid_request_error", "anfrage"],
      [401, "authentication_error", "schluessel"],
      [403, "permission_error", "rechte"],
      [404, "not_found_error", "modell_fehlt"],
    ] as const) {
      anfragen = [];
      antworte = () => ({ art: "status", status, typ });
      await assert.rejects(
        modell().frage(ANFRAGE),
        (err: unknown) =>
          err instanceof ModellFehler &&
          err.art === art &&
          err.status === status,
        String(status),
      );
      assert.equal(anfragen.length, 1, String(status));
    }
  });

  it("429 und 529 versucht das SDK genau einmal neu, dann „limit“ bzw. „ueberlastet“", async () => {
    for (const [status, typ, art] of [
      [429, "rate_limit_error", "limit"],
      [529, "overloaded_error", "ueberlastet"],
    ] as const) {
      anfragen = [];
      antworte = () => ({
        art: "status",
        status,
        typ,
        kopf: { "retry-after-ms": "1" },
      });
      await assert.rejects(
        modell().frage(ANFRAGE),
        (err: unknown) =>
          err instanceof ModellFehler &&
          err.art === art &&
          err.status === status,
      );
      assert.equal(anfragen.length, 2, String(status));
    }
  });

  it("nach einer Überlastung klappt der zweite Versuch von selbst", async () => {
    antworte = (_body, nr) =>
      nr === 1
        ? {
            art: "status",
            status: 529,
            typ: "overloaded_error",
            kopf: { "retry-after-ms": "1" },
          }
        : { art: "strom", text: JSON.stringify(IDEE) };
    const antwort = await modell().frage(ANFRAGE);
    assert.deepEqual(JSON.parse(antwort.text), IDEE);
    assert.equal(anfragen.length, 2);
  });

  it("Fehler mitten im Strom wird eingeordnet", async () => {
    antworte = () => ({ art: "fehler_im_strom", typ: "overloaded_error" });
    await assert.rejects(
      modell().frage(ANFRAGE),
      (err: unknown) =>
        err instanceof ModellFehler && err.art === "ueberlastet",
    );
  });

  it("Frist und Abbruch beenden einen hängenden Aufruf", async () => {
    antworte = () => ({ art: "haengt" });
    const start = Date.now();
    await assert.rejects(
      modell().frage({ ...ANFRAGE, signal: AbortSignal.timeout(60) }),
      (err: unknown) => err instanceof ModellFehler && err.art === "zeit",
    );
    const studio = new AbortController();
    setTimeout(() => studio.abort(), 30);
    await assert.rejects(
      modell().frage({ ...ANFRAGE, signal: studio.signal }),
      (err: unknown) => err instanceof ModellFehler && err.art === "abbruch",
    );
    // Schon abgebrochen: gar keine Anfrage mehr.
    const vorher = anfragen.length;
    await assert.rejects(
      modell().frage({ ...ANFRAGE, signal: studio.signal }),
      (err: unknown) => err instanceof ModellFehler && err.art === "abbruch",
    );
    assert.equal(anfragen.length, vorher);
    assert.ok(Date.now() - start < 3000);
  });

  it("Server nicht erreichbar: „verbindung“", async () => {
    // Ein Port, an dem gerade noch ein Server hing und jetzt keiner mehr.
    const kurz = http.createServer();
    await new Promise<void>((bereit) => kurz.listen(0, "127.0.0.1", bereit));
    const adresse = kurz.address();
    assert.ok(adresse && typeof adresse === "object");
    await new Promise((zu) => kurz.close(zu));
    const tot = anthropicModell(
      new Anthropic({
        baseURL: `http://127.0.0.1:${adresse.port}`,
        apiKey: SCHLUESSEL,
      }),
    );
    await assert.rejects(
      tot.frage(ANFRAGE),
      (err: unknown) => err instanceof ModellFehler && err.art === "verbindung",
    );
  });
});

describe("der ganze Ablauf über das echte SDK", () => {
  const AUFTRAG = {
    auftrag: "Story-Serie zu Black Friday",
    datum: "2026-11-27",
  };

  /** Antwortet je nach Rolle (an der Vorgabe erkannt). */
  function redaktionAmServer(serien: { text: unknown; lektor: unknown }) {
    antworte = (body) => {
      const system = (body.system as { text: string }[])[0].text;
      const wert =
        system === SYSTEM_SCOUT
          ? IDEE
          : system === SYSTEM_TEXTERIN
            ? serien.text
            : serien.lektor;
      return { art: "strom", text: JSON.stringify(wert) };
    };
  }

  it("drei Aufrufe, vier Schritte, eine geprüfte Serie", async () => {
    redaktionAmServer({ text: GUTE_SERIE, lektor: ANDERE_SERIE });
    const s = sammler();
    const ergebnis = await redaktionAblauf({
      auftrag: AUFTRAG,
      kontext: testKontext(),
      modell: modell(),
      modelle: { haupt: "claude-opus-5-5", ersatz: "claude-opus-4-7" },
      sende: s.sende,
      speichere: async () => null,
    });
    assert.ok(ergebnis.ok);
    assert.equal(s.folge().at(-1), "serie");
    const letzte = s.ereignisse.at(-1);
    assert.ok(letzte?.typ === "serie");
    assert.deepEqual(letzte.serie, ANDERE_SERIE);
    assert.deepEqual(pruefeSerie(letzte.serie), []);
    assert.deepEqual(
      anfragen.map((a) => (a.body.system as { text: string }[])[0].text),
      [SYSTEM_SCOUT, SYSTEM_TEXTERIN, SYSTEM_LEKTOR],
    );
    assert.deepEqual(
      anfragen.map((a) => (a.body.output_config as { effort: string }).effort),
      ["low", "medium", "medium"],
    );
    for (const a of anfragen) {
      assert.equal(a.body.model, "claude-opus-5-5");
      assert.deepEqual(a.body.thinking, { type: "adaptive" });
      for (const feld of ["temperature", "top_p", "top_k", "tool_choice"])
        assert.ok(!(feld in a.body), feld);
    }
  });

  it("gibt es das Modell nicht (404), schreibt das Ersatzmodell die Serie", async () => {
    antworte = (body) => {
      if (body.model !== "claude-opus-4-7")
        return { art: "status", status: 404, typ: "not_found_error" };
      const system = (body.system as { text: string }[])[0].text;
      return {
        art: "strom",
        text: JSON.stringify(system === SYSTEM_SCOUT ? IDEE : GUTE_SERIE),
      };
    };
    const s = sammler();
    const ergebnis = await redaktionAblauf({
      auftrag: AUFTRAG,
      kontext: testKontext(),
      modell: modell(),
      modelle: { haupt: "claude-opus-5-5", ersatz: "claude-opus-4-7" },
      sende: s.sende,
      speichere: async () => null,
    });
    assert.ok(ergebnis.ok && ergebnis.modell === "claude-opus-4-7");
    assert.equal(s.folge().at(-1), "serie");
    assert.deepEqual(
      anfragen.map((a) => a.body.model),
      [
        "claude-opus-5-5",
        "claude-opus-4-7",
        "claude-opus-4-7",
        "claude-opus-4-7",
      ],
    );
  });

  it("abgelehnter Schlüssel (401): eine Anfrage, dann die Meldung fürs Studio", async () => {
    antworte = () => ({
      art: "status",
      status: 401,
      typ: "authentication_error",
    });
    const s = sammler();
    await redaktionAblauf({
      auftrag: AUFTRAG,
      kontext: testKontext(),
      modell: modell(),
      modelle: { haupt: "claude-opus-5-5", ersatz: "claude-opus-4-7" },
      sende: s.sende,
      speichere: async () => null,
    });
    assert.deepEqual(s.folge(), ["idee:laeuft", "fehler:modell"]);
    const letzte = s.ereignisse.at(-1);
    assert.ok(letzte?.typ === "fehler");
    assert.match(letzte.text, /API-Schlüssel wird abgelehnt/);
    assert.ok(!letzte.text.includes(SCHLUESSEL));
    assert.equal(anfragen.length, 1);
  });
});
