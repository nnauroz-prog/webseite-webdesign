import type { Metadata } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";

import { CursorLabel } from "@/components/marketing/cursor-label";
import { MobileCtaBar } from "@/components/marketing/mobile-cta-bar";
import { ScrollProgress } from "@/components/marketing/scroll-progress";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "") ||
  "https://www.sitalo.de";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Sitalo — Webdesign aus Hamburg",
    template: "%s · Sitalo",
  },
  description:
    "Websites für lokale Unternehmen. Persönlich gemacht, in Hamburg. Sie schicken uns Ihre Unterlagen, wir kümmern uns um den Rest.",
};

const LOCAL_BUSINESS_LD = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#business`,
  name: "Sitalo Webdesign",
  description:
    "Webdesign für lokale Unternehmen — Pflegedienste, Praxen, Friseure, Cafés, Handwerker, Reinigungen, Kanzleien, Fitnessstudios. Persönlich gemacht, in Hamburg.",
  url: SITE_URL,
  telephone: "+4915224437370",
  email: "info@sitalo.de",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Hamburg",
    addressCountry: "DE",
  },
  areaServed: { "@type": "Country", name: "Deutschland" },
  priceRange: "€€",
  knowsAbout: [
    "Webdesign",
    "Website-Entwicklung",
    "Lokale Suchmaschinenoptimierung",
    "Responsive Design",
    "Pflegedienst-Website",
    "Arztpraxis-Website",
    "Café-Website",
    "Handwerker-Website",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} h-full scroll-smooth antialiased`}
    >
      <body className="flex min-h-full flex-col pb-20 md:pb-0">
        <ScrollProgress />
        <a
          href="#main"
          className="bg-foreground text-background sr-only z-[100] rounded-full px-4 py-2 text-sm font-medium focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:outline-none focus:ring-2 focus:ring-foreground/40"
        >
          Direkt zum Inhalt
        </a>
        {children}
        <CursorLabel />
        <MobileCtaBar />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(LOCAL_BUSINESS_LD),
          }}
        />
      </body>
    </html>
  );
}
