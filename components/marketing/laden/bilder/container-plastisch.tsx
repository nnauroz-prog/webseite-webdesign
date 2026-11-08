import { ton } from "./farbe";

/**
 * Plastischer Seecontainer in 3/4-Ansicht von links oben: Längsseite
 * (Front) mit Riffeln, Dach heller, Stirnseite mit Türstangen dunkler,
 * Eckbeschläge, Lichtkante oben, Kontakt- und Bodenschatten nach rechts
 * unten (Licht von oben links).
 *
 * (x, y) ist die linke obere Ecke der Front; L × H ihre Maße, t die
 * Tiefe (Länge der schrägen Kanten).
 */
export type ContainerFarbe = { front: string; seite?: string; dach?: string };

export const CONTAINER = {
  signal: { front: "#f45b1e", seite: "#c9461a", dach: "#ff7a45" },
  zink: { front: "#8e9499", seite: "#6f7b84", dach: "#a9aeb2" },
  gruen: { front: "#2f6b4f", seite: "#22513b", dach: "#3d8462" },
  petrol: { front: "#1f5f6b", seite: "#17495a", dach: "#2b7686" },
  rost: { front: "#a5452f", seite: "#833524", dach: "#bd5a42" },
  teer: { front: "#3a3d40", seite: "#2a2c2e", dach: "#4d5154" },
  weiss: { front: "#f2f2f4", seite: "#d6d6db", dach: "#ffffff" },
  blau: { front: "#2f5a8a", seite: "#22456b", dach: "#3d6fa5" },
} satisfies Record<string, ContainerFarbe>;

