"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

/**
 * Live-Vorschau im Hero: Besucher tippen den Namen ihres Betriebs ein,
 * wählen die Branche — und sehen sofort eine Website-Skizze, die auf
 * sie zugeschnitten ist. Der Knopf darunter führt ins Anfrageformular,
 * Branche und Wunsch sind dort schon ausgefüllt.
 *
 * Die Skizze wird in fester Größe (960 × 600) gesetzt und per
 * transform auf die Containerbreite skaliert — so sieht sie auf jedem
 * Gerät aus wie eine echte, verkleinerte Website.
 *
 * Bewusst als „Vorschau" gekennzeichnet: die echte Seite gestalten wir
 * individuell; hier zeigen wir Richtung, nicht Ergebnis.
 */

type Preset = {
  key: string;
  chip: string;
  /** Slug, den das Anfrageformular kennt (inquiry-form INDUSTRY_OPTIONS). */
  inquiry: string;
  defaultName: string;
  accent: string;
  tint: string;
  image: string;
  headline: string;
  sub: string;
  nav: string[];
  cta: string;
  features: string[];
};

const PRESETS: Preset[] = [
  {
    key: "pflege",
    chip: "Pflege",
    inquiry: "pflegedienst",
    defaultName: "Pflegedienst Elbblick",
    accent: "#2f6b5e",
    tint: "#eef5f2",
    image: "/images/atmosphere/pflege-eingang.webp",
    headline: "Pflege mit Herz, zu Hause in Ihrer Nähe.",
    sub: "Ambulante Pflege, Beratung und Entlastung für Angehörige.",
    nav: ["Leistungen", "Team", "Karriere", "Kontakt"],
    cta: "Beratung anfragen",
    features: ["Grund- & Behandlungspflege", "Pflegegrad-Beratung", "Jetzt bewerben"],
  },
  {
    key: "praxis",
    chip: "Praxis",
    inquiry: "arztpraxis",
    defaultName: "Praxis am Stadtpark",
    accent: "#1f5f8b",
    tint: "#edf3f8",
    image: "/images/atmosphere/praxis-raum.webp",
    headline: "Moderne Medizin, persönlich betreut.",
    sub: "Termine online, kurze Wege und alle Leistungen auf einen Blick.",
    nav: ["Praxis", "Leistungen", "Team", "Termin"],
    cta: "Termin buchen",
    features: ["Online-Termin", "Sprechzeiten", "Unsere Leistungen"],
  },
  {
    key: "friseur",
    chip: "Friseur",
    inquiry: "friseur",
    defaultName: "Salon Hanseschnitt",
    accent: "#6b3f5a",
    tint: "#f6eff3",
    image: "/images/atmosphere/friseur-stuhl.webp",
    headline: "Ihr Stil. Unser Handwerk.",
    sub: "Schnitt, Farbe und Pflege. Termin in zwei Klicks.",
    nav: ["Preise", "Team", "Galerie", "Termin"],
    cta: "Termin buchen",
    features: ["Online-Buchung", "Preisliste", "Galerie"],
  },
  {
    key: "gastro",
    chip: "Café",
    inquiry: "cafe",
    defaultName: "Café Kajüte",
    accent: "#9a4b2c",
    tint: "#f8f0ea",
    image: "/images/atmosphere/gastro-cafe.webp",
    headline: "Frühstück, Kuchen und guter Kaffee.",
    sub: "Täglich ab 8 Uhr, mitten im Viertel.",
    nav: ["Karte", "Über uns", "Events", "Reservieren"],
    cta: "Tisch reservieren",
    features: ["Speisekarte", "Öffnungszeiten", "Reservierung"],
  },
  {
    key: "handwerk",
    chip: "Handwerk",
    inquiry: "handwerker",
    defaultName: "Tischlerei Nordholz",
    accent: "#b4572a",
    tint: "#f8efe8",
    image: "/images/atmosphere/handwerker-werkbank.webp",
    headline: "Maßarbeit aus Meisterhand.",
    sub: "Möbel, Innenausbau und Reparaturen mit festem Angebot.",
    nav: ["Leistungen", "Referenzen", "Über uns", "Kontakt"],
    cta: "Rückruf anfordern",
    features: ["Innenausbau", "Referenzen", "Kostenloses Angebot"],
  },
  {
    key: "reinigung",
    chip: "Reinigung",
    inquiry: "reinigung",
    defaultName: "Glanzwerk Gebäudeservice",
    accent: "#1d7a8c",
    tint: "#ebf5f7",
    image: "/images/atmosphere/reinigung-flur.webp",
    headline: "Saubere Räume. Verlässlich.",
    sub: "Büro-, Praxis- und Treppenhausreinigung zu festen Zeiten.",
    nav: ["Leistungen", "Gebiete", "Preise", "Kontakt"],
    cta: "Angebot anfragen",
    features: ["Büroreinigung", "Einsatzgebiete", "Festpreis-Angebot"],
  },
  {
    key: "kanzlei",
    chip: "Kanzlei",
    inquiry: "kanzlei",
    defaultName: "Kanzlei Hartmann & Partner",
    accent: "#1f2f4f",
    tint: "#eef0f5",
    image: "/images/atmosphere/kanzlei-buecher.webp",
    headline: "Recht, das Klarheit schafft.",
    sub: "Arbeits-, Familien- und Mietrecht, verständlich erklärt.",
    nav: ["Rechtsgebiete", "Anwälte", "Kosten", "Kontakt"],
    cta: "Erstberatung vereinbaren",
    features: ["Rechtsgebiete", "Erstberatung", "Ihr Team"],
  },
  {
    key: "fitness",
    chip: "Fitness",
    inquiry: "fitness",
    defaultName: "Studio Hafenkraft",
    accent: "#c4402c",
    tint: "#f9eeec",
    image: "/images/atmosphere/fitness-studio.webp",
    headline: "Stärker. Jeden Tag.",
    sub: "Training, Kurse und Betreuung. Das Probetraining ist kostenlos.",
    nav: ["Kurse", "Preise", "Trainer", "Probetraining"],
    cta: "Probetraining sichern",
    features: ["Kursplan", "Mitgliedschaft", "Probetraining"],
  },
];

