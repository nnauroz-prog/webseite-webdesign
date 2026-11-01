/**
 * Entscheidungshilfe „Selbst machen oder machen lassen“ für den Ratgeber
 * /webseite-erstellen.
 *
 * Bewusst offen im Code (wie lib/empfehlung-logic.ts): vier Fragen, sechs
 * Regeln, die erste zutreffende gilt. Keine Punkte, kein Gewichten, damit
 * jede Empfehlung aus den Antworten nachvollziehbar bleibt.
 *
 * Zeitangaben sind dieselben Einschätzungen wie auf /vergleich und im
 * Ratgeber selbst (Baukasten 10 bis 40 Stunden Aufbau, 1 bis 3 Stunden
 * Pflege im Monat; selbst programmiert 30 bis 80 Stunden). Für WordPress
 * und Shops gibt es keine belegte Zahl, deshalb steht dort keine.
 */

export type Zeit = "wenig" | "mittel" | "viel";
export type Technik = "niedrig" | "mittel" | "hoch";
export type Ziel = "visitenkarte" | "anfragen" | "pflege" | "shop";
export type Pflege = "selbst" | "gemischt" | "abgeben";

export type WegAntworten = {
  zeit: Zeit | null;
  technik: Technik | null;
  ziel: Ziel | null;
  pflege: Pflege | null;
};

export type VollstaendigeAntworten = {
  zeit: Zeit;
  technik: Technik;
  ziel: Ziel;
  pflege: Pflege;
};

export const LEERE_ANTWORTEN: WegAntworten = {
  zeit: null,
  technik: null,
  ziel: null,
  pflege: null,
};

type Option<T extends string> = { value: T; label: string };

export type Frage =
  | { key: "zeit"; frage: string; optionen: Option<Zeit>[] }
  | { key: "technik"; frage: string; optionen: Option<Technik>[] }
  | { key: "ziel"; frage: string; optionen: Option<Ziel>[] }
  | { key: "pflege"; frage: string; optionen: Option<Pflege>[] };

export const FRAGEN: Frage[] = [
  {
    key: "zeit",
    frage:
      "Wie viel Zeit können Sie in den nächsten vier Wochen für die Seite freimachen?",
    optionen: [
      { value: "wenig", label: "Höchstens ein paar Stunden (unter\u00A010)" },
      {
        value: "mittel",
        label: "Einige Abende (etwa\u00A010\u00A0bis\u00A025\u00A0Stunden)",
      },
      {
        value: "viel",
        label: "Mehrere Wochenenden (25\u00A0Stunden\u00A0und\u00A0mehr)",
      },
    ],
  },
  {
    key: "technik",
    frage: "Wie gehen Sie mit Technik um?",
    optionen: [
      { value: "niedrig", label: "Überlasse ich lieber anderen" },
      { value: "mittel", label: "Mit Programmen komme ich gut zurecht" },
      { value: "hoch", label: "Ich habe schon Seiten gebaut oder lese Code" },
    ],
  },
  {
    key: "ziel",
    frage: "Was soll die Seite vor allem leisten?",
    optionen: [
      { value: "visitenkarte", label: "Adresse, Zeiten und Telefon zeigen" },
      {
        value: "anfragen",
        label: "Regelmäßig Anfragen bringen, auch über Google",
      },
      { value: "pflege", label: "Inhalte zeigen, die sich jede Woche ändern" },
      { value: "shop", label: "Online verkaufen" },
    ],
  },
  {
    key: "pflege",
    frage:
      "Wer kümmert sich nach dem Start um Änderungen, Updates und Rechtstexte?",
    optionen: [
      { value: "selbst", label: "Ich selbst" },
      { value: "gemischt", label: "Mal ich, mal jemand anderes" },
      { value: "abgeben", label: "Jemand anderes" },
    ],
  },
];

export type WegSlug =
  | "shop"
  | "lassen"
  | "code-oder-wordpress"
  | "lassen-mit-pflege"
  | "wordpress-oder-baukasten"
  | "baukasten";

export type WegErgebnis = {
  slug: WegSlug;
  titel: string;
  /** Zwei bis drei Sätze, aus den Antworten zusammengesetzt. */
  gruende: string[];
  /** Nur die Einschätzungen aus dem Ratgeber, sonst ohne Zahl. */
  zeitbedarf: string;
  /** Läuft auf „erstellen lassen“ hinaus: dann dezent auf Angebote und Sitalo verweisen. */
  lassen: boolean;
};

const ZEIT_BAUKASTEN =
  "Nach unserer Einschätzung 10 bis 40 Stunden für den Aufbau, danach 1 bis 3 Stunden Pflege im Monat.";
