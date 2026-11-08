import type { Metadata } from "next";

import Link from "next/link";

import { MehrLink } from "@/components/marketing/apple";
import { Ladeliste } from "@/components/marketing/hafen/ladeliste";
import { paketeKurz } from "@/components/marketing/hafen/paket-kurz";
import a from "@/components/marketing/hafen/atelier.module.css";
import { Steigend } from "@/components/marketing/hafen/steigend";
import {
  Abschnitt,
  FotoRahmen,
  KontaktKarte,
  SeitenKopf,
  UnterseiteMain,
  unterseiteStil as u,
} from "@/components/marketing/laden/unterseite";
import { LivePreview } from "@/components/marketing/live-preview";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
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
              src="/images/workspace-prints.webp"
              alt="Drei gerahmte Entwürfe mit Logo, Farben und Schrift an einer hellen Wand"
              aspect="21 / 9"
              aspectMobil="4 / 3"
              position="50% 40%"
            />
          }
          unterschrift="Entwürfe an der Wand: Schrift, Farben, Zeichen. Jede Branche bekommt ihre eigenen."
        />
        <Register />
        <Ladeliste
          id="ladeliste"
          head={<LadelisteKopf />}
          pakete={PAKETE_KURZ}
          className="on-dark mt-16 sm:mt-20"
        />
        <Vorschau />
        <KontaktKarte
          titel="Wir bauen auch für Betriebe, die hier nicht stehen."
          zeile="Schreiben Sie uns zwei, drei Sätze zu Ihrem Betrieb. Den Festpreis bekommen Sie schriftlich, bevor wir anfangen."
          link={null}
        />
      </UnterseiteMain>
      <MarketingFooter crumb="Branchen" />
    </div>
  );
}

/**
 * Register: die Branchen als nummeriertes Verzeichnis in zwei Spalten,
 * je Zeile das meist empfohlene Paket. Die ausführlichen Texte stehen
 * auf /branchen/[slug]. Darunter die eigenen Landingpages als Mono-Zeile.
 */
function Register() {
  const haelfte = Math.ceil(BRANCHEN.length / 2);
  const spalten = [BRANCHEN.slice(0, haelfte), BRANCHEN.slice(haelfte)];
  return (
    <Abschnitt
      id="register"
      eyebrow={`Register · B.01 bis B.${String(BRANCHEN.length).padStart(2, "0")}`}
      fett="Was Ihre Kundschaft zuerst sucht, je Branche"
      unter="Preise sind Einmalpreise inkl. MwSt., dazu kommt ein Monatsbeitrag je Paket."
      rechts={<MehrLink href="/pakete">Alle Pakete</MehrLink>}
    >
      <div className="grid gap-x-14 lg:grid-cols-2">
        {spalten.map((liste, si) => (
          <ol key={si} className={`${a.lvListe} ${si === 0 ? "kante-stark" : a.kanteLg}`}>
            {liste.map((b, i) => {
              const paket = getPaketBySlug(b.recommendedPackage);
              const nr = si * haelfte + i + 1;
              return (
                <li key={b.slug} id={b.slug} className="scroll-mt-28">
                  <Link href={`/branchen/${b.slug}`} className={a.lvZeile}>
                    <span className={a.lvNr}>B.{String(nr).padStart(2, "0")}</span>
                    <span>
                      <span className={a.lvTitel}>{b.label}</span>
                      {paket ? (
                        <span className={a.lvSatz}>
                          Meist {paket.name}, {paket.setup}
                        </span>
                      ) : null}
                    </span>
                    <span className={a.lvPfeil} aria-hidden="true">
                      →
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        ))}
      </div>
      {/* Landingpages mit Ablauf und Preisen: sie führen „… erstellen lassen", die Branchenseiten den Seitenplan. */}
      <p className={`${a.lvFuss} items-baseline justify-start!`}>
        <span>Eigene Seiten mit Ablauf:</span>
        {LANDINGS.map((l) => (
          <Link key={l.href} href={l.href} className="link-pfeil text-foreground font-sans text-[14px] font-semibold">
            {l.label}&nbsp;<span className="pfeil" aria-hidden="true">→</span>
          </Link>
        ))}
      </p>
    </Abschnitt>
  );
}

/**
 * Live-Vorschau: Betriebsname eintippen, Branche wählen, die Skizze
 * entsteht sofort im Browser. Flach auf Papier, ohne Gerät.
 */
function Vorschau() {
  return (
    <Abschnitt
      id="vorschau"
      eyebrow="Zeichentisch · Skizze"
      fett="Eine erste Skizze mit Ihrem Namen"
      unter="Geben Sie den Namen Ihres Betriebs ein und wählen Sie die Branche. Die Skizze entsteht sofort hier im Browser, gespeichert wird nichts."
    >
      <div className="min-w-0">
        <LivePreview />
      </div>
      <p className={`${a.mono} mt-6 max-w-[48em]`}>
        Gefällt Ihnen die Richtung, schicken Sie die Skizze als Anfrage. Die echte Seite entwerfen wir danach mit Ihren
        Fotos und Texten.
      </p>
    </Abschnitt>
  );
}

/** Kopf der Ladeliste (wie auf der Startseite). */
function LadelisteKopf() {
  return (
    <div className={`${u.abschnittKopf} mb-10!`}>
      <p className={u.eyebrow}>Liegeplatz 2 · Frachtpapier</p>
      <h2 data-reveal="rise" className={`${u.zweiton} text-[#f3f2ee]!`}>
        <Steigend text="Die Ladeliste für Ihre Branche" />
      </h2>
      <p className={`${u.abschnittUnter} text-[#a3a8a9]!`}>
        Wer einen Pflegedienst sucht, hat andere Fragen als jemand, der einen Tisch reservieren will. Wählen Sie Ihre
        Branche: Die Liste zeigt, was auf Ihre Seite gehört, wo es steht und warum.
      </p>
    </div>
  );
}
