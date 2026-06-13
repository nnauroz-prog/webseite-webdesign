import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import {
  formatDate,
  getAllPostSlugs,
  getPost,
  JOURNAL_POSTS,
  type JournalPost,
  type Paragraph,
  toRoman,
} from "@/lib/journal-data";
import { SITE_URL } from "@/lib/site";


type RouteParams = { slug: string };

export async function generateStaticParams(): Promise<RouteParams[]> {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: `${post.title} — Journal`,
    description: post.dek,
    alternates: { canonical: `/journal/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.dek,
      type: "article",
      publishedTime: post.publishedAt,
      tags: post.tags,
    },
  };
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.dek,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: {
      "@type": "Organization",
      name: "Sitalo Webdesign",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Sitalo Webdesign",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/journal/${post.slug}`,
    },
    keywords: post.tags.join(", "),
  };

  // BreadcrumbList — Sitalo → Journal → Essay. Gibt Google die
  // hierarchische Position für Rich-Result-Breadcrumbs.
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Sitalo",
        item: `${SITE_URL}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Journal",
        item: `${SITE_URL}/journal`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${SITE_URL}/journal/${post.slug}`,
      },
    ],
  };

  // Vorherigen / nächsten Beitrag berechnen für Navigation am Ende
  const index = JOURNAL_POSTS.findIndex((p) => p.slug === post.slug);
  const prev = index > 0 ? JOURNAL_POSTS[index - 1] : null;
  const next =
    index >= 0 && index < JOURNAL_POSTS.length - 1
      ? JOURNAL_POSTS[index + 1]
      : null;

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Journal" />
      <main id="main" className="flex-1">
        <article>
          <header className="border-border/40 border-b">
            <div className="mx-auto w-full max-w-3xl px-6 py-14 sm:py-20">
              <Link
                href="/journal"
                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-[13px] font-medium transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Zurück zum Journal
              </Link>
              <p className="text-muted-foreground mt-8 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em]">
                <span
                  aria-hidden="true"
                  className="bg-gold inline-block h-1 w-6"
                />
                {formatDate(post.publishedAt)} · {post.readingMinutes} Min Lesezeit
              </p>
              <h1 className="text-foreground mt-6 text-balance text-4xl font-semibold leading-[1.05] tracking-[-0.03em] sm:text-5xl lg:text-6xl">
                {post.title}
              </h1>
              <p className="text-muted-foreground mt-6 text-pretty text-lg leading-relaxed sm:text-xl">
                {post.dek}
              </p>
              {post.tags.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="border-border/60 text-muted-foreground inline-flex h-7 items-center rounded-full border px-3 font-mono text-[10px] uppercase tracking-[0.18em]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </header>

          <PostBody post={post} />

          <footer className="border-border/40 border-t">
            <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16">
              <div className="grid gap-6 sm:grid-cols-2">
                {prev ? (
                  <Link
                    href={`/journal/${prev.slug}`}
                    className="border-border/60 group rounded-2xl border p-5 transition-colors hover:border-foreground/40"
                  >
                    <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.22em]">
                      Neuerer Beitrag
                    </p>
                    <p className="text-foreground group-hover:text-foreground mt-2 text-[16px] font-medium leading-snug tracking-[-0.01em]">
                      {prev.title}
                    </p>
                  </Link>
                ) : (
                  <span />
                )}
                {next ? (
                  <Link
                    href={`/journal/${next.slug}`}
                    className="border-border/60 group rounded-2xl border p-5 text-right transition-colors hover:border-foreground/40 sm:text-right"
                  >
                    <p className="text-muted-foreground font-mono text-[10px] uppercase tracking-[0.22em]">
                      Älterer Beitrag
                    </p>
                    <p className="text-foreground mt-2 text-[16px] font-medium leading-snug tracking-[-0.01em]">
                      {next.title}
                    </p>
                  </Link>
                ) : (
                  <span />
                )}
              </div>
            </div>
          </footer>
        </article>

        <section className="border-border/40 border-t">
          <div className="mx-auto w-full max-w-3xl px-6 py-16 text-center sm:py-20">
            <p className="text-muted-foreground inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.3em] sm:text-[11px]">
              <span
                aria-hidden="true"
                className="bg-gold gold-pulse inline-block h-1 w-6"
              />
              Was nun
            </p>
            <p className="serif text-foreground mt-6 text-balance text-2xl leading-snug sm:text-3xl">
              Klingt das nach Ihrer Situation?{" "}
              <span className="serif-italic text-muted-foreground">
                Wir gucken uns das gerne an.
              </span>
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link
                href="/audit"
                className="bg-foreground text-background hover:bg-foreground/90 inline-flex h-11 items-center rounded-full px-5 text-[14px] font-medium tracking-tight"
              >
                Kostenlosen Audit anfordern
              </Link>
              <Link
                href="/termin"
                className="border-foreground/30 text-foreground hover:bg-foreground hover:text-background inline-flex h-11 items-center rounded-full border px-5 text-[14px] font-medium tracking-tight transition-all"
              >
                30-Min-Termin
              </Link>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />

      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([articleLd, breadcrumbLd]),
        }}
      />
    </div>
  );
}

