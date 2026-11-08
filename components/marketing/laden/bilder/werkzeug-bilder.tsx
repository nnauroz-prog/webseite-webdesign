import { honorarPaket } from "@/lib/honorar-data";
import { getPaketBySlug, STUNDENSATZ_EUR } from "@/lib/pakete-data";

import { rr } from "./geraete";

/**
 * Bilder der Werkzeug-Karten: viewBox 320 × 240 (Bildzone einer
 * mittleren Karte, 300 × 236 bzw. 280 × 208), unten bündig; gezeichnet
 * wird in 320 × 220, 20 Einheiten tiefer. Seitlich höchstens 8 Einheiten
 * Anschnitt.
 *
 * Jede Fläche trägt lesbaren Inhalt statt grauer Balken. Zahlen nur, wo
 * sie belegt sind: Preise aus lib/pakete-data.ts, Stunden aus
 * lib/honorar-data.ts. Keine Messwerte, keine Punktzahlen.
 */
function Svg({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 320 240" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">
      <g transform="translate(0 20)">{children}</g>
    </svg>
  );
}

const ORANGE = "#f45b1e";
const TINTE = "#1d1d1f";
const GRAU = "#6e6e73";
const GRUEN = "#248a52";

const eur = (n: number) => `${n.toLocaleString("de-DE")} €`;
const zahl = (s: string | undefined) => Number((s ?? "").replace(/[^\d]/g, "")) || 0;

/** Weiße Karte mit weichem Schatten (Papier, Dialog). */
function Blatt({ x, y, w, h, r = 12, dreh = 0, children }: { x: number; y: number; w: number; h: number; r?: number; dreh?: number; children?: React.ReactNode }) {
  return (
    <g transform={dreh ? `rotate(${dreh} ${x + w / 2} ${y + h / 2})` : undefined}>
      <path d={rr(x, y, w, h, r)} fill="#000" fillOpacity=".08" transform="translate(3 7)" />
      <path d={rr(x, y, w, h, r)} fill="#000" fillOpacity=".05" transform="translate(1 2)" />
      <path d={rr(x, y, w, h, r)} fill="#fff" />
      {children}
    </g>
  );
}

/* ---------- Durchsicht: die Liste selbst, randlos, ohne Gerät ---------- */

const PUNKTE: [string, string][] = [
  ["Ladezeit am Handy", "Bilder kleiner speichern"],
  ["Anruf mit einem Tipp", "Nummer als Knopf oben"],
  ["Pflichtangaben", "Impressum im Fuß verlinken"],
  ["Titel bei Google", "Ort und Leistung nennen"],
];

export function BildDurchsicht() {
  return (
    <Svg>
      <Blatt x={34} y={6} w={252} h={208} r={14}>
        <text x={52} y={34} fontSize="12.5" fontWeight="700" fill={TINTE}>
          Ihre Durchsicht
        </text>
        <text x={52} y={49} fontSize="9" fill={GRAU}>
          Beispiel · von Hand geprüft
        </text>
        {PUNKTE.map(([t, hinweis], i) => (
          <g key={t} transform={`translate(52 ${70 + i * 36})`}>
            <circle cx="9" cy="8" r="9" fill={i === 0 ? ORANGE : TINTE} />
            <text x="9" y="11.5" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">
              {i + 1}
            </text>
            <text x="26" y="7" fontSize="10.5" fontWeight="600" fill={TINTE}>
              {t}
            </text>
            <text x="26" y="20" fontSize="9" fill={GRAU}>
              {hinweis}
            </text>
            {i < PUNKTE.length - 1 ? <path d="M26 28h190" stroke="#e5e5ea" /> : null}
          </g>
        ))}
      </Blatt>
    </Svg>
  );
}

/* ---------- Ladezeit: Ergebniskarte, ohne Uhr und ohne Gerät ---------- */

export function BildLadezeit() {
  const zeilen = ["Erster Inhalt", "Größter Inhalt", "Verschiebung"];
  return (
    <Svg>
      <Blatt x={34} y={6} w={252} h={208} r={14}>
        <text x={52} y={34} fontSize="12.5" fontWeight="700" fill={TINTE}>
          Ladezeit am Handy
        </text>
        {/* Adresszeile mit Knopf */}
        <path d={rr(52, 46, 216, 30, 8)} fill="#f5f5f7" />
        <text x={64} y={65} fontSize="10" fill={TINTE}>
          www.ihr-betrieb.de
        </text>
        <path d={rr(208, 50, 56, 22, 6)} fill={ORANGE} />
        <text x={236} y={64.5} textAnchor="middle" fontSize="9.5" fontWeight="650" fill="#fff">
          Testen
        </text>
        {zeilen.map((z, i) => (
          <g key={z} transform={`translate(52 ${94 + i * 34})`}>
            <circle cx="9" cy="9" r="9" fill="#e9f6ef" />
            <path d="M5 9.2l2.8 2.8 5.2-5.6" stroke={GRUEN} strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <text x="26" y="12.5" fontSize="10.5" fontWeight="600" fill={TINTE}>
              {z}
            </text>
            <text x="216" y="12.5" textAnchor="end" fontSize="9.5" fill={GRUEN} fontWeight="600">
              im grünen Bereich
            </text>
            {i < zeilen.length - 1 ? <path d="M26 26h190" stroke="#e5e5ea" /> : null}
          </g>
        ))}
      </Blatt>
    </Svg>
  );
}

