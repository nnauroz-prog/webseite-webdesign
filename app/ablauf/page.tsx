import type { Metadata } from "next";
import { ogFor } from "@/lib/seo";

import Link from "next/link";

import { MehrLink } from "@/components/marketing/apple";
import { WegBand } from "@/components/marketing/laden/bilder/weg-band";
import {
  Abschnitt,
  FotoRahmen,
  KontaktKarte,
  SeitenKopf,
  UnterseiteMain,
} from "@/components/marketing/laden/unterseite";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { Produktleiste } from "@/components/marketing/produktleiste";
import { ABLAUF_HALTE } from "@/lib/ablauf-data";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ablauf: So läuft Ihr Website-Projekt ab",
  description:
    "So läuft es bei uns: Sie schreiben uns, wir sprechen kurz, wir bauen, Sie prüfen den Test-Link, die Seite geht online. Mit Festpreis vorab.",
  alternates: { canonical: "/ablauf" },
  openGraph: ogFor("/ablauf", undefined, undefined, "website", {
    defaultImage: true,
  }),
};

const STEPS = ABLAUF_HALTE;

export default function AblaufPage() {
  // HowTo-Schema mit den 6 Schritten plus BreadcrumbList für die
  // Hierarchie. Keine totalTime: Kleine Seiten stehen oft nach ein bis
  // zwei Werktagen, größere bekommen einen eigenen Termin. Eine feste
  // Gesamtdauer würde einer der beiden Aussagen widersprechen.
  const howToLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "So läuft Ihr Website-Projekt mit Sitalo ab",
    description:
      "Sechs Halte vom ersten Anruf bis zur fertigen Seite, mit Festpreis vorab und verbindlichem Termin.",
    step: STEPS.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.body,
      url: `${SITE_URL}/ablauf#step-${s.number}`,
    })),
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
        name: "Ablauf",
        item: `${SITE_URL}/ablauf`,
      },
    ],
  };

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader cta={false} />
      <Produktleiste
        titel="Ablauf"
        links={[]}
        cta={{ href: "/anfrage", label: "Anfragen" }}
      />
      <UnterseiteMain>
        <SeitenKopf
          krumen="Ablauf"
          eyebrow="Fahrplan · Ablauf"
          titel="So läuft Ihr Website-Projekt ab"
          unter="Sechs Halte vom ersten Anruf bis zur fertigen Seite. Sie sprechen dabei die ganze Zeit mit uns selbst, und den Termin, an dem die Seite online geht, nennen wir Ihnen vorab."
          aktionen={
            <>
              <Link href="/anfrage" className="btn-signal btn-gross">
                Anfrage schreiben
              </Link>
              <MehrLink href="/termin" groesse="unter">
                Termin buchen
              </MehrLink>
            </>
          }
          bild={
            <FotoRahmen
              vorab
              src="/images/workspace-typing.webp"
              alt="Hände auf der Tastatur eines Laptops in warmem Licht"
              aspect="21 / 9"
              aspectMobil="16 / 10"
              position="50% 45%"
            />
          }
          unterschrift="Halt 4: Aus Ihren Stichpunkten werden Texte"
        />
        <Fahrplan />
        <KontaktKarte
          titel="Der erste Halt ist ein Anruf oder eine Anfrage."
          zeile="Wer lieber schreibt, nutzt das Anfrageformular. Danach geht es mit Halt 2 weiter."
          link={{ href: "/termin", label: "Termin buchen" }}
          foto={{
            src: "/images/cafe-eimsbuettel.webp",
            alt: "Café-Tisch mit zwei Stühlen an einer Kopfsteinpflasterstraße in Eimsbüttel",
            position: "50% 60%",
          }}
        />
      </UnterseiteMain>
      <MarketingFooter crumb="Ablauf" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([howToLd, breadcrumbLd]),
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------
 * Fahrplan: sechs weiße Karten mit dem Elbe-Band der Startseite oben
 * (die Fähre fährt von Karte zu Karte weiter), darunter Titel, Text und
 * „Wer · Hinweis“ (Subgrid). Danach ein großes Bild zum Test-Link
 * (Musterseite, frei erfunden).
 * Anker #step-01 … bleiben (HowTo-Schema).
 * ---------------------------------------------------------------- */
const ZEICHEN = [0, 0, 1, 1, 2, 3];

