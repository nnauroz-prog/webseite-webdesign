/**
 * Journal-Datenmodell für /journal und /journal/[slug].
 *
 * Jeder Beitrag ist ein kurzer Text mit einer klaren Aussage: was wir
 * beobachten, wie wir arbeiten, was Inhaber daraus machen können.
 * Keine erfundenen Kunden, keine unbelegten Zahlen, keine Statistiken.
 * Preise und Leistungen kommen aus lib/pakete-data.ts.
 *
 * Form pro Beitrag: drei bis fünf Zwischenüberschriften und ein
 * Schluss-Zitat.
 *
 * Reihenfolge im Array bestimmt Reihenfolge auf /journal — neuester
 * Post nach oben.
 */

import { PAKETE, getPaketBySlug } from "@/lib/pakete-data";

/** „Starter ab 599 €, Business ab 999 €, …“ für Fließtext. */
const PREISE_SATZ = PAKETE.map((p) => `${p.name.replace(/^Sitalo\s+/, "")} ${p.setup}`).join(", ");
const preis = (slug: "starter" | "business" | "premium" | "studio") => getPaketBySlug(slug)?.setup ?? "";
/** Monatsbeitrag ohne „/ Monat“, etwa „ab 59 €“. */
const monatsbeitrag = (slug: "starter" | "business" | "premium" | "studio") =>
  getPaketBySlug(slug)?.monthly.replace(/\s*\/\s*Monat$/, "") ?? "";

export type Paragraph =
  | { kind: "p"; text: string }
  | { kind: "h2"; text: string }
  | { kind: "quote"; text: string }
  | { kind: "li"; text: string };

export type JournalPost = {
  slug: string;
  title: string;
  /** Titel für Google und Browser-Tab: mit dem Suchbegriff, den Leser
   *  eintippen. Die Überschrift auf der Seite (title) bleibt. */
  seoTitle?: string;
  /** Untertitel als Dek — eine Zeile Kontext. */
  dek: string;
  /** Beschreibung für Google, wenn der Dek dafür zu kurz ist (120–158 Zeichen). */
  seoDescription?: string;
  /** ISO-Datum, yyyy-mm-dd, Veröffentlichung. */
  publishedAt: string;
  /** Geschätzte Lesezeit in Minuten — manuell gepflegt. */
  readingMinutes: number;
  /** Tag-Slugs für spätere Filter; aktuell rein deskriptiv. */
  tags: string[];
  /** Hauptinhalt als geordnetes Array von Absätzen. */
  body: Paragraph[];
};

