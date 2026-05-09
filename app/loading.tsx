import { Loader2 } from "lucide-react";

export default function GlobalLoading() {
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
