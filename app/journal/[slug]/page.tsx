import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import {
  formatDate,
  getAllPostSlugs,
  getCtaForPost,
  getPost,
  JOURNAL_POSTS,
  type JournalCta,
  type JournalPost,
  type Paragraph,
} from "@/lib/journal-data";
import { SITE_URL } from "@/lib/site";

const ARROW = <ArrowRight className="h-4 w-4" aria-hidden="true" />;

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
    title: post.seoTitle ?? `${post.title} — Journal`,
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
    ...(post.seoTitle ? { alternativeHeadline: post.seoTitle } : {}),
    image: `${SITE_URL}/journal/${post.slug}/opengraph-image`,
    inLanguage: "de-DE",
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

  // Weiterführende Links pro Essay aus lib/journal-data.ts. Genutzt
  // werden nur Ziel und Linktext; Kopfzeile und Frage-Satz der Daten
  // bleiben weg, der Schluss ist für alle Beiträge gleich gesetzt.
  // Ohne Eintrag: Durchsicht und Erstgespräch.
  const cta: Pick<JournalCta, "primaryHref" | "primaryLabel" | "secondaryHref" | "secondaryLabel"> =
    getCtaForPost(post.slug) ?? {
      primaryHref: "/audit",
      primaryLabel: "Kostenlose Durchsicht Ihrer Website",
      secondaryHref: "/termin",
      secondaryLabel: "Erstgespräch buchen",
    };
  const links = [
    { href: cta.primaryHref, label: cta.primaryLabel },
    ...(cta.secondaryHref && cta.secondaryLabel ? [{ href: cta.secondaryHref, label: cta.secondaryLabel }] : []),
  ];

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader />
      <EditorialMasthead section="Journal" />
      <main id="main" tabIndex={-1} className="flex-1">
        <article>
          <header>
            <div className="mx-auto w-full max-w-3xl px-5 pt-10 pb-12 sm:px-6 sm:pt-14 sm:pb-16">
              <Link
                href="/journal"
                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 font-mono text-[12.5px] transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                Alle Beiträge
              </Link>
              <p className="label-mono text-muted-foreground mt-10">
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> · {post.readingMinutes} Min
                Lesezeit
              </p>
              <h1 className="mt-5 text-balance text-[2.5rem] leading-[0.98] tracking-[-0.038em] sm:text-[3.6rem] lg:text-[4.2rem]">
                {post.title}
              </h1>
              <p className="text-foreground/80 mt-6 text-pretty text-[19px] leading-relaxed sm:text-[21px]">
                {post.dek}
              </p>
              {post.tags.length > 0 && (
                <ul className="mt-8 flex flex-wrap gap-2" aria-label="Themen">
                  {post.tags.map((tag) => (
                    <li
                      key={tag}
                      className="border-border text-muted-foreground inline-flex h-7 items-center rounded-[2px] border px-2.5 font-mono text-[11.5px]"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </header>

          <PostBody post={post} />

          <footer className="mx-auto w-full max-w-3xl px-5 sm:px-6">
            <nav aria-label="Weitere Beiträge" className="border-foreground grid border-t sm:grid-cols-2">
              {prev ? (
                <Link
                  href={`/journal/${prev.slug}`}
                  className="group border-border block border-b py-6 sm:border-b-0 sm:pr-6"
                >
                  <span className="label-mono text-muted-foreground">← Neuerer Beitrag</span>
                  <span className="mt-2 block text-[17px] font-semibold leading-snug tracking-[-0.01em] underline-offset-4 group-hover:underline">
                    {prev.title}
                  </span>
                </Link>
              ) : (
                <span className="hidden sm:block" />
              )}
              {next ? (
                <Link
                  href={`/journal/${next.slug}`}
                  className="group border-border block py-6 sm:border-l sm:pl-6 sm:text-right"
                >
                  <span className="label-mono text-muted-foreground">Älterer Beitrag →</span>
                  <span className="mt-2 block text-[17px] font-semibold leading-snug tracking-[-0.01em] underline-offset-4 group-hover:underline">
                    {next.title}
                  </span>
                </Link>
              ) : null}
            </nav>
          </footer>
        </article>

        <section className="bg-card border-border mt-10 border-t sm:mt-14">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-14 sm:px-6 sm:py-20 lg:grid-cols-12 lg:gap-8">
            <div className="lg:col-span-6">
              <h2 className="label-mono text-muted-foreground">Weiter zum Thema</h2>
              <ul className="border-foreground mt-4 border-t">
                {links.map((l) => (
                  <li key={l.href} className="border-border border-b">
                    <Link
                      href={l.href}
                      className="group flex items-center justify-between gap-6 py-4 text-[18px] font-semibold tracking-[-0.01em] sm:text-[20px]"
                    >
                      <span className="underline-offset-4 group-hover:underline">{l.label}</span>
                      <ArrowRight
                        className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1"
                        aria-hidden="true"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-5 lg:col-start-8">
              <p className="label-mono text-muted-foreground">Fragen zum Beitrag</p>
              <a
                href="tel:+491607621876"
                className="hover:text-gold mt-4 block text-[2rem] leading-none tracking-[-0.03em] whitespace-nowrap transition-colors sm:text-[2.6rem]"
                style={{ fontStretch: "118%", fontWeight: 780 }}
              >
                0160&nbsp;7621876
              </a>
              <p className="text-muted-foreground mt-4 text-[15.5px] leading-relaxed">
                Oder per Mail an{" "}
                <a href="mailto:info@sitalo.de" className="text-foreground underline underline-offset-4">
                  info@sitalo.de
                </a>
                . Wir antworten meist am selben Werktag.
              </p>
              <Link
                href="/journal"
                className="mt-6 inline-flex items-center gap-1.5 text-[15px] font-semibold underline-offset-4 hover:underline"
              >
                Alle Beiträge {ARROW}
              </Link>
            </div>
          </div>
        </section>
      </main>
      <MarketingFooter />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([articleLd, breadcrumbLd]),
        }}
      />
    </div>
  );
}

function PostBody({ post }: { post: JournalPost }) {
  // Der erste echte Absatz ist der Vorspann und steht etwas größer.
  const leadIndex = post.body.findIndex((p) => p.kind === "p");

  return (
    <div className="mx-auto w-full max-w-3xl px-5 pb-14 sm:px-6 sm:pb-20">
      <div className="border-border space-y-6 border-t pt-10 sm:pt-12">
        {post.body.map((p, i) => (
          <ParagraphView key={i} paragraph={p} isLead={i === leadIndex} />
        ))}
      </div>
    </div>
  );
}

function ParagraphView({ paragraph, isLead }: { paragraph: Paragraph; isLead: boolean }) {
  if (paragraph.kind === "h2") {
    return (
      <h2 className="mt-14 text-balance text-[1.55rem] leading-[1.12] tracking-[-0.025em] sm:text-[1.95rem]">
        {paragraph.text}
      </h2>
    );
  }
  if (paragraph.kind === "quote") {
    return (
      <blockquote className="border-gold my-12 border-l-[3px] pl-6 sm:pl-8">
        <p
          className="text-balance text-[1.35rem] leading-[1.25] tracking-[-0.02em] sm:text-[1.7rem]"
          style={{ fontStretch: "108%", fontWeight: 650 }}
        >
          {paragraph.text}
        </p>
      </blockquote>
    );
  }
  if (paragraph.kind === "li") {
    return (
      <p className="text-foreground/85 flex items-start gap-3 text-[17px] leading-relaxed">
        <span aria-hidden="true" className="bg-foreground mt-[0.7em] inline-block h-[3px] w-3 shrink-0" />
        <span>{paragraph.text}</span>
      </p>
    );
  }
  return (
    <p
      className={
        isLead
          ? "text-foreground text-pretty text-[19px] leading-[1.6] sm:text-[20px]"
          : "text-foreground/85 text-pretty text-[17px] leading-[1.7]"
      }
    >
      {paragraph.text}
    </p>
  );
}
