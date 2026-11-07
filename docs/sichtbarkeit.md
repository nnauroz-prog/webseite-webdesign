# Gefunden werden: bei Google und in KI-Assistenten

Immer mehr Kunden suchen nicht mehr nur bei Google, sondern fragen
ChatGPT, Claude, Perplexity, Gemini oder Copilot: „Wer erstellt mir in
Hamburg eine Website zum Festpreis?“ Diese Assistenten antworten aus
zwei Quellen:

1. **Was sie live im Netz finden.** ChatGPT und Copilot suchen über den
   Bing-Index, Gemini über Google, Perplexity und Claude mit eigenen
   Crawlern. Wer bei Bing und Google gut steht, wird zitiert.
2. **Was sie über eine Firma „wissen“.** Das lernen die Modelle aus
   vielen Seiten im Netz: der eigenen Website, aber vor allem aus
   Einträgen, Bewertungen und Erwähnungen auf anderen Seiten. Je öfter
   „Sitalo Webdesign, Hamburg, Websites zum Festpreis“ an
   verschiedenen Stellen gleich auftaucht, desto sicherer nennt eine KI
   Sitalo.

Fertige Texte zum Kopieren für alle Profile und Verzeichnisse stehen
in docs/profiltexte.md.

Die Website ist dafür technisch fertig (siehe unten). Den größten
Hebel haben jetzt die Schritte, die nur der Inhaber selbst machen
kann. Reihenfolge nach Wirkung, alles geht am Handy.

---

## 1 · Bing Webmaster Tools (10 Min.) – wichtig für ChatGPT und Copilot

1. bing.com/webmasters öffnen, mit einem Microsoft-Konto anmelden
   (oder „Mit Google anmelden“).
2. **Aus der Google Search Console importieren** wählen, falls die
   Search Console schon eingerichtet ist (siehe
   docs/google-einrichtung.md). Sonst `https://www.sitalo.de` als
   Website hinzufügen und per **HTML-Meta-Tag** bestätigen: den Code in
   Vercel als `BING_SITE_VERIFICATION` eintragen und neu bereitstellen.
3. **Sitemaps** → `https://www.sitalo.de/sitemap.xml` einreichen.
4. Unter **IndexNow** sollte nach dem nächsten Deploy „sitalo.de“ mit
   eingereichten Adressen erscheinen. Das macht die Website selbst bei
   jedem Produktions-Deploy (siehe unten), nichts zu tun.
5. Später lohnt ein Blick in den Bericht zur KI-Sichtbarkeit (in den
   Webmaster Tools unter „AI Performance“ o. ä.): Dort zeigt Microsoft,
   wie oft Seiten von Sitalo in Copilot-Antworten auftauchen.

## 2 · Google-Unternehmensprofil (siehe docs/google-einrichtung.md)

Gemini, Google-KI-Übersichten und auch ChatGPT greifen für lokale
Fragen auf Kartendaten und Bewertungen zurück. Ohne Profil fehlt Sitalo
dort. Anleitung Schritt für Schritt: docs/google-einrichtung.md, Teil 2.

## 3 · Bing Places und Apple Business Connect (je 10 Min.)

- **Bing Places** (bingplaces.com): kann das Google-Profil mit einem
  Klick übernehmen. Daraus speisen sich Copilot und teils ChatGPT bei
  lokalen Fragen.
- **Apple Business Connect** (businessconnect.apple.com): für Apple
  Karten und Siri.

Überall exakt dieselben Angaben verwenden:

> **Sitalo Webdesign** · Hamburg · 0160 7621876 · info@sitalo.de ·
> https://www.sitalo.de · Kategorie „Webdesigner“

Kurzbeschreibung zum Kopieren (überall gleich):

> Webdesign-Büro aus Hamburg. Wir bauen Websites zum Festpreis für
> Betriebe in ganz Deutschland: Sie schicken Stichpunkte und Fotos, wir
> schreiben die Texte und bauen die Seite. Festpreis vor dem Start,
> Test-Link vor der Freischaltung. Websites ab 599 €, inkl. MwSt.

## 4 · Bewertungen (laufend) – der stärkste Vertrauensbeweis

KI-Assistenten empfehlen bei „gutes Webdesign-Büro in Hamburg“ fast
immer Firmen mit echten Bewertungen.

