import Link from "next/link";

/**
 * Brotkrumen-Zeile unter dem hellen Header einer Unterseite:
 * „Start › Pakete“. Gesetzt wie die Brotkrumen im PageHero, in Mono
 * auf der Satzkante. Seiten mit dunklem PageHero brauchen sie nicht,
 * dort stehen die Brotkrumen im Kopf selbst.
 */
export function EditorialMasthead({ section }: { section: string }) {
  return (
    <nav aria-label="Brotkrumen" className="border-border border-b">
      <ol className="text-muted-foreground mx-auto flex w-full max-w-6xl items-center gap-2 px-5 py-3 font-mono text-[12px] sm:px-6">
        <li>
          <Link href="/" className="hover:text-foreground underline-offset-4 transition-colors hover:underline">
            Start
          </Link>
        </li>
        <li aria-hidden="true">›</li>
        <li aria-current="page" className="text-foreground min-w-0 truncate">
          {section}
        </li>
      </ol>
    </nav>
  );
}
