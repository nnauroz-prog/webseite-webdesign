import { ArrowRight } from "lucide-react";
import Link from "next/link";

/**
 * Gemeinsamer Abschnittskopf für die Unterseiten: links eine schmale
 * Spalte mit dem Abschnittsnamen in Mono, rechts die Überschrift.
 */

/** Einzug für Inhalte unter einem SectionHead: beginnt auf der zweiten
 *  Kante (Spalte 4 von 12 inkl. Abstand), mobil ohne Einzug. */
export const BODY_OFFSET = "lg:pl-[calc(25%+0.5rem)]";

/** Abschnittskopf: Name links (ab lg eigene Spalte), Überschrift rechts. */
export function SectionHead({
  label,
  title,
  link,
  dark = false,
}: {
  label: string;
  title: React.ReactNode;
  link?: { href: string; text: string };
  dark?: boolean;
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-12 lg:gap-8">
      <p
        className={`label-mono self-start lg:col-span-3 lg:pt-5 ${dark ? "text-stahl-hell" : "text-muted-foreground"}`}
      >
        {label}
      </p>
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 lg:col-span-9">
        <h2 className="min-w-0 max-w-2xl flex-1 basis-[18rem] text-balance text-[2rem] leading-[1.02] tracking-[-0.032em] sm:text-[2.75rem] lg:text-[3.1rem]">
          {title}
        </h2>
        {link ? (
          <Link
            href={link.href}
            className={`inline-flex shrink-0 items-center gap-1.5 pb-1 text-[15px] font-semibold underline-offset-4 hover:underline ${
              dark ? "text-background" : "text-foreground"
            }`}
          >
            {link.text} <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        ) : null}
      </div>
    </div>
  );
}
