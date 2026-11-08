"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";

import a from "@/components/marketing/hafen/atelier.module.css";
import { SitaloStempel } from "@/components/marketing/sitalo-stempel";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PAKETE } from "@/lib/pakete-data";
import { submitLead } from "@/lib/submit-lead";
import { track } from "@/lib/track";
import {
  INQUIRY_TIMEFRAMES,
  PACKAGE_LABELS,
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

const INDUSTRY_ALIASES: Record<string, string> = {
  pflege: "pflegedienst",
  praxis: "arztpraxis",
  gastro: "cafe",
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
}: {
  initialPackage?: InquiryPackage;
  initialIndustry?: string;
  initialMessage?: string;
}) {
  // Branchen-Seiten verlinken mit ihrem eigenen Slug (?branche=pflege),
  // das Formular kennt die feineren Optionen — Aliase übersetzen.
  const industry = initialIndustry ? (INDUSTRY_ALIASES[initialIndustry] ?? initialIndustry) : undefined;
  const validIndustry =
    industry && INDUSTRY_OPTIONS.some((i) => i.slug === industry) ? industry : "";

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

  // Was noch fehlt, in Formular-Reihenfolge (Hinweis unter dem Knopf,
  // wird beim Ausfüllen kürzer; ein Klick springt ins erste Feld).
  const fehlt: { feld: string; label: string }[] = [
    ...(data.name.trim().length >= 2 ? [] : [{ feld: "inq-name", label: "Name" }]),
    ...(/\S+@\S+\.\S+/.test(data.email) ? [] : [{ feld: "inq-email", label: "E-Mail" }]),
    ...(data.message.trim().length >= 5 ? [] : [{ feld: "inq-message", label: "Nachricht" }]),
    ...(data.consent ? [] : [{ feld: "inq-consent", label: "Häkchen" }]),
  ];
  const canSubmit = fehlt.length === 0;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    // Doppel-Submit-Schutz: Status-Race verhindern, wenn Enter
    // mehrfach gedrückt oder Button gleichzeitig geklickt wird.
    if (status.kind === "submitting" || status.kind === "success") return;
    if (!canSubmit) {
      document.getElementById(fehlt[0].feld)?.focus();
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

    const result = await submitLead({
      kind: "anfrage",
      subject: `Neue Anfrage von ${data.name}${
        data.company ? ` (${data.company})` : ""
      }`,
      replyTo: data.email,
      hp: data.websiteUrl,
      fields: [
        ["Name", data.name],
        ["E-Mail", data.email],
        ["Telefon", data.phone],
        ["Firma", data.company],
        ["Branche", industryLabel],
        ["Paket-Wunsch", packageLabel],
        ["Wunschzeitraum", timeframeLabel],
        ["Nachricht", data.message],
      ],
    });

    if (result.ok) {
      setStatus({ kind: "success" });
      track("Anfrage", {
        branche: industryLabel ?? "(keine)",
        paket: packageLabel ?? "(keins)",
        zeitrahmen: timeframeLabel ?? "(offen)",
      });
    } else {
      setStatus({ kind: "error", message: result.error });
    }
  }

  if (status.kind === "success") {
    return <SuccessScreen />;
  }

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setData((d) => ({ ...d, [key]: value }));

  return (
    <form onSubmit={submit} className={a.lieferschein}>
      <p className={a.lsKopf} aria-hidden="true">
        <span>Lieferschein · Anfrage</span>
        <span>Sitalo · Hamburg</span>
      </p>
      <h2 className="text-foreground mt-6 text-2xl font-[740] tracking-[-0.025em] [font-stretch:114%] sm:text-3xl">
        Anfrage senden
      </h2>
      <p className="text-muted-foreground mt-2 text-[15px] leading-relaxed">
        Drei Pflichtfelder. Antwort meist am selben Werktag, persönlich
        und kostenlos.
      </p>

      {/* Honeypot — visuell versteckt */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-[-9999px] h-0 w-0 overflow-hidden"
      >
        {/* Bewusst kein Name/Label mit „Website", „URL" o. Ä. — darauf
            springen Browser-Autofill und Passwortmanager an, und ein
            echter Besucher würde unbemerkt als Bot aussortiert. */}
        <label htmlFor="inq-hp">Bitte leer lassen</label>
        <input
          id="inq-hp"
          name="sitalo_hp_field"
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
                href="tel:+491607621876"
                className="text-gold-ink font-medium underline-offset-4 hover:underline"
              >
                Lieber anrufen: 0160&nbsp;7621876 →
              </a>
            </span>
          </AlertDescription>
        </Alert>
      )}

      <div className="mt-2 grid gap-x-6 sm:grid-cols-2">
        <div className={a.lsFeld}>
          <Label htmlFor="inq-name" className={a.lsLabel}>
            <span className={a.lsNr} aria-hidden="true">01</span>
            Name
            <span className={a.lsPflicht}>Pflicht</span>
          </Label>
          <Input
            id="inq-name"
            required
            value={data.name}
            onChange={(e) => update("name", e.target.value)}
            autoComplete="name"
            placeholder="Vor- und Nachname"
          />
        </div>
        <div className={a.lsFeld}>
          <Label htmlFor="inq-email" className={a.lsLabel}>
            <span className={a.lsNr} aria-hidden="true">02</span>
            E-Mail
            <span className={a.lsPflicht}>Pflicht</span>
          </Label>
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

      <div className={a.lsFeld}>
        <Label htmlFor="inq-message" className={a.lsLabel}>
          <span className={a.lsNr} aria-hidden="true">03</span>
          Was wir wissen sollten
          <span className={a.lsPflicht}>Pflicht</span>
        </Label>
        <Textarea
          id="inq-message"
          required
          rows={5}
          value={data.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="Zwei, drei Sätze reichen: was Ihr Betrieb macht und was die Website können soll. Den Rest fragen wir in der Antwort."
        />
      </div>

      {/* Optionale Details — aufklappbar, kein Pflichtweg */}
      <details
        className="border-border mt-8 rounded-[3px] border transition-colors"
        open={detailsOpen}
        onToggle={(e) => setDetailsOpen((e.target as HTMLDetailsElement).open)}
      >
        <summary className="text-foreground/85 hover:text-foreground flex cursor-pointer list-none flex-col items-start gap-1 px-5 py-4 text-[14.5px] font-medium tracking-tight sm:flex-row sm:items-center sm:justify-between sm:gap-3">
          <span className="inline-flex items-center gap-2.5">
            <ChevronDown
              aria-hidden="true"
              className="h-4 w-4 transition-transform [details[open]_&]:rotate-180"
            />
            Mehr verraten {hasPrefill ? "(übernommen)" : "(optional)"}
          </span>
          <span className="text-muted-foreground pl-[26px] text-xs sm:pl-0">
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
                // Pakete-Optionen aus der kanonischen Quelle, damit
                // Preisänderungen automatisch durchschlagen.
                ...PAKETE.map((p) => ({
                  value: p.slug,
                  label: `${p.name} (${p.setup})`,
                })),
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

      <div className="mt-6 flex flex-col gap-3 sm:flex-row-reverse sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status.kind === "submitting"}
          aria-describedby="inq-stand"
          className="btn-signal btn-gross w-full sm:w-auto"
        >
          {status.kind === "submitting" ? "Wird gesendet…" : "Anfrage senden"}
          {status.kind !== "submitting" && (
            <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
          )}
        </button>
        <p id="inq-stand" className="text-muted-foreground text-[13px]" aria-live="polite">
          {canSubmit
            ? "Bereit zum Senden."
            : `Noch: ${fehlt.map((f) => f.label).join(", ")}`}
        </p>
      </div>
    </form>
  );
}

