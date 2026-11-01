"use client";

import Link from "next/link";
import { startTransition, useActionState, useState } from "react";

import { deleteLeadAction, type ActionState } from "@/app/admin/actions";
import { clearAdminSession } from "@/app/admin/client-state";
import { Disclosure } from "@/app/admin/disclosure";
import { isRedirect } from "@/app/admin/run-action";
import { DELETE_REASON_LABELS, DELETE_REASONS } from "@/lib/leads-meta";

const DELETE_OFFLINE = "Keine Verbindung. Nicht gelöscht.";

async function remove(prev: ActionState, formData: FormData): Promise<ActionState> {
  try {
    return await deleteLeadAction(prev, formData);
  } catch (err) {
    // redirect() bei Erfolg ist kein Fehler: Suchbegriff und
    // Vormerkungen (oft mit Daten der gelöschten Person) vergessen,
    // dann weiterreichen.
    if (isRedirect(err)) {
      clearAdminSession();
      throw err;
    }
    return { error: DELETE_OFFLINE };
  }
}

export type RelatedEntry = { id: string; label: string };

/**
 * Endgültig löschen (Art. 17), nur bei archivierten Anfragen. Grund und
 * Bestätigung sind Pflicht. Bei einer Löschanfrage der Person stehen
 * weitere Einträge derselben Person (E-Mail oder Telefon) daneben.
 */
export function DeleteLead({ leadId, related }: { leadId: string; related: RelatedEntry[] }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(remove, {});
  const [reason, setReason] = useState<string>("");
  const [confirmed, setConfirmed] = useState(false);

  return (
    <Disclosure
      className="border-ink-olive/35 mt-4"
      summaryClassName="text-ink-olive text-[16px] font-semibold"
      title="Endgültig löschen"
    >
      <p className="text-muted-foreground text-[14px] leading-relaxed">
        Löscht die Anfrage mit Notizen und Verlauf (Art. 17 DSGVO). Im Löschprotokoll
        bleibt nur ein Eintrag ohne Namen oder Inhalte.
      </p>
      <form
        // onSubmit statt action: Das Formular wird nach einem Fehler nicht
        // zurückgesetzt, Grund und Häkchen bleiben stehen.
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          startTransition(() => action(data));
        }}
        className="mt-3 space-y-4"
      >
        <input type="hidden" name="id" value={leadId} />
        <fieldset>
          <legend className="text-[15px] font-medium">Grund</legend>
          <div className="mt-1">
            {DELETE_REASONS.map((r) => (
              <label key={r} className="flex min-h-11 cursor-pointer items-center gap-3 text-[15px]">
                <input
                  type="radio"
                  name="reason"
                  value={r}
                  required
                  checked={reason === r}
                  onChange={() => setReason(r)}
                  className="accent-foreground h-5 w-5 shrink-0"
                />
                {DELETE_REASON_LABELS[r]}
              </label>
            ))}
          </div>
        </fieldset>

        {reason === "anfrage_person" ? (
          related.length > 0 ? (
            <div className="border-gold rounded-[4px] border-2 p-3 text-[15px]">
              <p className="font-semibold">Weitere Einträge dieser Person ({related.length})</p>
              <p className="text-muted-foreground text-[14px]">
                Gleiche E-Mail oder Telefonnummer. Diese bitte einzeln archivieren und löschen.
              </p>
              <ul className="mt-1">
                {related.map((r) => (
                  <li key={r.id}>
                    <Link
                      href={`/admin/anfragen/${r.id}`}
                      className="decoration-foreground/30 hover:decoration-foreground flex min-h-11 items-center underline underline-offset-4"
                    >
                      {r.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="text-muted-foreground text-[14px]">
              Keine weiteren Einträge mit dieser E-Mail oder Telefonnummer gefunden.
            </p>
          )
        ) : null}

        <label className="flex min-h-11 cursor-pointer items-center gap-3 text-[15px]">
          <input
            type="checkbox"
            name="confirm"
            value="ja"
            required
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="accent-foreground h-5 w-5 shrink-0"
          />
          Ich weiß, dass das nicht rückgängig geht.
        </label>

        {state.error ? (
          <p role="alert" className="text-[14px] text-ink-olive">
            {state.error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="bg-ink-olive h-12 w-full rounded-[3px] text-[16px] font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Löscht …" : "Endgültig löschen"}
        </button>
      </form>
    </Disclosure>
  );
}
