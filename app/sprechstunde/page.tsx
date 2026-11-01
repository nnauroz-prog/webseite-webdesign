import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarPlus, Phone } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { PageHero } from "@/components/marketing/page-hero";
import { SITE_URL } from "@/lib/site";
import {
  nextSprechstunden,
  SPRECHSTUNDE_BEGINN_HHMM,
  SPRECHSTUNDE_ENDE_HHMM,
  SPRECHSTUNDE_RUFNUMMER,
  TYPISCHE_THEMEN,
} from "@/lib/sprechstunde-data";

export const metadata: Metadata = {
  title: "Sprechstunde — jeden ersten Donnerstag",
  description:
    "Anderthalb Stunden Telefonzeit im Monat, jeden ersten Donnerstag von 17 bis 18:30 Uhr. Auch für Nicht-Kunden, eine Anmeldung brauchen Sie nicht.",
  alternates: { canonical: "/sprechstunde" },
};

/**
 * `/sprechstunde` — feste monatliche Telefon-Sprechstunde.
 *
 * Erster Donnerstag im Monat, 17:00–18:30 Uhr, Telefonnummer offen,
 * ohne Verkauf. Auch für Leute, die nie Kunde werden.
 *
 * Datum wird zur Build-Zeit aus Europe/Berlin-Logik berechnet —
 * die Seite kennt also die nächsten drei Termine ohne Pflege.
 *
 * Aufbau: dunkler Kopf, darunter die Termine als Fahrplan-Tafel
 * (der nächste hervorgehoben), dann der Ablauf eines Anrufs als
 * echte Reihenfolge, die Beispielfragen auf dunkler Fläche und zum
 * Schluss der Weg zum eigenen Termin.
 */
export default function SprechstundePage() {
  const termine = nextSprechstunden(3);

  // Event-Schema pro Sprechstunde-Termin (kommende drei) + Breadcrumb.
  // Der erste Donnerstag liegt von April bis Oktober immer in der
  // Sommerzeit (+02:00), sonst in der Winterzeit (+01:00).
  const eventLds = termine.map((t) => {
    const offset = berlinOffset(t.iso);
    return {
      "@context": "https://schema.org",
      "@type": "Event",
      name: "Offene Telefon-Sprechstunde bei Sitalo Webdesign",
      description:
        "Anderthalb Stunden offene Telefon-Sprechstunde, auch für Nicht-Kunden und ohne Anmeldung. Wir beantworten Fragen zu Webdesign, Hosting, lokaler Sichtbarkeit und Ihrem eigenen Website-Projekt.",
      startDate: `${t.iso}T${SPRECHSTUNDE_BEGINN_HHMM}:00${offset}`,
      endDate: `${t.iso}T${SPRECHSTUNDE_ENDE_HHMM}:00${offset}`,
      eventAttendanceMode: "https://schema.org/OnlineEventAttendanceMode",
      eventStatus: "https://schema.org/EventScheduled",
      location: {
        "@type": "VirtualLocation",
        url: `tel:+491607621876`,
      },
      organizer: {
        "@type": "LocalBusiness",
        "@id": `${SITE_URL}/#business`,
        name: "Sitalo Webdesign",
        url: SITE_URL,
      },
      isAccessibleForFree: true,
      offers: {
        "@type": "Offer",
        url: `${SITE_URL}/sprechstunde`,
        price: "0",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        validFrom: t.iso,
      },
    };
  });

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Sitalo", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Sprechstunde",
        item: `${SITE_URL}/sprechstunde`,
      },
    ],
  };

  const jsonLd = [...eventLds, breadcrumbLd];

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader tone="dark" />
      <main id="main" tabIndex={-1} className="flex-1">
        <PageHero
          crumb="Sprechstunde"
          eyebrow={`Erster Donnerstag · ${SPRECHSTUNDE_BEGINN_HHMM}–${SPRECHSTUNDE_ENDE_HHMM}`}
          title="Sprechstunde am ersten Donnerstag"
        >
          Einmal im Monat sind wir anderthalb Stunden lang am Telefon für alle, die eine Frage zur eigenen Website
          haben. Anrufen kann jeder, auch wer nie Kunde wird. Eine Anmeldung brauchen Sie nicht.
        </PageHero>
        <Termine termine={termine} />
        <Ablauf />
        <Themen />
        <EigenerTermin />
      </main>
      <MarketingFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}

