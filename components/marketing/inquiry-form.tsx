"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { submitInquiryAction } from "@/lib/actions/inquiries";
import { initialInquiryState } from "@/lib/actions/states";
import {
  INQUIRY_BUDGETS,
  INQUIRY_NEEDS,
  INQUIRY_TIMEFRAMES,
  type InquiryNeed,
} from "@/lib/validations/inquiries";

const NEED_LABELS: Record<InquiryNeed, string> = {
  "neue-website": "Neue Website",
  redesign: "Redesign",
  onepager: "Onepager",
  mehrseitig: "Mehrseitige Website",
  kundenbereich: "Kundenbereich",
  speisekarte: "Speisekarte / Wochenangebot",
  kontaktformular: "Kontaktformular",
  bewerbungsformular: "Bewerbungsformular",
  buchung: "Buchung / Reservierung",
  "maps-oeffnungszeiten": "Google Maps / Öffnungszeiten",
  seo: "SEO-Grundlagen",
};

const TIMEFRAME_LABELS: Record<(typeof INQUIRY_TIMEFRAMES)[number], string> = {
  asap: "So schnell wie möglich",
  "2-wochen": "Innerhalb von 2 Wochen",
  "1-monat": "Innerhalb von 1 Monat",
  spaeter: "Später",
  offen: "Noch offen",
};

const BUDGET_LABELS: Record<(typeof INQUIRY_BUDGETS)[number], string> = {
  "unter-1000": "Unter 1.000 €",
  "1000-2000": "1.000 – 2.000 €",
  "2000-5000": "2.000 – 5.000 €",
  "ueber-5000": "Über 5.000 €",
  offen: "Noch offen",
};

