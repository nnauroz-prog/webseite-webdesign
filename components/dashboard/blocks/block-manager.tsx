"use client";

import { useState, useTransition } from "react";
import {
  Building2,
  ChevronDown,
  ChevronUp,
  CreditCard,
  Eye,
  EyeOff,
  FileText,
  HelpCircle,
  Image as ImageIcon,
  ListOrdered,
  MapPin,
  MessageSquareQuote,
  Megaphone,
  PlayCircle,
  Plus,
  Sigma,
  Trash2,
  Clock,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  addBlockAction,
  deleteBlockAction,
  reorderBlockAction,
} from "@/lib/actions/blocks";
import { cn } from "@/lib/utils";
import type { BlockType, PageBlockRow } from "@/types/website";

import { BlockEditor } from "./block-editor";

const BLOCK_LIBRARY: Array<{
  type: BlockType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: string;
}> = [
  {
    type: "faq",
    label: "FAQ",
    description: "Häufige Fragen als ausklappbare Akkordeon-Liste",
    icon: HelpCircle,
    tone: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  {
    type: "testimonials",
    label: "Kundenstimmen",
    description: "Zitate zufriedener Kund:innen als Karten-Grid",
    icon: MessageSquareQuote,
    tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    type: "opening_hours",
    label: "Öffnungszeiten",
    description: "Wochentage + Uhrzeiten mit Uhr-Icon",
    icon: Clock,
    tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    type: "cta_banner",
    label: "Aufruf-Banner",
    description: "Großer Hingucker mit Headline + Button",
    icon: Megaphone,
    tone: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
  {
    type: "map",
    label: "Karte",
    description: "Google-Maps-Embed mit Adress-Pin",
    icon: MapPin,
    tone: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  },
  {
    type: "video",
    label: "Video",
    description: "YouTube oder Vimeo eingebettet",
    icon: PlayCircle,
    tone: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  },
  {
    type: "stats",
    label: "Kennzahlen",
    description: 'Große Zahlen — z.B. "20+ Jahre Erfahrung"',
    icon: Sigma,
    tone: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  {
    type: "rich_text",
    label: "Langtext",
    description: "Mehr Platz für Geschichten und Details",
    icon: FileText,
    tone: "bg-stone-500/10 text-stone-600 dark:text-stone-400",
  },
  {
    type: "pricing_table",
    label: "Preise / Pakete",
    description: "Bis 4 Pakete mit Preis, Features, Beliebt-Badge",
    icon: CreditCard,
    tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    type: "steps",
    label: "Ablauf-Schritte",
    description: "Numerierter 'So funktioniert's' Prozess",
    icon: ListOrdered,
    tone: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  },
  {
    type: "image_text_split",
    label: "Bild + Text",
    description: "Großes Foto links/rechts neben Headline + Text",
    icon: ImageIcon,
    tone: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
  },
  {
    type: "logo_cloud",
    label: "Partner-Logos",
    description: "Reihe von Partner-/Kunden-/Presse-Namen",
    icon: Building2,
    tone: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
  },
];

export function BlockManager({
  pageId,
  blocks,
}: {
  pageId: string;
  blocks: PageBlockRow[];
}) {
  const [adding, startAdd] = useTransition();
  const [showLibrary, setShowLibrary] = useState(blocks.length === 0);

  const handleAdd = (type: BlockType) => {
    const fd = new FormData();
    fd.append("page_id", pageId);
    fd.append("type", type);
    startAdd(() => {
      void addBlockAction(undefined, fd);
    });
    setShowLibrary(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold tracking-tight">
          Blöcke ({blocks.length})
        </h3>
        <Button
          type="button"
          variant={showLibrary ? "ghost" : "outline"}
          size="sm"
          onClick={() => setShowLibrary((s) => !s)}
        >
          {showLibrary ? (
            "Bibliothek schließen"
          ) : (
            <>
              <Plus className="mr-1 h-4 w-4" /> Block hinzufügen
            </>
          )}
        </Button>
      </div>

      {showLibrary ? (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {BLOCK_LIBRARY.map((b) => {
            const Icon = b.icon;
            return (
              <button
                key={b.type}
                type="button"
                disabled={adding}
                onClick={() => handleAdd(b.type)}
                className={cn(
                  "border-border bg-card hover:border-foreground/30 flex items-start gap-3 rounded-lg border p-3 text-left transition disabled:opacity-50",
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
                    b.tone,
                  )}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-foreground text-sm font-medium">
                    {b.label}
                  </div>
                  <div className="text-muted-foreground mt-0.5 text-xs">
                    {b.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : null}

      {blocks.length === 0 && !showLibrary ? (
        <p className="text-muted-foreground bg-secondary/30 rounded-lg border border-dashed px-4 py-6 text-center text-xs">
          Noch keine Blöcke. Klick auf „Block hinzufügen" und wähle einen Typ.
        </p>
      ) : null}

      {blocks.map((block, i) => (
        <BlockRow
          key={block.id}
          block={block}
          isFirst={i === 0}
          isLast={i === blocks.length - 1}
        />
      ))}
    </div>
  );
}

function BlockRow({
  block,
  isFirst,
  isLast,
}: {
  block: PageBlockRow;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const meta = BLOCK_LIBRARY.find((b) => b.type === block.type);
  const Icon = meta?.icon ?? HelpCircle;

  const move = (direction: "up" | "down") => {
    const fd = new FormData();
    fd.append("id", block.id);
    fd.append("direction", direction);
    startTransition(() => {
      void reorderBlockAction(undefined, fd);
    });
  };

  const remove = () => {
    if (!confirm("Block wirklich löschen?")) return;
    const fd = new FormData();
    fd.append("id", block.id);
    startTransition(() => {
      void deleteBlockAction(undefined, fd);
    });
  };

  return (
    <div className="bg-card overflow-hidden rounded-lg border">
      <div className="flex items-center justify-between gap-2 px-3 py-2">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="hover:bg-secondary -mx-1 flex flex-1 items-center gap-2 rounded px-1 py-1 text-left transition"
        >
          <span
            className={cn(
              "inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md",
              meta?.tone ?? "bg-secondary text-foreground",
            )}
          >
            <Icon className="h-3.5 w-3.5" />
          </span>
          <span className="text-sm font-medium">
            {meta?.label ?? block.type}
          </span>
          {!block.is_published ? (
            <span className="text-muted-foreground inline-flex items-center gap-1 text-[10px] uppercase tracking-wide">
              <EyeOff className="h-3 w-3" /> Entwurf
            </span>
          ) : (
            <span className="text-muted-foreground inline-flex items-center gap-1 text-[10px] uppercase tracking-wide">
              <Eye className="h-3 w-3" />
            </span>
          )}
        </button>

        <div className="flex items-center gap-0.5">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={pending || isFirst}
            onClick={() => move("up")}
            aria-label="Nach oben"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={pending || isLast}
            onClick={() => move("down")}
            aria-label="Nach unten"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={pending}
            onClick={remove}
            aria-label="Block löschen"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {open ? (
        <div className="border-t p-4">
          <BlockEditor block={block} />
        </div>
      ) : null}
    </div>
  );
}
