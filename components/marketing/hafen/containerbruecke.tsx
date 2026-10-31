/**
 * Kopfbild der Startseite: Blick von Steinwerder über die Elbe.
 *
 * Rechts eine Containerbrücke in Signal-Orange, darunter am Kai ein
 * Containerschiff in Heckansicht („SITALO / HAMBURG“). Am Horizont
 * Hamburg im Dunst, von West nach Ost so angeordnet, wie man es vom
 * Südufer sieht: Tanzende Türme, Landungsbrücken mit Pegelturm,
 * Heinrich-Hertz-Turm, Michel, Elbphilharmonie. Die Kirchen der
 * Altstadt stehen weiter östlich und liegen hinter dem Schiff.
 *
 * Beim Laden passiert genau eine Bewegung (reines CSS, app/hafen.css):
 * Die Laufkatze fährt vom Kai über das Schiff und senkt einen Container
 * in die freie Lücke. Danach erscheint die Beschriftung. Bei
 * prefers-reduced-motion steht alles sofort im Endzustand.
 *
 * Koordinaten: viewBox "-160 0 960 760", Wasserlinie bei y = 640.
 */

const SKY_LINE = 640;

/* Feste Zufallsfolge, damit Server und Browser dasselbe Bild zeichnen. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return s / 2147483647;
  };
}

/* Niedrige Dächer der Stadt im Dunst, westlich der Wahrzeichen. */
const ROOFS = (() => {
  const rnd = seeded(7);
  let d = "";
  for (let x = -1500; x < 110; ) {
    const w = 8 + Math.round(rnd() * 16);
    const h = 3 + Math.round(rnd() * 9);
    const kind = Math.floor(rnd() * 3);
    const t = SKY_LINE - h;
    if (kind === 0) d += `M${x} ${SKY_LINE}V${t}H${x + w}V${SKY_LINE}Z`;
    else if (kind === 1) d += `M${x} ${SKY_LINE}V${t}L${x + w / 2} ${t - 4}L${x + w} ${t}V${SKY_LINE}Z`;
    else d += `M${x} ${SKY_LINE}V${t + 2}L${x + 2} ${t}H${x + w - 2}L${x + w} ${t + 2}V${SKY_LINE}Z`;
    x += w + Math.round(rnd() * 3);
  }
  return d;
})();

/* Wahrzeichen als Silhouetten (eine Farbe, etwas dunkler als die Dächer). */
const LANDMARKS = [
  // Tanzende Türme: zwei geknickte Hochhäuser am Ende der Reeperbahn
  "M-292 640L-289 614L-294 590H-277L-272 614L-275 640Z",
  "M-270 640L-268 622L-264 604H-251L-254 622L-257 640Z",
  // Landungsbrücken: lange Halle mit zwei Kuppeltürmen und dem Pegelturm
  "M-236 640V628L-232 625H-150L-146 628V640Z",
  "M-221 625V616H-214V625Z M-221 616Q-217.5 607 -214 616Z M-218 609h1v-6h-1Z",
  "M-188 625V616H-181V625Z M-188 616Q-184.5 607 -181 616Z M-185 609h1v-6h-1Z",
  "M-166 625V596H-157V625Z M-167 596L-161.5 586L-156 596Z M-162 587h1v-6h-1Z",
  // Heinrich-Hertz-Turm: schlanker Schaft, zwei Kanzeln, Antennenmast
  "M-75 640L-72.6 566H-68.4L-66 640Z",
  "M-78 566H-63V559H-78Z M-76 559H-65V552H-76Z M-77.5 549H-63.5V546H-77.5Z",
  "M-71.2 552V514H-69.8V552Z",
  // Michel: Kirchenschiff, Turmschaft, Glockengeschoss, Haube, Laterne, Spitze
  "M-60 640V617L-48 609H-22L-10 617V640Z",
  "M-42 640V590H-28V640Z",
  "M-40.5 590V576H-29.5V590Z M-42 591h17v-2h-17Z",
  "M-40.5 576Q-35 563 -29.5 576Z",
  "M-37 570V562H-33V570Z",
  "M-36.2 562L-35 548L-33.8 562Z",
  // Elbphilharmonie: Backstein-Speicher, darauf der Glasbau mit Wellendach
  "M-12 640V606H96V640Z",
  "M-12 606V588Q-8 580 -2 571Q8 586 22 581Q32 572 44 574Q56 586 68 583Q78 578 86 584Q92 586 96 592V606Z",
];

/* Fachwerk im Ausleger, Lüftungsschlitze im Maschinenhaus. */
const LATTICE = (() => {
  let d = "M103 256";
  for (let i = 0, x = 103; x < 790; i++) {
    x += 16;
    d += `L${x} ${i % 2 ? 256 : 274}`;
  }
  return d;
})();
const LOUVER = (() => {
  let d = "";
  for (let x = 692; x < 792; x += 7) d += `M${x} 221V244`;
  return d;
})();

