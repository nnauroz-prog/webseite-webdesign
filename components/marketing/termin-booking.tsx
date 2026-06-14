"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Calendar, Check, Clock } from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  type DayCell,
  formatDateLong,
  nextWorkdays,
  SLOT_DURATION_MIN,
  SLOT_TIMES,
} from "@/lib/calendar-availability";
import { cn } from "@/lib/utils";

/**
 * Termin-Buchung mit Tages- und Slot-Picker.
 *
 * Drei-Schritt-Flow:
 *   1. Tag wählen (nächste 14 Werktage als Karten)
 *   2. Slot wählen (15-Min-Raster, 10–17 Uhr ohne Mittag)
 *   3. Kontakt + Notiz + Absenden
 *
 * Backend: Formspree (gleiche Form-ID wie InquiryForm + AuditForm).
 * Eigenes `_subject: "Terminbuchung von X für Y"` damit beim
 * Auftraggeber sauber gefiltert werden kann.
 *
 * Bewusst keine Konflikt-Vermeidung — bei zwei Buchungen für den
 * gleichen Slot bestätigen wir manuell und schlagen alternativ vor.
 * Klein gehalten passt's für die Atelier-Kadenz.
 */

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success"; slot: string; iso: string }
  | { kind: "error"; message: string };

export function TerminBooking({ formspreeId }: { formspreeId?: string }) {
  const days = useMemo(() => nextWorkdays(14), []);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const nameOk = name.trim().length >= 2;
  const emailOk = /\S+@\S+\.\S+/.test(email);
  const canSubmit =
    selectedDate != null &&
    selectedSlot != null &&
    nameOk &&
    emailOk &&
    consent &&
    status.kind !== "submitting";

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    // Doppel-Submit-Schutz.
    if (status.kind === "submitting" || status.kind === "success") return;
    if (!canSubmit || !selectedDate || !selectedSlot) return;

    if (!formspreeId) {
      setStatus({
        kind: "error",
        message:
          "Buchungs-Empfänger ist nicht konfiguriert. Bitte später erneut versuchen oder direkt an info@sitalo.de schreiben.",
      });
      return;
    }

    if (honeypot.trim() !== "") {
      setStatus({
        kind: "success",
        slot: selectedSlot,
        iso: selectedDate,
      });
      return;
    }

    setStatus({ kind: "submitting" });

    const slotDescription = `${formatDateLong(selectedDate)} um ${selectedSlot} Uhr (${SLOT_DURATION_MIN} Min)`;

    const payload: Record<string, unknown> = {
      Name: name,
      "E-Mail": email,
      "Wunsch-Slot": slotDescription,
      Datum: selectedDate,
      Uhrzeit: selectedSlot,
      _subject: `Terminbuchung von ${name} — ${selectedDate} ${selectedSlot}`,
      _replyto: email,
    };
    if (phone.trim()) payload.Telefon = phone.trim();
    if (note.trim()) payload.Notiz = note.trim();

    try {
      const response = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        setStatus({
          kind: "success",
          slot: selectedSlot,
          iso: selectedDate,
        });
      } else {
        // Formspree-Antwort als Plain-Text behandeln: HTML-Tags strippen
        // und auf 200 Zeichen kürzen (XSS-Schutz).
        const text = await response.text().catch(() => "");
        const safeText = text.replace(/<[^>]*>/g, "").trim().slice(0, 200);
        setStatus({
          kind: "error",
          message:
            safeText ||
            "Termin-Buchung fehlgeschlagen. Bitte direkt anrufen: 0152 24437370.",
        });
      }
    } catch (err) {
      setStatus({
        kind: "error",
        message:
          err instanceof Error
            ? `Netzwerkfehler: ${err.message}`
            : "Buchung konnte gerade nicht gesendet werden. Bitte versuchen Sie es erneut.",
      });
    }
  }

  if (status.kind === "success") {
    return (
      <div className="border-border/60 bg-card/60 ring-foreground/5 rounded-2xl border p-8 text-center ring-1">
        <span
          aria-hidden="true"
          className="bg-gold/15 text-foreground mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full"
        >
          <Check className="h-5 w-5" />
        </span>
        <p className="serif text-foreground mt-5 text-balance text-2xl leading-snug tracking-[-0.01em]">
          Notiert.
        </p>
        <p className="text-muted-foreground mx-auto mt-3 max-w-md text-pretty text-[14.5px] leading-relaxed">
          {formatDateLong(status.iso)} um {status.slot} Uhr. Sie bekommen
          innerhalb von 15 Minuten eine Bestätigung per E-Mail mit
          Calendar-Anhang. Falls der Slot doppelt belegt sein sollte
          (selten), schlagen wir Ihnen zwei Alternativen vor.
        </p>
        <p className="text-muted-foreground/70 mt-6 font-mono text-[10px] uppercase tracking-[0.2em]">
          Bestätigung manuell · meist schneller als 15 Min
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="border-border/60 bg-card/60 ring-foreground/5 space-y-8 rounded-2xl border p-6 ring-1 sm:p-8"
    >
      <fieldset>
        <legend className="text-muted-foreground flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em]">
          <Calendar className="h-3 w-3" aria-hidden="true" />
          Schritt 1 — Tag
        </legend>
        <p className="text-foreground mt-2 text-[15px]">
          Welcher Werktag passt Ihnen?
        </p>
        <div className="mt-4 -mx-2 flex gap-2 overflow-x-auto px-2 pb-2 sm:flex-wrap sm:overflow-visible">
          {days.map((d) => (
            <DayButton
              key={d.iso}
              day={d}
              selected={selectedDate === d.iso}
              onClick={() => {
                setSelectedDate(d.iso);
                setSelectedSlot(null);
              }}
            />
          ))}
        </div>
      </fieldset>

      <fieldset disabled={!selectedDate} className="disabled:opacity-50">
        <legend className="text-muted-foreground flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em]">
          <Clock className="h-3 w-3" aria-hidden="true" />
          Schritt 2 — Uhrzeit
        </legend>
        <p className="text-foreground mt-2 text-[15px]">
          {selectedDate
            ? `Welche Uhrzeit am ${formatDateLong(selectedDate)}?`
            : "Erst Tag oben wählen."}
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {SLOT_TIMES.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => setSelectedSlot(slot)}
              aria-pressed={selectedSlot === slot}
              className={cn(
                "h-11 rounded-full border text-[14px] font-medium tracking-tight transition-all",
                selectedSlot === slot
                  ? "border-foreground bg-foreground text-background"
                  : "border-border/70 text-foreground/85 hover:border-foreground/40",
              )}
            >
              {slot}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset
        disabled={!selectedDate || !selectedSlot}
        className="disabled:opacity-50"
      >
        <legend className="text-muted-foreground flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em]">
          <ArrowRight className="h-3 w-3" aria-hidden="true" />
          Schritt 3 — Sie
        </legend>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="termin-name" className="text-foreground text-sm">
              Ihr Name
            </Label>
            <Input
              id="termin-name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2"
              required
            />
          </div>
          <div>
            <Label htmlFor="termin-email" className="text-foreground text-sm">
              E-Mail
            </Label>
            <Input
              id="termin-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-2"
              required
            />
          </div>
        </div>
        <div className="mt-4">
          <Label htmlFor="termin-phone" className="text-foreground text-sm">
            Telefon (optional, falls Rückruf bequemer ist)
          </Label>
          <Input
            id="termin-phone"
            type="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-2"
          />
        </div>
        <div className="mt-4">
          <Label htmlFor="termin-note" className="text-foreground text-sm">
            Worum soll's gehen? (optional)
          </Label>
          <Textarea
            id="termin-note"
            rows={3}
            placeholder="z. B. Erstgespräch, Audit-Besprechung, Wartungs-Übernahme."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-2"
          />
        </div>

        {/* Honeypot */}
        <div className="hidden" aria-hidden="true">
          <label>
            Website
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </label>
        </div>

        <label className="mt-5 flex items-start gap-3 text-[13.5px] leading-relaxed">
          <input
            type="checkbox"
            checked={consent}
            onChange={(e) => setConsent(e.target.checked)}
            className="border-border accent-foreground mt-1 h-4 w-4 rounded border"
            required
          />
          <span className="text-foreground/80">
            Ich bin damit einverstanden, dass meine Angaben für die
            Terminbestätigung gespeichert werden. Details in der{" "}
            <a
              href="/datenschutz"
              className="text-foreground underline underline-offset-4"
            >
              Datenschutzerklärung
            </a>
            .
          </span>
        </label>
      </fieldset>

      {status.kind === "error" && (
        <Alert variant="destructive">
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      )}

      <div className="border-border/40 flex flex-col items-stretch gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-[12.5px]">
          {selectedDate && selectedSlot ? (
            <>
              Gewählt:{" "}
              <span className="text-foreground font-medium">
                {formatDateLong(selectedDate)} · {selectedSlot} Uhr
              </span>
            </>
          ) : (
            "Tag und Uhrzeit oben wählen, dann ausfüllen."
          )}
        </p>
        <Button
          type="submit"
          disabled={!canSubmit}
          className="bg-foreground text-background hover:bg-foreground/90 group h-12 rounded-full px-6 text-[15px] font-medium tracking-tight"
        >
          {status.kind === "submitting"
            ? "Wird gesendet…"
            : "Termin verbindlich anfragen"}
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>
    </form>
  );
}

function DayButton({
  day,
  selected,
  onClick,
}: {
  day: DayCell;
  selected: boolean;
  onClick: () => void;
}) {
  const disabled = day.isBlocked;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        "relative inline-flex h-20 w-16 shrink-0 flex-col items-center justify-center gap-0.5 rounded-2xl border transition-all sm:h-24 sm:w-20",
        selected
          ? "border-foreground bg-foreground text-background"
          : "border-border/70 text-foreground/85 hover:border-foreground/40",
        disabled && "border-dashed opacity-40",
      )}
    >
      <span
        className={cn(
          "font-mono text-[10px] uppercase tracking-[0.18em]",
          selected ? "text-background/65" : "text-muted-foreground",
        )}
      >
        {day.weekday}
      </span>
      <span className="text-xl font-semibold tracking-tight sm:text-2xl">
        {day.day}
      </span>
      <span
        className={cn(
          "text-[10px] uppercase tracking-[0.12em]",
          selected ? "text-background/65" : "text-muted-foreground",
        )}
      >
        {day.month}
      </span>
      {day.isToday && !selected && (
        <span
          aria-hidden="true"
          className="bg-gold absolute right-2 top-2 inline-block h-1.5 w-1.5 rounded-full"
        />
      )}
    </button>
  );
}
