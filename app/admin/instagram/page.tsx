import type { Metadata } from "next";

import { CircleCheck, ExternalLink, TriangleAlert } from "lucide-react";
import Link from "next/link";
import { unstable_rethrow } from "next/navigation";

import type {
  InstagramArt,
  InstagramStand,
  PostQuelle,
} from "@/lib/instagram/vertrag";

import { instagramStandAction } from "@/app/admin/instagram-actions";
import { requireAdmin } from "@/lib/admin/auth";
import { artText, wannText } from "@/lib/admin/instagram-strom";
import { safeHttpUrl } from "@/lib/admin/links";
import { listPosts } from "@/lib/instagram/posts-store";
import { serieFuer } from "@/lib/serien-aktuell";
import { postsFuer } from "@/lib/sprueche-aktuell";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Instagram" };

/**
 * Die Karte ist ein div mit role="region", kein section-Element (siehe
 * app/admin/story/redaktion.tsx: data-sicht beim Hydrieren).
 */
const KARTE = "border-border bg-card rounded-[4px] border p-4";
const KOPF = "text-[17px] font-semibold tracking-tight";
const CODE =
  "bg-foreground/[0.06] rounded-[3px] px-1 py-0.5 font-mono text-[13px] break-words";

/** Ein Post, den das Studio auf Instagram gebracht hat. */
type LetzterPost = {
  id: string;
  /** Zeitpunkt (ISO). */
  wann: string;
  art: InstagramArt;
  anzahl: number;
  /** Titel der Serie oder Satz des Posts. */
  titel: string;
  link: string | null;
};

async function standLesen(): Promise<InstagramStand | null> {
  try {
    return await instagramStandAction();
  } catch (err) {
    unstable_rethrow(err);
    return null;
  }
}

/** Titel einer Serie oder Satz eines Posts zu einer Quelle, soweit bekannt. */
function titelZu(quelle: PostQuelle): string {
  if (quelle.typ === "post") {
    const karte = postsFuer(quelle.datum)[quelle.platz];
    return karte ? karte.text : "Post des Tages";
  }
  if (quelle.id === null)
    return serieFuer(quelle.datum)?.titel ?? "Story-Serie";
  return "Story-Serie aus einem Auftrag";
}

/**
 * Die letzten Posts aus dem Studio (Tabelle instagram_posts). Ohne das
 * Datenbank-Update „Posten auf Instagram“ gibt es keine Liste.
 */
async function letztePosts(): Promise<LetzterPost[]> {
  try {
    const zeilen = await listPosts(10);
    return (zeilen ?? []).map((z) => ({
      id: z.id,
      wann: z.created_at,
      art: z.art,
      anzahl: z.bilder,
      titel: titelZu(z.quelle),
      link: z.links.map((l) => safeHttpUrl(l)).find(Boolean) ?? null,
    }));
  } catch (err) {
    unstable_rethrow(err);
    return [];
  }
}

