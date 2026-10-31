import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export const metadata: Metadata = {
  title: "Häufige Fragen rund um Ihre neue Website",
  description:
    "Antworten auf das, was Kunden uns am häufigsten fragen — Preise, Ablauf, Hosting, SEO, Betreuung.",
  alternates: { canonical: "/faq" },
};

type Group = {
  label: string;
  items: { q: string; a: string }[];
};

const GROUPS: Group[] = [
  {
    label: "Anfrage & Ablauf",
    items: [
      {
        q: "Muss ich mich irgendwo registrieren?",
        a: "Nein. Schicken Sie uns einfach das Formular oder eine E-Mail — kein Account, kein Login, nichts dergleichen.",
      },
      {
        q: "Wie schnell ist meine Seite fertig?",
        a: "Wenn Sie uns alle Unterlagen geschickt haben, dauert eine einfache Seite bei uns oft nur 1–2 Werktage. Größere Projekte besprechen wir vorher in Ruhe und nennen Ihnen einen verbindlichen Termin — wir versprechen nichts, was wir nicht halten können.",
      },
      {
        q: "Was brauchen Sie von mir?",
        a: "Drei Sachen: Ihr Logo (egal welches Format — sogar Schnappschuss vom Briefpapier reicht), 5–10 Bilder von Ihnen oder Ihrem Betrieb (Handy-Fotos sind ok), eine kurze Beschreibung Ihrer Leistungen plus Öffnungszeiten und Kontakt. Wenn etwas fehlt, sagen wir Bescheid — und empfehlen einen Hamburger Fotografen für 200–400 €, falls Bilder ein Problem sind.",
      },
      {
        q: "Können wir uns persönlich in Hamburg treffen?",
        a: "Gerne. Café in Eppendorf, auf einen Kaffee am Mühlenkamp, in der Schanze — wo Sie wollen. 15 Minuten reichen meistens, um zu klären, ob wir zusammen passen. Geht auch per Telefon oder Video — am schnellsten über die Termin-Seite: Tag und Uhrzeit selbst wählen, Bestätigung in 15 Minuten.",
      },
      {
        q: "Kann ich erstmal eine ehrliche Einschätzung meiner aktuellen Seite bekommen?",
        a: "Ja, kostenlos und ohne Vertriebs-Anruf danach. Über die Audit-Seite schicken Sie uns Ihre URL, wir gucken mit der Hand drauf und schreiben Ihnen innerhalb von 48 Stunden drei bis fünf konkrete Punkte. Wer es eilig hat: der Speed-Check liefert die technischen Werte automatisch in 30 Sekunden.",
      },
      {
        q: "Was passiert nach meiner Anfrage?",
        a: "Sie bekommen sofort eine kurze Bestätigung per E-Mail. Wir schauen uns Ihre Angaben in Ruhe an und melden uns innerhalb von 24 Stunden — meist deutlich schneller — persönlich bei Ihnen. Kein Vertrag, keine Kosten, kein Druck.",
      },
      {
        q: "Was, wenn ich noch gar nichts vorbereitet habe?",
        a: "Macht nichts. Schicken Sie uns einfach eine kurze Notiz, was Sie vorhaben — wir helfen beim Sortieren. Sie müssen nicht erst alles fertig haben, bevor wir reden können. Im Gegenteil: je früher wir mitdenken, desto besser passt das Ergebnis am Ende.",
      },
      {
        q: "Kann ich auch per E-Mail anfragen?",
        a: "Ja, schreiben Sie uns direkt an info@sitalo.de. Für eine vollständige Projekt-Aufnahme ist das Formular allerdings praktischer — dann haben wir alles strukturiert auf einen Blick und können schneller antworten.",
      },
    ],
  },
  {
    label: "Preise & Betreuung",
    items: [
      {
        q: "Was kostet das Ganze?",
        a: "Wir arbeiten mit vier Stufen: Starter ab 499 €, Business ab 899 €, Premium ab 2.499 € und Sitalo Studio ab 3.490 € — jeweils einmalig für die Erstellung. Dazu kommt ein Monatsbeitrag von 49 € / 79 € / 179 € / 249 € für Hosting, Pflege und kleine Änderungen. Den genauen Endpreis nennen wir Ihnen nach Ihrer Anfrage — verbindlich, kein böses Erwachen.",
      },
      {
        q: "Warum gibt es nur Einstiegspreise?",
        a: "Weil ehrlich gesagt jedes Projekt anders ist. Manche schicken uns komplette Unterlagen, andere brauchen mehr Hilfe. Manche wollen eine Seite, andere fünf. Die Einstiegspreise zeigen Ihnen, wo es losgeht — den endgültigen Preis vereinbaren wir vorher, schwarz auf weiß.",
      },
      {
        q: "Kann ich später noch Sachen ändern lassen?",
        a: "Klar. Kleine Änderungen sind in der monatlichen Betreuung dabei (1, 3 oder 6 pro Monat, je nach Paket). Sie schreiben uns kurz, was geändert werden soll — wir melden uns, setzen es um und sagen Bescheid, sobald es online ist.",
      },
      {
        q: "Kann ich bestimmte Inhalte selbst pflegen?",
        a: "Wenn Sie möchten, ja. Im Premium-Paket bauen wir Ihnen Bereiche ein, die Sie selbst aktualisieren können — Öffnungszeiten, Wochenangebot, Speisekarte, Bilder. Wenn Sie das nicht wollen, übernehmen wir das. Sie entscheiden.",
      },
      {
        q: "Bin ich an einen langen Vertrag gebunden?",
        a: "Die einmalige Erstellung ist einmalig. Die monatliche Betreuung hat eine Mindestlaufzeit von sechs Monaten und ist danach jederzeit zum Monatsende kündbar. Beim Ausstieg bekommen Sie den kompletten Bestand (Seite, Inhalte, Domain-Zugang) sauber übergeben — wir halten niemanden als Geisel.",
      },
      {
        q: "Was kostet eine spätere Erweiterung?",
        a: "Kleine Erweiterungen sind in der monatlichen Pflege dabei. Größere Sachen (z. B. ein neuer Bereich, Online-Buchung, ein zweites Sprachset) bekommen Sie vorher als verbindliches Angebot. Typischer Rahmen: 150–500 €, je nach Aufwand.",
      },
      {
        q: "Meine Seite wurde woanders gebaut — übernehmen Sie die Pflege?",
        a: "Ja. Hosting, Updates, Backups und kleine Änderungen machen wir auch für Seiten, die nicht von uns stammen — sogar für Wix- und Squarespace-Seiten. Drei Stufen offen auf der Wartungs-Seite: Basis ab 49 €/Monat, Plus ab 99 €/Monat, Werkbank On-Demand ab 299 €/Monat (mit zwei freien Atelier-Stunden pro Monat). Einmaliges Onboarding ab 199 €.",
      },
    ],
  },
  {
    label: "Sichtbarkeit & SEO",
    items: [
      {
        q: "Werde ich für meinen Stadtteil gefunden?",
        a: `Das ist genau unser Ansatz. Wir optimieren nicht nur auf „Webdesign Hamburg" (zu generisch), sondern auf konkrete Phrasen wie „Friseur Eimsbüttel", „Pflegedienst Wandsbek", „Café Ottensen". Wir haben eigene Stadtteil-Seiten für die wichtigsten Hamburger Lagen — schauen Sie sich /standorte an.`,
      },
      {
        q: "Lohnt sich ein Google Business Profile?",
        a: "Absolut. Das ist kostenlos und der größte Hebel für lokale Sichtbarkeit. Im Premium-Paket richten wir Ihnen das mit ein, beim Business-Paket auf Wunsch gegen kleinen Aufpreis (~ 80 €). Sie verwalten es danach selbst oder lassen es uns pflegen.",
      },
      {
        q: "Was bringt mir SEO konkret?",
        a: `Für lokale Anbieter sehr viel. 46 % aller Google-Suchen sind lokal, 76 % der lokalen Suchenden besuchen den Anbieter binnen 24 Stunden. Wer für „Friseur in [Ihrem Stadtteil]" auf Seite 1 steht, hat ein verlässliches Anfrage-Volumen — auch ohne Anzeigen.`,
      },
      {
        q: "Schalten Sie auch Google-Ads für mich?",
        a: "Nein. Wir bauen Websites, keine Werbe-Kampagnen — das ist eine eigene Disziplin. Wenn Sie Ads schalten wollen, empfehlen wir Ihnen gerne eine spezialisierte Hamburger Agentur. Ehrlich gesagt: für die meisten lokalen Anbieter ist gute SEO + Google Business Profile billiger und nachhaltiger als Ads.",
      },
    ],
  },
  {
    label: "Technik & Rechtliches",
    items: [
      {
        q: "Ist Hosting dabei?",
        a: "Ja, alles inklusive. Server stehen in der EU, SSL ist Pflicht, Backups laufen automatisch. Sie müssen sich um nichts kümmern — auch nicht um Updates oder Sicherheit. Das ist unser Job.",
      },
      {
        q: "Funktioniert die Seite auch auf dem Handy?",
        a: "Ja, immer. Die meisten Ihrer Kunden schauen heute zuerst aufs Handy — also bauen wir auch zuerst für das Handy. Vor dem Live-Gang testen wir auf echten Geräten, nicht nur im Simulator.",
      },
      {
        q: "Wird man die Seite bei Google finden?",
        a: "Wir legen die Basis sauber: Titel, Beschreibungen, klare Struktur, schnelle Ladezeiten, lokale Suchbegriffe, Sitemap. Garantieren kann Ihnen Platz 1 niemand seriös — aber das Fundament passt, und für lokale Suchen („Friseur Eimsbüttel\", „Pflegedienst Altona\") sind die Chancen sehr gut.",
      },
      {
        q: "Sind Impressum und Datenschutz dabei?",
        a: "Die Seiten legen wir technisch an. Den juristisch sicheren Text dazu sollten Sie aber von einer geeigneten Quelle beziehen — Generator, Anwalt oder Verband. Wir empfehlen Ihnen gerne, was zu Ihrem Fall passt.",
      },
      {
        q: "Ich habe schon eine Website — kann die modernisiert werden?",
        a: 'Ja, schauen wir uns gerne an. Im Formular wählen Sie „Redesign" und schicken uns die URL. Wir melden uns nach einer ersten Sichtung mit ehrlicher Einschätzung — manchmal lohnt sich ein Update, manchmal ein Neuaufbau. Wir sagen Ihnen, was sinnvoller ist.',
      },
      {
        q: "Für welche Branchen arbeiten Sie?",
        a: "Vor allem für lokale Unternehmen in und um Hamburg: Pflegedienste, Arzt- und Zahnarztpraxen, Friseure, Kosmetikstudios, Cafés und Restaurants, Handwerker, Reinigungsfirmen, Kanzleien, Fitnessstudios, Boutique-Hotels. Wenn Sie nicht sicher sind, ob Ihre Branche passt — fragen Sie einfach.",
      },
      {
        q: "Was wenn ich meine Domain woanders habe?",
        a: "Kein Problem. Wir übernehmen die Verbindung — Sie behalten die Domain in Ihrem Account (z. B. bei IONOS, Strato, GoDaddy), wir zeigen sie nur auf unseren Server. Falls Sie wollen, können wir auch die Domain komplett zu uns transferieren. Beides geht.",
      },
      {
        q: "Was wenn ich später woanders hin will?",
        a: "Dann übergeben wir sauber. Sie bekommen den vollständigen Quellcode Ihrer Seite, alle Inhalte und können bei einem anderen Anbieter weitermachen. Wir bauen keine Vendor-Lock-ins. Das ist ein Wettbewerbsvorteil, kein Risiko.",
      },
    ],
  },
];

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
      <MarketingHeader />
      <EditorialMasthead section="Häufige Fragen" />
      <main id="main" tabIndex={-1} className="flex-1">
        <Hero />
        {GROUPS.map((g) => (
          <Group key={g.label} group={g} />
        ))}
        <Closer />
      </main>
      <MarketingFooter />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="aurora pointer-events-none absolute inset-0 -z-10">
        <span />
        <span />
        <span />
      </div>
      <div className="mx-auto w-full max-w-3xl px-5 pt-14 pb-8 sm:px-6 sm:pt-20 sm:pb-10">
        <h1 className="text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-6xl">
          Häufige <span className="serif-italic text-muted-foreground font-normal">Fragen.</span>
        </h1>
        <p className="text-muted-foreground mt-5 text-base leading-relaxed sm:text-lg">
          Eine Antwort fehlt?{" "}
          <Link href="/kontakt" className="text-foreground underline underline-offset-4">
            Schreiben Sie uns.
          </Link>
        </p>
      </div>
    </section>
  );
}

