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
    "Erstgespräch (bis zu 30 Minuten) mit Sitalo aus Hamburg. Tag und Uhrzeit wählen, Bestätigung per E-Mail meist am selben Werktag.",
  alternates: { canonical: "/termin" },
};

/**
 * Hafen-Formen für die Terminbuchung. termin-booking.tsx ist gesperrt;
 * diese Regeln greifen nur, solange dort noch die alten Klassen stehen:
 * Karten und Datums-Kacheln werden kantig, Pillen (Uhrzeiten, Knopf)
 * bekommen 2 px. Wird die Komponente selbst umgestellt, laufen die
 * Regeln ins Leere.
 */
const BOOKING_HAFEN =
  "[&_.rounded-2xl]:rounded-[3px] [&_.ring-1]:ring-0 [&_.h-11.rounded-full]:rounded-[2px] [&_.h-12.rounded-full]:rounded-[2px]";

/**
 * `/termin` — Termin-Buchungs-Seite.
 *
 * Verbindlicher Pfad zwischen „interessiert" und „wir sprechen":
 * Tag und Uhrzeit direkt wählen, wir bestätigen von Hand.
 *
 * Bewusst manuell statt Cal.com / Calendly: passt zur Größe des
 * Büros, ein Mensch bestätigt den Termin.
 */
export default function TerminPage() {
  // Service-Schema für das Erstgespräch (bis zu 30 Minuten) + Breadcrumb.
  // ReservationService statt Reservation — wir bieten die Möglichkeit
  // zur Terminvereinbarung als Service an, kein konkretes Datum.
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Erstgespräch (bis zu 30 Minuten)",
    description:
      "Erstgespräch (bis zu 30 Minuten, meist reicht eine Viertelstunde) per Video, Telefon oder vor Ort in Hamburg. Termin direkt auswählen, Bestätigung meist am selben Werktag per Mail.",
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
          eyebrow="Erstgespräch · bis zu 30 Minuten · kostenlos"
          title="Erstgespräch buchen"
          meta="Per Video oder Telefon, in Hamburg auf Wunsch bei einem Kaffee."
        >
          Im Kalender sind 30 Minuten reserviert, meist reicht eine Viertelstunde.
          Sie wählen Tag und Uhrzeit, wir bestätigen meist am selben Werktag per
          Mail, mit einem Link für Ihren Kalender.
        </PageHero>

        <section aria-label="Termin wählen">
          <div className="mx-auto w-full max-w-6xl px-5 pt-10 pb-16 sm:px-6 sm:pt-14 sm:pb-20">
            <div className={`max-w-4xl ${BOOKING_HAFEN}`}>
              <TerminBooking />
            </div>
          </div>
        </section>

        <section className="bg-card border-border border-t">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:items-end lg:gap-8">
            <div className="lg:col-span-7">
              <p className="label-mono text-muted-foreground">Ohne Termin</p>
              <p className="text-foreground mt-4 max-w-lg text-balance text-[1.3rem] leading-snug font-semibold tracking-[-0.015em] sm:text-[1.5rem]">
                Sie können auch einfach anrufen. Wenn wir gerade können, gehen
                wir ran.
              </p>
              <a
                href="tel:+491607621876"
                className="text-foreground hover:text-gold mt-6 inline-block text-[2.4rem] leading-none tracking-[-0.035em] whitespace-nowrap transition-colors sm:text-[3.5rem]"
                style={{ fontStretch: "118%", fontWeight: 780 }}
              >
                0160&nbsp;7621876
              </a>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <p className="text-muted-foreground max-w-sm text-[15px] leading-relaxed">
                Wer lieber schreibt, nimmt das Anfrageformular. Es hat drei
                Felder.
              </p>
              <Link href="/anfrage" className="btn-line mt-5 h-12 text-[15px]">
                Anfrage schreiben
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([serviceLd, breadcrumbLd]),
        }}
      />
    </div>
  );
}
