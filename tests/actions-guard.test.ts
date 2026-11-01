/**
 * Statische Prüfung der Zugangsregeln im Admin-Bereich.
 *
 * - Jede Server Action ('use server' auf Datei- oder Funktionsebene,
 *   auch Pfeilfunktionen) außer login und logout beginnt mit
 *   `await requireAdmin()` (z. B. `const actor = await requireAdmin();`).
 *   Ausnahme: die Kunden-Actions in app/angebot/actions.ts (Token statt
 *   Login); sie beginnen mit parseToken, nutzen nur die Kunden-
 *   Funktionen des Speichers und loggen weder Token noch Kundendaten.
 * - Inline-'use server' gibt es nicht: Alle Actions bleiben in
 *   app/admin/actions.ts.
 * - Jede page.tsx und jedes generateMetadata unter app/admin (außer
 *   login) ruft requireAdmin oder getAdminEmail auf, jede route.ts
 *   requireAdmin.
 * - app/admin/layout.tsx bleibt dynamic = "force-dynamic".
 * - Kein console.* in app/admin, lib/admin und app/api/anfrage gibt
 *   reply_to, replyTo, fields oder notes aus.
 */
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import { describe, it } from "node:test";
import { fileURLToPath } from "node:url";

import ts from "typescript";

const ROOT = path.resolve(fileURLToPath(new URL("..", import.meta.url)));

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name === "node_modules" || name.startsWith(".")) continue;
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(ts|tsx)$/.test(name)) out.push(full);
  }
  return out;
}

const rel = (f: string) => path.relative(ROOT, f).split(path.sep).join("/");

function parse(file: string): ts.SourceFile {
  return ts.createSourceFile(
    file,
    readFileSync(file, "utf8"),
    ts.ScriptTarget.Latest,
    true,
    file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  );
}

function isUseServer(stmt: ts.Statement): boolean {
  return (
    ts.isExpressionStatement(stmt) &&
    ts.isStringLiteral(stmt.expression) &&
    stmt.expression.text === "use server"
  );
}

/** Direktiven stehen am Anfang (nur String-Ausdrücke davor). */
function hasDirective(statements: readonly ts.Statement[]): boolean {
  for (const stmt of statements) {
    if (isUseServer(stmt)) return true;
    if (
      !(ts.isExpressionStatement(stmt) && ts.isStringLiteral(stmt.expression))
    ) {
      return false;
    }
  }
  return false;
}

type Fn =
  | ts.FunctionDeclaration
  | ts.FunctionExpression
  | ts.ArrowFunction
  | ts.MethodDeclaration;

function isFn(node: ts.Node): node is Fn {
  return (
    ts.isFunctionDeclaration(node) ||
    ts.isFunctionExpression(node) ||
    ts.isArrowFunction(node) ||
    ts.isMethodDeclaration(node)
  );
}

function bodyStatements(fn: Fn): readonly ts.Statement[] | null {
  return fn.body && ts.isBlock(fn.body) ? fn.body.statements : null;
}

/** Ist das `await requireAdmin()` bzw. `const x = await requireAdmin()`? */
function isRequireAdminCall(expr: ts.Expression | undefined): boolean {
  return (
    !!expr &&
    ts.isAwaitExpression(expr) &&
    ts.isCallExpression(expr.expression) &&
    ts.isIdentifier(expr.expression.expression) &&
    expr.expression.expression.text === "requireAdmin" &&
    expr.expression.arguments.length === 0
  );
}

function firstStatementIsGuard(statements: readonly ts.Statement[]): boolean {
  const rest = statements.filter(
    (s) => !(ts.isExpressionStatement(s) && ts.isStringLiteral(s.expression)),
  );
  const first = rest[0];
  if (!first) return false;
  if (ts.isExpressionStatement(first))
    return isRequireAdminCall(first.expression);
  if (ts.isVariableStatement(first)) {
    const decls = first.declarationList.declarations;
    return decls.length === 1 && isRequireAdminCall(decls[0].initializer);
  }
  return false;
}

