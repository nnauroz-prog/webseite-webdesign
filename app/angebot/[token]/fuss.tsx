import Link from "next/link";

import { cn } from "@/lib/utils";

import styles from "./angebot.module.css";

const LINK =
  "hover:text-foreground inline-flex min-h-11 items-center underline-offset-4 hover:underline";

/**
 * Fußzeile der Kundenseite (Angebot, 404, Ladefehler): Absender und
 * die Links zu Startseite, Impressum und Datenschutz. Nicht im Druck.
 * Die Links sind 44 px hoch (Daumen), optisch bleibt die Zeile schmal.
 */
export function Fuss() {
  return (
    <footer
      className={cn(
        styles.nichtDrucken,
        "border-border text-muted-foreground border-t px-4 py-2.5 text-[13px] sm:px-6",
      )}
    >
      <div className="mx-auto flex max-w-[54rem] flex-wrap items-center gap-x-5">
        <span className="inline-flex min-h-11 items-center">
          Sitalo Webdesign · Hamburg
        </span>
        <Link href="/" className={LINK}>
          sitalo.de
        </Link>
        <Link href="/impressum" className={LINK}>
          Impressum
        </Link>
        <Link href="/datenschutz" className={LINK}>
          Datenschutz
        </Link>
      </div>
    </footer>
  );
}
