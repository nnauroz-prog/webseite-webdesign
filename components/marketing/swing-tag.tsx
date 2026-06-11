"use client";

import { useRef } from "react";

import { SitaloStempel } from "@/components/marketing/sitalo-stempel";
import { cn } from "@/lib/utils";

/**
 * SwingTag — Atelier-Etikett, das wie ein echtes Papp-Schild an
 * einer Schnur hängt. Pendelt unbewegt sehr langsam (idle), die
 * Maus drückt es leicht aus dem Lot — beim Verlassen schwingt es
 * gedämpft zurück.
 *
 * Aufhängung: oberer Rand, Drehpunkt am Schnurloch in der Mitte
 * oben (transform-origin). Bewegung läuft als CSS-Transition über
 * --swing-angle, kein rAF-Loop. Auf Touch oder reduced-motion
 * bleibt das Etikett still.
 *
 * Bewusst unregelmäßige Cliprand-Geometrie (Ecke abgeschnitten,
 * Schnurloch sichtbar) — sieht nach Manufaktur-Etikett aus, nicht
 * nach Cloud-Logo. Trägt die Sitalo-Identität (Wachssiegel +
 * Adresse), kein generisches Element.
 */
export function SwingTag({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);

  function onPointerMove(event: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    if (event.pointerType !== "mouse") return;
    const rect = el.getBoundingClientRect();
    // Mausposition relativ zur Etikett-Mitte (horizontal)
    const x = (event.clientX - rect.left) / rect.width; // 0..1
    // -8°..+8° Auslenkung, abhängig von der horizontalen Mausposition.
    // Schwingungsamplitude bewusst gemäßigt — Pendel, nicht Spielzeug.
    const angle = (x - 0.5) * 16;
    el.style.setProperty("--swing-angle", `${angle}deg`);
    // Bei Mausaktivität die idle-Pendel-Animation aussetzen, sonst
    // springt das Etikett zwischen Idle-Frame und Pointer-Wert.
    el.style.setProperty("--swing-idle", "paused");
  }

  function onPointerLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--swing-angle", "0deg");
    el.style.setProperty("--swing-idle", "running");
  }

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn("swing-tag-stage relative", className)}
      style={
        {
          "--swing-angle": "0deg",
          "--swing-idle": "running",
        } as React.CSSProperties
      }
    >
      {/* Schnur — feines SVG, das vom oberen Rand bis zum Schnurloch
          geht. Wird mit der Etikette gemeinsam gekippt, schwingt
          also visuell mit. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 4 56"
        className="swing-tag-cord absolute left-1/2 top-0 -translate-x-1/2"
        width="4"
        height="56"
        fill="none"
      >
        <line
          x1="2"
          y1="0"
          x2="2"
          y2="52"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          className="text-background/55"
        />
        {/* Aufhängepunkt oben — winziger Knoten */}
        <circle cx="2" cy="2" r="2" className="fill-background/70" />
      </svg>

      <div className="swing-tag" style={{ marginTop: "52px" }}>
        {/* Etikett-Form — abgeschnittene Ecke oben links signalisiert
            „Manufaktur-Etikett". Das Schnurloch oben in der Mitte
            ist ein echter ausgestanzter Kreis. */}
        <div className="swing-tag-card">
          {/* Schnurloch — kleiner ausgestanzter Kreis */}
          <span
            aria-hidden="true"
            className="border-background/40 bg-foreground absolute top-2.5 left-1/2 z-10 h-2.5 w-2.5 -translate-x-1/2 rounded-full border"
          />
          {/* Inhalt */}
          <div className="text-background relative flex h-full flex-col items-center gap-3 px-7 pb-7 pt-9 text-center">
            <SitaloStempel
              size="sm"
              className="text-gold/85 mt-1"
            />
            <p className="serif-italic text-background text-[1.25rem] leading-tight tracking-[-0.01em]">
              Sitalo
            </p>
            <p className="text-background/75 max-w-[14ch] text-pretty text-[12px] leading-snug">
              Webdesign &amp; Pflege
              <br />
              aus Hamburg
            </p>
            <span
              aria-hidden="true"
              className="bg-gold/70 mt-2 inline-block h-[2px] w-8"
            />
            <p className="text-background/55 font-mono text-[9.5px] uppercase tracking-[0.3em]">
              Anno MMXXVI
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
