import { cn } from "@/lib/utils";

export type ContainerTon = "zink" | "signal" | "teer" | "gruen" | "rot";

/**
 * Ein 40-Fuß-Container aus CSS als ruhiges „Produktbild“
 * (.container-motiv, app/apple.css). Größen s/m/l; mit stapel werden
 * mehrere Container übereinander gestellt (von oben nach unten).
 * Rein dekorativ (aria-hidden).
 */
export function ContainerMotiv({
  ton = "zink",
  groesse = "m",
  stapel,
  className,
}: {
  ton?: ContainerTon;
  groesse?: "s" | "m" | "l";
  /** Mehrere Töne übereinander, z. B. ["signal", "teer", "gruen"]. */
  stapel?: ContainerTon[];
  className?: string;
}) {
  if (stapel?.length) {
    return (
      <span aria-hidden="true" className={cn("container-stapel", className)}>
        {stapel.map((t, i) => (
          <span key={i} className="container-motiv" data-ton={t} data-groesse={groesse} />
        ))}
      </span>
    );
  }
  return <span aria-hidden="true" className={cn("container-motiv", className)} data-ton={ton} data-groesse={groesse} />;
}

/** Paket-Slug → Containerfarbe (wie im Containerstapel der Startseite). */
export const PAKET_TON: Record<string, ContainerTon> = {
  starter: "zink",
  business: "signal",
  premium: "teer",
  studio: "gruen",
};
