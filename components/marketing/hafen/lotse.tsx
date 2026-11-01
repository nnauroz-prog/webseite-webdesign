import s from "./lotse.module.css";

/**
 * „Was Sie tun, was wir tun“ im Bild des Hamburger Hafenlotsen: Der
 * Lotse bringt das Schiff an den Liegeplatz, das Kommando behält der
 * Kapitän. Links der kurze Teil des Kunden (leere Kästchen), rechts
 * unser Teil (gefüllte Kästchen) als knappe Liste. Was die Leistungen
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
  { title: "Pflege nach dem Start", tag: "Ab 49 € im Monat" },
];

/** Signalflagge H des Internationalen Signalbuchs: „Ich habe einen Lotsen an Bord.“ */
function FlaggeH() {
  return (
    <svg viewBox="0 0 30 20" className={s.flag} aria-hidden="true">
      <rect x="0.5" y="0.5" width="14.5" height="19" fill="#fafaf8" />
      <rect x="15" y="0.5" width="14.5" height="19" fill="var(--ink-olive)" />
      <rect x="0.5" y="0.5" width="29" height="19" fill="none" stroke="var(--foreground)" strokeWidth="1" />
    </svg>
  );
}

export function Lotse() {
  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
      <div className="grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-8">
        <div className="lg:col-span-6">
          <p className="label-mono text-muted-foreground flex items-center gap-3">
            <FlaggeH />
            Flagge H · Lotse an Bord
          </p>
          <h2
            data-reveal="rise"
            className="mt-5 text-balance text-[2.4rem] leading-[0.98] tracking-[-0.034em] sm:text-6xl lg:text-[3.6rem]"
          >
            Was Sie tun, was wir tun
          </h2>
        </div>
        <p
          data-reveal="fade"
          className="text-muted-foreground max-w-xl text-[16.5px] leading-relaxed lg:col-span-5 lg:col-start-8"
        >
          Im Hamburger Hafen bringt der Lotse das Schiff an den Liegeplatz, das Kommando behält der Kapitän. So teilen
          wir die Arbeit an Ihrer Website: Sie entscheiden, wir übernehmen den Rest.
        </p>
      </div>

      <div className={s.split}>
        <div className={s.col}>
          <div className={s.colHead}>
            <h3 className="text-[1.5rem] tracking-[-0.02em]">Ihr Teil</h3>
            <span className="label-mono text-muted-foreground">Kurz und planbar</span>
          </div>
          <ul data-reveal="stagger" className={s.list}>
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

        <div className={s.col}>
          <div className={s.colHead}>
            <h3 className="text-[1.5rem] tracking-[-0.02em]">Unser Teil</h3>
            <span className="label-mono text-muted-foreground">In jedem Paket, wo nicht anders vermerkt</span>
          </div>
          <ul data-reveal="stagger" className={`${s.list} ${s.listWir}`}>
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
          0160 7621876
        </a>
      </div>
    </div>
  );
}
