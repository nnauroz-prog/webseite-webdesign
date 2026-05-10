"use client";

import { useActionState, useState, useTransition } from "react";
import { CheckCircle2, Clock, RefreshCw } from "lucide-react";

import { FieldError, FormStatus } from "@/components/dashboard/form-status";
import { SectionCard } from "@/components/dashboard/section-card";
import { SubmitButton } from "@/components/dashboard/submit-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { initialState } from "@/lib/actions/states";
import {
  removeCustomDomainAction,
  setCustomDomainAction,
  verifyCustomDomainAction,
} from "@/lib/actions/website";
import type { ActionState } from "@/lib/actions/shared";
import type { WebsiteRow } from "@/types/website";

export function CustomDomainForm({ website }: { website: WebsiteRow }) {
  const [state, formAction] = useActionState(
    setCustomDomainAction,
    initialState,
  );
  const [removing, startRemove] = useTransition();
  const [verifying, startVerify] = useTransition();
  const [verifyResult, setVerifyResult] = useState<ActionState | null>(null);

  const verified = Boolean(website.custom_domain_verified_at);
  const hasDomain = Boolean(website.custom_domain);

  const onVerify = () => {
    setVerifyResult(null);
    startVerify(async () => {
      const result = await verifyCustomDomainAction();
      setVerifyResult(result);
    });
  };

  return (
    <SectionCard
      title="Eigene Domain"
      description="Verwende deine eigene Adresse wie pflegedienst-mueller.de statt der Sitalo-URL."
      footer={
        hasDomain ? null : (
          <>
            <FormStatus state={state} />
            <SubmitButton label="Domain speichern" />
          </>
        )
      }
    >
      <form action={formAction} className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="custom_domain">Domain</Label>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground text-sm">https://</span>
            <Input
              id="custom_domain"
              name="custom_domain"
              placeholder="meine-firma.de"
              defaultValue={website.custom_domain ?? ""}
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              className="font-mono"
              aria-invalid={Boolean(state.fieldErrors?.custom_domain) || undefined}
            />
          </div>
          <p className="text-muted-foreground text-xs">
            Eine Domain pro Site. Du musst die Domain bei deinem Anbieter
            (z.B. IONOS, Strato, GoDaddy) gekauft haben.
          </p>
          <FieldError message={state.fieldErrors?.custom_domain} />
        </div>

        {hasDomain && (
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
            <FormStatus state={state} />
            <div className="flex flex-wrap gap-2">
              <SubmitButton label="Aktualisieren" />
              <Button
                type="button"
                variant="outline"
                disabled={removing}
                onClick={() =>
                  startRemove(() => {
                    void removeCustomDomainAction();
                  })
                }
              >
                {removing ? "Entferne …" : "Domain entfernen"}
              </Button>
            </div>
          </div>
        )}
      </form>

      {hasDomain ? (
        <div className="mt-5 space-y-4 border-t pt-5">
          {/* Status pill */}
          <div className="flex flex-wrap items-center gap-3 text-sm">
            {verified ? (
              <>
                <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-foreground font-medium">
                  Domain verifiziert
                </span>
                <span className="text-muted-foreground">
                  · {website.custom_domain} → live
                </span>
              </>
            ) : (
              <>
                <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                <span className="text-foreground font-medium">
                  Wartet auf DNS-Konfiguration
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={verifying}
                  onClick={onVerify}
                  className="ml-auto"
                >
                  <RefreshCw
                    className={
                      verifying
                        ? "mr-1.5 h-3.5 w-3.5 animate-spin"
                        : "mr-1.5 h-3.5 w-3.5"
                    }
                  />
                  {verifying ? "Prüfe …" : "Status prüfen"}
                </Button>
              </>
            )}
          </div>

          {verifyResult ? (
            <p
              className={
                verifyResult.status === "success"
                  ? "text-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 dark:text-emerald-300 rounded-md px-3 py-2 text-xs"
                  : verifyResult.status === "error"
                    ? "text-amber-800 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-200 rounded-md px-3 py-2 text-xs"
                    : ""
              }
            >
              {verifyResult.message}
            </p>
          ) : null}

          {!verified && <DnsSetupHelp domain={website.custom_domain!} />}
        </div>
      ) : null}
    </SectionCard>
  );
}

function DnsSetupHelp({ domain }: { domain: string }) {
  const isApex = domain.split(".").length === 2;
  return (
    <div className="text-sm">
      <p className="text-muted-foreground">
        Damit deine Domain auf deine Sitalo-Seite zeigt, lege bei deinem
        Domain-Anbieter folgende DNS-Einträge an:
      </p>

      <div className="mt-3 overflow-x-auto rounded-lg border">
        <table className="w-full text-xs">
          <thead className="bg-secondary text-foreground">
            <tr>
              <th className="px-3 py-2 text-left font-medium">Typ</th>
              <th className="px-3 py-2 text-left font-medium">Name / Host</th>
              <th className="px-3 py-2 text-left font-medium">Wert / Ziel</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isApex ? (
              <>
                <tr>
                  <td className="px-3 py-2 font-mono">A</td>
                  <td className="px-3 py-2 font-mono">@</td>
                  <td className="px-3 py-2 font-mono">76.76.21.21</td>
                </tr>
                <tr>
                  <td className="px-3 py-2 font-mono">CNAME</td>
                  <td className="px-3 py-2 font-mono">www</td>
                  <td className="px-3 py-2 font-mono">cname.vercel-dns.com</td>
                </tr>
              </>
            ) : (
              <tr>
                <td className="px-3 py-2 font-mono">CNAME</td>
                <td className="px-3 py-2 font-mono">
                  {domain.split(".")[0]}
                </td>
                <td className="px-3 py-2 font-mono">cname.vercel-dns.com</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <ol className="text-foreground mt-4 list-decimal space-y-1.5 pl-5 text-sm">
        <li>
          Bei deinem Domain-Anbieter einloggen (z.B. IONOS, Strato, GoDaddy,
          Namecheap, Cloudflare).
        </li>
        <li>DNS-Verwaltung für <strong>{domain}</strong> öffnen.</li>
        <li>
          Eintrag wie oben hinzufügen — alte A/CNAME-Einträge mit gleichem
          Host vorher löschen.
        </li>
        <li>
          DNS-Änderungen brauchen 1–48 Stunden bis sie überall ankommen.
          Sobald wir die Domain erkennen, schalten wir SSL automatisch
          frei (kostenlos via Let&apos;s Encrypt).
        </li>
        <li>
          Die Aktivierung übernehmen wir manuell innerhalb von 24h. Bei
          Fragen schreib uns: <span className="text-primary">support@sitalo.app</span>
        </li>
      </ol>

      <div className="border-amber-300/60 bg-amber-50/60 dark:border-amber-900/60 dark:bg-amber-950/30 mt-4 rounded-lg border p-3 text-xs">
        <p>
          <strong>Wichtig:</strong> Solange die Domain nicht verifiziert ist,
          erreicht deine Site weiter unter <code>sitalo.app/site/…</code> —
          nichts geht verloren.
        </p>
      </div>
    </div>
  );
}

