"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Clock,
  Eye,
  FileText,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Scale,
  Sparkles,
  Wrench,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Command-Palette — Linear-/Vercel-Style Cmd+K Modal.
 *
 * Tastenkürzel: Cmd+K (Mac) / Ctrl+K (Win/Linux). Öffnet eine
 * schnelle Navigations-Liste mit Filter-Input. Power-User können
 * von überall auf jede wichtige Seite navigieren oder direkt
 * anrufen/schreiben, ohne mit der Maus zu navigieren.
 *
 * Strukturierte Sektionen: Aktionen (Anfrage, Anrufen, …), Seiten
 * (Pakete, Branchen, Standorte, FAQ, …), Branchen (10 dynamisch
 * geladen), Standorte (8 dynamisch).
 *
 * Klassisches Keyboard-UX: ↑/↓ navigieren, Enter öffnet, Esc
 * schließt. Filter live während Tippen.
 */

type Action =
  | { kind: "link"; label: string; description: string; href: string; icon: React.ComponentType<{ className?: string }> }
  | { kind: "external"; label: string; description: string; href: string; icon: React.ComponentType<{ className?: string }> };

type Group = {
  label: string;
  items: Action[];
};

/** Vom Server gebauter Inhalts-Index (Essays, Lexikon-Begriffe,
 *  Branchen, Standorte, Pakete) — siehe lib/search-index.ts für
 *  das Warum der Prop-Übergabe. */
export type PaletteSearchDoc = {
  kind: "essay" | "begriff" | "branche" | "standort" | "paket";
  label: string;
  description: string;
  href: string;
};

