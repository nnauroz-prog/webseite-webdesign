import type { Metadata } from "next";

import { Archive, ChevronRight, Images, Sunrise } from "lucide-react";
import Link from "next/link";
import { cache } from "react";

import type { PostStand, PostStatusRow } from "@/lib/admin/post-planer";

import { DbProblem } from "@/app/admin/db-problem";
import { PostKarte } from "@/app/admin/posts/post-karte";
import { WasAnsteht } from "@/app/admin/posts/was-ansteht";
import { SchemaNotice } from "@/app/admin/schema-notice";
import { requireAdmin } from "@/lib/admin/auth";
import {
  addDays,
  berlinDateIso,
  formatHeaderDay,
  formatShortDay,
} from "@/lib/admin/berlin-time";
import { safeHttpUrl } from "@/lib/admin/links";
import {
  morgenlaufStand,
  postKey,
  postStand,
  postStatusMap,
  postStatusVon,
  serieTage,
  serieText,
  wochenStand,
} from "@/lib/admin/post-planer";
import { missingMigrations } from "@/lib/admin/migration-sql";
import { checkSchema } from "@/lib/admin/schema";
import { bilderText } from "@/lib/admin/studio-serie";
import { listPostStatus } from "@/lib/post-status-store";
import { serieFuer } from "@/lib/serien-aktuell";
import { POSTS_AKTUELL, postsFuer } from "@/lib/sprueche-aktuell";
import { storyBeschriftung } from "@/lib/sprueche-data";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Posts" };

/**
 * Post-Status der letzten Wochen (ab postStatusVon, für die Serie).
 * Beginnt selbst mit requireAdmin. Ohne Datenbank-Update (Tabelle
 * post_status) bleibt status null.
 */
const loadPosts = cache(async (heute: string) => {
  await requireAdmin();
  const schema = await checkSchema();
  const status =
    schema.postStatus === "ok"
      ? await listPostStatus(postStatusVon(heute), heute)
      : null;
  return { schema, status };
});

/**
 * `/admin/posts` — der Post-Planer: die drei Posts von heute zum
 * Abhaken (Story und Beitrag), der Stand des Morgenlaufs und die
 * letzten sieben Tage auf einen Blick. Gibt es die Story-Serie des
 * Tages schon, führt oben in „Heute“ eine Zeile dorthin ins Studio.
 */
