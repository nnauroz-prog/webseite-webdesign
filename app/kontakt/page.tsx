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
    "Hallo Nadim, ich habe Ihre Seite gesehen und überlege, eine eigene Website für mein Unternehmen machen zu lassen. Können wir kurz dazu schreiben?";
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
            Hallo,{" "}
            <span className="serif-italic text-muted-foreground">
              ich bin Nadim.
            </span>{" "}
            Schreiben Sie mir kurz, was Sie vorhaben —{" "}
            <span className="serif-italic text-muted-foreground">
              ich melde mich persönlich.
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

          <div className="mt-16 flex flex-col gap-6 sm:mt-20 sm:flex-row sm:items-end sm:justify-between">
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

            <p className="serif-italic text-foreground/80 text-2xl">
              — Nadim Nauroz
            </p>
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
