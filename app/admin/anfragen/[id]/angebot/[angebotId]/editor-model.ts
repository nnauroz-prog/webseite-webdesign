/**
 * Zustand des Angebots-Editors als reine Funktionen (getestet in
 * tests/angebot-editor-model.test.ts).
 *
 * Eingabefelder halten Text (Menge „2“, Preis „1.299,50“), damit beim
 * Tippen nichts springt. Geprüft und umgerechnet wird erst beim
 * Speichern (parseAngebotInhalt in der Server Action); hier wird nur
 * für die Live-Summen nachsichtig gerechnet.
 *
 * Standardtexte bleiben passend: Ändern sich Paket, Monatsbeitrag,
 * Umsatzsteuer oder „Gültig bis“, gleicht syncHinweise die
 * Standardsätze an; Titel und Einleitung folgen Name und Firma,
 * solange sie noch wortgleich der Standardtext sind.
 */

import type {
  AngebotInhalt,
  AngebotPosition,
  HinweisKontext,
  PaketSlug,
  PositionArt,
  UstSatz,
} from "@/lib/admin/angebote";

import {
  ANGEBOT_GRENZEN,
  berechneSummen,
  centZuEingabe,
  hinweisKontext,
  istPaketPosition,
  paketAusPositionen,
  paketWechseln,
  parseDatum,
  parseEuroEingabe,
  POSITION_ARTEN,
  standardEinleitung,
  standardTitel,
  syncHinweise,
} from "@/lib/admin/angebote";

export type EditorZeile = {
  id: string;
  titel: string;
  beschreibung: string;
  /** Text aus dem Feld, z. B. „2“. */
  menge: string;
  /** Text aus dem Feld, z. B. „1.299,50“. */
  preis: string;
  art: PositionArt;
};

export type EditorForm = {
  kunde_name: string;
  kunde_firma: string;
  kunde_email: string;
  titel: string;
  einleitung: string;
  hinweise: string;
  /** yyyy-mm-dd aus dem Datumsfeld (kann beim Tippen kurz leer sein). */
  gueltig_bis: string;
  ust_satz: UstSatz;
  zeilen: EditorZeile[];
};

/** Formular plus der Stand, gegen den die Hinweise zuletzt abgeglichen wurden. */
export type EditorState = { form: EditorForm; kontext: HinweisKontext };

export function zeileAus(p: AngebotPosition): EditorZeile {
  return {
    id: p.id,
    titel: p.titel,
    beschreibung: p.beschreibung,
    menge: String(p.menge),
    preis: centZuEingabe(p.preis_cent),
    art: p.art,
  };
}

export function formAus(i: AngebotInhalt): EditorForm {
  return {
    kunde_name: i.kunde_name,
    kunde_firma: i.kunde_firma ?? "",
    kunde_email: i.kunde_email ?? "",
    titel: i.titel,
    einleitung: i.einleitung,
    hinweise: i.hinweise,
    gueltig_bis: i.gueltig_bis,
    ust_satz: i.ust_satz,
    zeilen: i.positionen.map(zeileAus),
  };
}

export function stateAus(i: AngebotInhalt): EditorState {
  const form = formAus(i);
  return { form, kontext: kontextAus(form) };
}

/** Menge 1–999 aus dem Feld, sonst null. */
export function mengeZahl(text: string): number | null {
  const t = text.trim();
  if (!/^\d{1,3}$/.test(t)) return null;
  const n = Number(t);
  return n >= 1 && n <= ANGEBOT_GRENZEN.mengeMax ? n : null;
}

/** Preis in Cent aus dem Feld (0 bis 1.000.000 €), sonst null. */
export function preisCent(text: string): number | null {
  const c = parseEuroEingabe(text);
  return c !== null && c <= ANGEBOT_GRENZEN.preisMaxCent ? c : null;
}

/** Zeilensumme netto in Cent, null bei ungültiger Menge oder ungültigem Preis. */
export function zeileNetto(z: EditorZeile): number | null {
  const m = mengeZahl(z.menge);
  const p = preisCent(z.preis);
  return m === null || p === null ? null : m * p;
}

/** Position für Rechnungen (Summen, Paket); Ungültiges zählt als 0 bzw. 1. */
function positionAus(z: EditorZeile): AngebotPosition {
  return {
    id: z.id,
    titel: z.titel,
    beschreibung: z.beschreibung,
    menge: mengeZahl(z.menge) ?? 1,
    preis_cent: preisCent(z.preis) ?? 0,
    art: z.art,
  };
}

/** Live-Summen; ungültige Zeilen zählen nicht mit. */
export function summenAus(form: Pick<EditorForm, "zeilen" | "ust_satz">) {
  return berechneSummen(
    form.zeilen.filter((z) => zeileNetto(z) !== null).map(positionAus),
    form.ust_satz,
  );
}

/** Gewähltes Paket laut Zeilen (für das Raster), sonst null. */
export function paketAus(form: Pick<EditorForm, "zeilen">): PaketSlug | null {
  return paketAusPositionen(form.zeilen);
}

/**
 * Wovon die Standard-Hinweise abhängen. Ein unfertiges Datum (Feld
 * kurz leer) übernimmt das letzte gültige aus `vorher`.
 */
