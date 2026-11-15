"use client";

import {
  Check,
  Copy,
  Download,
  Film,
  Play,
  RotateCcw,
  Share2,
  Shuffle,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import type { SpruchTag } from "@/lib/sprueche-data";
import {
  FORMATE,
  STORY_DAUER,
  storyVorbereiten,
  zeichneStory,
  type StoryFormat,
} from "@/lib/story-bild";
import { cn } from "@/lib/utils";

/**
 * Story-Studio im Admin: die Posts eines Tages als fertige Bilder und
 * Kurzvideos, ohne jedes Seitenlayout.
 *
 * - Oben die Posts des Tages als Vorschaubilder (Spruch des Tages und
 *   zwei Zusatz-Posts). Antippen wählt einen aus.
 * - Format: Story (1080 × 1920) oder Beitrag (1080 × 1350).
 * - Anderes Design würfelt Farbwelt, Motiv und Anordnung neu; Original
 *   stellt das Design des Tages wieder her.
 * - Bild teilen reicht die Bilddatei an das Teilen-Blatt des Handys
 *   (dort Instagram wählen), Bild sichern lädt sie herunter.
 * - Video erstellen spielt den Film der Karte ab (sieben Sekunden) und
 *   nimmt ihn dabei auf. Danach lässt er sich teilen oder sichern.
 * - Text kopieren legt den Beitragstext in die Zwischenablage.
 * - Abhaken merkt sich auf diesem Gerät, was schon gepostet ist.
 */

const SPEICHER = "sitalo-story-gepostet";
const PLATZ_NAME = ["Spruch des Tages", "Zusatz-Post 1", "Zusatz-Post 2"];

/** Videoformat, das dieser Browser aufnehmen kann; MP4 zuerst (Instagram). */
function videoTyp(): { mime: string; endung: string } | null {
  if (typeof MediaRecorder === "undefined") return null;
  const kandidaten = [
    { mime: "video/mp4;codecs=avc1.42E01E", endung: "mp4" },
    { mime: "video/mp4", endung: "mp4" },
    { mime: "video/webm;codecs=vp9", endung: "webm" },
    { mime: "video/webm", endung: "webm" },
  ];
  return kandidaten.find((k) => MediaRecorder.isTypeSupported(k.mime)) ?? null;
}

/** Kleines Standbild eines Posts (Story-Format, ein Fünftel der Größe). */
function Vorschau({ karte, versatz }: { karte: SpruchTag; versatz: number }) {
  const flaeche = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const c = flaeche.current;
    if (c) void zeichneStory(c, karte, FORMATE.story, { skala: 0.2, versatz });
  }, [karte, versatz]);
  return (
    <canvas
      ref={flaeche}
      width={216}
      height={384}
      aria-hidden="true"
      className="block aspect-[9/16] w-full rounded-[8px] bg-[#0f2a3a]"
    />
  );
}

type Zustand = "laedt" | "bereit" | "spielt" | "nimmtAuf";

