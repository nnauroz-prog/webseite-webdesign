/**
 * Harte Regeln für den Text einer Karte (Spruch, Tageskarte, Bild einer
 * Story-Serie). Dieselben Regeln gelten überall: in den Tests für die
 * Listen im Code (tests/sprueche.test.ts) und in der Redaktion des
 * Story-Studios, bevor ein Vorschlag angezeigt wird. Reine Funktionen,
 * ohne Abhängigkeiten, damit Server, Browser und Tests sie laden können.
 */
import { KICKER, THEMA_LABEL, type Spruch } from "@/lib/sprueche-data";

/** Ziffern, Preise, Marken, Garantien und Technik-Schlagworte. */
export const VERBOTEN =
  /\d|%|€|#|\b(KI|AI|ChatGPT|Chatbot|Apple|Google Ads|Instagram|Facebook|TikTok|WhatsApp|Wix|Jimdo|WordPress|garantiert|Garantie|Platz eins|Nummer eins|Testsieger|ausgezeichnet|SEO|Conversion|Landingpage|Performance|UX|CTA)\b|künstliche Intelligenz/;

/** Du-Form: Karten bleiben in der Sie-Form oder ohne Anrede. */
export const DU_FORM =
  /\b(du|dich|dir|dein|deine|deiner|deinem|deinen|deins|euch|euer|eure)\b/i;

const EMOJI = /\p{Extended_Pictographic}/u;
const SATZENDE = /[.!?]$/;

export const TEXT_MIN = 15;
export const TEXT_MAX = 80;
export const ZUSATZ_MIN = 10;
export const ZUSATZ_MAX = 100;
export const ANLASS_MIN = 3;
export const ANLASS_MAX = 28;

function istText(wert: unknown): wert is string {
  return typeof wert === "string";
}

/**
 * Prüft eine Karte gegen alle harten Regeln. Gibt die Verstöße als kurze
 * deutsche Sätze zurück (leer = alles in Ordnung). Nimmt beliebige Werte
 * entgegen, damit auch ungeprüfte Vorschläge sicher geprüft werden.
 */
export function pruefeKarte(karte: unknown): string[] {
  const fehler: string[] = [];
  if (!karte || typeof karte !== "object") return ["Karte fehlt."];
  const k = karte as Partial<Record<keyof Spruch, unknown>>;
  const { kicker, text, betont, zusatz, thema } = k;

  if (!istText(kicker) || !(KICKER as readonly string[]).includes(kicker))
    fehler.push(`Kicker unbekannt: ${String(kicker)}.`);
  if (!istText(thema) || !(thema in THEMA_LABEL))
    fehler.push(`Thema unbekannt: ${String(thema)}.`);

  if (!istText(text)) {
    fehler.push("Satz fehlt.");
  } else {
    if (text !== text.trim()) fehler.push("Satz hat Leerzeichen am Rand.");
    if (text.length < TEXT_MIN || text.length > TEXT_MAX)
      fehler.push(
        `Satz hat ${text.length} Zeichen (erlaubt ${TEXT_MIN} bis ${TEXT_MAX}).`,
      );
    if (!SATZENDE.test(text)) fehler.push("Satz endet nicht mit . ! oder ?");
  }

  if (!istText(zusatz)) {
    fehler.push("Zusatz fehlt.");
  } else {
    if (zusatz !== zusatz.trim())
      fehler.push("Zusatz hat Leerzeichen am Rand.");
    if (zusatz.length < ZUSATZ_MIN || zusatz.length > ZUSATZ_MAX)
      fehler.push(
        `Zusatz hat ${zusatz.length} Zeichen (erlaubt ${ZUSATZ_MIN} bis ${ZUSATZ_MAX}).`,
      );
    if (!SATZENDE.test(zusatz))
      fehler.push("Zusatz endet nicht mit . ! oder ?");
  }

  if (istText(text) && istText(zusatz)) {
    const beide = `${text} ${zusatz}`;
    const verboten = beide.match(VERBOTEN);
    if (verboten)
      fehler.push(
        `Nicht erlaubt: „${verboten[0]}“ (keine Ziffern, Preise, Marken, Garantien, Technik-Schlagworte).`,
      );
    const du = beide.match(DU_FORM);
    if (du) fehler.push(`Du-Form: „${du[0]}“ (Sie-Form oder ohne Anrede).`);
    const ganz = `${istText(kicker) ? kicker : ""} ${beide}`;
    if (EMOJI.test(ganz)) fehler.push("Emojis sind nicht erlaubt.");
    if ((ganz.match(/!/g) ?? []).length > 1)
      fehler.push("Höchstens ein Ausrufezeichen je Karte.");
  }

  if (!istText(betont)) {
    fehler.push("Pointe fehlt.");
  } else if (istText(text)) {
    const i = text.indexOf(betont);
    if (betont.length < 3 || betont !== betont.trim()) {
      fehler.push("Pointe ist zu kurz oder hat Leerzeichen am Rand.");
    } else if (i < 0) {
      fehler.push(`Pointe „${betont}“ steht nicht wörtlich im Satz.`);
    } else {
      if (betont.split(" ").length > 4)
        fehler.push("Pointe hat mehr als vier Wörter.");
      const vor = text.slice(0, i);
      const nach = text.slice(i + betont.length);
      if (
        (vor !== "" && !/[\s„(]$/.test(vor)) ||
        (nach !== "" && !/^[\s.,!?:;“)]/.test(nach))
      )
        fehler.push(`Pointe „${betont}“ beginnt oder endet mitten im Wort.`);
    }
  }
  return fehler;
}

/**
 * Prüft einen Anlass oder Serientitel, der groß auf dem Bild steht:
 * kurz, ohne Ziffern, Marken, Emojis und ohne Satzzeichen am Ende.
 */
export function pruefeAnlass(anlass: unknown): string[] {
  if (!istText(anlass)) return ["Anlass fehlt."];
  const fehler: string[] = [];
  if (anlass !== anlass.trim()) fehler.push("Anlass hat Leerzeichen am Rand.");
  if (anlass.length < ANLASS_MIN || anlass.length > ANLASS_MAX)
    fehler.push(
      `Anlass hat ${anlass.length} Zeichen (erlaubt ${ANLASS_MIN} bis ${ANLASS_MAX}).`,
    );
  const verboten = anlass.match(VERBOTEN);
  if (verboten) fehler.push(`Im Anlass nicht erlaubt: „${verboten[0]}“.`);
  if (EMOJI.test(anlass)) fehler.push("Im Anlass sind Emojis nicht erlaubt.");
  if (/[.!?:;]$/.test(anlass))
    fehler.push("Anlass endet mit einem Satzzeichen.");
  return fehler;
}
