"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

/**
 * Sticky CTA-Bar am unteren Rand auf Mobile (md:hidden).
 * Erscheint nach 500px Scrollen, damit der Hero nicht überdeckt
 * wird. Versteckt sich im letzten ~22% der Seite, weil dort
 * eigene CTAs (Pakete, Final-CTA) erscheinen.
 *
 * Versteckt auf /anfrage, /impressum, /datenschutz.
 *
 * Beachtet env(safe-area-inset-bottom) für iPhones mit Home-Indicator.
 */
export function MobileCtaBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const viewportBottom = scrolled + window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const inLastQuarter = viewportBottom / docHeight > 0.78;
      setVisible(scrolled > 500 && !inLastQuarter);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  if (
    pathname?.startsWith("/anfrage") ||
    pathname?.startsWith("/impressum") ||
    pathname?.startsWith("/datenschutz")
  ) {
    return null;
  }

  return (
    <div
      aria-hidden={!visible}
      className={`pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-4 pb-3 transition-all duration-200 md:hidden ${
        visible
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
      style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 12px)" }}
    >
      <Link
        href="/anfrage"
        className="bg-foreground/95 text-background hover:bg-foreground/90 group inline-flex h-12 w-full max-w-md items-center justify-center gap-2 rounded-full px-6 text-sm font-medium tracking-tight shadow-[0_20px_40px_-12px_rgb(0_0_0/0.35)] backdrop-blur-md transition-all"
      >
        Anfrage starten
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
