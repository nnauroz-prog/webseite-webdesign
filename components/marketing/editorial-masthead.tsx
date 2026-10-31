import Link from "next/link";

/**
 * Schlichte Brotkrumen-Zeile unter dem Header jeder Unterseite:
 * „Start › Pakete". Ersetzt die frühere Zeitschriften-Kopfzeile mit
 * Monat und Ort — ruhiger und hilft beim Zurückfinden.
 */
export function EditorialMasthead({ section }: { section: string }) {
  return (
    <nav aria-label="Brotkrumen" className="border-border/40 border-b">
      <ol className="text-muted-foreground mx-auto flex w-full max-w-6xl items-center gap-2 px-5 py-3 text-[13px] sm:px-6">
        <li>
          <Link href="/" className="hover:text-foreground transition-colors">
            Start
          </Link>
        </li>
        <li aria-hidden="true">›</li>
        <li aria-current="page" className="text-foreground">
          {section}
        </li>
      </ol>
    </nav>
  );
}
