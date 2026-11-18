/**
 * Kleiner PostgREST-Mock für node --test (ohne Abhängigkeit).
 *
 * Unterstützt unter /rest/v1/:table GET, POST, PATCH und DELETE mit
 * select (Spaltenliste oder *), Filtern col=eq|neq|gt|gte|lt|lte.value,
 * col=in.(a,b), col=is.null, order=col.asc|desc, limit,
 * Prefer: return=representation und
 * Accept: application/vnd.pgrst.object+json (single).
 *
 * Modi (je Migration einer mehr):
 *   'v0' noch gar keine Tabelle (vor 20261030000000_leads.sql)
 *   'v1' nur leads mit den Spalten aus 20261030000000_leads.sql
 *   'v2' zusätzlich follow_up_on/outcome/lost_reason, lead_events
 *        (on delete cascade) und lead_deletions
 *   'v3' zusätzlich angebote (20261102000000_angebote.sql): Nummer
 *        A-<Jahr>-0001 als Default, Checks, eindeutige token/nummer,
 *        on delete cascade, updated_at nur bei inhaltlicher Änderung
 *   'v4' zusätzlich projekte und post_status (20261116000000_ausbau.sql):
 *        eindeutige angebot_id, Fremdschlüssel mit on delete cascade
 *        (Anfrage und Angebot), Checks, updated_at bei jeder Änderung,
 *        Primärschlüssel (datum, platz, format)
 *   'v5' zusätzlich serien (20261117000000_serien.sql): Auftrag
 *        höchstens 500 Zeichen, serie als Objekt, gepostet_at leer
 *   'v6' zusätzlich instagram_posts und der private Bucket „instagram“
 *        (20261118000000_instagram.sql): art story|beitrag, bilder 1 bis
 *        10, quelle als Objekt, media_ids und links als Listen
 *
 * Filter für jsonb: col=cs.{…} (enthält, wie contains() in supabase-js).
 *
 * Speicher (Supabase Storage) unter /storage/v1, so wie supabase-js ihn
 * aufruft: GET bucket/:id, POST object/upload/sign/:bucket/:pfad
 * (Upload-Platz), PUT object/upload/sign/:bucket/:pfad?token= (Hochladen
 * mit dem Token des Platzes, auch mit dem anon-Schlüssel), POST
 * object/sign/:bucket/:pfad (signierte Adresse), GET
 * object/sign/:bucket/:pfad?token= (Datei über die signierte Adresse,
 * ohne Schlüssel), DELETE object/:bucket mit {prefixes} und POST
 * object/list/:bucket mit {prefix, limit, offset}. Buckets prüfen
 * Größe und Inhaltstyp wie file_size_limit und allowed_mime_types.
 *
 * Fehler wie PostgREST: unbekannte Tabelle → 404 PGRST205, unbekannte
 * Spalte in select/filter/order → 400 42703, unbekannte Spalte im
 * Body → 400 PGRST204, falscher apikey → 401.
 *
 * Alle Requests landen in `requests` (Methode, URL, Header, Body).
 */
import { randomUUID } from "node:crypto";
import http from "node:http";

const LEADS_V1 = [
  "id",
  "created_at",
  "updated_at",
  "kind",
  "subject",
  "reply_to",
  "fields",
  "status",
  "notes",
  "delivered_via",
  "delivery_error",
];
const LEADS_V2 = [...LEADS_V1, "follow_up_on", "outcome", "lost_reason"];
const EVENTS = ["id", "lead_id", "created_at", "actor", "action", "detail"];
const DELETIONS = [
  "id",
  "deleted_at",
  "deleted_by",
  "lead_id",
  "lead_kind",
  "lead_created_at",
  "reason",
];
const ANGEBOTE = [
  "id",
  "lead_id",
  "nummer",
  "token",
  "status",
  "created_at",
  "updated_at",
  "sent_at",
  "first_viewed_at",
  "accepted_at",
  "declined_at",
  "gueltig_bis",
  "kunde_name",
  "kunde_firma",
  "kunde_email",
  "titel",
  "einleitung",
  "hinweise",
  "positionen",
  "ust_satz",
  "angenommen_von",
  "abgelehnt_grund",
];
/** Spalten, deren Änderung updated_at setzt (wie der Trigger). */
const ANGEBOT_INHALT = [
  "kunde_name",
  "kunde_firma",
  "kunde_email",
  "titel",
  "einleitung",
  "hinweise",
  "positionen",
  "ust_satz",
  "gueltig_bis",
];
const ANGEBOT_STATUSES = [
  "entwurf",
  "gesendet",
  "angenommen",
  "abgelehnt",
  "zurueckgezogen",
];
const PROJEKTE = [
  "id",
  "angebot_id",
  "lead_id",
  "created_at",
  "updated_at",
  "schritte",
  "livegang_am",
  "pflege_seit",
  "pflege_bis",
  "notiz",
];
const POST_STATUS = ["datum", "platz", "format", "text", "gepostet_at"];
const SERIEN = ["id", "created_at", "datum", "auftrag", "serie", "gepostet_at"];
const INSTAGRAM_POSTS = [
  "id",
  "created_at",
  "art",
  "quelle",
  "bilder",
  "media_ids",
  "links",
];

