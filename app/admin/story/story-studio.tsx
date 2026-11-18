"use client";

import { Check, Copy, RotateCcw, Shuffle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";

import type { PostFormat, PostStand } from "@/lib/admin/post-planer";
import type { PostQuelle } from "@/lib/instagram/vertrag";
import type { SpruchTag } from "@/lib/sprueche-data";

import { setPostGepostetAction } from "@/app/admin/post-actions";
import { runAction } from "@/app/admin/run-action";
import {
  BildUndVideo,
  DUNKEL,
  HELL,
  useKartenBuehne,
  Vorschau,
} from "@/app/admin/story/buehne";
import { InstagramPosten } from "@/app/admin/story/instagram-posten";
import {
  FORMAT_LABELS,
  gepostetNach,
  NACHTRAGEN_TAGE,
  platzName,
  postStandIn,
} from "@/lib/admin/post-planer";
import { FORMATE, type StoryFormat } from "@/lib/story-bild";
import { cn } from "@/lib/utils";

/**
 * Die einzelnen Posts eines Tages im Story-Studio: fertige Bilder und
 * Kurzvideos, ohne jedes Seitenlayout.
 *
 * - Oben die Posts des Tages als Vorschaubilder (Spruch des Tages und
 *   zwei Zusatz-Posts). Antippen wählt einen aus.
 * - Format: Story (1080 × 1920) oder Beitrag (1080 × 1350).
 * - Anderes Design würfelt Farbwelt, Motiv und Anordnung neu; Original
 *   stellt das Design des Tages wieder her.
 * - Auf Instagram posten schickt den gewählten Post direkt raus, als Story
 *   oder Beitrag (instagram-posten.tsx), im Design, das gerade zu sehen ist.
 * - Bild und Video (teilen, sichern, erstellen, abspielen): die Bühne in
 *   buehne.tsx, dieselbe wie bei den Story-Serien.
 * - Text kopieren legt den Beitragstext in die Zwischenablage.
 * - Abhaken hält fest, was schon gepostet ist, je Format (Story oder
 *   Beitrag) in der Datenbank (post_status, wie im Post-Planer). Ohne
 *   Datenbank-Update merkt es sich das wie früher nur dieses Gerät.
 *   Gepostet heißt: genau diese Karte. Stand an dem Platz vorher eine
 *   andere Karte (etwa die Reserve), hakt Abhaken die gezeigte ab.
 */

const SPEICHER = "sitalo-story-gepostet";

/** Gepostet laut Datenbank (post_status) an diesem Tag. */
export type GepostetEintrag = {
  platz: number;
  format: PostFormat;
  text: string;
};

export function StoryStudio({
  posts,
  beschriftungen,
  start = 0,
  gepostetDb = null,
  abhakenMoeglich = true,
}: {
  /** Posts des Tages: Spruch des Tages zuerst */
  posts: SpruchTag[];
  /** Beitragstext je Post, gleiche Reihenfolge */
  beschriftungen: string[];
  /** Index des zuerst gewählten Posts (etwa aus dem Post-Planer). */
  start?: number;
  /**
   * Was laut Datenbank schon gepostet ist; null ohne Datenbank-Update
   * (dann merkt sich dieses Gerät das Abhaken).
   */
  gepostetDb?: GepostetEintrag[] | null;
  /** false für Tage, die sich (noch) nicht abhaken lassen (Zukunft, lange her). */
  abhakenMoeglich?: boolean;
}) {
  const [gewaehlt, setGewaehlt] = useState(() =>
    Math.min(Math.max(start, 0), Math.max(posts.length - 1, 0)),
  );
  const [format, setFormat] = useState<StoryFormat["name"]>("story");
  /** „Anderes Design“ je Post: 0 ist das Design des Tages. */
  const [versaetze, setVersaetze] = useState<number[]>(() =>
    posts.map(() => 0),
  );
  const [gepostet, setGepostet] = useState<string[]>([]);
  const [hakt, startHaken] = useTransition();
  const router = useRouter();
  const dbModus = gepostetDb !== null;
  /** Stand eines Posts laut Datenbank, mit Textvergleich (wie im Post-Planer). */
  const standDb = (p: SpruchTag, f: PostFormat): PostStand =>
    postStandIn(gepostetDb ?? [], p, f);

  const karte = posts[gewaehlt] ?? posts[0];
  const versatz = versaetze[gewaehlt] ?? 0;
  const f = FORMATE[format];
  /** Format fürs Abhaken (das Studio bietet nur Story und Beitrag). */
  const postFormat: PostFormat = format === "beitrag" ? "beitrag" : "story";
  const kennung = `${karte.datum}-${karte.platz}`;
  const beschriftung = beschriftungen[gewaehlt] ?? "";
  const flaeche = useRef<HTMLCanvasElement | null>(null);
  const buehne = useKartenBuehne(flaeche, {
    karte,
    format,
    versatz,
    name: `sitalo-${karte.datum}-post${karte.platz + 1}-${format}`,
  });
  const { frei, beschaeftigt, sagen, wechseln } = buehne;

  // Was schon gepostet ist, merkt sich dieses Gerät.
  useEffect(() => {
    try {
      const roh = window.localStorage.getItem(SPEICHER);
      if (roh) setGepostet(JSON.parse(roh) as string[]);
    } catch {
      // Ohne Speicher (privates Fenster) bleibt die Liste leer.
    }
  }, []);

  const neuesDesign = (schritt: number | null) =>
    wechseln(() =>
      setVersaetze((alt) =>
        alt.map((v, i) =>
          i === gewaehlt ? (schritt === null ? 0 : v + schritt) : v,
        ),
      ),
    );

  const markieren = () => {
    if (dbModus) {
      // Offen oder vorher eine andere Karte: abhaken; gepostet: wieder offen.
      const senden = gepostetNach(standDb(karte, postFormat));
      const label = FORMAT_LABELS[postFormat];
      startHaken(async () => {
        const res = await runAction(() =>
          setPostGepostetAction(karte.datum, karte.platz, postFormat, senden),
        );
        sagen(
          res.ok
            ? senden
              ? `${label} abgehakt.`
              : `${label} wieder offen.`
            : res.error,
        );
      });
      return;
    }
    const neu = gepostet.includes(kennung)
      ? gepostet.filter((k) => k !== kennung)
      : [...gepostet, kennung].slice(-400);
    setGepostet(neu);
    try {
      window.localStorage.setItem(SPEICHER, JSON.stringify(neu));
    } catch {
      // Nicht speicherbar: gilt dann nur bis zum Neuladen.
    }
  };

  /** Auf Instagram gepostet: abhaken (Datenbank über den Server, sonst dieses Gerät). */
  const aufInstagram = (q: PostQuelle) => {
    if (q.typ !== "post") return;
    sagen("Auf Instagram gepostet.");
    if (dbModus) return router.refresh();
    setGepostet((alt) => {
      const k = `${q.datum}-${q.platz}`;
      if (alt.includes(k)) return alt;
      const neu = [...alt, k].slice(-400);
      try {
        window.localStorage.setItem(SPEICHER, JSON.stringify(neu));
      } catch {
        // Nicht speicherbar: gilt dann nur bis zum Neuladen.
      }
      return neu;
    });
  };

  const kopieren = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(beschriftung);
      sagen("Text kopiert.");
    } catch {
      sagen("Kopieren nicht erlaubt. Markiere den Text von Hand.");
    }
  }, [beschriftung, sagen]);

  const istGepostet = dbModus
    ? standDb(karte, postFormat) === "gepostet"
    : gepostet.includes(kennung);
  const formatLabel = FORMAT_LABELS[postFormat];
  /** An diesem Platz wurde vorher eine andere Karte gepostet (etwa die Reserve). */
  const frueher =
    dbModus && standDb(karte, postFormat) === "andere"
      ? (gepostetDb?.find(
          (e) => e.platz === karte.platz && e.format === postFormat,
        )?.text ?? null)
      : null;

  return (
    <div className="mt-4">
      {/* Posts des Tages */}
      <div
        role="group"
        aria-label="Post wählen"
        className="grid grid-cols-3 gap-2 sm:max-w-[420px]"
      >
        {posts.map((p, i) => {
          const aktiv = i === gewaehlt;
          // Haken nur, wenn genau diese Karte gepostet ist.
          const raus = dbModus
            ? standDb(p, "story") === "gepostet" ||
              standDb(p, "beitrag") === "gepostet"
            : gepostet.includes(`${p.datum}-${p.platz}`);
          const zumTag = p.herkunft === "aktuell" && p.anlass;
          return (
            <button
              key={p.platz}
              type="button"
              aria-pressed={aktiv}
              disabled={beschaeftigt}
              onClick={() =>
                aktiv ? undefined : wechseln(() => setGewaehlt(i))
              }
              className={cn(
                "relative rounded-[10px] border-2 p-1 text-left transition-colors disabled:opacity-60",
                aktiv
                  ? "border-foreground"
                  : "hover:border-border border-transparent",
              )}
            >
              <Vorschau karte={p} versatz={versaetze[i] ?? 0} />
              {raus ? (
                <span className="bg-foreground text-background absolute top-2.5 right-2.5 inline-flex h-6 w-6 items-center justify-center rounded-full">
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  <span className="sr-only">gepostet</span>
                </span>
              ) : null}
              <span className="mt-1.5 block text-[12px] leading-4 font-semibold">
                {platzName(p.platz)}
              </span>
              {/* Tagesaktuell: der Anlass, sonst der Kicker der Reserve-Karte. */}
              <span
                className={cn(
                  "block truncate text-[12px] leading-4",
                  zumTag
                    ? "text-gold-ink font-medium"
                    : "text-muted-foreground",
                )}
              >
                {zumTag ? p.anlass : p.kicker}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-[minmax(0,320px)_minmax(0,1fr)] sm:items-start">
        {/* Große Vorschau mit Format und Design */}
        <div>
          <div
            role="group"
            aria-label="Format"
            className="border-border mx-auto mb-3 grid max-w-[320px] grid-cols-2 rounded-[3px] border p-0.5"
          >
            {(
              [
                ["story", "Story 9:16"],
                ["beitrag", "Beitrag 4:5"],
              ] as const
            ).map(([wert, label]) => (
              <button
                key={wert}
                type="button"
                aria-pressed={format === wert}
                onClick={() =>
                  format === wert ? undefined : wechseln(() => setFormat(wert))
                }
                disabled={beschaeftigt}
                className={cn(
                  "h-11 rounded-[2px] text-[14px] font-medium transition-colors disabled:opacity-50",
                  format === wert && "bg-foreground text-background",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <canvas
            ref={flaeche}
            width={f.b}
            height={f.h}
            role="img"
            aria-label={`${format === "story" ? "Story" : "Beitrag"}: ${karte.kicker}. ${karte.text} ${karte.zusatz}`}
            style={{ aspectRatio: `${f.b} / ${f.h}` }}
            className="border-border mx-auto block w-full max-w-[320px] rounded-[18px] border bg-[#0f2a3a]"
          />
          <div className="mx-auto mt-3 flex max-w-[320px] flex-wrap gap-2">
            <button
              type="button"
              onClick={() => neuesDesign(1)}
              disabled={!frei}
              className={cn(HELL, "flex-1")}
            >
              <Shuffle className="h-4 w-4" aria-hidden="true" />
              Anderes Design
            </button>
            {versatz > 0 ? (
              <button
                type="button"
                onClick={() => neuesDesign(null)}
                disabled={!frei}
                className={HELL}
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Original
              </button>
            ) : null}
          </div>
        </div>

        {/* Werkzeuge */}
        <div>
          <BildUndVideo
            buehne={buehne}
            betont={false}
            vorne={
              <InstagramPosten
                // Anderer Post oder anderes Format: Auswahl und Text neu.
                key={`${kennung}|${format}`}
                karten={[karte]}
                versatz={versatz}
                quelle={{ typ: "post", datum: karte.datum, platz: karte.platz }}
                caption={beschriftung}
                start={format === "beitrag" ? "beitrag" : "story"}
                gesperrt={beschaeftigt}
                className="col-span-2"
                onGepostet={aufInstagram}
              />
            }
          />

          <h3 className="mt-3 mb-1 text-[15px] font-semibold tracking-tight">
            Text für den Beitrag
          </h3>
          <p className="border-border bg-foreground/[0.03] rounded-[3px] border px-3 py-2 text-[15px] leading-6 whitespace-pre-line select-all">
            {beschriftung}
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <button type="button" onClick={kopieren} className={HELL}>
              <Copy className="h-4 w-4" aria-hidden="true" />
              Text kopieren
            </button>
            <button
              type="button"
              onClick={markieren}
              aria-pressed={istGepostet}
              disabled={dbModus && (hakt || !abhakenMoeglich)}
              className={istGepostet ? DUNKEL : HELL}
            >
              <Check className="h-4 w-4" aria-hidden="true" />
              {dbModus
                ? istGepostet
                  ? `${formatLabel} gepostet`
                  : `${formatLabel} abhaken`
                : istGepostet
                  ? "Gepostet"
                  : "Abhaken"}
            </button>
          </div>
          {frueher ? (
            <p className="text-muted-foreground mt-2 text-[14px] leading-5">
              Als {formatLabel} gepostet wurde vorher eine andere Karte:{" "}
              {`„${frueher}“`} Abhaken trägt diese Karte ein.
            </p>
          ) : null}
          {dbModus && !abhakenMoeglich ? (
            <p className="text-muted-foreground mt-2 text-[14px] leading-5">
              Abhaken geht vom Tag selbst bis {NACHTRAGEN_TAGE} Tage danach.
            </p>
          ) : null}

          <p className="text-muted-foreground mt-5 text-[14px] leading-5">
            Am schnellsten:{" "}
            <strong className="text-foreground">Auf Instagram posten</strong>,
            dann geht der Post direkt raus. Von Hand oder als Video:
          </p>
          <ol className="text-muted-foreground mt-1 list-decimal space-y-1 pl-5 text-[14px] leading-5">
            <li>Post und Format wählen (Story oder Beitrag).</li>
            <li>
              <strong className="text-foreground">Bild teilen</strong> oder erst{" "}
              <strong className="text-foreground">Video erstellen</strong>, dann
              teilen. Im Teilen-Menü Instagram wählen.
            </li>
            <li>Text kopieren, im Beitrag einfügen, posten.</li>
          </ol>
          <p className="text-muted-foreground mt-2 text-[14px] leading-5">
            Bild und Video zeigen nur die Karte, ohne die Website drumherum. Bei
            der Story bleibt oben und unten Platz für die Bedienung von
            Instagram.
          </p>
        </div>
      </div>
    </div>
  );
}
