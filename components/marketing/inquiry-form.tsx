"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Check, ChevronDown } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  INQUIRY_TIMEFRAMES,
  type InquiryPackage,
} from "@/lib/validations/inquiries";

/**
 * Anfrage-Formular — Single-Page, minimaler Klick-Pfad.
 *
 * Pflichtfelder reduziert auf das absolute Minimum: Name, E-Mail,
 * Nachricht, DSGVO-Consent. Branche, Paket, Telefon und Zeitrahmen
 * sind in einer aufklappbaren „Mehr verraten"-Sektion — komplett
 * optional, sonst fragen wir in der Antwort.
 *
 * Vorgängerversion war ein 3-Schritt-Wizard mit 6 Pflicht-Klicks
 * (Branche-Card, Website-Type-Card, Weiter, Weiter, Consent, Senden)
 * + langes Scrollen durch das 12-Branchen-Card-Grid. Das war für
 * einen Erstkontakt deutlich zu viel.
 */

const INDUSTRY_OPTIONS = [
  { slug: "pflegedienst", label: "Pflegedienst" },
  { slug: "arztpraxis", label: "Arztpraxis" },
  { slug: "zahnarzt", label: "Zahnarztpraxis" },
  { slug: "friseur", label: "Friseur" },
  { slug: "kosmetik", label: "Kosmetikstudio" },
  { slug: "cafe", label: "Café / Restaurant" },
  { slug: "handwerker", label: "Handwerker" },
  { slug: "reinigung", label: "Reinigung" },
  { slug: "kanzlei", label: "Kanzlei" },
  { slug: "fitness", label: "Fitnessstudio" },
  { slug: "hotel", label: "Boutique-Hotel" },
  { slug: "sonstiges", label: "Andere Branche" },
];

const PACKAGE_LABELS: Record<InquiryPackage, string> = {
  starter: "Starter-Projekt",
  business: "Business-Auftritt",
  premium: "Premium-System",
  unsicher: "Empfehlung gewünscht",
};

const TIMEFRAME_LABELS: Record<(typeof INQUIRY_TIMEFRAMES)[number], string> = {
  asap: "So schnell wie möglich",
  "2-wochen": "Innerhalb von 2 Wochen",
  "1-monat": "Innerhalb von 1 Monat",
  spaeter: "Später",
  offen: "Noch offen",
};

