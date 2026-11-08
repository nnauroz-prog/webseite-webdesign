import type { Metadata } from "next";

import Link from "next/link";

import { MehrLink } from "@/components/marketing/apple";
import a from "@/components/marketing/hafen/atelier.module.css";
import {
  Abschnitt,
  FotoRahmen,
  KontaktKarte,
  SeitenKopf,
  UnterseiteMain,
  unterseiteStil as u,
} from "@/components/marketing/laden/unterseite";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { ABLAUF_HALTE } from "@/lib/ablauf-data";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Ablauf: So läuft Ihr Website-Projekt ab",
  description:
    "So läuft es bei uns: Sie schreiben uns, wir sprechen kurz, wir bauen, Sie prüfen den Test-Link, die Seite geht online. Mit Festpreis vorab.",
  alternates: { canonical: "/ablauf" },
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
      { "@type": "ListItem", position: 1, name: "Sitalo", item: `${SITE_URL}/` },
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
 * Fahrplan: senkrechte Fährlinie mit sechs Halten. Beim Scrollen färbt
 * sich die Linie Halt für Halt orange, die Punkte laufen an, am Ende
 * steht der Endhalt mit Ring (CSS-Scroll-Timeline, nur transform und
 * opacity). Ohne Unterstützung oder bei reduzierter Bewegung ist die
 * Linie von Anfang an ganz gefärbt. Anker #step-01 … bleiben (HowTo).
 * ---------------------------------------------------------------- */
function Fahrplan() {
  const last = STEPS.length - 1;
  return (
    <Abschnitt
      id="halte"
      eyebrow="Fährlinie · sechs Halte"
      fett="Vom ersten Satz bis zur fertigen Seite"
      unter="Was eine Seite kostet, steht vorher fest. Kommt etwas dazu, sprechen wir vorher darüber."
    >
      <div className="text-muted-foreground hidden grid-cols-[2.5rem_minmax(0,1fr)_17rem] gap-x-10 pb-3 font-mono text-[11px] tracking-[0.14em] uppercase lg:grid">
        <span aria-hidden="true" />
        <span>Halt und was passiert</span>
        <span>Wer · Hinweis</span>
      </div>
      <ol className={a.fahrplan}>
        {STEPS.map((step, i) => (
          <li key={step.number} id={`step-${step.number}`} className={`${a.halt} scroll-mt-24`}>
            <div aria-hidden="true" className={a.haltSpur}>
              <span className={`${a.linie} ${i === 0 ? a.linieErst : i === last ? a.linieLetzt : a.linieMitte}`}>
                <span className={a.linieFarbe} />
              </span>
              <span className={a.punktOrt}>
                <span className={a.punkt}>
                  <span className={a.punktFarbe} />
                  {i === last ? <span className={a.endRing} /> : null}
                </span>
              </span>
            </div>
            <div className={a.haltText}>
              <p className={a.haltNr}>{i === last ? "Endhalt" : `Halt ${i + 1}`}</p>
              <h3 className={a.haltTitel}>{step.title}</h3>
              <p className={a.haltSatz}>{step.body}</p>
            </div>
            <dl className={a.haltWer}>
              <dt>Wer</dt>
              <dd>{step.wer}</dd>
              <dt>Hinweis</dt>
              <dd>{step.hinweis}</dd>
            </dl>
          </li>
        ))}
      </ol>
      <figure className="mt-14 sm:mt-20">
        <FotoRahmen
          src="/images/sitalo-praxis-laptop.webp"
          alt="Laptop am Empfang einer Zahnarztpraxis, auf dem Bildschirm die Musterseite der Praxis"
          aspect="21 / 9"
          aspectMobil="4 / 3"
          position="50% 42%"
        />
        <figcaption className={`${u.unterschrift}`}>
          Halt 5: Erst ansehen, dann freigeben. Den Test-Link öffnen Sie auf Ihren eigenen Geräten. · Musterseite, frei
          erfunden
        </figcaption>
      </figure>
      <div className={a.lvFuss}>
        <span>Antwort meist am selben Werktag</span>
        <span className="flex gap-6">
          <MehrLink href="/pakete" frei={false} groesse="klein">
            Pakete
          </MehrLink>
          <MehrLink href="/faq" frei={false} groesse="klein">
            Fragen
          </MehrLink>
        </span>
      </div>
    </Abschnitt>
  );
}
