/**
 * Attrappe der Graph API von Meta für die Tests fürs Posten auf Instagram
 * (tests/instagram-*.test.ts): ein kleiner HTTP-Server, der sich wie
 * graph.facebook.com für ein Instagram-Business-Konto verhält und jede
 * Anfrage mitschreibt. Kein echter Schlüssel, kein Netz nach draußen.
 *
 * - Schlüssel nur im Header „Authorization: Bearer“, sonst Code 190.
 * - me/accounts, Konto (username), content_publishing_limit.
 * - Container anlegen (Feed, Karussell-Bild, Karussell, Story), Stand
 *   abfragen (Folge je Container einstellbar, Standard FINISHED),
 *   veröffentlichen (nur FINISHED, jeder Container nur einmal), Link.
 * - Auf Wunsch lädt die Attrappe jedes Bild über seine Adresse, wie
 *   Instagram es tut (ladeBilder), und meldet sonst 9004/2207052 mit der
 *   Adresse in der Meldung (die nie beim Inhaber ankommen darf).
 * - Fehlerregeln: Für passende Anfragen eine feste Antwort oder ein
 *   abgerissenes Netz, beliebig oft oder nur mal-mal.
 */
import http from "node:http";

import type { PostEreignis } from "@/lib/instagram/vertrag";

export const TOKEN = "attrappe-zugang-0123456789abcdefghij";
export const KONTO_ID = "17841400000000001";
export const SEITE_ID = "100000000000001";
export const NUTZERNAME = "sitalo.hamburg";
export const VERSION = "v26.0";

export type GraphAnfrage = {
  methode: string;
  /** Pfad ohne Version, etwa „17841…/media“. */
  pfad: string;
  query: Record<string, string>;
  body: Record<string, unknown> | null;
  /** Authorization-Header, wie er ankam. */
  auth: string;
  /** Rohe Adresse samt Version und Query. */
  url: string;
  /** Inhaltstyp des Körpers. */
  inhaltstyp: string;
};

export type Container = {
  id: string;
  parameter: Record<string, unknown>;
  /** Noch kommende Stände; der letzte bleibt stehen. */
  folge: string[];
  veroeffentlicht: boolean;
};

export type Antwort = { status: number; body: unknown };

export type FehlerRegel = {
  wenn: (a: GraphAnfrage) => boolean;
  antwort: Antwort | "netz";
  /** So oft greift die Regel (Standard: immer). */
  mal?: number;
};

export type AttrappenKonfig = {
  token: string;
  version: string;
  kontoId: string;
  nutzername: string;
  /** Daten für me/accounts. */
  seiten: unknown[];
  /** Antwort-Eintrag für content_publishing_limit (null: leere Liste). */
  kontingent: { quota_usage: number; config: Record<string, number> } | null;
  /** Folge der Stände je neuem Container. */
  folge: (parameter: Record<string, unknown>) => string[];
  /** Lädt jedes Bild über image_url, wie Instagram. */
  ladeBilder: boolean;
  /** Stories bekommen einen Link (sonst ohne permalink). */
  storyLinks: boolean;
  /** config_issue in der Antwort von media_publish. */
  configIssue: string | null;
};

function grundKonfig(): AttrappenKonfig {
  return {
    token: TOKEN,
    version: VERSION,
    kontoId: KONTO_ID,
    nutzername: NUTZERNAME,
    seiten: [
      { id: "100000000000009", name: "Andere Seite" },
      {
        id: SEITE_ID,
        name: "Sitalo",
        instagram_business_account: { id: KONTO_ID, username: NUTZERNAME },
      },
    ],
    kontingent: {
      quota_usage: 3,
      config: { quota_total: 100, quota_duration: 86400 },
    },
    folge: () => ["FINISHED"],
    ladeBilder: true,
    storyLinks: true,
    configIssue: null,
  };
}

/** Fehlerobjekt wie bei Meta. */
export function graphFehler(
  code: number,
  subcode?: number,
  mehr: Record<string, unknown> = {},
  status = 400,
): Antwort {
  return {
    status,
    body: {
      error: {
        message: `(#${code}) Fehler aus der Attrappe`,
        type: "OAuthException",
        code,
        ...(subcode !== undefined ? { error_subcode: subcode } : {}),
        fbtrace_id: `TRACE${code}`,
        ...mehr,
      },
    },
  };
}

