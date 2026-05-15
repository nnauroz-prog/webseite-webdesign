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
- Telefonnummer steht hardcoded in mehreren Files: Header-Footer, FinalCta, /kontakt, /atelier. Bei Änderung Suchen-und-Ersetzen über `+4915224437370` und `0152 24437370`.
- E-Mail `info@sitalo.de` ebenfalls Suchen-und-Ersetzen.
- vCard `public/sitalo-kontakt.vcf` separat aktualisieren, wenn sich Daten ändern.

### Hosting-Umgebung
- Env-Variable `NEXT_PUBLIC_SITE_URL` muss in Vercel auf `https://www.sitalo.de` zeigen — sonst leaken Canonical-Tags und Sitemap-Einträge auf die vercel.app-Subdomain (würde sitalo.de-Rankings kannibalisieren). Aktuell korrekt gesetzt.

---

## Was sich automatisch updated

Damit du nicht denkst, was Pflege braucht:

- **Aktueller Monat** in `Pakete & Preise`-Sektion (Pricing-Kapazitäts-Hinweis) — server-rendered aus `new Date()`.
- **Aktueller Monat + Jahr** in `Aus dem Atelier`-Eyebrow — gleiche Logik.
- **Sitemap** — automatisch generiert aus den Daten-Files.
- **OG-Bilder** — alle 23 statisch zur Build-Zeit gerendert.
- **JSON-LD** — pro Detail-Seite automatisch generiert (Service, BreadcrumbList, FAQPage, LocalBusiness).