/* ---------- Paketwahl: Frage-Dialog, dazu der Kranhaken mit Container ---------- */

export function BildPaketWahl() {
  const optionen = ["Eine Seite reicht", "Mehrere Seiten", "Inhalte selbst ändern"];
  return (
    <Svg>
      <Blatt x={47} y={40} w={226} h={150} r={16}>
        <g transform="translate(25 -18)">
        {/* Fortschritt: Frage 2 von 5 */}
        {[0, 1, 2, 3, 4].map((i) => (
          <rect key={i} x={38 + i * 22} y={74} width="18" height="4" rx="2" fill={i < 2 ? ORANGE : "#e5e5ea"} />
        ))}
        <text x={150} y={78} fontSize="8.5" fill={GRAU}>
          Frage 2 von 5
        </text>
        <text x={38} y={100} fontSize="12.5" fontWeight="700" fill={TINTE}>
          Was braucht Ihre Website?
        </text>
        {optionen.map((t, i) => {
          const aktiv = i === 1;
          return (
            <g key={t} transform={`translate(38 ${112 + i * 30})`}>
              <path d={rr(0, 0, 194, 24, 12)} fill={aktiv ? "#fff3ec" : "#f5f5f7"} stroke={aktiv ? ORANGE : "none"} strokeWidth="1.5" />
              <circle cx="14" cy="12" r="5.5" fill="#fff" stroke={aktiv ? ORANGE : "#c7c7cc"} strokeWidth="1.5" />
              {aktiv ? <circle cx="14" cy="12" r="2.8" fill={ORANGE} /> : null}
              <text x="27" y="15.5" fontSize="9.5" fontWeight={aktiv ? 650 : 500} fill={TINTE}>
                {t}
              </text>
            </g>
          );
        })}
        </g>
      </Blatt>
    </Svg>
  );
}

/* ---------- Kosten über 3 Jahre: Starter, Einmalpreis plus Monatsbeiträge ---------- */

export function BildKosten() {
  const p = getPaketBySlug("starter");
  const einmal = zahl(p?.setup);
  const monat = zahl(p?.monthly);
  const jahre = [1, 2, 3].map((j) => ({ j, einmal, laufend: monat * 12 * j }));
  const max = einmal + monat * 36;
  const hoch = 112;
  const basis = 192;
  return (
    <Svg>
      <Blatt x={24} y={20} w={272} h={192} r={16}>
        <text x={42} y={46} fontSize="12" fontWeight="700" fill={TINTE}>
          {p?.name ?? "Starter"} über 3 Jahre
        </text>
        <g transform="translate(42 58)">
          <rect width="8" height="8" rx="2" fill={TINTE} />
          <text x="12" y="7.5" fontSize="8" fill={GRAU}>
            Einmalpreis
          </text>
          <rect x="70" width="8" height="8" rx="2" fill={ORANGE} />
          <text x="82" y="7.5" fontSize="8" fill={GRAU}>
            Monatsbeiträge
          </text>
        </g>
        {[0.5, 1].map((f) => (
          <path key={f} d={`M42 ${basis - hoch * f}H278`} stroke="#e5e5ea" strokeDasharray="2 3" />
        ))}
        <path d={`M42 ${basis}H278`} stroke="#c7c7cc" />
        {jahre.map((b, i) => {
          const x = 66 + i * 72;
          const hE = (b.einmal / max) * hoch;
          const hL = (b.laufend / max) * hoch;
          return (
            <g key={b.j}>
              <rect x={x} y={basis - hE} width="40" height={hE} fill={TINTE} />
              <path d={rr(x, basis - hE - hL, 40, hL + 6, 6)} fill={ORANGE} />
              <rect x={x} y={basis - hE} width="40" height="1" fill="#fff" fillOpacity=".5" />
              <text x={x + 20} y={basis - hE - hL - 6} textAnchor="middle" fontSize="9.5" fontWeight="700" fill={TINTE}>
                {eur(b.einmal + b.laufend)}
              </text>
              <text x={x + 20} y={basis + 13} textAnchor="middle" fontSize="8.5" fill={GRAU}>
                Jahr {b.j}
              </text>
            </g>
          );
        })}
      </Blatt>
    </Svg>
  );
}

