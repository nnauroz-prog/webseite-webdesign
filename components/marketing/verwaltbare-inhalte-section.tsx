import Link from "next/link";
import {
  ArrowRight,
  Calendar,
  Image as ImageIcon,
  Inbox,
  MessageSquare,
  UtensilsCrossed,
} from "lucide-react";

const TILES = [
  { icon: Calendar, label: "Öffnungszeiten ändern" },
  { icon: UtensilsCrossed, label: "Speisekarte pflegen" },
  { icon: MessageSquare, label: "Hinweisbanner aktivieren" },
  { icon: Inbox, label: "Anfragen ansehen" },
  { icon: ImageIcon, label: "Bilder hochladen" },
];

/**
 * "Verwaltbare Inhalte" — shows a fake admin-area mockup as proof
 * that we can build self-pflegable content directly into the
 * customer's own site. This is NOT a Sitalo-platform login —
 * the verwaltbare area is part of each customer's own website.
 */
export function VerwaltbareInhalteSection() {
  return (
    <section className="bg-secondary/20 border-border/40 border-b py-20 sm:py-28">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:items-center lg:gap-16">
          {/* Copy */}
          <div>
            <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.2em]">
              Optional · Premium-System
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              Auf Wunsch verwaltbare Inhalte —
              <br className="hidden sm:inline" />{" "}
              direkt in Ihrer Website.
            </h2>
            <p className="text-muted-foreground mt-5 text-[17px] leading-relaxed text-pretty">
              Wir bauen verwaltbare Bereiche direkt in Ihre Website ein — zum
              Beispiel für Öffnungszeiten, Speisekarte, Wochenangebot,
              Leistungen oder Bilder. Sie ändern Inhalte selbst oder lassen
              alles bequem von uns erledigen.
            </p>
            <Link
              href="/anfrage?paket=premium"
              className="bg-foreground text-background hover:bg-foreground/90 group mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium tracking-tight shadow-md transition-all hover:shadow-lg"
            >
              Mit verwaltbaren Inhalten anfragen
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Admin-area mockup */}
          <div className="relative">
            <div
              aria-hidden="true"
              className="bg-primary/15 absolute -inset-4 -z-10 rounded-[2rem] blur-3xl"
            />
            <div className="bg-card overflow-hidden rounded-2xl border shadow-2xl ring-1 ring-black/5">
              {/* App chrome */}
              <div className="bg-muted/50 flex items-center gap-2 border-b px-4 py-3">
                <span className="bg-destructive/60 h-2 w-2 rounded-full" />
                <span className="bg-warning/60 h-2 w-2 rounded-full" />
                <span className="h-2 w-2 rounded-full bg-emerald-500/60" />
                <span className="text-muted-foreground/70 ml-2 text-[10px] font-mono">
                  ihre-website.de/admin
                </span>
              </div>
              {/* Content */}
              <div className="p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-[10px] font-medium uppercase tracking-[0.18em]">
                      Inhalte verwalten
                    </p>
                    <h3 className="mt-1 text-base font-semibold tracking-tight">
                      Was möchten Sie ändern?
                    </h3>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-700 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Online
                  </span>
                </div>
                <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                  {TILES.map(({ icon: Icon, label }) => (
                    <li
                      key={label}
                      className="border-border/60 group flex items-center gap-3 rounded-xl border bg-background/60 p-3.5 transition-colors hover:border-foreground/40"
                    >
                      <span className="bg-primary/10 text-primary inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg">
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-medium">{label}</span>
                    </li>
                  ))}
                </ul>
                <div className="text-muted-foreground mt-5 flex items-center gap-2 text-xs">
                  <span className="bg-foreground inline-block h-1 w-1 rounded-full" />
                  Letzte Änderung vor 2 Stunden
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