function isExported(node: ts.Node): boolean {
  const mods = ts.canHaveModifiers(node) ? ts.getModifiers(node) : undefined;
  return !!mods?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
}

/** Exportierte Funktionen einer Datei: Name → Funktionsknoten. */
function exportedFunctions(
  sf: ts.SourceFile,
): { name: string; fn: Fn | null }[] {
  const out: { name: string; fn: Fn | null }[] = [];
  for (const stmt of sf.statements) {
    if (ts.isFunctionDeclaration(stmt) && isExported(stmt)) {
      const isDefault = ts
        .getModifiers(stmt)
        ?.some((m) => m.kind === ts.SyntaxKind.DefaultKeyword);
      out.push({
        name: isDefault ? "default" : (stmt.name?.text ?? "default"),
        fn: stmt,
      });
    } else if (ts.isVariableStatement(stmt) && isExported(stmt)) {
      for (const d of stmt.declarationList.declarations) {
        const init = d.initializer;
        out.push({
          name: d.name.getText(sf),
          fn: init && isFn(init) ? init : null,
        });
      }
    } else if (ts.isExportAssignment(stmt)) {
      out.push({
        name: "default",
        fn: isFn(stmt.expression) ? stmt.expression : null,
      });
    }
  }
  return out;
}

const SOURCE_FILES = [
  ...walk(path.join(ROOT, "app")),
  ...walk(path.join(ROOT, "lib")),
];
const PUBLIC_ACTIONS = new Set(["login", "logout"]);

/**
 * Öffentliche Actions der Kundenseite /angebot/[token]: ohne Login,
 * ausgewiesen nur durch den Token. Nur diese Namen in genau dieser
 * Datei; jede weitere Action dort braucht requireAdmin. Weitere Regeln
 * im Abschnitt „Kundenseite /angebot“ unten.
 */
const KUNDEN_ACTIONS_DATEI = "app/angebot/actions.ts";
const KUNDEN_ACTIONS = new Set([
  "angebotGeoeffnet",
  "angebotAnnehmen",
  "angebotAblehnen",
]);

describe("Server Actions verlangen requireAdmin", () => {
  const serverFiles = SOURCE_FILES.filter((f) =>
    hasDirective(parse(f).statements),
  );

  it("findet die Action-Datei", () => {
    assert.ok(
      serverFiles.map(rel).includes("app/admin/actions.ts"),
      "app/admin/actions.ts ohne 'use server'?",
    );
  });

  for (const file of serverFiles) {
    it(`${rel(file)}: jede Action beginnt mit await requireAdmin()`, () => {
      const sf = parse(file);
      const fns = exportedFunctions(sf);
      assert.ok(fns.length > 0);
      for (const { name, fn } of fns) {
        assert.ok(
          fn,
          `${name}: in einer 'use server'-Datei nur Funktionen exportieren`,
        );
        if (PUBLIC_ACTIONS.has(name)) continue;
        if (rel(file) === KUNDEN_ACTIONS_DATEI && KUNDEN_ACTIONS.has(name))
          continue;
        const body = bodyStatements(fn);
        assert.ok(body, `${name}: braucht einen Funktionsblock`);
        assert.ok(
          firstStatementIsGuard(body),
          `${name}: erste Anweisung muss \`const actor = await requireAdmin();\` sein`,
        );
      }
    });
  }

  it("die Prüfung erkennt fehlende oder späte Guards", () => {
    const sf = ts.createSourceFile(
      "a.ts",
      [
        '"use server";',
        "export async function ok1() { const actor = await requireAdmin(); return actor; }",
        "export const ok2 = async () => { await requireAdmin(); };",
        "export async function late() { const id = 1; await requireAdmin(); return id; }",
        "export const arrow = async (id: string) => updateLead(id);",
        "export async function none() { return 1; }",
      ].join("\n"),
      ts.ScriptTarget.Latest,
      true,
    );
    assert.ok(hasDirective(sf.statements));
    const result = Object.fromEntries(
      exportedFunctions(sf).map(({ name, fn }) => {
        const body = fn ? bodyStatements(fn) : null;
        return [name, !!body && firstStatementIsGuard(body)];
      }),
    );
    assert.deepEqual(result, {
      ok1: true,
      ok2: true,
      late: false,
      arrow: false,
      none: false,
    });
  });

  it("keine Inline-'use server' (alle Actions in app/admin/actions.ts)", () => {
    const inline: string[] = [];
    for (const file of SOURCE_FILES) {
      const sf = parse(file);
      const visit = (node: ts.Node) => {
        if (isFn(node)) {
          const body = bodyStatements(node);
          if (body && hasDirective(body)) {
            inline.push(
              `${rel(file)}:${sf.getLineAndCharacterOfPosition(node.getStart()).line + 1}`,
            );
          }
        }
        ts.forEachChild(node, visit);
      };
      visit(sf);
    }
    assert.deepEqual(inline, []);
  });
});

