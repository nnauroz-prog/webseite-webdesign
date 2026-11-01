"use client";

import { Check, Link2, Loader2, Mail, Pencil, Share2 } from "lucide-react";
import Link from "next/link";
import { useRef, useState, useTransition } from "react";

import type { Angebot } from "@/lib/admin/angebote";

import { markAngebotSentAction } from "@/app/admin/angebot-actions";
import { BottomSheet } from "@/app/admin/anfragen/[id]/bottom-sheet";
import { runAction } from "@/app/admin/run-action";
import {
  angebotUrl,
  kundenMailHref,
  sendeProbleme,
  teilenDaten,
} from "@/lib/admin/angebote";
import { cn } from "@/lib/utils";

export type SendAngebot = Pick<
  Angebot,
  | "id"
  | "nummer"
  | "token"
  | "status"
  | "kunde_name"
  | "kunde_email"
  | "titel"
  | "positionen"
  | "ust_satz"
  | "gueltig_bis"
>;

const BIG =
  "flex min-h-14 w-full items-center gap-3 rounded-[4px] border px-4 py-2.5 text-left transition-colors disabled:opacity-60";
const BTN =
  "inline-flex h-12 grow items-center justify-center gap-2 rounded-[3px] px-5 text-[16px] font-medium disabled:opacity-60";

type Step = "freigabe" | "wahl" | "frage";
type Copy = "idle" | "kopiert" | "kopiert_statt_teilen" | "manuell";

/**
 * Senden-Blatt: „Per Mail senden“ (mailto an die Adresse im Angebot,
 * fertiger Text mit Preis, Gültigkeit und Link), „Teilen …“
 * (WhatsApp, SMS …; ohne Teilen-Funktion wird der Link kopiert) und
 * „Link kopieren“.
 *
 * Ein Entwurf wird zuerst freigegeben (Status „Gesendet“, Verlauf),
 * erst dann gibt es die Wege zum Verschicken. Der Link funktioniert nur
 * für freigegebene Angebote; so bekommt kein Kunde einen Link, der ins
 * Leere führt, egal wann er ihn öffnet.
 *
 * Erneut senden (schon freigegeben): Nach Mail oder Teilen fragt das
 * Blatt „Gesendet?“; „Ja“ vermerkt das erneute Senden im Verlauf.
 *
 * Vor dem Senden: Fehlt etwas (Name, Titel, Position, Gültig bis in
 * der Vergangenheit), gibt es nur die Liste und „Angebot bearbeiten“.
 */
