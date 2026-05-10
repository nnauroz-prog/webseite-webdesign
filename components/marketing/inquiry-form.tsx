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
  INQUIRY_NEEDS,
  INQUIRY_SPECIAL_FEATURES,
  INQUIRY_TIMEFRAMES,
  type InquiryNeed,
  type InquiryPackage,
  type InquirySpecialFeature,
} from "@/lib/validations/inquiries";

const NEED_LABELS: Record<InquiryNeed, string> = {
  "neue-website": "Neue Website",
  redesign: "Redesign",
  onepager: "Onepager",
  mehrseitig: "Mehrseitige Website",
  kundenbereich: "Kundenbereich",
  speisekarte: "Speisekarte / Wochenangebot",
  bewerbungsformular: "Bewerbungsformular",
  kontaktformular: "Kontaktformular",
};

const TIMEFRAME_LABELS: Record<(typeof INQUIRY_TIMEFRAMES)[number], string> = {
  asap: "So schnell wie möglich",
  "2-wochen": "Innerhalb von 2 Wochen",
  "1-monat": "Innerhalb von 1 Monat",
  spaeter: "Später",
  offen: "Noch offen",
};

const SPECIAL_LABELS: Record<InquirySpecialFeature, string> = {
  kundenbereich: "Kundenbereich",
  speisekarte: "Speisekarte / Wochenangebot",
  bewerbungsformular: "Bewerbungsformular",
  "whatsapp-button": "WhatsApp-Button",
  "google-maps": "Google Maps",
  "online-reservierung": "Online-Reservierung",
  "mehrere-unterseiten": "Mehrere Unterseiten",
  "seo-erweiterung": "SEO-Erweiterung",
  mehrsprachigkeit: "Mehrsprachigkeit",
  unsicher: "Noch unsicher",
};

type PackageCard = {
  value: InquiryPackage;
  title: string;
  priceLine: string;
  description: string;
  benefits: string[];
};

const PACKAGES: PackageCard[] = [
  {
    value: "starter",
    title: "Starter-Projekt",
    priceLine: "ab 499 € einmalig + ab 49 € / Monat",
    description: "Für einfache professionelle Onepager.",
    benefits: ["Onepage-Website", "Kontaktformular", "Mobil optimiert"],
  },
  {
    value: "business",
    title: "Business-Auftritt",
    priceLine: "ab 899 € einmalig + ab 79 € / Monat",
    description:
      "Für hochwertige Unternehmenswebseiten mit mehreren Bereichen.",
    benefits: ["Mehrere Sektionen", "SEO-Grundlagen", "Laufende Betreuung"],
  },
  {
    value: "premium",
    title: "Premium-System",
    priceLine: "ab 1.499 € einmalig + ab 129 € / Monat",
    description:
      "Für individuelle Websites mit Kundenbereich oder verwaltbaren Inhalten.",
    benefits: [
      "Kundenbereich",
      "Verwaltbare Inhalte",
      "Premium-Design",
    ],
  },
  {
    value: "unsicher",
    title: "Ich bin unsicher",
    priceLine: "Bitte empfehlen",
    description: "Wir empfehlen Ihnen das passende Paket nach Ihrer Anfrage.",
    benefits: [],
  },
];

