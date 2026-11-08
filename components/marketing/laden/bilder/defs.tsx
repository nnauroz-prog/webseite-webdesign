/**
 * Gemeinsame SVG-Definitionen der Startseite, einmal pro Seite: Verläufe,
 * Riffel-Muster der Container und Schatten. Die Bilder verweisen per
 * url(#ld-…) darauf. Nicht display:none (dann malen Chrome und Firefox
 * keine Verläufe), sondern 0 × 0 und aus dem Fluss genommen.
 *
 * Lichtregel für alle Bilder: Licht von oben links. Dächer und Ober-
 * kanten heller, rechte und untere Flächen dunkler, Bodenschatten als
 * weiche Ellipse (radialGradient, kein Blur-Filter).
 */
export function LadenDefs() {
  return (
    <svg
      width="0"
      height="0"
      aria-hidden="true"
      focusable="false"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <defs>
        {/* Bodenschatten: weich, und ein dunkler Kontaktschatten */}
        <radialGradient id="ld-boden">
          <stop offset="0" stopColor="#000" stopOpacity=".16" />
          <stop offset=".55" stopColor="#000" stopOpacity=".07" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ld-kontakt">
          <stop offset="0" stopColor="#000" stopOpacity=".34" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        {/* Spiegelung auf Bildschirmen: diagonaler Weißverlauf 0 → 8 % */}
        <linearGradient id="ld-glanz" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".1" />
          <stop offset=".45" stopColor="#fff" stopOpacity=".04" />
          <stop offset=".46" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        {/* Aluminium: Grundplatte (senkrecht) und Standfuß (waagerecht) */}
        <linearGradient id="ld-alu" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ececf0" />
          <stop offset=".5" stopColor="#d2d2d7" />
          <stop offset="1" stopColor="#a1a1a6" />
        </linearGradient>
        <linearGradient id="ld-alu-quer" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#c7c7cc" />
          <stop offset=".35" stopColor="#ebebef" />
          <stop offset=".7" stopColor="#d1d1d6" />
          <stop offset="1" stopColor="#b5b5ba" />
        </linearGradient>
        <linearGradient id="ld-rahmen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3a3a3c" />
          <stop offset=".5" stopColor="#1d1d1f" />
          <stop offset="1" stopColor="#2c2c2e" />
        </linearGradient>
        {/* Container: Riffel der Seitenwand (hell/dunkel ±6 %) */}
        <pattern
          id="ld-riffel"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
        >
          <rect width="5" height="10" fill="#fff" fillOpacity=".09" />
          <rect x="5" width="1.2" height="10" fill="#000" fillOpacity=".14" />
          <rect x="6.2" width="3.8" height="10" fill="#000" fillOpacity=".05" />
        </pattern>
        <pattern
          id="ld-riffel-fein"
          width="5"
          height="5"
          patternUnits="userSpaceOnUse"
        >
          <rect width="2.5" height="5" fill="#fff" fillOpacity=".1" />
          <rect x="2.5" width=".7" height="5" fill="#000" fillOpacity=".16" />
          <rect x="3.2" width="1.8" height="5" fill="#000" fillOpacity=".05" />
        </pattern>
        {/* Licht über eine Fläche: oben heller, unten dunkler */}
        <linearGradient id="ld-flaeche" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".16" />
          <stop offset=".5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".12" />
        </linearGradient>
        <linearGradient id="ld-flaeche-quer" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity=".14" />
          <stop offset="1" stopColor="#000" stopOpacity=".12" />
        </linearGradient>
        {/* Crema der Tasse (Café) */}
        <radialGradient id="ld-crema" cx=".42" cy=".4" r=".62">
          <stop offset="0" stopColor="#d9a16a" />
          <stop offset=".45" stopColor="#c8894f" />
          <stop offset="1" stopColor="#8a4f25" />
        </radialGradient>
        {/* Warmes Licht (Fenster, Leuchten) */}
        <radialGradient id="ld-schein">
          <stop offset="0" stopColor="#ffd27a" stopOpacity=".7" />
          <stop offset="1" stopColor="#ffd27a" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="ld-schein-rot">
          <stop offset="0" stopColor="#ff453a" stopOpacity=".8" />
          <stop offset="1" stopColor="#ff453a" stopOpacity="0" />
        </radialGradient>
        {/* Symbolkacheln: Lichtkante oben */}
        <linearGradient id="ld-kachel-licht" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".22" />
          <stop offset=".5" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity=".1" />
        </linearGradient>
      </defs>
    </svg>
  );
}
