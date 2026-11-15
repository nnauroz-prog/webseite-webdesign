import type { Metadata } from "next";
import Link from "next/link";

import { StoryWerkzeug } from "@/app/admin/story/story-werkzeug";
import { requireAdmin } from "@/lib/admin/auth";
import {
  spruchTag,
  storyBeschriftung,
  tagInHamburg,
  tagVersetzt,
  vorratTage,
} from "@/lib/sprueche-data";

export const metadata: Metadata = { title: "Story des Tages" };

/** Nur echte Kalendertage (yyyy-mm-dd), sonst gilt heute. */
function gueltigerTag(raw: string | string[] | undefined): string | null {
  if (typeof raw !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(raw)) return null;
  const [y, m, d] = raw.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d));
  return t.getUTCFullYear() === y &&
    t.getUTCMonth() === m - 1 &&
    t.getUTCDate() === d
    ? raw
    : null;
}

/**
 * `/admin/story` — der Spruch des Tages als fertiges Bild für die
 * Instagram-Story (1080 × 1920). Nur hier gibt es Teilen, Bild sichern
 * und den Text für den Beitrag; auf der öffentlichen Journalseite steht
 * die Karte ohne diese Knöpfe.
 */
export default async function StoryPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string | string[] }>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const heute = tagInHamburg(new Date());
  const tag = gueltigerTag(sp.tag) ?? heute;
  const karte = spruchTag(tag);
  const davor = tagVersetzt(tag, -1);
  const danach = tagVersetzt(tag, 1);
  const naechste = Array.from({ length: 7 }, (_, i) =>
    spruchTag(tagVersetzt(heute, i + 1)),
  );
  // Vorrat: Jede Karte gehört zu einem Tag. Reicht er nicht mehr weit,
  // steht hier eine Warnung, bevor sich etwas wiederholt.
  const vorrat = vorratTage(new Date());
  const vorratBis = spruchTag(tagVersetzt(heute, Math.max(vorrat, 1) - 1));
  const knopf =
    "border-border hover:border-foreground/40 inline-flex h-11 items-center rounded-[3px] border px-3 text-[15px] font-medium transition-colors";

  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h1 className="text-[22px] font-semibold tracking-tight">
          Story des Tages
        </h1>
        <p className="text-muted-foreground text-[14px]">
          {tag === heute ? "Heute" : tag < heute ? "Vergangen" : "Kommt noch"} ·{" "}
          {karte.datumText}
        </p>
      </div>

      <nav
        aria-label="Tag wählen"
        className="mt-3 flex flex-wrap items-center gap-2"
      >
        <Link href={`/admin/story?tag=${davor}`} className={knopf}>
          <span aria-hidden="true">‹&nbsp;</span>Tag zurück
        </Link>
        <Link href={`/admin/story?tag=${danach}`} className={knopf}>
          Tag vor<span aria-hidden="true">&nbsp;›</span>
        </Link>
        {tag !== heute ? (
          <Link href="/admin/story" className={knopf}>
            Heute
          </Link>
        ) : null}
      </nav>

      <StoryWerkzeug
        // Neuer Tag, neues Bild: Zustand (Kopiert, Fehler) beginnt frisch.
        key={karte.datum}
        karte={karte}
        beschriftung={storyBeschriftung(karte)}
      />

      <p
        className={
          vorrat < 21
            ? "border-border mt-6 rounded-[3px] border px-3 py-2 text-[15px] leading-6 font-medium"
            : "text-muted-foreground mt-6 text-[14px] leading-6"
        }
      >
        {vorrat > 0
          ? `Vorrat: noch ${vorrat} ${vorrat === 1 ? "Tag" : "Tage"} mit neuen Sprüchen, bis ${vorratBis.datumText}.`
          : "Der Vorrat ist aufgebraucht: Die Sprüche wiederholen sich gerade."}
        {vorrat < 21
          ? " Es wird Zeit für Nachschub, sonst wiederholen sich die Sprüche."
          : " Kein Spruch erscheint zweimal."}
      </p>

      <section className="mt-8">
        <h2 className="mb-2 text-[17px] font-semibold tracking-tight">
          Die nächsten Tage
        </h2>
        <ul
          role="list"
          className="border-border divide-border divide-y rounded-[3px] border"
        >
          {naechste.map((s) => (
            <li key={s.datum}>
              <Link
                href={`/admin/story?tag=${s.datum}`}
                className="hover:bg-foreground/[0.04] flex min-h-11 flex-col justify-center gap-0.5 px-3 py-2 transition-colors"
              >
                <span className="text-muted-foreground text-[13px]">
                  {s.datumText} · {s.kicker}
                </span>
                <span className="text-[15px] font-medium text-pretty">
                  {s.text}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
