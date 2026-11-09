"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { ArrowRight, Check, ChevronDown } from "lucide-react";

import { PAKETE } from "@/lib/pakete-data";
import { submitLead } from "@/lib/submit-lead";
import { track } from "@/lib/track";
import {
  INQUIRY_TIMEFRAMES,
  PACKAGE_LABELS,
  type InquiryPackage,
} from "@/lib/validations/inquiries";

import f from "./inquiry-form.module.css";

/**
 * Anfrage-Formular — Single-Page, minimaler Klick-Pfad.
 *
 * Pflichtfelder reduziert auf das absolute Minimum: Name, E-Mail,
 * Nachricht, DSGVO-Consent. Branche, Paket, Telefon und Zeitrahmen
 * sind in einer aufklappbaren „Mehr verraten"-Sektion — komplett
 * optional, sonst fragen wir in der Antwort.
 *
 * Gestaltung: große runde Felder (17 px, kein Zoom am iPhone), Hinweise
 * erscheinen freundlich direkt unter dem Feld, sobald jemand das Feld
 * verlässt oder auf „Anfrage senden“ tippt. Die Prüfregeln selbst sind
 * dieselben wie zuvor (siehe `fehlt`), der Server prüft ohnehin erneut.
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

type PflichtFeld = "inq-name" | "inq-email" | "inq-message" | "inq-consent";

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
  // Hinweise erst zeigen, wenn ein Feld verlassen wurde oder jemand
  // absenden wollte, nicht schon beim ersten Tippen.
  const [beruehrt, setBeruehrt] = useState<Partial<Record<PflichtFeld, boolean>>>({});
  const [versucht, setVersucht] = useState(false);

  // Was noch fehlt, in Formular-Reihenfolge (Hinweis unter dem Knopf,
  // wird beim Ausfüllen kürzer; ein Klick springt ins erste Feld).
  const emailLeer = data.email.trim() === "";
  const fehlt: { feld: PflichtFeld; label: string; hinweis: string }[] = [
    ...(data.name.trim().length >= 2
      ? []
      : [
          {
            feld: "inq-name" as const,
            label: "Name",
            hinweis: "Wie dürfen wir Sie ansprechen? Bitte mindestens zwei Buchstaben.",
          },
        ]),
    ...(/\S+@\S+\.\S+/.test(data.email)
      ? []
      : [
          {
            feld: "inq-email" as const,
            label: "E-Mail",
            hinweis: emailLeer
              ? "Wohin dürfen wir antworten? Bitte Ihre E-Mail-Adresse."
              : "Die Adresse sieht noch nicht vollständig aus, etwa name@betrieb.de.",
          },
        ]),
    ...(data.message.trim().length >= 5
      ? []
      : [
          {
            feld: "inq-message" as const,
            label: "Nachricht",
            hinweis: "Ein, zwei Sätze genügen. Worum geht es ungefähr?",
          },
        ]),
    ...(data.consent
      ? []
      : [
          {
            feld: "inq-consent" as const,
            label: "Häkchen",
            hinweis: "Bitte noch das Häkchen setzen, damit wir Ihnen antworten dürfen.",
          },
        ]),
  ];
  const canSubmit = fehlt.length === 0;

  const hinweis = (feld: PflichtFeld) =>
    versucht || beruehrt[feld] ? fehlt.find((x) => x.feld === feld)?.hinweis : undefined;
  const verlassen = (feld: PflichtFeld, wert: string) => {
    if (wert.trim() !== "") setBeruehrt((b) => ({ ...b, [feld]: true }));
  };

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    // Doppel-Submit-Schutz: Status-Race verhindern, wenn Enter
    // mehrfach gedrückt oder Button gleichzeitig geklickt wird.
    if (status.kind === "submitting" || status.kind === "success") return;
    if (!canSubmit) {
      setVersucht(true);
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

  const hName = hinweis("inq-name");
  const hEmail = hinweis("inq-email");
  const hMessage = hinweis("inq-message");
  const hConsent = hinweis("inq-consent");

  return (
    <form
      onSubmit={submit}
      noValidate
      aria-labelledby="inq-titel"
      className={f.karte}
    >
      <div className={f.kopf}>
        <h2 id="inq-titel" className={f.titel}>
          Ihre Anfrage
        </h2>
        <p className="notiz-mono">3 Pflichtfelder · rund 1 Minute</p>
      </div>

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
        <div role="alert" className={f.meldung}>
          <p>{status.message}</p>
          <p>
            <a href="tel:+491607621876">Lieber anrufen: 0160&nbsp;7621876 ›</a>
          </p>
        </div>
      )}

      <div className={f.reihe}>
        <Feld id="inq-name" label="Name" pflicht hinweis={hName}>
          <input
            id="inq-name"
            name="name"
            required
            value={data.name}
            onChange={(e) => update("name", e.target.value)}
            onBlur={(e) => verlassen("inq-name", e.target.value)}
            autoComplete="name"
            enterKeyHint="next"
            placeholder="Vor- und Nachname"
            aria-invalid={hName ? true : undefined}
            aria-describedby={hName ? "inq-name-hinweis" : undefined}
            className={f.eingabe}
          />
        </Feld>
        <Feld id="inq-email" label="E-Mail" pflicht hinweis={hEmail}>
          <input
            id="inq-email"
            name="email"
            type="email"
            inputMode="email"
            required
            value={data.email}
            onChange={(e) => update("email", e.target.value)}
            onBlur={(e) => verlassen("inq-email", e.target.value)}
            autoComplete="email"
            autoCapitalize="off"
            spellCheck={false}
            enterKeyHint="next"
            placeholder="ihre@adresse.de"
            aria-invalid={hEmail ? true : undefined}
            aria-describedby={hEmail ? "inq-email-hinweis" : undefined}
            className={f.eingabe}
          />
        </Feld>
      </div>

      <div className={f.voll}>
        <Feld id="inq-message" label="Was haben Sie vor?" pflicht hinweis={hMessage}>
          <textarea
            id="inq-message"
            name="message"
            required
            rows={4}
            value={data.message}
            onChange={(e) => update("message", e.target.value)}
            onBlur={(e) => verlassen("inq-message", e.target.value)}
            placeholder="Zwei, drei Sätze reichen: was Ihr Betrieb macht und was die Website können soll."
            aria-invalid={hMessage ? true : undefined}
            aria-describedby={hMessage ? "inq-message-hinweis" : undefined}
            className={f.eingabe}
          />
        </Feld>
      </div>

      {/* Optionale Details — aufklappbar, kein Pflichtweg */}
      <details
        className={f.mehr}
        open={detailsOpen}
        onToggle={(e) => setDetailsOpen((e.target as HTMLDetailsElement).open)}
      >
        <summary className={f.mehrKnopf}>
          <span>
            Mehr verraten{" "}
            <span className="font-normal text-[#6e6e73]">
              {hasPrefill ? "(übernommen)" : "(freiwillig)"}
            </span>
          </span>
          <ChevronDown aria-hidden="true" />
        </summary>
        <div className={f.mehrInhalt}>
          <Feld id="inq-industry" label="Branche">
            <Select
              id="inq-industry"
              value={data.industry}
              onChange={(v) => update("industry", v)}
              options={[
                { value: "", label: "Bitte wählen" },
                ...INDUSTRY_OPTIONS.map((i) => ({
                  value: i.slug,
                  label: i.label,
                })),
              ]}
            />
          </Feld>
          <Feld id="inq-package" label="Paket-Wunsch">
            <Select
              id="inq-package"
              value={data.packagePref}
              onChange={(v) => update("packagePref", v as FormData["packagePref"])}
              options={[
                { value: "", label: "Empfehlung gewünscht" },
                // Pakete-Optionen aus der kanonischen Quelle, damit
                // Preisänderungen automatisch durchschlagen.
                ...PAKETE.map((p) => ({
                  value: p.slug,
                  label: `${p.name} (${p.setup})`,
                })),
              ]}
            />
          </Feld>
          <Feld id="inq-phone" label="Telefon">
            <input
              id="inq-phone"
              type="tel"
              inputMode="tel"
              value={data.phone}
              onChange={(e) => update("phone", e.target.value)}
              autoComplete="tel"
              placeholder="für schnelle Rückfragen"
              className={f.eingabe}
            />
          </Feld>
          <Feld id="inq-timeframe" label="Zeitrahmen">
            <Select
              id="inq-timeframe"
              value={data.timeframe}
              onChange={(v) =>
                update("timeframe", v as FormData["timeframe"])
              }
              options={[
                { value: "", label: "Wann soll es live sein?" },
                ...INQUIRY_TIMEFRAMES.map((t) => ({
                  value: t,
                  label: TIMEFRAME_LABELS[t],
                })),
              ]}
            />
          </Feld>
          <div className={f.breit}>
            <Feld id="inq-company" label="Firma / Geschäft">
              <input
                id="inq-company"
                value={data.company}
                onChange={(e) => update("company", e.target.value)}
                autoComplete="organization"
                placeholder="Name Ihres Betriebs"
                className={f.eingabe}
              />
            </Feld>
          </div>
        </div>
      </details>

      <div className={f.einwilligung}>
        <input
          id="inq-consent"
          type="checkbox"
          required
          checked={data.consent}
          onChange={(e) => update("consent", e.target.checked)}
          aria-invalid={hConsent ? true : undefined}
          aria-describedby={hConsent ? "inq-consent-hinweis" : undefined}
          className={f.haken}
        />
        <label htmlFor="inq-consent" className={f.einwilligungText}>
          Ich bin einverstanden, dass Sitalo meine Angaben nur zur
          Beantwortung dieser Anfrage verarbeitet. Mehr in der{" "}
          <Link href="/datenschutz">Datenschutzerklärung</Link>.
        </label>
      </div>
      {hConsent ? (
        <p id="inq-consent-hinweis" className={f.fehler}>
          {hConsent}
        </p>
      ) : null}

      <div className={f.absenden}>
        <button
          type="submit"
          disabled={status.kind === "submitting"}
          aria-describedby="inq-stand"
          className={`btn-signal btn-gross ${f.knopf}`}
        >
          {status.kind === "submitting" ? "Wird gesendet…" : "Anfrage senden"}
          {status.kind !== "submitting" && (
            <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
          )}
        </button>
        <p className={f.oder}>
          Oder kurz anrufen:{" "}
          <a href="tel:+491607621876">0160&nbsp;7621876</a>
        </p>
      </div>
      <p id="inq-stand" className={`notiz-mono ${f.stand}`} aria-live="polite">
        {canSubmit
          ? "Alles da. Bereit zum Senden."
          : `Noch offen: ${fehlt.map((x) => x.label).join(", ")}`}
      </p>
    </form>
  );
}