export function kontextAus(
  form: Pick<EditorForm, "zeilen" | "ust_satz" | "gueltig_bis">,
  vorher?: HinweisKontext,
): HinweisKontext {
  const k = hinweisKontext({
    positionen: form.zeilen.map(positionAus),
    ust_satz: form.ust_satz,
    gueltig_bis: form.gueltig_bis,
  });
  if (!parseDatum(k.gueltig_bis) && vorher) k.gueltig_bis = vorher.gueltig_bis;
  return k;
}

function gleicherKontext(a: HinweisKontext, b: HinweisKontext): boolean {
  return (
    a.paket === b.paket &&
    a.monatlich === b.monatlich &&
    a.ust_satz === b.ust_satz &&
    a.gueltig_bis === b.gueltig_bis
  );
}

const firmaOderNull = (f: string) => f.trim() || null;

/**
 * Eine Änderung anwenden und die Standardtexte nachziehen (Hinweise,
 * Titel, Einleitung), soweit sie noch unverändert sind.
 */
export function aendern(
  state: EditorState,
  fn: (form: EditorForm) => EditorForm,
): EditorState {
  const vorher = state.form;
  const form = { ...fn(vorher) };

  if (
    vorher.kunde_name !== form.kunde_name ||
    vorher.kunde_firma !== form.kunde_firma
  ) {
    const altName = vorher.kunde_name.trim();
    const altFirma = firmaOderNull(vorher.kunde_firma);
    const neuName = form.kunde_name.trim();
    const neuFirma = firmaOderNull(form.kunde_firma);
    if (form.titel === standardTitel(altName, altFirma)) {
      form.titel = standardTitel(neuName, neuFirma);
    }
    if (form.einleitung === standardEinleitung(altName, altFirma)) {
      form.einleitung = standardEinleitung(neuName, neuFirma);
    }
  }

  const kontext = kontextAus(form, state.kontext);
  if (gleicherKontext(kontext, state.kontext))
    return { form, kontext: state.kontext };
  form.hinweise = syncHinweise(form.hinweise, state.kontext, kontext);
  return { form, kontext };
}

/**
 * Paket wählen: ersetzt nur die Paket-Zeilen (Standardpreise), eigene
 * Zeilen bleiben mit ihrem Text. Dasselbe Paket noch einmal ändert
 * nichts (sonst wären angepasste Preise still weg).
 */
export function paketWaehlen(form: EditorForm, slug: PaketSlug): EditorForm {
  if (paketAus(form) === slug) return form;
  const eigene = new Map(form.zeilen.map((z) => [z.id, z]));
  const next = paketWechseln(form.zeilen.map(positionAus), slug);
  return {
    ...form,
    zeilen: next.map((p) =>
      istPaketPosition(p) ? zeileAus(p) : (eigene.get(p.id) ?? zeileAus(p)),
    ),
  };
}

/**
 * Was an die Server Action geht: Texte wie eingegeben, je Position
 * Menge und Preis als Text (parseAngebotInhalt prüft und rechnet um).
 */
export function payloadAus(form: EditorForm): Record<string, unknown> {
  return {
    kunde_name: form.kunde_name,
    kunde_firma: form.kunde_firma,
    kunde_email: form.kunde_email,
    titel: form.titel,
    einleitung: form.einleitung,
    hinweise: form.hinweise,
    gueltig_bis: form.gueltig_bis,
    ust_satz: form.ust_satz,
    positionen: form.zeilen.map((z) => ({
      id: z.id,
      titel: z.titel,
      beschreibung: z.beschreibung,
      menge: z.menge.trim(),
      preis: z.preis,
      art: z.art,
    })),
  };
}

/** Vergleichswert für „ungespeicherte Änderungen“. */
export function formKey(form: EditorForm): string {
  return JSON.stringify(payloadAus(form));
}

// --- Entwurf aus dem Sitzungsspeicher ---

const isStr = (v: unknown): v is string => typeof v === "string";

function zeileOk(v: unknown): v is EditorZeile {
  if (!v || typeof v !== "object") return false;
  const z = v as Record<string, unknown>;
  return (
    isStr(z.id) &&
    isStr(z.titel) &&
    isStr(z.beschreibung) &&
    isStr(z.menge) &&
    isStr(z.preis) &&
    (POSITION_ARTEN as readonly unknown[]).includes(z.art)
  );
}

/** Gespeicherter Entwurf → Zustand, oder null bei fremdem/kaputtem Inhalt. */
export function stateAusEntwurf(data: unknown): EditorState | null {
  if (!data || typeof data !== "object") return null;
  const { form, kontext } = data as { form?: unknown; kontext?: unknown };
  if (
    !form ||
    typeof form !== "object" ||
    !kontext ||
    typeof kontext !== "object"
  )
    return null;
  const f = form as Record<string, unknown>;
  const k = kontext as Record<string, unknown>;
  const textOk = [
    "kunde_name",
    "kunde_firma",
    "kunde_email",
    "titel",
    "einleitung",
    "hinweise",
    "gueltig_bis",
  ].every((key) => isStr(f[key]));
  if (
    !textOk ||
    (f.ust_satz !== 0 && f.ust_satz !== 19) ||
    !Array.isArray(f.zeilen) ||
    f.zeilen.length > ANGEBOT_GRENZEN.positionenMax + 5 ||
    !f.zeilen.every(zeileOk) ||
    !(k.paket === null || isStr(k.paket)) ||
    typeof k.monatlich !== "boolean" ||
    (k.ust_satz !== 0 && k.ust_satz !== 19) ||
    !isStr(k.gueltig_bis)
  ) {
    return null;
  }
  return { form: form as EditorForm, kontext: kontext as HinweisKontext };
}
