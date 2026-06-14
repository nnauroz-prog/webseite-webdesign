import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // View Transitions API für sanfte Crossfades zwischen Seiten —
    // browser-native, ohne Animation-Library.
    viewTransition: true,
    // Tree-Shaking für Icon-Libraries: Lucide importiert sonst die
    // gesamte ~80 KB große Bibliothek pro Use. Mit optimizePackage-
    // Imports werden nur die tatsächlich genutzten Icons gebündelt.
    optimizePackageImports: ["lucide-react"],
  },

  // Next.js Image-Optimization: AVIF zuerst, WebP als Fallback.
  // AVIF ist seit 2022 in allen modernen Browsern verfügbar (Chrome,
  // Firefox, Safari 16+, Edge) und typisch 20–50 % kleiner als WebP
  // bei gleicher Qualität. Browser, die kein AVIF können, bekommen
  // automatisch WebP — die Source-Dateien selbst bleiben WebP.
  images: {
    formats: ["image/avif", "image/webp"],
    // Cache optimierte Image-Varianten 31 Tage statt der 60 Sekunden
    // Default — die WebP-Sources ändern sich praktisch nie, lohnt
    // sich, die generierten AVIF/WebP-Variants lange im CDN zu
    // halten.
    minimumCacheTTL: 60 * 60 * 24 * 31,
  },

  // X-Powered-By: Next.js raus — kleines Security-Detail, weniger
  // Information über die Stack-Wahl in den Response-Headers.
  poweredByHeader: false,

  // Sicherheits-Header für alle Routen. HSTS, Referrer-Policy,
  // Frame-Schutz, Content-Type-Sniffing-Schutz und eine restriktive
  // Permissions-Policy. CSP bewusst weggelassen — Next.js Inline-
  // Scripts brauchen entweder `unsafe-inline` (würde den Schutz
  // entwerten) oder Nonce-Propagation durch jeden Render-Pfad
  // (großer Refactor). Wenn CSP irgendwann nötig wird, eigener PR.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            // HSTS für 2 Jahre, inkl. Subdomains, Preload-fähig.
            // Production läuft auf https://www.sitalo.de — die
            // www-Subdomain ist Pflicht-HTTPS, also keine Sorge
            // vor Lock-Out.
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            // Verhindert MIME-Sniffing — Browser respektiert nur
            // den Content-Type, den wir senden.
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            // Verhindert Einbettung in fremde iframes (Clickjacking-
            // Schutz). frame-ancestors 'none' ist die strengste Variante.
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            // Referrer nur intern volle URL, extern nur Origin.
            // Standard für Privacy-bewusste Marketing-Seiten.
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            // Wir brauchen nichts davon — Permissions explizit
            // verbieten reduziert die Angriffsfläche.
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
          },
          {
            // DNS-Prefetch: an, weil wir externe Resources (Fonts,
            // Bilder) ohnehin laden. Hilft Web Vitals leicht.
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
