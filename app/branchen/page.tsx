import type { Metadata } from "next";

import Link from "next/link";

import { MehrLink } from "@/components/marketing/apple";
import { Ladeliste } from "@/components/marketing/hafen/ladeliste";
import { paketeKurz } from "@/components/marketing/hafen/paket-kurz";
import {
  Abschnitt,
  BildKachel,
  BildRaster,
  FotoRahmen,
  KontaktKarte,
  SeitenKopf,
  UnterseiteMain,
  unterseiteStil as u,
} from "@/components/marketing/laden/unterseite";
import { LivePreview } from "@/components/marketing/live-preview";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { Produktleiste } from "@/components/marketing/produktleiste";
import { BRANCHEN } from "@/lib/branchen-data";
import { BRANCHEN_SEO } from "@/lib/branchen-seo";
import { getPaketBySlug } from "@/lib/pakete-data";

export const metadata: Metadata = {
  title: "Branchen · Websites für Ihren Betrieb",
  description:
    "Websites für Pflegedienste, Praxen, Friseure, Cafés, Handwerker, Reinigungen, Kanzleien und Fitnessstudios — jede Seite individuell gebaut.",
  alternates: { canonical: "/branchen" },
};

const ZAHLWORT: Record<number, string> = { 8: "Acht", 9: "Neun", 10: "Zehn", 11: "Elf", 12: "Zwölf" };

/** Branchen mit eigener Landingpage (/pflege, /praxen), aus lib/branchen-seo.ts. */
const LANDINGS = BRANCHEN.flatMap((b) => {
  const landing = BRANCHEN_SEO[b.slug]?.landing;
  return landing ? [landing] : [];
});

/** Name und Preise je Paket für die Ladeliste (Client). */
const PAKETE_KURZ = paketeKurz();

export default function BranchenPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader cta={false} />
      <Produktleiste
        titel="Branchen"
        links={[
          { href: "#register", label: "Übersicht" },
          { href: "#vorschau", label: "Skizze" },
          { href: "#ladeliste", label: "Ladeliste" },
        ]}
        cta={{ href: "/anfrage", label: "Anfragen" }}
      />
      <UnterseiteMain>
        <SeitenKopf
          krumen="Branchen"
          eyebrow={`Register · ${ZAHLWORT[BRANCHEN.length] ?? BRANCHEN.length} Branchen`}
          titel="Websites für Ihre Branche"
          unter="Eine Praxis braucht anderes als ein Café. Für jede Branche haben wir aufgeschrieben, worauf Ihre Kundschaft zuerst schaut, und eine Musterseite gebaut."
          aktionen={
            <>
              <Link href="/anfrage" className="btn-signal btn-gross">
                Anfrage schreiben
              </Link>
              <MehrLink href="#vorschau" groesse="unter">
                Skizze mit Ihrem Namen
              </MehrLink>
            </>
          }
          bild={
            <FotoRahmen
              vorab
              muster
              src="/images/sitalo-praxis-laptop.webp"
              alt="Laptop mit der Musterseite einer Zahnarztpraxis auf einem hellen Empfangstresen"
              aspect="21 / 9"
              aspectMobil="4 / 3"
              position="50% 45%"
            />
          }
          unterschrift="Musterseite einer Zahnarztpraxis am Empfang · frei erfunden. Jede Branche bekommt ihre eigene Seite."
        />
        <Register />
        <Vorschau />
        <Ladeliste id="ladeliste" head={<LadelisteKopf />} pakete={PAKETE_KURZ} className={`${u.abschnitt} ${u.ladeliste}`} />
        <KontaktKarte
          eyebrow="Andere Branche?"
          titel="Wir bauen auch für Betriebe, die hier nicht stehen."
          zeile="Schreiben Sie uns zwei, drei Sätze zu Ihrem Betrieb. Den Festpreis bekommen Sie schriftlich, bevor wir anfangen."
        />
      </UnterseiteMain>
      <MarketingFooter crumb="Branchen" />
    </div>
  );
}

/**
 * Branchen als Bildkacheln (12er-Raster, keine Waise): Foto aus der
 * Branche, Name und das meist empfohlene Paket. Die ausführlichen Texte
 * stehen auf /branchen/[slug]. Kosmetik und Hotel zeigen ihre
 * Musterseite auf dem Laptop (frei erfunden, mit Pille).
 */
const KACHEL: Record<
  string,
  { spalten: 4 | 5 | 7; ton?: "weiss" | "nacht"; src: string; alt: string; position?: string; muster?: boolean }
