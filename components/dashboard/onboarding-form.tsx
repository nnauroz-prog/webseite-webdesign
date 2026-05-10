"use client";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";

import { FieldError, FormStatus } from "@/components/dashboard/form-status";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { TemplatePreview } from "@/components/dashboard/template-preview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialState } from "@/lib/actions/states";
import { createWebsiteAction } from "@/lib/actions/website";
import {
  ALL_TEMPLATE_KEYS,
  getTemplateMeta,
  type TemplateKey,
} from "@/lib/templates";
import { cn } from "@/lib/utils";
import type { TemplateRow } from "@/types/website";

const SAMPLE_FOR_KEY: Record<
  TemplateKey,
  { headline: string; bullet: string }
> = {
  default: {
    headline: "Willkommen bei [Firmenname]",
    bullet: "3 Beispiel-Leistungen, leerer Team-Bereich",
  },
  pflegedienst: {
    headline: "Pflege mit Herz, Erfahrung und Verlässlichkeit",
    bullet: "5 Pflege-Leistungen, 3 Mitarbeiter:innen, 24/7-Öffnungszeiten",
  },
  arztpraxis: {
    headline: "Moderne Medizin, persönliche Betreuung",
    bullet: "5 Praxis-Leistungen, 2 Ärzt:innen, geteilte Sprechzeiten",
  },
  friseur: {
    headline: "Stil, Schnitt und Präzision",
    bullet: "4 Salon-Leistungen mit Preisen, 2 Friseur:innen",
  },
  physio: {
    headline: "Bewegung. Therapie. Lebensqualität.",
    bullet: "5 Therapie-Leistungen, 2 Therapeut:innen",
  },
  zahnarzt: {
    headline: "Sanfte Zahnmedizin für ein gesundes Lächeln",
    bullet: "5 Behandlungen, 2 Zahnärzt:innen, geteilte Sprechstunden",
  },
  reinigung: {
    headline: "Saubere Räume. Zuverlässig. Gründlich.",
    bullet: "5 Service-Pakete, 24/7-Notdienst",
  },
  schreiner: {
    headline: "Maßarbeit aus Holz",
    bullet: "5 Schreiner-Leistungen, 2 Mitarbeiter, Werkstatt-Zeiten",
  },
  kosmetik: {
    headline: "Auszeit für Sie und Ihre Haut",
    bullet: "5 Behandlungen, 1 Kosmetikerin",
  },
  anwalt: {
    headline: "Vertrauen. Diskretion. Klarheit.",
    bullet: "5 Rechtsgebiete, 2 Anwält:innen, vertrauliche Erstberatung",
  },
  restaurant: {
    headline: "Frische Küche. Herzlicher Service.",
    bullet: "Tageskarte, Reservierungs-Hinweis, Öffnungszeiten",
  },
};

const STEPS = ["Branche", "Firmendaten", "Bestätigen"] as const;

/** Slugify a business name into a clean URL-safe lowercase string. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 63);
}

export function OnboardingForm({ templates }: { templates: TemplateRow[] }) {
  const [state, formAction] = useActionState(createWebsiteAction, initialState);
  const [step, setStep] = useState(0);
  const [selectedKey, setSelectedKey] = useState<TemplateKey>("pflegedienst");
  const [businessName, setBusinessName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);

  // If the server returns field errors that belong to an earlier step,
  // jump back so the user sees the offending input again.
  useEffect(() => {
    if (state.fieldErrors?.industry || state.fieldErrors?.template_id) {
      setStep(0);
    } else if (state.fieldErrors?.business_name || state.fieldErrors?.slug) {
      setStep(1);
    }
  }, [state.fieldErrors]);

  const templateIdByIndustry = new Map<string, string>();
  for (const t of templates) {
    if (t.industry) templateIdByIndustry.set(t.industry, t.id);
  }
  const selectedTemplateId = templateIdByIndustry.get(selectedKey) ?? "";

  const canAdvance = (() => {
    if (step === 0) return Boolean(selectedKey);
    if (step === 1) return businessName.trim().length > 0 && slug.length >= 3;
    return true;
  })();

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden fields — server action reads from FormData only */}
      <input type="hidden" name="industry" value={selectedKey} />
      <input type="hidden" name="template_id" value={selectedTemplateId} />
      <input type="hidden" name="business_name" value={businessName} />
      <input type="hidden" name="slug" value={slug} />

      <Stepper currentStep={step} />
      <FormStatus state={state} />

      {step === 0 && (
        <StepBranche
          selectedKey={selectedKey}
          setSelectedKey={setSelectedKey}
          fieldErrors={state.fieldErrors}
        />
      )}

      {step === 1 && (
        <StepFirmendaten
          businessName={businessName}
          setBusinessName={(v) => {
            setBusinessName(v);
            if (!slugTouched) setSlug(slugify(v));
          }}
          slug={slug}
          setSlug={(v) => {
            setSlug(v);
            setSlugTouched(true);
          }}
          fieldErrors={state.fieldErrors}
        />
      )}

      {step === 2 && (
        <StepBestaetigen
          selectedKey={selectedKey}
          businessName={businessName}
          slug={slug}
        />
      )}

      <div className="flex items-center justify-between gap-2 pt-2">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Zurück
        </Button>
        {step < STEPS.length - 1 ? (
          <Button
            type="button"
            disabled={!canAdvance}
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
          >
            Weiter
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        ) : (
          <SubmitButton
            label="Website anlegen"
            pendingLabel="Wird angelegt …"
          />
        )}
      </div>
    </form>
  );
}

