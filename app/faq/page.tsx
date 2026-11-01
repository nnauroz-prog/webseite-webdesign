import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { PageHero } from "@/components/marketing/page-hero";

export const metadata: Metadata = {
  title: "Häufige Fragen rund um Ihre neue Website",
  description:
    "Antworten auf das, was Kunden uns am häufigsten fragen — Preise, Ablauf, Hosting, Google-Suche, Betreuung.",
  alternates: { canonical: "/faq" },
};

type Group = {
  id: string;
  label: string;
  items: { q: string; a: string }[];
};

const GROUPS: Group[] = [
  {
    id: "anfrage",
    label: "Anfrage und Ablauf",
    items: [
      {
        q: "Muss ich mich irgendwo registrieren?",
        a: "Nein. Sie schicken uns das Formular oder eine E-Mail, ein Konto brauchen Sie dafür nicht.",
      },
      {
        q: "Wie schnell ist meine Seite fertig?",
        a: "Ab vollständigen Unterlagen ist eine einzelne Seite (Starter) oft in 1–2 Werktagen online, Business meist in 5–10 Werktagen, Premium in 2–3 Wochen und Studio in 3–5 Wochen. Den genauen Termin für Ihre Seite nennen wir Ihnen vorab.",
      },
      {
        q: "Was brauchen Sie von mir?",
        a: "Ihr Logo in irgendeinem Format, notfalls fotografiert vom Briefpapier. Dazu fünf bis zehn Bilder von Ihnen oder Ihrem Betrieb, Handyfotos reichen. Außerdem Stichpunkte zu Ihren Leistungen, Öffnungszeiten und Kontaktdaten. Fehlt etwas, sagen wir Bescheid. Sind Bilder ein Problem, sagen wir Ihnen, welche Motive die Seite braucht. Wer einen Fotografen beauftragen will, bekommt von uns eine kurze Motivliste.",
      },
      {
        q: "Können wir uns persönlich in Hamburg treffen?",
        a: "Ja, in Ihrem Betrieb oder in einem Café. Eine Viertelstunde reicht meistens, um zu klären, ob wir zusammenpassen. Telefon oder Video geht genauso. Über die Termin-Seite wählen Sie Tag und Uhrzeit selbst; reserviert sind bis zu 30 Minuten, damit Zeit für Fragen bleibt. Die Bestätigung kommt meist am selben Werktag per Mail.",
      },
      {
        q: "Kann ich erst einmal eine Einschätzung meiner aktuellen Seite bekommen?",
        a: "Ja, kostenlos. Über die Seite „Kostenlose Durchsicht“ schicken Sie uns die Adresse Ihrer Seite. Wir sehen sie uns selbst an und schreiben Ihnen meist innerhalb von zwei Werktagen drei bis fünf konkrete Punkte. Einen Vertriebsanruf gibt es danach nicht. Die technischen Messwerte liefert der Ladezeit-Test automatisch in etwa 30 Sekunden.",
      },
      {
        q: "Was passiert nach meiner Anfrage?",
        a: "Nach dem Absenden sehen Sie eine Bestätigung auf der Seite. Wir lesen Ihre Angaben und melden uns meist am selben Werktag, per Mail oder am Telefon. Bis Sie ein Angebot unterschreiben, kostet Sie das nichts.",
      },
      {
        q: "Was, wenn ich noch gar nichts vorbereitet habe?",
        a: "Dann schicken Sie uns eine kurze Notiz, was Sie vorhaben, und wir sortieren es gemeinsam. Je früher wir mitdenken, desto weniger muss später umgebaut werden.",
      },
      {
        q: "Kann ich auch per E-Mail anfragen?",
        a: "Ja, an info@sitalo.de. Das Formular ist etwas praktischer, weil wir dann alle Angaben an einer Stelle haben und schneller antworten können.",
      },
    ],
  },
  {
    id: "preise",
    label: "Preise und Betreuung",
    items: [
      {
        q: "Was kostet das Ganze?",
        a: "Es gibt vier Pakete: Starter ab 499\u00A0€, Business ab 899\u00A0€, Premium ab 2.499\u00A0€ und Sitalo Studio ab 3.490\u00A0€, jeweils einmalig für die Erstellung. Dazu kommt ein Monatsbeitrag ab 49\u00A0€, 79\u00A0€, 179\u00A0€ oder 249\u00A0€ für Hosting, Pflege und kleine Änderungen. Den Endpreis nennen wir Ihnen nach Ihrer Anfrage, schriftlich und verbindlich.",
      },
      {
        q: "Warum gibt es nur Einstiegspreise?",
        a: "Weil die Projekte unterschiedlich groß sind. Manche schicken uns fertige Unterlagen, andere brauchen mehr Hilfe. Manche wollen eine Seite, andere fünf. Der Einstiegspreis zeigt, wo es losgeht. Den endgültigen Preis bekommen Sie schriftlich, bevor wir anfangen.",
      },
      {
        q: "Kann ich später noch etwas ändern lassen?",
        a: "Ja. Kleine Änderungen sind im Monatsbeitrag enthalten, je nach Paket eine, drei, sechs oder zehn pro Monat. Sie schreiben uns kurz, was sich ändern soll. Wir setzen es um und sagen Bescheid, sobald es online ist. Ist das Kontingent eines Monats aufgebraucht, sagen wir Ihnen das vorher; weitere Änderungen rechnen wir nach Aufwand zum Stundensatz ab.",
      },
      {
        q: "Kann ich bestimmte Inhalte selbst pflegen?",
        a: "Wenn Sie möchten, ja. Ab dem Premium-Paket bauen wir Bereiche ein, die Sie selbst ändern können, etwa Öffnungszeiten, Wochenangebot, Speisekarte oder Bilder. Wollen Sie das nicht, übernehmen wir es.",
      },
      {
        q: "Bin ich an einen langen Vertrag gebunden?",
        a: "Die Erstellung zahlen Sie einmal. Der Monatsbeitrag hat eine Mindestlaufzeit von sechs Monaten und ist danach zum Monatsende kündbar. Wenn Sie gehen, übergeben wir Ihnen alles: die Seite, die Inhalte und den Zugang zur Domain.",
      },
      {
        q: "Was kostet eine spätere Erweiterung?",
        a: "Kleine Änderungen sind im Monatsbeitrag enthalten, je nach Paket eine bis zehn pro Monat. Eine Erweiterung, etwa ein neuer Bereich, eine Online-Buchung oder eine zweite Sprache, wird nach Stundensatz berechnet. Den Betrag bekommen Sie vorher als verbindliches Angebot.",
      },
      {
        q: "Meine Seite wurde woanders gebaut. Übernehmen Sie die Pflege?",
        a: "Ja. Hosting, Updates, Backups und kleine Änderungen übernehmen wir auch für fremde Seiten, auch für Wix und Squarespace. Bei Wix und Squarespace bleibt das Hosting beim Anbieter. Auf der Wartungs-Seite stehen drei Stufen: Basis ab 49\u00A0€, Plus ab 99\u00A0€ und Werkbank ab 299\u00A0€ im Monat, die letzte mit zwei Arbeitsstunden pro Monat. Die Übernahme Ihrer Seite kostet einmalig ab 199\u00A0€.",
      },
    ],
  },
  {
    id: "sichtbarkeit",
    label: "Bei Google gefunden werden",
    items: [
      {
        q: "Werde ich für meinen Stadtteil gefunden?",
        a: `Darauf bauen wir die Seite aus. Statt auf „Webdesign Hamburg" zielen wir auf Suchen wie „Friseur Eimsbüttel", „Pflegedienst Wandsbek" oder „Café Ottensen". Für mehrere Hamburger Stadtteile gibt es bei uns eigene Seiten, zu finden unter /standorte. Für Betriebe in anderen Städten gehen wir genauso vor.`,
      },
      {
        q: "Lohnt sich ein Google-Unternehmensprofil?",
        a: "Ja. Das Profil ist kostenlos und entscheidet mit, ob Sie bei Google Maps und in der lokalen Suche auftauchen. Ab dem Business-Paket richten wir es mit Ihnen ein. Danach pflegen Sie es selbst oder überlassen es uns.",
      },
      {
        q: "Was bringt mir Suchmaschinenoptimierung (SEO) konkret?",
        a: `Für lokale Betriebe vor allem Anfragen von Leuten, die gerade suchen. Wer bei „Friseur" plus Stadtteil auf der ersten Seite steht, wird angerufen, ohne für Anzeigen zu bezahlen. Dafür sorgen saubere Seitentitel, die richtigen Suchbegriffe und ein gepflegtes Google-Profil.`,
      },
      {
        q: "Schalten Sie auch Google-Anzeigen für mich?",
        a: "Nein, Werbekampagnen sind ein eigenes Fach, das wir nicht anbieten. Für die meisten lokalen Betriebe sind eine gut gebaute Seite und ein gepflegtes Google-Profil auf Dauer günstiger als Anzeigen.",
      },
    ],
  },
  {
    id: "technik",
    label: "Technik und Rechtliches",
    items: [
      {
        q: "Ist Hosting dabei?",
        a: "Ja, im Monatsbeitrag. Die Server stehen in der EU, das SSL-Zertifikat ist Pflicht, Backups laufen automatisch. Updates und Sicherheit übernehmen wir.",
      },
      {
        q: "Funktioniert die Seite auch auf dem Handy?",
        a: "Ja. Wir bauen zuerst die Ansicht fürs Handy und danach die für den Rechner. Vor dem Start prüfen wir die Seite auf echten Geräten, nicht nur im Simulator.",
      },
      {
        q: "Wird man die Seite bei Google finden?",
        a: `Die Grundlage legen wir sauber an: Seitentitel, Beschreibungen, eine klare Struktur, kurze Ladezeiten, lokale Suchbegriffe und eine Sitemap. Platz 1 kann Ihnen niemand seriös versprechen. Bei lokalen Suchen wie „Friseur Eimsbüttel" oder „Pflegedienst Altona" ist die Konkurrenz aber oft überschaubar.`,
      },
      {
        q: "Sind Impressum und Datenschutz dabei?",
        a: "Die Seiten legen wir technisch an. Den rechtlich geprüften Text sollten Sie aus einer geeigneten Quelle beziehen, etwa einem Generator, einer Anwältin oder Ihrem Verband. Was zu Ihrem Fall passt, sagen wir Ihnen gern.",
      },
      {
        q: "Ich habe schon eine Website. Kann die modernisiert werden?",
        a: "Ja. Schreiben Sie im Anfrageformular kurz dazu, dass es um Ihre bestehende Seite geht, und nennen Sie die Adresse. Oder Sie schicken sie über die kostenlose Durchsicht. Danach sagen wir Ihnen, ob sich ein Umbau lohnt oder ein Neubau sinnvoller ist.",
      },
      {
        q: "Für welche Branchen arbeiten Sie?",
        a: "Für kleine Betriebe in ganz Deutschland, zum Beispiel Pflegedienste, Arzt- und Zahnarztpraxen, Friseure, Kosmetikstudios, Cafés und Restaurants, Handwerker, Reinigungsfirmen, Kanzleien, Fitnessstudios und kleine Hotels. Steht Ihre Branche nicht dabei, fragen Sie einfach.",
      },
      {
        q: "Was, wenn meine Domain woanders liegt?",
        a: "Dann bleibt sie in Ihrem Konto, etwa bei IONOS, Strato oder GoDaddy, und wir richten sie auf unseren Server. Wenn Sie wollen, ziehen wir die Domain auch ganz zu uns um.",
      },
      {
        q: "Was, wenn ich später woanders hin will?",
        a: "Dann übergeben wir sauber. Sie bekommen den vollständigen Quellcode Ihrer Seite und alle Inhalte und können bei einem anderen Anbieter weitermachen.",
      },
    ],
  },
];

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
      <MarketingHeader tone="dark" />
      <main id="main" tabIndex={-1} className="flex-1">
        <PageHero
          crumb="Fragen"
          eyebrow={`FAQ · ${QUESTION_COUNT} Antworten`}
          title="Häufige Fragen"
          meta={
            <nav aria-label="Themen" className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[12.5px]">
              {GROUPS.map((g) => (
                <a
                  key={g.id}
                  href={`#${g.id}`}
                  className="text-background/80 hover:text-background underline-offset-4 hover:underline"
                >
                  {g.label}
                </a>
              ))}
            </nav>
          }
        >
          Nach Themen sortiert. Steht Ihre Frage nicht dabei, rufen Sie an oder schreiben Sie uns.
        </PageHero>
        {GROUPS.map((g, i) => (
          <GroupSection key={g.id} group={g} first={i === 0} />
        ))}
        <Closer />
      </main>
      <MarketingFooter />
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
function GroupSection({ group, first }: { group: Group; first: boolean }) {
  return (
    <section id={group.id} aria-labelledby={`${group.id}-titel`} className={`scroll-mt-20 ${first ? "" : "border-border border-t"}`}>
      <div className="mx-auto grid w-full max-w-6xl gap-6 px-5 py-14 sm:px-6 sm:py-20 lg:grid-cols-12 lg:gap-8">
        <div className="lg:sticky lg:top-24 lg:col-span-4 lg:self-start">
          <p className="label-mono text-muted-foreground">{group.items.length} Fragen</p>
          <h2
            id={`${group.id}-titel`}
            className="mt-3 text-balance text-[1.75rem] leading-[1.05] tracking-[-0.028em] sm:text-[2.2rem]"
          >
            {group.label}
          </h2>
        </div>
        <div className="border-foreground divide-border min-w-0 divide-y border-t border-b lg:col-span-8">
          {group.items.map((item, i) => (
            <details key={item.q} className="group" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 [&::-webkit-details-marker]:hidden">
                <h3 className="text-[17px] leading-snug tracking-[-0.01em] sm:text-[18.5px]">{item.q}</h3>
                <span
                  aria-hidden="true"
                  className="border-foreground/70 group-open:bg-foreground group-open:text-background group-open:border-foreground mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-[2px] border font-mono text-[15px] leading-none transition-colors"
                >
                  <span className="transition-transform group-open:rotate-45">+</span>
                </span>
              </summary>
              <p className="text-foreground/80 max-w-2xl pb-6 text-pretty text-[15.5px] leading-relaxed sm:pr-12">
                {item.a}
              </p>
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
    <section className="bg-card border-foreground border-t">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-16 sm:px-6 sm:py-24 lg:grid-cols-12 lg:items-end lg:gap-8">
        <div className="lg:col-span-6">
          <h2 className="text-balance text-[1.9rem] leading-[1.05] tracking-[-0.03em] sm:text-[2.6rem]">
            Ihre Frage war nicht dabei
          </h2>
          <p className="text-muted-foreground mt-5 max-w-md text-[16.5px] leading-relaxed">
            Dann fragen Sie uns direkt. Mails beantworten wir meist am selben Werktag. Am ersten Donnerstag im Monat
            gibt es außerdem eine{" "}
            <Link href="/sprechstunde" className="text-foreground underline underline-offset-4">
              offene Telefonsprechstunde
            </Link>
            .
          </p>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <a
            href="tel:+491607621876"
            className="hover:text-gold block text-[2.1rem] leading-none tracking-[-0.03em] whitespace-nowrap transition-colors sm:text-[3rem]"
            style={{ fontStretch: "118%", fontWeight: 780 }}
          >
            0160&nbsp;7621876
          </a>
          <a
            href="mailto:info@sitalo.de"
            className="border-gold mt-4 inline-block border-b-[1.5px] pb-0.5 text-[18px] font-semibold"
          >
            info@sitalo.de
          </a>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link href="/anfrage" className="btn-signal">
              Website anfragen <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline"
            >
              Alle Kontaktwege <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