export function ContainerPlastisch({
  x,
  y,
  L,
  H,
  t,
  farbe,
  rippen = 14,
  schild,
  schatten = true,
  tueren = true,
}: {
  x: number;
  y: number;
  L: number;
  H: number;
  t: number;
  farbe: ContainerFarbe;
  rippen?: number;
  /** Schrift auf einem weißen Schild an der Front */
  schild?: string;
  schatten?: boolean;
  tueren?: boolean;
}) {
  const dx = t * 0.62;
  const dy = t * 0.5;
  const seite = farbe.seite ?? ton(farbe.front, -0.24);
  const dach = farbe.dach ?? ton(farbe.front, 0.16);
  const rail = Math.max(1.5, H * 0.07);
  const eck = Math.max(2, H * 0.09);

  // Riffel: abwechselnd Licht- und Schattenkante
  let hellR = "";
  let dunkelR = "";
  const schritt = (L - 2 * eck) / rippen;
  for (let i = 0; i < rippen; i++) {
    const rx = x + eck + i * schritt;
    hellR += `M${rx + schritt * 0.12} ${y + rail}V${y + H - rail}`;
    dunkelR += `M${rx + schritt * 0.62} ${y + rail}V${y + H - rail}`;
  }
  // Dachsicken parallel zur Tiefe
  let sicken = "";
  for (let i = 1; i < rippen; i++) {
    const sx = x + (L * i) / rippen;
    sicken += `M${sx} ${y}l${-dx} ${-dy}`;
  }
  // Türstangen auf der Stirnseite (4 Stück), dazu die Mittelfuge
  let stangen = "";
  if (tueren) {
    for (const f of [0.16, 0.38, 0.62, 0.84]) {
      const sx = x - dx * f;
      const sy = y - dy * f;
      stangen += `M${sx} ${sy + rail * 1.2}V${sy + H - rail * 1.2}`;
    }
  }
  const fuge = `M${x - dx * 0.5} ${y - dy * 0.5 + 1}V${y - dy * 0.5 + H - 1}`;

  return (
    <g>
      {schatten ? (
        <>
          {/* Schlagschatten nach rechts unten und Kontaktschatten */}
          <path
            d={`M${x + L * 0.04} ${y + H}H${x + L + t * 0.35}L${x + L + t * 0.1} ${y + H - dy * 0.25}H${x - dx * 0.4}Z`}
            fill="#000"
            fillOpacity=".12"
          />
          <ellipse
            cx={x + L / 2 - dx * 0.3}
            cy={y + H}
            rx={L * 0.58}
            ry={Math.max(3, H * 0.09)}
            fill="url(#ld-kontakt)"
          />
        </>
      ) : null}
      {/* Dach */}
      <path d={`M${x} ${y}H${x + L}l${-dx} ${-dy}H${x - dx}Z`} fill={dach} />
      <path
        d={sicken}
        stroke="#000"
        strokeOpacity=".08"
        strokeWidth={Math.max(0.6, L / 300)}
      />
      {/* Stirnseite */}
      <path d={`M${x} ${y}V${y + H}l${-dx} ${-dy}V${y - dy}Z`} fill={seite} />
      {tueren ? (
        <>
          <path
            d={fuge}
            stroke="#000"
            strokeOpacity=".3"
            strokeWidth={Math.max(0.6, H / 90)}
          />
          <path
            d={stangen}
            stroke="#c7c7cc"
            strokeWidth={Math.max(0.8, H / 50)}
            strokeLinecap="round"
          />
        </>
      ) : null}
      {/* Front mit Riffeln */}
      <rect x={x} y={y} width={L} height={H} fill={farbe.front} />
      <path
        d={hellR}
        stroke="#fff"
        strokeOpacity=".12"
        strokeWidth={schritt * 0.36}
      />
      <path
        d={dunkelR}
        stroke="#000"
        strokeOpacity=".13"
        strokeWidth={schritt * 0.22}
      />
      <rect x={x} y={y} width={L} height={H} fill="url(#ld-flaeche)" />
      {/* Ober- und Unterschiene, Eckpfosten, Eckbeschläge */}
      <path
        d={`M${x} ${y}h${L}v${rail}h${-L}Z M${x} ${y + H - rail}h${L}v${rail}h${-L}Z M${x} ${y}h${eck * 0.8}v${H}h${-eck * 0.8}Z M${x + L - eck * 0.8} ${y}h${eck * 0.8}v${H}h${-eck * 0.8}Z`}
        fill="#000"
        fillOpacity=".16"
      />
      <path
        d={`M${x} ${y}h${eck}v${eck * 0.9}h${-eck}Z M${x + L - eck} ${y}h${eck}v${eck * 0.9}h${-eck}Z M${x} ${y + H - eck * 0.9}h${eck}v${eck * 0.9}h${-eck}Z M${x + L - eck} ${y + H - eck * 0.9}h${eck}v${eck * 0.9}h${-eck}Z M${x - dx} ${y - dy}h${eck * 0.9}v${eck * 0.9}h${-eck * 0.9}Z`}
        fill="#0f2f38"
        fillOpacity=".75"
      />
      {/* Lichtkanten: Dachkante vorn und Stirnkante */}
      <path
        d={`M${x - dx} ${y - dy}H${x + L - dx}M${x} ${y}H${x + L}`}
        stroke="#fff"
        strokeOpacity=".35"
        strokeWidth="1"
      />
      <path
        d={`M${x} ${y}V${y + H}`}
        stroke="#fff"
        strokeOpacity=".18"
        strokeWidth="1"
      />
      {schild ? (
        <g>
          <rect
            x={x + L * 0.6}
            y={y + H * 0.2}
            width={L * 0.3}
            height={H * 0.24}
            rx="1.5"
            fill="#fff"
          />
          <text
            x={x + L * 0.75}
            y={y + H * 0.2 + H * 0.165}
            textAnchor="middle"
            fontSize={H * 0.13}
            fontWeight="800"
            letterSpacing={H * 0.02}
            fill="#1d1d1f"
            fontFamily="ui-monospace, 'SF Mono', Menlo, monospace"
          >
            {schild}
          </text>
        </g>
      ) : null}
    </g>
  );
}
