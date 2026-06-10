import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { HamburgMap } from "@/components/marketing/hamburg-map";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export const metadata: Metadata = {
  title: "Kontakt — schreiben Sie uns direkt",
  description:
    "Schreiben Sie uns über Formular oder E-Mail. Wir melden uns persönlich, meist noch am selben Tag.",
  alternates: { canonical: "/kontakt" },
};

export default function KontaktPage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Kontakt" />

      <main id="main" className="bg-secondary/40 flex-1">
        <section className="mx-auto w-full max-w-5xl px-6 py-24 sm:py-32 lg:py-40">
          {/* Editorial letter-style layout */}
          <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.3em]">
            Kontakt · Aus Hamburg
          </p>

          <p className="serif mt-16 text-balance text-4xl font-normal leading-[1.2] tracking-[-0.02em] sm:text-5xl lg:text-6xl">
            Schreiben Sie uns kurz,{" "}
            <span className="serif-italic text-muted-foreground">
              was Sie vorhaben.
            </span>{" "}
            Wir melden uns persönlich —{" "}
            <span className="serif-italic text-muted-foreground">
              meist noch am selben Tag.
            </span>
          </p>

          {/* Vier Kontaktwege — Formular, Telefon, E-Mail, vCard.
              Nummer und E-Mail bewusst hinter Buttons versteckt;
              der CTA löst den Anruf bzw. die Mail aus, ohne den
              Wert vorher im Klartext anzuzeigen. */}
          <div className="border-border/60 mt-20 grid divide-y border-t border-b sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            <ContactMethod
              label="Per Formular"
              detail="Schritt-für-Schritt"
              href="/anfrage"
              cta="Anfrage starten"
            />
            <ContactMethod
              label="Per Telefon"
              detail="Direkt zum Atelier"
              href="tel:+4915224437370"
              cta="Anrufen"
              external
            />
            <ContactMethod
              label="Per E-Mail"
              detail="Persönlich, < 24 h"
              href="mailto:info@sitalo.de"
              cta="Schreiben"
              external
            />
            <ContactMethod
              label="Als Visitenkarte"
              detail="Direkt im Telefonbuch"
              href="/sitalo-kontakt.vcf"
              cta="Speichern"
              download
            />
          </div>

          {/* Termin-Hinweis — der fünfte Weg, bewusst nicht als
              fünfte Grid-Zelle (würde das Vier-Wege-Raster brechen),
              sondern als ruhige Zeile darunter. */}
          <p className="text-muted-foreground mt-6 text-[14px] leading-relaxed">
            Oder Sie überspringen das Hin-und-Her:{" "}
            <Link
              href="/termin"
              className="text-foreground underline decoration-foreground/30 underline-offset-4 hover:decoration-foreground"
            >
              30-Minuten-Termin direkt buchen
            </Link>{" "}
            — Tag und Uhrzeit selbst wählen, Bestätigung in 15 Minuten.
          </p>

          <div className="mt-16 grid gap-12 sm:mt-20 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
            <div className="space-y-12">
              <div>
                <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.3em]">
                  Antwortzeit
                </p>
                <p className="serif text-foreground mt-3 text-2xl tracking-[-0.01em] sm:text-3xl">
                  Innerhalb von{" "}
                  <span className="serif-italic">24 Stunden.</span>
                </p>
                <p className="text-muted-foreground mt-2 text-sm">
                  Meist deutlich schneller. Persönlich, von uns, ohne
                  Ticket-System.
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.3em]">
                  Sprechzeiten
                </p>
                <p className="serif text-foreground mt-3 text-2xl tracking-[-0.01em] sm:text-3xl">
                  <span className="serif-italic">Jederzeit.</span>
                </p>
                <p className="text-muted-foreground mt-2 text-sm">
                  Keine festen Bürozeiten — wir antworten, wenn wir
                  können, was meistens schnell ist. Treffen vor Ort
                  oder per Video gerne nach kurzer Absprache.
                </p>
              </div>
              <div>
                <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.3em]">
                  Standort
                </p>
                <p className="serif text-foreground mt-3 text-2xl tracking-[-0.01em] sm:text-3xl">
                  Aus{" "}
                  <span className="serif-italic">Hamburg.</span>{" "}
                  Deutschlandweit.
                </p>
                <p className="text-muted-foreground mt-2 text-sm">
                  Treffen vor Ort auf Wunsch — Café, Ihr Büro oder
                  meins. Sonst läuft alles per Telefon, Video und
                  Mail. Funktioniert genauso gut.
                </p>
              </div>
              <p className="serif-italic text-foreground/80 text-2xl">
                — Sitalo, Hamburg
              </p>
            </div>

            {/* Drei Hamburg-Aufnahmen übereinander — Speicherstadt
                (Identität), Eimsbüttel-Café (Alltag), Schreibtisch
                mit Drucken (Atelier). Statisch, keine externen
                Embeds. */}
            <div className="space-y-3 sm:space-y-4">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-black/5">
                <Image
                  src="/images/hamburg-speicherstadt.webp"
                  alt="Hamburg Speicherstadt zur goldenen Stunde — historische Backsteinspeicher entlang der Kanäle."
                  fill
                  sizes="(min-width: 1024px) 500px, 100vw"
                  className="object-cover"
                />
                <div
                  aria-hidden="true"
                  className="from-foreground/30 absolute inset-0 bg-gradient-to-t to-transparent"
                />
                <div className="absolute bottom-4 left-5 right-5 text-background">
                  <p className="font-mono text-[10px] tracking-[0.25em] uppercase opacity-80">
                    53.5511° N · 9.9937° E
                  </p>
                  <p className="serif mt-1 text-2xl font-normal tracking-[-0.01em]">
                    Hamburg
                  </p>
                </div>
              </div>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-black/5">
                <Image
                  src="/images/cafe-eimsbuettel.webp"
                  alt="Ruhige Straße in Hamburg-Eimsbüttel am Morgen — Café-Terrasse, Altbau-Fassaden, weicher Nebel."
                  fill
                  sizes="(min-width: 1024px) 500px, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl ring-1 ring-black/5">
                <Image
                  src="/images/workspace-prints.webp"
                  alt="Schreibtisch im Sitalo-Atelier mit gerahmten Design-Drucken — Hamburger Tageslicht, ruhige Arbeitsatmosphäre."
                  fill
                  sizes="(min-width: 1024px) 500px, 100vw"
                  className="object-cover"
                />
                <div
                  aria-hidden="true"
                  className="from-foreground/30 absolute inset-0 bg-gradient-to-t to-transparent"
                />
                <div className="absolute bottom-4 left-5 right-5 text-background">
                  <p className="serif-italic text-base sm:text-lg">
                    — Aus dem Atelier
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Hamburg-Karte — die acht Stadtteile, in denen wir am
              meisten unterwegs sind, klickbar. Verlängert das
              „Treffen vor Ort"-Versprechen visuell. */}
          <div className="border-border/60 mt-20 border-t pt-16 sm:mt-24 sm:pt-20">
            <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.3em]">
              Wo wir unterwegs sind
            </p>
            <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
              <div>
                <p className="serif text-foreground text-balance text-3xl font-normal leading-[1.15] tracking-[-0.02em] sm:text-4xl">
                  Acht Stadtteile,{" "}
                  <span className="serif-italic text-muted-foreground">
                    in denen wir regelmäßig sitzen.
                  </span>
                </p>
                <p className="text-muted-foreground mt-5 max-w-md text-pretty text-[15px] leading-relaxed">
                  Jeder Pin führt zur Stadtteil-Seite — mit den
                  Branchen, die dort am häufigsten zu uns kommen, und
                  den Suchbegriffen, für die wir dort bauen.
                </p>
              </div>
              <HamburgMap />
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}

function ContactMethod({
  label,
  detail,
  href,
  cta,
  external,
  download,
}: {
  label: string;
  detail: string;
  href: string;
  cta: string;
  external?: boolean;
  /** Wenn true: Browser bietet das Ziel als Download an (.vcf etc.). */
  download?: boolean;
}) {
  const inner = (
    <div className="group flex h-full flex-col justify-between p-8 sm:p-10">
      <div>
        <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.25em]">
          {label}
        </p>
        <p className="text-foreground mt-4 text-2xl font-medium tracking-[-0.015em] sm:text-3xl">
          {detail}
        </p>
      </div>
      <div className="text-foreground mt-10 inline-flex items-center gap-2 text-[15px] font-medium underline-offset-4 group-hover:underline">
        {cta}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </div>
    </div>
  );
  if (download) {
    return (
      <a href={href} download="Sitalo-Webdesign.vcf">
        {inner}
      </a>
    );
  }
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return <Link href={href}>{inner}</Link>;
}
