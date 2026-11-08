import type { Metadata } from "next";
import Link from "next/link";

import { MehrLink } from "@/components/marketing/apple";
import a from "@/components/marketing/hafen/atelier.module.css";
import { HamburgMap } from "@/components/marketing/hamburg-map";
import {
  Abschnitt,
  FotoRahmen,
  SeitenKopf,
  UnterseiteMain,
  unterseiteStil as u,
} from "@/components/marketing/laden/unterseite";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { SITE_URL } from "@/lib/site";
import { SPRECHSTUNDE_BEGINN_HHMM, SPRECHSTUNDE_ENDE_HHMM, uhrzeitKurz } from "@/lib/sprechstunde-data";
import { STANDORTE } from "@/lib/standorte-data";

export const metadata: Metadata = {
  title: "Kontakt · schreiben Sie uns direkt",
  description:
    "Am Telefon sprechen Sie mit uns selbst, nicht mit einer Zentrale. Anfragen über das Formular beantworten wir meist am selben Werktag.",
  alternates: { canonical: "/kontakt" },
};

/**
 * `/kontakt` im Atelier-Satz: Kopf mit der Nummer groß und der
 * gezeichneten Visitenkarte, darunter alle Wege als Verzeichnis und zum
 * Schluss Treffen in Hamburg mit der schematischen Stadtteil-Karte.
 */
export default function KontaktPage() {
  // ContactPage-Schema + Breadcrumb. ContactPage signalisiert
  // Google explizit, dass das die kanonische Kontakt-Seite ist
  // (statt /impressum oder Footer als Kontakt-Surrogat). Verlinkt
  // auf die LocalBusiness-Entity aus app/layout.tsx via @id.
  const contactPageLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Kontakt — Sitalo Webdesign",
    description:
      "Anrufen oder schreiben: Sitalo Webdesign in Hamburg antwortet meist am selben Werktag.",
    url: `${SITE_URL}/kontakt`,
    mainEntity: { "@id": `${SITE_URL}/#business` },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Sitalo", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Kontakt",
        item: `${SITE_URL}/kontakt`,
      },
    ],
  };

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader cta={false} />

      <UnterseiteMain className="pb-16 sm:pb-24">
        <Briefkopf />
        <Wege />
        <Treffen />
      </UnterseiteMain>

      <MarketingFooter crumb="Kontakt" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([contactPageLd, breadcrumbLd]),
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------
 * Kopf: Nummer groß, Formular als Hauptweg, rechts die gezeichnete
 * Visitenkarte (85 × 55) mit oranger Lasche und dem Download als .vcf.
 * Darunter die Speicherstadt mit Mono-Bildunterschrift.
 * ---------------------------------------------------------------- */
function Briefkopf() {
  return (
    <SeitenKopf
      krumen="Kontakt"
      eyebrow="Kontor · Sitalo Webdesign"
      titel="Kontakt"
      akzent="ohne Zentrale."
      unter="Am Telefon sprechen Sie mit uns selbst, nicht mit einer Zentrale. Anfragen über das Formular beantworten wir meist am selben Werktag."
      aktionen={
        <>
          <a
            href="tel:+491607621876"
            className="text-foreground basis-full text-[40px] leading-[48px] font-[760] tracking-[-0.03em] whitespace-nowrap tabular-nums [font-stretch:116%] hover:underline hover:decoration-[var(--gold)] hover:decoration-2 hover:underline-offset-8 sm:text-[56px] sm:leading-[64px]"
          >
            0160&nbsp;7621876
          </a>
          <Link href="/anfrage" className="btn-signal btn-gross">
            Anfrage schreiben
          </Link>
          <MehrLink href="/termin" groesse="unter">
            Erstgespräch buchen
          </MehrLink>
        </>
      }
      neben={<Visitenkarte />}
      bild={
        <FotoRahmen
          vorab
          src="/images/hamburg-speicherstadt.webp"
          alt="Speicherstadt in Hamburg in der Abendsonne, im Hintergrund die Elbphilharmonie"
          aspect="21 / 8"
          aspectMobil="16 / 10"
          position="50% 55%"
        />
      }
      unterschrift="Speicherstadt, früher Abend · im Hintergrund die Elbphilharmonie"
    />
  );
}

