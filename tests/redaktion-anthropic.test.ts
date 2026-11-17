import assert from "node:assert/strict";
import { describe, it } from "node:test";

import Anthropic from "@anthropic-ai/sdk";

import type { AnthropicAnschluss } from "@/lib/redaktion/anthropic";
import type { ModellAnfrage } from "@/lib/redaktion/modell";

import { anthropicModell, modellFehlerAus } from "@/lib/redaktion/anthropic";
import { ModellFehler } from "@/lib/redaktion/modell";
import { SCHEMA_SERIE, SYSTEM_TEXTERIN } from "@/lib/redaktion/prompts";

/** Fehler, wie das SDK ihn für eine HTTP-Antwort baut. */
function apiFehler(status: number, typ: string, text = "Fehler") {
  return Anthropic.APIError.generate(
    status,
    { type: "error", error: { type: typ, message: text } },
    text,
    new Headers({ "request-id": "req_attrappe" }),
  );
}

const ANFRAGE: ModellAnfrage = {
  modell: "claude-opus-5-5",
  system: SYSTEM_TEXTERIN,
  nutzer: "## Unterlagen\nTag der Serie: Freitag, 27. November 2026",
  schema: SCHEMA_SERIE,
  maxTokens: 16000,
  aufwand: "medium",
};

/** Anschluss-Attrappe: schreibt Anfrage und Optionen mit, liefert eine Nachricht. */
function anschluss(ergebnis: unknown | Error) {
  const aufrufe: { body: Record<string, unknown>; optionen: unknown }[] = [];
  const attrappe = {
    messages: {
      stream(body: Record<string, unknown>, optionen: unknown) {
        aufrufe.push({ body, optionen });
        return {
          async finalMessage() {
            if (ergebnis instanceof Error) throw ergebnis;
            return ergebnis;
          },
        };
      },
    },
  };
  return { aufrufe, attrappe: attrappe as unknown as AnthropicAnschluss };
}

describe("anthropicModell: die Anfrage an die API", () => {
  it("schickt Modell, Vorgabe, Material, Schema und Aufwand in der Form der API", async () => {
    const { aufrufe, attrappe } = anschluss({
      content: [{ type: "text", text: '{"titel":"Black Friday"}' }],
      stop_reason: "end_turn",
    });
    const signal = new AbortController().signal;
    const antwort = await anthropicModell(attrappe).frage({
      ...ANFRAGE,
      signal,
    });
    assert.deepEqual(antwort, {
      text: '{"titel":"Black Friday"}',
      stopp: "end_turn",
    });
    assert.equal(aufrufe.length, 1);
    assert.deepEqual(aufrufe[0].body, {
      model: "claude-opus-5-5",
      max_tokens: 16000,
      system: [
        {
          type: "text",
          text: SYSTEM_TEXTERIN,
          cache_control: { type: "ephemeral" },
        },
      ],
      messages: [{ role: "user", content: ANFRAGE.nutzer }],
      thinking: { type: "adaptive" },
      output_config: {
        effort: "medium",
        format: { type: "json_schema", schema: SCHEMA_SERIE },
      },
    });
    assert.deepEqual(aufrufe[0].optionen, { signal, maxRetries: 1 });
  });

  it("schickt nichts, was aktuelle Modelle ablehnen", async () => {
    const { aufrufe, attrappe } = anschluss({
      content: [],
      stop_reason: "end_turn",
    });
    await anthropicModell(attrappe).frage(ANFRAGE);
    const body = aufrufe[0].body;
    for (const feld of [
      "temperature",
      "top_p",
      "top_k",
      "tool_choice",
      "tools",
      "output_format",
      "stop_sequences",
    ])
      assert.ok(!(feld in body), feld);
    assert.ok(!JSON.stringify(body).includes("budget_tokens"));
    // Kein vorgefüllter Anfang der Antwort: Die letzte Nachricht ist vom Nutzer.
    const nachrichten = body.messages as { role: string }[];
    assert.equal(nachrichten.at(-1)?.role, "user");
  });

  it("liest nur den Text der Antwort, nicht das Nachdenken", async () => {
    const { attrappe } = anschluss({
      content: [
        { type: "thinking", thinking: "", signature: "sig" },
        { type: "text", text: '{"a":' },
        { type: "text", text: "1}" },
      ],
      stop_reason: "end_turn",
    });
    const antwort = await anthropicModell(attrappe).frage(ANFRAGE);
    assert.equal(antwort.text, '{"a":1}');
  });

  it("reicht den Grund fürs Aufhören durch (abgelehnt, abgeschnitten)", async () => {
    for (const stopp of ["refusal", "max_tokens", null]) {
      const { attrappe } = anschluss({ content: [], stop_reason: stopp });
      const antwort = await anthropicModell(attrappe).frage(ANFRAGE);
      assert.deepEqual(antwort, { text: "", stopp });
    }
  });

  it("wirft bei Fehlern des SDK immer einen ModellFehler", async () => {
    const { attrappe } = anschluss(apiFehler(401, "authentication_error"));
    await assert.rejects(
      anthropicModell(attrappe).frage(ANFRAGE),
      (err: unknown) =>
        err instanceof ModellFehler &&
        err.art === "schluessel" &&
        err.status === 401,
    );
    // Auch wenn schon das Absenden wirft.
    const kaputt = {
      messages: {
        stream() {
          throw new TypeError("kaputt");
        },
      },
    } as unknown as AnthropicAnschluss;
    await assert.rejects(
      anthropicModell(kaputt).frage(ANFRAGE),
      (err: unknown) => err instanceof ModellFehler && err.art === "sonst",
    );
  });

  it("der Fehler trägt weder Schlüssel noch Auftrag weiter", async () => {
    const { attrappe } = anschluss(
      apiFehler(400, "invalid_request_error", "prompt: Story-Serie geheim"),
    );
    await assert.rejects(
      anthropicModell(attrappe).frage(ANFRAGE),
      (err: unknown) => {
        assert.ok(err instanceof ModellFehler);
        assert.equal(err.message, "Modell: anfrage (400)");
        assert.equal(
          JSON.stringify(err),
          '{"art":"anfrage","status":400,"name":"ModellFehler"}',
        );
        return true;
      },
    );
  });
});

