import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import {
  INVENTAR_NOT_USED,
  INVENTAR_USED,
  type InventarItem,
  type InventarSection,
} from "@/lib/inventar-data";

export const metadata: Metadata = {
  title: "Inventar — Was wir verwenden · Sitalo",
  description:
    "Offene Werkstatt-Liste. Was wir am Schreibtisch benutzen, wo wir hosten, was wir empfehlen und was wir bewusst auslassen.",
  alternates: { canonical: "/inventar" },
};

/**
 * `/inventar` — öffentliche Transparenz-Seite.
 *
 * Was wir verwenden, was wir bewusst nicht verwenden, mit
 * Begründung pro Eintrag. Premium-Signal: kein Hamburger
 * Wettbewerber listet so etwas öffentlich.
 *
 * Form: vier benannte Sektionen mit Editorial-Hairlines, am
 * Schluss ein eigenständiger „Was nicht im Atelier liegt"-Block
 * — bewusst optisch abgesetzt, fast als Zweitseite der Doppel-
 * seite gedacht.
 */
export default function InventarPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Inventar" />
      <main className="flex-1">
        <Hero />
        {INVENTAR_USED.map((section) => (
          <SectionBlock key={section.slug} section={section} />
        ))}
        <NotUsedBlock />
        <ClosingNote />
      </main>
      <MarketingFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="border-border/40 border-b">
      <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28 lg:py-32">
        <p className="text-muted-foreground inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span
            aria-hidden="true"
            className="bg-gold inline-block h-px w-10"
          />
          Offen einsehbar · Stand Juni 2026
        </p>
        <h1 className="serif text-foreground mt-8 text-balance text-5xl font-normal leading-[0.98] tracking-[-0.02em] sm:text-6xl lg:text-7xl">
          Inventar.
        </h1>
        <p className="serif-italic text-muted-foreground mt-4 text-balance text-3xl leading-snug tracking-[-0.01em] sm:text-4xl">
          Was wir verwenden, mit Begründung.
        </p>

        <div className="border-foreground/15 mt-12 border-l-2 pl-6">
          <p className="text-foreground/85 text-pretty text-[17px] leading-[1.7]">
            Werkzeuge, Hosting, Lieferanten — alles offen lesbar.
            Wir möchten, dass Sie wissen, mit welcher Werkstatt Sie
            es zu tun haben. Und mit welcher nicht: am Ende eine
            ausdrückliche Liste dessen, was bewusst nicht im Atelier
            liegt, mit Begründung pro Werkzeug.
          </p>
        </div>
      </div>
    </section>
  );
}

function SectionBlock({ section }: { section: InventarSection }) {
  return (
    <section
      id={section.slug}
      className="border-border/40 border-b scroll-mt-20"
    >
      <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-24">
        <p className="text-muted-foreground inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span
            aria-hidden="true"
            className="bg-gold inline-block h-px w-10"
          />
          {section.title}
        </p>
        <h2 className="serif text-foreground mt-6 text-balance text-3xl font-normal leading-[1.1] tracking-[-0.02em] sm:text-4xl">
          {section.intro}
        </h2>

        <ol className="divide-border/40 mt-12 divide-y">
          {section.items.map((item, i) => (
            <ItemRow key={i} item={item} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function ItemRow({ item }: { item: InventarItem }) {
  return (
    <li className="grid gap-4 py-8 sm:grid-cols-[1fr_2fr] sm:gap-10 sm:py-10">
      <div>
        <p className="text-foreground text-xl font-medium tracking-[-0.015em] sm:text-2xl">
          {item.name}
        </p>
        <p className="text-muted-foreground mt-2 text-[14px] leading-relaxed">
          {item.what}
        </p>
        {item.since && (
          <p className="text-muted-foreground/60 mt-3 font-mono text-[10px] uppercase tracking-[0.22em]">
            {item.since}
          </p>
        )}
      </div>
      <div className="border-foreground/10 sm:border-l-2 sm:pl-6">
        <p className="text-foreground/85 text-pretty text-[16px] leading-[1.65]">
          {item.why}
        </p>
      </div>
    </li>
  );
}

function NotUsedBlock() {
  return (
    <section className="bg-foreground text-background border-foreground/10 border-b">
      <div className="mx-auto w-full max-w-3xl px-6 py-24 sm:py-28">
        <p className="text-background/65 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em]">
          <span
            aria-hidden="true"
            className="bg-gold inline-block h-px w-10"
          />
          Bewusst ausgelassen
        </p>
        <h2 className="serif mt-8 text-balance text-4xl font-normal leading-[1.05] tracking-[-0.02em] sm:text-5xl">
          Was{" "}
          <span className="serif-italic text-background/65">
            nicht im Atelier
          </span>{" "}
          liegt.
        </h2>
        <p className="text-background/75 mt-6 max-w-lg text-pretty text-[16px] leading-relaxed">
          Sechs Werkzeuge, die in unserer Branche als selbstverständlich
          gelten, die wir aber bewusst nicht benutzen — mit klar
          benannter Begründung.
        </p>

        <ol className="border-background/15 mt-12 divide-y divide-background/15 border-t border-b">
          {INVENTAR_NOT_USED.map((item, i) => (
            <NotUsedRow key={i} item={item} index={i + 1} />
          ))}
        </ol>
      </div>
    </section>
  );
}

function NotUsedRow({ item, index }: { item: InventarItem; index: number }) {
  return (
    <li className="grid items-baseline gap-3 py-7 sm:grid-cols-[2.5rem_1fr_1.5fr] sm:gap-8 sm:py-9">
      <span
        aria-hidden="true"
        className="serif-italic text-background/45 text-xl font-normal leading-none tabular-nums"
      >
        {String(index).padStart(2, "0")}
      </span>
      <div>
        <p className="text-background text-lg font-medium leading-snug tracking-[-0.01em] sm:text-xl">
          {item.name}
        </p>
        <p className="text-background/55 mt-1.5 text-[13.5px] leading-relaxed">
          {item.what}
        </p>
      </div>
      <p className="text-background/80 text-pretty text-[15px] leading-[1.65]">
        {item.why}
      </p>
    </li>
  );
}

function ClosingNote() {
  return (
    <section>
      <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-24">
        <p className="serif text-foreground text-balance text-3xl font-normal leading-[1.25] tracking-[-0.01em] sm:text-4xl">
          Wenn etwas auf der Liste fehlt,{" "}
          <span className="serif-italic text-muted-foreground">
            das Sie als selbstverständlich erwarten —
          </span>{" "}
          fragen Sie uns einfach.
        </p>
        <p className="text-muted-foreground mt-6 max-w-2xl text-pretty text-[15.5px] leading-relaxed">
          Wir aktualisieren das Inventar etwa alle drei Monate. Wenn
          sich an unseren Werkzeugen oder Lieferanten etwas ändert,
          steht es hier. Diese Liste ist kein Marketing-Snapshot,
          sondern ein lebendes Dokument.
        </p>
        <div className="border-border/40 mt-12 flex flex-col gap-4 border-t pt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <p className="text-muted-foreground text-[14px] leading-relaxed">
            Sie haben Fragen zu einem konkreten Werkzeug oder einer
            Empfehlung?
          </p>
          <Link
            href="/termin"
            className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-11 items-center gap-2 rounded-full px-5 text-[14px] font-medium tracking-tight"
          >
            30 Minuten reden
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
