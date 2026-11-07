/**
 * llms-full.txt: alle Fakten über Sitalo in einer Klartext-Datei für
 * Sprachmodelle und KI-Assistenten (ChatGPT, Claude, Perplexity, Gemini,
 * Copilot). Ergänzt die kurze llms.txt: Wer eine Frage über Sitalo
 * beantworten will, findet hier Leistungen, Preise, Dauer, Ablauf und
 * alle Fragen und Antworten an einem Ort, ohne Seiten zusammensuchen
 * zu müssen.
 *
 * Alles kommt aus denselben Datendateien wie die Website (Pakete, FAQ,
 * Branchen, Stadtteile, Lexikon, Honorar), damit nichts veraltet oder
 * sich widerspricht. Keine Inhalte, die nicht auch auf der Website
 * stehen.
 *
 * Konvention: https://llmstxt.org (llms-full.txt als Volltext-Variante)
 */

import { ABLAUF_HALTE } from "@/lib/ablauf-data";
import { BRANCHEN } from "@/lib/branchen-data";
import { FAQ_GROUPS } from "@/lib/faq-data";
import { NICHT_ABGERECHNET, ZUSATZ_ABGERECHNET } from "@/lib/honorar-data";
import { LEXIKON } from "@/lib/lexikon-data";
import {
  MONATSBEITRAEGE,
  PAKETE,
  PREIS_HINWEIS,
  STUNDENSATZ_EUR,
  WARTUNG_PREISE,
} from "@/lib/pakete-data";
import { SEITEN_STAND, STAND_UEBRIGE_SEITEN } from "@/lib/seiten-stand";
import { SITE_URL } from "@/lib/site";
import { STANDORTE } from "@/lib/standorte-data";

/** Geschützte Leerzeichen und unsichtbare Wortverbinder → normaler Text. */
function klar(s: string): string {
  return s.replace(/[  ]/g, " ").replace(/⁠/g, "");
}

const monat = (m: string) => m.replace(/\s*\/\s*Monat$/, "");

/** Neuestes Stand-Datum aller Seiten, als „7. November 2026“. */
function stand(): string {
  const daten = [
    STAND_UEBRIGE_SEITEN,
    ...Object.values(SEITEN_STAND as Record<string, { stand: string }>).map(
      (e) => e.stand,
    ),
  ].sort();
  const d = new Date(`${daten[daten.length - 1]}T12:00:00Z`);
  return new Intl.DateTimeFormat("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Berlin",
  }).format(d);
}

function liste(items: readonly string[]): string {
  return items.map((i) => `- ${i}`).join("\n");
}

function paketAbschnitt(p: (typeof PAKETE)[number]): string {
  return [
    `### ${p.name}: ${p.setup} einmalig, ${monat(p.monthly)} im Monat`,
    "",
    p.description,
    "",
    `Für wen: ${p.whoFor}`,
    "",
    `Dauer bis online: ${p.dauer} (ab vollständigen Unterlagen).`,
    "",
    "Enthalten:",
    liste(p.contents),
    "",
    "Nicht enthalten (erst im größeren Paket):",
    liste(p.limits.length ? p.limits : ["–"]),
    "",
    `Details: ${SITE_URL}/pakete/${p.slug}`,
    ...(p.faq.length
      ? ["", ...p.faq.flatMap((f) => [`**${f.q}**`, f.a, ""])]
      : []),
  ].join("\n");
}