export function CommandPalette({
  searchIndex = [],
}: {
  searchIndex?: PaletteSearchDoc[];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();

  // Globaler Cmd+K / Ctrl+K Listener — öffnet die Palette von überall
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const isToggle =
        (e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey);
      if (isToggle) {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      if (e.key === "Escape" && open) {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Beim Öffnen: Input fokussieren, Query + Index resetten
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      // Kurze Verzögerung — Modal muss erst im DOM sein
      setTimeout(() => inputRef.current?.focus(), 20);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const groups: Group[] = useMemo(() => {
    const direct: Action[] = [
      {
        kind: "link",
        label: "Website anfragen",
        description: "Drei Felder, Antwort meist am selben Tag",
        href: "/anfrage",
        icon: Sparkles,
      },
      {
        kind: "link",
        label: "Termin buchen",
        description: "30 Min Erstgespräch, Bestätigung in 15 Min",
        href: "/termin",
        icon: Sparkles,
      },
      {
        kind: "link",
        label: "Sprechstunde",
        description: "Jeden ersten Donnerstag, 17–18:30 Uhr · Telefon",
        href: "/sprechstunde",
        icon: Phone,
      },
      {
        kind: "link",
        label: "Welches Paket passt? — Quiz",
        description: "Fünf Fragen, eine ehrliche Empfehlung",
        href: "/empfehlung",
        icon: Sparkles,
      },
      {
        kind: "link",
        label: "Kostenlosen Audit anfordern",
        description: "Drei Punkte zu Ihrer Seite, in 48 h",
        href: "/audit",
        icon: Eye,
      },
      {
        kind: "link",
        label: "Speed-Check live",
        description: "Lighthouse-Scores in 30 Sekunden",
        href: "/check",
        icon: Zap,
      },
      {
        kind: "external",
        label: "Anrufen",
        description: "0152 24437370",
        href: "tel:+4915224437370",
        icon: Phone,
      },
      {
        kind: "external",
        label: "Schreiben",
        description: "info@sitalo.de",
        href: "mailto:info@sitalo.de",
        icon: Mail,
      },
    ];

    const pages: Action[] = [
      {
        kind: "link",
        label: "Pakete & Preise",
        description: "Vier Stufen, ab 499 €",
        href: "/pakete",
        icon: Package,
      },
      {
        kind: "link",
        label: "Honorar",
        description: "Open-Book — Stundensatz, Aufwand pro Paket.",
        href: "/honorar",
        icon: Package,
      },
      {
        kind: "link",
        label: "3-Jahres-Rechner",
        description: "Was kostet's wirklich? Mit Eigenzeit.",
        href: "/rechner",
        icon: Package,
      },
      {
        kind: "link",
        label: "Wartung & Werkbank",
        description: "Pflege ab 49 €, Werkbank On-Demand ab 299 €",
        href: "/wartung",
        icon: Wrench,
      },
      {
        kind: "link",
        label: "Erreichbarkeit",
        description: "Wann wir antworten — offen, mit Grenzen",
        href: "/erreichbarkeit",
        icon: Clock,
      },
      {
        kind: "link",
        label: "Vergleich",
        description: "Sitalo, Wix, Squarespace, Jimdo, KI-Eigenbau",
        href: "/vergleich",
        icon: Scale,
      },
      {
        kind: "link",
        label: "Branchen",
        description: "10 Branchen, 10 Layouts",
        href: "/branchen",
        icon: FileText,
      },
      {
        kind: "link",
        label: "Standorte",
        description: "8 Hamburger Stadtteile",
        href: "/standorte",
        icon: MapPin,
      },
      {
        kind: "link",
        label: "Das Atelier",
        description: "Wer wir sind, was wir glauben",
        href: "/atelier",
        icon: FileText,
      },
      {
        kind: "link",
        label: "Jetzt",
        description: "Was im Atelier gerade passiert — Now-Page",
        href: "/jetzt",
        icon: BookOpen,
      },
      {
        kind: "link",
        label: "Ablauf",
        description: "Sechs Schritte zur Live-Seite",
        href: "/ablauf",
        icon: FileText,
      },
      {
        kind: "link",
        label: "Manifest",
        description: "Acht Sätze. Was wir tun, was wir nicht tun.",
        href: "/manifest",
        icon: BookOpen,
      },
      {
        kind: "link",
        label: "Inventar",
        description: "Was wir verwenden — und bewusst nicht.",
        href: "/inventar",
        icon: BookOpen,
      },
      {
        kind: "link",
        label: "Lexikon",
        description: "Webbegriffe in Klartext, ohne Einschüchterung",
        href: "/lexikon",
        icon: BookOpen,
      },
      {
        kind: "link",
        label: "Auswahl",
        description: "Wer zu uns kommt — und wer nicht.",
        href: "/auswahl",
        icon: BookOpen,
      },
      {
        kind: "link",
        label: "Journal",
        description: "Beobachtungen aus dem Atelier",
        href: "/journal",
        icon: BookOpen,
      },
      {
        kind: "link",
        label: "FAQ",
        description: "Häufige Fragen",
        href: "/faq",
        icon: MessageCircle,
      },
      {
        kind: "link",
        label: "Kontakt",
        description: "Alle Wege auf einer Seite",
        href: "/kontakt",
        icon: Mail,
      },
    ];

    // Branchen, Standorte, Pakete kommen aus dem Server-Index — kein
    // Direkt-Import der voll-attributierten Data-Files mehr, das hat
    // die ganze Branchen-FAQ-Sektion in den Client-Bundle gezogen.
    const branchen: Action[] = searchIndex
      .filter((d) => d.kind === "branche")
      .map((d) => ({
        kind: "link" as const,
        label: d.label,
        description: d.description.split(".")[0] + ".",
        href: d.href,
        icon: FileText,
      }));

    const standorte: Action[] = searchIndex
      .filter((d) => d.kind === "standort")
      .map((d) => ({
        kind: "link" as const,
        label: d.label.replace(" · Hamburg", ""),
        description: d.description,
        href: d.href,
        icon: MapPin,
      }));

    const pakete: Action[] = searchIndex
      .filter((d) => d.kind === "paket")
      .map((d) => ({
        kind: "link" as const,
        label: d.label,
        description: d.description,
        href: d.href,
        icon: Package,
      }));

    if (!query.trim()) {
      return [
        { label: "Sofort", items: direct },
        { label: "Seiten", items: pages },
        { label: "Pakete", items: pakete },
        { label: "Branchen", items: branchen.slice(0, 5) },
        { label: "Stadtteile", items: standorte.slice(0, 4) },
      ];
    }

    // Filter alle Items über Query — case-insensitive auf label + description
    const q = query.toLowerCase();
    const match = (a: Action) =>
      a.label.toLowerCase().includes(q) ||
      a.description.toLowerCase().includes(q);

    // Inhalts-Suche über den Server-Index: Essays und Lexikon-
    // Begriffe tauchen erst auf, wenn getippt wird — die Default-
    // Ansicht bleibt Navigation, die Suche wird zur Volltext-Hilfe.
    const essays: Action[] = searchIndex
      .filter((d) => d.kind === "essay")
      .map((d) => ({
        kind: "link" as const,
        label: d.label,
        description: d.description,
        href: d.href,
        icon: BookOpen,
      }))
      .filter(match)
      .slice(0, 5);

    const begriffe: Action[] = searchIndex
      .filter((d) => d.kind === "begriff")
      .map((d) => ({
        kind: "link" as const,
        label: d.label,
        description: d.description,
        href: d.href,
        icon: BookOpen,
      }))
      .filter(match)
      .slice(0, 5);

    return [
      { label: "Sofort", items: direct.filter(match) },
      { label: "Seiten", items: pages.filter(match) },
      { label: "Pakete", items: pakete.filter(match) },
      { label: "Branchen", items: branchen.filter(match) },
      { label: "Stadtteile", items: standorte.filter(match) },
      { label: "Essays", items: essays },
      { label: "Lexikon", items: begriffe },
    ].filter((g) => g.items.length > 0);
  }, [query, searchIndex]);

  // Flatten für Keyboard-Navigation
  const flat = useMemo(() => groups.flatMap((g) => g.items), [groups]);

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flat.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const item = flat[activeIndex];
      if (!item) return;
      if (item.kind === "external") {
        window.location.href = item.href;
      } else {
        router.push(item.href);
      }
      setOpen(false);
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[15vh]"
      onClick={() => setOpen(false)}
      aria-modal="true"
      role="dialog"
      aria-label="Schnellnavigation"
    >
      {/* Backdrop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
      />

      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card border-border/60 ring-foreground/5 relative w-full max-w-xl overflow-hidden rounded-2xl border shadow-[0_30px_80px_-20px_rgb(0_0_0/0.3)] ring-1"
      >
        {/* Input + Hinweis-Kürzel */}
        <div className="border-border/60 flex items-center gap-3 border-b px-4 py-3">
          <Sparkles className="text-muted-foreground h-4 w-4 shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={onKeyDown}
            placeholder="Suchen oder springen… (Branche, Stadtteil, Anfrage …)"
            className="text-foreground placeholder:text-muted-foreground/70 flex-1 bg-transparent text-[15px] outline-none"
          />
          <kbd className="border-border/70 text-muted-foreground hidden rounded-md border px-1.5 py-0.5 font-mono text-[10px] sm:inline-block">
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto py-2">
          {flat.length === 0 ? (
            <div className="text-muted-foreground px-4 py-8 text-center text-sm">
              Nichts gefunden — vielleicht direkt{" "}
              <Link
                href="/anfrage"
                className="text-foreground underline underline-offset-4"
                onClick={() => setOpen(false)}
              >
                anfragen
              </Link>
              ?
            </div>
          ) : (
            (() => {
              let idx = -1;
              return groups.map((g) => (
                <div key={g.label} className="mb-2">
                  <p className="text-muted-foreground/80 px-4 pt-3 pb-1 font-mono text-[10px] uppercase tracking-[0.18em]">
                    {g.label}
                  </p>
                  <ul>
                    {g.items.map((item) => {
                      idx += 1;
                      const active = idx === activeIndex;
                      const Icon = item.icon;
                      const itemIndex = idx;
                      return (
                        <li key={item.href}>
                          <CommandItem
                            item={item}
                            active={active}
                            icon={Icon}
                            onHover={() => setActiveIndex(itemIndex)}
                            onSelect={() => setOpen(false)}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ));
            })()
          )}
        </div>

        {/* Footer Hint */}
        <div className="border-border/60 text-muted-foreground/80 flex items-center justify-between gap-2 border-t px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.15em]">
          <span className="inline-flex items-center gap-2">
            <kbd className="border-border/70 rounded-md border px-1.5 py-0.5 normal-case">
              ↑↓
            </kbd>
            navigieren
          </span>
          <span className="inline-flex items-center gap-2">
            <kbd className="border-border/70 rounded-md border px-1.5 py-0.5 normal-case">
              ↵
            </kbd>
            öffnen
          </span>
          <span className="hidden sm:inline-flex items-center gap-2">
            <kbd className="border-border/70 rounded-md border px-1.5 py-0.5 normal-case">
              ⌘K
            </kbd>
            schließen
          </span>
        </div>
      </div>
    </div>
  );
}

function CommandItem({
  item,
  active,
  icon: Icon,
  onHover,
  onSelect,
}: {
  item: Action;
  active: boolean;
  icon: React.ComponentType<{ className?: string }>;
  onHover: () => void;
  onSelect: () => void;
}) {
  const className = `flex items-center gap-3 px-4 py-2.5 transition-colors ${
    active
      ? "bg-accent/60 text-foreground"
      : "text-foreground/85 hover:bg-accent/40"
  }`;

  const content = (
    <>
      <Icon
        className={`h-4 w-4 shrink-0 transition-colors ${
          active ? "text-gold" : "text-muted-foreground"
        }`}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14.5px] font-medium tracking-tight">
          {item.label}
        </p>
        <p className="text-muted-foreground truncate text-[12.5px]">
          {item.description}
        </p>
      </div>
      <ArrowRight
        className={`h-3.5 w-3.5 shrink-0 transition-opacity ${
          active ? "opacity-100" : "opacity-0"
        }`}
        aria-hidden="true"
      />
    </>
  );

  if (item.kind === "external") {
    return (
      <a
        href={item.href}
        onClick={onSelect}
        onMouseEnter={onHover}
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={onSelect}
      onMouseEnter={onHover}
      className={className}
    >
      {content}
    </Link>
  );
}
