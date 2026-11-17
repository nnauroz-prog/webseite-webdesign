"use client";

import { Download, Film, Play, Share2 } from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";

import type { SpruchTag } from "@/lib/sprueche-data";

import {
  FORMATE,
  STORY_DAUER,
  storyVorbereiten,
  zeichneStory,
  type StoryFormat,
  type StoryZeichner,
} from "@/lib/story-bild";
import { kinoFreigeben } from "@/lib/story-kino";
import { filmAlsMp4 } from "@/lib/story-video";
import { cn } from "@/lib/utils";

/**
 * Die Bühne des Story-Studios: eine Karte groß auf der Zeichenfläche, als
 * Standbild, als Film in der Vorschau und als gerechnetes Video, dazu
 * Teilen und Sichern. Die einzelnen Posts (story-studio.tsx) und die
 * Story-Serien (serien-betrachter.tsx) benutzen dieselbe Bühne.
 *
 * - Bild teilen reicht die Bilddatei an das Teilen-Blatt des Handys
 *   (dort Instagram wählen), Bild sichern lädt sie herunter.
 * - Video erstellen rechnet den Film der Karte Bild für Bild und
 *   schreibt ihn als MP4. Das dauert etwas länger als der Film selbst,
 *   ruckelt dafür nicht. Kann der Browser das nicht, wird der Film in
 *   Echtzeit aufgenommen. Danach lässt er sich teilen oder sichern.
 * - Abspielen zeigt den Film sofort, in einer leichteren Fassung.
 */

export const KNOPF =
  "inline-flex h-11 items-center justify-center gap-2 rounded-[3px] px-4 text-[15px] font-medium disabled:opacity-50";
export const HELL = cn(
  "border-border hover:border-foreground/40 border transition-colors",
  KNOPF,
);
export const DUNKEL = cn("bg-foreground text-background", KNOPF);

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

/**
 * Die Zeichenfläche als Bilddatei. JPEG statt PNG: Das feine Korn macht
 * PNG mehrere Megabyte groß; Instagram wandelt ohnehin in JPEG um.
 */
export function bildAus(
  flaeche: HTMLCanvasElement,
  name: string,
): Promise<File | null> {
  return new Promise((fertig) => {
    flaeche.toBlob(
      (blob) =>
        fertig(
          blob ? new File([blob], `${name}.jpg`, { type: "image/jpeg" }) : null,
        ),
      "image/jpeg",
      0.93,
    );
  });
}

