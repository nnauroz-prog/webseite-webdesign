"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import a from "@/components/marketing/hafen/atelier.module.css";
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
    <div className={a.skizze}>
      {/* Steuerung */}
      <div className="pb-4">
        <label htmlFor="lp-name" className="text-foreground flex items-baseline gap-2.5 text-[14px] font-semibold">
          <span aria-hidden="true" className="text-gold-ink font-mono text-[11.5px] font-medium">
            01
          </span>
          Wie heißt Ihr Betrieb?
        </label>
        <input
          id="lp-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 40))}
          placeholder={preset.defaultName}
          autoComplete="organization"
          className="mt-1 h-12 w-full border-0 border-b border-[#1b1d1e]/35 bg-transparent px-0 text-[17px] outline-none focus-visible:border-b-2 focus-visible:border-[var(--gold)]"
        />
        <p className="text-foreground mt-5 flex items-baseline gap-2.5 text-[14px] font-semibold" id="lp-branche">
          <span aria-hidden="true" className="text-gold-ink font-mono text-[11.5px] font-medium">
            02
          </span>
          Branche
        </p>
        <div role="radiogroup" aria-labelledby="lp-branche" className="mt-2 flex flex-wrap gap-x-1 gap-y-1">
          {PRESETS.map((p) => {
            const active = p.key === presetKey;
            return (
              <button
                key={p.key}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => setPresetKey(p.key)}
                className={`lp-chip h-11 shrink-0 rounded-[2px] border-b-2 px-2.5 font-mono text-[12.5px] tracking-[0.04em] sm:h-9 ${
                  active ? "text-foreground border-[var(--gold)]" : "text-muted-foreground hover:text-foreground border-transparent"
                }`}
              >
                {p.chip}
              </button>
            );
          })}
        </div>
      </div>

      {/* Flache Skizze auf Papier, ohne Browserrahmen */}
      <div className="border-t border-[#1b1d1e]/20 pt-3">
        <p className={a.skizzeKopf} aria-hidden="true">
          <span>Skizze · {domainFor(shownName)}</span>
          <span>Maßstab 1:2</span>
        </p>
        <div
          ref={frameRef}
          role="img"
          aria-label={`Skizze einer Website für ${shownName}, Branche ${preset.chip}`}
          className="relative w-full overflow-hidden border border-[#1b1d1e]/40 bg-[#fafaf8]"
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

      <div className="flex flex-col items-start gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground font-mono text-[11.5px] leading-[1.5]">
          Eine Skizze zur Orientierung. Ihre Seite gestalten wir eigens für Ihren Betrieb.
        </p>
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

/**
 * Die verkleinerte Website als Strichskizze: Papier, Linien, die
 * Branchenfarbe nur als Strich. Statt des Fotos ein schraffiertes Feld
 * mit „Foto“, wie auf einem Entwurf. Abschnitte bauen sich bei jedem
 * Branchenwechsel neu auf.
 */
function MiniSite({ preset, name }: { preset: Preset; name: string }) {
  const { accent } = preset;
  const linie = "1.5px solid #1b1d1e";
  return (
    <div className="lp-build flex h-full flex-col text-[#1b1d1e]" style={{ fontFamily: "var(--font-sf)" }}>
      {/* Navigation */}
      <div
        className="lp-step flex h-16 items-center justify-between px-10"
        style={{ "--d": 0, borderBottom: linie } as React.CSSProperties}
      >
        <span className="max-w-[340px] truncate text-[24px] font-semibold tracking-[-0.01em]">{name}</span>
        <span className="flex items-center gap-7 text-[14px] text-[#565b5d]">
          {preset.nav.slice(0, 3).map((n) => (
            <span key={n}>{n}</span>
          ))}
          <span className="px-4 py-2 text-[13px] font-medium" style={{ border: `1.5px solid ${accent}` }}>
            {preset.nav[3]}
          </span>
        </span>
      </div>

      {/* Hero */}
      <div className="grid flex-1 grid-cols-[1.05fr_1fr] gap-10 px-10 pt-10 pb-8">
        <div className="flex flex-col justify-center">
          <p className="lp-step font-mono text-[12px] tracking-[0.12em] uppercase" style={{ "--d": 1 } as React.CSSProperties}>
            <span className="mr-2 inline-block h-2 w-2" style={{ background: accent }} />
            {name}
          </p>
          {/* Absatz statt h3: die Musterseite ist Bild, keine Gliederung der echten Seite. */}
          <p className="lp-step mt-3 text-[40px] font-semibold leading-[1.05] tracking-[-0.03em]" style={{ "--d": 2 } as React.CSSProperties}>
            {preset.headline}
          </p>
          <p className="lp-step mt-4 text-[16px] leading-relaxed text-[#565b5d]" style={{ "--d": 3 } as React.CSSProperties}>
            {preset.sub}
          </p>
          <div className="lp-step mt-6 flex gap-3" style={{ "--d": 4 } as React.CSSProperties}>
            <span className="px-5 py-2.5 text-[14px] font-medium" style={{ border: `1.5px solid ${accent}`, color: "#1b1d1e" }}>
              {preset.cta}
            </span>
            <span className="px-5 py-2.5 text-[14px] font-medium" style={{ border: linie }}>
              Anrufen
            </span>
          </div>
        </div>
        <div
          className="lp-step relative flex items-center justify-center"
          style={
            {
              "--d": 2,
              border: linie,
              backgroundImage: "repeating-linear-gradient(135deg, rgb(27 29 30 / 0.16) 0 1px, transparent 1px 12px)",
            } as React.CSSProperties
          }
        >
          <span className="bg-[#fafaf8] px-3 py-1 font-mono text-[13px] tracking-[0.16em] text-[#565b5d] uppercase">Foto</span>
        </div>
      </div>

      {/* Leistungen */}
      <div className="grid grid-cols-3 gap-4 px-10 py-6" style={{ borderTop: linie }}>
        {preset.features.map((f, i) => (
          <div key={f} className="lp-step p-4" style={{ "--d": 5 + i, border: "1px solid rgb(27 29 30 / 0.35)" } as React.CSSProperties}>
            <span className="block h-1.5 w-8" style={{ background: accent }} />
            <p className="mt-3 text-[17px] font-semibold">{f}</p>
            <p className="mt-1.5 text-[14px] leading-snug text-[#565b5d]">{preset.details?.[i] ?? preset.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
