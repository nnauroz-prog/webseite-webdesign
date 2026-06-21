/**
 * Hamburger Standorte / Stadtteile — Long-Tail-SEO-Schicht.
 *
 * Jeder Eintrag bekommt eine eigene Seite unter /standorte/[slug]
 * und zielt auf lokale Suchen wie "Webdesign Eimsbüttel" ab. Für
 * diese Phrasen ist die Konkurrenz deutlich kleiner als für
 * "Webdesign Hamburg", die Klick-Wahrscheinlichkeit höher und die
 * Anfrage-Qualität besser (lokale Suchende konvertieren).
 *
 * Bewusst keine Doorway-Pages: jeder Standort hat eigenen,
 * substanziellen Text über das Viertel, die typischen Betriebe
 * dort und welche Branchen wir für die Gegend empfohlen.
 */

export type Standort = {
  slug: string;
  name: string;
  /** Subtitle für Hero + OG. */
  tagline: string;
  /** Kurze Charakterisierung des Viertels. */
  intro: string;
  /** 2–3 Absätze: was läuft dort gerade, wer braucht eine Website. */
  body: string[];
  /** Typische Anker-Straßen / Orte (für lokale Konkretheit). */
  anker: string[];
  /** Welche Sitalo-Branchen passen besonders zu dem Stadtteil. */
  empfohleneBranchen: { slug: string; label: string; warum: string }[];
  /** Pull-Quote für Editorial-Akzent. */
  pullQuote: string;
};

