import Link from "next/link";

import { BackToTop } from "@/components/marketing/back-to-top";
import { ElbeLinie } from "@/components/marketing/hafen/elbe-linie";
import { SitaloLogo } from "@/components/sitalo-logo";
import { PREIS_HINWEIS } from "@/lib/pakete-data";

/**
 * Marketing-Fuß: Teerfläche mit Korn, oben als Kante die Elbe-Linie
 * (zwei langsam driftende Wellen). Logo mit einem Satz, vier kurze
 * Linkspalten mit Mono-Köpfen (am Handy zwei Spalten nebeneinander,
 * kein Akkordeon), darunter die Mono-Rechtszeile.
 *
 * Bewusst ohne E-Mail-Adresse: Schriftliche Anfragen laufen über
 * /anfrage, der zweite Weg ist das Telefon.
 *
 * Ankertexte mit Absicht: „Website erstellen lassen" zeigt nur auf die
 * Geldseite, „Webseite erstellen" ohne „lassen" nur auf den Ratgeber.
 *
 * crumb: Name der aktuellen Seite für die Brotkrumen-Zeile (optional).
 * ohnePreisHinweis: Seiten, die den Preishinweis schon im Inhalt zeigen,
 * wiederholen ihn hier nicht (der Hinweis steht einmal je Seite).
 * ohneNachOben: ohne den runden „Nach oben“-Knopf.
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
      <footer className="grain bg-foreground text-background relative -mt-px overflow-hidden print:hidden">
        <ElbeLinie />
        <div className="inhalt relative pt-8 pb-12 sm:pt-10 sm:pb-16">
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:gap-x-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1fr]">
            <div className="col-span-2 max-w-xs lg:col-span-1">
              <SitaloLogo size="sm" tone="light" />
              <p className="text-background/75 mt-5 text-[14.5px] leading-relaxed">
                Ein kleines Büro in Hamburg, das bundesweit arbeitet.
              </p>
              {ohnePreisHinweis ? null : (
                <p className="text-stahl-hell mt-3 font-mono text-[11.5px] leading-relaxed">{PREIS_HINWEIS}</p>
              )}
            </div>
            {/* Am Handy zwei kurze Spalten (Angebot mit den ersten fünf
                Links, Kontakt). Ratgeber und Sitalo ab 640 px; am Handy
                über das Menü erreichbar. */}
            {GRUPPEN.map((g) => (
              <div key={g.titel} className={g.titel === "Ratgeber" || g.titel === "Sitalo" ? "hidden sm:block" : undefined}>
                <h2 className="label-mono text-stahl-hell mb-2">{g.titel}</h2>
                <ul className="text-[14.5px]">
                  {g.links.map((l, i) => (
                    <li key={l.href} className={i >= 5 ? "hidden sm:list-item" : undefined}>
                      <FussA
                        link={l}
                        className="text-background/85 hover:text-background inline-flex min-h-11 items-center py-1 leading-snug transition-colors lg:min-h-9"
                      />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Rechtszeile in Mono, darin die Brotkrumen. */}
        <div className="border-background/10 relative border-t">
          <div className="inhalt text-background/60 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 pt-3 pb-[calc(1.25rem+env(safe-area-inset-bottom))] font-mono text-[12px]">
            <nav aria-label="Fußzeile, Standort" className="flex min-h-11 items-center gap-2">
              <Link href="/" className="hover:text-background inline-flex min-h-11 items-center transition-colors">
                <span className="link-fuss-text">© {year} Sitalo Webdesign · Hamburg</span>
              </Link>
              {crumb ? (
                <>
                  <span aria-hidden="true">/</span>
                  <span aria-current="page" className="text-background/80">
                    {crumb}
                  </span>
                </>
              ) : null}
            </nav>
            <ul className="flex gap-5">
              <RechtLink href="/impressum">Impressum</RechtLink>
              <RechtLink href="/datenschutz">Datenschutz</RechtLink>
              <RechtLink href="/admin" nofollow>
                Login
              </RechtLink>
            </ul>
          </div>
        </div>
      </footer>
    </>
  );
}

function FussA({ link, className }: { link: FussLink; className: string }) {
  const inhalt = <span className="link-fuss-text">{link.label}</span>;
  return link.extern ? (
    <a href={link.href} className={className}>
      {inhalt}
    </a>
  ) : (
    <Link href={link.href} className={className}>
      {inhalt}
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
    <li>
      <Link
        href={href}
        rel={nofollow ? "nofollow" : undefined}
        className="hover:text-background inline-flex min-h-11 items-center transition-colors"
      >
        <span className="link-fuss-text">{children}</span>
      </Link>
    </li>
  );
}
