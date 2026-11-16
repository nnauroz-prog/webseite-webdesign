"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { spruecheBis, tagInHamburg, type SpruchTag } from "@/lib/sprueche-data";
import { kinoFreigeben } from "@/lib/story-kino";
import {
  FORMATE,
  STORY_DAUER,
  storyVorbereiten,
  type StoryZeichner,
} from "@/lib/story-bild";
import { varianteFuer } from "@/lib/story-variante";

import r from "./spruch-reel.module.css";

/**
 * Spruch des Tages als Karte zum Durchblättern: oben der Fortschritt der
 * letzten sieben Tage, darunter die Karte im Format ihrer Reihe (Flagge,
 * Mythos, Zettel, Sprechblase …).
 *
 * - Die Karte wird mit derselben Zeichnung gemalt wie die Posts im
 *   Story-Studio (lib/story-bild.ts), nur im Hochformat 3:4. So sieht
 *   die Website genauso aus wie das, was auf Instagram erscheint. Teilen
 *   und Sichern gibt es nur im Admin (/admin/story).
 * - Heute steht vorn. Wischen, Tippen (rechts weiter, links zurück),
 *   die Pfeile daneben oder die Pfeiltasten zeigen die Tage davor.
 * - Jede Karte spielt einmal ihren kurzen Film, sobald sie im Bild steht,
 *   und „läuft“ neun Sekunden; dann rückt die nächste nach, bis jemand
 *   selbst blättert. Bei reduzierter Bewegung steht das fertige Bild.
 * - Der Text jeder Karte steht zusätzlich im Dokument: für
 *   Vorleseprogramme und Suchmaschinen, und als schlichte Karte, wenn
 *   kein JavaScript läuft.
 */

type Zeichner = StoryZeichner;

/** So scharf wie der Bildschirm, höchstens dreifache Auflösung. */
const SCHAERFE = 3;
/**
 * Auf der Website läuft der Film schneller als im Video für Instagram:
 * Wer die Seite öffnet, will den Spruch lesen und nicht darauf warten.
 */
const TEMPO = 1.7;

