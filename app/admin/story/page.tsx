import type { Metadata } from "next";
import Link from "next/link";

import type { GepostetEintrag } from "@/app/admin/story/story-studio";
import type { SerieZeile } from "@/lib/serien-store";

import { SerienStudio } from "@/app/admin/story/serien-studio";
import { StoryStudio } from "@/app/admin/story/story-studio";
import { requireAdmin } from "@/lib/admin/auth";
import {
  morgenlaufStand,
  morgenlaufText,
  parsePostDatum,
} from "@/lib/admin/post-planer";
import { checkSchema } from "@/lib/admin/schema";
import { AUFTRAEGE_MAX, parseSerieZiel } from "@/lib/admin/studio-serie";
import { studioVorschlaege } from "@/lib/admin/studio-vorschlaege";
import { listPostStatus } from "@/lib/post-status-store";
import { redaktionBereit } from "@/lib/redaktion/konfig";
import { serieFuer } from "@/lib/serien-aktuell";
import { listSerien } from "@/lib/serien-store";
import { postsFuer } from "@/lib/sprueche-aktuell";
import {
  storyBeschriftung,
  tagInHamburg,
  tagVersetzt,
} from "@/lib/sprueche-data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Story-Studio" };

/** Platz aus ?post= (0 bis 2), sonst null. */
function gueltigerPlatz(raw: string | string[] | undefined): number | null {
  return typeof raw === "string" && /^[0-2]$/.test(raw) ? Number(raw) : null;
}

/**
 * Was an diesem Tag schon gepostet ist (Tabelle post_status). null ohne
 * Datenbank-Update oder wenn das Lesen scheitert: Dann merkt sich das
 * Studio Gepostetes wie früher nur auf diesem Gerät.
 */
async function gepostetAm(tag: string): Promise<GepostetEintrag[] | null> {
  try {
    const schema = await checkSchema();
    if (schema.postStatus !== "ok") return null;
    const rows = await listPostStatus(tag, tag);
    return rows
      ? rows.map((r) => ({ platz: r.platz, format: r.format, text: r.text }))
      : null;
  } catch {
    return null;
  }
}

/**
 * Die gespeicherten Serien aus Aufträgen an die Redaktion. zeilen ist
 * null ohne Datenbank-Update; scheitert das Lesen, bleibt das Studio
 * stehen und sagt es dort (fehler).
 */
async function auftraegeLaden(): Promise<{
  zeilen: SerieZeile[] | null;
  fehler: boolean;
}> {
  try {
    return { zeilen: await listSerien(AUFTRAEGE_MAX), fehler: false };
  } catch {
    return { zeilen: null, fehler: true };
  }
}

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
 * `/admin/story` — das Story-Studio, wo die Storys entstehen:
 *
 * - Redaktion: Die Agenten bekommen einen Auftrag („Story-Serie zu Black
 *   Friday“) und liefern eine Story-Serie aus drei bis fünf Bildern.
 * - Story-Serie des Tages: schreibt der Morgenlauf jeden Morgen.
 * - Deine Aufträge: die gespeicherten Serien.
 * - Einzelne Posts: die drei Posts des Tages (Spruch des Tages und zwei
 *   Zusatz-Posts) als fertige Bilder und Kurzvideos für Instagram, als
 *   Story (1080 × 1920) oder Beitrag (1080 × 1350).
 *
 * Nur hier gibt es Teilen, Sichern und den Beitragstext; auf der
 * öffentlichen Journalseite steht die Karte ohne diese Knöpfe.
 *
 * ?tag=yyyy-mm-dd wählt den Tag, ?post=0|1|2 den Post (etwa aus dem
 * Post-Planer „Im Studio öffnen“), ?serie= klappt eine Serie auf: „tag“
 * die Serie des Tages, ein Kalendertag die Serie dieses Tages, sonst die
 * Kennung eines Auftrags.
 */
