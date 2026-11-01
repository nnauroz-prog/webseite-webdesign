# Bei Google gefunden werden – Schritt für Schritt

Die Website ist technisch fertig für Google: Titel, Beschreibungen,
strukturierte Daten, Sitemap, schnelle Ladezeit. Drei Dinge kann aber
nur der Inhaber selbst erledigen. Sie bringen am meisten:

1. **Google Search Console** – Google erfährt sofort von allen Seiten.
2. **Google-Unternehmensprofil** – Sitalo erscheint in Google Maps und
   im Kartenblock bei „Webdesign Hamburg“.
3. **Bewertungen und Einträge** – Vertrauen für Google und für Kunden.

Alles geht am Handy. Dauer insgesamt etwa eine Stunde, verteilt auf
ein paar Tage (Google schickt teils Post oder Codes).

---

## Teil 1 · Google Search Console (15 Min.)

1. search.google.com/search-console öffnen und mit Ihrem Google-Konto
   anmelden.
2. **Property hinzufügen** → rechts **URL-Präfix** wählen →
   `https://www.sitalo.de` eingeben → **Weiter**.
3. Bei den Bestätigungsmethoden **HTML-Tag** antippen. Google zeigt
   eine Zeile wie
   `<meta name="google-site-verification" content="AbC123…" />`.
   Kopieren Sie **nur den Teil zwischen den Anführungszeichen nach
   content=**, also `AbC123…`.
4. vercel.com → Projekt **webseite-webdesign** → **Settings** →
   **Environment Variables** → **Add New**:
   - Name: `GOOGLE_SITE_VERIFICATION`
   - Value: der kopierte Code
   - Environments: **Production** angehakt → **Save**
5. Oben **Deployments** → beim obersten Eintrag die drei Punkte →
   **Redeploy** → bestätigen. Zwei Minuten warten.
6. Zurück in der Search Console auf **Bestätigen** tippen.
7. Links **Sitemaps** → `sitemap.xml` eintragen → **Senden**.
8. Optional: oben in die Suchleiste `https://www.sitalo.de/website-erstellen-lassen`
   eingeben → **Indexierung beantragen**. Dasselbe für die Startseite.

Nach ein paar Tagen sehen Sie unter **Leistung**, bei welchen Suchen
Sitalo erscheint und wie oft geklickt wird.

**Bing (5 Min., optional):** bing.com/webmasters → mit dem
Microsoft-Konto anmelden → **Aus der Google Search Console
importieren** wählen. Fertig, kein Code nötig.

---

## Teil 2 · Google-Unternehmensprofil (20 Min. + Bestätigung)

Das ist der wichtigste Schritt für „Webdesign Hamburg“ und „Website
erstellen lassen Hamburg“: Google zeigt dort zuerst die Karte mit drei
Firmen.

1. business.google.com öffnen → **Jetzt verwalten**.
2. Name: **Sitalo Webdesign** (genau so, ohne Zusätze wie „Beste
   Websites“ – das verbietet Google).
3. Kategorie: **Webdesigner**. Später unter Profil bearbeiten weitere
   Kategorien ergänzen: **Website-Entwickler**,
   **Internetmarketing-Service**.
4. Frage „Möchten Sie einen Standort hinzufügen, den Kunden besuchen
   können?“ → **Nein**, wenn Kunden nicht in Ihr Büro kommen.
   Dann wird Ihre Anschrift nicht öffentlich gezeigt.
5. Einzugsgebiet: **Hamburg** und zusätzlich **Deutschland** oder
   einzelne Bundesländer.
6. Telefon: **0160 7621876**, Website: **https://www.sitalo.de**
7. Bestätigung: Google verlangt meist ein kurzes Video (Firmenschild,
   Arbeitsplatz, Werkzeug) oder schickt eine Postkarte mit Code. Den
   Anweisungen folgen.
8. Danach das Profil ausfüllen:
   - **Beschreibung:** „Webdesign-Büro in Hamburg. Wir bauen Websites
     zum Festpreis für Pflegedienste, Praxen, Handwerksbetriebe, Cafés
     und andere Betriebe in ganz Deutschland. Test-Link vor dem Start,
     kleine Änderungen im Monatsbeitrag.“
   - **Dienstleistungen:** Website erstellen lassen, Website-Wartung,
     Website-Durchsicht, je mit Preis „ab 499 €“, „ab 49 € im Monat“,
     „kostenlos“.
   - **Öffnungszeiten:** die Zeiten, in denen Sie ans Telefon gehen.
   - **Fotos:** Logo, ein Foto vom Arbeitsplatz, Bildschirmfotos von
     fertigen Seiten.
9. Wenn das Profil steht: im Profil auf **Teilen** tippen und den Link
   kopieren. In Vercel unter **Environment Variables** eintragen:
   - Name: `BUSINESS_PROFILE_URLS`
   - Value: der kopierte Link (weitere Profile wie Apple Karten mit
     Komma dahinter)
   Danach wie in Teil 1 **Redeploy**. So verbindet Google Website und
   Profil sicher. Alternativ den Link einfach mir schicken.

---

## Teil 3 · Bewertungen und Einträge (laufend)

**Bewertungen** sind für den Kartenblock entscheidend.

- Nach jedem fertigen Projekt den Kunden um eine Google-Bewertung
  bitten. Im Unternehmensprofil unter **Bewertungen einholen** gibt es
  einen Link, den Sie per Mail oder WhatsApp schicken.
- Jede Bewertung kurz beantworten.
- Keine Bewertungen kaufen oder tauschen – Google löscht sie und kann
  das Profil sperren.

**Einträge in Verzeichnissen** (je 5–10 Min., überall dieselben Daten:
„Sitalo Webdesign“, 0160 7621876, https://www.sitalo.de):

- Bing Places (bingplaces.com, kann das Google-Profil importieren)
- Apple Business Connect (businessconnect.apple.com) – für Apple Karten
- Das Örtliche, Gelbe Seiten, 11880
- Branchenverzeichnisse der Handwerkskammer oder IHK, falls Mitglied

**Verweise von anderen Seiten** helfen am meisten, wenn sie echt sind:
Bitten Sie Kunden, im Impressum oder Fuß ihrer Website „Website:
Sitalo Webdesign“ mit Link zu nennen. Nur mit Zustimmung des Kunden.

---

## Was schon auf der Website erledigt ist

- Eigene Seiten für die wichtigsten Suchen: „Website erstellen lassen“,
  „Was kostet eine Website“, Branchen (Pflegedienst, Praxis, Handwerk
  usw.), Hamburger Stadtteile, Pakete mit Preisen.
- Titel und Beschreibung für jede Seite, ohne Doppelungen.
- Strukturierte Daten: Firmeneintrag mit Paketen und Preisen,
  Dienstleistungen, Fragen und Antworten, Artikel, Brotkrumen.
- Sitemap, robots.txt, Canonical-Adressen, 404-Seite.
- Ladezeit und Barrierefreiheit: Lighthouse 100 für SEO,
  Barrierefreiheit und Best Practices.

Ranglisten bei Google ändern sich langsam. Rechnen Sie mit vier bis
zwölf Wochen, bis neue Seiten sichtbar steigen. Search Console zeigt
den Fortschritt.
