import type { Metadata } from "next";
import { notFound } from "next/navigation";

import type { Angebot } from "@/lib/admin/angebote";
import type { LeadRow } from "@/lib/leads-meta";

import { AngebotEditor } from "@/app/admin/anfragen/[id]/angebot/[angebotId]/angebot-editor";
import { EditorBackLink } from "@/app/admin/anfragen/[id]/angebot/[angebotId]/editor-back-link";
import { DbProblem } from "@/app/admin/db-problem";
import {
  ANGEBOT_STATUS_LABELS,
  editorPfad,
  hinweisKontext,
  istBearbeitbar,
  kundenAnsicht,
  statusZeile,
  syncHinweise,
  ustSatzAusUmgebung,
} from "@/lib/admin/angebote";
import { requireAdmin } from "@/lib/admin/auth";
import { berlinDateIso } from "@/lib/admin/berlin-time";
import { parseId } from "@/lib/admin/validate";
import { getAngebotById } from "@/lib/angebote-store";
import { fieldValue } from "@/lib/leads-meta";
import { getLead } from "@/lib/leads-store";

// Generisch wie die Detailseite: keine Kundennamen im <title>.
export const metadata: Metadata = { title: "Angebot" };

export default async function AngebotEditorPage({
  params,
}: {
  params: Promise<{ id: string; angebotId: string }>;
}) {
  await requireAdmin();
  const p = await params;
  const leadId = parseId(p.id);
  const angebotId = parseId(p.angebotId);
  if (!leadId || !angebotId) notFound();
  const now = new Date();

  let angebot: Angebot | null;
  let lead: LeadRow | null;
  try {
    [angebot, lead] = await Promise.all([
      getAngebotById(angebotId),
      getLead(leadId),
    ]);
  } catch (err) {
    // Auch „Tabelle angebote fehlt“ landet hier, mit eigener Erklärung.
    return (
      <div>
        <EditorBackLink leadId={leadId} />
        <h1 className="sr-only">Angebot</h1>
        <DbProblem error={err} retryHref={editorPfad(leadId, angebotId)} />
      </div>
    );
  }
  if (!lead) notFound();
  if (!angebot || angebot.lead_id !== leadId) {
    // Z. B. gerade verworfen (die Action lädt diese Seite noch einmal)
    // oder auf einem anderen Gerät gelöscht: erklären statt 404.
    return (
      <div>
        <EditorBackLink leadId={leadId} />
        <h1 className="mt-2 text-[22px] font-semibold tracking-tight">
          Dieses Angebot gibt es nicht mehr
        </h1>
        <p className="text-muted-foreground mt-1 text-[15px]">
          Der Entwurf wurde verworfen. Auf der Anfrage kannst du ein neues
          Angebot erstellen.
        </p>
      </div>
    );
  }

  const ansicht = kundenAnsicht(angebot, now);
  // Steuersatz kommt fest aus ANGEBOT_UST_SATZ (das Speichern setzt ihn
  // ebenso). Wurde die Einstellung nach dem Anlegen geändert, zeigt der
  // Editor schon den neuen Satz samt passendem Hinweissatz.
  const ustFest = ustSatzAusUmgebung(process.env.ANGEBOT_UST_SATZ);
  const fuerEditor =
    istBearbeitbar(angebot.status) && angebot.ust_satz !== ustFest
      ? {
          ...angebot,
          ust_satz: ustFest,
          hinweise: syncHinweise(
            angebot.hinweise,
            hinweisKontext(angebot),
            hinweisKontext({ ...angebot, ust_satz: ustFest }),
          ),
        }
      : angebot;
  return (
    <AngebotEditor
      angebot={fuerEditor}
      leadName={fieldValue(lead, "Name") ?? (lead.reply_to || "Anfrage")}
      statusText={statusZeile(angebot, now)}
      pill={
        ansicht === "abgelaufen"
          ? { key: "abgelaufen", label: "Abgelaufen" }
          : {
              key: angebot.status,
              label: ANGEBOT_STATUS_LABELS[angebot.status],
            }
      }
      todayIso={berlinDateIso(now)}
    />
  );
}
