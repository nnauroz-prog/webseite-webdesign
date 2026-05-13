"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";

/**
 * Sticky CTA-Bar am unteren Rand auf Mobile (md:hidden).
 * Erscheint nach 400px Scrollen, damit der Hero nicht überdeckt
 * wird. Zwei Aktionen: primär "Anfrage" (bringt direkt zum
 * Wizard), sekundär WhatsApp wenn konfiguriert.
 *
 * Versteckt auf /anfrage, weil dort die Form selbst der CTA ist.
 *
 * Beachtet env(safe-area-inset-bottom) für iPhones mit Home-Indicator.
 */
function buildWhatsappHref(): string | null {
  if (typeof window === "undefined") return null;
  const raw = process.env.NEXT_PUBLIC_SITALO_WHATSAPP_NUMBER?.trim();
  if (!raw) return null;
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.length < 6) return null;
  const message =
    process.env.NEXT_PUBLIC_SITALO_WHATSAPP_MESSAGE?.trim() ||
    "Hallo Nadim, ich habe Ihre Seite gesehen und überlege, eine eigene Website für mein Unternehmen machen zu lassen. Können wir kurz dazu schreiben?";
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function MobileCtaBar() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const whatsappHref = buildWhatsappHref();

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY;
      const viewportBottom = scrolled + window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      // Sichtbar erst nach 500px Scroll, aber unsichtbar im
      // letzten Viertel der Seite — dort gibt es eigene CTAs
      // (Pakete, Final-CTA), die sticky-Pille würde sie nur
      // visuell überlagern.
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

  // Auf /anfrage und Rechtsseiten kein CTA-Banner einblenden.
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
      <div className="bg-foreground/95 text-background border-foreground/5 flex w-full max-w-md items-center gap-2 rounded-full border p-1.5 shadow-[0_20px_40px_-12px_rgb(0_0_0/0.35)] backdrop-blur-md">
        <Link
          href="/anfrage"
          className="bg-background text-foreground hover:bg-background/90 group inline-flex h-11 flex-1 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium tracking-tight transition-all"
        >
          Anfrage starten
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
        {whatsappHref ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Auf WhatsApp schreiben"
            className="border-background/20 text-background hover:bg-background/10 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
          </a>
        ) : null}
      </div>
    </div>
  );
}