const POSTS: JournalPost[] = [
  // Quellen (geprüft, nicht im Text):
  // - https://support.google.com/business/answer/2911778?hl=de
  // - https://support.google.com/business/answer/13763036?hl=de
  // - https://support.google.com/business/answer/3039617?hl=de
  // - https://support.google.com/business/answer/7107242?hl=de
  // - https://support.google.com/business/answer/14271705?hl=de
  // - https://support.google.com/business/answer/7249669?hl=de
  // - https://support.google.com/business/answer/2853879?hl=de
  // - https://support.google.com/business/answer/9157481?hl=de
  // - https://support.google.com/business/answer/3038177?hl=de
  // - https://support.google.com/business/answer/12756178?hl=de
  // - https://support.google.com/business/answer/6303076?hl=de
  // - https://support.google.com/business/answer/13682007?hl=de
  // - https://support.google.com/business/answer/9455399?hl=de
  // - https://support.google.com/business/answer/6123536?hl=de
  // - https://support.google.com/business/answer/7342169?hl=de
  // - https://support.google.com/business/answer/16816815?hl=de
  // - https://support.google.com/contributionpolicy/answer/7400114?hl=de
  // - https://support.google.com/business/answer/3474050?hl=de
  // - https://support.google.com/business/answer/7091?hl=de
  // - https://www.gesetze-im-internet.de/uwg_2004/anhang.html
  {
    slug: "google-unternehmensprofil-einrichten",
    seoTitle: "Google-Unternehmensprofil einrichten: Anleitung",
    title: "Das Google-Profil, Schritt für Schritt",
    dek: "Wie Sie das kostenlose Profil anlegen oder übernehmen, wie die Bestätigung abläuft und welche Angaben für Google Maps und die lokale Suche hineingehören.",
    seoDescription: "Google-Unternehmensprofil einrichten: kostenlos anlegen oder übernehmen, bestätigen und richtig ausfüllen, damit Sie bei Google Maps gefunden werden.",
    publishedAt: "2026-11-07",
    readingMinutes: 6,
    tags: ["Google Maps", "Gefunden werden", "Anleitung"],
    body: [
      {
        kind: "p",
        text: "Ein Google-Unternehmensprofil legen Sie kostenlos unter business.google.com/add an, oder Sie übernehmen den Eintrag, den Google vielleicht schon für Ihren Betrieb angelegt hat. Ein neu angelegtes Profil erscheint erst in der Suche und bei Google Maps, wenn Sie es als Inhaber bestätigt haben. Einen vorhandenen Eintrag verwalten Sie erst nach der Bestätigung selbst. Gefunden werden Sie vor allem mit einem vollständigen Profil: richtiger Name, passende Kategorie, Adresse oder Einzugsgebiet, Öffnungszeiten, Fotos und echte Bewertungen.",
      },
      {
        kind: "p",
        text: "Für alles brauchen Sie ein Google-Konto. Die frühere App „Google My Business“ gibt es nicht mehr. Ihr Profil verwalten Sie heute direkt in der Google-Suche oder in der Google-Maps-App, angemeldet mit dem Konto, das mit dem Profil verknüpft ist. Die Schritte und Grenzwerte unten stammen aus der Google-Hilfe. Menünamen ändert Google gelegentlich, die Beschriftungen können bei Ihnen also leicht anders lauten.",
      },
      {
        kind: "h2",
        text: "Profil anlegen oder übernehmen",
      },
      {
        kind: "p",
        text: "Ein Profil bekommen Betriebe, die persönlichen Kontakt zu ihren Kunden haben: entweder an einem festen Ort wie Praxis, Café, Kanzlei oder Friseursalon, oder beim Kunden vor Ort wie ein Handwerksbetrieb oder ein ambulanter Pflegedienst. Reine Online-Unternehmen ohne solchen Kontakt bekommen kein Profil. Pro Standort gibt es in der Regel ein Profil. Ausnahmen sieht Google zum Beispiel für einzelne Ärztinnen, Ärzte oder Anwälte in einer Praxis oder Kanzlei vor.",
      },
      {
        kind: "p",
        text: "Suchen Sie zuerst bei Google Maps nach Ihrem Betrieb. Oft hat Google schon einen Eintrag angelegt, der niemandem gehört. Dann übernehmen Sie diesen und legen kein zweites Profil an.",
      },
      {
        kind: "li",
        text: "Eintrag vorhanden: In der Google-Maps-App den Betrieb suchen, den Eintrag öffnen, „Info“ antippen und die Option zum Beanspruchen wählen, etwa „Jetzt verwalten“. Danach folgt die Bestätigung.",
      },
      {
        kind: "li",
        text: "Kein Eintrag vorhanden: business.google.com/add aufrufen, „Unternehmen zu Google hinzufügen“ wählen und den Anweisungen folgen. Das geht auch im Browser auf dem Handy. Am Ende folgt die Bestätigung.",
      },
      {
        kind: "li",
        text: "In beiden Fällen gilt: Erst nach der Bestätigung verwalten Sie das Profil selbst. Ein neues Profil wird erst dann in der Suche und bei Google Maps angezeigt.",
      },
      {
        kind: "p",
        text: "Haben Sie versehentlich zwei Profile, behalten Sie laut Google das bestätigte. Das Doppel können Sie entfernen, dabei gehen seine Inhalte und Verwalter verloren. Alternativ beantragen Sie über „Änderung vorschlagen“ in Google Maps, die Einträge zusammenzuführen. Google prüft das. Bewertungen werden zusammengelegt, Antworten darauf können verloren gehen.",
      },
      {
        kind: "h2",
        text: "Wie die Bestätigung abläuft",
      },
      {
        kind: "p",
        text: "Welche Methoden Ihnen angeboten werden, entscheidet Google. Eine bestimmte Methode beantragen können Sie nicht. Stehen mehrere zur Auswahl, nehmen Sie eine davon. Möglich sind ein Video mit dem Handy, eine Postkarte, ein Anruf, eine SMS oder eine E-Mail.",
      },
      {
        kind: "li",
        text: "Video: live mit dem Handy in der Profilverwaltung aufnehmen, kein vorher aufgezeichnetes Video, mindestens 30 Sekunden ohne Schnitt. Mit Ladengeschäft oder Praxis zeigen Sie die Umgebung mit Straßenschild und Hausnummer, ein fest angebrachtes Schild mit dem Namen aus dem Profil und den Zugang zu Räumen, die nur Mitarbeitende betreten. Ohne festen Standort zeigen Sie Merkmale an der Geschäftsadresse, Werkzeug oder Fahrzeug und Geschäftsunterlagen wie die Gewerbeanmeldung oder eine Rechnung.",
      },
      {
        kind: "li",
        text: "Nicht ins Video gehören Bankdaten, Steuer- oder Ausweisnummern und die Gesichter anderer Menschen. Die Prüfung dauert laut Google bis zu fünf Arbeitstage. Wird das Video abgelehnt, können Sie ein neues einreichen.",
      },
      {
        kind: "li",
        text: "Postkarte: Google schickt einen Code an die Geschäftsadresse, meist innerhalb von 14 Tagen. Der Code verfällt nach 30 Tagen. Solange Sie warten, ändern Sie Name, Adresse und Kategorie nicht und fordern keinen neuen Code an, sonst wird der alte ungültig.",
      },
      {
        kind: "h2",
        text: "Was ins Profil gehört",
      },
      {
        kind: "p",
        text: "Laut Google bestimmen vor allem drei Dinge die Reihenfolge in der lokalen Suche. Relevanz: wie gut Ihr Profil zur Suche passt. Entfernung: wie weit Ihr Betrieb von dem Ort entfernt ist, der in der Suche genannt wird, oder, ohne Ortsangabe, vom Standort des Suchenden. Darauf haben Sie keinen Einfluss. Bekanntheit: dazu gehören unter anderem Links von anderen Websites sowie Zahl und Durchschnitt der Bewertungen. Eine bessere Platzierung kann man weder beantragen noch kaufen. In der Hand haben Sie ein vollständiges, genaues Profil und mit der Zeit echte Bewertungen. Deshalb lohnt es sich, jedes Feld sorgfältig auszufüllen.",
      },
      {
        kind: "li",
        text: "Name: genau der Name, den Ihr Betrieb auch auf Schild, Website und Briefpapier führt. Zusätze wie Leistungen, Stadtteil, Suchbegriffe oder Slogans sind nicht erlaubt und können zur Sperrung führen. Auch in die Adresszeilen gehören keine Suchbegriffe oder Links.",
      },
      {
        kind: "li",
        text: "Kategorie: eine Hauptkategorie und bis zu neun weitere. Google rät zu so wenigen wie nötig und so konkreten wie möglich. Die Kategorie beschreibt, was Ihr Betrieb ist, nicht alles, was er anbietet. Sie ist keine Liste von Suchbegriffen.",
      },
      {
        kind: "li",
        text: "Adresse oder Einzugsgebiet: Empfangen Sie Kunden an Ihrer Adresse, zeigen Sie sie an. Kommen Sie nur zu den Kunden und empfangen niemanden an Ihrer Adresse, etwa als Handwerksbetrieb ohne Ladenlokal oder als Reinigungsfirma, blenden Sie die Adresse aus und tragen ein Einzugsgebiet ein, etwa unter Profil bearbeiten > Standort. Wer beides hat, zum Beispiel ein ambulanter Pflegedienst mit Büro für Beratungsgespräche, zeigt die Adresse und zusätzlich ein Einzugsgebiet.",
      },
      {
        kind: "li",
        text: "Einzugsgebiet: höchstens 20 Städte, Postleitzahlen oder Regionen, einen Radius gibt es nicht. In Hamburg reichen Stadtteile oder Postleitzahlen, etwa Eimsbüttel, Wandsbek und Barmbek. Als Richtwert nennt Google in der Regel nicht mehr als etwa zwei Autostunden vom Betrieb. Für das ganze Gebiet gibt es ein Profil, nicht eines je Stadtteil.",
      },
      {
        kind: "li",
        text: "Telefon und Website: eine Nummer, unter der man Sie direkt erreicht, lieber eine lokale Nummer als eine zentrale Hotline. Bis zu zwei weitere sind möglich. Nummern und Links, die weiterleiten, sind nicht erlaubt. Als Website tragen Sie Ihre eigene Seite ein, keine Seite in einem sozialen Netzwerk.",
      },
      {
        kind: "li",
        text: "Öffnungszeiten: die normalen Zeiten für Kunden, bei einem Pflegedienst etwa die festen Büro- und Telefonzeiten, und zwar dieselben wie auf Ihrer Website. Für Feiertage oder Abweichungen von bis zu sechs Tagen am Stück gibt es „Besondere Öffnungszeiten“. Google empfiehlt, Feiertagszeiten auch dann zu bestätigen, wenn sie sich nicht ändern. Ab sieben Tagen oder bei unbekannter Dauer markieren Sie den Betrieb als „Vorübergehend geschlossen“.",
      },
      {
        kind: "li",
        text: "Beschreibung: höchstens 750 Zeichen, ohne Links. Hinein gehört, was Sie anbieten, was Ihren Betrieb ausmacht und seit wann es ihn gibt. Aktionen, Preise und Rabatte gehören nach Googles Vorgaben nicht hierher.",
      },
      {
        kind: "li",
        text: "Leistungen: aus Vorschlägen zu Ihrer Kategorie wählen oder eigene anlegen, auf Wunsch mit kurzer Beschreibung und Preis. Hier sind Preise erlaubt, nur nicht im Namen der Leistung. Dort stehen auch keine Telefonnummern oder persönlichen Daten.",
      },
      {
        kind: "li",
        text: "Fotos: JPG oder PNG, zwischen 10 KB und 5 MB, am besten mindestens 720 × 720 Pixel, scharf, gut ausgeleuchtet und kaum bearbeitet. Google schlägt mindestens drei Außenansichten aus den Richtungen vor, aus denen Kunden kommen, und mindestens drei Fotos vom Team. Öffentlich sichtbar werden Fotos erst, wenn das Profil bestätigt ist.",
      },
      {
        kind: "h2",
        text: "Bewertungen: fragen ja, kaufen nein",
      },
      {
        kind: "p",
        text: "Einen Link und einen QR-Code für Bewertungen finden Sie in der Profilverwaltung, etwa unter „Rezensionen lesen“ und „Mehr Rezensionen erhalten“. Den QR-Code erstellen Sie laut Google im Browser am Computer, nicht in der Maps-App. Google schlägt vor, Link oder Code auf Quittungen, in Dankes-Mails oder als Aushang im Laden zu teilen.",
      },
      {
        kind: "p",
        text: "Erlaubt ist, Kunden neutral um eine ehrliche Bewertung zu bitten. Nach Googles Richtlinien nicht erlaubt sind gekaufte Bewertungen oder solche gegen eine Gegenleistung wie Geld, Rabatt oder eine Gratisleistung, Bewertungen über mehrere Konten, das gezielte Ansprechen nur zufriedener Kunden und Bewertungsquoten für Mitarbeitende. Bewertungen von sich selbst oder vom eigenen Team erlaubt Google ebenfalls nicht. Solche Bewertungen löscht Google, bei Verstößen kann das Profil eingeschränkt oder gesperrt werden.",
      },
      {
        kind: "p",
        text: "Auch rechtlich ist das heikel: Gefälschte Bewertungen zu schreiben oder in Auftrag zu geben, ist gegenüber Verbrauchern nach dem Gesetz gegen den unlauteren Wettbewerb unzulässig (Anhang zu §\u00A03 Abs.\u00A03 UWG, Nr.\u00A023c). Bewertungen, für die es eine nicht offengelegte Gegenleistung gab, können zudem irreführend sein (§\u00A05a UWG). Beides kann zum Beispiel von Mitbewerbern abgemahnt werden. Das ist keine Rechtsberatung.",
      },
      {
        kind: "p",
        text: "Antworten können Sie, sobald das Profil bestätigt ist. Die Antwort steht öffentlich unter der Bewertung. Google rät, kurz, persönlich und ehrlich zu antworten, ohne Werbung und ohne persönliche Daten der Person, die bewertet hat. Schwierige Fälle klären Sie besser im direkten Gespräch. Bewertungen, die gegen die Richtlinien verstoßen, können Sie melden.",
      },
      {
        kind: "h2",
        text: "Danach: das Profil aktuell halten",
      },
      {
        kind: "p",
        text: "In der Google-Maps-App ändern Sie Angaben über den Reiter „Unternehmen“ > „Profil bearbeiten“. Ändern sich Öffnungszeiten, Telefonnummer oder Leistungen, ändern Sie sie im Profil und auf der Website zugleich. Neuigkeiten, Angebote und Veranstaltungen können Sie als Beiträge veröffentlichen. Google prüft sie vorher. Beiträge ohne Zeitraum werden nach sechs Monaten archiviert, Angebote brauchen einen Titel und einen Zeitraum.",
      },
      {
        kind: "p",
        text: "Kurz gesagt: Profil anlegen oder vorhandenen Eintrag übernehmen, bestätigen, jedes Feld ehrlich und vollständig ausfüllen, um Bewertungen bitten und sie beantworten. Das kostet kein Geld, nur etwas Zeit.",
      },
      {
        kind: "p",
        text: "Wenn wir Ihre Website ab dem Business-Paket bauen, richten wir das Profil mit Ihnen ein oder bringen ein vorhandenes auf den Stand der Seite. Bestätigen müssen Sie es selbst als Inhaber.",
      },
      {
        kind: "quote",
        text: "Ein Google-Profil ist ein Aushang. Er muss stimmen.",
      },
    ],
  },
  // Quellen (geprüft, nicht im Text):
  // - https://www.gesetze-im-internet.de/ddg/__5.html
  // - https://www.gesetze-im-internet.de/ddg/__33.html
  // - https://curia.europa.eu/juris/liste.jsf?num=C-298/07
  // - https://www.handelskammer-hamburg.de/innovation-neue-maerkte/digitalisierung/impressumspflicht-6787984
  // - https://www.bzst.de/DE/Unternehmen/Identifikationsnummern/Wirtschafts-Identifikationsnummer/wirtschafts_identifikationsnummer_node.html
  // - https://www.gesetze-im-internet.de/uwg_2004/__13.html
  // - https://www.gesetze-im-internet.de/uwg_2004/__13a.html
  // - https://www.handelskammer-hamburg.de/recht-steuern/aktuelle-rechtsthemen/eu-plattform-streitbeilegung-6660656
  // - https://www.gesetze-im-internet.de/vsbg/__36.html
  // - https://www.gesetze-im-internet.de/pangv_2022/__3.html
  // - https://eur-lex.europa.eu/legal-content/DE/TXT/?uri=CELEX:32016R0679
  // - https://datenschutz-hamburg.de/
  // - https://www.gesetze-im-internet.de/ttdsg/__25.html
  // - https://www.datenschutzkonferenz-online.de/media/oh/OH_Digitale_Dienste.pdf
  // - https://www.gesetze-im-internet.de/bfsg/__1.html
  // - https://www.gesetze-im-internet.de/bfsg/__3.html
  // - https://www.gesetze-im-internet.de/bfsg/__15.html
  // - https://www.bmas.de/SharedDocs/Downloads/DE/Teilhabe/leitlinien-barrierefreiheit.pdf
  // - https://www.bundesfachstelle-barrierefreiheit.de/DE/Barrierefreiheitsstaerkungsgesetz/FAQ/faq_node
  {
    slug: "pflichtangaben-website-impressum-datenschutz",
    seoTitle: "Pflichtangaben Website 2026: Impressum, Datenschutz, BFSG",
    title: "Was auf jede Betriebs-Website gehört",
    dek: "Impressum, Datenschutzerklärung, Cookie-Einwilligung und Barrierefreiheit: was für die Website eines kleinen Betriebs Pflicht ist und was nur unter Bedingungen.",
    seoDescription: "Impressum, Datenschutzerklärung, Cookie-Banner, Barrierefreiheit: welche Pflichtangaben die Website eines Betriebs 2026 braucht und was entfallen ist.",
    publishedAt: "2026-11-07",
    readingMinutes: 8,
    tags: ["Recht", "Impressum", "Datenschutz", "Barrierefreiheit"],
    body: [
      {
        kind: "p",
        text: "Jede Website eines Betriebs in Deutschland braucht ein Impressum nach §\u00A05 DDG und eine Datenschutzerklärung nach Art.\u00A013 DSGVO. Einen Cookie-Banner braucht sie nur, wenn sie Cookies oder ähnliche Zugriffe auf das Gerät der Besucher nutzt, die nicht unbedingt erforderlich sind, und das Barrierefreiheitsstärkungsgesetz betrifft in der Regel nur Seiten, über die Verbraucher Verträge schließen, und keine Kleinstunternehmen, die Dienstleistungen anbieten.",
      },
      {
        kind: "p",
        text: "Dazu kommen ein Hinweis zur Verbraucherschlichtung, wenn Ihr Betrieb mehr als zehn Beschäftigte hat und an Privatkunden verkauft, und Endpreise, wenn Sie Privatkunden Preise nennen.",
      },
      {
        kind: "h2",
        text: "Was gehört ins Impressum?",
      },
      {
        kind: "p",
        text: "Seit dem 14. Mai 2024 steht die Impressumspflicht in §\u00A05 des Digitale-Dienste-Gesetzes (DDG), vorher in §\u00A05 TMG. Sie gilt für geschäftsmäßige, in der Regel gegen Entgelt angebotene digitale Dienste. Darunter fällt praktisch jede Website eines Betriebs, auch eine kleine, auch wenn die Seite selbst nichts kostet. Die Angaben müssen leicht erkennbar, unmittelbar erreichbar und ständig verfügbar sein; am sichersten ist ein Link „Impressum“ in der Fußzeile jeder Seite.",
      },
      {
        kind: "p",
        text: "Hinein gehören, soweit sie auf Ihren Betrieb zutreffen:",
      },
      {
        kind: "li",
        text: "Name und Anschrift. Als Einzelunternehmen nennen Sie Ihren vollständigen Vor- und Nachnamen; ein Fantasiename allein reicht nicht. Die Anschrift muss ladungsfähig sein, ein Postfach genügt nicht.",
      },
      {
        kind: "li",
        text: "Bei einer GmbH, UG oder anderen juristischen Person zusätzlich die Rechtsform und die vertretungsberechtigten Personen, etwa die Geschäftsführung.",
      },
      {
        kind: "li",
        text: "Eine E-Mail-Adresse und ein zweiter schneller Kontaktweg, in der Praxis meist eine Telefonnummer.",
      },
      {
        kind: "li",
        text: "Handels-, Vereins-, Partnerschafts- oder Genossenschaftsregister mit Registernummer, wenn Sie dort eingetragen sind, zum Beispiel als eingetragener Kaufmann (e. K.) oder GmbH.",
      },
      {
        kind: "li",
        text: "Die Umsatzsteuer-Identifikationsnummer, falls Sie eine haben. Haben Sie stattdessen eine Wirtschafts-Identifikationsnummer, die das Bundeszentralamt für Steuern seit November 2024 schrittweise vergibt, gehört diese hinein. Die normale Steuernummer gehört nicht ins Impressum.",
      },
      {
        kind: "li",
        text: "Bei Tätigkeiten, die eine behördliche Zulassung brauchen, die zuständige Aufsichtsbehörde.",
      },
      {
        kind: "li",
        text: "Bei reglementierten Berufen wie Ärzten, Anwälten oder Meistern in zulassungspflichtigen Handwerken zusätzliche Angaben zu Kammer und Berufsrecht (dazu gleich mehr).",
      },
      {
        kind: "p",
        text: "Viele Handwerksbetriebe nennen auch ihre Eintragung in die Handwerksrolle. Das ist üblich, aber keine eigene Pflicht nach §\u00A05 DDG.",
      },
      {
        kind: "p",
        text: "Wer auf der Website journalistisch-redaktionell gestaltete Inhalte veröffentlicht, nennt zusätzlich eine verantwortliche Person mit Name und Anschrift (§\u00A018 Abs.\u00A02 Medienstaatsvertrag). Ob ein Ratgeber oder Blog eines Betriebs darunter fällt, ist umstritten; viele nennen die Person vorsorglich. Für eine reine Visitenkarten-Website ist das in der Regel nicht nötig.",
      },
      {
        kind: "p",
        text: "Für Praxen, Kanzleien und Meisterbetriebe gilt mehr: Ärzte und Zahnärzte, Rechtsanwälte und Steuerberater sowie Meister in zulassungspflichtigen Handwerken üben reglementierte Berufe aus. Sie nennen die Kammer, etwa Ärztekammer, Rechtsanwaltskammer oder Handwerkskammer, die gesetzliche Berufsbezeichnung mit dem Staat der Verleihung, zum Beispiel „Zahnarzt, verliehen in Deutschland“, und die geltenden berufsrechtlichen Regeln wie Berufsordnung, Bundesrechtsanwaltsordnung oder Handwerksordnung mit einem Hinweis, wo man sie nachlesen kann, am besten als Link. Ihre Kammer stellt in der Regel ein Muster zur Verfügung.",
      },
      {
        kind: "p",
        text: "Ein Hinweis fällt weg: Die EU-Plattform zur Online-Streitbeilegung wurde zum 20. Juli 2025 eingestellt, die zugrunde liegende Verordnung durch die Verordnung (EU) 2024/3228 aufgehoben. Der Pflichtlink entfällt. Entfernen Sie ihn aus Impressum, AGB, E-Mail-Signatur und Profilen auf Shop- oder Marktplatzseiten; ein Verweis auf eine Plattform, die es nicht mehr gibt, kann irreführen.",
      },
      {
        kind: "p",
        text: "Bestehen bleibt der Hinweis zur Verbraucherschlichtung nach §\u00A036 Verbraucherstreitbeilegungsgesetz (VSBG). Wer mit Verbrauchern Geschäfte macht und eine Website hat oder AGB verwendet, gibt an, ob er bereit oder verpflichtet ist, an einem Verfahren vor einer Verbraucherschlichtungsstelle teilzunehmen. Ausgenommen von dieser Angabe ist, wer am 31. Dezember des Vorjahres zehn oder weniger Personen beschäftigt hat; gezählt werden Personen, nicht Vollzeitstellen. Wer sich einer Schlichtungsstelle angeschlossen hat oder gesetzlich zur Teilnahme verpflichtet ist, nennt diese Stelle aber unabhängig von der Größe des Betriebs. Kleinere Betriebe können freiwillig schreiben, wenn es zutrifft: „Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.“ Ob für Ihren Beruf eine eigene Schlichtungsstelle zuständig ist, kann Ihnen Ihre Kammer sagen.",
      },
      {
        kind: "p",
        text: "Nicht ins Impressum, aber ebenfalls Pflicht: Nennen Sie Privatkunden Preise, etwa für einen Haarschnitt oder eine Leistung im Handwerk, geben Sie nach §\u00A03 Preisangabenverordnung den Gesamtpreis einschließlich Umsatzsteuer an.",
      },
      {
        kind: "p",
        text: "Fehlt das Impressum oder ist es falsch, ist das eine Ordnungswidrigkeit nach §\u00A033 DDG; die Geldbuße kann bis zu 50.000 Euro betragen (Obergrenze, kein Regelbetrag). Außerdem kann abgemahnt werden. Mitbewerber können dafür seit Dezember 2020 keinen Ersatz ihrer Abmahnkosten mehr verlangen (§\u00A013 Abs.\u00A04 UWG). Bei einem ersten Verstoß können sie von Betrieben mit in der Regel weniger als 100 Mitarbeitern auch keine Vertragsstrafe verlangen (§\u00A013a Abs.\u00A02 UWG). Eine Unterlassungserklärung können sie trotzdem fordern. Verbände wie Wettbewerbs- oder Verbraucherverbände sind von diesen Einschränkungen nicht erfasst. Kein Grund zur Sorge, aber ein Grund, das Impressum einmal sorgfältig anzulegen.",
      },
      {
        kind: "h2",
        text: "Was muss in die Datenschutzerklärung?",
      },
      {
        kind: "p",
        text: "Fast jede Website verarbeitet personenbezogene Daten, schon über die Server-Protokolle mit der IP-Adresse, dazu über Kontaktformular, Terminbuchung oder eingebettete Karten. Nach Art.\u00A013 DSGVO informieren Sie darüber:",
      },
      {
        kind: "li",
        text: "wer verantwortlich ist, mit Kontaktdaten, gegebenenfalls auch der Datenschutzbeauftragte,",
      },
      {
        kind: "li",
        text: "zu welchem Zweck und auf welcher Rechtsgrundlage Daten verarbeitet werden, bei berechtigtem Interesse auch, worin dieses Interesse besteht,",
      },
      {
        kind: "li",
        text: "wer die Daten erhält, etwa der Hosting-Anbieter, und ob sie in Länder außerhalb der EU gehen und auf welcher Grundlage,",
      },
      {
        kind: "li",
        text: "wie lange Daten gespeichert werden oder nach welchen Kriterien sich das richtet,",
      },
      {
        kind: "li",
        text: "welche Rechte Besucher haben: Auskunft, Berichtigung, Löschung, Einschränkung, Widerspruch, Datenübertragbarkeit und der Widerruf einer Einwilligung,",
      },
      {
        kind: "li",
        text: "dass man sich bei einer Aufsichtsbehörde beschweren kann. Für Betriebe in Hamburg ist das der Hamburgische Beauftragte für Datenschutz und Informationsfreiheit.",
      },
      {
        kind: "p",
        text: "Die Erklärung muss präzise, verständlich und leicht zugänglich sein (Art.\u00A012 DSGVO), am besten ebenfalls in der Fußzeile verlinkt. Ein Muster passt nur, wenn seine Dienste mit denen Ihrer Seite übereinstimmen.",
      },
      {
        kind: "h2",
        text: "Brauche ich einen Cookie-Banner?",
      },
      {
        kind: "p",
        text: "Nur wenn Ihre Seite etwas auf dem Gerät der Besucher speichert oder von dort ausliest, das nicht unbedingt erforderlich ist. So regelt es §\u00A025 des Telekommunikation-Digitale-Dienste-Datenschutz-Gesetzes (TDDDG), das bis Mai 2024 TTDSG hieß. Keine Einwilligung brauchen Sie für das, was für einen ausdrücklich gewünschten Dienst nötig ist, etwa einen Warenkorb, das Speichern der Cookie-Entscheidung selbst oder Sicherheitsfunktionen.",
      },
      {
        kind: "p",
        text: "Die Aufsichtsbehörden legen die Ausnahme eng aus. Analyse, Reichweitenmessung und Marketing gehören in der Regel nicht dazu. Google Analytics, das Meta-Pixel und Werbe-Cookies brauchen deshalb eine Einwilligung, bevor sie geladen oder gesetzt werden. Auch das Auslesen von Geräteeigenschaften per JavaScript zählt nach Auffassung der Aufsichtsbehörden als Zugriff.",
      },
      {
        kind: "p",
        text: "Eingebettete Inhalte wie Google Maps, YouTube-Videos oder extern geladene Schriften übertragen beim Laden Daten an Dritte. Verbreitet ist die Zwei-Klick-Lösung: Karte oder Video laden erst nach einem Klick. Schriften liegen am besten auf dem eigenen Server, dann geht beim Laden nichts an Dritte. Eine Seite ohne Tracking und ohne Werbe-Cookies, mit eigenen Schriften und Klick-Lösungen für Karten und Videos, kommt in der Regel ohne Cookie-Banner aus. Das gilt nach verbreiteter Einschätzung auch für eine Statistik, die nichts auf dem Gerät speichert oder ausliest und nur zusammengefasste Zahlen erhebt; ob ein Werkzeug darunter fällt, hängt von seiner Einstellung ab. In die Datenschutzerklärung gehört die Statistik in jedem Fall.",
      },
      {
        kind: "h2",
        text: "Betrifft mich das Barrierefreiheits\u00ADstärkungsgesetz?",
      },
      {
        kind: "p",
        text: "Das Barrierefreiheitsstärkungsgesetz (BFSG) gilt seit dem 28. Juni 2025 für bestimmte Produkte und Dienstleistungen für Verbraucher. Für Websites wichtig sind die „Dienstleistungen im elektronischen Geschäftsverkehr“: Angebote, bei denen ein Verbraucher über die Website oder App einen Vertrag abschließt. Praktisch heißt das Onlineshop, Online-Bestellung oder Buchung mit Vertragsschluss; nach den (nicht verbindlichen) Leitlinien des Bundesarbeitsministeriums kann auch eine Online-Terminbuchung darunter fallen. Das letzte Wort haben die Gerichte.",
      },
      {
        kind: "p",
        text: "Für eine reine Informationsseite mit Leistungen, Öffnungszeiten und Kontaktformular greift das BFSG in der Regel nicht. Ist Ihr Betrieb ein Kleinstunternehmen, also mit weniger als zehn Beschäftigten und höchstens 2 Millionen Euro Jahresumsatz oder Jahresbilanzsumme, sind Sie als Dienstleister ohnehin ausgenommen (§\u00A03 Abs.\u00A03 BFSG). Für Produkte, die das Gesetz erfasst, etwa Computer oder Smartphones, gilt diese Ausnahme nicht: Wer sie herstellt, einführt oder verkauft, muss die Anforderungen an das Produkt auch als Kleinstunternehmen erfüllen.",
      },
      {
        kind: "p",
        text: "Wer größer ist als ein Kleinstunternehmen und online verkauft oder verbindlich buchen lässt, sollte das prüfen lassen. Auch Kleinstunternehmen, die freiwillig barrierefrei werden wollen oder unsicher sind, ob sie betroffen sind, berät die Bundesfachstelle Barrierefreiheit kostenlos (§\u00A015 BFSG). Eine gut lesbare Seite mit klaren Kontrasten lohnt sich trotzdem.",
      },
      {
        kind: "h2",
        text: "Ihre Website in fünf Schritten prüfen",
      },
      {
        kind: "li",
        text: "Sind Impressum und Datenschutzerklärung von jeder Seite aus verlinkt, etwa in der Fußzeile?",
      },
      {
        kind: "li",
        text: "Stehen im Impressum alle Angaben, die auf Ihren Betrieb zutreffen, darunter E-Mail-Adresse und ein zweiter schneller Kontaktweg? Die Steuernummer und der Link zur EU-Streitbeilegungsplattform gehören nicht hinein.",
      },
      {
        kind: "li",
        text: "Steht jeder Dienst Ihrer Seite in der Datenschutzerklärung, von Hosting und Formular bis Karte, Schriften und Statistik?",
      },
      {
        kind: "li",
        text: "Werden Tracking und Werbe-Cookies erst nach einer Einwilligung geladen oder gesetzt, laden Karten und Videos erst nach einem Klick, und liegen die Schriften auf Ihrem eigenen Server?",
      },
      {
        kind: "li",
        text: "Mehr als zehn Beschäftigte und Privatkunden? Dann gehört der Schlichtungshinweis auf die Seite; eine Schlichtungsstelle, der Sie angeschlossen sind, nennen Sie in jedem Fall. Wer online verkauft oder verbindlich buchen lässt und kein Kleinstunternehmen ist, lässt das BFSG prüfen.",
      },
      {
        kind: "p",
        text: "Impressum und Datenschutzerklärung braucht praktisch jede Betriebs-Website. Ob ein Cookie-Banner oder Barrierefreiheit nach dem BFSG dazukommt, hängt davon ab, was die Seite tut. Wer auf Tracking verzichtet, Schriften selbst ausliefert, Karten per Klick lädt und nichts online verkauft, kommt in der Regel mit zwei Pflichtseiten und ohne Banner aus.",
      },
      {
        kind: "p",
        text: "Wenn wir eine Website bauen, legen wir Impressum und Datenschutzseite an und sagen Ihnen, welche Dienste in die Erklärung gehören. Den Rechtstext beziehen Sie von einer Anwältin oder einem Anwalt, Ihrer Kammer, Ihrem Verband oder aus einem Generator. Diese Übersicht ersetzt keine Prüfung im Einzelfall und ist keine Rechtsberatung.",
      },
      {
        kind: "quote",
        text: "Die Pflichtseiten schreibt man einmal sorgfältig und schaut dann hinein, wenn sich an der Seite etwas ändert.",
      },
    ],
  },
  // Quellen (geprüft, nicht im Text):
  // - https://www.denic.de/fileadmin/Downloads/Rechtliches/DENIC-Domainrichtlinien_DE.pdf
  // - https://blog.denic.de/en/new-legislation-what-is-changing-for-users-of-denics-whois-lookup-2/
  // - https://docs.denic.de/en/Content/DENIC-29/Implementierung.htm
  // - https://www.denic.de/en/products/holder-data-verification/general-information/
  // - https://blog.denic.de/en/beware-of-phishing-when-fake-verification-emails-appear-to-be-from-your-internet-service-provider-or-denic/
  // - https://www.denic.de/domains/de-domains/providerwechsel
  // - https://www.strato.de/faq/domains/authinfo-code/
  // - https://www.denic.de/en/price-list/
  // - https://www.experte.de/domains/de
  // - https://letsencrypt.org/de/docs/faq/
  // - https://letsencrypt.org/2026/10/07/64-day-certs
  // - https://developers.google.com/search/blog/2014/08/https-as-ranking-signal?hl=de
  // - https://developers.google.com/search/blog/2018/07/ein-meilenstein-fur-die-sicherheit-in?hl=de
  // - https://security.googleblog.com/2025/10/https-by-default.html
  // - https://www.gesetze-im-internet.de/ttdsg/__19.html
  // - https://eur-lex.europa.eu/legal-content/DE/TXT/HTML/?uri=CELEX:02016R0679-20160504
  // - https://www.datenschutzkonferenz-online.de/media/kp/dsk_kpnr_13.pdf
  // - https://support.google.com/a/answer/6149037?hl=de
  // - https://support.google.com/mail/answer/81126?hl=de
  // - https://www.bsi.bund.de/DE/Themen/Verbraucherinnen-und-Verbraucher/Informationen-und-Empfehlungen/Cyber-Sicherheitsempfehlungen/Accountschutz/Zwei-Faktor-Authentisierung/zwei-faktor-authentisierung_node.html
  // - https://www.bsi.bund.de/DE/Themen/Verbraucherinnen-und-Verbraucher/Informationen-und-Empfehlungen/Cyber-Sicherheitsempfehlungen/Accountschutz/Sichere-Passwoerter-erstellen/Passwort-Manager/passwort-manager_node.html
  // - https://www.gesetze-im-internet.de/ao_1977/__147.html
  // - https://www.gesetze-im-internet.de/hgb/__257.html
  // - intern: lib/pakete-data.ts
  // - intern: lib/faq-data.ts
  // - intern: lib/lexikon-data.ts
  {
    slug: "domain-hosting-ssl-email-website-was-braucht-mein-betrieb",
    seoTitle: "Domain, Hosting, SSL: Was eine Website braucht und kostet",
    title: "Die Adresse sollte Ihnen gehören",
    dek: "Was Ihr Betrieb für eine eigene Website wirklich braucht, wem die Domain gehören sollte und was das ungefähr kostet.",
    seoDescription: "Was ein Betrieb für die eigene Website braucht: Domain, Hosting, SSL und E-Mail. Wem die Domain gehören sollte und was das ungefähr kostet.",
    publishedAt: "2026-11-07",
    readingMinutes: 7,
    tags: ["Domain", "Hosting", "Technik", "Entscheidung"],
    body: [
      {
        kind: "p",
        text: "Für eine eigene Website braucht Ihr Betrieb drei Dinge: eine Domain, Hosting und ein SSL-Zertifikat. Dazu kommen, wenn Sie möchten, E-Mail-Adressen mit Ihrem Namen hinter dem @. Die Domain sollte auf Ihren Betrieb eingetragen sein, nicht auf die Agentur; eine .de-Domain kostet bei üblichen Anbietern meist unter 20\u00A0€ im Jahr, das SSL-Zertifikat muss nichts kosten, und bei Hosting und Postfächern hängt der Preis vom Anbieter und vom Tarif ab.",
      },
      {
        kind: "p",
        text: "Im Folgenden erklären wir, was hinter den vier Begriffen steckt, worauf Sie achten sollten und wie Sie später den Anbieter wechseln, ohne dass Ihre Seite ausfällt.",
      },
      {
        kind: "h2",
        text: "Die vier Bausteine",
      },
      {
        kind: "li",
        text: "Domain: die Adresse Ihrer Website, etwa ihr-betrieb.de. Sie wird jährlich verlängert, solange Sie die Gebühr zahlen.",
      },
      {
        kind: "li",
        text: "Hosting: der Speicherplatz auf einem Server, auf dem die Dateien Ihrer Website liegen und von dem aus sie an die Besucher ausgeliefert wird.",
      },
      {
        kind: "li",
        text: "SSL-Zertifikat: sorgt dafür, dass die Verbindung zwischen Besucher und Website verschlüsselt ist. Zu erkennen an „https“ vor der Adresse.",
      },
      {
        kind: "li",
        text: "E-Mail-Postfächer: Adressen wie info@ihr-betrieb.de, die über Ihre Domain laufen.",
      },
      {
        kind: "p",
        text: "Diese Bausteine müssen nicht beim selben Anbieter liegen. Die Domain kann in Ihrem eigenen Konto bleiben, während die Website auf dem Server eines anderen Anbieters liegt. Dann wird die Domain in ihren Einstellungen auf diesen Server gerichtet.",
      },
      {
        kind: "h2",
        text: "Wem sollte die Domain gehören?",
      },
      {
        kind: "p",
        text: "Ihnen. Bei einer .de-Domain ist Inhaber, wer bei der DENIC eingetragen ist, der zentralen Registrierungsstelle für .de. Der Domainvertrag kommt zwischen dem Inhaber und der DENIC zustande. Der Provider, über den Sie bestellen, leitet den Auftrag nur weiter und verwaltet die Domain danach für den Inhaber. Wer die Domain bezahlt oder bestellt hat, ist also nicht automatisch ihr Inhaber.",
      },
      {
        kind: "p",
        text: "Ist eine Agentur oder ein Webdesigner als Inhaber eingetragen, gehört die Domain dem Dienstleister. Ein späterer Wechsel wird dann unnötig kompliziert. Lassen Sie die Domain deshalb immer auf Ihren eigenen Namen eintragen, nie auf den der Agentur.",
      },
      {
        kind: "p",
        text: "Ob das bei Ihnen so ist, zeigt die Whois-Abfrage der DENIC nur zum Teil. Seit der Umsetzung der NIS-2-Vorgaben stehen dort bei Domains von Firmen und Vereinen (etwa GmbH, UG, e. V.) wieder Name und Anschrift des Inhabers. Steht dort eine Agentur, ist sie der Inhaber. Läuft die Domain auf eine Privatperson, etwa bei einem Einzelunternehmen, bleiben die Daten verborgen. Fragen Sie dann bei Ihrem Provider oder Ihrer Agentur nach und lassen Sie sich die Inhaberdaten aus dem Kundenkonto zeigen. Steht als Inhaber jemand anderes als Ihr Betrieb, beantragen Sie einen Inhaberwechsel. Auch er läuft über den Provider.",
      },
      {
        kind: "p",
        text: "Achten Sie dabei auf die E-Mail-Adresse, die beim Inhaber hinterlegt ist. Wegen der NIS-2-Vorgaben und des deutschen BSI-Gesetzes müssen die Inhaberdaten von .de-Domains stimmen. Die DENIC prüft das bei neuen Domains und stichprobenartig auch bei bestehenden. Die Aufforderung kommt von Ihrem Provider oder von der DENIC selbst, per E-Mail oder Brief. Bestätigen Sie sie innerhalb der genannten Frist, in der Regel 30 Tage. Sonst kann die Domain gesperrt und später gelöscht werden, und dann ist auch Ihre Website nicht mehr erreichbar.",
      },
      {
        kind: "p",
        text: "Vorsicht bei gefälschten Mails: Die DENIC warnt vor Nachrichten, die angeblich zur Verifizierung auffordern. Sie schreibt nur von denic.de-Adressen und fragt nie nach Passwörtern oder Zugangsdaten. Eine Drohung mit einer Frist von 24 Stunden ist laut DENIC ein Zeichen für Betrug.",
      },
      {
        kind: "h2",
        text: "Was kostet eine Domain?",
      },
      {
        kind: "p",
        text: "Eine .de-Domain kostet bei den üblichen Providern meist unter 20\u00A0€ im Jahr. Achten Sie auf den Preis ab dem zweiten Jahr: Manche Anbieter werben mit einem niedrigen Preis im ersten Jahr und verlangen bei der Verlängerung mehr.",
      },
      {
        kind: "p",
        text: "Man kann eine .de-Domain auch direkt bei der DENIC registrieren. Das kostet dort 79\u00A0€ im Jahr inklusive Mehrwertsteuer. Die DENIC schreibt selbst, dass ihre Preise oft höher sind als die der Provider. Deshalb registriert man die Domain in aller Regel über einen Provider.",
      },
      {
        kind: "h2",
        text: "Brauche ich SSL, und was kostet es?",
      },
      {
        kind: "p",
        text: "Ja, und es muss nichts kosten. Let’s Encrypt ist eine gemeinnützige Zertifizierungsstelle, die für ihre Zertifikate keine Gebühr nimmt. Für eine normale Betriebs-Website reicht ein solches Zertifikat aus. Es gilt nur begrenzt und muss regelmäßig erneuert werden. Das sollte Ihr Hoster automatisch erledigen. Fragen Sie danach, wenn es nicht im Tarif steht.",
      },
      {
        kind: "p",
        text: "Ohne SSL fällt Ihre Seite auf. Chrome markiert seit 2018 jede Seite ohne HTTPS in der Adresszeile als „Nicht sicher“. Tippt jemand etwas ein, etwa in ein Kontaktformular, wird die Warnung rot. Außerdem hat Google angekündigt, dass Chrome ab Version 154 (geplant für Oktober 2026) standardmäßig nachfragt, bevor eine öffentliche Seite ohne HTTPS zum ersten Mal geöffnet wird. Bei der Suche bevorzugt Google sichere Seiten leicht; HTTPS ist dort ein schwaches Signal, gute Inhalte zählen mehr.",
      },
      {
        kind: "p",
        text: "Auch rechtlich spricht viel dafür. Für geschäftsmäßig angebotene Websites verlangt §\u00A019 Abs.\u00A04 TDDDG Schutzvorkehrungen, soweit sie technisch möglich und wirtschaftlich zumutbar sind. Diese sollen den Stand der Technik berücksichtigen, und das Gesetz nennt ein als sicher anerkanntes Verschlüsselungsverfahren ausdrücklich als Beispiel. Art.\u00A032 Abs.\u00A01 lit. a DSGVO nennt Verschlüsselung ebenfalls als geeignete Maßnahme zum Schutz personenbezogener Daten, etwa der Angaben in einem Kontaktformular. Eine Seite mit Kontaktformular ohne SSL entspricht dem in der Regel nicht. Das ist eine allgemeine Einordnung und keine Rechtsberatung.",
      },
      {
        kind: "h2",
        text: "Worauf es beim Hosting ankommt",
      },
      {
        kind: "li",
        text: "Server in der EU: Das ist keine Pflicht, macht den Datenschutz aber einfacher. Für Übermittlungen in Länder außerhalb von EU und EWR stellt die DSGVO zusätzliche Anforderungen (Art.\u00A044 ff.), die bei Servern in der EU in der Regel entfallen.",
      },
      {
        kind: "li",
        text: "Vertrag zur Auftragsverarbeitung: Für Hosting und E-Mail schließen Sie in der Regel einen AV-Vertrag nach Art.\u00A028 DSGVO. Seriöse Anbieter stellen ihn bereit, oft zum Abschluss im Kundenkonto.",
      },
      {
        kind: "li",
        text: "SSL inklusive: Das Zertifikat sollte im Tarif enthalten sein und sich von selbst erneuern.",
      },
      {
        kind: "li",
        text: "Backups: regelmäßige Sicherungen, damit sich die Seite nach einem Fehler wiederherstellen lässt.",
      },
      {
        kind: "li",
        text: "Updates: Klären Sie, wer die Technik der Seite aktuell hält und ob das im Preis enthalten ist.",
      },
      {
        kind: "h2",
        text: "Eigene E-Mail-Adresse statt Gmail-Konto?",
      },
      {
        kind: "p",
        text: "Eine Adresse wie info@ihr-betrieb.de wirkt auf Kunden einheitlicher als eine private Gmail-Adresse, und sie bleibt Ihnen, wenn Sie den E-Mail-Anbieter wechseln, solange die Domain auf Ihren Namen läuft.",
      },
      {
        kind: "p",
        text: "Damit sie funktioniert, werden in den Einstellungen Ihrer Domain sogenannte MX-Einträge gesetzt, die auf Ihren E-Mail-Dienst zeigen. Ändern kann sie nur, wer Zugriff auf die Domain-Einstellungen hat. Dazu kommen Einträge, mit denen sich Ihre Mails als echt ausweisen (SPF, DKIM, DMARC). Gmail verlangt von allen Absendern, die an private Gmail-Konten schreiben, mindestens SPF oder DKIM. Mails ohne diese Prüfung können abgelehnt werden oder im Spam landen. Ihr Anbieter sollte diese Einträge einrichten.",
      },
      {
        kind: "p",
        text: "Postfächer sind je nach Anbieter im Tarif enthalten oder kosten extra.",
      },
      {
        kind: "h2",
        text: "Zugangsdaten sicher verwahren",
      },
      {
        kind: "p",
        text: "Für Domain, Hosting und E-Mail haben Sie meist drei Konten. Das Bundesamt für Sicherheit in der Informationstechnik (BSI) rät:",
      },
      {
        kind: "li",
        text: "Bewahren Sie die Zugangsdaten in einem Passwort-Manager auf, der sie verschlüsselt hinter einem Masterpasswort speichert.",
      },
      {
        kind: "li",
        text: "Sichern Sie wichtige Konten mit Zwei-Faktor-Authentisierung ab, vor allem das E-Mail-Konto. Wer darauf Zugriff hat, kann die Passwörter anderer Dienste zurücksetzen.",
      },
      {
        kind: "li",
        text: "Heben Sie Wiederherstellungsschlüssel sicher auf.",
      },
      {
        kind: "p",
        text: "Notieren Sie außerdem, bei welchem Anbieter welches Konto liegt. Danach wird meist erst gesucht, wenn etwas nicht funktioniert.",
      },
      {
        kind: "h2",
        text: "Anbieter wechseln, ohne dass etwas ausfällt",
      },
      {
        kind: "p",
        text: "Zuerst eine Unterscheidung: Die Website kann umziehen, während die Domain in Ihrem Konto bleibt. Dann wird die Domain nur auf den neuen Server gerichtet. Soll auch die Domain zu einem anderen Provider, gehen Sie so vor:",
      },
      {
        kind: "li",
        text: "Richten Sie zuerst Website und Postfächer beim neuen Anbieter ein. Erst dann stellen Sie um.",
      },
      {
        kind: "li",
        text: "Kündigen Sie die Domain beim alten Anbieter nicht einfach. Je nach Anbieter kann eine Kündigung zur Löschung führen. Beauftragen Sie stattdessen einen Providerwechsel.",
      },
      {
        kind: "li",
        text: "Lassen Sie den bisherigen Provider eine AuthInfo bei der DENIC hinterlegen, eine Art Passwort für den Wechsel. Sie gilt höchstens 30 Tage.",
      },
      {
        kind: "li",
        text: "Geben Sie die AuthInfo dem neuen Provider. Stimmt sie, überträgt die DENIC die Domain sofort. Prüfen Sie vorher die Regeln Ihres Providers, manche haben eigene Fristen.",
      },
      {
        kind: "li",
        text: "Geänderte Einträge wirken nicht überall sofort, oft erst nach einigen Stunden. Lassen Sie alte und neue Seite und die Postfächer deshalb eine Weile parallel laufen.",
      },
      {
        kind: "li",
        text: "Beenden Sie den alten Vertrag und löschen Sie alte Postfächer erst, wenn alles läuft. Nehmen Sie alte Mails mit: Geschäftliche E-Mails, die Handels- oder Geschäftsbriefe sind, müssen in der Regel sechs Jahre aufbewahrt werden, E-Mails mit Rechnungen als Buchungsbelege acht Jahre (§\u00A0147 AO, §\u00A0257 HGB).",
      },
      {
        kind: "h2",
        text: "Fazit",
      },
      {
        kind: "p",
        text: "Wirklich nötig sind eine Domain auf Ihren Namen mit erreichbarer E-Mail-Adresse, Hosting mit automatisch erneuertem SSL und Backups, am besten in der EU, und, wenn Sie möchten, Postfächer mit Ihrer Domain. Die Domain kostet meist unter 20\u00A0€ im Jahr, das Zertifikat nichts. Wichtiger als der Preis ist, dass Sie die Zugangsdaten haben und wissen, wer was betreut.",
      },
      {
        kind: "p",
        text: `Bei uns sind Hosting in der EU mit SSL und automatischen Backups im Monatsbeitrag enthalten, ${monatsbeitrag("starter")} inkl. MwSt. Haben Sie schon eine Domain, bleibt sie in Ihrem Konto und wird auf unseren Server gerichtet. Auf Wunsch ziehen wir sie auch um. Eingetragen bleibt sie immer auf Ihren Namen.`,
      },
      {
        kind: "quote",
        text: "Die Adresse Ihres Betriebs sollte auf Ihren Namen laufen, nicht auf den Ihres Dienstleisters.",
      },
    ],
  },
  {
    slug: "die-zweite-frage",
    seoTitle: "Erstgespräch beim Webdesigner: Was Anrufer fragen",
    title: "Die zweite Frage",
    dek: "Was Anrufer im Erstgespräch eigentlich wissen wollen, und warum sie zuerst nach dem Preis fragen.",
    publishedAt: "2026-06-15",
    readingMinutes: 4,
    tags: ["Beratung", "Sprechstunde", "Erstgespräch"],
    body: [
      {
        kind: "p",
        text: "Im Erstgespräch kommt zuerst meist die Frage, die man eben stellt. Was kostet eine Website? Wie lange dauert das? Machen Sie auch SEO? Diese Fragen sind berechtigt. Der Grund für den Anruf sind sie selten.",
      },
      {
        kind: "p",
        text: "Der eigentliche Grund kommt oft erst ein paar Minuten später. Er ist kleiner als die erste Frage und gleichzeitig dringender.",
      },
      {
        kind: "h2",
        text: "Wie so eine zweite Frage klingt",
      },
      {
        kind: "p",
        text: "Angenommen, eine Schneiderei fragt nach dem Preis einer neuen Website. Ein paar Sätze später zeigt sich: Die alte Baukasten-Seite hat ein Verwandter gebaut, der nicht mehr erreichbar ist. Das Passwort ist weg, und auf der Startseite steht seit Monaten die Sommerkollektion. Die eigentliche Frage lautet: Wie bekomme ich meine Seite wieder in die Hand?",
      },
      {
        kind: "p",
        text: "Oder ein Pflegedienst fragt, ob wir SEO machen. Dahinter steckt eine schlechte Google-Bewertung von jemandem, der nie Kunde war. Die eigentliche Frage lautet: Wie antworte ich darauf, ohne mir Ärger einzuhandeln?",
      },
      {
        kind: "h2",
        text: "Warum zuerst nach dem Preis gefragt wird",
      },
      {
        kind: "p",
        text: "Wer bei einem fremden Anbieter anruft, beginnt mit dem, was man üblicherweise fragt. Preis, Dauer und Leistungen sind ein sicherer Einstieg. Erst wenn das Gespräch angenehm läuft, kommt das, was einen wirklich beschäftigt.",
      },
      {
        kind: "p",
        text: "Wir beantworten die erste Frage deshalb kurz und lassen danach Platz für die zweite.",
      },
      {
        kind: "h2",
        text: "Wie das am Telefon aussieht",
      },
      {
        kind: "p",
        text: `Auf die Preisfrage antworten wir in einem Satz: ${PREISE_SATZ}, alles inklusive Mehrwertsteuer, den genauen Festpreis bekommen Sie schriftlich. Dann machen wir eine Pause. In dieser Pause kommt oft die zweite Frage.`,
      },
      {
        kind: "p",
        text: "Gegenfragen wie „Was ist Ihnen wichtiger, Tempo oder Preis?“ stellen wir nicht. Solche Fragen kennt jeder aus Verkaufsgesprächen, und sie helfen niemandem weiter.",
      },
      {
        kind: "h2",
        text: "Warum wir das aufschreiben",
      },
      {
        kind: "p",
        text: "Für solche Fragen gibt es unsere Sprechstunde: jeden ersten Donnerstag im Monat von 17 bis 18:30 Uhr am Telefon. Eine Anmeldung brauchen Sie nicht, und Sie müssen weder ein Vorhaben beschreiben noch ein Budget nennen. Je niedriger die Schwelle, desto früher kommt die Frage, um die es eigentlich geht.",
      },
      {
        kind: "quote",
        text: "Oft ist die zweite Frage der eigentliche Grund für den Anruf.",
      },
    ],
  },
  {
    slug: "wann-eine-website-warten-kann",
    seoTitle: "Neue Website jetzt oder später? Wann es warten kann",
    title: "Wann eine Website warten kann",
    dek: "Drei Fälle, in denen wir raten, mit der eigenen Website noch zu warten.",
    seoDescription:
      "Drei Fälle, in denen wir raten, mit der Website noch zu warten: Das Geschäft steht noch nicht, Instagram ist der Vertriebskanal oder die Saison läuft.",
    publishedAt: "2026-06-12",
    readingMinutes: 4,
    tags: ["Beratung", "Entscheidung", "Lokales Geschäft"],
    body: [
      {
        kind: "p",
        text: "Von einer Webdesign-Firma erwartet man diesen Satz nicht: Manchmal sollte eine eigene Website nicht das Erste sein. Wenn wir so einen Fall vor uns haben, sagen wir das im Erstgespräch, auch wenn dabei kein Auftrag herauskommt. Drei Fälle sind typisch.",
      },
      {
        kind: "h2",
        text: "Wenn das Geschäft selbst noch nicht steht",
      },
      {
        kind: "p",
        text: "Jemand hat eine gute Geschäftsidee, aber noch keinen ersten Kunden. Die Website scheint der erste Schritt zu sein. Wir halten sie für den dritten. Zuerst muss klar sein, was Sie genau anbieten und für wen. Danach kommen die ersten Gespräche mit Interessenten, in denen Sie merken, welche Begriffe verstanden werden. Erst dann lohnt sich eine Website, die genau diese Begriffe verwendet.",
      },
      {
        kind: "p",
        text: "Wer es umgekehrt macht, baut eine Seite für eine Vorstellung vom Geschäft. Nach ein paar Monaten zeigt sich, dass die ersten Kunden anders sind als gedacht, und die Texte müssen neu geschrieben werden. Dann bezahlen Sie Zeit und Geld zweimal.",
      },
      {
        kind: "h2",
        text: "Wenn Instagram der Vertriebskanal ist",
      },
      {
        kind: "p",
        text: "Manche lokalen Betriebe verkaufen vor allem über Instagram. Eine Konditorei kündigt den Sonntagskuchen am Donnerstag in der Story an. Ein Tattoostudio vergibt Termine per Direktnachricht.",
      },
      {
        kind: "p",
        text: "Eine aufwendige Website kostet dann Aufmerksamkeit, die beim eigentlichen Vertriebskanal fehlt. Wir empfehlen in so einem Fall eine schlichte Visitenkarten-Seite mit Adresse, Öffnungszeiten und einem Link zum Profil. Die übrige Zeit gehört dem Kanal, über den die Anfragen kommen.",
      },
      {
        kind: "h2",
        text: "Wenn die Saison gerade läuft",
      },
      {
        kind: "p",
        text: "Eine Eisdiele im April, ein Stand auf dem Weihnachtsmarkt im November, ein Skiverleih im Januar: Wer mitten in der Saison anfragt, hat neben dem Tagesgeschäft kaum Zeit. Stichpunkte für die Texte schicken, Fotos aussuchen und den Test-Link durchsehen braucht aber ein paar ruhige Stunden.",
      },
      {
        kind: "p",
        text: "Wir raten dann, auf die ruhigere Zeit zu warten. Eine Seite, die kurz vor dem Ansturm ungeprüft online geht, macht im Hochbetrieb Ärger, etwa wenn das Kontaktformular nicht funktioniert. Und genau dann hat niemand Zeit, sich darum zu kümmern.",
      },
      {
        kind: "h2",
        text: "Warum wir das schreiben",
      },
      {
        kind: "p",
        text: "Wenn wir von einem Auftrag abraten, verdienen wir an diesem Tag nichts. Wir halten es trotzdem für richtig. Wer gut beraten wurde, ruft wieder an, wenn der Zeitpunkt passt.",
      },
      {
        kind: "quote",
        text: "Zu einer guten Beratung gehört auch der Satz: Warten Sie damit noch.",
      },
    ],
  },
  {
    slug: "der-preis-einer-website",
    seoTitle: "Website-Festpreis: Wie unsere Preise entstehen",
    title: "Der Preis, einmal offen hingelegt",
    dek: "Was eine Website kostet, wie unsere Preise entstehen und welcher Posten in vielen Angeboten fehlt.",
    publishedAt: "2026-06-08",
    readingMinutes: 4,
    tags: ["Preise", "Transparenz", "Entscheidung"],
    body: [
      {
        kind: "p",
        text: "Über Website-Preise erfährt man oft erst etwas, wenn man anfragt. Agenturen schreiben Angebote, Freelancer schätzen nach Aufwand, und Baukästen werben mit null Euro und meinen den Einstieg. Unsere Preise stehen auf der Website. Hier erklären wir, wie sie zustande kommen.",
      },
      {
        kind: "h2",
        text: "Was andere Wege kosten",
      },
      {
        kind: "p",
        text: "Eine Website für einen kleinen Betrieb kostet bei einer Agentur meist ab etwa 5.000\u00A0€. Freelancer liegen oft zwischen 800 und 5.000\u00A0€. Ein Baukasten kostet ein monatliches Abo; die Tarife stehen auf der Preisseite des Anbieters. Dazu kommt Ihre eigene Zeit für Gestaltung, Texte und Technik. Sie steht in keiner Rechnung, fällt aber trotzdem an, meist abends und am Wochenende.",
      },
      {
        kind: "p",
        text: `Unsere Pakete beginnen ${preis("starter").replace(/^ab/, "bei")} für eine einzelne Seite. Business kostet ${preis("business")}, Premium mit Bereichen, die Sie selbst pflegen, ${preis("premium")} und Studio mit eigener Gestaltung ${preis("studio")}. Alle Preise inklusive 19\u00A0% Mehrwertsteuer.`,
      },
      {
        kind: "h2",
        text: "Wie unser Preis entsteht",
      },
      {
        kind: "p",
        text: "Für eine Starter-Seite rechnen wir mit etwa fünf Arbeitsstunden: eine für den Seitenplan und die Sichtung Ihrer Unterlagen, zwei für den Bau, eine für Bilder und Tests auf echten Handys und eine für Hosting, Domain und SSL. Dazu kommen Werkzeuge und Lizenzen. Wer deutlich weniger verlangt, spart meist an einer dieser Stellen, oft beim Testen. Das merken Sie erst Monate später.",
      },
      {
        kind: "h2",
        text: "Der Posten, der oft fehlt",
      },
      {
        kind: "p",
        text: "Der größte Unterschied zwischen zwei Angeboten liegt selten im Einmalpreis. Er liegt in dem, was danach kommt: Sicherheits-Updates, Backups, das SSL-Zertifikat und die kleine Änderung im November, wenn sich die Öffnungszeiten ändern. In vielen Angeboten ist dafür nichts vorgesehen. Dann veraltet die Seite vom ersten Tag an.",
      },
      {
        kind: "p",
        text: `Unser Monatsbeitrag ${PAKETE[0].monthly.replace(/\s*\/\s*Monat$/, "")} deckt genau diesen Posten ab, und er steht im Angebot. Darin sind Hosting in der EU, Updates, Backups und je nach Paket eine bis zehn kleine Änderungen pro Monat enthalten.`,
      },
      {
        kind: "h2",
        text: "Wie Sie Angebote vergleichen",
      },
      {
        kind: "p",
        text: "Vergleichen Sie Angebote nicht nur am Einmalpreis. Fragen Sie, was das dritte Jahr kostet, wenn alles eingerechnet ist. Fragen Sie, wem die Seite am Ende gehört. Und fragen Sie, wer ans Telefon geht, wenn das Kontaktformular an einem Freitagnachmittag nicht funktioniert.",
      },
      {
        kind: "quote",
        text: "Einen Preis, den man erklären kann, muss man nicht verteidigen.",
      },
    ],
  },
  {
    slug: "warum-wir-keine-mockups-zeigen",
    seoTitle: "Test-Link statt Entwurfsbild: Warum wir echt bauen",
    title: "Das Echte zuerst",
    dek: "Warum wir statt eines Entwurfsbilds gleich eine Seite bauen, die Sie auf dem Handy öffnen können.",
    publishedAt: "2026-06-05",
    readingMinutes: 3,
    tags: ["Arbeitsweise", "Test-Link", "Transparenz"],
    body: [
      {
        kind: "p",
        text: "Viele Webprojekte beginnen mit einem Entwurfsbild. Es ist sorgfältig zusammengestellt, mit passendem Beispieltext und Fotos, die später niemand liefert. Wochen später geht eine Seite online, die dem Bild nur noch ähnlich sieht. Wir fangen anders an: Statt eines Bildes bekommen Sie einen Test-Link.",
      },
      {
        kind: "h2",
        text: "Was ein Entwurfsbild nicht zeigt",
      },
      {
        kind: "p",
        text: "Ein Entwurfsbild zeigt eine Seite im besten Moment. Die Bildausschnitte passen, jeder Text hat genau die richtige Länge, und der Bildschirm hat genau eine Breite. Es zeigt nicht, wie schnell die Seite lädt, wie sie auf einem drei Jahre alten Android-Handy umbricht oder was passiert, wenn eine Überschrift zwei Wörter länger ist.",
      },
      {
        kind: "p",
        text: "Gerade diese Punkte entscheiden aber, ob eine Seite im Alltag funktioniert. Wer ein Entwurfsbild freigibt, gibt eine Absicht frei und noch keine Website.",
      },
      {
        kind: "h2",
        text: "Wie es bei uns läuft",
      },
      {
        kind: "p",
        text: "Wir bauen von Anfang an die echte Seite. Nach wenigen Tagen schicken wir Ihnen einen Link zu einer Vorschau mit Ihren Inhalten. Sie öffnen sie auf Ihrem eigenen Handy und können sie an Familie, Mitarbeiter oder Ihren Steuerberater weiterleiten. Was Sie dort sehen, geht so online.",
      },
      {
        kind: "p",
        text: "Änderungswünsche besprechen wir an dieser Vorschau. Der Knopf soll größer werden, die Reihenfolge anders, ein Foto soll raus: Jede Korrektur sehen Sie meist am nächsten Tag unter demselben Link.",
      },
      {
        kind: "h2",
        text: "Was das von Ihnen verlangt",
      },
      {
        kind: "p",
        text: "Diese Arbeitsweise funktioniert nur mit echten Inhalten. Ein Entwurfsbild lässt sich mit Blindtext füllen, eine echte Seite nicht. Deshalb brauchen wir am Anfang Ihr Logo, ein paar Stichpunkte und Fotos, gern vom Handy. Den Text formulieren wir daraus. Fehlt etwas, sagen wir Ihnen genau, was wir noch brauchen, statt mit Platzhaltern zu bauen.",
      },
      {
        kind: "quote",
        text: "Was Sie auf dem Test-Link freigeben, geht genau so online.",
      },
    ],
  },
  {
    slug: "cafe-website-hamburg-2026",
    seoTitle: "Café-Website: Was Gäste am Handy zuerst suchen",
    title: "Die paar Sekunden vor der Tür",
    dek: "Was ein Gast vor einem Hamburger Café auf dem Handy sucht, und was eine Café-Website deshalb oben zeigen sollte.",
    publishedAt: "2026-06-01",
    readingMinutes: 4,
    tags: ["Gastronomie", "Gefunden werden", "Handy"],
    body: [
      {
        kind: "p",
        text: "Ein Gast steht vor Ihrem Café und schaut kurz aufs Handy. Danach geht er hinein oder weiter. In diesen Sekunden zählt nicht die Gestaltung der Website, sondern ob er findet, was er sucht.",
      },
      {
        kind: "p",
        text: "Gesucht wird in diesem Moment fast immer dasselbe: drei Antworten.",
      },
      {
        kind: "h2",
        text: "Drei Fragen vor der Tür",
      },
      {
        kind: "p",
        text: "Erstens: Ist heute geöffnet? Gemeint ist nicht „Montag bis Freitag 9 bis 18 Uhr“, sondern heute, jetzt, ja oder nein. Zweitens: Was gibt es, und was kostet es? Gemeint ist eine Karte, die man auf dem Handy lesen kann, und kein PDF mit dem Druckstand von 2021. Drittens: Wie komme ich hin? Dafür braucht es die Adresse, eine Telefonnummer zum Antippen und einen Knopf für den Routenplaner.",
      },
      {
        kind: "p",
        text: "Stehen diese Antworten nicht oben auf der Seite, geht der Gast oft einfach nebenan. In keiner Auswertung taucht das auf, weil niemand zählt, wer nicht hereinkommt.",
      },
      {
        kind: "h2",
        text: "Das Problem mit der PDF-Karte",
      },
      {
        kind: "p",
        text: "Die Speisekarte als PDF ist verständlich. Jemand im Team kann sie in Word ändern und neu hochladen. Auf dem Handy ist sie aber unpraktisch. Sie lädt bei schlechtem Empfang langsam, man muss mit zwei Fingern hineinzoomen, und in den Suchergebnissen erscheint sie als einzelne Datei statt als Teil Ihrer Seite.",
      },
      {
        kind: "p",
        text: "Eine Karte als normale Webseite mit Abschnitten für Frühstück, Mittagstisch, Kuchen und Getränke richten wir in etwa einer Stunde ein. Änderungen schicken Sie uns als kleine Änderung im Monatsbeitrag, mit Premium tragen Sie sie selbst ein. Bei Cafés fangen wir mit der Karte an, die Gestaltung kommt danach.",
      },
      {
        kind: "h2",
        text: "Die Telefonnummer gehört nach oben",
      },
      {
        kind: "p",
        text: "Wer vor der Tür zum Telefon greift, will nicht erst eine Nummer markieren und kopieren. Er will tippen, und das Handy soll wählen. Eine Telefonnummer als Klartext unten auf der Seite hilft dabei wenig. Wir setzen sie oben als Knopf.",
      },
      {
        kind: "h2",
        text: "Was wir bauen und was wir weglassen",
      },
      {
        kind: "p",
        text: "Für ein Café bauen wir meist eine einzige Seite mit fünf Abschnitten: heute geöffnet, Adresse mit Routenplaner, die Karte, ein paar Bilder vom Raum und Kontakt. Ein eigenes Reservierungssystem bauen wir in der Regel nicht. Wenn Sie Reservierungen brauchen, verlinken wir auf einen Dienst wie OpenTable oder Quandoo.",
      },
      {
        kind: "p",
        text: "Wenn diese Seite stimmt, hat der Gast seine Antworten, bevor er die Klinke anfasst.",
      },
      {
        kind: "quote",
        text: "Was der Gast vor der Tür wissen will, gehört oben auf die Seite.",
      },
    ],
  },
  {
    slug: "pflegedienst-google-maps-hamburg",
    seoTitle: "Pflegedienst bei Google Maps: Was hineingehört",
    title: "Wer auf der Karte fehlt, ist nicht im Gespräch",
    dek: "Wie Angehörige in Hamburg nach ambulanter Pflege suchen, und was ein vollständiger Google-Eintrag dafür braucht.",
    publishedAt: "2026-05-26",
    readingMinutes: 3,
    tags: ["Pflegedienst", "Gefunden werden", "Google Maps"],
    body: [
      {
        kind: "p",
        text: "Ein Pflegedienst, der bei Google Maps nicht erscheint, wird von vielen Angehörigen gar nicht erst gefunden. Das liegt daran, wie sie suchen.",
      },
      {
        kind: "p",
        text: "Wenn der Vater aus dem Krankenhaus entlassen wird und die Tochter abends einen Pflegedienst sucht, tippt sie selten nur „Pflegedienst Hamburg“. Sie tippt ihren Stadtteil dazu, etwa Eimsbüttel, Wandsbek oder Barmbek, und schaut, was auf der Karte erscheint.",
      },
      {
        kind: "h2",
        text: "Wo es oft hakt",
      },
      {
        kind: "p",
        text: "Viele Einträge auf der Karte sind unvollständig. Es fehlen Fotos, die Öffnungszeiten sind veraltet, und es steht nicht da, welche Leistungen der Dienst anbietet. Manche Pflegedienste haben gar keinen Eintrag, den sie selbst verwalten.",
      },
      {
        kind: "p",
        text: "Wer auf dem Handy sucht, vergleicht meist nur die ersten Einträge, die erscheinen. Wer dort fehlt oder nur eine Adresse zeigt, bekommt den Anruf nicht.",
      },
      {
        kind: "h2",
        text: "Warum das so ist",
      },
      {
        kind: "p",
        text: "Meist steckt eine von drei Ursachen dahinter. Google hat den Eintrag aus alten Verzeichnissen angelegt, und niemand hat ihn je übernommen. Oder der Eintrag gehört zwar dem Betrieb, gilt intern aber nur als Adressangabe. Oder zwischen Pflegedienstleitung und externer IT fühlt sich niemand zuständig.",
      },
      {
        kind: "p",
        text: "Keine dieser Ursachen ist schwer zu beheben.",
      },
      {
        kind: "h2",
        text: "Was vollständig heißt",
      },
      {
        kind: "p",
        text: "Zuerst bestätigen Sie den Eintrag im Google-Unternehmensprofil als Inhaber. Dazu kommen einige Fotos von Eingang, Fahrzeug und Team, genaue Öffnungszeiten mit der telefonischen Erreichbarkeit außerhalb der Bürozeiten und eine Beschreibung der Schwerpunkte, etwa Behandlungspflege, Grundpflege, Hauswirtschaft oder Demenzbetreuung. Bewertungen beantworten Sie einzeln und sachlich.",
      },
      {
        kind: "p",
        text: "Für die Einrichtung rechnen wir etwa eine Stunde, wenn Sie den Eintrag als Inhaber bestätigen können. Wenn wir die Website eines Pflegedienstes bauen, prüfen wir den Eintrag als Erstes.",
      },
      {
        kind: "quote",
        text: "Ein vollständiger Google-Eintrag kostet nichts außer etwas Zeit.",
      },
    ],
  },
  {
    slug: "was-wir-an-wix-migrationen-lernen",
    seoTitle: "Von Wix umziehen: Was beim Wechsel Arbeit macht",
    title: "Wer auszieht, nimmt nicht alles mit",
    dek: "Drei Dinge, die beim Umzug von einem Baukasten fast immer Arbeit machen, und wie wir sie angehen.",
    publishedAt: "2026-05-18",
    readingMinutes: 4,
    tags: ["Umzug", "Wix", "Baukasten"],
    body: [
      {
        kind: "p",
        text: "Wer von einem Baukasten wie Wix, Squarespace oder Jimdo zu einer eigenen Website wechselt, stößt fast immer auf dieselben drei Dinge. Das liegt weniger am einzelnen Anbieter als daran, wie Baukästen aufgebaut sind.",
      },
      {
        kind: "h2",
        text: "Texte, die in feste Flächen gepresst wurden",
      },
      {
        kind: "p",
        text: "Die Gestaltungen im Baukasten geben für Überschriften und Absätze feste Flächen vor. Viele Inhaber haben ihre Texte über Jahre in diese Flächen eingepasst. Beim Umzug sind die Sätze dann entweder abgehackt, weil der Platz nicht reichte, oder gestreckt, weil eine Fläche gefüllt werden musste.",
      },
      {
        kind: "p",
        text: "Deshalb schreiben wir beim Umzug einen Teil der Texte neu. Grundlage sind die alte Seite und Ihre Stichpunkte. Sie lesen gegen und streichen, was nicht stimmt.",
      },
      {
        kind: "h2",
        text: "Bilder ohne Originaldateien",
      },
      {
        kind: "p",
        text: "Baukästen speichern Bilder auf ihren eigenen Servern. Nach einer Kündigung sind sie dort irgendwann nicht mehr abrufbar. Viele Inhaber haben die Originaldateien nicht mehr, weil die Galerie im Baukasten ihr einziger Speicher war.",
      },
      {
        kind: "p",
        text: "Deshalb sichern wir vor dem Umzug alle Bilder der bestehenden Seite und prüfen, welche sich weiter verwenden lassen. Was zu klein oder zu stark komprimiert ist, ersetzen Sie durch neue Fotos, gern vom Handy. Dafür planen wir etwa einen halben Tag ein.",
      },
      {
        kind: "h2",
        text: "Unterseiten, die bei Google gefunden werden",
      },
      {
        kind: "p",
        text: "Oft weiß niemand genau, welche Unterseiten über Google Besucher bringen. Fällt so eine Seite beim Umzug weg, merkt man es erst Monate später an weniger Anfragen.",
      },
      {
        kind: "p",
        text: "Deshalb richten wir vor dem Umzug die Google Search Console ein (das kostenlose Werkzeug, mit dem Google zeigt, wie Ihre Seite gefunden wird), falls sie noch fehlt, und lassen sie ein paar Wochen mitlaufen. Danach legen wir fest, welche Adressen bleiben, welche weitergeleitet werden und welche wegfallen.",
      },
      {
        kind: "h2",
        text: "Die Mietwohnung",
      },
      {
        kind: "p",
        text: "Ein Baukasten ist keine schlechte Wahl. Für Selbstständige, die ihre Seite selbst pflegen wollen, passt er oft gut. Man sollte nur wissen, dass er einer Mietwohnung gleicht: Wer auszieht, nimmt nicht alles mit. Das merken viele erst beim Umzug.",
      },
      {
        kind: "quote",
        text: "Eine eigene Website nehmen Sie mit, wenn Sie den Anbieter wechseln.",
      },
    ],
  },
];

