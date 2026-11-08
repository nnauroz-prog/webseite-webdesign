import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MehrLink } from "@/components/marketing/apple";
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
    description: post.seoDescription ?? post.dek,
    alternates: { canonical: `/journal/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.seoDescription ?? post.dek,
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
            <div className="mx-auto w-full max-w-3xl px-5 pt-8 pb-12 text-center sm:px-6 sm:pt-12 sm:pb-16">
              <Link
                href="/journal"
                className="link-chevron link-chevron-frei text-[14px]"
              >
                <span aria-hidden="true" className="chev">‹</span>
                Alle Beiträge
              </Link>
              <p className="t-eyebrow mt-8 text-[14px]">
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> · {post.readingMinutes} Min
                Lesezeit
              </p>
              <h1 className="mt-3 text-balance text-[40px] leading-[1.05] tracking-[-0.025em] sm:text-[56px] sm:tracking-[-0.03em] lg:text-[64px]">
                {post.title}
              </h1>
              <p className="t-unter mx-auto mt-5">
                {post.dek}
              </p>
              {post.tags.length > 0 && (
                <ul className="mt-8 flex flex-wrap justify-center gap-2" aria-label="Themen">
                  {post.tags.map((tag) => (
                    <li
                      key={tag}
                      className="text-muted-foreground inline-flex h-8 items-center rounded-full bg-[var(--hell)] px-3.5 text-[12px]"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </header>

          <PostBody post={post} />

          <footer className="mx-auto w-full max-w-[980px] px-[max(var(--rinne),env(safe-area-inset-left))]">
            <nav aria-label="Weitere Beiträge" className="grid gap-3 sm:grid-cols-2">
              {prev ? (
                <article className="karte karte-hover p-7">
                  <Link href={`/journal/${prev.slug}`} className="link-chevron karte-link text-[14px]">
                    <span aria-hidden="true" className="chev">‹</span>
                    Neuerer Beitrag
                  </Link>
                  <p className="t-karte mt-2 text-[21px]">{prev.title}</p>
                </article>
              ) : (
                <span className="hidden sm:block" />
              )}
              {next ? (
                <article className="karte karte-hover p-7 sm:text-right">
                  <Link href={`/journal/${next.slug}`} className="link-chevron karte-link text-[14px]">
                    Älterer Beitrag
                    <span aria-hidden="true" className="chev">›</span>
                  </Link>
                  <p className="t-karte mt-2 text-[21px]">{next.title}</p>
                </article>
              ) : null}
            </nav>
          </footer>
        </article>

        <section className="flaeche-hell abschnitt mt-16 sm:mt-20">
          <div className="inhalt abschnitt-kopf">
            <p className="t-eyebrow">Fragen zum Beitrag</p>
            <a href="tel:+491607621876" className="abschluss-nummer !text-foreground hover:!text-gold-ink mt-3">
              0160&nbsp;7621876
            </a>
            <p className="t-unter mx-auto mt-4">
              Oder per Mail an{" "}
              <a href="mailto:info@sitalo.de" className="text-gold-ink underline underline-offset-2 hover:decoration-2">
                info@sitalo.de
              </a>
              . Wir antworten meist am selben Werktag.
            </p>
            <h2 className="t-karte mt-12">Weiter zum Thema</h2>
            <div className="aktionen mt-5">
              {links.map((l, i) =>
                i === 0 ? (
                  <Link key={l.href} href={l.href} className="btn-signal">
                    {l.label}
                  </Link>
                ) : (
                  <MehrLink key={l.href} href={l.href} groesse="unter">
                    {l.label}
                  </MehrLink>
                ),
              )}
            </div>
            <p className="mt-6">
              <MehrLink href="/journal">Alle Beiträge</MehrLink>
            </p>
          </div>
        </section>
      </main>
      <MarketingFooter crumb="Journal" />

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
