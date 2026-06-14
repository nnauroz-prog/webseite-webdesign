import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { ATELIER_GERADE, ATELIER_NOTES } from "@/lib/atelier-notes";
import { AVAILABILITY } from "@/lib/availability";
import { formatDate, JOURNAL_POSTS } from "@/lib/journal-data";
import {
  nextSprechstunden,
  SPRECHSTUNDE_BEGINN_HHMM,
  SPRECHSTUNDE_ENDE_HHMM,
} from "@/lib/sprechstunde-data";

export const metadata: Metadata = {
  title: "Jetzt — was im Atelier gerade passiert",
  description:
    "Die Now-Page des Ateliers: woran wir gerade bauen, wie viele Bauplätze frei sind, wann die nächste Sprechstunde ist, was wir gerade lernen. Monatlich aktualisiert.",
  alternates: { canonical: "/jetzt" },
};

/**
 * `/jetzt` — Now-Page der Werkstatt.
 *
 * Indie-Web-Konvention (nownownow.com): eine Seite, die sagt, was
 * JETZT passiert — nicht was wir generell anbieten. Speist sich
 * komplett aus bestehenden Datenquellen (Atelier-Notizen,
 * Verfügbarkeit, Sprechstunden-Termine, neuester Essay), plus
 * einer kleinen persönlichen „Gerade"-Liste. Die Seite bleibt
 * dadurch von selbst aktuell, sobald die Quellen gepflegt werden.
 *
 * Premium-Signal: lebende Werkstatt statt statischer Broschüre.
 * Kein Hamburger Wettbewerber führt eine Now-Page.
 */