function Visitenkarte() {
  return (
    <figure className="w-full max-w-[26rem] lg:ml-auto">
      <div className={a.visitenkarte}>
        <span aria-hidden="true" className={a.lasche} />
        <p className={a.vkMarke}>
          Sitalo<span>Webdesign · Hamburg</span>
        </p>
        <dl className={a.vkRaster}>
          <dt>Telefon</dt>
          <dd className="tabular-nums">
            <a href="tel:+491607621876">0160&nbsp;7621876</a>
          </dd>
          <dt>Web</dt>
          <dd>sitalo.de</dd>
          <dt>Ort</dt>
          <dd>Hamburg, bundesweit tätig</dd>
        </dl>
      </div>
      <figcaption className="mt-5 flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
        <span className={a.mono}>Für das Adressbuch im Handy</span>
        <a href="/sitalo-kontakt.vcf" download="Sitalo-Webdesign.vcf" className="btn-line btn-klein">
          Visitenkarte speichern
        </a>
      </figcaption>
    </figure>
  );
}

/* ------------------------------------------------------------------
 * Alle Wege als Verzeichnis: was es ist, was Sie erwartet, wohin der
 * Link führt. Haarlinien, Mono-Nummern, keine Karten.
 * ---------------------------------------------------------------- */
const WEGE: { name: string; text: string; href: string; link: string }[] = [
  {
    name: "Formular",
    text: "Drei Felder für Ihr Vorhaben. Die Antwort kommt meist am selben Werktag.",
    href: "/anfrage",
    link: "Anfrage schreiben",
  },
  {
    name: "Termin",
    text: "Bis zu 30 Minuten, meist reicht eine Viertelstunde. Am Telefon, per Video oder in Hamburg; Tag und Uhrzeit wählen Sie selbst.",
    href: "/termin",
    link: "Termin buchen",
  },
  {
    name: "Sprechstunde",
    text: `Jeden ersten Donnerstag im Monat von ${uhrzeitKurz(SPRECHSTUNDE_BEGINN_HHMM)} bis ${uhrzeitKurz(SPRECHSTUNDE_ENDE_HHMM)}\u00A0Uhr am Telefon, offen für alle.`,
    href: "/sprechstunde",
    link: "Nächste Termine",
  },
  {
    name: "Erreichbarkeit",
    text: "Was wir zur Antwortzeit zusagen und was gilt, wenn wir im Urlaub sind.",
    href: "/erreichbarkeit",
    link: "Zeiten ansehen",
  },
];

function Wege() {
  return (
    <Abschnitt id="wege" eyebrow="Anleger · vier Wege" fett="Wie Sie uns sonst erreichen">
      <p className={a.lvKopf}>
        <span>Weg</span>
        <span>wohin</span>
      </p>
      <ol className={a.lvListe}>
        {WEGE.map((w, i) => (
          <li key={w.name}>
            <Link href={w.href} className={`${a.lvZeile} sm:grid-cols-[2.8rem_10rem_minmax(0,1fr)_auto]!`}>
              <span className={a.lvNr}>{String(i + 1).padStart(2, "0")}</span>
              <span className={`${a.lvTitel} max-sm:col-start-2`}>{w.name}</span>
              <span className={`${a.lvSatz} mt-0! max-sm:col-start-2 max-sm:row-start-2`}>{w.text}</span>
              <span className={`${a.lvWert} hidden sm:inline`}>
                {w.link} <span className={a.lvPfeil}>→</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </Abschnitt>
  );
}

/* ------------------------------------------------------------------
 * Treffen in Hamburg: die schematische Stadtteil-Karte statt Foto und
 * Chips. Jeder Stadtteil verlinkt auf seine Seite.
 * ---------------------------------------------------------------- */
function Treffen() {
  return (
    <Abschnitt id="treffen" eyebrow="Hafenplan · Treffen" fett="Treffen in Hamburg, in Ihrem Betrieb oder im Café">
      <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-14">
        <div className="lg:col-span-5">
          <p className={u.text}>
            Wer in Hamburg sitzt, kann uns gern treffen: in Ihrem Betrieb oder in einem Café. Alle anderen sprechen mit
            uns am Telefon oder per Video. Die Website wird dieselbe.
          </p>
          <p className={`${a.mono} mt-6`}>
            Für {STANDORTE.length} Hamburger Stadtteile gibt es eine eigene Seite. Jedes Quadrat auf der Karte führt
            dorthin.
          </p>
          <MehrLink href="/standorte" className="mt-4">
            Alle Stadtteile
          </MehrLink>
        </div>
        <div className="lg:col-span-7">
          <HamburgMap />
        </div>
      </div>
    </Abschnitt>
  );
}