function Group({ group }: { group: Group }) {
  return (
    <section className="border-border/40 border-t">
      <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:px-6 sm:py-12">
        <h2 className="text-muted-foreground text-[12px] font-medium uppercase tracking-[0.24em]">{group.label}</h2>
        <div className="divide-border/60 mt-4 divide-y">
          {group.items.map((item) => (
            <details key={item.q} className="group py-4">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6">
                <h3 className="text-[17px] font-medium leading-snug tracking-tight sm:text-lg">{item.q}</h3>
                <span
                  aria-hidden="true"
                  className="border-border/70 text-muted-foreground group-open:bg-foreground group-open:text-background group-open:border-foreground inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-lg transition-all group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="text-muted-foreground mt-3 max-w-2xl text-pretty text-[15px] leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function Closer() {
  return (
    <section className="bg-foreground text-background relative overflow-hidden">
      <div aria-hidden="true" className="aurora aurora-dark pointer-events-none absolute inset-0">
        <span />
        <span />
        <span />
      </div>
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-5 py-16 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-20">
        <h2 className="serif text-balance text-3xl leading-tight sm:text-5xl">
          Etwas fehlt?{" "}
          <span className="serif-italic text-background/70">Fragen Sie direkt.</span>
        </h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/anfrage"
            className="bg-background text-foreground hover:bg-background/90 group inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium tracking-tight"
          >
            Website anfragen
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/kontakt"
            className="border-background/30 text-background hover:bg-background hover:text-foreground inline-flex h-12 items-center rounded-full border px-6 text-[15px] font-medium tracking-tight transition-colors"
          >
            Kontakt
          </Link>
        </div>
      </div>
    </section>
  );
}
