import { rr } from "./geraete";

/**
 * Motive der Journal-Karten: viewBox 320 × 200, randlos oben in der
 * Karte. Zuordnung nach Slug, sonst die Skyline mit orangem Kran.
 */
function Svg({
  children,
  grund,
}: {
  children: React.ReactNode;
  grund: string;
}) {
  return (
    <svg
      viewBox="0 0 320 200"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="320" height="200" fill={grund} />
      {children}
    </svg>
  );
}

function StadtplanProfil() {
  return (
    <Svg grund="#eef0ec">
      {/* Häuserblöcke und Straßen */}
      <path
        d="M0 40H320M0 96H320M0 150H320M64 0V200M150 0V200M236 0V200"
        stroke="#fff"
        strokeWidth="9"
      />
      <path
        d="M0 68H320M108 0V200M196 0V200M280 0V200"
        stroke="#fff"
        strokeWidth="4"
      />
      <path
        d="M-20 160C60 120 120 190 200 150S300 110 340 128V200H-20Z"
        fill="#bcd6df"
      />
      <path
        d="M-20 160C60 120 120 190 200 150S300 110 340 128"
        fill="none"
        stroke="#fff"
        strokeOpacity=".6"
        strokeWidth="2"
      />
      <rect x="160" y="104" width="30" height="40" fill="#cfe3c8" />
      {/* Nadel */}
      <ellipse cx="112" cy="122" rx="14" ry="4" fill="url(#ld-kontakt)" />
      <path
        d="M112 74c-12 0-21 9-21 21 0 15 21 27 21 27s21-12 21-27c0-12-9-21-21-21Z"
        fill="#f45b1e"
      />
      <path
        d="M112 74c-12 0-21 9-21 21 0 4 1.5 8 4 11.5C97 92 104 80 120 76c-2.5-1.3-5.2-2-8-2Z"
        fill="#fff"
        fillOpacity=".22"
      />
      <circle cx="112" cy="95" r="7" fill="#fff" />
      {/* Schwebende Profilkarte mit lesbarem Inhalt (frei erfundener Betrieb, ohne Sterne) */}
      <g fontFamily="inherit">
        <path d={rr(150, 16, 142, 126, 14)} fill="#000" fillOpacity=".12" transform="translate(4 8)" />
        <path d={rr(150, 16, 142, 126, 14)} fill="#fff" />
        <path d="M164 16h114a14 14 0 0 1 14 14v22H150V30a14 14 0 0 1 14-14Z" fill="#a5452f" />
        {/* Holzmaserung im Titelbild */}
        <path d="M150 26h142M150 36h142M150 46h142" stroke="#fff" strokeOpacity=".12" strokeWidth="3" />
        <path d="M186 16v36M230 16v36M268 16v36" stroke="#000" strokeOpacity=".1" />
        <text x="162" y="68" fontSize="10.5" fontWeight="700" fill="#1d1d1f">
          Tischlerei Nordholz
        </text>
        <text x="162" y="80" fontSize="8" fill="#5f5f64">
          Tischlerei · Hamburg
        </text>
        <text x="162" y="94" fontSize="8" fontWeight="600" fill="#1f7a4d">
          Geöffnet
        </text>
        <text x="198" y="94" fontSize="8" fill="#5f5f64">
          Mo–Fr 7–16 Uhr
        </text>
        {["Route", "Anrufen", "Website"].map((t, i) => (
          <g key={t} transform={`translate(${162 + i * 41} 106)`}>
            <path d={rr(0, 0, 37, 24, 12)} fill={i === 0 ? "#1f5f6b" : "#fff"} stroke={i === 0 ? "none" : "#d2d2d7"} />
            <text x="18.5" y="15.5" textAnchor="middle" fontSize="7.4" fontWeight="650" fill={i === 0 ? "#fff" : "#1f5f6b"}>
              {t}
            </text>
          </g>
        ))}
      </g>
    </Svg>
  );
}

function Pflichtblaetter() {
  return (
    <Svg grund="#f3efe8">
      <g transform="rotate(-7 120 110)">
        <rect
          x="56"
          y="34"
          width="124"
          height="170"
          rx="3"
          fill="#000"
          fillOpacity=".1"
          transform="translate(5 6)"
        />
        <rect x="56" y="34" width="124" height="170" rx="3" fill="#fff" />
        <text
          x="70"
          y="62"
          fontSize="15"
          fontWeight="700"
          fill="#1d1d1f"
          fontFamily="inherit"
        >
          Impressum
        </text>
        <path
          d="M70 80h90M70 92h70M70 104h84M70 124h60M70 136h88M70 148h76"
          stroke="#1d1d1f"
          strokeOpacity=".18"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
      <g transform="rotate(5 210 110)">
        <rect
          x="150"
          y="26"
          width="124"
          height="170"
          rx="3"
          fill="#000"
          fillOpacity=".12"
          transform="translate(5 6)"
        />
        <rect x="150" y="26" width="124" height="170" rx="3" fill="#fff" />
        <text
          x="164"
          y="54"
          fontSize="15"
          fontWeight="700"
          fill="#1d1d1f"
          fontFamily="inherit"
        >
          Datenschutz
        </text>
        <path
          d="M164 72h92M164 84h74M164 96h88M164 116h66M164 128h90M164 140h70M164 152h82"
          stroke="#1d1d1f"
          strokeOpacity=".18"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </g>
      {/* Büroklammer */}
      <path
        d="M162 8v52a10 10 0 0 0 20 0V18a6 6 0 0 0-12 0v38"
        fill="none"
        stroke="#8e9499"
        strokeWidth="3.5"
        strokeLinecap="round"
        transform="rotate(12 172 34)"
      />
    </Svg>
  );
}

