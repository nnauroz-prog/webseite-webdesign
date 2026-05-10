import { Clock } from "lucide-react";

import type { OpeningHoursBlockData } from "@/types/website";

export function BlockOpeningHours({ data }: { data: OpeningHoursBlockData }) {
  const text = data?.text?.trim();
  if (!text) return null;
  return (
    <section className="border-border/60 border-b py-16 sm:py-20">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-start gap-6 px-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="bg-primary/10 text-primary inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full">
            <Clock className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {data.title?.trim() || "Öffnungszeiten"}
            </h2>
          </div>
        </div>
        <pre className="text-foreground/90 bg-secondary/40 rounded-xl border px-5 py-4 font-sans text-sm leading-relaxed whitespace-pre-line">
          {text}
        </pre>
      </div>
    </section>
  );
}