/**
 * Öffentliche Liste, garantiert neuester Beitrag zuerst — egal an
 * welcher Stelle im Array oben ein neuer Post eingefügt wird.
 * Konsumenten (Index-Aufmacher, Homepage-Karte, Prev/Next, Feed)
 * verlassen sich auf diese Ordnung.
 */
export const JOURNAL_POSTS: JournalPost[] = [...POSTS].sort((a, b) =>
  b.publishedAt.localeCompare(a.publishedAt),
);

/**
 * Branche-Slug → Journal-Slug für die „Aus dem Journal"-Sektion
 * auf den Branchen-Detailseiten. Hier in der Datenschicht gepflegt,
 * damit beim Anlegen eines Essays die Verdrahtung sichtbar daneben
 * liegt — nicht in einer Page-Datei vergraben.
 */
export const JOURNAL_BY_BRANCHE: Record<string, string> = {
  gastro: "cafe-website-hamburg-2026",
  pflege: "pflegedienst-google-maps-hamburg",
};

/**
 * Stadtteil-Slug → Journal-Slug, gleiche Logik für die Standort-
 * Detailseiten. Nur gepflegt, wo der Essay den Stadtteil wirklich
 * berührt — kein Zwang, alle Stadtteile zu bespielen.
 */
export const JOURNAL_BY_STANDORT: Record<string, string> = {
  eimsbuettel: "cafe-website-hamburg-2026",
  wandsbek: "pflegedienst-google-maps-hamburg",
  bergedorf: "pflegedienst-google-maps-hamburg",
};

