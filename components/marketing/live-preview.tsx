"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { BRANCHE_PRESET, EXTRA_PRESETS, PRESETS, type Preset } from "@/lib/muster-presets";

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

const SITE_W = 960;
const SITE_H = 600;

// Füllwörter und Rechtsformen gehören nicht in eine Wunschadresse.
const DOMAIN_WEGLASSEN = new Set(["und", "gmbh", "mbh", "ug", "ag", "kg", "ohg", "gbr", "ek", "co", "haftungsbeschraenkt"]);
const DOMAIN_MAX = 32;

function domainFor(name: string) {
  const woerter = name
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    // „e.K.“ → „ek“, „Co.“ → „co“, bevor Punkte zu Trennern werden.
    .replace(/\b(e)\.\s?(k)\./g, "$1$2")
    // Akzente abtrennen und entfernen: „Café“ → „cafe“.
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((w) => w && !DOMAIN_WEGLASSEN.has(w));
  // Nur ganze Wörter: an der letzten Wortgrenze vor 32 Zeichen kürzen,
  // nie mitten in einer Silbe und nie mit einem Bindestrich vor „.de“.
  let slug = "";
  for (const w of woerter) {
    const next = slug ? `${slug}-${w}` : w;
    if (next.length > DOMAIN_MAX) break;
    slug = next;
  }
  if (!slug && woerter[0]) slug = woerter[0].slice(0, DOMAIN_MAX);
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
    `Website für „${shownName}“ (${preset.chip}), wie in der Skizze.`,
  )}`;

  return (
    <div className="rounded-[18px] bg-white p-3 shadow-karte sm:p-4 lg:rounded-[28px]">
      {/* Steuerung */}
      <div className="px-1 pt-1 pb-3 sm:px-2">
        <label htmlFor="lp-name" className="text-foreground text-[14px] font-semibold">
          Wie heißt Ihr Betrieb?
        </label>
        <input
          id="lp-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 40))}
          placeholder={preset.defaultName}
          autoComplete="organization"
          className="border-input bg-background focus-visible:border-foreground mt-2 h-12 w-full rounded-[12px] border px-4 text-[17px] outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]/40"
        />
        <div role="radiogroup" aria-label="Branche" className="mt-3 flex flex-wrap gap-2">
          {PRESETS.map((p) => {
            const active = p.key === presetKey;
            return (
              <button
                key={p.key}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setPresetKey(p.key)}
                className={`lp-chip h-11 shrink-0 rounded-full border px-4 text-[14px] font-medium sm:h-9 ${
                  active
                    ? "bg-foreground text-background border-foreground"
                    : "border-border text-foreground/80 hover:border-foreground/40"
                }`}
              >
                {p.chip}
              </button>
            );
          })}
        </div>
      </div>

      {/* Browserfenster */}
      <div className="mx-1 overflow-hidden rounded-[12px] ring-1 ring-black/15 sm:mx-2">
        <div className="bg-foreground flex items-center gap-2 px-3 py-2">
          <svg viewBox="0 0 12 14" className="text-stahl-hell h-3 w-3 shrink-0" aria-hidden="true">
            <path d="M3 6V4a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <rect x="1.5" y="6" width="9" height="7" rx="1" fill="currentColor" />
          </svg>
          <span className="text-background/85 min-w-0 truncate font-mono text-[11.5px]">{domainFor(shownName)}</span>
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
        <p className="text-muted-foreground text-[12px] leading-[1.33]">Eine Skizze zur Orientierung. Ihre Seite gestalten wir eigens für Ihren Betrieb.</p>
        <Link href={href} className="btn-signal shrink-0">
          Mit dieser Skizze anfragen
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

/**
 * Musterseite einer Branche als verkleinerte, echte HTML-Skizze im
 * Browserrahmen (statt eines Fotos). Für die Branchenseiten.
 * `rahmen={false}` lässt die Adresszeile weg (kleine Vorschaubilder).
 */
export function MusterFenster({
  branche,
  rahmen = true,
  className = "",
}: {
  branche: string;
  rahmen?: boolean;
  className?: string;
}) {
  const key = BRANCHE_PRESET[branche] ?? "handwerk";
  const preset = [...PRESETS, ...EXTRA_PRESETS].find((p) => p.key === key) ?? PRESETS[0];
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

  return (
    <div className={`overflow-hidden rounded-[12px] bg-white ring-1 ring-black/15 ${className}`}>
      {rahmen ? (
        <div className="bg-foreground flex items-center gap-2 px-3 py-2">
          <svg viewBox="0 0 12 14" className="text-stahl-hell h-3 w-3 shrink-0" aria-hidden="true">
            <path d="M3 6V4a3 3 0 0 1 6 0v2" fill="none" stroke="currentColor" strokeWidth="1.4" />
            <rect x="1.5" y="6" width="9" height="7" rx="1" fill="currentColor" />
          </svg>
          <span className="text-background/85 min-w-0 truncate font-mono text-[11.5px]">
            {domainFor(preset.defaultName)}
          </span>
        </div>
      ) : null}
      <div
        ref={frameRef}
        role="img"
        aria-label={`Musterseite für ${preset.chip}: ${preset.defaultName}`}
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: `${SITE_W}/${SITE_H}` }}
      >
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 origin-top-left transition-opacity duration-300"
          style={{ width: SITE_W, height: SITE_H, transform: `scale(${scale || 0.5})`, opacity: scale ? 1 : 0 }}
        >
          <MiniSite preset={preset} name={preset.defaultName} />
        </div>
      </div>
    </div>
  );
}

/** Die verkleinerte Website. Abschnitte bauen sich bei jedem Branchenwechsel neu auf. */
function MiniSite({ preset, name }: { preset: Preset; name: string }) {
  const { accent, tint } = preset;
  return (
    <div className="lp-build flex h-full flex-col text-[#1b2333]" style={{ fontFamily: "var(--font-sf)" }}>
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
          {/* Absatz statt h3: die Musterseite ist Bild, keine Gliederung der echten Seite. */}
          <p className="lp-step mt-3 text-[40px] font-semibold leading-[1.05] tracking-[-0.03em]" style={{ "--d": 2 } as React.CSSProperties}>
            {preset.headline}
          </p>
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
            className="lp-step rounded-[12px] border border-black/8 p-4"
            style={{ "--d": 5 + i } as React.CSSProperties}
          >
            <span className="block h-1.5 w-8 rounded-full" style={{ background: accent }} />
            <p className="mt-3 text-[17px] font-semibold">{f}</p>
            <p className="mt-1.5 text-[14px] leading-snug text-[#4b5563]">{preset.details?.[i] ?? preset.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