type FormData = {
  /** Pflicht */
  name: string;
  email: string;
  message: string;
  consent: boolean;
  /** Honeypot — bots fill it, humans don't. */
  websiteUrl: string;
  /** Optional details */
  phone: string;
  company: string;
  industry: string;
  packagePref: InquiryPackage | "";
  timeframe: (typeof INQUIRY_TIMEFRAMES)[number] | "";
};

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

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
  const validIndustry =
    initialIndustry &&
    INDUSTRY_OPTIONS.some((i) => i.slug === initialIndustry)
      ? initialIndustry
      : "";

  const [data, setData] = useState<FormData>({
    name: "",
    email: "",
    message: initialMessage ?? "",
    consent: false,
    websiteUrl: "",
    phone: "",
    company: "",
    industry: validIndustry,
    packagePref: initialPackage ?? "",
    timeframe: "",
  });
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  // Details-Akkordeon wird aufgeklappt, wenn was per URL prefilled
  // wurde — dann sieht der User direkt, dass sein Branche/Paket
  // schon übernommen wurde.
  const hasPrefill = Boolean(validIndustry || initialPackage);
  const [detailsOpen, setDetailsOpen] = useState(hasPrefill);

  const canSubmit =
    data.name.trim().length >= 2 &&
    /\S+@\S+\.\S+/.test(data.email) &&
    data.message.trim().length >= 5 &&
    data.consent;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSubmit) return;

    if (!formspreeId) {
      setStatus({
        kind: "error",
        message:
          "Anfrage-Empfänger ist nicht konfiguriert. Bitte später erneut versuchen oder direkt an info@sitalo.de schreiben.",
      });
      return;
    }

    // Honeypot — silent success für Bots.
    if (data.websiteUrl.trim() !== "") {
      setStatus({ kind: "success" });
      return;
    }

    setStatus({ kind: "submitting" });

    const industryLabel = INDUSTRY_OPTIONS.find(
      (i) => i.slug === data.industry,
    )?.label;
    const packageLabel = data.packagePref
      ? PACKAGE_LABELS[data.packagePref]
      : undefined;
    const timeframeLabel = data.timeframe
      ? TIMEFRAME_LABELS[data.timeframe]
      : undefined;

    const payload: Record<string, unknown> = {
      Name: data.name,
      "E-Mail": data.email,
      Nachricht: data.message,
      _subject: `Neue Anfrage von ${data.name}${
        data.company ? ` (${data.company})` : ""
      }`,
      _replyto: data.email,
    };
    if (data.company) payload.Firma = data.company;
    if (data.phone) payload.Telefon = data.phone;
    if (industryLabel) payload.Branche = industryLabel;
    if (packageLabel) payload["Paket-Wunsch"] = packageLabel;
    if (timeframeLabel) payload.Wunschzeitraum = timeframeLabel;

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

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  return (
    <form
      onSubmit={submit}
      className="bg-card ring-border/50 rounded-3xl border p-6 shadow-xl ring-1 sm:p-8 lg:p-10"
    >
      <h2 className="text-foreground text-2xl font-semibold tracking-tight sm:text-3xl">
        Anfrage senden
      </h2>
      <p className="text-muted-foreground mt-2 text-[15px] leading-relaxed">
        Drei Pflichtfelder. Antwort meist noch am selben Tag —
        persönlich, kostenlos.
      </p>

      {/* Honeypot — visuell versteckt */}
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

      <div className="mt-7 grid gap-5 sm:grid-cols-2 sm:gap-6">
        <div className="space-y-2">
          <Label htmlFor="inq-name">Name</Label>
          <Input
            id="inq-name"
            required
            value={data.name}
            onChange={(e) => update("name", e.target.value)}
            autoComplete="name"
            placeholder="Vor- und Nachname"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="inq-email">E-Mail</Label>
          <Input
            id="inq-email"
            type="email"
            required
            value={data.email}
            onChange={(e) => update("email", e.target.value)}
            autoComplete="email"
            placeholder="ihre@adresse.de"
          />
        </div>
      </div>

      <div className="mt-5 space-y-2 sm:mt-6">
        <Label htmlFor="inq-message">Was wir wissen sollten</Label>
        <Textarea
          id="inq-message"
          required
          rows={5}
          value={data.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="Zwei, drei Sätze reichen. Was Sie machen, was Sie brauchen, was Sie noch nicht haben — wir fragen den Rest in der Antwort."
        />
      </div>

      {/* Optionale Details — aufklappbar, kein Pflichtweg */}
      <details
        className="border-border/60 mt-6 rounded-2xl border bg-secondary/30 transition-colors sm:mt-7"
        open={detailsOpen}
        onToggle={(e) => setDetailsOpen((e.target as HTMLDetailsElement).open)}
      >
        <summary className="text-foreground/85 hover:text-foreground flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-[14.5px] font-medium tracking-tight">
          <span className="inline-flex items-center gap-2.5">
            <ChevronDown
              aria-hidden="true"
              className="h-4 w-4 transition-transform [details[open]_&]:rotate-180"
            />
            Mehr verraten {hasPrefill ? "(übernommen)" : "(optional)"}
          </span>
          <span className="text-muted-foreground text-xs">
            Branche · Paket · Zeitrahmen · Telefon
          </span>
        </summary>
        <div className="border-border/60 grid gap-5 border-t px-5 py-5 sm:grid-cols-2 sm:gap-6">
          <div className="space-y-2">
            <Label htmlFor="inq-industry">Branche</Label>
            <Select
              id="inq-industry"
              value={data.industry}
              onChange={(v) => update("industry", v)}
              options={[
                { value: "", label: "— bitte wählen —" },
                ...INDUSTRY_OPTIONS.map((i) => ({
                  value: i.slug,
                  label: i.label,
                })),
              ]}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inq-package">Paket-Wunsch</Label>
            <Select
              id="inq-package"
              value={data.packagePref}
              onChange={(v) => update("packagePref", v as FormData["packagePref"])}
              options={[
                { value: "", label: "— Empfehlung gewünscht —" },
                { value: "starter", label: "Starter (ab 499 €)" },
                { value: "business", label: "Business (ab 899 €)" },
                { value: "premium", label: "Premium (ab 1.499 €)" },
              ]}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inq-phone">Telefon</Label>
            <Input
              id="inq-phone"
              type="tel"
              value={data.phone}
              onChange={(e) => update("phone", e.target.value)}
              autoComplete="tel"
              placeholder="für schnellere Rückfragen"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inq-timeframe">Zeitrahmen</Label>
            <Select
              id="inq-timeframe"
              value={data.timeframe}
              onChange={(v) =>
                update("timeframe", v as FormData["timeframe"])
              }
              options={[
                { value: "", label: "— wann soll es live sein? —" },
                ...INQUIRY_TIMEFRAMES.map((t) => ({
                  value: t,
                  label: TIMEFRAME_LABELS[t],
                })),
              ]}
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="inq-company">Firma / Geschäft</Label>
            <Input
              id="inq-company"
              value={data.company}
              onChange={(e) => update("company", e.target.value)}
              autoComplete="organization"
              placeholder="optional"
            />
          </div>
        </div>
      </details>

      <div className="border-border/60 mt-7 flex items-start gap-3 border-t pt-6 sm:mt-8">
        <input
          id="inq-consent"
          type="checkbox"
          required
          checked={data.consent}
          onChange={(e) => update("consent", e.target.checked)}
          className="mt-1 h-4 w-4 cursor-pointer"
        />
        <label
          htmlFor="inq-consent"
          className="text-foreground/80 text-[13.5px] leading-relaxed cursor-pointer"
        >
          Ich willige ein, dass Sitalo meine Angaben zur Beantwortung
          dieser Anfrage verarbeitet. Mehr in der{" "}
          <Link
            href="/datenschutz"
            className="text-foreground underline underline-offset-4"
          >
            Datenschutzerklärung
          </Link>
          .
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-[13px]">
          {canSubmit
            ? "Bereit zum Senden."
            : "Drei Felder + Häkchen ausfüllen, dann geht's."}
        </p>
        <Button
          type="submit"
          disabled={!canSubmit || status.kind === "submitting"}
          className="bg-foreground text-background hover:bg-foreground/90 h-12 rounded-full px-7 text-[15px] font-medium tracking-tight shadow-md transition-all hover:shadow-lg disabled:opacity-40"
        >
          {status.kind === "submitting" ? "Wird gesendet …" : "Anfrage senden"}
          {status.kind !== "submitting" && (
            <ArrowRight className="ml-2 h-4 w-4" />
          )}
        </Button>
      </div>
    </form>
  );
}

