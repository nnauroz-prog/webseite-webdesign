import Link from "next/link";

import { getPaketBySlug, WARTUNG_PREISE } from "@/lib/pakete-data";

import {
  LinieAnfrage,
  LinieBranchen,
  LinieBusiness,
  LiniePremium,
  LinieStarter,
  LinieStudio,
  LinieWartung,
  LinieWerkzeuge,
} from "./bilder/linien";
import s from "./laden.module.css";

const preis = (slug: "starter" | "business" | "premium" | "studio") =>
  getPaketBySlug(slug)?.setup ?? "";
const name = (slug: "starter" | "business" | "premium" | "studio") =>
  (getPaketBySlug(slug)?.name ?? slug).replace(/^Sitalo\s+/, "");

/**
 * Waagerechte Reihe mit Linienzeichnungen im Hafen-Duktus (bilder/
 * linien.tsx) und Beschriftung: am Rechner acht Einträge ohne Scrollen,
 * darunter wischbar mit Auslauf rechts. Preise aus lib/pakete-data.ts.
 */
export function Bildreihe() {
  const eintraege = [
    {
      href: "/pakete/starter",
      name: name("starter"),
      preis: preis("starter"),
      bild: <LinieStarter />,
    },
    {
      href: "/pakete/business",
      name: name("business"),
      preis: preis("business"),
      bild: <LinieBusiness />,
    },
    {
      href: "/pakete/premium",
      name: name("premium"),
      preis: preis("premium"),
      bild: <LiniePremium />,
    },
    {
      href: "/pakete/studio",
      name: name("studio"),
      preis: preis("studio"),
      bild: <LinieStudio />,
    },
    {
      href: "/wartung",
      name: "Wartung",
      preis: `ab ${WARTUNG_PREISE.basis} im Monat`,
      bild: <LinieWartung />,
    },
    { href: "/branchen", name: "Branchen", bild: <LinieBranchen /> },
    { href: "#werkzeuge", name: "Werkzeuge", bild: <LinieWerkzeuge /> },
    { href: "/anfrage", name: "Anfrage", bild: <LinieAnfrage /> },
  ];
  return (
    <nav aria-label="Angebot im Überblick" className={s.reihe}>
      <ul role="list">
        {eintraege.map((e) => {
          const inhalt = (
            <>
              <span className={s.reiheBild}>{e.bild}</span>
              <span className={s.reiheName}>{e.name}</span>
              {e.preis ? <span className={s.reihePreis}>{e.preis}</span> : null}
            </>
          );
          return (
            <li key={e.href}>
              {e.href.startsWith("#") ? (
                <a href={e.href}>{inhalt}</a>
              ) : (
                <Link href={e.href}>{inhalt}</Link>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
