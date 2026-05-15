import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // View Transitions API für sanfte Crossfades zwischen Seiten —
    // browser-native, ohne Animation-Library.
    viewTransition: true,
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
};

export default nextConfig;
