"use server";

import { refresh } from "next/cache";
import { after } from "next/server";

import type { KundenAktionState } from "@/app/angebot/angebot-seite";
import type { Angebot } from "@/lib/admin/angebote";
import type { AngebotErgebnis } from "@/lib/angebote-store";
import type { AngebotMailArt } from "@/lib/angebot-mail";

import { KUNDEN_MELDUNGEN } from "@/app/angebot/angebot-seite";
import {
  honeypotLeer,
  parseAblehnGrund,
  parseAnnahmeName,
  parseToken,
  parseZeitstempel,
} from "@/lib/admin/angebote";
import { getAdminEmail } from "@/lib/admin/auth";
import { DbError } from "@/lib/admin/db-errors";
import {
  acceptAngebot,
  declineAngebot,
  logAngebotBestaetigung,
  logAngebotMailFehler,
  markAngebotViewed,
} from "@/lib/angebote-store";
import {
  sendeAngebotBenachrichtigung,
  sendeKundenBestaetigung,
} from "@/lib/angebot-mail";
import { LeadDeliveryError } from "@/lib/lead-mail";

/*
 * Öffentliche Server Actions der Kundenseite /angebot/[token].
 *
 * Kein requireAdmin: Hier handeln Kunden, ausgewiesen nur durch den
 * Token im Link. Deshalb (geprüft in tests/actions-guard.test.ts):
 * - nur die Kunden-Funktionen des Speichers (…ByToken, markViewed,
 *   accept, decline, logAngebotMailFehler), nie die Admin-Funktionen;
 * - jede Action prüft zuerst den Token (parseToken);
 * - Logs ohne Token und ohne Kundendaten (nur Nummer, Art, Fehlercode);
 * - ist der Inhaber eingeloggt (Vorschau), zählt der Aufruf nicht als
 *   „geöffnet“, und Annehmen/Ablehnen sind gesperrt.
 *
 * Die Mails laufen nach der Antwort (after): die Benachrichtigung an
 * den Inhaber und nach einer Annahme die Bestätigung an den Kunden
 * (falls im Angebot eine Adresse steht). Eine gescheiterte Mail
 * verhindert weder Annahme noch Ablehnung, sie landet im Log (ohne
 * Adressen) und im Verlauf der Anfrage.
 */

const FORM_HONEYPOT = "sitalo_hp_field";