/** Lädt eine Datei herunter (am Rechner; am Handy über das Teilen-Blatt). */
export function dateiSichern(datei: File): void {
  const url = URL.createObjectURL(datei);
  const a = document.createElement("a");
  a.href = url;
  a.download = datei.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

/** Nimmt das Teilen-Blatt dieses Geräts diese Dateien an? */
export function kannTeilen(dateien: File[]): boolean {
  try {
    return (
      typeof navigator.share === "function" &&
      navigator.canShare?.({ files: dateien }) === true
    );
  } catch {
    return false;
  }
}

/**
 * Eine Karte als fertiges Standbild in voller Größe, ohne dass sie auf
 * der Bühne steht (für „Alle Bilder teilen“). Die Fläche wird danach
 * geleert, damit das Handy den Speicher gleich zurückbekommt.
 */
export async function standbildDatei(
  karte: SpruchTag,
  versatz: number,
  name: string,
): Promise<File | null> {
  const flaeche = document.createElement("canvas");
  try {
    await zeichneStory(flaeche, karte, FORMATE.story, { versatz });
    return await bildAus(flaeche, name);
  } catch {
    return null;
  } finally {
    flaeche.width = flaeche.height = 0;
  }
}

/** Kleines Standbild einer Karte (Story-Format, ein Fünftel der Größe). */
export function Vorschau({
  karte,
  versatz,
}: {
  karte: SpruchTag;
  versatz: number;
}) {
  const flaeche = useRef<HTMLCanvasElement | null>(null);
  // Am Inhalt hängen, nicht am Objekt: Lädt die Seite ihre Daten neu,
  // wird dasselbe Bild nicht noch einmal gezeichnet.
  const inhalt = JSON.stringify(karte);
  const karteJetzt = useRef(karte);
  useEffect(() => {
    karteJetzt.current = karte;
  });
  useEffect(() => {
    const c = flaeche.current;
    if (c)
      void zeichneStory(c, karteJetzt.current, FORMATE.story, {
        skala: 0.2,
        versatz,
      });
  }, [inhalt, versatz]);
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

export type BuehneZustand = "laedt" | "bereit" | "spielt" | "nimmtAuf";

/**
 * Bereitet die Karte auf der Zeichenfläche vor und gibt alles zurück,
 * was die Knöpfe brauchen. flaecheRef ist der ref am <canvas> (legt die
 * Komponente selbst an).
 */
export function useKartenBuehne(
  flaecheRef: RefObject<HTMLCanvasElement | null>,
  {
    karte,
    format,
    versatz,
    name,
  }: {
    karte: SpruchTag;
    format: StoryFormat["name"];
    /** „Anderes Design“: 0 ist das Design des Tages. */
    versatz: number;
    /** Dateiname ohne Endung für Bild und Video. */
    name: string;
  },
) {
  const zeichne = useRef<StoryZeichner | null>(null);
  const lauf = useRef(0);
  const [zustand, setZustand] = useState<BuehneZustand>("laedt");
  const [rest, setRest] = useState(0);
  /** Fortschritt beim Rechnen des Videos (0 bis 1); null, wenn nicht gerechnet wird */
  const [anteil, setAnteil] = useState<number | null>(null);
  const abbruch = useRef<AbortController | null>(null);
  /** Beendet eine laufende Aufnahme in Echtzeit, ohne ein Video zu behalten */
  const echtzeitStopp = useRef<(() => void) | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [meldung, setMeldung] = useState<string | null>(null);
  const meldungUhr = useRef(0);

  // Gewählte Karte vorbereiten und als Standbild zeigen. Der Effekt hängt
  // am Inhalt der Karte, nicht am Objekt: Lädt die Seite ihre Daten neu
  // (etwa nach der Rückkehr aus dem Hintergrund), bleibt ein laufendes
  // Rechnen ungestört.
  const inhalt = JSON.stringify(karte);
  const karteJetzt = useRef(karte);
  useEffect(() => {
    karteJetzt.current = karte;
  });
  useEffect(() => {
    let abgebrochen = false;
    const c = flaecheRef.current;
    if (!c) return;
    void storyVorbereiten(c, karteJetzt.current, FORMATE[format], {
      versatz,
      // Kino-Kamera: das Plakat im Raum gefilmt (wo der Browser es kann).
      kino: true,
    }).then((z) => {
      if (abgebrochen) return;
      zeichne.current = z;
      z(Infinity);
      setZustand("bereit");
    });
    return () => {
      abgebrochen = true;
      cancelAnimationFrame(lauf.current);
      abbruch.current?.abort();
      echtzeitStopp.current?.();
      zeichne.current = null;
    };
  }, [flaecheRef, inhalt, format, versatz]);

  useEffect(() => () => window.clearTimeout(meldungUhr.current), []);

  const sagen = useCallback((text: string) => {
    window.clearTimeout(meldungUhr.current);
    setMeldung(text);
    meldungUhr.current = window.setTimeout(() => setMeldung(null), 4200);
  }, []);

  /**
   * Vor jedem Wechsel (Karte, Format, Design): Film anhalten, Video
   * verwerfen. aendern muss Karte, Format oder Design wirklich ändern,
   * sonst bleibt die Bühne im Zustand „lädt“.
   */
  const wechseln = (aendern: () => void) => {
    cancelAnimationFrame(lauf.current);
    abbruch.current?.abort();
    echtzeitStopp.current?.();
    setZustand("laedt");
    setVideo(null);
    aendern();
  };

  /** Spielt den Film einmal ab; am Ende steht wieder das Standbild. */
  const abspielen = useCallback((amEnde?: () => void) => {
    const z = zeichne.current;
    if (!z) return;
    // Schafft das Gerät die Kino-Kamera in Echtzeit nicht flüssig (zwei
    // Probebilder vor dem Start oder der Median der ersten zwölf
    // Bildabstände über 40 ms), läuft die Vorschau flach. Fürs Video gilt
    // das nicht: Es wird Bild für Bild gerechnet und darf langsam sein.
    const mitKino = z.kino === true;
    if (mitKino) {
      const probe = performance.now();
      z(0);
      z(1 / 30);
      if ((performance.now() - probe) / 2 > 40) z.kino = false;
    }
    // Die Uhr rückt je Bild höchstens 50 ms vor: Hakt ein Bild, läuft der
    // Film kurz langsamer, statt Bilder zu überspringen.
    let t = 0;
    let zuletzt = performance.now();
    const takte: number[] = [];
    const bild = (jetzt: number) => {
      const schritt = Math.max(0, jetzt - zuletzt);
      zuletzt = jetzt;
      t += Math.min(schritt, 50) / 1000;
      if (t >= STORY_DAUER) {
        z(Infinity);
        if (mitKino) z.kino = true;
        amEnde?.();
        return;
      }
      if (z.kino && takte.length < 12) {
        takte.push(schritt);
        if (takte.length === 12) {
          const sortiert = takte.slice(1).sort((a, b) => a - b);
          if (sortiert[Math.floor(sortiert.length / 2)] > 40) z.kino = false;
        }
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

  /** Ersatz für ältere Browser: den Film abspielen und dabei aufnehmen. */
  const inEchtzeit = useCallback(() => {
    const c = flaecheRef.current;
    const typ = videoTyp();
    if (!c || !typ || typeof c.captureStream !== "function") {
      setZustand("bereit");
      sagen(
        "Dieser Browser kann kein Video erstellen. Am iPhone in Safari klappt es.",
      );
      return;
    }
    const stueck: BlobPart[] = [];
    const strom = c.captureStream(30);
    const rekorder = new MediaRecorder(strom, {
      mimeType: typ.mime,
      videoBitsPerSecond: 8_000_000,
    });
    rekorder.ondataavailable = (e) => {
      if (e.data.size > 0) stueck.push(e.data);
    };
    echtzeitStopp.current = () => {
      echtzeitStopp.current = null;
      rekorder.ondataavailable = null;
      rekorder.onstop = null;
      rekorder.onerror = null;
      if (rekorder.state !== "inactive") rekorder.stop();
      strom.getTracks().forEach((s) => s.stop());
    };
    rekorder.onstop = () => {
      echtzeitStopp.current = null;
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
      echtzeitStopp.current?.();
      cancelAnimationFrame(lauf.current);
      zeichne.current?.(Infinity);
      setZustand("bereit");
      sagen("Die Aufnahme hat nicht geklappt. Versuch es noch einmal.");
    };
    rekorder.start();
    // Kurz nach dem letzten Bild stoppen, damit es sicher im Film ist.
    abspielen(() =>
      window.setTimeout(() => {
        if (rekorder.state !== "inactive") rekorder.stop();
      }, 250),
    );
  }, [abspielen, flaecheRef, name, sagen]);

  /** Rechnet den Film Bild für Bild als MP4 (ruckelfrei). */
  const aufnehmen = useCallback(async () => {
    const c = flaecheRef.current;
    const z = zeichne.current;
    if (!c || !z) return;
    setVideo(null);
    setZustand("nimmtAuf");
    setAnteil(0);
    const stopp = new AbortController();
    abbruch.current = stopp;
    let datei: Blob | null = null;
    const rechnen = () =>
      // Fürs Video mit Bewegungsunschärfe (fein = true).
      filmAlsMp4(c, (t) => z(t, true), {
        dauer: STORY_DAUER,
        fortschritt: setAnteil,
        abbruch: stopp.signal,
      });
    try {
      const mitKino = z.kino === true;
      datei = await rechnen();
      // Fällt die Kino-Kamera mitten im Film aus (etwa wenn das Gerät den
      // Grafikspeicher braucht), hätte das Video einen harten Schnitt.
      // Dann noch einmal durchgehend flach rechnen.
      if (datei && mitKino && z.kino === false) {
        setAnteil(0);
        datei = await rechnen();
      }
    } catch {
      // Abgebrochen oder gescheitert: wird unten behandelt.
    }
    kinoFreigeben();
    if (abbruch.current === stopp) abbruch.current = null;
    setAnteil(null);
    // Dieselbe Karte steht noch da (kein Wechsel): Standbild zurück.
    const nochDa = zeichne.current === z;
    if (stopp.signal.aborted) {
      // Über den Knopf abgebrochen. Bei einem Wechsel räumt die neue
      // Karte selbst auf.
      if (nochDa) {
        z(Infinity);
        setZustand("bereit");
        sagen("Abgebrochen.");
      }
      return;
    }
    if (!nochDa) return;
    // Der Browser kann nicht rechnen (oder es ist gescheitert): wie
    // früher in Echtzeit aufnehmen.
    if (!datei) return inEchtzeit();
    z(Infinity);
    setVideo(new File([datei], `${name}.mp4`, { type: "video/mp4" }));
    setZustand("bereit");
    sagen("Video fertig. Jetzt teilen oder sichern.");
  }, [flaecheRef, inEchtzeit, name, sagen]);

  const alsBild = useCallback(async () => {
    const c = flaecheRef.current;
    return c ? bildAus(c, name) : null;
  }, [flaecheRef, name]);

  const laden = useCallback(
    (datei: File) => {
      dateiSichern(datei);
      sagen("Gesichert.");
    },
    [sagen],
  );

  /** Datei an das Teilen-Blatt geben; ohne Teilen-Blatt (Rechner) sichern. */
  const teilen = useCallback(
    async (datei: File | null) => {
      if (!datei) return sagen("Die Datei konnte nicht erzeugt werden.");
      if (kannTeilen([datei])) {
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

  return {
    zustand,
    /** Standbild steht, nichts läuft: Knöpfe sind frei. */
    frei: zustand === "bereit",
    /** Film läuft oder Video wird gerechnet: kein Wechsel. */
    beschaeftigt: zustand === "spielt" || zustand === "nimmtAuf",
    rest,
    anteil,
    video,
    meldung,
    sagen,
    wechseln,
    vorschau,
    aufnehmen,
    /** Bricht das Rechnen des Videos ab. */
    abbrechen: () => abbruch.current?.abort(),
    alsBild,
    laden,
    teilen,
  };
}

export type KartenBuehne = ReturnType<typeof useKartenBuehne>;

const KOPF = "mb-2 text-[15px] font-semibold tracking-tight";

/**
 * Die Knöpfe zur Karte auf der Bühne: Bild teilen und sichern, Video
 * erstellen, abspielen, teilen und sichern.
 */
export function BildUndVideo({
  buehne: b,
  bildTitel = "Bild",
  kopf: Kopf = "h3",
  betont = true,
}: {
  buehne: KartenBuehne;
  /** Überschrift über den Bild-Knöpfen. */
  bildTitel?: string;
  /** Ebene der beiden Überschriften (in einer aufgeklappten Serie h4). */
  kopf?: "h3" | "h4";
  /** false: alle Knöpfe hell (wenn ein anderer Knopf der wichtigste ist). */
  betont?: boolean;
}) {
  // Zwei Knöpfe nebeneinander müssen auch in einer aufgeklappten Serie am
  // iPhone ihre Beschriftung in eine Zeile bekommen.
  const schmal = "px-3 whitespace-nowrap sm:px-4";
  const hell = cn(HELL, schmal);
  const stark = cn(betont ? DUNKEL : HELL, schmal);
  return (
    <>
      <Kopf className={KOPF}>{bildTitel}</Kopf>
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        <button
          type="button"
          onClick={async () => b.teilen(await b.alsBild())}
          disabled={!b.frei}
          className={stark}
        >
          <Share2 className="h-4 w-4" aria-hidden="true" />
          Bild teilen
        </button>
        <button
          type="button"
          onClick={async () => {
            const bild = await b.alsBild();
            if (bild) b.laden(bild);
          }}
          disabled={!b.frei}
          className={hell}
        >
          <Download className="h-4 w-4" aria-hidden="true" />
          Bild sichern
        </button>
      </div>

      <Kopf className={cn(KOPF, "mt-5")}>
        Kurzvideo ({STORY_DAUER} Sekunden)
      </Kopf>
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
        <button
          type="button"
          // Während des Rechnens bricht derselbe Knopf ab.
          onClick={b.anteil === null ? b.aufnehmen : b.abbrechen}
          disabled={!b.frei && b.anteil === null}
          className={b.video ? hell : stark}
        >
          <Film className="h-4 w-4" aria-hidden="true" />
          {b.zustand === "nimmtAuf"
            ? b.anteil === null
              ? `Nimmt auf … ${b.rest} s`
              : `Abbrechen · ${Math.round(b.anteil * 100)} %`
            : b.video
              ? "Neu erstellen"
              : "Video erstellen"}
        </button>
        <button
          type="button"
          onClick={b.vorschau}
          disabled={!b.frei}
          className={hell}
        >
          <Play className="h-4 w-4" aria-hidden="true" />
          Abspielen
        </button>
        {b.video ? (
          <>
            <button
              type="button"
              onClick={() => b.teilen(b.video)}
              disabled={!b.frei}
              className={stark}
            >
              <Share2 className="h-4 w-4" aria-hidden="true" />
              Video teilen
            </button>
            <button
              type="button"
              onClick={() => (b.video ? b.laden(b.video) : undefined)}
              disabled={!b.frei}
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
        {b.meldung}
      </p>
    </>
  );
}
