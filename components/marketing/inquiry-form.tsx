"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  INQUIRY_NEEDS,
  INQUIRY_TIMEFRAMES,
  type InquiryNeed,
  type InquiryPackage,
} from "@/lib/validations/inquiries";

/* ---------- Static data: labels and pickable options ---------- */

type IndustryOption = {
  slug: string;
  label: string;
  body: string;
};

const INDUSTRIES: IndustryOption[] = [
  {
    slug: "pflegedienst",
    label: "Pflegedienst",
    body: "Leistungen, Vertrauen, Kontakt, Bewerbungen.",
  },
  {
    slug: "arztpraxis",
    label: "Arztpraxis",
    body: "Sprechzeiten, Leistungen, Patienteninfo.",
  },
  {
    slug: "zahnarzt",
    label: "Zahnarztpraxis",
    body: "Behandlungen, Atmosphäre, Termin-Anfragen.",
  },
  {
    slug: "friseur",
    label: "Friseur",
    body: "Bilder, Preise, Termin-Anfragen.",
  },
  {
    slug: "kosmetik",
    label: "Kosmetikstudio",
    body: "Behandlungen, Atmosphäre, Anfragen.",
  },
  {
    slug: "cafe",
    label: "Café / Restaurant",
    body: "Speisekarte, Öffnungszeiten, Reservierung.",
  },
  {
    slug: "handwerker",
    label: "Handwerker",
    body: "Leistungen, Einsatzgebiet, Kontakt.",
  },
  {
    slug: "reinigung",
    label: "Reinigung",
    body: "Service-Pakete, Angebot, Erreichbarkeit.",
  },
  {
    slug: "kanzlei",
    label: "Kanzlei",
    body: "Rechtsgebiete, Team, Erstberatung.",
  },
  {
    slug: "fitness",
    label: "Fitnessstudio",
    body: "Kursplan, Probetraining, Mitgliedschaft.",
  },
  {
    slug: "hotel",
    label: "Boutique-Hotel",
    body: "Zimmer, Atmosphäre, Buchungsanfrage.",
  },
  {
    slug: "sonstiges",
    label: "Andere Branche",
    body: "Wir bauen die Seite individuell.",
  },
];

const WEBSITE_TYPES: Array<{
  slug: InquiryNeed | "unsicher";
  title: string;
  body: string;
}> = [
  {
    slug: "neue-website",
    title: "Neue Website",
    body: "Ich starte komplett neu.",
  },
  {
    slug: "redesign",
    title: "Redesign",
    body: "Meine bestehende Seite soll überarbeitet werden.",
  },
  {
    slug: "unsicher",
    title: "Noch unsicher",
    body: "Bitte beraten Sie mich.",
  },
];

const TIMEFRAME_LABELS: Record<(typeof INQUIRY_TIMEFRAMES)[number], string> = {
  asap: "So schnell wie möglich",
  "2-wochen": "Innerhalb von 2 Wochen",
  "1-monat": "Innerhalb von 1 Monat",
  spaeter: "Später",
  offen: "Noch offen",
};

const PACKAGE_LABELS: Record<InquiryPackage, string> = {
  starter: "Starter-Projekt",
  business: "Business-Auftritt",
  premium: "Premium-System",
  unsicher: "Empfehlung gewünscht",
};

/* ---------- Wizard state ---------- */

type WizardData = {
  industry: string | null;
  websiteType: string | null;
  name: string;
  company: string;
  email: string;
  phone: string;
  timeframe: (typeof INQUIRY_TIMEFRAMES)[number] | "";
  message: string;
  consent: boolean;
  /** Honeypot — bots fill it, humans don't. */
  websiteUrl: string;
};

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

const TOTAL_STEPS = 3;
const STEP_TITLES = ["Vorhaben", "Kontakt", "Absenden"];

/* ---------- Component ---------- */

