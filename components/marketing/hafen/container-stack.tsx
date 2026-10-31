"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Leistungen als Containerstapel. Zwei 40-Fuß-Container für das, was
 * jede Website ausmacht, darunter 20-Fuß-Container für Zusätze. Beim
 * ersten Sichtkontakt landet die untere Reihe zuerst, dann die obere,
 * wie beim Stauen an Bord. Ohne Script oder bei reduzierter Bewegung
 * stehen alle Container sofort da (siehe app/hafen.css).
 */

type Box = {
  title: string;
  text: string;
  /** Linke Beschriftung: in welchem Paket der Container mitfährt. */
  tag: string;
  size: "40" | "20";
  tone: "signal" | "teer" | "gruen" | "zink" | "rost" | "weiss";
};

const BOXES: Box[] = [
  {
    title: "Die Website selbst",
    text: "Eine Seite oder mehrere, eigens für Ihren Betrieb gestaltet, ohne Baukasten. Sie läuft auf dem Handy so gut wie am Rechner und lädt auch dann flott, wenn das Netz hinter Stade mal wieder schwächelt.",
    tag: "In jedem Paket",
    size: "40",
    tone: "signal",
  },
  {
    title: "Hosting und Pflege",
    text: "Server, Sicherheits-Updates und Backups übernehmen wir. Kleine Änderungen sind im Monatsbeitrag enthalten, Sie schicken uns einfach eine Nachricht.",
    tag: "Ab 49 € im Monat",
    size: "40",
    tone: "teer",
  },
  {
    title: "Texte",
    text: "Sie schicken Stichpunkte, wir formulieren daraus die Texte. Sie lesen gegen und geben frei.",
    tag: "In jedem Paket",
    size: "20",
    tone: "gruen",
  },
  {
    title: "Anfragen",
    text: "Kontaktformular mit Spamschutz und ein Anruf-Knopf, der auf dem Handy direkt wählt.",
    tag: "In jedem Paket",
    size: "20",
    tone: "zink",
  },
  {
    title: "Bei Google",
    text: "Titel und Beschreibung für jede Seite, Sitemap und saubere Technik. Damit man Sie findet, wenn jemand in Ihrer Gegend sucht.",
    tag: "Ab Business",
    size: "20",
    tone: "rost",
  },
  {
    title: "Selbst pflegen",
    text: "Speisekarte, Wochenangebot oder Termine ändern Sie selbst, ohne uns anzurufen.",
    tag: "Premium",
    size: "20",
    tone: "weiss",
  },
];

export function ContainerStack() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`stack-drop ${inView ? "is-in" : ""}`}>
      <div className="grid grid-cols-2 gap-1.5 lg:grid-cols-12">
        {BOXES.map((b, i) => {
          const big = b.size === "40";
          // Untere Reihe (20 Fuß) landet zuerst, danach die 40-Fuß-Container.
          const delay = big ? 420 + i * 130 : (i - 2) * 90;
          return (
            <article
              key={b.title}
              className={`box box-${b.tone} ${big ? "col-span-2 lg:col-span-6" : "col-span-2 sm:col-span-1 lg:col-span-3"}`}
              style={{ "--drop-delay": `${delay}ms` } as React.CSSProperties}
            >
              <p className="box-code">
                <span>{b.tag}</span>
                <span>{b.size} ft</span>
              </p>
              <h3
                className={`pt-6 leading-[1.08] tracking-[-0.022em] sm:pt-10 lg:pt-14 ${
                  big ? "text-[1.75rem] sm:text-[2.1rem]" : "text-[1.4rem] sm:text-[1.6rem]"
                }`}
              >
                {b.title}
              </h3>
              <p className={`mt-2.5 max-w-[32em] leading-relaxed ${big ? "text-[16px]" : "text-[15px]"}`}>{b.text}</p>
            </article>
          );
        })}
      </div>
      {/* Deck und Wasserpass unter dem Stapel */}
      <div aria-hidden="true" className="bg-foreground relative mt-1.5 h-[18px]">
        <span className="absolute inset-x-0 top-[5px] h-px bg-white/15" />
      </div>
      <div aria-hidden="true" className="bg-ink-olive h-2.5 opacity-90" />
    </div>
  );
}
