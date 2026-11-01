import type { Paket } from "@/lib/pakete-data";

/**
 * Ladelisten je Branche für den Abschnitt „Ladeliste“ auf der Startseite.
 *
 * Jede Liste ist wie ein Frachtpapier aufgebaut: Position, Ladung (was auf
 * die Website gehört), Stauplatz (wo es auf der Seite steht) und Vermerk
 * (warum, aus Sicht der Menschen, die die Seite lesen). Die Positionen sind
 * nach Wichtigkeit geordnet, deshalb tragen sie Nummern.
 *
 * Regeln für die Texte: Branchenwissen ja, Zahlen, Statistiken und
 * Versprechen nein. Paketangaben verweisen nur auf den Slug; Name und Preis
 * kommen zur Laufzeit aus lib/pakete-data.ts. `{paket}` in `alternative.text`
 * wird durch „Name ab Preis“ ersetzt.
 *
 * `inquiry` ist der Branchen-Slug des Anfrageformulars
 * (components/marketing/inquiry-form.tsx, INDUSTRY_OPTIONS).
 */

export type LadePosition = {
  /** Was auf die Website gehört. */
  ladung: string;
  /** Wo es auf der Website steht. */
  stauplatz: string;
  /** Warum, aus Sicht der Leser. */
  vermerk: string;
};

export type BranchenLadeliste = {
  key: string;
  /** Kürzel wie auf einem Frachtpapier, drei Buchstaben. */
  code: string;
  /** Kurzname für die Auswahl. */
  tab: string;
  /** Voller Name im Frachtpapier. */
  label: string;
  /** Branchen-Slug für /anfrage?branche=… */
  inquiry: string;
  /** Wer die Website dieser Branche liest. */
  leser: string[];
  positionen: LadePosition[];
  /** Empfohlenes Paket (Slug aus lib/pakete-data.ts). */
  paket: Paket["slug"];
  /** Ein Satz, warum dieses Paket passt. */
  paketGrund: string;
  /** Optional: wann ein anderes Paket besser passt. */
  alternative?: { paket: Paket["slug"]; text: string };
};

