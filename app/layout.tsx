import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  DM_Sans,
  Geist,
  Geist_Mono,
  Lora,
  Playfair_Display,
} from "next/font/google";
import "./globals.css";

// Default sans + mono — used everywhere outside personality-scoped
// public sites (marketing, dashboard, auth, admin).
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Personality fonts — loaded once at the root and exposed as CSS
// variables. Each [data-personality="..."] selector in globals.css
// picks the right one for its display family.
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Sitalo — Professionelle Webseiten für lokale Unternehmen",
    template: "%s · Sitalo",
  },
  description:
    "Sitalo ist die Plattform für professionelle Unternehmenswebseiten mit einfachem Kunden-Dashboard. Hosting, Wartung und SEO inklusive.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} ${dmSans.variable} ${cormorant.variable} ${playfair.variable} ${lora.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
