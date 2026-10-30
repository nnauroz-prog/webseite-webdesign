/**
 * Leichter Suchindex für die Cmd+K-Palette.
 *
 * Wird SERVER-seitig gebaut (layout.tsx importiert diese Datei und
 * reicht das Ergebnis als Prop an die Client-Palette weiter). Der
 * Grund: journal-data enthält die kompletten Essay-Texte — würde
 * die Client-Komponente direkt importieren, wanderten zigtausend
 * Wörter Fließtext ins JS-Bundle jeder Seite. So gehen nur Label,
 * Description und Link über die Leitung.
 *
 * Indexiert vier Dokument-Typen:
 *   essay    — Journal-Essays (Titel + Dek)
 *   begriff  — Lexikon-Einträge (Term + Bottom-Line)
 *   branche  — Branchen-Detail-Seiten (Label + shortBody)
 *   standort — Stadtteil-Detail-Seiten (Name + Tagline)
 *   paket    — Paket-Detail-Seiten (Name + Description)
 */

import { BRANCHEN } from "@/lib/branchen-data";
import { JOURNAL_POSTS } from "@/lib/journal-data";
import { LEXIKON } from "@/lib/lexikon-data";
import { PAKETE } from "@/lib/pakete-data";
import { STANDORTE } from "@/lib/standorte-data";

export type SearchDoc = {
  kind: "essay" | "begriff" | "branche" | "standort" | "paket";
  label: string;
  description: string;
  href: string;
};

export function buildSearchIndex(): SearchDoc[] {
  const essays: SearchDoc[] = JOURNAL_POSTS.map((p) => ({
    kind: "essay",
    label: p.title,
    description: p.dek,
    href: `/journal/${p.slug}`,
  }));

  const begriffe: SearchDoc[] = [...LEXIKON]
    .sort((a, b) => a.term.localeCompare(b.term, "de"))
    .map((e) => ({
      kind: "begriff",
      label: e.term,
      description: e.bottomLine,
      href: `/lexikon#${e.slug}`,
    }));

  const branchen: SearchDoc[] = BRANCHEN.map((b) => ({
    kind: "branche",
    label: b.label,
    description: b.shortBody,
    href: `/branchen/${b.slug}`,
  }));

  const standorte: SearchDoc[] = STANDORTE.map((s) => ({
    kind: "standort",
    label: `${s.name} · Hamburg`,
    description: s.tagline,
    href: `/standorte/${s.slug}`,
  }));

  const pakete: SearchDoc[] = PAKETE.map((p) => ({
    kind: "paket",
    label: `${p.name} · ${p.setup}`,
    description: p.description,
    href: `/pakete/${p.slug}`,
  }));

  return [...essays, ...begriffe, ...branchen, ...standorte, ...pakete];
}
