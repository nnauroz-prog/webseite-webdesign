/**
 * Hamburger Standorte / Stadtteile, die lokale Schicht der Seite.
 *
 * Jeder Eintrag bekommt eine eigene Seite unter /standorte/[slug]
 * und zielt auf lokale Suchen wie "Webdesign Eimsbüttel" ab. Für
 * diese Suchbegriffe ist die Konkurrenz kleiner als für
 * "Webdesign Hamburg".
 *
 * Bewusst keine Doorway-Pages: jeder Standort hat eigenen Text über
 * das Viertel, die Betriebe dort und die Branchen, die dazu passen.
 *
 * Textregeln: keine Prozentwerte oder Statistiken, keine Aussagen über
 * frühere Kunden im Viertel, keine Ranking-Versprechen. Straßen und
 * Orte müssen wirklich im jeweiligen Stadtteil oder Bezirk liegen.
 */

export type Standort = {
  slug: string;
  name: string;
  /** Ein, zwei Sätze für Kopf, Übersichtstabelle, Suche und OG-Bild. */
  tagline: string;
  /** Kurze Beschreibung des Viertels (großer Einstiegsabsatz). */
  intro: string;
  /** Zwei Absätze: wie dort gesucht wird und wie wir die Seite bauen. */
  body: string[];
  /** Straßen und Orte im Viertel (Liste „Orte im Viertel“). */
  anker: string[];
  /** Welche Sitalo-Branchen besonders zu dem Stadtteil passen. */
  empfohleneBranchen: { slug: string; label: string; warum: string }[];
  /** Randnotiz „Beobachtung“: eine konkrete Arbeitsnotiz, kein Slogan. */
  pullQuote: string;
};

