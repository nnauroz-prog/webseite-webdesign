import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache, Fragment } from "react";
import { Mail, Phone } from "lucide-react";

import type { StatusKasten } from "@/app/angebot/angebot-seite";
import type {
  AngebotOeffentlich,
  AngebotSummen,
  Summe,
} from "@/lib/admin/angebote";

import {
  absaetze,
  absenderAdresse,
  aktualisiertNachSenden,
  mengeText,
  NICHT_MEHR_ONLINE,
  nichtMehrOnline,
  positionsGruppen,
  rueckfrageMailHref,
  statusKasten,
} from "@/app/angebot/angebot-seite";
import { SitaloLogo } from "@/components/sitalo-logo";
import {
  ANGEBOT_KONTAKT,
  angebotsDatum,
  berechneSummen,
  formatDatumLang,
  formatEuro,
  kundenAnsicht,
  parseToken,
  preisSatz,
  ustHinweis,
} from "@/lib/admin/angebote";
import { getAdminEmail } from "@/lib/admin/auth";
import { berlinDateIso } from "@/lib/admin/berlin-time";
import { getAngebotByToken } from "@/lib/angebote-store";
import { cn } from "@/lib/utils";

import styles from "./angebot.module.css";
import {
  AnnahmeBereich,
  AufrufMelder,
  DruckKnopf,
  VorschauLeiste,
  ZumAnnehmen,
} from "./kunden-aktionen";

/*
 * Öffentliche Angebotsseite. Wer den Link hat, sieht das Angebot; der
 * Token ist das einzige Merkmal in der Adresse.
 *
 * - Immer pro Aufruf rendern (Status, Gültigkeit, Annahme).
 * - Nicht in die Suche: robots-Metadaten hier, X-Robots-Tag in
 *   next.config.ts, nicht in der Sitemap. Bewusst NICHT in robots.txt
 *   gesperrt: Sonst sähe Google das noindex nie und könnte eine irgendwo
 *   verlinkte Adresse ohne Inhalt aufnehmen. Referrer aus, damit der
 *   Link nirgends mitgeschickt wird; Plausible zählt hier nicht.
 * - Entwürfe sieht nur der eingeloggte Inhaber (Vorschau), sonst 404.
 * - „Geöffnet“ meldet erst der Browser (AufrufMelder), nicht das
 *   Rendern: Link-Vorschauen und der Inhaber zählen nicht.
 * - Die Login-Sitzung wird hier nur bei Entwürfen gelesen. proxy.ts
 *   erneuert Sitzungen nur unter /admin; ein Lesen bei jedem Aufruf
 *   könnte ein abgelaufenes Token erneuern, ohne es zu speichern.
 */

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ token: string }> };

const laden = cache(
  async (token: string): Promise<AngebotOeffentlich | null> =>
    getAngebotByToken(token),
);

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const t = parseToken(token);
  let nummer: string | null = null;
  if (t) {
    try {
      const a = await laden(t);
      if (a && a.status !== "entwurf") nummer = a.nummer;
    } catch {
      // Die Seite selbst zeigt den Fehler.
    }
  }
  return {
    title: {
      absolute: nummer
        ? `Angebot ${nummer} · Sitalo Webdesign`
        : "Angebot · Sitalo Webdesign",
    },
    description: "Ihr Angebot von Sitalo Webdesign aus Hamburg.",
    robots: {
      index: false,
      follow: false,
      nocache: true,
      googleBot: { index: false, follow: false },
    },
    referrer: "no-referrer",
    // Telefonnummer und Mail sind ausdrücklich verlinkt; Safari soll
    // nicht zusätzlich Beträge oder Daten als Links deuten.
    formatDetection: { telephone: false, email: false, address: false },
    openGraph: {
      title: nummer ? `Angebot ${nummer}` : "Ihr Angebot",
      description: "Ihr Angebot von Sitalo Webdesign aus Hamburg.",
      siteName: "Sitalo Webdesign",
      type: "website",
      locale: "de_DE",
    },
  };
}

