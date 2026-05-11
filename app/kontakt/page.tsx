import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock, Mail, MessageCircle } from "lucide-react";

import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";

export const metadata: Metadata = {
  title: "Kontakt | Sitalo Webdesign",
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

      <main className="flex-1">
        <section className="border-border/40 border-b">
          <div className="mx-auto w-full max-w-4xl px-6 py-16 text-center sm:py-24">
            <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-[0.22em] sm:text-[11px]">
              Kontakt
            </p>
            <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.025em] sm:text-5xl">
              Schreiben Sie mir.
            </h1>
            <p className="text-muted-foreground mx-auto mt-5 max-w-2xl text-pretty text-lg leading-relaxed">
              Am schnellsten erreichen Sie mich über das Anfrage-Formular oder
              WhatsApp. Ich melde mich persönlich innerhalb von 24 Stunden —
              keine Hotline, kein Ticket.
            </p>
          </div>
        </section>

        <section className="border-border/40 border-b py-14 sm:py-20">
          <div className="mx-auto w-full max-w-4xl px-6">
            <ul className="grid gap-5 sm:grid-cols-2">
              <li className="border-border/60 bg-card rounded-3xl border p-7 shadow-sm">
                <span className="bg-primary/10 text-primary inline-flex h-11 w-11 items-center justify-center rounded-lg">
                  <ArrowRight className="h-5 w-5" />
                </span>
                <h2 className="mt-5 text-xl font-semibold tracking-tight">
                  Anfrage-Formular
                </h2>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  Ein paar kurze Schritte: Sie geben mir die wichtigsten
                  Eckdaten, ich melde mich mit einem klaren Vorschlag.
                </p>
                <Link
                  href="/anfrage"
                  className="bg-foreground text-background hover:bg-foreground/90 mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium shadow-sm transition-all hover:shadow"
                >
                  Anfrage starten
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </li>

              <li className="border-border/60 bg-card rounded-3xl border p-7 shadow-sm">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600">
                  <MessageCircle className="h-5 w-5" />
                </span>
                <h2 className="mt-5 text-xl font-semibold tracking-tight">
                  WhatsApp
                </h2>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  Eine schnelle Rückfrage oder einfach kurz Hallo sagen —
                  ich antworte oft noch am selben Tag.
                </p>
                {whatsappHref ? (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="border-border bg-background hover:bg-secondary mt-6 inline-flex h-11 items-center justify-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors"
                  >
                    WhatsApp schreiben
                    <ArrowRight className="h-4 w-4" />
                  </a>
                ) : (
                  <p className="text-muted-foreground mt-6 text-xs">
                    WhatsApp-Nummer wird gerade konfiguriert.
                  </p>
                )}
              </li>

              <li className="border-border/60 bg-card rounded-3xl border p-7 shadow-sm sm:col-span-2">
                <span className="bg-primary/10 text-primary inline-flex h-11 w-11 items-center justify-center rounded-lg">
                  <Mail className="h-5 w-5" />
                </span>
                <h2 className="mt-5 text-xl font-semibold tracking-tight">
                  E-Mail
                </h2>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  Klassisch per E-Mail an{" "}
                  <a
                    href="mailto:hallo@sitalo.de"
                    className="hover:text-foreground underline"
                  >
                    hallo@sitalo.de
                  </a>
                  . Ich antworte meist noch am selben Tag. Für eine
                  vollständige Projekt-Aufnahme ist das Formular trotzdem
                  praktischer — dann habe ich alles auf einen Blick.
                </p>
              </li>
            </ul>

            <div className="text-muted-foreground mt-10 flex items-center justify-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              Antwort innerhalb von 24 Stunden, persönlich.
            </div>
          </div>
        </section>
      </main>

      <MarketingFooter />
    </div>
  );
}
