/**
 * Kopffoto je Beitrag aus public/images, passend zu den Bildern der
 * Journal-Übersicht. Beiträge ohne eigenes Foto bekommen ein ruhiges
 * Motiv zum Thema.
 */
export type KopfBild = {
  src: string;
  alt: string;
  position?: string;
  unterschrift: string;
};

const FOTOS: Record<string, KopfBild> = {
  "google-unternehmensprofil-einrichten": {
    src: "/images/hamburg-speicherstadt.webp",
    alt: "Speicherstadt in Hamburg mit Backsteinfassaden am Fleet",
    unterschrift: "Speicherstadt, Hamburg",
  },
  "pflichtangaben-website-impressum-datenschutz": {
    src: "/images/atmosphere/kanzlei-buecher.webp",
    alt: "Regal mit gebundenen Fachbüchern, davor eine Messinglampe in warmem Licht",
    unterschrift: "Impressum und Datenschutz, einmal sauber aufgeschrieben",
  },
  "domain-hosting-ssl-email-website-was-braucht-mein-betrieb": {
    src: "/images/workspace-laptop.webp",
    alt: "Aufgeklappter Laptop auf einem hellen Schreibtisch",
    unterschrift: "Am Schreibtisch in Hamburg",
  },
  "die-zweite-frage": {
    src: "/images/cafe-eimsbuettel.webp",
    alt: "Café-Tisch mit zwei Stühlen an einer Kopfsteinpflasterstraße in Eimsbüttel",
    position: "50% 60%",
    unterschrift: "Eimsbüttel, Hamburg",
  },
  "wann-eine-website-warten-kann": {
    src: "/images/texture-espresso.webp",
    alt: "Eine Tasse Espresso auf einem Holztisch",
    unterschrift: "Erst einmal einen Kaffee",
  },
  "der-preis-einer-website": {
    src: "/images/workspace-macbook.webp",
    alt: "Hände an einer Laptop-Tastatur, daneben ein Notizbuch mit Stichpunkten",
    unterschrift: "Am Schreibtisch in Hamburg",
  },
  "warum-wir-keine-mockups-zeigen": {
    src: "/images/workspace-prints.webp",
    alt: "Drei gerahmte Entwürfe mit Logo, Farben und Schrift an einer hellen Wand",
    position: "50% 40%",
    unterschrift: "Entwürfe an der Wand im Büro",
  },
  "cafe-website-hamburg-2026": {
    src: "/images/atmosphere/gastro-cafe.webp",
    alt: "Café mit kupferner Espressomaschine und Holztischen",
    unterschrift: "Ein Café in Hamburg",
  },
  "pflegedienst-google-maps-hamburg": {
    src: "/images/atmosphere/pflege-eingang.webp",
    alt: "Heller Empfang eines Pflegedienstes mit Holztresen und Pflanze",
    position: "50% 60%",
    unterschrift: "Empfang eines Pflegedienstes",
  },
  "was-wir-an-wix-migrationen-lernen": {
    src: "/images/workspace-typing.webp",
    alt: "Hände auf der Tastatur eines Laptops in warmem Licht",
    unterschrift: "Am Schreibtisch in Hamburg",
  },
};

export function kopfBild(slug: string): KopfBild {
  return (
    FOTOS[slug] ?? {
      src: "/images/hamburg-speicherstadt.webp",
      alt: "Speicherstadt in Hamburg mit Backsteinfassaden am Fleet",
      unterschrift: "Hamburg",
    }
  );
}
