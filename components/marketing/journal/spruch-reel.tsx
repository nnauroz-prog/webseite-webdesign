"use client";

import { PenLine, Phone, Share2 } from "lucide-react";
import Link from "next/link";
import {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { spruecheBis, tagInHamburg, type SpruchTag } from "@/lib/sprueche-data";

import r from "./spruch-reel.module.css";

/**
 * Spruch des Tages als hochkant laufende Karte: oben der Fortschritt der
 * letzten sieben Tage, in der Mitte der Satz (Wort für Wort), unten der
 * Absender, rechts drei Knöpfe (Teilen, Anfrage, Anruf).
 *
 * - Heute steht vorn. Nach rechts wischen (oder Pfeile, Pfeiltasten)
 *   zeigt die Tage davor.
 * - Die aktive Karte „läuft“ neun Sekunden, dann rückt die nächste nach,
 *   bis jemand selbst wischt, tippt oder eine Taste drückt.
 * - Ohne JavaScript und bei reduzierter Bewegung stehen alle Karten
 *   einfach da und lassen sich wischen.
 */
export function SpruchReel({
  tage: vomServer,
  themen,
  kopf,
  fuss,
}: {
  tage: SpruchTag[];
  /** Beschriftung je Thema, vom Server (lib/sprueche-data.ts). */
  themen: Record<string, string>;
  /** Kennzeile und Seitentitel über der Karte */
  kopf?: ReactNode;
  /** kurzer Hinweis unter der Karte */
  fuss?: ReactNode;
}) {
  const spurRef = useRef<HTMLOListElement | null>(null);
  const selbstRef = useRef(false);
  const [aktiv, setAktiv] = useState(0);
  const [bereit, setBereit] = useState(false);
  const [hinweis, setHinweis] = useState<string | null>(null);
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

  const teilen = useCallback(async () => {
    uebernimmt();
    const s = tage[aktiv];
    const text = [s.text, s.zusatz].filter(Boolean).join(" ");
    const url = `${window.location.origin}/journal`;
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Spruch des Tages · Sitalo Webdesign",
          text,
          url,
        });
        return;
      }
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setHinweis("Kopiert");
    } catch {
      // Abgebrochen oder nicht erlaubt: nichts tun.
      return;
    }
    window.setTimeout(() => setHinweis(null), 1800);
  }, [aktiv, tage, uebernimmt]);

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
          {tage.map((s, i) => (
            <li
              key={s.datum}
              className={r.karte}
              data-thema={s.thema}
              data-aktiv={i === aktiv ? "" : undefined}
              aria-label={
                i === 0
                  ? `Spruch des Tages, ${s.datumText}`
                  : `Spruch vom ${s.datumText}`
              }
            >
              <div className={r.szene} aria-hidden="true">
                <span className={r.licht} />
                <span className={`${r.licht} ${r.licht2}`} />
                <span className={r.ziffer}>{s.tagImMonat}</span>
                <svg
                  className={r.welle}
                  viewBox="0 0 800 60"
                  preserveAspectRatio="none"
                  focusable="false"
                >
                  <path d="M0 30C50 12 100 12 150 30S250 48 300 30 400 12 450 30 550 48 600 30 700 12 750 30 800 40 800 40V60H0Z" />
                </svg>
                <svg
                  className={`${r.welle} ${r.welle2}`}
                  viewBox="0 0 800 60"
                  preserveAspectRatio="none"
                  focusable="false"
                >
                  <path d="M0 34C40 20 80 20 120 34S200 48 240 34 320 20 360 34 440 48 480 34 560 20 600 34 680 48 720 34 800 26 800 26V60H0Z" />
                </svg>
                <span className={r.fahrt}>
                  <svg
                    viewBox="0 0 46 28"
                    width="46"
                    height="28"
                    focusable="false"
                  >
                    <path d="M0 18h46l-5 7H5Z" fill="#fff" />
                    <rect x="0" y="17" width="46" height="2.2" fill="#f45b1e" />
                    <path d="M6 17v-7h30l4 7Z" fill="#fff" fillOpacity=".86" />
                    <path d="M10 6h20v4H10Z" fill="#fff" fillOpacity=".86" />
                    <rect x="22" y="0" width="3" height="6" fill="#f45b1e" />
                  </svg>
                </span>
              </div>
              <div className={r.inhalt}>
                <p className={r.kopf} data-heute={i === 0 ? "" : undefined}>
                  <span className={r.punkt} aria-hidden="true" />
                  {i === 0 ? "Spruch des Tages" : "Spruch vom"}{" "}
                  <time dateTime={s.datum}>{s.datumText}</time>
                </p>
                <p
                  className={r.spruch}
                  data-eng={
                    s.text.split(" ").some((w) => w.length > 12)
                      ? ""
                      : undefined
                  }
                >
                  {/* Leerzeichen außerhalb der Wort-Maske, sonst kleben die Wörter. */}
                  {s.text.split(" ").map((w, n) => (
                    <Fragment key={n}>
                      <span className={r.wort}>
                        <span style={{ "--w": n } as CSSProperties}>{w}</span>
                      </span>{" "}
                    </Fragment>
                  ))}
                </p>
                {s.zusatz ? <p className={r.zusatz}>{s.zusatz}</p> : null}
                <p className={r.absender}>
                  <span className={r.siegel} aria-hidden="true">
                    <svg viewBox="0 0 30 22" focusable="false">
                      <g fill="none" stroke="currentColor" strokeWidth="2">
                        <ellipse cx="12" cy="11" rx="10" ry="10" />
                        <ellipse cx="18" cy="11" rx="10" ry="10" />
                      </g>
                    </svg>
                  </span>
                  <span>
                    <span className={r.name}>Sitalo Webdesign</span>
                    <span className={r.thema}>
                      Hamburg · {themen[s.thema] ?? s.thema}
                    </span>
                  </span>
                </p>
              </div>
            </li>
          ))}
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
        <p className={r.zaehler} aria-live="polite">
          <span className="sr-only">Karte </span>
          {aktiv + 1}/{tage.length}
        </p>

        {/* Knöpfe am rechten Rand, gelten für die Karte im Bild. */}
        <ul className={r.leiste} role="list">
          <li>
            <button type="button" onClick={teilen} className={r.knopf}>
              <Share2 aria-hidden="true" />
              <span>{hinweis ?? "Teilen"}</span>
            </button>
          </li>
          <li>
            <Link href="/anfrage" className={r.knopf}>
              <PenLine aria-hidden="true" />
              <span>Anfrage</span>
            </Link>
          </li>
          <li>
            <a
              href="tel:+491607621876"
              className={r.knopf}
              aria-label="Anrufen: 0160 7621876"
            >
              <Phone aria-hidden="true" />
              <span>Anrufen</span>
            </a>
          </li>
        </ul>

        <button
          type="button"
          className={`${r.pfeil} ${r.pfeilZurueck}`}
          onClick={() => gehe(aktiv - 1)}
          disabled={aktiv === 0}
          aria-label="Neuerer Spruch"
        >
          ‹
        </button>
        <button
          type="button"
          className={`${r.pfeil} ${r.pfeilWeiter}`}
          onClick={() => gehe(aktiv + 1)}
          disabled={aktiv === tage.length - 1}
          aria-label="Älterer Spruch"
        >
          ›
        </button>
      </div>
      {fuss ? <p className={`notiz-mono ${r.fuss}`}>{fuss}</p> : null}
    </section>
  );
}
