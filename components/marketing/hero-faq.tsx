"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, HelpCircle, X } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Geführte Antworten im Hero — statt Live-KI-Chat.
 *
 * Sechs vorgeschriebene, immer aktuelle Antworten auf die typischen
 * Erstbesucher-Fragen. Klick auf eine Frage → Antwort fadet darunter
 * ein. Kein Backend, keine API-Kosten, keine Halluzinationsgefahr.
 *
 * Visuell bewusst sehr nah am früheren Chat-Widget gehalten, damit
 * der Bereich den gleichen Premium-Charakter behält.
 */

type FAQItem = {
  q: string;
  a: string;
  /** Optional: weiterführender Link, der unter der Antwort steht. */
  link?: { href: string; label: string };
};

const FAQS: FAQItem[] = [
  {
    q: "Was kostet eine Website?",
    a: "Drei Pakete mit klaren Einstiegspreisen: Starter ab 499 €, Business ab 899 €, Premium ab 1.499 € — jeweils einmalig. Dazu kommt ein Monatsbeitrag ab 49 € / 79 € / 129 € für Hosting und Pflege. Den genauen Endpreis nennen wir Ihnen nach Ihrer Anfrage, schwarz auf weiß.",
    link: { href: "/pakete", label: "Alle drei Pakete vergleichen" },
  },
  {
    q: "Wie schnell ist sie fertig?",
    a: "Einfache Seiten sind oft schon nach 1–2 Werktagen live — vorausgesetzt, Sie haben uns Logo, Bilder und ein paar Sätze geschickt. Größere Projekte besprechen wir vorher in Ruhe und vereinbaren einen verbindlichen Termin.",
    link: { href: "/ablauf", label: "Wie ein Projekt bei uns abläuft" },
  },
  {
    q: "Was brauchen Sie von mir?",
    a: "Drei Sachen: Ihr Logo (falls vorhanden), ein paar gute Fotos, und eine kurze Beschreibung Ihrer Leistungen plus Öffnungszeiten. Wenn etwas fehlt, sagen wir Bescheid und helfen bei Formulierungen oder Bildauswahl.",
  },
  {
    q: "Passt das für meine Branche?",
    a: "Wahrscheinlich ja. Wir bauen Seiten für Pflegedienste, Arzt- und Zahnarztpraxen, Friseure, Kosmetikstudios, Cafés, Restaurants, Handwerker, Reinigungsfirmen, Kanzleien, Fitnessstudios und Boutique-Hotels. Andere Branchen auf Anfrage — fragen Sie einfach.",
    link: { href: "/branchen", label: "Beispiele pro Branche ansehen" },
  },
  {
    q: "Wird man bei Google gefunden?",
    a: "Wir legen die Basis sauber: Titel, Beschreibungen, klare Struktur, schnelle Ladezeiten, lokale Suchbegriffe, Sitemap. Garantieren kann Ihnen Platz 1 niemand seriös — aber für lokale Suchen wie „Friseur Eimsbüttel\" oder „Pflegedienst Altona\" sind die Chancen sehr gut.",
  },
  {
    q: "Was ist nach dem Launch?",
    a: "Sie bekommen einen festen Ansprechpartner. Hosting, Sicherheits-Updates, Backups, kleine Änderungen — alles über uns. Sie schreiben, wir setzen es um. Kein Ticket-System, keine Hotline.",
    link: { href: "/faq", label: "Mehr häufige Fragen" },
  },
];

export function HeroFAQ() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div
      className={cn(
        "border-border/60 bg-card/80 ring-foreground/5 relative flex flex-col overflow-hidden rounded-3xl border shadow-[0_24px_60px_-30px_rgb(0_0_0/0.25)] ring-1 backdrop-blur-sm",
      )}
    >
      <div className="border-border/60 flex items-center gap-2.5 border-b px-5 py-3.5">
        <span className="bg-foreground text-background inline-flex h-7 w-7 items-center justify-center rounded-full">
          <HelpCircle className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <p className="text-foreground truncate text-[13px] font-medium tracking-tight">
            Häufige Antworten
          </p>
          <p className="text-muted-foreground truncate text-[11px]">
            Die wichtigsten Fragen auf einen Blick.
          </p>
        </div>
        {selected !== null ? (
          <button
            type="button"
            onClick={() => setSelected(null)}
            aria-label="Zurück zur Übersicht"
            className="border-border/60 text-muted-foreground hover:text-foreground hover:bg-secondary ml-auto inline-flex h-8 w-8 items-center justify-center rounded-full border transition-colors"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <div className="flex flex-col px-5 py-5">
        {selected === null ? (
          <>
            <p className="text-muted-foreground text-[15px] leading-relaxed">
              Tippen Sie auf eine Frage — die Antwort erscheint direkt
              darunter.
            </p>
            <ul className="mt-4 flex flex-col gap-2">
              {FAQS.map((item, i) => (
                <li key={item.q}>
                  <button
                    type="button"
                    onClick={() => setSelected(i)}
                    className="border-border/60 bg-background hover:border-foreground/30 hover:bg-secondary/40 text-foreground group flex w-full items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-left text-[14.5px] font-medium tracking-tight transition-all"
                  >
                    <span>{item.q}</span>
                    <ArrowRight
                      aria-hidden="true"
                      className="text-muted-foreground h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                    />
                  </button>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="hero-faq-fade">
            <p className="text-muted-foreground inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em]">
              <span
                aria-hidden="true"
                className="bg-gold inline-block h-1 w-6"
              />
              Frage {selected + 1} / {FAQS.length}
            </p>
            <h3 className="text-foreground mt-3 text-lg font-semibold leading-snug tracking-[-0.01em] sm:text-xl">
              {FAQS[selected].q}
            </h3>
            <p className="text-foreground/85 mt-4 text-[15px] leading-relaxed">
              {FAQS[selected].a}
            </p>
            {FAQS[selected].link ? (
              <Link
                href={FAQS[selected].link!.href}
                className="text-foreground mt-5 inline-flex items-center gap-1.5 text-[14px] font-medium underline-offset-4 hover:underline"
              >
                {FAQS[selected].link!.label}
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            ) : null}

            <div className="border-border/60 mt-6 border-t pt-4">
              <p className="text-muted-foreground text-[12px] font-medium uppercase tracking-[0.2em]">
                Andere Frage
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {FAQS.map((item, i) =>
                  i === selected ? null : (
                    <button
                      key={item.q}
                      type="button"
                      onClick={() => setSelected(i)}
                      className="border-border/70 bg-background hover:bg-secondary text-foreground/80 hover:text-foreground rounded-full border px-3 py-1.5 text-[12.5px] font-medium tracking-tight transition-colors"
                    >
                      {item.q}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="text-muted-foreground/80 border-border/60 border-t px-5 py-3 text-[12px] leading-relaxed">
        Ihre Frage ist nicht dabei?{" "}
        <Link
          href="/anfrage"
          className="text-foreground underline underline-offset-4"
        >
          Schreiben Sie uns
        </Link>{" "}
        oder{" "}
        <a
          href="tel:+4915224437370"
          className="text-foreground underline underline-offset-4"
        >
          rufen Sie an
        </a>
        .
      </p>
    </div>
  );
}
