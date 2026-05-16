import Image from "next/image";
import { FileText, ImageIcon, Type } from "lucide-react";

/**
 * "Sie schicken drei Sachen" — visualisiert das Kern-Versprechen,
 * das vorher nur als Halbsatz im Hero und PersonalNote vorkam.
 *
 * Editorial-Split-Layout: links die drei Input-Items als nummerierte
 * Liste mit Icon und konkreten Beispielen, rechts ein Workspace-Foto
 * als visueller Anker für „was Sie bekommen". Bewusst keine
 * austauschbaren Generic-Cards.
 *
 * Hamburg-Konkretheit: bei „Bilder" verweisen wir auf einen
 * Hamburger Fotografen mit echtem Preisrahmen, bei „Logo" auf
 * verschiedene Dateiformate, die wir akzeptieren.
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
      "Egal in welchem Format. PDF, PNG, JPG, sogar ein Schnappschuss vom alten Briefpapier. Wenn keins existiert, schlagen wir Ihnen eins vor.",
  },
  {
    icon: ImageIcon,
    label: "Ein paar Bilder",
    detail:
      "Fünf bis zehn reichen. Vom Geschäft, vom Team, von dem, was Sie tun. Handy-Fotos sind besser als Stock-Bilder. Wenn nichts vorhanden ist, empfehlen wir einen Hamburger Fotografen für 200–400 € pro Tag.",
  },
  {
    icon: Type,
    label: "Ein paar Sätze",
    detail:
      "Wer Sie sind, was Sie anbieten, Öffnungszeiten, Kontakt. Stichpunkte reichen — wir formulieren daraus saubere Web-Texte, Sie reviewen.",
  },
];

export function DreiSachen() {
  return (
    <section className="border-border/40 relative overflow-hidden border-t">
      <div
        aria-hidden="true"
        className="bg-gold/8 pointer-events-none absolute -top-32 -left-20 -z-10 h-[28rem] w-[28rem] rounded-full blur-[60px] sm:blur-[120px]"
      />
      <div className="mx-auto w-full max-w-7xl px-6 py-24 sm:py-32">
        <div className="max-w-3xl">
          <p className="text-muted-foreground inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em]">
            <span
              aria-hidden="true"
              className="bg-gold gold-pulse inline-block h-1 w-6"
            />
            Wie es konkret abläuft
          </p>
          <h2 className="mt-6 text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.035em] sm:text-5xl lg:text-6xl">
            Sie schicken drei Sachen.
            <br />
            <span className="serif-italic text-muted-foreground font-normal">
              Den Rest bauen wir.
            </span>
          </h2>
          <p className="text-muted-foreground mt-7 max-w-lg text-pretty text-base leading-relaxed sm:text-lg">
            Kein Brand-Workshop, kein Discovery-Sprint, kein PDF mit
            87 Seiten Fragen. Das hier reicht:
          </p>
        </div>

        <div className="mt-14 grid items-start gap-12 sm:mt-16 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          {/* Linke Spalte: drei nummerierte Items, editorial */}
          <ol className="divide-border/60 divide-y border-y">
            {ITEMS.map((item, i) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.label}
                  className="group grid gap-5 py-7 sm:grid-cols-[auto_1fr] sm:gap-7 sm:py-9"
                >
                  <div className="flex items-start gap-4">
                    <span className="serif text-ink-petrol/60 text-[3.5rem] font-normal leading-none tracking-[-0.04em] sm:text-[4.25rem]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="bg-foreground/[0.04] text-foreground/85 mt-2 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors group-hover:bg-foreground group-hover:text-background">
                      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    </span>
                  </div>
                  <div>
                    <h3 className="text-foreground text-2xl font-medium leading-snug tracking-[-0.015em] sm:text-[1.6rem]">
                      {item.label}
                    </h3>
                    <p className="text-muted-foreground mt-3 max-w-lg text-pretty text-[15px] leading-relaxed sm:text-base">
                      {item.detail}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Rechte Spalte: Output-Foto mit Caption */}
          <div className="relative lg:sticky lg:top-24">
            <p className="text-muted-foreground inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.25em]">
              <span
                aria-hidden="true"
                className="bg-ink-olive inline-block h-1 w-5"
              />
              Was Sie bekommen
            </p>
            <div className="border-border/50 ring-foreground/5 relative mt-5 aspect-[4/5] w-full overflow-hidden rounded-3xl border shadow-[0_30px_60px_-20px_rgb(0_0_0/0.3)] ring-1 sm:aspect-[5/6]">
              <Image
                src="/images/sitalo-praxis-laptop.webp"
                alt="Fertige Sitalo-Website auf einem Laptop in einem warmen Atelier-Licht."
                fill
                sizes="(min-width: 1024px) 480px, 100vw"
                className="object-cover"
              />
              {/* Vignette für Caption-Kontrast */}
              <div
                aria-hidden="true"
                className="from-foreground/55 pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t to-transparent"
              />
              <figure className="absolute right-5 bottom-5 left-5 sm:right-7 sm:bottom-7 sm:left-7">
                <blockquote className="serif-italic text-background text-lg leading-snug tracking-[-0.005em] sm:text-xl">
                  Übermorgen online — fertig getestet auf echten Geräten.
                </blockquote>
                <figcaption className="text-background/70 mt-3 inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.28em]">
                  <span
                    aria-hidden="true"
                    className="bg-gold gold-pulse inline-block h-1 w-5"
                  />
                  Sitalo Atelier · Hamburg
                </figcaption>
              </figure>
            </div>

            <p className="serif-italic text-foreground/75 mt-8 max-w-md text-pretty text-lg leading-snug">
              Mehr ist nicht nötig. Wirklich. Wir formulieren um,
              beschneiden Bilder, strukturieren das Ganze — Sie
              konzentrieren sich auf Ihren Betrieb.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
