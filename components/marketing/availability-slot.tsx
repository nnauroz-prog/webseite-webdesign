import { AVAILABILITY, upcomingSlotLabels } from "@/lib/availability";
import { cn } from "@/lib/utils";

/**
 * Verfügbarkeits-Slot-Anzeige.
 *
 * Wird auf `/anfrage`, `/pakete` und ggf. im Hero gezeigt.
 * Manuelle Pflege via `lib/availability.ts` — bewusst kein
 * Live-Counter, keine Fake-Knappheit. Wenn die Plätze ausgebucht
 * sind (`availableSlots: 0`), wechselt der Text auf den
 * Folgemonat-Hinweis.
 *
 * Variants:
 *   - "inline":  ein-zeilig, eingebettet in Eyebrows
 *   - "card":    eigene kleine Karte mit Border + Eyebrow
 *
 * Beide ohne Animation per se — die `bg-gold gold-pulse`-Klasse
 * gibt dem Punkt das ruhige Lebenszeichen, das wir auch im
 * AtelierStatus benutzen.
 */
export function AvailabilitySlot({
  variant = "inline",
  className,
}: {
  variant?: "inline" | "card";
  className?: string;
}) {
  const { availableSlots, slotMonth, nextMonth } = AVAILABILITY;
  const open = availableSlots > 0;

  // Konkrete Termine statt „ein paar Slots" — zeit-konkrete Scarcity
  // konvertiert messbar besser, weil sie aus dem Rhetorischen ins
  // Planbare wechselt. Sind keine künftigen Termine gepflegt, fallen
  // wir auf den Monats-Anker zurück.
  const upcoming = open ? upcomingSlotLabels() : [];
  const slotsList = upcoming.join(" und ");

  const headline = open
    ? slotsList
      ? `Nächste freie Bauplätze: ${slotsList}`
      : `Aktuell ${availableSlots} ${availableSlots === 1 ? "Bauplatz" : "Bauplätze"} frei`
    : `${cap(slotMonth)} ist voll`;

  const detail = open
    ? slotsList
      ? "Wer jetzt anfragt, sucht sich den Termin aus."
      : `Letzte Plätze ${slotMonth}. Wer jetzt anfragt, ist noch dabei.`
    : `Wir nehmen Anfragen für ${nextMonth} entgegen — gleiche Konditionen.`;

  if (variant === "card") {
    return (
      <aside
        aria-label="Aktuelle Verfügbarkeit"
        className={cn(
          "border-border/60 bg-card/60 ring-foreground/5 max-w-md rounded-2xl border px-5 py-4 ring-1",
          className,
        )}
      >
        <p className="text-muted-foreground inline-flex items-center gap-2 text-[13px]">
          <span
            aria-hidden="true"
            className={cn(
              "inline-block h-1.5 w-1.5 rounded-full",
              open ? "bg-gold gold-pulse" : "bg-ink-olive/60",
            )}
          />
          Bauplätze · Sitalo-Atelier
        </p>
        <p className="text-foreground mt-2 text-base font-medium tracking-tight">
          {headline}
        </p>
        <p className="text-muted-foreground mt-1 text-[13.5px] leading-relaxed">
          {detail}
        </p>
      </aside>
    );
  }

  return (
    <span
      className={cn(
        "text-muted-foreground inline-flex items-center gap-2 text-[13px]",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-block h-1.5 w-1.5 rounded-full",
          open ? "bg-gold gold-pulse" : "bg-ink-olive/60",
        )}
      />
      <span>{headline}</span>
    </span>
  );
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
