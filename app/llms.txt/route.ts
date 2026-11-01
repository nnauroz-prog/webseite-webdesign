/**
 * llms.txt: Kurzbeschreibung für Sprachmodelle und ihre Crawler.
 * Erklärt in Klartext, was Sitalo macht, damit Antworten auf Fragen
 * wie „wer baut Websites für Betriebe“ stimmen.
 *
 * Zahlen (Preise, Anzahl der Branchen, Stadtteile, Lexikon-Begriffe)
 * kommen aus den Datendateien, damit die Datei nicht veraltet.
 *
 * Spezifikation: https://llmstxt.org
 */

import { BRANCHEN } from "@/lib/branchen-data";
import { LEXIKON } from "@/lib/lexikon-data";
import { PAKETE } from "@/lib/pakete-data";
import { STANDORTE } from "@/lib/standorte-data";

const paketZeilen = PAKETE.map(
  (p) => `- **${p.name}** (${p.setup} einmalig, ${p.monthly.replace(/\s*\/\s*Monat$/, "")} im Monat)`,
).join("\n");

const ZAHLWORT = ["Null", "Ein", "Zwei", "Drei", "Vier", "Fünf", "Sechs"];

const branchenListe = BRANCHEN.map((b) => b.label).join(", ");
const standorteListe = STANDORTE.map((s) => s.name).join(", ");

