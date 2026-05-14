/**
 * "Womit wir arbeiten" — Transparenz statt Verkauf.
 *
 * Listet die wichtigsten technischen Bausteine offen auf.
 * Schafft Vertrauen bei technik-affinen Kunden, und beruhigt
 * weniger affine Kunden ("hier weiß jemand, was er tut").
 *
 * Bewusst keine Anbieter-Logos (Lizenz-Risiko, optischer
 * Lärm) — nur Namen + kurze Begründung.
 */
const STACK = [
  {
    label: "Next.js + React",
    body: "Das gleiche Framework, das Notion, TikTok und Hashnode nutzen — schnell, modern, stabil.",
  },
  {
    label: "Hosting bei Vercel",
    body: "Server in der EU, automatisches SSL, weltweite CDN-Auslieferung. Backups inklusive.",
  },
  {
    label: "DSGVO-konform",
    body: "Keine fragwürdigen Tracker, kein Google Fonts vom CDN, kein Cookie-Banner-Wirrwarr nötig.",
  },
  {
    label: "Lighthouse-optimiert",
    body: "Schnelle Ladezeiten, mobile First, semantisches HTML — auch Google bewertet das positiv.",
  },
];

export function StackBlock() {
  return (
    <section className="bg-secondary/40 border-border/40 border-t">
      <div className="mx-auto w-full max-w-7xl px-6 py-20 sm:py-28">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
          <div>
            <p className="text-muted-foreground text-[11px] font-medium uppercase tracking-[0.3em]">
              Womit wir arbeiten
            </p>
            <h2 className="mt-6 text-balance text-3xl font-semibold leading-[1.1] tracking-[-0.03em] sm:text-4xl lg:text-5xl">
              Solide Technik,
              <br />
              <span className="serif-italic text-muted-foreground font-normal">
                ohne Geheimnisse.
              </span>
            </h2>
            <p className="text-muted-foreground mt-6 max-w-md text-pretty text-[15px] leading-relaxed">
              Hier ist transparent, was unter der Haube läuft. Sie müssen
              das nicht verstehen, wir kümmern uns darum — aber Sie
              sollen wissen, dass nichts gemauschelt wird.
            </p>
          </div>
          <ul className="divide-border/60 divide-y">
            {STACK.map((item) => (
              <li key={item.label} className="py-5 sm:py-6">
                <h3 className="text-foreground text-lg font-medium tracking-[-0.01em] sm:text-xl">
                  {item.label}
                </h3>
                <p className="text-muted-foreground mt-2 text-[15px] leading-relaxed">
                  {item.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
