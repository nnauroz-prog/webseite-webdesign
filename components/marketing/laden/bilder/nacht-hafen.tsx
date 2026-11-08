/**
 * Kontaktbild: Hamburger Hafen bei Nacht. Himmel #0b1a24 → #1d3340,
 * Elbphilharmonie mit warmen Fenstern, Michel, Fernsehturm mit rotem
 * Licht, oranger Kran mit Warnleuchte, Spiegelstreifen auf dem Wasser.
 * viewBox 440 × 400, unten bündig.
 */
export function NachtHafen() {
  const fenster: string[] = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 15; c++) {
      if ((r * 7 + c * 3) % 5 === 0) continue;
      fenster.push(`M${132 + c * 9} ${222 + r * 8}h5`);
    }
  }
  return (
    <svg
      viewBox="0 0 440 400"
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="ld-nacht" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0b1a24" />
          <stop offset="1" stopColor="#1d3340" />
        </linearGradient>
        <radialGradient id="nh-schein">
          <stop offset="0" stopColor="#ffd27a" stopOpacity=".7" />
          <stop offset="1" stopColor="#ffd27a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="nh-schein-rot">
          <stop offset="0" stopColor="#ff453a" stopOpacity=".8" />
          <stop offset="1" stopColor="#ff453a" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ld-nacht-wasser" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#13252f" />
          <stop offset="1" stopColor="#09141a" />
        </linearGradient>
      </defs>
      <rect width="440" height="400" fill="url(#ld-nacht)" />
      {/* Sterne */}
      <path
        d="M40 40h1M90 70h1M150 30h1M210 60h1M300 34h1M360 80h1M400 46h1M250 100h1M60 120h1"
        stroke="#fff"
        strokeOpacity=".7"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Stadt in der Ferne */}
      <path
        d="M0 290v-14h30v-8h26v10h22v-16h18v28ZM330 290v-12h20v-10h30v8h26v-6h34v20Z"
        fill="#1b2f3b"
      />
      {/* Fernsehturm */}
      <path
        d="M58 290l2-120h4l2 120Z M54 178h16v-8H54Z M56 168h12v-6H56Z"
        fill="#243d4b"
      />
      <path d="M61.5 162V128h1v34Z" fill="#243d4b" />
      <circle cx="62" cy="128" r="9" fill="url(#nh-schein-rot)" />
      <circle cx="62" cy="128" r="2" fill="#ff453a" />
      {/* Michel */}
      <path
        d="M86 290v-40l10-6h22l10 6v40ZM100 290v-82h14v82ZM101 208q6-14 12 0ZM106 196h2v-10h-2Z"
        fill="#22394a"
      />
      <circle cx="107" cy="232" r="3" fill="#ffcc80" fillOpacity=".85" />
      {/* Elbphilharmonie */}
      <path d="M126 290v-52h144v52Z" fill="#3a2a24" />
      <path
        d="M126 238v-22q10-14 24-18 18 12 34 4 16-12 34-8 18 12 34 6 12-2 18 8v30Z"
        fill="#2a4252"
      />
      <path d={fenster.join("")} stroke="#ffcc80" strokeWidth="3" />
      <path
        d="M134 250h4M150 262h4M170 250h4M196 270h4M222 256h4M248 266h4M140 276h4M210 280h4"
        stroke="#ffcc80"
        strokeOpacity=".7"
        strokeWidth="3"
      />
      <ellipse
        cx="198"
        cy="226"
        rx="90"
        ry="30"
        fill="url(#nh-schein)"
        opacity=".35"
      />
      {/* Oranger Kran rechts */}
      <g fill="#f45b1e">
        <path d="M330 290V170h7v120ZM356 290V170h7v120Z" />
        <path d="M262 164h150v9H262Z" />
        <path d="M337 170l16-36h7l-16 36Z" />
      </g>
      <path d="M280 173V214M288 173V214" stroke="#8e9499" strokeWidth="1.5" />
      <rect x="270" y="214" width="30" height="14" fill="#1f5f6b" />
      <circle cx="356" cy="132" r="10" fill="url(#nh-schein-rot)" />
      <circle cx="356" cy="132" r="2.4" fill="#ff453a" />
      <rect x="320" y="270" width="80" height="20" fill="#2a3e48" />
      {/* Wasser mit Spiegelstreifen */}
      <rect y="290" width="440" height="110" fill="url(#ld-nacht-wasser)" />
      <path d="M0 290H440" stroke="#ffcc80" strokeOpacity=".25" />
      <path
        d="M140 302h110M150 314h96"
        stroke="#ffcc80"
        strokeOpacity=".5"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M160 328h70M146 340h96"
        stroke="#ffcc80"
        strokeOpacity=".3"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M172 356h50M160 372h70"
        stroke="#ffcc80"
        strokeOpacity=".15"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M330 304h36M336 318h26"
        stroke="#f45b1e"
        strokeOpacity=".5"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M336 334h22"
        stroke="#f45b1e"
        strokeOpacity=".3"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        d="M58 302h8M60 316h4"
        stroke="#ff453a"
        strokeOpacity=".45"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
