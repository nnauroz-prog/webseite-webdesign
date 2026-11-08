import Image from "next/image";
import Link from "next/link";
import { cloneElement, isValidElement, type CSSProperties, type ReactElement, type ReactNode } from "react";

import { Briefkarte } from "@/components/marketing/hafen/briefkarte";
import { cn } from "@/lib/utils";

import s from "./laden.module.css";
import u from "./unterseite.module.css";

/**
 * Bausteine der Unterseiten im Stil der Startseite: Fläche #f5f5f7,
 * Seitenkopf mit Mono-Brotkrumen, Mono-Kennzeile und großem Foto samt
 * Mono-Bildunterschrift, Bildkacheln, Zweiton-Abschnittsköpfe und die
 * helle Briefkarte als Abschluss. Fotos aus public/images immer
 * mit next/image, festem Seitenverhältnis (CLS 0) und passenden sizes.
 * Nur das Kopfbild lädt vorab (preload), alle anderen lazy.
 *
 * Gerätefotos zeigen frei erfundene Betriebe (muster): Im Seitenkopf
 * steht das als Mono-Bildunterschrift unter dem Foto, in Kacheln als
 * kleine Pille „Musterseite“.
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

type FotoRahmenProps = Parameters<typeof FotoRahmen>[0];

/**
 * Seitenkopf der Unterseiten: Mono-Brotkrumen, Eyebrow als Mono-
 * Kennzeile mit orangem Punkt, H1 (64 / 40 px), grauer Satz, Aktionen,
 * kleine Zeile, darunter das große Foto (bild) im 980er-Raster mit
 * Mono-Bildunterschrift. Ein FotoRahmen mit muster trägt keine Pille
 * mehr: ohne eigene unterschrift steht „Musterseite, frei erfunden“
 * darunter.
 */
export function SeitenKopf({
  krumen,
  eyebrow,
  titel,
  unter,
  aktionen,
  meta,
  bild,
  unterschrift,
  className,
}: {
  krumen?: Krume[] | string;
  eyebrow?: ReactNode;
  titel: ReactNode;
  unter?: ReactNode;
  aktionen?: ReactNode;
  meta?: ReactNode;
  bild?: ReactNode;
  /** Mono-Bildunterschrift unter dem Foto */
  unterschrift?: ReactNode;
  className?: string;
}) {
  let foto = bild;
  let notiz = unterschrift;
  if (isValidElement(bild) && bild.type === FotoRahmen) {
    const el = bild as ReactElement<FotoRahmenProps>;
    if (el.props.muster) {
      foto = cloneElement(el, { muster: false });
      notiz = unterschrift ?? "Musterseite, frei erfunden";
    }
  }
  return (
    <section className={cn(u.kopf, !bild && u.kopfOhneBild, className)}>
      <div className="inhalt">
        {krumen ? <Brotkrumen krumen={krumen} /> : null}
        {eyebrow ? <p className={cn("kennzeile-mono", u.eyebrow)}>{eyebrow}</p> : null}
        <h1 className={u.titel}>{titel}</h1>
        {unter ? <p className={u.unter}>{unter}</p> : null}
        {aktionen ? <div className={u.aktionen}>{aktionen}</div> : null}
        {meta ? <div className={u.meta}>{meta}</div> : null}
        {foto ? (
          <figure className={u.kopfBild}>
            {foto}
            {notiz ? <figcaption className={cn("notiz-mono", u.unterschrift)}>{notiz}</figcaption> : null}
          </figure>
        ) : notiz ? (
          <p className={cn("notiz-mono", u.unterschrift)}>{notiz}</p>
        ) : null}
      </div>
    </section>
  );
}

/** Abschnitt mit Zweiton-Kopf (40 / 28 px), Inhalt im 980er-Raster. */
export function Abschnitt({
  id,
  fett,
  grau,
  unter,
  rechts,
  dunkel = false,
  children,
  className,
}: {
  id: string;
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
      className={cn(dunkel ? cn(u.dunkelFlaeche, u.dunkel, "on-dark") : u.abschnitt, "scroll-mt-24", className)}
      data-flaeche-dunkel={dunkel ? "" : undefined}
    >
      <div className="inhalt">
        <div className={cn(u.abschnittKopf, rechts && "flex flex-wrap items-end justify-between gap-x-8 gap-y-2")}>
          <div>
            <h2 id={`${id}-titel`} className={u.zweiton}>
              <span>{fett}</span>
              {grau ? (
                <>
                  {" "}
                  <span>{grau}</span>
                </>
              ) : null}
            </h2>
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
            <span aria-hidden="true"> ›</span>
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
 * Abschluss aller Unterseiten: die helle Briefkarte (weiße runde Karte
 * auf #f5f5f7) mit Mono-Briefkopf, Telefon groß, Formular als zweitem
 * Weg und genau einer Pille. Die alten Props werden auf die Briefkarte
 * gemappt (titel → title, zeile + children → Satz, pille → knopf).
 * eyebrow bleibt aus Kompatibilität erhalten, die Briefkarte trägt statt
 * dessen den Briefkopf. foto wird zum Fotomoment in der rechten Hälfte.
 */
export function KontaktKarte({
  id = "kontakt",
  titel = "Erzählen Sie uns von Ihrem Betrieb.",
  zeile = "Das Anfrageformular hat drei Pflichtfelder. Wir antworten meist am selben Werktag.",
  pille = { href: "/anfrage", label: "Anfrage schreiben" },
  link = { href: "/termin", label: "Erstgespräch buchen" },
  foto,
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
    <Briefkarte id={id} title={titel} inquiryHref={pille.href} knopf={pille.label} link={link} foto={foto}>
      {zeile}
      {children ? <> {children}</> : null}
    </Briefkarte>
  );
}

/** Hauptfläche der Unterseiten: #f5f5f7 wie die Startseite. */
export function UnterseiteMain({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <main id="main" tabIndex={-1} className={cn("flex-1 bg-[#f5f5f7]", s.seite, className)}>
      {children}
    </main>
  );
}