export function SpruchReel({
  tage: vomServer,
  kopf,
  fuss,
}: {
  tage: SpruchTag[];
  /** Kennzeile und Seitentitel über der Karte */
  kopf?: ReactNode;
  /** Zeile unter der Karte */
  fuss?: ReactNode;
}) {
  const spurRef = useRef<HTMLOListElement | null>(null);
  const flaechen = useRef(new Map<string, HTMLCanvasElement>());
  /** Je Tag die vorbereitete Zeichnung, laufende Filme, gezeigte Karten. */
  const zeichner = useRef(new Map<string, Promise<Zeichner>>());
  const filme = useRef(new Map<string, number>());
  const gespielt = useRef(new Set<string>());
  const selbstRef = useRef(false);
  const [aktiv, setAktiv] = useState(0);
  const [bereit, setBereit] = useState(false);
  const [gemalt, setGemalt] = useState<string[]>([]);
  const [tage, setTage] = useState(vomServer);

  // Die Seite kommt aus dem Zwischenspeicher und kann vom Vortag sein.
  // Dann rechnet der Browser die Woche selbst aus: heute zählt.
  useEffect(() => {
    const jetzt = new Date();
    if (vomServer[0]?.datum !== tagInHamburg(jetzt))
      setTage(spruecheBis(jetzt, vomServer.length));
  }, [vomServer]);

  // Welche Karte steht im Bild?
  useEffect(() => {
    const spur = spurRef.current;
    if (!spur || !("IntersectionObserver" in window)) return;
    const karten = Array.from(spur.children) as HTMLElement[];
    const io = new IntersectionObserver(
      (eintraege) => {
        for (const e of eintraege) {
          if (e.isIntersecting)
            setAktiv(karten.indexOf(e.target as HTMLElement));
        }
      },
      { root: spur, threshold: 0.6 },
    );
    karten.forEach((k) => io.observe(k));
    setBereit(true);
    return () => io.disconnect();
  }, [tage]);

  // Andere Woche oder Seite verlassen: Filme anhalten, Zeichnungen verwerfen.
  useEffect(() => {
    const z = zeichner.current;
    const f = filme.current;
    const g = gespielt.current;
    return () => {
      f.forEach((bild) => cancelAnimationFrame(bild));
      f.clear();
      z.clear();
      g.clear();
      kinoFreigeben();
    };
  }, [tage]);

  // Die Karte im Bild malen und einmal ihren Film spielen, danach die
  // Nachbarn vorbereiten, damit beim Blättern nichts leer ist.
  useEffect(() => {
    let verlassen = false;
    const ruhig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const bereite = (i: number): Promise<Zeichner | null> => {
      const karte = tage[i];
      const c = karte && flaechen.current.get(karte.datum);
      if (!karte || !c) return Promise.resolve(null);
      let z = zeichner.current.get(karte.datum);
      if (!z) {
        const dichte = Math.min(window.devicePixelRatio || 1, SCHAERFE);
        const skala = Math.min(
          1,
          Math.max(0.3, ((c.clientWidth || 360) * dichte) / FORMATE.karte.b),
        );
        z = storyVorbereiten(c, karte, FORMATE.karte, {
          skala,
          // Kino-Kamera nur, wenn der Film auch läuft.
          kino: ruhig ? false : { aufloesung: 1 },
        }).then(
          (male) => {
            // Noch nicht gezeigte Karten warten als leere Bühne auf ihren Film.
            male(ruhig ? Infinity : 0);
            setGemalt((alt) =>
              alt.includes(karte.datum) ? alt : [...alt, karte.datum],
            );
            return male;
          },
        );
        zeichner.current.set(karte.datum, z);
      }
      return z;
    };

    const spiele = (datum: string, male: Zeichner) => {
      gespielt.current.add(datum);
      // Läuft noch der Film einer anderen Karte (nach dem Blättern),
      // endet er auf ihrem Standbild: Unsichtbar weiterzurechnen kostet
      // nur Kraft.
      filme.current.forEach((id, anderes) => {
        if (anderes === datum) return;
        cancelAnimationFrame(id);
        filme.current.delete(anderes);
        void zeichner.current.get(anderes)?.then((m) => m(Infinity));
      });
      // Kann das Gerät die Kino-Kamera? Zwei Probebilder vor dem Start
      // (das erste Bild der Karte ist schon gezeichnet, die Kamera also
      // eingerichtet). Brauchen sie im Mittel mehr als 40 ms, läuft der
      // Film flach.
      if (male.kino) {
        const probe = performance.now();
        male(0);
        male(1 / 30);
        if ((performance.now() - probe) / 2 > 40) male.kino = false;
      }
      // Die Filmuhr rückt je Bild höchstens 50 ms vor: Hakt ein Bild, läuft
      // der Film kurz langsamer, statt Bilder zu überspringen.
      let t = 0;
      let zuletzt = performance.now();
      // Wird es unterwegs zu langsam (Median der ersten zwölf Bildabstände
      // über 40 ms), läuft der Film flach weiter.
      const takte: number[] = [];
      const bild = (jetzt: number) => {
        const schritt = Math.max(0, jetzt - zuletzt);
        zuletzt = jetzt;
        t += (Math.min(schritt, 50) / 1000) * TEMPO;
        if (male.kino && takte.length < 12) {
          takte.push(schritt);
          if (takte.length === 12) {
            const sortiert = takte.slice(1).sort((a, b) => a - b);
            if (sortiert[Math.floor(sortiert.length / 2)] > 40)
              male.kino = false;
          }
        }
        male(Math.min(t, STORY_DAUER));
        // Am Ende bleibt das letzte Bild stehen: das Standbild.
        if (t < STORY_DAUER)
          filme.current.set(datum, requestAnimationFrame(bild));
        else filme.current.delete(datum);
      };
      filme.current.set(datum, requestAnimationFrame(bild));
    };

    void (async () => {
      const karte = tage[aktiv];
      const male = await bereite(aktiv);
      if (verlassen || !karte || !male) return;
      if (!ruhig && !gespielt.current.has(karte.datum))
        spiele(karte.datum, male);
      await bereite(aktiv + 1);
      if (!verlassen) await bereite(aktiv - 1);
    })();

    return () => {
      verlassen = true;
    };
  }, [aktiv, tage]);

  const gehe = useCallback(
    (i: number, weich = true) => {
      const spur = spurRef.current;
      if (!spur) return;
      const ziel = Math.max(0, Math.min(tage.length - 1, i));
      spur.scrollTo({
        left: ziel * spur.clientWidth,
        behavior: weich ? "smooth" : "auto",
      });
    },
    [tage.length],
  );

  // Wer selbst wischt, tippt oder tastet, übernimmt: kein Weiterlaufen mehr.
  const uebernimmt = useCallback(() => {
    selbstRef.current = true;
  }, []);

  const weiterlaufen = useCallback(() => {
    if (selbstRef.current) return;
    if (aktiv < tage.length - 1) gehe(aktiv + 1);
  }, [aktiv, gehe, tage.length]);

  return (
    <section
      id="spruch"
      aria-label="Spruch des Tages"
      className={r.buehne}
      data-bereit={bereit ? "" : undefined}
    >
      {/* Ohne JavaScript: statt des gemalten Bildes der Text als Karte. */}
      <noscript>
        <style>{`[data-spruch-text]{position:static;display:flex;flex-direction:column;justify-content:center;box-sizing:border-box;width:auto;height:auto;min-height:100%;margin:0;padding:44px 24px 28px;overflow:visible;clip-path:none;white-space:normal}[data-spruch-bild]{display:none}`}</style>
      </noscript>
      {kopf ? <div className={r.titel}>{kopf}</div> : null}
      <div
        className={r.rahmen}
        onPointerDown={uebernimmt}
        onWheel={uebernimmt}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            uebernimmt();
            gehe(aktiv + 1);
          } else if (e.key === "ArrowLeft") {
            uebernimmt();
            gehe(aktiv - 1);
          }
        }}
      >
        <ol
          ref={spurRef}
          className={r.spur}
          onClick={(e) => {
            // Tippen auf die rechte Hälfte blättert weiter, links zurück.
            const f = e.currentTarget.getBoundingClientRect();
            gehe(aktiv + (e.clientX - f.left > f.width / 2 ? 1 : -1));
          }}
          aria-label="Sprüche der letzten sieben Tage, heute zuerst"
          tabIndex={0}
        >
          {tage.map((s, i) => {
            const look = varianteFuer(s.nummer, s.platz).look;
            return (
              <li
                key={s.datum}
                className={r.karte}
                style={
                  {
                    "--k-bg": look.bg,
                    "--k-bg2": look.bg2,
                    "--k-text": look.text,
                    "--k-weich": look.weich,
                    "--k-etikett": look.stickerBg,
                    "--k-etikett-text": look.stickerText,
                  } as CSSProperties
                }
                data-aktiv={i === aktiv ? "" : undefined}
                data-gemalt={gemalt.includes(s.datum) ? "" : undefined}
                aria-label={
                  i === 0
                    ? `Spruch des Tages, ${s.anlass ? `${s.anlass}, ` : ""}${s.datumText}`
                    : `Spruch vom ${s.datumText}${s.anlass ? `, ${s.anlass}` : ""}`
                }
              >
                <div className={r.text} data-spruch-text="">
                  {/* Tagesaktuelle Karten nennen ihren Anlass mit. */}
                  <p className={r.etikett}>
                    {s.anlass ? `${s.kicker} · ${s.anlass}` : s.kicker}
                  </p>
                  <p className={r.spruch}>{s.text}</p>
                  <p className={r.zusatz}>{s.zusatz}</p>
                  <p className={r.absender}>
                    Sitalo Webdesign · Hamburg ·{" "}
                    <time dateTime={s.datum}>{s.datumKurz}</time>
                  </p>
                </div>
                <canvas
                  ref={(el) => {
                    if (el) flaechen.current.set(s.datum, el);
                    else flaechen.current.delete(s.datum);
                  }}
                  className={r.bild}
                  data-spruch-bild=""
                  width={FORMATE.karte.b / 4}
                  height={FORMATE.karte.h / 4}
                  aria-hidden="true"
                />
              </li>
            );
          })}
        </ol>

        {/* Fortschritt: ein Strich je Tag, der aktive füllt sich. */}
        <div className={r.fortschritt} aria-hidden="true">
          {tage.map((s, i) => (
            <span
              key={s.datum}
              className={r.seg}
              data-zustand={
                i < aktiv ? "voll" : i === aktiv ? "laeuft" : "leer"
              }
            >
              <i onAnimationEnd={i === aktiv ? weiterlaufen : undefined} />
            </span>
          ))}
        </div>
        <p className="sr-only" aria-live="polite">
          Karte {aktiv + 1} von {tage.length}
        </p>

        <button
          type="button"
          className={`${r.blaettern} ${r.zurueck}`}
          onClick={() => gehe(aktiv - 1)}
          disabled={aktiv === 0}
          aria-label="Neuerer Spruch"
        >
          ‹
        </button>
        <button
          type="button"
          className={`${r.blaettern} ${r.weiter}`}
          onClick={() => gehe(aktiv + 1)}
          disabled={aktiv === tage.length - 1}
          aria-label="Älterer Spruch"
        >
          ›
        </button>
      </div>
      {fuss ? <div className={r.fuss}>{fuss}</div> : null}
    </section>
  );
}