describe("Seiten und Routen unter app/admin", () => {
  const adminFiles = walk(path.join(ROOT, "app", "admin"));
  const isLogin = (f: string) => rel(f).startsWith("app/admin/login/");

  /** Ruft die Funktion (irgendwo im Körper) requireAdmin/getAdminEmail auf? */
  function callsGuard(fn: Fn, names: string[]): boolean {
    let found = false;
    const visit = (node: ts.Node) => {
      if (
        ts.isCallExpression(node) &&
        ts.isIdentifier(node.expression) &&
        names.includes(node.expression.text)
      ) {
        found = true;
      }
      if (!found) ts.forEachChild(node, visit);
    };
    if (fn.body) visit(fn.body);
    return found;
  }

  const pages = adminFiles.filter(
    (f) => /\/page\.tsx?$/.test(rel(f)) && !isLogin(f),
  );
  const routes = adminFiles.filter((f) => /\/route\.ts$/.test(rel(f)));

  it("findet Seiten und Routen", () => {
    assert.ok(pages.map(rel).includes("app/admin/page.tsx"));
    assert.ok(
      routes.map(rel).includes("app/admin/anfragen/[id]/kalender.ics/route.ts"),
    );
  });

  /**
   * Funktionen derselben Datei, die selbst mit `await requireAdmin()`
   * beginnen (z. B. ein in cache() gekapselter Loader). Ein Aufruf
   * davon zählt wie requireAdmin().
   */
  function guardedLoaders(sf: ts.SourceFile): string[] {
    const names: string[] = [];
    for (const stmt of sf.statements) {
      if (ts.isFunctionDeclaration(stmt) && stmt.name) {
        const body = bodyStatements(stmt);
        if (body && firstStatementIsGuard(body)) names.push(stmt.name.text);
      } else if (ts.isVariableStatement(stmt)) {
        for (const d of stmt.declarationList.declarations) {
          let init = d.initializer;
          // cache(async () => { … })
          if (
            init &&
            ts.isCallExpression(init) &&
            init.arguments.length === 1
          ) {
            init = init.arguments[0];
          }
          if (init && isFn(init) && ts.isIdentifier(d.name)) {
            const body = bodyStatements(init);
            if (body && firstStatementIsGuard(body)) names.push(d.name.text);
          }
        }
      }
    }
    return names;
  }

  for (const file of pages) {
    it(`${rel(file)}: Seite und generateMetadata prüfen den Zugang`, () => {
      const sf = parse(file);
      const fns = exportedFunctions(sf);
      const loaders = guardedLoaders(sf);
      const page = fns.find((f) => f.name === "default");
      assert.ok(page?.fn, "default export fehlt");
      assert.ok(
        callsGuard(page.fn, ["requireAdmin", ...loaders]),
        "Seite muss requireAdmin() (oder einen Loader, der damit beginnt) aufrufen",
      );
      const meta = fns.find((f) => f.name === "generateMetadata");
      if (meta) {
        assert.ok(meta.fn, "generateMetadata muss eine Funktion sein");
        assert.ok(
          callsGuard(meta.fn, ["requireAdmin", "getAdminEmail", ...loaders]),
          "generateMetadata muss requireAdmin() oder getAdminEmail() aufrufen",
        );
      }
    });
  }

  it("die Prüfung erkennt eine ungeschützte Seite", () => {
    const sf = ts.createSourceFile(
      "page.tsx",
      "export default async function P() { const rows = await listLeads(); return rows; }",
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );
    const page = exportedFunctions(sf).find((f) => f.name === "default");
    assert.ok(page?.fn);
    assert.equal(
      callsGuard(page.fn, ["requireAdmin", ...guardedLoaders(sf)]),
      false,
    );
  });

  for (const file of routes) {
    it(`${rel(file)}: jeder Handler ruft zuerst requireAdmin()`, () => {
      const sf = parse(file);
      const handlers = exportedFunctions(sf).filter((f) =>
        /^(GET|POST|PUT|PATCH|DELETE|HEAD|OPTIONS)$/.test(f.name),
      );
      assert.ok(handlers.length > 0, "kein Handler gefunden");
      for (const { name, fn } of handlers) {
        assert.ok(fn, name);
        const body = bodyStatements(fn);
        assert.ok(
          body && firstStatementIsGuard(body),
          `${name}: requireAdmin() zuerst`,
        );
      }
    });
  }

  it("app/admin/layout.tsx bleibt force-dynamic", () => {
    const src = readFileSync(path.join(ROOT, "app/admin/layout.tsx"), "utf8");
    assert.match(src, /export const dynamic = ["']force-dynamic["']/);
  });
});

describe("Logs ohne Personendaten", () => {
  const files = [
    ...walk(path.join(ROOT, "app", "admin")),
    ...walk(path.join(ROOT, "lib", "admin")),
    ...walk(path.join(ROOT, "app", "api", "anfrage")),
  ];
  const PII = /\b(reply_to|replyTo|fields|notes)\b/;

  it("kein console.* mit reply_to, replyTo, fields oder notes", () => {
    const hits: string[] = [];
    for (const file of files) {
      const sf = parse(file);
      const visit = (node: ts.Node) => {
        if (
          ts.isCallExpression(node) &&
          ts.isPropertyAccessExpression(node.expression) &&
          ts.isIdentifier(node.expression.expression) &&
          node.expression.expression.text === "console"
        ) {
          for (const arg of node.arguments) {
            // Reine Texte (Meldungen) sind erlaubt, Werte nicht.
            if (
              ts.isStringLiteral(arg) ||
              ts.isNoSubstitutionTemplateLiteral(arg)
            )
              continue;
            if (PII.test(arg.getText(sf))) {
              const line =
                sf.getLineAndCharacterOfPosition(node.getStart()).line + 1;
              hits.push(`${rel(file)}:${line}`);
            }
          }
        }
        ts.forEachChild(node, visit);
      };
      visit(sf);
    }
    assert.deepEqual(hits, []);
  });

  it("die Prüfung erkennt einen PII-Log", () => {
    const sf = ts.createSourceFile(
      "x.ts",
      'console.warn("[anfrage] Honeypot", { kind, replyTo });',
      ts.ScriptTarget.Latest,
      true,
    );
    const call = (sf.statements[0] as ts.ExpressionStatement)
      .expression as ts.CallExpression;
    assert.ok(PII.test(call.arguments[1].getText(sf)));
  });
});

describe("Kundenseite /angebot", () => {
  const kundenDateien = walk(path.join(ROOT, "app", "angebot"));
  const STORE = "@/lib/angebote-store";
  /** Kunden-Funktionen des Speichers; alles andere ist Admin. */
  const KUNDEN_STORE = new Set([
    "getAngebotByToken",
    "markAngebotViewed",
    "acceptAngebot",
    "declineAngebot",
    "logAngebotMailFehler",
    "logAngebotBestaetigung",
    "AngebotErgebnis",
  ]);

  it("findet die Action-Datei mit 'use server'", () => {
    const file = path.join(ROOT, KUNDEN_ACTIONS_DATEI);
    assert.ok(kundenDateien.includes(file));
    assert.ok(hasDirective(parse(file).statements));
  });

  it("jede öffentliche Action prüft zuerst den Token (parseToken)", () => {
    const sf = parse(path.join(ROOT, KUNDEN_ACTIONS_DATEI));
    const fns = exportedFunctions(sf);
    assert.deepEqual(
      fns.map((f) => f.name).sort(),
      [...KUNDEN_ACTIONS].sort(),
      "neue Kunden-Action? Hier und in KUNDEN_ACTIONS eintragen",
    );
    for (const { name, fn } of fns) {
      assert.ok(fn, name);
      const first = (bodyStatements(fn) ?? [])[0];
      const init =
        first &&
        ts.isVariableStatement(first) &&
        first.declarationList.declarations[0]?.initializer;
      assert.ok(
        init &&
          ts.isCallExpression(init) &&
          ts.isIdentifier(init.expression) &&
          init.expression.text === "parseToken",
        `${name}: erste Anweisung muss \`const t = parseToken(token);\` sein`,
      );
    }
  });

  it("nutzt vom Speicher nur die Kunden-Funktionen", () => {
    const fremd: string[] = [];
    for (const file of kundenDateien) {
      const sf = parse(file);
      for (const stmt of sf.statements) {
        if (
          !ts.isImportDeclaration(stmt) ||
          !ts.isStringLiteral(stmt.moduleSpecifier) ||
          stmt.moduleSpecifier.text !== STORE
        )
          continue;
        const bindings = stmt.importClause?.namedBindings;
        if (!bindings || !ts.isNamedImports(bindings)) {
          fremd.push(`${rel(file)}: import * / default`);
          continue;
        }
        for (const el of bindings.elements) {
          const name = (el.propertyName ?? el.name).text;
          if (!KUNDEN_STORE.has(name)) fremd.push(`${rel(file)}: ${name}`);
        }
      }
    }
    assert.deepEqual(fremd, []);
  });

  it("kein console.* mit Token oder Kundendaten", () => {
    const files = [
      ...kundenDateien,
      path.join(ROOT, "lib", "angebote-store.ts"),
      path.join(ROOT, "lib", "angebot-mail.ts"),
    ];
    const GEHEIM =
      /\b(token|t|kunde_email|kunde_name|kunde_firma|angenommen_von|abgelehnt_grund|grund|name|reply_to|replyTo|message)\b/;
    const hits: string[] = [];
    for (const file of files) {
      const sf = parse(file);
      const visit = (node: ts.Node) => {
        if (
          ts.isCallExpression(node) &&
          ts.isPropertyAccessExpression(node.expression) &&
          ts.isIdentifier(node.expression.expression) &&
          node.expression.expression.text === "console"
        ) {
          for (const arg of node.arguments) {
            if (
              ts.isStringLiteral(arg) ||
              ts.isNoSubstitutionTemplateLiteral(arg)
            )
              continue;
            if (GEHEIM.test(arg.getText(sf))) {
              const line =
                sf.getLineAndCharacterOfPosition(node.getStart()).line + 1;
              hits.push(`${rel(file)}:${line}`);
            }
          }
        }
        ts.forEachChild(node, visit);
      };
      visit(sf);
    }
    assert.deepEqual(hits, []);
  });
});