function AdresseSchluessel() {
  return (
    <Svg grund="#1f5f6b">
      <circle cx="250" cy="40" r="120" fill="#2b7686" fillOpacity=".55" />
      {/* Messingschlüssel */}
      <g transform="rotate(-18 160 140)">
        <ellipse
          cx="166"
          cy="176"
          rx="90"
          ry="6"
          fill="#000"
          fillOpacity=".18"
        />
        <circle cx="96" cy="140" r="30" fill="#c9a96e" />
        <circle cx="96" cy="140" r="12" fill="#1f5f6b" />
        <path
          d="M96 110a30 30 0 0 1 28 18"
          fill="none"
          stroke="#fff"
          strokeOpacity=".4"
          strokeWidth="3"
        />
        <rect x="122" y="132" width="132" height="16" rx="4" fill="#c9a96e" />
        <rect
          x="122"
          y="132"
          width="132"
          height="5"
          rx="2"
          fill="#fff"
          fillOpacity=".35"
        />
        <path d="M216 148h10v14h-10ZM236 148h8v10h-8Z" fill="#b08e55" />
      </g>
      {/* Adressleiste aus Glas */}
      <path d={rr(40, 34, 240, 44, 22)} fill="#fff" fillOpacity=".86" />
      <path d={rr(40.5, 34.5, 239, 43, 21.5)} fill="none" stroke="#fff" />
      <path
        d="M62 52v-3a5 5 0 0 1 10 0v3"
        fill="none"
        stroke="#1d1d1f"
        strokeOpacity=".6"
        strokeWidth="2"
      />
      <rect
        x="60"
        y="52"
        width="14"
        height="10"
        rx="2"
        fill="#1d1d1f"
        fillOpacity=".6"
      />
      <text
        x="86"
        y="62"
        fontSize="17"
        fontWeight="600"
        fill="#1d1d1f"
        fontFamily="inherit"
      >
        ihr-betrieb.de
      </text>
    </Svg>
  );
}

/** Abendhafen: Skyline vor warmem Himmel, oranger Kran, Schiff mit Containern. */
function SkylineKran() {
  const farben = ["#f45b1e", "#1f5f6b", "#8e9499", "#2f6b4f", "#a5452f", "#f2f2f4", "#2f5a8a"];
  return (
    <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="ld-j-himmel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#5e8c99" />
          <stop offset=".55" stopColor="#e9b892" />
          <stop offset="1" stopColor="#f7c99f" />
        </linearGradient>
        <linearGradient id="ld-j-wasser" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3c7887" />
          <stop offset="1" stopColor="#1f4e5a" />
        </linearGradient>
      </defs>
      <rect width="320" height="200" fill="url(#ld-j-himmel)" />
      <circle cx="96" cy="118" r="26" fill="#ffd9a8" fillOpacity=".85" />
      {/* Stadt: Dächer, Michel, Fernsehturm, Elbphilharmonie */}
      <g fill="#4d6f78">
        <path d="M0 140V128h22v-6h18v8h26v-5h14v15Z" />
        <path d="M84 140v-16l6-4h18l6 4v16ZM93 140V92h12v48ZM95 92q4-11 8 0ZM98 82h2v-8h-2Z" />
        <path d="M122 140V100h3v40ZM119 104h9v4h-9Z" />
        <path d="M132 140v-10h34v10Z" />
      </g>
      <path d="M170 140v-14h54v14Z" fill="#7a3f27" />
      <path d="M170 126v-8q6-8 13-9 10 6 18 2 9-6 23 4v11Z" fill="#46606b" />
      <path d="M174 118h46M174 122h48" stroke="#ffd27a" strokeOpacity=".8" strokeWidth="1.2" strokeDasharray="2 3" />
      {/* Oranger Kran rechts */}
      <g fill="#f45b1e">
        <path d="M262 150V62h6v88ZM290 150V62h6v88ZM258 92h42v5h-42Z" />
        <path d="M196 56h124v7H196Z" />
        <path d="M268 62l18-30h5l-17 30Z" />
      </g>
      <path d="M198 56l88-24M246 56l40-24" stroke="#f45b1e" strokeWidth="1.2" />
      <path d="M222 63V96M228 63V96" stroke="#2a2e30" strokeWidth="1.2" />
      <rect x="214" y="96" width="22" height="10" fill="#1f5f6b" />
      {/* Schiff mit Containerreihen */}
      <path d="M150 150h112l-8 14H158Z" fill="#1d1d1f" />
      <rect x="150" y="149" width="112" height="3" fill="#f45b1e" />
      {[0, 1].map((r) =>
        Array.from({ length: 8 }, (_, c) => (
          <rect
            key={`${r}-${c}`}
            x={158 + c * 12}
            y={139 - r * 10}
            width="11"
            height="9"
            fill={farben[(c * 3 + r * 2) % farben.length]}
          />
        )),
      )}
      {/* Wasser mit Abendglanz */}
      <rect y="150" width="320" height="50" fill="url(#ld-j-wasser)" />
      <path d="M70 160h52M80 170h34M88 180h20" stroke="#ffd9a8" strokeOpacity=".7" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 176h40M170 172h70M250 186h50M20 192h60" stroke="#fff" strokeOpacity=".35" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function JournalBild({ slug }: { slug: string }) {
  if (slug.includes("google")) return <StadtplanProfil />;
  if (slug.includes("pflichtangaben")) return <Pflichtblaetter />;
  if (slug.includes("domain")) return <AdresseSchluessel />;
  return <SkylineKran />;
}
