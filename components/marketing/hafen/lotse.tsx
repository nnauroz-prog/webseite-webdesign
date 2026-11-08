import { getPaketBySlug } from "@/lib/pakete-data";

import s from "./lotse.module.css";

/**
 * „Was Sie tun, was wir tun“ im Bild des Hamburger Hafenlotsen: Der
 * Lotse bringt das Schiff an den Liegeplatz, das Kommando behält der
 * Kapitän. Zwei große Kacheln: links weiß der kurze Teil des Kunden
 * (leere Kästchen), rechts schwarz unser Teil (gefüllte Kästchen). Was die Leistungen
 * im Einzelnen enthalten, steht schon im Containerstapel darüber; hier
 * steht nur dort ein Satz, wo er etwas Neues sagt.
 *
 * Inhalte nur aus den Paketen (lib/pakete-data.ts), /ablauf und /faq.
 * Server-Komponente.
 */

const SIE = [
  {
    title: "Eine Viertelstunde telefonieren",
    text: "Sie erzählen, was Ihr Betrieb macht und für wen.",
  },
  {
    title: "Logo und Fotos schicken",
    text: "Das Logo in jedem Format, dazu ein paar Bilder vom Betrieb. Handyfotos reichen.",
  },
  {
    title: "Stichpunkte notieren",
    text: "Leistungen, Öffnungszeiten, Kontakt. Ganze Sätze sind nicht nötig, die schreiben wir.",
  },
  {
    title: "Test-Link ansehen",
    text: "In Ruhe am Handy und am Rechner. Wünsche schicken Sie gesammelt, eine Korrekturrunde ist im Preis.",
  },
  {
    title: "Freigeben",
    text: "Online geht die Seite erst, wenn Sie zugestimmt haben.",
  },
];

/** „ab 59 € / Monat" → „Ab 59 €" */
const STARTER_MONATLICH = (getPaketBySlug("starter")?.monthly ?? "ab 59\u00A0€ / Monat")
  .replace(/\s*\/\s*Monat$/, "")
  .replace(/^ab/, "Ab");

/** Tag nur, wo es vom Normalfall „in jedem Paket“ abweicht. */
const WIR: { title: string; tag?: string; text?: string }[] = [
  { title: "Gestaltung" },
  { title: "Texte" },
  { title: "Technik" },
  { title: "Adresse und Hosting" },
  {
    title: "Impressum und Datenschutz",
    text: "Wir legen beide Seiten an und binden den Rechtstext ein. Den Text selbst liefern Sie, etwa aus einem Generator, von Ihrem Verband oder vom Anwalt.",
  },
  {
    title: "Google-Grundlagen",
    tag: "Ab Business",
    text: "Titel und Beschreibung für jede Seite, Sitemap und strukturierte Daten.",
  },
  { title: "Pflege nach dem Start", tag: `${STARTER_MONATLICH} im Monat` },
];

export function Lotse() {
  return (
    <div className="inhalt">
      <div className="abschnitt-kopf">
        <p className="t-eyebrow">Zusammenarbeit</p>
        <h2 data-auftritt="titel" className="t-abschnitt mt-2">
          Was Sie tun, was wir tun
        </h2>
        <p className="t-unter">
          Im Hamburger Hafen bringt der Lotse das Schiff an den Liegeplatz, das Kommando behält der Kapitän.
        </p>
        {/* Erklärung zur Aufteilung direkt über den beiden Kacheln. */}
        <p className="text-muted-foreground mx-auto mt-5 max-w-[38em] text-[17px] leading-[1.47]">
          So teilen wir die Arbeit an Ihrer Website: Sie entscheiden, wir übernehmen den Rest.
        </p>
      </div>

      <div className={s.split}>
        <div data-auftritt="" className={`karte karte-weiss ${s.col}`}>
          <div className={s.colHead}>
            <h3 className="t-karte">Ihr Teil</h3>
            <span className={s.colNote}>Kurz und planbar</span>
          </div>
          <ul className={s.list}>
            {SIE.map((item) => (
              <li key={item.title} className={s.item}>
                <span className={`${s.box} ${s.boxOpen}`} aria-hidden="true" />
                <div className="min-w-0">
                  <p className={s.itemTitle}>{item.title}</p>
                  <p className={s.itemText}>{item.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div data-auftritt="" className={`karte karte-schwarz ${s.col} ${s.colWir}`}>
          <div className={s.colHead}>
            <h3 className="t-karte">Unser Teil</h3>
            <span className={s.colNote}>In jedem Paket, wo nicht anders vermerkt</span>
          </div>
          <ul className={`${s.list} ${s.listWir}`}>
            {WIR.map((item) => (
              <li key={item.title} className={s.item}>
                <span className={`${s.box} ${s.boxDone}`} aria-hidden="true" />
                <div className="min-w-0">
                  <p className={s.itemTitle}>
                    {item.title}
                    {item.tag ? <span className={s.tag}>{item.tag}</span> : null}
                  </p>
                  {item.text ? <p className={s.itemText}>{item.text}</p> : null}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={s.foot}>
        <span>Ihr Teil beginnt mit einem Anruf.</span>
        <a href="tel:+491607621876" className={s.phone}>
          0160&nbsp;7621876
        </a>
      </div>
    </div>
  );
}