export function StoryStudio({
  posts,
  beschriftungen,
}: {
  /** Posts des Tages: Spruch des Tages zuerst */
  posts: SpruchTag[];
  /** Beitragstext je Post, gleiche Reihenfolge */
  beschriftungen: string[];
}) {
  const flaeche = useRef<HTMLCanvasElement | null>(null);
  const zeichne = useRef<((t: number) => void) | null>(null);
  const lauf = useRef(0);
  const [gewaehlt, setGewaehlt] = useState(0);
  const [format, setFormat] = useState<StoryFormat["name"]>("story");
  /** „Anderes Design“ je Post: 0 ist das Design des Tages. */
  const [versaetze, setVersaetze] = useState<number[]>(() =>
    posts.map(() => 0),
  );
  const [zustand, setZustand] = useState<Zustand>("laedt");
  const [rest, setRest] = useState(0);
  const [video, setVideo] = useState<File | null>(null);
  const [meldung, setMeldung] = useState<string | null>(null);
  const [gepostet, setGepostet] = useState<string[]>([]);

  const karte = posts[gewaehlt];
  const versatz = versaetze[gewaehlt] ?? 0;
  const f = FORMATE[format];
  const kennung = `${karte.datum}-${karte.platz}`;
  const name = `sitalo-${karte.datum}-post${karte.platz + 1}-${format}`;
  const beschriftung = beschriftungen[gewaehlt] ?? "";
  const frei = zustand === "bereit";
  const beschaeftigt = zustand === "spielt" || zustand === "nimmtAuf";

  // Was schon gepostet ist, merkt sich dieses Gerät.
  useEffect(() => {
    try {
      const roh = window.localStorage.getItem(SPEICHER);
      if (roh) setGepostet(JSON.parse(roh) as string[]);
    } catch {
      // Ohne Speicher (privates Fenster) bleibt die Liste leer.
    }
  }, []);

  // Gewählten Post vorbereiten und als Standbild zeigen.
  useEffect(() => {
    let abgebrochen = false;
    const c = flaeche.current;
    if (!c) return;
    void storyVorbereiten(c, karte, FORMATE[format], { versatz }).then((z) => {
      if (abgebrochen) return;
      zeichne.current = z;
      z(Infinity);
      setZustand("bereit");
    });
    return () => {
      abgebrochen = true;
      cancelAnimationFrame(lauf.current);
      zeichne.current = null;
    };
  }, [karte, format, versatz]);

  const sagen = useCallback((text: string) => {
    setMeldung(text);
    window.setTimeout(() => setMeldung(null), 4200);
  }, []);

  /** Vor jedem Wechsel (Post, Format, Design): Film anhalten, Video verwerfen. */
  const wechseln = (aendern: () => void) => {
    cancelAnimationFrame(lauf.current);
    setZustand("laedt");
    setVideo(null);
    aendern();
  };

  const neuesDesign = (schritt: number | null) =>
    wechseln(() =>
      setVersaetze((alt) =>
        alt.map((v, i) =>
          i === gewaehlt ? (schritt === null ? 0 : v + schritt) : v,
        ),
      ),
    );

  const markieren = () => {
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

  /** Spielt den Film einmal ab; am Ende steht wieder das Standbild. */
  const abspielen = useCallback((amEnde?: () => void) => {
    const z = zeichne.current;
    if (!z) return;
    const beginn = performance.now();
    const bild = (jetzt: number) => {
      const t = (jetzt - beginn) / 1000;
      if (t >= STORY_DAUER) {
        z(Infinity);
        amEnde?.();
        return;
      }
      z(t);
      setRest(Math.ceil(STORY_DAUER - t));
      lauf.current = requestAnimationFrame(bild);
    };
    lauf.current = requestAnimationFrame(bild);
  }, []);

  const vorschau = useCallback(() => {
    setZustand("spielt");
    abspielen(() => setZustand("bereit"));
  }, [abspielen]);

  const aufnehmen = useCallback(() => {
    const c = flaeche.current;
    const typ = videoTyp();
    if (!c || !typ || typeof c.captureStream !== "function") {
      sagen(
        "Dieser Browser kann kein Video aufnehmen. Am iPhone in Safari klappt es.",
      );
      return;
    }
    setVideo(null);
    setZustand("nimmtAuf");
    const stueck: BlobPart[] = [];
    const strom = c.captureStream(30);
    const rekorder = new MediaRecorder(strom, {
      mimeType: typ.mime,
      videoBitsPerSecond: 8_000_000,
    });
    rekorder.ondataavailable = (e) => {
      if (e.data.size > 0) stueck.push(e.data);
    };
    rekorder.onstop = () => {
      strom.getTracks().forEach((s) => s.stop());
      const blob = new Blob(stueck, { type: typ.mime.split(";")[0] });
      setVideo(new File([blob], `${name}.${typ.endung}`, { type: blob.type }));
      setZustand("bereit");
      sagen(
        typ.endung === "mp4"
          ? "Video fertig. Jetzt teilen oder sichern."
          : "Video fertig (WebM). Instagram nimmt nur MP4: Erstelle es am iPhone in Safari.",
      );
    };
    rekorder.onerror = () => {
      setZustand("bereit");
      sagen("Die Aufnahme hat nicht geklappt. Versuch es noch einmal.");
    };
    rekorder.start();
    // Kurz nach dem letzten Bild stoppen, damit es sicher im Film ist.
    abspielen(() => window.setTimeout(() => rekorder.stop(), 250));
  }, [abspielen, name, sagen]);

  const alsBild = useCallback(
    () =>
      new Promise<File | null>((fertig) => {
        const c = flaeche.current;
        if (!c) return fertig(null);
        // JPEG statt PNG: Das feine Korn macht PNG mehrere Megabyte
        // groß; Instagram wandelt ohnehin in JPEG um.
        c.toBlob(
          (blob) =>
            fertig(
              blob
                ? new File([blob], `${name}.jpg`, { type: "image/jpeg" })
                : null,
            ),
          "image/jpeg",
          0.93,
        );
      }),
    [name],
  );

  const laden = useCallback(
    (datei: File) => {
      const url = URL.createObjectURL(datei);
      const a = document.createElement("a");
      a.href = url;
      a.download = datei.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
      sagen("Gesichert.");
    },
    [sagen],
  );

  /** Datei an das Teilen-Blatt geben; ohne Teilen-Blatt (Rechner) sichern. */
  const teilen = useCallback(
    async (datei: File | null) => {
      if (!datei) return sagen("Die Datei konnte nicht erzeugt werden.");
      if (navigator.canShare?.({ files: [datei] })) {
        try {
          await navigator.share({ files: [datei] });
        } catch {
          // Abgebrochen: nichts tun.
        }
        return;
      }
      laden(datei);
    },
    [laden, sagen],
  );

  const kopieren = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(beschriftung);
      sagen("Text kopiert.");
    } catch {
      sagen("Kopieren nicht erlaubt. Markiere den Text von Hand.");
    }
  }, [beschriftung, sagen]);

  const knopf =
    "inline-flex h-11 items-center justify-center gap-2 rounded-[3px] px-4 text-[15px] font-medium disabled:opacity-50";
  const hell = cn(
    "border-border hover:border-foreground/40 border transition-colors",
    knopf,
  );
  const dunkel = cn("bg-foreground text-background", knopf);
  const istGepostet = gepostet.includes(kennung);

  return (
    <div className="mt-5">
      {/* Posts des Tages */}
      <h2 className="mb-2 text-[15px] font-semibold tracking-tight">
        {posts.length === 1
          ? "Post für diesen Tag"
          : `${posts.length} Posts für diesen Tag`}
      </h2>
      <div
        role="group"
        aria-label="Post wählen"
        className="grid grid-cols-3 gap-2 sm:max-w-[420px]"
      >
        {posts.map((p, i) => {
          const aktiv = i === gewaehlt;
          const raus = gepostet.includes(`${p.datum}-${p.platz}`);
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
                {PLATZ_NAME[p.platz] ?? `Post ${p.platz + 1}`}
              </span>
              <span className="text-muted-foreground block truncate text-[12px] leading-4">
                {p.kicker}
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
                  "h-10 rounded-[2px] text-[14px] font-medium transition-colors disabled:opacity-50",
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
              className={cn(hell, "flex-1")}
            >
              <Shuffle className="h-4 w-4" aria-hidden="true" />
              Anderes Design
            </button>
            {versatz > 0 ? (
              <button
                type="button"
                onClick={() => neuesDesign(null)}
                disabled={!frei}
                className={hell}
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Original
              </button>
            ) : null}
          </div>
        </div>

        {/* Werkzeuge */}
        <div>
          <h2 className="mb-2 text-[15px] font-semibold tracking-tight">
            Bild
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <button
              type="button"
              onClick={async () => teilen(await alsBild())}
              disabled={!frei}
              className={dunkel}
            >
              <Share2 className="h-4 w-4" aria-hidden="true" />
              Bild teilen
            </button>
            <button
              type="button"
              onClick={async () => {
                const b = await alsBild();
                if (b) laden(b);
              }}
              disabled={!frei}
              className={hell}
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Bild sichern
            </button>
          </div>

          <h2 className="mt-5 mb-2 text-[15px] font-semibold tracking-tight">
            Kurzvideo ({STORY_DAUER} Sekunden)
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <button
              type="button"
              onClick={aufnehmen}
              disabled={!frei}
              className={video ? hell : dunkel}
            >
              <Film className="h-4 w-4" aria-hidden="true" />
              {zustand === "nimmtAuf"
                ? `Nimmt auf … ${rest} s`
                : video
                  ? "Neu erstellen"
                  : "Video erstellen"}
            </button>
            <button
              type="button"
              onClick={vorschau}
              disabled={!frei}
              className={hell}
            >
              <Play className="h-4 w-4" aria-hidden="true" />
              Abspielen
            </button>
            {video ? (
              <>
                <button
                  type="button"
                  onClick={() => teilen(video)}
                  disabled={!frei}
                  className={dunkel}
                >
                  <Share2 className="h-4 w-4" aria-hidden="true" />
                  Video teilen
                </button>
                <button
                  type="button"
                  onClick={() => laden(video)}
                  disabled={!frei}
                  className={hell}
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  Video sichern
                </button>
              </>
            ) : null}
          </div>
          <p
            role="status"
            className="text-muted-foreground mt-2 min-h-5 text-[14px]"
          >
            {meldung}
          </p>

          <h2 className="mt-3 mb-1 text-[15px] font-semibold tracking-tight">
            Text für den Beitrag
          </h2>
          <p className="border-border bg-foreground/[0.03] rounded-[3px] border px-3 py-2 text-[15px] leading-6 whitespace-pre-line select-all">
            {beschriftung}
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <button type="button" onClick={kopieren} className={hell}>
              <Copy className="h-4 w-4" aria-hidden="true" />
              Text kopieren
            </button>
            <button
              type="button"
              onClick={markieren}
              aria-pressed={istGepostet}
              className={istGepostet ? dunkel : hell}
            >
              <Check className="h-4 w-4" aria-hidden="true" />
              {istGepostet ? "Gepostet" : "Abhaken"}
            </button>
          </div>

          <ol className="text-muted-foreground mt-5 list-decimal space-y-1 pl-5 text-[14px] leading-5">
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
