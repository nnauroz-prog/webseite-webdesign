import type { Metadata } from "next";
import Link from "next/link";
import {
  BarChart3,
  CheckCircle2,
  ExternalLink,
  Globe2,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";

import { IntegrationsForm } from "@/components/dashboard/website/integrations-form";
import { Button } from "@/components/ui/button";
import { requireCurrentWebsite } from "@/lib/supabase/auth";
import { getSiteUrl } from "@/lib/site-url";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "SEO & Sichtbarkeit" };

export default async function SeoPage() {
  const { website } = await requireCurrentWebsite();
  const baseUrl = getSiteUrl();
  const publicUrl = `${baseUrl}/site/${website.slug}`;
  const sitemapUrl = `${baseUrl}/sitemap.xml`;

  const checks = [
    {
      label: "Site veröffentlicht",
      done: website.is_active,
      hint: website.is_active
        ? null
        : "Solange die Seite privat ist, kann Google sie nicht indexieren.",
    },
    {
      label: "SEO-Titel + Beschreibung",
      done: !!website.seo_title?.trim() && !!website.seo_description?.trim(),
      hint: "Pflegen unter Website → SEO.",
    },
    {
      label: "Google Search Console verifiziert",
      done: !!website.seo_google_site_verification?.trim(),
      hint: "Code unten einfügen, dann unter google.com/search-console verifizieren.",
    },
    {
      label: "Google Analytics aktiv",
      done: !!website.analytics_ga4_id?.trim(),
      hint: "Optional, aber sehr empfehlenswert um Besucher zu verstehen.",
    },
  ];
  const doneCount = checks.filter((c) => c.done).length;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-6 py-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">
          SEO &amp; Sichtbarkeit
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">
          So findet Google deine Site — und so wirst du in der lokalen Suche
          gefunden.
        </p>
      </header>

      {/* Important framing — many users confuse paid Ads with organic */}
      <div className="border-amber-300/60 bg-amber-50/60 dark:border-amber-900/60 dark:bg-amber-950/30 rounded-xl border p-4 text-sm">
        <p className="text-foreground font-medium">
          Wichtig: Sitalo schaltet keine bezahlten Google-Anzeigen.
        </p>
        <p className="text-muted-foreground mt-1 text-pretty">
          Bezahlte Ads (oben mit „Anzeige” markiert) müssten deine Kunden
          selbst in Google Ads aufsetzen — das kostet pro Klick. Was wir
          stattdessen tun: dafür sorgen, dass eure Sites in der{" "}
          <strong className="text-foreground">organischen Suche</strong>{" "}
          gefunden werden. Kostet nichts, dauert ein paar Tage bis Wochen.
        </p>
      </div>

      {/* Status checklist */}
      <section className="bg-card rounded-xl border p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="flex items-center gap-2 text-base font-semibold">
              <CheckCircle2 className="text-primary h-4 w-4" />
              SEO-Setup ({doneCount}/{checks.length})
            </h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Was schon erledigt ist und was noch fehlt.
            </p>
          </div>
        </div>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {checks.map((c) => (
            <li
              key={c.label}
              className="flex items-start gap-2.5 text-sm"
            >
              <span
                className={cn(
                  "mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
                  c.done
                    ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                    : "border-border border",
                )}
              >
                {c.done ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}
              </span>
              <div className="space-y-0.5">
                <span
                  className={
                    c.done
                      ? "text-muted-foreground line-through"
                      : "text-foreground"
                  }
                >
                  {c.label}
                </span>
                {!c.done && c.hint ? (
                  <p className="text-muted-foreground text-xs">{c.hint}</p>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Step 1: Google Business Profile (the biggest local-SEO lever) */}
      <Step
        n={1}
        icon={MapPin}
        tone="emerald"
        title="Google Business Profile anlegen — der wichtigste Schritt"
        time="~10 Min · einmalig"
        description="Damit erscheint deine Praxis/Salon/Pflegedienst in Google Maps und bei lokalen Suchen wie „Pflegedienst Berlin” mit Karten-Pin, Sternen und Anrufen-Button."
      >
        <ol className="text-foreground list-decimal space-y-2 pl-5 text-sm">
          <li>
            Auf{" "}
            <Inline href="https://business.google.com">
              business.google.com
            </Inline>{" "}
            anmelden (mit deinem Google-Konto).
          </li>
          <li>
            Firmenname, Kategorie (z.B. „Pflegedienst”, „Zahnarzt”), Adresse,
            Telefon eintragen.
          </li>
          <li>
            <strong>Verifikation</strong> — du bekommst eine Postkarte (oder
            bei manchen Branchen einen Anruf) mit einem Code. Den dort
            eintragen.
          </li>
          <li>
            Im Profil die Website-URL angeben:{" "}
            <code className="bg-muted rounded px-1.5 py-0.5 text-xs">
              {publicUrl}
            </code>
            .
          </li>
          <li>Foto, Öffnungszeiten, kurze Beschreibung ergänzen — fertig.</li>
        </ol>
        <CalloutLink
          href="https://business.google.com"
          label="Zum Google Business Profile"
        />
      </Step>

      {/* Step 2: Google Search Console */}
      <Step
        n={2}
        icon={Search}
        tone="indigo"
        title="Google Search Console verifizieren"
        time="~5 Min · einmalig"
        description="Sagt Google: „Diese Site gehört mir, bitte indexieren.” Verkürzt die Zeit bis zur ersten Listung von Wochen auf Tage."
      >
        <ol className="text-foreground list-decimal space-y-2 pl-5 text-sm">
          <li>
            Auf{" "}
            <Inline href="https://search.google.com/search-console">
              search.google.com/search-console
            </Inline>{" "}
            anmelden.
          </li>
          <li>
            „Property hinzufügen” → URL-Präfix → einfügen:{" "}
            <code className="bg-muted rounded px-1.5 py-0.5 text-xs">
              {publicUrl}
            </code>
          </li>
          <li>
            Verifikationsmethode <strong>„HTML-Tag”</strong> wählen.
          </li>
          <li>
            Den Wert zwischen <code>content=&quot;…&quot;</code> kopieren und
            unten im Formular einfügen.
          </li>
          <li>Speichern → in Search Console auf „Bestätigen” klicken.</li>
          <li>
            Nach Verifikation: <strong>„Sitemaps”</strong> aufrufen und{" "}
            <code className="bg-muted rounded px-1.5 py-0.5 text-xs">
              sitemap.xml
            </code>{" "}
            einreichen.
          </li>
        </ol>
        <CalloutLink
          href="https://search.google.com/search-console"
          label="Zur Search Console"
        />
      </Step>

      {/* Step 3: GA4 */}
      <Step
        n={3}
        icon={BarChart3}
        tone="sky"
        title="Google Analytics 4 (optional)"
        time="~5 Min · einmalig"
        description="Sehe wie viele Besucher kommen, woher sie kommen, wie lange sie bleiben. Hilft beim Optimieren."
      >
        <ol className="text-foreground list-decimal space-y-2 pl-5 text-sm">
          <li>
            Auf{" "}
            <Inline href="https://analytics.google.com">
              analytics.google.com
            </Inline>{" "}
            ein Konto anlegen.
          </li>
          <li>Property erstellen, Branche und Zeitzone einstellen.</li>
          <li>
            Datenstrom „Web” anlegen mit URL{" "}
            <code className="bg-muted rounded px-1.5 py-0.5 text-xs">
              {publicUrl}
            </code>
            .
          </li>
          <li>
            <strong>Mess-ID</strong> kopieren (beginnt mit „G-”) und unten
            einfügen. Das war&apos;s — gtag.js wird automatisch geladen.
          </li>
        </ol>
        <CalloutLink
          href="https://analytics.google.com"
          label="Zu Google Analytics"
        />
      </Step>

      {/* Step 4: Sitemap reminder */}
      <Step
        n={4}
        icon={Globe2}
        tone="violet"
        title="Sitemap einreichen"
        time="~1 Min"
        description="Damit Suchmaschinen alle Seiten kennen — wir generieren sie automatisch."
      >
        <p className="text-muted-foreground text-sm">
          Deine Sitemap-URL:
        </p>
        <p className="bg-muted text-foreground mt-1 break-all rounded-md px-3 py-2 font-mono text-xs">
          {sitemapUrl}
        </p>
        <p className="text-muted-foreground mt-3 text-sm">
          Diese URL einreichen unter:
        </p>
        <ul className="mt-2 space-y-1 text-sm">
          <li>
            <Inline href="https://search.google.com/search-console">
              Google Search Console
            </Inline>{" "}
            → Sitemaps
          </li>
          <li>
            <Inline href="https://www.bing.com/webmasters">
              Bing Webmaster Tools
            </Inline>{" "}
            → Sitemaps
          </li>
        </ul>
      </Step>

      {/* The actual form */}
      <section>
        <div className="from-primary/5 via-background to-background border-primary/20 mb-3 rounded-xl border bg-gradient-to-br px-5 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-primary h-4 w-4" />
            <h2 className="text-foreground font-semibold">
              Codes hier einfügen
            </h2>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            Sobald du die Verifikations-Codes hast, hier einsetzen — wir
            rendern sie automatisch in den Head-Tag deiner Site.
          </p>
        </div>
        <IntegrationsForm website={website} />
      </section>
    </div>
  );
}

const TONE_CLASSES: Record<string, string> = {
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  indigo: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  sky: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  violet: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
};

function Step({
  n,
  icon: Icon,
  tone,
  title,
  time,
  description,
  children,
}: {
  n: number;
  icon: React.ComponentType<{ className?: string }>;
  tone: keyof typeof TONE_CLASSES;
  title: string;
  time: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="bg-card overflow-hidden rounded-xl border">
      <header className="border-border flex items-start gap-4 border-b p-5">
        <span
          className={cn(
            "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            TONE_CLASSES[tone],
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-muted-foreground text-xs tracking-wide uppercase">
              Schritt {n}
            </span>
            <span className="text-muted-foreground text-xs">· {time}</span>
          </div>
          <h3 className="text-foreground mt-1 text-base font-semibold tracking-tight">
            {title}
          </h3>
          <p className="text-muted-foreground mt-1 text-sm">{description}</p>
        </div>
      </header>
      <div className="space-y-3 p-5">{children}</div>
    </section>
  );
}

function Inline({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="text-primary hover:underline"
    >
      {children}
    </a>
  );
}

function CalloutLink({ href, label }: { href: string; label: string }) {
  return (
    <Button asChild variant="outline" size="sm" className="mt-2">
      <Link href={href} target="_blank" rel="noreferrer">
        {label}
        <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
      </Link>
    </Button>
  );
}
