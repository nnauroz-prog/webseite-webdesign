import { FileText, Layout, Globe } from "lucide-react";

/**
 * Drei gestapelte Karteikarten-Schichten, die im 3D-Raum
 * voreinanderliegen — Brief, Skizze, Live-Seite. Beim Hover
 * fächern sie nach oben auf, jede mit eigener Z-Tiefe und Neigung,
 * als würde man drei reale Blätter Papier hochklappen.
 *
 * Bewusst pure CSS — keine Pointer-Logik, kein State. Der :hover-
 * Selektor auf dem Container schiebt die drei Layer-Transformationen
 * an, alles läuft als CSS-Transition. Auf Touch (kein Hover) ist
 * der Stapel statisch, die drei Etiketten bleiben aber lesbar.
 *
 * Räumlich gemeint, nicht Spielzeug: max ±7° Neigung,
 * Translation in der Vertikalen + leichte Z-Trennung. Liest sich
 * wie „aufgeschlagene Mappe", nicht wie eine App-Animation.
 */

const LAYERS: {
  icon: typeof FileText;
  eyebrow: string;
  label: string;
  hint: string;
}[] = [
  {
    icon: FileText,
    eyebrow: "I",
    label: "Brief",
    hint: "Logo, Bilder, Worte — von Ihnen.",
  },
  {
    icon: Layout,
    eyebrow: "II",
    label: "Skizze",
    hint: "Erste Seitenstruktur — meist am gleichen Tag.",
  },
  {
    icon: Globe,
    eyebrow: "III",
    label: "Live-Seite",
    hint: "Auf eigener Domain, getestet, gemessen.",
  },
];

export function LayeredStack() {
  return (
    <div className="layered-stack-wrapper relative mx-auto aspect-[5/6] w-full max-w-sm">
      <div className="layered-stack">
        {LAYERS.map((layer, i) => {
          const Icon = layer.icon;
          return (
            <div
              key={layer.label}
              className="layered-stack-card"
              data-layer={i}
            >
              <div className="border-border/60 bg-card/95 ring-foreground/5 relative flex h-full w-full flex-col gap-5 overflow-hidden rounded-2xl border p-6 ring-1 backdrop-blur-sm sm:p-7">
                {/* Papier-Textur als sehr leichte Andeutung */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-[0.04] mix-blend-multiply"
                  style={{
                    backgroundImage:
                      "url(/images/texture-espresso.webp)",
                    backgroundSize: "420px auto",
                  }}
                />
                <div className="relative flex items-center justify-between gap-3">
                  <span className="bg-foreground/[0.04] text-foreground/75 inline-flex h-9 w-9 items-center justify-center rounded-full">
                    <Icon
                      className="h-[15px] w-[15px]"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.28em]">
                    {layer.eyebrow}
                  </span>
                </div>
                <p className="serif text-foreground relative text-[1.6rem] font-normal leading-[1.1] tracking-[-0.02em] sm:text-[1.85rem]">
                  {layer.label}
                </p>
                <p className="text-foreground/70 relative max-w-[20ch] text-pretty text-[13.5px] leading-relaxed">
                  {layer.hint}
                </p>
                <span className="bg-gold/70 relative mt-auto inline-block h-[2px] w-10" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