const ZEIT_LASSEN =
  "Für Sie ein Gespräch und das Sammeln von Stichpunkten und Fotos. Wie lange der Bau dauert, hängt vom Anbieter und vom Umfang ab; fragen Sie nach einem Termin ab vollständigen Unterlagen.";

export function istVollstaendig(a: WegAntworten): a is VollstaendigeAntworten {
  return (
    a.zeit !== null &&
    a.technik !== null &&
    a.ziel !== null &&
    a.pflege !== null
  );
}

export function anzahlOffen(a: WegAntworten): number {
  return [a.zeit, a.technik, a.ziel, a.pflege].filter((v) => v === null).length;
}

export function empfehleWeg(a: VollstaendigeAntworten): WegErgebnis {
  // (1) Online verkaufen: ein Shopsystem, unabhängig vom Rest.
  if (a.ziel === "shop") {
    return {
      slug: "shop",
      titel: "Ein Shopsystem",
      gruende: [
        "Sie möchten online verkaufen. Dafür brauchen Sie Warenkorb, Zahlungsarten, Versandkosten und eine Widerrufsbelehrung, und das leistet ein Shopsystem oder der Shop-Tarif eines Baukastens.",
        "Wir selbst bauen Shops nur im Einzelfall. Für einen reinen Onlineshop sind wir deshalb meist nicht die richtige Adresse.",
      ],
      zeitbedarf:
        "Den Aufwand bestimmt vor allem die Zahl der Produkte: Jedes braucht Fotos, Text, Preis und Versandangaben.",
      lassen: false,
    };
  }

  // (2) Kaum Zeit oder niemand, der sich danach kümmert: erstellen lassen.
  if (a.zeit === "wenig" || a.pflege === "abgeben") {
    const gruende: string[] = [];
    if (a.zeit === "wenig") {
      gruende.push(
        "In den nächsten vier Wochen haben Sie höchstens ein paar Stunden für die Seite. Mit einem Baukasten brauchen selbst einfache Seiten nach unserer Einschätzung 10 bis 40 Stunden.",
      );
    }
    if (a.pflege === "abgeben") {
      gruende.push(
        "Nach dem Start soll sich jemand anderes um die Seite kümmern. Beim Baukasten übernimmt der Anbieter zwar die Technik, Inhalte und Rechtstexte bleiben aber bei Ihnen.",
      );
    }
    gruende.push(
      "Ihr Teil ist dann ein Gespräch, Stichpunkte zu Ihren Leistungen und ein paar Fotos.",
    );
    return {
      slug: "lassen",
      titel: "Erstellen lassen",
      gruende,
      zeitbedarf: ZEIT_LASSEN,
      lassen: true,
    };
  }

  // (3) Erfahrung mit Code und viel Zeit: selbst programmieren oder WordPress.
  if (a.technik === "hoch" && a.zeit === "viel") {
    return {
      slug: "code-oder-wordpress",
      titel: "Selbst programmieren oder WordPress",
      gruende: [
        "Sie haben schon Seiten gebaut oder lesen Code und können mehrere Wochenenden einplanen.",
        a.ziel === "pflege"
          ? "Weil sich Ihre Inhalte jede Woche ändern, spricht viel für WordPress: Neues tragen Sie dort ohne Code ein."
          : "Eine selbst programmierte Seite gehört ganz Ihnen. Formular, Spamschutz, Hosting und Tests am Handy übernehmen Sie dann selbst.",
      ],
      zeitbedarf:
        "Selbst programmiert nach unserer Einschätzung 30 bis 80 Stunden mit Einarbeitung. Für WordPress nennen wir keine Zahl, das hängt zu sehr von Theme und Erweiterungen ab.",
      lassen: false,
    };
  }

  // (4) Inhalte, die sich jede Woche ändern.
  if (a.ziel === "pflege") {
    if (a.technik === "niedrig") {
      return {
        slug: "lassen-mit-pflege",
        titel: "Erstellen lassen, mit Bereichen zum Selbstpflegen",
        gruende: [
          "Ihre Inhalte ändern sich jede Woche, mit Technik möchten Sie aber wenig zu tun haben.",
          "Dann passt eine Seite, deren Technik jemand anderes einrichtet und betreut. Sie sehen nur die Felder, die Sie wöchentlich ändern, etwa Speisekarte, Angebot oder Termine.",
        ],
        zeitbedarf: ZEIT_LASSEN,
        lassen: true,
      };
    }
    return {
      slug: "wordpress-oder-baukasten",
      titel: "WordPress oder ein Baukasten mit Bearbeitungsbereichen",
      gruende: [
        "Ihre Inhalte ändern sich jede Woche, und mit Programmen kommen Sie zurecht.",
        "WordPress ist für häufige Änderungen gebaut. Viele Baukästen bieten dafür eigene Bereiche, etwa für Neuigkeiten oder Termine.",
      ],
      zeitbedarf: `${ZEIT_BAUKASTEN} Bei wöchentlichen Änderungen eher mehr. Für WordPress nennen wir keine Zahl.`,
      lassen: false,
    };
  }

  // (5) Anfragen über Google, aber Technik lieber abgeben.
  if (a.ziel === "anfragen" && a.technik === "niedrig") {
    return {
      slug: "lassen",
      titel: "Erstellen lassen",
      gruende: [
        "Die Seite soll regelmäßig Anfragen bringen, auch über Google, und Technik überlassen Sie lieber anderen.",
        "Für Anfragen zählen eine kurze Ladezeit am Handy, Titel und Beschreibungen für Google und ein kurzer Weg zum Telefon. Das selbst einzurichten kostet ohne Erfahrung viel Zeit.",
      ],
      zeitbedarf: ZEIT_LASSEN,
      lassen: true,
    };
  }

  // (6) Sonst reicht ein Baukasten.
  const gruende: string[] = [];
  if (a.ziel === "visitenkarte") {
    gruende.push(
      "Die Seite soll vor allem Adresse, Zeiten und Telefon zeigen. Dafür reicht eine Seite aus einer Vorlage.",
    );
  } else {
    gruende.push(
      "Die Seite soll Anfragen bringen, und mit Technik kommen Sie zurecht. Das schaffen Sie mit einem Baukasten, wenn Sie Schritt 6 (Google) gründlich angehen.",
    );
  }
  if (a.zeit === "mittel") {
    gruende.push(
      "Mit einigen Abenden kommen Sie für eine einfache Seite hin, wenn Texte und Fotos schon bereitliegen und die Seite am unteren Ende unserer Einschätzung bleibt.",
    );
  } else {
    gruende.push(
      "Mit mehreren Wochenenden haben Sie genug Zeit, auch für Texte und Fotos.",
    );
  }
  if (a.technik === "hoch") {
    gruende.push(
      "Wer Code liest, kann auch selbst programmieren. Für eine einfache Seite ist der Baukasten aber der kürzere Weg.",
    );
  } else if (a.technik === "niedrig") {
    gruende.push(
      "Auch ohne Technikerfahrung kommen Sie mit einer Vorlage zurecht. Wird es Ihnen zu viel, ist Erstellenlassen der nächste Schritt.",
    );
  } else {
    gruende.push("Änderungen machen Sie im Baukasten selbst, ohne Code.");
  }
  return {
    slug: "baukasten",
    titel: "Ein Baukasten reicht",
    gruende,
    zeitbedarf: ZEIT_BAUKASTEN,
    lassen: false,
  };
}