const CONTENT = `# Sitalo Webdesign

> Webdesign-Büro aus Hamburg für kleine und mittlere Betriebe in ganz Deutschland. Kunden schicken Stichpunkte und Fotos, Sitalo schreibt die Texte und baut die Website. Festpreis vor dem Start, Test-Link vor der Freischaltung, kleine Seiten oft in 1 bis 2 Werktagen.

## Was Sitalo macht

Sitalo baut fertige Websites für Betriebe, die keine Zeit für einen Baukasten (Wix, Jimdo, Squarespace) haben. Aus den Stichpunkten des Kunden formulieren wir die Texte, der Kunde streicht und ergänzt. Den Festpreis gibt es schriftlich, bevor die Arbeit beginnt. Nach dem Start kümmert sich Sitalo um Hosting, Updates und kleine Änderungen gegen einen Monatsbeitrag. Websites ab 499 € einmalig, Monatsbeitrag ab 49 €.

## Für wen

Lokale Betriebe in Deutschland, viele davon in Hamburg und Umgebung. Eigene Branchenseiten gibt es für: ${branchenListe}.

## Pakete

${paketZeilen}

Starter ist eine einzelne Seite mit Kontaktformular. Business hat mehrere Unterseiten mit Team, Leistungen und Galerie. Premium enthält Bereiche, die Kunden selbst pflegen, etwa eine Speisekarte. Sitalo Studio entwirft das Erscheinungsbild neu (Schrift, Farben, Bildsprache), mit Treffen vor Ort und bis zu drei Korrekturrunden. Dauer bis online, jeweils ab vollständigen Unterlagen: Starter oft 1–2 Werktage, Business meist 5–10 Werktage, Premium meist 2–3 Wochen, Studio meist 3–5 Wochen. Alle Pakete: Hosting in der EU.

## Wichtige Seiten

- [Startseite](https://www.sitalo.de/): Leistungen, Live-Vorschau, Ablauf, Preise, Musterseiten, Fragen, Kontakt.
- [Website erstellen lassen](https://www.sitalo.de/website-erstellen-lassen): Kosten, Ablauf und Leistungen auf einer Seite.
- [Branchen](https://www.sitalo.de/branchen): Je Branche eine eigene Seite mit Musterseite, Seitenplan und Fragen.
- [Pakete](https://www.sitalo.de/pakete): ${ZAHLWORT[PAKETE.length] ?? PAKETE.length} Pakete im Vergleich, Details unter /pakete/[slug].
- [Ablauf](https://www.sitalo.de/ablauf): Sechs Schritte von der ersten Nachricht bis zur fertigen Seite.
- [FAQ](https://www.sitalo.de/faq): Fragen zu Preisen, Hosting, Ablauf und Google.
- [Kontakt](https://www.sitalo.de/kontakt): Telefon, E-Mail an info@sitalo.de oder Anfrageformular.
- [Anfrage](https://www.sitalo.de/anfrage): Formular mit drei Feldern, Antwort meist am selben Werktag.
- [Pflegedienste](https://www.sitalo.de/pflege) und [Praxen](https://www.sitalo.de/praxen): Eigene Seiten für diese beiden Branchen.

## Kostenlose Werkzeuge (ohne Anmeldung)

- [Ladezeit-Test](https://www.sitalo.de/check): Test einer beliebigen Website mit Google PageSpeed: Ladezeit, Barrierefreiheit, Technik und Google-Grundlagen.
- [Paket-Quiz](https://www.sitalo.de/empfehlung): Fünf Fragen, danach eine begründete Paket-Empfehlung.
- [3-Jahres-Rechner](https://www.sitalo.de/rechner): Gesamtkosten über drei Jahre im Vergleich mit Wix, Squarespace, Jimdo und Eigenbau, die eigene Zeit als Geld gerechnet.
- [Durchsicht Ihrer Website](https://www.sitalo.de/audit): Wir sehen uns eine bestehende Website von Hand an und schicken drei bis fünf konkrete Punkte per Mail, meist innerhalb von zwei Werktagen.
- [Termin](https://www.sitalo.de/termin): Erstgespräch direkt buchen: bis zu 30 Minuten, meist reicht eine Viertelstunde. Bestätigung per Mail meist am selben Werktag.
- [Sprechstunde](https://www.sitalo.de/sprechstunde): Jeden ersten Donnerstag im Monat von 17:00 bis 18:30 Uhr offene Telefonsprechstunde, auch für Nicht-Kunden und ohne Anmeldung.

## Weitere Angebote

- [Wartung](https://www.sitalo.de/wartung): Hosting, Updates und kleine Änderungen, auch für Websites, die Sitalo nicht gebaut hat. Basis 49 € im Monat, Plus 99 € im Monat, Werkbank 299 € im Monat mit zwei frei einsetzbaren Arbeitsstunden.
- [Erreichbarkeit](https://www.sitalo.de/erreichbarkeit): Wann Sitalo antwortet: meist am selben Werktag, Nachrichten vom Wochenende am Montag. Urlaub kündigen wir vorher an; Hosting und Backups laufen automatisch weiter.
- [Vergleich](https://www.sitalo.de/vergleich): Wann sich ein Baukasten lohnt, wann der Eigenbau und wann ein Webdesign-Büro.
- [Honorar](https://www.sitalo.de/honorar): Stundensatz, geschätzter Aufwand je Paket und was nicht abgerechnet wird.

## Hintergrund

- [Über Sitalo](https://www.sitalo.de/atelier): Wer Sitalo ist und wie gearbeitet wird.
- [Jetzt](https://www.sitalo.de/jetzt): Woran Sitalo gerade arbeitet, die nächste Sprechstunde und die neuesten Artikel.
- [Journal](https://www.sitalo.de/journal): Artikel zu Preisen, Arbeitsweise, lokaler Suche und einzelnen Branchen.
- [Manifest](https://www.sitalo.de/manifest): Acht Grundsätze darüber, was Sitalo tut und was nicht.
- [Auswahl](https://www.sitalo.de/auswahl): Welche Aufträge Sitalo annimmt. Jede Seite bauen und betreuen wir selbst, deshalb nehmen wir nur so viele Aufträge an, wie wir sorgfältig fertig bekommen.
- [Inventar](https://www.sitalo.de/inventar): Verwendete Werkzeuge, Hosting und was bewusst nicht eingesetzt wird.
- [Lexikon](https://www.sitalo.de/lexikon): ${LEXIKON.length} Webbegriffe (Hosting, SSL, CMS, SEO, DSGVO, Google-Unternehmensprofil und weitere) in Alltagsdeutsch erklärt.
- [Stadtteile](https://www.sitalo.de/standorte): Eigene Seiten für ${STANDORTE.length} Hamburger Stadtteile und Bezirke: ${standorteListe}.

## Technik

Next.js, React und Tailwind CSS. Hosting bei Vercel mit Servern in der EU. Die Besucherstatistik läuft mit Plausible ohne Cookies, deshalb gibt es keinen Cookie-Banner.

## Kontakt

E-Mail: info@sitalo.de
Telefon: 0160 7621876 (international: +49 160 7621876)
Standort: Hamburg, Deutschland
Antwort: meist am selben Werktag.
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
