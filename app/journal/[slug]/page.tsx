import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EditorialMasthead } from "@/components/marketing/editorial-masthead";
import a from "@/components/marketing/hafen/atelier.module.css";
import { Briefkarte } from "@/components/marketing/hafen/briefkarte";
import { SitaloSignatur } from "@/components/marketing/hafen/sitalo-signatur";
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
      <EditorialMasthead section="Journal › Beitrag" links={{ Journal: "/journal" }} />
      <main id="main" tabIndex={-1} className="flex-1">
        <article>
          <header>
            <div className="mx-auto w-full max-w-3xl px-5 pt-8 pb-12 sm:px-6 sm:pt-12 sm:pb-16">
              <Link href="/journal" className="link-pfeil font-mono text-[12px] tracking-[0.04em]">
                <span aria-hidden="true">←{"\u00A0"}</span>Alle Beiträge im Journal
              </Link>
              <p className={`${a.eyebrow} mt-10`}>
                <span>
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time> · {post.readingMinutes} Min
                  Lesezeit
                </span>
              </p>
              <h1 className="mt-5 text-balance text-[38px] leading-[1.04] font-[760] tracking-[-0.03em] [font-stretch:114%] sm:text-[52px] lg:text-[60px]">
                {post.title}
              </h1>
              <p className="text-muted-foreground mt-6 max-w-[36em] text-[18px] leading-[1.55] text-pretty sm:text-[19px]">
                {post.dek}
              </p>
              {post.tags.length > 0 && (
                <ul className="mt-8 flex flex-wrap gap-2" aria-label="Themen">
                  {post.tags.map((tag) => (
                    <li
                      key={tag}
                      className="text-muted-foreground inline-flex h-7 items-center rounded-[2px] border border-[#1b1d1e]/20 px-2.5 font-mono text-[11px] tracking-[0.08em] uppercase"
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
            <SitaloSignatur caption="Aus dem Büro in Hamburg" className="mb-14" />
            <nav aria-label="Weitere Beiträge" className="kante-stark grid font-mono sm:grid-cols-2">
              {prev ? (
                <Link
                  href={`/journal/${prev.slug}`}
                  className="group border-b border-[#1b1d1e]/15 py-5 sm:border-r sm:pr-6"
                >
                  <span className="text-muted-foreground text-[11.5px] tracking-[0.12em] uppercase">
                    <span className="text-gold-ink" aria-hidden="true">
                      ←{" "}
                    </span>
                    Neuerer Beitrag
                  </span>
                  <span className="mt-2 block font-sans text-[18px] leading-snug font-[650] group-hover:underline group-hover:decoration-[var(--gold)] group-hover:underline-offset-4">
                    {prev.title}
                  </span>
                </Link>
              ) : (
                <span className="hidden border-b border-[#1b1d1e]/15 sm:block sm:border-r" />
              )}
              {next ? (
                <Link href={`/journal/${next.slug}`} className="group border-b border-[#1b1d1e]/15 py-5 sm:pl-6 sm:text-right">
                  <span className="text-muted-foreground text-[11.5px] tracking-[0.12em] uppercase">
                    Älterer Beitrag
                    <span className="text-gold-ink" aria-hidden="true">
                      {" "}
                      →
                    </span>
                  </span>
                  <span className="mt-2 block font-sans text-[18px] leading-snug font-[650] group-hover:underline group-hover:decoration-[var(--gold)] group-hover:underline-offset-4">
                    {next.title}
                  </span>
                </Link>
              ) : (
                <span className="hidden border-b border-[#1b1d1e]/15 sm:block" />
              )}
            </nav>
          </footer>
        </article>

        <Briefkarte
          id="fragen-zum-beitrag"
          title="Fragen zu einem Beitrag beantworten wir am Telefon."
          inquiryHref={links[0].href}
          knopf={links[0].label}
          link={links[1] ?? { href: "/journal", label: "Alle Beiträge" }}
        >
          Oder Sie schreiben uns über das Anfrageformular. Wir antworten meist am selben Werktag.
        </Briefkarte>
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
