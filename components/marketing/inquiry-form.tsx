"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";

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
    body: "Leistungen, Vertrauen, Kontakt und Bewerbungen professionell darstellen.",
  },
  {
    slug: "arztpraxis",
    label: "Arztpraxis",
    body: "Sprechzeiten, Leistungen und klare Patienteninformation.",
  },
  {
    slug: "zahnarzt",
    label: "Zahnarztpraxis",
    body: "Behandlungen, Atmosphäre und Termin-Anfragen modern präsentiert.",
  },
  {
    slug: "friseur",
    label: "Friseur",
    body: "Bilder, Preise und Termin-Anfragen hochwertig in Szene gesetzt.",
  },
  {
    slug: "kosmetik",
    label: "Kosmetikstudio",
    body: "Behandlungen, Atmosphäre und Anfragen elegant darstellen.",
  },
  {
    slug: "cafe",
    label: "Café / Restaurant",
    body: "Speisekarte, Öffnungszeiten und Reservierungs-Anfragen.",
  },
  {
    slug: "handwerker",
    label: "Handwerker",
    body: "Leistungen, Einsatzgebiet und schnelle Kontaktmöglichkeiten.",
  },
  {
    slug: "reinigung",
    label: "Reinigung",
    body: "Service-Pakete, Angebotsanfrage und Erreichbarkeit klar dargestellt.",
  },
  {
    slug: "kanzlei",
    label: "Kanzlei",
    body: "Rechtsgebiete, Team und vertrauliche Erstberatung.",
  },
  {
    slug: "fitness",
    label: "Fitnessstudio",
    body: "Kursplan, Probetraining und Mitgliedschafts-Anfragen ohne Hürden.",
  },
  {
    slug: "sonstiges",
    label: "Sonstiges",
    body: "Wir bauen die Website individuell für Ihr Geschäft.",
  },
];

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

const NEED_DETAIL: Partial<Record<InquiryNeed, string>> = {
  "neue-website": "Komplett neuer Auftritt für Ihr Unternehmen.",
  redesign: "Ihre bestehende Website wird modernisiert.",
  onepager: "Alle wichtigen Infos auf einer starken Seite.",
  mehrseitig: "Mehr Struktur für Leistungen, Team, Galerie und Kontakt.",
};

/** Subset of `INQUIRY_NEEDS` rendered as cards in step 3 — the
 *  "Website-Art"-question. The remaining slugs (Speisekarte, Bewerbungs-/
 *  Kontaktformular, Verwaltbare Inhalte) live in step 4 as features. */
const WEBSITE_TYPE_KEYS: InquiryNeed[] = [
  "neue-website",
  "redesign",
  "onepager",
  "mehrseitig",
];

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

/** Functions card list — broader than just SPECIAL_FEATURES because
 *  the wizard step shows feature-level intent including the
 *  Kontakt/Maps basics. Each entry maps to a Formspree label. */
const FEATURE_OPTIONS: Array<{ slug: string; label: string }> = [
  { slug: "kontaktformular", label: "Kontaktformular" },
  { slug: "whatsapp-button", label: "WhatsApp-Button" },
  { slug: "google-maps", label: "Google Maps" },
  { slug: "oeffnungszeiten", label: "Öffnungszeiten" },
  { slug: "leistungen", label: "Leistungen" },
  { slug: "galerie", label: "Galerie" },
  { slug: "speisekarte", label: "Speisekarte / Wochenangebot" },
  { slug: "bewerbungsformular", label: "Bewerbungsformular" },
  { slug: "online-reservierung", label: "Online-Reservierung" },
  { slug: "verwaltbare-inhalte", label: "Verwaltbare Inhalte" },
  { slug: "seo-erweiterung", label: "SEO-Grundlagen" },
  { slug: "mehrsprachigkeit", label: "Mehrsprachigkeit" },
  { slug: "unsicher", label: "Noch unsicher" },
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
  unsicher: "Ich bin unsicher — bitte empfehlen",
};

type PackageCard = {
  value: InquiryPackage;
  title: string;
  priceLine: string;
  description: string;
  highlight?: boolean;
};

