import Image from "next/image";

import type { TeamMemberRow } from "@/types/website";

/**
 * Team — large portraits on a generous grid, refined card chrome,
 * subtle hover-zoom on photos. Apple "Designed by..." gallery vibe.
 */
export function SiteTeam({ team }: { team: TeamMemberRow[] }) {
  if (team.length === 0) return null;

  return (
    <section
      id="team"
      className="border-border/60 border-b"
      style={{ paddingTop: "var(--site-section-py)", paddingBottom: "var(--site-section-py)" }}
    >
      <div
        className="mx-auto w-full px-6"
        style={{ maxWidth: "var(--site-container-max)" }}
      >
        <header className="mx-auto max-w-2xl text-center">
          <p
            className="text-muted-foreground text-[11px] font-medium uppercase"
            style={{ letterSpacing: "var(--site-eyebrow-tracking)" }}
          >
            Unser Team
          </p>
          <h2 className="mt-3 text-4xl font-semibold leading-[1.1] sm:text-5xl">
            Die Menschen hinter unserer Arbeit
          </h2>
          <p className="text-muted-foreground mx-auto mt-5 max-w-xl text-pretty">
            Wir nehmen uns Zeit. Lernen Sie uns kennen.
          </p>
        </header>

        <ul className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m) => (
            <li
              key={m.id}
              className="group flex flex-col"
            >
              <div
                className="bg-muted relative aspect-[4/5] w-full overflow-hidden ring-1 ring-border/50"
                style={{
                  borderRadius: "var(--site-image-radius)",
                  boxShadow: "var(--site-card-shadow)",
                }}
              >
                {m.image_url ? (
                  <Image
                    src={m.image_url}
                    alt={m.name}
                    fill
                    sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    unoptimized
                  />
                ) : (
                  <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
                    Kein Foto
                  </div>
                )}
              </div>
              <div className="mt-5 px-1">
                <h3 className="text-lg font-semibold tracking-tight">
                  {m.name}
                </h3>
                {m.role ? (
                  <p className="text-muted-foreground mt-0.5 text-sm">
                    {m.role}
                  </p>
                ) : null}
                {m.bio ? (
                  <p className="text-foreground/75 mt-3 text-[14px] leading-relaxed whitespace-pre-line">
                    {m.bio}
                  </p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
