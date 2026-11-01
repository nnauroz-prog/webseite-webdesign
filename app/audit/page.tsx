import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { AuditForm } from "@/components/marketing/audit-form";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { PageHero } from "@/components/marketing/page-hero";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Kostenlose Website-Durchsicht (Website-Audit)",
  description:
    "Wir sehen uns Ihre Website von Hand an und schicken drei bis fünf konkrete Punkte per Mail, meist innerhalb von zwei Werktagen. Kostenlos, aus Hamburg.",
  alternates: { canonical: "/audit" },
};

/** Was nach dem Absenden passiert. Echte Reihenfolge, daher nummeriert. */
const SCHRITTE: { title: string; body: string }[] = [
  {
    title: "Sie schicken die Adresse",
    body: "Das Formular hat drei Pflichtfelder.",
  },
  {
    title: "Wir sehen uns die Seite an",
    body: "Am Handy und am Rechner, so wie Ihre Kunden sie sehen.",
  },
  {
    title: "Sie bekommen eine E-Mail",
    body: "Meist innerhalb von zwei Werktagen, mit drei bis fünf Punkten.",
  },
];

/**
 * Muster einer Durchsicht-Mail. Der Betrieb ist die erfundene Tischlerei
 * Nordholz aus dem Vorher-Nachher der Startseite; die Punkte passen
 * zu deren „Vorher“-Seite (Willkommen-Titel, Öffnungszeiten als PDF,
 * Cookie-Banner über dem Inhalt).
 */
const MUSTER_PUNKTE = [
  "Die Startseite beginnt mit „Willkommen“. Dass Sie Möbel und Treppen bauen, steht erst im kleinen Text darunter. Das gehört in die erste Zeile.",
  "Die Öffnungszeiten stecken in einem PDF mit 1,2 MB. Am Handy startet dafür erst ein Download. Als Text auf der Startseite sind sie sofort lesbar.",
  "Eine Telefonnummer gibt es nur unter „Kontakt“. Oben auf der Startseite, als Anruf-Link, wäre sie am Handy mit einem Tipp gewählt.",
];

/**
 * `/audit` — Lead-Magnet-Seite.
 *
 * Versprechen: eine Durchsicht per Mail, meist innerhalb von zwei
 * Werktagen (keine Stundenfrist, weil Wochenenden dazwischen liegen
 * können, siehe /erreichbarkeit). Keine
 * Lighthouse-Reports, keine Score-Karten, sondern 3–5 konkrete
 * Punkte, von Hand geschrieben. Statt das zu beschreiben, zeigt die
 * Seite eine Muster-Mail.
 *
 * Bewusst eigenständig (nicht in /anfrage), weil das Versprechen ein
 * anderes ist: hier wird noch keine Anfrage gestellt.
 */