export const LADELISTEN: BranchenLadeliste[] = [
  {
    key: "pflege",
    code: "PFL",
    tab: "Pflegedienst",
    label: "Pflegedienst",
    inquiry: "pflegedienst",
    leser: ["Angehörige", "Pflegebedürftige", "Sozialdienste der Kliniken", "Pflegekräfte auf Stellensuche"],
    positionen: [
      {
        ladung: "Einzugsgebiet nach Stadtteilen und Postleitzahlen",
        stauplatz: "Startseite, oben",
        vermerk:
          "Die erste Frage am Telefon lautet: Kommen Sie auch zu uns? Steht die Antwort auf der Seite, rufen die Richtigen an.",
      },
      {
        ladung: "Leistungen in Alltagssprache",
        stauplatz: "Eigene Unterseite",
        vermerk:
          "Viele Angehörige haben gerade erst einen Pflegegrad bekommen. Die Seite erklärt Grund-, Behandlungs- und Verhinderungspflege und sagt, was über die Pflegekasse und was über die Krankenkasse läuft.",
      },
      {
        ladung: "Rückruf für Angehörige",
        stauplatz: "Kopf jeder Seite",
        vermerk:
          "Angehörige melden sich oft aus der Mittagspause oder am Abend. Ein kurzes Rückrufformular fängt die Anfrage auf, wenn im Büro niemand abnimmt.",
      },
      {
        ladung: "Aufnahmestatus für Kliniken",
        stauplatz: "Startseite und Kontakt",
        vermerk:
          "Sozialdienste suchen bei der Entlassung schnell einen Dienst mit freien Kapazitäten. Ein Hinweis, ob Sie gerade neue Kunden aufnehmen, spart beiden Seiten Anrufe.",
      },
      {
        ladung: "Bewerbungsweg für Pflegekräfte",
        stauplatz: "Eigene Unterseite im Menü",
        vermerk:
          "Vielerorts ist Personal knapper als Kundschaft. Eine Bewerbung ohne Anschreiben, mit Rückruf, senkt die Hürde für Pflegekräfte.",
      },
      {
        ladung: "Team mit Gesicht",
        stauplatz: "Unterseite Team",
        vermerk:
          "Angehörige wollen wissen, wer ins Haus kommt. Fotos mit Vornamen und Qualifikation geben dem Dienst ein Gesicht.",
      },
    ],
    paket: "business",
    paketGrund: "Bis zu fünf Unterseiten tragen Leistungen, Team, Bewerbung, Einzugsgebiet und Kontakt.",
    alternative: { paket: "premium", text: "Wollen Sie Stellen und Neuigkeiten selbst pflegen, passt {paket}." },
  },
  {
    key: "praxis",
    code: "PRX",
    tab: "Praxis",
    label: "Arzt- oder Zahnarztpraxis",
    inquiry: "arztpraxis",
    leser: ["Neue Patientinnen und Patienten", "Stammpatienten", "Angehörige", "Praxispersonal auf Stellensuche"],
    positionen: [
      {
        ladung: "Sprechzeiten und Vertretung",
        stauplatz: "Startseite, oben",
        vermerk:
          "Urlaub, Brückentage und die Vertretungspraxis gehören nach oben, nicht in eine Meldung am Seitenende. Außerhalb der Sprechzeiten verweist die Seite auf den Bereitschaftsdienst unter 116 117 oder den zahnärztlichen Notdienst.",
      },
      {
        ladung: "Online-Termin oder Rückruf",
        stauplatz: "Knopf im Kopf jeder Seite",
        vermerk:
          "Jeder Anruf weniger entlastet die Anmeldung. Ein Buchungssystem, das Sie schon nutzen, binden wir ein; sonst genügt eine Terminanfrage mit Rückruf.",
      },
      {
        ladung: "Anfahrt und Barrierefreiheit",
        stauplatz: "Unterseite Praxis",
        vermerk:
          "Stufen, Aufzug, Parkplätze und die nächste Haltestelle entscheiden für Ältere und Eltern mit Kinderwagen, ob sie kommen können.",
      },
      {
        ladung: "Leistungen für Kasse und Privat",
        stauplatz: "Unterseite Leistungen",
        vermerk:
          "Patienten wollen vorher wissen, was die Kasse trägt und was privat berechnet wird. Kassenleistungen und Selbstzahlerleistungen stehen deshalb getrennt.",
      },
      {
        ladung: "Team mit Schwerpunkten und Sprachen",
        stauplatz: "Unterseite Team",
        vermerk:
          "Patienten wählen eine Ärztin oder einen Arzt, nicht nur eine Adresse. Facharzttitel, Schwerpunkte und gesprochene Sprachen helfen bei der Wahl.",
      },
      {
        ladung: "Rezepte und Überweisungen",
        stauplatz: "Unterseite Service",
        vermerk:
          "Folgerezepte blockieren morgens das Telefon. Ein klarer Hinweis, auf welchem Weg Stammpatienten bestellen, entlastet die Leitung.",
      },
      {
        ladung: "Sachliche Texte",
        stauplatz: "Alle Seiten",
        vermerk:
          "Heilversprechen haben auf einer Praxisseite nichts zu suchen. Wir formulieren sachlich nach dem Heilmittelwerbegesetz; die letzte Prüfung liegt bei Ihnen.",
      },
    ],
    paket: "business",
    paketGrund: "Fünf Unterseiten reichen für Praxis, Leistungen, Team, Service und Anfahrt.",
    alternative: { paket: "studio", text: "Eine Privatpraxis mit eigener Bildsprache ist bei {paket} richtig." },
  },
  {
    key: "handwerk",
    code: "HWK",
    tab: "Handwerk",
    label: "Handwerksbetrieb",
    inquiry: "handwerker",
    leser: ["Privatkunden mit konkretem Vorhaben", "Hausverwaltungen", "Architekturbüros", "Gesellen und Azubis"],
    positionen: [
      {
        ladung: "Einsatzgebiet",
        stauplatz: "Startseite, oben",
        vermerk:
          "Eine Karte mit Ihrem Radius oder eine Liste der Orte zeigt sofort, ob sich der Anruf lohnt. Sie sprechen nur noch mit Kunden, zu denen Sie auch fahren.",
      },
      {
        ladung: "Referenzen mit Fotos",
        stauplatz: "Unterseite Referenzen",
        vermerk:
          "Bauherren entscheiden nach Bildern fertiger Arbeit. Vorher und nachher, mit Ort und Gewerk, überzeugt mehr als jede Beschreibung. Baustellenfotos vom Handy bereiten wir auf.",
      },
      {
        ladung: "Notdienst und Erreichbarkeit",
        stauplatz: "Kopf jeder Seite",
        vermerk:
          "Bei Rohrbruch oder zugefallener Tür zählt eine Nummer, die man sofort antippen kann. Die Notdienstzeiten stehen daneben, falls Sie einen anbieten.",
      },
      {
        ladung: "Anfrage mit Fotos und Maßen",
        stauplatz: "Unterseite Anfrage",
        vermerk:
          "Schicken Kunden Fotos und ungefähre Maße gleich mit, wird das erste Gespräch kürzer. Das verbindliche Angebot folgt nach dem Aufmaß vor Ort.",
      },
      {
        ladung: "Meisterbrief und Innung",
        stauplatz: "Startseite, unter dem Kopf",
        vermerk:
          "Meistertitel, Innung und Zertifikate unterscheiden Ihren Betrieb vom Anbieter aus dem Kleinanzeigenportal.",
      },
      {
        ladung: "Ausbildung und Stellen",
        stauplatz: "Unterseite Karriere",
        vermerk:
          "Bewerber schauen sich die Werkstatt an, bevor sie anrufen. Team, offene Stellen und ein kurzer Bewerbungsweg helfen bei der Suche nach Gesellen und Azubis.",
      },
    ],
    paket: "business",
    paketGrund: "Referenzgalerie und Bildaufbereitung sind in Business enthalten.",
    alternative: { paket: "starter", text: "Ein Einzelbetrieb ohne Galerie kommt mit {paket} aus." },
  },
  {
    key: "gastro",
    code: "CAF",
    tab: "Café",
    label: "Café oder Restaurant",
    inquiry: "cafe",
    leser: ["Gäste am Handy in der Nähe", "Mittagsgäste aus den Büros", "Gruppen und Firmen", "Touristen"],
    positionen: [
      {
        ladung: "Öffnungszeiten, groß",
        stauplatz: "Startseite, erster Blick",
        vermerk:
          "Gäste schauen kurz vor dem Losgehen aufs Handy. Ob heute geöffnet ist und bis wann, steht ganz oben, mit Ruhetag, Feiertagen und Betriebsferien.",
      },
      {
        ladung: "Speisekarte als Text statt PDF",
        stauplatz: "Unterseite Karte",
        vermerk:
          "Ein PDF lädt am Handy langsam und lässt sich schlecht lesen. Als Text passt sich die Karte jedem Bildschirm an, und Google findet Ihre Gerichte.",
      },
      {
        ladung: "Mittagstisch, selbst gepflegt",
        stauplatz: "Startseite",
        vermerk: "Der Wochenplan ändert sich jeden Montag. Sie tragen ihn selbst am Handy ein, ohne auf uns zu warten.",
      },
      {
        ladung: "Reservierung und Gruppen",
        stauplatz: "Knopf im Kopf",
        vermerk:
          "Für den Tisch zu zweit reicht der Anruf-Knopf. Feiern und Firmenessen brauchen ein Formular mit Datum, Personenzahl und Anlass.",
      },
      {
        ladung: "Bilder vom Raum und vom Teller",
        stauplatz: "Startseite und Galerie",
        vermerk:
          "Gäste entscheiden nach Atmosphäre. Echte Fotos von Ihren Gerichten und Ihrem Gastraum wirken stärker als Bilder aus einer Datenbank.",
      },
      {
        ladung: "Lage, Anfahrt, Außenplätze",
        stauplatz: "Fuß jeder Seite",
        vermerk:
          "Haltestelle, Parken, Terrasse und ein stufenloser Eingang: Gäste, die Sie noch nicht kennen, planen damit ihren Weg.",
      },
      {
        ladung: "Dieselben Zeiten bei Google",
        stauplatz: "Google-Unternehmensprofil",
        vermerk:
          "Widersprechen sich Website und Google-Profil, stehen Gäste vor verschlossener Tür. Beide zeigen deshalb dieselben Öffnungszeiten.",
      },
    ],
    paket: "premium",
    paketGrund: "Karte und Mittagstisch pflegen Sie in Premium selbst.",
    alternative: { paket: "starter", text: "Ein kleines Café ohne wechselnde Karte kommt mit {paket} aus." },
  },
  {
    key: "friseur",
    code: "FRI",
    tab: "Friseur",
    label: "Friseur oder Kosmetikstudio",
    inquiry: "friseur",
    leser: ["Neukundschaft aus dem Viertel", "Stammkundschaft", "Brautpaare", "Fachkräfte auf Stellensuche"],
    positionen: [
      {
        ladung: "Termin buchen oder anfragen",
        stauplatz: "Kopf jeder Seite",
        vermerk:
          "Termine werden oft abends gesucht, wenn der Salon geschlossen hat. Ein Buchungssystem, das Sie schon nutzen, binden wir ein; sonst genügt eine Terminanfrage.",
      },
      {
        ladung: "Preisliste mit Ab-Preisen",
        stauplatz: "Unterseite Preise",
        vermerk:
          "Preise nach Leistung und Haarlänge geben Sicherheit vor dem Besuch. Ein Satz dazu, wovon der Endpreis abhängt, erspart Diskussionen an der Kasse.",
      },
      {
        ladung: "Bilder Ihrer Arbeit",
        stauplatz: "Startseite und Galerie",
        vermerk:
          "Schnitt, Farbe und Behandlung verkaufen sich über Bilder. Eigene Fotos aus dem Salon, mit Einverständnis der Kundschaft, wirken stärker als Stockfotos.",
      },
      {
        ladung: "Team mit Schwerpunkten",
        stauplatz: "Unterseite Team",
        vermerk:
          "Kundinnen und Kunden buchen gezielt eine Person. Schwerpunkte wie Coloration, Locken oder Brautstyling zeigen, wer zu wem passt.",
      },
      {
        ladung: "Öffnungszeiten und Lage",
        stauplatz: "Fuß jeder Seite",
        vermerk: "Viele Salons haben montags geschlossen. Ein Blick auf die Seite erspart den vergeblichen Weg.",
      },
      {
        ladung: "Gutscheine",
        stauplatz: "Startseite",
        vermerk:
          "Gutscheine sind ein beliebtes Geschenk. Ein Hinweis auf der Startseite erinnert vor Weihnachten und Muttertag daran.",
      },
    ],
    paket: "business",
    paketGrund: "Preise, Team und Galerie bekommen eigene Unterseiten, dazu das Formular für Terminanfragen. Das alles gehört zu Business.",
    alternative: { paket: "premium", text: "Mit eigener Online-Buchung ist {paket} richtig." },
  },
  {
    key: "kanzlei",
    code: "KAN",
    tab: "Kanzlei",
    label: "Kanzlei",
    inquiry: "kanzlei",
    leser: ["Mandantinnen und Mandanten", "Unternehmen", "Kollegen, die weiterempfehlen", "Fachangestellte auf Stellensuche"],
    positionen: [
      {
        ladung: "Eine Seite je Rechtsgebiet",
        stauplatz: "Eigene Unterseiten",
        vermerk:
          "Wer eine Kündigung bekommt, sucht nach Arbeitsrecht und seinem Ort. Eine eigene Seite pro Schwerpunkt wird für genau diese Suche gefunden.",
      },
      {
        ladung: "Erstberatung und Kosten",
        stauplatz: "Unterseite Kosten",
        vermerk:
          "Viele zögern aus Sorge vor der Rechnung. Ein klarer Satz zur Erstberatung, zur Abrechnung nach RVG oder Vereinbarung und zur Deckungsanfrage bei der Rechtsschutzversicherung nimmt diese Sorge.",
      },
      {
        ladung: "Vertrauliche Mandatsanfrage",
        stauplatz: "Unterseite Kontakt",
        vermerk:
          "Das Formular fragt nur das Nötigste ab, dazu den Namen der Gegenseite. So prüfen Sie Interessenkonflikte, bevor Sie zurückrufen.",
      },
      {
        ladung: "Anwälte mit Vita",
        stauplatz: "Unterseite Team",
        vermerk:
          "Mandanten wählen eine Person. Fachanwaltstitel, Schwerpunkte und Sprachen zeigen, wer den Fall übernimmt.",
      },
      {
        ladung: "Impressum mit Kammerangaben",
        stauplatz: "Impressum",
        vermerk:
          "Berufsbezeichnung, Kammer, berufsrechtliche Regelungen und Berufshaftpflicht: Das Impressum einer Kanzlei braucht mehr als die Adresse. Wir legen den Bereich an, den Text prüfen Sie.",
      },
      {
        ladung: "Erreichbarkeit und Video-Termine",
        stauplatz: "Unterseite Kontakt",
        vermerk:
          "Telefonzeiten und der Hinweis auf Besprechungen per Video ersparen Mandanten außerhalb der Stadt die Anreise.",
      },
    ],
    paket: "business",
    paketGrund: "Mehrere Rechtsgebiete brauchen eigene Unterseiten, die gibt es ab Business.",
    alternative: { paket: "starter", text: "Eine Einzelkanzlei mit einem Schwerpunkt kommt mit {paket} aus." },
  },
  {
    key: "reinigung",
    code: "REI",
    tab: "Reinigung",
    label: "Reinigungsfirma",
    inquiry: "reinigung",
    leser: ["Hausverwaltungen", "Büros und Praxen", "Privathaushalte", "Reinigungskräfte auf Stellensuche"],
    positionen: [
      {
        ladung: "Leistungen nach Objekt",
        stauplatz: "Unterseite Leistungen",
        vermerk:
          "Auftraggeber suchen nach Unterhaltsreinigung, Grundreinigung, Glas oder Treppenhaus, selten nach Ihrem Namen. Jede Leistung bekommt deshalb einen eigenen Abschnitt.",
      },
      {
        ladung: "Einsatzgebiet",
        stauplatz: "Startseite, oben",
        vermerk:
          "Hausverwaltungen vergeben Objekte nach Lage. Eine Liste der Stadtteile und Orte zeigt sofort, ob Sie infrage kommen.",
      },
      {
        ladung: "Angebotsanfrage mit Eckdaten",
        stauplatz: "Unterseite Anfrage",
        vermerk:
          "Fläche, Bodenbelag, Turnus und Zeitfenster: Mit diesen Angaben wird Ihr Angebot genauer und die Besichtigung kürzer.",
      },
      {
        ladung: "Versicherung und Schlüsselregelung",
        stauplatz: "Startseite, unter dem Kopf",
        vermerk:
          "Wer Schlüssel übergibt, will wissen, wer kommt. Betriebshaftpflicht, feste Teams und der Umgang mit Schlüsseln gehören sichtbar auf die Seite.",
      },
      {
        ladung: "Reinigungszeiten",
        stauplatz: "Unterseite Leistungen",
        vermerk:
          "Büros wollen tagsüber ungestört arbeiten. Nennen Sie Ihre Zeitfenster: früh vor Arbeitsbeginn, abends oder am Wochenende.",
      },
      {
        ladung: "Stellen mit Zeiten und Orten",
        stauplatz: "Unterseite Karriere",
        vermerk:
          "Bewerbende fragen zuerst nach Arbeitszeiten und Einsatzorten. Steht beides auf der Stellenseite, kommen passendere Bewerbungen.",
      },
    ],
    paket: "business",
    paketGrund: "Leistungen nach Objekt, Einsatzgebiet und Stellen brauchen mehrere Unterseiten.",
  },
  {
    key: "fitness",
    code: "FIT",
    tab: "Fitness",
    label: "Fitnessstudio",
    inquiry: "fitness",
    leser: ["Neue Mitglieder aus der Umgebung", "Mitglieder vor dem Training", "Personalabteilungen", "Trainerinnen und Trainer"],
    positionen: [
      {
        ladung: "Probetraining",
        stauplatz: "Knopf im Kopf jeder Seite",
        vermerk:
          "Mitglied wird man nach dem Probetraining. Der Knopf steht auf jeder Seite, das Formular fragt nur Name, Telefon und Wunschtag ab.",
      },
      {
        ladung: "Kursplan als Text",
        stauplatz: "Unterseite Kurse",
        vermerk:
          "Mitglieder schauen vor jedem Besuch nach. Ein Kursplan nach Wochentagen liest sich am Handy besser als ein Foto vom Aushang.",
      },
      {
        ladung: "Preise und Laufzeiten",
        stauplatz: "Unterseite Mitgliedschaft",
        vermerk:
          "Beitrag, Laufzeit, Kündigungsfrist und Aufnahmegebühr, offen genannt, wirken seriöser als „Preis auf Anfrage“. Schließen Mitglieder online ab, gehört der gesetzliche Kündigungsknopf dazu.",
      },
      {
        ladung: "Räume und Trainer",
        stauplatz: "Startseite und Team",
        vermerk:
          "Einsteiger haben vor dem ersten Besuch oft Hemmungen. Fotos von Räumen und Trainern senken die Schwelle.",
      },
      {
        ladung: "Ruhige Zeiten",
        stauplatz: "Unterseite Öffnungszeiten",
        vermerk: "Ein Hinweis auf ruhige Stunden hilft Neulingen, die nicht zwischen vollen Geräten anfangen wollen.",
      },
      {
        ladung: "Firmenfitness",
        stauplatz: "Eigene Unterseite",
        vermerk:
          "Viele Arbeitgeber bezuschussen Mitgliedschaften. Eine Seite für Firmen spricht Personalabteilungen direkt an.",
      },
    ],
    paket: "business",
    paketGrund: "Kurse, Preise, Team und Firmenfitness passen in fünf Unterseiten.",
    alternative: { paket: "premium", text: "Pflegen Sie den Kursplan selbst, ist {paket} richtig." },
  },
  {
    key: "hotel",
    code: "HTL",
    tab: "Hotel",
    label: "Hotel oder Pension",
    inquiry: "hotel",
    leser: ["Gäste nach dem Preisvergleich", "Geschäftsreisende", "Gruppen", "Gäste aus dem Ausland"],
    positionen: [
      {
        ladung: "Zimmer mit Fotos und Preisen",
        stauplatz: "Unterseite Zimmer",
        vermerk:
          "Viele Gäste finden Sie über ein Buchungsportal und suchen danach Ihre eigene Seite. Dort müssen Zimmer, Ausstattung und Preis mindestens so klar sein wie im Portal.",
      },
      {
        ladung: "Direkt anfragen",
        stauplatz: "Knopf im Kopf jeder Seite",
        vermerk:
          "Jede direkte Buchung spart die Provision des Portals. Ein kleiner Vorteil für Direktbucher, etwa das Frühstück, gibt oft den Ausschlag.",
      },
      {
        ladung: "Lage und Anreise",
        stauplatz: "Unterseite Lage",
        vermerk:
          "Gäste planen die Anreise vor der Buchung. Fußwege in Minuten zu Bahnhof, Zentrum und Parkplatz sind greifbarer als Kilometer.",
      },
      {
        ladung: "Saisonpreise, selbst gepflegt",
        stauplatz: "Unterseite Preise",
        vermerk:
          "Preise ändern sich mit Saison, Messen und Wochenenden. Sie pflegen sie selbst, damit die Seite mit dem Portal Schritt hält.",
      },
      {
        ladung: "Check-in und Hausregeln",
        stauplatz: "Unterseite Infos",
        vermerk:
          "Check-in-Zeiten, Schlüssel bei später Anreise, Haustiere, Frühstück: Was vorher auf der Seite steht, muss nachts niemand am Telefon erklären.",
      },
      {
        ladung: "Englische Fassung",
        stauplatz: "Alle Seiten",
        vermerk:
          "Gäste aus dem Ausland buchen lieber in ihrer Sprache. Eine englische Fassung bieten wir als Zusatz an; den Preis nennen wir vorab.",
      },
    ],
    paket: "premium",
    paketGrund: "Saisonpreise pflegen Sie in Premium selbst, ohne auf uns zu warten.",
    alternative: { paket: "business", text: "Eine kleine Pension mit wenigen Zimmern kommt mit {paket} aus." },
  },
];
