import type { Metadata } from "next";
import Link from "next/link";

import { MehrLink } from "@/components/marketing/apple";
import a from "@/components/marketing/hafen/atelier.module.css";
import { PaketKacheln } from "@/components/marketing/hafen/paket-kacheln";
import { Steigend } from "@/components/marketing/hafen/steigend";
import {
  Abschnitt,
  FotoRahmen,
  KontaktKarte,
  SeitenKopf,
  UnterseiteMain,
  unterseiteStil as u,
} from "@/components/marketing/laden/unterseite";
import { MarketingFooter } from "@/components/marketing/marketing-footer";
import { MarketingHeader } from "@/components/marketing/marketing-header";
import {
  STRICH,
  VergleichZelle,
  type PaketSpalte,
  type VergleichGruppe,
  type VergleichZeile,
} from "@/components/marketing/pakete/vergleich-daten";
import { VergleichMobil } from "@/components/marketing/pakete/vergleich-mobil";
import { PAKETE, PREIS_HINWEIS, PREIS_HINWEIS_KURZ, getPaketBySlug, type Paket } from "@/lib/pakete-data";

export const metadata: Metadata = {
  title: `Pakete & Preise — Websites ${PAKETE[0].setup}`,
  description: `Websites ${PAKETE[0].setup} einmalig, dazu ${PAKETE[0].monthly.replace(/\s*\/\s*Monat$/, "")} im Monat für Hosting und kleine Änderungen, inkl. MwSt. Den Festpreis bekommen Sie vor Auftrag schriftlich.`,
  alternates: { canonical: "/pakete" },
};

type Slug = Paket["slug"];

const STARTER = getPaketBySlug("starter");
const STARTER_SETUP = STARTER?.setup ?? "ab 599\u00A0€";
/** „ab 59 € / Monat" → „ab 59 €" */
const STARTER_MONTHLY = (STARTER?.monthly ?? "ab 59\u00A0€ / Monat").replace(/\s*\/\s*Monat$/, "");

/** „ab 2.999 €" → „2.999 €", „ab 99 € / Monat" → „99 €" */
function betrag(label: string) {
  return label.replace(/^ab\s*/, "").replace(/\s*\/\s*Monat$/, "");
}

/** Richtwert bis online aus pakete-data, „meist 5–10 Werktage“. */
function dauer(slug: Slug) {
  return getPaketBySlug(slug)?.dauer ?? "–";
}

