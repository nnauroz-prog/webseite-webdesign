"use client";

import { Phone } from "lucide-react";

import { markContact } from "@/app/admin/client-state";

/**
 * 44px-Knopf „Anrufen“ für Listenkarten. Merkt den Anruf vor, damit
 * nach der Rückkehr „Erreicht?“ gefragt wird (wie in der Daumenleiste).
 */
export function CallButton({
  href,
  leadId,
  name,
}: {
  href: string;
  leadId: string;
  name: string;
}) {
  return (
    <a
      href={href}
      onClick={() => markContact({ leadId, kanal: "anruf", name })}
      aria-label={`${name} anrufen`}
      className="border-border bg-background hover:border-foreground/40 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[3px] border transition-colors"
    >
      <Phone className="h-5 w-5" aria-hidden="true" />
    </a>
  );
}

/**
 * Telefonnummer im Text als Anruf-Link, ebenfalls mit Vormerkung.
 * Das senkrechte Polster vergrößert nur die Tippfläche (Inline-
 * Element), nicht die Zeilenhöhe.
 */
export function PhoneLink({
  href,
  leadId,
  name,
  children,
}: {
  href: string;
  leadId: string;
  name: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      onClick={() => markContact({ leadId, kanal: "anruf", name })}
      className="decoration-foreground/30 hover:decoration-foreground py-3 underline underline-offset-4"
    >
      {children}
    </a>
  );
}
