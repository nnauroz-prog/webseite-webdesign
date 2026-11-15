import type { Metadata } from "next";
import Link from "next/link";

import { StoryStudio } from "@/app/admin/story/story-studio";
import { requireAdmin } from "@/lib/admin/auth";
import {
  postsFuer,
  spruchTag,
  storyBeschriftung,
  tagInHamburg,
  tagVersetzt,
  vorratTage,
  vorratTageExtra,
} from "@/lib/sprueche-data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Story-Studio" };

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

const WOCHENTAG = new Intl.DateTimeFormat("de-DE", {
  timeZone: "UTC",
  weekday: "short",
});

/**
 * `/admin/story` — das Story-Studio: die Posts eines Tages (Spruch des
 * Tages und zwei Zusatz-Posts) als fertige Bilder und Kurzvideos für
 * Instagram, als Story (1080 × 1920) oder Beitrag (1080 × 1350). Nur
 * hier gibt es Teilen, Sichern und den Beitragstext; auf der
 * öffentlichen Journalseite steht die Karte ohne diese Knöpfe.
 */
export default async function StoryPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string | string[] }>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const jetzt = new Date();
  const heute = tagInHamburg(jetzt);
  const tag = gueltigerTag(sp.tag) ?? heute;
  const posts = postsFuer(tag);
  // Tagesleiste: drei Tage zurück bis drei Tage voraus, der gewählte in der Mitte.
  const leiste = Array.from({ length: 7 }, (_, i) => tagVersetzt(tag, i - 3));
  const woche = Array.from({ length: 7 }, (_, i) =>
    postsFuer(tagVersetzt(heute, i + 1)),
  );
  // Vorrat: Jede Karte gehört zu einem Tag. Reicht er nicht mehr weit,
  // steht hier eine Warnung, bevor sich etwas wiederholt.
  const vorrat = vorratTage(jetzt);
  const vorratExtra = vorratTageExtra(jetzt);
  const knapp = vorrat < 21 || vorratExtra < 10;
  const tage = (n: number) => `${Math.max(n, 0)} ${n === 1 ? "Tag" : "Tage"}`;

  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h1 className="text-[22px] font-semibold tracking-tight">
          Story-Studio
        </h1>
        <p className="text-muted-foreground text-[14px]">
          {tag === heute ? "Heute" : tag < heute ? "Vergangen" : "Kommt noch"} ·{" "}
          {posts[0].datumText}
        </p>
      </div>

      <nav
        aria-label="Tag wählen"
        className="-mx-1 mt-3 flex items-stretch gap-1.5 overflow-x-auto px-1 pb-1"
      >
        {leiste.map((t) => {
          const [y, m, d] = t.split("-").map(Number);
          const aktiv = t === tag;
          return (
            <Link
              key={t}
              href={t === heute ? "/admin/story" : `/admin/story?tag=${t}`}
              aria-current={aktiv ? "date" : undefined}
              className={cn(
                "flex min-w-[52px] flex-1 flex-col items-center rounded-[6px] border px-1 py-1.5 transition-colors",
                aktiv
                  ? "bg-foreground text-background border-foreground"
                  : "border-border hover:border-foreground/40",
              )}
            >
              <span className="text-[11px] leading-4 uppercase opacity-80">
                {WOCHENTAG.format(new Date(Date.UTC(y, m - 1, d)))}
              </span>
              <span className="text-[17px] leading-6 font-semibold">{d}.</span>
              {/* Zeile bleibt auch ohne „heute“ stehen, damit alle Tage gleich hoch sind. */}
              <span className="text-[10px] leading-3 opacity-90">
                {t === heute ? "heute" : <span aria-hidden="true">&nbsp;</span>}
              </span>
            </Link>
          );
        })}
      </nav>
      {tag !== heute ? (
        <p className="mt-2 text-[14px]">
          <Link href="/admin/story" className="underline underline-offset-2">
            Zurück zu heute
          </Link>
        </p>
      ) : null}

      <StoryStudio
        // Neuer Tag: Auswahl, Design und Video beginnen frisch.
        key={tag}
        posts={posts}
        beschriftungen={posts.map(storyBeschriftung)}
      />

      <p
        className={
          knapp
            ? "border-border mt-8 rounded-[3px] border px-3 py-2 text-[15px] leading-6 font-medium"
            : "text-muted-foreground mt-8 text-[14px] leading-6"
        }
      >
        {vorrat > 0
          ? `Vorrat: Sprüche des Tages für noch ${tage(vorrat)} (bis ${spruchTag(tagVersetzt(heute, vorrat - 1)).datumText})`
          : "Die Sprüche des Tages sind aufgebraucht und wiederholen sich gerade"}
        {vorratExtra > 0
          ? `, Zusatz-Posts für noch ${tage(vorratExtra)}.`
          : ". Die Zusatz-Posts sind aufgebraucht und wiederholen sich gerade."}
        {knapp
          ? " Es wird Zeit für Nachschub, sonst wiederholt sich etwas."
          : " Nichts erscheint zweimal."}
      </p>

      <section className="mt-6">
        <h2 className="mb-2 text-[17px] font-semibold tracking-tight">
          Die nächsten Tage
        </h2>
        <ul
          role="list"
          className="border-border divide-border divide-y rounded-[3px] border"
        >
          {woche.map((tagesPosts) => {
            const s = tagesPosts[0];
            return (
              <li key={s.datum}>
                <Link
                  href={`/admin/story?tag=${s.datum}`}
                  className="hover:bg-foreground/[0.04] flex min-h-11 flex-col justify-center gap-0.5 px-3 py-2 transition-colors"
                >
                  <span className="text-muted-foreground text-[13px]">
                    {s.datumText} · {tagesPosts.length}{" "}
                    {tagesPosts.length === 1 ? "Post" : "Posts"}
                  </span>
                  <span className="text-[15px] font-medium text-pretty">
                    {s.text}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