export default function JetztPage() {
  const monthLabel = new Date().toLocaleDateString("de-DE", {
    month: "long",
    year: "numeric",
    timeZone: "Europe/Berlin",
  });
  const sprechstunde = nextSprechstunden(1)[0];
  const latestPosts = JOURNAL_POSTS.slice(0, 2);
  const { availableSlots, slotMonth, nextMonth } = AVAILABILITY;
  const slotsOpen = availableSlots > 0;

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Jetzt" />
      <main id="main" tabIndex={-1} className="flex-1">
        {/* Hero */}
        <section className="border-border/40 border-b">
          <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-28 lg:py-32">
            <p className="text-muted-foreground inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em]">
              <span
                aria-hidden="true"
                className="bg-gold gold-pulse inline-block h-1 w-6"
              />
              Stand {monthLabel} · wird monatlich erneuert
            </p>
            <h1 className="serif text-foreground mt-8 text-balance text-5xl font-normal leading-[0.98] tracking-[-0.02em] sm:text-6xl lg:text-7xl">
              Jetzt.
            </h1>
            <p className="serif-italic text-muted-foreground mt-4 text-balance text-3xl leading-snug tracking-[-0.01em] sm:text-4xl">
              Was im Atelier gerade passiert.
            </p>
            <div className="border-foreground/15 mt-12 border-l-2 pl-6">
              <p className="text-foreground/85 text-pretty text-[17px] leading-[1.7]">
                Die meisten Über-uns-Seiten beschreiben, was eine Firma
                im Allgemeinen tut. Diese Seite beschreibt, was wir im
                Besonderen tun — diesen Monat, diese Woche. Sie ist
                eine Momentaufnahme, keine Broschüre, und sie veraltet
                mit Absicht: wenn hier etwas von vor drei Monaten
                steht, dürfen Sie uns das vorhalten.
              </p>
            </div>
          </div>
        </section>

        {/* Werkbank — laufende Arbeit aus den Atelier-Notizen */}
        <section className="border-border/40 border-b">
          <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-24">
            <p className="text-muted-foreground inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em]">
              <span
                aria-hidden="true"
                className="bg-gold inline-block h-px w-10"
              />
              Auf der Werkbank
            </p>
            <h2 className="serif text-foreground mt-6 text-balance text-3xl font-normal leading-[1.1] tracking-[-0.02em] sm:text-4xl">
              Woran wir gerade bauen,{" "}
              <span className="serif-italic text-muted-foreground">
                anonymisiert.
              </span>
            </h2>
            <ol className="divide-border/40 mt-10 divide-y">
              {ATELIER_NOTES.map((note) => (
                <li
                  key={note.when + note.text}
                  className="flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:gap-8 sm:py-7"
                >
                  <span className="text-muted-foreground/85 font-mono text-[11px] uppercase tracking-[0.15em] shrink-0 sm:w-[9rem]">
                    {note.when}
                  </span>
                  <span className="text-foreground/85 text-pretty text-[16px] leading-[1.65]">
                    {note.text}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Kapazität + Sprechstunde als Zwillings-Karten */}
        <section className="border-border/40 border-b">
          <div className="mx-auto grid w-full max-w-3xl gap-5 px-6 py-16 sm:grid-cols-2 sm:py-20">
            <div className="border-border/60 bg-card/60 ring-foreground/5 rounded-2xl border p-6 ring-1 sm:p-7">
              <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.22em]">
                Bauplätze
              </p>
              <p className="serif text-foreground mt-3 text-balance text-2xl leading-snug tracking-[-0.01em] sm:text-3xl">
                {slotsOpen
                  ? `${availableSlots} ${availableSlots === 1 ? "Platz" : "Plätze"} frei ${slotMonth}.`
                  : `Voll ${slotMonth} — Anfragen für ${nextMonth} willkommen.`}
              </p>
              <Link
                href="/anfrage"
                className="text-foreground mt-5 inline-flex items-center gap-2 text-[14px] font-medium underline-offset-[6px] hover:underline"
              >
                Anfrage starten
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="border-border/60 bg-card/60 ring-foreground/5 rounded-2xl border p-6 ring-1 sm:p-7">
              <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.22em]">
                Nächste Sprechstunde
              </p>
              <p className="serif text-foreground mt-3 text-balance text-2xl leading-snug tracking-[-0.01em] sm:text-3xl">
                {sprechstunde.longLabel},
                <br />
                {SPRECHSTUNDE_BEGINN_HHMM}–{SPRECHSTUNDE_ENDE_HHMM} Uhr.
              </p>
              <Link
                href="/sprechstunde"
                className="text-foreground mt-5 inline-flex items-center gap-2 text-[14px] font-medium underline-offset-[6px] hover:underline"
              >
                Wie das funktioniert
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Gerade — der persönlichere Teil */}
        <section className="bg-foreground text-background border-foreground/10 border-b">
          <div className="mx-auto w-full max-w-3xl px-6 py-24 sm:py-28">
            <p className="text-background/65 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em]">
              <span
                aria-hidden="true"
                className="bg-gold inline-block h-px w-10"
              />
              Abseits der Aufträge
            </p>
            <h2 className="serif mt-8 text-balance text-4xl font-normal leading-[1.05] tracking-[-0.02em] sm:text-5xl">
              Was uns{" "}
              <span className="serif-italic text-background/65">
                gerade beschäftigt.
              </span>
            </h2>
            <dl className="border-background/15 mt-12 divide-y divide-background/15 border-t border-b">
              {ATELIER_GERADE.map((item) => (
                <div
                  key={item.label}
                  className="grid gap-2 py-7 sm:grid-cols-[11rem_1fr] sm:gap-8 sm:py-8"
                >
                  <dt className="text-background/55 font-mono text-[11px] uppercase tracking-[0.18em]">
                    {item.label}
                  </dt>
                  <dd className="text-background/90 text-pretty text-[16px] leading-[1.65]">
                    {item.text}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* Zuletzt geschrieben */}
        <section className="border-border/40 border-b">
          <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-24">
            <p className="text-muted-foreground inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.3em]">
              <span
                aria-hidden="true"
                className="bg-gold inline-block h-px w-10"
              />
              Zuletzt geschrieben
            </p>
            <ol className="divide-border/40 mt-8 divide-y">
              {latestPosts.map((post) => (
                <li key={post.slug}>
                  <Link
                    href={`/journal/${post.slug}`}
                    className="group flex flex-col gap-1.5 py-6 sm:py-7"
                  >
                    <span className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.22em]">
                      {formatDate(post.publishedAt)} · {post.readingMinutes} Min
                    </span>
                    <span className="serif text-foreground text-balance text-2xl leading-snug tracking-[-0.015em] group-hover:underline group-hover:underline-offset-4 sm:text-3xl">
                      {post.title}
                    </span>
                    <span className="text-muted-foreground text-pretty text-[14.5px] leading-relaxed">
                      {post.dek}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
            <Link
              href="/journal"
              className="text-foreground mt-6 inline-flex items-center gap-2 text-[14.5px] font-medium underline-offset-[6px] hover:underline"
            >
              Alle Essays im Journal
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Schluss */}
        <section>
          <div className="mx-auto w-full max-w-3xl px-6 py-20 sm:py-24">
            <p className="serif text-foreground text-balance text-3xl font-normal leading-[1.25] tracking-[-0.01em] sm:text-4xl">
              Diese Seite folgt einer alten Netz-Sitte:{" "}
              <span className="serif-italic text-muted-foreground">
                der Now-Page.
              </span>
            </p>
            <p className="text-muted-foreground mt-6 max-w-2xl text-pretty text-[15.5px] leading-relaxed">
              Die Idee stammt aus dem Indie-Web — eine Seite, die nicht
              beschreibt, wer man ist, sondern was man gerade tut. Wir
              finden, sie passt zu einer Werkstatt besser als jede
              Über-uns-Floskel.
            </p>
          </div>
        </section>
      </main>
      <MarketingFooter />
    </div>
  );
}
