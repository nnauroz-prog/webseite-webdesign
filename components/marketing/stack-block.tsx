import { Cpu, Globe2, Lock, Zap } from "lucide-react";

/**
 * "Womit wir arbeiten" — Transparenz statt Verkauf.
 *
 * Listet die wichtigsten technischen Bausteine offen auf. Schafft
 * Vertrauen bei technik-affinen Kunden und beruhigt weniger affine
 * Kunden ("hier weiß jemand, was er tut").
 *
 * Editorial-Layout: zweispaltig, links das große Statement, rechts
 * vier nummerierte Karten mit Icon + Kurzbeschreibung. Bewusst
 * keine Anbieter-Logos (Lizenz-Risiko, optischer Lärm).
 */
const STACK = [
  {
    icon: Cpu,
    label: "Next.js + React",
    body: "Das Framework hinter Notion, TikTok und Hashnode. Modern, schnell, stabil — und es altert nicht in zwei Jahren.",
  },
  {
    icon: Globe2,
    label: "Hosting bei Vercel",
    body: "Server in der EU, automatisches SSL, weltweite CDN-Auslieferung. Backups inklusive, ohne dass Sie etwas tun müssen.",
  },
  {
    icon: Lock,
    label: "DSGVO-konform",
    body: "Keine fragwürdigen Tracker, kein Google Fonts vom CDN, kein Cookie-Banner-Wirrwarr. Audit-bereit ab Tag 1.",
  },
  {
    icon: Zap,
    label: "Lighthouse-optimiert",
    body: "Schnelle Ladezeiten, mobile First, semantisches HTML. Auch Google bewertet das positiv — also gut für SEO.",
  },
];

export function StackBlock() {
  return (
    <section className="bg-secondary/40 border-border/40 relative overflow-hidden border-t">
      {/* Dezenter Gold-Halo rechts unten */}
      <div
        aria-hidden="true"
        className="bg-gold/8 pointer-events-none absolute -bottom-32 right-[-10%] -z-10 h-[28rem] w-[28rem] rounded-full blur-[60px] sm:blur-[120px]"
      />
      <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <div>
            <p className="text-muted-foreground inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.3em]">
              <span
                aria-hidden="true"
                className="bg-gold gold-pulse inline-block h-1 w-6"
              />
              Unter der Haube
            </p>
            <h2 className="mt-6 text-balance text-3xl font-semibold leading-[1.1] tracking-[-0.03em] sm:text-4xl lg:text-5xl">
              Solide Technik,
              <br />
              <span className="serif-italic text-muted-foreground font-normal">
                ohne Geheimnisse.
              </span>
            </h2>
            <p className="text-muted-foreground mt-6 max-w-md text-pretty text-[15px] leading-relaxed">
              Vier Bausteine bilden das Fundament jeder Sitalo-Site. Sie
              müssen davon nichts verstehen — aber Sie sollen wissen,
              dass nichts gemauschelt wird.
            </p>
            <p className="serif-italic text-foreground/80 mt-8 max-w-md text-lg">
              — Individuell gebaut, nicht zusammengeklickt.
            </p>
          </div>

          <ul className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            {STACK.map((item, i) => {
              const Icon = item.icon;
              return (
                <li
                  key={item.label}
                  className="border-border/60 bg-card/70 ring-foreground/5 group relative flex flex-col overflow-hidden rounded-2xl border p-5 ring-1 transition-shadow duration-500 hover:shadow-[0_18px_40px_-22px_rgb(0_0_0/0.22)] sm:p-6"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="bg-foreground/[0.04] text-foreground/85 inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors group-hover:bg-foreground group-hover:text-background">
                      <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                    </span>
                    <span className="serif text-foreground/15 text-[1.75rem] font-normal leading-none tracking-[-0.04em]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <h3 className="text-foreground mt-5 text-[1.05rem] font-medium tracking-[-0.01em]">
                    {item.label}
                  </h3>
                  <p className="text-muted-foreground mt-2 text-[14px] leading-relaxed">
                    {item.body}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
