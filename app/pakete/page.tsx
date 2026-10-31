import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  DatabaseBackup,
  Lock,
  Mail,
  PencilLine,
  RefreshCw,
  Server,
} from "lucide-react";

import { AvailabilitySlot } from "@/components/marketing/availability-slot";
import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import { EditorialEyebrow } from "@/components/marketing/editorial-eyebrow";
import { PAKETE } from "@/lib/pakete-data";

export const metadata: Metadata = {
  title: "Pakete & Preise — Websites ab 499 €",
  description:
    "Vier Stufen, Ihre Seite zu bekommen. Einmalige Erstellung plus fairer Monatsbeitrag — keine versteckten Kosten.",
  alternates: { canonical: "/pakete" },
};

export default function PaketePage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Pakete" />
      <main id="main" tabIndex={-1} className="flex-1">
        <Hero />
        <Packages />
        <PflegeHosting />
        <FinalCta />
      </main>
      <MarketingFooter />
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
      <div className="mx-auto w-full max-w-6xl px-5 pt-14 pb-10 sm:px-6 sm:pt-20 sm:pb-12">
        <EditorialEyebrow>Pakete & Preise</EditorialEyebrow>
        <h1 className="mt-5 text-balance text-5xl font-semibold leading-[1.0] tracking-[-0.04em] sm:text-7xl">
          Klare Preise.{" "}
          <span className="serif-italic text-muted-foreground font-normal">Festpreis vorab.</span>
        </h1>
        <ul className="text-foreground/80 mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[14px]">
          {["Live in 1–2 Werktagen", "Hosting in der EU", "Nach 6 Monaten monatlich kündbar"].map((t) => (
            <li key={t} className="inline-flex items-center gap-2">
              <Check className="text-gold h-4 w-4" aria-hidden="true" />
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-5">
          <AvailabilitySlot variant="inline" />
        </div>
      </div>
    </section>
  );
}

/**
 * Vier Pakete als Karten nebeneinander. Je Karte: Preis, ein Satz
 * „für wen", die ersten fünf Leistungen. Alles Weitere (Beispiele,
 * Grenzen, FAQ) steht auf /pakete/[slug].
 */
function Packages() {
  return (
    <section className="border-border/40 border-t">
      <div className="mx-auto grid w-full max-w-6xl gap-4 px-5 py-12 sm:px-6 sm:py-16 md:grid-cols-2 lg:grid-cols-4">
        {PAKETE.map((p) => {
          const dark = p.highlight;
          return (
            <article
              key={p.slug}
              id={p.slug}
              className={
                dark
                  ? "bg-foreground text-background relative flex scroll-mt-24 flex-col overflow-hidden rounded-3xl p-6 shadow-[0_30px_60px_-30px_rgb(15_25_50/0.5)] lg:-my-3 lg:py-9"
                  : "border-border/70 bg-card relative flex scroll-mt-24 flex-col rounded-3xl border p-6"
              }
            >
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold tracking-tight">{p.name}</h2>
                {p.badge ? (
                  <span
                    className={
                      dark
                        ? "bg-gold text-foreground shrink-0 whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
                        : "border-border text-muted-foreground shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em]"
                    }
                  >
                    {p.badge}
                  </span>
                ) : null}
              </div>
              <p className="serif mt-5 text-5xl lining-nums leading-none tracking-[-0.03em]">{p.setup}</p>
              <p className={dark ? "text-background/60 mt-2 text-[13px]" : "text-muted-foreground mt-2 text-[13px]"}>
                einmalig · + {p.monthly}
              </p>
              <p className={dark ? "text-background/85 mt-5 text-[14px] leading-relaxed" : "text-foreground/80 mt-5 text-[14px] leading-relaxed"}>
                {firstSentence(p.whoFor)}
              </p>
              <ul className={`mt-5 space-y-2 border-t pt-5 text-[14px] ${dark ? "border-background/15" : "border-border/60"}`}>
                {p.contents.slice(0, 5).map((c) => (
                  <li key={c} className="flex gap-2.5">
                    <Check className="text-gold mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className={dark ? "text-background/90" : "text-foreground/85"}>{c}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-col gap-2 pt-7">
                <Link
                  href={`/anfrage?paket=${p.slug}`}
                  className={
                    dark
                      ? "bg-background text-foreground hover:bg-background/90 group inline-flex h-11 items-center justify-center rounded-full px-5 text-[14px] font-medium tracking-tight"
                      : "bg-foreground text-background hover:bg-foreground/90 group inline-flex h-11 items-center justify-center rounded-full px-5 text-[14px] font-medium tracking-tight"
                  }
                >
                  {p.name} anfragen
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
                <Link
                  href={`/pakete/${p.slug}`}
                  className={
                    dark
                      ? "text-background/75 hover:text-background inline-flex h-9 items-center justify-center text-[13.5px] font-medium underline-offset-4 hover:underline"
                      : "text-foreground/75 hover:text-foreground inline-flex h-9 items-center justify-center text-[13.5px] font-medium underline-offset-4 hover:underline"
                  }
                >
                  Alle Details
                </Link>
              </div>
            </article>
          );
        })}
      </div>
      <p className="text-muted-foreground mx-auto w-full max-w-6xl px-5 pb-12 text-[13px] sm:px-6">
        Einstiegspreise zzgl. MwSt. Den verbindlichen Festpreis bekommen Sie nach Ihrer Anfrage.{" "}
        <Link href="/empfehlung" className="text-foreground underline underline-offset-4">
          Unsicher? Fünf Fragen, eine Empfehlung.
        </Link>
      </p>
    </section>
  );
}

function firstSentence(text: string) {
  const m = text.match(/^.+?[.!?](\s|$)/);
  return (m ? m[0] : text).trim();
}

/** Was im Monatsbeitrag steckt — sechs Punkte als Raster. */
const IM_MONATLICHEN = [
  { icon: Server, text: "Hosting in Deutschland, DSGVO-konform" },
  { icon: Lock, text: "SSL-Zertifikat, automatisch verlängert" },
  { icon: RefreshCw, text: "Sicherheits- und Performance-Updates" },
  { icon: DatabaseBackup, text: "Tägliche Backups, 30 Tage zurück" },
  { icon: PencilLine, text: "Kleine Änderungen, je nach Paket 1–3 pro Monat" },
  { icon: Mail, text: "Domain und E-Mail-Setup auf Wunsch" },
];

function PflegeHosting() {
  return (
    <section className="border-border/40 bg-secondary/30 border-t">
      <div className="mx-auto w-full max-w-6xl px-5 py-14 sm:px-6 sm:py-20">
        <h2 className="rise text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">Im Monatsbeitrag drin.</h2>
        <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
          {IM_MONATLICHEN.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-[15px]">
              <span className="bg-background border-border/70 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border">
                <Icon className="text-gold h-4 w-4" aria-hidden="true" />
              </span>
              {text}
            </li>
          ))}
        </ul>
        <p className="text-muted-foreground mt-8 text-[13.5px]">
          Größere Erweiterungen beziffern wir vorab. Mindestlaufzeit 6 Monate, danach monatlich kündbar.{" "}
          <Link href="/wartung" className="text-foreground underline underline-offset-4">
            Mehr zur Wartung
          </Link>
        </p>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="bg-foreground text-background relative overflow-hidden">
      <div aria-hidden="true" className="aurora aurora-dark pointer-events-none absolute inset-0">
        <span />
        <span />
        <span />
      </div>
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-5 py-16 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-20">
        <h2 className="serif text-balance text-3xl leading-tight sm:text-5xl">
          Welches passt?{" "}
          <span className="serif-italic text-background/70">Wir sagen es Ihnen ehrlich.</span>
        </h2>
        <Link
          href="/anfrage"
          className="bg-background text-foreground hover:bg-background/90 group inline-flex h-12 shrink-0 items-center rounded-full px-7 text-[15px] font-medium tracking-tight"
        >
          Website anfragen
          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
