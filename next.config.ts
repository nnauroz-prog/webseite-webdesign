import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // View Transitions API für sanfte Crossfades zwischen Seiten —
    // browser-native, ohne Animation-Library.
    viewTransition: true,
  },
};

export default nextConfig;
