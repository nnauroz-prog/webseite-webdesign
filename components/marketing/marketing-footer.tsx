import Link from "next/link";

import { BackToTop } from "@/components/marketing/back-to-top";
import { ElbeLinie } from "@/components/marketing/hafen/elbe-linie";
import { PREIS_HINWEIS } from "@/lib/pakete-data";

/**
 * Marketing-Fuß im Apple-Stil: helle Fläche (#f5f5f7), 12-px-Schrift in
 * #6e6e73. Oben als Kante die Elbe-Linie (zwei langsam driftende Wellen,
 * bei reduzierter Bewegung still), dann Fußnoten, darunter Brotkrumen, die Linkgruppen und die
 * Rechtszeile unter Haarlinien.
 *
 * Mobil (< 640 px) wie bei Apple: jede Gruppe ist eine aufklappbare Zeile
 * (details, ohne Script), ab 640 px stehen die Gruppen als Spalten. Beide
 * Fassungen stehen im Markup, sichtbar ist je Breite genau eine.
 * Kontaktangaben stehen nur in der Gruppe „Kontakt“.
 *
 * Ankertexte mit Absicht: „Website erstellen lassen" zeigt nur auf die
 * Geldseite, „Webseite erstellen" ohne „lassen" nur auf den Ratgeber.
 *
 * crumb: Name der aktuellen Seite für die Brotkrumen-Zeile (optional).
 * ohnePreisHinweis: Seiten, die den Preishinweis schon direkt bei den
 * Preisen zeigen (Startseite), wiederholen ihn hier nicht.
 * ohneNachOben: ohne den runden „Nach oben“-Knopf (Startseite: die
 * klebende Produktleiste übernimmt die Navigation).
 */

type FussLink = { href: string; label: React.ReactNode; extern?: boolean };
type FussGruppe = { titel: string; links: FussLink[] };

const GRUPPEN: FussGruppe[] = [
  {
    titel: "Angebot",
    links: [
      { href: "/website-erstellen-lassen", label: "Website erstellen lassen" },
      { href: "/leistungen", label: "Leistungen" },
      { href: "/pakete", label: "Pakete" },
      { href: "/wartung", label: "Wartung" },
      { href: "/branchen", label: "Branchen" },
      { href: "/pflege", label: "Website für Pflegedienste" },
      { href: "/praxen", label: "Praxis-Website" },
      { href: "/standorte", label: "Webdesign in Hamburger Stadtteilen" },
      { href: "/audit", label: "Kostenlose Durchsicht Ihrer Website" },
    ],
  },
  {
    titel: "Ratgeber",
    links: [
      { href: "/webseite-erstellen", label: "Webseite erstellen: Anleitung" },
      { href: "/website-kosten", label: "Was kostet eine Website?" },
      { href: "/vergleich", label: "Baukasten oder Webdesigner: Vergleich" },
      { href: "/lexikon", label: "Lexikon" },
    ],
  },
  {
    titel: "Sitalo",
    links: [
      { href: "/atelier", label: "Über uns" },
      { href: "/ablauf", label: "Ablauf" },
      { href: "/journal", label: "Journal" },
      { href: "/faq", label: "FAQ" },
    ],
  },
  {
    titel: "Kontakt",
    links: [
      { href: "tel:+491607621876", label: "0160\u00A07621876", extern: true },
      { href: "/anfrage", label: "Anfrage schreiben" },
      { href: "/termin", label: "Termin buchen" },
    ],
  },
];

