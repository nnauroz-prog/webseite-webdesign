import type { Metadata } from "next";
import {
  FotoRahmen,
  KontaktKarte,
  SeitenKopf,
  UnterseiteMain,
  unterseiteStil as u,
} from "@/components/marketing/laden/unterseite";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { LEXIKON, type LexikonEntry } from "@/lib/lexikon-data";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Lexikon · Webbegriffe im Klartext",
  description:
    "Hosting, SSL, CMS, SEO, DSGVO: die wichtigsten Webbegriffe in Alltagsdeutsch erklärt, jeweils mit dem, worauf es für Ihre Entscheidung ankommt.",
  alternates: { canonical: "/lexikon" },
};

/**
 * `/lexikon` — Glossar im Klartext.
 *
 * Kopf, dann ein Register nach Anfangsbuchstaben wie hinten in einem
 * Nachschlagewerk, dann die Einträge zweispaltig: links der Begriff,
 * rechts Erklärung und der Satz, der für die Entscheidung zählt.
 * DefinedTermSet-JSON-LD für Suchmaschinen.
 */
export default function LexikonPage() {
  const sorted = [...LEXIKON].sort((a, b) =>
    a.term.localeCompare(b.term, "de"),
  );

  // Register: Begriffe nach Anfangsbuchstaben gruppiert.
  const register = new Map<string, LexikonEntry[]>();
  for (const e of sorted) {
    const letter = e.term.charAt(0).toUpperCase();
    register.set(letter, [...(register.get(letter) ?? []), e]);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    "@id": `${SITE_URL}/lexikon#glossar`,
    name: "Sitalo Lexikon · Webbegriffe im Klartext",
    description:
      "Glossar für lokale Unternehmen: Hosting, SSL, CMS, SEO, DSGVO und mehr, in Alltagsdeutsch erklärt.",
    hasDefinedTerm: sorted.map((e) => ({
      "@type": "DefinedTerm",
      "@id": `${SITE_URL}/lexikon#${e.slug}`,
      name: e.term,
      description: e.plain,
    })),
  };

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader cta={false} />
      <UnterseiteMain>
        <SeitenKopf
          krumen="Lexikon"
          eyebrow={`Glossar · ${sorted.length} Begriffe`}
          titel="Webbegriffe im Klartext"
          unter="Hier erklären wir die Wörter, die Ihnen in Angeboten für Websites begegnen. Zu jedem Begriff steht darunter, worauf es für Ihre Entscheidung ankommt."
          bild={
            <FotoRahmen
              vorab
              src="/images/atmosphere/kanzlei-buecher.webp"
              alt="Regal mit gebundenen Fachbüchern, davor eine Messinglampe in warmem Licht"
              aspect="21 / 9"
              aspectMobil="16 / 9"
              position="50% 50%"
            />
          }
          unterschrift="Nachschlagen wie hinten im Buch, nur kürzer"
        />

        {/* Register nach Anfangsbuchstaben */}
        <section aria-labelledby="register-titel" className={u.abschnitt}>
          <div className="inhalt">
            <nav aria-labelledby="register-titel" className={u.blatt}>
              <h2 id="register-titel">
                <span className="kennzeile-mono">Register</span>
              </h2>
              <div className="mt-6 columns-2 gap-x-8 sm:columns-3 lg:columns-5">
                {[...register.entries()].map(([letter, entries]) => (
                  <div key={letter} className="mb-5 break-inside-avoid">
                    <p
                      className="text-gold-ink text-[15px] font-semibold"
                      aria-hidden="true"
                    >
                      {letter}
                    </p>
                    <ul className="mt-1.5 space-y-1">
                      {entries.map((e) => (
                        <li key={e.slug}>
                          <a
                            href={`#${e.slug}`}
                            className="text-[15px] leading-snug text-[#1d1d1f] underline decoration-black/15 underline-offset-4 hover:decoration-current"
                          >
                            {e.term}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </nav>
          </div>
        </section>

        {/* Einträge */}
        <section aria-labelledby="eintraege-titel" className={u.abschnitt}>
          <div className="inhalt">
            <div className={u.abschnittKopf}>
              <h2 id="eintraege-titel" className={u.zweiton}>
                <span>Alle Begriffe.</span> <span>Von A bis Z.</span>
              </h2>
            </div>
            <dl className="grid gap-3 sm:gap-5">
              {sorted.map((e) => (
                <div
                  key={e.slug}
                  id={e.slug}
                  className="grid scroll-mt-28 gap-4 rounded-[18px] bg-white p-6 shadow-[0_4px_16px_rgb(0_0_0/0.06)] sm:rounded-[28px] sm:p-10 lg:grid-cols-12 lg:gap-8"
                >
                  <dt className="text-[24px] leading-[1.17] font-semibold tracking-[-0.02em] text-balance sm:text-[28px] lg:col-span-4">
                    {e.term}
                  </dt>
                  <dd className="min-w-0 lg:col-span-8">
                    <p className="text-[17px] leading-[1.5] tracking-[-0.022em] text-pretty text-[#424245]">
                      {e.plain}
                    </p>
                    <div className="mt-5 rounded-[14px] bg-[#f5f5f7] px-5 py-4">
                      <p className="notiz-mono">Entscheidend ist</p>
                      <p className="mt-1.5 text-[17px] leading-snug font-semibold tracking-[-0.016em] text-pretty">
                        {e.bottomLine}
                      </p>
                    </div>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <KontaktKarte
          id="abschluss"
          titel="Fehlt ein Begriff, schicken Sie ihn uns."
          zeile="Schreiben Sie ihn kurz ins Anfrageformular. Sie bekommen eine Erklärung, und bei der nächsten Überarbeitung nehmen wir den Begriff ins Lexikon auf."
          pille={{ href: "/anfrage", label: "Begriff schicken" }}
          link={{ href: "/check", label: "Ladezeit Ihrer Seite testen" }}
          foto={{
            src: "/images/workspace-prints.webp",
            alt: "Ausgedruckte Entwürfe auf einem Schreibtisch",
          }}
        />
      </UnterseiteMain>
      <MarketingFooter crumb="Lexikon" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}
