/**
 * Minimal Vercel REST API client used to automate custom-domain
 * attachment + verification for SitaloD-hosted customer sites.
 *
 * https://vercel.com/docs/rest-api
 *
 * Endpoints used:
 *   - POST   /v10/projects/{id}/domains             — add a domain
 *   - DELETE /v9/projects/{id}/domains/{domain}     — remove a domain
 *   - GET    /v9/projects/{id}/domains/{domain}/config — verification state
 *
 * Auth: Bearer token from Vercel → Account Settings → Tokens.
 * The token must have at least "Read/Write Project" scope.
 *
 * If VERCEL_API_TOKEN or VERCEL_PROJECT_ID is missing the helpers
 * return { ok: false, configured: false } so callers can fall back
 * to the manual operator workflow gracefully.
 */

const API = "https://api.vercel.com";

export type VercelResult<T = unknown> =
  | { ok: true; configured: true; data: T }
  | { ok: false; configured: false; message: string }
  | { ok: false; configured: true; status: number; message: string };

function getEnv(): { token: string; projectId: string; teamQuery: string } | null {
  const token = process.env.VERCEL_API_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  if (!token || !projectId) return null;
  const team = process.env.VERCEL_TEAM_ID;
  const teamQuery = team ? `?teamId=${encodeURIComponent(team)}` : "";
  return { token, projectId, teamQuery };
}

async function call(
  path: string,
  init: RequestInit = {},
): Promise<VercelResult> {
  const env = getEnv();
  if (!env) {
    return {
      ok: false,
      configured: false,
      message: "Vercel-API ist nicht konfiguriert.",
    };
  }
  let res: Response;
  try {
    res = await fetch(`${API}${path}${env.teamQuery}`, {
      ...init,
      headers: {
        ...init.headers,
        Authorization: `Bearer ${env.token}`,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    return {
      ok: false,
      configured: true,
      status: 0,
      message:
        err instanceof Error
          ? `Vercel nicht erreichbar: ${err.message}`
          : "Vercel nicht erreichbar.",
    };
  }
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return {
      ok: false,
      configured: true,
      status: res.status,
      message: friendlyMessage(res.status, body),
    };
  }
  const data = await res.json().catch(() => ({}));
  return { ok: true, configured: true, data };
}

function friendlyMessage(status: number, body: string): string {
  if (status === 401 || status === 403)
    return "Vercel-Token ungültig oder ohne Berechtigung.";
  if (status === 404) return "Vercel-Projekt nicht gefunden.";
  if (status === 409) return "Domain bereits einem anderen Projekt zugeordnet.";
  if (status === 429) return "Vercel-Rate-Limit erreicht — bitte später erneut.";
  // Try to extract Vercel's own error message from the JSON body.
  try {
    const j = JSON.parse(body) as { error?: { message?: string } };
    if (j.error?.message) return j.error.message;
  } catch {
    /* ignore */
  }
  return `Vercel HTTP ${status}`;
}

/**
 * Attach a domain to the configured project. Vercel returns a domain
 * record with `verification` instructions if DNS isn't pointing at
 * Vercel yet — we surface that to the caller.
 */
export type VercelDomainRecord = {
  name: string;
  verified: boolean;
  verification?: Array<{
    type: string;
    domain: string;
    value: string;
    reason: string;
  }>;
};

export async function vercelAddDomain(
  domain: string,
): Promise<VercelResult<VercelDomainRecord>> {
  const env = getEnv();
  if (!env) {
    return {
      ok: false,
      configured: false,
      message: "Vercel-API ist nicht konfiguriert.",
    };
  }
  const res = await call(`/v10/projects/${env.projectId}/domains`, {
    method: "POST",
    body: JSON.stringify({ name: domain }),
  });
  return res as VercelResult<VercelDomainRecord>;
}

export async function vercelRemoveDomain(
  domain: string,
): Promise<VercelResult<unknown>> {
  const env = getEnv();
  if (!env) {
    return {
      ok: false,
      configured: false,
      message: "Vercel-API ist nicht konfiguriert.",
    };
  }
  return call(
    `/v9/projects/${env.projectId}/domains/${encodeURIComponent(domain)}`,
    { method: "DELETE" },
  );
}

/**
 * Read the verification + SSL state for a domain attached to the
 * project. The shape we care about:
 *   - misconfigured: true → DNS doesn't point at Vercel yet
 *   - misconfigured: false → ready, SSL provisioning may still
 *     be in progress (Vercel handles that automatically).
 */
export type VercelDomainConfig = {
  configuredBy?: string | null;
  acceptedChallenges?: string[];
  misconfigured?: boolean;
};

export async function vercelGetDomainConfig(
  domain: string,
): Promise<VercelResult<VercelDomainConfig>> {
  const env = getEnv();
  if (!env) {
    return {
      ok: false,
      configured: false,
      message: "Vercel-API ist nicht konfiguriert.",
    };
  }
  return call(
    `/v9/projects/${env.projectId}/domains/${encodeURIComponent(domain)}/config`,
    { method: "GET" },
  ) as Promise<VercelResult<VercelDomainConfig>>;
}

export function isVercelConfigured(): boolean {
  return getEnv() !== null;
}
