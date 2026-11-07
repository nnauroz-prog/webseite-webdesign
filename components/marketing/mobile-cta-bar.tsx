"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

/**
 * Feste CTA-Leiste am unteren Rand auf dem Handy (md:hidden).
 *
 * Sichtbarkeit über zwei IntersectionObserver statt über Scroll-Prozente:
 * - Sie erscheint, sobald der erste Abschnitt in <main> (der Kopf) ganz
 *   aus dem Bild ist; der Kopf bleibt frei.
 * - Sie geht, sobald #kontakt oder der Fuß den unteren Bildrand
 *   berühren (dort gibt es eigene Wege zur Anfrage).
 * Kein setState pro Scroll-Ereignis. Gestalt: Leiste aus Milchglas
 * (.kopf-glas) mit Haarlinie oben, links der Einstiegspreis, rechts der
 * ruhige Knopf. Bewegung nur über transform (app/globals.css,
 * .cta-leiste), bei reduzierter Bewegung nur eine kurze Blende.
 *
 * Versteckt auf /anfrage, /impressum, /datenschutz, im Admin und auf
 * den Angeboten für Kunden (/angebot/<token>).
 *
 * Beachtet env(safe-area-inset-bottom) für iPhones mit Home-Indicator.
 */
/** festpreis: Einstiegspreis aus lib/pakete-data.ts („ab 599 €"), vom
 *  Layout auf dem Server übergeben, damit die Paketdaten nicht ins
 *  Client-Bundle wandern. */
export function MobileCtaBar({ festpreis }: { festpreis: string }) {
  const pathname = usePathname();
  const [kopfWeg, setKopfWeg] = useState(false);
  const [amEnde, setAmEnde] = useState(false);

  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const kopf = document.querySelector("#main section") ?? document.querySelector("main > *");
    // Der Seitenfuß ist der letzte <footer> (Artikel haben eigene).
    const fuesse = document.querySelectorAll("footer");
    const enden = [document.getElementById("kontakt"), fuesse[fuesse.length - 1]].filter(
      (e): e is HTMLElement => !!e,
    );

    const ioKopf = new IntersectionObserver(([e]) => {
      setKopfWeg(!e.isIntersecting && e.boundingClientRect.top < 0);
    });
    if (kopf) ioKopf.observe(kopf);
    else setKopfWeg(true);

    const imBild = new Set<Element>();
    const ioEnde = new IntersectionObserver(
      (eintraege) => {
        for (const e of eintraege) {
          if (e.isIntersecting) imBild.add(e.target);
          else imBild.delete(e.target);
        }
        setAmEnde(imBild.size > 0);
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    enden.forEach((e) => ioEnde.observe(e));

    return () => {
      ioKopf.disconnect();
      ioEnde.disconnect();
    };
  }, [pathname]);

  if (
    pathname?.startsWith("/anfrage") ||
    pathname?.startsWith("/impressum") ||
    pathname?.startsWith("/datenschutz") ||
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/angebot/")
  ) {
    return null;
  }

  const visible = kopfWeg && !amEnde;

  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      data-sichtbar={visible}
      className={`cta-leiste kopf-glas print:hidden fixed inset-x-0 bottom-0 z-40 md:hidden ${
        visible ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      <div
        className="mx-auto flex max-w-md items-center justify-between gap-4 px-5 pt-2.5"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 10px)" }}
      >
        <p className="leading-tight">
          <span className="text-foreground/80 block text-[13px]">Festpreis</span>
          <span className="block text-[17px] font-bold tracking-[-0.01em]">{festpreis}</span>
        </p>
        <Link href="/anfrage" className="btn-signal btn-ruhig h-11 px-4">
          Website anfragen
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
