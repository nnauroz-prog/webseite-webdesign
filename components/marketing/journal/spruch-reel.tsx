"use client";

import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import {
  spruecheBis,
  tagInHamburg,
  type Spruch,
  type SpruchTag,
} from "@/lib/sprueche-data";
import { lookVariablen } from "@/lib/story-look";
import { kursivBreite, satzPlan, type SatzPlan } from "@/lib/story-satz";
import {
  MOTIV_EINHEIT,
  MOTIV_HOEHE,
  MOTIV_WASSER,
  SCHMUCK_B,
  SCHMUCK_H,
  type TeilFarbe,
} from "@/lib/story-teile";
import { varianteFuer } from "@/lib/story-variante";

import r from "./spruch-reel.module.css";

/**
 * Spruch des Tages als Story-Karte: oben der Fortschritt der letzten
 * sieben Tage, große Tageszahl, ein Aufkleber mit dem Kicker, der Satz
 * mit der Pointe groß und kursiv auf einem Farbbalken, der Zusatz mit
 * Pfeil, der Absender und unten der Hafen mit der Fähre.
 *
 * - Heute steht vorn. Wischen, Tippen (rechts weiter, links zurück),
 *   die Pfeile daneben oder die Pfeiltasten zeigen die Tage davor.
 * - Die aktive Karte „läuft“ neun Sekunden, dann rückt die nächste nach,
 *   bis jemand selbst wischt, tippt oder eine Taste drückt.
 * - Jeden Tag ein anderes Bild: Farbwelt, Hafen-Motiv, Schmuck, Muster
 *   und Lage des Textes wechseln (lib/story-variante.ts). Dieselbe Karte
 *   gibt es als fertiges Bild und Kurzvideo im Admin (/admin/story);
 *   nur dort sitzen Teilen und Sichern.
 * - Ohne JavaScript und bei reduzierter Bewegung stehen alle Karten
 *   einfach da und lassen sich wischen.
 */

/** Schriftgrößen des Satzes, in Hundertstel der Kartenbreite (cqw). */
const STUFEN = [13.2, 12, 11, 10.2, 9.4, 8.6, 7.8, 7, 6.4];
/** Breite des Textfelds in cqw. */
const FELD = 87.6;
/** Platz für Satz und Zusatz bei der gedrungensten Karte (kleines Handy). */
const TEXT_HOEHE = 65;
/** mittlere Zeichenbreite der fetten Grotesk, in em (mit Sperrung). */
const GROTESK_EM = 0.56;

type Masse = { g: number; p: number };

/**
 * Größen für Satz (g) und Pointe (p), sodass jedes Wort in die Zeile
 * passt und Satz samt Zusatz in die Karte. Die Pointe soll das größte
 * Element sein, darf aber schrumpfen, bevor der Satz davor winzig wird.
 * Geschätzt über Zeichenbreiten, damit Server und Browser dasselbe
 * rechnen; geprüft für alle Karten in vier Breiten.
 */
function masse(plan: SatzPlan, s: Spruch): Masse {
  const zusatzZeilen = Math.ceil(s.zusatz.length / 31);
  const platz = TEXT_HOEHE - zusatzZeilen * 6.1;
  const zeilen = (breite: number) => Math.max(1, Math.ceil(breite / FELD));
  let beste: Masse | null = null;
  let guete = -1;
  for (const g of STUFEN) {
    if (plan.art === "fluss") {
      const p = g * 1.25;
      let hoehe = 0;
      let passt = true;
      for (const gruppe of plan.gruppen) {
        let breite = 0;
        for (const w of gruppe) {
          const b = w.betont
            ? (kursivBreite(w.t) + 0.3) * p
            : w.t.length * GROTESK_EM * g;
          if (b > FELD - 2) passt = false;
          breite += b + 0.24 * g;
        }
        hoehe += zeilen(breite * 1.1) * g * 1.12;
      }
      // Die erste Stufe, die passt, ist die größte.
      if (passt && hoehe <= platz) return { g, p: Math.round(p * 10) / 10 };
      continue;
    }
    let hoehe = 0;
    let passt = true;
    for (const gruppe of plan.vor) {
      if (gruppe.some((w) => w.length * 0.6 * g > FELD)) passt = false;
      hoehe +=
        zeilen(gruppe.join(" ").length * GROTESK_EM * g * 1.08) * g * 1.06;
    }
    const weiteste = Math.max(...plan.pointe.map(kursivBreite));
    const p = Math.min(
      g * 2.1,
      27,
      (FELD - 3) / (weiteste + 0.3),
      (platz - hoehe) / (plan.pointe.length * 1.1 + 0.3),
    );
    if (!passt || p < g * 1.2) continue;
    // Groß ist gut, eine deutlich größere Pointe ist besser.
    const wert = g + Math.min(p, g * 2);
    if (wert > guete) {
      guete = wert;
      beste = { g, p: Math.round(p * 10) / 10 };
    }
  }
  const klein = STUFEN[STUFEN.length - 1];
  return beste ?? { g: klein, p: klein * 1.25 };
}

