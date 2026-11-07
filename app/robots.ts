import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Gesperrt sind nur die API-Routen (Formulare, Ladezeit-Test) und der
 * Mitgliederbereich.
 *
 * Die Angebote für Kunden (/angebot/<token>) sind hier bewusst NICHT
 * gesperrt: Sie tragen noindex (Meta und X-Robots-Tag). Eine Sperre in
 * robots.txt würde Google daran hindern, dieses noindex zu lesen; eine
 * irgendwo verlinkte Adresse könnte dann ohne Inhalt in den Ergebnissen
 * landen.
 *
 * /_next/ bleibt bewusst offen: Dort liegen Schriften, Stile und
 * Skripte. Google braucht sie, um die Seiten wie ein Besucher zu sehen.
 */
const GESPERRT = ["/api/", "/admin"];

/**
 * KI-Crawler und -Assistenten, ausdrücklich erlaubt. Sie dürften auch
 * über die allgemeine Regel lesen; die eigene Gruppe macht die Absicht
 * eindeutig und verhindert, dass ein Anbieter die Seite wegen fehlender
 * Freigabe auslässt. Sitalo will von KI-Assistenten genannt werden,
 * deshalb sind auch die Trainings-Crawler erlaubt: Was ein Modell über
 * Sitalo „weiß“, kommt zum Teil aus diesem Training.
 *
 * - Suche/Index: Antworten mit Quellenangabe (ChatGPT-Suche, Claude,
 *   Perplexity, Copilot über Bing, Apple, DuckDuckGo).
 * - Abruf auf Nachfrage: Ein Nutzer bittet den Assistenten, eine Seite
 *   zu lesen.
 * - Training: Wissen der Modelle (GPT, Claude, Gemini, Llama, Mistral).
 */
const KI_CRAWLER = [
  // OpenAI
  "OAI-SearchBot",
  "ChatGPT-User",
  "GPTBot",
  // Anthropic
  "Claude-SearchBot",
  "Claude-User",
  "ClaudeBot",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Google (Gemini, KI-Übersichten nutzen den normalen Googlebot)
  "Google-Extended",
  // Microsoft (Copilot, und Grundlage der ChatGPT-Suche)
  "bingbot",
  // Apple (Siri, Apple Intelligence)
  "Applebot",
  "Applebot-Extended",
  // Weitere Assistenten und offene Datensätze
  "DuckAssistBot",
  "meta-externalagent",
  "Amazonbot",
  "MistralAI-User",
  "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: GESPERRT },
      { userAgent: KI_CRAWLER, allow: "/", disallow: GESPERRT },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