describe("modellFehlerAus: Fehler des SDK einordnen", () => {
  it("HTTP-Status", () => {
    for (const [status, typ, art] of [
      [400, "invalid_request_error", "anfrage"],
      [401, "authentication_error", "schluessel"],
      [402, "billing_error", "guthaben"],
      [403, "permission_error", "rechte"],
      [404, "not_found_error", "modell_fehlt"],
      [429, "rate_limit_error", "limit"],
      [500, "api_error", "ueberlastet"],
      [502, "api_error", "ueberlastet"],
      [529, "overloaded_error", "ueberlastet"],
      [413, "request_too_large", "sonst"],
    ] as const) {
      const fehler = modellFehlerAus(apiFehler(status, typ));
      assert.ok(fehler instanceof ModellFehler);
      assert.equal(fehler.art, art, String(status));
      assert.equal(fehler.status, status);
    }
  });

  it("nutzt die typisierten Fehlerklassen des SDK", () => {
    assert.ok(
      apiFehler(401, "authentication_error") instanceof
        Anthropic.AuthenticationError,
    );
    assert.ok(
      apiFehler(403, "permission_error") instanceof
        Anthropic.PermissionDeniedError,
    );
    assert.ok(
      apiFehler(404, "not_found_error") instanceof Anthropic.NotFoundError,
    );
    assert.ok(
      apiFehler(429, "rate_limit_error") instanceof Anthropic.RateLimitError,
    );
    assert.ok(
      apiFehler(529, "overloaded_error") instanceof
        Anthropic.InternalServerError,
    );
  });

  it("Fehler mitten im Strom: ohne Status, eingeordnet nach Typ", () => {
    const imStrom = (typ: Parameters<typeof mitTyp>[0]) =>
      modellFehlerAus(mitTyp(typ));
    function mitTyp(
      typ:
        | "overloaded_error"
        | "rate_limit_error"
        | "api_error"
        | "timeout_error"
        | "authentication_error"
        | "invalid_request_error",
    ) {
      return new Anthropic.APIError(
        undefined,
        { type: "error", error: { type: typ, message: "x" } },
        undefined,
        new Headers(),
        typ,
      );
    }
    assert.equal(imStrom("overloaded_error").art, "ueberlastet");
    assert.equal(imStrom("api_error").art, "ueberlastet");
    assert.equal(imStrom("rate_limit_error").art, "limit");
    assert.equal(imStrom("timeout_error").art, "zeit");
    assert.equal(imStrom("authentication_error").art, "schluessel");
    assert.equal(imStrom("invalid_request_error").art, "sonst");
    assert.equal(imStrom("overloaded_error").status, undefined);
  });

  it("Zeitüberschreitung, Verbindung, Abbruch", () => {
    assert.equal(
      modellFehlerAus(new Anthropic.APIConnectionTimeoutError()).art,
      "zeit",
    );
    assert.equal(
      modellFehlerAus(new Anthropic.APIConnectionError({ message: "weg" })).art,
      "verbindung",
    );
    // Abbruch durch die Frist (AbortSignal.timeout) ist „zeit“ …
    const frist = new AbortController();
    frist.abort(new DOMException("Frist", "TimeoutError"));
    assert.equal(
      modellFehlerAus(new Anthropic.APIUserAbortError(), frist.signal).art,
      "zeit",
    );
    // … Abbruch durch das Studio ist „abbruch“.
    const studio = new AbortController();
    studio.abort();
    assert.equal(
      modellFehlerAus(new Anthropic.APIUserAbortError(), studio.signal).art,
      "abbruch",
    );
    assert.equal(
      modellFehlerAus(new Anthropic.APIUserAbortError()).art,
      "abbruch",
    );
    // Abbruch, bevor das SDK überhaupt etwas geworfen hat.
    assert.equal(modellFehlerAus(new Error("x"), frist.signal).art, "zeit");
    assert.equal(modellFehlerAus(new Error("x"), studio.signal).art, "abbruch");
  });

  it("echte Frist: AbortSignal.timeout wird als „zeit“ erkannt", async () => {
    const signal = AbortSignal.timeout(1);
    await new Promise((fertig) => setTimeout(fertig, 15));
    assert.equal(
      modellFehlerAus(new Anthropic.APIUserAbortError(), signal).art,
      "zeit",
    );
  });

  it("Unbekanntes und schon Eingeordnetes", () => {
    assert.equal(modellFehlerAus(new Error("irgendwas")).art, "sonst");
    assert.equal(modellFehlerAus("kaputt").art, "sonst");
    assert.equal(modellFehlerAus(null).art, "sonst");
    const schon = new ModellFehler("abgelehnt");
    assert.equal(modellFehlerAus(schon), schon);
  });
});
