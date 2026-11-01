import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { PageHero } from "@/components/marketing/page-hero";
import { SITE_URL } from "@/lib/site";
import {
  INVENTAR_NOT_USED,
  INVENTAR_USED,
  type InventarItem,
  type InventarSection,
} from "@/lib/inventar-data";

export const metadata: Metadata = {
  title: "Inventar — Was wir verwenden",
  description:
    "Offene Werkstatt-Liste. Was wir am Schreibtisch benutzen, wo wir hosten, was Sie beisteuern und was wir bewusst auslassen.",
  alternates: { canonical: "/inventar" },
};

const ARROW = <ArrowRight className="h-4 w-4" aria-hidden="true" />;

const ZAHLWORT = ["null", "ein", "zwei", "drei", "vier", "fünf", "sechs", "sieben", "acht", "neun", "zehn", "elf", "zwölf"];

/**
 * `/inventar` — öffentliche Werkzeugliste.
 *
 * Was wir verwenden und was wir bewusst nicht verwenden, mit
 * Begründung pro Eintrag. Gesetzt wie eine Inventarliste: je
 * Abschnitt links der Titel (auf breiten Schirmen mitlaufend),
 * rechts die Einträge als Zeilen mit Haarlinien. Der Gegenpart
 * „Bewusst ausgelassen“ steht dunkel abgesetzt am Schluss.
 */
const ARTICLE_LD = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Sitalo Inventar — was wir verwenden",
  description:
    "Offene Werkstatt-Liste. Was wir am Schreibtisch benutzen, wo wir hosten, was Sie beisteuern und was wir bewusst auslassen.",
  author: { "@type": "Organization", name: "Sitalo Webdesign", url: SITE_URL },
  publisher: { "@id": `${SITE_URL}/#business` },
  mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/inventar` },
};

const BREADCRUMB_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Sitalo", item: `${SITE_URL}/` },
    {
      "@type": "ListItem",
      position: 2,
      name: "Inventar",
      item: `${SITE_URL}/inventar`,
    },
  ],
};

export default function InventarPage() {
  const sections = INVENTAR_USED.filter((section) => section.items.length > 0);

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader tone="dark" />
      <main id="main" tabIndex={-1} className="flex-1">
        <PageHero crumb="Inventar" eyebrow="Offen einsehbar" title="Was wir verwenden, und warum">
          Hier steht, womit wir Websites bauen, wo sie gehostet werden und was Sie selbst beisteuern. Am Ende folgt, was
          wir bewusst nicht einsetzen.
        </PageHero>

        <nav aria-label="Abschnitte" className="border-border border-b">
          <ul className="mx-auto flex w-full max-w-6xl flex-wrap gap-x-6 gap-y-2 px-5 py-4 font-mono text-[12.5px] sm:px-6">
            {sections.map((s) => (
              <li key={s.slug}>
                <a
                  href={`#${s.slug}`}
                  className="text-muted-foreground hover:text-foreground underline decoration-[var(--border)] underline-offset-4 hover:decoration-current"
                >
                  {s.title}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#ausgelassen"
                className="text-muted-foreground hover:text-foreground underline decoration-[var(--border)] underline-offset-4 hover:decoration-current"
              >
                Bewusst ausgelassen
              </a>
            </li>
          </ul>
        </nav>

        {sections.map((section, i) => (
          <SectionBlock key={section.slug} section={section} card={i % 2 === 1} first={i === 0} />
        ))}
        <NotUsedBlock />
        <ClosingNote />
      </main>
      <MarketingFooter />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([ARTICLE_LD, BREADCRUMB_LD]),
        }}
      />
    </div>
  );
}

