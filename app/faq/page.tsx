import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { FotoRahmen, KontaktKarte, SeitenKopf, UnterseiteMain, unterseiteStil as u } from "@/components/marketing/laden/unterseite";
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
          eyebrow={`FAQ · ${QUESTION_COUNT} Antworten`}
          titel="Häufige Fragen"
          unter="Nach Themen sortiert. Steht Ihre Frage nicht dabei, rufen Sie an oder schreiben Sie uns."
          bild={
            <FotoRahmen
              vorab
              src="/images/cafe-eimsbuettel.webp"
              alt="Café-Tisch mit zwei Stühlen an einer Kopfsteinpflasterstraße in Eimsbüttel, ein Platz für ein Gespräch"
              aspect="21 / 9"
              aspectMobil="16 / 9"
              position="50% 55%"
            />
          }
        />
        <nav aria-label="Themen" className="inhalt pt-8 sm:pt-10">
          <ul role="list" className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-5">
            {GROUPS.map((g) => (
              <li key={g.id}>
                <a
                  href={`#${g.id}`}
                  className="flex min-h-[88px] flex-col justify-between rounded-[18px] bg-white p-5 shadow-[0_4px_16px_rgb(0_0_0/0.08)] transition-shadow hover:shadow-[0_18px_40px_-16px_rgb(16_32_48/0.28)]"
                >
                  <span className="text-[17px] leading-[22px] font-semibold">{g.label}</span>
                  <span className="mt-2 text-[14px] text-[#6e6e73]">{g.items.length} Fragen ›</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {GROUPS.map((g, i) => (
          <div key={g.id}>
            <GroupSection group={g} />
            {i === 1 ? (
              <p className="inhalt pt-8 text-[15px] leading-[1.47] text-[#6e6e73] sm:pt-10 sm:text-[17px]">
                Nicht dabei? Rufen Sie an unter{" "}
                <a href="tel:+491607621876" className="text-gold-ink font-semibold whitespace-nowrap">
                  0160&nbsp;7621876
                </a>{" "}
                oder schreiben Sie uns über das{" "}
                <Link href="/anfrage" className="text-gold-ink font-semibold underline-offset-4 hover:underline">
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
function GroupSection({ group }: { group: FaqGroup }) {
  return (
    <section id={group.id} aria-labelledby={`${group.id}-titel`} className={`scroll-mt-28 ${u.abschnitt}`}>
      <div className="inhalt grid gap-5 lg:grid-cols-12 lg:gap-5">
        <div className="lg:sticky lg:top-28 lg:col-span-4 lg:self-start">
          <h2 id={`${group.id}-titel`} className={u.zweiton}>
            <span>{group.label}.</span> <span>{group.items.length} Fragen.</span>
          </h2>
        </div>
        <div className="min-w-0 divide-y divide-black/10 rounded-[18px] bg-white px-6 shadow-[0_4px_16px_rgb(0_0_0/0.06)] sm:rounded-[28px] sm:px-8 lg:col-span-8">
          {group.items.map((item) => (
            <details key={item.q} className="group">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                <h3 className="text-[17px] leading-snug font-semibold tracking-[-0.016em] sm:text-[19px]">{item.q}</h3>
                <span
                  aria-hidden="true"
                  className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[22px] leading-none font-light text-[#6e6e73] transition-colors group-open:text-[#1d1d1f] group-hover:text-[#1d1d1f]"
                >
                  <span className="transition-transform group-open:rotate-45">+</span>
                </span>
              </summary>
              <p
                className={`max-w-2xl text-[17px] leading-[1.5] tracking-[-0.022em] text-pretty text-[#424245] sm:pr-12 ${item.link ? "pb-2" : "pb-6"}`}
              >
                {item.a}
              </p>
              {item.link ? (
                <Link
                  href={item.link.href}
                  className="text-gold-ink mb-4 inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline"
                >
                  {item.link.label}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              ) : null}
            </details>
          ))}
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
          <Link href="/sprechstunde" className="text-[#f3f2ee] underline underline-offset-4">
            offene Telefonsprechstunde
          </Link>
          .
        </>
      }
      pille={{ href: "/anfrage", label: "Website anfragen" }}
      link={{ href: "/kontakt", label: "Alle Kontaktwege" }}
      foto={{
        src: "/images/atmosphere/kanzlei-buecher.webp",
        alt: "Regal mit in Leder gebundenen Fachbüchern, davor eine Messinglampe in warmem Licht",
        position: "50% 50%",
      }}
    />
  );
}