export function InquiryForm() {
  const [state, formAction] = useActionState(
    submitInquiryAction,
    initialInquiryState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [hasWebsite, setHasWebsite] = useState<"ja" | "nein">("nein");

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state]);

  if (state.status === "success") {
    return (
      <div className="bg-card ring-border/50 rounded-3xl border p-10 shadow-xl ring-1 text-center">
        <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            className="h-7 w-7"
            aria-hidden="true"
          >
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Anfrage angekommen.
        </h2>
        <p className="text-muted-foreground mt-3 text-pretty">
          {state.message}
        </p>
        <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm">
          In der Zwischenzeit kannst du dir gerne unsere{" "}
          <Link href="/#beispiele" className="hover:text-foreground underline">
            Beispiele
          </Link>{" "}
          ansehen.
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      action={formAction}
      className="bg-card ring-border/50 space-y-7 rounded-3xl border p-8 shadow-xl ring-1 sm:p-10"
    >
      {/* Honeypot */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-9999px] h-0 w-0 overflow-hidden"
      >
        <label htmlFor="inq-website_url">Website (bitte leer lassen)</label>
        <input
          id="inq-website_url"
          name="website_url"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {state.status === "error" && state.message && (
        <Alert variant="destructive">
          <AlertDescription>{state.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Name"
          required
          name="name"
          autoComplete="name"
          maxLength={120}
          error={state.fieldErrors?.name}
        />
        <Field
          label="Firma"
          name="company"
          autoComplete="organization"
          maxLength={120}
          error={state.fieldErrors?.company}
        />
        <Field
          label="Branche"
          name="industry"
          placeholder="z.B. Pflegedienst"
          maxLength={60}
          error={state.fieldErrors?.industry}
        />
        <Field
          label="Telefon"
          name="phone"
          type="tel"
          autoComplete="tel"
          maxLength={40}
          error={state.fieldErrors?.phone}
        />
        <Field
          label="E-Mail"
          required
          name="email"
          type="email"
          autoComplete="email"
          className="sm:col-span-2"
          error={state.fieldErrors?.email}
        />
      </div>

      <fieldset>
        <legend className="text-sm font-medium">Bestehende Website?</legend>
        <div className="mt-3 flex gap-2">
          {(["nein", "ja"] as const).map((value) => (
            <label
              key={value}
              className={`inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
                hasWebsite === value
                  ? "bg-foreground text-background border-foreground"
                  : "border-border bg-background hover:bg-secondary"
              }`}
            >
              <input
                type="radio"
                name="has_website"
                value={value}
                checked={hasWebsite === value}
                onChange={() => setHasWebsite(value)}
                className="sr-only"
              />
              {value === "ja" ? "Ja" : "Nein"}
            </label>
          ))}
        </div>
        {hasWebsite === "ja" && (
          <div className="mt-4">
            <Field
              label="URL deiner Website"
              name="current_website"
              placeholder="https://…"
              autoCapitalize="none"
              spellCheck={false}
              error={state.fieldErrors?.current_website}
            />
          </div>
        )}
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium">Was wird benötigt?</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {INQUIRY_NEEDS.map((need) => (
            <label
              key={need}
              className="border-border bg-background hover:bg-secondary inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors has-[input:checked]:bg-foreground has-[input:checked]:text-background has-[input:checked]:border-foreground"
            >
              <input
                type="checkbox"
                name="needs"
                value={need}
                className="sr-only"
              />
              {NEED_LABELS[need]}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          label="Wunschzeitraum"
          name="timeframe"
          options={INQUIRY_TIMEFRAMES.map((v) => ({
            value: v,
            label: TIMEFRAME_LABELS[v],
          }))}
          error={state.fieldErrors?.timeframe}
        />
        <SelectField
          label="Budget (grob)"
          name="budget"
          options={INQUIRY_BUDGETS.map((v) => ({
            value: v,
            label: BUDGET_LABELS[v],
          }))}
          error={state.fieldErrors?.budget}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="inq-message">
          Nachricht
          <span className="text-muted-foreground ml-2 text-xs font-normal">
            (optional)
          </span>
        </Label>
        <Textarea
          id="inq-message"
          name="message"
          rows={4}
          maxLength={4000}
          placeholder="Was sollen wir wissen? Was ist dir wichtig?"
        />
        {state.fieldErrors?.message && (
          <p className="text-destructive text-sm">{state.fieldErrors.message}</p>
        )}
      </div>

      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          name="consent"
          required
          className="mt-1 h-4 w-4 shrink-0"
        />
        <span className="text-muted-foreground leading-relaxed">
          Ich habe die{" "}
          <Link
            href="/datenschutz"
            className="hover:text-foreground underline"
          >
            Datenschutzerklärung
          </Link>{" "}
          gelesen und akzeptiere die Verarbeitung meiner Daten zur Bearbeitung
          dieser Anfrage.
        </span>
      </label>
      {state.fieldErrors?.consent && (
        <p className="text-destructive -mt-3 text-sm">
          {state.fieldErrors.consent}
        </p>
      )}

      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <SubmitButton
          label="Anfrage senden"
          pendingLabel="Wird gesendet …"
        />
        <p className="text-muted-foreground text-xs">
          Antwort innerhalb von 24 Stunden, persönlich.
        </p>
      </div>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  autoComplete,
  maxLength,
  className,
  error,
  autoCapitalize,
  spellCheck,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  maxLength?: number;
  className?: string;
  error?: string;
  autoCapitalize?: "none" | "sentences" | "words";
  spellCheck?: boolean;
}) {
  const id = `inq-${name}`;
  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      <Label htmlFor={id}>
        {label}
        {required ? null : (
          <span className="text-muted-foreground ml-2 text-xs font-normal">
            (optional)
          </span>
        )}
      </Label>
      <Input
        id={id}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
        autoCapitalize={autoCapitalize}
        spellCheck={spellCheck}
        aria-invalid={Boolean(error) || undefined}
      />
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
  error,
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  error?: string;
}) {
  const id = `inq-${name}`;
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <select
        id={id}
        name={name}
        defaultValue=""
        className="border-input bg-background h-10 w-full rounded-md border px-3 py-2 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <option value="">Bitte wählen</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-destructive text-sm">{error}</p>}
    </div>
  );
}
