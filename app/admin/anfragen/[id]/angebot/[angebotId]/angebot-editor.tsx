"use client";

import {
  Check,
  ExternalLink,
  Loader2,
  Plus,
  RotateCw,
  Send,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";

import type { SaveAngebotResult } from "@/app/admin/angebot-actions";
import type {
  EditorForm,
  EditorState,
  EditorZeile,
} from "@/app/admin/anfragen/[id]/angebot/[angebotId]/editor-model";
import type {
  Angebot,
  AngebotStatus,
  FeldFehler,
  PositionArt,
} from "@/lib/admin/angebote";

import {
  discardAngebotAction,
  saveAngebotAction,
} from "@/app/admin/angebot-actions";
import { EditorBackLink } from "@/app/admin/anfragen/[id]/angebot/[angebotId]/editor-back-link";
import {
  aendern,
  formAus,
  formKey,
  kontextAus,
  paketAus,
  paketWaehlen,
  payloadAus,
  stateAus,
  stateAusEntwurf,
  summenAus,
  zeileNetto,
} from "@/app/admin/anfragen/[id]/angebot/[angebotId]/editor-model";
import {
  ANGEBOT_PILL,
  vorschauPfad,
} from "@/app/admin/anfragen/[id]/angebot-format";
import { AngebotSendSheet } from "@/app/admin/anfragen/[id]/angebot-send-sheet";
import {
  openedFromAdmin,
  readAngebotDraft,
  writeAngebotDraft,
} from "@/app/admin/client-state";
import { Disclosure } from "@/app/admin/disclosure";
import { kickRender } from "@/app/admin/render-kick";
import { runAction } from "@/app/admin/run-action";
import {
  ANGEBOT_GRENZEN,
  centZuEingabe,
  formatDatumLang,
  formatEuro,
  istBearbeitbar,
  leerePosition,
  paketPositionen,
  parseEuroEingabe,
  standardHinweise,
} from "@/lib/admin/angebote";
import { addDays } from "@/lib/admin/berlin-time";
import { PAKETE } from "@/lib/pakete-data";
import { cn } from "@/lib/utils";

const CARD = "border-border bg-card mt-4 rounded-[4px] border p-4";
const H2 = "text-[16px] font-semibold";
const LABEL = "block text-[14px] font-medium";
const INPUT =
  "border-border bg-background focus:border-foreground/60 aria-[invalid=true]:border-ink-olive mt-1 block h-12 w-full rounded-[4px] border px-3.5 text-base outline-none disabled:opacity-70";
const AREA =
  "border-border bg-background focus:border-foreground/60 aria-[invalid=true]:border-ink-olive mt-1 block w-full resize-y rounded-[4px] border px-3.5 py-3 text-base leading-relaxed outline-none [field-sizing:content] disabled:opacity-70";
const CHIP =
  "border-border bg-background hover:border-foreground/40 inline-flex h-11 items-center justify-center rounded-[3px] border px-3 text-[14.5px] font-medium transition-colors disabled:opacity-50";
const SEG =
  "inline-flex h-11 flex-1 items-center justify-center px-3 text-[14.5px] font-medium transition-colors";

type Problem = {
  kind: "fehler" | "konflikt" | "gesperrt" | "gone" | "netz";
  text: string;
};

type Saved = { key: string; updatedAt: string; angebot: Angebot };

function isTextField(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  if (el.closest("dialog")) return false;
  if (el instanceof HTMLTextAreaElement) return true;
  if (el instanceof HTMLInputElement) {
    return ![
      "button",
      "submit",
      "checkbox",
      "radio",
      "hidden",
      "reset",
      "date",
    ].includes(el.type);
  }
  return false;
}

/** Feldpfad der Server-Prüfung für ein Feld einer Zeile. */
const posKey = (
  i: number,
  feld: "titel" | "beschreibung" | "menge" | "preis_cent" | "art",
) => `positionen.${i}.${feld}`;

/**
 * Angebots-Editor (iPhone zuerst): Kunde, Paket-Raster, Positionen,
 * Texte, Bedingungen, Summen. Unten klebt die Leiste mit den Summen und
 * „Speichern“ (sauber gespeichert: „Senden“).
 *
 * Keine Datenverluste: Ungespeichertes steht im Sitzungsspeicher und
 * kommt nach Zurück/Neuladen wieder; Links aus dem Editor heraus und
 * Neuladen fragen vorher nach. Konflikte (anderswo gespeichert) werden
 * nicht still überschrieben.
 */
export function AngebotEditor({
  angebot,
  leadName,
  statusText,
  pill,
  todayIso,
}: {
  angebot: Angebot;
  leadName: string;
  statusText: string;
  pill: { key: AngebotStatus | "abgelaufen"; label: string };
  todayIso: string;
}) {
  const router = useRouter();
  const leadId = angebot.lead_id;
  const [state, setState] = useState<EditorState>(() => stateAus(angebot));
  const [saved, setSaved] = useState<Saved>(() => ({
    key: formKey(formAus(angebot)),
    updatedAt: angebot.updated_at,
    angebot,
  }));
  const [fehler, setFehler] = useState<FeldFehler>({});
  const [problem, setProblem] = useState<Problem | null>(null);
  const [savedNote, setSavedNote] = useState<string | null>(null);
  const [restored, setRestored] = useState(false);
  const [removed, setRemoved] = useState<{
    zeile: EditorZeile;
    index: number;
  } | null>(null);
  const [sending, setSending] = useState(0);
  const [sentNow, setSentNow] = useState(false);
  const [keyboard, setKeyboard] = useState(false);
  const [discardOpen, setDiscardOpen] = useState(false);
  const [discarded, setDiscarded] = useState(false);
  const [pending, start] = useTransition();
  const leaving = useRef(false);
  const focusId = useRef<string | null>(null);
  const focusError = useRef(false);

  // Status kommt nach jeder Aktion frisch vom Server (revalidatePath);
  // direkt nach „Gesendet“ gilt bis dahin der eigene Stand.
  const status: AngebotStatus =
    sentNow && angebot.status === "entwurf" ? "gesendet" : angebot.status;
  const editable = istBearbeitbar(status);
  const form = state.form;
  const dirty = editable && formKey(form) !== saved.key;
  const summen = summenAus(form);
  const paket = paketAus(form);

  // --- Entwurf aus dem Sitzungsspeicher (nach Zurück/Neuladen) ---
  useEffect(() => {
    const d = readAngebotDraft(angebot.id);
    if (!d) return;
    const back =
      d.base === angebot.updated_at && istBearbeitbar(angebot.status)
        ? stateAusEntwurf(d.data)
        : null;
    if (back && formKey(back.form) !== formKey(formAus(angebot))) {
      setState(back);
      setRestored(true);
    } else {
      writeAngebotDraft(angebot.id, null);
    }
    // Nur beim ersten Anzeigen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!editable || leaving.current) return;
    writeAngebotDraft(
      angebot.id,
      dirty ? { base: saved.updatedAt, at: Date.now(), data: state } : null,
    );
  }, [state, dirty, editable, saved.updatedAt, angebot.id]);

  // --- Warnung beim Verlassen mit ungespeicherten Änderungen ---
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (leaving.current) return;
      e.preventDefault();
      e.returnValue = "";
    };
    // Links innerhalb des Admins (Zurück, Logo …): erst fragen.
    const onClick = (e: MouseEvent) => {
      if (leaving.current || e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]");
      if (!(a instanceof HTMLAnchorElement)) return;
      if (a.target === "_blank" || a.hasAttribute("download")) return;
      if (
        a.origin !== window.location.origin ||
        a.pathname === window.location.pathname
      )
        return;
      if (
        window.confirm(
          "Deine Änderungen am Angebot sind noch nicht gespeichert. Verwerfen und weiter?",
        )
      ) {
        leaving.current = true;
        writeAngebotDraft(angebot.id, null);
        return;
      }
      e.preventDefault();
      e.stopPropagation();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      document.removeEventListener("click", onClick, true);
    };
  }, [dirty, angebot.id]);

  // --- Tastatur offen: Leiste am iPhone ausblenden (wie die Daumenleiste) ---
  useEffect(() => {
    const onIn = (e: FocusEvent) => {
      if (isTextField(e.target)) setKeyboard(true);
    };
    const onOut = () => {
      window.setTimeout(
        () => setKeyboard(isTextField(document.activeElement)),
        50,
      );
    };
    document.addEventListener("focusin", onIn);
    document.addEventListener("focusout", onOut);
    return () => {
      document.removeEventListener("focusin", onIn);
      document.removeEventListener("focusout", onOut);
    };
  }, []);

  // Fokus nach „Position hinzufügen“ bzw. auf das erste fehlerhafte Feld.
  useEffect(() => {
    if (focusId.current) {
      document.getElementById(`pos-${focusId.current}-titel`)?.focus();
      focusId.current = null;
    }
    if (focusError.current) {
      focusError.current = false;
      const el = document.querySelector<HTMLElement>(
        '[data-editor] [aria-invalid="true"]',
      );
      el?.focus();
      el?.scrollIntoView({ block: "center" });
    }
  });

  // Bestätigung „Gespeichert“ nach ein paar Sekunden ausblenden.
  useEffect(() => {
    if (!savedNote) return;
    const id = window.setTimeout(() => setSavedNote(null), 6000);
    return () => window.clearTimeout(id);
  }, [savedNote]);

  // --- Ändern ---

  function update(fn: (f: EditorForm) => EditorForm, clear: string[] = []) {
    setState((s) => aendern(s, fn));
    setSavedNote(null);
    if (clear.length) {
      setFehler((prev) => {
        if (!clear.some((k) => k in prev)) return prev;
        const next = { ...prev };
        for (const k of clear) delete next[k];
        return next;
      });
    }
  }

  type TextFeld =
    | "kunde_name"
    | "kunde_firma"
    | "kunde_email"
    | "titel"
    | "einleitung"
    | "hinweise"
    | "gueltig_bis";

  function setFeld(key: TextFeld, value: string) {
    update((f) => ({ ...f, [key]: value }), [key]);
  }

  function setZeile(
    i: number,
    patch: Partial<EditorZeile>,
    feld: Parameters<typeof posKey>[1],
  ) {
    update(
      (f) => ({
        ...f,
        zeilen: f.zeilen.map((z, j) => (j === i ? { ...z, ...patch } : z)),
      }),
      [posKey(i, feld), `positionen.${i}`],
    );
  }

  /** Nach Hinzufügen/Entfernen passen die Feldpfade nicht mehr: Positionsfehler leeren. */
  function clearPositionFehler() {
    setFehler((prev) => {
      const next: FeldFehler = {};
      for (const [k, v] of Object.entries(prev))
        if (!k.startsWith("positionen")) next[k] = v;
      return next;
    });
  }

  function addZeile() {
    const neu = leerePosition("einmalig");
    focusId.current = neu.id;
    update((f) => ({
      ...f,
      zeilen: [...f.zeilen, { ...neu, menge: "1", preis: "" }],
    }));
    clearPositionFehler();
    setRemoved(null);
  }

  function removeZeile(i: number) {
    const zeile = form.zeilen[i];
    if (!zeile) return;
    setRemoved({ zeile, index: i });
    update((f) => ({ ...f, zeilen: f.zeilen.filter((_, j) => j !== i) }));
    clearPositionFehler();
  }

  function undoRemove() {
    if (!removed) return;
    const { zeile, index } = removed;
    setRemoved(null);
    update((f) => {
      const zeilen = [...f.zeilen];
      zeilen.splice(Math.min(index, zeilen.length), 0, zeile);
      return { ...f, zeilen };
    });
    clearPositionFehler();
  }

  // --- Speichern ---

  function save(force: boolean) {
    if (pending || !editable) return;
    const sentKey = formKey(form);
    const body = payloadAus(form);
    setProblem(null);
    start(async () => {
      const res: SaveAngebotResult | { ok: false; error: string } =
        await runAction(() =>
          saveAngebotAction(angebot.id, body, force ? null : saved.updatedAt),
        );
      if (!res.ok) {
        if ("fehler" in res && res.fehler) {
          setFehler(res.fehler);
          focusError.current = true;
          setProblem({ kind: "fehler", text: res.error });
        } else if ("konflikt" in res && res.konflikt) {
          setProblem({ kind: "konflikt", text: res.error });
        } else if ("gesperrt" in res && res.gesperrt) {
          setProblem({ kind: "gesperrt", text: res.error });
        } else if ("gone" in res && res.gone) {
          setProblem({ kind: "gone", text: res.error });
        } else {
          setProblem({ kind: "netz", text: res.error });
        }
        return;
      }
      const a = res.angebot;
      const f = formAus(a);
      setSaved({ key: formKey(f), updatedAt: a.updated_at, angebot: a });
      // Server-Fassung übernehmen (leere Zeilen weg, Beträge „1.299,50“),
      // außer es wurde während des Speicherns weitergetippt.
      setState((s) =>
        formKey(s.form) === sentKey ? { form: f, kontext: kontextAus(f) } : s,
      );
      setFehler({});
      setRestored(false);
      setSavedNote(
        status === "gesendet"
          ? "Gespeichert. Der Kunde sieht den neuen Stand."
          : "Gespeichert.",
      );
    });
  }

  function reload() {
    leaving.current = true;
    writeAngebotDraft(angebot.id, null);
    window.location.reload();
  }

  function discardRestored() {
    setState(stateAus(saved.angebot));
    setRestored(false);
    setFehler({});
    writeAngebotDraft(angebot.id, null);
  }

  function discardEntwurf() {
    setProblem(null);
    start(async () => {
      const res = await runAction(() => discardAngebotAction(angebot.id));
      if (!res.ok) {
        setProblem({ kind: "netz", text: res.error });
        return;
      }
      leaving.current = true;
      writeAngebotDraft(angebot.id, null);
      setDiscarded(true);
    });
  }

  // Nach dem Verwerfen zurück zur Anfrage, erst wenn die Action fertig
  // ist (nicht in derselben Transition, sonst bleibt die Navigation
  // gelegentlich hängen).
  useEffect(() => {
    if (!discarded) return;
    if (openedFromAdmin(window.location.pathname) && window.history.length > 1)
      router.back();
    else router.replace(`/admin/anfragen/${leadId}`);
    kickRender();
  }, [discarded, leadId, router]);

  const invalid = (key: string) => (fehler[key] ? true : undefined);
  const describedBy = (id: string, key: string) =>
    fehler[key] ? `${id}-fehler` : undefined;
  const fehlerText = (id: string, k: string) =>
    fehler[k] ? (
      <p id={`${id}-fehler`} className="text-ink-olive mt-1 text-[14px]">
        {fehler[k]}
      </p>
    ) : null;

  const vergangen = form.gueltig_bis !== "" && form.gueltig_bis < todayIso;
  // Direkt nach „Gesendet“, bis der Server den neuen Stand liefert.
  const justSent = sentNow && angebot.status === "entwurf";
  const shownPill = justSent
    ? { key: "gesendet" as const, label: "Gesendet" }
    : pill;
  const shownStatus = justSent ? "Gerade gesendet" : statusText;
  const sendAngebot = { ...saved.angebot, status };

  return (
    <div data-editor="" data-dirty={dirty ? "true" : undefined}>
      <EditorBackLink leadId={leadId} label={leadName} />

      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
        <span
          className={cn(
            "rounded-[3px] px-2 py-0.5 text-[12.5px] font-medium",
            ANGEBOT_PILL[shownPill.key],
          )}
        >
          {shownPill.label}
        </span>
        {shownStatus !== shownPill.label ? (
          <span className="text-muted-foreground text-[13.5px]">
            {shownStatus}
          </span>
        ) : null}
      </div>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-x-4 gap-y-2">
        <h1 className="text-[24px] leading-tight font-semibold tracking-tight tabular-nums lg:text-[28px]">
          Angebot {angebot.nummer}
        </h1>
        <a
          href={vorschauPfad(angebot.token)}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(CHIP, "gap-2")}
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          {editable ? "Vorschau" : "Kundenansicht"}
        </a>
      </div>
      {dirty ? (
        <p className="text-muted-foreground mt-1 text-[13px]">
          Die Vorschau zeigt den gespeicherten Stand.
        </p>
      ) : null}

      {restored ? (
        <div
          role="status"
          className="border-gold bg-card mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-[4px] border-2 py-1 pr-1 pl-4 text-[15px]"
        >
          <p className="min-w-0 flex-1 py-2">
            Deine ungespeicherten Änderungen von vorhin sind wieder da.
          </p>
          <button
            type="button"
            onClick={discardRestored}
            className="inline-flex h-11 items-center px-3 font-medium underline underline-offset-4"
          >
            Verwerfen
          </button>
        </div>
      ) : null}

      {!editable ? (
        <p className="border-border bg-card mt-4 rounded-[4px] border p-4 text-[15px] leading-relaxed">
          <strong>{statusText}.</strong> Das Angebot lässt sich nicht mehr
          ändern.{" "}
          {status === "zurueckgezogen" || status === "abgelehnt"
            ? "Für einen neuen Anlauf erstellst du auf der Anfrage ein neues Angebot."
            : null}
        </p>
      ) : status === "gesendet" ? (
        <p className="border-border bg-card mt-4 rounded-[4px] border p-4 text-[15px] leading-relaxed">
          Schon gesendet: Nach dem Speichern sieht der Kunde die Änderungen
          sofort unter seinem Link. Bei größeren Änderungen schick es ihm
          erneut.
        </p>
      ) : null}

      <fieldset disabled={!editable} className="min-w-0">
        <legend className="sr-only">Angebot {angebot.nummer}</legend>

        {/* Kunde */}
        <section aria-labelledby="ed-kunde" className={CARD}>
          <h2 id="ed-kunde" className={H2}>
            Kunde
          </h2>
          <div className="mt-2 space-y-3 lg:grid lg:grid-cols-2 lg:space-y-0 lg:gap-x-4 lg:gap-y-3">
            <div>
              <label htmlFor="ed-name" className={LABEL}>
                Name
              </label>
              <input
                id="ed-name"
                value={form.kunde_name}
                onChange={(e) => setFeld("kunde_name", e.target.value)}
                maxLength={ANGEBOT_GRENZEN.kundeName}
                autoComplete="off"
                aria-invalid={invalid("kunde_name")}
                aria-describedby={describedBy("ed-name", "kunde_name")}
                className={INPUT}
              />
              {fehlerText("ed-name", "kunde_name")}
            </div>
            <div>
              <label htmlFor="ed-firma" className={LABEL}>
                Firma{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </label>
              <input
                id="ed-firma"
                value={form.kunde_firma}
                onChange={(e) => setFeld("kunde_firma", e.target.value)}
                maxLength={ANGEBOT_GRENZEN.kundeFirma}
                autoComplete="off"
                aria-invalid={invalid("kunde_firma")}
                aria-describedby={describedBy("ed-firma", "kunde_firma")}
                className={INPUT}
              />
              {fehlerText("ed-firma", "kunde_firma")}
            </div>
            <div className="lg:col-span-2">
              <label htmlFor="ed-email" className={LABEL}>
                E-Mail{" "}
                <span className="text-muted-foreground font-normal">
                  (für „Per Mail senden“)
                </span>
              </label>
              <input
                id="ed-email"
                type="email"
                inputMode="email"
                autoCapitalize="off"
                autoCorrect="off"
                spellCheck={false}
                autoComplete="off"
                value={form.kunde_email}
                onChange={(e) => setFeld("kunde_email", e.target.value)}
                maxLength={254}
                aria-invalid={invalid("kunde_email")}
                aria-describedby={describedBy("ed-email", "kunde_email")}
                className={INPUT}
              />
              {fehlerText("ed-email", "kunde_email")}
            </div>
          </div>
        </section>

        {/* Paket */}
        <section aria-labelledby="ed-paket" className={CARD}>
          <h2 id="ed-paket" className={H2}>
            Paket
          </h2>
          <p className="text-muted-foreground mt-0.5 text-[14px]">
            Tauscht nur die beiden Paket-Positionen. Eigene Positionen bleiben.
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-4">
            {PAKETE.map((p) => {
              const [e, m] = paketPositionen(p.slug);
              const on = paket === p.slug;
              return (
                <button
                  key={p.slug}
                  type="button"
                  aria-pressed={on}
                  onClick={() => {
                    update((f) => paketWaehlen(f, p.slug));
                    clearPositionFehler();
                  }}
                  className={cn(
                    "flex min-h-[4.5rem] flex-col items-start justify-center rounded-[4px] border px-3 py-2 text-left transition-colors disabled:opacity-70",
                    on
                      ? "border-foreground bg-foreground text-background"
                      : "border-border bg-background hover:border-foreground/40",
                  )}
                >
                  <span className="flex w-full items-center justify-between gap-1 text-[15.5px] font-semibold">
                    {p.name}
                    {on ? (
                      <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
                    ) : null}
                  </span>
                  <span
                    className={cn(
                      "text-[13.5px] tabular-nums",
                      on ? "text-background/80" : "text-muted-foreground",
                    )}
                  >
                    {centZuEingabe(e.preis_cent)} € +{" "}
                    {centZuEingabe(m.preis_cent)} €/Monat
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Positionen */}
        <section aria-labelledby="ed-pos" className={CARD}>
          <h2 id="ed-pos" className={H2}>
            Positionen{form.zeilen.length ? ` (${form.zeilen.length})` : ""}
          </h2>
          <p className="text-muted-foreground mt-0.5 text-[14px]">
            Preise netto, je Stück.
          </p>
          {fehler.positionen ? (
            <p className="text-ink-olive mt-2 text-[14px]">
              {fehler.positionen}
            </p>
          ) : null}
          {form.zeilen.length === 0 ? (
            <p className="border-border text-muted-foreground mt-3 rounded-[4px] border border-dashed p-4 text-[15px]">
              Noch keine Position. Wähl oben ein Paket oder füg eine Position
              hinzu.
            </p>
          ) : (
            <ol className="mt-3 space-y-3">
              {form.zeilen.map((z, i) => (
                <PositionZeile
                  key={z.id}
                  zeile={z}
                  index={i}
                  fehler={fehler}
                  onChange={(patch, feld) => setZeile(i, patch, feld)}
                  onRemove={() => removeZeile(i)}
                />
              ))}
            </ol>
          )}
          {removed ? (
            <p
              role="status"
              className="mt-2 flex flex-wrap items-center gap-x-2 text-[14.5px]"
            >
              <span className="min-w-0">
                „{removed.zeile.titel.trim() || "Leere Position"}“ entfernt.
              </span>
              <button
                type="button"
                onClick={undoRemove}
                className="inline-flex h-11 items-center font-semibold underline underline-offset-4"
              >
                Rückgängig
              </button>
            </p>
          ) : null}
          <button
            type="button"
            onClick={addZeile}
            disabled={form.zeilen.length >= ANGEBOT_GRENZEN.positionenMax}
            className={cn(CHIP, "mt-3 w-full gap-2 sm:w-auto sm:px-5")}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Position hinzufügen
          </button>
        </section>

        {/* Texte */}
        <section aria-labelledby="ed-texte" className={CARD}>
          <h2 id="ed-texte" className={H2}>
            Texte für den Kunden
          </h2>
          <div className="mt-2 space-y-3">
            <div>
              <label htmlFor="ed-titel" className={LABEL}>
                Titel
              </label>
              <textarea
                id="ed-titel"
                value={form.titel}
                onChange={(e) => setFeld("titel", einzeilig(e.target.value))}
                onKeyDown={keinUmbruch}
                maxLength={ANGEBOT_GRENZEN.titel}
                rows={1}
                aria-invalid={invalid("titel")}
                aria-describedby={describedBy("ed-titel", "titel")}
                className={cn(AREA, "min-h-12 resize-none py-2.5")}
              />
              {fehlerText("ed-titel", "titel")}
            </div>
            <div>
              <label htmlFor="ed-einleitung" className={LABEL}>
                Einleitung
              </label>
              <textarea
                id="ed-einleitung"
                value={form.einleitung}
                onChange={(e) => setFeld("einleitung", e.target.value)}
                maxLength={ANGEBOT_GRENZEN.einleitung}
                rows={5}
                aria-invalid={invalid("einleitung")}
                aria-describedby={describedBy("ed-einleitung", "einleitung")}
                className={cn(AREA, "min-h-32")}
              />
              {fehlerText("ed-einleitung", "einleitung")}
            </div>
            <div>
              <div className="flex flex-wrap items-end justify-between gap-x-3">
                <label htmlFor="ed-hinweise" className={LABEL}>
                  Hinweise
                </label>
                {editable ? (
                  <button
                    type="button"
                    onClick={() => {
                      const std = standardHinweise(state.kontext);
                      if (form.hinweise === std) return;
                      if (
                        form.hinweise.trim() &&
                        !window.confirm(
                          "Hinweise durch den Standardtext ersetzen? Eigene Sätze gehen dabei verloren.",
                        )
                      ) {
                        return;
                      }
                      setFeld("hinweise", std);
                    }}
                    className="text-muted-foreground hover:text-foreground inline-flex h-9 items-center text-[13.5px] underline underline-offset-4"
                  >
                    Standardtext einsetzen
                  </button>
                ) : null}
              </div>
              <textarea
                id="ed-hinweise"
                value={form.hinweise}
                onChange={(e) => setFeld("hinweise", e.target.value)}
                maxLength={ANGEBOT_GRENZEN.hinweise}
                rows={9}
                aria-invalid={invalid("hinweise")}
                aria-describedby={cn(
                  "ed-hinweise-info",
                  describedBy("ed-hinweise", "hinweise"),
                )}
                className={cn(AREA, "min-h-48 text-[15px]")}
              />
              <p
                id="ed-hinweise-info"
                className="text-muted-foreground mt-1 text-[13px] leading-snug"
              >
                Standardsätze zu Ablauf, Monatsbeitrag, Umsatzsteuer und
                Gültigkeit passen sich an, solange du sie nicht umformulierst.
              </p>
              {fehlerText("ed-hinweise", "hinweise")}
            </div>
          </div>
        </section>

        {/* Bedingungen */}
        <section aria-labelledby="ed-bed" className={CARD}>
          <h2 id="ed-bed" className={H2}>
            Bedingungen
          </h2>
          <div className="mt-2 space-y-4 lg:grid lg:grid-cols-2 lg:space-y-0 lg:gap-x-6">
            <div>
              <label htmlFor="ed-gueltig" className={LABEL}>
                Gültig bis
              </label>
              <input
                id="ed-gueltig"
                type="date"
                value={form.gueltig_bis}
                min={todayIso}
                onChange={(e) => setFeld("gueltig_bis", e.target.value)}
                aria-invalid={
                  invalid("gueltig_bis") ?? (vergangen ? true : undefined)
                }
                aria-describedby={describedBy("ed-gueltig", "gueltig_bis")}
                className={cn(INPUT, "appearance-none")}
              />
              {fehlerText("ed-gueltig", "gueltig_bis")}
              {vergangen && !fehler.gueltig_bis ? (
                <p className="text-ink-olive mt-1 text-[14px]">
                  Liegt in der Vergangenheit. So lässt sich das Angebot nicht
                  senden.
                </p>
              ) : null}
              <div className="mt-2 flex flex-wrap gap-2">
                {[14, 30, 60].map((n) => {
                  const iso = addDays(todayIso, n);
                  return (
                    <button
                      key={n}
                      type="button"
                      aria-pressed={form.gueltig_bis === iso}
                      onClick={() => setFeld("gueltig_bis", iso)}
                      className={cn(
                        CHIP,
                        "aria-pressed:border-foreground aria-pressed:bg-foreground aria-pressed:text-background",
                      )}
                    >
                      {n === 14 ? "2 Wochen" : `${n} Tage`}
                    </button>
                  );
                })}
              </div>
              {form.gueltig_bis && !vergangen ? (
                <p className="text-muted-foreground mt-1.5 text-[13px]">
                  Gilt bis einschließlich {formatDatumLang(form.gueltig_bis)}.
                </p>
              ) : null}
            </div>
            {/* Steuersatz ist keine Frage pro Angebot: Ein Betrieb ist
                entweder Kleinunternehmer oder nicht. Er kommt fest aus
                ANGEBOT_UST_SATZ (der Server setzt ihn beim Speichern). */}
            <div>
              <p className={LABEL}>Umsatzsteuer</p>
              <p className="border-border bg-secondary/40 mt-1 flex h-12 items-center rounded-[4px] border px-3.5 text-[15px] font-medium">
                {form.ust_satz === 19 ? "19 % USt" : "Keine (§ 19 UStG)"}
              </p>
              <p className="text-muted-foreground mt-1.5 text-[13px] leading-snug">
                {form.ust_satz === 19
                  ? "Preise netto, auf dem Angebot kommen 19 % USt dazu. "
                  : "Kleinunternehmer: Auf dem Angebot steht der Satz nach § 19 UStG. "}
                Gilt für alle Angebote, einstellbar in Vercel (ANGEBOT_UST_SATZ).
              </p>
            </div>
          </div>
        </section>
      </fieldset>

      {/* Summen */}
      <section aria-labelledby="ed-summen" className={CARD}>
        <h2 id="ed-summen" className={H2}>
          Summen
        </h2>
        <SummenTabelle summen={summen} />
      </section>

      {status === "entwurf" && editable ? (
        <Disclosure
          className="mt-4"
          summaryClassName="text-[15px] font-medium"
          title="Entwurf verwerfen"
        >
          <p className="text-muted-foreground text-[14px] leading-relaxed">
            Löscht diesen Entwurf. Im Verlauf der Anfrage bleibt nur „
            {angebot.nummer} (Entwurf) verworfen“.
          </p>
          {discardOpen ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={discardEntwurf}
                disabled={pending}
                className="bg-ink-olive inline-flex h-11 grow items-center justify-center gap-2 rounded-[3px] px-4 text-[15px] font-semibold text-white disabled:opacity-60"
              >
                {pending ? (
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                ) : null}
                Ja, Entwurf löschen
              </button>
              <button
                type="button"
                onClick={() => setDiscardOpen(false)}
                className={cn(CHIP, "grow")}
              >
                Abbrechen
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setDiscardOpen(true)}
              className={cn(CHIP, "text-ink-olive mt-3 gap-2")}
            >
              <Trash2 className="h-4 w-4" aria-hidden="true" />
              Entwurf löschen
            </button>
          )}
        </Disclosure>
      ) : null}

      {/* Meldungen über der Leiste */}
      {problem ? (
        <div
          role="alert"
          className="border-ink-olive/40 bg-card mt-4 rounded-[4px] border-2 p-4 text-[15px] leading-relaxed"
        >
          <p className="font-semibold">{problem.text}</p>
          {problem.kind === "konflikt" ? (
            <>
              <p className="mt-1">
                Zum Beispiel auf einem anderen Gerät. Du kannst neu laden (deine
                Änderungen hier gehen dann verloren) oder deine Fassung trotzdem
                speichern.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => save(true)}
                  disabled={pending}
                  className="bg-foreground text-background inline-flex h-11 grow items-center justify-center rounded-[3px] px-4 text-[15px] font-medium disabled:opacity-60"
                >
                  Meine Fassung speichern
                </button>
                <button
                  type="button"
                  onClick={reload}
                  className={cn(CHIP, "grow gap-2")}
                >
                  <RotateCw className="h-4 w-4" aria-hidden="true" />
                  Neu laden
                </button>
              </div>
            </>
          ) : problem.kind === "gesperrt" || problem.kind === "gone" ? (
            <button
              type="button"
              onClick={reload}
              className={cn(CHIP, "mt-3 gap-2")}
            >
              <RotateCw className="h-4 w-4" aria-hidden="true" />
              Neu laden
            </button>
          ) : null}
        </div>
      ) : null}

      {/* Leiste: Summen live, Speichern bzw. Senden */}
      {editable ? (
        <div
          className={cn(
            "bg-card border-border sticky bottom-0 z-30 mt-4 border-t shadow-[0_-4px_16px_rgba(0,0,0,0.08)]",
            "-mx-4 px-4 pt-2.5 pb-[calc(env(safe-area-inset-bottom)+0.625rem)]",
            "lg:bottom-4 lg:mx-0 lg:rounded-[4px] lg:border lg:pb-2.5",
            keyboard && "max-lg:hidden",
          )}
        >
          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1 leading-tight tabular-nums">
              <p className="text-[15.5px] font-semibold">
                {formatEuro(summen.einmalig.netto)}{" "}
                <span className="text-muted-foreground text-[13.5px] font-normal">
                  einmalig
                </span>
              </p>
              {summen.monatlich.netto > 0 ? (
                <p className="mt-0.5 text-[14.5px] font-medium">
                  + {formatEuro(summen.monatlich.netto)}{" "}
                  <span className="text-muted-foreground text-[13.5px] font-normal">
                    monatlich
                  </span>
                </p>
              ) : null}
              <p className="mt-0.5 text-[12.5px]">
                <span className="text-muted-foreground">
                  {form.ust_satz === 19 ? "netto, zzgl. USt" : "ohne USt"}
                </span>
                {" · "}
                {dirty ? (
                  <span className="text-gold-ink font-medium">
                    nicht gespeichert
                  </span>
                ) : savedNote ? (
                  <span role="status" className="text-ink-petrol font-medium">
                    gespeichert
                  </span>
                ) : (
                  <span className="text-muted-foreground">gespeichert</span>
                )}
              </p>
            </div>
            {dirty || problem?.kind === "netz" ? (
              <button
                type="button"
                onClick={() => save(false)}
                disabled={pending}
                className="bg-foreground text-background inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-[3px] px-5 text-[16px] font-medium disabled:opacity-60"
              >
                {pending ? (
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                ) : null}
                {pending
                  ? "Speichert …"
                  : problem?.kind === "netz"
                    ? "Nochmal"
                    : "Speichern"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setSending((n) => n + 1)}
                className="bg-foreground text-background inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-[3px] px-5 text-[16px] font-medium"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                {status === "gesendet" ? "Erneut senden" : "Senden"}
              </button>
            )}
          </div>
          {savedNote ? (
            <p className="text-ink-petrol mt-1 text-[13.5px] font-medium">
              {savedNote}
            </p>
          ) : null}
        </div>
      ) : null}

      {sending > 0 ? (
        <AngebotSendSheet
          key={sending}
          open
          angebot={sendAngebot}
          onClose={() => setSending(0)}
          onSent={({ anfrageInArbeit, erstmals }) => {
            setSending(0);
            setSentNow(true);
            setSavedNote(
              `${angebot.nummer} ${erstmals ? "freigegeben und als gesendet" : "erneut als gesendet"} vermerkt.${
                anfrageInArbeit
                  ? " Die Anfrage steht jetzt auf „In Arbeit“."
                  : ""
              }`,
            );
          }}
        />
      ) : null}
    </div>
  );
}