export const STANDORTE: Standort[] = [
  {
    slug: "eimsbuettel",
    name: "Eimsbüttel",
    tagline:
      "Rund um Osterstraße und Eppendorfer Weg liegen Cafés, Salons und kleine Praxen dicht beieinander. Gesucht wird hier nach der Straße, nicht nach der Stadt.",
    intro: `Eimsbüttel ist dicht bebaut und dicht bewohnt. An Osterstraße, Eppendorfer Weg und Heußweg liegen Cafés, Friseure, Buchläden und Praxen oft nur ein paar Hausnummern auseinander. Wer hier etwas sucht, tippt meist den Straßennamen mit ein: „Friseur Osterstraße“ statt „Friseur Hamburg“.`,
    body: [
      "Viele Betriebe im Viertel sind klein und werden vom Inhaber selbst geführt. Die Website ist manchmal Jahre alt, die Speisekarte liegt als PDF daneben. Für die Suche im Viertel braucht es keine große Seite. Es reicht eine schnelle, aktuelle Seite mit Adresse, Öffnungszeiten und dem richtigen Straßennamen im Text.",
      "Für einen Betrieb in Eimsbüttel wählen wir die Suchbegriffe nach der Lage, also Osterstraße, Eppendorfer Weg oder Hoheluft. Diese Namen stehen im Seitentitel und im Text, damit Google Ihre Seite der richtigen Ecke zuordnet.",
    ],
    anker: [
      "Osterstraße",
      "Eppendorfer Weg",
      "Heußweg",
      "Bismarckstraße",
      "Hoheluftchaussee",
    ],
    empfohleneBranchen: [
      {
        slug: "friseur",
        label: "Friseure und Salons",
        warum:
          "Viele Salons auf engem Raum. Wer seine Arbeit in einer Galerie zeigt und eine Terminanfrage anbietet, hebt sich von der Nachbarschaft ab.",
      },
      {
        slug: "gastro",
        label: "Cafés und Restaurants",
        warum:
          "Gesucht wird oft kurzfristig, ob heute geöffnet ist. Öffnungszeiten und Tageskarte stehen deshalb ganz oben.",
      },
      {
        slug: "praxis",
        label: "Praxen und Heilpraktiker",
        warum:
          "Vor dem ersten Besuch werden Sprechzeiten, Anfahrt und Schwerpunkt geprüft. Das ist hier wichtiger als eine aufwendige Gestaltung.",
      },
    ],
    pullQuote: `Im Viertel sucht man nach „Osterstraße“, nicht nach „Hamburg“. Deshalb gehört der Straßenname in den Seitentitel.`,
  },
  {
    slug: "altona",
    name: "Altona",
    tagline:
      "Ottensen, Altona-Altstadt und Altona-Nord liegen nah beieinander, werden aber getrennt gesucht. Ihre Seite sollte den richtigen Namen tragen.",
    intro: `Zum Bezirk Altona gehören sehr unterschiedliche Ecken. Ottensen hat kleine Läden und viele Cafés, rund um den Bahnhof Altona und die Große Bergstraße ist es geschäftiger. Für die Suche zählt das: Ein Café in Ottensen wird eher unter „Café Ottensen“ gesucht als unter „Café Altona“.`,
    body: [
      `Für einen Betrieb in Altona ist die Frage deshalb weniger, ob er eine Website braucht, sondern ob er für seine Ecke gefunden wird. Gesucht wird zum Beispiel nach „Frühstück Ottensen“ oder „Friseur Bahrenfelder Straße“. Taucht Ihr Betrieb dort nicht auf, fällt er aus der Auswahl, auch wenn das Angebot gut ist.`,
      "Wir richten die Website und Ihr Google-Unternehmensprofil auf den genauen Ortsteil aus. Gebaut wird zuerst die Ansicht fürs Handy, weil in Altona viel unterwegs gesucht wird, in der S-Bahn oder auf dem Weg zum Termin.",
    ],
    anker: [
      "Ottensen",
      "Große Bergstraße",
      "Bahrenfelder Straße",
      "Mottenburg",
      "Bahnhof Altona",
    ],
    empfohleneBranchen: [
      {
        slug: "gastro",
        label: "Gastro, Bars und Cafés",
        warum:
          "Viele Lokale auf engem Raum. Wer Wochenkarte und Öffnungszeiten schnell ändern kann, ist auf der eigenen Seite aktueller als auf jedem Portal.",
      },
      {
        slug: "friseur",
        label: "Friseure und Studios",
        warum:
          "Hier wird nach Bildern entschieden. Eine gute Galerie und eine einfache Terminanfrage tragen den größten Teil der Seite.",
      },
      {
        slug: "kanzlei",
        label: "Kanzleien",
        warum:
          "Ein klar benanntes Rechtsgebiet, eine sachliche Seite und ein Hinweis zur Erstberatung. Mehr braucht es für die Suche im Bezirk selten.",
      },
    ],
    pullQuote: `Wer in Ottensen sitzt, sollte „Ottensen“ auf der Seite stehen haben. „Altona“ allein ist für die Suche zu ungenau.`,
  },
  {
    slug: "eppendorf",
    name: "Eppendorf",
    tagline:
      "Viele Praxen rund um das UKE, dazu Studios und kleine Läden. Die Kundschaft vergleicht genau, bevor sie einen Termin macht.",
    intro:
      "In Eppendorf sitzen viele Arztpraxen, nicht zuletzt wegen des Universitätsklinikums an der Martinistraße. Dazu kommen Heilpraktiker, Kosmetikstudios und Läden entlang Eppendorfer Baum und Eppendorfer Landstraße. Wer hier einen Termin sucht, sieht sich mehrere Websites an, bevor er anruft.",
    body: [
      "Der erste Eindruck von der Website zählt deshalb viel. Eine Seite, die am Handy verrutscht oder lieblos wirkt, lässt auf die Praxis oder das Studio dahinter schließen. Bei einer Kundschaft, die auf Qualität achtet, kostet das Termine.",
      "Für Praxen, Studios und Läden in Eppendorf bauen wir eher leise Seiten: ruhige Schrift, viel Platz, eine einfache Terminanfrage. Das passt zum Viertel und zu Menschen, die Zurückhaltung schätzen.",
    ],
    anker: [
      "Eppendorfer Baum",
      "Eppendorfer Marktplatz",
      "Eppendorfer Landstraße",
      "Lehmweg",
      "Martinistraße (UKE)",
    ],
    empfohleneBranchen: [
      {
        slug: "praxis",
        label: "Arzt- und Zahnarztpraxen",
        warum:
          "Neue Patient:innen informieren sich vorher im Netz. Eine sachliche Seite mit klarem Schwerpunkt und den Sprechzeiten ganz oben hilft hier am meisten.",
      },
      {
        slug: "kosmetik",
        label: "Kosmetik und Beauty",
        warum:
          "Hier zählt der Eindruck der Räume. Wir zeigen sie in einer ruhigen Galerie, auf Wunsch mit Vorher-Nachher und einer einfachen Terminanfrage.",
      },
      {
        slug: "kanzlei",
        label: "Kanzleien",
        warum:
          "Sachlich und diskret. Die Seite nennt Rechtsgebiete und Ansprechpartner und drängt sich nicht auf.",
      },
    ],
    pullQuote:
      "In Eppendorf liegt die nächste Praxis oft nur ein paar Häuser weiter. Den Vergleich ziehen Patient:innen auf der Website, vor dem ersten Anruf.",
  },
  {
    slug: "st-pauli",
    name: "St. Pauli",
    tagline:
      "Bars, Tattoo-Studios, Hostels und Restaurants rund um Reeperbahn und Hamburger Berg. Gesucht wird oft abends und meistens am Handy.",
    intro: `Auf St. Pauli suchen sehr verschiedene Leute: Gäste von außerhalb, Hamburger am Wochenende, Stammgäste aus dem Viertel. Gesucht wird oft spät und unterwegs, zum Beispiel nach „Bar mit Livemusik St. Pauli“, „Tattoo Reeperbahn“ oder „Frühstück Hamburger Berg“.`,
    body: [
      "Viele Läden hier leben von den Leuten, die sie führen. Die Website soll das zeigen, mit eigenen Fotos und Texten, die so klingen, wie hinter dem Tresen gesprochen wird. Bilder aus einer Bilddatenbank passen nicht zu einem Laden mit eigenem Gesicht.",
      "Technisch zählt vor allem, dass die Seite am Handy schnell lädt, auch wenn das Netz abends voll ist. Telefonnummer und Wegbeschreibung lassen sich antippen. Wir halten die Bilder klein und die Seite schlank.",
    ],
    anker: [
      "Reeperbahn",
      "Hamburger Berg",
      "Talstraße",
      "Hafenrand",
      "Grenze zum Schanzenviertel",
    ],
    empfohleneBranchen: [
      {
        slug: "gastro",
        label: "Bars, Restaurants und Cafés",
        warum:
          "Bilder und Stimmung entscheiden. Karte und Öffnungszeiten müssen stimmen, sonst geht der Gast zur nächsten Tür.",
      },
      {
        slug: "hotel",
        label: "Hotels und Hostels",
        warum:
          "Jede Direktbuchung spart die Provision des Portals. Die Seite macht es Gästen leicht, direkt bei Ihnen anzufragen.",
      },
      {
        slug: "kosmetik",
        label: "Tattoo- und Beauty-Studios",
        warum:
          "Das Portfolio ist das Wichtigste. Wir bauen Galerien, die auch mit großen Bildern am Handy flüssig laden.",
      },
    ],
    pullQuote:
      "Wer auf St. Pauli einen Laden mit eigenem Stil führt, braucht eine Seite in diesem Stil. Eigene Fotos tragen dazu mehr bei als jede Schrift.",
  },
  {
    slug: "winterhude",
    name: "Winterhude",
    tagline:
      "Wohnviertel zwischen Stadtpark und Goldbekkanal. Kleine Läden, Praxen und Cafés liegen am Mühlenkamp und rund um den Winterhuder Marktplatz.",
    intro:
      "Winterhude ist gutbürgerlich, ohne steif zu sein. Am Mühlenkamp und an der Sierichstraße liegen die Geschäfte, in den ruhigen Seitenstraßen kleine Praxen, Studios, Coaching-Räume und Cafés.",
    body: [
      `Wer in Winterhude einen Anbieter sucht, sieht sich meist mehrere Websites an, liest die Seite über das Team und die Bewertungen und entscheidet dann. Eine schnell zusammengeklickte Baukasten-Seite verliert dabei gegen den Mitbewerber, der erklärt, wer er ist und was er anders macht.`,
      `Die Texte für Betriebe in Winterhude schreiben wir deshalb ausführlicher: was Sie genau anbieten, wer dahintersteht und wo man Sie findet. Orte wie Mühlenkamp oder Stadtpark stehen im Text, damit die Seite nach dem Viertel klingt und auch so gefunden wird.`,
    ],
    anker: [
      "Mühlenkamp",
      "Sierichstraße",
      "Goldbekplatz",
      "Stadtpark",
      "Winterhuder Marktplatz",
    ],
    empfohleneBranchen: [
      {
        slug: "praxis",
        label: "Praxen und Coaching",
        warum:
          "Hier wird genau gelesen. Wir bauen Seiten mit ausführlichen Texten zu Schwerpunkt und Arbeitsweise.",
      },
      {
        slug: "kosmetik",
        label: "Kosmetikstudios",
        warum:
          "Die Räume verkaufen mit. Wir zeigen sie in einer ruhigen, hochwertigen Galerie.",
      },
      {
        slug: "gastro",
        label: "Cafés mit Stammgästen",
        warum: `Viele Cafés leben hier von Empfehlungen. Wir schreiben in den Texten, was Ihr Café ausmacht, und werben nicht mit Sternen.`,
      },
    ],
    pullQuote:
      "In Winterhude wird die Seite „Über uns“ tatsächlich gelesen. Ein paar echte Sätze über Sie wirken dort mehr als jedes Werbeversprechen.",
  },
  {
    slug: "bergedorf",
    name: "Bergedorf",
    tagline:
      "Hamburgs Südosten mit eigenem Zentrum am Sachsentor. Viele Betriebe sind familiengeführt, und eine gut gemachte Website fällt hier auf.",
    intro:
      "Bergedorf liegt im Südosten Hamburgs und wirkt wie eine eigene Kleinstadt, mit dem Sachsentor als Einkaufsstraße, dem Bergedorfer Schloss und einem eigenen S-Bahnhof. Die Wirtschaft ist familiengeführt: Handwerksbetriebe, Pflegedienste, Steuerberater, einige Praxen.",
    body: [
      `Wer hier etwas sucht, sucht nach „Bergedorf“ und selten nach „Hamburg“. Damit ist die Auswahl in den Suchergebnissen kleiner als in der Innenstadt. Wer einmal als verlässlicher Betrieb gilt, wird im Ort weiterempfohlen, und auch dann sehen sich die Leute die Website noch an.`,
      "Seiten für Bergedorfer Betriebe bauen wir klar und sachlich. Die Telefonnummer steht sichtbar oben, die Leistungen sind kurz beschrieben, das Einsatzgebiet ist genannt. Aufwendige Animationen lassen wir weg, sie passen nicht zur Kundschaft.",
    ],
    anker: [
      "Sachsentor",
      "Bergedorfer Schloss",
      "Alte Holstenstraße",
      "Mohnhof",
      "S-Bahnhof Bergedorf",
    ],
    empfohleneBranchen: [
      {
        slug: "handwerker",
        label: "Handwerk und Betriebe",
        warum:
          "Viele Aufträge kommen über Empfehlungen, neue Kund:innen schauen trotzdem online nach. Referenzbilder und ein klar genanntes Einsatzgebiet beantworten ihre ersten Fragen.",
      },
      {
        slug: "pflege",
        label: "Pflegedienste",
        warum:
          "Angehörige suchen im Ort. Eine sichtbare Notfallnummer und ein Bewerbungsformular für Pflegekräfte gehören auf die Seite.",
      },
      {
        slug: "kanzlei",
        label: "Steuer- und Anwaltskanzleien",
        warum:
          "Familienbetriebe suchen Beratung vor Ort. Eine Seite mit klarem Schwerpunkt und Sprechzeiten zeigt, dass Sie zuständig sind.",
      },
    ],
    pullQuote:
      "Hochglanz wirkt in Bergedorf schnell fremd. Eine sachliche Seite mit der Telefonnummer oben passt besser zu den Betrieben hier.",
  },
  {
    slug: "harburg",
    name: "Harburg",
    tagline:
      "Südlich der Elbe, mit Binnenhafen, Phoenix-Viertel und der TU Hamburg. Viele Handwerks- und Gewerbebetriebe arbeiten von hier aus für den ganzen Süden.",
    intro:
      "Harburg hat eine eigene Mitte mit der Lüneburger Straße, dem Phoenix-Viertel und dem Binnenhafen. An der Schwarzenbergstraße sitzt die Technische Universität Hamburg. Dazu kommen viele mittelständische Betriebe und Handwerker, die den Hamburger Süden und das Umland bedienen.",
    body: [
      `Gesucht wird in Harburg oft ganz praktisch: „Schlosser Harburg“, „Werkstatt Phoenix-Viertel“, „Steuerberater Heimfeld“. Unter den Treffern stehen dann häufig Branchenbuch-Einträge und Seiten, aus denen nicht klar wird, was der Betrieb eigentlich macht.`,
      "Seiten für Betriebe in Harburg bauen wir mit klar beschriebenen Leistungen, einem genannten Einsatzgebiet und kurzen Wegen zum Kontakt. Das Einsatzgebiet reicht oft über die Stadtgrenze in den Landkreis Harburg. Die Telefonnummer lässt sich am Handy antippen, die Adresse öffnet die Karte.",
    ],
    anker: [
      "Phoenix-Viertel",
      "Sandtorpark",
      "Lüneburger Straße",
      "Schwarzenbergstraße",
      "Binnenhafen",
    ],
    empfohleneBranchen: [
      {
        slug: "handwerker",
        label: "Handwerk und Werkstätten",
        warum:
          "Viele arbeiten im ganzen Süden Hamburgs und im Umland. Eine Karte mit dem Einsatzgebiet und eine Rückrufbitte sparen Telefonate mit Leuten, zu denen Sie nicht fahren.",
      },
      {
        slug: "reinigung",
        label: "Reinigungsfirmen",
        warum:
          "Büro- und Gewerbereinigung wird im Süden viel gesucht. Klar beschriebene Pakete und ein Hinweis auf den Notdienst heben Sie vom Branchenbuch ab.",
      },
      {
        slug: "fitness",
        label: "Fitness- und Sportstudios",
        warum:
          "Studierende und junge Familien suchen ein Studio in der Nähe. Eine Seite mit der Anfrage fürs Probetraining auf der Startseite passt dazu.",
      },
    ],
    pullQuote:
      "In Harburg zählt, was Sie machen und wohin Sie fahren. Steht beides oben auf der Seite, ist das Wichtigste gesagt.",
  },
  {
    slug: "wandsbek",
    name: "Wandsbek",
    tagline:
      "Großer Bezirk von Marienthal bis Rahlstedt, mit vielen kleinen Familienbetrieben. Gesucht wird nach dem eigenen Stadtteil, nicht nach dem Bezirk.",
    intro:
      "Wandsbek ist der Bezirk mit den meisten Einwohnern in Hamburg und reicht vom Wandsbeker Markt bis nach Rahlstedt. In jedem Stadtteil gibt es eigene Friseure, Praxen, Reinigungsfirmen und Steuerberater. Viele davon sind kleine Familienbetriebe.",
    body: [
      `Gesucht wird in Wandsbek sehr lokal, nach „Friseur Marienthal“ oder „Praxis Rahlstedt“. Der Bezirk zerfällt damit in viele kleine Suchgebiete, und in jedem davon ist die Auswahl überschaubar.`,
      `Wir richten die Seite deshalb auf den Stadtteil aus, in dem Sie sitzen. Eine Friseur-Seite in Marienthal nennt „Marienthal“ und „Wandsbek Markt“ im Text und nicht nur „Hamburg“. So finden Sie die Kund:innen, die wirklich in der Nähe wohnen.`,
    ],
    anker: [
      "Wandsbeker Marktstraße",
      "Wandsbek Markt",
      "Marienthal",
      "Rahlstedt",
      "Tonndorf",
    ],
    empfohleneBranchen: [
      {
        slug: "friseur",
        label: "Friseure und Salons",
        warum:
          "Viele kleine Salons in den Stadtteilen. Eine Seite mit Terminanfrage und dem richtigen Stadtteilnamen hilft bei der Suche im Viertel.",
      },
      {
        slug: "praxis",
        label: "Arzt- und Zahnarztpraxen",
        warum:
          "Viele Praxen haben einen festen Stamm an Patient:innen. Für neue braucht es eine Seite mit Sprechzeiten, Anfahrt und Schwerpunkten.",
      },
      {
        slug: "reinigung",
        label: "Reinigungsfirmen",
        warum:
          "Büro- und Praxisreinigung wird im Bezirk gesucht. Klare Preisangaben und ein gutes Anfrageformular heben Sie ab.",
      },
    ],
    pullQuote: `Wandsbek ist kein einzelner Markt, sondern viele kleine. Jeder Stadtteil wird für sich gesucht, also bekommt er auf Ihrer Seite seinen Namen.`,
  },
  {
    slug: "barmbek",
    name: "Barmbek",
    tagline:
      "Dichtes Wohngebiet zwischen Stadtpark und Osterbekkanal. Bäcker, Friseure und Praxen werden hier in der eigenen Straße gesucht.",
    intro:
      "Barmbek-Nord und Barmbek-Süd sind dicht bewohnt. Die Hamburger Straße ist die große Einkaufsachse, an Fuhlsbüttler Straße, Habichtstraße und Dehnhaide liegen viele kleine Geschäfte. Gesucht wird sehr nah: der Friseur in der eigenen Straße, nicht irgendwo in der Stadt.",
    body: [
      `Viele alteingesessene Betriebe in Barmbek, ob Bäcker, Schuster oder Hausarztpraxis, setzen auf Schaufenster und Empfehlungen. Eine eigene Website fehlt oft ganz. Wer eine hat, wird bei der Suche gefunden und lässt sich leichter weiterempfehlen, weil man einfach einen Link schicken kann.`,
      "Seiten für Barmbeker Betriebe bauen wir schlicht: Öffnungszeiten, Telefonnummer und Leistungen gut sichtbar. Die Kundschaft achtet auf den Preis und will schnell wissen, woran sie ist. Effekte braucht es dafür nicht.",
    ],
    anker: [
      "Hamburger Straße",
      "Fuhlsbüttler Straße",
      "Habichtstraße",
      "Dehnhaide",
      "Mundsburger Damm",
    ],
    empfohleneBranchen: [
      {
        slug: "friseur",
        label: "Friseure und Salons",
        warum:
          "Viele Salons mit Stammkundschaft. Für neue Kund:innen, die kurzfristig einen Termin suchen, macht die Terminanfrage auf der Seite den Unterschied.",
      },
      {
        slug: "praxis",
        label: "Hausarzt- und Zahnarztpraxen",
        warum:
          "Familien suchen in der Nähe. Sprechzeiten, Anfahrt und Schwerpunkte reichen, solange man sie leicht findet.",
      },
      {
        slug: "gastro",
        label: "Bäcker, Cafés und Imbisse",
        warum: `Gesucht wird nach „Bäcker Barmbek“ oder „Café Habichtstraße“. Für kleine Betriebe reicht dafür oft eine einzelne, gut gemachte Seite.`,
      },
    ],
    pullQuote:
      "In Barmbek kennt man sich. Eine Seite, die mehr verspricht, als der Laden hält, fällt hier schnell auf.",
  },
  {
    slug: "bramfeld",
    name: "Bramfeld",
    tagline:
      "Wohngegend im Hamburger Nordosten mit der Bramfelder Chaussee als Hauptstraße. Viele Handwerksbetriebe und Familienpraxen sind seit Langem am Ort.",
    intro:
      "Bramfeld ist Wohngebiet im Nordosten Hamburgs, mit der Bramfelder Chaussee als Hauptstraße. Entlang der Chaussee, der Fabriciusstraße und der Steilshooper Straße sitzen Handwerksbetriebe, Werkstätten, Friseure und Praxen. Die Kundschaft ist eher älter und bleibt ihren Betrieben treu. Mit jeder neuen Generation wird aber mehr online gesucht.",
    body: [
      `Gesucht wird in Bramfeld pragmatisch: „Schlosser Bramfeld“, „Praxis Bramfelder Chaussee“, „Friseur Bramfeld“. Unter den Treffern finden sich viele Branchenbuch-Einträge und ältere Baukasten-Seiten. Eine klare, aktuelle Seite hat hier gute Chancen, weit oben zu stehen.`,
      "Für Bramfelder Betriebe bauen wir zurückhaltend: solide Schrift, klare Gliederung, die Telefonnummer gut sichtbar. Viel Bewegung auf der Seite wirkt hier eher fremd als hochwertig.",
    ],
    anker: [
      "Bramfelder Chaussee",
      "Bramfelder See",
      "Fabriciusstraße",
      "Steilshooper Straße",
      "Bramfelder Dorfplatz",
    ],
    empfohleneBranchen: [
      {
        slug: "handwerker",
        label: "Handwerk und Werkstätten",
        warum:
          "Viele Betriebe sind lange am Ort. Neue Kund:innen fragen nicht mehr den Nachbarn, sondern suchen online. Einsatzgebiet, Notdienst und Referenzbilder beantworten ihre ersten Fragen.",
      },
      {
        slug: "praxis",
        label: "Familien- und Zahnarztpraxen",
        warum:
          "Stammpatient:innen bleiben, neue suchen online. Sprechzeiten, Vertretung im Notdienst und Anfahrt reichen dafür.",
      },
      {
        slug: "friseur",
        label: "Friseure und Kosmetik",
        warum:
          "Hier zählt Verlässlichkeit. Eine Seite mit Terminanfrage, Galerie und einer klaren Beschreibung des Salons genügt.",
      },
    ],
    pullQuote:
      "In Bramfeld zählt der Ruf im Ort. Die Website soll ihn bestätigen und ihm nicht mit Effekten im Weg stehen.",
  },
  {
    slug: "niendorf",
    name: "Niendorf",
    tagline:
      "Ruhiges Wohnviertel im Nordwesten mit dem Tibarg als Einkaufsstraße. Hier wird gründlich verglichen, bevor jemand einen Termin macht.",
    intro:
      "Niendorf liegt im Nordwesten Hamburgs. Der Tibarg ist die Einkaufsstraße, rund um den Niendorfer Markt liegt der alte Ortskern. Hier wohnen viele Familien und Selbstständige, und es gibt viele Praxen, Kosmetikstudios und kleine Kanzleien.",
    body: [
      `Wer in Niendorf einen Anbieter sucht, nimmt sich Zeit. Man vergleicht zwei, drei Websites, liest Bewertungen und die Seite über das Team. Eine Seite ohne Bilder oder eine, der man den Baukasten ansieht, scheidet dabei früh aus, auch wenn der Betrieb gut ist.`,
      `Für Niendorfer Betriebe bauen wir ruhige Seiten mit vielen Details: eine ordentliche Teamseite, Orte wie Tibarg oder Garstedter Weg im Text und eine Anfahrt mit Hinweis auf Parkplätze.`,
    ],
    anker: [
      "Tibarg",
      "Niendorfer Markt",
      "Garstedter Weg",
      "Niendorfer Gehege",
      "Sootbörn",
    ],
    empfohleneBranchen: [
      {
        slug: "praxis",
        label: "Privatpraxen und Fachärzte",
        warum:
          "Patient:innen vergleichen hier Qualifikationen. Eine klare Seite mit Schwerpunkten, Fotos vom Team und Anfahrt spricht Privat- und Kassenpatient:innen an.",
      },
      {
        slug: "kosmetik",
        label: "Kosmetik- und Beauty-Studios",
        warum:
          "Ruhige Galerien, auf Wunsch mit Vorher-Nachher, verständliche Beschreibungen der Behandlungen und eine einfache Terminanfrage.",
      },
      {
        slug: "kanzlei",
        label: "Steuer- und Anwaltskanzleien",
        warum:
          "Selbstständige und Familien mit Erbschaftsfragen suchen Beratung vor Ort. Eine sachliche Seite nennt klar, wofür Sie zuständig sind.",
      },
    ],
    pullQuote:
      "In Niendorf liest man die Teamseite, bevor man anruft. Fotos und ein paar Sätze zu jeder Person gehören hier dazu.",
  },
  {
    slug: "hafencity",
    name: "HafenCity",
    tagline:
      "Hamburgs jüngster Stadtteil, vom Sandtorhafen bis zum Überseequartier. Hier sitzen Beratungen, Architekturbüros und Restaurants am Wasser.",
    intro:
      "Die HafenCity ist neu gebaut und dicht. Neben Beratungen und Architekturbüros sitzen hier Fachärzte, gehobene Restaurants und einige kleine Hotels. Die Zahl der Betriebe ist überschaubar, die Ansprüche an ihren Auftritt sind hoch.",
    body: [
      `Gesucht wird hier oft von Unternehmen: „Architekt HafenCity“, „Steuerberater Speicherstadt“, „Restaurant Hafenkante“. Weil der Stadtteil jung ist, gibt es noch nicht viele Treffer. Wer aber gefunden wird, wird an gut gemachten Unterlagen gemessen, denn die ist die Kundschaft gewohnt.`,
      `Für Betriebe in der HafenCity bauen wir Seiten mit ruhiger Schrift, guten Bildern und präzisen Texten. Hier passt oft Sitalo Studio, die Stufe mit eigener Gestaltung von Grund auf.`,
    ],
    anker: [
      "Magellan-Terrassen",
      "Marco-Polo-Tower",
      "Überseequartier",
      "Speicherstadt",
      "Sandtorhafen",
    ],
    empfohleneBranchen: [
      {
        slug: "kanzlei",
        label: "Kanzleien und Beratungen",
        warum:
          "Viele Wirtschaftskanzleien und Beratungen sitzen hier. Ein klares Profil mit Schwerpunkten und Team hilft, wenn Mandant:innen nach einer Empfehlung nachsehen.",
      },
      {
        slug: "gastro",
        label: "Restaurants und Bars am Wasser",
        warum:
          "Gehobene Gastronomie mit Reservierungen. Die Bilder tragen hier mehr als jeder Text auf der Karte.",
      },
      {
        slug: "hotel",
        label: "Hotels und Apartments",
        warum:
          "Jede Direktbuchung spart die Provision des Portals. Dafür braucht es eine schnelle Seite mit guten Bildern und einer einfachen Anfrage.",
      },
    ],
    pullQuote:
      "In der HafenCity wird oft am Schreibtisch gesucht, nicht nur am Handy. Die Seite muss auf dem großen Bildschirm genauso sorgfältig aussehen.",
  },
];

export function getStandortBySlug(slug: string): Standort | undefined {
  return STANDORTE.find((s) => s.slug === slug);
}

export function getAllStandortSlugs(): string[] {
  return STANDORTE.map((s) => s.slug);
}

/**
 * Stadtteile finden, in denen die übergebene Branche zu den
 * `empfohleneBranchen` zählt. Wird für die Verlinkung von
 * /branchen/[slug] auf die Stadtteilseiten genutzt.
 */
export function getStandorteForBranche(brancheSlug: string): Standort[] {
  return STANDORTE.filter((s) =>
    s.empfohleneBranchen.some((b) => b.slug === brancheSlug),
  );
}