export default async function StoryPage({
  searchParams,
}: {
  searchParams: Promise<{
    tag?: string | string[];
    post?: string | string[];
    serie?: string | string[];
  }>;
}) {
  await requireAdmin();
  const sp = await searchParams;
  const jetzt = new Date();
  const heute = tagInHamburg(jetzt);
  const ziel = parseSerieZiel(sp.serie);
  const tag =
    gueltigerTag(sp.tag) ?? (ziel?.art === "tag" ? ziel.tag : null) ?? heute;
  const posts = postsFuer(tag);
  const platz = gueltigerPlatz(sp.post);
  const start = Math.max(
    0,
    posts.findIndex((p) => p.platz === platz),
  );
  // Tagesleiste: drei Tage zurück bis drei Tage voraus, der gewählte in der Mitte.
  const leiste = Array.from({ length: 7 }, (_, i) => tagVersetzt(tag, i - 3));
  const [gepostetDb, auftraege] = await Promise.all([
    gepostetAm(tag),
    auftraegeLaden(),
  ]);
  // Morgenlauf: Karten zum Tag haben Vorrang, sonst springt die Reserve
  // ein. Auch für einen kommenden Tag zählen schon geschriebene Karten.
  const laufText = morgenlaufText(tag, heute, posts);
  const reserveWarnung = tag === heute && !morgenlaufStand(posts).geliefert;

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

      <SerienStudio
        // Neuer Tag oder eine andere verlinkte Serie: Auftrag, Auswahl und
        // frisches Ergebnis beginnen neu.
        key={`${tag}|${ziel ? (ziel.art === "id" ? ziel.id : "tag") : ""}`}
        tag={tag}
        heute={heute}
        bereit={redaktionBereit()}
        vorschlaege={studioVorschlaege(tag, heute, posts[0]?.text)}
        tagesSerie={serieFuer(tag)}
        auftraege={auftraege.zeilen}
        auftraegeFehler={auftraege.fehler}
        start={ziel}
        // Kommt jemand für einen einzelnen Post, bleiben die Serien zu.
        eingeklappt={platz !== null}
      />

      {/* div mit role="region" statt section: siehe redaktion.tsx (data-sicht). */}
      <div
        role="region"
        id="einzelne-posts"
        aria-labelledby="einzelne-posts-title"
        className="mt-7 scroll-mt-[calc(var(--sticky-top)*-1)]"
      >
        <h2
          id="einzelne-posts-title"
          className="text-[17px] font-semibold tracking-tight"
        >
          {tag === heute
            ? "Einzelne Posts von heute"
            : "Einzelne Posts für diesen Tag"}
        </h2>
        <p
          role="status"
          className={cn(
            "mt-2 rounded-[3px] border px-3 py-2 text-[15px] leading-6",
            reserveWarnung
              ? "border-gold font-medium"
              : "border-border text-muted-foreground",
          )}
        >
          {laufText}
        </p>

        <StoryStudio
          // Neuer Tag, anderer Post aus dem Planer oder neue Karten (der
          // Morgenlauf hat geliefert, Seite im Hintergrund neu geladen):
          // Auswahl, Design und Video beginnen frisch.
          key={`${tag}|${start}|${posts.map((p) => p.text).join("|")}`}
          posts={posts}
          beschriftungen={posts.map(storyBeschriftung)}
          start={start}
          gepostetDb={gepostetDb}
          abhakenMoeglich={parsePostDatum(tag, jetzt) !== null}
        />
      </div>

      <div className="text-muted-foreground mt-8 space-y-2 text-[14px] leading-6">
        <p>
          Die Posts und die Story-Serie für morgen schreibt der Morgenlauf
          morgen früh, passend zu dem, was dann los ist. Die Reserve springt nur
          ein, wenn es keine Karten zum Tag gibt.
        </p>
        <p>
          <Link
            href="/admin/posts"
            className="text-foreground inline-flex min-h-11 items-center font-medium underline underline-offset-4"
          >
            Zum Post-Planer
          </Link>
        </p>
      </div>
    </>
  );
}
