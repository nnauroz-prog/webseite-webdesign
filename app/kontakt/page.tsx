import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

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
          <div className="mx-auto w-full max-w-7xl px-6 pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-32 lg:pb-36">
            <div className="max-w-3xl">
              <h1 className="text-5xl font-semibold leading-[1.0] tracking-[-0.04em] text-balance sm:text-6xl lg:text-[5.5rem]">
                Schreiben Sie
                <br />
                <span className="serif-italic text-muted-foreground font-normal">
                  mir.
                </span>
              </h1>
              <p className="text-muted-foreground mt-8 max-w-xl text-pretty text-lg leading-relaxed sm:text-xl">
                Am schnellsten erreichen Sie mich über das Anfrage-Formular
                oder WhatsApp. Ich melde mich persönlich innerhalb von 24
                Stunden — keine Hotline, kein Ticket.
              </p>
            </div>
          </div>
        </section>

        <section className="border-border/40 border-b">
          <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
            <ol className="divide-border/60 divide-y">
              <ContactRow
                index="01"
                title="Anfrage-Formular"
                body="Ein paar kurze Schritte: Sie geben mir die wichtigsten Eckdaten, ich melde mich persönlich mit einem klaren Vorschlag — meist noch am selben Tag."
                action={
                  <Link
                    href="/anfrage"
                    className="bg-foreground text-background hover:bg-foreground/90 group inline-flex h-12 items-center rounded-full px-7 text-[15px] font-medium tracking-tight transition-all"
                  >
                    Anfrage starten
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                }
              />
              <ContactRow
                index="02"
                title="WhatsApp"
                body="Eine schnelle Rückfrage oder einfach kurz Hallo sagen — ich antworte oft noch am selben Tag."
                action={
                  whatsappHref ? (
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="border-foreground text-foreground hover:bg-foreground hover:text-background group inline-flex h-12 items-center rounded-full border px-7 text-[15px] font-medium tracking-tight transition-colors"
                    >
                      WhatsApp schreiben
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  ) : (
                    <p className="text-muted-foreground text-sm">
                      WhatsApp-Nummer wird gerade konfiguriert.
                    </p>
                  )
                }
              />
              <ContactRow
                index="03"
                title="E-Mail"
                body={
                  <>
                    Klassisch per E-Mail an{" "}
                    <a
                      href="mailto:hallo@sitalo.de"
                      className="text-foreground underline underline-offset-4"
                    >
                      hallo@sitalo.de
                    </a>
                    . Für eine vollständige Projekt-Aufnahme ist das
                    Formular praktischer — dann habe ich alles auf einen
                    Blick.
                  </>
                }
              />
            </ol>

            <div className="text-muted-foreground border-border/60 mt-16 flex items-center gap-3 border-t pt-8 text-sm">
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

function ContactRow({
  index,
  title,
  body,
  action,
}: {
  index: string;
  title: string;
  body: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <li className="grid gap-8 py-12 sm:py-16 lg:grid-cols-[0.5fr_1.5fr_auto] lg:items-center lg:gap-16">
      <span className="text-muted-foreground/70 font-mono text-xs tracking-[0.25em]">
        {index}
      </span>
      <div>
        <h2 className="text-3xl font-semibold leading-[1.05] tracking-[-0.025em] sm:text-4xl">
          {title}
        </h2>
        <p className="text-foreground/75 mt-4 max-w-xl text-pretty text-lg leading-relaxed">
          {body}
        </p>
      </div>
      {action ? <div className="lg:justify-self-end">{action}</div> : <div />}
    </li>
  );
}
