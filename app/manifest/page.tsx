import type { Metadata } from "next";
import { ogFor } from "@/lib/seo";
import { SitaloSignatur } from "@/components/marketing/hafen/sitalo-signatur";
import {
  FotoRahmen,
  KontaktKarte,
  SeitenKopf,
  UnterseiteMain,
  unterseiteStil as u,
} from "@/components/marketing/laden/unterseite";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { SITE_URL } from "@/lib/site";

const ARTICLE_LD = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Sitalo Manifest — acht Grundsätze",
  description:
    "Was Sitalo macht, was Sitalo nicht macht, woran sich Inhaber wie Kunden verlassen können.",
  author: { "@type": "Organization", name: "Sitalo Webdesign", url: SITE_URL },
  publisher: { "@id": `${SITE_URL}/#business` },
  mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/manifest` },
};

const BREADCRUMB_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Sitalo", item: `${SITE_URL}/` },
    {
      "@type": "ListItem",
      position: 2,
      name: "Manifest",
      item: `${SITE_URL}/manifest`,
    },
  ],
};

export const metadata: Metadata = {
  title: "Manifest · Wie wir Websites bauen",
  description:
    "Acht Grundsätze. Was Sitalo macht, was Sitalo nicht macht, woran sich Inhaber wie Kunden verlassen können.",
  alternates: { canonical: "/manifest" },
  openGraph: ogFor("/manifest"),
};

/**
 * `/manifest` — Seitenkopf, darunter ein einzelnes Blatt als weiße
 * runde Karte: acht Grundsätze, am Fuß die Signatur. Die Grundsätze haben keine Reihenfolge, deshalb
 * keine Nummern; links steht in Mono, worum es jeweils geht.
 *
 * Jede Aussage muss sich mit dem Rest der Seite decken (Festpreis,
 * Test-Link, Monatsbeitrag, Übergabe beim Wechsel, Antwortzeit).
 */
const SAETZE: { thema: string; lead: string; coda: string }[] = [
  {
    thema: "Für wen",
    lead: "Wir bauen Websites für kleine Betriebe.",
    coda: "Wir sitzen in Hamburg. Wo Ihr Betrieb ist, spielt für die Arbeit keine Rolle.",
  },
  {
    thema: "Preis",
    lead: "Den Festpreis bekommen Sie schriftlich, bevor wir anfangen.",
    coda: "Kommt später etwas dazu, sprechen wir vorher darüber.",
  },
  {
    thema: "Unterlagen",
    lead: "Von Ihnen brauchen wir Handyfotos und ein paar Stichpunkte.",
    coda: "Den Text schreiben wir. Sie streichen, was nicht stimmt.",
  },
  {
    thema: "Test-Link",
    lead: "Ihre Seite sehen Sie auf einem Test-Link, bevor sie online geht.",
    coda: "Was Sie dort freigeben, geht genau so online.",
  },
  {
    thema: "Kapazität",
    lead: "Wir nehmen nur so viele Aufträge an, wie wir sorgfältig fertig bekommen.",
    coda: "Jede Seite bauen und betreuen wir selbst. Den Starttermin nennen wir Ihnen im ersten Gespräch.",
  },
  {
    thema: "Google",
    lead: "Einen Platz bei Google versprechen wir nicht.",
    coda: "Wir bauen die Seite so, dass Google sie gut lesen kann. Die Reihenfolge der Treffer kann niemand zusagen.",
  },
  {
    thema: "Antwortzeit",
    lead: "Wir antworten meist am selben Werktag.",
    coda: "Nachts schlafen wir, und am Wochenende bleibt die Mail bis Montag liegen.",
  },
  {
    thema: "Eigentum",
    lead: "Die Seite gehört Ihnen.",
    coda: "Wechseln Sie später den Anbieter, bekommen Sie Quellcode und Inhalte vollständig übergeben.",
  },
];

export default function ManifestPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader cta={false} />
      <UnterseiteMain>
        <SeitenKopf
          krumen="Manifest"
          eyebrow="Sitalo Webdesign · Hamburg"
          titel="Manifest"
          unter="Acht Grundsätze darüber, wie wir arbeiten. Wir haben sie aufgeschrieben, damit Sie uns daran messen können."
          bild={
            <FotoRahmen
              vorab
              src="/images/hamburg-speicherstadt.webp"
              alt="Speicherstadt in Hamburg mit Backsteinfassaden am Fleet"
              aspect="21 / 9"
              aspectMobil="16 / 9"
              position="50% 50%"
            />
          }
          unterschrift="Speicherstadt, Hamburg"
        />
        <section aria-label="Acht Grundsätze" className={u.abschnitt}>
          <div className="inhalt">
            <article className="rounded-[18px] bg-white shadow-[0_4px_16px_rgb(0_0_0/0.06)] sm:rounded-[28px]">
              <ul className="divide-y divide-black/10">
                {SAETZE.map((s) => (
                  <li
                    key={s.thema}
                    className="grid gap-3 px-6 py-7 sm:grid-cols-[9.5rem_1fr] sm:gap-8 sm:px-10 sm:py-9"
                  >
                    <span className="notiz-mono sm:pt-2">{s.thema}</span>
                    <div>
                      <p className="text-[24px] leading-[1.17] font-semibold tracking-[-0.02em] text-balance sm:text-[28px]">
                        {s.lead}
                      </p>
                      <p className="mt-3 max-w-xl text-[17px] leading-[1.5] tracking-[-0.022em] text-pretty text-[#6e6e73]">
                        {s.coda}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <footer className="flex flex-wrap items-end justify-between gap-6 border-t border-black/10 px-6 py-8 sm:px-10">
                <p className="notiz-mono">Sitalo Webdesign · Hamburg</p>
                <SitaloSignatur
                  caption="Aus dem Büro in Hamburg"
                  className="max-w-[180px]"
                />
              </footer>
            </article>
          </div>
        </section>
        <KontaktKarte
          id="abschluss"
          titel="Messen Sie uns daran."
          zeile="Wenn Sie wissen möchten, wie das bei Ihrem Betrieb aussieht, rufen Sie an oder schreiben Sie uns. Wir antworten meist am selben Werktag."
          pille={{ href: "/anfrage", label: "Website anfragen" }}
          link={{ href: "/atelier", label: "Wie ein Auftrag bei uns läuft" }}
          foto={{
            src: "/images/workspace-macbook.webp",
            alt: "Schreibtisch von oben mit Laptop, Notizbuch und einer Tasse Kaffee",
          }}
        />
      </UnterseiteMain>
      <MarketingFooter crumb="Manifest" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([ARTICLE_LD, BREADCRUMB_LD]),
        }}
      />
    </div>
  );
}
