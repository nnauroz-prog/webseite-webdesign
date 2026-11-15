"use client";

import { Copy, Download, Film, Play, Share2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import type { SpruchTag } from "@/lib/sprueche-data";
import {
  FORMATE,
  STORY_DAUER,
  storyVorbereiten,
  type StoryFormat,
} from "@/lib/story-bild";

/**
 * Story-Werkzeug im Admin: zeichnet die Karte des Tages ohne jedes
 * Seitenlayout auf eine Zeichenfläche, als Story (1080 × 1920) oder als
 * Beitrag (1080 × 1350).
 *
 * - Bild teilen reicht das Bild an das Teilen-Blatt des Handys weiter
 *   (dort Instagram wählen), Bild sichern lädt es herunter.
 * - Video erstellen spielt den Film der Karte ab (sieben Sekunden) und
 *   nimmt ihn dabei auf. Danach lässt er sich teilen oder sichern.
 * - Text kopieren legt den Beitragstext in die Zwischenablage.
 */

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

type Zustand = "laedt" | "bereit" | "spielt" | "nimmtAuf";

export function StoryWerkzeug({
  karte,
  beschriftung,
}: {
  karte: SpruchTag;
  beschriftung: string;
}) {
  const flaeche = useRef<HTMLCanvasElement | null>(null);
  const zeichne = useRef<((t: number) => void) | null>(null);
  const lauf = useRef(0);
  const [format, setFormat] = useState<StoryFormat["name"]>("story");
  const [zustand, setZustand] = useState<Zustand>("laedt");
  const [rest, setRest] = useState(0);
  const [video, setVideo] = useState<File | null>(null);
  const [meldung, setMeldung] = useState<string | null>(null);
  const f = FORMATE[format];
  const name = `sitalo-spruch-${karte.datum}-${format}`;

  // Karte vorbereiten und als Standbild zeigen; bei Formatwechsel neu.
  useEffect(() => {
    let abgebrochen = false;
    const c = flaeche.current;
    if (!c) return;
    void storyVorbereiten(c, karte, FORMATE[format]).then((z) => {
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
  }, [karte, format]);

  const sagen = useCallback((text: string) => {
    setMeldung(text);
    window.setTimeout(() => setMeldung(null), 4200);
  }, []);

  const wechsleFormat = (neu: StoryFormat["name"]) => {
    if (neu === format) return;
    cancelAnimationFrame(lauf.current);
    setZustand("laedt");
    setVideo(null);
    setFormat(neu);
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
        c.toBlob(
          (blob) =>
            fertig(
              blob
                ? new File([blob], `${name}.png`, { type: "image/png" })
                : null,
            ),
          "image/png",
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
      sagen("Kopieren nicht erlaubt. Markiere den Text unten von Hand.");
    }
  }, [beschriftung, sagen]);

  const frei = zustand === "bereit";
  const knopf =
    "inline-flex h-11 items-center gap-2 rounded-[3px] px-4 text-[15px] font-medium disabled:opacity-50";
  const hell = `border-border hover:border-foreground/40 border transition-colors ${knopf}`;
  const dunkel = `bg-foreground text-background ${knopf}`;

  return (
    <div className="mt-4 grid gap-5 sm:grid-cols-[minmax(0,300px)_minmax(0,1fr)] sm:items-start">
      <div>
        <div
          role="group"
          aria-label="Format"
          className="border-border mx-auto mb-3 grid max-w-[300px] grid-cols-2 rounded-[3px] border p-0.5"
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
              onClick={() => wechsleFormat(wert)}
              disabled={zustand === "nimmtAuf" || zustand === "spielt"}
              className={`h-10 rounded-[2px] text-[14px] font-medium transition-colors disabled:opacity-50 ${
                format === wert ? "bg-foreground text-background" : ""
              }`}
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
          className="border-border mx-auto block w-full max-w-[300px] rounded-[18px] border bg-[#0f2a3a]"
        />
      </div>
      <div>
        <h2 className="mb-2 text-[15px] font-semibold tracking-tight">Bild</h2>
        <div className="flex flex-wrap gap-2">
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
        <div className="flex flex-wrap gap-2">
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
        <p className="mt-1 text-[15px] leading-6 text-pretty">
          So geht’s: Format wählen, <strong>teilen</strong> antippen, Instagram
          wählen, posten. Bild und Video zeigen nur die Karte, ohne die Website
          drumherum. Bei der Story bleibt oben und unten Platz für die Bedienung
          von Instagram.
        </p>

        <h2 className="mt-5 mb-1 text-[15px] font-semibold tracking-tight">
          Text für den Beitrag
        </h2>
        <p className="border-border bg-foreground/[0.03] rounded-[3px] border px-3 py-2 text-[15px] leading-6 whitespace-pre-line select-all">
          {beschriftung}
        </p>
        <button type="button" onClick={kopieren} className={`mt-2 ${hell}`}>
          <Copy className="h-4 w-4" aria-hidden="true" />
          Text kopieren
        </button>
      </div>
    </div>
  );
}
