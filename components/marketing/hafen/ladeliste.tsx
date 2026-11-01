"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";

import { LADELISTEN, type BranchenLadeliste } from "./ladeliste-data";
import s from "./ladeliste.module.css";
import type { PaketeKurz } from "./paket-kurz";

/**
 * Ladeliste je Branche: links die Auswahl (Tabs), rechts ein Frachtpapier
 * mit Position, Ladung, Stauplatz und Vermerk. Unten das empfohlene Paket
 * mit Preis aus lib/pakete-data.ts (auf dem Server aufgelöst, Prop
 * `pakete`, siehe paket-kurz.ts) und der Knopf ins Anfrageformular, das
 * Branche, Paket und Liste schon ausgefüllt mitbringt.
 *
 * Nur die gewählte Liste steht im Markup (die übrigen Panels sind leer,
 * damit das DOM klein bleibt und die Seite auf dem Handy schneller
 * hydriert); Server und Browser starten mit derselben. Beim Wechsel laufen die
 * Positionen kurz gestaffelt ein und der Stempel setzt neu auf; bei
 * reduzierter Bewegung wechselt die Liste ohne Übergang.
 *
 * Tastatur: Pfeiltasten wechseln die Branche, Pos1/Ende springen an
 * Anfang und Ende der Auswahl.
 */

function anfrageHref(b: BranchenLadeliste, pakete: PaketeKurz) {
  const p = pakete[b.paket];
  const liste = b.positionen.map((pos) => pos.ladung).join("; ");
  const vorhaben = `Website für: ${b.label}. Aus der Ladeliste: ${liste}. Empfohlen war ${p.name}.`;
  const params = new URLSearchParams({ branche: b.inquiry, paket: p.slug, vorhaben: vorhaben.slice(0, 500) });
  return `/anfrage?${params.toString()}`;
}

export function Ladeliste({
  id,
  head,
  pakete,
  className = "",
  style,
}: {
  id?: string;
  head?: ReactNode;
  pakete: PaketeKurz;
  className?: string;
  style?: CSSProperties;
}) {
  const [active, setActive] = useState(0);
  // Erst nach dem ersten Wechsel animieren, nicht beim Laden.
  const [moved, setMoved] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const uid = useId();

  const select = (i: number, focus = false) => {
    const n = LADELISTEN.length;
    const next = (i + n) % n;
    setActive(next);
    setMoved(true);
    if (focus) tabs.current[next]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const keys: Record<string, number> = {
      ArrowDown: active + 1,
      ArrowRight: active + 1,
      ArrowUp: active - 1,
      ArrowLeft: active - 1,
      Home: 0,
      End: LADELISTEN.length - 1,
    };
    if (!(e.key in keys)) return;
    e.preventDefault();
    select(keys[e.key], true);
  };

  return (
    <section id={id} className={`${s.section} grain scroll-mt-20 ${className}`} style={style}>
      <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
        {head}
        <div className="mt-12 grid gap-8 sm:mt-16 lg:grid-cols-12 lg:gap-10">
          <div className={`${s.side} lg:col-span-3`}>
            <p className={s.sideLabel} aria-hidden="true">
              Branche wählen
            </p>
            <div role="tablist" aria-label="Branche wählen" className={s.tabs}>
              {LADELISTEN.map((b, i) => {
                const on = i === active;
                return (
                  <button
                    key={b.key}
                    ref={(el) => {
                      tabs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`${uid}-tab-${b.key}`}
                    aria-selected={on}
                    aria-controls={`${uid}-panel-${b.key}`}
                    tabIndex={on ? 0 : -1}
                    onClick={() => select(i)}
                    onKeyDown={onKeyDown}
                    className={s.tab}
                  >
                    <span className={s.tabCode} aria-hidden="true">
                      {b.code}
                    </span>
                    <span className={s.tabLabel}>{b.tab}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="min-w-0 lg:col-span-9">
            {/* Nur die gewählte Liste trägt Inhalt; die übrigen Panels
                bleiben leer (für aria-controls). Spart rund 650 Knoten im
                DOM und damit Zeit beim Hydrieren auf dem Handy. */}
            {LADELISTEN.map((b, i) =>
              i === active ? (
                <Frachtpapier
                  key={b.key}
                  b={b}
                  pakete={pakete}
                  animate={moved}
                  id={`${uid}-panel-${b.key}`}
                  labelledBy={`${uid}-tab-${b.key}`}
                />
              ) : (
                <div
                  key={b.key}
                  role="tabpanel"
                  id={`${uid}-panel-${b.key}`}
                  aria-labelledby={`${uid}-tab-${b.key}`}
                  hidden
                />
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Frachtpapier({
  b,
  pakete,
  animate,
  id,
  labelledBy,
}: {
  b: BranchenLadeliste;
  pakete: PaketeKurz;
  animate: boolean;
  id: string;
  labelledBy: string;
}) {
  const p = pakete[b.paket];
  const alt = b.alternative ? pakete[b.alternative.paket] : null;

  return (
    <div
      role="tabpanel"
      id={id}
      aria-labelledby={labelledBy}
      tabIndex={0}
      className={`${s.paper} ${animate ? s.animate : ""}`}
    >
      <div className={s.head}>
        <div className="min-w-0">
          <p className={s.kicker}>Ladeliste · Website</p>
          <h3 className={s.title}>{b.label}</h3>
        </div>
        <div className={s.stamp} aria-hidden="true">
          <span>Sitalo</span>
          <strong>{b.code}</strong>
          <span>Hamburg</span>
        </div>
      </div>

      <dl className={s.fields}>
        <div>
          <dt>Ladehafen</dt>
          <dd>Hamburg</dd>
        </div>
        <div>
          <dt>Positionen</dt>
          <dd>{b.positionen.length}, nach Wichtigkeit</dd>
        </div>
        <div className={s.fieldWide}>
          <dt>Gelesen von</dt>
          <dd>{b.leser.join(" · ")}</dd>
        </div>
      </dl>

      <div className={s.colhead} aria-hidden="true">
        <span>Pos.</span>
        <span>Ladung · Stauplatz</span>
        <span>Vermerk</span>
      </div>
      <ol className={s.rows}>
        {b.positionen.map((pos, i) => (
          <li key={pos.ladung} className={s.row} style={{ "--i": i } as React.CSSProperties}>
            <span className={s.pos} aria-hidden="true">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <p className={s.ladung}>{pos.ladung}</p>
              <p className={s.stau}>
                <span className="sr-only">Stauplatz: </span>
                {pos.stauplatz}
              </p>
            </div>
            <p className={s.vermerk}>
              <span className="sr-only">Vermerk: </span>
              {pos.vermerk}
            </p>
          </li>
        ))}
      </ol>

      <div className={s.foot}>
        <div className="min-w-0">
          <p className={s.footLabel}>Empfohlenes Paket</p>
          <p className={s.paketName}>
            {p.name}
            <span className={s.paketPreis}>
              {p.setup} · {p.monthly}
            </span>
          </p>
          <p className={s.paketGrund}>{b.paketGrund}</p>
          {b.alternative && alt ? (
            <p className={s.alt}>{b.alternative.text.replace("{paket}", `${alt.name} ${alt.setup}`)}</p>
          ) : null}
        </div>
        <div className={s.cta}>
          <Link href={anfrageHref(b, pakete)} className="btn-signal">
            Anfrage mit dieser Ladeliste
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <p className={s.ctaNote}>Branche, Paket und Liste stehen dann schon im Formular.</p>
        </div>
      </div>
    </div>
  );
}
