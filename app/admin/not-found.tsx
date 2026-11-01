import Link from "next/link";

/**
 * Anfrage nicht gefunden (gelöscht oder Link unvollständig). Ohne
 * diese Datei käme die 404-Seite der Website mit deren Kopf und Menü.
 */
export default function AdminNotFound() {
  return (
    <div className="border-border bg-card mt-2 rounded-[4px] border p-5">
      <h1 className="text-[20px] leading-tight font-semibold tracking-tight">
        Diese Anfrage gibt es nicht (mehr)
      </h1>
      <p className="text-muted-foreground mt-2 text-[15px] leading-relaxed">
        Vielleicht wurde sie inzwischen gelöscht, oder der Link ist unvollständig.
      </p>
      <Link
        href="/admin"
        className="bg-foreground text-background mt-5 inline-flex h-12 items-center rounded-[3px] px-6 text-[15px] font-medium"
      >
        Zur Übersicht
      </Link>
    </div>
  );
}