/* Ladung: Containerstirnseiten, 9 Stapel. Stapel 3 hat eine Lücke für
   den Container, der gerade abgesetzt wird. */
const PAL: Record<string, string> = {
  o: "#F45B1E",
  r: "#A8382A",
  g: "#2E5C4D",
  z: "#B3B6B2",
  w: "#D9D9D4",
  t: "#3A3E40",
  d: "#24493D",
};
const STACKS = [["z", "r"], ["g", "w", "t"], ["r", "o", "z"], ["t", "w"], ["w", "g", "r"], ["o", "z", "d"], ["g", "t", "w"], ["z", "r"], ["t", "g"]];
const CARGO = STACKS.flatMap((stack, ci) =>
  stack.map((c, ti) => ({ key: `${ci}-${ti}`, x: 124 + ci * 48, y: 541 - ti * 49, fill: PAL[c], dark: "trgd".includes(c) })),
);

/* Elbe: Wellenstriche mit unterschiedlicher Länge und Geschwindigkeit. */
const WAVES = Array.from({ length: 10 }, (_, r) => ({
  y: 649 + r * 12 + (r % 2 ? 2 : 0),
  dash: `${8 + ((r * 7) % 5) * 5} ${36 + ((r * 11) % 4) * 12}`,
  offset: r * 37,
  opacity: (0.24 - r * 0.016).toFixed(3),
  duration: `${26 + r * 6}s`,
}));
const REFLECTION: [number, string, number, number][] = [
  [645, "34 5", 0.5, 2.4],
  [650, "24 9", 0.38, 2],
  [656, "14 13", 0.27, 1.8],
  [663, "8 18", 0.18, 1.6],
  [671, "4 24", 0.11, 1.4],
];

function Container({ x, y, fill, dark }: { x: number; y: number; fill: string; dark: boolean }) {
  const line = dark ? "#fff" : "#000";
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="46" height="49" fill={fill} />
      <rect x="2" y="2" width="42" height="45" fill="none" stroke={line} strokeOpacity={dark ? 0.14 : 0.2} />
      <path d="M23 3V46M9 6V43M16 6V43M30 6V43M37 6V43" stroke={line} strokeOpacity={dark ? 0.22 : 0.24} strokeWidth="1.1" />
      <path d="M0 0h5v4H0zM41 0h5v4h-5zM0 45h5v4H0zM41 45h5v4h-5z" fill="#000" fillOpacity=".35" />
    </g>
  );
}