function Stepper({ currentStep }: { currentStep: number }) {
  return (
    <ol className="flex items-center gap-2">
      {STEPS.map((label, i) => {
        const done = i < currentStep;
        const active = i === currentStep;
        return (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors",
                done && "bg-primary text-primary-foreground",
                active && "bg-primary/10 text-primary ring-primary/30 ring-2",
                !done && !active && "bg-secondary text-muted-foreground",
              )}
            >
              {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </span>
            <span
              className={cn(
                "hidden text-sm sm:inline",
                active ? "text-foreground font-medium" : "text-muted-foreground",
              )}
            >
              {label}
            </span>
            {i < STEPS.length - 1 ? (
              <span
                className={cn(
                  "ml-1 h-px flex-1 transition-colors",
                  done ? "bg-primary" : "bg-border",
                )}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}

function StepBranche({
  selectedKey,
  setSelectedKey,
  fieldErrors,
}: {
  selectedKey: TemplateKey;
  setSelectedKey: Dispatch<SetStateAction<TemplateKey>>;
  fieldErrors?: Record<string, string | undefined>;
}) {
  return (
    <div className="space-y-3">
      <div>
        <Label>Wähle deine Branche</Label>
        <p className="text-muted-foreground mt-1 text-xs">
          Wir richten Theme, Beispiel-Leistungen, Team-Texte und Öffnungszeiten
          passend ein.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ALL_TEMPLATE_KEYS.map((key) => {
          const meta = getTemplateMeta(key);
          const sample = SAMPLE_FOR_KEY[key];
          const active = selectedKey === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setSelectedKey(key)}
              className={cn(
                "group relative flex flex-col gap-3 rounded-xl border p-3 text-left transition-all",
                active
                  ? "ring-primary border-primary bg-primary/5 ring-2"
                  : "border-border bg-card hover:border-foreground/30 hover:shadow-sm",
              )}
            >
              <TemplatePreview templateKey={key} hero={meta.hero} />
              <div>
                <div className="text-foreground text-sm font-semibold">
                  {meta.label}
                </div>
                <div className="text-muted-foreground mt-0.5 line-clamp-2 text-xs text-pretty">
                  {sample.bullet}
                </div>
              </div>
              {active ? (
                <span className="bg-primary text-primary-foreground absolute -top-2 -right-2 inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold">
                  <Check className="h-3 w-3" />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      <FieldError message={fieldErrors?.industry} />
      <FieldError message={fieldErrors?.template_id} />
    </div>
  );
}

function StepFirmendaten({
  businessName,
  setBusinessName,
  slug,
  setSlug,
  fieldErrors,
}: {
  businessName: string;
  setBusinessName: (v: string) => void;
  slug: string;
  setSlug: (v: string) => void;
  fieldErrors?: Record<string, string | undefined>;
}) {
  const nameRef = useRef<HTMLInputElement>(null);

  // Autofocus the first field when entering this step.
  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="business_name_input">Firmenname</Label>
        <Input
          ref={nameRef}
          id="business_name_input"
          required
          maxLength={120}
          placeholder="Pflegedienst Sonnenschein"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          aria-invalid={Boolean(fieldErrors?.business_name) || undefined}
        />
        <FieldError message={fieldErrors?.business_name} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="slug_input">URL-Kürzel</Label>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground shrink-0 text-sm">/site/</span>
          <Input
            id="slug_input"
            required
            minLength={3}
            maxLength={63}
            placeholder="pflegedienst-sonnenschein"
            pattern="[a-z0-9](?:[a-z0-9-]*[a-z0-9])?"
            value={slug}
            onChange={(e) => setSlug(e.target.value.toLowerCase())}
            aria-invalid={Boolean(fieldErrors?.slug) || undefined}
            className="font-mono"
          />
        </div>
        <p className="text-muted-foreground text-xs">
          Wird automatisch aus dem Firmennamen abgeleitet — du kannst es
          überschreiben. Kleinbuchstaben, Zahlen und Bindestriche.
        </p>
        <FieldError message={fieldErrors?.slug} />
      </div>
    </div>
  );
}

function StepBestaetigen({
  selectedKey,
  businessName,
  slug,
}: {
  selectedKey: TemplateKey;
  businessName: string;
  slug: string;
}) {
  const meta = getTemplateMeta(selectedKey);
  const sample = SAMPLE_FOR_KEY[selectedKey];
  return (
    <div className="space-y-4">
      <div
        className="from-primary/10 via-background to-background border-primary/20 rounded-xl border bg-gradient-to-br p-5"
        data-template={selectedKey}
      >
        <div className="text-muted-foreground flex items-center gap-1.5 text-xs tracking-wide uppercase">
          <Sparkles className="h-3.5 w-3.5" />
          Vorschau
        </div>
        <p className="mt-3 text-xl font-semibold tracking-tight">
          {sample.headline}
        </p>
        <p className="text-muted-foreground mt-1 text-sm">{sample.bullet}</p>
      </div>

      <dl className="border-border bg-card divide-border divide-y rounded-xl border text-sm">
        <Row label="Firma" value={businessName || "—"} />
        <Row label="URL" value={`/site/${slug || "—"}`} mono />
        <Row label="Branche" value={meta.label} />
        <Row label="Status" value="Privat (kannst du später öffentlich schalten)" />
      </dl>

      <p className="text-muted-foreground text-xs">
        Wir legen die Website mit den Beispiel-Inhalten oben an. Alles ist
        anschließend bearbeitbar oder löschbar.
      </p>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={cn("text-foreground font-medium", mono && "font-mono")}>
        {value}
      </dd>
    </div>
  );
}
