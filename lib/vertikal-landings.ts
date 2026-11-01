/**
 * Vertikal-Landing-Daten für /pflege und /praxen. Schlanker als
 * BRANCHEN: diese Seiten sind auf Anfragen ausgelegt (Probleme der
 * Branche, Bauteile, drei Wochen Ablauf), nicht das Archiv unter
 * /branchen. Die Fragen kommen aus BRANCHEN (über `brancheSlug`).
 *
 * Bewusst eigener Datentopf mit eigenen Texten, damit /pflege und
 * /branchen/pflege nicht dasselbe sagen.
 *
 * Textregeln: keine Prozentwerte, keine Liste angeblich betreuter
 * Stadtteile, keine Aussagen über frühere Kunden.
 *
 * Erweiterung: neue Vertikale heißt hier Eintrag bauen und
 * `app/<slug>/page.tsx` als dünne Hülle anlegen.
 */

export type VertikalLanding = {
  /** URL-Slug, gleichzeitig Routen-Segment. */
  slug: string;
  /** SEO-Title (volle Suchphrase). */
  seoTitle: string;
  /** SEO-Description. */
  seoDescription: string;
  /** Verbindung zum Archiv /branchen/[slug] und zu den Fragen. */
  brancheSlug: string;
  /** Verbindung zum Anfrageformular über ?branche=. */
  inquirySlug: string;
  /** Empfohlenes Paket fürs Anfrage-Preset und den Steckbrief. */
  recommendedPackage: "starter" | "business" | "premium";
  /** Kleine Zeile über der Überschrift (label-mono). */
  eyebrow: string;
  /** H1 mit Suchbegriff. */
  headline: string;
  /** Optionaler Zusatz zur H1, wird als ein Satz angehängt. */
  headlineItalic?: string;
  /** Einleitung unter der H1, zwei Sätze. */
  subhead: string;
  /** Drei typische Probleme der Branche; das erste ist der Aufmacher. */
  pains: { headline: string; body: string }[];
  /** Was auf die Seite kommt, vier bis sechs Teile. */
  bauteile: { name: string; what: string }[];
  /** Ablauf in Wochen. Die Anzahl ergibt die Dauer im Steckbrief. */
  process: { woche: string; what: string }[];
  /** Aussage der Abschluss-Briefkarte, ein normaler Satz. */
  schlussZitat: string;
  /** Optionaler Zusatz zur Aussage, wird angehängt. */
  schlussZitatItalic?: string;
};

