import { Loader2 } from "lucide-react";

/**
 * Ladeanzeige nur für den Mitgliederbereich (dynamische Seiten mit
 * Datenbank). Öffentliche Seiten sind statisch und brauchen keine
 * Suspense-Grenze; eine globale loading.tsx würde ihren Inhalt erst
 * per Script einblenden (ohne JavaScript leer, schlechtere Ladezeit).
 */
export default function AdminLoading() {
  return (
    <div
      role="status"
      aria-live="polite"
      className="text-muted-foreground flex flex-1 items-center justify-center px-6 py-24"
    >
      <Loader2 className="h-5 w-5 animate-spin" />
      <span className="sr-only">Lädt …</span>
    </div>
  );
}