/** Farben der Motiv-Teile als Variablen der Karte. */
const TEIL_FARBE: Record<TeilFarbe, string> = {
  faehre: "var(--k-faehre)",
  streif: "var(--k-streif)",
  grund: "var(--k-bg)",
};
/** So tief taucht ein Motiv in die Hafenfläche ein (cqw). */
const MOTIV_TIEF = (MOTIV_HOEHE - MOTIV_WASSER) * MOTIV_EINHEIT - 0.5;

function Stern() {
  return (
    <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
      <path d="M12 0q2.4 9.6 12 12-9.6 2.4-12 12Q9.6 14.4 0 12 9.6 9.6 12 0Z" />
    </svg>
  );
}

/** Ein Wort in seiner Maske; n zählt für die Staffelung des Auftritts. */
function Wort({ t, n, betont }: { t: string; n: number; betont?: boolean }) {
  return (
    <>
      <span
        className={betont ? `${r.wort} ${r.betont}` : r.wort}
        style={{ "--w": n } as CSSProperties}
      >
        <span>{t}</span>
      </span>{" "}
    </>
  );
}

function Satz({ plan, m }: { plan: SatzPlan; m: Masse }) {
  let n = 0;
  const stil = { "--g": m.g, "--p": m.p } as CSSProperties;
  if (plan.art === "fluss") {
    return (
      <p className={r.spruch} style={stil}>
        {plan.gruppen.map((gruppe, i) => (
          <Fragment key={i}>
            {i > 0 ? <br /> : null}
            {gruppe.map((w) => (
              <Wort key={n} t={w.t} n={n++} betont={w.betont} />
            ))}
          </Fragment>
        ))}
      </p>
    );
  }
  return (
    <p className={r.spruch} style={stil}>
      {plan.vor.map((gruppe, i) => (
        <Fragment key={i}>
          {i > 0 ? <br /> : null}
          {gruppe.map((w) => (
            <Wort key={n} t={w} n={n++} />
          ))}
        </Fragment>
      ))}
      <span className={r.pointe} style={{ "--w": n } as CSSProperties}>
        {plan.pointe.map((z, i) => (
          <span
            key={i}
            className={r.pzeile}
            style={{ "--z": i } as CSSProperties}
          >
            <span>{z}</span>
          </span>
        ))}
      </span>
    </p>
  );
}

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
  const selbstRef = useRef(false);
  const [aktiv, setAktiv] = useState(0);
  const [bereit, setBereit] = useState(false);
  const [tage, setTage] = useState(vomServer);

  // Die Seite kommt aus dem Zwischenspeicher und kann vom Vortag sein.
  // Dann rechnet der Browser die Woche selbst aus: heute zählt.
  useEffect(() => {
    const jetzt = new Date();
    if (vomServer[0]?.datum !== tagInHamburg(jetzt))
      setTage(spruecheBis(jetzt, vomServer.length));
  }, [vomServer]);

  // Welche Karte steht im Bild? Erst dann beginnt ihr Text zu laufen.
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
  }, []);

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
            const v = varianteFuer(s.nummer);
            const plan = satzPlan(s);
            return (
              <li
                key={s.datum}
                className={r.karte}
                style={
                  {
                    ...lookVariablen(v.look),
                    "--dreh": `${v.dreh}deg`,
                    "--mb": v.motiv.b * MOTIV_EINHEIT,
                    "--mt": MOTIV_TIEF,
                  } as CSSProperties
                }
                data-look={v.look.name}
                data-grund={v.grund}
                data-anker={v.anker}
                data-aufkleber={v.aufkleber}
                data-balken={v.balken}
                data-aktiv={i === aktiv ? "" : undefined}
                aria-label={
                  i === 0
                    ? `Spruch des Tages, ${s.datumText}`
                    : `Spruch vom ${s.datumText}`
                }
              >
                <div className={r.szene} aria-hidden="true">
                  <span className={r.muster} />
                  <span className={r.licht} />
                  {v.schmuck.art === "schrift" ? (
                    <span
                      className={
                        v.schmuck.name === "zitat"
                          ? `${r.ziffer} ${r.zitat}`
                          : r.ziffer
                      }
                    >
                      {v.schmuck.name === "zitat" ? "“" : s.tagImMonat}
                    </span>
                  ) : (
                    <svg
                      className={r.form}
                      viewBox={`0 0 ${SCHMUCK_B} ${SCHMUCK_H}`}
                      focusable="false"
                    >
                      {v.schmuck.teile.map((teil, n) =>
                        teil.strich ? (
                          <path
                            key={n}
                            d={teil.d}
                            fill="none"
                            stroke="var(--k-ziffer)"
                            strokeWidth={teil.strich}
                          />
                        ) : (
                          <path key={n} d={teil.d} fill="var(--k-ziffer)" />
                        ),
                      )}
                    </svg>
                  )}
                  <div className={r.hafen}>
                    <svg
                      className={r.kante}
                      viewBox="0 0 720 24"
                      preserveAspectRatio="none"
                      focusable="false"
                    >
                      <path d="M0 12Q45 2 90 12T180 12 270 12 360 12 450 12 540 12 630 12 720 12V24H0Z" />
                    </svg>
                    <svg
                      className={r.linie}
                      viewBox="0 0 720 12"
                      preserveAspectRatio="none"
                      focusable="false"
                    >
                      <path
                        d="M0 6Q45 0 90 6T180 6 270 6 360 6 450 6 540 6 630 6 720 6"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                    <span
                      className={r.fahrt}
                      data-faehrt={v.motiv.faehrt ? "" : undefined}
                    >
                      <svg
                        viewBox={`0 0 ${v.motiv.b} ${MOTIV_HOEHE}`}
                        focusable="false"
                      >
                        {v.motiv.teile.map((teil, n) => (
                          <path
                            key={n}
                            d={teil.d}
                            fill={TEIL_FARBE[teil.farbe]}
                            fillOpacity={teil.deck}
                          />
                        ))}
                      </svg>
                    </span>
                  </div>
                </div>
                <div className={r.inhalt}>
                  <p className={r.kennzeile}>
                    Spruch des Tages ·{" "}
                    <time dateTime={s.datum}>{s.datumKurz}</time>
                  </p>
                  <div className={r.mitte}>
                    <p className={r.kicker}>
                      <Stern />
                      {s.kicker}
                      <svg
                        className={r.strahlen}
                        viewBox="0 0 30 30"
                        focusable="false"
                        aria-hidden="true"
                      >
                        <path d="M6 20 3 9M13 16 18 4M19 21 29 16" />
                      </svg>
                    </p>
                    <Satz plan={plan} m={masse(plan, s)} />
                    <p className={r.zusatz}>
                      <svg
                        className={r.pfeil}
                        viewBox="0 0 60 56"
                        aria-hidden="true"
                        focusable="false"
                      >
                        <path
                          pathLength="1"
                          d="M6 4C2 34 14 44 52 40M36 24l18 16-20 14"
                        />
                      </svg>
                      <span>{s.zusatz}</span>
                    </p>
                  </div>
                  <p className={r.absender}>
                    <span className={r.siegel} aria-hidden="true">
                      <svg viewBox="0 0 30 22" focusable="false">
                        <g fill="none" stroke="currentColor" strokeWidth="2">
                          <ellipse cx="12" cy="11" rx="10" ry="10" />
                          <ellipse cx="18" cy="11" rx="10" ry="10" />
                        </g>
                      </svg>
                    </span>
                    <span className={r.wer}>
                      <span className={r.name}>Sitalo Webdesign</span>
                      <span className={r.ort}>Hamburg · sitalo.de</span>
                    </span>
                  </p>
                </div>
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
