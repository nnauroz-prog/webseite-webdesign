/**
 * Leichter Suchindex für die Cmd+K-Palette.
 *
 * Wird SERVER-seitig gebaut (layout.tsx importiert diese Datei und
 * reicht das Ergebnis als Prop an die Client-Palette weiter). Der
 * Grund: journal-data enthält die kompletten Essay-Texte — würde
 * die Client-Komponente direkt importieren, wanderten zigtausend
 * Wörter Fließtext ins JS-Bundle jeder Seite. So gehen nur Titel,
 * Dek und Link über die Leitung.
 */

import { JOURNAL_POSTS } from "@/lib/journal-data";
import { LEXIKON } from "@/lib/lexikon-data";

export type SearchDoc = {
  kind: "essay" | "begriff";
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

  return [...essays, ...begriffe];
}
