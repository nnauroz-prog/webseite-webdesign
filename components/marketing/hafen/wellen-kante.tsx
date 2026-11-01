import s from "./wellen-kante.module.css";

/**
 * Wellenkante: Übergang von einem hellen Abschnitt aufs Wasser. Eine
 * einzige flache Dünung über die volle Breite, darauf eine feine orange
 * Linie, in derselben Sprache wie die Elbe-Linie im Fuß. Bewusst nur
 * einmal pro Seite und ohne gestaffelte Wellen dahinter: Mehrere graue
 * Dünungen übereinander sind das Erkennungszeichen von Baukasten-Trennern.
 *
 *   <WellenKante from="card" to="foreground" />
 *
 * from      Farbe des Abschnitts darüber (Token-Name)
 * to        Farbe des Abschnitts darunter; die Welle hat diese Farbe
 * spiegeln  Welle horizontal gespiegelt
 * kamm      orange Linie auf dem Wellenkamm (Standard: an)
 *
 * Feste Höhe (24 px, ab 640 px 36 px), kein Layout-Sprung, steht still.
 * Rein dekorativ: aria-hidden. Liegt 1 px über dem nächsten Abschnitt,
 * damit keine Haarfuge entsteht.
 */

type Ton = "background" | "card" | "foreground" | "teer-2";

const FARBE: Record<Ton, string> = {
  background: "var(--background)",
  card: "var(--card)",
  foreground: "var(--foreground)",
  "teer-2": "var(--teer-2)",
};

/** Welle über 1440 Einheiten (Q/T, nur ganze und halbe Zahlen). */
function welle(period: number, amp: number, y: number, open = false) {
  const h = period / 2;
  let d = `M0 ${y}Q${period / 4} ${y - 2 * amp} ${h} ${y}`;
  for (let x = period; x <= 1440; x += h) d += `T${x} ${y}`;
  return open ? d : `${d}V36H0Z`;
}

const VORN = welle(480, 2.5, 22);
const KAMM = welle(480, 2.5, 22, true);

export function WellenKante({
  from,
  to,
  spiegeln = false,
  kamm = true,
  className = "",
}: {
  from: Ton;
  to: Ton;
  spiegeln?: boolean;
  kamm?: boolean;
  className?: string;
}) {
  return (
    <div aria-hidden="true" className={`${s.kante} ${className}`} style={{ backgroundColor: FARBE[from] }}>
      <svg
        viewBox="0 0 1440 36"
        preserveAspectRatio="none"
        className={`${s.svg} ${spiegeln ? s.spiegeln : ""}`}
        style={{ color: FARBE[to] }}
      >
        <path d={VORN} fill="currentColor" />
        {kamm ? (
          <path d={KAMM} fill="none" stroke="var(--gold)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        ) : null}
      </svg>
    </div>
  );
}