export async function startGraph() {
  let konfig = grundKonfig();
  const anfragen: GraphAnfrage[] = [];
  const container = new Map<string, Container>();
  const medien = new Map<
    string,
    { id: string; container: string; story: boolean }
  >();
  let regeln: FehlerRegel[] = [];
  let naechste = 1;
  /** Wird bei jeder Anfrage aufgerufen, bevor sie bearbeitet wird. */
  let beiAnfrage: ((a: GraphAnfrage) => void | Promise<void>) | null = null;

  const neueId = (praefix: string) =>
    `${praefix}${String(naechste++).padStart(6, "0")}`;

  async function bildLaden(url: unknown): Promise<boolean> {
    if (typeof url !== "string") return false;
    try {
      const res = await fetch(url);
      const typ = res.headers.get("content-type") ?? "";
      const bytes = new Uint8Array(await res.arrayBuffer());
      return (
        res.ok &&
        typ.startsWith("image/jpeg") &&
        bytes[0] === 0xff &&
        bytes[1] === 0xd8
      );
    } catch {
      return false;
    }
  }

  async function bearbeite(a: GraphAnfrage): Promise<Antwort> {
    if (a.auth !== `Bearer ${konfig.token}` || "access_token" in a.query)
      return {
        status: 401,
        body: {
          error: {
            message: "Invalid OAuth access token - Cannot parse access token",
            type: "OAuthException",
            code: 190,
            fbtrace_id: "TRACE190",
          },
        },
      };
    const teile = a.pfad.split("/");
    const k = konfig.kontoId;

    if (a.methode === "GET" && a.pfad === "me/accounts")
      return { status: 200, body: { data: konfig.seiten } };
    if (a.methode === "GET" && a.pfad === k)
      return { status: 200, body: { id: k, username: konfig.nutzername } };
    if (a.methode === "GET" && a.pfad === `${k}/content_publishing_limit`)
      return {
        status: 200,
        body: { data: konfig.kontingent ? [konfig.kontingent] : [] },
      };

    if (a.methode === "POST" && a.pfad === `${k}/media`) {
      const p = a.body ?? {};
      if (p.media_type === "CAROUSEL") {
        const kinder = String(p.children ?? "").split(",");
        if (
          kinder.length < 2 ||
          kinder.length > 10 ||
          kinder.some((id) => {
            const c = container.get(id);
            return !c || c.parameter.is_carousel_item !== true;
          })
        )
          return graphFehler(100, 2207028);
      } else {
        if (konfig.ladeBilder && !(await bildLaden(p.image_url)))
          return graphFehler(9004, 2207052, {
            message: `The media could not be fetched from this uri: ${String(p.image_url)}`,
            error_user_msg: `The media could not be fetched from this uri: ${String(p.image_url)}`,
          });
      }
      const id = neueId("1790");
      container.set(id, {
        id,
        parameter: p,
        folge: [...konfig.folge(p)],
        veroeffentlicht: false,
      });
      return { status: 200, body: { id } };
    }

    if (a.methode === "POST" && a.pfad === `${k}/media_publish`) {
      const c = container.get(String(a.body?.creation_id ?? ""));
      if (!c) return graphFehler(24, 2207006);
      if (c.veroeffentlicht) return graphFehler(9007, 2207008);
      if (c.folge[0] !== "FINISHED") return graphFehler(9007, 2207027);
      c.veroeffentlicht = true;
      c.folge = ["PUBLISHED"];
      const id = neueId("1800");
      medien.set(id, {
        id,
        container: c.id,
        story: c.parameter.media_type === "STORIES",
      });
      return {
        status: 200,
        body: konfig.configIssue
          ? { id, config_issue: konfig.configIssue }
          : { id },
      };
    }

    if (a.methode === "GET" && teile.length === 1) {
      const c = container.get(a.pfad);
      if (c) {
        const stand = c.folge.length > 1 ? c.folge.shift()! : c.folge[0];
        return {
          status: 200,
          body: {
            id: c.id,
            status_code: stand,
            status: stand === "ERROR" ? "Error: Media upload has failed with error code 2207003" : stand,
          },
        };
      }
      const m = medien.get(a.pfad);
      if (m) {
        if (m.story && !konfig.storyLinks)
          return { status: 200, body: { id: m.id } };
        return {
          status: 200,
          body: {
            id: m.id,
            permalink: m.story
              ? `https://www.instagram.com/stories/${konfig.nutzername}/${m.id}/`
              : `https://www.instagram.com/p/P${m.id}/`,
          },
        };
      }
    }
    return graphFehler(100, 33, {
      message: "Unsupported request - method type: get",
    });
  }

  const server = http.createServer((req, res) => {
    const chunks: Buffer[] = [];
    req.on("data", (c: Buffer) => chunks.push(c));
    req.on("end", () => {
      void (async () => {
        const url = new URL(req.url ?? "/", "http://attrappe");
        const roh = Buffer.concat(chunks).toString("utf8");
        let body: Record<string, unknown> | null = null;
        try {
          body = roh ? (JSON.parse(roh) as Record<string, unknown>) : null;
        } catch {
          body = null;
        }
        const praefix = `/${konfig.version}/`;
        const a: GraphAnfrage = {
          methode: req.method ?? "GET",
          pfad: url.pathname.startsWith(praefix)
            ? url.pathname.slice(praefix.length)
            : url.pathname,
          query: Object.fromEntries(url.searchParams),
          body,
          auth: String(req.headers.authorization ?? ""),
          url: `${url.pathname}${url.search}`,
          inhaltstyp: String(req.headers["content-type"] ?? ""),
        };
        anfragen.push(a);
        if (beiAnfrage) await beiAnfrage(a);
        const regel = regeln.find((r) => r.wenn(a) && (r.mal ?? 1) > 0);
        if (regel) {
          if (regel.mal !== undefined) regel.mal -= 1;
          if (regel.antwort === "netz") {
            req.socket.destroy();
            return;
          }
          res.writeHead(regel.antwort.status, {
            "content-type": "application/json",
          });
          res.end(JSON.stringify(regel.antwort.body));
          return;
        }
        const antwort = url.pathname.startsWith(praefix)
          ? await bearbeite(a)
          : graphFehler(2500, undefined, { message: "Unknown path" });
        res.writeHead(antwort.status, { "content-type": "application/json" });
        res.end(JSON.stringify(antwort.body));
      })();
    });
  });
  await new Promise<void>((fertig) =>
    server.listen(0, "127.0.0.1", () => fertig()),
  );
  const adresse = server.address();
  const port = typeof adresse === "object" && adresse ? adresse.port : 0;

  return {
    url: `http://127.0.0.1:${port}`,
    anfragen,
    container,
    medien,
    get konfig() {
      return konfig;
    },
    /** Einstellungen ändern (Teilmenge). */
    stelle(mehr: Partial<AttrappenKonfig>) {
      konfig = { ...konfig, ...mehr };
    },
    /** Fehlerregel hinzufügen (greift vor der normalen Bearbeitung). */
    regel(r: FehlerRegel) {
      regeln.push(r);
    },
    beiJederAnfrage(f: ((a: GraphAnfrage) => void | Promise<void>) | null) {
      beiAnfrage = f;
    },
    /** Anfragen an einen Pfad (ohne Version), optional nur eine Methode. */
    an(pfad: string | RegExp, methode?: string): GraphAnfrage[] {
      return anfragen.filter(
        (a) =>
          (typeof pfad === "string" ? a.pfad === pfad : pfad.test(a.pfad)) &&
          (!methode || a.methode === methode),
      );
    },
    reset() {
      konfig = grundKonfig();
      anfragen.length = 0;
      container.clear();
      medien.clear();
      regeln = [];
      naechste = 1;
      beiAnfrage = null;
    },
    close() {
      return new Promise<void>((fertig) => server.close(() => fertig()));
    },
  };
}

export type GraphAttrappe = Awaited<ReturnType<typeof startGraph>>;

/** Sammelt die Ereignisse eines Laufs. */
export function sammler() {
  const ereignisse: PostEreignis[] = [];
  return {
    ereignisse,
    sende: (e: PostEreignis) => {
      ereignisse.push(e);
    },
    /** Kurzform: „schritt:stand[:nr/von]“, „fertig“, „fehler:code“. */
    folge(): string[] {
      return ereignisse.map((e) => {
        if (e.typ === "schritt")
          return `${e.schritt}:${e.stand}${e.nr !== undefined ? `:${e.nr}/${e.von}` : ""}`;
        if (e.typ === "fertig") return "fertig";
        return `fehler:${e.code}`;
      });
    },
    get letzte(): PostEreignis | undefined {
      return ereignisse.at(-1);
    },
  };
}

/** Ein kleines, gültiges JPEG (1×1 Pixel). */
export const JPEG = Buffer.from(
  "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=",
  "base64",
);