export function InquiryForm({
  initialPackage,
  initialIndustry,
  initialMessage,
  formspreeId,
}: {
  initialPackage?: InquiryPackage;
  initialIndustry?: string;
  initialMessage?: string;
  formspreeId?: string;
}) {
  // Bekannten Industry-Slug vorvalidieren — sonst startet der Wizard
  // mit garbage und der User merkts spät.
  const validIndustry =
    initialIndustry && INDUSTRIES.some((i) => i.slug === initialIndustry)
      ? initialIndustry
      : null;
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>({
    industry: validIndustry,
    websiteType: null,
    name: "",
    company: "",
    email: "",
    phone: "",
    timeframe: "",
    message: initialMessage ?? "",
    consent: false,
    websiteUrl: "",
  });
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const update = <K extends keyof WizardData>(key: K, value: WizardData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const canAdvance = (() => {
    switch (step) {
      case 0:
        return data.industry !== null && data.websiteType !== null;
      case 1:
        return (
          data.name.trim().length >= 2 && /\S+@\S+\.\S+/.test(data.email)
        );
      case 2:
        return data.consent;
      default:
        return false;
    }
  })();

  async function submit() {
    if (!formspreeId) {
      setStatus({
        kind: "error",
        message:
          "Anfrage-Empfänger ist nicht konfiguriert. Bitte später erneut versuchen oder per E-Mail an info@sitalo.de schreiben.",
      });
      return;
    }
    // Honeypot — silent success for bots.
    if (data.websiteUrl.trim() !== "") {
      setStatus({ kind: "success" });
      return;
    }
    setStatus({ kind: "submitting" });
    try {
      const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(buildPayload(data, initialPackage)),
      });
      if (response.ok) {
        setStatus({ kind: "success" });
      } else {
        const text = await response.text().catch(() => "");
        setStatus({
          kind: "error",
          message:
            text ||
            `Die Anfrage konnte gerade nicht gesendet werden (HTTP ${response.status}).`,
        });
      }
    } catch (err) {
      setStatus({
        kind: "error",
        message:
          err instanceof Error
            ? `Netzwerkfehler: ${err.message}`
            : "Die Anfrage konnte gerade nicht gesendet werden. Bitte versuchen Sie es erneut.",
      });
    }
  }

  if (status.kind === "success") {
    return <SuccessScreen />;
  }

  // Wenn Branche oder Paket per URL gesetzt: kompaktes Prefill-Banner.
  const prefillParts: string[] = [];
  if (validIndustry) {
    const ind = INDUSTRIES.find((i) => i.slug === validIndustry);
    if (ind) prefillParts.push(`Branche: ${ind.label}`);
  }
  if (initialPackage) {
    prefillParts.push(`Paket: ${PACKAGE_LABELS[initialPackage]}`);
  }

  return (
    <div className="bg-card ring-border/50 rounded-3xl border p-6 shadow-xl ring-1 sm:p-8 lg:p-10">
      {prefillParts.length > 0 ? (
        <div className="bg-accent/40 text-foreground/85 border-border/60 mb-6 rounded-2xl border px-4 py-3 text-sm leading-relaxed">
          <span className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.2em]">
            Übernommen
          </span>
          <span className="ml-2">{prefillParts.join(" · ")}</span>
        </div>
      ) : null}

      <ProgressHeader step={step} total={TOTAL_STEPS} title={STEP_TITLES[step]} />

      {/* Honeypot field — visually hidden. */}
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
          value={data.websiteUrl}
          onChange={(e) => update("websiteUrl", e.target.value)}
        />
      </div>

      {status.kind === "error" && (
        <Alert variant="destructive" className="mt-6">
          <AlertDescription>
            {status.message}
            <span className="mt-3 block">
              <a
                href="mailto:info@sitalo.de"
                className="font-medium underline-offset-4 hover:underline"
              >
                → Direkt an info@sitalo.de schreiben
              </a>
            </span>
          </AlertDescription>
        </Alert>
      )}

      <div className="mt-8 min-h-[22rem]">
        {step === 0 && (
          <StepVorhaben
            industry={data.industry}
            websiteType={data.websiteType}
            onIndustryChange={(v) => update("industry", v)}
            onWebsiteTypeChange={(v) => update("websiteType", v)}
          />
        )}
        {step === 1 && <StepKontakt data={data} onChange={update} />}
        {step === 2 && <StepAbsenden data={data} onChange={update} />}
      </div>

      <div className="border-border/60 mt-8 flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
        {step > 0 ? (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Zurück
          </Button>
        ) : (
          <span />
        )}
        {step < TOTAL_STEPS - 1 ? (
          <Button
            type="button"
            disabled={!canAdvance}
            onClick={() => setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1))}
            className="bg-foreground text-background hover:bg-foreground/90 h-12 rounded-full px-7 text-[15px] font-medium tracking-tight shadow-md transition-all hover:shadow-lg disabled:opacity-40"
          >
            Weiter
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="button"
            disabled={!canAdvance || status.kind === "submitting"}
            onClick={submit}
            className="bg-foreground text-background hover:bg-foreground/90 h-12 rounded-full px-7 text-[15px] font-medium tracking-tight shadow-md transition-all hover:shadow-lg disabled:opacity-40"
          >
            {status.kind === "submitting"
              ? "Wird gesendet …"
              : "Anfrage senden"}
          </Button>
        )}
      </div>
    </div>
  );
}

/* ---------- Progress header ---------- */

