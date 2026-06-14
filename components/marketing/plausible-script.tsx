import Script from "next/script";

/**
 * Plausible-Loader. Lädt das Script nur, wenn
 * `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` gesetzt ist — auf Dev/Preview rendert
 * also nichts und `window.plausible` bleibt undefined (track() ist
 * dann ein No-Op).
 *
 * Variante `script.outbound-links.js` zählt zusätzlich Klicks auf
 * externe Links automatisch — relevant für /standorte (Google-Maps,
 * Verkehrsbetriebe) und Journal-Quellen.
 *
 * Self-Hosting möglich: `NEXT_PUBLIC_PLAUSIBLE_SRC` überschreibt die
 * Default-URL, falls wir später auf eine eigene Plausible-Instanz
 * umziehen (oder auf eine Plausible-kompatible Alternative).
 */
export function PlausibleScript() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!domain) return null;
  const src =
    process.env.NEXT_PUBLIC_PLAUSIBLE_SRC ??
    "https://plausible.io/js/script.outbound-links.js";
  return (
    <Script
      src={src}
      data-domain={domain}
      strategy="afterInteractive"
      defer
    />
  );
}
