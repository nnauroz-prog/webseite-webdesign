import type { CSSProperties, ReactNode } from "react";

import { MehrLink } from "@/components/marketing/apple/mehr-link";
import { RegalPfeile } from "@/components/marketing/apple/regal-pfeile";
import { cn } from "@/lib/utils";

import s from "./laden.module.css";

/**
 * Regal der Startseite: Zweiton-Kopf links („Die Pakete.“ schwarz, Satz
 * grau; nur in wenigen Regalen) oder einfarbiger Titel mit Unterzeile, rechts Kopf-Link und ab 1024 px die Pfeile; darunter eine
 * waagerechte Spur, die an der Inhaltskante beginnt und rechts bis an
 * den Fensterrand läuft (scroll-snap). `Regal` aus components/marketing/
 * apple bleibt für die Unterseiten unverändert.
 *
 * ort: kleine Mono-Ortsmarke über dem Titel („Liegeplatz 1 · Pakete“),
 * notiz: Mono-Notiz unter der Spur.
 *
 * spaet: content-visibility:auto mit geschätzter Höhe (h am Rechner,
 * hMobil am Handy), für Regale unterhalb der ersten Ansicht.
 */
export function LadenRegal({
  id,
  fett,
  grau,
  link,
  children,
  notiz,
  ort,
  spaet,
  ohneSpur = false,
  ohneMobilLink = false,
  einfach = false,
  className,
}: {
  id: string;
  fett: string;
  grau: string;
  /** Statt Zweiton: einfarbige Überschrift, grau als kurze Unterzeile */
  einfach?: boolean;
  link?: { href: string; label: string };
  children: ReactNode;
  notiz?: ReactNode;
  /** Mono-Ortsmarke über dem Titel */
  ort?: string;
  spaet?: { h: number; hMobil: number };
  /** Inhalt ohne waagerechte Spur (Fragen, breite Karten) */
  ohneSpur?: boolean;
  /** Kopf-Link am Handy weglassen (steht in der Spur schon als Karte) */
  ohneMobilLink?: boolean;
  className?: string;
}) {
  const spurId = `${id}-spur`;
  const label = fett.replace(/\.$/, "");
  const style = spaet
    ? ({
        "--h": `${spaet.h}px`,
        "--h-mobil": `${spaet.hMobil}px`,
      } as CSSProperties)
    : undefined;
  return (
    <section
      id={id}
      aria-labelledby={`${id}-titel`}
      className={cn(s.regal, spaet && s.spaet, className)}
      style={style}
    >
      <div className={cn("inhalt", s.regalKopf)}>
        <div>
          {ort ? <p className={cn("kennzeile-mono", s.ortsmarke)}>{ort}</p> : null}
          {einfach ? (
            <>
              <h2 id={`${id}-titel`} className={s.regalTitel}>
                {label}
              </h2>
              <p className={s.regalUnter}>{grau}</p>
            </>
          ) : (
            <h2 id={`${id}-titel`} className={s.zweiton}>
              <span>{fett}</span> <span>{grau}</span>
            </h2>
          )}
          {link && !ohneMobilLink ? (
            <MehrLink href={link.href} frei={false} className={s.kopfLinkMobil}>
              {link.label}
            </MehrLink>
          ) : null}
        </div>
        <div className={s.kopfRechts}>
          {link ? (
            <MehrLink href={link.href} frei={false} className={s.kopfLink}>
              {link.label}
            </MehrLink>
          ) : null}
          {ohneSpur ? null : <RegalPfeile spurId={spurId} label={label} />}
        </div>
      </div>
      {ohneSpur ? (
        <div className={cn("inhalt", s.block)}>{children}</div>
      ) : (
        <div
          id={spurId}
          className={s.spur}
          tabIndex={0}
          role="group"
          aria-label={`${label}: Karten`}
        >
          <ul role="list">{children}</ul>
        </div>
      )}
      {notiz ? <p className={cn("inhalt notiz-mono", s.notiz)}>{notiz}</p> : null}
    </section>
  );
}
