/**
 * Fragen und Antworten von /faq. Eigene Datei, damit die Seite, das
 * FAQPage-Schema und llms-full.txt (Steckbrief für Sprachmodelle)
 * dieselben Antworten ausgeben.
 */

import { STUNDENSATZ_EUR } from "@/lib/honorar-data";
import { MONATSBEITRAEGE, PAKETE, WARTUNG_PREISE } from "@/lib/pakete-data";

export type FaqGroup = {
  id: string;
  label: string;
  /** `link` erscheint unter der Antwort; ins JSON-LD kommt nur der Text. */
  items: { q: string; a: string; link?: { href: string; label: string } }[];
};

export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: "anfrage",
    label: "Anfrage und Ablauf",
    items: [
      {
        q: "Muss ich mich irgendwo registrieren?",
        a: "Nein. Sie schicken das Formular ab oder rufen an; ein Konto brauchen Sie dafür nicht.",
      },
      {
        q: "Wie schnell ist meine Seite fertig?",
        a: "Ab vollständigen Unterlagen ist eine einzelne Seite (Starter) oft in 1–2 Werktagen online, Business meist in 5–10 Werktagen, Premium in 2–3 Wochen und Studio in 3–5 Wochen. Den genauen Termin für Ihre Seite nennen wir Ihnen vorab.",
      },
      {
        q: "Was brauchen Sie von mir?",
        a: "Ihr Logo in irgendeinem Format, notfalls fotografiert vom Briefpapier. Dazu fünf bis zehn Bilder von Ihnen oder Ihrem Betrieb, Handyfotos reichen. Außerdem Stichpunkte zu Ihren Leistungen, Öffnungszeiten und Kontaktdaten. Fehlt etwas, sagen wir Bescheid. Sind Bilder ein Problem, sagen wir Ihnen, welche Motive die Seite braucht. Wer einen Fotografen beauftragen will, bekommt von uns eine kurze Motivliste.",
      },
      {
        q: "Können wir uns persönlich in Hamburg treffen?",
        a: "Ja, in Ihrem Betrieb oder in einem Café. Eine Viertelstunde reicht meistens, um zu klären, ob wir zusammenpassen. Telefon oder Video geht genauso. Über die Termin-Seite wählen Sie Tag und Uhrzeit selbst; reserviert sind bis zu 30 Minuten, damit Zeit für Fragen bleibt. Die Bestätigung kommt meist am selben Werktag per Mail.",
      },
      {
        q: "Kann ich erst einmal eine Einschätzung meiner aktuellen Seite bekommen?",
        a: "Ja, kostenlos. Über die Seite „Kostenlose Durchsicht“ schicken Sie uns die Adresse Ihrer Seite. Wir sehen sie uns selbst an und schreiben Ihnen meist innerhalb von zwei Werktagen drei bis fünf konkrete Punkte. Einen Vertriebsanruf gibt es danach nicht. Die technischen Messwerte liefert der Ladezeit-Test automatisch in etwa 30 Sekunden.",
      },
      {
        q: "Was passiert nach meiner Anfrage?",
        a: "Nach dem Absenden sehen Sie eine Bestätigung auf der Seite. Wir lesen Ihre Angaben und melden uns meist am selben Werktag, per Mail oder am Telefon. Bis Sie ein Angebot unterschreiben, kostet Sie das nichts.",
      },
      {
        q: "Was, wenn ich noch gar nichts vorbereitet habe?",
        a: "Dann schicken Sie uns eine kurze Notiz, was Sie vorhaben, und wir sortieren es gemeinsam. Je früher wir mitdenken, desto weniger muss später umgebaut werden.",
      },
      {
        q: "Kann ich auch per E-Mail anfragen?",
        a: "Am besten über das Anfrageformular. Dann haben wir alle Angaben an einer Stelle und können schneller antworten. Wer lieber spricht, ruft an: 0160 7621876.",
      },
    ],
  },
  {
    id: "preise",
    label: "Preise und Betreuung",
    items: [
      {
        q: "Was kostet das Ganze?",
        a: `Es gibt vier Pakete: ${PAKETE.map((p) => `${p.name} ${p.setup}`).join(", ").replace(/, ([^,]*)$/, " und $1")}, jeweils einmalig für die Erstellung. Dazu kommt ein Monatsbeitrag ${MONATSBEITRAEGE} für Hosting, Pflege und kleine Änderungen. Alle Preise inklusive 19\u00A0% Mehrwertsteuer. Den genauen Festpreis nennen wir Ihnen nach Ihrer Anfrage, schriftlich und verbindlich.`,
      },
      {
        q: "Sind die Preise mit oder ohne Mehrwertsteuer?",
        a: "Mit. Alle Preise auf dieser Website sind Endpreise inklusive 19\u00A0% Mehrwertsteuer. Sind Sie vorsteuerabzugsberechtigt, ziehen Sie die enthaltene Mehrwertsteuer wie gewohnt als Vorsteuer ab; dafür steht sie auf unserer Rechnung gesondert ausgewiesen.",
      },
      {
        q: "Warum gibt es nur Einstiegspreise?",
        a: "Weil die Projekte unterschiedlich groß sind. Manche schicken uns fertige Unterlagen, andere brauchen mehr Hilfe. Manche wollen eine Seite, andere fünf. Der Einstiegspreis zeigt, wo es losgeht. Den endgültigen Preis bekommen Sie schriftlich, bevor wir anfangen.",
      },
      {
        q: "Kann ich später noch etwas ändern lassen?",
        a: "Ja. Kleine Änderungen sind im Monatsbeitrag enthalten, je nach Paket eine, drei, sechs oder zehn pro Monat. Sie schreiben uns kurz, was sich ändern soll. Wir setzen es um und sagen Bescheid, sobald es online ist. Ist das Kontingent eines Monats aufgebraucht, sagen wir Ihnen das vorher; weitere Änderungen rechnen wir nach Aufwand zum Stundensatz ab.",
      },
      {
        q: "Kann ich bestimmte Inhalte selbst pflegen?",
        a: "Wenn Sie möchten, ja. Ab dem Premium-Paket bauen wir Bereiche ein, die Sie selbst ändern können, etwa Öffnungszeiten, Wochenangebot, Speisekarte oder Bilder. Wollen Sie das nicht, übernehmen wir es.",
      },
      {
        q: "Bin ich an einen langen Vertrag gebunden?",
        a: "Die Erstellung zahlen Sie einmal. Der Monatsbeitrag hat eine Mindestlaufzeit von sechs Monaten und ist danach zum Monatsende kündbar. Wenn Sie gehen, übergeben wir Ihnen alles: die Seite, die Inhalte und die Zugangsdaten zu Ihrer Domain, die ohnehin auf Ihren Namen läuft.",
      },
      {
        q: "Was kostet eine spätere Erweiterung?",
        a: `Eine Erweiterung, etwa ein neuer Bereich, eine Online-Buchung oder eine zweite Sprache, berechnen wir nach Stundensatz (${STUNDENSATZ_EUR}\u00A0€ inkl. MwSt.). Den Betrag bekommen Sie vorher als verbindliches Angebot.`,
      },
      {
        q: "Meine Seite wurde woanders gebaut. Übernehmen Sie die Pflege?",
        a: `Ja. Hosting, Updates, Backups und kleine Änderungen übernehmen wir auch für fremde Seiten, auch für Wix und Squarespace. Bei Wix und Squarespace bleibt das Hosting beim Anbieter. Auf der Wartungs-Seite stehen drei Stufen: Basis ab ${WARTUNG_PREISE.basis}, Plus ab ${WARTUNG_PREISE.plus} und Werkbank ab ${WARTUNG_PREISE.werkbank} im Monat, die letzte mit zwei Arbeitsstunden pro Monat. Die Übernahme Ihrer Seite kostet einmalig ab ${WARTUNG_PREISE.uebernahme}. Alle Preise inkl. 19\u00A0% MwSt.`,
      },
    ],
  },
  {
    id: "sichtbarkeit",
    label: "Bei Google gefunden werden",
    items: [
      {
        q: "Werde ich für meinen Stadtteil gefunden?",
        a: `Darauf bauen wir die Seite aus. Statt auf „Webdesign Hamburg“ zielen wir auf Suchen wie „Friseur Eimsbüttel“, „Pflegedienst Wandsbek“ oder „Café Ottensen“. Für mehrere Hamburger Stadtteile haben wir eigene Seiten, zum Beispiel für Eimsbüttel, Altona und Eppendorf. Für Betriebe in anderen Städten gehen wir genauso vor.`,
        link: { href: "/standorte", label: "Alle Stadtteile" },
      },
      {
        q: "Lohnt sich ein Google-Unternehmensprofil?",
        a: "Ja. Das Profil ist kostenlos und entscheidet mit, ob Sie bei Google Maps und in der lokalen Suche auftauchen. Ab dem Business-Paket richten wir es mit Ihnen ein. Danach pflegen Sie es selbst oder überlassen es uns.",
        link: { href: "/journal/google-unternehmensprofil-einrichten", label: "Google-Unternehmensprofil einrichten: Anleitung" },
      },
      {
        q: "Was bringt mir Suchmaschinenoptimierung (SEO) konkret?",
        a: `Für lokale Betriebe vor allem Anfragen von Leuten, die gerade suchen. Wer bei „Friseur“ plus Stadtteil weit oben steht, braucht dafür keine Anzeigen. Dafür sorgen saubere Seitentitel, die richtigen Suchbegriffe und ein gepflegtes Google-Profil.`,
      },
      {
        q: "Schalten Sie auch Google-Anzeigen für mich?",
        a: "Nein, Werbekampagnen sind ein eigenes Fach, das wir nicht anbieten. Für die meisten lokalen Betriebe sind eine gut gebaute Seite und ein gepflegtes Google-Profil auf Dauer günstiger als Anzeigen.",
      },
    ],
  },
  {
    id: "technik",
    label: "Technik und Rechtliches",
    items: [
      {
        q: "Ist Hosting dabei?",
        a: "Ja, im Monatsbeitrag. Die Server stehen in der EU, das SSL-Zertifikat ist Pflicht, Backups laufen automatisch. Updates und Sicherheit übernehmen wir.",
      },
      {
        q: "Funktioniert die Seite auch auf dem Handy?",
        a: "Ja. Wir bauen zuerst die Ansicht fürs Handy und danach die für den Rechner. Vor dem Start prüfen wir die Seite auf echten Geräten, nicht nur im Simulator.",
      },
      {
        q: "Wird man die Seite bei Google finden?",
        a: `Die Grundlage legen wir sauber an: Seitentitel, Beschreibungen, eine klare Struktur, und kurze Ladezeiten; ab Business auch Sitemap und lokale Suchbegriffe. Platz 1 kann Ihnen niemand seriös versprechen. Bei lokalen Suchen wie „Friseur Eimsbüttel“ oder „Pflegedienst Altona“ ist die Konkurrenz aber oft überschaubar.`,
      },
      {
        q: "Sind Impressum und Datenschutz dabei?",
        a: "Die Seiten legen wir technisch an. Den rechtlich geprüften Text sollten Sie aus einer geeigneten Quelle beziehen, etwa einem Generator, einer Anwältin oder Ihrem Verband. Was zu Ihrem Fall passt, sagen wir Ihnen gern.",
        link: { href: "/journal/pflichtangaben-website-impressum-datenschutz", label: "Was auf jede Betriebs-Website gehört" },
      },
      {
        q: "Ich habe schon eine Website. Kann die modernisiert werden?",
        a: "Ja. Schreiben Sie im Anfrageformular kurz dazu, dass es um Ihre bestehende Seite geht, und nennen Sie die Adresse. Oder Sie schicken sie über die kostenlose Durchsicht. Danach sagen wir Ihnen, ob sich ein Umbau lohnt oder ein Neubau sinnvoller ist.",
      },
      {
        q: "Für welche Branchen arbeiten Sie?",
        a: "Für kleine Betriebe in ganz Deutschland, zum Beispiel Pflegedienste, Arzt- und Zahnarztpraxen, Friseure, Kosmetikstudios, Cafés und Restaurants, Handwerker, Reinigungsfirmen, Kanzleien, Fitnessstudios und kleine Hotels. Steht Ihre Branche nicht dabei, fragen Sie einfach.",
      },
      {
        q: "Was, wenn meine Domain woanders liegt?",
        a: "Dann bleibt sie in Ihrem Konto, etwa bei IONOS, Strato oder GoDaddy, und wir richten sie auf unseren Server. Wenn Sie wollen, ziehen wir die Domain auch zu uns um. Eingetragen bleibt sie immer auf Ihren Namen.",
        link: { href: "/journal/domain-hosting-ssl-email-website-was-braucht-mein-betrieb", label: "Domain, Hosting, SSL: was eine Website braucht" },
      },
      {
        q: "Was, wenn ich später woanders hin will?",
        a: "Dann übergeben wir sauber. Sie bekommen den vollständigen Quellcode Ihrer Seite und alle Inhalte und können bei einem anderen Anbieter weitermachen.",
      },
    ],
  },
];
