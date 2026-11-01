"use client";

import {
  createContext,
  startTransition,
  useActionState,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { ArrowDown, Check, FileDown, Mail, Phone } from "lucide-react";

import type {
  KundenAktionFeld,
  KundenAktionState,
} from "@/app/angebot/angebot-seite";

import {
  angebotAblehnen,
  angebotAnnehmen,
  angebotGeoeffnet,
} from "@/app/angebot/actions";
import { AKTION_LEER, rueckfrageMailHref } from "@/app/angebot/angebot-seite";
import { ANGEBOT_GRENZEN, ANGEBOT_KONTAKT } from "@/lib/admin/angebote";
import { cn } from "@/lib/utils";

import styles from "./angebot.module.css";

// ---------------------------------------------------------------------
// Aufruf melden, Admin-Vorschau erkennen
// ---------------------------------------------------------------------

const VorschauContext = createContext(false);

/** true, wenn der Inhaber eingeloggt ist (Vorschau, nichts zählt). */
function useAdminVorschau(): boolean {
  return useContext(VorschauContext);
}

/**
 * Meldet nach dem Laden einmal „geöffnet“ an den Server, sobald die
 * Seite sichtbar ist (nicht beim Vorladen im Hintergrund). Link-
 * Vorschauen ohne JavaScript zählen so nicht. Der Server prüft, ob
 * der Inhaber eingeloggt ist; dann zählt der Aufruf nicht, und die
 * Seite zeigt die Vorschau-Leiste.
 */
export function AufrufMelder({
  token,
  admin: adminVomServer,
  children,
}: {
  token: string;
  /** Schon beim Rendern bekannt (Entwurf, nur für den Admin sichtbar). */
  admin: boolean;
  children: React.ReactNode;
}) {
  const [admin, setAdmin] = useState(adminVomServer);

  useEffect(() => {
    if (adminVomServer) return;
    let aktiv = true;
    let gemeldet = false;
    const melden = () => {
      if (gemeldet || document.visibilityState !== "visible") return;
      gemeldet = true;
      document.removeEventListener("visibilitychange", melden);
      angebotGeoeffnet(token)
        .then((r) => {
          if (aktiv && r.admin) setAdmin(true);
        })
        .catch(() => {});
    };
    melden();
    document.addEventListener("visibilitychange", melden);
    return () => {
      aktiv = false;
      document.removeEventListener("visibilitychange", melden);
    };
  }, [token, adminVomServer]);

  return <VorschauContext value={admin}>{children}</VorschauContext>;
}

/** Schmale Leiste oben, nur für den eingeloggten Inhaber (du-Form). */
export function VorschauLeiste({ entwurf }: { entwurf: boolean }) {
  const admin = useAdminVorschau();
  if (!admin) return null;
  return (
    <div
      className={cn(
        styles.nichtDrucken,
        "bg-foreground text-background px-4 py-2.5 text-[13.5px] leading-snug sm:px-6",
      )}
    >
      <p className="mx-auto max-w-[54rem]">
        <span className="label-mono text-gold mr-2">Vorschau</span>
        {entwurf
          ? "Du bist als Admin angemeldet. Annehmen und Ablehnen sind hier gesperrt."
          : "Du bist als Admin angemeldet. Dein Aufruf zählt nicht als „geöffnet“, Annehmen und Ablehnen sind hier gesperrt."}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------
// Drucken
// ---------------------------------------------------------------------

/** „Als PDF speichern“: öffnet den Druckdialog (dort „Als PDF sichern“). */
export function DruckKnopf({
  kurz = false,
  className,
}: {
  kurz?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={cn("btn-line", className)}
      aria-label={kurz ? "Als PDF speichern" : undefined}
    >
      <FileDown className="h-4 w-4" aria-hidden="true" />
      {kurz ? <span aria-hidden="true">PDF</span> : "Als PDF speichern"}
    </button>
  );
}

/** Kleiner Sprung zum Annehmen-Formular (oben auf der Seite). */
export function ZumAnnehmen({ className }: { className?: string }) {
  return (
    <a href="#annehmen" className={cn("btn-signal", className)}>
      Annehmen
      <ArrowDown className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}

// ---------------------------------------------------------------------
// Annehmen und Ablehnen
// ---------------------------------------------------------------------

const FELD =
  "border-input bg-background focus-visible:ring-ring focus-visible:ring-offset-card block w-full rounded-[2px] border px-3.5 text-[16px] transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-ink-olive";

function fehlerFeld(
  state: KundenAktionState,
  feld: KundenAktionFeld,
): string | null {
  return state.status === "fehler" && state.feld === feld
    ? state.meldung
    : null;
}

function allgemeinerFehler(state: KundenAktionState): string | null {
  return state.status === "fehler" && !state.feld ? state.meldung : null;
}

/** Unsichtbares Feld gegen Bots (Menschen lassen es leer). */
function Honeypot({ id }: { id: string }) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-[-9999px] h-0 w-0 overflow-hidden"
    >
      {/* Bewusst kein „Website“/„URL“ im Namen: Darauf springt Autofill an. */}
      <label htmlFor={id}>Bitte leer lassen</label>
      <input
        id={id}
        name="sitalo_hp_field"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
}

function Meldung({ id, text }: { id?: string; text: string | null }) {
  if (!text) return null;
  return (
    <p
      id={id}
      role="alert"
      className="text-ink-olive mt-2 text-[14px] leading-snug font-medium"
    >
      {text}
    </p>
  );
}

/**
 * Sendet ein Formular an die Action, ohne dass React es danach
 * zurücksetzt (das passiert nur bei <form action>; ohne JavaScript
 * greift weiter das action-Attribut). So bleiben Name, Häkchen und
 * Grund nach einer Fehlermeldung stehen.
 */
function ohneZuruecksetzen(dispatch: (fd: FormData) => void) {
  return (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(() => dispatch(fd));
  };
}

/**
 * Unterer Bereich eines offenen Angebots: annehmen (Name + Häkchen),
 * Fragen (Anruf, Mail), als PDF speichern, lieber ablehnen.
 *
 * Die Angebote richten sich an Betriebe und Selbstständige (§ 14 BGB),
 * so steht es auch auf der Website bei den Preisen. Der Knopf nennt die
 * Zahlungspflicht ausdrücklich, direkt darüber stehen die Beträge.
 */
export function AnnahmeBereich({
  token,
  nummer,
  kundeName,
  stand,
  preis,
}: {
  token: string;
  nummer: string;
  kundeName: string;
  /** updated_at beim Laden: Angenommen wird nur genau diese Fassung. */
  stand: string;
  /** „899,00 € einmalig und 79,00 € im Monat, jeweils zuzüglich …“ */
  preis: string;
}) {
  const admin = useAdminVorschau();
  const id = useId();
  const annehmenAction = useMemo(
    () => angebotAnnehmen.bind(null, token),
    [token],
  );
  const ablehnenAction = useMemo(
    () => angebotAblehnen.bind(null, token),
    [token],
  );
  const [annahme, annehmen, annimmt] = useActionState(
    annehmenAction,
    AKTION_LEER,
  );
  const [ablehnung, ablehnen, lehntAb] = useActionState(
    ablehnenAction,
    AKTION_LEER,
  );

  const [name, setName] = useState(kundeName);
  // Das Häkchen gilt für den Stand, zu dem es gesetzt wurde. Lädt die
  // Seite nach einer Änderung den neuen Stand, ist es wieder leer.
  const [bestaetigtFuer, setBestaetigtFuer] = useState<string | null>(null);
  const bestaetigt = bestaetigtFuer === stand;
  const [grund, setGrund] = useState("");
  const [ablehnenOffen, setAblehnenOffen] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const hakenRef = useRef<HTMLInputElement>(null);
  const grundRef = useRef<HTMLTextAreaElement>(null);

  // Nach einer Fehlermeldung zum betroffenen Feld springen.
  useEffect(() => {
    if (annahme.status !== "fehler") return;
    if (annahme.feld === "name") nameRef.current?.focus();
    if (annahme.feld === "bestaetigt") hakenRef.current?.focus();
  }, [annahme]);
  useEffect(() => {
    if (ablehnung.status === "fehler" && ablehnung.feld === "grund")
      grundRef.current?.focus();
  }, [ablehnung]);
  // „Lieber ablehnen“ aufgeklappt: gleich ins Feld (Tastatur, Vorleser).
  useEffect(() => {
    if (ablehnenOffen) grundRef.current?.focus({ preventScroll: false });
  }, [ablehnenOffen]);

  const nameFehler = fehlerFeld(annahme, "name");
  const hakenFehler = fehlerFeld(annahme, "bestaetigt");
  const grundFehler = fehlerFeld(ablehnung, "grund");
  const gesperrt = admin || annimmt || lehntAb;

  return (
    <div className={cn(styles.nichtDrucken, "mt-8 grid gap-6")}>
      <section
        id="annehmen"
        aria-labelledby={`${id}-titel`}
        className="bg-card border-foreground scroll-mt-6 border-2 px-5 py-6 sm:px-8 sm:py-8"
      >
        <h2
          id={`${id}-titel`}
          className="text-[1.35rem] leading-tight tracking-[-0.02em] sm:text-[1.6rem]"
        >
          Angebot annehmen
        </h2>
        <p className="text-muted-foreground mt-2 max-w-[36rem] text-[15px] leading-relaxed">
          Wenn alles passt, nehmen Sie das Angebot hier an. Wir bekommen sofort
          Bescheid und melden uns mit dem Starttermin.
        </p>
        <p className="text-muted-foreground mt-2 max-w-[36rem] text-[13.5px] leading-snug">
          Unsere Angebote richten sich an Betriebe und Selbstständige
          (Unternehmer im Sinne von §{"\u00A0"}14{"\u00A0"}BGB).
        </p>

        <form
          action={annehmen}
          onSubmit={ohneZuruecksetzen(annehmen)}
          noValidate
          className="relative mt-6"
        >
          <Honeypot id={`${id}-hp`} />
          <input type="hidden" name="stand" value={stand} />
          <label
            htmlFor={`${id}-name`}
            className="block text-[14.5px] font-semibold"
          >
            Ihr Name
          </label>
          <input
            ref={nameRef}
            id={`${id}-name`}
            name="name"
            type="text"
            autoComplete="name"
            required
            minLength={2}
            maxLength={ANGEBOT_GRENZEN.annahmeName}
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={admin}
            aria-invalid={nameFehler ? true : undefined}
            aria-describedby={nameFehler ? `${id}-name-fehler` : undefined}
            className={cn(FELD, "mt-2 h-12 max-w-[26rem]")}
          />
          <Meldung id={`${id}-name-fehler`} text={nameFehler} />

          <label
            htmlFor={`${id}-ok`}
            className={cn(
              "mt-5 flex max-w-[36rem] cursor-pointer items-start gap-3 text-[15.5px] leading-snug",
              admin && "cursor-not-allowed opacity-60",
            )}
          >
            <input
              ref={hakenRef}
              id={`${id}-ok`}
              name="bestaetigt"
              type="checkbox"
              value="ja"
              checked={bestaetigt}
              onChange={(e) =>
                setBestaetigtFuer(e.target.checked ? stand : null)
              }
              disabled={admin}
              aria-invalid={hakenFehler ? true : undefined}
              aria-describedby={hakenFehler ? `${id}-ok-fehler` : undefined}
              className="accent-foreground mt-0.5 h-5 w-5 shrink-0"
            />
            <span>
              Ich nehme dieses Angebot für meinen Betrieb bzw. meine
              selbstständige Tätigkeit zu den genannten Bedingungen verbindlich
              an.
            </span>
          </label>
          <Meldung id={`${id}-ok-fehler`} text={hakenFehler} />

          <Meldung text={allgemeinerFehler(annahme)} />

          {preis ? (
            <p className="border-border mt-6 max-w-[36rem] border-t pt-4 text-[14.5px] leading-snug">
              <span className="label-mono text-muted-foreground mr-2">
                Gesamt
              </span>
              {preis}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={gesperrt}
            aria-disabled={gesperrt || undefined}
            // Der Knopftext ist lang („zahlungspflichtig“): am schmalen
            // Handy umbrechen statt die Seite seitlich zu verschieben.
            className={cn(
              "btn-signal h-auto min-h-[3.25rem] w-full px-4 py-3 text-center leading-snug text-balance whitespace-normal sm:w-auto sm:px-[1.4rem]",
              preis ? "mt-4" : "mt-6",
            )}
          >
            {annimmt ? (
              "Wird gespeichert …"
            ) : (
              <>
                <Check
                  className="hidden h-4 w-4 shrink-0 sm:block"
                  aria-hidden="true"
                />
                Angebot zahlungspflichtig annehmen
              </>
            )}
          </button>
        </form>
      </section>

      <section
        aria-label="Fragen und weitere Möglichkeiten"
        className="grid gap-3 sm:flex sm:flex-wrap sm:items-center"
      >
        <a href={ANGEBOT_KONTAKT.telHref} className="btn-line">
          <Phone className="h-4 w-4" aria-hidden="true" />
          Fragen? Anrufen
        </a>
        <a href={rueckfrageMailHref(nummer)} className="btn-line">
          <Mail className="h-4 w-4" aria-hidden="true" />
          Schreiben
        </a>
        <DruckKnopf />
        <button
          type="button"
          aria-expanded={ablehnenOffen}
          aria-controls={`${id}-ablehnen`}
          onClick={() => setAblehnenOffen((v) => !v)}
          className="text-muted-foreground hover:text-foreground h-11 px-1 text-left text-[14.5px] font-medium underline underline-offset-4 sm:ml-auto"
        >
          Lieber ablehnen
        </button>
      </section>

      {ablehnenOffen ? (
        <section
          id={`${id}-ablehnen`}
          aria-labelledby={`${id}-ablehnen-titel`}
          className="border-border border px-5 py-6 sm:px-8"
        >
          <h2
            id={`${id}-ablehnen-titel`}
            className="text-[1.1rem] leading-tight tracking-[-0.015em]"
          >
            Angebot ablehnen
          </h2>
          <form
            action={ablehnen}
            onSubmit={ohneZuruecksetzen(ablehnen)}
            noValidate
            className="relative mt-4"
          >
            <Honeypot id={`${id}-hp2`} />
            <label
              htmlFor={`${id}-grund`}
              className="block text-[14.5px] font-semibold"
            >
              Möchten Sie uns kurz sagen, warum?{" "}
              <span className="text-muted-foreground font-normal">
                (freiwillig)
              </span>
            </label>
            <textarea
              ref={grundRef}
              id={`${id}-grund`}
              name="grund"
              rows={3}
              maxLength={ANGEBOT_GRENZEN.ablehnGrund}
              value={grund}
              onChange={(e) => setGrund(e.target.value)}
              disabled={admin}
              aria-invalid={grundFehler ? true : undefined}
              aria-describedby={grundFehler ? `${id}-grund-fehler` : undefined}
              className={cn(FELD, "mt-2 min-h-24 py-3 leading-relaxed")}
            />
            <Meldung id={`${id}-grund-fehler`} text={grundFehler} />
            <Meldung text={allgemeinerFehler(ablehnung)} />
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={gesperrt}
                aria-disabled={gesperrt || undefined}
                className="btn-line"
              >
                {lehntAb ? "Wird gespeichert …" : "Angebot ablehnen"}
              </button>
              <button
                type="button"
                onClick={() => setAblehnenOffen(false)}
                className="text-muted-foreground hover:text-foreground h-11 px-2 text-[14.5px] font-medium underline underline-offset-4"
              >
                Abbrechen
              </button>
            </div>
          </form>
        </section>
      ) : null}
    </div>
  );
}