function schemaFor(mode) {
  if (mode === "v0") return {};
  if (mode === "v1") return { leads: LEADS_V1 };
  const v2 = {
    leads: LEADS_V2,
    lead_events: EVENTS,
    lead_deletions: DELETIONS,
  };
  if (mode === "v2") return v2;
  const v3 = { ...v2, angebote: ANGEBOTE };
  if (mode === "v3") return v3;
  const v4 = { ...v3, projekte: PROJEKTE, post_status: POST_STATUS };
  if (mode === "v4") return v4;
  const v5 = { ...v4, serien: SERIEN };
  if (mode === "v5") return v5;
  return { ...v5, instagram_posts: INSTAGRAM_POSTS };
}

/** Buckets je Modus (der Bucket „instagram“ kommt mit v6). */
function bucketsFor(mode) {
  const buckets = new Map();
  if (!["v0", "v1", "v2", "v3", "v4", "v5"].includes(mode))
    buckets.set("instagram", {
      id: "instagram",
      name: "instagram",
      public: false,
      file_size_limit: 8388608,
      allowed_mime_types: ["image/jpeg"],
    });
  return buckets;
}

const REQUIRED = {
  leads: ["kind", "subject", "reply_to", "fields"],
  lead_events: ["lead_id", "actor", "action"],
  lead_deletions: ["deleted_by", "lead_id", "reason"],
  angebote: [
    "lead_id",
    "token",
    "gueltig_bis",
    "kunde_name",
    "titel",
    "einleitung",
    "hinweise",
  ],
  projekte: ["angebot_id", "lead_id", "schritte"],
  post_status: ["datum", "platz", "format", "text"],
  serien: ["datum", "serie"],
  instagram_posts: ["art", "quelle", "bilder"],
};

/** Enthält a den Wert b (jsonb @>)? */
function contains(a, b) {
  if (b === null || typeof b !== "object") return a === b;
  if (Array.isArray(b))
    return Array.isArray(a) && b.every((x) => a.some((y) => contains(y, x)));
  if (!a || typeof a !== "object" || Array.isArray(a)) return false;
  return Object.entries(b).every(
    ([k, v]) => Object.prototype.hasOwnProperty.call(a, k) && contains(a[k], v),
  );
}

const berlinYear = (d) =>
  new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/Berlin",
    year: "numeric",
  }).format(d);

/** Ein PostgREST-Filter „op.wert“ als Prüffunktion, oder null. */
function parseFilter(raw) {
  const dot = raw.indexOf(".");
  if (dot < 0) return null;
  const op = raw.slice(0, dot);
  const value = raw.slice(dot + 1);
  const str = (v) => (v === null || v === undefined ? null : String(v));
  switch (op) {
    case "eq":
      return (v) => str(v) === value;
    case "neq":
      return (v) => str(v) !== value;
    case "gt":
      return (v) => v != null && String(v) > value;
    case "gte":
      return (v) => v != null && String(v) >= value;
    case "lt":
      return (v) => v != null && String(v) < value;
    case "lte":
      return (v) => v != null && String(v) <= value;
    case "is":
      if (value === "null") return (v) => v === null || v === undefined;
      if (value === "true") return (v) => v === true;
      if (value === "false") return (v) => v === false;
      return null;
    case "cs": {
      let wanted;
      try {
        wanted = JSON.parse(value);
      } catch {
        return null;
      }
      return (v) => contains(v, wanted);
    }
    case "in": {
      const m = /^\((.*)\)$/.exec(value);
      if (!m) return null;
      const list = m[1].split(",").map((x) => x.trim().replace(/^"|"$/g, ""));
      return (v) => list.includes(str(v));
    }
    default:
      return null;
  }
}

export const SERVICE_KEY = "test-service-role-key";
/** Öffentlicher Schlüssel (Browser): darf nur mit Token hochladen. */
export const ANON_KEY = "test-anon-key";

/**
 * @typedef {Record<string, any>} Row
 * @typedef {{ leads: Row[]; lead_events: Row[]; lead_deletions: Row[]; angebote: Row[]; projekte: Row[]; post_status: Row[]; serien: Row[]; instagram_posts: Row[] }} Tables
 * @typedef {{ bucket: string; path: string; bytes: Buffer; contentType: string; created_at: string; id: string }} StoredObject
 * @typedef {{ method: string; url: string; headers: { prefer: string; accept: string }; body: unknown }} MockRequest
 * @typedef {"v0" | "v1" | "v2" | "v3" | "v4" | "v5" | "v6"} MockMode
 */

/** @returns {Tables} */
function emptyTables() {
  return {
    leads: [],
    lead_events: [],
    lead_deletions: [],
    angebote: [],
    projekte: [],
    post_status: [],
    serien: [],
    instagram_posts: [],
  };
}