/** Die Einrichtung in fünf Schritten; die ganze Anleitung steht in docs/instagram-einrichtung.md. */
function Einrichtung({ speicherFehlt }: { speicherFehlt: boolean }) {
  const schritt = "pl-1";
  return (
    <>
      <ol className="mt-3 list-decimal space-y-2.5 pl-5 text-[15px] leading-6">
        <li className={schritt}>
          Instagram-Konto in der App auf{" "}
          <strong className="font-semibold">Business</strong> umstellen und mit
          deiner Facebook-Seite verbinden.
        </li>
        <li className={schritt}>
          Im <strong className="font-semibold">Meta Business Manager</strong>{" "}
          einen Systemnutzer anlegen, ihm deine App, die Facebook-Seite und das
          Instagram-Konto zuweisen und einen Zugangsschlüssel erzeugen, der
          nicht abläuft. Rechte: <span className={CODE}>instagram_basic</span>,{" "}
          <span className={CODE}>instagram_content_publish</span>,{" "}
          <span className={CODE}>pages_show_list</span>,{" "}
          <span className={CODE}>pages_read_engagement</span>,{" "}
          <span className={CODE}>business_management</span>.
        </li>
        <li className={schritt}>
          In <strong className="font-semibold">Vercel</strong> unter Settings →
          Environment Variables den Schlüssel als{" "}
          <span className={CODE}>INSTAGRAM_TOKEN</span> eintragen (als
          „Sensitive“). Wahlweise dazu{" "}
          <span className={CODE}>INSTAGRAM_KONTO_ID</span> (Kennung des Kontos,
          sonst sucht der Server sie selbst) und{" "}
          <span className={CODE}>INSTAGRAM_API_VERSION</span> (sonst v26.0).
        </li>
        <li className={cn(schritt, speicherFehlt && "font-medium")}>
          Im Mitgliederbereich das Datenbank-Update „Posten auf Instagram“
          ausführen. Es legt den Speicher für die Bilder an.
          {speicherFehlt ? " Dieser Schritt fehlt noch." : null}
        </li>
        <li className={schritt}>
          In Vercel neu bereitstellen (Redeploy), dann diese Seite neu laden.
        </li>
      </ol>
      <p className="text-muted-foreground mt-3 text-[14px] leading-5">
        Der Schlüssel bleibt auf dem Server, das Studio sieht ihn nie. Die ganze
        Anleitung steht in{" "}
        <span className="text-foreground font-medium break-words">
          docs/instagram-einrichtung.md
        </span>
        .
      </p>
    </>
  );
}

/**
 * `/admin/instagram` — die Verbindung zu Instagram: ob sie steht, auf
 * welchem Konto das Studio postet, wie viel vom Kontingent des Tages
 * schon verbraucht ist, die letzten Posts und, solange etwas fehlt,
 * wie man sie einrichtet. Erreichbar über die Zeile im Story-Studio.
 */
