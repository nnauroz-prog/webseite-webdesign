import type { LucideIcon } from "lucide-react";

import { ContainerMotiv, type ContainerTon } from "./container-motiv";

/**
 * Ruhige Motive für Kacheln und Karten (rein dekorativ, aria-hidden):
 * einfache SVG-Formen und Container aus dem Hafen-Fundus, keine Geräte,
 * keine fremden Icons außer lucide.
 */

/** Ein schlichtes Browserfenster: gerundetes Rechteck, drei Punkte,
 *  oranger Balken, graue Zeilen. */
export function BrowserMotiv({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 200"
      width="320"
      height="200"
      className={className}
      aria-hidden="true"
      focusable="false"
      style={{ maxWidth: "100%", height: "auto" }}
    >
      <rect x="0.5" y="0.5" width="319" height="199" rx="16" fill="#fff" stroke="#d2d2d7" />
      <path d="M16 .5h288a15.5 15.5 0 0 1 15.5 15.5v18H.5V16A15.5 15.5 0 0 1 16 .5Z" fill="#e8e8ed" />
      <circle cx="20" cy="17" r="5" fill="#d2d2d7" />
      <circle cx="37" cy="17" r="5" fill="#d2d2d7" />
      <circle cx="54" cy="17" r="5" fill="#d2d2d7" />
      <rect x="24" y="56" width="132" height="14" rx="7" fill="#1d1d1f" />
      <rect x="24" y="80" width="104" height="8" rx="4" fill="#d2d2d7" />
      <rect x="24" y="96" width="120" height="8" rx="4" fill="#d2d2d7" />
      <rect x="24" y="122" width="84" height="26" rx="13" fill="#f45b1e" />
      <rect x="176" y="52" width="120" height="100" rx="12" fill="#f3f2ee" />
      <path d="M188 140l30-38 22 26 14-16 30 28Z" fill="#d2d2d7" />
      <circle cx="268" cy="78" r="9" fill="#f45b1e" opacity=".85" />
      <rect x="24" y="168" width="272" height="8" rx="4" fill="#f3f2ee" />
    </svg>
  );
}

/** Container mit einem lucide-Icon in der Mitte. */
export function ContainerMitIcon({
  ton,
  icon: Icon,
  groesse = "l",
}: {
  ton: ContainerTon;
  icon: LucideIcon;
  groesse?: "m" | "l";
}) {
  return (
    <span className="motiv-auf">
      <ContainerMotiv ton={ton} groesse={groesse} />
      <span className="motiv-ueber">
        <Icon className="h-8 w-8" strokeWidth={1.75} aria-hidden="true" />
      </span>
    </span>
  );
}

/** Container mit hellen Zeilenstrichen (Texte). */
export function ContainerMitZeilen({ ton }: { ton: ContainerTon }) {
  return (
    <span className="motiv-auf">
      <ContainerMotiv ton={ton} groesse="l" />
      <span className="motiv-ueber flex-col items-start gap-[7px] pl-12">
        <span className="block h-[5px] w-24 rounded-full bg-white/90" />
        <span className="block h-[5px] w-32 rounded-full bg-white/70" />
        <span className="block h-[5px] w-20 rounded-full bg-white/70" />
      </span>
    </span>
  );
}

/** Oranger Kreis mit Icon (z. B. Telefon). */
export function KreisMotiv({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="motiv-kreis">
      <Icon className="h-11 w-11" strokeWidth={1.75} aria-hidden="true" />
    </span>
  );
}

/** Lucide-Icon in --gold auf einem hellgrauen, gerundeten Quadrat. */
export function IconMotiv({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="motiv-icon">
      <Icon className="h-14 w-14" strokeWidth={1.5} aria-hidden="true" />
    </span>
  );
}

/** Ein schlichtes Pflege-Fenster: Liste mit Einträgen, Schaltern und
 *  einem runden Stift-Knopf unten rechts – „Inhalte selbst ändern“, ohne
 *  Geräteform. Alles liegt im Fenster, die viewBox ist genau so groß wie
 *  das Fenster (sonst sitzt es in der Kachel schief). Die letzte Zeile ist
 *  kürzer und ohne Schalter: Dort sitzt der Knopf. */
export function PflegeMotiv({ className }: { className?: string }) {
  const zeilen = [
    { y: 58, w1: 96, w2: 58, an: true as boolean | null, breite: 352 },
    { y: 106, w1: 120, w2: 44, an: true as boolean | null, breite: 352 },
    { y: 154, w1: 84, w2: 64, an: null, breite: 280 },
  ];
  return (
    <svg
      viewBox="0 0 400 220"
      width="400"
      height="220"
      className={className}
      aria-hidden="true"
      focusable="false"
      style={{ maxWidth: "100%", height: "auto" }}
    >
      <rect x="0.5" y="0.5" width="399" height="219" rx="18" fill="#fff" stroke="#d2d2d7" />
      <rect x="24" y="22" width="110" height="12" rx="6" fill="#1d1d1f" />
      <rect x="300" y="18" width="76" height="22" rx="11" fill="#f45b1e" />
      {zeilen.map((z) => (
        <g key={z.y}>
          <rect x="24" y={z.y - 10} width={z.breite} height="40" rx="12" fill="#f3f2ee" />
          <rect x="40" y={z.y} width={z.w1} height="8" rx="4" fill="#1d1d1f" opacity=".85" />
          <rect x="40" y={z.y + 13} width={z.w2} height="6" rx="3" fill="#a1a1a6" />
          {z.an !== null ? (
            <>
              <rect x="328" y={z.y - 1} width="34" height="20" rx="10" fill={z.an ? "#f45b1e" : "#d2d2d7"} />
              <circle cx={z.an ? 352 : 338} cy={z.y + 9} r="8" fill="#fff" />
            </>
          ) : null}
        </g>
      ))}
      <circle cx="350" cy="168" r="24" fill="#1d1d1f" />
      <g transform="translate(350 168) scale(.78) translate(-399 -194)">
        <path
          d="M386 208l4-12 16-16a4 4 0 0 1 6 6l-16 16-12 4z"
          fill="none"
          stroke="#fff"
          strokeWidth="3.4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}