/** @param {{ mode?: MockMode; key?: string }} [options] */
export async function startMock({ mode = "v3", key = SERVICE_KEY } = {}) {
  /** @type {{ mode: MockMode; tables: Tables; requests: MockRequest[]; angebotSeq: number; denied: Set<string>; buckets: Map<string, any>; objects: Map<string, StoredObject>; uploadTokens: Map<string, string>; signTokens: Map<string, string>; storageDown: boolean }} */
  const state = {
    mode,
    tables: emptyTables(),
    requests: [],
    angebotSeq: 0,
    denied: new Set(),
    buckets: bucketsFor(mode),
    objects: new Map(),
    uploadTokens: new Map(),
    signTokens: new Map(),
    storageDown: false,
  };
  let lastTime = 0;
  /** Feste Uhr für Tests (Millisekunden) oder null für die echte Zeit. */
  let fixedNow = null;
  const nowIso = () => {
    // Streng steigende Zeitstempel, damit „neueste zuerst“ eindeutig ist.
    lastTime = Math.max(fixedNow ?? Date.now(), lastTime + 1);
    return new Date(lastTime).toISOString();
  };

  function defaults(table) {
    const t = nowIso();
    if (table === "leads") {
      const row = {
        id: randomUUID(),
        created_at: t,
        updated_at: t,
        status: "neu",
        notes: "",
        delivered_via: null,
        delivery_error: null,
      };
      if (state.mode !== "v0" && state.mode !== "v1")
        Object.assign(row, {
          follow_up_on: null,
          outcome: null,
          lost_reason: null,
        });
      return row;
    }
    if (table === "lead_events")
      return { id: randomUUID(), created_at: t, detail: {} };
    if (table === "angebote") {
      // Wie angebote_naechste_nummer(): Jahr in Hamburg, Zähler läuft weiter.
      state.angebotSeq += 1;
      const n = String(state.angebotSeq).padStart(4, "0");
      return {
        id: randomUUID(),
        nummer: `A-${berlinYear(new Date(t))}-${n}`,
        status: "entwurf",
        created_at: t,
        updated_at: t,
        sent_at: null,
        first_viewed_at: null,
        accepted_at: null,
        declined_at: null,
        kunde_firma: null,
        kunde_email: null,
        positionen: [],
        ust_satz: 19,
        angenommen_von: null,
        abgelehnt_grund: null,
      };
    }
    if (table === "projekte")
      return {
        id: randomUUID(),
        created_at: t,
        updated_at: t,
        schritte: {},
        livegang_am: null,
        pflege_seit: null,
        pflege_bis: null,
        notiz: null,
      };
    // Kein id: Primärschlüssel ist (datum, platz, format).
    if (table === "post_status") return { gepostet_at: t };
    if (table === "serien")
      return {
        id: randomUUID(),
        created_at: t,
        auftrag: "",
        gepostet_at: null,
      };
    if (table === "instagram_posts")
      return { id: randomUUID(), created_at: t, media_ids: [], links: [] };
    return {
      id: randomUUID(),
      deleted_at: t,
      lead_kind: null,
      lead_created_at: null,
    };
  }

  /** 409 wie bei einer verletzten Eindeutigkeit. */
  function duplicate(name) {
    return {
      status: 409,
      body: {
        code: "23505",
        message: `duplicate key value violates unique constraint "${name}"`,
      },
    };
  }

  function foreignKey(table) {
    return {
      status: 409,
      body: {
        code: "23503",
        message: `insert or update on table "${table}" violates foreign key constraint`,
      },
    };
  }

  /** before: die Zeile vor einem PATCH (zählt nicht als Doppel). */
  function check(table, row, before = null) {
    for (const col of REQUIRED[table] ?? []) {
      if (row[col] === undefined || row[col] === null) {
        return {
          status: 400,
          body: {
            code: "23502",
            message: `null value in column "${col}" of relation "${table}" violates not-null constraint`,
          },
        };
      }
    }
    if (table === "leads") {
      if (!["anfrage", "audit", "termin"].includes(row.kind))
        return checkFail(table, "leads_kind_check");
      if (!["neu", "in_arbeit", "erledigt", "archiviert"].includes(row.status))
        return checkFail(table, "leads_status_check");
      if (
        row.outcome != null &&
        !["gewonnen", "verloren"].includes(row.outcome)
      )
        return checkFail(table, "leads_outcome_check");
    }
    if (
      (table === "lead_events" ||
        table === "angebote" ||
        table === "projekte") &&
      !state.tables.leads.some((l) => l.id === row.lead_id)
    ) {
      return foreignKey(table);
    }
    if (table === "projekte") {
      if (!state.tables.angebote.some((a) => a.id === row.angebot_id))
        return foreignKey(table);
      if (
        state.tables.projekte.some(
          (p) => p.id !== row.id && p.angebot_id === row.angebot_id,
        )
      )
        return duplicate("projekte_angebot_id_key");
      const s = row.schritte;
      if (!s || typeof s !== "object" || Array.isArray(s))
        return checkFail(table, "projekte_schritte_check");
      if (typeof row.notiz === "string" && row.notiz.length > 2000)
        return checkFail(table, "projekte_notiz_check");
      if (
        row.pflege_bis != null &&
        row.pflege_seit != null &&
        String(row.pflege_bis) < String(row.pflege_seit)
      )
        return checkFail(table, "projekte_pflege_check");
    }
    if (table === "post_status") {
      if (![0, 1, 2].includes(row.platz))
        return checkFail(table, "post_status_platz_check");
      if (!["story", "beitrag"].includes(row.format))
        return checkFail(table, "post_status_format_check");
      if (typeof row.text !== "string" || row.text.length > 500)
        return checkFail(table, "post_status_text_check");
      if (
        state.tables.post_status.some(
          (p) =>
            p !== before &&
            p.datum === row.datum &&
            p.platz === row.platz &&
            p.format === row.format,
        )
      )
        return duplicate("post_status_pkey");
    }
    if (table === "serien") {
      if (typeof row.auftrag !== "string" || row.auftrag.length > 500)
        return checkFail(table, "serien_auftrag_check");
      const s = row.serie;
      if (!s || typeof s !== "object" || Array.isArray(s))
        return checkFail(table, "serien_serie_check");
    }
    if (table === "instagram_posts") {
      if (!["story", "beitrag"].includes(row.art))
        return checkFail(table, "instagram_posts_art_check");
      if (!Number.isInteger(row.bilder) || row.bilder < 1 || row.bilder > 10)
        return checkFail(table, "instagram_posts_bilder_check");
      const q = row.quelle;
      if (!q || typeof q !== "object" || Array.isArray(q))
        return checkFail(table, "instagram_posts_quelle_check");
      for (const col of ["media_ids", "links"])
        if (
          !Array.isArray(row[col]) ||
          !row[col].every((x) => typeof x === "string")
        )
          return {
            status: 400,
            body: { code: "22P02", message: `malformed array literal` },
          };
    }
    if (table === "angebote") {
      if (!ANGEBOT_STATUSES.includes(row.status))
        return checkFail(table, "angebote_status_check");
      if (typeof row.token !== "string" || row.token.length < 32)
        return checkFail(table, "angebote_token_check");
      if (row.ust_satz !== 0 && row.ust_satz !== 19)
        return checkFail(table, "angebote_ust_satz_check");
      if (!Array.isArray(row.positionen))
        return checkFail(table, "angebote_positionen_check");
      for (const col of ["token", "nummer"]) {
        if (
          state.tables.angebote.some(
            (a) => a.id !== row.id && a[col] === row[col],
          )
        ) {
          return {
            status: 409,
            body: {
              code: "23505",
              message: `duplicate key value violates unique constraint "angebote_${col}_key"`,
            },
          };
        }
      }
    }
    return null;
  }

  /** Trigger-Ersatz für updated_at nach einem PATCH. */
  function touch(table, before, next) {
    if (table === "leads" || table === "projekte") return nowIso();
    if (
      table === "angebote" &&
      ANGEBOT_INHALT.some(
        (c) => JSON.stringify(before[c]) !== JSON.stringify(next[c]),
      )
    )
      return nowIso();
    return before.updated_at;
  }

  function checkFail(table, name) {
    return {
      status: 400,
      body: {
        code: "23514",
        message: `new row for relation "${table}" violates check constraint "${name}"`,
      },
    };
  }

  /** Fehler wie Supabase Storage: HTTP 400 mit statusCode im Körper. */
  function storageFail(statusCode, error, message, status = 400) {
    return { status, body: { statusCode, error, message } };
  }

  /** Teil hinter dem Präfix: Bucket und Pfad (dekodiert). */
  function bucketUndPfad(rest) {
    const teile = rest.split("/").map((t) => decodeURIComponent(t));
    const bucket = teile.shift() ?? "";
    return { bucket, path: teile.filter(Boolean).join("/") };
  }

  /** Datei aus einem Upload-Körper (roh oder multipart/form-data). */
  function dateiAus(req, buf) {
    const typ = String(req.headers["content-type"] ?? "");
    if (!typ.startsWith("multipart/form-data"))
      return { bytes: buf, contentType: typ.split(";")[0].trim() };
    // Grob: erster Teil mit Dateiinhalt, Inhaltstyp aus dessen Kopf.
    const text = buf.toString("latin1");
    const kopfEnde = text.indexOf("\r\n\r\n");
    const kopf = kopfEnde >= 0 ? text.slice(0, kopfEnde) : "";
    const ct = /content-type:\s*([^\r\n;]+)/i.exec(kopf)?.[1]?.trim() ?? "";
    const grenze = /boundary=([^;]+)/.exec(typ)?.[1] ?? "";
    let inhalt = kopfEnde >= 0 ? text.slice(kopfEnde + 4) : text;
    const ende = grenze ? inhalt.indexOf(`\r\n--${grenze}`) : -1;
    if (ende >= 0) inhalt = inhalt.slice(0, ende);
    return { bytes: Buffer.from(inhalt, "latin1"), contentType: ct };
  }

  function handleStorage(req, url, buf) {
    const p = url.pathname.slice("/storage/v1".length);
    const apikey = req.headers.apikey;
    const istService = apikey === key;
    const json = () => {
      try {
        return buf.length ? JSON.parse(buf.toString("utf8")) : {};
      } catch {
        return {};
      }
    };
    if (state.storageDown)
      return storageFail("500", "internal", "mock: Speicher aus", 500);

    // Datei über die signierte Adresse (Instagram lädt so, ohne Schlüssel).
    if (req.method === "GET" && p.startsWith("/object/sign/")) {
      const { bucket, path } = bucketUndPfad(p.slice("/object/sign/".length));
      const token = url.searchParams.get("token") ?? "";
      const ziel = state.signTokens.get(token);
      const obj = state.objects.get(`${bucket}/${path}`);
      if (ziel !== `${bucket}/${path}` || !obj)
        return storageFail("400", "InvalidSignature", "invalid signature");
      return { status: 200, raw: obj.bytes, contentType: obj.contentType };
    }

    // Hochladen mit dem Token eines Platzes (Browser, anon-Schlüssel).
    if (req.method === "PUT" && p.startsWith("/object/upload/sign/")) {
      if (!istService && apikey !== ANON_KEY)
        return storageFail("403", "Unauthorized", "Invalid API key", 403);
      const { bucket, path } = bucketUndPfad(
        p.slice("/object/upload/sign/".length),
      );
      const token = url.searchParams.get("token") ?? "";
      if (state.uploadTokens.get(token) !== `${bucket}/${path}`)
        return storageFail("400", "InvalidSignature", "invalid signature");
      const b = state.buckets.get(bucket);
      if (!b) return storageFail("404", "Bucket not found", "Bucket not found");
      const { bytes, contentType } = dateiAus(req, buf);
      if (b.file_size_limit && bytes.length > b.file_size_limit)
        return storageFail(
          "413",
          "Payload too large",
          "The object exceeded the maximum allowed size",
        );
      if (b.allowed_mime_types && !b.allowed_mime_types.includes(contentType))
        return storageFail(
          "415",
          "invalid_mime_type",
          `mime type ${contentType} is not supported`,
        );
      if (state.objects.has(`${bucket}/${path}`))
        return storageFail("409", "Duplicate", "The resource already exists");
      state.uploadTokens.delete(token);
      const id = randomUUID();
      state.objects.set(`${bucket}/${path}`, {
        bucket,
        path,
        bytes,
        contentType,
        created_at: nowIso(),
        id,
      });
      return { status: 200, body: { Key: `${bucket}/${path}`, Id: id } };
    }

    if (!istService)
      return storageFail("403", "Unauthorized", "Invalid API key", 403);

    if (req.method === "GET" && p.startsWith("/bucket/")) {
      const id = decodeURIComponent(p.slice("/bucket/".length));
      const b = state.buckets.get(id);
      if (!b) return storageFail("404", "Bucket not found", "Bucket not found");
      return {
        status: 200,
        body: { ...b, owner: "", created_at: "", updated_at: "" },
      };
    }

    // Upload-Platz anlegen.
    if (req.method === "POST" && p.startsWith("/object/upload/sign/")) {
      const { bucket, path } = bucketUndPfad(
        p.slice("/object/upload/sign/".length),
      );
      if (!state.buckets.has(bucket))
        return storageFail("404", "Bucket not found", "Bucket not found");
      if (state.objects.has(`${bucket}/${path}`))
        return storageFail("409", "Duplicate", "The resource already exists");
      const token = `up-${randomUUID()}`;
      state.uploadTokens.set(token, `${bucket}/${path}`);
      return {
        status: 200,
        body: { url: `/object/upload/sign/${bucket}/${path}?token=${token}` },
      };
    }

    // Signierte Adresse zum Lesen.
    if (req.method === "POST" && p.startsWith("/object/sign/")) {
      const { bucket, path } = bucketUndPfad(p.slice("/object/sign/".length));
      if (!state.buckets.has(bucket))
        return storageFail("404", "Bucket not found", "Bucket not found");
      if (!state.objects.has(`${bucket}/${path}`))
        return storageFail("404", "not_found", "Object not found");
      const body = json();
      if (!Number.isInteger(body.expiresIn) || body.expiresIn < 1)
        return storageFail("400", "invalid", "expiresIn fehlt");
      const token = `sig-${randomUUID()}`;
      state.signTokens.set(token, `${bucket}/${path}`);
      return {
        status: 200,
        body: { signedURL: `/object/sign/${bucket}/${path}?token=${token}` },
      };
    }

    // Löschen: DELETE /object/:bucket mit {prefixes}.
    if (req.method === "DELETE" && /^\/object\/[^/]+$/.test(p)) {
      const bucket = decodeURIComponent(p.slice("/object/".length));
      if (!state.buckets.has(bucket))
        return storageFail("404", "Bucket not found", "Bucket not found");
      const body = json();
      const prefixes = Array.isArray(body.prefixes) ? body.prefixes : [];
      const geloescht = [];
      for (const name of prefixes) {
        const obj = state.objects.get(`${bucket}/${name}`);
        if (!obj) continue;
        state.objects.delete(`${bucket}/${name}`);
        geloescht.push({ name, bucket_id: bucket, id: obj.id });
      }
      return { status: 200, body: geloescht };
    }

    // Auflisten: POST /object/list/:bucket mit {prefix, limit, offset}.
    if (req.method === "POST" && p.startsWith("/object/list/")) {
      const bucket = decodeURIComponent(p.slice("/object/list/".length));
      if (!state.buckets.has(bucket))
        return storageFail("404", "Bucket not found", "Bucket not found");
      const body = json();
      const prefix = String(body.prefix ?? "").replace(/^\/+|\/+$/g, "");
      const limit = Number.isInteger(body.limit) ? body.limit : 100;
      const offset = Number.isInteger(body.offset) ? body.offset : 0;
      const ordner = new Set();
      const dateien = [];
      for (const obj of state.objects.values()) {
        if (obj.bucket !== bucket) continue;
        let rest = obj.path;
        if (prefix) {
          if (!obj.path.startsWith(`${prefix}/`)) continue;
          rest = obj.path.slice(prefix.length + 1);
        }
        const [erster, ...weiter] = rest.split("/");
        if (weiter.length) ordner.add(erster);
        else
          dateien.push({
            name: erster,
            id: obj.id,
            updated_at: obj.created_at,
            created_at: obj.created_at,
            last_accessed_at: obj.created_at,
            metadata: { size: obj.bytes.length, mimetype: obj.contentType },
          });
      }
      const liste = [
        ...[...ordner].sort().map((name) => ({
          name,
          id: null,
          updated_at: null,
          created_at: null,
          last_accessed_at: null,
          metadata: null,
        })),
        ...dateien.sort((a, b) => (a.name < b.name ? -1 : 1)),
      ];
      return { status: 200, body: liste.slice(offset, offset + limit) };
    }

    return storageFail(
      "404",
      "not_found",
      "mock: unbekannter Speicherpfad",
      404,
    );
  }

  function handle(req, buf) {
    const url = new URL(req.url, "http://mock");
    const istSpeicher = url.pathname.startsWith("/storage/v1/");
    const rawBody = buf.toString("utf8");
    let body;
    try {
      body = rawBody ? JSON.parse(rawBody) : undefined;
    } catch {
      body = istSpeicher ? { bytes: buf.length } : rawBody;
    }
    state.requests.push({
      method: req.method,
      url: `${url.pathname}${url.search}`,
      headers: {
        prefer: req.headers.prefer ?? "",
        accept: req.headers.accept ?? "",
      },
      body,
    });
    if (istSpeicher) return handleStorage(req, url, buf);

    if (req.headers.apikey !== key) {
      return {
        status: 401,
        body: {
          message: "Invalid API key",
          hint: "Double check your Supabase `anon` or `service_role` API key.",
        },
      };
    }

    const m = /^\/rest\/v1\/([a-z_]+)$/.exec(url.pathname);
    if (!m) return { status: 404, body: { message: "mock: unbekannter Pfad" } };
    const table = m[1];
    if (state.denied.has(table) && schemaFor(state.mode)[table]) {
      return {
        status: 403,
        body: {
          code: "42501",
          message: `permission denied for table ${table}`,
        },
      };
    }
    const columns = schemaFor(state.mode)[table];
    if (!columns) {
      return {
        status: 404,
        body: {
          code: "PGRST205",
          message: `Could not find the table 'public.${table}' in the schema cache`,
        },
      };
    }
    const missingColumn = (col) => ({
      status: 400,
      body: { code: "42703", message: `column ${table}.${col} does not exist` },
    });

    // select
    const selectParam = url.searchParams.get("select") ?? "*";
    const selected =
      selectParam === "*"
        ? columns
        : selectParam.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
    for (const col of selected)
      if (!columns.includes(col)) return missingColumn(col);

    // Filter
    const filters = [];
    for (const [k, v] of url.searchParams) {
      if (["select", "order", "limit", "offset", "columns"].includes(k))
        continue;
      if (!columns.includes(k)) return missingColumn(k);
      const test = parseFilter(v);
      if (!test)
        return {
          status: 400,
          body: { code: "PGRST100", message: `mock: Filter ${v} unbekannt` },
        };
      filters.push([k, test]);
    }

    // order
    const order = [];
    for (const part of (url.searchParams.get("order") ?? "")
      .split(",")
      .filter(Boolean)) {
      const [col, dir = "asc"] = part.split(".");
      if (!columns.includes(col)) return missingColumn(col);
      order.push([col, dir]);
    }
    const limitParam = url.searchParams.get("limit");
    const limit = limitParam === null ? Infinity : Number(limitParam);

    const prefer = req.headers.prefer ?? "";
    const wantsRepresentation = /return=representation/.test(prefer);
    const single = (req.headers.accept ?? "").includes("vnd.pgrst.object+json");
    const rows = state.tables[table];
    const matches = (row) => filters.every(([k, test]) => test(row[k]));
    const project = (row) =>
      Object.fromEntries(selected.map((c) => [c, row[c] ?? null]));

    const respond = (status, list) => {
      const out = list.map(project);
      if (single) {
        if (out.length !== 1) {
          return {
            status: 406,
            body: {
              code: "PGRST116",
              details: `The result contains ${out.length} rows`,
              message: "JSON object requested, multiple (or no) rows returned",
            },
          };
        }
        return { status, body: out[0] };
      }
      return { status, body: out };
    };

    if (req.method === "GET") {
      let hit = rows.filter(matches);
      if (order.length) {
        hit = [...hit].sort((a, b) => {
          for (const [col, dir] of order) {
            const av = a[col] ?? "";
            const bv = b[col] ?? "";
            if (av < bv) return dir === "desc" ? 1 : -1;
            if (av > bv) return dir === "desc" ? -1 : 1;
          }
          return 0;
        });
      }
      return respond(200, hit.slice(0, limit));
    }

    if (req.method === "POST") {
      const items = Array.isArray(body) ? body : [body];
      for (const item of items) {
        for (const k of Object.keys(item ?? {})) {
          if (!columns.includes(k)) {
            return {
              status: 400,
              body: {
                code: "PGRST204",
                message: `Could not find the '${k}' column of '${table}' in the schema cache`,
              },
            };
          }
        }
      }
      const created = [];
      for (const item of items) {
        const row = { ...defaults(table), ...item };
        const fail = check(table, row);
        if (fail) return fail;
        created.push(row);
      }
      rows.push(...created);
      return wantsRepresentation ? respond(201, created) : { status: 201 };
    }

    if (req.method === "PATCH") {
      for (const k of Object.keys(body ?? {})) {
        if (!columns.includes(k)) {
          return {
            status: 400,
            body: {
              code: "PGRST204",
              message: `Could not find the '${k}' column of '${table}' in the schema cache`,
            },
          };
        }
      }
      const hit = rows.filter(matches);
      const nextRows = [];
      for (const row of hit) {
        const next = { ...row, ...body };
        if (["leads", "angebote", "projekte"].includes(table))
          next.updated_at = touch(table, row, next); // Trigger-Ersatz
        const fail = check(table, next, row);
        if (fail) return fail;
        nextRows.push(next);
      }
      hit.forEach((row, i) => Object.assign(row, nextRows[i]));
      return wantsRepresentation ? respond(200, hit) : { status: 204 };
    }

    if (req.method === "DELETE") {
      const hit = rows.filter(matches);
      state.tables[table] = rows.filter((r) => !hit.includes(r));
      // on delete cascade: Anfrage → Verlauf, Angebote, Projekte;
      // Angebot → Projekt.
      const ids = new Set(hit.map((r) => r.id));
      if (table === "leads") {
        state.tables.lead_events = state.tables.lead_events.filter(
          (e) => !ids.has(e.lead_id),
        );
        const angebote = state.tables.angebote.filter((a) =>
          ids.has(a.lead_id),
        );
        for (const a of angebote) ids.add(a.id);
        state.tables.angebote = state.tables.angebote.filter(
          (a) => !ids.has(a.lead_id),
        );
      }
      if (table === "leads" || table === "angebote") {
        state.tables.projekte = state.tables.projekte.filter(
          (p) => !ids.has(p.lead_id) && !ids.has(p.angebot_id),
        );
      }
      return wantsRepresentation ? respond(200, hit) : { status: 204 };
    }

    return {
      status: 405,
      body: { message: "mock: Methode nicht unterstützt" },
    };
  }

  const server = http.createServer((req, res) => {
    /** @type {Buffer[]} */
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      const { status, body, raw, contentType } = handle(
        req,
        Buffer.concat(chunks),
      );
      if (raw) {
        res.writeHead(status, { "content-type": contentType });
        res.end(raw);
        return;
      }
      res.writeHead(status, {
        "content-type": "application/json; charset=utf-8",
      });
      res.end(body === undefined ? "" : JSON.stringify(body));
    });
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address();

  return {
    url: `http://127.0.0.1:${port}`,
    get tables() {
      return state.tables;
    },
    get requests() {
      return state.requests;
    },
    /** @param {MockMode} next */
    setMode(next) {
      state.mode = next;
    },
    /** @param {MockMode} [next] */
    reset(next = state.mode) {
      state.mode = next;
      state.tables = emptyTables();
      state.requests = [];
      state.angebotSeq = 0;
      state.denied = new Set();
      state.buckets = bucketsFor(next);
      state.objects = new Map();
      state.uploadTokens = new Map();
      state.signTokens = new Map();
      state.storageDown = false;
    },
    /** Dateien im Speicher: „bucket/pfad“ → Datei. */
    get objects() {
      return state.objects;
    },
    /** Buckets im Speicher: id → Einstellungen. */
    get buckets() {
      return state.buckets;
    },
    /**
     * Datei direkt in den Speicher legen (an der API vorbei).
     * @param {string} bucket
     * @param {string} path
     * @param {Buffer} [bytes]
     * @param {string} [contentType]
     */
    seedObject(
      bucket,
      path,
      bytes = Buffer.from([0xff, 0xd8, 0xff, 0xd9]),
      contentType = "image/jpeg",
    ) {
      state.objects.set(`${bucket}/${path}`, {
        bucket,
        path,
        bytes,
        contentType,
        created_at: nowIso(),
        id: randomUUID(),
      });
    },
    /**
     * Speicher aus (jede Anfrage an /storage/v1 scheitert mit 500) oder
     * wieder an.
     * @param {boolean} down
     */
    setStorageDown(down) {
      state.storageDown = down;
    },
    /** Zeile direkt anlegen (an der API vorbei), gibt sie zurück. */
    /**
     * @param {Row} [partial]
     * @returns {Row}
     */
    seedLead(partial = {}) {
      const row = {
        ...defaults("leads"),
        kind: "anfrage",
        subject: "Neue Anfrage",
        reply_to: "kunde@example.de",
        fields: [["Name", "Kunde"]],
        ...partial,
      };
      state.tables.leads.push(row);
      return row;
    },
    /**
     * Angebot direkt anlegen (an der API vorbei, Modus v3), gibt es
     * zurück. Ohne lead_id wird eine Anfrage mit angelegt.
     * @param {Row} [partial]
     * @returns {Row}
     */
    seedAngebot(partial = {}) {
      const leadId =
        partial.lead_id ??
        this.seedLead({
          fields: [
            ["Name", "Kunde"],
            ["Firma", "Firma"],
          ],
        }).id;
      const row = {
        ...defaults("angebote"),
        lead_id: leadId,
        token: randomUUID().replace(/-/g, "") + "abcdefghijk",
        gueltig_bis: "2026-12-01",
        kunde_name: "Kunde",
        titel: "Angebot: Website für Firma",
        einleitung: "Guten Tag Kunde,",
        hinweise: "Hinweise",
        positionen: [
          {
            id: "paket-business-einmalig",
            titel: "Website-Paket Business",
            beschreibung: "",
            menge: 1,
            preis_cent: 99900,
            art: "einmalig",
          },
        ],
        ...partial,
      };
      state.tables.angebote.push(row);
      return row;
    },
    /**
     * Projekt direkt anlegen (an der API vorbei, Modus v4), gibt es
     * zurück. Ohne angebot_id wird ein angenommenes Angebot mit angelegt.
     * @param {Row} [partial]
     * @returns {Row}
     */
    seedProjekt(partial = {}) {
      const angebot = partial.angebot_id
        ? state.tables.angebote.find((a) => a.id === partial.angebot_id)
        : this.seedAngebot({
            status: "angenommen",
            accepted_at: nowIso(),
            angenommen_von: "Kunde",
          });
      const row = {
        ...defaults("projekte"),
        angebot_id: angebot?.id ?? partial.angebot_id,
        lead_id: angebot?.lead_id ?? partial.lead_id,
        ...partial,
      };
      state.tables.projekte.push(row);
      return row;
    },
    /**
     * Post als gepostet eintragen (an der API vorbei, Modus v4).
     * @param {Row} partial datum, platz, format, text
     * @returns {Row}
     */
    seedPostStatus(partial) {
      const row = { ...defaults("post_status"), ...partial };
      state.tables.post_status.push(row);
      return row;
    },
    /**
     * Serie direkt anlegen (an der API vorbei, Modus v5).
     * @param {Row} partial datum, serie; optional auftrag, created_at
     * @returns {Row}
     */
    seedSerie(partial) {
      const row = { ...defaults("serien"), ...partial };
      state.tables.serien.push(row);
      return row;
    },
    /**
     * Stellt die Uhr der Datenbank: Neue Zeilen bekommen ab jetzt diesen
     * Zeitpunkt (und danach je eine Millisekunde mehr). null = echte Zeit.
     * Damit hängen Tests mit festem „jetzt“ nicht am echten Kalendertag.
     * @param {Date | null} when
     */
    /**
     * Tabellen, an denen dem Server die Rechte fehlen (42501), wie nach
     * einer Migration ohne grant. Leere Liste: alles wieder erlaubt.
     * reset() hebt es ebenfalls auf.
     * @param {string[]} tables
     */
    deny(tables) {
      state.denied = new Set(tables);
    },
    setNow(when) {
      fixedNow = when ? when.getTime() : null;
      lastTime = 0;
    },
    close() {
      return new Promise((resolve) => server.close(() => resolve()));
    },
  };
}