/** Eine Position: Bezeichnung, Beschreibung, Menge × Preis, einmalig/monatlich. */
function PositionZeile({
  zeile,
  index,
  fehler,
  onChange,
  onRemove,
}: {
  zeile: EditorZeile;
  index: number;
  fehler: FeldFehler;
  onChange: (
    patch: Partial<EditorZeile>,
    feld: Parameters<typeof posKey>[1],
  ) => void;
  onRemove: () => void;
}) {
  const id = `pos-${zeile.id}`;
  const netto = zeileNetto(zeile);
  const f = (feld: Parameters<typeof posKey>[1]) => fehler[posKey(index, feld)];
  const errId = (feld: string) => `${id}-${feld}-fehler`;
  const err = (feld: Parameters<typeof posKey>[1]) =>
    f(feld) ? (
      <p id={errId(feld)} className="text-ink-olive mt-1 text-[14px]">
        {f(feld)}
      </p>
    ) : null;
  const paketZeile = /^paket-/.test(zeile.id);

  return (
    <li className="border-border bg-background rounded-[4px] border p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="label-mono text-muted-foreground text-[11px]">
          Position {index + 1}
          {paketZeile ? " · Paket" : ""}
        </p>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Position ${index + 1} entfernen`}
          className="text-muted-foreground hover:text-foreground -my-2 -mr-2 inline-flex h-11 w-11 items-center justify-center rounded-[3px]"
        >
          <Trash2 className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <label htmlFor={`${id}-titel`} className={cn(LABEL, "mt-1")}>
        Bezeichnung
      </label>
      <textarea
        id={`${id}-titel`}
        value={zeile.titel}
        onChange={(e) =>
          onChange({ titel: einzeilig(e.target.value) }, "titel")
        }
        onKeyDown={keinUmbruch}
        maxLength={ANGEBOT_GRENZEN.positionTitel}
        rows={1}
        aria-invalid={f("titel") ? true : undefined}
        aria-describedby={f("titel") ? errId("titel") : undefined}
        className={cn(AREA, "min-h-12 resize-none py-2.5")}
      />
      {err("titel")}

      <label htmlFor={`${id}-beschreibung`} className={cn(LABEL, "mt-3")}>
        Beschreibung{" "}
        <span className="text-muted-foreground font-normal">(optional)</span>
      </label>
      <textarea
        id={`${id}-beschreibung`}
        value={zeile.beschreibung}
        onChange={(e) =>
          onChange({ beschreibung: e.target.value }, "beschreibung")
        }
        maxLength={ANGEBOT_GRENZEN.positionBeschreibung}
        rows={2}
        aria-invalid={f("beschreibung") ? true : undefined}
        aria-describedby={f("beschreibung") ? errId("beschreibung") : undefined}
        className={cn(AREA, "min-h-[4.75rem] text-[15px] leading-snug")}
      />
      {err("beschreibung")}

      <div className="mt-3 grid grid-cols-[5.5rem_minmax(0,1fr)] gap-2 sm:grid-cols-[5.5rem_16rem]">
        <div>
          <label htmlFor={`${id}-menge`} className={LABEL}>
            Menge
          </label>
          <input
            id={`${id}-menge`}
            inputMode="numeric"
            pattern="[0-9]*"
            value={zeile.menge}
            onChange={(e) =>
              onChange(
                { menge: e.target.value.replace(/\D/g, "").slice(0, 3) },
                "menge",
              )
            }
            aria-invalid={f("menge") ? true : undefined}
            aria-describedby={f("menge") ? errId("menge") : undefined}
            className={cn(INPUT, "text-center tabular-nums")}
          />
        </div>
        <div>
          <label htmlFor={`${id}-preis`} className={LABEL}>
            Einzelpreis netto
          </label>
          <div className="relative">
            <input
              id={`${id}-preis`}
              inputMode="decimal"
              autoComplete="off"
              placeholder="0"
              value={zeile.preis}
              onChange={(e) =>
                onChange({ preis: e.target.value }, "preis_cent")
              }
              onBlur={(e) => {
                // „1299.5“ → „1.299,50“, sobald das Feld verlassen wird.
                const cent = parseEuroOrNull(e.target.value);
                if (cent !== null) {
                  const text = centZuEingabe(cent);
                  if (text !== zeile.preis)
                    onChange({ preis: text }, "preis_cent");
                }
              }}
              aria-invalid={f("preis_cent") ? true : undefined}
              aria-describedby={
                f("preis_cent") ? errId("preis_cent") : undefined
              }
              className={cn(INPUT, "pr-9 text-right tabular-nums")}
            />
            <span
              aria-hidden="true"
              className="text-muted-foreground pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 pt-0.5 text-base"
            >
              €
            </span>
          </div>
        </div>
      </div>
      {err("menge")}
      {err("preis_cent")}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <div
          role="radiogroup"
          aria-label={`Abrechnung Position ${index + 1}`}
          className="border-border flex overflow-hidden rounded-[4px] border"
        >
          {(["einmalig", "monatlich"] as PositionArt[]).map((art) => {
            const on = zeile.art === art;
            return (
              <button
                key={art}
                type="button"
                role="radio"
                aria-checked={on}
                onClick={() => onChange({ art }, "art")}
                className={cn(
                  SEG,
                  "min-w-[6.5rem]",
                  on
                    ? "bg-foreground text-background"
                    : "bg-background hover:bg-secondary",
                )}
              >
                {art}
              </button>
            );
          })}
        </div>
        <p className="text-[14.5px] tabular-nums">
          {netto === null ? (
            zeile.preis.trim() ? (
              <span className="text-ink-olive font-medium">
                Betrag ungültig, z. B. 1.299 oder 1.299,50
              </span>
            ) : (
              <span className="text-muted-foreground">Betrag fehlt</span>
            )
          ) : (
            <>
              <span className="text-muted-foreground">= </span>
              <span className="font-semibold">{formatEuro(netto)}</span>
              {zeile.art === "monatlich" ? (
                <span className="text-muted-foreground"> / Monat</span>
              ) : null}
            </>
          )}
        </p>
      </div>
      {err("art")}
    </li>
  );
}

/** Bezeichnungen sind einzeilig: Enter fügt keinen Umbruch ein. */
function keinUmbruch(e: React.KeyboardEvent<HTMLTextAreaElement>) {
  if (e.key === "Enter") e.preventDefault();
}

/** Eingefügte Umbrüche (z. B. aus einer Mail) werden zu Leerzeichen. */
function einzeilig(v: string): string {
  return v.replace(/[\r\n]+/g, " ");
}

function parseEuroOrNull(text: string): number | null {
  const t = text.trim();
  if (!t) return null;
  // Gleiche Regeln wie beim Speichern (parseEuroEingabe), Grenzen prüft der Server.
  return parseEuroEingabe(t);
}

/** Netto, USt und brutto getrennt nach einmalig und monatlich. */
function SummenTabelle({ summen }: { summen: ReturnType<typeof summenAus> }) {
  const cols: { label: string; s: (typeof summen)["einmalig"] }[] = [
    { label: "Einmalig", s: summen.einmalig },
    ...(summen.monatlich.netto > 0
      ? [{ label: "Monatlich", s: summen.monatlich }]
      : []),
  ];
  const ust = summen.ust_satz === 19;
  return (
    <table className="mt-2 w-full text-[15px] tabular-nums sm:max-w-md">
      <thead>
        <tr className="text-muted-foreground text-[13px]">
          <th scope="col" className="py-1 text-left font-normal">
            <span className="sr-only">Betrag</span>
          </th>
          {cols.map((c) => (
            <th
              key={c.label}
              scope="col"
              className="py-1 text-right font-medium"
            >
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-border divide-y">
        <tr>
          <th scope="row" className="py-1.5 text-left font-normal">
            Netto
          </th>
          {cols.map((c) => (
            <td key={c.label} className="py-1.5 text-right">
              {formatEuro(c.s.netto)}
            </td>
          ))}
        </tr>
        <tr>
          <th
            scope="row"
            className="text-muted-foreground py-1.5 text-left font-normal"
          >
            {ust ? "19 % USt" : "USt (§ 19 UStG)"}
          </th>
          {cols.map((c) => (
            <td
              key={c.label}
              className="text-muted-foreground py-1.5 text-right"
            >
              {formatEuro(c.s.ust)}
            </td>
          ))}
        </tr>
        <tr>
          <th scope="row" className="py-1.5 text-left font-semibold">
            {ust ? "Brutto" : "Gesamt"}
          </th>
          {cols.map((c) => (
            <td key={c.label} className="py-1.5 text-right font-semibold">
              {formatEuro(c.s.brutto)}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}