export function Containerbruecke() {
  return (
    <div className="hafen-art" aria-hidden="true">
      <svg viewBox="-160 0 960 760" preserveAspectRatio="xMaxYMax meet">
        {/* Stadt im Dunst */}
        <path d={ROOFS} fill="#CFD1CD" />
        <g fill="#BEC1BD">
          {LANDMARKS.map((d) => (
            <path key={d} d={d} />
          ))}
        </g>
        {/* Glasfuge der Elbphilharmonie über dem Speicher */}
        <path d="M-12 606H96" stroke="#EEEEEB" strokeOpacity=".7" strokeWidth="1.2" />

        {/* Schiff, Heckansicht */}
        <path d="M110 590H570L563 630Q556 652 520 660H160Q124 652 117 630Z" fill="#1B1D1E" />
        <rect x="114" y="584" width="452" height="6" fill="#26292B" />
        <path d="M118 630H562L560 640H120Z" fill="#A8382A" />
        <text
          x="340"
          y="612"
          textAnchor="middle"
          fill="#EEEEEB"
          fontSize="12.5"
          letterSpacing="3.5"
          style={{ fontFamily: "var(--font-brand-sans)", fontStretch: "125%", fontWeight: 760 }}
        >
          SITALO
        </text>
        <text
          x="340"
          y="624"
          textAnchor="middle"
          fill="#EEEEEB"
          fillOpacity=".72"
          fontSize="7"
          letterSpacing="2.4"
          style={{ fontFamily: "var(--font-brand-mono)" }}
        >
          HAMBURG
        </text>
        <g>
          {CARGO.map((c) => (
            <Container key={c.key} x={c.x} y={c.y} fill={c.fill} dark={c.dark} />
          ))}
        </g>

        {/* Elbe */}
        <rect x="-1800" y="640" width="2400" height="140" fill="#D3D6D3" />
        <g fill="none" stroke="#1B1D1E">
          {WAVES.map((w) => (
            <line
              key={w.y}
              className="kb-wave"
              x1="-1800"
              y1={w.y}
              x2="588"
              y2={w.y}
              strokeOpacity={w.opacity}
              strokeWidth="1.1"
              strokeDasharray={w.dash}
              strokeDashoffset={w.offset}
              style={{ animationDuration: w.duration }}
            />
          ))}
          {/* Gebrochene Spiegelung des Rumpfs */}
          {REFLECTION.map(([y, dash, op, sw], i) => (
            <line key={y} x1="122" y1={y} x2="558" y2={y} strokeDasharray={dash} strokeOpacity={op} strokeWidth={sw} strokeDashoffset={i * 9} />
          ))}
        </g>
        <line x1="-1800" y1="640.5" x2="590" y2="640.5" stroke="#1B1D1E" strokeOpacity=".38" />

        {/* Kai: Spundwand mit Fugen, Fender, Poller, Festmacherleine */}
        <rect x="588" y="605" width="320" height="175" fill="#2A2E30" />
        <rect x="588" y="605" width="320" height="5" fill="#5A5F61" />
        <path d="M588 628H908M588 652H908M588 676H908M588 700H908" stroke="#1B1D1E" strokeOpacity=".55" />
        <path d="M640 610V780M700 610V780M760 610V780M820 610V780" stroke="#1B1D1E" strokeOpacity=".3" />
        <path d="M582 614h7v24h-7z M582 650h7v24h-7z M582 686h7v24h-7z" fill="#0F1011" />
        <path d="M596 605v-6q0-3 3-3h3q3 0 3 3v6z" fill="#1B1D1E" />
        <path d="M566 593Q585 606 601 600" fill="none" stroke="#1B1D1E" strokeWidth="1.3" />

        {/* Containerbrücke */}
        <g fill="#F45B1E">
          <rect x="684" y="212" width="112" height="38" fill="#F7F7F5" />
          <path d={LOUVER} stroke="#1B1D1E" strokeOpacity=".32" strokeWidth="1.2" />
          <rect x="684" y="212" width="112" height="4" fill="#1B1D1E" fillOpacity=".85" />
          <rect x="612" y="280" width="14" height="318" />
          <rect x="752" y="280" width="14" height="318" />
          <rect x="612" y="298" width="154" height="13" />
          <rect x="626" y="466" width="126" height="7" />
          <path d="M626 311L689 352L752 311" fill="none" stroke="#F45B1E" strokeWidth="5" />
          <rect x="603" y="596" width="32" height="9" fill="#1B1D1E" />
          <rect x="743" y="596" width="32" height="9" fill="#1B1D1E" />
          <rect x="98" y="250" width="702" height="6" />
          <rect x="98" y="274" width="702" height="6" />
          <rect x="794" y="250" width="6" height="30" />
          <rect x="96" y="250" width="7" height="30" />
          <path d={LATTICE} fill="none" stroke="#F45B1E" strokeWidth="2.6" />
          <path d="M612 250H626L671 100H661Z M752 250H766L679 100H669Z" />
          <rect x="638" y="176" width="84" height="6" />
          <rect x="656" y="88" width="28" height="14" rx="1.5" />
          <path d="M668 96L380 250M668 96L112 250M672 96L797 250" fill="none" stroke="#F45B1E" strokeWidth="2.4" />
        </g>
        <circle className="kb-blink" cx="670" cy="82" r="3.4" fill="#E02A1B" />

        {/* Laufkatze mit Seilen und Container. Endstellung x = 291,
            Container-Oberkante y = 443 (Lücke in Stapel 4). */}
        <g transform="translate(291 0)">
          <g className="kb-move">
            <rect x="-24" y="280" width="48" height="12" fill="#1B1D1E" />
            <rect x="-50" y="282" width="24" height="22" fill="#26292B" />
            <rect x="-47" y="286" width="18" height="8" fill="#EEEEEB" fillOpacity=".85" />
            <rect className="kb-rope" x="-14.65" y="292" width="1.3" height="143" fill="#1B1D1E" />
            <rect className="kb-rope" x="13.35" y="292" width="1.3" height="143" fill="#1B1D1E" />
            <g transform="translate(0 443)">
              <g className="kb-drop">
                <rect x="-30" y="-8" width="60" height="8" fill="#1B1D1E" />
                <rect x="-30" y="-8" width="60" height="2" fill="#F45B1E" />
                <g transform="translate(-23 0)">
                  <rect width="46" height="49" fill="#2B2F31" />
                  <rect x="2" y="2" width="42" height="45" fill="none" stroke="#fff" strokeOpacity=".16" />
                  <path d="M23 3V46M9 6V43M16 6V43M30 6V43M37 6V43" stroke="#fff" strokeOpacity=".26" strokeWidth="1.1" />
                  <path d="M0 0h5v4H0zM41 0h5v4h-5zM0 45h5v4H0zM41 45h5v4h-5z" fill="#000" fillOpacity=".45" />
                  <rect x="27" y="7" width="13" height="3" fill="#F45B1E" />
                </g>
              </g>
            </g>
          </g>
        </g>

        {/* Hinweislinie zur Beschriftung */}
        <g className="kb-note">
          <path d="M268 446L252 407" fill="none" stroke="#1B1D1E" strokeWidth="1" />
          <circle cx="268" cy="446" r="2.2" fill="#1B1D1E" />
        </g>
      </svg>

      <p className="hafen-note kb-note">
        <span className="label-mono text-foreground block text-[10.5px] sm:text-[11px]">SITALO 000499</span>
        <span className="text-foreground block text-[12px] font-semibold sm:text-[13px]">Starter ab 499 €</span>
      </p>
    </div>
  );
}
