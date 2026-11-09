import type { Metadata } from "next";
import { ogFor } from "@/lib/seo";
import Link from "next/link";

import { HamburgMap } from "@/components/marketing/hamburg-map";
import {
  Abschnitt,
  KontaktKarte,
  SeitenKopf,
  UnterseiteMain,
} from "@/components/marketing/laden/unterseite";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { STANDORTE } from "@/lib/standorte-data";

const ZAHLWORT: Record<number, string> = {
  10: "Zehn",
  11: "Elf",
  12: "Zwölf",
  13: "Dreizehn",
  14: "Vierzehn",
};
const ANZAHL = ZAHLWORT[STANDORTE.length] ?? String(STANDORTE.length);

/**
 * Hub der Stadtteilseiten. Bewusst NICHT „Webdesign Hamburg" oder
 * „Website erstellen lassen Hamburg" im Title und in der H1: Diese Begriffe
 * führt die Startseite. Der Hub arbeitet ihr mit einem Link zu, statt ihr
 * Konkurrenz zu machen.
 */
export const metadata: Metadata = {
  title: "Webdesign für Hamburger Stadtteile",
  description: `Webdesign in Hamburg für Ihren Stadtteil: ${ANZAHL.toLowerCase()} Viertel von Altona bis Bergedorf, mit typischen Suchanfragen und Branchen. Festpreis ab 599 €. Jetzt anfragen.`,
  alternates: { canonical: "/standorte" },
  openGraph: ogFor("/standorte", undefined, undefined, "website", { defaultImage: true }),
};

export default function StandortePage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader cta={false} />
      <UnterseiteMain>
        <SeitenKopf
          krumen="Standorte"
          eyebrow="Nach Stadtteil · Hamburg"
          titel={`${ANZAHL} Hamburger Stadtteile mit eigener Seite`}
          unter="Wer einen Friseur in der Nähe sucht, tippt „Friseur Eimsbüttel“ oder „Friseur Osterstraße“. Auf solche Suchen richten wir Seitentitel und Texte aus."
          meta={
            <>
              Was wir für Betriebe in ganz Hamburg bauen, steht auf der Seite{" "}
              <Link
                href="/"
                className="text-gold-ink font-semibold underline-offset-4 hover:underline"
              >
                Webdesign Hamburg
              </Link>
              .
            </>
          }
          bild={
            <div className="rounded-[18px] bg-white px-4 py-6 shadow-[0_4px_16px_rgb(0_0_0/0.06)] sm:rounded-[28px] sm:px-10 sm:py-10">
              <HamburgMap />
            </div>
          }
        />
        <Liste />
        <KontaktKarte
          id="abschluss"
          titel="Betriebe außerhalb dieser Stadtteile bekommen dieselbe Website."
          zeile="Das erste Gespräch führen wir am Telefon oder per Video. In Hamburg kommen wir auf Wunsch auch bei Ihnen vorbei."
          link={{ href: "/branchen", label: "Musterseiten ansehen" }}
          foto={{
            src: "/images/hamburg-speicherstadt.webp",
            alt: "Speicherstadt in Hamburg mit Backsteinfassaden am Fleet",
          }}
        />
      </UnterseiteMain>
      <MarketingFooter crumb="Standorte" />
    </div>
  );
}

/** Stadtteile als Liste auf weißer Karte: Name, Einordnung, gefragte Branchen. */
function Liste() {
  return (
    <Abschnitt
      id="stadtteile"
      fett="Alle Stadtteile im Überblick."
      grau="Wonach im Viertel gesucht wird."
      unter="Auf jeder Seite steht, welche Betriebe es im Viertel gibt und wonach dort gesucht wird."
    >
      <div className="rounded-[18px] bg-white px-6 shadow-[0_4px_16px_rgb(0_0_0/0.06)] sm:rounded-[28px] sm:px-10">
        <div className="notiz-mono hidden border-b border-black/10 pt-6 pb-3 lg:grid lg:grid-cols-12 lg:gap-8">
          <span className="lg:col-span-3">Stadtteil</span>
          <span className="lg:col-span-5">Kurz gesagt</span>
          <span className="lg:col-span-4">Passende Branchen</span>
        </div>
        <ul role="list" className="divide-y divide-black/10">
          {STANDORTE.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/standorte/${s.slug}`}
                className="group grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 py-5 lg:grid-cols-12 lg:gap-8"
              >
                <h3 className="text-[19px] leading-tight font-semibold tracking-[-0.02em] underline-offset-4 group-hover:underline sm:text-[21px] lg:col-span-3">
                  {s.name}
                </h3>
                <span
                  aria-hidden="true"
                  className="text-gold-ink text-[19px] leading-tight lg:order-last lg:col-span-1 lg:justify-self-end"
                >
                  ›
                </span>
                <p className="col-span-2 text-[15px] leading-relaxed text-pretty text-[#6e6e73] lg:col-span-5">
                  {s.tagline}
                </p>
                <p className="col-span-2 text-[14px] leading-relaxed text-[#424245] lg:col-span-3">
                  <span className="text-[#6e6e73] lg:hidden">
                    Passende Branchen:{" "}
                  </span>
                  {s.empfohleneBranchen.map((b) => b.label).join(", ")}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Abschnitt>
  );
}