export const VERTIKAL_LANDINGS: VertikalLanding[] = [
  {
    slug: "pflege",
    seoTitle: "Pflegedienst-Website aus Hamburg — Sitalo",
    seoDescription:
      "Websites für Pflegedienste. Leistungen und Einsatzgebiet klar erklärt, mit Bewerbungsformular für Pflegekräfte und Notfallnummer. Gebaut in Hamburg, Festpreis vorab.",
    brancheSlug: "pflege",
    inquirySlug: "pflege",
    recommendedPackage: "business",
    eyebrow: "Pflegedienst-Website aus Hamburg",
    headline: "Websites für Pflegedienste",
    subhead:
      "Angehörige sollen auf den ersten Blick sehen, was Sie leisten und in welche Stadtteile Sie fahren. Pflegekräfte sollen sich vom Handy aus bei Ihnen bewerben können.",
    pains: [
      {
        headline: "Die Leistungen stehen nicht auf der Startseite.",
        body: "Familien suchen nach Grundpflege, Behandlungspflege oder 24-Stunden-Versorgung. Steht oben nur ein allgemeiner Satz wie „Wir kümmern uns um Sie“, rufen sie beim nächsten Dienst an.",
      },
      {
        headline: "Bewerben geht nur per Mail mit PDF.",
        body: "Wer als Pflegekraft mehrere Stellen vergleicht, bewirbt sich dort, wo es auf dem Handy schnell geht. Für ein erstes Gespräch reicht ein kurzes Formular.",
      },
      {
        headline: "Man sieht nicht, wer kommt.",
        body: "Angehörige wollen wissen, wer morgens vor der Tür steht. Dafür braucht die Seite Fotos vom Team, Ihre Zertifikate und einen Hinweis, wie Sie im Notfall erreichbar sind.",
      },
    ],
    bauteile: [
      {
        name: "Startseite",
        what: "Was Sie leisten, für wen und in welchem Gebiet. Die Notfallnummer steht oben in der Kopfleiste, auf jeder Seite.",
      },
      {
        name: "Leistungen",
        what: "Grundpflege, Behandlungspflege, Verhinderungspflege und Beratungsbesuche nach § 37 Abs. 3 SGB XI, klar getrennt. In Worten, die Familien verstehen und die Pflegekassen kennen.",
      },
      {
        name: "Bewerbungsformular",
        what: "Wenige Felder, auf dem Handy schnell ausgefüllt. Einen Lebenslauf kann man anhängen, muss es aber nicht.",
      },
      {
        name: "Team",
        what: "Fotos vom eigenen Team statt Bildern aus einer Datenbank, zu jeder Person ein paar Sätze.",
      },
      {
        name: "Einsatzgebiet",
        what: "Eine Karte mit Ihren Stadtteilen oder eine Liste der Postleitzahlen. So sehen Familien gleich, ob Sie zu ihnen kommen.",
      },
      {
        name: "Google-Eintrag",
        what: "Ihr Unternehmensprofil bei Google Maps richten wir mit ein. Gibt es schon einen Eintrag, bringen wir ihn auf den Stand der neuen Seite.",
      },
    ],
    process: [
      {
        woche: "Woche 1",
        what: "Erstes Gespräch am Telefon oder bei Ihnen vor Ort. Sie schicken, was schon da ist: alte Seite, Flyer, PDFs. Wir sortieren es.",
      },
      {
        woche: "Woche 2",
        what: "Wir bauen die Seite. Zum Ende der Woche bekommen Sie einen Test-Link und schauen sich alles in Ruhe an.",
      },
      {
        woche: "Woche 3",
        what: "Eine Korrekturrunde, in der wir alle Anmerkungen gesammelt umsetzen. Danach geht die Seite online, der Google-Eintrag wird parallel angepasst.",
      },
    ],
    schlussZitat: "Am Ende zählt, ob Familien anrufen und Pflegekräfte sich bewerben.",
  },
  {
    slug: "praxen",
    seoTitle: "Praxis-Website aus Hamburg — Sitalo",
    seoDescription:
      "Websites für Arzt- und Zahnarztpraxen. Sprechzeiten oben auf jeder Seite, Terminanfrage per Formular, Team und Anfahrt. Gebaut in Hamburg, Festpreis vorab.",
    brancheSlug: "praxis",
    inquirySlug: "praxis",
    recommendedPackage: "business",
    eyebrow: "Praxis-Website aus Hamburg",
    // ­: weiche Trennung, damit das lange Wort am Handy umbrechen kann.
    headline: "Websites für Arzt- und Zahnarzt­praxen",
    subhead:
      "Vor dem ersten Termin schauen Patient:innen nach Sprechzeiten, Anfahrt und Behandlungen. Auf Ihrer Seite finden sie das ohne Suchen und können gleich einen Termin anfragen.",
    pains: [
      {
        headline: "Die Sprechzeiten sind schwer zu finden.",
        body: "Vor dem Anruf suchen Patient:innen nach Sprechzeiten und Notdienst. Stecken die in einem PDF unter „Praxisinfo“, wählen sie die nächste Praxis. Sprechzeiten gehören oben auf jede Seite.",
      },
      {
        headline: "Die Seite wirkt veraltet.",
        body: "Wenn eine Seite am Handy verrutscht oder seit Jahren gleich aussieht, schließen Patient:innen daraus auf die Praxis. Vor dem ersten Besuch haben sie nichts anderes, woran sie sich halten können.",
      },
      {
        headline: "Jeder Termin läuft über das Telefon.",
        body: "Ohne Online-Anfrage muss jeder Erstkontakt über die Anmeldung, und dort ist die Leitung oft belegt. Ein Formular mit Wunschterminen nimmt dem Telefon einen Teil der Anfragen ab.",
      },
    ],
    bauteile: [
      {
        name: "Sprechzeiten oben",
        what: "Auf jeder Seite sichtbar, mit Hinweis auf den Notdienst. Wer die Seite öffnet, sieht sofort, ob heute geöffnet ist.",
      },
      {
        name: "Terminanfrage",
        what: "Ein Formular mit drei Wunschterminen. Die Anfrage kommt als E-Mail in der Praxis an. Auf Wunsch binden wir Doctolib oder Jameda ein.",
      },
      {
        name: "Behandlungen",
        what: "Ihre Leistungen in Alltagssprache. Patient:innen suchen mit ihren eigenen Worten. Finden sie die nicht, nehmen sie an, dass Sie es nicht anbieten.",
      },
      {
        name: "Team",
        what: "Porträts von Ärzt:innen und Praxisteam, zu jeder Person ein paar Sätze. Man möchte wissen, zu wem man geht.",
      },
      {
        name: "Anfahrt und Parken",
        what: "Karte, Haltestellen, Parkplätze und ob es einen Aufzug gibt. Für ältere Patient:innen gibt das oft den Ausschlag.",
      },
      {
        name: "Datenschutz",
        what: "Impressum, Datenschutzerklärung und Cookie-Hinweis richten wir vor dem Start passend zu den Funktionen der Seite ein, also auch zu Terminformular und Karte.",
      },
    ],
    process: [
      {
        woche: "Woche 1",
        what: "Erstes Gespräch und ein Blick auf Ihre bisherige Seite. Sie schicken Texte, Fotos und Angaben zum Team. Wo Texte fehlen, schreiben wir sie.",
      },
      {
        woche: "Woche 2",
        what: "Wir bauen die Seite. Sie bekommen einen Test-Link und schauen sie in Ruhe durch.",
      },
      {
        woche: "Woche 3",
        what: "Eine gesammelte Korrekturrunde, dann geht die Seite online. Das Terminformular testen wir vorher mit Ihrer Anmeldung.",
      },
    ],
    schlussZitat: "Eine Praxis-Seite muss seriös wirken, bevor jemand bei Ihnen klingelt.",
  },
];

export function getVertikalLanding(slug: string): VertikalLanding | undefined {
  return VERTIKAL_LANDINGS.find((v) => v.slug === slug);
}
