import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";

import { Briefkarte } from "@/components/marketing/hafen/briefkarte";
import { RevealRoot } from "@/components/marketing/hafen/reveal";
import { Steigend } from "@/components/marketing/hafen/steigend";
import { cn } from "@/lib/utils";

import s from "./laden.module.css";
import u from "./unterseite.module.css";

/**
 * Bausteine der Unterseiten im Atelier-Satz: Papierfläche #f3f2ee,
 * linksbündiger Seitenkopf mit Mono-Brotkrumen, Abschnittsköpfe als
 * ganze Sätze, Bildkacheln und die Briefkarte als Abschluss. Fotos aus public/images immer
 * mit next/image, festem Seitenverhältnis (CLS 0) und passenden sizes.
 * Nur das Kopfbild lädt vorab (preload), alle anderen lazy.
 *
 * Gerätefotos zeigen frei erfundene Betriebe: Sie tragen immer die
 * Pille „Musterseite, frei erfunden“ (muster).
 */

export const unterseiteStil = u;

/** Kopfbild-Größen: 980 px im Raster, sonst Fensterbreite minus Rinne. */
export const SIZES_KOPF = "(min-width: 1068px) 980px, calc(100vw - 32px)";
/**
 * Kopfbild mit Vorabladen (LCP): am Handy bewusst kleiner angefragt,
 * damit bei 2,6-facher Pixeldichte höchstens die 750er-Variante lädt.
 */
export const SIZES_KOPF_VORAB = "(min-width: 1068px) 980px, (min-width: 734px) calc(100vw - 32px), 70vw";
export const SIZES_HALB = "(min-width: 1068px) 480px, (min-width: 640px) 50vw, calc(100vw - 32px)";
export const SIZES_DRITTEL = "(min-width: 1068px) 320px, (min-width: 640px) 50vw, calc(100vw - 32px)";

export function MusterPille({ text = "Musterseite, frei erfunden" }: { text?: string }) {
  return <span className={u.pille}>{text}</span>;
}

/**
 * Foto in festem Rahmen. aspect z. B. "3 / 2", aspectMobil für unter
 * 734 px. vorab nur für das Kopfbild (LCP).
 */
export function FotoRahmen({
  src,
  alt,
  aspect = "3 / 2",
  aspectMobil,
  position,
  sizes,
  vorab = false,
  muster = false,
  satz,
  className,
}: {
  src: string;
  alt: string;
  aspect?: string;
  aspectMobil?: string;
  position?: string;
  sizes?: string;
  vorab?: boolean;
  muster?: boolean;
  /** Satz in Weiß auf Verlauf, unten links im Bild */
  satz?: ReactNode;
  className?: string;
}) {
  const style = { "--a": aspect, ...(aspectMobil ? { "--a-m": aspectMobil } : {}) } as CSSProperties;
  return (
    <div className={cn(u.rahmen, className)} style={style}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes ?? (vorab ? SIZES_KOPF_VORAB : SIZES_KOPF)}
        quality={vorab ? 60 : undefined}
        preload={vorab}
        loading={vorab ? "eager" : "lazy"}
        fetchPriority={vorab ? "high" : undefined}
        className={u.foto}
        style={position ? { objectPosition: position } : undefined}
      />
      {satz ? <p className={u.bildSatz}>{satz}</p> : null}
      {muster ? (
        <span className={satz ? u.pilleOben : undefined}>
          <MusterPille />
        </span>
      ) : null}
    </div>
  );
}

/** Brotkrumen: Start › … › Seite, in Mono. Letzter Eintrag ohne Link. */
export type Krume = { href?: string; label: string };

