import type { TemplateKey } from "@/lib/templates";

/**
 * Industry-specific demo content seeded into a brand-new website at
 * onboarding time. Inspired by the Shopify pattern — pick an industry,
 * land on a finished page, just edit details.
 *
 * The user can change everything afterwards via the dashboard. None of
 * this is "default" or "fallback" — it's actual placeholder content
 * written in the right voice for the trade.
 */

export type DemoService = {
  title: string;
  description: string;
};

export type DemoTeamMember = {
  name: string;
  role: string;
  bio: string;
};

export type DemoContent = {
  hero_title: string;
  hero_subtitle: string;
  about_text: string;
  opening_hours_text: string;
  services: DemoService[];
  team: DemoTeamMember[];
  imprint_placeholder: string;
  privacy_placeholder: string;
};

const DEFAULT_IMPRINT_PLACEHOLDER = `Angaben gemäß § 5 TMG

[Firmenname]
[Straße und Hausnummer]
[PLZ Ort]

Vertreten durch:
[Geschäftsführer:in]

Kontakt:
Telefon: [Telefonnummer]
E-Mail: [E-Mail-Adresse]

Umsatzsteuer-ID:
[USt-IdNr. nach §27 a UStG]

Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV:
[Name, Anschrift]`;

const DEFAULT_PRIVACY_PLACEHOLDER = `Datenschutzerklärung

1. Datenschutz auf einen Blick
Diese Website verarbeitet personenbezogene Daten nur in dem Umfang, der für den Betrieb der Seite und die Bearbeitung Ihrer Anfragen erforderlich ist.

2. Verantwortliche Stelle
[Firmenname]
[Anschrift]
[Kontakt]

3. Kontaktformular
Wenn Sie uns über das Kontaktformular schreiben, speichern wir Name, E-Mail-Adresse und Ihre Nachricht zur Bearbeitung Ihrer Anfrage. Eine Weitergabe an Dritte erfolgt nicht.

4. Ihre Rechte
Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung oder Einschränkung der Verarbeitung Ihrer personenbezogenen Daten.

5. Hosting
Diese Website wird auf Servern in der Europäischen Union gehostet.`;

const DEFAULT_HOURS = `Mo–Fr: 8:00–18:00 Uhr
Sa: 9:00–13:00 Uhr
Sonntag geschlossen`;