export default function AuditPage() {
  // Service + BreadcrumbList JSON-LD — die kostenlose Durchsicht ist
  // ein eigenständiger Service (3–5 Punkte per Mail, meist in zwei
  // Werktagen).
  const serviceLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Kostenlose Website-Durchsicht",
    alternateName: "Website-Audit",
    description:
      "Durchsicht Ihrer aktuellen Website von Hand: drei bis fünf konkrete Verbesserungspunkte per Mail, meist innerhalb von zwei Werktagen.",
    provider: {
      "@type": "LocalBusiness",
      "@id": `${SITE_URL}/#business`,
      name: "Sitalo Webdesign",
    },
    areaServed: { "@type": "Country", name: "Deutschland" },
    serviceType: "Website-Audit",
    url: `${SITE_URL}/audit`,
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
        name: "Durchsicht",
        item: `${SITE_URL}/audit`,
      },
    ],
  };

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader tone="dark" />

      <main id="main" tabIndex={-1} className="flex-1">
        <PageHero
          crumb="Durchsicht"
          eyebrow="Kostenlose Durchsicht Ihrer Website"
          title="Wir sehen uns Ihre Website an."
        >
          Sie bekommen meist innerhalb von zwei Werktagen eine E-Mail mit drei
          bis fünf Punkten: was an Ihrer Seite funktioniert und was wir zuerst
          ändern würden. Ob Sie sich danach melden, entscheiden Sie.
        </PageHero>

        <section aria-label="Durchsicht anfordern">
          <div className="mx-auto w-full max-w-6xl px-5 pt-10 pb-16 sm:px-6 sm:pt-14 sm:pb-20">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
              <div className="min-w-0 lg:col-span-7">
                <AuditForm />
              </div>
              <aside className="lg:col-span-4 lg:col-start-9 lg:pt-2">
                <h2 className="label-mono text-muted-foreground">So geht es weiter</h2>
                <ol className="border-foreground mt-5 border-t">
                  {SCHRITTE.map((s, i) => (
                    <li
                      key={s.title}
                      className="border-border grid grid-cols-[2.5rem_1fr] border-b py-4"
                    >
                      <span className="text-gold pt-0.5 font-mono text-[12.5px] font-semibold tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="min-w-0">
                        <p className="text-foreground text-[15.5px] font-semibold">
                          {s.title}
                        </p>
                        <p className="text-muted-foreground mt-1 text-[14px] leading-relaxed">
                          {s.body}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </aside>
            </div>
          </div>
        </section>

        <section className="bg-card border-border border-y">
          <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
            <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
              <div className="lg:col-span-5">
                <p className="label-mono text-muted-foreground">Was Sie bekommen</p>
                <h2 className="mt-5 text-balance text-[2rem] leading-[1.04] tracking-[-0.032em] sm:text-[2.6rem]">
                  Eine E-Mail, die wir selbst schreiben.
                </h2>
                <div className="text-muted-foreground mt-6 max-w-md space-y-4 text-[15.5px] leading-relaxed text-pretty">
                  <p>
                    Wir öffnen Ihre Seite am Handy und am Rechner und notieren,
                    was einem Kunden auffällt. Zu jedem Punkt nennen wir die
                    Stelle und was wir dort ändern würden.
                  </p>
                  <p>
                    Einen PDF-Bericht mit Punktzahlen gibt es nicht. Wer die
                    Technik messen will, nimmt den{" "}
                    <Link
                      href="/check"
                      className="text-foreground underline underline-offset-4"
                    >
                      Ladezeit-Test
                    </Link>
                    . Wenn Sie auf die Mail antworten, antworten wir Ihnen
                    selbst.
                  </p>
                </div>
              </div>

              <figure className="min-w-0 lg:col-span-7">
                <div className="bg-background border-border rounded-[3px] border shadow-[0_24px_48px_-32px_rgb(27_29_30/0.45)]">
                  <dl className="border-border space-y-1.5 border-b px-5 py-4 font-mono text-[12.5px] sm:px-7">
                    <div className="flex gap-3">
                      <dt className="text-muted-foreground w-16 shrink-0">Von</dt>
                      <dd className="text-foreground min-w-0">info@sitalo.de</dd>
                    </div>
                    <div className="flex gap-3">
                      <dt className="text-muted-foreground w-16 shrink-0">An</dt>
                      <dd className="text-foreground min-w-0">Tischlerei Nordholz</dd>
                    </div>
                    <div className="flex gap-3">
                      <dt className="text-muted-foreground w-16 shrink-0">Betreff</dt>
                      <dd className="text-foreground min-w-0">Ihre Website, drei Punkte</dd>
                    </div>
                  </dl>
                  <div className="text-foreground/90 space-y-4 px-5 py-6 text-[15px] leading-relaxed sm:px-7 sm:py-7">
                    <p>Guten Tag,</p>
                    <p>
                      wir haben uns Ihre Seite am Handy und am Rechner
                      angesehen. Diese drei Stellen würden wir zuerst ändern:
                    </p>
                    <ol className="space-y-3">
                      {MUSTER_PUNKTE.map((p, i) => (
                        <li key={i} className="grid grid-cols-[1.5rem_1fr]">
                          <span className="text-muted-foreground font-mono text-[13px] tabular-nums">
                            {i + 1}.
                          </span>
                          <span className="min-w-0">{p}</span>
                        </li>
                      ))}
                    </ol>
                    <p>
                      Gut gelöst ist das Foto aus der Werkstatt. Das würden wir
                      behalten.
                    </p>
                    <p>
                      Viele Grüße aus Hamburg
                      <br />
                      Sitalo Webdesign
                    </p>
                  </div>
                </div>
                <figcaption className="text-muted-foreground mt-3 font-mono text-[12px]">
                  Muster. Die Tischlerei Nordholz haben wir erfunden.
                </figcaption>
              </figure>
            </div>
          </div>
        </section>

        <section>
          <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
            <h2 className="label-mono text-muted-foreground">Andere Wege</h2>
            <ul className="border-foreground mt-5 border-t">
              <WegZeile
                href="/check"
                title="Ladezeit-Test"
                body="Nur die Technik messen. Ergebnis nach 15 bis 30 Sekunden, ohne Kontaktdaten."
              />
              <WegZeile
                href="/anfrage"
                title="Website anfragen"
                body="Sie wissen schon, dass eine neue Seite her soll. Antwort meist am selben Werktag."
              />
              <WegZeile
                href="tel:+491607621876"
                title="0160\u00A07621876"
                body="Für alle, die lieber gleich sprechen. Ans Telefon gehen wir selbst."
                external
              />
            </ul>
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

function WegZeile({
  href,
  title,
  body,
  external = false,
}: {
  href: string;
  title: string;
  body: string;
  external?: boolean;
}) {
  const className =
    "group border-border grid gap-1 border-b py-5 sm:grid-cols-[16rem_1fr_auto] sm:items-baseline sm:gap-8";
  const content = (
    <>
      <span className="text-foreground text-[1.25rem] leading-tight font-bold tracking-[-0.015em] tabular-nums [font-stretch:110%] group-hover:underline group-hover:underline-offset-4">
        {title}
      </span>
      <span className="text-muted-foreground text-[15px] leading-relaxed">{body}</span>
      <ArrowRight
        className="text-foreground hidden h-4 w-4 transition-transform group-hover:translate-x-1 sm:block"
        aria-hidden="true"
      />
    </>
  );
  return (
    <li>
      {external ? (
        <a href={href} className={className}>
          {content}
        </a>
      ) : (
        <Link href={href} className={className}>
          {content}
        </Link>
      )}
    </li>
  );
}
