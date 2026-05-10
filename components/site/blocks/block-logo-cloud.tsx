import Link from "next/link";

import type { LogoCloudBlockData } from "@/types/website";

/**
 * Logo cloud / partner row. Renders names as styled wordmarks (we
 * don't host external logo images — that's a copyright minefield).
 * Owners can link each entry to a partner page.
 */
export function BlockLogoCloud({ data }: { data: LogoCloudBlockData }) {
  if (!data?.items?.length) return null;
  return (
    <section className="bg-secondary/30 border-border/60 border-b py-20 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-6">
        {data.title?.trim() ? (
          <p className="text-muted-foreground mb-10 text-center text-[11px] font-medium tracking-[0.2em] uppercase">
            {data.title}
          </p>
        ) : null}
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14">
          {data.items.map((it, i) => {
            const inner = (
              <span className="text-muted-foreground/70 hover:text-foreground text-lg font-semibold tracking-tight whitespace-nowrap transition-colors sm:text-xl">
                {it.name}
              </span>
            );
            return (
              <li key={i}>
                {it.url?.trim() ? (
                  <Link
                    href={it.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={it.name}
                  >
                    {inner}
                  </Link>
                ) : (
                  inner
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