const DEMO: Record<TemplateKey, DemoContent> = {
  default: {
    hero_title: "Willkommen bei [Firmenname]",
    hero_subtitle:
      "Kurze Beschreibung deines Unternehmens. Was machst du, für wen, warum?",
    about_text:
      "Hier kannst du erzählen, wer ihr seid, wofür ihr steht und was euch ausmacht. 2-3 kurze Absätze reichen.",
    opening_hours_text: DEFAULT_HOURS,
    services: [
      { title: "Leistung 1", description: "Beschreibung der ersten Leistung." },
      { title: "Leistung 2", description: "Beschreibung der zweiten Leistung." },
      { title: "Leistung 3", description: "Beschreibung der dritten Leistung." },
    ],
    team: [],
    imprint_placeholder: DEFAULT_IMPRINT_PLACEHOLDER,
    privacy_placeholder: DEFAULT_PRIVACY_PLACEHOLDER,
  },
  pflegedienst: {
    hero_title: "Pflege mit Herz, Erfahrung und Verlässlichkeit",
    hero_subtitle:
      "Ambulante Pflege bei Ihnen zuhause — einfühlsam, fachlich kompetent, immer erreichbar.",
    about_text:
      "Seit über 15 Jahren begleiten wir pflegebedürftige Menschen in ihrem Zuhause. Unser Team aus examinierten Pflegekräften ist täglich für Sie da — auch am Wochenende und an Feiertagen.\n\nWir arbeiten mit allen Pflegekassen zusammen und beraten Sie kostenlos zu Pflegegrad, Leistungen und Eigenanteil. Auf Wunsch besuchen wir Sie zu Hause für ein persönliches Beratungsgespräch.",
    opening_hours_text: `Pflege rund um die Uhr — 24/7
Büro: Mo–Fr: 8:00–17:00 Uhr
Notrufbereitschaft: 24 Stunden`,
    services: [
      {
        title: "Grundpflege",
        description:
          "Hilfe bei Körperpflege, An- und Auskleiden, Mobilisation und Lagerung.",
      },
      {
        title: "Behandlungspflege",
        description:
          "Medikamentengabe, Wundversorgung, Injektionen, Verbandwechsel — verordnet durch Ihren Arzt.",
      },
      {
        title: "Hauswirtschaftliche Versorgung",
        description:
          "Einkaufen, Kochen, Reinigung, Wäschepflege — damit Sie selbstbestimmt zu Hause leben können.",
      },
      {
        title: "Verhinderungspflege",
        description:
          "Wenn pflegende Angehörige eine Pause brauchen, übernehmen wir kurzfristig.",
      },
      {
        title: "Beratung nach §37.3 SGB XI",
        description:
          "Pflichtberatung für Pflegegeld-Empfänger — bei Ihnen zuhause, alle 3 oder 6 Monate.",
      },
    ],
    team: [
      {
        name: "Maria Becker",
        role: "Pflegedienstleitung",
        bio: "Examinierte Altenpflegerin mit über 20 Jahren Erfahrung. Verantwortlich für Pflegeplanung und Qualitätssicherung.",
      },
      {
        name: "Andreas Schmidt",
        role: "Stellvertretende Pflegedienstleitung",
        bio: "Examinierter Krankenpfleger, Schwerpunkt Behandlungspflege und Wundmanagement.",
      },
      {
        name: "Lisa Wagner",
        role: "Pflegefachkraft",
        bio: "Spezialisierung auf Demenzpflege und Palliativbetreuung.",
      },
    ],
    imprint_placeholder: DEFAULT_IMPRINT_PLACEHOLDER,
    privacy_placeholder: DEFAULT_PRIVACY_PLACEHOLDER,
  },
  arztpraxis: {
    hero_title: "Moderne Medizin, persönliche Betreuung",
    hero_subtitle:
      "Wir nehmen uns Zeit für Sie. Hausärztliche Versorgung mit modernster Diagnostik im Herzen der Stadt.",
    about_text:
      "Unsere Praxis steht für eine moderne, ganzheitliche Medizin. Wir verbinden klassische Hausarztmedizin mit aktueller Diagnostik und Vorsorge.\n\nUnser eingespieltes Team aus Ärzt:innen und medizinischen Fachangestellten begleitet Sie kompetent durch alle Phasen Ihrer Behandlung — vom Vorsorgecheck bis zur chronischen Therapie.",
    opening_hours_text: `Mo, Di, Do: 8:00–12:00, 15:00–18:00 Uhr
Mi, Fr: 8:00–13:00 Uhr
Akutsprechstunde: Mo-Fr 8:00–9:00 Uhr (ohne Termin)`,
    services: [
      {
        title: "Vorsorgeuntersuchungen",
        description:
          "Check-up 35, Hautkrebsscreening, Krebsfrüherkennung — alle gesetzlich vorgesehenen Vorsorgeleistungen.",
      },
      {
        title: "Chronische Erkrankungen",
        description:
          "Betreuung bei Diabetes, Bluthochdruck, Asthma, Herzerkrankungen — mit individuellen Behandlungsplänen.",
      },
      {
        title: "Impfungen & Reisemedizin",
        description:
          "Alle Standardimpfungen, Grippeschutz, Reiseberatung mit individuellen Empfehlungen.",
      },
      {
        title: "Labordiagnostik",
        description:
          "Blutbild, Schilddrüse, Nieren- und Leberwerte, Tumormarker — Ergebnisse meist innerhalb von 24 Stunden.",
      },
      {
        title: "EKG & Lungenfunktion",
        description:
          "Ruhe-EKG, Belastungs-EKG, Spirometrie — direkt bei uns in der Praxis.",
      },
    ],
    team: [
      {
        name: "Dr. med. Julia Hartmann",
        role: "Fachärztin für Allgemeinmedizin",
        bio: "Praxisinhaberin. Zusatzbezeichnungen Diabetologie und Notfallmedizin.",
      },
      {
        name: "Dr. med. Stefan Bauer",
        role: "Facharzt für Innere Medizin",
        bio: "Schwerpunkt Kardiologie und Hypertonie. In der Praxis seit 2018.",
      },
    ],
    imprint_placeholder: DEFAULT_IMPRINT_PLACEHOLDER,
    privacy_placeholder: DEFAULT_PRIVACY_PLACEHOLDER,
  },
  friseur: {
    hero_title: "Stil, Schnitt und Präzision",
    hero_subtitle:
      "Ihr Salon für besondere Momente. Klassisch, modern, immer mit Handwerk.",
    about_text:
      "Seit 2010 stehen wir für hochwertiges Friseurhandwerk in entspannter Atmosphäre. Bei uns bekommt jeder Schnitt die Zeit, die er braucht — wir nehmen uns Zeit zum Beraten.\n\nUnser Team bildet sich regelmäßig fort und setzt auf hochwertige, möglichst nachhaltige Produkte. Lassen Sie sich bei uns verwöhnen.",
    opening_hours_text: `Di–Fr: 9:00–19:00 Uhr
Sa: 8:00–14:00 Uhr
Mo, So: Ruhetag`,
    services: [
      {
        title: "Damenschnitt inkl. Waschen & Föhnen",
        description: "Beratung, Waschen, Schnitt, Styling — ab 45 €.",
      },
      {
        title: "Herrenschnitt",
        description: "Klassisch oder modern, inkl. Bartrasur auf Wunsch — ab 28 €.",
      },
      {
        title: "Färben & Strähnen",
        description:
          "Komplettfärbung, Foliensträhnen, Balayage — wir beraten zu Wirkung und Pflege.",
      },
      {
        title: "Hochsteckfrisuren",
        description:
          "Hochzeit, Abiball, Galaabend — Termine bitte 4 Wochen im Voraus reservieren.",
      },
    ],
    team: [
      {
        name: "Sabrina Klein",
        role: "Inhaberin & Meisterin",
        bio: "20 Jahre Erfahrung, Spezialgebiet Coloration und Hochzeitsfrisuren.",
      },
      {
        name: "Tom Richter",
        role: "Friseur",
        bio: "Schwerpunkt klassische Herrenschnitte und Bartpflege.",
      },
    ],
    imprint_placeholder: DEFAULT_IMPRINT_PLACEHOLDER,
    privacy_placeholder: DEFAULT_PRIVACY_PLACEHOLDER,
  },
  physio: {
    hero_title: "Bewegung. Therapie. Lebensqualität.",
    hero_subtitle:
      "Physiotherapie nach modernsten Standards — Einzeltermine, individuelle Behandlungspläne.",
    about_text:
      "In unserer Praxis behandeln wir Sie nach dem Bobath-, Vojta- und Manuelle-Therapie-Konzept. Wir nehmen uns Zeit für eine ausführliche Anamnese und entwickeln einen individuellen Therapieplan.\n\nWir arbeiten eng mit den Hausärzten und Fachärzten der Region zusammen — und sehen Therapie als gemeinsamen Prozess von Patient und Therapeut.",
    opening_hours_text: `Mo–Do: 7:30–19:00 Uhr
Fr: 7:30–15:00 Uhr`,
    services: [
      {
        title: "Krankengymnastik",
        description:
          "Klassische KG nach ärztlicher Verordnung — auch zu Hause möglich.",
      },
      {
        title: "Manuelle Therapie",
        description:
          "Gezielte Behandlung bei Gelenk- und Wirbelsäulenbeschwerden.",
      },
      {
        title: "Lymphdrainage",
        description:
          "Manuelle Lymphdrainage bei Lymphödemen, nach Operationen oder Verletzungen.",
      },
      {
        title: "Sportphysiotherapie",
        description:
          "Verletzungsprävention, Rehabilitation, Leistungsoptimierung — auch für Hobbysportler.",
      },
      {
        title: "Rückenschule",
        description:
          "Gruppen- oder Einzelkurse zur Prävention und Behandlung von Rückenbeschwerden.",
      },
    ],
    team: [
      {
        name: "Markus Vogel",
        role: "Physiotherapeut",
        bio: "Manualtherapeut, Sportphysiotherapeut DOSB.",
      },
      {
        name: "Anna Krüger",
        role: "Physiotherapeutin",
        bio: "Bobath, Lymphdrainage, Schwerpunkt neurologische Rehabilitation.",
      },
    ],
    imprint_placeholder: DEFAULT_IMPRINT_PLACEHOLDER,
    privacy_placeholder: DEFAULT_PRIVACY_PLACEHOLDER,
  },
  zahnarzt: {
    hero_title: "Sanfte Zahnmedizin für ein gesundes Lächeln",
    hero_subtitle:
      "Moderne Praxis, einfühlsame Behandlung — auch für Angstpatient:innen und Kinder.",
    about_text:
      "Wir bieten Ihnen das gesamte Spektrum moderner Zahnmedizin: von der professionellen Zahnreinigung über hochwertige Füllungen bis zur ästhetischen Zahnheilkunde.\n\nUnsere Praxis arbeitet mit modernster Diagnostik, schonenden Verfahren und einem speziell geschulten Team — damit auch sensible Patient:innen sich bei uns wohlfühlen.",
    opening_hours_text: `Mo, Di, Do: 8:00–13:00, 14:00–18:00 Uhr
Mi: 8:00–13:00 Uhr
Fr: 8:00–14:00 Uhr`,
    services: [
      {
        title: "Vorsorge & Prophylaxe",
        description:
          "Professionelle Zahnreinigung, Bonusheft-Untersuchung, Versiegelungen.",
      },
      {
        title: "Zahnerhaltung",
        description:
          "Ästhetische Komposit-Füllungen, Wurzelbehandlungen, Endodontie.",
      },
      {
        title: "Zahnersatz",
        description:
          "Kronen, Brücken, Implantate — wir beraten zu Möglichkeiten und Kosten.",
      },
      {
        title: "Bleaching",
        description:
          "Schonende Aufhellung mit Schienen oder im In-Office-Verfahren.",
      },
      {
        title: "Kinder- & Angstbehandlung",
        description:
          "Spezielle Sprechstunde mit ruhiger Atmosphäre und kindgerechter Aufklärung.",
      },
    ],
    team: [
      {
        name: "Dr. Anne Wagner",
        role: "Zahnärztin & Praxisinhaberin",
        bio: "Schwerpunkte Endodontie und ästhetische Zahnheilkunde.",
      },
      {
        name: "Dr. Felix Becker",
        role: "Zahnarzt",
        bio: "Spezialisierung Implantologie und Parodontologie.",
      },
    ],
    imprint_placeholder: DEFAULT_IMPRINT_PLACEHOLDER,
    privacy_placeholder: DEFAULT_PRIVACY_PLACEHOLDER,
  },
  reinigung: {
    hero_title: "Saubere Räume. Zuverlässig. Gründlich.",
    hero_subtitle:
      "Reinigungsservice für Privat, Büro und Gewerbe — pünktlich, geschult, versichert.",
    about_text:
      "Seit 2015 sorgen wir für gepflegte Räume — bei Familien zu Hause, in Praxen, Büros und Ladengeschäften. Unsere Mitarbeiter:innen sind fest angestellt, geschult und sprechen Deutsch.\n\nWir arbeiten mit umweltfreundlichen Reinigungsmitteln, sind haftpflichtversichert und stellen Ihnen feste Ansprechpartner zur Seite.",
    opening_hours_text: `Mo–Fr: 7:00–19:00 Uhr
Sa: nach Vereinbarung
Notdienst: 24/7 verfügbar`,
    services: [
      {
        title: "Unterhaltsreinigung",
        description:
          "Regelmäßige Reinigung von Büros, Praxen, Treppenhäusern — täglich, wöchentlich oder monatlich.",
      },
      {
        title: "Privatreinigung",
        description:
          "Wohnungsreinigung mit festem Termin, eigenes Reinigungsteam, ohne lange Vertragsbindung.",
      },
      {
        title: "Grundreinigung",
        description:
          "Tiefenreinigung nach Umzug, Renovierung oder Sanierung — Räume, Böden, Fenster.",
      },
      {
        title: "Fensterreinigung",
        description:
          "Innen und außen, mit Rahmen, Rolladen und Fensterbänken.",
      },
      {
        title: "Teppich- & Polsterreinigung",
        description:
          "Sprühextraktionsverfahren — entfernt Flecken, Milben und Allergene.",
      },
    ],
    team: [
      {
        name: "Daniela Krause",
        role: "Geschäftsführung",
        bio: "Verantwortlich für Kundenbetreuung und Qualitätssicherung.",
      },
    ],
    imprint_placeholder: DEFAULT_IMPRINT_PLACEHOLDER,
    privacy_placeholder: DEFAULT_PRIVACY_PLACEHOLDER,
  },
  schreiner: {
    hero_title: "Maßarbeit aus Holz",
    hero_subtitle:
      "Möbel, Türen, Einbauküchen — handwerklich gefertigt nach Ihren Vorstellungen.",
    about_text:
      "In dritter Generation fertigen wir Möbel und Innenausbauten nach Maß. Vom Entwurf über die Auswahl der Holzart bis zur Montage in Ihren Räumen — alles aus einer Hand.\n\nWir arbeiten mit heimischen Hölzern aus nachhaltiger Forstwirtschaft und kombinieren traditionelles Handwerk mit moderner CNC-Technik.",
    opening_hours_text: `Mo–Do: 7:00–17:00 Uhr
Fr: 7:00–14:00 Uhr
Sa: nach Vereinbarung`,
    services: [
      {
        title: "Einbauküchen",
        description:
          "Maßgefertigte Küchen aus Massivholz oder Furnier — von der Planung bis zur Montage.",
      },
      {
        title: "Einbauschränke & Garderoben",
        description:
          "Genau passend für Schrägen, Nischen und Dachschrägen — keine Standard-Maße nötig.",
      },
      {
        title: "Massivholz-Tische & Bänke",
        description:
          "Esstische, Sitzbänke, Beistelltische in Eiche, Nuss, Esche.",
      },
      {
        title: "Türen & Tore",
        description:
          "Innentüren, Haustüren, Hoftore — auch in historischer Optik.",
      },
      {
        title: "Reparatur & Restauration",
        description:
          "Aufarbeitung alter Möbel, Reparatur beschädigter Holzteile, Aufpolieren.",
      },
    ],
    team: [
      {
        name: "Klaus Berger",
        role: "Inhaber & Schreinermeister",
        bio: "Über 30 Jahre Erfahrung, Schwerpunkt Möbelbau und Restauration.",
      },
      {
        name: "Lukas Berger",
        role: "Schreinergeselle",
        bio: "Junior-Generation, Schwerpunkt CNC und moderne Designs.",
      },
    ],
    imprint_placeholder: DEFAULT_IMPRINT_PLACEHOLDER,
    privacy_placeholder: DEFAULT_PRIVACY_PLACEHOLDER,
  },
  kosmetik: {
    hero_title: "Auszeit für Sie und Ihre Haut",
    hero_subtitle:
      "Kosmetikbehandlungen, Wellness, Wohlbefinden — in entspannter Atmosphäre.",
    about_text:
      "Unser Studio ist ein Ort der Ruhe — abseits der Hektik des Alltags. Wir arbeiten mit hochwertigen, dermatologisch getesteten Produkten und nehmen uns Zeit für eine ausführliche Hautanalyse.\n\nVom klassischen Reinigungsfacial über Anti-Aging-Behandlungen bis zur professionellen Maniküre — bei uns sind Sie in besten Händen.",
    opening_hours_text: `Di–Fr: 10:00–19:00 Uhr
Sa: 9:00–14:00 Uhr
Mo, So: Ruhetag`,
    services: [
      {
        title: "Klassische Gesichtsbehandlung",
        description:
          "Reinigung, Peeling, Maske, Pflege — 60 Minuten Auszeit für Ihre Haut.",
      },
      {
        title: "Anti-Aging-Behandlung",
        description:
          "Hochwirksame Wirkstoffe, sanfte Massage, Kollagen-Maske.",
      },
      {
        title: "Maniküre & Pediküre",
        description:
          "Klassisch, mit Lack oder Shellac — auch Spa-Variante mit Paraffinbad.",
      },
      {
        title: "Wimpernlifting",
        description:
          "Natürlich geschwungene Wimpern für 6-8 Wochen — ohne Extensions.",
      },
      {
        title: "Hochzeits-Make-up",
        description:
          "Probetermine, Brautstyling am Hochzeitstag, langanhaltend dokumentiert.",
      },
    ],
    team: [
      {
        name: "Nina Sommer",
        role: "Kosmetikerin & Inhaberin",
        bio: "Geprüfte Kosmetikerin, Spezialisierung Anti-Aging und apparative Kosmetik.",
      },
    ],
    imprint_placeholder: DEFAULT_IMPRINT_PLACEHOLDER,
    privacy_placeholder: DEFAULT_PRIVACY_PLACEHOLDER,
  },
  anwalt: {
    hero_title: "Vertrauen. Diskretion. Klarheit.",
    hero_subtitle:
      "Erfahrene Rechtsberatung in einem persönlichen, vertraulichen Rahmen — Familienrecht, Arbeitsrecht, Erbrecht.",
    about_text:
      "Unsere Kanzlei berät Privatpersonen und mittelständische Unternehmen seit über 20 Jahren. Wir nehmen uns Zeit, hören zu und finden gemeinsam mit Ihnen den rechtlich tragfähigsten Weg.\n\nDas Erstgespräch ist unverbindlich. Wir erklären Ihnen offen, ob ein Verfahren Aussicht auf Erfolg hat, mit welchem Aufwand zu rechnen ist und welche Kosten anfallen.",
    opening_hours_text: `Mo–Fr: 9:00–18:00 Uhr
Termine nach Vereinbarung
Notfall-Mandate auch außerhalb der Öffnungszeiten`,
    services: [
      {
        title: "Familienrecht",
        description:
          "Trennung, Scheidung, Unterhalt, Sorgerecht — wir begleiten Sie durch persönlich belastende Situationen.",
      },
      {
        title: "Arbeitsrecht",
        description:
          "Kündigungsschutz, Aufhebungsverträge, Lohnstreitigkeiten — für Arbeitnehmer:innen und Arbeitgeber.",
      },
      {
        title: "Erbrecht",
        description:
          "Testament, Erbauseinandersetzung, Pflichtteil — wir gestalten und durchsetzen, immer mit Augenmaß.",
      },
      {
        title: "Vertragsrecht",
        description:
          "Prüfung, Erstellung und Verhandlung von Verträgen — schützt Sie vor späteren Streitigkeiten.",
      },
      {
        title: "Mietrecht",
        description:
          "Mängelanzeigen, Mieterhöhungen, Räumungsklagen — auf der Seite von Mietern und Vermietern.",
      },
    ],
    team: [
      {
        name: "Dr. Stefan Berg",
        role: "Rechtsanwalt & Partner",
        bio: "Fachanwalt für Familien- und Erbrecht. Mehr als 20 Jahre Praxiserfahrung.",
      },
      {
        name: "Lena Hoffmann",
        role: "Rechtsanwältin",
        bio: "Schwerpunkte Arbeits- und Mietrecht. Mediationsausbildung.",
      },
    ],
    imprint_placeholder: DEFAULT_IMPRINT_PLACEHOLDER,
    privacy_placeholder: DEFAULT_PRIVACY_PLACEHOLDER,
  },
  restaurant: {
    hero_title: "Frische Küche. Herzlicher Service.",
    hero_subtitle:
      "Saisonale Gerichte, regionale Zutaten — täglich neu für Sie zubereitet. Wir freuen uns auf Ihren Besuch.",
    about_text:
      "Unser Familienbetrieb steht seit 1998 für ehrliche, saisonale Küche. Die Zutaten beziehen wir wann immer möglich von Höfen aus der Region — kurze Wege, beste Qualität.\n\nOb Geschäftsessen, Familienfeier oder Spaziergänger:innen mit Hunger: bei uns sitzen Sie gut. Reservieren Sie online, telefonisch oder kommen Sie spontan vorbei.",
    opening_hours_text: `Di–Fr: 11:30–14:30 & 17:30–22:00 Uhr
Sa & So: 11:30–22:00 Uhr durchgehend
Mo: Ruhetag`,
    services: [
      {
        title: "Mittagsmenü",
        description:
          "Wechselnde 2- und 3-Gänge-Menüs zwischen 11:30 und 14:30 — perfekt fürs Geschäftsessen.",
      },
      {
        title: "À la carte",
        description:
          "Saisonale Karte mit klassischen und modernen Gerichten, vegetarische und vegane Optionen.",
      },
      {
        title: "Familienfeiern & Events",
        description:
          "Hochzeiten, Geburtstage, Firmenfeiern — wir organisieren Menü, Service und Räume bis 60 Personen.",
      },
      {
        title: "Catering",
        description:
          "Wir liefern auch außer Haus: Buffets, Fingerfood, Mehrgang-Menüs für Ihre Gäste zuhause oder im Büro.",
      },
    ],
    team: [
      {
        name: "Marco Reiter",
        role: "Inhaber & Küchenchef",
        bio: "Gelernter Koch, Stationen in München und Wien. Liebt regionale Küche mit modernen Akzenten.",
      },
      {
        name: "Carla Reiter",
        role: "Service-Leitung",
        bio: "Sorgt seit 1998 dafür, dass sich jeder Gast willkommen und entspannt fühlt.",
      },
    ],
    imprint_placeholder: DEFAULT_IMPRINT_PLACEHOLDER,
    privacy_placeholder: DEFAULT_PRIVACY_PLACEHOLDER,
  },
};

export function getDemoContent(key: TemplateKey): DemoContent {
  return DEMO[key];
}