/* ---------- Success-Screen ---------- */

function SuccessScreen() {
  return (
    <div className={a.lieferschein} role="status">
      <p className={a.lsKopf} aria-hidden="true">
        <span>Lieferschein · Anfrage</span>
        <span>Sitalo · Hamburg</span>
      </p>
      <div className="mt-8 flex flex-col-reverse items-start gap-6 sm:flex-row sm:justify-between">
        <div>
          <h2 className="text-foreground text-2xl font-[740] tracking-[-0.025em] [font-stretch:114%] sm:text-3xl">
            Angekommen.
          </h2>
          <p className="text-foreground/80 mt-3 max-w-xl text-pretty text-[15.5px] leading-relaxed">
            Wir lesen es jetzt und antworten meist am selben Werktag. Was
            abends oder am Wochenende kommt, beantworten wir am nächsten
            Werktag.{" "}
            <Link
              href="/erreichbarkeit"
              className="text-foreground underline decoration-[var(--gold)] underline-offset-4"
            >
              Mehr zu unseren Antwortzeiten
            </Link>
            .
          </p>
        </div>
        <SitaloStempel size="lg" umschrift="EINGEGANGEN · HAMBURG" className={a.stempel} />
      </div>
      <div className="border-border mt-8 border-t pt-6">
        <p className="text-muted-foreground font-mono text-[11.5px] font-medium tracking-[0.14em] uppercase">
          Während Sie warten
        </p>
        <p className="text-foreground/80 mt-3 max-w-xl text-pretty text-[14.5px] leading-relaxed">
          Wenn Sie lieber direkt sprechen, geht das in der offenen
          Sprechstunde ohne Anmeldung. Oder Sie buchen einen
          Gesprächstermin (bis zu 30 Minuten, meist reicht eine
          Viertelstunde).
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link href="/termin" className="btn-line btn-klein">
            Termin vereinbaren
          </Link>
          <Link href="/sprechstunde" className="link-pfeil text-[15px] font-semibold">
            Zur Sprechstunde&nbsp;<span className="pfeil" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
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