function ProgressHeader({
  step,
  total,
  title,
}: {
  step: number;
  total: number;
  title: string;
}) {
  const percent = Math.round(((step + 1) / total) * 100);
  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-[0.22em]">
          Schritt {step + 1} von {total}
        </p>
        <p className="text-foreground text-xs font-medium">{title}</p>
      </div>
      <div className="bg-secondary/60 mt-3 h-1.5 overflow-hidden rounded-full">
        <div
          className="bg-foreground h-full rounded-full transition-[width] duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

/* ---------- Steps ---------- */

function StepVorhaben({
  industry,
  websiteType,
  onIndustryChange,
  onWebsiteTypeChange,
}: {
  industry: string | null;
  websiteType: string | null;
  onIndustryChange: (v: string) => void;
  onWebsiteTypeChange: (v: string) => void;
}) {
  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-balance text-2xl font-semibold leading-[1.15] tracking-[-0.015em] sm:text-3xl">
          Für welche Branche soll die Seite sein?
        </h2>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          Wählen Sie das, was am nächsten passt.
        </p>
        <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {INDUSTRIES.map((opt) => {
            const active = industry === opt.slug;
            return (
              <li key={opt.slug}>
                <button
                  type="button"
                  onClick={() => onIndustryChange(opt.slug)}
                  aria-pressed={active}
                  className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${
                    active
                      ? "border-foreground bg-foreground/5 shadow-sm"
                      : "border-border bg-background hover:border-foreground/40 hover:bg-secondary/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[15px] font-semibold tracking-tight">
                      {opt.label}
                    </h3>
                    <Radio active={active} />
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                    {opt.body}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div>
        <h2 className="text-balance text-2xl font-semibold leading-[1.15] tracking-[-0.015em] sm:text-3xl">
          Was soll erstellt werden?
        </h2>
        <ul className="mt-6 grid gap-2 sm:grid-cols-3">
          {WEBSITE_TYPES.map((opt) => {
            const active = websiteType === opt.slug;
            return (
              <li key={opt.slug}>
                <button
                  type="button"
                  onClick={() => onWebsiteTypeChange(opt.slug)}
                  aria-pressed={active}
                  className={`w-full rounded-2xl border-2 p-4 text-left transition-all ${
                    active
                      ? "border-foreground bg-foreground/5 shadow-sm"
                      : "border-border bg-background hover:border-foreground/40 hover:bg-secondary/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-[15px] font-semibold tracking-tight">
                      {opt.title}
                    </h3>
                    <Radio active={active} />
                  </div>
                  <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                    {opt.body}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function StepKontakt({
  data,
  onChange,
}: {
  data: WizardData;
  onChange: <K extends keyof WizardData>(key: K, value: WizardData[K]) => void;
}) {
  return (
    <div>
      <h2 className="text-balance text-2xl font-semibold leading-[1.15] tracking-[-0.015em] sm:text-3xl">
        Wie können wir Sie erreichen?
      </h2>
      <p className="text-muted-foreground mt-2 text-sm sm:text-base">
        Name und E-Mail reichen — alles andere ist optional.
      </p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field
          label="Name"
          required
          value={data.name}
          onChange={(v) => onChange("name", v)}
          autoComplete="name"
        />
        <Field
          label="E-Mail"
          required
          type="email"
          value={data.email}
          onChange={(v) => onChange("email", v)}
          autoComplete="email"
        />
        <Field
          label="Telefon"
          type="tel"
          value={data.phone}
          onChange={(v) => onChange("phone", v)}
          autoComplete="tel"
        />
        <Field
          label="Firma"
          value={data.company}
          onChange={(v) => onChange("company", v)}
          autoComplete="organization"
        />
      </div>
    </div>
  );
}

function StepAbsenden({
  data,
  onChange,
}: {
  data: WizardData;
  onChange: <K extends keyof WizardData>(key: K, value: WizardData[K]) => void;
}) {
  return (
    <div>
      <h2 className="text-balance text-2xl font-semibold leading-[1.15] tracking-[-0.015em] sm:text-3xl">
        Möchten Sie uns noch etwas mitgeben?
      </h2>
      <p className="text-muted-foreground mt-2 text-sm sm:text-base">
        Alles freiwillig — Details klären wir gerne im Erstgespräch.
      </p>

      <div className="mt-6 space-y-5">
        <div className="space-y-2">
          <Label htmlFor="inq-message">
            Nachricht
            <span className="text-muted-foreground ml-2 text-xs font-normal">
              (optional)
            </span>
          </Label>
          <Textarea
            id="inq-message"
            rows={4}
            maxLength={4000}
            value={data.message}
            onChange={(e) => onChange("message", e.target.value)}
            placeholder="Was schwebt Ihnen vor? Bestehende Seite, Wunsch-Funktionen, Vorbilder, alles willkommen."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="inq-timeframe">
            Wunschzeitraum
            <span className="text-muted-foreground ml-2 text-xs font-normal">
              (optional)
            </span>
          </Label>
          <select
            id="inq-timeframe"
            value={data.timeframe}
            onChange={(e) =>
              onChange(
                "timeframe",
                e.target.value as (typeof INQUIRY_TIMEFRAMES)[number] | "",
              )
            }
            className="border-input bg-background h-10 w-full rounded-md border px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Bitte wählen</option>
            {INQUIRY_TIMEFRAMES.map((v) => (
              <option key={v} value={v}>
                {TIMEFRAME_LABELS[v]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label className="mt-7 flex items-start gap-3 text-sm">
        <input
          type="checkbox"
          checked={data.consent}
          onChange={(e) => onChange("consent", e.target.checked)}
          className="mt-1 h-4 w-4 shrink-0"
        />
        <span className="text-muted-foreground leading-relaxed">
          Ich habe die{" "}
          <Link href="/datenschutz" className="hover:text-foreground underline">
            Datenschutzerklärung
          </Link>{" "}
          gelesen und bin mit der Verarbeitung meiner Angaben zur
          Kontaktaufnahme einverstanden.
        </span>
      </label>

      <p className="text-muted-foreground mt-4 text-xs leading-relaxed">
        Sie erhalten keine automatische Rechnung. Wir melden uns innerhalb
        von 24 Stunden persönlich mit einer Einschätzung.
      </p>
    </div>
  );
}

/* ---------- Success ---------- */

function SuccessScreen() {
  return (
    <div className="bg-card ring-border/50 rounded-3xl border p-10 shadow-xl ring-1 text-center">
      <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
        <Check className="h-7 w-7" />
      </div>
      <h2 className="text-2xl font-semibold tracking-tight">
        Anfrage angekommen.
      </h2>
      <p className="text-muted-foreground mt-3 text-pretty">
        Wir haben Ihre Nachricht erhalten und melden uns innerhalb von
        24 Stunden persönlich.
      </p>
      <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm">
        In der Zwischenzeit gerne unsere{" "}
        <Link href="/branchen" className="hover:text-foreground underline">
          Branchen-Beispiele
        </Link>{" "}
        ansehen.
      </p>
    </div>
  );
}

/* ---------- Small UI helpers ---------- */

function Radio({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
        active ? "border-foreground bg-foreground" : "border-border"
      }`}
    >
      {active ? <span className="bg-background h-2 w-2 rounded-full" /> : null}
    </span>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  const id = `inq-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div className="space-y-2">
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
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
    </div>
  );
}

/* ---------- Payload helpers ---------- */

const NEED_LABELS: Record<InquiryNeed | "unsicher", string> = {
  "neue-website": "Neue Website",
  redesign: "Redesign",
  onepager: "Onepager",
  mehrseitig: "Mehrseitige Website",
  "verwaltbare-inhalte": "Verwaltbare Inhalte",
  speisekarte: "Speisekarte / Wochenangebot",
  bewerbungsformular: "Bewerbungsformular",
  kontaktformular: "Kontaktformular",
  unsicher: "Noch unsicher",
};

function buildPayload(
  data: WizardData,
  initialPackage: InquiryPackage | undefined,
): Record<string, unknown> {
  const industryLabel =
    INDUSTRIES.find((i) => i.slug === data.industry)?.label ?? "";
  const websiteTypeLabel = data.websiteType
    ? NEED_LABELS[data.websiteType as InquiryNeed | "unsicher"] ??
      data.websiteType
    : "";
  const packageLabel = initialPackage ? PACKAGE_LABELS[initialPackage] : "";
  const timeframeLabel = data.timeframe ? TIMEFRAME_LABELS[data.timeframe] : "";

  const payload: Record<string, unknown> = {
    Name: data.name,
    "E-Mail": data.email,
    _subject: `Neue Anfrage von ${data.name}${
      data.company ? ` (${data.company})` : ""
    }`,
    _replyto: data.email,
  };
  if (data.company) payload.Firma = data.company;
  if (industryLabel) payload.Branche = industryLabel;
  if (data.phone) payload.Telefon = data.phone;
  if (websiteTypeLabel) payload["Website-Art"] = websiteTypeLabel;
  if (packageLabel) payload["Paket-Interesse"] = packageLabel;
  if (timeframeLabel) payload.Wunschzeitraum = timeframeLabel;
  if (data.message) payload.Nachricht = data.message;
  return payload;
}
