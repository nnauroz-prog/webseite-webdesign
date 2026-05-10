import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { CtaBannerBlockData } from "@/types/website";

export function BlockCtaBanner({ data }: { data: CtaBannerBlockData }) {
  if (!data?.headline) return null;
  return (
    <section className="border-border/60 border-b py-16 sm:py-20">
      <div className="mx-auto w-full max-w-5xl px-6">
        <div className="from-primary/10 via-background to-background border-primary/30 relative overflow-hidden rounded-3xl border bg-gradient-to-br p-8 text-center shadow-sm sm:p-12">
          <div className="bg-primary/15 pointer-events-none absolute -top-12 -right-12 h-48 w-48 rounded-full blur-3xl" />
          <h2 className="text-foreground relative text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {data.headline}
          </h2>
          {data.subtitle ? (
            <p className="text-muted-foreground relative mx-auto mt-3 max-w-2xl text-pretty">
              {data.subtitle}
            </p>
          ) : null}
          <Link
            href={data.button_href}
            className="bg-primary text-primary-foreground hover:bg-primary/90 relative mt-7 inline-flex h-11 items-center justify-center rounded-md px-7 text-sm font-medium transition"
          >
            {data.button_label}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
