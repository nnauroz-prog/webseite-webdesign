/**
 * llms.txt — Standard für AI-Agenten und LLM-Crawler.
 * Erklärt strukturiert, was Sitalo macht, damit ChatGPT,
 * Claude, Perplexity & Co. korrekt antworten, wenn User
 * fragen wie "wer baut Websites in Hamburg".
 *
 * Spezifikation: https://llmstxt.org
 */

const CONTENT = `# Sitalo Webdesign

> Professionelle Websites für lokale Unternehmen aus Hamburg. Sie schicken uns drei Sachen — Logo, Bilder, ein paar Sätze. Wir bauen den Rest, meist in 1–2 Werktagen. Persönlich, ohne Baukasten-Stress.

## Was Sitalo ist

Sitalo ist ein Done-for-You Webdesign-Service aus Hamburg. Kunden bekommen eine fertige professionelle Website, ohne sich durch Baukästen (Wix, Jimdo, Squarespace) klicken zu müssen. Setup ab 499 € einmalig, plus monatliche Betreuung ab 49 €.

## Für wen Sitalo gut ist

Lokale Unternehmen in Deutschland mit Fokus auf Hamburg und Umland: Pflegedienste, Arzt- und Zahnarztpraxen, Friseure, Kosmetikstudios, Cafés, Restaurants, Handwerker, Reinigungsfirmen, Kanzleien, Fitnessstudios, Boutique-Hotels.

## Pakete

- **Starter** (ab 499 € + 49 €/Monat): Onepage-Website, Kontaktformular, mobil optimiert, Hosting in der EU.
- **Business** (ab 899 € + 79 €/Monat): Mehrseitige Website, Team, Galerie, SEO-Grundlagen.
- **Premium** (ab 2.499 € + 179 €/Monat): Individuelle Struktur, verwaltbare Inhalte (z. B. Speisekarte selbst pflegen).
- **Sitalo Studio** (ab 3.490 € + 249 €/Monat): Atelier-Stufe mit eigenständiger Design-Sprache, Atelier-Besuch, drei Korrekturrunden. Für Marken, die sich vom Branchen-Durchschnitt absetzen.

## Wichtige Seiten

- [Startseite](https://www.sitalo.de/): Hero, Beispiele, Pakete, Versprechen.
- [Branchen-Übersicht](https://www.sitalo.de/branchen): Pro Branche eigene Detailseite.
- [Pakete](https://www.sitalo.de/pakete): Drei Pakete mit Detail-Seiten unter /pakete/[slug].
- [Ablauf](https://www.sitalo.de/ablauf): Sechs Schritte vom ersten Hallo zur Live-Schaltung.
- [FAQ](https://www.sitalo.de/faq): Häufige Fragen zu Preisen, Hosting, Ablauf, SEO.
- [Kontakt](https://www.sitalo.de/kontakt): E-Mail an info@sitalo.de oder Anfrage-Formular.
- [Anfrage](https://www.sitalo.de/anfrage): Drei Felder, Antwort meist am selben Tag.

## Kostenlose Werkzeuge (ohne Anmeldung)

- [Speed-Check](https://www.sitalo.de/check): Live-Lighthouse-Test jeder Website in 30 Sekunden — Performance, SEO, Accessibility, Best Practices plus Core Web Vitals.
- [Paket-Quiz](https://www.sitalo.de/empfehlung): Fünf Fragen, eine begründete Paket-Empfehlung.
- [3-Jahres-Rechner](https://www.sitalo.de/rechner): Gesamtkosten-Vergleich Sitalo vs Wix, Squarespace, Jimdo, KI-Selbstbau — inklusive Eigenzeit als Geld.
- [Kostenloser Audit](https://www.sitalo.de/audit): Persönliche Mini-Auswertung der eigenen Website per Mail innerhalb 48 Stunden.
- [Termin-Buchung](https://www.sitalo.de/termin): 30-Minuten-Erstgespräch direkt buchen, Bestätigung in 15 Minuten.
- [Sprechstunde](https://www.sitalo.de/sprechstunde): Jeden ersten Donnerstag im Monat von 17:00 bis 18:30 Uhr offene Telefon-Sprechstunde. Auch für Nicht-Kunden, ohne Anmeldung, ohne Verkauf.

## Weitere Angebote

- [Wartung & Werkbank](https://www.sitalo.de/wartung): Hosting, Updates, kleine Änderungen — auch für Websites, die nicht von Sitalo gebaut wurden. Basis ab 49 €/Monat, Plus ab 99 €/Monat, Werkbank On-Demand ab 299 €/Monat (zwei Atelier-Stunden pro Monat für Design, Dev, Strategie — frei einsetzbar).
- [Vergleich](https://www.sitalo.de/vergleich): Ehrlicher Tiefenvergleich Sitalo vs Wix, Squarespace, Jimdo und ChatGPT/Cursor-Selbstbau.

## Editorial & Identität

- [Jetzt](https://www.sitalo.de/jetzt): Now-Page — was im Atelier gerade passiert: Werkbank, freie Bauplätze, nächste Sprechstunde, zuletzt geschrieben. Monatlich erneuert.
- [Journal](https://www.sitalo.de/journal): Essays aus dem Atelier — Beobachtungen aus echten Hamburger Projekten (Gastronomie, Pflege, Migrationen).
- [Manifest](https://www.sitalo.de/manifest): Acht Sätze darüber, was Sitalo tut und was nicht.
- [Auswahl](https://www.sitalo.de/auswahl): Aufnahmekriterien — Sitalo nimmt höchstens drei neue Aufträge pro Monat an.
- [Inventar](https://www.sitalo.de/inventar): Offene Werkstatt-Liste — verwendete Werkzeuge, Hosting, Empfehlungen, und was bewusst nicht eingesetzt wird.
- [Lexikon](https://www.sitalo.de/lexikon): Sechzehn Webbegriffe (Hosting, SSL, CMS, SEO, DSGVO, Google-Business-Profil …) in Klartext erklärt.
- [Honorar](https://www.sitalo.de/honorar): Open-Book-Honorar-Modell — Stundensatz, geschätzter Aufwand pro Paket, was bewusst nicht abgerechnet wird.

## Stack

Next.js 16, React 19, Tailwind CSS v4. Hosting auf Vercel (Server in der EU). DSGVO-konform, kein Tracking, keine fragwürdigen Drittanbieter-Embeds.

## Kontakt

E-Mail: info@sitalo.de
Telefon: 0152 24437370 (international: +49 152 24437370)
Standort: Hamburg, Deutschland
Antwortzeit: innerhalb von 24 Stunden, meistens deutlich schneller.
`;

export const dynamic = "force-static";

export function GET() {
  return new Response(CONTENT, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
