"use client";

import Link from "next/link";
import { useId, useState } from "react";

import { LinieBusiness, LiniePremium, LinieStarter, LinieStudio } from "@/components/marketing/laden/bilder/linien";

import { VergleichZelle, type PaketSpalte, type Slug, type VergleichGruppe } from "./vergleich-daten";

/**
 * Paketvergleich für schmale Bildschirme (unter 834 px), wie der
 * Apple-Vergleich: zwei native Auswahlen nebeneinander (Standard
 * Starter | Business), darunter je Zeile zwei Spalten mit denselben
 * Gruppen, Häkchen und Zahlen wie die Tabelle am Rechner.
 *
 * Der Server rendert Starter | Business vor; ohne Script bleibt dieser
 * Vergleich stehen (die Auswahlen sind dann ohne Wirkung).
 */
export function VergleichMobil({
  pakete,
  gruppen,
  start = ["starter", "business"],
}: {
  pakete: PaketSpalte[];
  gruppen: VergleichGruppe[];
  start?: [Slug, Slug];
}) {
  const [wahl, setWahl] = useState<[Slug, Slug]>(start);
  const uid = useId();
  const spalten = wahl.map((s) => pakete.find((p) => p.slug === s) ?? pakete[0]);

  const setze = (i: 0 | 1, slug: Slug) => {
    setWahl((alt) => {
      const neu: [Slug, Slug] = [...alt];
      neu[i] = slug;
      return neu;
    });
  };

  return (
    <div>
      <div className="grid grid-cols-2 gap-3">
        {([0, 1] as const).map((i) => (
          <div key={i}>
            <label htmlFor={`${uid}-${i}`} className="sr-only">
              {i === 0 ? "Erstes Paket" : "Zweites Paket"}
            </label>
            <select
              id={`${uid}-${i}`}
              className="vergleich-select"
              value={wahl[i]}
              onChange={(e) => setze(i, e.target.value as Slug)}
            >
              {pakete.map((p) => (
                <option key={p.slug} value={p.slug}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>

      {/* Kopf je Spalte: Produktbild, Name, Preis, Anfragen */}
      <div className="mt-8 grid grid-cols-2 gap-3 text-center" aria-live="polite">
        {spalten.map((p, i) => (
          <div key={`${p.slug}-${i}`} className="flex flex-col items-center">
            <span className="flex h-[56px] items-end text-[#1d1d1f]" aria-hidden="true">
              <PaketLinie slug={p.slug} />
            </span>
            {p.highlight ? (
              <span className="text-gold-ink mt-3 h-4 text-[12px] leading-4 font-semibold">Empfehlung</span>
            ) : (
              <span className="mt-3 h-4" aria-hidden="true" />
            )}
            <Link href={`/pakete/${p.slug}`} className="mt-1 inline-flex min-h-11 items-center text-[21px] leading-[1.19] font-semibold hover:underline">
              {p.name}
            </Link>
            <span className="text-muted-foreground mt-1 text-[14px]">{p.setup}</span>
            <Link
              href={`/anfrage?paket=${p.slug}`}
              className={`${p.highlight ? "btn-signal" : "btn-line"} btn-mittel mt-4`}
            >
              {p.name} anfragen
            </Link>
          </div>
        ))}
      </div>

      {gruppen.map((g) => (
        <div key={g.titel} className="mt-12">
          <h3 className="border-foreground border-b pb-3 text-[21px] leading-[1.19] font-semibold">{g.titel}</h3>
          <div>
            {g.zeilen.map((z) => (
              <div key={z.label} className="border-b border-[var(--border)] py-5">
                <p className="text-center text-[14px] font-semibold">{z.label}</p>
                <div className="mt-3 grid grid-cols-2 gap-3 text-center text-[14px] leading-[1.43]">
                  {spalten.map((p, i) => (
                    <div key={`${p.slug}-${i}`}>
                      <span className="sr-only">{p.name}: </span>
                      <VergleichZelle zeile={z} slug={p.slug} />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Linienzeichnung je Paket wie in der Bildreihe der Startseite. */
function PaketLinie({ slug }: { slug: Slug }) {
  if (slug === "starter") return <LinieStarter />;
  if (slug === "business") return <LinieBusiness />;
  if (slug === "premium") return <LiniePremium />;
  return <LinieStudio />;
}
