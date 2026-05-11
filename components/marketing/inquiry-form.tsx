"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { ArrowRight } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  "verwaltbare-inhalte": "Verwaltbare Inhalte",
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
  "verwaltbare-inhalte": "Verwaltbare Inhalte",
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
      "Für individuelle Websites mit verwaltbaren Inhalten direkt auf Ihrer Seite.",
    benefits: ["Verwaltbare Inhalte", "Individuelle Struktur", "Premium-Design"],
  },
  {
    value: "unsicher",
    title: "Ich bin unsicher",
    priceLine: "Bitte empfehlen",
    description: "Wir empfehlen Ihnen das passende Paket nach Ihrer Anfrage.",
    benefits: [],
  },
];

type FormState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string };

/**
 * Posts the inquiry directly to Formspree from the browser. No
 * server action, no Supabase, no Resend in between — the whole
 * stack that kept silently swallowing submissions is bypassed.
 *
 * The form ID is passed in as a prop so the server component
 * resolves it from `FORMSPREE_FORM_ID`. When the form ID isn't
 * configured we still render the form, but disable the submit
 * button and explain why.
 */
export function InquiryForm({
  initialPackage,
  formspreeId,
}: {
  initialPackage?: InquiryPackage;
  formspreeId?: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [hasWebsite, setHasWebsite] = useState<"ja" | "nein">("nein");
  const [selectedPackage, setSelectedPackage] = useState<
    InquiryPackage | null
  >(initialPackage ?? null);
  const [state, setState] = useState<FormState>({ status: "idle" });
  const whatsappFallbackHref = buildWhatsappFallbackHref();

  useEffect(() => {
    if (state.status === "success") formRef.current?.reset();
  }, [state.status]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formspreeId) {
      setState({
        status: "error",
        message:
          "Anfrage-Empfänger ist nicht konfiguriert. Bitte später erneut versuchen oder per WhatsApp schreiben.",
      });
      return;
    }
    const form = event.currentTarget;
    const formData = new FormData(form);

    // Honeypot — bots fill it, humans don't.
    if ((formData.get("website_url") ?? "").toString().trim() !== "") {
      setState({ status: "success" });
      return;
    }

    setState({ status: "submitting" });
    try {
      const response = await fetch(
        `https://formspree.io/f/${formspreeId}`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(buildFormspreePayload(formData)),
        },
      );
      if (response.ok) {
        setState({ status: "success" });
      } else {
        const detail = await response.text().catch(() => "");
        setState({
          status: "error",
          message:
            detail || `Die Anfrage konnte gerade nicht gesendet werden (HTTP ${response.status}).`,
        });
      }
    } catch (err) {
      setState({
        status: "error",
        message:
          err instanceof Error
            ? `Netzwerkfehler: ${err.message}`
            : "Die Anfrage konnte gerade nicht gesendet werden. Bitte versuchen Sie es erneut.",
      });
    }
  }

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
          Wir haben Ihre Nachricht erhalten und melden uns zeitnah.
        </p>
        <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm">
          In der Zwischenzeit können Sie unsere{" "}
          <Link
            href="/#branchen"
            className="hover:text-foreground underline"
          >
            Branchen-Beispiele
          </Link>{" "}
          ansehen.
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate={false}
      className="bg-card ring-border/50 space-y-8 rounded-3xl border p-8 shadow-xl ring-1 sm:p-10"
    >
      {/* Honeypot — visually hidden, ignored by humans, filled by bots. */}
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

      {state.status === "error" && (
        <Alert variant="destructive">
          <AlertDescription>
            {state.message}
            {whatsappFallbackHref ? (
              <span className="mt-3 block">
                <a
                  href={whatsappFallbackHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline-offset-4 hover:underline"
                >
                  → Direkt per WhatsApp schreiben
                </a>
              </span>
            ) : null}
          </AlertDescription>
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
          />
          <Field
            label="Firma"
            name="company"
            autoComplete="organization"
            maxLength={120}
          />
          <Field
            label="Branche"
            name="industry"
            placeholder="z.B. Pflegedienst"
            maxLength={60}
          />
          <Field
            label="Telefon"
            name="phone"
            type="tel"
            autoComplete="tel"
            maxLength={40}
          />
          <Field
            label="E-Mail"
            required
            name="email"
            type="email"
            autoComplete="email"
            className="sm:col-span-2"
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
                        selected ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {pkg.priceLine}
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className={`mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                      selected ? "border-foreground bg-foreground" : "border-border"
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
      </FormSection>

      {/* 8. Consent */}
      <label className="flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          name="consent"
          value="yes"
          required
          className="mt-1 h-4 w-4 shrink-0"
        />
        <span className="text-muted-foreground leading-relaxed">
          Ich habe die{" "}
          <Link href="/datenschutz" className="hover:text-foreground underline">
            Datenschutzerklärung
          </Link>{" "}
          gelesen und akzeptiere die Verarbeitung meiner Daten zur Bearbeitung
          dieser Anfrage.
        </span>
      </label>

      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <SendButton submitting={state.status === "submitting"} />
        <p className="text-muted-foreground text-xs">
          Antwort innerhalb von 24 Stunden, persönlich.
        </p>
      </div>
    </form>
  );
}

function SendButton({ submitting }: { submitting: boolean }) {
  const { pending } = useFormStatus();
  const isBusy = submitting || pending;
  return (
    <Button
      type="submit"
      disabled={isBusy}
      className="bg-foreground text-background hover:bg-foreground/90 h-12 rounded-full px-7 text-[15px] font-medium tracking-tight shadow-md transition-all hover:shadow-lg"
    >
      {isBusy ? "Wird gesendet …" : "Anfrage senden"}
      {isBusy ? null : <ArrowRight className="ml-2 h-4 w-4" />}
    </Button>
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
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
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
    </div>
  );
}

/**
 * Map FormData into a Formspree-friendly object. Keys are rendered
 * as rows in the email Formspree sends — using readable German
 * labels so the inbox reads naturally.
 */
function buildFormspreePayload(formData: FormData): Record<string, unknown> {
  const get = (key: string) => {
    const v = formData.get(key);
    return v == null ? "" : v.toString().trim();
  };
  const getAll = (key: string) =>
    formData.getAll(key).map((v) => v.toString().trim()).filter(Boolean);

  const name = get("name");
  const company = get("company");
  const email = get("email");

  const payload: Record<string, unknown> = {
    Name: name,
    "E-Mail": email,
    _subject: `Neue Anfrage von ${name}${company ? ` (${company})` : ""}`,
    _replyto: email,
  };

  if (company) payload.Firma = company;
  const industry = get("industry");
  if (industry) payload.Branche = industry;
  const phone = get("phone");
  if (phone) payload.Telefon = phone;
  const hasWebsite = get("has_website") === "ja";
  payload["Bestehende Website"] = hasWebsite ? "Ja" : "Nein";
  if (hasWebsite) {
    const url = get("current_website");
    if (url) payload["Website-URL"] = url;
  }
  const needs = getAll("needs");
  if (needs.length > 0) payload.Bedarf = needs.join(", ");
  const pkg = get("selected_package");
  if (pkg) payload["Paket-Interesse"] = pkg;
  const specials = getAll("special_features");
  if (specials.length > 0) payload.Sonderwünsche = specials.join(", ");
  const timeframe = get("timeframe");
  if (timeframe) payload.Wunschzeitraum = timeframe;
  const message = get("message");
  if (message) payload.Nachricht = message;

  return payload;
}

function buildWhatsappFallbackHref(): string | null {
  const raw = process.env.NEXT_PUBLIC_SITALO_WHATSAPP_NUMBER?.trim();
  if (!raw) return null;
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.length < 6) return null;
  const message =
    "Hallo Sitalo, ich wollte eine Anfrage über das Formular senden, aber das hat gerade nicht funktioniert. Können Sie mir helfen?";
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