/* ---------- Erstgespräch: Kalender mit Zeitfenstern ---------- */

export function BildTermin() {
  const tage = ["Mo", "Di", "Mi", "Do", "Fr"];
  const zeiten = ["09:00", "10:30", "14:00", "16:30"];
  return (
    <Svg>
      <g transform="translate(40 -10)">
      <Blatt x={22} y={40} w={196} h={168} r={16}>
        <path d={`M38 40H202A16 16 0 0 1 218 56V70H22V56A16 16 0 0 1 38 40Z`} fill={ORANGE} />
        <text x={36} y={60} fontSize="11" fontWeight="700" fill="#fff">
          Erstgespräch · bis 30 Min.
        </text>
        {tage.map((t, i) => {
          const aktiv = i === 2;
          return (
            <g key={t} transform={`translate(${34 + i * 36} 80)`}>
              <path d={rr(0, 0, 30, 30, 9)} fill={aktiv ? TINTE : "#f5f5f7"} />
              <text x="15" y="19.5" textAnchor="middle" fontSize="10" fontWeight="650" fill={aktiv ? "#fff" : TINTE}>
                {t}
              </text>
            </g>
          );
        })}
        {zeiten.map((z, i) => {
          const aktiv = i === 1;
          const x = 34 + (i % 2) * 88;
          const y = 124 + Math.floor(i / 2) * 36;
          return (
            <g key={z} transform={`translate(${x} ${y})`}>
              <path d={rr(0, 0, 80, 28, 14)} fill={aktiv ? "#fff3ec" : "#fff"} stroke={aktiv ? ORANGE : "#d2d2d7"} strokeWidth="1.4" />
              <text x="40" y="18.5" textAnchor="middle" fontSize="10.5" fontWeight="650" fill={aktiv ? "#b23c0a" : TINTE}>
                {z}
              </text>
            </g>
          );
        })}
      </Blatt>
      </g>
    </Svg>
  );
}

/* ---------- Honorar: Kassenbon des Starter-Pakets ---------- */

const KURZ = ["Seitenplan", "Bau der Seite", "Fotos, Test am Handy", "Hosting, Domain, SSL"];

export function BildHonorar() {
  const h = honorarPaket("starter");
  const posten = (h?.setupPosten ?? []).slice(0, 4);
  // Bon mit Zackenrand unten (von rechts nach links gezeichnet)
  let form = "M70 8H250V200";
  for (let x = 250; x > 70; x -= 10) form += `L${x - 5} 207L${x - 10} 200`;
  form += "Z";
  const std = (n: number) => `${n.toLocaleString("de-DE")} h`;
  return (
    <Svg>
      <g transform="rotate(3 160 110)">
        <path d={form} fill="#000" fillOpacity=".08" transform="translate(4 8)" />
        <path d={form} fill="#fff" />
        <text x={160} y={32} textAnchor="middle" fontSize="12" fontWeight="750" fill={TINTE} letterSpacing=".4">
          SITALO
        </text>
        <text x={160} y={46} textAnchor="middle" fontSize="8.5" fill={GRAU}>
          {h?.name ?? "Starter"}, offen vorgerechnet
        </text>
        <path d="M86 56H234" stroke={TINTE} strokeDasharray="3 3" strokeOpacity=".5" />
        {posten.map((q, i) => (
          <g key={q.label} transform={`translate(0 ${74 + i * 20})`}>
            <text x={86} y={0} fontSize="9" fill={TINTE}>
              {KURZ[i] ?? q.label}
            </text>
            <text x={234} y={0} textAnchor="end" fontSize="9" fontWeight="600" fill={TINTE} style={{ fontVariantNumeric: "tabular-nums" }}>
              {std(q.stunden)}
            </text>
          </g>
        ))}
        <path d="M86 156H234" stroke={TINTE} strokeDasharray="3 3" strokeOpacity=".5" />
        <text x={86} y={172} fontSize="8.5" fill={GRAU}>
          Richtwert {std(h?.stundenSetup ?? 0)} × {eur(STUNDENSATZ_EUR)}
        </text>
        <text x={86} y={190} fontSize="10" fontWeight="650" fill={TINTE}>
          Paketpreis
        </text>
        <text x={234} y={190} textAnchor="end" fontSize="13" fontWeight="750" fill="#b23c0a">
          {h?.setup ?? ""}
        </text>
      </g>
    </Svg>
  );
}