/** Fehlertext fürs Log: gekürzt, E-Mail-Adressen geschwärzt. */
function logText(err: unknown): string {
  if (!(err instanceof Error)) return "?";
  return err.message.replace(/[^\s@"'<>]+@[^\s@"'<>]+/g, "<email>").slice(0, 300);
}

function benachrichtigeSpaeter(art: AngebotMailArt, angebot: Angebot): void {
  after(async () => {
    try {
      const via = await sendeAngebotBenachrichtigung(art, angebot);
      console.info("[angebot] Benachrichtigung zugestellt", {
        nummer: angebot.nummer,
        art,
        via,
      });
    } catch (err) {
      console.error("[angebot] Benachrichtigung fehlgeschlagen", {
        nummer: angebot.nummer,
        art,
        reason: err instanceof LeadDeliveryError ? err.reason : "exception",
        fehler: logText(err),
      });
      await logAngebotMailFehler(angebot);
    }
    if (art !== "angenommen") return;
    try {
      const via = await sendeKundenBestaetigung(angebot);
      if (!via) return; // keine Adresse im Angebot
      console.info("[angebot] Bestätigung an den Kunden zugestellt", {
        nummer: angebot.nummer,
      });
      await logAngebotBestaetigung(angebot, true);
    } catch (err) {
      console.error("[angebot] Bestätigung an den Kunden fehlgeschlagen", {
        nummer: angebot.nummer,
        reason: err instanceof LeadDeliveryError ? err.reason : "exception",
        fehler: logText(err),
      });
      await logAngebotBestaetigung(angebot, false);
    }
  });
}

function technikFehler(was: string, err: unknown): KundenAktionState {
  console.error(`[angebot] ${was} fehlgeschlagen`, {
    code: err instanceof DbError ? (err.code ?? "?") : "exception",
  });
  return { status: "fehler", meldung: KUNDEN_MELDUNGEN.technik };
}

/** Antwort, wenn der Speicher den Statuswechsel abgelehnt hat. */
function abgelehnt(
  r: Extract<AngebotErgebnis, { ok: false }>,
): KundenAktionState {
  // Die Seite zeigt danach den aktuellen Stand (abgelaufen, angenommen …).
  if (r.grund !== "ungueltig") refresh();
  switch (r.grund) {
    case "nicht_gefunden":
      return { status: "fehler", meldung: KUNDEN_MELDUNGEN.nicht_gefunden };
    case "abgelaufen":
      return { status: "fehler", meldung: KUNDEN_MELDUNGEN.abgelaufen };
    case "geaendert":
      return { status: "fehler", meldung: KUNDEN_MELDUNGEN.geaendert };
    default:
      return { status: "fehler", meldung: KUNDEN_MELDUNGEN.gesperrt };
  }
}

/**
 * Meldet den ersten Aufruf durch den Kunden (setzt first_viewed_at
 * einmal, ohne IP- oder Gerätedaten). Wird nach dem Laden im Browser
 * aufgerufen, damit Link-Vorschauen (WhatsApp, Mailprogramme), die
 * kein JavaScript ausführen, nicht als „geöffnet“ zählen. admin: true,
 * wenn der Inhaber eingeloggt ist (dann zählt nichts).
 */
export async function angebotGeoeffnet(
  token: string,
): Promise<{ admin: boolean }> {
  const t = parseToken(token);
  if (!t) return { admin: false };
  try {
    if (await getAdminEmail()) return { admin: true };
  } catch {
    // Anmeldung nicht prüfbar: lieber nicht als geöffnet zählen.
    return { admin: false };
  }
  await markAngebotViewed(t);
  return { admin: false };
}

/**
 * „Angebot zahlungspflichtig annehmen“: Name, Häkchen, Honeypot und
 * der Stand, den der Kunde gesehen hat (updated_at beim Laden). Wurde
 * das Angebot inzwischen geändert, wird nichts gespeichert: Die Seite
 * lädt den neuen Stand, das Häkchen ist wieder leer.
 */
export async function angebotAnnehmen(
  token: string,
  _prev: KundenAktionState,
  fd: FormData,
): Promise<KundenAktionState> {
  const t = parseToken(token);
  if (!t) return { status: "fehler", meldung: KUNDEN_MELDUNGEN.nicht_gefunden };
  if (!honeypotLeer(fd.get(FORM_HONEYPOT))) {
    console.warn("[angebot] Honeypot gefüllt, Annahme nicht gespeichert");
    return { status: "fehler", meldung: KUNDEN_MELDUNGEN.technik };
  }
  if (await getAdminEmail().catch(() => null))
    return { status: "fehler", meldung: KUNDEN_MELDUNGEN.admin };

  const name = parseAnnahmeName(fd.get("name"));
  if (!name)
    return { status: "fehler", meldung: KUNDEN_MELDUNGEN.name, feld: "name" };
  if (fd.get("bestaetigt") !== "ja")
    return {
      status: "fehler",
      meldung: KUNDEN_MELDUNGEN.bestaetigt,
      feld: "bestaetigt",
    };
  const stand = parseZeitstempel(fd.get("stand"));
  if (!stand) return { status: "fehler", meldung: KUNDEN_MELDUNGEN.technik };

  let r: AngebotErgebnis;
  try {
    r = await acceptAngebot(t, name, stand);
  } catch (err) {
    return technikFehler("Annahme", err);
  }
  if (!r.ok) {
    // Doppelter Klick: schon angenommen, also für den Kunden erledigt.
    if (r.grund === "gesperrt" && r.angebot?.status === "angenommen") {
      refresh();
      return { status: "ok" };
    }
    if (r.grund === "ungueltig")
      return { status: "fehler", meldung: KUNDEN_MELDUNGEN.name, feld: "name" };
    return abgelehnt(r);
  }
  console.info("[angebot] angenommen", { nummer: r.angebot.nummer });
  benachrichtigeSpaeter("angenommen", r.angebot);
  refresh();
  return { status: "ok" };
}

/** „Lieber ablehnen“: optional mit kurzem Grund. */
export async function angebotAblehnen(
  token: string,
  _prev: KundenAktionState,
  fd: FormData,
): Promise<KundenAktionState> {
  const t = parseToken(token);
  if (!t) return { status: "fehler", meldung: KUNDEN_MELDUNGEN.nicht_gefunden };
  if (!honeypotLeer(fd.get(FORM_HONEYPOT))) {
    console.warn("[angebot] Honeypot gefüllt, Ablehnung nicht gespeichert");
    return { status: "fehler", meldung: KUNDEN_MELDUNGEN.technik };
  }
  if (await getAdminEmail().catch(() => null))
    return { status: "fehler", meldung: KUNDEN_MELDUNGEN.admin };

  const g = parseAblehnGrund(fd.get("grund") ?? null);
  if (!g)
    return { status: "fehler", meldung: KUNDEN_MELDUNGEN.grund, feld: "grund" };

  let r: AngebotErgebnis;
  try {
    r = await declineAngebot(t, g.grund);
  } catch (err) {
    return technikFehler("Ablehnung", err);
  }
  if (!r.ok) {
    if (r.grund === "gesperrt" && r.angebot?.status === "abgelehnt") {
      refresh();
      return { status: "ok" };
    }
    if (r.grund === "ungueltig")
      return {
        status: "fehler",
        meldung: KUNDEN_MELDUNGEN.grund,
        feld: "grund",
      };
    return abgelehnt(r);
  }
  console.info("[angebot] abgelehnt", { nummer: r.angebot.nummer });
  benachrichtigeSpaeter("abgelehnt", r.angebot);
  refresh();
  return { status: "ok" };
}
