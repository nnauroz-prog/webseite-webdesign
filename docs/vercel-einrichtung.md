# Vercel einrichten – Schritt für Schritt

Ziel: Anfragen kommen per E-Mail an, der Admin-Bereich funktioniert,
Google findet die Seite unter **https://www.sitalo.de**.

Dauer: ca. 30 Minuten. Schlüssel und Passwörter nie in einen Chat
kopieren, nur in Vercel eintragen.

---

## Teil 1 · Domain prüfen (5 Min.)

1. vercel.com → anmelden → Projekt **webseite-webdesign** öffnen.
2. Oben **Settings** → links **Domains**.
3. Dort müssen zwei Einträge stehen:
   - `www.sitalo.de` – mit grünem Haken („Valid Configuration")
   - `sitalo.de` – mit dem Hinweis **„Redirects to www.sitalo.de"**
4. Steht bei `sitalo.de` kein Redirect: rechts auf **Edit** →
   „Redirect to" → `www.sitalo.de` → **Save**.
   Warum: Google soll nur *eine* Adresse kennen, sonst teilen sich
   die Rankings auf.
5. Rotes Warnzeichen bei einer Domain? Vercel zeigt daneben die
   DNS-Einträge an, die beim Domain-Anbieter (z. B. IONOS, Strato)
   eingetragen werden müssen.

---

## Teil 2 · Supabase-Werte holen (5 Min.)

1. supabase.com → Ihr Projekt öffnen.
2. Links unten **Project Settings** (Zahnrad) → **Data API**:
   - **Project URL** kopieren (z. B. `https://abcd1234.supabase.co`)
3. **Project Settings → API Keys**:
   - **anon / publishable** Schlüssel kopieren (darf öffentlich sein)
   - **service_role / secret** Schlüssel kopieren (**geheim!**)
4. Prüfen, falls noch nicht geschehen:
   - **SQL Editor**: Inhalt von
     `supabase/migrations/20261030000000_leads.sql` einfügen → **Run**.
     Danach gibt es im **Table Editor** die Tabelle `leads`.
   - **Authentication → Sign In / Providers**: „Allow new users to
     sign up" **aus**.
   - **Authentication → Users → Add user**: Ihre E-Mail + Passwort,
     „Auto Confirm User" **an**.

---

## Teil 3 · Resend (E-Mail-Versand) anlegen (5 Min.)

1. resend.com → **Sign up** – **mit genau nnauroz@live.de**.
   (Ohne eigene Domain darf Resend nur an die Konto-Adresse senden.)
2. Bestätigungs-Mail anklicken.
3. **API Keys → Create API Key** → Name `sitalo`, Permission
   **Sending access** → **Add** → Schlüssel (`re_…`) kopieren.

---

## Teil 4 · Werte in Vercel eintragen (10 Min.)

Vercel → Projekt → **Settings → Environment Variables**.
Für jede Zeile: **Key** und **Value** eintragen, bei „Environments"
**Production** und **Preview** anhaken → **Save**.

| Key | Value |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://www.sitalo.de` |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL aus Teil 2 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon/publishable Schlüssel |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role/secret Schlüssel |
| `ADMIN_EMAILS` | Ihre Login-E-Mail aus Supabase (exakt gleich) |
| `RESEND_API_KEY` | Schlüssel aus Teil 3 |
| `LEAD_MAIL_TO` | `nnauroz@live.de` |

Optional, aber empfohlen:

| Key | Value | Wofür |
|---|---|---|
| `PAGESPEED_API_KEY` | Google-API-Schlüssel | Speed-Test liefert echte Google-Punkte statt Basis-Check |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | `sitalo.de` | Besucherstatistik ohne Cookie-Banner (Plausible-Konto nötig) |

Nicht nötig: `FORMSPREE_FORM_ID`, `LEAD_MAIL_FROM` (leer lassen).

Für die Redaktion im Story-Studio kommt `ANTHROPIC_API_KEY` dazu,
siehe Teil 8. Fürs Posten auf Instagram kommt `INSTAGRAM_TOKEN` dazu,
siehe Teil 9.

**PageSpeed-Schlüssel holen (optional):** console.cloud.google.com →
oben Projekt anlegen → „APIs & Dienste" → **Bibliothek** →
„PageSpeed Insights API" → **Aktivieren** → **Anmeldedaten** →
**Anmeldedaten erstellen → API-Schlüssel** → kopieren.

---

## Teil 5 · Neu veröffentlichen (2 Min.)

Neue Werte wirken erst nach einem neuen Build.

1. Vercel → Projekt → oben **Deployments**.
2. Oberster Eintrag (Production) → rechts **⋯** → **Redeploy** →
   **Redeploy** bestätigen.
3. Warten, bis „Ready" erscheint (ca. 1–2 Minuten).

---

## Teil 6 · Testen (5 Min.)

1. **https://www.sitalo.de/admin** öffnen → mit Supabase-Login anmelden.
2. Oben steht die Karte **„E-Mail-Benachrichtigung"**:
   - **Grün** → **„Test-Mail senden"** klicken → Postfach **und
     Junk-Ordner** von nnauroz@live.de prüfen → Mail als
     „Kein Junk" markieren.
   - **Gelb** → ein Wert fehlt oder Teil 5 (Redeploy) wurde
     übersprungen.
3. Auf **https://www.sitalo.de/anfrage** eine Test-Anfrage senden →
   sie muss im Admin-Bereich **und** als Mail ankommen.

Klappt etwas nicht: In Vercel → **Logs** → nach `[anfrage]` suchen.
Der rote Text dort nennt den Grund.

---

## Teil 7 · Google anbinden (10 Min., einmalig)

1. **search.google.com/search-console** → **Property hinzufügen** →
   „Domain" → `sitalo.de` → den angezeigten TXT-Eintrag beim
   Domain-Anbieter eintragen → **Bestätigen**.
2. Links **Sitemaps** → `sitemap.xml` eingeben → **Senden**.
3. Oben in die Suchleiste `https://www.sitalo.de/website-erstellen-lassen`
   → **Indexierung beantragen**. Gleiches für die Startseite.
4. **business.google.com** → Unternehmensprofil anlegen:
   Kategorie **Webdesigner**, Servicegebiet, Telefon 0160 7621876,
   Website `https://www.sitalo.de`, Fotos.

---

## Teil 8 · Redaktion im Story-Studio (optional, 10 Min.)

Im Story-Studio (`/admin/story`) schreibt dir die Redaktion auf Zuruf
eine Story-Serie: drei bis fünf Bilder, die zusammen eine kleine
Geschichte erzählen. Du tippst zum Beispiel „Story-Serie zu Black
Friday“, nach etwa einer Minute steht sie da. Dafür braucht die
Redaktion einen eigenen Schlüssel. Ohne ihn läuft alles andere weiter
wie bisher, auch der Morgenlauf mit den Posts des Tages; das Studio
zeigt dann nur einen Hinweis.

1. **console.anthropic.com** → anmelden oder Konto anlegen.
2. Dort Guthaben aufladen (Billing). Abgerechnet wird je Auftrag:
   einige Cent je Auftrag, abgerechnet über das eigene Konto dort.
3. **API Keys → Create Key** → Name `sitalo-studio` → Schlüssel
   kopieren. Er wird nur dieses eine Mal angezeigt.
4. Vercel → Projekt → **Settings → Environment Variables**, wie in
   Teil 4 (Production und Preview anhaken → **Save**):

| Key | Value | Wofür |
|---|---|---|
| `ANTHROPIC_API_KEY` | Schlüssel aus Schritt 3 | Pflicht: Damit arbeitet die Redaktion |
| `STUDIO_MODELL` | leer lassen | Optional: anderes Modell, z. B. `claude-sonnet-5-5` |
| `STUDIO_TAGESLIMIT` | leer lassen | Optional: Aufträge pro Tag, ohne Angabe 40 |

5. Neu veröffentlichen wie in Teil 5 (Redeploy).
6. Testen: `/admin/story` öffnen und einen Auftrag abschicken.

Gut zu wissen:

- Der Schlüssel gehört nur in Vercel. Nie in einen Chat kopieren, nie
  in den Code, nie in eine Mail.
- Kosten entstehen nur, wenn du einen Auftrag abschickst. Das
  Tageslimit schützt vor Versehen: Ist es erreicht, geht es am
  nächsten Tag weiter. In der Console kannst du zusätzlich ein
  monatliches Ausgabenlimit setzen.
- Damit sich das Studio die Serien merkt (Liste, „gepostet“-Haken),
  braucht die Datenbank ein kleines Update: Im Mitgliederbereich
  erscheint dafür der Hinweis „Datenbank-Update ausstehend“ mit
  „SQL kopieren“. Ohne das Update schreibt die Redaktion trotzdem,
  merkt sich die Serien aber nicht.
- Meldet das Studio „API-Schlüssel wird abgelehnt“, ist der Wert in
  Vercel falsch oder der Redeploy fehlt. Bei „gerade überlastet“
  einfach ein paar Minuten später noch einmal versuchen.
- Ein Auftrag darf bis zu zwei Minuten laufen. Bei neuen
  Vercel-Projekten ist das erlaubt (Fluid Compute ist an). Bricht ein
  Deploy mit einer Meldung zu `maxDuration` ab, schalte in Vercel unter
  **Settings → Functions** Fluid Compute ein und deploye neu.
- Die alte Chat-Schnittstelle `/api/chat` bleibt aus, auch mit dem
  Schlüssel. Die Website benutzt sie nicht mehr; sie ginge erst mit
  `CHAT_AKTIV=1` wieder an. Trag diese Variable nicht ein. Das
  Ausgabenlimit in der Console schützt zusätzlich.

---

## Teil 9 · Auf Instagram posten (optional, ca. 1 Stunde einmalig)

Im Story-Studio (`/admin/story`) bringt der Knopf „Auf Instagram
posten“ eine Story-Serie als Stories oder Karussell und einen Post des
Tages als Story oder Beitrag direkt auf dein Instagram-Konto. Dafür
braucht der Server einen Zugangsschlüssel aus dem Meta Business
Manager (Systemnutzer, Ablauf „Nie“). Ohne ihn läuft alles andere
weiter; du teilst die Bilder dann wie bisher von Hand.

Die ganze Einrichtung Schritt für Schritt (Instagram auf Unternehmen
umstellen, Facebook-Seite, Business-Portfolio, Meta-App, Systemnutzer,
Test) steht in **`docs/instagram-einrichtung.md`**. Hier nur die Werte
für Vercel → Projekt → **Settings → Environment Variables**. Anders als
in Teil 4: **nur Production** anhaken, damit eine Vorschau-Version nie
auf Instagram postet. Bietet Vercel den Schalter **Sensitive** an,
einschalten.

| Key | Value | Wofür |
|---|---|---|
| `INSTAGRAM_TOKEN` | Schlüssel des Systemnutzers (beginnt meist mit `EAA`) | Pflicht: Damit postet der Server. **Geheim**, nur in Vercel |
| `INSTAGRAM_KONTO_ID` | leer lassen | Optional: Kennung des Instagram-Kontos (lange Zahl, meist `1784…`). Ohne Angabe sucht der Server sie über die Facebook-Seite |
| `INSTAGRAM_API_VERSION` | leer lassen | Optional: Version der Schnittstelle von Meta, ohne Angabe `v26.0` |

Danach:

1. Neu veröffentlichen wie in Teil 5 (Redeploy).
2. Im Mitgliederbereich das Datenbank-Update „Posten auf Instagram“
   ausführen: „SQL kopieren“ → „SQL Editor öffnen“ → **Run** →
   „Erneut prüfen“. Es legt den privaten Speicher für die Bilder an.
3. `/admin/instagram` öffnen: Dort muss „Verbunden als @deinkonto“
   stehen.

Gut zu wissen:

- Der Schlüssel gehört nur in Vercel. Nie in einen Chat, nie in den
  Code, nie in eine Mail, nie mit `NEXT_PUBLIC_` davor.
- Der Speicher für die Bilder nutzt `SUPABASE_SERVICE_ROLE_KEY` aus
  Teil 4. Ohne ihn meldet `/admin/instagram`, dass der Speicher fehlt.
- `INSTAGRAM_GRAPH_URL` steht nur für Tests in `.env.example` (eine
  Attrappe statt Instagram). **In Vercel nie eintragen.**
- Ein Post darf bis zu zwei Minuten laufen, wie die Redaktion
  (Teil 8, Fluid Compute).