export const STANDORTE: Standort[] = [
  {
    slug: "eimsbuettel",
    name: "Eimsbüttel",
    tagline:
      "Cafés, kleine Praxen, kreative Werkstätten — und überraschend wenig sichtbar.",
    intro: `Eimsbüttel ist eines der lebendigsten Hamburger Viertel — Osterstraße, Eppendorfer Weg, Heußweg. Dichte Mischung aus Gastro, kleinen Praxen, Friseuren und Boutiquen. Auf 100 Metern findet man drei Cafés, zwei Heilpraktiker und einen Buchladen. Aber: wenn man bei Google „Friseur Eimsbüttel" tippt, sieht man fünf Einträge mit veralteten Websites — und alle bekommen Termine.`,
    body: [
      `Die meisten Eimsbüttler Betriebe sind klein, persönlich geführt und qualitativ stark — aber online unterrepräsentiert. Eine 2017er-Website mit PDF-Speisekarte ist hier eher Norm als Ausnahme. Das ist eine Chance: für lokale Suchen reicht eine moderne, schnelle Seite, um direkt im Top-3 zu landen.`,
      `Wir kennen das Viertel. Wir haben hier viel Zeit verbracht. Bei einer Sitalo-Website für Eimsbüttel bauen wir nicht nur die Seite — wir wählen die Suchbegriffe so, dass Sie für „Friseur Osterstraße" oder „Café Eppendorfer Weg" gefunden werden, nicht nur für allgemeines „Webdesign Hamburg".`,
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
        label: "Friseure & Salons",
        warum:
          "Hohe Dichte, viele junge Kunden, Optik entscheidet. Mit guter Galerie + Online-Termin gewinnt man die Stadtteil-Suche.",
      },
      {
        slug: "gastro",
        label: "Cafés & Restaurants",
        warum: `Speisekarte muss aktuell sein. Eimsbüttler suchen gezielt nach „heute geöffnet" — wer das nicht zeigt, wird übersprungen.`,
      },
      {
        slug: "praxis",
        label: "Arztpraxen & Heilpraktiker",
        warum:
          "Patienten googeln vor jedem Erstbesuch. Saubere Sprechzeiten + Anfahrt + Spezialisierung sind hier wichtiger als Hochglanz-Design.",
      },
    ],
    pullQuote:
      "Wer in Eimsbüttel online sichtbar ist, gewinnt — auch wenn der bessere Anbieter zwei Straßen weiter sitzt.",
  },
  {
    slug: "altona",
    name: "Altona",
    tagline: `Urban, gemischt, lebendig. Vom Bahnhof Altona bis nach Ottensen — und niemand sucht „Webdesign", alle suchen „Restaurant Ottensen".`,
    intro:
      "Altona ist Hamburg im Konzentrat: vom Bahnhof bis Ottensen mischen sich Gastro, Werkstätten, Boutiquen, Kanzleien und Kreativ-Studios auf engstem Raum. Ottensen hat den Boutique-Charakter, der Bahnhofsbereich die Hektik. Beide Lagen bedeuten: dichte Suche pro Quadratmeter, hoher Wettbewerb in der echten Welt — und überraschend offene Suchergebnisse online.",
    body: [
      `Für Altonaer Betriebe ist die wichtigste Frage nicht „brauche ich eine Website?", sondern „werde ich für meine Straße gefunden?". Jemand sucht nach „Tattoo Ottensen", „Friseur Bahrenfelder Straße", „Frühstück Altona". Wenn Sie für genau diese Begriffe nicht erscheinen, sind Sie raus — selbst wenn Sie das beste Angebot in der Gegend haben.`,
      `Wir bauen Altonaer Websites genau darauf zugeschnitten: lokale Keywords pro Stadtteilteil, Google-Business-Profil-optimiert, mobile First (weil 80 % der Suchen unterwegs passieren). Anfragen kommen über das Handy in der Bahn oder auf der Reeperbahn, nicht vom Bürorechner.`,
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
        label: "Gastro, Bars & Cafés",
        warum:
          "Höchste Dichte in Hamburg. Wer die Wochenkarte selbst pflegen kann, gewinnt — wir bauen das ohne CMS-Bürokratie.",
      },
      {
        slug: "friseur",
        label: "Friseure & Studios",
        warum:
          "Optik-getrieben, jung. Eine hochwertige Galerie plus Termin-Anfrage hebt Sie aus der Masse.",
      },
      {
        slug: "kanzlei",
        label: "Kleine Kanzleien",
        warum:
          "Altona ist Anwaltsdichte-Spitze. Ein klares Rechtsgebiet, seriöses Design und Erstberatungs-Anker reichen, um lokal sichtbar zu sein.",
      },
    ],
    pullQuote: `Altonaer Suchen sind hyperlokal. Wer nur „Hamburg" optimiert hat, verliert gegen den Betrieb, der „Ottensen" optimiert hat.`,
  },
  {
    slug: "eppendorf",
    name: "Eppendorf",
    tagline:
      "Gehoben, ruhig, viele Praxen — und ein Publikum, das genau hinschaut.",
    intro:
      "Eppendorf ist Hamburgs Praxis-Bezirk. Mit dem UKE als Anker konzentrieren sich Ärzte, Heilpraktiker, Beauty-Studios und Boutiquen entlang Eppendorfer Baum und Klosterstern. Der typische Kunde hier ist kaufkräftig, anspruchsvoll und vergleicht — bevor er einen Termin macht, bevor er bestellt.",
    body: [
      "Für Eppendorfer Anbieter zählt der erste Eindruck mehr als anderswo. Die 75 %-Regel von Stanford (drei Viertel beurteilen einen Anbieter nach dem Website-Design) trifft hier doppelt — eine billige Seite kostet hier nicht nur Vertrauen, sondern ist auch wirtschaftlich teuer, weil das Eppendorfer Publikum gut zahlt.",
      "Wir bauen für Eppendorfer Praxen, Boutiquen und Studios bewusst leise: ruhige Typografie, saubere Buchung, weniger Marketing-Lärm. Das passt zum Stadtteil und signalisiert genau die Diskretion, die hier erwartet wird.",
    ],
    anker: [
      "Eppendorfer Baum",
      "Klosterstern",
      "Eppendorfer Landstraße",
      "Lehmweg",
      "Martinistraße (UKE)",
    ],
    empfohleneBranchen: [
      {
        slug: "praxis",
        label: "Arzt- und Zahnarztpraxen",
        warum:
          "Eppendorf-Praxen suchen Patienten, die online recherchieren. Eine seriöse Seite mit klarer Spezialisierung gewinnt.",
      },
      {
        slug: "kosmetik",
        label: "Kosmetik & Beauty",
        warum:
          "Hier zählt Atmosphäre. Wir bauen Galerien mit Vorher/Nachher, ruhige Termin-Buchung, kein Schnickschnack.",
      },
      {
        slug: "kanzlei",
        label: "Kanzleien",
        warum:
          "Diskret, sachlich, kompetent. Eppendorfer Kanzleien wollen vor allem nicht aufdringlich wirken — wir bauen genau das.",
      },
    ],
    pullQuote:
      "In Eppendorf signalisiert eine billig wirkende Website: hier ist auch sonst nichts auf der Höhe. Das Publikum zieht weiter.",
  },
  {
    slug: "st-pauli",
    name: "St. Pauli",
    tagline:
      "Bunt, laut, eigen. Tattoo-Studios, Bars, Hostels, Restaurants — und Suchanfragen, die nie schlafen.",
    intro: `St. Pauli funktioniert online anders als andere Hamburger Viertel. Touristen, Wochenend-Hamburger, Stammgäste, Kiez-Insider — alle suchen unterschiedliche Begriffe, oft auf dem Handy, oft nachts. „Bar mit Live-Musik St. Pauli", „Tattoo-Studio Reeperbahn", „Frühstück nach Reeperbahn-Tour" sind reale Queries.`,
    body: [
      "St. Pauli-Betriebe sind oft persönlichkeitsgetrieben — Inhaber sind Persönlichkeiten, Stil ist eigenwillig, Branding ist nicht austauschbar. Genau das soll die Website transportieren: keine Stock-Bilder, keine 0815-Vorlage, kein Corporate-Speak. Wir setzen darauf, dass der Charakter Ihres Ladens auf der Seite spürbar wird.",
      "Technisch zählt auf St. Pauli vor allem: Mobile First (alle suchen unterwegs), schnelle Ladezeiten (3G mitten zwischen Reeperbahn-Häusern ist Realität), Direktwahl-Knopf, Google-Maps. Wir bauen die Seiten so, dass sie auch im schlechtesten Netz funktionieren.",
    ],
    anker: [
      "Reeperbahn",
      "Hamburger Berg",
      "Talstraße",
      "Hafenrand",
      "Schanzenviertel-Grenze",
    ],
    empfohleneBranchen: [
      {
        slug: "gastro",
        label: "Bars, Restaurants & Cafés",
        warum:
          "Hier entscheiden Bilder und Atmosphäre. Speisekarte muss tagesaktuell sein, sonst klickt der Kiez-Tourist weiter.",
      },
      {
        slug: "hotel",
        label: "Boutique-Hotels & Hostels",
        warum:
          "Direktbuchung ohne Booking.com-Provision spart 15–18 %. Wir bauen die Seite so, dass Gäste direkt anfragen.",
      },
      {
        slug: "kosmetik",
        label: "Tattoo & Beauty-Studios",
        warum:
          "Portfolio ist alles. Wir bauen Galerien, die laden — auch wenn das Bild 4 MB groß ist, soll's flüssig wirken.",
      },
    ],
    pullQuote:
      "Auf St. Pauli zählt Persönlichkeit. Eine Template-Website signalisiert: hier ist eigentlich nichts Besonderes.",
  },
  {
    slug: "winterhude",
    name: "Winterhude",
    tagline:
      "Boutique-Charakter zwischen Stadtpark und Goldbekkanal. Familien, Selbstständige, kleine Geschäfte.",
    intro:
      "Winterhude ist der Stadtteil zwischen Hochschicht und Studentenmilieu — gehoben, aber nicht abgehoben. Mühlenkamp und Sierichstraße sind die Handelsachsen, dazwischen ruhige Wohnstraßen mit kleinen Praxen, Boutiquen, Coaching-Räumen, Cafés.",
    body: [
      `Winterhude-Kunden recherchieren gründlich. Sie googeln drei Anbieter, schauen sich alle drei Websites an, lesen das „Über uns", checken Bewertungen — und entscheiden dann. Wer mit einer hingeworfenen Wix-Seite antritt, verliert hier zuverlässig gegen den Wettbewerber, der eine echte Geschichte erzählt.`,
      `Wir bauen für Winterhuder Anbieter Seiten, die Substanz haben: klare Spezialisierung, persönliche Tonalität, lokale Anker (Mühlenkamp, Sierichstraße, Stadtpark) in den Texten. Das macht den Unterschied zwischen „könnte irgendwo sein" und „kennen wir aus dem Viertel".`,
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
        label: "Praxen & Coaching",
        warum:
          "Winterhuder Kunden suchen Substanz, nicht Marketing. Wir bauen Seiten mit Tiefe statt Schaufenster-Charakter.",
      },
      {
        slug: "kosmetik",
        label: "Kosmetik-Studios",
        warum:
          "Hier zählt das Atmosphäre-Bild fast mehr als der Service. Wir bauen ruhige, hochwertige Galerien.",
      },
      {
        slug: "gastro",
        label: "Cafés mit Charakter",
        warum: `Winterhuder Cafés profitieren von „Geheimtipp"-Charakter. Wir transportieren das in den Texten, nicht in Sterne-Werbung.`,
      },
    ],
    pullQuote:
      "In Winterhude verliert man gegen den Wettbewerber, der eine echte Geschichte erzählt — nicht gegen den mit dem größten Werbe-Budget.",
  },
  {
    slug: "bergedorf",
    name: "Bergedorf",
    tagline:
      "Hamburgs südöstliches Tor — solide Familienbetriebe, Handwerk, kleine Praxen. Hier wirkt eine ordentliche Website wie ein Wettbewerbsvorteil.",
    intro:
      "Bergedorf hat den Charakter einer kleinen eigenständigen Stadt — Sachsentor, Bergedorfer Schloss, eigener S-Bahnhof. Die Wirtschaft ist familiengeführt: Handwerker, Pflegedienste, Steuerberater, eine handvoll Praxen. Hier sind 2015er-Websites die Norm. Wer eine moderne Seite hat, sticht sofort heraus.",
    body: [
      `Bergedorfer Kunden bleiben lokal — sie googeln nicht „Hamburg", sie googeln „Bergedorf". Das macht die Konkurrenz im Suchergebnis überschaubar, aber die Kunden-Loyalität bemerkenswert hoch: wer einmal als seriöser Anbieter wahrgenommen wird, bekommt Empfehlungen über mehrere Generationen.`,
      "Wir bauen Bergedorfer Seiten bewusst klar und vertrauensbildend. Keine Hipster-Optik, keine ausufernden Animationen — sondern saubere Struktur, sichtbare Telefonnummer, klare Leistungsbeschreibung. Das passt zur Klientel und gewinnt die lokale Suche.",
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
        label: "Handwerker & Betriebe",
        warum:
          "Hier wird viel über Mund-zu-Mund vergeben, aber neue Kunden googeln. Eine seriöse Seite mit Referenzbildern + Einsatzgebiet-Karte gewinnt sofort.",
      },
      {
        slug: "pflege",
        label: "Pflegedienste",
        warum:
          "Angehörige in Bergedorf suchen lokal. Bewerbungsformular für Pflegekräfte + sichtbare Notfall-Nummer machen den Unterschied.",
      },
      {
        slug: "kanzlei",
        label: "Steuer- & Anwaltskanzleien",
        warum:
          "Familienbetriebe brauchen Steuerberater vor Ort. Eine klare Spezialisierung und Erreichbarkeit zeigen, dass man der Richtige ist.",
      },
    ],
    pullQuote:
      "Bergedorfer Kunden vergleichen drei Anbieter — und nehmen den mit dem solidesten Auftritt. Hochglanz schadet eher.",
  },
  {
    slug: "harburg",
    name: "Harburg",
    tagline:
      "Süd-Hamburg, eigenständig, industriell geprägt. Werkstätten, Handwerk, Logistik — und ein Markt, in dem man mit einer guten Seite weit kommt.",
    intro:
      "Harburg ist Hamburgs südlicher Anker — Phoenix-Viertel, Sandtorpark, Binnenhafen. Der Stadtteil hat eine eigene Identität, eine eigene TU (TU Hamburg-Harburg) und eine starke industrielle Tradition. Hier sitzen viele mittelständische Betriebe und Handwerker, die online noch kaum sichtbar sind.",
    body: [
      `Harburger Suchen sind oft B2B-getrieben oder lokal-praktisch: „Schlosser Harburg", „Werkstatt Phoenix-Viertel", „Steuerberater Heimfeld". Für diese Begriffe gibt es selten ernste Suchergebnisse — vier von fünf Treffern sind Branchenbuch-Einträge oder Wix-Seiten ohne klare Botschaft.`,
      "Wir bauen Harburger Seiten mit Fokus auf konkretes Leistungsangebot, Einsatzgebiet (oft Süd-Hamburg + Speckgürtel), und schnelle Kontaktwege. Mobile First, weil 70 % der Anfragen vom Handy aus dem Auto kommen. Direktwahl-Knopf prominent, Adresse auf Maps.",
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
        label: "Handwerker & Werkstätten",
        warum:
          "Harburger Handwerker bedienen Süd-Hamburg + Speckgürtel. Eine klare Einsatzgebiet-Karte plus Rückruf-Anfrage spart Telefon-Zeit und gewinnt Aufträge.",
      },
      {
        slug: "reinigung",
        label: "Reinigungsfirmen",
        warum:
          "Industrie- und Büroreinigung ist im Süden gefragt. Mit klaren Service-Paketen und Notdienst-Hinweis hebt man sich vom Branchenbuch-Mittelmaß ab.",
      },
      {
        slug: "fitness",
        label: "Fitness- & Sportstudios",
        warum:
          "TU Harburg + junge Familien sorgen für Bedarf. Eine moderne Seite mit Probetraining-Anker konvertiert besser als die übliche Studio-Vorlage.",
      },
    ],
    pullQuote:
      "Harburger Kunden googeln pragmatisch. Wer klar sagt, was er macht und wo er hinkommt, gewinnt — auch ohne Hochglanz.",
  },
  {
    slug: "wandsbek",
    name: "Wandsbek",
    tagline:
      "Großer Wandsbeker Bezirk — von Marienthal bis Rahlstedt. Mittelschicht-Hamburg, sehr lokaler Suchverhalten, viele kleine Familienbetriebe.",
    intro:
      "Wandsbek ist Hamburgs flächenmäßig größter Bezirk und gleichzeitig der unterrepräsentierteste online. Wandsbeker Marktplatz, Markt, Marienthal, Rahlstedt — überall sitzen Friseure, kleine Praxen, Reinigungsfirmen, Steuerberater. Die meisten haben entweder gar keine Website oder eine Wix-Seite von 2018.",
    body: [
      `Wandsbeker Kunden sind extrem lokal — sie suchen „Friseur Marienthal" oder „Praxis Rahlstedt", nicht „Hamburg". Das macht den Markt aufgesplittert in kleine, sehr gewinnbare Sub-Märkte. Wer für drei dieser Mikro-Phrasen sichtbar ist, hat seine Auftragsbücher voll.`,
      `Wir bauen Wandsbeker Seiten gezielt auf Sub-Stadtteile zugeschnitten. Eine Friseur-Seite, die nicht „Friseur Hamburg" optimiert, sondern „Friseur Marienthal" + „Friseur Wandsbeker Marktplatz", gewinnt die richtigen Kunden — die, die wirklich in der Nähe wohnen und kommen.`,
    ],
    anker: [
      "Wandsbeker Marktplatz",
      "Wandsbek Markt",
      "Marienthal",
      "Rahlstedt",
      "Tonndorf",
    ],
    empfohleneBranchen: [
      {
        slug: "friseur",
        label: "Friseure & Salons",
        warum:
          "Sehr viele kleine Familien-Salons. Eine moderne Seite mit Online-Termin gewinnt die Marienthal/Rahlstedt-Suche fast automatisch.",
      },
      {
        slug: "praxis",
        label: "Arzt- und Zahnarztpraxen",
        warum:
          "Wandsbeker Praxen sind oft etablierte Familienpraxen mit Stammpatienten. Die Online-Sichtbarkeit für Neupatienten ist ausbaufähig.",
      },
      {
        slug: "reinigung",
        label: "Reinigungsfirmen",
        warum:
          "Büro- und Praxisreinigung im Bezirk ist gefragt. Mit klaren Preispaketen + Anfrage-Formular sticht man aus der Wix-Konkurrenz heraus.",
      },
    ],
    pullQuote: `Wandsbek ist nicht „ein Markt", sondern zwanzig kleine. Wer das versteht, gewinnt sie einzeln.`,
  },
  {
    slug: "barmbek",
    name: "Barmbek",
    tagline:
      "Dichte Familien-Wohngegend zwischen Stadtpark und U-Bahn Habichtstraße — Bäcker, Friseure, Praxen, sehr lokale Suchmuster.",
    intro:
      "Barmbek-Nord und Barmbek-Süd zusammen sind eines der dichtbesiedeltsten Wohngebiete Hamburgs. Hamburger Straße als Einkaufsachse, Hartzloh-Quartier mit alteingesessenen Familienbetrieben, Dehnhaide mit jüngerem Gastro-Mix. Die typische Anfrage ist hyperlokal: man sucht den Friseur in der eigenen Straße, nicht in der Stadt.",
    body: [
      `Barmbeker Betriebe leiden besonders unter „Wir-haben-keine-Website"-Realität — viele Stamm-Familien-Betriebe (Bäcker, Schuster, kleine Praxen) verlassen sich noch auf Schaufenster und Mund-zu-Mund. Wer hier eine moderne Seite hat, gewinnt nicht nur Online-Suchen, sondern wird auch von den Nachbar-Empfehlern leichter weitergeleitet.`,
      "Wir bauen Barmbeker Seiten ohne Hipster-Filter: klare Öffnungszeiten, sichtbare Telefonnummer, klare Leistungen. Die Klientel ist preisbewusst und schätzt Klarheit mehr als Coolness — was perfekt zum Sitalo-Stil passt.",
    ],
    anker: [
      "Hamburger Straße",
      "Habichtstraße",
      "Dehnhaide",
      "Hartzloh-Quartier",
      "Mundsburger Damm",
    ],
    empfohleneBranchen: [
      {
        slug: "friseur",
        label: "Friseure & Salons",
        warum:
          "Sehr hohe Dichte, viele Stamm-Kunden. Eine Seite mit Online-Termin macht den Unterschied bei Neukunden, die spontan einen Termin suchen.",
      },
      {
        slug: "praxis",
        label: "Hausärzte & Zahnarztpraxen",
        warum:
          "Familien-Klientel sucht ortsnah. Klare Sprechzeiten, Anfahrt, Spezialisierung — mehr braucht es nicht, aber das fehlt bei vielen Konkurrenz-Praxen.",
      },
      {
        slug: "gastro",
        label: "Bäcker, Cafés & Imbisse",
        warum: `Lokale Suchanfragen nach „Bäcker Barmbek" oder „Café Habichtstraße" sind real und schwach besetzt. Ein einfacher Onepager genügt für die Top-3-Position.`,
      },
    ],
    pullQuote:
      "In Barmbek gewinnt nicht das beste Marketing, sondern die ehrlichste Seite — weil die Nachbarn das merken.",
  },
  {
    slug: "bramfeld",
    name: "Bramfeld",
    tagline:
      "Hamburger Nordosten — Wohngegend mit eigener Geschäftsachse, viel Handwerk, etablierte Familienpraxen.",
    intro:
      "Bramfeld ist klassisches Hamburger Wohngebiet im Nordosten, mit Bramfelder Chaussee als Lebensader. Hartzlohplatz, Steilshooper Straße, Fabriciusstraße — entlang dieser Straßen sitzen Handwerker, kleine Werkstätten, Friseure und etablierte Praxen. Die Klientel ist mittelständisch, eher älter, sehr loyal — und googelt zunehmend, gerade beim Generationswechsel.",
    body: [
      `Bramfelder Suchverhalten ist pragmatisch: „Schlosser Bramfeld", „Praxis Bramfelder Chaussee", „Friseur Hartzlohplatz". Die Konkurrenz im Suchergebnis ist überschaubar — meistens Branchenbuch-Einträge oder zwei Jahre alte Wix-Seiten. Eine moderne, klare Seite landet hier verlässlich auf Platz 1-3.`,
      "Wir bauen für Bramfelder Betriebe eher zurückhaltend: solide Typografie, klare Strukturen, sichtbare Erreichbarkeit. Keine ausufernden Animationen — das wirkt hier eher fremd als hochwertig. Substance statt Show, und genau das hebt die Seite ab.",
    ],
    anker: [
      "Bramfelder Chaussee",
      "Hartzlohplatz",
      "Fabriciusstraße",
      "Steilshooper Straße",
      "Bramfelder Dorfplatz",
    ],
    empfohleneBranchen: [
      {
        slug: "handwerker",
        label: "Handwerker & Werkstätten",
        warum:
          "Hohe Dichte, oft seit Jahrzehnten am Ort. Eine Seite mit Einsatzgebiet, Notfall-Erreichbarkeit und Referenz-Galerie gewinnt Neukunden, die googeln statt zu fragen.",
      },
      {
        slug: "praxis",
        label: "Familien- und Zahnarztpraxen",
        warum:
          "Stammpatienten sind treu, aber Neupatienten googeln. Klare Sprechzeiten, Notdienst-Vertretung und Anfahrt-Info reichen, um die richtigen anzuziehen.",
      },
      {
        slug: "friseur",
        label: "Friseure & Kosmetik",
        warum:
          "Hier zählt Verlässlichkeit. Eine Seite mit Online-Termin, Galerie und ehrlicher Beschreibung gewinnt gegen die unklare Konkurrenz-Wix-Seite.",
      },
    ],
    pullQuote:
      "Bramfelder Kunden vergeben Aufträge nach Vertrauen, nicht nach Hype. Die Website darf das nicht kaputtmachen.",
  },
  {
    slug: "niendorf",
    name: "Niendorf",
    tagline:
      "Hamburgs Nordwesten — Tibarg, Niendorfer Markt, gehobenes Wohngebiet mit Kaufkraft und gründlichem Vergleichsverhalten.",
    intro:
      "Niendorf ist Hamburgs gehobene Vorstadt-Ecke mit Tibarg als Einkaufsachse und Niendorfer Markt als Wochenend-Anker. Familien, viele Selbstständige, eine bemerkenswerte Dichte an Praxen, Kosmetik-Studios und kleinen Anwaltskanzleien. Die Klientel ist anspruchsvoll, kaufkraftstark und vergleicht intensiv vor jeder Buchung.",
    body: [
      `Niendorfer Suchverhalten ist langsam und gründlich: drei Anbieter werden auf der Website verglichen, Bewertungen gelesen, „Über uns" gecheckt. Eine bilderfreie Seite oder eine offensichtliche Vorlage scheidet hier sofort aus — auch wenn der Anbieter eigentlich gut wäre.`,
      `Wir bauen für Niendorfer Betriebe bewusst ruhig und detailreich: ordentliche Team-Seiten, lokale Anker (Tibarg, Niendorfer Markt, Garstedter Weg) in den Texten, klare Anfahrt mit Parkplatz-Hinweis. Hier zahlen die Kunden für Substanz — die Seite muss das signalisieren.`,
    ],
    anker: [
      "Tibarg",
      "Niendorfer Markt",
      "Garstedter Weg",
      "Niendorfer Wochenmarkt",
      "Sootbörn",
    ],
    empfohleneBranchen: [
      {
        slug: "praxis",
        label: "Privatpraxen & Spezialisten",
        warum:
          "Niendorfer Patienten suchen Spezialisten und vergleichen Qualifikationen. Eine klare Seite mit Schwerpunkten, Team-Fotos und Anfahrt gewinnt Privat- und Kassen-Patienten.",
      },
      {
        slug: "kosmetik",
        label: "Kosmetik & Beauty-Studios",
        warum:
          "Hohe Beauty-Affinität, gute Zahlungsbereitschaft. Wir bauen ruhige Galerien mit Vorher/Nachher, klare Behandlungs-Beschreibungen und einfache Termin-Anfrage.",
      },
      {
        slug: "kanzlei",
        label: "Steuer- & Anwaltskanzleien",
        warum:
          "Viele Selbstständige und Erbschafts-Themen brauchen Beratung vor Ort. Eine seriöse Seite mit klarer Rechtsgebiets-Spezialisierung sticht im Wettbewerb hervor.",
      },
    ],
    pullQuote:
      "In Niendorf entscheidet die Website über den ersten Termin — bevor irgendjemand miteinander gesprochen hat.",
  },
  {
    slug: "hafencity",
    name: "HafenCity",
    tagline:
      "Hamburgs jüngster Stadtteil — Beratungen, Architekturbüros, Restaurants mit Hafenblick. Klein, premium, sichtbar.",
    intro:
      "HafenCity ist anders als der Rest Hamburgs: neu gebaut, dicht, mit klarer Premium-Identität. Magellan-Terrassen, Marco-Polo-Tower, Überseequartier, Elbphilharmonie. Die hier ansässigen Betriebe sind oft Beratungen, Architekten, Spezialärzte, gehobene Gastronomie und einige Boutique-Hotels. Der Markt ist klein, aber jeder Auftrag ist substanziell.",
    body: [
      `HafenCity-Suchverhalten ist B2B-getrieben und qualitäts-sensibel: „Architekt HafenCity", „Steuerberater Speicherstadt", „Restaurant Hafenkante". Die Konkurrenz im Suchergebnis ist überschaubar (der Stadtteil ist neu), aber die Erwartung an die Website ist überdurchschnittlich hoch — die Klientel ist gewohnt, mit Hochglanz-Material zu arbeiten.`,
      `Wir bauen für HafenCity-Betriebe Seiten mit klarer Premium-Anmutung: ruhige Typografie, hochwertige Bildwelt (gerne mit Hafenmotiven), präzise Sprache. Mehr Sitalo Studio als Standard-Business — das passt zum Stadtteil und zur Klientel.`,
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
        label: "Kanzleien & Beratungen",
        warum:
          "Viele Wirtschaftskanzleien und Beratungen sitzen hier. Ein klares Profil mit Spezialisierungen und Team-Vorstellung gewinnt Mandate, die per Web-Empfehlung kommen.",
      },
      {
        slug: "gastro",
        label: "Restaurants & Bars mit Hafenblick",
        warum:
          "Premium-Gastronomie mit Direktbuchungs-Bedarf. Hier zählt die Bildwelt mehr als jeder Speisekarten-Text — wir bauen entsprechend.",
      },
      {
        slug: "hotel",
        label: "Boutique-Hotels & Apartments",
        warum:
          "Direktbuchung statt Booking.com spart 15-18 % Provision. Eine schnelle, klare Seite mit gutem Bildmaterial macht das technisch und visuell möglich.",
      },
    ],
    pullQuote:
      "In der HafenCity erwartet die Klientel Premium — die Website muss das schon signalisieren, bevor jemand reinkommt.",
  },
];

export function getStandortBySlug(slug: string): Standort | undefined {
  return STANDORTE.find((s) => s.slug === slug);
}

export function getAllStandortSlugs(): string[] {
  return STANDORTE.map((s) => s.slug);
}