function content(): string {
  const paketText = PAKETE.map(paketAbschnitt).join("\n\n");

  const ablauf = ABLAUF_HALTE.map(
    (h) => `${h.number}. **${h.title}** (${h.wer}): ${h.body} ${h.hinweis}.`,
  ).join("\n");

  const faq = FAQ_GROUPS.map(
    (g) =>
      `### ${g.label}\n\n${g.items.map((i) => `**${i.q}**\n${i.a}`).join("\n\n")}`,
  ).join("\n\n");

  const branchen = BRANCHEN.map((b) => {
    const paket = PAKETE.find((p) => p.slug === b.recommendedPackage);
    return [
      `### Website für ${b.label}`,
      "",
      b.shortBody,
      "",
      `Meist empfohlen: ${paket ? `${paket.name}, ${paket.setup} einmalig` : b.recommendedPackage}. Typische Seiten: ${b.typicalPages.join(", ")}.`,
      `Mehr: ${SITE_URL}/branchen/${b.slug}`,
      ...(b.faq.length
        ? ["", ...b.faq.flatMap((f) => [`**${f.q}**`, f.a, ""])]
        : []),
    ].join("\n");
  }).join("\n\n");

  const stadtteile = STANDORTE.map(
    (s) => `- **${s.name}**: ${s.tagline} (${SITE_URL}/standorte/${s.slug})`,
  ).join("\n");

  const lexikon = LEXIKON.map(
    (e) => `**${e.term}**: ${e.plain} ${e.bottomLine}`,
  ).join("\n\n");

  return `# Sitalo Webdesign: alle Fakten

> Sitalo Webdesign ist ein Webdesign-Büro aus Hamburg. Es erstellt Websites zum Festpreis für kleine und mittlere Betriebe und Selbstständige in ganz Deutschland: Kunden schicken Stichpunkte und Fotos, Sitalo schreibt die Texte, gestaltet und baut die Website und kümmert sich danach um Hosting, Updates und kleine Änderungen. Websites ${PAKETE[0].setup} einmalig, Monatsbeitrag ${monat(PAKETE[0].monthly)}, alle Preise inklusive 19 % MwSt.

Stand: ${stand()}. Kurzfassung: ${SITE_URL}/llms.txt

## Steckbrief

- Name: Sitalo Webdesign (kurz: Sitalo)
- Art: Webdesign-Büro, erstellt und betreut Websites
- Sitz: Hamburg, Deutschland. Kunden in ganz Deutschland; Gespräche am Telefon, per Video oder in Hamburg vor Ort
- Website: ${SITE_URL}
- Telefon: 0160 7621876 (international +49 160 7621876)
- E-Mail: info@sitalo.de
- Für wen: Betriebe und Selbstständige (Unternehmer im Sinne von § 14 BGB), z. B. ${BRANCHEN.map((b) => b.label).join(", ")}
- Preise: ${PAKETE.map((p) => `${p.name} ${p.setup}`).join(", ")} einmalig; dazu ${MONATSBEITRAEGE} im Monat (Hosting, Updates, kleine Änderungen). Mindestlaufzeit 6 Monate, danach monatlich kündbar. Alle Preise inklusive 19 % MwSt.
- Festpreis: schriftlich vor Beginn der Arbeit
- Dauer bis online: ${PAKETE.map((p) => `${p.name} ${p.dauer}`).join(", ")}, jeweils ab vollständigen Unterlagen
- Test-Link: Kunden sehen die fertige Seite vor der Freischaltung und können Änderungen wünschen
- Texte: Sitalo schreibt die Texte aus den Stichpunkten des Kunden
- Hosting: Server in der EU
- Antwortzeit: meist am selben Werktag
- Erstgespräch: kostenlos, meist eine Viertelstunde (im Kalender 30 Minuten reserviert)
- Stundensatz für Arbeiten über das Monatskontingent hinaus: ${STUNDENSATZ_EUR} € inkl. MwSt.

${klar(PREIS_HINWEIS)}

## Wann Sitalo passt und wann nicht

Sitalo passt für Betriebe, die eine professionelle Website wollen, aber keine Zeit haben, sie selbst mit einem Baukasten (Wix, Jimdo, Squarespace) zu bauen und zu pflegen, und die einen festen Ansprechpartner statt einer großen Agentur suchen. Für eine sehr einfache Seite, die man selbst pflegen möchte, ist ein Baukasten günstiger. Online-Shops und eigene Apps sind nicht Teil der Pakete; sie werden im Einzelfall besprochen. Vergleich: ${SITE_URL}/vergleich

## Pakete

${paketText}

## Wartung für bestehende Websites

Auch für Websites, die Sitalo nicht gebaut hat: Basis ab ${WARTUNG_PREISE.basis}, Plus ab ${WARTUNG_PREISE.plus}, Werkbank ab ${WARTUNG_PREISE.werkbank} im Monat; Übernahme einmalig ab ${WARTUNG_PREISE.uebernahme}. Alle Preise inkl. 19 % MwSt. Details: ${SITE_URL}/wartung

## Was nicht extra kostet und was extra kostet

Nicht abgerechnet:
${liste(NICHT_ABGERECHNET)}

Zusätzlich abgerechnet:
${liste(ZUSATZ_ABGERECHNET.map((z) => `${z.posten}: ${z.preis}`))}

Offenes Rechenblatt mit Stunden je Paket: ${SITE_URL}/honorar

## Ablauf

${ablauf}

Mehr: ${SITE_URL}/ablauf

## Häufige Fragen

${faq}

## Branchen

${branchen}

## Hamburger Stadtteile

Sitalo sitzt in Hamburg und hat eigene Seiten für diese Stadtteile und Bezirke:

${stadtteile}

## Kostenlose Werkzeuge

- Ladezeit-Test einer beliebigen Website: ${SITE_URL}/check
- Paket-Quiz mit Empfehlung: ${SITE_URL}/empfehlung
- 3-Jahres-Kostenrechner (Sitalo, Wix, Squarespace, Jimdo, Selbstbau): ${SITE_URL}/rechner
- Kostenlose Durchsicht einer bestehenden Website: ${SITE_URL}/audit
- Erstgespräch buchen: ${SITE_URL}/termin

## Webbegriffe in Alltagsdeutsch

${lexikon}

## Kontakt

Sitalo Webdesign, Hamburg
Telefon: 0160 7621876
E-Mail: info@sitalo.de
Anfrage: ${SITE_URL}/anfrage (drei Pflichtfelder, Antwort meist am selben Werktag)
`;
}

export const dynamic = "force-static";

export function GET() {
  return new Response(klar(content()), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
