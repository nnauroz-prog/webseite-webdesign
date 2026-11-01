import type { Angebot } from "@/lib/admin/angebote";
import type { SchemaPart } from "@/lib/admin/schema";
import type { LeadEvent } from "@/lib/leads-meta";

import { AngebotCard } from "@/app/admin/anfragen/[id]/angebot-card";
import {
  betragZeile,
  steuerZeile,
} from "@/app/admin/anfragen/[id]/angebot-format";
import { CreateAngebotButton } from "@/app/admin/anfragen/[id]/create-angebot-button";
import { DbProblem } from "@/app/admin/db-problem";
import {
  ANGEBOT_STATUS_LABELS,
  berechneSummen,
  bestaetigungFehlt,
  nochNichtVerschickt,
  editorPfad,
  kundenAnsicht,
  statusZeile,
} from "@/lib/admin/angebote";

/**
 * Abschnitt „Angebot“ auf der Detailseite. Ohne Angebot ein Knopf
 * „Angebot erstellen“ (groß nur bei offener Anfrage); sonst die
 * Angebote, das jüngste oben. Fehlt die Tabelle noch, steht hier nur
 * ein kurzer Hinweis (das Banner oben bietet das Update an).
 */
export function AngeboteSection({
  leadId,
  angebote,
  loadError,
  schemaPart,
  leadOpen,
  kontaktFehlt,
  events,
  paketName,
  now,
}: {
  leadId: string;
  /** null: Tabelle fehlt oder Supabase nicht konfiguriert. */
  angebote: Angebot[] | null;
  /** Laden ist gescheitert (Netz, Schlüssel …). */
  loadError: unknown;
  schemaPart: SchemaPart;
  leadOpen: boolean;
  /** Weder Name noch E-Mail noch Telefon: Ein Angebot braucht erst einen Namen. */
  kontaktFehlt: boolean;
  /** Verlauf der Anfrage (für „Bestätigungs-Mail nicht rausgegangen“). */
  events: LeadEvent[] | null;
  /** Paket, mit dem ein neues Angebot startet. */
  paketName: string;
  now: Date;
}) {
  const count = angebote?.length ?? 0;
  return (
    <section
      aria-labelledby="angebot-title"
      className="border-border bg-card mt-4 rounded-[4px] border p-4"
    >
      <h2 id="angebot-title" className="text-[16px] font-semibold">
        {count > 1 ? `Angebote (${count})` : "Angebot"}
      </h2>

      {loadError ? (
        <DbProblem
          error={loadError}
          retryHref={`/admin/anfragen/${leadId}`}
          compact
        />
      ) : angebote === null ? (
        <p className="text-muted-foreground mt-1 text-[14px] leading-relaxed">
          {schemaPart === "fehlt"
            ? "Angebote gehen erst nach dem Datenbank-Update. Der Hinweis oben zeigt, wie es geht."
            : "Angebote sind gerade nicht verfügbar. Versuch es gleich noch einmal."}
        </p>
      ) : count === 0 ? (
        <>
          <p className="text-muted-foreground mt-1 text-[14px] leading-relaxed">
            {kontaktFehlt
              ? "Für ein Angebot brauchst du mindestens einen Namen – trag ihn im Editor nach. Ohne E-Mail-Adresse bleibt nur Teilen oder Link kopieren."
              : `Aus der Anfrage entsteht ein Entwurf mit Paket ${paketName}, Preisen und Standardtexten. Du kannst alles ändern, bevor es rausgeht.`}
          </p>
          {/* Groß nur, wo es der nächste Schritt ist: bei offener Anfrage mit Kontakt. */}
          <CreateAngebotButton
            leadId={leadId}
            big={leadOpen && !kontaktFehlt}
          />
        </>
      ) : (
        <>
          <ul className="mt-3 space-y-3">
            {angebote.map((a, i) => {
              const ansicht = kundenAnsicht(a, now);
              const abgelaufen = ansicht === "abgelaufen";
              const summen = berechneSummen(a.positionen, a.ust_satz);
              return (
                <li key={a.id}>
                  <AngebotCard
                    angebot={{
                      id: a.id,
                      nummer: a.nummer,
                      token: a.token,
                      status: a.status,
                      kunde_name: a.kunde_name,
                      kunde_email: a.kunde_email,
                      titel: a.titel,
                      positionen: a.positionen,
                      ust_satz: a.ust_satz,
                      gueltig_bis: a.gueltig_bis,
                      abgelehnt_grund: a.abgelehnt_grund,
                    }}
                    pill={
                      abgelaufen
                        ? { key: "abgelaufen", label: "Abgelaufen" }
                        : {
                            key: a.status,
                            label: ANGEBOT_STATUS_LABELS[a.status],
                          }
                    }
                    statusText={statusZeile(a, now)}
                    betrag={betragZeile(summen)}
                    steuer={steuerZeile(a.ust_satz)}
                    editHref={editorPfad(leadId, a.id)}
                    leadId={leadId}
                    leadOpen={leadOpen}
                    nochNichtVerschickt={nochNichtVerschickt(
                      events ?? [],
                      a.nummer,
                    )}
                    bestaetigungFehlt={
                      a.status === "angenommen" &&
                      bestaetigungFehlt(events ?? [], a.nummer)
                    }
                    superseded={angebote
                      .slice(0, i)
                      .some(
                        (n) =>
                          n.status === "gesendet" || n.status === "angenommen",
                      )}
                  />
                </li>
              );
            })}
          </ul>
          <CreateAngebotButton leadId={leadId} big={false} weiteres />
        </>
      )}
    </section>
  );
}
