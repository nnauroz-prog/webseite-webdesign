/**
 * Vertrag zwischen Story-Studio (Browser) und dem Posten auf Instagram
 * (Server). Rein (ohne Server-Importe), damit Studio, Server und Tests
 * dieselben Formen und Grenzen benutzen.
 *
 * Ablauf eines Posts:
 * 1. Das Studio zeichnet die Bilder im Browser (Story 1080×1920 oder
 *    Beitrag 1080×1350, JPEG) und holt sich Upload-Plätze
 *    (instagramUploadAction in app/admin/instagram-actions.ts).
 * 2. Es lädt jedes Bild direkt in den Speicher von Supabase (Bucket
 *    INSTAGRAM_BUCKET, mit dem Token des Platzes). So läuft kein Bild
 *    durch eine Vercel-Funktion.
 * 3. Es schickt den Auftrag (PostAuftrag) per POST an
 *    INSTAGRAM_POSTEN_PFAD. Der Server prüft alles, erzeugt für jedes
 *    Bild eine kurzlebige Adresse, legt bei Instagram die Container an,
 *    wartet, bis sie fertig sind, und veröffentlicht. Die Antwort ist ein
 *    Strom von JSON-Zeilen (PostEreignis), wie bei der Redaktion.
 * 4. Danach löscht der Server die Bilder wieder aus dem Speicher.
 *
 * Die Verbindung zu Instagram ist ein Zugangsschlüssel aus dem Meta
 * Business Manager (Systemnutzer, läuft nicht ab) in Vercel
 * (INSTAGRAM_TOKEN). Er verlässt den Server nie.
 */

/** Adresse fürs Posten (POST, nur angemeldet). */
export const INSTAGRAM_POSTEN_PFAD = "/admin/instagram/posten";

/** Inhaltstyp der Antwort (eine JSON-Zeile je Ereignis). */
export const INSTAGRAM_INHALTSTYP = "application/x-ndjson; charset=utf-8";

/** Bucket im Speicher von Supabase für Bilder auf dem Weg zu Instagram. */
export const INSTAGRAM_BUCKET = "instagram";

/**
 * Wie gepostet wird:
 * - story: jedes Bild eine eigene Story, in der Reihenfolge (1080×1920).
 * - beitrag: ein Bild als Beitrag, zwei bis KARUSSELL_MAX Bilder als
 *   Karussell (alle 1080×1350, 4:5).
 */
export const INSTAGRAM_ARTEN = ["story", "beitrag"] as const;
export type InstagramArt = (typeof INSTAGRAM_ARTEN)[number];

/** Höchstens so viele Bilder je Auftrag (Story-Serie: bis zu fünf). */
export const BILDER_MAX = 10;
/** Höchstens so viele Bilder in einem Karussell (Meta nennt 10 und 20; 10 ist sicher). */
export const KARUSSELL_MAX = 10;
/** Bildunterschrift eines Beitrags: höchstens so viele Zeichen (Meta: 2200). */
export const CAPTION_MAX = 2200;
/** Höchstens so viele Hashtags (Meta erlaubt 30, kappt aber teils viel früher). */
export const HASHTAGS_MAX = 5;
/** Größe einer Bilddatei: höchstens (Meta: 8 MB). */
export const BILD_BYTES_MAX = 8 * 1024 * 1024;

/** Woher die Bilder stammen: damit das Studio sie danach als gepostet abhakt. */
export type PostQuelle =
  /** Story-Serie: des Tages (id null) oder aus einem Auftrag (id der Zeile). */
  | { typ: "serie"; datum: string; id: string | null }
  /** Einzelner Post des Tages (Platz 0 bis 2). */
  | { typ: "post"; datum: string; platz: number };

/** Ein Platz für ein Bild im Speicher (aus instagramUploadAction). */
export type UploadPlatz = {
  /** Pfad im Bucket, etwa „2026-11-19/<uuid>-1.jpg“. */
  pfad: string;
  /** Token für uploadToSignedUrl (supabase-js) an genau diesen Pfad. */
  token: string;
};

/** Antwort von instagramUploadAction. */
export type UploadAntwort =
  | { ok: true; plaetze: UploadPlatz[] }
  | { ok: false; code: PostFehlerCode; text: string };

