import { honorarPaket } from "@/lib/honorar-data";
import { presetFuer } from "@/lib/muster-presets";
import { getPaketBySlug, STUNDENSATZ_EUR } from "@/lib/pakete-data";

import { ContainerPlastisch, CONTAINER } from "./container-plastisch";
import { Boden, Handy, Laptop, rr } from "./geraete";
import { MusterSeite, MotivVorlage, SEITE_DESKTOP } from "./muster-seite";

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

/* ---------- Durchsicht: Musterseite mit Markern, davor die Liste ---------- */

const PUNKTE = ["Ladezeit am Handy", "Anruf mit einem Tipp", "Pflichtangaben", "Titel bei Google"];

export function BildDurchsicht() {
  const p = presetFuer("praxis");
  return (
    <Svg>
      <MotivVorlage preset={p} id="ld-motiv-durchsicht" />
      <Laptop
        x={18}
        y={30}
        w={226}
        h={144}
        vb={SEITE_DESKTOP}
        inhalt={
          <g>
            <MusterSeite preset={p} format="desktop" motivRef="ld-motiv-durchsicht" />
            {[
              [520, 150],
              [880, 40],
              [190, 430],
            ].map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="44" fill={ORANGE} fillOpacity=".2" />
                <circle cx={x} cy={y} r="28" fill={ORANGE} />
                <text x={x} y={y + 11} textAnchor="middle" fontSize="32" fontWeight="700" fill="#fff">
                  {i + 1}
                </text>
              </g>
            ))}
          </g>
        }
      />
      <Blatt x={172} y={78} w={136} h={128} dreh={-3}>
        <text x={186} y={100} fontSize="10.5" fontWeight="700" fill={TINTE}>
          Ihre Durchsicht
        </text>
        {PUNKTE.map((t, i) => (
          <g key={t} transform={`translate(186 ${114 + i * 22})`}>
            <circle cx="6" cy="0" r="6" fill={ORANGE} />
            <text x="6" y="3" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#fff">
              {i + 1}
            </text>
            <text x="17" y="3" fontSize="8.2" fontWeight="500" fill={TINTE}>
              {t}
            </text>
            {i < PUNKTE.length - 1 ? <path d="M17 11h88" stroke="#e5e5ea" /> : null}
          </g>
        ))}
      </Blatt>
    </Svg>
  );
}

/* ---------- Ladezeit: Handy mit Tacho und drei Kennzahlen (ohne Werte) ---------- */

function Tacho() {
  const bogen = (von: number, bis: number) => {
    const p = (w: number) => {
      const a = Math.PI * (1 - w);
      return `${(195 + Math.cos(a) * 120).toFixed(1)} ${(330 - Math.sin(a) * 120).toFixed(1)}`;
    };
    return `M${p(von)}A120 120 0 0 1 ${p(bis)}`;
  };
  return (
    <g fontFamily="inherit">
      <rect width="390" height="780" fill="#fff" />
      <text x="34" y="96" fontSize="26" fontWeight="700" fill={TINTE}>
        Ladezeit
      </text>
      <text x="34" y="128" fontSize="19" fill={GRAU}>
        Ihre Adresse, am Handy gemessen
      </text>
      <path d={bogen(0, 0.32)} stroke="#e5484d" strokeWidth="26" fill="none" />
      <path d={bogen(0.34, 0.64)} stroke="#f5a524" strokeWidth="26" fill="none" />
      <path d={bogen(0.66, 1)} stroke="#30a46c" strokeWidth="26" fill="none" />
      <path d="M195 330L278 262" stroke={TINTE} strokeWidth="9" strokeLinecap="round" />
      <circle cx="195" cy="330" r="18" fill={TINTE} />
      <circle cx="195" cy="330" r="7" fill={ORANGE} />
      {["Erster Inhalt", "Größter Inhalt", "Verschiebung"].map((t, i) => (
        <g key={t} transform={`translate(0 ${384 + i * 78})`}>
          <rect x="26" width="338" height="68" rx="16" fill="#f5f5f7" />
          <circle cx="62" cy="34" r="14" fill="#30a46c" />
          <path d="M55 34l5 5 9-10" stroke="#fff" strokeWidth="3.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          <text x="90" y="42" fontSize="22" fontWeight="600" fill={TINTE}>
            {t}
          </text>
        </g>
      ))}
      <rect x="26" y="624" width="338" height="58" rx="29" fill={ORANGE} />
      <text x="195" y="660" textAnchor="middle" fontSize="21" fontWeight="650" fill="#fff">
        Erneut testen
      </text>
    </g>
  );
}