> = {
  pflege: { spalten: 7, src: "/images/atmosphere/pflege-eingang.webp", alt: "Heller Empfang eines Pflegedienstes mit Holztresen und Pflanze", position: "50% 60%" },
  praxis: { spalten: 5, src: "/images/atmosphere/praxis-raum.webp", alt: "Ruhiges Sprechzimmer mit Schreibtisch, Tablet und Sessel" },
  friseur: { spalten: 4, src: "/images/atmosphere/friseur-stuhl.webp", alt: "Lederner Friseurstuhl vor einem runden Spiegel" },
  gastro: { spalten: 4, src: "/images/atmosphere/gastro-cafe.webp", alt: "Café mit kupferner Espressomaschine und Holztischen" },
  handwerker: { spalten: 4, src: "/images/atmosphere/handwerker-werkbank.webp", alt: "Werkbank einer Tischlerei mit Hobel und Spänen" },
  reinigung: { spalten: 5, src: "/images/atmosphere/reinigung-flur.webp", alt: "Frisch gereinigter, heller Flur mit Reinigungswagen" },
  kanzlei: { spalten: 7, ton: "nacht", src: "/images/atmosphere/kanzlei-buecher.webp", alt: "Gesetzbücher in einem dunklen Holzregal neben einer Messinglampe", position: "50% 40%" },
  fitness: { spalten: 4, src: "/images/atmosphere/fitness-studio.webp", alt: "Lichtdurchflutetes Fitnessstudio mit Kettlebells am Fenster" },
  kosmetik: { spalten: 4, src: "/images/sitalo-kosmetik-laptop.webp", alt: "Laptop mit der Musterseite eines Kosmetikstudios auf einer Marmorablage", position: "55% 62%", muster: true },
  hotel: { spalten: 4, src: "/images/sitalo-hotel-laptop.webp", alt: "Laptop mit der Musterseite eines Hotels an einer Rezeption", position: "42% 64%", muster: true },
};

function Register() {
  return (
    <Abschnitt
      id="register"
      fett={`${ZAHLWORT[BRANCHEN.length] ?? BRANCHEN.length} Branchen.`}
      grau="Was Ihre Kundschaft zuerst sucht."
      unter="Preise sind Einmalpreise inkl. MwSt., dazu kommt ein Monatsbeitrag je Paket."
      rechts={<MehrLink href="/pakete">Alle Pakete</MehrLink>}
    >
      <BildRaster>
        {BRANCHEN.map((b, i) => {
          const paket = getPaketBySlug(b.recommendedPackage);
          const k = KACHEL[b.slug];
          return (
            <BildKachel
              key={b.slug}
              id={b.slug}
              className="scroll-mt-28"
              ton={k?.ton ?? "weiss"}
              spalten={k?.spalten ?? 4}
              gross={k?.spalten === 7}
              kompaktMobil={i >= 2}
              titel={b.label}
              zeile={paket ? `Meist: ${paket.name} ${paket.setup}` : undefined}
              href={`/branchen/${b.slug}`}
              ueberschrift="h3"
              foto={
                k
                  ? {
                      src: k.src,
                      alt: k.alt,
                      position: k.position,
                      muster: k.muster,
                      sizes:
                        k.spalten === 7
                          ? "(min-width: 1068px) 560px, (min-width: 640px) 50vw, calc(100vw - 32px)"
                          : i >= 2
                            ? "(min-width: 1068px) 400px, (min-width: 640px) 50vw, 128px"
                            : "(min-width: 1068px) 400px, (min-width: 640px) 50vw, calc(100vw - 32px)",
                    }
                  : undefined
              }
            />
          );
        })}
      </BildRaster>
      {/* Landingpages mit Ablauf und Preisen: sie führen „… erstellen lassen", die Branchenseiten den Seitenplan. */}
      <div className="mt-10">
        <h3 className="text-[21px] leading-[25px] font-bold">Eigene Seiten mit Ablauf</h3>
        <ul role="list" className={`${u.chips} mt-3`}>
          {LANDINGS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className={u.chip}>
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Abschnitt>
  );
}

/**
 * Live-Vorschau (früher auf der Startseite): Betriebsname eintippen,
 * Branche wählen, die Skizze entsteht sofort im Browser.
 */
function Vorschau() {
  return (
    <Abschnitt
      id="vorschau"
      fett="Eine erste Skizze."
      grau="Mit Ihrem Namen."
      unter="Geben Sie den Namen Ihres Betriebs ein und wählen Sie die Branche. Die Skizze entsteht sofort hier im Browser, gespeichert wird nichts."
    >
      <div className={`${u.blatt} min-w-0`}>
        <LivePreview />
      </div>
      <p className={`${u.abschnittUnter} mt-6`}>
        Gefällt Ihnen die Richtung, schicken Sie die Skizze als Anfrage. Die echte Seite entwerfen wir danach mit Ihren
        Fotos und Texten.
      </p>
    </Abschnitt>
  );
}

/** Kopf der Ladeliste (früher auf der Startseite). */
function LadelisteKopf() {
  return (
    <div className={u.abschnittKopf}>
      <h2 className={u.zweiton}>
        <span>Die Ladeliste für Ihre Branche.</span> <span>Was auf Ihre Seite gehört.</span>
      </h2>
      <p className={u.abschnittUnter}>
        Wer einen Pflegedienst sucht, hat andere Fragen als jemand, der einen Tisch reservieren will. Wählen Sie Ihre
        Branche: Die Liste zeigt, was auf Ihre Seite gehört, wo es steht und warum.
      </p>
    </div>
  );
}
