"use client";

import { Check, Copy, ExternalLink, Loader2, Wand2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";

import type { PostFormat, PostStand } from "@/lib/admin/post-planer";
import type { SpruchTag } from "@/lib/sprueche-data";

import { setPostGepostetAction } from "@/app/admin/post-actions";
import { runAction } from "@/app/admin/run-action";
import {
  FORMAT_LABELS,
  gepostetNach,
  platzName,
  POST_FORMATE,
} from "@/lib/admin/post-planer";
import { cn } from "@/lib/utils";

const KNOPF =
  "inline-flex h-11 items-center justify-center gap-2 rounded-[3px] px-3 text-[15px] font-medium transition-colors disabled:opacity-60";
const HELL = cn(
  KNOPF,
  "border-border bg-background hover:border-foreground/40 border",
);

type Meldung = { art: "ok" | "fehler"; text: string };

/**
 * Ein Post von heute im Post-Planer: Anlass oder Reserve, Kicker, Satz
 * und Zusatz, der Beitragstext zum Kopieren und je Format ein Schalter
 * „gepostet“ (gespeichert in post_status, für alle Geräte gleich).
 *
 * Wurde an dem Platz vorher eine andere Karte gepostet (Stand „andere“,
 * etwa die Reserve vor dem Morgenlauf), ist der Schalter nicht gedrückt
 * und gestrichelt. Ein Tipp hakt dann die gezeigte Karte ab, der
 * Eintrag bleibt (gepostetNach).
 */
export function PostKarte({
  post,
  beschriftung,
  quelle,
  stand,
  frueher,
  studioHref,
  enabled,
}: {
  post: SpruchTag;
  beschriftung: string;
  /** Adresse, auf die sich der Anlass stützt (nur hier sichtbar). */
  quelle: string | null;
  stand: Record<PostFormat, PostStand>;
  /** Satz einer früher an diesem Platz geposteten Karte (Stand „andere“). */
  frueher: string | null;
  studioHref: string;
  /** false ohne Datenbank-Update: Schalter aus. */
  enabled: boolean;
}) {
  const [pending, start] = useTransition();
  const [laeuft, setLaeuft] = useState<PostFormat | null>(null);
  const [meldung, setMeldung] = useState<Meldung | null>(null);

  useEffect(() => {
    if (!meldung) return;
    const t = window.setTimeout(
      () => setMeldung(null),
      meldung.art === "ok" ? 4200 : 10_000,
    );
    return () => window.clearTimeout(t);
  }, [meldung]);

  const anders = POST_FORMATE.filter((f) => stand[f] === "andere");
  const hinweisId = `post-${post.platz}-frueher`;

  function umschalten(format: PostFormat) {
    const gepostet = gepostetNach(stand[format]);
    setMeldung(null);
    setLaeuft(format);
    start(async () => {
      const res = await runAction(() =>
        setPostGepostetAction(post.datum, post.platz, format, gepostet),
      );
      setLaeuft(null);
      if (!res.ok) return setMeldung({ art: "fehler", text: res.error });
      setMeldung({
        art: "ok",
        text: gepostet
          ? `${FORMAT_LABELS[format]} abgehakt.`
          : `${FORMAT_LABELS[format]} wieder offen.`,
      });
    });
  }

  async function kopieren() {
    try {
      await navigator.clipboard.writeText(beschriftung);
      setMeldung({ art: "ok", text: "Text kopiert." });
    } catch {
      setMeldung({
        art: "fehler",
        text: "Kopieren nicht erlaubt. Markiere den Text von Hand.",
      });
    }
  }

  return (
    <article
      aria-labelledby={`post-${post.platz}`}
      className="border-border bg-card flex h-full flex-col rounded-[4px] border p-4"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <h3 id={`post-${post.platz}`} className="text-[15px] font-semibold">
          {platzName(post.platz)}
        </h3>
        {post.herkunft === "aktuell" && post.anlass ? (
          <span className="bg-gold/15 text-gold-ink max-w-full truncate rounded-[3px] px-2 py-0.5 text-[12.5px] font-medium">
            {post.anlass}
          </span>
        ) : (
          <span className="border-border text-muted-foreground rounded-[3px] border px-2 py-0.5 text-[12.5px] font-medium">
            Reserve
          </span>
        )}
      </div>

      <p className="label-mono text-muted-foreground mt-3 text-[12px] uppercase">
        {post.kicker}
      </p>
      <p className="mt-1 text-[17px] leading-snug font-semibold text-pretty">
        {post.text}
      </p>
      <p className="text-muted-foreground mt-1 text-[15px] leading-snug text-pretty">
        {post.zusatz}
      </p>
      {quelle ? (
        <a
          href={quelle}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground mt-1 inline-flex h-11 items-center gap-1.5 self-start text-[14px] underline underline-offset-4"
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          Quelle zum Anlass
        </a>
      ) : null}

      <div className="mt-auto pt-4">
        <p className="text-muted-foreground mb-1 text-[13px]">
          Text für den Beitrag
        </p>
        <p className="border-border bg-foreground/[0.03] rounded-[3px] border px-3 py-2 text-[14px] leading-5 whitespace-pre-line select-all">
          {beschriftung}
        </p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <button type="button" onClick={kopieren} className={HELL}>
            <Copy className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Text </span>Kopieren
          </button>
          <Link href={studioHref} className={HELL}>
            <Wand2 className="h-4 w-4" aria-hidden="true" />
            Im Studio<span className="sr-only"> öffnen</span>
          </Link>
        </div>

        <p
          aria-hidden="true"
          className="border-border text-muted-foreground mt-3 border-t pt-3 pb-1.5 text-[13px]"
        >
          Gepostet als
        </p>
        <div
          role="group"
          aria-label={`${platzName(post.platz)}: gepostet als`}
          className="grid grid-cols-2 gap-2"
        >
          {POST_FORMATE.map((format) => {
            const an = stand[format] === "gepostet";
            const andere = stand[format] === "andere";
            return (
              <button
                key={format}
                type="button"
                aria-pressed={an}
                aria-describedby={andere && frueher ? hinweisId : undefined}
                disabled={!enabled || pending}
                onClick={() => umschalten(format)}
                className={cn(
                  KNOPF,
                  "border",
                  an
                    ? "border-foreground bg-foreground text-background"
                    : andere
                      ? "border-foreground/60 bg-background hover:border-foreground border-dashed"
                      : "border-border bg-background hover:border-foreground/40",
                )}
              >
                {pending && laeuft === format ? (
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    aria-label="Speichert"
                  />
                ) : (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex h-[18px] w-[18px] items-center justify-center rounded-[3px] border",
                      an ? "border-background" : "border-foreground/40",
                    )}
                  >
                    {an ? <Check className="h-3.5 w-3.5" /> : null}
                  </span>
                )}
                {FORMAT_LABELS[format]}
              </button>
            );
          })}
        </div>
        {frueher && anders.length > 0 ? (
          <p
            id={hinweisId}
            className="text-muted-foreground mt-2 text-[13px] leading-snug"
          >
            Als {anders.map((f) => FORMAT_LABELS[f]).join(" und ")} gepostet
            wurde vorher eine andere Karte: „{frueher}“ Ein Tipp hakt diese
            Karte ab.
          </p>
        ) : null}
        <p
          role={meldung?.art === "fehler" ? "alert" : "status"}
          className={cn(
            "mt-1 min-h-5 text-[14px]",
            meldung?.art === "fehler"
              ? "text-ink-olive"
              : "text-ink-petrol font-medium",
          )}
        >
          {meldung?.text}
        </p>
      </div>
    </article>
  );
}
