import Image from "next/image";
import { FileText, ImageIcon, Type } from "lucide-react";

/**
 * „Sie schicken drei Sachen" — Bento-Variante. Vorher Editorial-
 * Split (Liste links, Foto rechts). Jetzt: zentrierter Header,
 * darunter ein Bento-Spread aus drei Input-Tiles und einer großen
 * Output-Foto-Tile.
 */

const ITEMS: {
  icon: typeof FileText;
  label: string;
  detail: string;
}[] = [
  {
    icon: FileText,
    label: "Ihr Logo",
    detail:
      "PDF, PNG, JPG — egal. Sogar ein Schnappschuss vom alten Briefpapier reicht. Wenn keins existiert, schlagen wir Ihnen eins vor.",
  },
  {
    icon: ImageIcon,
    label: "Ein paar Bilder",
    detail:
      "Fünf bis zehn reichen. Vom Geschäft, vom Team, vom Alltag. Handy-Fotos sind besser als Stock — sonst empfehlen wir einen Hamburger Fotografen für 200–400 €.",
  },
  {
    icon: Type,
    label: "Ein paar Sätze",
    detail:
      "Wer Sie sind, was Sie anbieten, Öffnungszeiten, Kontakt. Stichpunkte reichen — wir formulieren daraus saubere Web-Texte.",
  },
];

export function DreiSachen() {
  return (
    <section className="border-border/40 relative overflow-hidden border-t">
      {/* Atmosphärische Halos */}
      <div
        aria-hidden="true"
        className="glow-orb -top-32 -left-32 h-[32rem] w-[32rem] -z-10"
        style={{ background: "oklch(0.85 0.18 85 / 0.08)" }}
      />
      <div
        aria-hidden="true"
        className="glow-orb bottom-0 -right-32 h-[28rem] w-[28rem] -z-10"
        style={{ background: "oklch(0.78 0.14 215 / 0.06)" }}
      />

      <div className="mx-auto w-full max-w-6xl px-6 py-24 sm:py-32">
        {/* Header zentriert */}
        <div className="mx-auto max-w-2xl text-center">
          <span className="status-badge">
            <span className="status-badge-dot" aria-hidden="true" />
            <span>Drei Sachen reichen</span>
          </span>
          <h2 className="mt-7 text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
            Sie schicken drei Sachen.{" "}
            <span className="gradient-gold">Den Rest bauen wir.</span>
          </h2>
          <p className="text-muted-foreground mx-auto mt-6 max-w-lg text-pretty text-base leading-relaxed sm:text-lg">
            Kein Brand-Workshop, kein Discovery-Sprint, kein PDF mit
            87 Seiten Fragen.
          </p>
        </div>

        {/* Bento-Spread: 3 Input-Tiles oben, große Foto-Tile darunter */}
        <div className="mt-14 grid grid-cols-12 gap-3 sm:mt-16 sm:gap-4">
          {ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <article
                key={item.label}
                className="bento group col-span-12 p-6 sm:p-7 sm:col-span-6 lg:col-span-4"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    0{i + 1} — Input
                  </p>
                  <span className="bg-foreground/[0.04] text-foreground/85 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors group-hover:bg-gold group-hover:text-background">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                </div>
                <h3 className="text-foreground mt-6 text-xl font-semibold tracking-[-0.015em] sm:text-[1.4rem]">
                  {item.label}
                </h3>
                <p className="text-muted-foreground mt-3 text-pretty text-[14.5px] leading-relaxed">
                  {item.detail}
                </p>
              </article>
            );
          })}

          {/* Output-Foto-Tile mit Caption */}
          <article className="bento relative col-span-12 overflow-hidden">
            <div className="relative aspect-[16/9] w-full sm:aspect-[21/9]">
              <Image
                src="/images/sitalo-praxis-laptop.webp"
                alt="Fertige Sitalo-Website auf einem Laptop in einem warmen Atelier-Licht."
                fill
                sizes="(min-width: 1024px) 1100px, 100vw"
                className="object-cover"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-background/70 via-background/20 to-transparent"
              />
              <div className="absolute right-6 bottom-6 left-6 sm:right-8 sm:bottom-8 sm:left-8 lg:right-10 lg:bottom-10 lg:left-10">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-foreground/55">
                  04 — Output
                </p>
                <p className="text-foreground mt-3 text-balance text-2xl font-semibold leading-[1.2] tracking-[-0.02em] sm:text-3xl lg:text-4xl">
                  Übermorgen online —{" "}
                  <span className="gradient-gold">
                    fertig getestet auf echten Geräten.
                  </span>
                </p>
                <p className="text-foreground/70 mt-3 max-w-md text-pretty text-[14px] leading-relaxed sm:text-[15px]">
                  Mehr ist nicht nötig. Wir formulieren um, beschneiden
                  Bilder, strukturieren — Sie konzentrieren sich auf
                  Ihren Betrieb.
                </p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
