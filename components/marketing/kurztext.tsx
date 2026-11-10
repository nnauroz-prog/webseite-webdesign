"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Lange Absätze kürzen: Unterhalb der ersten Ansicht zeigt ein langer
 * Absatz nur zwei Zeilen, dahinter „Mehr“. Antippen klappt ihn weich auf.
 *
 * Regeln:
 * - Der Text bleibt vollständig im HTML (Suchmaschinen, Vorlesen, ohne
 *   JavaScript steht alles offen da).
 * - Nichts in der ersten Ansicht wird gekürzt (kein Layout-Sprung).
 * - Nie gekürzt: Preise (€), Rechtliches (§), Mono-Notizen, Formulare,
 *   Aufklapp-Antworten, Artikel, Impressum, Datenschutz, Admin, Angebote.
 */
const AUS = [
  "/admin",
  "/angebot",
  "/journal/",
  "/impressum",
  "/datenschutz",
  "/lexikon",
  "/anfrage",
  "/termin",
];
const MIN_ZEICHEN = 130;

export function Kurztext() {
  const pfad = usePathname();

  useEffect(() => {
    if (!pfad || AUS.some((a) => pfad.startsWith(a))) return;
    const main = document.querySelector("main");
    if (!main) return;
    const fertig: Array<() => void> = [];
    const kandidaten = Array.from(
      main.querySelectorAll<HTMLElement>("p, dd"),
    ).filter((el) => {
      if (
        el.dataset.kurz ||
        el.closest("details, form, nav, figure, [data-kein-kurz], .notiz-mono")
      )
        return false;
      if (
        el.classList.contains("notiz-mono") ||
        el.querySelector("p, dd, button, input")
      )
        return false;
      const text = el.textContent ?? "";
      if (text.length < MIN_ZEICHEN || /[€§]/.test(text)) return false;
      const r = el.getBoundingClientRect();
      if (r.height === 0 || r.top + window.scrollY < window.innerHeight * 1.05)
        return false;
      const zeile = parseFloat(getComputedStyle(el).lineHeight) || 24;
      return r.height > zeile * 3.4;
    });
    for (const el of kandidaten) {
      const zeile = parseFloat(getComputedStyle(el).lineHeight) || 24;
      // Inhalt in eine Hülle, der Knopf sitzt dahinter im selben Absatz:
      // so bleibt jedes Raster der Karte unverändert.
      const innen = document.createElement("span");
      innen.className = "kurz-innen";
      while (el.firstChild) innen.append(el.firstChild);
      el.append(innen);
      el.dataset.kurz = "zu";
      innen.style.setProperty("--kurz-h", `${Math.round(zeile * 2)}px`);
      const knopf = document.createElement("button");
      knopf.type = "button";
      knopf.className = "kurz-mehr";
      knopf.setAttribute("aria-expanded", "false");
      knopf.textContent = "Mehr";
      const schalten = () => {
        const offen = el.dataset.kurz === "offen";
        if (offen) {
          innen.style.maxHeight = `${innen.scrollHeight}px`;
          void innen.offsetHeight;
          el.dataset.kurz = "zu";
          innen.style.maxHeight = "";
        } else {
          el.dataset.kurz = "offen";
          innen.style.maxHeight = `${innen.scrollHeight}px`;
        }
        knopf.setAttribute("aria-expanded", offen ? "false" : "true");
        knopf.textContent = offen ? "Mehr" : "Weniger";
      };
      knopf.addEventListener("click", schalten);
      el.append(knopf);
      fertig.push(() => {
        knopf.remove();
        while (innen.firstChild) el.insertBefore(innen.firstChild, innen);
        innen.remove();
        delete el.dataset.kurz;
      });
    }
    return () => fertig.forEach((f) => f());
  }, [pfad]);

  return null;
}
