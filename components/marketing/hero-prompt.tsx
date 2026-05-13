"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowRight } from "lucide-react";

import { matchKeyword } from "@/lib/keyword-routing";

/**
 * Hero-Prompt — Eingabe direkt im Hero, mit smartem Routing.
 *
 * Strategie:
 *  - Während des Tippens: prüfen, ob die Eingabe ein bekanntes
 *    Branchen-Stichwort enthält ("Pflegedienst", "Café", "Friseur",
 *    "Praxis", "Handwerker", "Kanzlei", "Fitness", "Reinigung", …).
 *  - Treffer → Live-Suggestion-Pille unter dem Input: "Beispiel
 *    für [Branche] anschauen". Direktlink zur Detailseite.
 *  - Beim Submit: wenn Treffer → /anfrage?branche=…&vorhaben=…
 *    (der Wizard startet dann direkt mit vorausgewählter Branche).
 *    Ohne Treffer: /anfrage?vorhaben=… (freier Text).
 */
export function HeroPrompt() {
  const router = useRouter();
  const [value, setValue] = useState("");
  const match = useMemo(() => matchKeyword(value), [value]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      router.push("/anfrage");
      return;
    }
    const params = new URLSearchParams({ vorhaben: trimmed });
    if (match) params.set("branche", match.industry);
    router.push(`/anfrage?${params.toString()}`);
  }

  return (
    <div className="mt-10 w-full max-w-xl">
      <form
        onSubmit={submit}
        className="border-border/70 bg-card focus-within:border-foreground/40 focus-within:shadow-[0_12px_32px_-12px_rgb(0_0_0/0.16)] flex items-center gap-2 rounded-full border p-1.5 shadow-[0_8px_24px_-12px_rgb(0_0_0/0.12)] transition-all sm:p-2"
        aria-label="Schnellanfrage"
      >
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Was wollen Sie bauen lassen? z. B. Pflegedienst, Café, Kanzlei …"
          aria-label="Was wollen Sie bauen lassen?"
          className="text-foreground placeholder:text-muted-foreground/80 min-w-0 flex-1 bg-transparent px-4 py-2 text-[15px] outline-none sm:text-base"
        />
        <button
          type="submit"
          className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-10 shrink-0 items-center rounded-full px-4 text-[14px] font-medium tracking-tight transition-all sm:h-11 sm:px-5 sm:text-[15px]"
        >
          <span className="hidden sm:inline">Anfragen</span>
          <ArrowRight className="h-4 w-4 sm:ml-2" />
        </button>
      </form>

      {/* Live-Suggestion */}
      <div className="mt-3 min-h-[28px] text-sm">
        {match ? (
          <div className="text-muted-foreground flex flex-wrap items-center gap-2">
            <span>Passend dazu:</span>
            <Link
              href={`/branchen/${match.branche}`}
              className="border-foreground/30 text-foreground hover:bg-foreground hover:text-background inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[13px] font-medium tracking-tight transition-colors"
            >
              {match.label}-Beispiel ansehen
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </Link>
          </div>
        ) : value.length >= 3 ? (
          <p className="text-muted-foreground">
            Drücken Sie Enter — der Konfigurator nimmt Ihre Beschreibung
            mit.
          </p>
        ) : null}
      </div>
    </div>
  );
}