/** Zeitzonen-Versatz für Europe/Berlin am ersten Donnerstag eines
 *  Monats: April bis Oktober Sommerzeit, sonst Winterzeit. */
function berlinOffset(iso: string): string {
  const month = Number(iso.slice(5, 7));
  return month >= 4 && month <= 10 ? "+02:00" : "+01:00";
}

/* ------------------------------------------------------------------
 * Termine als Fahrplan-Tafel: Datum, Zeit, Nummer. Der nächste
 * Termin steht oben und trägt den Anruf-Knopf.
 * ---------------------------------------------------------------- */
function Termine({ termine }: { termine: { iso: string; longLabel: string }[] }) {
  const [next, ...later] = termine;
  const zeit = `${SPRECHSTUNDE_BEGINN_HHMM}–${SPRECHSTUNDE_ENDE_HHMM} Uhr`;
  return (
    <section aria-labelledby="termine-titel">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <h2
            id="termine-titel"
            className="text-balance text-[2rem] leading-[1.0] tracking-[-0.032em] sm:text-[2.75rem]"
          >
            Die nächsten Termine
          </h2>
          <a
            href="/sprechstunde/termine.ics"
            download="sitalo-sprechstunde.ics"
            className="inline-flex items-center gap-2 text-[15px] font-semibold underline-offset-4 hover:underline"
          >
            <CalendarPlus className="h-4 w-4" aria-hidden="true" />
            Alle drei in den Kalender
          </a>
        </div>

        <div className="border-foreground mt-10 border-t-2">
          <div className="text-muted-foreground hidden grid-cols-[minmax(0,1fr)_11rem_13rem] gap-x-8 py-3 sm:grid">
            <span className="label-mono">Datum</span>
            <span className="label-mono">Zeit</span>
            <span className="label-mono">Nummer</span>
          </div>
          <ol>
            {next ? (
              <li className="border-border grid gap-x-8 gap-y-2 border-t py-7 sm:grid-cols-[minmax(0,1fr)_11rem_13rem] sm:items-baseline sm:py-9">
                <div className="min-w-0">
                  <p className="label-mono text-gold">Nächster Termin</p>
                  <p
                    className="mt-2 text-[1.7rem] leading-[1.05] tracking-[-0.03em] sm:text-[2.4rem]"
                    style={{ fontStretch: "112%", fontWeight: 740 }}
                  >
                    {next.longLabel}
                  </p>
                </div>
                <p className="font-mono text-[15px] tabular-nums">{zeit}</p>
                <div>
                  <p className="font-mono text-[15px] tabular-nums">{SPRECHSTUNDE_RUFNUMMER}</p>
                  <a href="tel:+491607621876" className="btn-signal mt-4 h-11 text-[14.5px]">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    Am Termin anrufen
                  </a>
                </div>
              </li>
            ) : null}
            {later.map((t) => (
              <li
                key={t.iso}
                className="border-border grid gap-x-8 gap-y-1 border-t py-5 sm:grid-cols-[minmax(0,1fr)_11rem_13rem] sm:items-baseline sm:py-6"
              >
                <span className="text-[1.15rem] font-semibold tracking-[-0.015em] sm:text-[1.3rem]">
                  {t.longLabel}
                </span>
                <span className="text-muted-foreground font-mono text-[14px] tabular-nums">{zeit}</span>
                <span className="text-muted-foreground font-mono text-[14px] tabular-nums">
                  {SPRECHSTUNDE_RUFNUMMER}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Ablauf eines Anrufs: vier Schritte in fester Reihenfolge, deshalb
 * mit Nummern.
 * ---------------------------------------------------------------- */
const SCHRITTE = [
  {
    titel: "Anrufen",
    text: "Sie wählen die Nummer am Termin. Ist besetzt, warten Sie kurz, wir rufen zurück.",
  },
  {
    titel: "Fragen",
    text: "Sie sagen in zwei, drei Sätzen, was Sie wissen wollen.",
  },
  {
    titel: "Antwort",
    text: "Wir antworten so konkret wie möglich. Kommen wir nicht weiter, sagen wir auch das.",
  },
  {
    titel: "Auflegen",
    text: "Damit ist das Gespräch erledigt. Von selbst melden wir uns danach nicht bei Ihnen.",
  },
];

function Ablauf() {
  return (
    <section className="bg-card border-border border-t" aria-labelledby="ablauf-titel">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <h2 id="ablauf-titel" className="text-balance text-[2rem] leading-[1.0] tracking-[-0.032em] sm:text-[2.75rem]">
          So läuft ein Anruf ab
        </h2>
        <ol className="mt-10 grid gap-x-8 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
          {SCHRITTE.map((s, i) => (
            <li key={s.titel} className="border-foreground border-t pt-5 pb-8 lg:pb-0">
              <p className="label-mono text-muted-foreground">
                <span className="text-gold">{String(i + 1).padStart(2, "0")}</span> · {s.titel}
              </p>
              <p className="text-foreground/85 mt-3 text-pretty text-[16px] leading-relaxed">{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Beispielfragen auf dunkler Fläche, ohne Nummern: Die Liste hat
 * keine Reihenfolge.
 * ---------------------------------------------------------------- */
function Themen() {
  return (
    <section className="grain bg-foreground text-background" aria-labelledby="themen-titel">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <h2
            id="themen-titel"
            className="text-balance text-[2rem] leading-[1.02] tracking-[-0.032em] sm:text-[2.6rem]"
          >
            Fragen, die hierher passen
          </h2>
          <p className="text-stahl-hell mt-5 max-w-sm text-[16px] leading-relaxed">
            Steht Ihre Frage nicht dabei, rufen Sie trotzdem an. Die Beispiele sollen nur zeigen, dass auch kleine
            Fragen in die Sprechstunde gehören.
          </p>
        </div>
        <ul className="grid sm:grid-cols-2 sm:gap-x-8 lg:col-span-8">
          {TYPISCHE_THEMEN.map((thema) => (
            <li
              key={thema}
              className="border-background/20 text-background/90 border-t py-5 text-pretty text-[16px] leading-relaxed"
            >
              {thema}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Schluss: der planbare Weg für ein eigenes Vorhaben.
 * ---------------------------------------------------------------- */
function EigenerTermin() {
  return (
    <section>
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:items-end lg:gap-8">
        <div className="lg:col-span-7">
          <h2 className="text-balance text-[1.9rem] leading-[1.05] tracking-[-0.03em] sm:text-[2.6rem]">
            Für ein eigenes Vorhaben gibt es den 30-Minuten-Termin
          </h2>
          <p className="text-muted-foreground mt-5 max-w-xl text-pretty text-[16.5px] leading-relaxed">
            Die Sprechstunde ist offen für alle und nicht planbar. Wollen Sie über Ihr Projekt sprechen, buchen Sie
            einen eigenen Termin. Tag und Uhrzeit wählen Sie selbst, die Bestätigung kommt am selben Werktag per Mail.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-4 lg:col-span-4 lg:col-start-9 lg:justify-end">
          <Link href="/termin" className="btn-signal">
            Termin buchen <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href="/journal"
            className="inline-flex items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline"
          >
            Zum Journal <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
