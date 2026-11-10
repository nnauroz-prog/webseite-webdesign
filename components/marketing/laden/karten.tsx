import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

import s from "./laden.module.css";

/**
 * Karten der Regale. Die ganze Karte ist ein Link (Titel-Link mit
 * .karte-link, dessen ::after über die Karte gestreckt ist, app/apple.css).
 * Text oben (Eyebrow, Titel, höchstens eine Zeile, Preis oder Link), der
 * Rest der Karte ist ein großes Bild (Inline-SVG, aria-hidden).
 */

function KartenLink({ href, children }: { href: string; children: ReactNode }) {
  if (/^(#|tel:|mailto:)/.test(href)) {
    return (
      <a href={href} className="karte-link">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className="karte-link">
      {children}
    </Link>
  );
}

type Ton = "weiss" | "schwarz" | "getoent";

function tonKlasse(ton: Ton) {
  return ton === "schwarz"
    ? s.schwarz
    : ton === "getoent"
      ? s.getoent
      : undefined;
}

/** Hochkant-Karte (400 × 500): Text oben, Bild unten (61 %). */
export function KarteGross({
  ton = "weiss",
  hintergrund,
  bildHintergrund,
  eyebrow,
  titel,
  zeile,
  preis,
  monat,
  mehr,
  href,
  bild,
  dunkel,
  bildBeschrieben = false,
  id,
}: {
  /** Sprungziel auf der Karte (z. B. /pakete#business) */
  id?: string;
  ton?: Ton;
  /** Kartenfläche (z. B. Tönung der Musterseite) */
  hintergrund?: string;
  /** Hintergrund der Bildzone (CSS, z. B. ein Verlauf) */
  bildHintergrund?: string;
  eyebrow: string;
  titel: string;
  zeile?: string;
  preis?: string;
  monat?: string;
  /** sichtbarer Link-Text am Ende, z. B. „Was auf Ihre Seite gehört“ */
  mehr?: string;
  href: string;
  bild: ReactNode;
  /** Kartenfläche dunkel (für die Produktleiste) */
  dunkel?: boolean;
  /** Bild trägt einen eigenen Alt-Text (Foto): Bildzone nicht aria-hidden */
  bildBeschrieben?: boolean;
}) {
  return (
    <li id={id} className={id ? "scroll-mt-28" : undefined}>
      <article data-kipp=""
        className={cn(s.karte, s.gross_, tonKlasse(ton))}
        style={hintergrund ? { background: hintergrund } : undefined}
        data-flaeche-dunkel={dunkel ? "" : undefined}
      >
        <div className={s.text}>
          <p className={s.eyebrow}>{eyebrow}</p>
          <h3 className={s.titelGross}>
            <KartenLink href={href}>{titel}</KartenLink>
          </h3>
          {zeile ? <p className={s.zeile}>{zeile}</p> : null}
          {preis ? (
            <p className={s.preis}>
              <b data-zaehl="">{preis}</b>
              {monat ? <span> · {monat}</span> : null}
            </p>
          ) : null}
          {mehr ? (
            <p className={s.mehr}>
              {mehr}
              <span aria-hidden="true"> ›</span>
            </p>
          ) : null}
        </div>
        <div
          className={s.bild}
          style={bildHintergrund ? { background: bildHintergrund } : undefined}
          aria-hidden={bildBeschrieben ? undefined : "true"}
        >
          {bild}
        </div>
      </article>
    </li>
  );
}

/** Mittlere Karte (320 × 420): Text oben, Bild unten 220 hoch; oder Bild oben (Journal). */
export function KarteMittel({
  eyebrow,
  titel,
  zeile,
  href,
  bild,
  bildOben = false,
  kurz = false,
  bildHintergrund,
  eyebrowUnten = false,
}: {
  eyebrow: ReactNode;
  titel: string;
  zeile?: string;
  href: string;
  bild: ReactNode;
  bildOben?: boolean;
  /** kürzere Karte (Journal: Bild oben füllt rund 60 %) */
  kurz?: boolean;
  bildHintergrund?: string;
  /** Eyebrow als Mono-Fußzeile am Kartenende (Journal: Datum, Lesezeit) */
  eyebrowUnten?: boolean;
}) {
  const bildEl = (
    <div
      className={bildOben ? s.bildOben : s.bild}
      style={bildHintergrund ? { background: bildHintergrund } : undefined}
      aria-hidden="true"
    >
      {bild}
    </div>
  );
  return (
    <li>
      <article data-kipp="" className={cn(s.karte, s.mittel, kurz && s.mittelKurz)}>
        {bildOben ? bildEl : null}
        <div className={cn(s.text, eyebrowUnten && s.textFuss)}>
          {eyebrowUnten ? null : <p className={s.eyebrow}>{eyebrow}</p>}
          <h3 className={s.titelMittel}>
            <KartenLink href={href}>{titel}</KartenLink>
          </h3>
          {zeile ? <p className={s.zeile}>{zeile}</p> : null}
          {eyebrowUnten ? <p className={cn("notiz-mono", s.fusszeile)}>{eyebrow}</p> : null}
        </div>
        {bildOben ? null : bildEl}
      </article>
    </li>
  );
}

/**
 * Kleine Karte (300 × 176 / 264 × 160): Linienzeichnung (40 px) und
 * Titel in einer Zeile, darunter der Satz in Grau.
 */
export function KarteKlein({
  symbol,
  fett,
  grau,
  href,
}: {
  symbol: ReactNode;
  fett: string;
  grau: string;
  href: string;
}) {
  return (
    <li>
      <article data-kipp="" className={cn(s.karte, s.klein)}>
        <div className={s.kleinKopf}>
          <span className={s.symbol} aria-hidden="true">
            {symbol}
          </span>
          <h3 className={s.kleinTitel}>
            <KartenLink href={href}>{fett.replace(/\.$/, "")}</KartenLink>
          </h3>
        </div>
        <p className={s.kleinSatz}>{grau}</p>
      </article>
    </li>
  );
}

/** Kleine Karte mit randlosem Bildband oben (Der Weg). Kein Link. */
export function KarteWeg({
  band,
  eyebrow,
  fett,
  grau,
}: {
  band: ReactNode;
  eyebrow: string;
  fett: string;
  grau: string;
}) {
  return (
    <li>
      <article data-kipp="" className={cn(s.karte, s.klein, s.weg)}>
        <span className={s.band} aria-hidden="true">
          {band}
        </span>
        <div className={s.wegText}>
          <p className={s.eyebrow}>{eyebrow}</p>
          <h3 className={s.satz}>
            {fett} <span>{grau}</span>
          </h3>
        </div>
      </article>
    </li>
  );
}

/** Endkarte mit Bild (gleich hoch wie große Karten). */
export function KarteEndeBild({
  eyebrow,
  titel,
  zeile,
  href,
  bild,
  bildHintergrund,
}: {
  eyebrow: string;
  titel: string;
  zeile: string;
  href: string;
  bild: ReactNode;
  bildHintergrund?: string;
}) {
  return (
    <li>
      <article data-kipp="" className={cn(s.karte, s.ende, s.endeMitBild)}>
        <div className={s.text}>
          <p className={s.eyebrow}>{eyebrow}</p>
          <h3 className={s.titelGross}>
            <KartenLink href={href}>{titel}</KartenLink>
          </h3>
          <p className={s.zeile}>{zeile}</p>
        </div>
        <div
          className={s.bild}
          style={bildHintergrund ? { background: bildHintergrund } : undefined}
          aria-hidden="true"
        >
          {bild}
        </div>
      </article>
    </li>
  );
}

/**
 * Bild als statische SVG-Datei (public/laden, erzeugt mit
 * `npm run bilder:laden` aus denselben Komponenten): für Regale unterhalb
 * der ersten Ansicht, lädt erst kurz vor dem Sichtbarwerden.
 * position wie preserveAspectRatio: „50% 100%“ = unten bündig.
 */
export function LadenBild({
  name,
  w,
  h,
  position = "50% 100%",
}: {
  name: string;
  w: number;
  h: number;
  position?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- SVG-Zeichnung, kein Foto: next/image brächte nichts
    <img
      src={`/laden/${name}.svg`}
      alt=""
      width={w}
      height={h}
      loading="lazy"
      decoding="async"
      className={s.bildDatei}
      style={position === "50% 100%" ? undefined : { objectPosition: position }}
    />
  );
}

/**
 * Foto in der Bildzone einer Karte (next/image, füllt die Zone, deren
 * Höhe im CSS fest steht: kein Springen). Immer lazy; sizes nach der
 * Kartenbreite (400 / 360 / bis 320 px).
 */
export function LadenFoto({
  src,
  alt,
  position = "50% 50%",
  sizes = "(min-width: 1068px) 400px, (min-width: 734px) 360px, 320px",
}: {
  src: string;
  /** Beschreibung des Fotos; die Bildzone ist dann nicht aria-hidden (bildAlt an der Karte). */
  alt: string;
  position?: string;
  sizes?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      className={s.foto}
      style={{ objectPosition: position }}
    />
  );
}

export const kartenStil = s;