- Nach jedem fertigen Projekt um eine **Google-Bewertung** bitten (Link
  aus dem Unternehmensprofil, „Bewertungen einholen“).
- Wer möchte, zusätzlich auf **ProvenExpert** oder **Trustpilot**.
- Jede Bewertung kurz und freundlich beantworten.
- Nie Bewertungen kaufen oder tauschen.

## 5 · Einträge auf anderen Seiten (je 5–10 Min.)

Jeder Eintrag mit denselben Angaben wie oben und Link auf
https://www.sitalo.de. Erst die großen, dann die Branchenverzeichnisse:

- Gelbe Seiten, Das Örtliche, 11880, Cylex, GoLocal, Yelp
- werkenntdenBESTEN, ProvenExpert
- Agentur-Verzeichnisse für Webdesign: Sortlist, DesignRush, Clutch,
  agenturfinder.de (Profil „Webdesign Hamburg“)
- **LinkedIn-Unternehmensseite** „Sitalo Webdesign“ mit derselben
  Kurzbeschreibung; ab und zu einen Journal-Artikel teilen
- Handwerkskammer, IHK oder Gründernetzwerke, falls Mitglied

Wenn Kunden einverstanden sind: im Fuß ihrer Website „Website: Sitalo
Webdesign“ mit Link. Solche echten Verweise zählen für Google und für
KI-Modelle besonders.

## 6 · In Vercel einmal prüfen (2 Min.)

Vercel kann KI-Crawler blockieren. vercel.com → Projekt
**webseite-webdesign** → **Firewall** → bei den verwalteten Regeln
(„Bot Management“, „AI Bots“ o. ä.) darf **nichts auf „Deny/Block“**
stehen. „Off“ oder „Log“ ist richtig. Sonst können ChatGPT, Claude und
Perplexity die Seite nicht lesen.

Danach `BUSINESS_PROFILE_URLS` in Vercel mit den Links zu Google-Profil,
Bing Places, LinkedIn usw. füllen (mit Komma getrennt). So verbindet die
Website diese Profile in ihren strukturierten Daten mit Sitalo.

## 7 · Einmal im Monat testen (5 Min.)

In ChatGPT, Claude, Perplexity, Gemini und Copilot jeweils fragen:

- „Wer erstellt in Hamburg Websites zum Festpreis?“
- „Webseite erstellen lassen Hamburg, was kostet das?“
- „Was ist Sitalo Webdesign?“
- „Website für Pflegedienst erstellen lassen“ (oder eine andere Branche)

Notieren, ob Sitalo genannt wird und ob die Angaben stimmen (Preise,
Ort, Leistungen). Falsche Angaben mir schicken, dann ergänze ich die
Website gezielt.

---

## Was auf der Website schon dafür sorgt

- **Alle KI-Crawler ausdrücklich erlaubt** (robots.txt): OpenAI (GPTBot,
  OAI-SearchBot, ChatGPT-User), Anthropic (ClaudeBot, Claude-SearchBot,
  Claude-User), Perplexity, Google-Extended (Gemini), Apple, Bing,
  Meta, Amazon, DuckDuckGo, Mistral, Common Crawl. Nur Mitgliederbereich
  und Formular-Schnittstellen bleiben gesperrt.
- **llms.txt** und **llms-full.txt**: Klartext-Steckbrief und vollständige
  Fakten (Leistungen, Preise, Ablauf, Fragen und Antworten) für
  Sprachmodelle, immer aus denselben Daten wie die Website erzeugt.
- **IndexNow**: Bei jedem Produktions-Deploy meldet die Website Bing &
  Co. die geänderten Seiten automatisch.
- **Strukturierte Daten** (schema.org): Firma, Ort, Kontakt, Pakete mit
  Preisen inkl. MwSt., Fragen und Antworten, Artikel, Brotkrumen.
- **Antworten zuerst**: Die wichtigen Seiten beantworten die typischen
  Fragen („Was kostet eine Website?“, „Wie lange dauert es?“) direkt
  und mit Zahlen. Genau solche Sätze zitieren KI-Assistenten.
- Sitemap, kurze Ladezeiten, saubere Überschriften, keine Inhalte
  hinter Skripten versteckt.

Wie bei Google gilt: Es dauert einige Wochen, bis neue Einträge und
Bewertungen in den Antworten der Assistenten ankommen.
