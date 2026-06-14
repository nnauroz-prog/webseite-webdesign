import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Eye, FileText, Mail } from "lucide-react";

import { AuditForm } from "@/components/marketing/audit-form";
import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export const metadata: Metadata = {
  title: "Kostenloser Website-Audit",
  description:
    "Drei bis fünf konkrete Punkte zu Ihrer aktuellen Seite, persönlich aus Hamburg. Keine generische SEO-Score-Karte, kein Vertriebs-Anruf danach.",
  alternates: { canonical: "/audit" },
};

/**
 * `/audit` — Lead-Magnet-Seite.
 *
 * Versprechen: ein ehrlicher Mini-Audit per Mail innerhalb 48 h.
 * Keine generischen Lighthouse-Reports, keine Score-Karten —
 * stattdessen 3–5 konkrete Punkte aus echter Auge-drauf-Sicht.
 *
 * Bewusst eigenständig (nicht in /anfrage gewurschtelt), weil
 * das Versprechen ein anderes ist: hier wird noch keine Anfrage
 * gestellt, hier wird zuerst Vertrauen aufgebaut.
 */
export default function AuditPage() {
  const formspreeId = process.env.FORMSPREE_FORM_ID?.trim() || undefined;

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Mini-Audit" />

      <main id="main" tabIndex={-1} className="flex-1">
        <section className="border-border/40 relative overflow-hidden border-b">
          <div
            aria-hidden="true"
            className="bg-gold/10 pointer-events-none absolute -top-32 left-1/2 -z-10 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full blur-[60px] sm:blur-[120px]"
          />
          <div className="mx-auto w-full max-w-4xl px-6 py-16 sm:py-24 lg:py-28">
            <div className="text-center">
              <p className="text-muted-foreground inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em]">
                <span
                  aria-hidden="true"
                  className="bg-gold gold-pulse inline-block h-1 w-6"
                />
                Kostenlos · Persönlich · 48 h
              </p>
              <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.0] tracking-[-0.04em] sm:text-6xl lg:text-7xl">
                Wir gucken uns Ihre
                <br />
                <span className="serif-italic text-muted-foreground font-normal">
                  Seite an. Ehrlich.
                </span>
              </h1>
              <p className="text-muted-foreground mx-auto mt-7 max-w-xl text-pretty text-base leading-relaxed sm:text-lg">
                Drei bis fünf Punkte aus Hand-drauf-Sicht: was läuft
                gut, was würden wir an Ihrer Stelle als Erstes anfassen.
                Keine Lighthouse-Score-Karte, kein Vertriebs-Anruf
                danach. Ein Mensch guckt drauf, ein Mensch schreibt
                Ihnen.
              </p>
            </div>

            <div className="mx-auto mt-12 max-w-2xl">
              <AuditForm formspreeId={formspreeId} />
            </div>
          </div>
        </section>

        <section className="border-border/40 border-t">
          <div className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-24">
            <div className="grid items-start gap-10 lg:grid-cols-[1fr_1.6fr] lg:gap-16">
              <div>
                <p className="text-muted-foreground inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] sm:text-[11px]">
                  <span
                    aria-hidden="true"
                    className="bg-gold gold-pulse inline-block h-1 w-6"
                  />
                  Was Sie bekommen
                </p>
                <h2 className="mt-6 text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-4xl lg:text-5xl">
                  Eine E-Mail.
                  <br />
                  <span className="serif-italic text-muted-foreground font-normal">
                    Mehr nicht.
                  </span>
                </h2>
                <p className="text-foreground/75 mt-6 max-w-md text-pretty text-[15.5px] leading-relaxed">
                  Kein PDF-Report, kein automatisches Tool. Wir öffnen
                  Ihre Seite, gucken sie uns am Schreibtisch in
                  Hamburg an und schreiben Ihnen, was uns aufgefallen
                  ist — in einer Sprache, die nicht nach Marketing
                  klingt.
                </p>
              </div>

              <ul className="space-y-5">
                <AuditItem
                  icon={Eye}
                  title="Erster Eindruck auf dem Smartphone"
                  body="Was sieht ein Kunde in den ersten drei Sekunden? Ist die Telefonnummer erreichbar? Funktioniert der Speisekarten-Link? Sind die Öffnungszeiten zu finden?"
                />
                <AuditItem
                  icon={FileText}
                  title="Konkretes vor Generischem"
                  body="Wir nennen die Stelle, die uns aufgefallen ist — nicht abstraktes Meta-Tag-Geblubber. Sondern: auf der Startseite steht ein Willkommen, das Ihre Kunden über Sie nichts erfahren lässt — und genau das fehlt da."
                />
                <AuditItem
                  icon={Mail}
                  title="Persönlich, nicht automatisch"
                  body="Sie bekommen die Mail direkt aus dem Atelier — von einem Menschen geschrieben, nicht von einem Tool. Wenn Sie zurück schreiben, antwortet auch ein Mensch. Kein Funnel, kein Drip, kein Auto-Responder."
                />
              </ul>
            </div>
          </div>
        </section>

        <section className="border-border/40 border-t">
          <div className="mx-auto w-full max-w-3xl px-6 py-16 text-center sm:py-20">
            <p className="text-muted-foreground inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] sm:text-[11px]">
              <span
                aria-hidden="true"
                className="bg-gold gold-pulse inline-block h-1 w-6"
              />
              Klare Ansage
            </p>
            <p className="serif text-foreground mt-6 text-balance text-2xl leading-snug sm:text-3xl">
              Es kommt kein Vertriebs-Anruf danach.{" "}
              <span className="serif-italic text-muted-foreground">
                Wenn Sie Lust haben, melden Sie sich. Wenn nicht, auch gut.
              </span>
            </p>
            <p className="text-muted-foreground mt-6 text-[14.5px] leading-relaxed">
              Wir machen das, weil wir gut darin sind, kurze ehrliche
              Audits zu schreiben — und weil sich daraus immer wieder
              schöne Projekte ergeben. Ihre Zeit nehmen wir nicht in
              Anspruch, wenn Sie sie nicht hergeben.
            </p>
            <Link
              href="/anfrage"
              className="text-foreground mt-8 inline-flex items-center gap-2 text-[14.5px] font-medium underline-offset-[6px] hover:underline"
            >
              Lieber direkt anfragen
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}

function AuditItem({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <li className="border-border/40 flex items-start gap-4 border-b pb-5 last:border-b-0">
      <span className="border-border/60 text-foreground/70 mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border">
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
      <div>
        <p className="text-foreground text-lg font-medium tracking-[-0.01em]">
          {title}
        </p>
        <p className="text-muted-foreground mt-1.5 text-[14.5px] leading-relaxed">
          {body}
        </p>
      </div>
    </li>
  );
}
