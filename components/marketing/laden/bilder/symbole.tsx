/**
 * Symbole als App-Kacheln (56 × 56, Radius 13, Verlauf von oben, flächige
 * weiße Glyphe 24, Lichtkante 1 px) und die zwei Kreise im Kopf.
 * Jede Kachel ist ein eigenes kleines SVG mit eigenem Verlauf.
 */

function Kachel({
  id,
  von,
  bis,
  rand,
  children,
}: {
  id: string;
  von: string;
  bis: string;
  rand?: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 56 56"
      width="56"
      height="56"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`ld-k-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={von} />
          <stop offset="1" stopColor={bis} />
        </linearGradient>
      </defs>
      <rect width="56" height="56" rx="13" fill={`url(#ld-k-${id})`} />
      <rect
        x=".5"
        y=".5"
        width="55"
        height="55"
        rx="12.5"
        fill="none"
        stroke={rand ?? "#fff"}
        strokeOpacity={rand ? 1 : 0.35}
      />
      <g transform="translate(16 16)">{children}</g>
    </svg>
  );
}

/** Pinsel (Gestaltung) */
export function KachelPinsel() {
  return (
    <Kachel id="pinsel" von="#ff7a45" bis="#d9481a">
      <path d="M20.5 1.5c1.2-1 2.8.6 1.8 1.8L12 15l-3-3Z" fill="#fff" />
      <path
        d="M8 13l3 3c-.4 3.6-3.6 6.4-8.5 6.5 1.6-1.4 1.4-3.2 2-5.2C5.1 15.6 6.4 13.9 8 13Z"
        fill="#fff"
        fillOpacity=".92"
      />
    </Kachel>
  );
}

/** Mini-Container (Hosting und Pflege) */
export function KachelContainer() {
  return (
    <Kachel id="cont" von="#2b7686" bis="#17495a">
      <path d="M3 8l4-3h17l-4 3Z" fill="#fff" fillOpacity=".75" />
      <path d="M3 8v12l-0 0h17V8Z" fill="#fff" />
      <path d="M20 8l4-3v12l-4 3Z" fill="#fff" fillOpacity=".6" />
      <path
        d="M6.5 10v8M9.5 10v8M12.5 10v8M15.5 10v8"
        stroke="#1f5f6b"
        strokeOpacity=".45"
        strokeWidth="1.2"
      />
    </Kachel>
  );
}

/** Feder (Texte) */
export function KachelFeder() {
  return (
    <Kachel id="feder" von="#a3a9ad" bis="#6f7b84">
      <path
        d="M22 2C12 3 6 9 4 20l2 1C8 15 11 11 15 9c-3 3-5.5 6.5-7 11 7-1 12-6 14-18Z"
        fill="#fff"
      />
      <path
        d="M2 23l5-6"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </Kachel>
  );
}

/** Hörer (Anfragen) */
export function KachelHoerer() {
  return (
    <Kachel id="hoerer" von="#3d8462" bis="#1f4d39">
      <path
        d="M6.6 2.5l2.8 3.3c.6.7.5 1.7-.1 2.3L7.6 9.8c1.3 2.8 3.6 5.1 6.4 6.4l1.7-1.7c.6-.6 1.6-.7 2.3-.1l3.3 2.8c.8.7.8 1.9.1 2.6l-1.6 1.6c-1.2 1.2-3 1.5-4.5.8C9.5 19.6 4.4 14.5 1.8 8.7c-.7-1.5-.4-3.3.8-4.5L4.2 2.6c.7-.7 1.9-.7 2.4-.1Z"
        fill="#fff"
      />
    </Kachel>
  );
}

/** Kartennadel auf Weiß (Bei Google) */
export function KachelNadel() {
  return (
    <Kachel id="nadel" von="#ffffff" bis="#f2f2f4" rand="#e5e5ea">
      <path
        d="M12 1C7.3 1 4 4.6 4 9c0 5.6 8 14 8 14s8-8.4 8-14c0-4.4-3.3-8-8-8Z"
        fill="#f45b1e"
      />
      <circle cx="12" cy="9" r="3.2" fill="#fff" />
    </Kachel>
  );
}

/** Stift auf Tablet (Selbst pflegen) */
export function KachelStift() {
  return (
    <Kachel id="stift" von="#bd5a42" bis="#8f3a26">
      <rect x="1" y="3" width="17" height="20" rx="3" fill="#fff" />
      <path
        d="M4.5 8h9M4.5 11.5h7M4.5 15h8"
        stroke="#a5452f"
        strokeOpacity=".5"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M21.5 6.5l2 2-9 9-3 1 1-3Z"
        fill="#fff"
        stroke="#a5452f"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </Kachel>
  );
}

/** Zwei Sprechblasen (Direkt mit uns) */
export function KachelBlasen() {
  return (
    <Kachel id="blasen" von="#4a4a4d" bis="#1d1d1f">
      <path
        d="M2 4.5C2 3.1 3.1 2 4.5 2h11C16.9 2 18 3.1 18 4.5v7c0 1.4-1.1 2.5-2.5 2.5H8l-4 3.5V14h0c-1.1-.2-2-1.2-2-2.5Z"
        fill="#fff"
      />
      <path
        d="M20 8h.5C21.9 8 23 9.1 23 10.5v6c0 1.3-.9 2.3-2 2.5v3l-3.6-3H12c-1.4 0-2.5-1.1-2.5-2.5V16h6c2.5 0 4.5-2 4.5-4.5Z"
        fill="#fff"
        fillOpacity=".62"
      />
    </Kachel>
  );
}

/* ---------- Kreise im Kopf (Hilfe-Hinweise) ---------- */

export function KreisHoerer() {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true" focusable="false">
      <circle cx="18" cy="18" r="18" fill="#f45b1e" />
      <path
        d="M18 .5a17.5 17.5 0 0 1 17.5 17.5"
        fill="none"
        stroke="#fff"
        strokeOpacity=".35"
      />
      <path
        d="M13.4 9.6l2.2 2.6c.5.6.4 1.4-.1 1.9l-1.3 1.3c1 2.2 2.8 4 5 5l1.3-1.3c.5-.5 1.3-.6 1.9-.1l2.6 2.2c.6.5.7 1.5.1 2.1l-1.2 1.2c-1 1-2.4 1.2-3.6.7-4.6-2.1-8.6-6.1-10.7-10.7-.5-1.2-.3-2.6.7-3.6l1.2-1.2c.6-.6 1.5-.6 1.9-.1Z"
        fill="#fff"
      />
    </svg>
  );
}

export function KreisContainer() {
  return (
    <svg viewBox="0 0 36 36" aria-hidden="true" focusable="false">
      <circle cx="18" cy="18" r="17.5" fill="#fff" stroke="#d2d2d7" />
      <ellipse cx="18.5" cy="25" rx="11" ry="1.6" fill="url(#ld-kontakt)" />
      <path d="M8 15l3-2.6h17L25 15Z" fill="#2b7686" />
      <path d="M8 15v9h17v-9Z" fill="#1f5f6b" />
      <path d="M25 15l3-2.6v9L25 24Z" fill="#17495a" />
      <path
        d="M10.5 16.2v6.6M13 16.2v6.6M15.5 16.2v6.6M18 16.2v6.6M20.5 16.2v6.6M23 16.2v6.6"
        stroke="#fff"
        strokeOpacity=".22"
        strokeWidth=".9"
      />
      <path d="M8 15h17" stroke="#fff" strokeOpacity=".5" strokeWidth=".7" />
    </svg>
  );
}