export function Brotkrumen({ krumen, className }: { krumen: Krume[] | string; className?: string }) {
  const liste: Krume[] = typeof krumen === "string" ? [{ label: krumen }] : krumen;
  return (
    <nav aria-label="Brotkrumen" className={cn(u.krumen, className)}>
      <ol>
        <li>
          <Link href="/">Start</Link>
        </li>
        {liste.map((k, i) => (
          <li key={`${k.label}-${i}`}>
            <span aria-hidden="true">›</span>
            {k.href && i < liste.length - 1 ? (
              <Link href={k.href}>{k.label}</Link>
            ) : (
              <span aria-current={i === liste.length - 1 ? "page" : undefined}>{k.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/**
 * Seitenkopf der Unterseiten im Atelier-Satz: linksbündig auf der
 * Satzkante, Mono-Brotkrumen, Eyebrow in Mono mit orangem Quadrat,
 * zweifarbige H1 (akzent in Stahl), ein Satz, höchstens ein Knopf.
 * Darunter optional das Kopffoto mit einer Mono-Bildunterschrift.
 */
export function SeitenKopf({
  krumen,
  eyebrow,
  titel,
  akzent,
  unter,
  aktionen,
  meta,
  bild,
  unterschrift,
  neben,
  className,
}: {
  krumen?: Krume[] | string;
  eyebrow?: ReactNode;
  titel: ReactNode;
  /** zweiter, gedämpfter Teil der H1 */
  akzent?: ReactNode;
  unter?: ReactNode;
  aktionen?: ReactNode;
  meta?: ReactNode;
  bild?: ReactNode;
  /** Mono-Bildunterschrift unter dem Foto */
  unterschrift?: ReactNode;
  /** rechte Spalte neben dem Text (ab 1024 px), z. B. ein Frachtbrief */
  neben?: ReactNode;
  className?: string;
}) {
  const text = (
    <div className={u.kopfText}>
      {eyebrow ? <p className={u.eyebrow}>{eyebrow}</p> : null}
      <h1 className={u.titel}>
        {titel}
        {akzent ? (
          <>
            {" "}
            <span className={u.akzent}>{akzent}</span>
          </>
        ) : null}
      </h1>
      {unter ? <p className={u.unter}>{unter}</p> : null}
      {aktionen ? <div className={u.aktionen}>{aktionen}</div> : null}
      {meta ? <div className={u.meta}>{meta}</div> : null}
    </div>
  );
  return (
    <section className={cn(u.kopf, !bild && u.kopfOhneBild, className)}>
      <div className="inhalt">
        {krumen ? <Brotkrumen krumen={krumen} /> : null}
        {neben ? (
          <div className={u.kopfZweispaltig}>
            {text}
            <div className={u.kopfNeben}>{neben}</div>
          </div>
        ) : (
          text
        )}
        {bild ? (
          <figure className={u.kopfBild}>
            {bild}
            {unterschrift ? <figcaption className={u.unterschrift}>{unterschrift}</figcaption> : null}
          </figure>
        ) : unterschrift ? (
          <p className={u.unterschrift}>{unterschrift}</p>
        ) : null}
      </div>
    </section>
  );
}

/**
 * Abschnitt mit ruhigem Kopf: optional ein Hafenwort in Mono mit orangem
 * Quadrat (eyebrow), darüber die H2 als ganzer Satz. Die Wörter steigen
 * beim Einscrollen aus einer Maske (RevealRoot in UnterseiteMain); bei
 * reduzierter Bewegung stehen sie sofort. grau ist ein Nachsatz unter
 * der H2, nicht mehr Teil der Überschrift.
 */
export function Abschnitt({
  id,
  eyebrow,
  fett,
  grau,
  unter,
  rechts,
  dunkel = false,
  children,
  className,
}: {
  id: string;
  eyebrow?: string;
  fett: string;
  grau?: string;
  unter?: ReactNode;
  /** rechts neben dem Kopf, z. B. ein Link */
  rechts?: ReactNode;
  dunkel?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-titel`}
      className={cn(dunkel ? cn(u.dunkelFlaeche, u.dunkel, "on-dark grain") : u.abschnitt, "scroll-mt-24", className)}
      data-flaeche-dunkel={dunkel ? "" : undefined}
    >
      <div className="inhalt">
        <div className={cn(u.abschnittKopf, rechts && "flex flex-wrap items-end justify-between gap-x-8 gap-y-2")}>
          <div>
            {eyebrow ? <p className={u.eyebrow}>{eyebrow}</p> : null}
            <h2 id={`${id}-titel`} data-reveal="rise" className={u.zweiton}>
              <Steigend text={fett} />
            </h2>
            {grau ? <p className={u.abschnittUnter}>{grau}</p> : null}
            {unter ? <p className={u.abschnittUnter}>{unter}</p> : null}
          </div>
          {rechts}
        </div>
        {children}
      </div>
    </section>
  );
}

export function BildRaster({ children, className }: { children: ReactNode; className?: string }) {
  return <ul role="list" className={cn(u.raster, className)}>{children}</ul>;
}

/**
 * Bildkachel: Text oben, Foto randlos unten. Mit href ist die ganze
 * Kachel ein Link. ton: weiss (Standard), hell, schwarz (Hafen-Tiefblau
 * mit oranger Kante), nacht (Schwarz).
 */
export function BildKachel({
  ton = "weiss",
  spalten,
  breit = false,
  gross = false,
  kompaktMobil = false,
  eyebrow,
  titel,
  zeile,
  zahl,
  mehr,
  href,
  foto,
  kinder,
  fuss,
  bildInhalt,
  ueberschrift: H = "h3",
  className,
  id,
}: {
  ton?: "weiss" | "hell" | "schwarz" | "nacht";
  spalten?: 4 | 5 | 6 | 7 | 8 | 12;
  breit?: boolean;
  gross?: boolean;
  /** unter 640 px als flache Zeile mit kleinem Bild rechts */
  kompaktMobil?: boolean;
  eyebrow?: string;
  titel: string;
  zeile?: ReactNode;
  /** große Zahl statt Symbol (48 px) */
  zahl?: string;
  mehr?: string;
  href?: string;
  foto?: { src: string; alt: string; position?: string; sizes?: string; muster?: boolean };
  /** eigener Inhalt unter dem Text (Listen …) */
  kinder?: ReactNode;
  /** Fußzeile am Kartenende (Preis, Knopf) */
  fuss?: ReactNode;
  /** gestalteter Bildinhalt statt Foto (echte Oberfläche, unten bündig) */
  bildInhalt?: ReactNode;
  ueberschrift?: "h2" | "h3";
  className?: string;
  id?: string;
}) {
  return (
    <li
      id={id}
      className={cn(
        u.kachel,
        ton === "schwarz" && cn(u.kachelSchwarz, "on-dark"),
        ton === "nacht" && cn(u.kachelNacht, "on-dark"),
        ton === "hell" && u.kachelHell,
        spalten && u[`s${spalten}`],
        breit && u.breit,
        gross && u.gross,
        kompaktMobil && u.kompaktMobil,
        className,
      )}
      data-flaeche-dunkel={ton === "schwarz" || ton === "nacht" ? "" : undefined}
    >
      <div className={u.kachelText}>
        {eyebrow ? <p className={u.kachelEyebrow}>{eyebrow}</p> : null}
        {zahl ? <p className={u.kachelZahl}>{zahl}</p> : null}
        <H className={u.kachelTitel}>
          {href ? (
            href.startsWith("#") || href.startsWith("tel:") ? (
              <a href={href} className="karte-link">
                {titel}
              </a>
            ) : (
              <Link href={href} className="karte-link">
                {titel}
              </Link>
            )
          ) : (
            titel
          )}
        </H>
        {zeile ? <p className={u.kachelZeile}>{zeile}</p> : null}
        {mehr ? (
          <p className={u.kachelMehr}>
            {mehr}
            <span aria-hidden="true">{"\u00A0"}→</span>
          </p>
        ) : null}
        {kinder}
      </div>
      {fuss ? <div className={u.kachelFuss}>{fuss}</div> : null}
      {bildInhalt ? (
        <div className={u.kachelUi} aria-hidden="true">
          {bildInhalt}
        </div>
      ) : null}
      {foto ? (
        <div className={u.kachelBild}>
          <Image
            src={foto.src}
            alt={foto.alt}
            fill
            sizes={foto.sizes ?? SIZES_HALB}
            className={u.foto}
            style={foto.position ? { objectPosition: foto.position } : undefined}
          />
          {foto.muster ? <MusterPille text="Musterseite" /> : null}
        </div>
      ) : null}
    </li>
  );
}

/**
 * Abschluss aller Unterseiten: die Briefkarte aus dem Kontor
 * (components/marketing/hafen/briefkarte.tsx). Kein Foto, keine Mail;
 * Telefon groß, schriftlich über /anfrage. Die alten Props bleiben, damit
 * die Seiten unverändert bauen: titel → Aussage, zeile → Satz, pille →
 * Knopf, link → Textlink. foto und eyebrow werden nicht mehr gezeigt.
 */
export function KontaktKarte({
  id = "kontakt",
  titel = "Erzählen Sie uns von Ihrem Betrieb.",
  zeile = "Das Anfrageformular hat drei Pflichtfelder. Wir antworten meist am selben Werktag.",
  pille = { href: "/anfrage", label: "Anfrage schreiben" },
  link = { href: "/termin", label: "Erstgespräch buchen" },
  children,
}: {
  id?: string;
  eyebrow?: string;
  titel?: ReactNode;
  zeile?: ReactNode;
  pille?: { href: string; label: string };
  link?: { href: string; label: string } | null;
  foto?: { src: string; alt: string; position?: string; muster?: boolean };
  children?: ReactNode;
}) {
  return (
    <Briefkarte id={id} title={titel} inquiryHref={pille.href} knopf={pille.label} link={link}>
      {zeile}
      {children ? <> {children}</> : null}
    </Briefkarte>
  );
}

/** Hauptfläche der Unterseiten: #f3f2ee wie die Startseite. */
export function UnterseiteMain({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <main id="main" tabIndex={-1} className={cn("flex-1 bg-[#f3f2ee]", s.seite, className)}>
      <RevealRoot />
      {children}
    </main>
  );
}