const SITE_W = 960;
const SITE_H = 600;

function domainFor(name: string) {
  const slug = name
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/&/g, "und")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);
  return `www.${slug || "ihr-betrieb"}.de`;
}

export function LivePreview() {
  const [presetKey, setPresetKey] = useState(PRESETS[0].key);
  const [name, setName] = useState("");
  const preset = PRESETS.find((p) => p.key === presetKey) ?? PRESETS[0];
  const shownName = name.trim() || preset.defaultName;

  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / SITE_W);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const href = `/anfrage?branche=${preset.inquiry}&vorhaben=${encodeURIComponent(
    `Website für „${shownName}" (${preset.chip}), wie in der Live-Vorschau.`,
  )}`;

  return (
    <div className="bg-card rounded-3xl p-3 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.6)] ring-1 ring-white/10 sm:p-4">
      {/* Steuerung */}
      <div className="px-1 pt-1 pb-3 sm:px-2">
        <label htmlFor="lp-name" className="text-foreground text-[14px] font-semibold">
          Probieren Sie es aus: Wie heißt Ihr Betrieb?
        </label>
        <input
          id="lp-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 40))}
          placeholder={preset.defaultName}
          autoComplete="organization"
          className="border-border bg-background focus-visible:ring-ring/40 mt-2 h-11 w-full rounded-xl border px-4 text-[15px] outline-none focus-visible:ring-2"
        />
        <div role="radiogroup" aria-label="Branche" className="-mx-1 mt-3 flex gap-1.5 overflow-x-auto px-1 pb-1 [scrollbar-width:none]">
          {PRESETS.map((p) => {
            const active = p.key === presetKey;
            return (
              <button
                key={p.key}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setPresetKey(p.key)}
                className={`h-8 shrink-0 rounded-full border px-3.5 text-[13px] font-medium transition-colors ${
                  active
                    ? "bg-foreground text-background border-foreground"
                    : "border-border text-foreground/75 hover:border-foreground/40"
                }`}
              >
                {p.chip}
              </button>
            );
          })}
        </div>
      </div>

      {/* Browserfenster */}
      <div className="overflow-hidden rounded-2xl ring-1 ring-black/10">
        <div className="flex items-center gap-2 bg-[#e9ecf1] px-3 py-2">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
          </span>
          <span className="mx-auto max-w-[70%] truncate rounded-md bg-white/80 px-3 py-0.5 text-center text-[11px] text-[#4b5563]">
            {domainFor(shownName)}
          </span>
        </div>
        <div
          ref={frameRef}
          role="img"
          aria-label={`Vorschau einer Website für ${shownName}, Branche ${preset.chip}`}
          className="relative w-full overflow-hidden bg-white"
          style={{ height: scale ? SITE_H * scale : undefined, aspectRatio: scale ? undefined : `${SITE_W}/${SITE_H}` }}
        >
          <div
            aria-hidden="true"
            className="absolute top-0 left-0 origin-top-left transition-opacity duration-300"
            style={{ width: SITE_W, height: SITE_H, transform: `scale(${scale || 0.5})`, opacity: scale ? 1 : 0 }}
          >
            <MiniSite key={preset.key} preset={preset} name={shownName} />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start gap-2 px-1 pt-4 pb-1 sm:flex-row sm:items-center sm:justify-between sm:px-2">
        <p className="text-muted-foreground text-[12.5px]">Skizze. Ihre echte Seite gestalten wir individuell.</p>
        <Link
          href={href}
          className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-11 shrink-0 items-center whitespace-nowrap rounded-full px-5 text-[14px] font-medium tracking-tight"
        >
          Diese Seite anfragen
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

/** Die verkleinerte Website. Abschnitte bauen sich bei jedem Branchenwechsel neu auf. */
function MiniSite({ preset, name }: { preset: Preset; name: string }) {
  const { accent, tint } = preset;
  return (
    <div className="lp-build flex h-full flex-col text-[#1b2333]" style={{ fontFamily: "var(--font-brand-sans)" }}>
      {/* Navigation */}
      <div className="lp-step flex h-16 items-center justify-between border-b border-black/5 px-10" style={{ "--d": 0 } as React.CSSProperties}>
        <span className="serif max-w-[340px] truncate text-[24px] font-medium tracking-[-0.01em]" style={{ color: accent }}>
          {name}
        </span>
        <span className="flex items-center gap-7 text-[14px] text-[#4b5563]">
          {preset.nav.slice(0, 3).map((n) => (
            <span key={n}>{n}</span>
          ))}
          <span className="rounded-full px-4 py-2 text-[13px] font-medium text-white" style={{ background: accent }}>
            {preset.nav[3]}
          </span>
        </span>
      </div>

      {/* Hero */}
      <div className="grid flex-1 grid-cols-[1.05fr_1fr] gap-10 px-10 pt-10 pb-8" style={{ background: tint }}>
        <div className="flex flex-col justify-center">
          <p className="lp-step text-[12px] font-semibold" style={{ color: accent, "--d": 1 } as React.CSSProperties}>
            {name}
          </p>
          <h3 className="lp-step mt-3 text-[40px] font-semibold leading-[1.05] tracking-[-0.03em]" style={{ "--d": 2 } as React.CSSProperties}>
            {preset.headline}
          </h3>
          <p className="lp-step mt-4 text-[16px] leading-relaxed text-[#4b5563]" style={{ "--d": 3 } as React.CSSProperties}>
            {preset.sub}
          </p>
          <div className="lp-step mt-6 flex gap-3" style={{ "--d": 4 } as React.CSSProperties}>
            <span className="rounded-full px-5 py-2.5 text-[14px] font-medium text-white" style={{ background: accent }}>
              {preset.cta}
            </span>
            <span className="rounded-full border border-black/15 bg-white px-5 py-2.5 text-[14px] font-medium">Anrufen</span>
          </div>
        </div>
        <div className="lp-step relative overflow-hidden rounded-2xl shadow-[0_20px_40px_-20px_rgb(0_0_0/0.35)]" style={{ "--d": 2 } as React.CSSProperties}>
          <Image src={preset.image} alt="" fill sizes="480px" className="object-cover" />
        </div>
      </div>

      {/* Leistungen */}
      <div className="grid grid-cols-3 gap-4 bg-white px-10 py-6">
        {preset.features.map((f, i) => (
          <div
            key={f}
            className="lp-step rounded-xl border border-black/8 p-4"
            style={{ "--d": 5 + i } as React.CSSProperties}
          >
            <span className="block h-1.5 w-8 rounded-full" style={{ background: accent }} />
            <p className="mt-3 text-[15px] font-semibold">{f}</p>
            <span className="mt-2 block h-1.5 w-[85%] rounded-full bg-black/8" />
            <span className="mt-1.5 block h-1.5 w-[60%] rounded-full bg-black/8" />
          </div>
        ))}
      </div>
    </div>
  );
}
