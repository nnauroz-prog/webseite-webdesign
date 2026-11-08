import type { Metadata } from "next";
import Link from "next/link";

import a from "@/components/marketing/hafen/atelier.module.css";
import { Steigend } from "@/components/marketing/hafen/steigend";
import { KontaktKarte, SeitenKopf, UnterseiteMain, unterseiteStil as u } from "@/components/marketing/laden/unterseite";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import type { FaqGroup } from "@/lib/faq-data";

import { FAQ_GROUPS } from "@/lib/faq-data";

export const metadata: Metadata = {
  title: "Häufige Fragen rund um Ihre neue Website",
  description:
    "Antworten auf das, was Kunden uns am häufigsten fragen — Preise, Ablauf, Hosting, Google-Suche, Betreuung.",
  alternates: { canonical: "/faq" },
};

const GROUPS: FaqGroup[] = FAQ_GROUPS;

const QUESTION_COUNT = GROUPS.reduce((n, g) => n + g.items.length, 0);

export default function FaqPage() {
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: GROUPS.flatMap((g) =>
      g.items.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    ),
  };
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader cta={false} />
      <UnterseiteMain>
        <SeitenKopf
          krumen="Fragen"
          eyebrow={`Kaimauer · ${QUESTION_COUNT} Antworten`}
          titel="Häufige Fragen"
          akzent="offen beantwortet."
          unter="Nach Themen sortiert. Steht Ihre Frage nicht dabei, rufen Sie an oder schreiben Sie uns."
        />
        <nav aria-label="Themen" className="inhalt pt-10 sm:pt-12">
          <ol className={`${a.lvListe} kante-stark grid sm:grid-cols-2 sm:gap-x-14`}>
            {GROUPS.map((g, i) => (
              <li key={g.id}>
                <a href={`#${g.id}`} className={a.lvZeile}>
                  <span className={a.lvNr}>{i + 1}</span>
                  <span className={a.lvTitel}>{g.label}</span>
                  <span className={a.lvWert}>
                    {g.items.length} Fragen <span className={a.lvPfeil}>↓</span>
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
        {GROUPS.map((g, i) => (
          <div key={g.id}>
            <GroupSection group={g} nr={i + 1} />
            {i === 1 ? (
              <p className={`inhalt ${a.mono} pt-10 sm:pt-12`}>
                Nicht dabei? Rufen Sie an unter{" "}
                <a href="tel:+491607621876" className="text-foreground font-medium whitespace-nowrap underline decoration-[var(--gold)] underline-offset-4">
                  0160&nbsp;7621876
                </a>{" "}
                oder schreiben Sie uns über das{" "}
                <Link href="/anfrage" className="text-foreground font-medium underline decoration-[var(--gold)] underline-offset-4">
                  Anfrageformular
                </Link>
                .
              </p>
            ) : null}
          </div>
        ))}
        <Closer />
      </UnterseiteMain>
      <MarketingFooter crumb="Fragen" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------
 * Eine Themengruppe: links Name und Zahl der Fragen (auf breiten
 * Schirmen mitlaufend), rechts die Fragen zum Aufklappen.
 * ---------------------------------------------------------------- */
function GroupSection({ group, nr }: { group: FaqGroup; nr: number }) {
  const antwort = (item: FaqGroup["items"][number]) => (
    <>
      {item.a}
      {item.link ? (
        <>
          {" "}
          <Link href={item.link.href} className="link-pfeil text-foreground font-semibold">
            {item.link.label}&nbsp;<span className="pfeil" aria-hidden="true">→</span>
          </Link>
        </>
      ) : null}
    </>
  );
  return (
    <section id={group.id} aria-labelledby={`${group.id}-titel`} className={`scroll-mt-28 ${u.abschnitt}`}>
      <div className="inhalt grid gap-6 lg:grid-cols-12 lg:gap-10">
        <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
          <p className={u.eyebrow}>
            Thema {nr} · {group.items.length} Fragen
          </p>
          <h2 id={`${group.id}-titel`} data-reveal="rise" className={`${u.zweiton} mt-4`}>
            <Steigend text={group.label} />
          </h2>
        </div>
        <div className="min-w-0 lg:col-span-8">
          <dl className={`${a.interview} ${a.interviewEins}`}>
            {group.items.map((item) => (
              <div key={item.q}>
                <dt className={a.frage}>{item.q}</dt>
                <dd className={a.antwort}>{antwort(item)}</dd>
              </div>
            ))}
          </dl>
          <div className={a.fragenMobil}>
            {group.items.map((item, i) => (
              <details key={item.q} open={i < 3}>
                <summary>
                  <h3 className={a.frage}>{item.q}</h3>
                </summary>
                <p className={a.antwort}>{antwort(item)}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Schluss: keine Frage als Überschrift, sondern die Wege, auf denen
 * eine fehlende Antwort am schnellsten kommt.
 * ---------------------------------------------------------------- */
function Closer() {
  return (
    <KontaktKarte
      titel="Ihre Frage war nicht dabei"
      zeile={
        <>
          Dann fragen Sie uns direkt. Anfragen über das Formular beantworten wir meist am selben Werktag. Am ersten
          Donnerstag im Monat gibt es außerdem eine{" "}
          <Link href="/sprechstunde" className="text-foreground underline decoration-[var(--gold)] underline-offset-4">
            offene Telefonsprechstunde
          </Link>
          .
        </>
      }
      pille={{ href: "/anfrage", label: "Website anfragen" }}
      link={{ href: "/kontakt", label: "Alle Kontaktwege" }}
    />
  );
}
