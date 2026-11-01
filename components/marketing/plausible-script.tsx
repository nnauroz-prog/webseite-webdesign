"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";

/**
 * Plausible-Loader. Lädt das Script nur, wenn
 * `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` gesetzt ist — auf Dev/Preview rendert
 * also nichts und `window.plausible` bleibt undefined (track() ist
 * dann ein No-Op).
 *
 * Variante `script.exclusions.outbound-links.js`: zählt Klicks auf
 * externe Links automatisch (relevant für /standorte und
 * Journal-Quellen) und lässt Pfade aus `data-exclude` aus.
 *
 * Nicht gezählt werden der Mitgliederbereich und die Angebote für
 * Kunden: In /angebot/<token> ist der Token der einzige Schlüssel zum
 * Angebot, er darf nicht bei Dritten landen. Auf diesen Seiten lädt das
 * Script gar nicht erst; war es schon geladen (Navigation ohne
 * Neuladen), sorgt `data-exclude` dafür, dass nichts gemeldet wird.
 *
 * Self-Hosting möglich: `NEXT_PUBLIC_PLAUSIBLE_SRC` überschreibt die
 * Default-URL. Die Ersatz-URL muss die Ausschlüsse ebenfalls können.
 */
const OHNE_ZAEHLUNG = ["/angebot", "/admin"];

export function PlausibleScript() {
  const pathname = usePathname() ?? "";
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;
  if (OHNE_ZAEHLUNG.some((p) => pathname === p || pathname.startsWith(`${p}/`)))
    return null;
  const src =
    process.env.NEXT_PUBLIC_PLAUSIBLE_SRC ??
    "https://plausible.io/js/script.exclusions.outbound-links.js";
  return (
    <Script
      src={src}
      data-domain={domain}
      data-exclude="/angebot/**, /admin, /admin/**"
      strategy="afterInteractive"
      defer
    />
  );
}