export function InquiryForm({
  initialPackage,
}: {
  initialPackage?: InquiryPackage;
}) {
  const [state, formAction] = useActionState(
    submitInquiryAction,
    initialInquiryState,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [hasWebsite, setHasWebsite] = useState<"ja" | "nein">("nein");
  const [selectedPackage, setSelectedPackage] = useState<
    InquiryPackage | null
  >(initialPackage ?? null);

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
          <Link href="/#passt-zu-ihnen" className="hover:text-foreground underline">
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
      className="bg-card ring-border/50 space-y-8 rounded-3xl border p-8 shadow-xl ring-1 sm:p-10"
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

      {/* 1. Contact */}
      <FormSection step="01" title="Kontaktdaten">
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
      </FormSection>

      {/* 2. Existing website */}
      <FormSection step="02" title="Bestehende Website">
        <div className="flex gap-2">
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
              label="URL Ihrer aktuellen Website"
              name="current_website"
              placeholder="https://…"
              autoCapitalize="none"
              spellCheck={false}
              error={state.fieldErrors?.current_website}
            />
          </div>
        )}
      </FormSection>

      {/* 3. Project type / needs */}
      <FormSection step="03" title="Was wird benötigt?">
        <div className="flex flex-wrap gap-2">
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
      </FormSection>

      {/* 4. Package interest */}
      <FormSection
        step="04"
        title="Welches Paket interessiert Sie?"
        description="Wählen Sie das Paket, das am ehesten passt. Falls Sie unsicher sind, empfehlen wir Ihnen das richtige nach Ihrer Anfrage."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {PACKAGES.map((pkg) => {
            const selected = selectedPackage === pkg.value;
            return (
              <label
                key={pkg.value}
                className={`group relative flex cursor-pointer flex-col rounded-2xl border-2 p-5 text-left transition-all ${
                  selected
                    ? "border-foreground bg-foreground/5 shadow-md"
                    : "border-border bg-background hover:border-foreground/40 hover:bg-secondary/40"
                }`}
              >
                <input
                  type="radio"
                  name="selected_package"
                  value={pkg.value}
                  checked={selected}
                  onChange={() => setSelectedPackage(pkg.value)}
                  className="sr-only"
                />
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h4 className="text-base font-semibold tracking-tight">
                      {pkg.title}
                    </h4>
                    <p
                      className={`mt-1 text-xs font-medium ${
                        selected
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }`}
                    >
                      {pkg.priceLine}
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className={`mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                      selected
                        ? "border-foreground bg-foreground"
                        : "border-border"
                    }`}
                  >
                    {selected ? (
                      <span className="bg-background h-2 w-2 rounded-full" />
                    ) : null}
                  </span>
                </div>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  {pkg.description}
                </p>
                {pkg.benefits.length > 0 ? (
                  <ul className="text-muted-foreground mt-3 space-y-1 text-xs">
                    {pkg.benefits.map((b) => (
                      <li key={b} className="flex items-center gap-1.5">
                        <span className="bg-primary inline-block h-1 w-1 rounded-full" />
                        {b}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </label>
            );
          })}
        </div>

        {selectedPackage === "unsicher" ? (
          <p className="bg-secondary/40 border-border/60 mt-4 rounded-lg border px-4 py-3 text-sm leading-relaxed">
            Kein Problem. Wir prüfen Ihre Angaben und empfehlen Ihnen das
            passende Paket — kostenlos und unverbindlich.
          </p>
        ) : null}

        <p className="text-muted-foreground mt-4 text-xs leading-relaxed">
          Die genannten Preise sind Einstiegspreise. Der finale Preis hängt vom
          Umfang, vorhandenen Inhalten und gewünschten Funktionen ab. Sie
          erhalten nach Ihrer Anfrage eine klare Einschätzung.
        </p>
        {state.fieldErrors?.selected_package && (
          <p className="text-destructive mt-2 text-sm">
            {state.fieldErrors.selected_package}
          </p>
        )}
      </FormSection>

      {/* 5. Special features */}
      <FormSection
        step="05"
        title="Gibt es besondere Funktionen oder Wünsche?"
        description="Optional — wenn etwas dabei ist, das Sie zusätzlich brauchen, einfach anhaken."
      >
        <div className="flex flex-wrap gap-2">
          {INQUIRY_SPECIAL_FEATURES.map((feature) => (
            <label
              key={feature}
              className="border-border bg-background hover:bg-secondary inline-flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors has-[input:checked]:bg-foreground has-[input:checked]:text-background has-[input:checked]:border-foreground"
            >
              <input
                type="checkbox"
                name="special_features"
                value={feature}
                className="sr-only"
              />
              {SPECIAL_LABELS[feature]}
            </label>
          ))}
        </div>
      </FormSection>

      {/* 6. Timeframe */}
      <FormSection step="06" title="Wunschzeitraum">
        <SelectField
          label="Wann brauchen Sie die Website?"
          name="timeframe"
          options={INQUIRY_TIMEFRAMES.map((v) => ({
            value: v,
            label: TIMEFRAME_LABELS[v],
          }))}
          error={state.fieldErrors?.timeframe}
        />
      </FormSection>

      {/* 7. Message */}
      <FormSection step="07" title="Ihre Nachricht (optional)">
        <Textarea
          id="inq-message"
          name="message"
          rows={4}
          maxLength={4000}
          placeholder="Was sollen wir wissen? Was ist Ihnen wichtig?"
        />
        {state.fieldErrors?.message && (
          <p className="text-destructive text-sm">{state.fieldErrors.message}</p>
        )}
      </FormSection>

      {/* 8. Consent */}
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
        <p className="text-destructive -mt-4 text-sm">
          {state.fieldErrors.consent}
        </p>
      )}

      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <SubmitButton label="Anfrage senden" pendingLabel="Wird gesendet …" />
        <p className="text-muted-foreground text-xs">
          Antwort innerhalb von 24 Stunden, persönlich.
        </p>
      </div>
    </form>
  );
}

function FormSection({
  step,
  title,
  description,
  children,
}: {
  step: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border-border/60 border-t pt-7 first:border-t-0 first:pt-0">
      <legend className="text-muted-foreground mb-1 text-[10px] font-medium uppercase tracking-[0.2em]">
        Schritt {step}
      </legend>
      <h3 className="text-foreground text-base font-semibold tracking-tight">
        {title}
      </h3>
      {description ? (
        <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
          {description}
        </p>
      ) : null}
      <div className="mt-4">{children}</div>
    </fieldset>
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
