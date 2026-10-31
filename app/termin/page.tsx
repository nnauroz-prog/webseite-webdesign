import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { PageHero } from "@/components/marketing/page-hero";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { TerminBooking } from "@/components/marketing/termin-booking";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kostenloses Erstgespräch buchen · Webdesign",
  description:
    "30-Minuten-Erstgespräch direkt aus dem Hamburger Atelier. Tag und Uhrzeit wählen, Bestätigung per E-Mail am selben Werktag.",
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
  // Service-Schema für das 30-Min-Erstgespräch + Breadcrumb.
  // ReservationService statt Reservation — wir bieten die Möglichkeit
  // zur Terminvereinbarung als Service an, kein konkretes Datum.
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "30-Minuten-Erstgespräch",
    description:
      "Persönliches 30-Minuten-Erstgespräch per Video-Call, Telefon oder vor Ort in Hamburg. Direkte Termin-Auswahl, Bestätigung am selben Werktag per Mail.",
    provider: {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#business`,
      name: "Sitalo Webdesign",
    },
    areaServed: { "@type": "Country", name: "Deutschland" },
    serviceType: "Beratungstermin",
    url: `${SITE_URL}/termin`,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Sitalo",
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Termin",
        item: `${SITE_URL}/termin`,
      },
    ],
  };

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader tone="dark" />
      <main id="main" tabIndex={-1} className="flex-1">
        <PageHero
          crumb="Termin"
          eyebrow="30 Minuten · persönlich"
          title="Termin"
          accent="direkt buchen."
          meta="Video-Call · Telefon · Café in Hamburg auf Wunsch"
        >
          Tag und Uhrzeit wählen. Wir bestätigen am selben Werktag per Mail mit
          Kalender-Anhang. Kein E-Mail-Pingpong, kein Pflicht-Telefonat vorab.
        </PageHero>

        <section>
          <div className="mx-auto w-full max-w-4xl px-6 pt-10 pb-16 sm:pt-14 sm:pb-20">
            <div>
              <TerminBooking />
            </div>
          </div>
        </section>

        <section className="border-border/40 border-t">
          <div className="mx-auto w-full max-w-3xl px-6 py-16 text-center sm:py-20">
            <p className="text-muted-foreground inline-flex items-center gap-2 text-[13px] font-medium">
              <span
                aria-hidden="true"
                className="bg-gold gold-pulse inline-block h-1 w-6"
              />
              Lieber spontan
            </p>
            <p className="serif text-foreground mt-6 text-2xl leading-snug text-balance sm:text-3xl">
              Sie können auch einfach anrufen.{" "}
              <span className="serif-italic text-muted-foreground">
                Wenn wir können, gehen wir ran.
              </span>
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <a
                href="tel:+491607621876"
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
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([serviceLd, breadcrumbLd]),
        }}
      />
    </div>
  );
}
