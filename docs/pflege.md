# Pflege der Sitalo-Webseite

Kurze Anleitung für die Stellen, an denen regelmäßig Inhalt aktualisiert werden muss. Alles andere (Branchen-Texte, Pakete-Preise, Stadtteile, FAQ) ändert sich selten und ist im jeweiligen Daten-File selbsterklärend kommentiert.

## „Aus dem Atelier"-Sektion (Homepage)

**File:** `components/marketing/im-atelier.tsx` — ganz oben das `ATELIER_NOTES`-Array.

**Was es ist:** Die kleine Aktivitäts-Sektion auf der Homepage zwischen Pakete und FAQ. Soll signalisieren, dass das Atelier aktuell läuft — anonymisiert, ohne Klar-Namen.

**Wann pflegen:** Idealerweise alle 2–3 Wochen mal kurz drübergehen. Spätestens, wenn jemand auf die Seite schaut und denkt „die Einträge sind ja schon zwei Monate alt".

**Eintragsstruktur:**

```ts
{
  when: "Diese Woche",
  text: "Pflegedienst aus Wandsbek — Bewerbungsformular und Team-Bereich aufgebaut.",
}
```

- `when`: relativer Zeit-Anker. **Keine harten Daten** („3. Mai") — die laufen ab. Stattdessen: „Diese Woche", „Letzte Woche", „Vor zwei Wochen", „Diesen Monat", „Letzten Monat", „KW 22".
- `text`: ein konkreter Satz. **Branche + Stadtteil ok, Klar-Namen NUR mit Kundenfreigabe.**

**Gute Einträge:**

- „Pflegedienst aus Wandsbek — Bewerbungsformular live geschaltet."
- „Café in Eppendorf — Speisekarte selbst pflegbar übergeben."
- „Drei Erstgespräche aus Hamburg-Nord, zwei in Konkretisierung."
- „Hosting-Migration für eine alte Kanzlei-Seite abgeschlossen."

**Schlechte Einträge** (nicht reinschreiben):

- „Restaurant Müller in der Schanze, Speisekarte fertig." — Klar-Name ohne Freigabe.
- „Vom 3. bis 5. Mai an einer Friseur-Seite gebaut." — hartes Datum, läuft ab.
- „Tolle Erfolge mit unseren neuesten Kunden." — vage, klingt nach Marketing-Floskel.

**Wenn gerade wirklich wenig läuft:**

Lieber knapp als erfunden. Drei Optionen, von ehrlich zu leiser:

1. **Auf 2 Einträge runterkürzen** und beide generisch halten:
   ```ts
   { when: "Diesen Monat", text: "Zwei Erstgespräche aus Hamburg-Nord." }
   { when: "Aktuell", text: "Slots für Juni werden vergeben." }
   ```
2. **Array komplett leeren** — die Sektion rendert dann nicht (Graceful Fallback).
3. **Niemals erfinden** — das bricht den Voice-Pakt der Seite („wir verkaufen nichts, was nicht stimmt"). Lieber zwei magere Einträge als fünf hübsche, die's nie gab.

**Aktualisieren in Vercel:** File ändern, committen, pushen → Vercel deployed automatisch. Kein extra Build-Schritt nötig.

---

## Posts: Spruch des Tages und Story

**Files:** `lib/posts-aktuell.ts` (die Karten des Tages), `lib/anlaesse.ts` (Kalender mit Feiertagen, Handelstagen und Hamburger Terminen), Reserve in `lib/sprueche-liste.ts` und `lib/sprueche-extra.ts`.

**Wie es läuft:** Jeden Morgen gegen 5 Uhr schaut ein automatischer Lauf nach, was heute ansteht: Anlässe aus `lib/anlaesse.ts`, dazu Hamburger Termine, Wetter und Neues rund um Google und Recht für kleine Betriebe. Daraus schreibt er ein bis drei Karten für heute, hängt sie unten an `lib/posts-aktuell.ts` an, lässt Tests und Bildprüfung laufen und veröffentlicht. Die erste Karte ist der Spruch des Tages auf /journal, alle drei findest du zum Teilen im Story-Studio (/admin/story). Im Beitragstext steht automatisch ein Schlagwort zum Anlass, etwa #blackfriday.

**Reserve:** Fällt der Lauf aus oder schreibt er weniger als drei Karten, springen die Reserve-Karten ein. Sie sind nur noch das Sicherheitsnetz; werden sie knapp, ein paar neue unten anhängen.

**Selbst eingreifen:**

- Eine Karte von heute passt dir nicht: in `lib/posts-aktuell.ts` ändern oder den Tag löschen, dann springt die Reserve ein. Vergangene Tage stehen lassen, das Journal zeigt sieben Tage zurück.
- Neuer Hamburger Termin (Dom, Hafengeburtstag, Weihnachtsmarkt): in `lib/anlaesse.ts` unten bei `TERMINE_HAMBURG` anhängen, mit Start, Ende und der Adresse, auf der das Datum steht. Ohne Quelle kein Eintrag.
- Danach `npm test`, committen, pushen.

**Was die Tests prüfen:** keine Ziffern, Preise, Marken oder Garantien; Sie-Form oder ohne Anrede; Anlass kurz (höchstens 28 Zeichen), ohne Ziffern; kein Satz doppelt, auch nicht fast wörtlich. Unglücke, Kriminalität und Politik lässt der Lauf bewusst weg.

---

## Redaktion im Story-Studio: Serien auf Zuruf

**Files:** `lib/redaktion/` (Ablauf in `ablauf.ts`, Vorgaben für die drei Rollen in `prompts.ts`, Anschluss ans Modell in `anthropic.ts`), `app/admin/story/redaktion/route.ts`, gespeicherte Serien in `lib/serien-store.ts` (Tabelle `serien`).

**Wie es läuft:** Du tippst im Story-Studio einen Auftrag, etwa „Story-Serie zu Black Friday“ (leer heißt: mach was zu diesem Tag). Dann arbeiten drei Rollen nacheinander: Der Themen-Scout sucht den Blickwinkel, die Texterin schreibt drei bis fünf Bilder (Aufhänger, Problem, Lösung, Einladung zur Anfrage), der Lektor bessert nach. Dazwischen prüft der Code dieselben Regeln wie bei den Karten des Tages und ob ein Satz schon einmal erschienen ist. Ins Studio kommt nur eine Serie, die alles einhält; sonst gibt es eine kurze Meldung statt einer halben Serie.

**Einrichten:** Schlüssel und Kosten stehen in `docs/vercel-einrichtung.md`, Teil 8. Stellschrauben in Vercel: `STUDIO_MODELL` (anderes Modell) und `STUDIO_TAGESLIMIT` (Aufträge pro Tag, ohne Angabe 40).

**Selbst eingreifen:** Ton und Regeln für die Texte stehen in `lib/redaktion/prompts.ts`. Nach einer Änderung `npm test` laufen lassen und im Studio einen Auftrag ausprobieren. Die Tests arbeiten mit einer Attrappe statt des Modells und kosten nichts.

---

## Sonstige Pflege-Stellen

Reine Referenz — diese Sachen ändern sich selten, aber wenn doch, ist hier zu schauen.

### Preise & Paket-Features
- `lib/pakete-data.ts` — Setup-Preise, Monatsbeiträge, Inhalte, FAQ pro Paket.
- Wenn sich der **Festpreis** ändert: `setup` und `monthly` updaten. Die `priceCurrency`-Berechnung im JSON-LD (`app/pakete/[slug]/page.tsx`) zieht sich die Zahl automatisch aus dem String.

### Branchen-Inhalte
- `lib/branchen-data.ts` — eine Branche pro Eintrag mit `shortBody`, `detailHeadline`, `detailIntro`, `bullets`, `features`, `faq`, `recommendedPackage`.
- Neue Branche hinzufügen → automatisch neue `/branchen/[slug]`-Seite + OG-Image + Sitemap-Eintrag + ggf. Anpassung der Marquee.

### Stadtteile (Long-Tail-SEO)
- `lib/standorte-data.ts` — pro Stadtteil `name`, `tagline`, `intro`, `body`, `anker`, `empfohleneBranchen`, `pullQuote`.
- Neue Stadtteile hinzufügen → automatisch neue `/standorte/[slug]`-Seite + OG-Image + Sitemap-Eintrag.

### Globale FAQ
- `app/faq/page.tsx` — `GROUPS`-Array enthält alle Q&A-Items, gruppiert.
- Wird automatisch als FAQPage-JSON-LD in den HTML-Head gerendert (für Google Rich Results).

### Telefonnummer & E-Mail
- Telefonnummer steht hardcoded in mehreren Files: Header-Footer, FinalCta, /kontakt, /atelier. Bei Änderung Suchen-und-Ersetzen über `+491607621876` und `0160 7621876`.
- E-Mail: Die Adresse `info@sitalo.de` steht seit November 2026 bewusst nur noch im Impressum und in der Datenschutzerklärung. Besucher sollen das Anfrageformular oder das Telefon nutzen; die Texte sagen „wir melden uns“ und legen sich auf keinen Weg fest. Soll die Adresse wieder erscheinen, gehört sie an diese Stellen: strukturierte Daten in `app/layout.tsx` (Betrieb und `contactPoint`), Abschnitt Kontakt in `app/llms.txt/route.ts` und `app/llms-full.txt/route.ts`, Text im Kalender-Eintrag `app/termin/kalender.ics/route.ts`, `public/sitalo-kontakt.vcf`, `public/humans.txt` und die Profiltexte in `docs/profiltexte.md` und `docs/sichtbarkeit.md`.
- Telefon ist in allen drei Formularen Pflichtfeld (Anfrage, Durchsicht, Termin). Die Regel steht in `lib/kontakt-pflicht.ts` und gilt im Browser und am Server (`app/api/anfrage/route.ts`). Der Admin findet die Nummer unter dem Feldnamen „Telefon“; diesen Namen nicht ändern.
- vCard `public/sitalo-kontakt.vcf` separat aktualisieren, wenn sich Daten ändern.

### Hosting-Umgebung
- Env-Variable `NEXT_PUBLIC_SITE_URL` muss in Vercel auf `https://www.sitalo.de` zeigen — sonst leaken Canonical-Tags und Sitemap-Einträge auf die vercel.app-Subdomain (würde sitalo.de-Rankings kannibalisieren). Aktuell korrekt gesetzt.

---

## Was sich automatisch updated

Damit du nicht denkst, was Pflege braucht:

- **Aktueller Monat** in `Pakete & Preise`-Sektion (Pricing-Kapazitäts-Hinweis) — server-rendered aus `new Date()`.
- **Aktueller Monat + Jahr** in `Aus dem Atelier`-Eyebrow — gleiche Logik.
- **Spruch des Tages** — kommt jeden Morgen frisch aus dem Lauf, sonst aus der Reserve.
- **Sitemap** — automatisch generiert aus den Daten-Files.
- **OG-Bilder** — alle 23 statisch zur Build-Zeit gerendert.
- **JSON-LD** — pro Detail-Seite automatisch generiert (Service, BreadcrumbList, FAQPage, LocalBusiness).
