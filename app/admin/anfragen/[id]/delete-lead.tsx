"use client";

import Link from "next/link";
import { startTransition, useActionState, useState } from "react";

import { deleteLeadAction, type ActionState } from "@/app/admin/actions";
import { clearAdminSession } from "@/app/admin/client-state";
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
    <details className="mt-4 rounded-2xl border border-red-200 bg-card">
      <summary className="flex min-h-12 cursor-pointer items-center px-4 text-[16px] font-semibold text-red-900">
        Endgültig löschen
      </summary>
      <form
        // onSubmit statt action: Das Formular wird nach einem Fehler nicht
        // zurückgesetzt, Grund und Häkchen bleiben stehen.
        onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          startTransition(() => action(data));
        }}
        className="space-y-4 px-4 pb-4"
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
                  className="h-5 w-5"
                />
                {DELETE_REASON_LABELS[r]}
              </label>
            ))}
          </div>
        </fieldset>

        {reason === "anfrage_person" ? (
          related.length > 0 ? (
            <div className="border-gold rounded-xl border-2 p-3 text-[15px]">
              <p className="font-semibold">Weitere Einträge dieser Person ({related.length})</p>
              <p className="text-muted-foreground text-[14px]">
                Gleiche E-Mail oder Telefonnummer. Diese bitte einzeln archivieren und löschen.
              </p>
              <ul className="mt-1">
                {related.map((r) => (
                  <li key={r.id}>
                    <Link
                      href={`/admin/anfragen/${r.id}`}
                      className="flex min-h-11 items-center underline underline-offset-4"
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
            className="h-5 w-5"
          />
          Ich weiß, dass das nicht rückgängig geht.
        </label>

        {state.error ? (
          <p role="alert" className="text-[14px] text-red-800">
            {state.error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="h-12 w-full rounded-full bg-red-700 text-[16px] font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Löscht …" : "Endgültig löschen"}
        </button>
      </form>
    </details>
  );
}
