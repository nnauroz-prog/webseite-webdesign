import Link from "next/link";

export function PreviewBanner() {
  return (
    <div className="bg-amber-100 text-amber-950 dark:bg-amber-950/40 dark:text-amber-100">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-6 py-2 text-sm">
        <span>
          <strong className="font-medium">Vorschau —</strong> diese Website ist
          nicht öffentlich erreichbar.
        </span>
        <Link
          href="/dashboard/website"
          className="font-medium underline-offset-2 hover:underline"
        >
          Im Dashboard veröffentlichen →
        </Link>
      </div>
    </div>
  );
}
