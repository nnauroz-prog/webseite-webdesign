/**
 * Elbe-Linie: zwei überlagerte Wellen als Übergang zum Fuß der Seite.
 * Steht still, damit der Fuß ruhig bleibt.
 */

function wave(amp: number, len: number, phase: number) {
  let d = "M0 45";
  for (let x = 0; x <= 1440; x += 8) d += `L${x} ${(45 + Math.sin(x / len + phase) * amp).toFixed(2)}`;
  return d;
}

const LINE_A = wave(9, 62, 0);
const LINE_B = wave(6, 48, 1.6);

export function ElbeLinie({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`block h-[60px] w-full sm:h-[90px] ${className}`}
    >
      <path d={LINE_A} fill="none" stroke="var(--gold)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      <path d={LINE_B} fill="none" stroke="var(--background)" strokeOpacity=".18" strokeWidth="1" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
