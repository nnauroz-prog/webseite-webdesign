"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";

/**
 * Hero-Prompt — Lovable-inspirierte Eingabe direkt im Hero.
 *
 * Der Besucher tippt eine kurze Beschreibung seines Vorhabens
 * ("Pflegedienst-Website mit Bewerbungsformular"), klickt Anfragen
 * → wir navigieren zu /anfrage?vorhaben=… und der Wizard nutzt
 * das später als Kontext im Schritt „Beschreibung".
 *
 * Editorial gestaltet: kein bunter Gradient-Frame wie bei Wix,
 * stattdessen ein ruhiges Pill-Input im Brand-Style mit feinem
 * Schatten.
 */
export function HeroPrompt() {
  const router = useRouter();
  const [value, setValue] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      router.push("/anfrage");
      return;
    }
    const params = new URLSearchParams({ vorhaben: trimmed });
    router.push(`/anfrage?${params.toString()}`);
  }

  return (
    <form
      onSubmit={submit}
      className="border-border/70 bg-card focus-within:border-foreground/40 focus-within:shadow-[0_12px_32px_-12px_rgb(0_0_0/0.16)] mt-10 flex w-full max-w-xl items-center gap-2 rounded-full border p-1.5 shadow-[0_8px_24px_-12px_rgb(0_0_0/0.12)] transition-all sm:p-2"
      aria-label="Schnellanfrage"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Was wollen Sie bauen lassen? z. B. Pflegedienst-Website mit Bewerbungsformular"
        aria-label="Was wollen Sie bauen lassen?"
        className="text-foreground placeholder:text-muted-foreground/80 min-w-0 flex-1 bg-transparent px-4 py-2 text-[15px] outline-none sm:text-base"
      />
      <button
        type="submit"
        className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-11 shrink-0 items-center rounded-full px-5 text-[14px] font-medium tracking-tight transition-all sm:h-12 sm:px-6 sm:text-[15px]"
      >
        Anfragen
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </form>
  );
}
