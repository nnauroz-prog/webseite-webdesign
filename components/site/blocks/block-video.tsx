import type { VideoBlockData } from "@/types/website";

/** Extract YouTube/Vimeo embed URL from a typical share/watch link. */
function toEmbedUrl(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const id = u.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
      const m = u.pathname.match(/\/embed\/([\w-]+)/);
      if (m) return url;
    }
    if (u.hostname === "youtu.be") {
      const id = u.pathname.replace(/^\//, "");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (u.hostname.includes("vimeo.com")) {
      const m = u.pathname.match(/\/(\d+)/);
      if (m) return `https://player.vimeo.com/video/${m[1]}`;
    }
    return null;
  } catch {
    return null;
  }
}

export function BlockVideo({ data }: { data: VideoBlockData }) {
  const embed = toEmbedUrl(data?.url ?? "");
  if (!embed) return null;
  return (
    <section className="border-border/60 border-b py-24 sm:py-32">
      <div className="mx-auto w-full max-w-5xl px-6">
        {data.title?.trim() ? (
          <header className="mx-auto mb-10 max-w-2xl text-center">
            <p className="text-muted-foreground text-[11px] font-medium tracking-[0.2em] uppercase">
              Video
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-4xl">
              {data.title}
            </h2>
          </header>
        ) : null}
        <div className="ring-border/60 relative aspect-video overflow-hidden rounded-3xl shadow-xl ring-1">
          <iframe
            src={embed}
            title={data.title || "Video"}
            className="absolute inset-0 h-full w-full"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        {data.caption?.trim() ? (
          <p className="text-muted-foreground mx-auto mt-5 max-w-2xl text-center text-sm">
            {data.caption}
          </p>
        ) : null}
      </div>
    </section>
  );
}
