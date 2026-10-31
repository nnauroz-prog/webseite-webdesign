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

Nicht nötig: `ANTHROPIC_API_KEY`, `FORMSPREE_FORM_ID`,
`LEAD_MAIL_FROM` (leer lassen).

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
