import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { PageHero } from "@/components/marketing/page-hero";
import { SITE_URL } from "@/lib/site";

const ARTICLE_LD = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Wer zu uns kommt — Auswahl",
  description:
    "Wen wir bewusst nehmen und wen nicht, und wie wir entscheiden.",
  author: { "@type": "Organization", name: "Sitalo Webdesign", url: SITE_URL },
  publisher: { "@id": `${SITE_URL}/#business` },
  mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/auswahl` },
};

const BREADCRUMB_LD = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Sitalo", item: `${SITE_URL}/` },
    {
      "@type": "ListItem",
      position: 2,
      name: "Auswahl",
      item: `${SITE_URL}/auswahl`,
    },
  ],
};

export const metadata: Metadata = {
  title: "Wer zu uns kommt — Auswahl",
  description:
    "Hier steht, wen wir bewusst nehmen und wen nicht, und wie wir entscheiden.",
  alternates: { canonical: "/auswahl" },
};

/**
 * `/auswahl` — Aufnahmekriterien.
 *
 * Wir sagen offen, mit wem die Zusammenarbeit gut klappt und wann wir
 * nicht passen. Aufbau: Kriterien als zweispaltige
 * Tabelle (passt gut / passt eher nicht), danach die drei Schritte bis
 * zur Entscheidung, am Ende eine ruhige Notiz mit zwei Wegen statt
 * eines großen Anfrage-Knopfs.
 */
export default function AuswahlPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader tone="dark" />
      <main id="main" tabIndex={-1} className="flex-1">
        <PageHero
          crumb="Auswahl"
          eyebrow="Aufnahmekriterien"
          title="Wer zu uns kommt und wer nicht"
        >
          Wir bauen und betreuen jede Seite selbst. Deshalb nehmen wir nur so viele Aufträge an, wie wir sorgfältig
          fertig bekommen; den Starttermin nennen wir Ihnen im ersten Gespräch. Unten steht, mit wem die Zusammenarbeit
          gut klappt und wann wir Ihnen offen sagen, dass wir nicht passen.
        </PageHero>
        <CriteriaList />
        <Process />
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

type Criterion = {
  thema: string;
  ja: React.ReactNode;
  nein: string;
};

const CRITERIA: Criterion[] = [
  {
    thema: "Standort",
    ja: "Ein Betrieb mit festem Standort und Kundschaft vor Ort, in Hamburg oder anderswo in Deutschland.",
    nein: "Start-ups ohne festen Standort, deren Seite vor allem Investoren überzeugen soll.",
  },
  {
    thema: "Entscheidung",
    ja: "Der Betrieb ist inhabergeführt, und eine Person entscheidet.",
    nein: "Abstimmungen, bei denen fünf Leute jede Änderung freigeben müssen.",
  },
  {
    thema: "Kundschaft",
    ja: "Sie wissen ungefähr, wer Ihre Kunden sind und was sie bei Ihnen suchen.",
    nein: "Der Auftrag lautet nur: Machen Sie mal etwas Kreatives.",
  },
  {
    thema: "Unterlagen",
    ja: "Sie schicken Stichpunkte, Fotos und, falls vorhanden, Ihr Logo. Die Texte schreiben wir daraus.",
    nein: "Logo-Entwicklung und Fotoshooting erwarten Sie von uns. Beides bieten wir nicht an. Oft reichen Handyfotos, und wer einen Fotografen beauftragt, bekommt von uns eine kurze Motivliste.",
  },
  {
    thema: "Nach dem Start",
    ja: "Die Seite soll gepflegt werden. Der Monatsbeitrag läuft mindestens sechs Monate.",
    nein: "Die Seite wird einmal gebaut und danach nie wieder angefasst.",
  },
  {
    thema: "Branche",
    ja: (
      <>
        Für Ihre Branche gibt es bei uns eine{" "}
        <Link href="/branchen" className="underline decoration-[var(--gold)] decoration-2 underline-offset-4">
          eigene Seite
        </Link>
        , etwa für Pflegedienste, Praxen, Handwerk oder Gastronomie.
      </>
    ),
    nein: "Branchen mit eigener Regulierung, die wir nicht kennen, etwa Pharma-Direktvertrieb, Versicherungsvertrieb oder Krypto.",
  },
];

function CriteriaList() {
  return (
    <section>
      <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <h2 className="max-w-3xl text-balance text-[2rem] leading-[1.02] tracking-[-0.032em] sm:text-[2.6rem]">
          Was gut passt und was eher nicht
        </h2>

        <div className="mt-10 lg:mt-12">
          <div className="border-foreground text-muted-foreground hidden grid-cols-[10rem_minmax(0,1fr)_minmax(0,1fr)] gap-x-10 border-b-[1.5px] pb-3 md:grid">
            <span aria-hidden="true" />
            <span className="label-mono">Passt gut</span>
            <span className="label-mono">Passt eher nicht</span>
          </div>
          <dl className="border-foreground border-t-[1.5px] md:border-t-0">
            {CRITERIA.map((c) => (
              <div
                key={c.thema}
                className="border-border grid gap-x-10 gap-y-3 border-b py-6 md:grid-cols-[10rem_minmax(0,1fr)_minmax(0,1fr)]"
              >
                <dt className="md:pt-1">
                  <span className="text-[17px] font-semibold tracking-[-0.01em] md:hidden">{c.thema}</span>
                  <span className="label-mono text-muted-foreground hidden text-[11px] md:inline">{c.thema}</span>
                </dt>
                <dd className="text-foreground text-pretty text-[16.5px] leading-[1.6]">
                  <span className="label-mono text-ink-petrol mb-1 block text-[10.5px] md:hidden">Passt gut</span>
                  {c.ja}
                </dd>
                <dd className="text-muted-foreground text-pretty text-[16.5px] leading-[1.6]">
                  <span className="label-mono mb-1 block text-[10.5px] md:hidden">Passt eher nicht</span>
                  {c.nein}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

const STEPS: { title: string; body: string }[] = [
  {
    title: "Durchsicht oder kurze Anfrage",
    body: "Wir sehen uns Ihre jetzige Seite an und schicken drei bis fünf Punkte per Mail zurück. Oder wir lesen Ihre Anfrage und melden uns, meist am selben Werktag. Daran sehen Sie, wie wir arbeiten, und wir sehen, worum es geht.",
  },
  {
    title: "Ein kurzes Gespräch",
    body: "Meist reicht eine Viertelstunde, im Kalender sind 30 Minuten reserviert. Wir telefonieren oder treffen uns, wenn Sie in Hamburg sind. Wir fragen, was Sie anbieten, wer Ihre Kunden sind und was der Seite fehlt. Sie fragen, wie wir arbeiten und wann die Seite fertig wäre.",
  },
  {
    title: "Zusage oder Absage",
    body: "Passt es, schicken wir Ihnen Paket, Zeitplan und Festpreis. Passt es nicht, sagen wir Ihnen das offen und begründen es.",
  },
];

function Process() {
  return (
    <section className="bg-card border-foreground border-t">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-4">
          <p className="label-mono text-muted-foreground">Wie wir entscheiden</p>
          <h2 className="mt-4 text-balance text-[1.9rem] leading-[1.04] tracking-[-0.03em] sm:text-[2.3rem]">
            Drei Schritte bis zur Zu- oder Absage
          </h2>
        </div>
        <ol className="lg:col-span-7 lg:col-start-6">
          {STEPS.map((s, i) => (
            <li
              key={s.title}
              className={`grid grid-cols-[2rem_minmax(0,1fr)] gap-4 border-t py-7 sm:gap-6 ${i === 0 ? "border-foreground" : "border-border"}`}
            >
              <span aria-hidden="true" className="font-mono text-[15px] tabular-nums leading-[1.9]">
                {i + 1}
              </span>
              <div>
                <h3 className="text-[1.35rem] leading-tight tracking-[-0.015em]">{s.title}</h3>
                <p className="text-muted-foreground mt-2.5 text-pretty text-[16px] leading-[1.65]">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ClosingNote() {
  return (
    <section className="border-foreground border-t">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:items-end lg:gap-8">
        <p className="text-balance text-[1.6rem] leading-[1.2] tracking-[-0.02em] lg:col-span-7" style={{ fontStretch: "106%", fontWeight: 650 }}>
          Beide nächsten Schritte kosten nichts. Wenn hier nichts zu Ihnen passt, erwarten wir keine Anfrage.
        </p>
        <div className="flex flex-wrap items-center gap-3 lg:col-span-5 lg:justify-end">
          <Link href="/audit" className="btn-line grow sm:grow-0">
            Durchsicht anfordern
          </Link>
          <Link href="/termin" className="btn-signal grow sm:grow-0">
            Termin buchen <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
