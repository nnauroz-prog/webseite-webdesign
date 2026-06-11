"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";

/**
 * FlipCard — echte 3D-Rotation um die Y-Achse. Vorderseite trägt
 * Titel/Lead-Text, Rückseite trägt das Detail-Versprechen. Hover
 * dreht um 180°, ein Klick öffnet den Link.
 *
 * Bewusst auf Hover-Geräten aktiv (hover:hover + pointer:fine).
 * Auf Touch wird gar nicht erst geflippt — der Tap führt direkt
 * auf die Zielseite, dort steht alles ohnehin ausgeschrieben.
 *
 * Höhen-Strategie: outer Wrapper bestimmt die Größe, beide Seiten
 * füllen ihn absolut. Damit ist die Karte gleich groß wie eine
 * statische Karte, der Flip kollabiert das Layout nicht.
 */
export function FlipCard({
  href,
  className,
  front,
  back,
  ariaLabel,
}: {
  href: string;
  className?: string;
  front: React.ReactNode;
  back: React.ReactNode;
  ariaLabel?: string;
}) {
  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={cn("flip-card group block", className)}
    >
      <div className="flip-card-inner">
        <div className="flip-card-front">{front}</div>
        <div className="flip-card-back">{back}</div>
      </div>
    </Link>
  );
}
