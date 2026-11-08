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
}) {
  const spurId = `${id}-spur`;
  return (
    <section
      id={id}
      aria-labelledby={`${id}-titel`}
      style={style}
      className={cn("regal pt-16 sm:pt-20 lg:pt-24", flaeche === "hell" ? "flaeche-hell" : "flaeche-weiss", className)}
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
      <div className="pb-12 sm:pb-16 lg:pb-20">
        <RegalPfeile spurId={spurId} label={fett.replace(/\.$/, "")} />
      </div>
    </section>
  );
}

/**
 * Karte im Regal: weiß, Schatten, Hover scale(1.01). Ganze Karte klickbar
 * (Link mit .karte-link), Text oben, optional ein Motiv unten.
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
        {eyebrow ? <p className="t-eyebrow text-[12px] lg:text-[12px]">{eyebrow}</p> : null}
        <h3 className={cn("t-karte", eyebrow && "mt-2")}>{titel}</h3>
        {text ? <p className="text-muted-foreground mt-3 text-[17px] leading-[1.47]">{text}</p> : null}
        {motiv ? <div className="mt-auto flex justify-center pt-8">{motiv}</div> : null}
        <div className={cn(motiv ? "mt-6" : "mt-auto pt-6")}>
          <MehrLink href={href} kontext={titel} groesse="klein" frei={false} className="karte-link">
            {linkText}
          </MehrLink>
        </div>
      </article>
    </li>
  );
}