/* ---------- Feld mit Label und Hinweis ---------- */

function Feld({
  id,
  label,
  pflicht = false,
  hinweis,
  children,
}: {
  id: string;
  label: string;
  pflicht?: boolean;
  hinweis?: string;
  children: ReactNode;
}) {
  return (
    <div className={f.feld}>
      <label htmlFor={id} className={f.label}>
        <span>{label}</span>
        {pflicht ? <span className={f.pflicht}>Pflichtfeld</span> : null}
      </label>
      {children}
      {hinweis ? (
        <p id={`${id}-hinweis`} className={f.fehler}>
          {hinweis}
        </p>
      ) : null}
    </div>
  );
}

/* ---------- Success-Screen ---------- */

function SuccessScreen() {
  return (
    <div className={f.karte} role="status">
      <span className={f.erfolgZeichen}>
        <Check className="h-7 w-7" aria-hidden="true" />
      </span>
      <h2 className={f.erfolgTitel}>Angekommen. Danke!</h2>
      <p className={f.erfolgSatz}>
        Wir lesen Ihre Nachricht jetzt und antworten meist am selben
        Werktag. Was abends oder am Wochenende kommt, beantworten wir am
        nächsten Werktag.{" "}
        <Link href="/erreichbarkeit">Mehr zu unseren Antwortzeiten</Link>.
      </p>
      <div className={f.erfolgFuss}>
        <p className="kennzeile-mono">Während Sie warten</p>
        <p className={f.erfolgSatz}>
          Wenn Sie lieber direkt sprechen, geht das in der offenen
          Sprechstunde ohne Anmeldung. Oder Sie buchen einen
          Gesprächstermin (bis zu 30 Minuten, meist reicht eine
          Viertelstunde).
        </p>
        <div className={f.erfolgAktionen}>
          <Link href="/termin" className="btn-line">
            Termin vereinbaren
          </Link>
          <Link href="/sprechstunde" className={f.textLink}>
            Zur Sprechstunde ›
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
    <div className={f.auswahl}>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={f.eingabe}
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown aria-hidden="true" className={f.pfeil} />
    </div>
  );
}
