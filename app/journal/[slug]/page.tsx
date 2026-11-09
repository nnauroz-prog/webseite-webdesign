import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SitaloSignatur } from "@/components/marketing/hafen/sitalo-signatur";
import {
  FotoRahmen,
  KontaktKarte,
  SeitenKopf,
  UnterseiteMain,
  unterseiteStil as u,
} from "@/components/marketing/laden/unterseite";
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
import { ogFor } from "@/lib/seo";
import { SITE_URL } from "@/lib/site";

import { kopfBild } from "./kopf-bild";

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
    openGraph: ogFor(`/journal/${post.slug}`, post.title, post.seoDescription ?? post.dek, "article", {
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      tags: post.tags,
    }),
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
    dateModified: post.updatedAt ?? post.publishedAt,
    author: {
      "@type": "Organization",
      name: "Sitalo Webdesign",
      url: SITE_URL,
    },
    // Das Unternehmen (mit Logo) beschreibt das Root-Layout.
    publisher: { "@id": `${SITE_URL}/#business` },
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
  const cta: Pick<
    JournalCta,
    "primaryHref" | "primaryLabel" | "secondaryHref" | "secondaryLabel"
  > = getCtaForPost(post.slug) ?? {
    primaryHref: "/audit",
    primaryLabel: "Kostenlose Durchsicht Ihrer Website",
    secondaryHref: "/termin",
    secondaryLabel: "Erstgespräch buchen",
  };
  const links = [
    { href: cta.primaryHref, label: cta.primaryLabel },
    ...(cta.secondaryHref && cta.secondaryLabel
      ? [{ href: cta.secondaryHref, label: cta.secondaryLabel }]
      : []),
  ];

  const bild = kopfBild(post.slug);
  const [weiter, zweiter] = links;

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader cta={false} />
      <UnterseiteMain>
        <article>
          <SeitenKopf
            krumen={[
              { href: "/journal", label: "Journal" },
              { label: post.title },
            ]}
            eyebrow={
              <>
                <time dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt)}
                </time>{" "}
                · {post.readingMinutes} Min Lesezeit
              </>
            }
            titel={post.title}
            unter={post.dek}
            meta={
              post.tags.length > 0 ? (
                <ul
                  className="flex flex-wrap justify-center gap-2"
                  aria-label="Themen"
                >
                  {post.tags.map((tag) => (
                    <li
                      key={tag}
                      className="inline-flex h-8 items-center rounded-full bg-white px-3.5 text-[12px] text-[#6e6e73] shadow-[inset_0_0_0_1px_rgb(0_0_0/0.08)]"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              ) : null
            }
            bild={
              <FotoRahmen
                vorab
                src={bild.src}
                alt={bild.alt}
                aspect="21 / 9"
                aspectMobil="16 / 9"
                position={bild.position ?? "50% 50%"}
              />
            }
            unterschrift={bild.unterschrift}
          />

          <PostBody post={post} />

          <footer className="inhalt pt-10 sm:pt-14">
            <nav
              aria-label="Weitere Beiträge"
              className="grid gap-3 sm:grid-cols-2 sm:gap-5"
            >
              {prev ? (
                <article className="karte karte-hover p-7">
                  <Link
                    href={`/journal/${prev.slug}`}
                    className="link-chevron karte-link text-[14px]"
                  >
                    <span aria-hidden="true" className="chev">
                      ‹
                    </span>
                    Neuerer Beitrag
                  </Link>
                  <p className="t-karte mt-2 text-[21px]">{prev.title}</p>
                </article>
              ) : (
                <span className="hidden sm:block" />
              )}
              {next ? (
                <article className="karte karte-hover p-7 sm:text-right">
                  <Link
                    href={`/journal/${next.slug}`}
                    className="link-chevron karte-link text-[14px]"
                  >
                    Älterer Beitrag
                    <span aria-hidden="true" className="chev">
                      ›
                    </span>
                  </Link>
                  <p className="t-karte mt-2 text-[21px]">{next.title}</p>
                </article>
              ) : null}
            </nav>
          </footer>
        </article>

        <KontaktKarte
          id="abschluss"
          titel="Fragen zum Beitrag? Rufen Sie an."
          zeile={
            <>
              Oder schreiben Sie uns über das Anfrageformular, wir antworten
              meist am selben Werktag. Weiter zum Thema:{" "}
              <Link
                href={weiter.href}
                className="text-[#1d1d1f] underline decoration-[var(--gold)] underline-offset-4"
              >
                {weiter.label}
              </Link>
              .
            </>
          }
          link={zweiter ?? { href: "/journal", label: "Alle Beiträge" }}
          foto={{
            src: "/images/texture-espresso.webp",
            alt: "Eine Tasse Espresso auf einem Holztisch",
          }}
        />
      </UnterseiteMain>
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
    <div className={u.abschnitt}>
      <div className="inhalt">
        <div className={`${u.blatt} sm:!px-14 sm:!py-14`}>
          <div className="mx-auto max-w-[680px] space-y-6">
            {post.body.map((p, i) => (
              <ParagraphView key={i} paragraph={p} isLead={i === leadIndex} />
            ))}
            <SitaloSignatur
              caption="Aus dem Büro in Hamburg"
              className="!mt-12 max-w-[180px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ParagraphView({
  paragraph,
  isLead,
}: {
  paragraph: Paragraph;
  isLead: boolean;
}) {
  if (paragraph.kind === "h2") {
    return (
      <h2 className="!mt-12 text-[24px] leading-[1.17] tracking-[-0.02em] text-balance sm:text-[28px]">
        {paragraph.text}
      </h2>
    );
  }
  if (paragraph.kind === "quote") {
    return (
      <blockquote className="!my-10 rounded-[14px] bg-[#f5f5f7] px-6 py-5 sm:px-8 sm:py-6">
        <p className="text-[21px] leading-[1.3] font-semibold tracking-[-0.018em] text-balance sm:text-[24px]">
          {paragraph.text}
        </p>
      </blockquote>
    );
  }
  if (paragraph.kind === "li") {
    return (
      <p className="flex items-start gap-3 text-[17px] leading-[1.5] tracking-[-0.022em] text-[#424245]">
        <span
          aria-hidden="true"
          className="mt-[0.6em] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--gold)]"
        />
        <span>{paragraph.text}</span>
      </p>
    );
  }
  return (
    <p
      className={
        isLead
          ? "text-[19px] leading-[1.5] tracking-[-0.018em] text-pretty text-[#1d1d1f] sm:text-[21px]"
          : "text-[17px] leading-[1.6] tracking-[-0.022em] text-pretty text-[#424245]"
      }
    >
      {paragraph.text}
    </p>
  );
}
