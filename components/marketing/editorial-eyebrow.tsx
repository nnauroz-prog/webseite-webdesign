import { cn } from "@/lib/utils";

/**
 * EditorialEyebrow — kleine Kopfzeile über einer Überschrift, im
 * Hafen-Stil als Mono-Beschriftung (`label-mono`) ohne Zierstrich.
 * Das orange Quadrat gibt es nur im Seitenkopf (PageHero/Startseite).
 *
 * `variant` bleibt aus Kompatibilität erhalten, ändert aber nichts
 * mehr am Aussehen. `tone="dark"` für dunkle Flächen.
 */
export function EditorialEyebrow({
  children,
  tone = "light",
  className,
}: {
  children: React.ReactNode;
  /** @deprecated Ohne Wirkung, beide Varianten sehen gleich aus. */
  variant?: "bar" | "rule";
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "label-mono",
        tone === "dark" ? "text-stahl-hell" : "text-muted-foreground",
        className,
      )}
    >
      {children}
    </p>
  );
}
