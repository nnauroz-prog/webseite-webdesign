import Link from "next/link";

/**
 * Projekt nicht gefunden: Angebot gelöscht, nicht angenommen oder Link
 * unvollständig. Eigene Seite, sonst käme „Diese Anfrage gibt es
 * nicht“ aus app/admin/not-found.tsx.
 */
export default function ProjektNotFound() {
  return (
    <div className="border-border bg-card mt-2 rounded-[4px] border p-5">
      <h1 className="text-[20px] leading-tight font-semibold tracking-tight">
        Dieses Projekt gibt es nicht (mehr)
      </h1>
      <p className="text-muted-foreground mt-2 text-[15px] leading-relaxed">
        Projekte entstehen aus angenommenen Angeboten. Vielleicht wurde das
        Angebot gelöscht, oder der Link ist unvollständig.
      </p>
      <Link
        href="/admin/kunden"
        className="bg-foreground text-background mt-5 inline-flex h-12 items-center rounded-[3px] px-6 text-[15px] font-medium"
      >
        Zu Kunden & Projekte
      </Link>
    </div>
  );
}