function SectionBlock({ section, card, first }: { section: InventarSection; card: boolean; first: boolean }) {
  return (
    <section
      id={section.slug}
      className={`scroll-mt-20 ${card ? "bg-card border-foreground border-t" : first ? "" : "border-border border-t"}`}
    >
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-14 sm:px-6 sm:py-20 lg:grid-cols-12 lg:gap-8">
        <div className="lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
          <h2 className="text-balance text-[1.9rem] leading-[1.05] tracking-[-0.03em] sm:text-[2.3rem]">
            {section.title}
          </h2>
          <p className="text-muted-foreground mt-4 max-w-sm text-pretty text-[15.5px] leading-relaxed">
            {section.intro}
          </p>
        </div>
        <ul className="border-foreground border-t lg:col-span-8">
          {section.items.map((item) => (
            <ItemRow key={item.name} item={item} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function ItemRow({ item }: { item: InventarItem }) {
  return (
    <li className="border-border grid gap-3 border-b py-6 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-8">
      <div className="min-w-0">
        <p className="text-[1.2rem] font-semibold leading-snug tracking-[-0.015em]">{item.name}</p>
        <p className="text-muted-foreground mt-1.5 text-[14.5px] leading-relaxed">{item.what}</p>
        {item.since ? (
          <p className="text-muted-foreground mt-2 font-mono text-[12px]">{item.since}</p>
        ) : null}
      </div>
      <p className="text-foreground/85 min-w-0 text-pretty text-[16px] leading-[1.65]">{item.why}</p>
    </li>
  );
}

function NotUsedBlock() {
  const anzahl = INVENTAR_NOT_USED.length;
  const zahl = ZAHLWORT[anzahl] ?? String(anzahl);
  return (
    <section id="ausgelassen" className="grain bg-foreground text-background scroll-mt-20">
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
          <h2 className="text-balance text-[2.2rem] leading-[1.0] tracking-[-0.034em] sm:text-5xl lg:col-span-7">
            Was wir bewusst nicht einsetzen
          </h2>
          <p className="text-stahl-hell max-w-md text-[16.5px] leading-relaxed lg:col-span-4 lg:col-start-9">
            {zahl.charAt(0).toUpperCase() + zahl.slice(1)} Werkzeuge, die in unserer Branche verbreitet sind und die wir
            trotzdem nicht benutzen, jeweils mit Grund.
          </p>
        </div>

        <ul className="border-background/40 mt-12 border-t">
          {INVENTAR_NOT_USED.map((item) => (
            <li
              key={item.name}
              className="border-background/15 grid gap-3 border-b py-6 sm:grid-cols-12 sm:gap-8 sm:py-7"
            >
              <div className="min-w-0 sm:col-span-5 lg:col-span-4">
                <p className="text-[1.15rem] font-semibold leading-snug tracking-[-0.01em] sm:text-[1.25rem]">
                  {item.name}
                </p>
                <p className="text-stahl-hell mt-1.5 font-mono text-[12.5px] leading-relaxed">{item.what}</p>
              </div>
              <p className="text-background/85 min-w-0 text-pretty text-[15.5px] leading-[1.65] sm:col-span-7 lg:col-span-7 lg:col-start-6">
                {item.why}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ClosingNote() {
  return (
    <section>
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:items-end lg:gap-8">
        <div className="lg:col-span-7">
          <h2 className="text-balance text-[1.9rem] leading-[1.05] tracking-[-0.03em] sm:text-[2.4rem]">
            Fragen zu einem Werkzeug beantworten wir am Telefon.
          </h2>
          <p className="text-muted-foreground mt-5 max-w-xl text-pretty text-[16px] leading-relaxed">
            Wir überarbeiten das Inventar etwa alle drei Monate. Ändert sich an unseren Werkzeugen oder Diensten etwas,
            steht es hier. Telefon{" "}
            <a
              href="tel:+491607621876"
              className="text-foreground font-semibold whitespace-nowrap underline-offset-4 hover:underline"
            >
              0160&nbsp;7621876
            </a>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
          <Link href="/termin" className="btn-signal grow sm:grow-0">
            Erstgespräch buchen {ARROW}
          </Link>
        </div>
      </div>
    </section>
  );
}