export default async function PostsPage() {
  await requireAdmin();
  const now = new Date();
  const heute = berlinDateIso(now);
  const posts = postsFuer(heute);
  const lauf = morgenlaufStand(posts);
  // Die Story-Serie des Tages (Morgenlauf), falls es sie schon gibt.
  const tagesSerie = serieFuer(heute);

  let data: Awaited<ReturnType<typeof loadPosts>>;
  try {
    data = await loadPosts(heute);
  } catch (err) {
    return (
      <>
        <h1 className="sr-only">Post-Planer</h1>
        <DbProblem error={err} retryHref="/admin/posts" />
      </>
    );
  }
  const { schema, status } = data;
  const enabled = status !== null;
  const updateBanner = missingMigrations(schema).length > 0;
  const rows: PostStatusRow[] = status ?? [];
  const map = postStatusMap(rows);
  const heuteGepostet = posts.reduce(
    (n, p) =>
      n +
      (postStand(map, p, "story") !== "offen" ? 1 : 0) +
      (postStand(map, p, "beitrag") !== "offen" ? 1 : 0),
    0,
  );

  const tage = Array.from({ length: 7 }, (_, i) => addDays(heute, -i));
  const serie = serieTage(rows, heute);
  const woche = wochenStand(rows, heute);

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h1 className="text-[22px] font-semibold tracking-tight">
          Post-Planer
        </h1>
        <p className="text-muted-foreground text-[14px]">
          {formatHeaderDay(now)}
        </p>
      </div>
      <SchemaNotice schema={schema} />

      {/* Stand des Morgenlaufs: Karten zum Tag oder Reserve */}
      <div
        role="status"
        className={cn(
          "bg-card mt-4 flex gap-3 rounded-[4px] border p-4",
          // Gold-Rand nur, wenn nicht schon das Update-Banner darüber
          // steht (ein ruhiger Hinweis je Bildschirm).
          !lauf.geliefert && !updateBanner ? "border-gold" : "border-border",
        )}
      >
        {lauf.geliefert ? (
          <Sunrise
            className="text-ink-petrol mt-0.5 h-5 w-5 shrink-0"
            aria-hidden="true"
          />
        ) : (
          <Archive
            className="text-muted-foreground mt-0.5 h-5 w-5 shrink-0"
            aria-hidden="true"
          />
        )}
        <div className="min-w-0 text-[15px] leading-relaxed">
          {lauf.geliefert ? (
            <>
              <p className="font-semibold">
                Heute frisch zum Tag: {lauf.aktuell} von {posts.length}{" "}
                {posts.length === 1 ? "Post" : "Posts"}
              </p>
              <p className="text-muted-foreground text-[14px]">
                {lauf.anlaesse.length > 0
                  ? `Anlass: ${lauf.anlaesse.join(" · ")}. `
                  : ""}
                {lauf.reserve > 0
                  ? `${lauf.reserve === 1 ? "Ein Post kommt" : `${lauf.reserve} Posts kommen`} aus der Reserve.`
                  : "Die Reserve wird heute nicht gebraucht."}
              </p>
            </>
          ) : (
            <>
              <p className="font-semibold">
                Der Morgenlauf hat heute noch nichts geliefert, es läuft die
                Reserve.
              </p>
              <p className="text-muted-foreground text-[14px]">
                Er schreibt jeden Morgen gegen 5 Uhr Posts zum Tag. Die
                Reserve-Karten passen immer, sind aber nicht zum Tag
                geschrieben.
              </p>
            </>
          )}
        </div>
      </div>

      <section aria-labelledby="heute-title" className="mt-6">
        <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-3">
          <h2
            id="heute-title"
            className="text-[17px] font-semibold tracking-tight"
          >
            Heute
          </h2>
          {enabled ? (
            <p className="text-muted-foreground text-[14px] tabular-nums">
              {heuteGepostet} von {posts.length * 2} gepostet
            </p>
          ) : null}
        </div>
        {!enabled ? (
          <p className="text-muted-foreground -mt-1 mb-2 text-[14px]">
            Abhaken geht nach dem Datenbank-Update
            {updateBanner ? " (siehe Hinweis oben)" : ""}.
          </p>
        ) : null}
        {tagesSerie ? (
          <Link
            href="/admin/story?serie=tag"
            className="border-border bg-card hover:border-foreground/40 mb-3 flex min-h-14 items-center gap-3 rounded-[4px] border px-4 py-2.5 transition-colors"
          >
            <Images
              className="text-muted-foreground h-5 w-5 shrink-0"
              aria-hidden="true"
            />
            <span className="min-w-0 flex-1 text-[15px] leading-snug">
              <span className="block font-semibold">
                Story-Serie des Tages: {tagesSerie.titel}
              </span>
              <span className="text-muted-foreground block text-[14px]">
                {bilderText(tagesSerie.folien.length)} · Im Studio öffnen
              </span>
            </span>
            <ChevronRight
              className="text-muted-foreground h-5 w-5 shrink-0"
              aria-hidden="true"
            />
          </Link>
        ) : null}
        <ul className="grid gap-3 lg:grid-cols-3">
          {posts.map((p) => {
            const stand: Record<"story" | "beitrag", PostStand> = {
              story: postStand(map, p, "story"),
              beitrag: postStand(map, p, "beitrag"),
            };
            const frueher =
              (stand.story === "andere"
                ? map.get(postKey(p.datum, p.platz, "story"))?.text
                : null) ??
              (stand.beitrag === "andere"
                ? map.get(postKey(p.datum, p.platz, "beitrag"))?.text
                : null) ??
              null;
            const quelle =
              p.herkunft === "aktuell"
                ? safeHttpUrl(POSTS_AKTUELL[heute]?.[p.platz]?.quelle)
                : null;
            return (
              <li key={p.platz}>
                <PostKarte
                  post={p}
                  beschriftung={storyBeschriftung(p)}
                  quelle={quelle}
                  stand={stand}
                  frueher={frueher}
                  studioHref={`/admin/story?post=${p.platz}#einzelne-posts`}
                  enabled={enabled}
                />
              </li>
            );
          })}
        </ul>
      </section>

      <WasAnsteht heute={heute} />

      <section aria-labelledby="woche-title" className="mt-8 lg:max-w-3xl">
        <h2
          id="woche-title"
          className="mb-2 text-[17px] font-semibold tracking-tight"
        >
          Letzte 7 Tage
        </h2>
        {!enabled ? (
          <p className="border-border text-muted-foreground rounded-[4px] border border-dashed p-4 text-[15px] leading-relaxed">
            Die Übersicht startet nach dem Datenbank-Update. Bis dahin merkt
            sich das Story-Studio Gepostetes nur auf dem jeweiligen Gerät.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-2">
              <div className="border-border bg-card rounded-[4px] border px-4 py-3">
                <p className="text-muted-foreground text-[13px]">Serie</p>
                <p className="text-[22px] leading-tight font-semibold tabular-nums">
                  {serieText(serie)}
                </p>
                <p className="text-muted-foreground text-[13px] leading-snug">
                  in Folge mit Post
                </p>
              </div>
              <div className="border-border bg-card rounded-[4px] border px-4 py-3">
                <p className="text-muted-foreground text-[13px]">Diese Woche</p>
                <p className="text-[22px] leading-tight font-semibold tabular-nums">
                  {woche.gepostet} {woche.gepostet === 1 ? "Post" : "Posts"}
                </p>
                <p className="text-muted-foreground text-[13px] leading-snug tabular-nums">
                  an {woche.tageMitPost} von {woche.tageBisher}{" "}
                  {woche.tageBisher === 1 ? "Tag" : "Tagen"}
                </p>
              </div>
            </div>

            <div className="border-border bg-card mt-3 overflow-hidden rounded-[4px] border">
              <table className="w-full table-fixed border-collapse text-[14px]">
                <caption className="sr-only">
                  Gepostet in den letzten sieben Tagen, je Post als Story (S)
                  und Beitrag (B)
                </caption>
                <colgroup>
                  <col className="w-[30%]" />
                  <col />
                  <col />
                  <col />
                </colgroup>
                <thead>
                  <tr className="border-border text-muted-foreground border-b text-[12.5px]">
                    <th scope="col" className="px-3 py-2 text-left font-medium">
                      Tag
                    </th>
                    <th scope="col" className="px-1 py-2 font-medium">
                      Spruch
                    </th>
                    <th scope="col" className="px-1 py-2 font-medium">
                      Zusatz 1
                    </th>
                    <th scope="col" className="px-1 py-2 font-medium">
                      Zusatz 2
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-border divide-y">
                  {tage.map((tag) => {
                    const tagesPosts = postsFuer(tag);
                    return (
                      <tr
                        key={tag}
                        className={cn(tag === heute && "bg-foreground/[0.03]")}
                      >
                        <th scope="row" className="px-3 text-left font-normal">
                          <Link
                            href={
                              tag === heute
                                ? "/admin/story"
                                : `/admin/story?tag=${tag}`
                            }
                            className="flex min-h-12 flex-col justify-center underline-offset-4 hover:underline"
                          >
                            <span className="font-medium tabular-nums">
                              {formatShortDay(tag)}
                            </span>
                            {tag === heute ? (
                              <span className="text-muted-foreground text-[12px] leading-3">
                                heute
                              </span>
                            ) : null}
                          </Link>
                        </th>
                        {[0, 1, 2].map((platz) => {
                          const p = tagesPosts.find((x) => x.platz === platz);
                          return (
                            <td key={platz} className="px-1 text-center">
                              {p ? (
                                <span className="inline-flex gap-1.5">
                                  <Marke
                                    kurz="S"
                                    lang="Story"
                                    an={map.has(postKey(tag, platz, "story"))}
                                  />
                                  <Marke
                                    kurz="B"
                                    lang="Beitrag"
                                    an={map.has(postKey(tag, platz, "beitrag"))}
                                  />
                                </span>
                              ) : (
                                <span className="text-muted-foreground">
                                  <span aria-hidden="true">·</span>
                                  <span className="sr-only">kein Post</span>
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-muted-foreground mt-2 text-[13px]">
              S = Story, B = Beitrag. Ein Tag öffnet das Story-Studio.
            </p>
          </>
        )}
      </section>
    </div>
  );
}

/** „S ✓“ bzw. „S –“ in der Wochenübersicht. */
function Marke({
  kurz,
  lang,
  an,
}: {
  kurz: string;
  lang: string;
  an: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 tabular-nums",
        an ? "text-ink-petrol font-semibold" : "text-muted-foreground",
      )}
    >
      <span aria-hidden="true">
        {kurz}
        {an ? "✓" : "–"}
      </span>
      <span className="sr-only">
        {lang} {an ? "gepostet" : "nicht gepostet"}
      </span>
    </span>
  );
}