/**
 * Die sechs Regeln von empfehleWeg() in Worten, in derselben Reihenfolge.
 * Steht im Ratgeber unter den Fragen (auch ohne JavaScript lesbar). Wer
 * eine Regel oben ändert, ändert sie hier mit.
 */
export const FAUSTREGEL: { wenn: string; text: string }[] = [
  {
    wenn: "Ein Shopsystem, wenn\u00A0…",
    text: "Sie online verkaufen wollen, mit Warenkorb, Zahlung und Versand.",
  },
  {
    wenn: "Erstellen lassen, wenn\u00A0…",
    text: "Sie in den nächsten vier Wochen höchstens ein paar Stunden haben oder sich nach dem Start jemand anderes um die Seite kümmern soll.",
  },
  {
    wenn: "Selbst programmieren oder WordPress, wenn\u00A0…",
    text: "Sie schon Seiten gebaut haben oder Code lesen und mehrere Wochenenden einplanen können.",
  },
  {
    wenn: "Bei Inhalten, die sich jede Woche ändern\u00A0…",
    text: "erstellen lassen, mit Bereichen zum Selbstpflegen, wenn Sie Technik lieber anderen überlassen. Sonst WordPress oder ein Baukasten mit Bearbeitungsbereichen.",
  },
  {
    wenn: "Erstellen lassen, wenn\u00A0…",
    text: "die Seite regelmäßig Anfragen bringen soll und Sie Technik lieber anderen überlassen.",
  },
  {
    wenn: "Sonst reicht ein Baukasten\u00A0…",
    text: "für eine einfache Seite, wenn Sie einige Abende Zeit haben. Soll die Seite Anfragen bringen, gehen Sie Schritt 6 (Google) gründlich an.",
  },
];
