import type { WebsiteRow } from "@/types/website";

export function SiteAbout({ website }: { website: WebsiteRow }) {
  const text = website.about_text?.trim();
  if (!text) return null;

  return (
    <section
      id="ueber-uns"
      className="bg-muted/30 border-border/60 border-b py-20 sm:py-24"
    >
      <div className="mx-auto w-full max-w-3xl px-6">
        <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Über uns
        </h2>
        <div className="text-muted-foreground mt-6 space-y-4 text-base leading-relaxed">
          {text.split(/\n{2,}/).map((paragraph, i) => (
            <p key={i} className="whitespace-pre-line">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