export default async function AngebotSeite({ params }: Props) {
  const { token } = await params;
  const t = parseToken(token);
  if (!t) notFound();

  let angebot: AngebotOeffentlich | null;
  try {
    angebot = await laden(t);
  } catch (err) {
    console.error("[angebot] Seite nicht geladen", {
      code: (err as { code?: string })?.code ?? "exception",
    });
    return <Ladefehler />;
  }
  if (!angebot) notFound();

  let admin = false;
  if (angebot.status === "entwurf") {
    admin = Boolean(await getAdminEmail().catch(() => null));
    if (!admin) notFound();
  }

  const now = new Date();
  const ansicht = kundenAnsicht(angebot, now);
  // Ein Jahr nach dem Abschluss nur noch die Nummer (Datensparsamkeit).
  const archiv = nichtMehrOnline(angebot, ansicht, now);
  const kasten = archiv
    ? NICHT_MEHR_ONLINE
    : statusKasten(angebot, ansicht, now);
  const summen = berechneSummen(angebot.positionen, angebot.ust_satz);
  const adresse = absenderAdresse(process.env.ANGEBOT_ABSENDER_ADRESSE);
  const zeigeAngebot = ansicht !== "zurueckgezogen" && !archiv;
  const offen = !archiv && (ansicht === "offen" || ansicht === "entwurf");

  return (
    <div className={cn(styles.seite, "bg-background flex min-h-dvh flex-col")}>
      <AufrufMelder token={t} admin={admin}>
        <VorschauLeiste entwurf={ansicht === "entwurf"} />
        <main
          id="main"
          tabIndex={-1}
          className={cn(
            styles.haupt,
            "mx-auto w-full max-w-[54rem] flex-1 px-4 pt-5 pb-14 sm:px-6 sm:pt-9 sm:pb-20",
          )}
        >
          <div
            className={cn(
              styles.nichtDrucken,
              "mb-4 flex items-center justify-between gap-3 sm:mb-5",
            )}
          >
            <p className="label-mono text-muted-foreground">Ihr Angebot</p>
            {zeigeAngebot ? (
              <div className="flex items-center gap-2">
                <DruckKnopf kurz className="h-10 px-3.5 text-[14px]" />
                {offen ? (
                  <ZumAnnehmen className="h-10 px-4 text-[14px]" />
                ) : null}
              </div>
            ) : null}
          </div>

          {kasten ? <Hinweiskasten kasten={kasten} /> : null}

          {zeigeAngebot ? (
            <Blatt angebot={angebot} summen={summen} adresse={adresse} />
          ) : (
            <NichtGueltig nummer={angebot.nummer} adresse={adresse} />
          )}

          {offen ? (
            <AnnahmeBereich
              token={t}
              nummer={angebot.nummer}
              kundeName={angebot.kunde_name}
              stand={angebot.updated_at}
              preis={preisSatz(summen)}
            />
          ) : (
            <>
              {/* Nach dem Annehmen/Ablehnen steht man hier unten: die
                  Bestätigung dort zeigen, wo eben noch das Formular war
                  (oben steht sie für spätere Aufrufe). */}
              {kasten &&
              !archiv &&
              (ansicht === "angenommen" || ansicht === "abgelehnt") ? (
                <Hinweiskasten kasten={kasten} unten />
              ) : null}
              <KontaktLeiste nummer={angebot.nummer} drucken={zeigeAngebot} />
            </>
          )}
        </main>
        <Fuss />
      </AufrufMelder>
    </div>
  );
}

// ---------------------------------------------------------------------
// Bausteine
// ---------------------------------------------------------------------

const TON: Record<StatusKasten["ton"], { leiste: string; rahmen: string }> = {
  erfolg: { leiste: "bg-ink-petrol", rahmen: "border-ink-petrol" },
  hinweis: { leiste: "bg-gold", rahmen: "border-foreground" },
  ende: { leiste: "bg-foreground", rahmen: "border-foreground" },
  vorschau: { leiste: "bg-gold", rahmen: "border-gold" },
};

