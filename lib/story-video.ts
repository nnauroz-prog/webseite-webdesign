/**
 * Rechnet den Film eines Posts Bild für Bild und schreibt ihn als MP4
 * (H.264), statt ihn in Echtzeit vom Bildschirm aufzunehmen. So ruckelt
 * nichts, auch wenn ein Bild länger rechnet (Bewegungsunschärfe), und
 * jedes Bild sitzt genau auf seiner Zeit. Läuft nur im Browser, genutzt
 * vom Story-Studio (/admin/story).
 *
 * Braucht WebCodecs (Safari ab 16.4, Chrome, Edge). Wo das fehlt, gibt
 * filmAlsMp4 null zurück, und das Studio nimmt wie früher in Echtzeit auf.
 */

/** H.264-Stufen, die 1080 × 1920 bei 30 Bildern tragen; die erste, die der Browser kann, gilt. */
const KODIERUNGEN = [
  "avc1.640028",
  "avc1.4d0028",
  "avc1.42e028",
  "avc1.64002a",
  "avc1.640032",
  "avc1.42e032",
];

async function einstellung(
  breite: number,
  hoehe: number,
  fps: number,
  bitrate: number,
): Promise<VideoEncoderConfig | null> {
  if (typeof VideoEncoder === "undefined" || typeof VideoFrame === "undefined")
    return null;
  // H.264 kennt nur gerade Maße.
  if (breite % 2 || hoehe % 2) return null;
  for (const codec of KODIERUNGEN) {
    const versuch: VideoEncoderConfig = {
      codec,
      width: breite,
      height: hoehe,
      bitrate,
      framerate: fps,
      latencyMode: "quality",
      // AVC-Format: liefert die Beschreibung, die eine MP4-Datei braucht.
      avc: { format: "avc" },
    };
    try {
      if ((await VideoEncoder.isConfigSupported(versuch)).supported)
        return versuch;
    } catch {
      // Diese Stufe kennt der Browser nicht: nächste versuchen.
    }
  }
  return null;
}

/** Kann dieser Browser den Film in dieser Größe rechnen? */
export async function kannFilmRechnen(
  breite: number,
  hoehe: number,
): Promise<boolean> {
  return (await einstellung(breite, hoehe, 30, 12_000_000)) !== null;
}

const luft = () => new Promise<void>((weiter) => setTimeout(weiter, 0));

/**
 * Zeichnet jedes Bild des Films mit `zeichne(t)` auf die Zeichenfläche
 * und kodiert es. Gibt die MP4-Datei zurück, oder null, wenn der Browser
 * es nicht kann oder das Kodieren scheitert. Bei Abbruch wird ein
 * AbortError geworfen.
 */
export async function filmAlsMp4(
  canvas: HTMLCanvasElement,
  zeichne: (t: number) => void,
  optionen: {
    /** Länge des Films in Sekunden */
    dauer: number;
    fps?: number;
    bitrate?: number;
    /** So lange steht das letzte Bild am Ende (Sekunden) */
    halten?: number;
    /** Fortschritt 0 bis 1 */
    fortschritt?: (anteil: number) => void;
    abbruch?: AbortSignal;
  },
): Promise<Blob | null> {
  const fps = optionen.fps ?? 30;
  const config = await einstellung(
    canvas.width,
    canvas.height,
    fps,
    optionen.bitrate ?? 12_000_000,
  );
  if (!config) return null;
  let fehler: unknown = null;
  let encoder: VideoEncoder | null = null;
  const abgebrochen = () => {
    if (optionen.abbruch?.aborted)
      throw new DOMException("Abgebrochen", "AbortError");
  };
  try {
    // Erst hier laden: Die Bibliothek gehört nur in das Story-Studio.
    // Scheitert das (kein Netz), gilt das wie „kann nicht rechnen“.
    const { Muxer, ArrayBufferTarget } = await import("mp4-muxer");
    const muxer = new Muxer({
      target: new ArrayBufferTarget(),
      video: {
        codec: "avc",
        width: canvas.width,
        height: canvas.height,
        frameRate: fps,
      },
      fastStart: "in-memory",
    });
    encoder = new VideoEncoder({
      output: (stueck, meta) => muxer.addVideoChunk(stueck, meta),
      error: (e) => {
        fehler = e;
      },
    });
    encoder.configure(config);
    const bilder = Math.round(optionen.dauer * fps);
    const gesamt = bilder + Math.round((optionen.halten ?? 0.4) * fps);
    for (let i = 0; i < gesamt; i++) {
      abgebrochen();
      if (fehler) throw fehler;
      // Nach dem letzten Bild des Films bleibt das Schlussbild stehen.
      if (i <= bilder) zeichne(i < bilder ? i / fps : optionen.dauer);
      const bild = new VideoFrame(canvas, {
        timestamp: Math.round((i * 1e6) / fps),
        duration: Math.round(1e6 / fps),
      });
      // Jede Sekunde ein Schlüsselbild.
      encoder.encode(bild, { keyFrame: i % fps === 0 });
      bild.close();
      optionen.fortschritt?.((i + 1) / gesamt);
      // Nicht schneller liefern, als kodiert wird, und dem Browser Luft
      // lassen: So malt die Anzeige weiter, und der Tab bleibt am Leben.
      while (encoder.encodeQueueSize > 4) {
        await luft();
        abgebrochen();
        if (fehler) throw fehler;
      }
      if (i % 3 === 2) await luft();
    }
    await encoder.flush();
    if (fehler) throw fehler;
    muxer.finalize();
    return new Blob([muxer.target.buffer], { type: "video/mp4" });
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") throw e;
    return null;
  } finally {
    if (encoder && encoder.state !== "closed") encoder.close();
  }
}