/** Was das Studio an INSTAGRAM_POSTEN_PFAD schickt. */
export type PostAuftrag = {
  art: InstagramArt;
  /** Pfade der hochgeladenen Bilder, in der Reihenfolge der Bilder. */
  bilder: string[];
  /**
   * Bildunterschrift. Beim Beitrag Pflicht (darf leer sein), bei Stories
   * wird sie nicht gesendet (Stories zeigen sie nicht verlässlich).
   */
  caption: string;
  quelle: PostQuelle;
};

/** Schritte, die das Studio als Fortschritt zeigt. */
export const POST_SCHRITTE = [
  "pruefen",
  "vorbereiten",
  "veroeffentlichen",
] as const;
export type PostSchritt = (typeof POST_SCHRITTE)[number];

export const POST_SCHRITT_LABEL: Record<PostSchritt, string> = {
  pruefen: "Verbindung prüfen",
  vorbereiten: "Bilder an Instagram geben",
  veroeffentlichen: "Veröffentlichen",
};

export type PostFehlerCode =
  /** INSTAGRAM_TOKEN fehlt oder ist unbrauchbar. */
  | "nicht_verbunden"
  /** Zugang abgelaufen, widerrufen oder ohne Rechte (Code 190, 10, 200…). */
  | "zugang"
  /** Auftrag ungültig (Art, Bilder, Pfade, Bildunterschrift, Quelle). */
  | "eingabe"
  /** Tageslimit von Instagram erreicht (9/2207042) oder zu viele Aufrufe. */
  | "limit"
  /** Instagram konnte ein Bild nicht laden oder lehnt es ab (Größe, Format, Seitenverhältnis). */
  | "bild"
  /** Konto eingeschränkt oder nicht geeignet (kein Business-Konto, gesperrt). */
  | "konto"
  /** Instagram hat einen anderen Fehler gemeldet oder war nicht erreichbar. */
  | "instagram"
  /** Etwas anderes ist schiefgegangen. */
  | "unbekannt";

/**
 * Eine Zeile im Antwortstrom. Vertrag:
 * - Jeder Schritt meldet „laeuft“ und danach „fertig“; beim
 *   Veröffentlichen von Stories mit nr/von je Story.
 * - Die letzte Zeile ist immer „fertig“ oder „fehler“, danach nichts mehr.
 * - Sind schon Stories veröffentlicht, wenn ein Fehler kommt, nennt die
 *   Fehlerzeile sie in teil (damit nichts doppelt gepostet wird).
 * - Die Route antwortet immer mit HTTP 200 und diesem Strom. Eine Antwort
 *   ohne 2xx oder mit anderem Inhaltstyp (Anmeldeseite nach abgelaufener
 *   Sitzung) behandelt das Studio wie den Code „unbekannt“.
 */
export type PostEreignis =
  | {
      typ: "schritt";
      schritt: PostSchritt;
      stand: "laeuft" | "fertig";
      /** Bei mehreren Stories: welche gerade dran ist. */
      nr?: number;
      von?: number;
    }
  | {
      typ: "fertig";
      /** Links zu den veröffentlichten Beiträgen oder Stories (kann leer sein). */
      links: string[];
      /** Konto, auf dem gepostet wurde (ohne @). */
      konto: string;
      /** Hinweis, wenn Instagram einen Teil weggelassen hat (etwa die Bildunterschrift). */
      hinweis?: string;
    }
  | {
      typ: "fehler";
      code: PostFehlerCode;
      /** Kurzer Satz für den Inhaber (Du-Form, einfaches Deutsch). */
      text: string;
      /** Was schon veröffentlicht ist (bei Stories), sonst weggelassen. */
      teil?: { veroeffentlicht: number; von: number; links: string[] };
    };

/** Stand der Verbindung für das Studio und die Seite /admin/instagram. */
export type InstagramStand =
  | { verbunden: false; grund: "kein_token" | "kein_speicher" }
  | {
      verbunden: true;
      /** Konto, falls die Prüfung es lesen konnte. */
      konto: { id: string; name: string } | null;
      /** Veröffentlichungen der letzten 24 Stunden und die Grenze, falls bekannt. */
      kontingent: { genutzt: number; gesamt: number } | null;
      /** Ein Satz, wenn die Prüfung gescheitert ist (Zugang, Netz …). */
      problem: string | null;
    };
