import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Phone, Video } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { TerminBooking } from "@/components/marketing/termin-booking";
import { EditorialEyebrow } from "@/components/marketing/editorial-eyebrow";

export const metadata: Metadata = {
  title: "Termin buchen",
  description:
    "30-Minuten-Erstgespräch direkt aus dem Hamburger Atelier. Tag und Uhrzeit wählen, Bestätigung per E-Mail innerhalb 15 Minuten.",
  alternates: { canonical: "/termin" },
};

/**
 * `/termin` — Termin-Buchungs-Seite.
 *
 * Verbindlicher Pfad zwischen „interessiert" und „wir sprechen".
 * Eliminiert das E-Mail-Pingpong „Wann passt es?" — User wählt
 * Slot direkt, wir bestätigen manuell.
 *
 * Bewusst manuell statt Cal.com / Calendly: passt zur Atelier-
 * Größe, vermittelt persönlichen Eindruck schon vor dem ersten
 * Kontakt.
 */
export default function TerminPage() {
  const formspreeId = process.env.FORMSPREE_FORM_ID?.trim() || undefined;

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Termin" />
      <main id="main" tabIndex={-1} className="flex-1">
        <section className="border-border/40 relative overflow-hidden border-b">
          <div
            aria-hidden="true"
            className="bg-gold/10 pointer-events-none absolute -top-32 left-1/2 -z-10 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full blur-[60px] sm:blur-[120px]"
          />
          <div className="mx-auto w-full max-w-4xl px-6 py-14 sm:py-20 lg:py-24">
            <div className="text-center">
              <EditorialEyebrow>30 Minuten · persönlich</EditorialEyebrow>
              <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.0] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                Termin
                <br />
                <span className="serif-italic text-muted-foreground font-normal">
                  direkt buchen.
                </span>
              </h1>
              <p className="text-muted-foreground mx-auto mt-7 max-w-xl text-pretty text-base leading-relaxed sm:text-lg">
                Tag und Uhrzeit wählen. Wir bestätigen innerhalb von
                15 Minuten per Mail mit Kalender-Anhang. Kein
                E-Mail-Pingpong, kein Pflicht-Telefonat vorab.
              </p>
              <div className="text-muted-foreground mx-auto mt-6 inline-flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13px]">
                <span className="inline-flex items-center gap-2">
                  <Video className="h-3.5 w-3.5" aria-hidden="true" />
                  Video-Call (Zoom / Google Meet)
                </span>
                <span className="inline-flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                  Telefon
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="bg-ink-olive inline-block h-1 w-1 rounded-full" />
                  Café in Hamburg auf Wunsch
                </span>
              </div>
            </div>

            <div className="mt-12 sm:mt-16">
              <TerminBooking formspreeId={formspreeId} />
            </div>
          </div>
        </section>

        <section className="border-border/40 border-t">
          <div className="mx-auto w-full max-w-3xl px-6 py-16 text-center sm:py-20">
            <p className="text-muted-foreground inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] sm:text-[11px]">
              <span
                aria-hidden="true"
                className="bg-gold gold-pulse inline-block h-1 w-6"
              />
              Lieber spontan
            </p>
            <p className="serif text-foreground mt-6 text-balance text-2xl leading-snug sm:text-3xl">
              Sie können auch einfach anrufen.{" "}
              <span className="serif-italic text-muted-foreground">
                Wenn wir können, gehen wir ran.
              </span>
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="tel:+4915224437370"
                className="border-foreground/30 text-foreground hover:bg-foreground hover:text-background inline-flex h-11 items-center rounded-full border px-5 text-sm font-medium tracking-tight transition-all"
              >
                Direkt anrufen
              </a>
              <Link
                href="/anfrage"
                className="text-foreground inline-flex h-11 items-center text-sm font-medium underline-offset-[6px] hover:underline"
              >
                Lieber schriftlich anfragen
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
