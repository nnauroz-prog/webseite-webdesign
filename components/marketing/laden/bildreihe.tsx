import Link from "next/link";

import { getPaketBySlug, WARTUNG_PREISE } from "@/lib/pakete-data";

import {
  ReiheBranchen,
  ReiheBusiness,
  ReiheKontakt,
  ReihePremium,
  ReiheStarter,
  ReiheStudio,
  ReiheWartung,
  ReiheWerkzeuge,
} from "./bilder/reihe-bilder";
import s from "./laden.module.css";

const preis = (slug: "starter" | "business" | "premium" | "studio") =>
  getPaketBySlug(slug)?.setup ?? "";
const name = (slug: "starter" | "business" | "premium" | "studio") =>
  (getPaketBySlug(slug)?.name ?? slug).replace(/^Sitalo\s+/, "");

/**
 * Waagerechte Reihe kleiner Bilder mit Beschriftung unter dem Kopf: am
 * Rechner acht Einträge ohne Scrollen, darunter wischbar. Preise kommen
 * aus lib/pakete-data.ts.
 */
export function Bildreihe() {
  const eintraege = [
    {
      href: "/pakete/starter",
      name: name("starter"),
      preis: preis("starter"),
      bild: <ReiheStarter />,
    },
    {
      href: "/pakete/business",
      name: name("business"),
      preis: preis("business"),
      bild: <ReiheBusiness />,
    },
    {
      href: "/pakete/premium",
      name: name("premium"),
      preis: preis("premium"),
      bild: <ReihePremium />,
    },
    {
      href: "/pakete/studio",
      name: name("studio"),
      preis: preis("studio"),
      bild: <ReiheStudio />,
    },
    {
      href: "/wartung",
      name: "Wartung",
      preis: `ab ${WARTUNG_PREISE.basis} im Monat`,
      bild: <ReiheWartung />,
    },
    { href: "/branchen", name: "Branchen", bild: <ReiheBranchen /> },
    { href: "#werkzeuge", name: "Werkzeuge", bild: <ReiheWerkzeuge /> },
    { href: "/anfrage", name: "Anfrage", bild: <ReiheKontakt /> },
  ];
  return (
    <nav aria-label="Angebot im Überblick" className={s.reihe}>
      <ul role="list">
        {eintraege.map((e) => {
          const inhalt = (
            <>
              {e.bild}
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