export function BildLadezeit() {
  return (
    <Svg>
      {/* Halbkreis-Schein hinter dem Gerät */}
      <circle cx="160" cy="150" r="96" fill="#30a46c" fillOpacity=".08" />
      <circle cx="160" cy="150" r="66" fill="#30a46c" fillOpacity=".08" />
      <Handy x={104} y={14} w={112} h={232} vb="0 0 390 780" inhalt={<Tacho />} />
      {/* Stoppuhr links */}
      <g transform="translate(44 132)">
        <Boden cx={2} cy={50} rx={34} ry={5} />
        <rect x="-6" y="-38" width="16" height="8" rx="3" fill="#3a3a3c" />
        <circle cx="2" cy="6" r="34" fill={TINTE} />
        <circle cx="2" cy="6" r="27" fill="#fff" />
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return (
            <path
              key={i}
              d={`M${(2 + Math.sin(a) * 22).toFixed(1)} ${(6 - Math.cos(a) * 22).toFixed(1)}L${(2 + Math.sin(a) * 25).toFixed(1)} ${(6 - Math.cos(a) * 25).toFixed(1)}`}
              stroke={GRAU}
              strokeWidth="1.6"
            />
          );
        })}
        <path d="M2 6L14 -10" stroke={ORANGE} strokeWidth="3" strokeLinecap="round" />
        <circle cx="2" cy="6" r="3" fill={ORANGE} />
      </g>
      {/* grüner Haken rechts */}
      <g transform="translate(262 120)">
        <circle r="22" fill="#e9f6ef" />
        <circle r="16" fill={GRUEN} />
        <path d="M-7 0l5 5 9-10" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </Svg>
  );
}

/* ---------- Paketwahl: Frage-Dialog, dazu der Kranhaken mit Container ---------- */

export function BildPaketWahl() {
  const optionen = ["Eine Seite reicht", "Mehrere Seiten", "Inhalte selbst ändern"];
  return (
    <Svg>
      {/* Spreader mit Seilen, Container hängt rechts oben */}
      <path d="M244 0V30M286 0V30" stroke="#3a3a3c" strokeWidth="2" />
      <rect x="228" y="30" width="74" height="7" rx="2" fill={ORANGE} />
      <ContainerPlastisch x={230} y={44} L={70} H={26} t={14} farbe={CONTAINER.petrol} rippen={8} schatten={false} />
      <Blatt x={22} y={58} w={226} h={150} r={16}>
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

/* ---------- Erstgespräch: Kalender mit Zeitfenstern, Handy bestätigt ---------- */

function Bestaetigt() {
  return (
    <g fontFamily="inherit">
      <rect width="390" height="780" fill="#fff" />
      <circle cx="195" cy="260" r="92" fill="#30a46c" fillOpacity=".14" />
      <circle cx="195" cy="260" r="64" fill="#30a46c" />
      <path d="M165 260l20 20 40-44" stroke="#fff" strokeWidth="16" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <text x="195" y="420" textAnchor="middle" fontSize="34" fontWeight="700" fill={TINTE}>
        Termin steht
      </text>
      <text x="195" y="466" textAnchor="middle" fontSize="24" fill={GRAU}>
        Erstgespräch
      </text>
      <rect x="40" y="620" width="310" height="70" rx="35" fill={ORANGE} />
      <text x="195" y="664" textAnchor="middle" fontSize="24" fontWeight="650" fill="#fff">
        Im Kalender sichern
      </text>
    </g>
  );
}

export function BildTermin() {
  const tage = ["Mo", "Di", "Mi", "Do", "Fr"];
  const zeiten = ["09:00", "10:30", "14:00", "16:30"];
  return (
    <Svg>
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
      <Handy x={214} y={58} w={84} h={172} vb="0 0 390 780" inhalt={<Bestaetigt />} dreh={6} />
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
