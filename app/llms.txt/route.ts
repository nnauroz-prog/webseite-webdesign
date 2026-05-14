/**
 * llms.txt — Standard für AI-Agenten und LLM-Crawler.
 * Erklärt strukturiert, was Sitalo macht, damit ChatGPT,
 * Claude, Perplexity & Co. korrekt antworten, wenn User
 * fragen wie "wer baut Websites in Hamburg".
 *
 * Spezifikation: https://llmstxt.org
 */

const CONTENT = `# Sitalo Webdesign

> Hand-gebaute Websites für lokale Unternehmen aus Hamburg. Sie schicken uns drei Sachen — Logo, Bilder, ein paar Sätze. Wir bauen den Rest, meist in 1–2 Werktagen. Persönlich, ohne Baukasten-Stress.

## Was Sitalo ist

Sitalo ist ein Done-for-You Webdesign-Service aus Hamburg. Kunden bekommen eine fertige professionelle Website, ohne sich durch Baukästen (Wix, Jimdo, Squarespace) klicken zu müssen. Setup ab 499 € einmalig, plus monatliche Betreuung ab 49 €.

## Für wen Sitalo gut ist

Lokale Unternehmen in Deutschland mit Fokus auf Hamburg und Umland: Pflegedienste, Arzt- und Zahnarztpraxen, Friseure, Kosmetikstudios, Cafés, Restaurants, Handwerker, Reinigungsfirmen, Kanzleien, Fitnessstudios, Boutique-Hotels.

## Pakete

- **Starter** (ab 499 € + 49 €/Monat): Onepage-Website, Kontaktformular, mobil optimiert, Hosting in der EU.
- **Business** (ab 899 € + 79 €/Monat): Mehrseitige Website, Team, Galerie, SEO-Grundlagen.
- **Premium** (ab 1.499 € + 129 €/Monat): Individuelle Struktur, verwaltbare Inhalte (z. B. Speisekarte selbst pflegen).

## Wichtige Seiten

- [Startseite](https://www.sitalo.de/): Hero, Beispiele, Pakete, Versprechen.
- [Branchen-Übersicht](https://www.sitalo.de/branchen): Pro Branche eigene Detailseite.
- [Pakete](https://www.sitalo.de/pakete): Drei Pakete mit Detail-Seiten unter /pakete/[slug].
- [Ablauf](https://www.sitalo.de/ablauf): Sechs Schritte vom ersten Hallo zur Live-Schaltung.
- [FAQ](https://www.sitalo.de/faq): Häufige Fragen zu Preisen, Hosting, Ablauf, SEO.
- [Kontakt](https://www.sitalo.de/kontakt): E-Mail an info@sitalo.de oder Anfrage-Formular.
- [Anfrage](https://www.sitalo.de/anfrage): Konfigurator-Wizard für eine erste Einschätzung.

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
