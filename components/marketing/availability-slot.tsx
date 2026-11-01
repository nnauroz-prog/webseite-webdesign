import { AVAILABILITY, upcomingSlotLabels } from "@/lib/availability";
import { cn } from "@/lib/utils";

/**
 * Verfügbarkeits-Anzeige.
 *
 * Wird auf `/anfrage` gezeigt. Manuelle Pflege via
 * `lib/availability.ts` — bewusst kein Live-Counter, keine Fake-
 * Knappheit. Wenn die Plätze ausgebucht sind (`availableSlots: 0`),
 * wechselt der Text auf den Folgemonat.
 *
 * Variants:
 *   - "inline":  eine Zeile in Mono, wie eine Statusanzeige
 *   - "card":    kleiner Kasten mit Haarlinie
 *
 * Der Punkt davor ist ein echter Status (frei / voll): Hafengrün
 * mit ruhigem Puls, wenn Plätze frei sind, Container-Rot ohne
 * Bewegung, wenn nicht.
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

  // Konkrete Termine statt „ein paar Slots". Sind keine künftigen
  // Termine gepflegt, fallen wir auf den Monats-Anker zurück.
  const upcoming = open ? upcomingSlotLabels() : [];
  const slotsList = upcoming.join(" und ");

  const headline = open
    ? slotsList
      ? `Nächste freie Bauplätze: ${slotsList}`
      : `${cap(slotMonth)} noch ${availableSlots} ${availableSlots === 1 ? "Bauplatz" : "Bauplätze"} frei`
    : `${cap(slotMonth)} ist voll`;

  const detail = open
    ? slotsList
      ? "Den Starttermin sprechen wir im ersten Telefonat ab."
      : `Gilt für Seiten, mit denen wir ${slotMonth} anfangen.`
    : `Anfragen für ${nextMonth} nehmen wir weiter an, zu denselben Preisen.`;

  const dot = (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block h-1.5 w-1.5 shrink-0 rounded-full",
        open ? "bg-ink-petrol gold-pulse" : "bg-ink-olive",
      )}
    />
  );

  if (variant === "card") {
    return (
      <aside
        aria-label="Aktuelle Verfügbarkeit"
        className={cn(
          "bg-card border-border max-w-md rounded-[3px] border px-5 py-4",
          className,
        )}
      >
        <p className="label-mono text-muted-foreground flex items-center gap-2.5">
          {dot}
          Freie Bauplätze
        </p>
        <p className="text-foreground mt-2.5 text-[16px] font-semibold tracking-tight">
          {headline}
        </p>
        <p className="text-muted-foreground mt-1 text-[14px] leading-relaxed">
          {detail}
        </p>
      </aside>
    );
  }

  return (
    <p
      className={cn(
        "text-muted-foreground flex items-center gap-2.5 font-mono text-[12.5px]",
        className,
      )}
    >
      {dot}
      <span>{headline}</span>
    </p>
  );
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
