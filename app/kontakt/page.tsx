import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export const metadata: Metadata = {
  title: "Kontakt — schreiben Sie mir direkt | Sitalo Hamburg",
  description:
    "Schreiben Sie mir kurz — über Formular, WhatsApp oder E-Mail. Ich melde mich persönlich, meist noch am selben Tag.",
  alternates: { canonical: "/kontakt" },
};

function buildWhatsappHref(): string | null {
  const raw = process.env.NEXT_PUBLIC_SITALO_WHATSAPP_NUMBER?.trim();
  if (!raw) return null;
  const digits = raw.replace(/[^\d]/g, "");
  if (digits.length < 6) return null;
  const message =
    "Hallo Sitalo, ich habe Ihre Seite gesehen und überlege, eine eigene Website für mein Unternehmen machen zu lassen. Können wir kurz dazu schreiben?";
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export default function KontaktPage() {
  const whatsappHref = buildWhatsappHref();

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />

      <main className="bg-secondary/40 flex-1">
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

          {/* Three contact methods as compact inline blocks */}
          <div className="border-border/60 mt-20 grid divide-y border-t border-b sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <ContactMethod
              label="Per Formular"
              detail="Schritt-für-Schritt"
              href="/anfrage"
              cta="Anfrage starten"
            />
            <ContactMethod
              label="Per E-Mail"
              detail="info@sitalo.de"
              href="mailto:info@sitalo.de"
              cta="Schreiben"
            />
            {whatsappHref ? (
              <ContactMethod
                label="Per WhatsApp"
                detail="Schnelle Rückfragen"
                href={whatsappHref}
                cta="Öffnen"
                external
              />
            ) : (
              <ContactMethod
                label="Per WhatsApp"
                detail="In Kürze verfügbar"
                href="/anfrage"
                cta="Formular nutzen"
              />
            )}
          </div>

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
                  Meist deutlich schneller. Persönlich, von mir, ohne
                  Ticket-System.
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

            {/* Stilisierte Karten-Andeutung, keine externe Google-Embed.
                DSGVO-freundlich, schnell, kein Cookie-Banner nötig. */}
            <div
              aria-hidden="true"
              className="bg-accent/30 border-border/60 relative aspect-square w-full overflow-hidden rounded-2xl border"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-muted-foreground/70 font-mono text-xs tracking-[0.25em] uppercase">
                    53.5511° N
                  </p>
                  <p className="serif text-foreground mt-4 text-5xl font-normal tracking-[-0.02em] sm:text-6xl">
                    Hamburg
                  </p>
                  <p className="text-muted-foreground/70 font-mono mt-4 text-xs tracking-[0.25em] uppercase">
                    9.9937° E
                  </p>
                </div>
              </div>
              {/* Dezente Linien als Karten-Andeutung */}
              <svg
                aria-hidden="true"
                viewBox="0 0 400 400"
                className="text-foreground/5 absolute inset-0 h-full w-full"
                fill="none"
                stroke="currentColor"
                strokeWidth={1}
              >
                <line x1="0" y1="100" x2="400" y2="100" />
                <line x1="0" y1="200" x2="400" y2="200" />
                <line x1="0" y1="300" x2="400" y2="300" />
                <line x1="100" y1="0" x2="100" y2="400" />
                <line x1="200" y1="0" x2="200" y2="400" />
                <line x1="300" y1="0" x2="300" y2="400" />
                <circle
                  cx="200"
                  cy="200"
                  r="60"
                  className="text-foreground/10"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="3"
                  className="text-foreground/30"
                  fill="currentColor"
                />
              </svg>
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
}: {
  label: string;
  detail: string;
  href: string;
  cta: string;
  external?: boolean;
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
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {inner}
      </a>
    );
  }
  return <Link href={href}>{inner}</Link>;
}