/* ---------- Success-Screen ---------- */

function SuccessScreen() {
  return (
    <div className="bg-card ring-border/50 rounded-3xl border p-10 text-center shadow-xl ring-1">
      <div className="mx-auto mb-6 inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600">
        <Check className="h-7 w-7" />
      </div>
      <h2 className="text-2xl font-semibold tracking-tight">
        Anfrage angekommen.
      </h2>
      <p className="text-muted-foreground mt-3 text-pretty">
        Wir haben Ihre Nachricht erhalten und melden uns persönlich —
        meist noch am selben Tag.
      </p>
      <p className="text-muted-foreground mx-auto mt-2 max-w-md text-sm">
        Bis dahin gerne die{" "}
        <Link href="/branchen" className="hover:text-foreground underline">
          Branchen-Beispiele
        </Link>{" "}
        ansehen.
      </p>
    </div>
  );
}

/* ---------- Mini-Select (kein external Lib für 3 Felder) ---------- */

function Select({
  id,
  value,
  onChange,
  options,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-background border-border/70 text-foreground focus:border-foreground focus:ring-foreground/20 h-10 w-full appearance-none rounded-md border px-3 py-2 pr-9 text-sm transition-colors focus:outline-none focus:ring-2"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        aria-hidden="true"
        className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2"
      />
    </div>
  );
}
