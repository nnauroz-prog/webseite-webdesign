/**
 * Resolve-Hook für `node --test` (ohne neue Abhängigkeit).
 *
 * - '@/…' wird wie in tsconfig.json auf Projektdateien abgebildet
 *   (.ts, /index.ts). .tsx kann Node nicht laden, reine Module
 *   importieren deshalb nie .tsx.
 * - 'server-only' liegt nicht in node_modules (Next bündelt es) und
 *   wird auf ein leeres Modul abgebildet.
 * - Projekt-.ts-Dateien bekommen das Format 'module-typescript',
 *   damit Node die Typen entfernt, ohne „Reparsing as ES module“
 *   zu warnen.
 */
import { existsSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const EMPTY_MODULE = "data:text/javascript,export%20%7B%7D%3B";

function isFile(p) {
  try {
    return statSync(p).isFile();
  } catch {
    return false;
  }
}

function findProjectFile(base) {
  const candidates = [base, `${base}.ts`, path.join(base, "index.ts")];
  for (const c of candidates) {
    if (isFile(c)) return c;
  }
  if (existsSync(`${base}.tsx`)) {
    throw new Error(
      `${path.relative(ROOT, base)}.tsx kann unter node --test nicht geladen werden (reine Module importieren kein .tsx).`,
    );
  }
  return null;
}

function isProjectTs(file) {
  return (
    file.startsWith(ROOT + path.sep) &&
    !file.includes(`${path.sep}node_modules${path.sep}`) &&
    file.endsWith(".ts")
  );
}

function project(file) {
  return {
    url: pathToFileURL(file).href,
    format: isProjectTs(file) ? "module-typescript" : undefined,
    shortCircuit: true,
  };
}

export async function resolve(specifier, context, nextResolve) {
  if (specifier === "server-only" || specifier === "client-only") {
    return { url: EMPTY_MODULE, format: "module", shortCircuit: true };
  }

  if (specifier.startsWith("@/")) {
    const file = findProjectFile(path.join(ROOT, specifier.slice(2)));
    if (!file) throw new Error(`Modul nicht gefunden: ${specifier}`);
    return project(file);
  }

  if (
    (specifier.startsWith("./") || specifier.startsWith("../")) &&
    context.parentURL?.startsWith("file:")
  ) {
    const parent = fileURLToPath(context.parentURL);
    const file = findProjectFile(path.resolve(path.dirname(parent), specifier));
    if (file && isProjectTs(file)) return project(file);
  }

  const result = await nextResolve(specifier, context);
  if (
    result.url.startsWith("file:") &&
    isProjectTs(fileURLToPath(result.url))
  ) {
    return { ...result, format: "module-typescript" };
  }
  return result;
}
