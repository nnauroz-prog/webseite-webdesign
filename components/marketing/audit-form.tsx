"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitLead } from "@/lib/submit-lead";
import { track } from "@/lib/track";

/**
 * AuditForm — eigene, schlanke Form für die Mini-Audit-Lead-Generation.
 *
 * Vier Felder: URL (Pflicht), Name (Pflicht), E-Mail (Pflicht),
 * Hinweis (optional) + Consent. Bewusst kürzer als das Haupt-
 * Anfrageformular, weil hier nur ein einzelner Mehrwert versprochen
 * wird (Audit innerhalb 48 h), nicht ein ganzes Projekt.
 *
 * Versand über /api/anfrage (siehe lib/lead-mail.ts), eigener
 * Betreff „Audit-Anfrage …" zum Filtern im Postfach.
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

const FIELD = "mt-2.5 h-12 rounded-[2px] text-[16px] shadow-none";
const LABEL = "text-foreground text-[15px] font-semibold";

export function AuditForm() {
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

    setStatus({ kind: "submitting" });

    const cleanedUrl = normalizedUrl.startsWith("http")
      ? normalizedUrl
      : `https://${normalizedUrl}`;

    const result = await submitLead({
      kind: "audit",
      subject: `Audit-Anfrage von ${data.name} für ${cleanedUrl}`,
      replyTo: data.email,
      hp: data.honeypot,
      fields: [
        ["Audit-URL", cleanedUrl],
        ["Name", data.name],
        ["E-Mail", data.email],
        ["Hinweis", data.note],
      ],
    });

    if (result.ok) {
      setStatus({ kind: "success" });
      track("Audit");
    } else {
      setStatus({ kind: "error", message: result.error });
    }
  }

  if (status.kind === "success") {
    return (
      <div
        role="status"
        className="bg-card border-border rounded-[3px] border"
      >
        <div className="flex items-start gap-4 p-6 sm:p-8">
          <span
            aria-hidden="true"
            className="bg-ink-petrol text-background inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[2px]"
          >
            <Check className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="serif text-foreground text-balance text-[1.6rem] leading-[1.1] tracking-[-0.02em] sm:text-[2rem]">
              Die Adresse ist bei uns angekommen.
            </p>
            <p className="text-muted-foreground mt-4 max-w-xl text-pretty text-[15px] leading-relaxed">
              Innerhalb von 48 Stunden bekommen Sie eine E-Mail mit drei bis
              fünf Punkten: was an Ihrer Seite funktioniert und was wir zuerst
              ändern würden. Oft geht es schneller. Wann wir antworten, steht
              unter{" "}
              <Link
                href="/erreichbarkeit"
                className="text-foreground underline underline-offset-4"
              >
                Erreichbarkeit
              </Link>
              .
            </p>
          </div>
        </div>
        <div className="border-border border-t px-6 py-6 sm:px-8">
          <p className="text-foreground/85 max-w-xl text-pretty text-[14.5px] leading-relaxed">
            Wenn Sie vorher sprechen möchten, buchen Sie ein Erstgespräch. Wie
            unsere Preise zustande kommen, steht auf der Honorar-Seite.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="/termin" className="btn-signal h-12 text-[15px]">
              Termin wählen
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/honorar"
              className="text-foreground text-[15px] font-semibold underline-offset-4 hover:underline"
            >
              Honorar lesen
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="bg-card border-border rounded-[3px] border"
    >
      <div className="space-y-6 p-5 sm:p-8">
        <div>
          <Label htmlFor="audit-url" className={LABEL}>
            Ihre Website
          </Label>
          <Input
            id="audit-url"
            type="text"
            inputMode="url"
            autoComplete="url"
            placeholder="z. B. cafe-nordlicht.de"
            value={data.websiteUrl}
            onChange={(e) => setData({ ...data, websiteUrl: e.target.value })}
            className={FIELD}
            required
          />
          <p className="text-muted-foreground mt-2 text-[13px]">
            Mit oder ohne https://, beides geht.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 sm:gap-5">
          <div className="min-w-0">
            <Label htmlFor="audit-name" className={LABEL}>
              Ihr Name
            </Label>
            <Input
              id="audit-name"
              type="text"
              autoComplete="name"
              placeholder="Vor- und Nachname"
              value={data.name}
              onChange={(e) => setData({ ...data, name: e.target.value })}
              className={FIELD}
              required
            />
          </div>
          <div className="min-w-0">
            <Label htmlFor="audit-email" className={LABEL}>
              E-Mail
            </Label>
            <Input
              id="audit-email"
              type="email"
              autoComplete="email"
              placeholder="ihre@adresse.de"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
              className={FIELD}
              required
            />
          </div>
        </div>

        <div>
          <Label htmlFor="audit-note" className={LABEL}>
            Worauf sollen wir achten?{" "}
            <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <Textarea
            id="audit-note"
            rows={3}
            placeholder="z. B. „Die Speisekarte ist veraltet“ oder „Am Handy fehlt die Telefonnummer“."
            value={data.note}
            onChange={(e) => setData({ ...data, note: e.target.value })}
            className="mt-2.5 rounded-[2px] text-[16px] shadow-none sm:text-[15px]"
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
            className="border-border accent-foreground mt-1 h-4 w-4 shrink-0 rounded-[2px] border"
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
          <Alert variant="destructive" className="rounded-[3px]">
            <AlertDescription>{status.message}</AlertDescription>
          </Alert>
        )}
      </div>

      <div className="border-border flex flex-col items-stretch gap-3 border-t px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-8">
        <p className="text-muted-foreground text-[13.5px]">
          Kostenlos. Die Antwort kommt per E-Mail.
        </p>
        <button
          type="submit"
          disabled={!canSubmit}
          className="btn-signal h-12 shrink-0 text-[15px]"
        >
          {status.kind === "submitting" ? "Wird gesendet…" : "Audit anfordern"}
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}
