import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Containerbruecke } from "@/components/marketing/hafen/containerbruecke";

const ARROW = <ArrowRight className="h-4 w-4" aria-hidden="true" />;

/* ------------------------------------------------------------------
 * Kopf: Hafen-Plakat. Links die Botschaft, unten rechts die
 * Containerbrücke am Kai, am Horizont Hamburg im Dunst.
 * ---------------------------------------------------------------- */
export function HafenHero() {
  return (
    <section id="start" className="hafen-hero scroll-mt-20">
      <div className="relative z-[2] mx-auto w-full max-w-6xl px-5 pt-9 sm:px-6 sm:pt-14 lg:pt-16">
        <div className="lg:max-w-[31rem] xl:max-w-[35rem]">
          {/* Die H1 trägt den Suchbegriff (für Google), der große Satz
              darunter ist die Botschaft (für Menschen). */}
          <h1 className="label-mono text-muted-foreground flex items-start gap-3 leading-relaxed">
            <span aria-hidden="true" className="bg-gold mt-[5px] inline-block h-2.5 w-2.5 shrink-0" />
            Website erstellen lassen · Webdesign aus Hamburg
          </h1>
          <p
            className="mt-6 text-balance text-[2.75rem] leading-[0.95] tracking-[-0.04em] sm:mt-8 sm:text-[4rem] lg:text-[3.6rem] xl:text-[4.4rem]"
            style={{ fontStretch: "112%", fontWeight: 790 }}
          >
            Wir bauen Websites für Betriebe.
          </p>
          <p className="mt-6 max-w-[33em] text-pretty text-[16.5px] leading-relaxed text-[#33383a] sm:mt-8 sm:text-[18px]">
            Ein kleines Studio in Hamburg. Wir arbeiten für Pflegedienste, Praxen, Handwerksbetriebe und Cafés in ganz
            Deutschland. Den Festpreis kennen Sie, bevor wir anfangen.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 sm:mt-9">
            <Link href="/anfrage" className="btn-signal grow sm:grow-0">
              Anfrage schreiben {ARROW}
            </Link>
            <Link href="#preise" className="btn-line grow sm:grow-0">
              Preise ansehen
            </Link>
          </div>
          <p className="text-muted-foreground mt-6 flex flex-col gap-1.5 text-[14px] sm:flex-row sm:flex-wrap sm:gap-x-5">
            <Link href="/wartung" className="hover:text-foreground underline decoration-[var(--border)] underline-offset-4 hover:decoration-current">
              Schon eine Website? Pflege ab 49 € im Monat
            </Link>
            <Link href="/audit" className="hover:text-foreground underline decoration-[var(--border)] underline-offset-4 hover:decoration-current">
              Kostenloser Google-Check
            </Link>
          </p>
        </div>
      </div>

      <Containerbruecke />

      <div className="pointer-events-none absolute inset-x-0 bottom-2 z-[3]">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-6">
          <p className="hafen-caption max-w-[62%] sm:max-w-none">Blick von Steinwerder über die Elbe, frei gezeichnet.</p>
        </div>
      </div>
    </section>
  );
}