function Hinweiskasten({
  kasten,
  unten = false,
}: {
  kasten: StatusKasten;
  /** Wiederholung unter dem Angebot (nur Bildschirm, nicht im Druck). */
  unten?: boolean;
}) {
  const ton = TON[kasten.ton];
  const id = unten ? "status-titel-unten" : "status-titel";
  return (
    <section
      aria-labelledby={id}
      className={cn(
        unten ? styles.nichtDrucken : styles.kasten,
        "bg-card relative overflow-hidden border px-5 py-5 pl-6 sm:px-7 sm:pl-8",
        unten ? "mt-8" : "mb-5 sm:mb-6",
        ton.rahmen,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("absolute inset-y-0 left-0 w-1.5", ton.leiste)}
      />
      <h2
        id={id}
        className="text-[1.15rem] leading-tight tracking-[-0.015em] sm:text-[1.3rem]"
      >
        {kasten.titel}
      </h2>
      <p className="mt-2 max-w-[40rem] text-[15.5px] leading-relaxed">
        {kasten.text}
      </p>
    </section>
  );
}

/**
 * Briefkopf: Wortmarke und Absender. Am Handy fließt der Absender in
 * zwei, drei Zeilen mit „·“ dazwischen, ab sm steht er rechts als Block.
 */
function Briefkopf({ adresse }: { adresse: string[] }) {
  // Zeilen am Handy: Absender, Kontakt; ab sm jedes Teil eine Zeile.
  type Teil = { key: string; inhalt: React.ReactNode; nurAbSm?: boolean };
  const name: Teil = {
    key: "name",
    inhalt: (
      <span className="text-foreground font-semibold">Sitalo Webdesign</span>
    ),
  };
  const anschrift: Teil[] = (adresse.length ? adresse : ["Hamburg"]).map(
    (z, i) => ({ key: `a${i}`, inhalt: z }),
  );
  const gruppen: Teil[][] = [
    // Mit Anschrift steht sie am Handy in einer eigenen Zeile.
    ...(adresse.length ? [[name], anschrift] : [[name, ...anschrift]]),
    [
      {
        key: "tel",
        inhalt: (
          <a href={ANGEBOT_KONTAKT.telHref} className="hover:underline">
            {ANGEBOT_KONTAKT.telefon}
          </a>
        ),
      },
      {
        key: "mail",
        inhalt: (
          <a
            href={`mailto:${ANGEBOT_KONTAKT.email}`}
            className="hover:underline"
          >
            {ANGEBOT_KONTAKT.email}
          </a>
        ),
      },
      { key: "web", inhalt: "sitalo.de", nurAbSm: true },
    ],
  ];
  return (
    <header className="border-foreground flex flex-col gap-4 border-b pb-5 sm:flex-row sm:items-start sm:justify-between sm:gap-8 sm:pb-6">
      <SitaloLogo size="md" />
      <address
        className={cn(
          styles.text,
          "text-muted-foreground text-[13px] leading-[1.65] not-italic sm:text-right",
        )}
      >
        {gruppen.map((g, gi) => (
          <span key={gi} className="block">
            {g.map((t, i) => (
              <Fragment key={t.key}>
                {/* Leerzeichen als Umbruchstelle zwischen den Teilen. */}
                {i > 0 ? " " : null}
                <span
                  className={cn(
                    "whitespace-nowrap sm:block",
                    t.nurAbSm && "hidden",
                  )}
                >
                  {i > 0 ? (
                    <span aria-hidden="true" className="mr-1 sm:hidden">
                      ·
                    </span>
                  ) : null}
                  {t.inhalt}
                </span>
              </Fragment>
            ))}
          </span>
        ))}
      </address>
    </header>
  );
}

function Blatt({
  angebot,
  summen,
  adresse,
}: {
  angebot: AngebotOeffentlich;
  summen: AngebotSummen;
  adresse: string[];
}) {
  const firma = angebot.kunde_firma?.trim() || null;
  const name = angebot.kunde_name.trim();
  const gruppen = positionsGruppen(angebot.positionen);
  const einleitung = absaetze(angebot.einleitung);
  const hinweise = absaetze(angebot.hinweise);
  const aktualisiert = aktualisiertNachSenden(angebot);

  return (
    <article
      aria-labelledby="angebot-titel"
      className={cn(
        styles.blatt,
        "bg-card border-border relative border px-5 pt-8 pb-8 sm:px-12 sm:pt-12 sm:pb-12",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(styles.kante, "bg-gold absolute inset-x-0 top-0 h-[3px]")}
      />
      <Briefkopf adresse={adresse} />

      <div
        className={cn(
          styles.block,
          "mt-8 grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto] sm:gap-10",
        )}
      >
        <div className="min-w-0">
          <p className="label-mono text-muted-foreground">Angebot für</p>
          <p className="mt-2 text-[17px] leading-snug font-semibold break-words">
            {firma ?? name}
          </p>
          {firma && name ? (
            <p className="mt-0.5 text-[15px] leading-snug break-words">
              {name}
            </p>
          ) : null}
        </div>
        <dl className="grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-5 gap-y-1.5 text-[14.5px] sm:grid-cols-[auto_auto]">
          <dt className="label-mono text-muted-foreground">Angebot</dt>
          <dd className={cn(styles.zahl, "font-mono text-[14px] font-medium")}>
            {angebot.nummer}
          </dd>
          <dt className="label-mono text-muted-foreground">Datum</dt>
          <dd>{formatDatumLang(angebotsDatum(angebot))}</dd>
          {aktualisiert ? (
            <>
              <dt className="label-mono text-muted-foreground">Geändert</dt>
              <dd>
                {formatDatumLang(berlinDateIso(new Date(angebot.updated_at)))}
              </dd>
            </>
          ) : null}
          <dt className="label-mono text-muted-foreground">Gültig bis</dt>
          <dd className="font-semibold">
            {formatDatumLang(angebot.gueltig_bis)}
          </dd>
        </dl>
      </div>

      <h1
        id="angebot-titel"
        className={cn(
          styles.titel,
          "mt-10 text-[1.6rem] leading-[1.12] tracking-[-0.025em] text-balance break-words sm:mt-12 sm:text-[2.15rem]",
        )}
      >
        {angebot.titel}
      </h1>

      <AufEinenBlick summen={summen} />

      {einleitung.length ? (
        <div
          className={cn(
            styles.text,
            "mt-8 max-w-[40rem] space-y-4 text-[16px] leading-relaxed",
          )}
        >
          {einleitung.map((a, i) => (
            <p key={i} className="whitespace-pre-line">
              {a}
            </p>
          ))}
        </div>
      ) : null}

      {gruppen.map((g, gi) => (
        <section
          key={g.art}
          aria-labelledby={`gruppe-${g.art}`}
          className={cn(styles.abschnitt, "mt-11 sm:mt-12")}
        >
          <h2
            id={`gruppe-${g.art}`}
            className="label-mono text-muted-foreground border-foreground border-b pb-2.5"
          >
            {g.titel}
          </h2>
          <Positionstabelle gruppe={g} />
          <Positionsliste gruppe={g} />
          <Summenblock
            summe={g.art === "einmalig" ? summen.einmalig : summen.monatlich}
            monatlich={g.art === "monatlich"}
            ustSatz={summen.ust_satz}
            // § 19-Satz nur einmal, unter der letzten Summe.
            ustHinweisZeigen={gi === gruppen.length - 1}
          />
        </section>
      ))}

      {gruppen.length === 0 ? (
        <p className="text-muted-foreground mt-10 text-[15px]">
          In diesem Angebot stehen noch keine Leistungen.
        </p>
      ) : null}

      {hinweise.length ? (
        <section
          aria-labelledby="hinweise"
          className={cn(styles.abschnitt, "mt-12")}
        >
          <h2
            id="hinweise"
            className="label-mono text-muted-foreground border-foreground border-b pb-2.5"
          >
            Hinweise
          </h2>
          <div
            className={cn(
              styles.text,
              "mt-4 max-w-[42rem] space-y-3 text-[15px] leading-relaxed",
            )}
          >
            {hinweise.map((a, i) => (
              <p key={i} className="whitespace-pre-line">
                {a}
              </p>
            ))}
          </div>
        </section>
      ) : null}

      <footer
        className={cn(
          styles.block,
          styles.text,
          styles.abschnitt,
          styles.schluss,
          "border-border mt-12 border-t pt-5 text-[14.5px] leading-relaxed",
        )}
      >
        <p>
          Fragen zum Angebot? Rufen Sie uns an unter{" "}
          <a
            href={ANGEBOT_KONTAKT.telHref}
            className="font-semibold whitespace-nowrap underline-offset-4 hover:underline"
          >
            {ANGEBOT_KONTAKT.telefon}
          </a>{" "}
          oder schreiben Sie an{" "}
          <a
            href={rueckfrageMailHref(angebot.nummer)}
            className="font-semibold underline-offset-4 hover:underline"
          >
            {ANGEBOT_KONTAKT.email}
          </a>
          .
        </p>
        <p className="text-muted-foreground mt-1">
          Sitalo Webdesign · {adresse.length ? adresse.join(" · ") : "Hamburg"}
        </p>
      </footer>
    </article>
  );
}

function AufEinenBlick({ summen }: { summen: AngebotSummen }) {
  const teile: { label: string; betrag: number; zusatz: string }[] = [];
  const steuer =
    summen.ust_satz === 19 ? "zzgl. 19 % USt" : "ohne USt (§ 19 UStG)";
  if (summen.einmalig.netto > 0)
    teile.push({
      label: "Einmalig",
      betrag: summen.einmalig.netto,
      zusatz: steuer,
    });
  if (summen.monatlich.netto > 0)
    teile.push({
      label: "Monatlich",
      betrag: summen.monatlich.netto,
      zusatz: `pro Monat, ${steuer}`,
    });
  if (teile.length === 0) return null;
  return (
    <div className={cn(styles.block, "border-border mt-6 border-y py-3.5")}>
      <dl className="grid grid-cols-2 gap-x-4 sm:flex sm:gap-14">
        {teile.map((t) => (
          <div key={t.label} className="min-w-0">
            <dt className="label-mono text-muted-foreground">{t.label}</dt>
            <dd className="mt-1">
              <span
                className={cn(
                  styles.zahl,
                  "block text-[1.3rem] leading-tight font-bold tracking-[-0.01em] sm:text-[1.45rem]",
                )}
              >
                {formatEuro(t.betrag)}
              </span>
              <span className="text-muted-foreground block text-[13px] leading-snug">
                {t.zusatz}
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

type Gruppe = ReturnType<typeof positionsGruppen>[number];

function betragText(netto: number): string {
  return netto === 0 ? "inklusive" : formatEuro(netto);
}

function Positionstabelle({ gruppe }: { gruppe: Gruppe }) {
  const monatlich = gruppe.art === "monatlich";
  return (
    <table className={cn(styles.tabelle, "hidden w-full sm:table")}>
      <thead>
        <tr className="border-border text-muted-foreground border-b text-left">
          <th scope="col" className="label-mono w-12 py-2.5 pr-3 font-medium">
            Nr.
          </th>
          <th scope="col" className="label-mono py-2.5 pr-6 font-medium">
            Leistung
          </th>
          <th
            scope="col"
            className="label-mono py-2.5 pr-5 text-right font-medium"
          >
            Menge
          </th>
          <th
            scope="col"
            className="label-mono py-2.5 pr-5 text-right font-medium whitespace-nowrap"
          >
            Einzelpreis
          </th>
          <th
            scope="col"
            className="label-mono py-2.5 text-right font-medium whitespace-nowrap"
          >
            {monatlich ? "Pro Monat" : "Betrag"}
          </th>
        </tr>
      </thead>
      <tbody>
        {gruppe.positionen.map((p) => (
          <tr
            key={p.id}
            className={cn(styles.zeile, "border-border border-b align-top")}
          >
            <td
              className={cn(
                styles.zahl,
                "text-muted-foreground py-4 pr-3 font-mono text-[13px]",
              )}
            >
              {p.nr}
            </td>
            <td className="py-4 pr-6">
              <span className="block text-[15.5px] leading-snug font-semibold break-words">
                {p.titel}
              </span>
              {p.beschreibung ? (
                <span
                  className={cn(
                    styles.text,
                    "text-muted-foreground mt-1 block text-[13.5px] leading-relaxed break-words whitespace-pre-line",
                  )}
                >
                  {p.beschreibung}
                </span>
              ) : null}
            </td>
            <td className={cn(styles.zahl, "py-4 pr-5 text-right text-[15px]")}>
              {p.menge}
            </td>
            <td
              className={cn(
                styles.zahl,
                "py-4 pr-5 text-right text-[15px] whitespace-nowrap",
              )}
            >
              {p.preis_cent === 0 ? "–" : formatEuro(p.preis_cent)}
            </td>
            <td
              className={cn(
                styles.zahl,
                "py-4 text-right text-[15px] font-semibold whitespace-nowrap",
              )}
            >
              {betragText(p.netto)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Am Handy: Positionen als Liste (Titel, Beschreibung, Betrag). */
function Positionsliste({ gruppe }: { gruppe: Gruppe }) {
  return (
    <ul className={cn(styles.liste, "sm:hidden")}>
      {gruppe.positionen.map((p) => (
        <li key={p.id} className="border-border border-b py-4">
          <div className="flex items-start justify-between gap-4">
            <p className="min-w-0 text-[15.5px] leading-snug font-semibold break-words">
              <span
                className={cn(
                  styles.zahl,
                  "text-muted-foreground mr-2 font-mono text-[13px] font-normal",
                )}
              >
                {p.nr}
              </span>
              {p.titel}
            </p>
            <p
              className={cn(
                styles.zahl,
                "shrink-0 text-right text-[15.5px] font-semibold whitespace-nowrap",
              )}
            >
              {betragText(p.netto)}
            </p>
          </div>
          {p.beschreibung ? (
            <p className="text-muted-foreground mt-1.5 text-[14px] leading-relaxed break-words whitespace-pre-line">
              {p.beschreibung}
            </p>
          ) : null}
          {p.menge > 1 ? (
            <p
              className={cn(
                styles.zahl,
                "text-muted-foreground mt-1.5 text-[13.5px]",
              )}
            >
              {mengeText(p.menge)} {formatEuro(p.preis_cent)}
            </p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function Summenblock({
  summe,
  monatlich,
  ustSatz,
  ustHinweisZeigen,
}: {
  summe: Summe;
  monatlich: boolean;
  ustSatz: AngebotSummen["ust_satz"];
  ustHinweisZeigen: boolean;
}) {
  const proMonat = monatlich ? " pro Monat" : "";
  const zeile = "flex items-baseline justify-between gap-6";
  return (
    <div className={cn(styles.summen, "mt-4 flex justify-end")}>
      <div className="w-full max-w-[22rem]">
        <dl className={cn(styles.zahl, "text-[15px]")}>
          {ustSatz === 19 ? (
            <>
              <div className={cn(zeile, "py-0.5")}>
                <dt className="text-muted-foreground">Summe netto</dt>
                <dd className="whitespace-nowrap">{formatEuro(summe.netto)}</dd>
              </div>
              <div className={cn(zeile, "py-0.5")}>
                <dt className="text-muted-foreground">zzgl. 19 % USt</dt>
                <dd className="whitespace-nowrap">{formatEuro(summe.ust)}</dd>
              </div>
            </>
          ) : null}
          <div className={cn(zeile, "border-foreground mt-1.5 border-t pt-2")}>
            <dt className="font-semibold">Gesamt{proMonat}</dt>
            <dd className="text-[16.5px] font-bold whitespace-nowrap">
              {formatEuro(summe.brutto)}
            </dd>
          </div>
        </dl>
        {ustSatz === 0 && ustHinweisZeigen ? (
          <p className="text-muted-foreground mt-1.5 text-[13px] leading-snug">
            {ustHinweis(0)}
          </p>
        ) : null}
      </div>
    </div>
  );
}

/** Zurückgezogen: nur der Hinweis oben und ein schlichter Briefkopf. */
function NichtGueltig({
  nummer,
  adresse,
}: {
  nummer: string;
  adresse: string[];
}) {
  return (
    <div
      className={cn(
        styles.blatt,
        "bg-card border-border relative border px-5 py-8 sm:px-12 sm:py-10",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(styles.kante, "bg-gold absolute inset-x-0 top-0 h-[3px]")}
      />
      <Briefkopf adresse={adresse} />
      <p className="text-muted-foreground mt-6 text-[14.5px]">
        Angebot{" "}
        <span className={cn(styles.zahl, "text-foreground font-mono")}>
          {nummer}
        </span>
      </p>
    </div>
  );
}

function KontaktLeiste({
  nummer,
  drucken,
}: {
  nummer: string;
  drucken: boolean;
}) {
  return (
    <section
      aria-label="Kontakt"
      className={cn(
        styles.nichtDrucken,
        "mt-6 grid gap-3 sm:flex sm:flex-wrap sm:items-center",
      )}
    >
      <a href={ANGEBOT_KONTAKT.telHref} className="btn-signal">
        <Phone className="h-4 w-4" aria-hidden="true" />
        Anrufen: {ANGEBOT_KONTAKT.telefon}
      </a>
      <a href={rueckfrageMailHref(nummer)} className="btn-line">
        <Mail className="h-4 w-4" aria-hidden="true" />
        {ANGEBOT_KONTAKT.email}
      </a>
      {drucken ? <DruckKnopf /> : null}
    </section>
  );
}

function Fuss() {
  return (
    <footer
      className={cn(
        styles.nichtDrucken,
        "border-border text-muted-foreground border-t px-4 py-6 text-[13px] sm:px-6",
      )}
    >
      <div className="mx-auto flex max-w-[54rem] flex-wrap items-center gap-x-5 gap-y-2">
        <span>Sitalo Webdesign · Hamburg</span>
        <Link
          href="/"
          className="hover:text-foreground underline-offset-4 hover:underline"
        >
          sitalo.de
        </Link>
        <Link
          href="/impressum"
          className="hover:text-foreground underline-offset-4 hover:underline"
        >
          Impressum
        </Link>
        <Link
          href="/datenschutz"
          className="hover:text-foreground underline-offset-4 hover:underline"
        >
          Datenschutz
        </Link>
      </div>
    </footer>
  );
}

function Ladefehler() {
  return (
    <div className={cn(styles.seite, "bg-background flex min-h-dvh flex-col")}>
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto w-full max-w-[40rem] flex-1 px-4 py-16 sm:px-6"
      >
        <SitaloLogo size="md" />
        <h1 className="mt-10 text-[1.6rem] leading-tight tracking-[-0.02em]">
          Das Angebot lässt sich gerade nicht laden.
        </h1>
        <p className="text-muted-foreground mt-3 text-[16px] leading-relaxed">
          Bitte versuchen Sie es in ein paar Minuten noch einmal. Oder rufen Sie
          uns an, dann gehen wir es gemeinsam durch.
        </p>
        <div className="mt-6 grid gap-3 sm:flex">
          <a href={ANGEBOT_KONTAKT.telHref} className="btn-signal">
            <Phone className="h-4 w-4" aria-hidden="true" />
            {ANGEBOT_KONTAKT.telefon}
          </a>
          <a href={`mailto:${ANGEBOT_KONTAKT.email}`} className="btn-line">
            <Mail className="h-4 w-4" aria-hidden="true" />
            {ANGEBOT_KONTAKT.email}
          </a>
        </div>
      </main>
    </div>
  );
}