function HaltKarte({ step, i }: { step: (typeof STEPS)[number]; i: number }) {
  const last = i === STEPS.length - 1;
  // Subgrid: Band, Halt, Titel, Text und „Wer · Hinweis“ liegen in allen
  // Karten einer Reihe auf derselben Linie.
  return (
    <li
      id={`step-${step.number}`}
      className={`row-span-5 grid scroll-mt-28 grid-rows-subgrid gap-0 overflow-hidden rounded-[18px] shadow-[0_4px_16px_rgb(0_0_0/0.08)] ${
        last ? "on-dark bg-[#0f2a3a] text-[#f5f5f7]" : "bg-white"
      }`}
      data-flaeche-dunkel={last ? "" : undefined}
    >
      {/* Bildband im vollen Verhältnis der Szene (200 × 88), nichts abgeschnitten */}
      <span className="block aspect-[200/88] w-full" aria-hidden="true">
        <WegBand i={i} teile={6} zeichen={ZEICHEN[i]} />
      </span>
      <p
        className={`px-[22px] pt-5 text-[12px] leading-4 font-semibold sm:px-7 sm:pt-6 ${last ? "text-[#ff9f5a]" : "text-gold-ink"}`}
      >
        {last ? "Endhalt" : `Halt ${i + 1}`}
      </p>
      <h3 className="mt-1.5 px-[22px] text-[21px] leading-[25px] font-bold text-balance sm:px-7 lg:text-[24px] lg:leading-[28px]">
        {step.title}
      </h3>
      <p
        className={`mt-3 px-[22px] pb-5 text-[15px] leading-[22px] tracking-[-0.016em] text-pretty sm:px-7 sm:text-[17px] sm:leading-[25px] ${last ? "text-[#a1a1a6]" : "text-[#6e6e73]"}`}
      >
        {step.body}
      </p>
      <div className="px-[22px] pb-6 sm:px-7 sm:pb-7">
        <dl
          className={`grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 border-t pt-4 text-[14px] leading-5 ${
            last ? "border-white/15" : "border-black/10"
          }`}
        >
          <dt className={last ? "text-[#a1a1a6]" : "text-[#6e6e73]"}>Wer</dt>
          <dd className="font-semibold">{step.wer}</dd>
          <dt className={last ? "text-[#a1a1a6]" : "text-[#6e6e73]"}>
            Hinweis
          </dt>
          <dd>{step.hinweis}</dd>
        </dl>
      </div>
    </li>
  );
}

function Fahrplan() {
  return (
    <Abschnitt
      id="halte"
      fett="Sechs Halte."
      grau="Vom ersten Satz bis online."
      unter="Was eine Seite kostet, steht vorher fest. Kommt etwas dazu, sprechen wir vorher darüber."
    >
      {/* Am Handy eine Route: links die Linie, die Fähre fährt beim
          Scrollen von Halt zu Halt (--rp/--ry setzt effekte.tsx). */}
      <div className="fahr-route" data-route="">
        <span className="fahr-route-boot" aria-hidden="true">
          <svg viewBox="0 0 26 14" width="26" height="14" focusable="false">
            <path
              d="M1 8h24l-2.6 4.2a2 2 0 0 1-1.7.8H5.3a2 2 0 0 1-1.7-.8z"
              fill="#1d1d1f"
            />
            <path d="M1.6 8h22.8l-.7 1.2H2.3z" fill="#f45b1e" />
            <rect
              x="6"
              y="3.2"
              width="12"
              height="4.8"
              rx="1"
              fill="#fff"
              stroke="#1d1d1f"
              strokeWidth="0.8"
            />
            <rect x="15.4" y="0.6" width="1.8" height="2.6" fill="#f45b1e" />
          </svg>
        </span>
        <ol
          role="list"
          data-ein="reihe"
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5"
        >
          {STEPS.map((step, i) => (
            <HaltKarte key={step.number} step={step} i={i} />
          ))}
        </ol>
      </div>
      <div className="mt-3 lg:mt-5">
        <FotoRahmen
          src="/images/sitalo-praxis-laptop.webp"
          alt="Laptop am Empfang einer Zahnarztpraxis, auf dem Bildschirm die Musterseite der Praxis"
          aspect="21 / 9"
          aspectMobil="4 / 3"
          position="50% 42%"
          muster
          satz="Erst ansehen, dann freigeben. Den Test-Link öffnen Sie auf Ihren eigenen Geräten."
        />
      </div>
      <p className="mt-8 flex flex-wrap gap-x-8">
        <MehrLink href="/pakete">Pakete</MehrLink>
        <MehrLink href="/faq">Fragen</MehrLink>
      </p>
    </Abschnitt>
  );
}
