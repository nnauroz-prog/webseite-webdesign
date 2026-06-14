import { cn } from "@/lib/utils";

/**
 * EditorialEyebrow — die wiederkehrende kleine Mast-Zeile oberhalb
 * der H1: vorne ein Gold-Akzent (Pulse-Strich oder Hairline-Linie),
 * dahinter der Eyebrow-Text in Mono-Caps mit Sperrsatz.
 *
 * Vorher 25-fach inline dupliziert auf jeder Page; bei jeder Stil-
 * Anpassung (z. B. Tracking, Bar-Länge, Pulse-Verhalten) müssten
 * alle gleichzeitig nachgezogen werden. Jetzt eine Stelle.
 *
 * Zwei Varianten:
 *   - "bar" (default): kurzer goldener Pulse-Strich (h-1 w-6).
 *     Standard für Marketing-Pages und Sektions-Header.
 *   - "rule": dünnere Hairline-Linie (h-px w-10), ohne Pulse.
 *     Für ruhigere Editorial-Pages (Honorar, Sprechstunde, Jetzt).
 */
export function EditorialEyebrow({
  children,
  variant = "bar",
  className,
}: {
  children: React.ReactNode;
  variant?: "bar" | "rule";
  className?: string;
}) {
  const sizeClass =
    variant === "rule"
      ? "font-mono text-[10px]"
      : "text-[11px] font-medium";
  return (
    <p
      className={cn(
        "text-muted-foreground inline-flex items-center gap-2 uppercase tracking-[0.3em]",
        sizeClass,
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-block",
          variant === "rule" ? "bg-gold h-px w-10" : "bg-gold gold-pulse h-1 w-6",
        )}
      />
      {children}
    </p>
  );
}
