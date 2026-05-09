import Image from "next/image";

import type { TeamMemberRow } from "@/types/website";

export function SiteTeam({ team }: { team: TeamMemberRow[] }) {
  if (team.length === 0) return null;

  return (
    <section id="team" className="border-border/60 border-b py-20 sm:py-24">
      <div className="mx-auto w-full max-w-6xl px-6">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Unser Team
          </h2>
          <p className="text-muted-foreground mt-3">
            Die Menschen hinter unserer Arbeit.
          </p>
        </div>
        <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m) => (
            <li
              key={m.id}
              className="bg-card overflow-hidden rounded-xl border shadow-sm"
            >
              <div className="bg-muted aspect-[4/5] w-full overflow-hidden">
                {m.image_url ? (
                  <Image
                    src={m.image_url}
                    alt={m.name}
                    width={480}
                    height={600}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
                    Kein Foto
                  </div>
                )}
              </div>
              <div className="p-5">
                <h3 className="text-base font-semibold tracking-tight">
                  {m.name}
                </h3>
                {m.role && (
                  <p className="text-muted-foreground mt-1 text-sm">{m.role}</p>
                )}
                {m.bio && (
                  <p className="mt-3 text-sm leading-relaxed whitespace-pre-line">
                    {m.bio}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