function gross(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Vergleich als Tabelle: Pakete sind Spalten, Leistungen sind Zeilen.
 * Preise kommen aus lib/pakete-data.ts, die Zeilen fassen die
 * Leistungslisten dort zusammen. Ein Strich heißt: nicht in diesem Paket
 * (dargestellt als „—“ mit „Nicht enthalten“ für Screenreader).
 * Die Dauer folgt den kanonischen Richtwerten (ab vollständigen
 * Unterlagen), siehe auch pakete-data detailIntro.
 */
const ZEILEN: VergleichZeile[] = [
  {
    label: "Umfang",
    art: "text",
    werte: {
      starter: "Eine Seite mit allem Wichtigen",
      business: "Bis zu fünf Unterseiten",
      premium: "Eigene Struktur nach Ihrem Bedarf",
      studio: "Bis zu zwölf Bereiche oder Seiten",
    },
  },
  {
    label: "Typisch dabei",
    art: "text",
    werte: {
      starter: "Kontaktformular, Anruf-Knopf, Karte und Öffnungszeiten",
      business: "Team mit Fotos, Leistungen, Galerie, Formular für Bewerbung oder Terminanfrage",
      premium: "Formulare für Kontakt, Bewerbung und Online-Buchung",
      studio: "Neues Erscheinungsbild: Schrift, Farben und Bildsprache, bis zu drei Korrekturrunden",
    },
  },
  {
    label: "Inhalte selbst pflegen",
    art: "hakenText",
    werte: {
      starter: STRICH,
      business: STRICH,
      premium: "Auf Wunsch: Speisekarte, Angebote, Termine",
      studio: "In bis zu zwölf Bereichen",
    },
  },
  {
    label: "Google-Profil und lokale Suche",
    art: "haken",
    werte: { starter: STRICH, business: "Richten wir ein", premium: "Richten wir ein", studio: "Richten wir ein" },
  },
  {
    label: "Kleine Änderungen im Monat",
    art: "zahl",
    werte: { starter: "Bis zu 1", business: "Bis zu 3", premium: "Bis zu 6", studio: "Bis zu 10" },
  },
  {
    label: "Dauer bis online",
    art: "text",
    werte: {
      starter: gross(dauer("starter")),
      business: gross(dauer("business")),
      premium: gross(dauer("premium")),
      studio: gross(dauer("studio")),
    },
  },
  {
    label: "Persönliches Treffen",
    art: "text",
    werte: {
      starter: "In Hamburg auf Wunsch, sonst Telefon oder Video",
      business: "In Hamburg auf Wunsch, sonst Telefon oder Video",
      premium: "In Hamburg auf Wunsch, sonst Telefon oder Video",
      studio: "Vor dem Entwurf, in Hamburg oder bei Ihnen",
    },
  },
];

const zeile = (label: string) => ZEILEN.find((z) => z.label === label)!;

/** Zeilen gruppiert wie im Apple-Vergleich: Preis, Umfang, Nach dem Start. */
const GRUPPEN: VergleichGruppe[] = [
  {
    titel: "Preis",
    zeilen: [
      {
        label: "Einmalig",
        art: "preis",
        werte: Object.fromEntries(PAKETE.map((p) => [p.slug, p.setup])) as Record<Slug, string>,
      },
      {
        label: "Monatlich",
        art: "preis",
        werte: Object.fromEntries(PAKETE.map((p) => [p.slug, `ab\u00A0${betrag(p.monthly)}`])) as Record<Slug, string>,
      },
    ],
  },
  {
    titel: "Umfang",
    zeilen: [
      zeile("Umfang"),
      zeile("Typisch dabei"),
      {
        label: "Typisches Projekt",
        art: "text",
        werte: Object.fromEntries(PAKETE.map((p) => [p.slug, p.examples[0]])) as Record<Slug, string>,
      },
    ],
  },
  {
    titel: "Nach dem Start",
    zeilen: [
      zeile("Inhalte selbst pflegen"),
      zeile("Google-Profil und lokale Suche"),
      zeile("Kleine Änderungen im Monat"),
      zeile("Dauer bis online"),
      zeile("Persönliches Treffen"),
    ],
  },
];

/** Was der mobile Vergleich (Client) von den Paketen braucht. */
const SPALTEN: PaketSpalte[] = PAKETE.map((p) => ({
  slug: p.slug,
  name: p.name,
  setup: p.setup,
  monthly: p.monthly,
  highlight: !!p.highlight,
}));

/*
 * Aufbau im Atelier-Satz, jeder Abschnitt in eigener Form: Kopf mit
 * Foto und Mono-Bildunterschrift · Paket-Kacheln mit 40-Fuß-Containern ·
 * Vergleichstabelle mit Positionsnummern · Monatsbeitrag als Verzeichnis
 * auf Teer · Werkzeuge als Liste mit Notiz · Briefkarte.
 */
export default function PaketePage() {
  return (
    <div className="bg-background flex min-h-screen flex-col">
      <MarketingHeader cta={false} />
      <UnterseiteMain>
        <SeitenKopf
          krumen="Pakete"
          eyebrow="Liegeplatz 3 · Pakete und Preise"
          titel="Website-Pakete"
          akzent={STARTER_SETUP}
          unter={
            <>
              Dazu kommt ein Monatsbeitrag {STARTER_MONTHLY} für Hosting, Updates und kleine Änderungen. Den Festpreis
              bekommen Sie schriftlich, bevor wir anfangen.
            </>
          }
          aktionen={
            <>
              <Link href="/anfrage" className="btn-signal btn-gross">
                Anfrage schreiben
              </Link>
              <MehrLink href="#vergleich" groesse="unter">
                Pakete vergleichen
              </MehrLink>
            </>
          }
          meta={<>{PREIS_HINWEIS_KURZ} · Mindestlaufzeit 6 Monate</>}
          bild={
            <FotoRahmen
              vorab
              src="/images/sitalo-kosmetik-laptop.webp"
              alt="Laptop auf einer Marmorplatte in einem Kosmetikstudio, auf dem Bildschirm die Musterseite des Studios"
              aspect="21 / 9"
              aspectMobil="4 / 3"
              position="50% 55%"
            />
          }
          unterschrift={<>Musterseite eines Kosmetikstudios, frei erfunden · Paket Business</>}
        />
        <Modelle />
        <Vergleich />
        <Monatsbeitrag />
        <Weiterlesen />
        <KontaktKarte
          id="abschluss"
          titel="Welches Paket passt, klären wir am Telefon."
          zeile="Eine Viertelstunde reicht meistens. Wer lieber schreibt, nimmt das Formular, wir antworten meist am selben Werktag."
          link={{ href: "/branchen", label: "Musterseiten ansehen" }}
        />
      </UnterseiteMain>
      <MarketingFooter crumb="Pakete" ohnePreisHinweis />
    </div>
  );
}

/* ------------------------------------------------------------------
 * Modelle: die vier Pakete als Kacheln mit 40-Fuß-Container. Die
 * Kacheln tragen die Anker #starter, #business usw. (Deep-Links aus
 * Branchen-Seiten).
 * ---------------------------------------------------------------- */
function Modelle() {
  return (
    <section id="modelle" aria-labelledby="modelle-titel" className={`${u.abschnitt} scroll-mt-24`}>
      <div className="inhalt">
        <div className={u.abschnittKopf}>
          <p className={u.eyebrow}>Ladeliste · vier Container</p>
          <h2 id="modelle-titel" data-reveal="rise" className={u.zweiton}>
            <Steigend text="Was in den vier Paketen steckt" />
          </h2>
          <p className={u.abschnittUnter}>
            Jeder Container trägt seinen Festpreis als Nummer. Was Ihr Betrieb nicht braucht, laden wir nicht mit.
          </p>
        </div>
        <PaketKacheln idPrefix="" />
        <p className={`${a.mono} mt-5`}>{PREIS_HINWEIS}</p>
      </div>
    </section>
  );
}
/* ------------------------------------------------------------------
 * Vergleich. Ab 834 px eine Apple-Vergleichstabelle mit klebendem
 * Glas-Kopf (Produktbild, Name, Preis, Anfragen) und Gruppenzeilen;
 * darunter zwei Auswahlen (vergleich-mobil.tsx). Kein Vorfahr der
 * Tabelle darf overflow setzen, sonst klebt der Kopf nicht.
 * ---------------------------------------------------------------- */
function Vergleich() {
  return (
    <section id="vergleich" aria-labelledby="vergleich-titel" className={`${u.abschnitt} scroll-mt-24`}>
      <div className="inhalt">
        <div className={u.abschnittKopf}>
          <p className={u.eyebrow}>Frachtliste · Positionen</p>
          <h2 id="vergleich-titel" data-reveal="rise" className={u.zweiton}>
            <Steigend text="Die vier Pakete nebeneinander" />
          </h2>
          <p className={u.abschnittUnter}>
            Meistens empfehlen wir Business. Wenn Starter reicht, sagen wir Ihnen das auch.
          </p>
        </div>

        {/* Tabelle ab 834 px */}
        <div className="hidden min-[834px]:block">
          <table className="vergleich-tabelle kante-stark">
            <caption className="sr-only">Pakete im Vergleich: Preise und Leistungen</caption>
            <colgroup>
              <col className="w-[18%]" />
              <col />
              <col />
              <col />
              <col />
            </colgroup>
            <thead>
              <tr>
                <td className="text-left">
                  <span className="sr-only">Paket</span>
                </td>
                {PAKETE.map((p) => (
                  <th key={p.slug} id={`vergleich-${p.slug}`} scope="col" className="text-center font-normal">
                    {p.highlight ? (
                      <span className="text-gold-ink mt-2 block h-4 font-mono text-[10.5px] leading-4 font-medium tracking-[0.14em] uppercase">
                        Empfehlung
                      </span>
                    ) : (
                      <span className="mt-2 block h-4" aria-hidden="true" />
                    )}
                    <Link
                      href={`/pakete/${p.slug}`}
                      className="relative mt-1 block text-[17px] leading-[1.24] font-semibold tracking-[-0.022em] after:absolute after:inset-x-0 after:-inset-y-3 hover:underline"
                    >
                      {p.name}
                    </Link>
                    <span className="text-muted-foreground mt-0.5 block text-[14px]">{p.setup}</span>
                    <Link
                      href={`/anfrage?paket=${p.slug}`}
                      aria-describedby={`vergleich-${p.slug}`}
                      className="btn-line btn-klein mt-3"
                    >
                      Anfragen
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            {GRUPPEN.map((g, gi) => (
              <tbody key={g.titel}>
                <tr className="gruppe">
                  <th colSpan={5} scope="rowgroup">
                    <span aria-hidden="true" className="mr-3 font-mono text-[12px] font-medium text-[#565b5d]">
                      {gi + 1}
                    </span>
                    {g.titel}
                  </th>
                </tr>
                {g.zeilen.map((z, zi) => (
                  <tr key={z.label}>
                    <th scope="row">
                      <span aria-hidden="true" className="mr-2 inline-block w-8 font-mono text-[12px] font-normal text-[#565b5d] tabular-nums">
                        {gi + 1}.{zi + 1}
                      </span>
                      {z.label}
                    </th>
                    {PAKETE.map((p) => (
                      <td key={p.slug}>
                        <VergleichZelle zeile={z} slug={p.slug} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
            <tfoot>
              <tr>
                <td className="text-left">
                  <span className={`${a.mono} block text-left`}>Preise inkl. 19&nbsp;% MwSt.</span>
                  <span className={`${a.mono} mt-2 block text-left`}>Dauer jeweils ab vollständigen Unterlagen.</span>
                </td>
                {PAKETE.map((p) => (
                  <td key={p.slug}>
                    <Link
                      href={`/anfrage?paket=${p.slug}`}
                      className={`${p.highlight ? "btn-signal" : "btn-line"} btn-mittel`}
                    >
                      {p.name} anfragen
                    </Link>
                    <div className="mt-1">
                      <MehrLink href={`/pakete/${p.slug}`} groesse="klein">
                        Alles zu {p.name}
                      </MehrLink>
                    </div>
                  </td>
                ))}
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Mobil: zwei Auswahlen nebeneinander */}
        <div className="min-[834px]:hidden">
          <VergleichMobil pakete={SPALTEN} gruppen={GRUPPEN} />
          <p className={`${a.mono} mt-6`}>Preise inkl. 19&nbsp;% MwSt. Dauer jeweils ab vollständigen Unterlagen.</p>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------
 * Monatsbeitrag: auf Teer, links die Beiträge je Paket als Verzeichnis,
 * rechts was jeden Monat dazugehört. Änderungswünsche über das
 * Formular oder das Telefon.
 * ---------------------------------------------------------------- */
const MONAT_LEISTUNGEN = [
  { t: "Hosting in der EU", s: "Ihre Seite liegt auf einem Server in der EU." },
  { t: "Sicherheit", s: "Das SSL-Zertifikat verlängert sich von selbst, Sicherheits-Updates spielen wir ein." },
  { t: "Sicherungen", s: "Gesichert wird jeden Tag, die Backups reichen 30 Tage zurück." },
  {
    t: "Kleine Änderungen",
    s: "Neue Öffnungszeiten, ein anderes Foto, ein neuer Name im Team. Sie schreiben uns kurz über das Formular oder rufen an.",
  },
  { t: "Domain und E-Mail", s: "Richten wir auf Wunsch mit ein. Größere Erweiterungen beziffern wir vorher." },
];

function Monatsbeitrag() {
  return (
    <Abschnitt
      id="monatsbeitrag"
      dunkel
      eyebrow="Liegegeld · jeden Monat"
      fett="Was der Monatsbeitrag abdeckt"
      unter="Der Vertrag läuft mindestens sechs Monate und ist danach monatlich kündbar."
    >
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <p className={a.lvKopf}>
            <span>Beitrag je Paket</span>
            <span>Änderungen</span>
          </p>
          <ol className={a.lvListe}>
            {PAKETE.map((p, i) => (
              <li key={p.slug} className={a.lvZeile}>
                <span className={a.lvNr}>4.{i + 1}</span>
                <span>
                  <span className={a.lvTitel}>{p.name}</span>
                  <span className={a.lvSatz}>ab {betrag(p.monthly)} im Monat</span>
                </span>
                <span className={a.lvWert}>{AENDERUNGEN[p.slug]}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="lg:col-span-7">
          <p className={a.lvKopf}>
            <span>Immer dabei</span>
            <span>alle Pakete</span>
          </p>
          <ul role="list" className={a.lvListe}>
            {MONAT_LEISTUNGEN.map((l) => (
              <li key={l.t} className={a.lvZeile}>
                <span className={a.lvNr} aria-hidden="true">
                  ☑
                </span>
                <span>
                  <span className={a.lvTitel}>{l.t}</span>
                  <span className={a.lvSatz}>{l.s}</span>
                </span>
                <span />
              </li>
            ))}
          </ul>
          <div className={a.lvFuss}>
            <span>Server in der EU · Backups 30 Tage</span>
            <MehrLink href="/wartung" frei={false} className="link-pfeil-dunkel font-sans text-[15px] text-[#f3f2ee]">
              Mehr zu Wartung und Pflege
            </MehrLink>
          </div>
        </div>
      </div>
    </Abschnitt>
  );
}

/** Kleine Änderungen im Monat je Paket, wie in der Vergleichstabelle. */
const AENDERUNGEN: Record<Slug, string> = {
  starter: "bis zu 1",
  business: "bis zu 3",
  premium: "bis zu 6",
  studio: "bis zu 10",
};

/* ------------------------------------------------------------------
 * Weiterlesen: drei Werkzeuge als nummerierte Liste, dazu eine leise
 * Notiz aus dem Büro (Text-Moment ohne Karte und Knopf).
 * ---------------------------------------------------------------- */
const WERKZEUGE = [
  { href: "/empfehlung", titel: "Welches Paket passt?", satz: "Fünf Fragen, danach schlagen wir ein Paket vor." },
  { href: "/honorar", titel: "So kommen die Preise zustande", satz: "Stundensatz und Stunden je Paket, offen vorgerechnet." },
  { href: "/rechner", titel: "Kosten über drei Jahre", satz: "Neben Wix, Squarespace und Jimdo gerechnet." },
];

function Weiterlesen() {
  return (
    <section id="weiterlesen" aria-labelledby="weiterlesen-titel" className={`${u.abschnitt} scroll-mt-24`}>
      <div className="inhalt grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:col-span-5">
          <p className={u.eyebrow}>Kontor · noch unsicher</p>
          <h2 id="weiterlesen-titel" data-reveal="rise" className={`${u.zweiton} mt-4`}>
            <Steigend text="Wenn Sie noch abwägen" />
          </h2>
          <blockquote className="mt-8 border-l-2 border-[var(--gold)] pl-4">
            <p className="text-[17px] leading-[1.55] text-pretty">
              „Die Frage nach dem richtigen Paket klären wir lieber am Telefon als mit einer Tabelle. Oft reicht weniger,
              als man denkt.“
            </p>
            <footer className={`${a.mono} mt-3`}>Notiz aus dem Büro · Hamburg</footer>
          </blockquote>
        </div>
        <div className="lg:col-span-7">
          <p className={a.lvKopf}>
            <span>5 · Werkzeuge</span>
            <span>kostenlos</span>
          </p>
          <ol className={a.lvListe}>
            {WERKZEUGE.map((w, i) => (
              <li key={w.href}>
                <Link href={w.href} className={a.lvZeile}>
                  <span className={a.lvNr}>5.{i + 1}</span>
                  <span>
                    <span className={a.lvTitel}>{w.titel}</span>
                    <span className={a.lvSatz}>{w.satz}</span>
                  </span>
                  <span className={a.lvPfeil} aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ol>
          <p className={a.lvFuss}>
            <span>Gezählt wird wie im Handwerk.</span>
          </p>
        </div>
      </div>
    </section>
  );
}
