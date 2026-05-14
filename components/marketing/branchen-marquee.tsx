import { BRANCHEN } from "@/lib/branchen-data";

/**
 * Endlose, ruhige Laufschrift mit allen 10 Branchen-Namen.
 *
 * Optisch ein Section-Divider zwischen anderen Sektionen — bringt
 * Bewegung in die ansonsten ruhige Site, signalisiert visuell die
 * Branchenvielfalt, und macht den Übergang weniger generisch als
 * eine reine `border-t`-Linie.
 *
 * Implementiert in reinem CSS (translate3d in einer Keyframe-
 * Animation), kein JS, kein Layout-Shift. Die Liste wird doppelt
 * gerendert, damit der Loop nahtlos wirkt.
 */
const ITEMS = BRANCHEN.map((b) => b.label);

export function BranchenMarquee() {
  return (
    <div
      aria-hidden="true"
      className="marquee-pause-on-hover border-border/40 bg-foreground text-background relative overflow-hidden border-y"
    >
      {/* Sanftes Fade an den Rändern, damit die Laufschrift nicht
          abrupt am Viewport-Rand stoppt. */}
      <div className="from-foreground pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r to-transparent" />
      <div className="from-foreground pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l to-transparent" />
      <div className="flex py-6 sm:py-8">
        <ul className="marquee-track flex shrink-0 items-center gap-12 pr-12 sm:gap-16 sm:pr-16">
          {ITEMS.map((label) => (
            <MarqueeItem key={`a-${label}`} label={label} />
          ))}
        </ul>
        {/* Zweite Kopie für den nahtlosen Loop. */}
        <ul
          className="marquee-track flex shrink-0 items-center gap-12 pr-12 sm:gap-16 sm:pr-16"
          aria-hidden="true"
        >
          {ITEMS.map((label) => (
            <MarqueeItem key={`b-${label}`} label={label} />
          ))}
        </ul>
      </div>
    </div>
  );
}

function MarqueeItem({ label }: { label: string }) {
  return (
    <li className="flex items-center gap-12 sm:gap-16">
      <span className="serif-italic text-background/75 text-2xl tracking-[-0.01em] whitespace-nowrap sm:text-3xl">
        {label}
      </span>
      <span
        aria-hidden="true"
        className="bg-gold inline-block h-1.5 w-1.5 shrink-0 rounded-full"
      />
    </li>
  );
}