/**
 * Weiterführende Links am Ende eines Beitrags. Ohne Eintrag zeigt
 * die Beitragsseite einen Standard (Durchsicht und Erstgespräch).
 */
export type JournalCta = {
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export const JOURNAL_CTAS: Record<string, JournalCta> = {
  "google-unternehmensprofil-einrichten": {
    primaryHref: "/website-erstellen-lassen",
    primaryLabel: "Website erstellen lassen: Preise und Ablauf",
    secondaryHref: "/audit",
    secondaryLabel: "Kostenlose Durchsicht Ihrer Website",
  },
  "pflichtangaben-website-impressum-datenschutz": {
    primaryHref: "/webseite-erstellen#recht",
    primaryLabel: "Webseite erstellen: Impressum, Datenschutz, Cookies",
    secondaryHref: "/audit",
    secondaryLabel: "Kostenlose Durchsicht Ihrer Website",
  },
  "domain-hosting-ssl-email-website-was-braucht-mein-betrieb": {
    primaryHref: "/pakete",
    primaryLabel: "Pakete und Preise",
    secondaryHref: "/audit",
    secondaryLabel: "Kostenlose Durchsicht Ihrer Website",
  },
  "die-zweite-frage": {
    primaryHref: "/sprechstunde",
    primaryLabel: "Zur Sprechstunde",
    secondaryHref: "/anfrage",
    secondaryLabel: "Schriftlich anfragen",
  },
  // Ankertexte: „Website erstellen lassen" nur auf /website-erstellen-lassen,
  // „Webseite (selbst) erstellen" ohne „lassen" nur auf /webseite-erstellen.
  "wann-eine-website-warten-kann": {
    primaryHref: "/audit",
    primaryLabel: "Kostenlose Durchsicht Ihrer Website",
    secondaryHref: "/webseite-erstellen",
    secondaryLabel: "Webseite selbst erstellen: Anleitung",
  },
  "der-preis-einer-website": {
    primaryHref: "/website-erstellen-lassen",
    primaryLabel: "Website erstellen lassen: Preise und Ablauf",
    secondaryHref: "/honorar",
    secondaryLabel: "Wie sich der Preis zusammensetzt",
  },
  "warum-wir-keine-mockups-zeigen": {
    primaryHref: "/ablauf",
    primaryLabel: "Der Ablauf im Einzelnen",
    secondaryHref: "/website-erstellen-lassen",
    secondaryLabel: "Website erstellen lassen: Ablauf und Festpreis",
  },
  "cafe-website-hamburg-2026": {
    primaryHref: "/branchen/gastro",
    primaryLabel: "Websites für Gastronomie",
    secondaryHref: "/audit",
    secondaryLabel: "Kostenlose Durchsicht Ihrer Seite",
  },
  "pflegedienst-google-maps-hamburg": {
    primaryHref: "/branchen/pflege",
    primaryLabel: "Websites für Pflegedienste",
    secondaryHref: "/audit",
    secondaryLabel: "Kostenlose Durchsicht Ihrer Seite",
  },
  "was-wir-an-wix-migrationen-lernen": {
    primaryHref: "/anfrage",
    primaryLabel: "Umzug anfragen",
    secondaryHref: "/vergleich",
    secondaryLabel: "Baukasten und Sitalo im Vergleich",
  },
};

export function getCtaForPost(slug: string): JournalCta | undefined {
  return JOURNAL_CTAS[slug];
}

export function getPost(slug: string): JournalPost | undefined {
  return JOURNAL_POSTS.find((p) => p.slug === slug);
}

export function getAllPostSlugs(): string[] {
  return JOURNAL_POSTS.map((p) => p.slug);
}

export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map((n) => parseInt(n, 10));
  return new Date(y, m - 1, d).toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