const PACKAGES: PackageCard[] = [
  {
    value: "starter",
    title: "Starter-Projekt",
    priceLine: "ab 499 € einmalig + ab 49 € / Monat",
    description: "Für einfache professionelle Onepager.",
  },
  {
    value: "business",
    title: "Business-Auftritt",
    priceLine: "ab 899 € einmalig + ab 79 € / Monat",
    description:
      "Für hochwertige Unternehmenswebseiten mit mehreren Bereichen.",
    highlight: true,
  },
  {
    value: "premium",
    title: "Premium-System",
    priceLine: "ab 1.499 € einmalig + ab 129 € / Monat",
    description:
      "Für individuelle Websites mit Formularsystem oder verwaltbaren Inhalten.",
  },
  {
    value: "unsicher",
    title: "Ich bin unsicher",
    priceLine: "Bitte empfehlen",
    description: "Wir prüfen Ihre Angaben und schlagen das passende Paket vor.",
  },
];

/* ---------- Wizard state ---------- */

type WizardData = {
  industry: string | null;
  websiteTypes: string[];
  features: string[];
  selectedPackage: InquiryPackage | null;
  name: string;
  company: string;
  email: string;
  phone: string;
  hasWebsite: boolean;
  currentWebsite: string;
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

const TOTAL_STEPS = 7;

const STEP_TITLES = [
  "Willkommen",
  "Branche",
  "Website-Art",
  "Funktionen",
  "Paket",
  "Kontakt",
  "Zusammenfassung",
];

/* ---------- Component ---------- */

export function InquiryForm({
  initialPackage,
  formspreeId,
}: {
  initialPackage?: InquiryPackage;
  formspreeId?: string;
}) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<WizardData>({
    industry: null,
    websiteTypes: [],
    features: [],
    selectedPackage: initialPackage ?? null,
    name: "",
    company: "",
    email: "",
    phone: "",
    hasWebsite: false,
    currentWebsite: "",
    timeframe: "",
    message: "",
    consent: false,
    websiteUrl: "",
  });
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const whatsappFallbackHref = buildWhatsappFallbackHref();

  const update = <K extends keyof WizardData>(key: K, value: WizardData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  const toggleInArray = (key: "websiteTypes" | "features", value: string) =>
    setData((d) => {
      const list = d[key];
      return {
        ...d,
        [key]: list.includes(value)
          ? list.filter((v) => v !== value)
          : [...list, value],
      };
    });

  const canAdvance = (() => {
    switch (step) {
      case 0:
        return true;
      case 1:
        return data.industry !== null;
      case 2:
        return data.websiteTypes.length > 0;
      case 3:
        return true; // features optional
      case 4:
        return data.selectedPackage !== null;
      case 5:
        return data.name.trim().length >= 2 && /\S+@\S+\.\S+/.test(data.email);
      case 6:
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
          "Anfrage-Empfänger ist nicht konfiguriert. Bitte später erneut versuchen oder per WhatsApp schreiben.",
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
        body: JSON.stringify(buildPayload(data)),
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

  return (
    <div className="bg-card ring-border/50 rounded-3xl border p-6 shadow-xl ring-1 sm:p-8 lg:p-10">
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

      <div className="mt-8 min-h-[24rem]">
        {step === 0 && (
          <StepWelcome onStart={() => setStep(1)} whatsappHref={whatsappFallbackHref} />
        )}
        {step === 1 && (
          <StepIndustry
            value={data.industry}
            onChange={(v) => update("industry", v)}
          />
        )}
        {step === 2 && (
          <StepWebsiteType
            values={data.websiteTypes}
            onToggle={(v) => toggleInArray("websiteTypes", v)}
          />
        )}
        {step === 3 && (
          <StepFeatures
            values={data.features}
            onToggle={(v) => toggleInArray("features", v)}
          />
        )}
        {step === 4 && (
          <StepPackage
            value={data.selectedPackage}
            onChange={(v) => update("selectedPackage", v)}
          />
        )}
        {step === 5 && <StepContact data={data} onChange={update} />}
        {step === 6 && <StepSummary data={data} onChange={update} />}
      </div>

      {step > 0 && (
        <div className="border-border/60 mt-8 flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Zurück
          </Button>
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
                : "Anfrage verbindlich senden"}
            </Button>
          )}
        </div>
      )}
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

/* ---------- Step components ---------- */

function StepWelcome({
  onStart,
  whatsappHref,
}: {
  onStart: () => void;
  whatsappHref: string | null;
}) {
  return (
    <div className="text-center">
      <div className="bg-primary/10 text-primary mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full">
        <Sparkles className="h-5 w-5" />
      </div>
      <h2 className="mt-5 text-3xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-4xl">
        Lassen Sie uns Ihre Website planen.
      </h2>
      <p className="text-muted-foreground mx-auto mt-4 max-w-md text-pretty text-base sm:text-lg">
        Beantworten Sie ein paar kurze Fragen. Danach erhalten Sie eine klare
        Einschätzung für Ihre neue Website.
      </p>

      <ul className="text-muted-foreground mx-auto mt-6 inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-sm">
        <li className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <span className="bg-primary inline-block h-1 w-1 rounded-full" />
          Dauer ca. 2 Minuten
        </li>
        <li className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <span className="bg-primary inline-block h-1 w-1 rounded-full" />
          Keine Registrierung
        </li>
        <li className="inline-flex items-center gap-1.5 whitespace-nowrap">
          <span className="bg-primary inline-block h-1 w-1 rounded-full" />
          Persönliche Rückmeldung
        </li>
      </ul>

      <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button
          type="button"
          onClick={onStart}
          className="bg-foreground text-background hover:bg-foreground/90 h-12 rounded-full px-8 text-[15px] font-medium tracking-tight shadow-md transition-all hover:shadow-lg"
        >
          Konfigurator starten
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        {whatsappHref ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground text-sm underline-offset-4 hover:underline"
          >
            Lieber per WhatsApp schreiben
          </a>
        ) : null}
      </div>
    </div>
  );
}

function StepIndustry({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (v: string) => void;
}) {
  return (
    <StepFrame
      title="Für welche Branche soll die Website erstellt werden?"
      subtitle="Wählen Sie das, was am besten passt — Sonstiges, falls Ihre Branche nicht dabei ist."
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {INDUSTRIES.map((opt) => {
          const active = value === opt.slug;
          return (
            <li key={opt.slug}>
              <button
                type="button"
                onClick={() => onChange(opt.slug)}
                aria-pressed={active}
                className={`w-full rounded-2xl border-2 p-4 text-left transition-all sm:p-5 ${
                  active
                    ? "border-foreground bg-foreground/5 shadow-md"
                    : "border-border bg-background hover:border-foreground/40 hover:bg-secondary/40"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold tracking-tight">
                    {opt.label}
                  </h3>
                  <Radio active={active} />
                </div>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {opt.body}
                </p>
              </button>
            </li>
          );
        })}
      </ul>
    </StepFrame>
  );
}

function StepWebsiteType({
  values,
  onToggle,
}: {
  values: string[];
  onToggle: (v: string) => void;
}) {
  const options: Array<{ slug: string; title: string; body: string }> = [
    ...WEBSITE_TYPE_KEYS.map((slug) => ({
      slug,
      title: NEED_LABELS[slug],
      body: NEED_DETAIL[slug] ?? "",
    })),
    {
      slug: "unsicher",
      title: "Noch unsicher",
      body: "Wir empfehlen Ihnen die passende Lösung.",
    },
  ];
  return (
    <StepFrame
      title="Was soll erstellt werden?"
      subtitle="Mehrfachauswahl möglich."
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {options.map((opt) => {
          const active = values.includes(opt.slug);
          return (
            <li key={opt.slug}>
              <button
                type="button"
                onClick={() => onToggle(opt.slug)}
                aria-pressed={active}
                className={`w-full rounded-2xl border-2 p-4 text-left transition-all sm:p-5 ${
                  active
                    ? "border-foreground bg-foreground/5 shadow-md"
                    : "border-border bg-background hover:border-foreground/40 hover:bg-secondary/40"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold tracking-tight">
                    {opt.title}
                  </h3>
                  <Checkbox active={active} />
                </div>
                {opt.body ? (
                  <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                    {opt.body}
                  </p>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </StepFrame>
  );
}

function StepFeatures({
  values,
  onToggle,
}: {
  values: string[];
  onToggle: (v: string) => void;
}) {
  return (
    <StepFrame
      title="Welche Funktionen wünschen Sie?"
      subtitle="Mehrfachauswahl möglich. Sie müssen nicht alles genau wissen — wir prüfen Ihre Auswahl und empfehlen die passende Umsetzung."
    >
      <div className="flex flex-wrap gap-2">
        {FEATURE_OPTIONS.map((opt) => {
          const active = values.includes(opt.slug);
          return (
            <button
              key={opt.slug}
              type="button"
              onClick={() => onToggle(opt.slug)}
              aria-pressed={active}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                active
                  ? "border-foreground bg-foreground text-background shadow-md"
                  : "border-border bg-card hover:border-foreground/40 hover:bg-secondary"
              }`}
            >
              {active ? <Check className="h-3.5 w-3.5" /> : null}
              {opt.label}
            </button>
          );
        })}
      </div>
    </StepFrame>
  );
}

function StepPackage({
  value,
  onChange,
}: {
  value: InquiryPackage | null;
  onChange: (v: InquiryPackage) => void;
}) {
  return (
    <StepFrame
      title="Welches Paket passt am ehesten zu Ihrem Vorhaben?"
      subtitle="Die genannten Preise sind Einstiegspreise. Der finale Preis hängt vom Umfang ab — Sie erhalten nach Ihrer Anfrage eine klare Einschätzung."
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {PACKAGES.map((pkg) => {
          const active = value === pkg.value;
          return (
            <li key={pkg.value}>
              <button
                type="button"
                onClick={() => onChange(pkg.value)}
                aria-pressed={active}
                className={`relative w-full rounded-2xl border-2 p-5 text-left transition-all ${
                  active
                    ? "border-foreground bg-foreground/5 shadow-md"
                    : "border-border bg-background hover:border-foreground/40 hover:bg-secondary/40"
                }`}
              >
                {pkg.highlight ? (
                  <span className="bg-primary text-primary-foreground absolute -top-2.5 right-4 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] shadow">
                    Beliebt
                  </span>
                ) : null}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold tracking-tight">
                      {pkg.title}
                    </h3>
                    <p
                      className={`mt-1 text-xs font-medium ${
                        active ? "text-foreground" : "text-muted-foreground"
                      }`}
                    >
                      {pkg.priceLine}
                    </p>
                  </div>
                  <Radio active={active} />
                </div>
                <p className="text-muted-foreground mt-3 text-sm leading-relaxed">
                  {pkg.description}
                </p>
              </button>
            </li>
          );
        })}
      </ul>
    </StepFrame>
  );
}

function StepContact({
  data,
  onChange,
}: {
  data: WizardData;
  onChange: <K extends keyof WizardData>(key: K, value: WizardData[K]) => void;
}) {
  return (
    <StepFrame
      title="Wie können wir Sie erreichen?"
      subtitle="Name und E-Mail reichen — alles weitere ist optional."
    >
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Name"
            required
            value={data.name}
            onChange={(v) => onChange("name", v)}
            autoComplete="name"
          />
          <Field
            label="Firma"
            value={data.company}
            onChange={(v) => onChange("company", v)}
            autoComplete="organization"
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
        </div>

        <fieldset>
          <legend className="text-sm font-medium">Bestehende Website?</legend>
          <div className="mt-3 flex gap-2">
            {[
              { value: false, label: "Nein" },
              { value: true, label: "Ja" },
            ].map((opt) => {
              const active = data.hasWebsite === opt.value;
              return (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => onChange("hasWebsite", opt.value)}
                  aria-pressed={active}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
                    active
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background hover:bg-secondary"
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
          {data.hasWebsite ? (
            <div className="mt-4">
              <Field
                label="URL Ihrer aktuellen Website"
                value={data.currentWebsite}
                onChange={(v) => onChange("currentWebsite", v)}
                placeholder="https://…"
                autoCapitalize="none"
                spellCheck={false}
              />
            </div>
          ) : null}
        </fieldset>
      </div>
    </StepFrame>
  );
}

function StepSummary({
  data,
  onChange,
}: {
  data: WizardData;
  onChange: <K extends keyof WizardData>(key: K, value: WizardData[K]) => void;
}) {
  const industryLabel =
    INDUSTRIES.find((i) => i.slug === data.industry)?.label ?? "—";
  const websiteTypeLabels = data.websiteTypes
    .map((slug) =>
      slug === "unsicher"
        ? "Noch unsicher"
        : NEED_LABELS[slug as InquiryNeed] ?? slug,
    )
    .join(", ");
  const featureLabels = data.features
    .map(
      (slug) =>
        FEATURE_OPTIONS.find((f) => f.slug === slug)?.label ?? slug,
    )
    .join(", ");
  const packageLabel = data.selectedPackage
    ? PACKAGE_LABELS[data.selectedPackage]
    : "—";

  return (
    <StepFrame
      title="Ihre Anfrage im Überblick"
      subtitle="Bitte prüfen Sie die Angaben. Bei Bedarf können Sie über Zurück einzelne Schritte anpassen."
    >
      <dl className="border-border/60 grid grid-cols-1 gap-x-6 gap-y-3 rounded-2xl border bg-background/60 p-5 text-sm sm:grid-cols-[160px_1fr]">
        <SummaryRow label="Branche" value={industryLabel} />
        <SummaryRow label="Website-Art" value={websiteTypeLabels || "—"} />
        <SummaryRow label="Funktionen" value={featureLabels || "—"} />
        <SummaryRow label="Paket" value={packageLabel} />
        <SummaryRow label="Name" value={data.name || "—"} />
        {data.company ? <SummaryRow label="Firma" value={data.company} /> : null}
        <SummaryRow label="E-Mail" value={data.email || "—"} />
        {data.phone ? <SummaryRow label="Telefon" value={data.phone} /> : null}
        <SummaryRow
          label="Bestehende Website"
          value={
            data.hasWebsite
              ? data.currentWebsite || "Ja"
              : "Nein"
          }
        />
      </dl>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="inq-timeframe">Wunschzeitraum</Label>
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

      <div className="mt-4 space-y-2">
        <Label htmlFor="inq-message">
          Nachricht
          <span className="text-muted-foreground ml-2 text-xs font-normal">
            (optional)
          </span>
        </Label>
        <Textarea
          id="inq-message"
          rows={3}
          maxLength={4000}
          value={data.message}
          onChange={(e) => onChange("message", e.target.value)}
          placeholder="Gibt es noch etwas, das wir wissen sollten?"
        />
      </div>

      <label className="mt-5 flex items-start gap-3 text-sm">
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
        Sie erhalten keine automatische Rechnung. Wir melden uns zunächst mit
        einer persönlichen Einschätzung.
      </p>
    </StepFrame>
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
        Wir haben Ihre Nachricht erhalten und melden uns zeitnah.
      </p>
      <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm">
        In der Zwischenzeit können Sie unsere{" "}
        <Link href="/#branchen" className="hover:text-foreground underline">
          Branchen-Beispiele
        </Link>{" "}
        ansehen.
      </p>
    </div>
  );
}

/* ---------- Small UI helpers ---------- */

function StepFrame({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h2 className="text-balance text-2xl font-semibold leading-[1.15] tracking-[-0.015em] sm:text-3xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          {subtitle}
        </p>
      ) : null}
      <div className="mt-6">{children}</div>
    </div>
  );
}

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

function Checkbox({ active }: { active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors ${
        active ? "border-foreground bg-foreground" : "border-border"
      }`}
    >
      {active ? <Check className="text-background h-3 w-3" /> : null}
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
  autoCapitalize,
  spellCheck,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  autoCapitalize?: "none" | "sentences" | "words";
  spellCheck?: boolean;
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
        autoCapitalize={autoCapitalize}
        spellCheck={spellCheck}
      />
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <>
      <dt className="text-muted-foreground text-xs font-medium uppercase tracking-[0.15em] sm:self-center">
        {label}
      </dt>
      <dd className="text-foreground/90 break-words text-[14px]">{value}</dd>
    </>
  );
}

/* ---------- Payload + WhatsApp helpers ---------- */

function buildPayload(data: WizardData): Record<string, unknown> {
  const industryLabel =
    INDUSTRIES.find((i) => i.slug === data.industry)?.label ?? "";
  const websiteTypeLabels = data.websiteTypes
    .map((slug) =>
      slug === "unsicher"
        ? "Noch unsicher"
        : NEED_LABELS[slug as InquiryNeed] ?? slug,
    )
    .join(", ");
  const featureLabels = data.features
    .map(
      (slug) =>
        FEATURE_OPTIONS.find((f) => f.slug === slug)?.label ?? slug,
    )
    .join(", ");
  const packageLabel = data.selectedPackage
    ? PACKAGE_LABELS[data.selectedPackage]
    : "";
  const timeframeLabel = data.timeframe
    ? TIMEFRAME_LABELS[data.timeframe]
    : "";

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
  payload["Bestehende Website"] = data.hasWebsite ? "Ja" : "Nein";
  if (data.hasWebsite && data.currentWebsite)
    payload["Website-URL"] = data.currentWebsite;
  if (websiteTypeLabels) payload["Website-Art"] = websiteTypeLabels;
  if (featureLabels) payload.Funktionen = featureLabels;
  if (packageLabel) payload["Paket-Interesse"] = packageLabel;
  if (timeframeLabel) payload.Wunschzeitraum = timeframeLabel;
  if (data.message) payload.Nachricht = data.message;
  return payload;
}

function buildWhatsappFallbackHref(): string | null {
  const raw = process.env.NEXT_PUBLIC_SITALO_WHATSAPP_NUMBER?.trim();
  if (!raw) return null;
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.length < 6) return null;
  const message =
    "Hallo Sitalo, ich interessiere mich für eine Website. Können Sie mir ein Angebot machen?";
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
