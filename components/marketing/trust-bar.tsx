import { Clock, Lock, MapPin, User2 } from "lucide-react";

/**
 * Trust-Bar oberhalb des Footers. Nur faktische, leicht überprüfbare
 * Aussagen — keine inszenierten Siegel oder erfundenen Zertifikate.
 */
const TRUST = [
  {
    icon: Clock,
    title: "Antwort < 24 h",
    body: "Persönliche Rückmeldung, meist noch am selben Tag.",
  },
  {
    icon: User2,
    title: "Ein Ansprechpartner",
    body: "Sie sprechen direkt mit uns — keine Hotline.",
  },
  {
    icon: MapPin,
    title: "Hosting in der EU",
    body: "Server in Deutschland, SSL Pflicht, Backups automatisch.",
  },
  {
    icon: Lock,
    title: "DSGVO-konform",
    body: "Formulare, Tracking, Newsletter — alles datenschutz-sauber.",
  },
];

export function TrustBar() {
  return (
    <section
      aria-label="Was Sie bei Sitalo bekommen"
      className="bg-secondary/40 border-border/40 border-t"
    >
      <div className="mx-auto w-full max-w-7xl px-6 py-12 sm:py-16">
        <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {TRUST.map(({ icon: Icon, title, body }) => (
            <li key={title} className="flex items-start gap-4">
              <span className="bg-background border-border/60 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border">
                <Icon className="text-foreground/80 h-4 w-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-foreground text-[15px] font-semibold tracking-[-0.01em]">
                  {title}
                </p>
                <p className="text-muted-foreground mt-1 text-sm leading-relaxed">
                  {body}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
