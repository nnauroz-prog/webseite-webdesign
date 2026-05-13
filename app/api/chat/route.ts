/**
 * POST /api/chat — Streaming-Antwort vom Sitalo-Assistenten.
 *
 * Nimmt eine Liste von Chat-Nachrichten entgegen und streamt die
 * Antwort als Plain-Text-Body zurück (chunked, kein SSE-Framing).
 *
 * Modell: claude-opus-4-7 mit adaptive thinking. Der System-Prompt
 * ist statisch (alle Branchen + Pakete inline) und wird via
 * prompt-caching auf der Anthropic-Seite zwischengespeichert.
 */

import Anthropic from "@anthropic-ai/sdk";

import { buildSystemPrompt } from "@/lib/chat-system-prompt";

export const runtime = "nodejs";

// Statisch zur Build-Zeit gerendert — wird in jedem Request 1:1 wieder
// als gleicher String verwendet (= voller Cache-Hit auf Anthropic-Seite).
const SYSTEM_PROMPT = buildSystemPrompt();

const MAX_MESSAGES = 16;
const MAX_CHARS_PER_MESSAGE = 1500;
const MAX_OUTPUT_TOKENS = 600;

type IncomingMessage = {
  role: "user" | "assistant";
  content: string;
};

function badRequest(message: string): Response {
  return new Response(message, {
    status: 400,
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}

export async function POST(request: Request): Promise<Response> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(
      "Der Assistent ist gerade nicht erreichbar. Schreiben Sie uns gerne direkt an info@sitalo.de.",
      {
        status: 503,
        headers: { "content-type": "text/plain; charset=utf-8" },
      },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return badRequest("Ungültige Anfrage.");
  }

  const rawMessages =
    payload && typeof payload === "object" && "messages" in payload
      ? (payload as { messages: unknown }).messages
      : null;

  if (!Array.isArray(rawMessages) || rawMessages.length === 0) {
    return badRequest("Keine Nachricht erhalten.");
  }
  if (rawMessages.length > MAX_MESSAGES) {
    return badRequest("Zu viele Nachrichten — bitte laden Sie die Seite neu.");
  }

  const cleanMessages: IncomingMessage[] = [];
  for (const raw of rawMessages) {
    if (!raw || typeof raw !== "object") continue;
    const role = (raw as { role?: unknown }).role;
    const content = (raw as { content?: unknown }).content;
    if (role !== "user" && role !== "assistant") continue;
    if (typeof content !== "string") continue;
    const trimmed = content.trim().slice(0, MAX_CHARS_PER_MESSAGE);
    if (!trimmed) continue;
    cleanMessages.push({ role, content: trimmed });
  }

  if (
    cleanMessages.length === 0 ||
    cleanMessages[cleanMessages.length - 1].role !== "user"
  ) {
    return badRequest("Letzte Nachricht muss vom Nutzer kommen.");
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        const apiStream = anthropic.messages.stream({
          model: "claude-opus-4-7",
          max_tokens: MAX_OUTPUT_TOKENS,
          system: [
            {
              type: "text",
              text: SYSTEM_PROMPT,
              cache_control: { type: "ephemeral" },
            },
          ],
          messages: cleanMessages,
          thinking: { type: "adaptive" },
        });

        for await (const event of apiStream) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
        controller.close();
      } catch (error) {
        // Auf der Server-Seite loggen, im Browser nur eine ruhige Meldung.
        console.error("[chat] stream error", error);
        try {
          controller.enqueue(
            encoder.encode(
              "\n\nLeider ist gerade etwas schiefgelaufen. Schreiben Sie uns gerne an info@sitalo.de — wir melden uns innerhalb von 24 Stunden.",
            ),
          );
        } catch {
          // ignore — Stream evtl. schon geschlossen
        }
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-cache, no-store, no-transform",
      "x-content-type-options": "nosniff",
    },
  });
}
