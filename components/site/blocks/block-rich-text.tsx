import type { RichTextBlockData } from "@/types/website";

/**
 * Rich text — long-form prose with editorial typography. Paragraphs
 * are separated by blank lines (\n\n) in the source.
 */
export function BlockRichText({ data }: { data: RichTextBlockData }) {
  const body = data?.body?.trim();
  if (!body) return null;
  const paragraphs = body.split(/\n{2,}/);
  return (
    <section className="border-border/60 border-b py-24 sm:py-32">
      <div className="mx-auto w-full max-w-3xl px-6">
        {data.title?.trim() ? (
          <h2 className="mb-10 text-3xl font-semibold leading-[1.1] tracking-[-0.02em] sm:text-4xl">
            {data.title}
          </h2>
        ) : null}
        <div className="text-foreground/85 space-y-5 text-[17px] leading-[1.7] text-pretty">
          {paragraphs.map((p, i) => (
            <p key={i} className="whitespace-pre-line">
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
