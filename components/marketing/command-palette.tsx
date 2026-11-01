"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Clock,
  Eye,
  FileText,
  ListChecks,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Scale,
  Search,
  Send,
  Wrench,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Command-Palette — Schnellnavigation per Cmd+K.
 *
 * Tastenkürzel: Cmd+K (Mac) / Ctrl+K (Win/Linux). Öffnet eine
 * schnelle Navigations-Liste mit Filter-Input. Power-User können
 * von überall auf jede wichtige Seite navigieren oder direkt
 * anrufen/schreiben, ohne mit der Maus zu navigieren.
 *
 * Strukturierte Sektionen: Direkt (Anfrage, Anrufen, …), Seiten
 * (Pakete, Branchen, Standorte, FAQ, …), dazu Pakete, Branchen und
 * Stadtteile aus dem Server-Index.
 *
 * Gestaltung: kantiger Kasten mit Haarlinien, Gruppennamen in Mono,
 * kein Weichzeichner hinter dem Fenster.
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

  // Beim Öffnen: Input fokussieren, Index resetten. Query NICHT
  // resetten wenn vom URL-Param vorbefüllt (siehe SearchAction-
  // Effect unten) — sonst kollidiert das mit dem Initial-Query.
  useEffect(() => {
    if (open) {
      setActiveIndex(0);
      // Kurze Verzögerung — Modal muss erst im DOM sein
      setTimeout(() => inputRef.current?.focus(), 20);
      document.body.style.overflow = "hidden";
    } else {
      setQuery("");
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Google-Sitelinks-SearchAction: Eingang über ?q=… auf der Seite.
  // Wenn der User aus dem SERP-Suchfeld kommt, öffnen wir die Palette
  // automatisch mit vorbefülltem Query — und entfernen den Param
  // wieder aus der URL, damit er nicht beim Reload nochmal triggert.
  //
  // Direkter window.location.search-Read statt useSearchParams-Hook,
  // damit das Prerender (z. B. von /_not-found) nicht in Suspense
  // gewickelt werden muss.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q")?.trim();
    if (!q) return;
    setQuery(q);
    setOpen(true);
    const url = new URL(window.location.href);
    url.searchParams.delete("q");
    window.history.replaceState({}, "", url.toString());
  }, []);

  const groups: Group[] = useMemo(() => {
    const direct: Action[] = [
      {
        kind: "link",
        label: "Website anfragen",
        description: "Formular mit drei Feldern, Antwort meist am selben Werktag",
        href: "/anfrage",
        icon: Send,
      },
      {
        kind: "link",
        label: "Termin buchen",
        description: "Erstgespräch, bis zu 30 Minuten, Bestätigung meist am selben Werktag",
        href: "/termin",
        icon: CalendarDays,
      },
      {
        kind: "link",
        label: "Sprechstunde",
        description: "Erster Donnerstag im Monat, 17 bis 18:30 Uhr, am Telefon",
        href: "/sprechstunde",
        icon: Phone,
      },
      {
        kind: "link",
        label: "Paket-Empfehlung",
        description: "Fünf Fragen, danach eine Empfehlung mit Begründung",
        href: "/empfehlung",
        icon: ListChecks,
      },
      {
        kind: "link",
        label: "Kostenlose Durchsicht Ihrer Website",
        description: "Drei bis fünf Punkte zu Ihrer Seite per E-Mail, meist in zwei Werktagen",
        href: "/audit",
        icon: Eye,
      },
      {
        kind: "link",
        label: "Ladezeit-Test",
        description: "Ladezeit messen mit Google PageSpeed, in etwa 30 Sekunden",
        href: "/check",
        icon: Zap,
      },
      {
        kind: "external",
        label: "Anrufen",
        description: "0160 7621876",
        href: "tel:+491607621876",
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
        description: "Starter ab 499 €, dazu ab 49 € im Monat",
        href: "/pakete",
        icon: Package,
      },
      {
        kind: "link",
        label: "Honorar",
        description: "Stundensatz und Aufwand je Paket, offen vorgerechnet",
        href: "/honorar",
        icon: Package,
      },
      {
        kind: "link",
        label: "3-Jahres-Rechner",
        description: "Kosten über drei Jahre, mit Ihrer eigenen Zeit gerechnet",
        href: "/rechner",
        icon: Package,
      },
      {
        kind: "link",
        label: "Wartung & Werkbank",
        description: "Pflege ab 49 €, Werkbank mit festen Stunden ab 299 €",
        href: "/wartung",
        icon: Wrench,
      },
      {
        kind: "link",
        label: "Erreichbarkeit",
        description: "Wann wir ans Telefon gehen und Mails beantworten",
        href: "/erreichbarkeit",
        icon: Clock,
      },
      {
        kind: "link",
        label: "Vergleich",
        description: "Wix, Squarespace, Jimdo und Eigenbau im Vergleich",
        href: "/vergleich",
        icon: Scale,
      },
      {
        kind: "link",
        label: "Branchen",
        description: "Was wir je Branche anders bauen",
        href: "/branchen",
        icon: FileText,
      },
      {
        kind: "link",
        label: "Standorte",
        description: "Webdesign in Hamburger Stadtteilen",
        href: "/standorte",
        icon: MapPin,
      },
      {
        kind: "link",
        label: "Über uns",
        description: "Wie wir arbeiten und woran wir uns halten",
        href: "/atelier",
        icon: FileText,
      },
      {
        kind: "link",
        label: "Jetzt",
        description: "Woran wir gerade arbeiten",
        href: "/jetzt",
        icon: BookOpen,
      },
      {
        kind: "link",
        label: "Ablauf",
        description: "Vom ersten Anruf bis zur fertigen Seite",
        href: "/ablauf",
        icon: FileText,
      },
      {
        kind: "link",
        label: "Manifest",
        description: "Wie wir Websites bauen, in kurzen Sätzen",
        href: "/manifest",
        icon: BookOpen,
      },
      {
        kind: "link",
        label: "Inventar",
        description: "Werkzeuge und Dienste, die wir verwenden",
        href: "/inventar",
        icon: BookOpen,
      },
      {
        kind: "link",
        label: "Lexikon",
        description: "Webbegriffe in Klartext erklärt",
        href: "/lexikon",
        icon: BookOpen,
      },
      {
        kind: "link",
        label: "Auswahl",
        description: "Für wen wir bauen und wann wir absagen",
        href: "/auswahl",
        icon: BookOpen,
      },
      {
        kind: "link",
        label: "Journal",
        description: "Artikel über Websites für kleine Betriebe",
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
        description: "Telefon, E-Mail und Formular",
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
        { label: "Direkt", items: direct },
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
      { label: "Direkt", items: direct.filter(match) },
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
        className="bg-foreground/60 absolute inset-0"
      />

      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-card border-foreground/20 relative w-full max-w-xl overflow-hidden rounded-[3px] border shadow-[0_24px_48px_-32px_rgb(27_29_30/0.45)]"
      >
        {/* Input + Hinweis-Kürzel */}
        <div className="border-border flex items-center gap-3 border-b px-4 py-3.5">
          <Search className="text-muted-foreground h-4 w-4 shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            onKeyDown={onKeyDown}
            aria-label="Seite oder Begriff suchen"
            placeholder="Seite, Branche oder Begriff suchen"
            className="text-foreground placeholder:text-muted-foreground min-w-0 flex-1 bg-transparent text-[16px] outline-none"
          />
          <kbd className="border-border text-muted-foreground hidden rounded-[2px] border px-1.5 py-0.5 font-mono text-[11px] sm:inline-block">
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto py-2">
          {flat.length === 0 ? (
            <div className="text-muted-foreground px-4 py-8 text-center text-[14.5px]">
              Dazu haben wir nichts gefunden. Schreiben Sie uns eine{" "}
              <Link
                href="/anfrage"
                className="text-foreground underline underline-offset-4"
                onClick={() => setOpen(false)}
              >
                Anfrage
              </Link>
              .
            </div>
          ) : (
            (() => {
              let idx = -1;
              return groups.map((g) => (
                <div key={g.label} className="mb-2">
                  <p className="label-mono text-muted-foreground px-4 pt-3 pb-1.5">
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
        <div className="border-border text-muted-foreground flex items-center justify-between gap-2 border-t px-4 py-2.5 text-[13px]">
          <span className="inline-flex items-center gap-2">
            <kbd className="border-border rounded-[2px] border px-1.5 py-0.5 font-mono text-[11px]">
              ↑↓
            </kbd>
            auswählen
          </span>
          <span className="inline-flex items-center gap-2">
            <kbd className="border-border rounded-[2px] border px-1.5 py-0.5 font-mono text-[11px]">
              ↵
            </kbd>
            öffnen
          </span>
          <span className="hidden items-center gap-2 sm:inline-flex">
            <kbd className="border-border rounded-[2px] border px-1.5 py-0.5 font-mono text-[11px]">
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
  const className = `relative flex items-center gap-3 px-4 py-2.5 transition-colors ${
    active
      ? "bg-foreground/[0.06] text-foreground before:bg-gold before:absolute before:inset-y-0 before:left-0 before:w-[3px]"
      : "text-foreground/85 hover:bg-foreground/[0.03]"
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
        <p className="truncate text-[15px] font-semibold">
          {item.label}
        </p>
        <p className="text-muted-foreground truncate text-[13px]">
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
