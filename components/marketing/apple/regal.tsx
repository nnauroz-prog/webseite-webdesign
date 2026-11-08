import { cn } from "@/lib/utils";

import { MehrLink } from "./mehr-link";
import { RegalPfeile } from "./regal-pfeile";

/**
 * Regal im Apple-Stil (.regal, app/apple.css): Zweiton-Kopf links
 * („<fett>Werkzeuge.</fett> <grau>Kostenlos ausprobieren.</grau>“),
 * darunter eine waagerecht scrollende Spur aus gerundeten Karten mit
 * Schatten (scroll-snap, mobil wischen, Anschnitt der nächsten Karte),
 * ab 1024 px runde Seitenpfeile. Server-Komponente; nur die Pfeile sind
 * eine kleine Client-Insel.
 *
 * <Regal id="werkzeuge" fett="Werkzeuge." grau="Kostenlos ausprobieren.">
 *   <RegalKarte titel="…" text="…" href="/check" eyebrow="…" />
 * </Regal>
 *
 * Die Spur ist fokussierbar (tabIndex 0, role group – keine zweite
 * Landmark neben der section –, eigenes aria-label),
 * damit sie mit der Tastatur scrollbar ist (axe scrollable-region-focusable).
 */
export function Regal({
  id,
  fett,
  grau,
  children,
  className,
  style,
  flaeche = "hell",
  raster = false,
}: {
  /** Anker-id des Abschnitts; die Spur bekommt `${id}-spur`. */
  id: string;
  fett: string;
  grau?: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  /** Fläche des Abschnitts: Karten sind weiß mit Schatten. */
  flaeche?: "hell" | "weiss";
  /** Wenige Karten (bis vier): ab 1068 px ein ruhiges 2-×-2-Raster ohne Pfeile
   *  statt einer Spur, die nur ein Stück weit blättert. */
  raster?: boolean;
}) {
  const spurId = `${id}-spur`;
  return (
    <section
      id={id}
      aria-labelledby={`${id}-titel`}
      style={style}
      className={cn("regal", raster && "regal-raster", flaeche === "hell" ? "flaeche-hell" : "flaeche-weiss", className)}
    >
      <div className="inhalt regal-kopf">
        <h2 id={`${id}-titel`} className="zweiton" data-auftritt="titel">
          <span>{fett}</span>
          {grau ? (
            <>
              {" "}
              <span className="grau">{grau}</span>
            </>
          ) : null}
        </h2>
      </div>
      <div id={spurId} className="regal-spur" tabIndex={0} role="group" aria-label={`${fett.replace(/\.$/, "")}: Karten`}>
        <ul role="list">{children}</ul>
      </div>
      {/* Fuß: mobil nur der Rest des Abschnittsabstands (die Spur bringt
          40 px Schattenraum mit), mit Pfeilen deren Zeile. */}
      <div className="regal-fuss">
        <RegalPfeile spurId={spurId} label={fett.replace(/\.$/, "")} />
      </div>
    </section>
  );
}

/**
 * Karte im Regal: weiß, Schatten, Hover scale(1.01). Ganze Karte klickbar
 * (Link mit .karte-link), optional ein Motiv oben, darunter der Text.
 */
export function RegalKarte({
  eyebrow,
  titel,
  text,
  href,
  linkText = "Mehr erfahren",
  motiv,
  breit = false,
  dunkel = false,
}: {
  eyebrow?: string;
  titel: string;
  text?: React.ReactNode;
  href: string;
  linkText?: string;
  motiv?: React.ReactNode;
  breit?: boolean;
  dunkel?: boolean;
}) {
  return (
    <li>
      <article
        className={cn(
          "karte karte-regal regal-karte",
          breit && "regal-karte-breit",
          dunkel && "karte-schwarz",
        )}
      >
        {/* Wie im Apple-Regal: Bild oben, Text darunter, Link am Fuß. */}
        {motiv ? <div className="regal-motiv">{motiv}</div> : null}
        {eyebrow ? <p className="t-eyebrow text-[12px] lg:text-[12px]">{eyebrow}</p> : null}
        <h3 className={cn("t-karte", eyebrow && "mt-2")}>{titel}</h3>
        {text ? <p className="text-muted-foreground mt-3 text-[17px] leading-[1.47]">{text}</p> : null}
        <div className="mt-auto pt-6">
          <MehrLink href={href} kontext={titel} groesse="klein" frei={false} className="karte-link">
            {linkText}
          </MehrLink>
        </div>
      </article>
    </li>
  );
}
