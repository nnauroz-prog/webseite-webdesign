"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { track } from "@/lib/track";

/**
 * AuditForm — eigene, schlanke Form für die Mini-Audit-Lead-Generation.
 *
 * Vier Felder: URL (Pflicht), Name (Pflicht), E-Mail (Pflicht),
 * Hinweis (optional) + Consent. Bewusst kürzer als das Haupt-
 * Anfrageformular, weil hier nur ein einzelner Mehrwert versprochen
 * wird (ehrlicher Audit innerhalb 48 h), nicht ein ganzes Projekt.
 *
 * Submit-Backend: gleiches Formspree-Setup wie InquiryForm, aber mit
 * eigenem `_subject`, damit die Mails beim Auftraggeber sauber zu
 * filtern sind („Audit-Anfrage").
 */

type FormData = {
  websiteUrl: string;
  name: string;
  email: string;
  note: string;
  consent: boolean;
  /** Honeypot — bots fill it, humans don't. */
  honeypot: string;
};

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

export function AuditForm({ formspreeId }: { formspreeId?: string }) {
  const [data, setData] = useState<FormData>({
    websiteUrl: "",
    name: "",
    email: "",
    note: "",
    consent: false,
    honeypot: "",
  });
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const normalizedUrl = data.websiteUrl.trim();
  // Strenge Hostname-Validierung: erlaubt nur RFC-konforme Domain-
  // Komponenten (Buchstabe oder Ziffer am Anfang/Ende, Bindestriche
  // dazwischen) und verlangt eine echte TLD ≥ 2 Buchstaben. Verhindert
  // Müll-Submits wie „..de", „test-.de" oder „.test.de".
  const hostnamePart = normalizedUrl
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .toLowerCase();
  const urlOk =
    hostnamePart.length > 3 &&
    /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/.test(hostnamePart);
  const emailOk = /\S+@\S+\.\S+/.test(data.email);
  const nameOk = data.name.trim().length >= 2;
  const canSubmit =
    urlOk && emailOk && nameOk && data.consent && status.kind !== "submitting";

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    // Doppel-Submit-Schutz analog zu InquiryForm.
    if (status.kind === "submitting" || status.kind === "success") return;
    if (!canSubmit) return;

    if (!formspreeId) {
      setStatus({
        kind: "error",
        message:
          "Audit-Empfänger ist nicht konfiguriert. Bitte später erneut versuchen oder direkt an info@sitalo.de schreiben.",
      });
      return;
    }

    if (data.honeypot.trim() !== "") {
      setStatus({ kind: "success" });
      return;
    }

    setStatus({ kind: "submitting" });

    const cleanedUrl = normalizedUrl.startsWith("http")
      ? normalizedUrl
      : `https://${normalizedUrl}`;

    const payload: Record<string, unknown> = {
      "Audit-URL": cleanedUrl,
      Name: data.name,
      "E-Mail": data.email,
      _subject: `Audit-Anfrage von ${data.name} für ${cleanedUrl}`,
      _replyto: data.email,
    };
    if (data.note.trim()) payload.Hinweis = data.note.trim();

    try {
      const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setStatus({ kind: "success" });
        track("Audit");
      } else {
        // Formspree-Antwort als Plain-Text behandeln: HTML-Tags strippen
        // und auf 200 Zeichen kürzen.
        const text = await response.text().catch(() => "");
        const safeText = text.replace(/<[^>]*>/g, "").trim().slice(0, 200);
        setStatus({
          kind: "error",
          message:
            safeText ||
            "Audit-Anfrage fehlgeschlagen. Bitte erneut versuchen oder direkt an info@sitalo.de schreiben.",
        });
      }
    } catch (err) {
      setStatus({
        kind: "error",
        message:
          err instanceof Error
            ? `Netzwerkfehler: ${err.message}`
            : "Audit konnte gerade nicht gesendet werden. Bitte versuchen Sie es erneut.",
      });
    }
  }

  if (status.kind === "success") {
    return (
      <div className="border-border/60 bg-card/60 ring-foreground/5 rounded-2xl border p-8 text-center ring-1">
        <span
          aria-hidden="true"
          className="bg-gold/15 text-foreground mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full"
        >
          <Check className="h-5 w-5" />
        </span>
        <p className="serif text-foreground mt-5 text-balance text-2xl leading-snug tracking-[-0.01em]">
          Wir gucken uns das an.
        </p>
        <p className="text-muted-foreground mx-auto mt-3 max-w-md text-pretty text-[14.5px] leading-relaxed">
          Sie bekommen innerhalb von 48 Stunden eine persönliche E-Mail —
          drei bis fünf konkrete Punkte, was an Ihrer Seite gut läuft
          und was wir an Ihrer Stelle als Erstes anfassen würden.
        </p>
        <p className="text-muted-foreground/70 mt-6 font-mono text-[10px] uppercase tracking-[0.2em]">
          Aus Hamburg · meist schneller als 48 h
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="border-border/60 bg-card/60 ring-foreground/5 space-y-5 rounded-2xl border p-6 ring-1 sm:p-8"
    >
      <div>
        <Label htmlFor="audit-url" className="text-foreground text-sm">
          Ihre aktuelle Website
        </Label>
        <Input
          id="audit-url"
          type="text"
          inputMode="url"
          autoComplete="url"
          placeholder="z. B. cafe-nordlicht.de"
          value={data.websiteUrl}
          onChange={(e) => setData({ ...data, websiteUrl: e.target.value })}
          className="mt-2"
          required
        />
        <p className="text-muted-foreground mt-1.5 text-[12.5px]">
          Mit oder ohne https:// — wir richten das.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="audit-name" className="text-foreground text-sm">
            Ihr Name
          </Label>
          <Input
            id="audit-name"
            type="text"
            autoComplete="name"
            placeholder="Max Mustermann"
            value={data.name}
            onChange={(e) => setData({ ...data, name: e.target.value })}
            className="mt-2"
            required
          />
        </div>
        <div>
          <Label htmlFor="audit-email" className="text-foreground text-sm">
            E-Mail
          </Label>
          <Input
            id="audit-email"
            type="email"
            autoComplete="email"
            placeholder="max@cafe-nordlicht.de"
            value={data.email}
            onChange={(e) => setData({ ...data, email: e.target.value })}
            className="mt-2"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="audit-note" className="text-foreground text-sm">
          Worauf sollen wir besonders gucken? (optional)
        </Label>
        <Textarea
          id="audit-note"
          rows={3}
          placeholder="z. B. ‚Die Speisekarte ist veraltet' oder ‚Telefon wird auf Mobil nicht angezeigt'."
          value={data.note}
          onChange={(e) => setData({ ...data, note: e.target.value })}
          className="mt-2"
        />
      </div>

      {/* Honeypot — visuell unsichtbar für Menschen, fängt Bots ab. */}
      <div className="hidden" aria-hidden="true">
        <label>
          Website
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={data.honeypot}
            onChange={(e) => setData({ ...data, honeypot: e.target.value })}
          />
        </label>
      </div>

      <label className="flex items-start gap-3 text-[13.5px] leading-relaxed">
        <input
          type="checkbox"
          checked={data.consent}
          onChange={(e) => setData({ ...data, consent: e.target.checked })}
          className="border-border accent-foreground mt-1 h-4 w-4 rounded border"
          required
        />
        <span className="text-foreground/80">
          Ich bin damit einverstanden, dass meine Angaben für die
          Bearbeitung der Audit-Anfrage gespeichert werden. Details in
          der{" "}
          <a
            href="/datenschutz"
            className="text-foreground underline underline-offset-4"
          >
            Datenschutzerklärung
          </a>
          .
        </span>
      </label>

      {status.kind === "error" && (
        <Alert variant="destructive">
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center sm:gap-4">
        <Button
          type="submit"
          disabled={!canSubmit}
          className="bg-foreground text-background hover:bg-foreground/90 group h-12 rounded-full px-6 text-[15px] font-medium tracking-tight"
        >
          {status.kind === "submitting" ? "Wird gesendet…" : "Audit anfordern"}
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
        <p className="text-muted-foreground text-[12.5px]">
          Kostenlos, einmalig, ohne Vertriebs-Anruf danach.
        </p>
      </div>
    </form>
  );
}
