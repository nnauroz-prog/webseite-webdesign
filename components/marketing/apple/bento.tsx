import { cn } from "@/lib/utils";

import { MehrLink } from "./mehr-link";

/**
 * Bento-Raster im Apple-Stil (.bento, app/apple.css): große gerundete
 * Kacheln, mobil untereinander, ab 834 px zweispaltig; span="breit"
 * nimmt beide Spalten. Abwechselnd hell (#f5f5f7) und schwarz.
 *
 * Mit zwoelf (Klasse .bento-12) ab 1068 px ein 12er-Raster; die
 * Kachel nimmt dann `spalten` Spalten (4, 5, 7 oder 12). quer legt eine
 * 12er-Kachel ab 1068 px ins Querformat (Text links, Motiv rechts).
 *
 * <BentoRaster zwoelf>
 *   <BentoKachel ton="hell" spalten={7} gross eyebrow="…" titel="…" text="…" href="/…" motiv={…} />
 * </BentoRaster>
 */
export function BentoRaster({
  children,
  className,
  zwoelf = false,
}: {
  children: React.ReactNode;
  className?: string;
  zwoelf?: boolean;
}) {
  return <div className={cn("bento", zwoelf && "bento-12", className)}>{children}</div>;
}

export function BentoKachel({
  ton = "hell",
  eyebrow,
  titel,
  text,
  href,
  linkText = "Mehr erfahren",
  motiv,
  span,
  spalten,
  gross = false,
  quer = false,
  ueberschrift: Ueberschrift = "h3",
  className,
}: {
  ton?: "hell" | "schwarz" | "weiss";
  eyebrow?: string;
  titel: React.ReactNode;
  text?: React.ReactNode;
  href?: string;
  linkText?: string;
  /** Ruhiges Bild unten in der Kachel (SVG, ContainerMotiv …). */
  motiv?: React.ReactNode;
  span?: "breit";
  /** Spalten im 12er-Raster ab 1068 px. */
  spalten?: 4 | 5 | 7 | 12;
  /** Große Kachel (höher). */
  gross?: boolean;
  /** Querformat ab 1068 px (nur mit spalten={12}). */
  quer?: boolean;
  ueberschrift?: "h2" | "h3";
  className?: string;
}) {
  const kontext = typeof titel === "string" ? titel : undefined;
  return (
    <article
      data-auftritt=""
      className={cn(
        "karte bento-kachel",
        ton === "schwarz" && "karte-schwarz",
        ton === "weiss" && "karte-weiss",
        span === "breit" && "bento-breit",
        spalten && `bento-s${spalten}`,
        gross && "bento-gross",
        quer && "bento-quer",
        className,
      )}
    >
      <div className="bento-kopf">
        {eyebrow ? <p className="t-eyebrow bento-eyebrow">{eyebrow}</p> : null}
        <Ueberschrift className={cn("t-kachel", eyebrow && "mt-2")}>{titel}</Ueberschrift>
        {text ? <p className="bento-text text-muted-foreground mt-3 text-[17px] leading-[1.47]">{text}</p> : null}
        {href ? (
          <div className="mt-2">
            <MehrLink href={href} kontext={kontext}>
              {linkText}
            </MehrLink>
          </div>
        ) : null}
      </div>
      {motiv ? (
        <div className="bento-motiv" aria-hidden="true">
          {motiv}
        </div>
      ) : (
        <div className="pb-10" />
      )}
    </article>
  );
}
