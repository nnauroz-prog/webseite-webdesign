"use client";

import Link from "next/link";
import {
  type FormEvent,
  type KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ArrowUp, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

type ChatRole = "user" | "assistant";
type ChatMessage = { id: string; role: ChatRole; content: string };

const SUGGESTIONS: { label: string; prompt: string }[] = [
  {
    label: "Was kostet eine Website?",
    prompt: "Was kostet eine Website bei Ihnen?",
  },
  {
    label: "Wie schnell ist sie fertig?",
    prompt: "Wie schnell ist meine Website fertig?",
  },
  {
    label: "Für meine Branche geeignet?",
    prompt:
      "Ich habe einen Pflegedienst — was würden Sie für meine Branche bauen?",
  },
];

const GREETING =
  "Hallo — fragen Sie uns gerne, was eine Website bei uns kostet, wie schnell wir bauen oder was wir für Ihre Branche typischerweise machen.";

function makeId(): string {
  if (
    typeof crypto !== "undefined" &&
    "randomUUID" in crypto &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

/**
 * Wandelt URL-Pfade im Antworttext (/anfrage, /pakete/business, mailto:...)
 * in Next/Link-Knoten um. Bewusst klein gehalten — wir parsen kein Markdown,
 * der System-Prompt produziert ohnehin sehr knappe Antworten.
 */
function renderAssistantText(text: string) {
  const pattern = /(\/(?:[a-z0-9-]+)(?:\/[a-z0-9-]+)*|mailto:[^\s)]+)/g;
  const parts = text.split(pattern);
  return parts.map((part, idx) => {
    if (!part) return null;
    if (part.startsWith("mailto:")) {
      return (
        <a
          key={idx}
          href={part}
          className="text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
        >
          {part.replace("mailto:", "")}
        </a>
      );
    }
    if (part.startsWith("/") && part.length > 1) {
      return (
        <Link
          key={idx}
          href={part}
          className="text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
        >
          {part}
        </Link>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

export function HeroChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const hasMessages = messages.length > 0;

  // Auto-scroll während Tokens reinkommen.
  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, streaming]);

  // Auf Unmount laufenden Request abbrechen.
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  async function sendPrompt(promptText: string) {
    const trimmed = promptText.trim();
    if (!trimmed || streaming) return;

    setError(null);
    const userMsg: ChatMessage = {
      id: makeId(),
      role: "user",
      content: trimmed,
    };
    const assistantId = makeId();
    const assistantPlaceholder: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
    };

    // Vor dem Senden: Snapshot der bisherigen Konversation für die API.
    const historyForApi = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    setMessages((prev) => [...prev, userMsg, assistantPlaceholder]);
    setInput("");
    setStreaming(true);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        signal: controller.signal,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: historyForApi }),
      });

      if (!res.ok || !res.body) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `Status ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let totalLength = 0;

      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        if (!chunk) continue;
        totalLength += chunk.length;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + chunk } : m,
          ),
        );
      }

      // Wenn der Stream ohne Inhalt endet, ruhige Fallback-Antwort.
      if (totalLength === 0) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? {
                  ...m,
                  content:
                    "Sorry, wir haben gerade keine Antwort bekommen. Schreiben Sie uns gerne an info@sitalo.de oder direkt über /anfrage.",
                }
              : m,
          ),
        );
      }
    } catch (err) {
      if ((err as { name?: string })?.name === "AbortError") {
        // bewusst abgebrochen — nichts tun
      } else {
        setError(
          "Verbindung unterbrochen. Bitte gleich noch einmal versuchen, oder direkt an info@sitalo.de schreiben.",
        );
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      }
    } finally {
      setStreaming(false);
      abortRef.current = null;
      // Fokus bleibt auf dem Input für die nächste Frage.
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendPrompt(input);
  }

  function onTextareaKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendPrompt(input);
    }
  }

  // Höhe des Textareas wächst mit dem Inhalt, max ~ 5 Zeilen.
  useEffect(() => {
    const el = inputRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  }, [input]);

  const greeting = useMemo(
    () => (
      <div className="text-muted-foreground space-y-3 text-[15px] leading-relaxed">
        <p>{GREETING}</p>
      </div>
    ),
    [],
  );

  return (
    <div
      className={cn(
        "border-border/60 bg-card/80 ring-foreground/5 relative flex flex-col overflow-hidden rounded-3xl border shadow-[0_24px_60px_-30px_rgb(0_0_0/0.25)] ring-1 backdrop-blur-sm",
        "transition-shadow duration-500",
      )}
    >
      <div className="border-border/60 flex items-center gap-2.5 border-b px-5 py-3.5">
        <span className="bg-foreground text-background inline-flex h-7 w-7 items-center justify-center rounded-full">
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-foreground truncate text-[13px] font-medium tracking-tight">
            Sitalo Assistent
          </p>
          <p className="text-muted-foreground truncate text-[11px]">
            Beantwortet Ihre Fragen zu Preis, Ablauf, Branchen.
          </p>
        </div>
        <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-medium tracking-tight text-emerald-600">
          <span className="relative inline-flex h-2 w-2">
            <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Online
        </span>
      </div>

      <div
        ref={listRef}
        className="flex max-h-[26rem] min-h-[10rem] flex-col gap-4 overflow-y-auto px-5 py-5"
        aria-live="polite"
      >
        {!hasMessages ? greeting : null}

        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "flex w-full",
              m.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={cn(
                "max-w-[88%] whitespace-pre-wrap text-[15px] leading-relaxed",
                m.role === "user"
                  ? "bg-foreground text-background rounded-2xl rounded-br-md px-4 py-2.5"
                  : "text-foreground/90",
              )}
            >
              {m.role === "assistant" ? (
                <>
                  {m.content
                    ? renderAssistantText(m.content)
                    : null}
                  {m.role === "assistant" &&
                  streaming &&
                  m === messages[messages.length - 1] ? (
                    <span
                      className="bg-foreground/60 ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse"
                      aria-hidden="true"
                    />
                  ) : null}
                </>
              ) : (
                m.content
              )}
            </div>
          </div>
        ))}
      </div>

      {!hasMessages ? (
        <div className="border-border/60 flex flex-wrap gap-2 border-t px-5 py-3">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              type="button"
              onClick={() => void sendPrompt(s.prompt)}
              className="border-border/70 bg-background hover:bg-secondary text-foreground/80 hover:text-foreground rounded-full border px-3 py-1.5 text-[12.5px] font-medium tracking-tight transition-colors"
            >
              {s.label}
            </button>
          ))}
        </div>
      ) : null}

      <form
        onSubmit={onSubmit}
        className="border-border/60 flex items-end gap-2 border-t bg-background/60 px-3 py-3 sm:px-4"
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onTextareaKeyDown}
          placeholder="Fragen Sie etwas zu Preis, Ablauf, Branchen…"
          rows={1}
          maxLength={1500}
          disabled={streaming}
          className="text-foreground placeholder:text-muted-foreground/80 max-h-[140px] min-h-[40px] w-full resize-none bg-transparent px-2 py-2 text-[15px] leading-relaxed outline-none disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={streaming || !input.trim()}
          aria-label="Senden"
          className="bg-foreground text-background hover:bg-foreground/90 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors disabled:opacity-40"
        >
          <ArrowUp className="h-4 w-4" aria-hidden="true" />
        </button>
      </form>

      {error ? (
        <p className="bg-background border-border/60 text-muted-foreground border-t px-5 py-2.5 text-[12.5px]">
          {error}
        </p>
      ) : null}

      <p className="text-muted-foreground/80 border-border/60 border-t px-5 py-2 text-[11px] leading-relaxed">
        Antworten sind KI-generiert und können Fehler enthalten. Für ein
        verbindliches Angebot:{" "}
        <Link
          href="/anfrage"
          className="text-foreground underline underline-offset-4"
        >
          /anfrage
        </Link>
        .
      </p>
    </div>
  );
}