function PostBody({ post }: { post: JournalPost }) {
  // Pre-pass: numerieren h2-Sektionen (I, II, III, …) und den
  // ersten echten Absatz markieren (er bekommt die Drop-Cap).
  let h2Counter = 0;
  let firstPTagged = false;
  const enriched = post.body.map((p) => {
    if (p.kind === "h2") {
      h2Counter += 1;
      return { paragraph: p, sectionNum: h2Counter, isLead: false };
    }
    if (p.kind === "p" && !firstPTagged) {
      firstPTagged = true;
      return { paragraph: p, sectionNum: null, isLead: true };
    }
    return { paragraph: p, sectionNum: null, isLead: false };
  });

  return (
    <div className="border-border/40 border-b">
      <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16">
        <div className="space-y-6">
          {enriched.map((e, i) => (
            <ParagraphView
              key={i}
              paragraph={e.paragraph}
              sectionNum={e.sectionNum}
              isLead={e.isLead}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ParagraphView({
  paragraph,
  sectionNum,
  isLead,
}: {
  paragraph: Paragraph;
  sectionNum: number | null;
  isLead: boolean;
}) {
  if (paragraph.kind === "h2") {
    return (
      <h2 className="mt-14 flex items-baseline gap-5 text-balance text-2xl font-semibold leading-snug tracking-[-0.02em] sm:text-3xl">
        {sectionNum != null && (
          <span
            aria-hidden="true"
            className="serif-italic text-muted-foreground/70 shrink-0 text-2xl font-normal tracking-tight sm:text-3xl"
          >
            {toRoman(sectionNum)}.
          </span>
        )}
        <span className="text-foreground">{paragraph.text}</span>
      </h2>
    );
  }
  if (paragraph.kind === "quote") {
    return (
      <blockquote className="border-foreground/15 my-10 border-l-2 pl-6">
        <p className="serif-italic text-foreground text-balance text-xl leading-snug sm:text-2xl">
          {paragraph.text}
        </p>
      </blockquote>
    );
  }
  if (paragraph.kind === "li") {
    return (
      <p className="text-foreground/85 flex items-start gap-3 text-[16px] leading-relaxed">
        <span
          aria-hidden="true"
          className="bg-gold mt-2.5 inline-block h-1 w-1 shrink-0 rounded-full"
        />
        <span>{paragraph.text}</span>
      </p>
    );
  }
  return (
    <p
      className={`text-foreground/85 text-pretty text-[16.5px] leading-[1.65] ${
        isLead ? "journal-lead" : ""
      }`}
    >
      {paragraph.text}
    </p>
  );
}