export default async function InstagramPage() {
  await requireAdmin();
  const [stand, letzte] = await Promise.all([standLesen(), letztePosts()]);
  const verbunden = stand?.verbunden === true;
  const konto = stand?.verbunden && stand.konto ? stand.konto.name : null;
  const kontingent = stand?.verbunden ? stand.kontingent : null;
  const problem = stand?.verbunden ? stand.problem : null;
  const einrichten = !verbunden || problem !== null;

  return (
    <>
      <p>
        <Link
          href="/admin/story"
          className="text-muted-foreground inline-flex min-h-11 items-center text-[14px] underline-offset-4 hover:underline"
        >
          ‹ Story-Studio
        </Link>
      </p>
      <h1 className="text-[22px] font-semibold tracking-tight">Instagram</h1>
      <p className="text-muted-foreground mt-1 text-[15px] leading-6">
        Story-Serien und Posts gehen aus dem Story-Studio direkt auf dein
        Instagram-Konto.
      </p>

      <div className="mt-5 grid gap-4 lg:grid-cols-2 lg:items-start">
        <div role="region" aria-labelledby="verbindung-titel" className={KARTE}>
          <h2 id="verbindung-titel" className={KOPF}>
            Verbindung
          </h2>
          {stand === null ? (
            <p className="mt-2 text-[15px] leading-6">
              Der Stand ließ sich gerade nicht prüfen. Lade die Seite gleich
              neu.
            </p>
          ) : stand.verbunden ? (
            <>
              <p className="mt-2 flex items-start gap-2 text-[15px] leading-6">
                <CircleCheck
                  className="text-ink-petrol mt-1 h-4 w-4 shrink-0"
                  aria-hidden="true"
                />
                <span>
                  Verbunden
                  {konto ? (
                    <>
                      {" "}
                      als <span className="font-semibold">@{konto}</span>
                    </>
                  ) : null}
                  .
                </span>
              </p>
              {kontingent ? (
                <p className="text-muted-foreground mt-1 text-[15px] leading-6">
                  Heute schon {kontingent.genutzt} von {kontingent.gesamt}{" "}
                  Beiträgen gepostet. Instagram zählt die letzten 24 Stunden;
                  ein Karussell zählt als ein Beitrag.
                </p>
              ) : null}
              {problem ? (
                <p
                  role="alert"
                  className="border-gold mt-3 flex items-start gap-2 rounded-[3px] border px-3 py-2 text-[14px] leading-5"
                >
                  <TriangleAlert
                    className="text-gold-ink mt-0.5 h-4 w-4 shrink-0"
                    aria-hidden="true"
                  />
                  <span>{problem} Prüf die Schritte unter „Einrichten“.</span>
                </p>
              ) : null}
              {konto ? (
                <a
                  href={`https://www.instagram.com/${encodeURIComponent(konto)}/`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border-border hover:border-foreground/40 mt-3 inline-flex h-11 items-center gap-2 rounded-[3px] border px-4 text-[15px] font-medium transition-colors"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                  Profil auf Instagram
                </a>
              ) : null}
            </>
          ) : (
            <>
              <p className="mt-2 text-[15px] leading-6">
                {stand.grund === "kein_speicher"
                  ? "Fast fertig: Der Schlüssel ist da, aber der Speicher für die Bilder fehlt noch."
                  : "Noch nicht verbunden."}
              </p>
              <p className="text-muted-foreground mt-1 text-[14px] leading-5">
                Bis dahin postest du wie bisher: im Story-Studio „Bild teilen“
                oder „Alle Bilder teilen“ antippen und in Instagram posten.
              </p>
            </>
          )}
        </div>

        <div role="region" aria-labelledby="so-titel" className={KARTE}>
          <h2 id="so-titel" className={KOPF}>
            So postest du
          </h2>
          <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-[15px] leading-6">
            <li className="pl-1">
              Im Story-Studio eine Serie aufklappen oder einen Post wählen.
            </li>
            <li className="pl-1">
              „Auf Instagram posten“ antippen und wählen: Story oder Beitrag
              (eine Serie auch als Karussell).
            </li>
            <li className="pl-1">
              Bestätigen. Das Studio zeigt, wie weit es ist, und am Ende den
              Link.
            </li>
          </ol>
          <p className="text-muted-foreground mt-2 text-[14px] leading-5">
            Es geht genau das Design raus, das du im Studio siehst.
          </p>
        </div>

        {letzte.length > 0 ? (
          <div
            role="region"
            aria-labelledby="letzte-titel"
            className={cn(KARTE, "lg:col-span-2")}
          >
            <h2 id="letzte-titel" className={KOPF}>
              Zuletzt gepostet
            </h2>
            <ul className="divide-border mt-2 divide-y">
              {letzte.map((p) => (
                <li
                  key={p.id}
                  className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-2"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[15px] font-medium">
                      {p.titel}
                    </span>
                    <span className="text-muted-foreground block text-[13px]">
                      {artText(p.art, p.anzahl)}, {wannText(p.wann)}
                    </span>
                  </span>
                  {p.link ? (
                    <a
                      href={p.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-1.5 text-[14px] underline underline-offset-4"
                    >
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                      Ansehen
                    </a>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {einrichten ? (
          <div
            role="region"
            aria-labelledby="einrichten-titel"
            className={cn(KARTE, "lg:col-span-2")}
          >
            <h2 id="einrichten-titel" className={KOPF}>
              Einrichten
            </h2>
            <p className="text-muted-foreground mt-1 text-[14px] leading-5">
              Einmal einrichten, dann bleibt die Verbindung stehen.
            </p>
            <Einrichtung
              speicherFehlt={
                stand?.verbunden === false && stand.grund === "kein_speicher"
              }
            />
          </div>
        ) : (
          <details className={cn(KARTE, "group p-0 lg:col-span-2")}>
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 px-4 text-[15px] font-medium [&::-webkit-details-marker]:hidden">
              So ist die Verbindung eingerichtet
              <span
                aria-hidden="true"
                className="text-muted-foreground text-[13px] font-normal group-open:hidden"
              >
                zeigen
              </span>
            </summary>
            <div className="border-border border-t px-4 pb-4">
              <Einrichtung speicherFehlt={false} />
            </div>
          </details>
        )}
      </div>
    </>
  );
}