export function MarketingFooter({
  crumb,
  ohnePreisHinweis = false,
  ohneNachOben = false,
}: { crumb?: string; ohnePreisHinweis?: boolean; ohneNachOben?: boolean } = {}) {
  const year = new Date().getFullYear();
  return (
    <>
      {ohneNachOben ? null : <BackToTop />}
      <footer className="flaeche-hell text-muted-foreground relative text-[12px] leading-[1.33] tracking-[-0.01em] print:hidden">
        <ElbeLinie flach />
        <div className="inhalt pt-[8px] pb-[calc(21px+env(safe-area-inset-bottom))]">
          {/* Fußnoten */}
          <div className="space-y-2 border-b border-[var(--border)] pb-4">
            <p>Ein kleines Büro in Hamburg, das bundesweit arbeitet.</p>
            {ohnePreisHinweis ? null : <p>{PREIS_HINWEIS}</p>}
          </div>

          {/* Brotkrumen: der Name in der Systemschrift wie die übrige Zeile */}
          <nav aria-label="Fußzeile, Standort" className="flex min-h-11 items-center gap-2">
            <Link href="/" className="inline-flex min-h-11 items-center font-semibold text-[#1d1d1f]">
              Sitalo Webdesign
            </Link>
            {crumb ? (
              <>
                <span aria-hidden="true">›</span>
                <span aria-current="page" className="text-[#424245]">
                  {crumb}
                </span>
              </>
            ) : null}
          </nav>

          {/* Mobil: Gruppen zum Aufklappen */}
          <div className="border-t border-[var(--border)] sm:hidden">
            {GRUPPEN.map((g) => (
              <details key={g.titel} className="fuss-gruppe border-b border-[var(--border)]">
                <summary className="fuss-gruppe-kopf">
                  <h2 className="text-[14px] font-semibold tracking-[-0.016em] text-[#1d1d1f]">{g.titel}</h2>
                  <span aria-hidden="true" className="fuss-gruppe-chev" />
                </summary>
                <ul className="pb-3">
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <FussA link={l} className="flex min-h-11 items-center text-[14px] tracking-[-0.016em] text-[#424245]" />
                    </li>
                  ))}
                </ul>
              </details>
            ))}
          </div>

          {/* Ab 640 px: Spalten */}
          <div className="hidden grid-cols-4 gap-x-8 border-b border-[var(--border)] pt-2 pb-6 sm:grid lg:pt-4 lg:pb-8">
            {GRUPPEN.map((g) => (
              <div key={g.titel}>
                <h2 className="mb-2 font-mono text-[11px] leading-[1.5] font-normal tracking-[0.12em] text-[#6e6e73] uppercase lg:mb-3">
                  {g.titel}
                </h2>
                <ul>
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <FussA
                        link={l}
                        className="inline-flex py-[5px] text-[#424245] hover:text-[#1d1d1f] hover:underline lg:py-[3px]"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Rechtszeile */}
          <div className="mt-3 flex flex-col gap-y-1 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-8 sm:border-t-0 sm:pt-2 lg:pt-3">
            <div className="flex flex-col gap-y-1 sm:flex-row sm:items-center sm:gap-x-8">
              <span>Copyright © {year} Sitalo Webdesign. Alle Rechte vorbehalten.</span>
              <ul className="flex items-center">
                <RechtLink href="/impressum">Impressum</RechtLink>
                <RechtLink href="/datenschutz">Datenschutz</RechtLink>
                <RechtLink href="/admin" nofollow>
                  Login
                </RechtLink>
              </ul>
            </div>
            <span className="font-mono text-[11px] tracking-[0.06em] text-[#6e6e73]">
              53°33′ N · 9°59′ O · Hamburg
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}

function FussA({ link, className }: { link: FussLink; className: string }) {
  return link.extern ? (
    <a href={link.href} className={className}>
      {link.label}
    </a>
  ) : (
    <Link href={link.href} className={className}>
      {link.label}
    </Link>
  );
}

function RechtLink({
  href,
  children,
  nofollow = false,
}: {
  href: string;
  children: React.ReactNode;
  nofollow?: boolean;
}) {
  return (
    <li className="flex items-center leading-none not-first:before:mx-[10px] not-first:before:h-3 not-first:before:w-px not-first:before:bg-[var(--border)] not-first:before:content-['']">
      <Link
        href={href}
        rel={nofollow ? "nofollow" : undefined}
        className="inline-flex min-h-11 items-center text-[#424245] hover:text-[#1d1d1f] hover:underline sm:min-h-0 sm:py-1"
      >
        {children}
      </Link>
    </li>
  );
}
