import { ton } from "./farbe";

/**
 * Kopfmotive der Musterseiten, flächig in drei bis vier Tonstufen der
 * Akzentfarbe, Licht von oben links. Jedes Motiv zeichnet in eine
 * viewBox von 420 × 296 (Seitenverhältnis des Kopfbilds der Muster-
 * Website am Rechner; am Handy wird es oben/unten angeschnitten).
 */
export const MOTIV_W = 420;
export const MOTIV_H = 296;

export function BranchenMotiv({ motiv, a }: { motiv: string; a: string }) {
  const t = {
    wand: ton(a, 0.9),
    hell: ton(a, 0.72),
    mittel: ton(a, 0.42),
    voll: a,
    tief: ton(a, -0.35),
  };
  const M = MOTIVE[motiv] ?? MOTIVE.handwerk;
  return <g>{M(a, t)}</g>;
}

type Toene = {
  wand: string;
  hell: string;
  mittel: string;
  voll: string;
  tief: string;
};

const MOTIVE: Record<string, (a: string, t: Toene) => React.ReactNode> = {
  /* Hauseingang: Fassade, Tür mit Oberlicht, Vordach, zwei Fenster mit
     Gardinen, drei Büsche, Stufe. */
  pflege: (a, t) => (
    <>
      <rect width="420" height="296" fill="#f4efe7" />
      <rect width="420" height="296" fill="url(#ld-flaeche-quer)" />
      <rect y="250" width="420" height="46" fill="#ddd5c8" />
      <rect y="250" width="420" height="3" fill="#000" fillOpacity=".08" />
      {/* Fenster links und rechts */}
      {[46, 300].map((x) => (
        <g key={x}>
          <rect x={x - 6} y="66" width="86" height="112" rx="3" fill="#fff" />
          <rect x={x} y="72" width="74" height="100" fill={t.hell} />
          <path d={`M${x} 72h37v100c-14-20-24-52-37-60Z`} fill="#eef5f2" />
          <path d={`M${x + 74} 72h-37v100c14-20 24-52 37-60Z`} fill="#e3eee9" />
          <rect x={x + 36} y="72" width="2" height="100" fill="#fff" />
          <rect
            x={x - 10}
            y="178"
            width="94"
            height="6"
            rx="2"
            fill="#e8e1d6"
          />
        </g>
      ))}
      {/* Vordach */}
      <path d="M150 74H270L282 92H138Z" fill={t.tief} />
      <rect
        x="138"
        y="92"
        width="144"
        height="5"
        fill="#000"
        fillOpacity=".18"
      />
      {/* Tür */}
      <rect x="170" y="98" width="80" height="152" fill="#fff" />
      <rect x="176" y="104" width="68" height="146" fill={a} />
      <rect
        x="176"
        y="104"
        width="68"
        height="146"
        fill="url(#ld-flaeche-quer)"
      />
      <rect x="186" y="116" width="48" height="40" rx="2" fill={t.hell} />
      <path d="M186 116h48v20L186 150Z" fill="#fff" fillOpacity=".25" />
      <rect
        x="186"
        y="168"
        width="48"
        height="66"
        rx="2"
        fill={t.tief}
        fillOpacity=".35"
      />
      <circle cx="234" cy="184" r="3.5" fill="#e9c46a" />
      <rect x="258" y="122" width="22" height="16" rx="2" fill="#fff" />
      <rect x="262" y="128" width="14" height="4" rx="1" fill={a} />
      {/* Stufe und Büsche */}
      <rect x="160" y="246" width="100" height="10" rx="2" fill="#c9c0b2" />
      <circle cx="122" cy="236" r="26" fill="#4f8a76" />
      <circle cx="96" cy="244" r="20" fill={ton("#4f8a76", -0.15)} />
      <circle cx="304" cy="238" r="24" fill="#4f8a76" />
      <circle cx="116" cy="226" r="9" fill="#fff" fillOpacity=".14" />
      <circle cx="298" cy="228" r="8" fill="#fff" fillOpacity=".14" />
    </>
  ),

  /* Werkbank mit Hobel, Maserung und Spänen, Werkzeugwand. */
  handwerk: (a, t) => (
    <>
      <rect width="420" height="296" fill={t.wand} />
      {/* Lochwand mit Säge und Winkel */}
      <rect x="40" y="26" width="340" height="120" rx="6" fill="#efe4d8" />
      <path d="M86 46h96l-8 40H92Z" fill="#c7c7cc" />
      <rect x="66" y="50" width="24" height="34" rx="8" fill={t.tief} />
      <path d="M222 44h10v80h-10Z M222 114h70v10h-70Z" fill={t.mittel} />
      <circle
        cx="330"
        cy="70"
        r="20"
        fill="none"
        stroke={t.tief}
        strokeWidth="6"
      />
      {/* Tischplatte mit Dielen */}
      <path d="M0 170H420V218H0Z" fill="#c98a5a" />
      <path d="M0 170H420V178H0Z" fill="#d9a477" />
      <path
        d="M0 196H420M140 178V218M290 178V218"
        stroke="#a8693f"
        strokeWidth="1.5"
      />
      <path
        d="M20 186c40-4 70 4 110 0M160 206c50-5 80 3 120-1M300 188c30-3 60 3 110 0"
        stroke="#b4572a"
        strokeOpacity=".45"
        strokeWidth="1.4"
        fill="none"
      />
      <rect y="218" width="420" height="8" fill="#8a4f25" />
      <rect x="36" y="226" width="22" height="70" fill="#9a5a30" />
      <rect x="362" y="226" width="22" height="70" fill="#9a5a30" />
      {/* Hobel */}
      <ellipse cx="210" cy="172" rx="92" ry="8" fill="url(#ld-kontakt)" />
      <path d="M130 170L144 138H282L296 170Z" fill={a} />
      <path d="M144 138H282L286 146H140Z" fill="#fff" fillOpacity=".22" />
      <path d="M170 138c4-28 22-36 40-36s28 10 30 20l-14 16Z" fill={t.tief} />
      <circle cx="268" cy="132" r="13" fill={t.tief} />
      <rect x="198" y="120" width="10" height="20" rx="2" fill="#8e9499" />
      {/* Späne */}
      <path
        d="M306 168c10-18 34-16 34-2s-20 10-18 0"
        fill="none"
        stroke="#e8c39b"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path
        d="M340 168c8-12 26-10 24 2"
        fill="none"
        stroke="#dcae7f"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </>
  ),

  /* Behandlungsraum: Fenster mit Jalousie, Liege, Rollhocker, Pflanze. */
  praxis: (a, t) => (
    <>
      <rect width="420" height="296" fill="#f3f6f9" />
      <rect y="224" width="420" height="72" fill="#dfe6ec" />
      <rect x="230" y="34" width="150" height="130" rx="4" fill="#fff" />
      <rect x="238" y="42" width="134" height="114" fill="#cfe3f1" />
      {Array.from({ length: 9 }, (_, i) => (
        <rect
          key={i}
          x="238"
          y={44 + i * 12.4}
          width="134"
          height="6"
          fill="#fff"
          fillOpacity=".75"
        />
      ))}
      <rect x="226" y="164" width="158" height="6" rx="2" fill="#e5ebf0" />
      {/* Liege */}
      <ellipse cx="160" cy="262" rx="140" ry="10" fill="url(#ld-boden)" />
      <rect x="54" y="180" width="216" height="26" rx="10" fill={a} />
      <rect
        x="54"
        y="180"
        width="216"
        height="10"
        rx="5"
        fill="#fff"
        fillOpacity=".16"
      />
      <path d="M54 186c0-22 16-34 46-34h12v28H54Z" fill={ton(a, -0.15)} />
      <rect x="70" y="162" width="46" height="18" rx="9" fill="#fff" />
      <rect x="64" y="206" width="196" height="8" fill="#8e9499" />
      <path d="M84 214v46M240 214v46" stroke="#a1a1a6" strokeWidth="6" />
      <rect x="70" y="258" width="190" height="6" rx="3" fill="#8e9499" />
      {/* Papierrolle über der Liege */}
      <rect
        x="120"
        y="176"
        width="110"
        height="5"
        fill="#fff"
        fillOpacity=".7"
      />
      {/* Pflanze */}
      <path d="M344 232h30l-4 34h-22Z" fill={t.mittel} />
      <path
        d="M359 232c-20-20-22-46-6-58 2 24 6 40 6 58Zm0 0c18-22 30-36 26-60-14 12-22 34-26 60Z"
        fill="#4f8a76"
      />
    </>
  ),

  /* Salon: ovaler Spiegel mit Rahmen, Friseurstuhl, Ablage mit Flaschen. */
  friseur: (a, t) => (
    <>
      <rect width="420" height="296" fill={t.wand} />
      <rect y="236" width="420" height="60" fill="#e9e1e5" />
      {/* Spiegel */}
      <ellipse cx="210" cy="104" rx="84" ry="92" fill="#d6c6cf" />
      <ellipse cx="210" cy="104" rx="76" ry="84" fill="#eef1f4" />
      <path d="M160 40L246 30L176 178L150 150Z" fill="#fff" fillOpacity=".55" />
      <ellipse
        cx="210"
        cy="104"
        rx="76"
        ry="84"
        fill="none"
        stroke="#fff"
        strokeOpacity=".6"
        strokeWidth="1.5"
      />
      {/* Ablage mit Flaschen */}
      <rect x="60" y="176" width="300" height="10" rx="3" fill="#fff" />
      <rect x="84" y="148" width="16" height="28" rx="4" fill={t.mittel} />
      <rect x="104" y="140" width="14" height="36" rx="4" fill={t.voll} />
      <rect x="322" y="152" width="18" height="24" rx="4" fill={t.hell} />
      {/* Stuhl */}
      <ellipse cx="210" cy="284" rx="78" ry="8" fill="url(#ld-kontakt)" />
      <path
        d="M160 132h100c8 0 12 6 12 14l-6 76H154l-6-76c0-8 4-14 12-14Z"
        fill={a}
      />
      <path
        d="M160 132h100c8 0 12 6 12 14l-1 10H149l-1-10c0-8 4-14 12-14Z"
        fill="#fff"
        fillOpacity=".16"
      />
      <rect x="138" y="196" width="144" height="22" rx="11" fill={t.tief} />
      <rect x="132" y="186" width="28" height="12" rx="6" fill="#1d1d1f" />
      <rect x="260" y="186" width="28" height="12" rx="6" fill="#1d1d1f" />
      <rect x="200" y="218" width="20" height="48" fill="#a1a1a6" />
      <rect
        x="200"
        y="218"
        width="7"
        height="48"
        fill="#fff"
        fillOpacity=".4"
      />
      <ellipse cx="210" cy="272" rx="52" ry="9" fill="#8e9499" />
      <ellipse cx="210" cy="269" rx="52" ry="8" fill="#c7c7cc" />
    </>
  ),

  /* Tisch von oben: Untertasse, Tasse mit Crema und Herz, Löffel, Gebäck. */
  gastro: (a, t) => (
    <>
      <rect width="420" height="296" fill="#e9dccd" />
      {[0, 74, 148, 222].map((y) => (
        <rect
          key={y}
          y={y}
          width="420"
          height="72"
          fill={y % 148 ? "#e3d3c1" : "#eadccb"}
        />
      ))}
      <path
        d="M0 40c80-6 160 4 240-2s120 4 180 0M0 190c90 4 160-6 250 0s110-4 170 0"
        stroke="#d2bea8"
        strokeWidth="2"
        fill="none"
      />
      {/* Gebäck links */}
      <ellipse cx="88" cy="210" rx="62" ry="40" fill="url(#ld-boden)" />
      <path
        d="M40 196c14-26 74-30 96-4-8 18-26 24-48 24s-40-6-48-20Z"
        fill="#d9a16a"
      />
      <path
        d="M58 188c10 8 20 12 30 12M84 178c4 10 10 18 22 22M110 182c-2 8 0 14 6 18"
        stroke="#a6662f"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      {/* Untertasse und Tasse */}
      <circle cx="252" cy="152" r="104" fill="url(#ld-boden)" />
      <circle cx="244" cy="144" r="96" fill="#fff" />
      <circle cx="244" cy="144" r="96" fill="url(#ld-flaeche)" />
      <circle cx="244" cy="144" r="74" fill="#f2f2f4" />
      <path
        d="M318 114c30-6 44 8 40 26s-22 22-42 14"
        fill="none"
        stroke="#fff"
        strokeWidth="16"
        strokeLinecap="round"
      />
      <circle cx="244" cy="144" r="64" fill="#fff" />
      <circle cx="244" cy="144" r="54" fill="url(#ld-crema)" />
      <path
        d="M244 176c-26-16-36-30-28-42 6-8 20-6 28 6 8-12 22-14 28-6 8 12-2 26-28 42Z"
        fill="#f3e2cc"
      />
      <ellipse
        cx="226"
        cy="124"
        rx="12"
        ry="5"
        fill="#fff"
        fillOpacity=".25"
        transform="rotate(-30 226 124)"
      />
      {/* Löffel */}
      <path
        d="M170 236l58-52"
        stroke="#c7c7cc"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <ellipse
        cx="164"
        cy="242"
        rx="10"
        ry="7"
        fill="#d1d1d6"
        transform="rotate(-42 164 242)"
      />
      <rect
        x="352"
        y="40"
        width="40"
        height="26"
        rx="4"
        fill={a}
        fillOpacity=".85"
        transform="rotate(12 372 53)"
      />
      <rect
        x="352"
        y="40"
        width="40"
        height="8"
        rx="3"
        fill={t.tief}
        transform="rotate(12 372 53)"
      />
    </>
  ),

  /* Treppenhaus: Stufen, Geländer, Fenster, Eimer. */
  reinigung: (a, t) => (
    <>
      <rect width="420" height="296" fill="#eef4f5" />
      <rect x="40" y="30" width="80" height="110" rx="3" fill="#fff" />
      <rect x="46" y="36" width="68" height="98" fill="#cde6ec" />
      <path d="M46 36h68v34L46 104Z" fill="#fff" fillOpacity=".35" />
      {/* Stufen */}
      <path
        d="M140 296V256H190V226H240V196H290V166H340V136H390V106H420V296Z"
        fill="#dfe8ea"
      />
      <path
        d="M140 256H190M190 226H240M240 196H290M290 166H340M340 136H390M390 106H420"
        stroke="#fff"
        strokeWidth="4"
      />
      <path
        d="M140 262H190V256M190 232H240M240 202H290M290 172H340M340 142H390"
        stroke="#000"
        strokeOpacity=".08"
        strokeWidth="6"
      />
      {/* Geländer */}
      <path
        d="M150 196L410 46"
        stroke={a}
        strokeWidth="9"
        strokeLinecap="round"
      />
      <path
        d="M150 196L410 46"
        stroke="#fff"
        strokeOpacity=".3"
        strokeWidth="2"
        transform="translate(-1 -3)"
      />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <path
          key={i}
          d={`M${165 + i * 50} ${188 - i * 29}V${256 - i * 30}`}
          stroke={ton(a, -0.1)}
          strokeWidth="4"
        />
      ))}
      {/* Eimer mit Wischer */}
      <ellipse cx="80" cy="282" rx="52" ry="7" fill="url(#ld-kontakt)" />
      <path d="M44 214h72l-8 66H52Z" fill={a} />
      <path d="M44 214h72l-1 10H45Z" fill="#fff" fillOpacity=".25" />
      <path
        d="M46 214c0-26 68-26 68 0"
        fill="none"
        stroke={t.tief}
        strokeWidth="3"
      />
      <path
        d="M96 210L130 70"
        stroke="#c7c7cc"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <rect x="66" y="198" width="44" height="14" rx="4" fill={t.mittel} />
    </>
  ),

  /* Bücherwand mit zwölf Rücken, Leselampe. */
  kanzlei: (a, t) => {
    const ruecken = [
      [34, 28, t.voll],
      [62, 22, t.tief],
      [84, 30, "#8a6d3b"],
      [114, 24, t.mittel],
      [138, 34, t.voll],
      [172, 20, "#c9a96e"],
    ] as const;
    return (
      <>
        <rect width="420" height="296" fill="#ece8e1" />
        <rect x="18" y="16" width="384" height="264" rx="4" fill="#6b4a2b" />
        <rect x="26" y="24" width="368" height="248" fill="#4e3520" />
        <g id="ld-buecher">
          {ruecken.map(([x, w, c], i) => {
            const h = 92 - ((i * 13) % 22);
            return (
              <g key={x}>
                <rect x={x} y={124 - h} width={w} height={h} fill={c} />
                <path
                  d={`M${x + 3} ${124 - h + 15.5}h${w - 6}M${x + 3} ${124 - h + 23.5}h${w - 6}`}
                  stroke="#c9a96e"
                  strokeWidth="3"
                />
              </g>
            );
          })}
          <path
            d="M34 32h8v92h-8ZM84 32h9v92h-9ZM138 32h10v92h-10Z"
            fill="#fff"
            fillOpacity=".08"
          />
        </g>
        <use href="#ld-buecher" transform="translate(192 128)" />
        <rect x="26" y="124" width="368" height="10" fill="#7a5634" />
        <rect x="26" y="252" width="368" height="20" fill="#7a5634" />
        {/* Leselampe rechts oben und Stapel */}
        <path
          d="M262 124V70l40-20"
          stroke="#c9a96e"
          strokeWidth="4"
          fill="none"
        />
        <path d="M290 40h48l10 26h-68Z" fill="#1f5f4f" />
        <ellipse cx="314" cy="66" rx="34" ry="6" fill="url(#ld-schein)" />
        <rect x="300" y="110" width="74" height="14" rx="2" fill={t.hell} />
        <rect x="306" y="96" width="62" height="14" rx="2" fill={t.voll} />
        <rect
          x="40"
          y="226"
          width="110"
          height="26"
          rx="2"
          fill="#efe9dc"
          transform="rotate(-6 95 239)"
        />
      </>
    );
  },

  /* Kurzhantel auf Bank, Bodenmatte, Wandstreifen. */
  fitness: (a, t) => (
    <>
      <rect width="420" height="296" fill="#2a2a2d" />
      <rect y="70" width="420" height="10" fill={a} />
      <rect y="86" width="420" height="4" fill={a} fillOpacity=".6" />
      <rect y="222" width="420" height="74" fill="#1d1d1f" />
      <rect y="222" width="420" height="2" fill="#fff" fillOpacity=".08" />
      {/* Bank */}
      <ellipse cx="210" cy="276" rx="150" ry="10" fill="url(#ld-kontakt)" />
      <rect x="70" y="182" width="280" height="30" rx="12" fill="#3a3a3c" />
      <rect
        x="70"
        y="182"
        width="280"
        height="10"
        rx="6"
        fill="#fff"
        fillOpacity=".1"
      />
      <path d="M110 212v58M310 212v58" stroke="#8e9499" strokeWidth="10" />
      <path
        d="M86 270h48M286 270h48"
        stroke="#8e9499"
        strokeWidth="8"
        strokeLinecap="round"
      />
      {/* Kurzhantel */}
      <ellipse cx="210" cy="184" rx="96" ry="6" fill="url(#ld-kontakt)" />
      <rect x="146" y="148" width="128" height="10" rx="4" fill="#c7c7cc" />
      {[126, 274].map((x) => (
        <g key={x}>
          <rect x={x} y="118" width="20" height="70" rx="5" fill={a} />
          <rect
            x={x + (x < 200 ? -14 : 20)}
            y="128"
            width="14"
            height="50"
            rx="4"
            fill={ton(a, -0.2)}
          />
          <rect
            x={x}
            y="118"
            width="20"
            height="16"
            rx="5"
            fill="#fff"
            fillOpacity=".2"
          />
        </g>
      ))}
      <rect
        x="300"
        y="120"
        width="60"
        height="6"
        rx="3"
        fill={t.mittel}
        fillOpacity=".4"
      />
    </>
  ),

  /* Fensterbogen zum Fleet: Speicher gegenüber, Wasserlinien, Vorhänge. */
  hotel: (a, t) => (
    <>
      <rect width="420" height="296" fill="#f2efe9" />
      <path d="M110 286V120a100 100 0 0 1 200 0V286Z" fill="#fff" />
      <path d="M122 286V122a88 88 0 0 1 176 0V286Z" fill="#cfe1e8" />
      {/* Speicherstadt gegenüber */}
      <path
        d="M122 176h40v-30l14-14 14 14v30h28v-44l16-18 16 18v44h48v40H122Z"
        fill="#a0523a"
      />
      <path d="M122 176h176v8H122Z" fill="#000" fillOpacity=".12" />
      {[134, 148, 196, 232, 248, 270].map((x) => (
        <rect
          key={x}
          x={x}
          y="152"
          width="6"
          height="12"
          rx="3"
          fill="#5a2a1d"
        />
      ))}
      <rect x="122" y="216" width="176" height="70" fill={t.mittel} />
      <path
        d="M134 232h50M200 244h70M140 258h40M210 268h60M150 278h80"
        stroke="#fff"
        strokeOpacity=".7"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M122 216h176" stroke="#fff" strokeOpacity=".5" />
      <path d="M210 30V286M122 200H298" stroke="#fff" strokeWidth="6" />
      {/* Vorhänge */}
      <path d="M80 20h44c-10 90-6 180 10 270H80Z" fill={a} />
      <path d="M340 20h-44c10 90 6 180-10 270h54Z" fill={a} />
      <path
        d="M80 20h16c-4 90 0 180 12 270H80Z"
        fill="#fff"
        fillOpacity=".12"
      />
      <rect x="66" y="12" width="288" height="8" rx="4" fill={t.tief} />
      <rect x="104" y="282" width="212" height="10" rx="2" fill="#e5ded2" />
    </>
  ),

  /* Tiegel und Pinsel, Fläschchen, Blatt. */
  kosmetik: (a, t) => (
    <>
      <rect width="420" height="296" fill={t.wand} />
      <rect y="200" width="420" height="96" fill="#efe6e9" />
      <rect y="200" width="420" height="2" fill="#fff" />
      {/* Fläschchen hinten */}
      <ellipse cx="96" cy="214" rx="40" ry="6" fill="url(#ld-kontakt)" />
      <rect x="72" y="110" width="48" height="104" rx="10" fill={t.hell} />
      <rect
        x="72"
        y="110"
        width="16"
        height="104"
        rx="8"
        fill="#fff"
        fillOpacity=".35"
      />
      <rect x="84" y="78" width="24" height="34" rx="4" fill={t.tief} />
      <ellipse cx="96" cy="76" rx="14" ry="8" fill="#1d1d1f" />
      {/* Tiegel */}
      <ellipse cx="216" cy="244" rx="88" ry="12" fill="url(#ld-kontakt)" />
      <path d="M146 182v50c0 10 32 16 70 16s70-6 70-16v-50Z" fill="#fff" />
      <path
        d="M146 182v50c0 10 32 16 70 16v-66Z"
        fill="#000"
        fillOpacity=".04"
      />
      <ellipse cx="216" cy="182" rx="70" ry="16" fill={a} />
      <path d="M146 152v30c0 10 32 16 70 16s70-6 70-16v-30Z" fill={a} />
      <path
        d="M150 156v26c0 8 30 13 66 13"
        fill="none"
        stroke="#fff"
        strokeOpacity=".22"
        strokeWidth="6"
      />
      <ellipse cx="216" cy="152" rx="70" ry="16" fill={ton(a, 0.18)} />
      <ellipse cx="200" cy="148" rx="30" ry="5" fill="#fff" fillOpacity=".25" />
      {/* Pinsel */}
      <path
        d="M262 236L372 92"
        stroke={t.tief}
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path d="M355 114l18-24 8 6-18 24Z" fill="#c9a96e" />
      <path d="M372 92c8-18 22-28 32-24 4 10-6 26-24 34Z" fill="#e8c9b8" />
      {/* Blatt */}
      <path d="M318 234c10-26 40-36 66-28-6 24-34 38-66 28Z" fill="#7a9a7e" />
      <path
        d="M320 232c18-8 36-16 58-22"
        stroke="#fff"
        strokeOpacity=".35"
        strokeWidth="1.5"
        fill="none"
      />
    </>
  ),
};
