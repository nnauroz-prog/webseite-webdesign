import Script from "next/script";

/**
 * Google Analytics 4 loader.
 *
 * Renders the standard gtag.js bootstrap pair only when:
 *   - the website is published (not preview), and
 *   - the operator pasted a valid-looking Measurement-ID (G-…).
 *
 * Strategy "afterInteractive" so it doesn't block first paint but still
 * fires before the user typically interacts with the page. We escape the
 * id where it lands inside the inline init script — the validator only
 * permits [A-Z0-9-] but defense in depth never hurts.
 */
export function Ga4Script({ measurementId }: { measurementId: string }) {
  const safeId = measurementId.replace(/[^A-Za-z0-9_-]/g, "");
  if (!safeId) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${safeId}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${safeId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