export function AngebotSendSheet({
  open,
  angebot,
  editHref,
  onClose,
  onSent,
}: {
  open: boolean;
  angebot: SendAngebot;
  /** Link „Angebot bearbeiten“ (fehlt im Editor selbst). */
  editHref?: string;
  onClose: () => void;
  /**
   * anfrageInArbeit: Die Anfrage stand auf „Neu“ und steht jetzt auf
   * „In Arbeit“. erstmals: In diesem Blatt freigegeben (war Entwurf).
   */
  onSent: (info: { anfrageInArbeit: boolean; erstmals: boolean }) => void;
}) {
  // Beim Öffnen einmal prüfen (das Blatt wird je Öffnen neu erzeugt).
  const [probleme, setProbleme] = useState(() =>
    sendeProbleme(angebot, new Date()),
  );
  // Beim Öffnen festgelegt: Entwurf → erst freigeben.
  const [entwurf] = useState(() => angebot.status === "entwurf");
  const [step, setStep] = useState<Step>(() =>
    angebot.status === "entwurf" ? "freigabe" : "wahl",
  );
  // Nach der Freigabe in diesem Blatt: Ergebnis für onSent beim Schließen.
  const [freigabe, setFreigabe] = useState<{ anfrageInArbeit: boolean } | null>(
    null,
  );
  const [via, setVia] = useState<"mail" | "teilen" | null>(null);
  const [copy, setCopy] = useState<Copy>("idle");
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const urlRef = useRef<HTMLInputElement>(null);

  const url = angebotUrl(angebot.token);
  const mailHref = kundenMailHref(angebot);
  const again = !entwurf;

  /** Schließen: Nach einer Freigabe zählt das wie „gesendet“. */
  function close() {
    if (freigabe) onSent({ ...freigabe, erstmals: true });
    else onClose();
  }

  function ask(how: "mail" | "teilen") {
    // Frisch freigegeben: schon vermerkt, keine Rückfrage nötig.
    if (freigabe) return;
    setVia(how);
    setStep("frage");
    setError(null);
  }

  async function copyLink(instead: boolean) {
    try {
      await navigator.clipboard.writeText(url);
      setCopy(instead ? "kopiert_statt_teilen" : "kopiert");
    } catch {
      // Kein Zugriff auf die Zwischenablage: Link zum Markieren zeigen.
      setCopy("manuell");
      window.setTimeout(() => urlRef.current?.select(), 50);
    }
  }

  async function share() {
    const data = teilenDaten(angebot);
    const canShare =
      typeof navigator.share === "function" &&
      (typeof navigator.canShare !== "function" || navigator.canShare(data));
    if (!canShare) {
      await copyLink(true);
      return;
    }
    try {
      await navigator.share(data);
      ask("teilen");
    } catch (err) {
      // Abgebrochen: nichts tun. Anderer Fehler: Link kopieren.
      if (err instanceof DOMException && err.name === "AbortError") return;
      await copyLink(true);
    }
  }

  function markSent() {
    setError(null);
    start(async () => {
      const res = await runAction(() => markAngebotSentAction(angebot.id));
      if (!res.ok) {
        setError(res.error);
        if ("probleme" in res && res.probleme?.length) {
          setProbleme(res.probleme);
          setStep(entwurf ? "freigabe" : "wahl");
        }
        return;
      }
      if (step === "freigabe") {
        // Freigegeben: im Blatt bleiben, jetzt verschicken.
        setFreigabe({ anfrageInArbeit: res.anfrageInArbeit });
        setStep("wahl");
        return;
      }
      onSent({ anfrageInArbeit: res.anfrageInArbeit, erstmals: false });
    });
  }

  const title =
    step === "frage"
      ? "Gesendet?"
      : step === "freigabe"
        ? `${angebot.nummer} freigeben`
        : `${angebot.nummer} ${again ? "erneut senden" : "senden"}`;

  const empfaenger = (
    <p className="text-muted-foreground text-[14px] leading-relaxed">
      {angebot.kunde_email ? (
        <>
          An {angebot.kunde_name || "den Kunden"} ·{" "}
          <span className="break-all">{angebot.kunde_email}</span>
        </>
      ) : (
        "Im Angebot steht keine E-Mail-Adresse. Teil den Link oder kopier ihn, oder trag im Angebot eine Adresse ein."
      )}
    </p>
  );

  return (
    <BottomSheet
      open={open}
      onClose={close}
      titleId="angebot-send-title"
      title={title}
    >
      {probleme.length > 0 ? (
        <div className="mt-1">
          <div
            role="alert"
            className="border-gold rounded-[4px] border-2 p-3 text-[15px] leading-relaxed"
          >
            <p className="font-semibold">Vor dem Senden fehlt noch etwas:</p>
            <ul className="mt-1 list-disc pl-5">
              {probleme.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
          {editHref ? (
            <Link
              href={editHref}
              className="bg-foreground text-background mt-3 flex h-12 items-center justify-center gap-2 rounded-[3px] text-[16px] font-medium"
            >
              <Pencil className="h-4 w-4" aria-hidden="true" />
              Angebot bearbeiten
            </Link>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="bg-foreground text-background mt-3 flex h-12 w-full items-center justify-center rounded-[3px] text-[16px] font-medium"
            >
              Zurück zum Bearbeiten
            </button>
          )}
        </div>
      ) : step === "freigabe" ? (
        <div className="mt-1">
          <p className="text-[15px] leading-relaxed">
            Erst freigeben, dann verschicken. Sobald das Angebot freigegeben ist,
            kann der Kunde es über den Link öffnen und annehmen. Der Status
            wechselt auf „Gesendet“ und steht im Verlauf.
          </p>
          <p className="text-muted-foreground mt-2 text-[14px] leading-relaxed">
            Ändern kannst du es danach weiterhin, solange es niemand angenommen
            hat. Der Kunde sieht dann „Geändert am …“.
          </p>
          <button
            type="button"
            onClick={markSent}
            disabled={pending}
            className={cn(BTN, "bg-foreground text-background mt-4 w-full")}
          >
            {pending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Check className="h-4 w-4" aria-hidden="true" />
            )}
            {error ? "Nochmal freigeben" : "Freigeben"}
          </button>
          <div className="mt-3">{empfaenger}</div>
        </div>
      ) : step === "frage" ? (
        <div className="mt-1">
          <p className="text-[15px] leading-relaxed">
            {via === "mail"
              ? "Hast du die Mail abgeschickt? Dann vermerke es hier."
              : "Hast du den Link verschickt? Dann vermerke es hier."}{" "}
            Das erneute Senden steht dann im Verlauf.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={markSent}
              disabled={pending}
              className={cn(BTN, "bg-foreground text-background")}
            >
              {pending ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Check className="h-4 w-4" aria-hidden="true" />
              )}
              {error ? "Nochmal" : "Ja, gesendet"}
            </button>
            <button
              type="button"
              onClick={() => {
                setStep("wahl");
                setError(null);
              }}
              disabled={pending}
              className={cn(BTN, "border-border bg-background border")}
            >
              Noch nicht
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-1">
          {freigabe ? (
            <p
              role="status"
              className="text-ink-petrol mb-2 flex items-center gap-2 text-[15px] font-medium"
            >
              <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
              Freigegeben. Jetzt an den Kunden schicken:
            </p>
          ) : null}
          {empfaenger}
          <ul className="mt-3 space-y-2">
            {mailHref ? (
              <li>
                <a
                  href={mailHref}
                  onClick={() => {
                    // Erst nach dem Öffnen der Mail-App umschalten.
                    window.setTimeout(() => ask("mail"), 400);
                  }}
                  className={cn(
                    BIG,
                    "bg-foreground text-background border-foreground",
                  )}
                >
                  <Mail className="h-5 w-5 shrink-0" aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-medium">
                      Per Mail senden
                    </span>
                    <span className="text-background/75 block text-[13px]">
                      Öffnet dein Mail-Programm mit Betreff, Text und Link
                    </span>
                  </span>
                </a>
              </li>
            ) : null}
            <li>
              <button
                type="button"
                onClick={share}
                className={cn(
                  BIG,
                  "border-border bg-background hover:border-foreground/40",
                )}
              >
                <Share2 className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span className="min-w-0 flex-1">
                  <span className="block text-[16px] font-medium">
                    Teilen …
                  </span>
                  <span className="text-muted-foreground block text-[13px]">
                    WhatsApp, SMS oder eine andere App
                  </span>
                </span>
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => copyLink(false)}
                className={cn(
                  BIG,
                  "border-border bg-background hover:border-foreground/40",
                )}
              >
                {copy === "kopiert" ? (
                  <Check
                    className="text-ink-petrol h-5 w-5 shrink-0"
                    aria-hidden="true"
                  />
                ) : (
                  <Link2 className="h-5 w-5 shrink-0" aria-hidden="true" />
                )}
                <span className="block text-[16px] font-medium">
                  {copy === "kopiert" ? "Link kopiert" : "Link kopieren"}
                </span>
              </button>
            </li>
          </ul>

          {copy === "kopiert_statt_teilen" ? (
            <p role="status" className="mt-3 text-[15px] leading-relaxed">
              Teilen geht in diesem Browser nicht. Der Link ist kopiert: Füg ihn
              in WhatsApp, eine SMS oder eine Mail ein.
            </p>
          ) : null}
          {copy === "manuell" ? (
            <div className="mt-3">
              <p className="text-[14px]">
                Kopieren ging nicht automatisch. Tipp ins Feld und kopier den
                Link.
              </p>
              <input
                ref={urlRef}
                readOnly
                value={url}
                aria-label="Link zum Angebot"
                onFocus={(e) => e.currentTarget.select()}
                className="border-border bg-background mt-2 h-12 w-full rounded-[4px] border px-3 font-mono text-base"
              />
            </div>
          ) : (
            <p className="text-muted-foreground mt-3 font-mono text-[12.5px] leading-snug break-all">
              {url}
            </p>
          )}

          {freigabe ? (
            <div className="border-border mt-4 border-t pt-3">
              <button
                type="button"
                onClick={close}
                className={cn(BTN, "bg-foreground text-background w-full")}
              >
                Fertig
              </button>
            </div>
          ) : (
            <div className="border-border mt-4 border-t pt-3">
              {copy !== "idle" ? (
                <p className="text-[15px] font-medium">Link erneut verschickt?</p>
              ) : (
                <p className="text-muted-foreground text-[14px]">
                  Schon auf anderem Weg erneut verschickt?
                </p>
              )}
              <button
                type="button"
                onClick={markSent}
                disabled={pending}
                className={cn(
                  "mt-2 inline-flex h-11 items-center gap-2 rounded-[3px] px-4 text-[15px] font-medium disabled:opacity-60",
                  copy !== "idle"
                    ? "bg-foreground text-background"
                    : "border-border bg-background hover:border-foreground/40 border",
                )}
              >
                {pending ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : null}
                Erneutes Senden vermerken
              </button>
            </div>
          )}
        </div>
      )}

      {error ? (
        <p role="alert" className="text-ink-olive mt-3 text-[14px]">
          {error}
        </p>
      ) : null}
    </BottomSheet>
  );
}
