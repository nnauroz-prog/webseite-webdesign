# Auf Instagram posten – Schritt für Schritt einrichten

Ziel: Im Story-Studio (`/admin/story`) bringt der Knopf **„Auf
Instagram posten“** deine Bilder direkt auf dein Instagram-Konto. Eine
Story-Serie geht als Stories oder als Karussell raus, ein Post des
Tages als Story oder als Beitrag im Feed.

Dafür braucht die Website einen Zugangsschlüssel von Meta (der Firma
hinter Instagram und Facebook). Du holst ihn einmal. Er läuft nicht ab.

Dauer: etwa eine Stunde, einmalig. Teil 1 und 2 gehen am iPhone. Ab
Teil 3 besser am Computer: Die Meta-Seiten dafür sind am Handy mühsam.

---

## Vorab: drei Dinge

1. **Der Schlüssel ist wie ein Passwort für dein Instagram-Konto.**
   Er gehört nur in Vercel. Nicht in einen Chat, nicht in eine Mail,
   nicht in eine Notiz, nicht in den Code.
2. **Meta baut seine Menüs oft um.** Die Namen hier sind der Stand
   November 2026, so gut er sich prüfen ließ. Heißt ein Knopf bei dir
   anders, such nach dem gleichen Sinn. In Klammern stehen die
   englischen Namen, falls deine Meta-Seiten englisch sind.
3. **Es kostet nichts.** Eine Prüfung durch Meta („App Review“) oder
   eine Unternehmensverifizierung brauchst du nicht, weil du nur auf
   dein eigenes Konto postest.

**Das brauchst du:**

- dein Instagram-Konto (Anmeldung in der App)
- ein Facebook-Konto (dein privates reicht)
- am besten Zwei-Faktor-Schutz im Facebook-Konto (Meta verlangt ihn
  oft für die Einstellungen im Business-Portfolio)
- Zugang zu Vercel und zum Mitgliederbereich (`/admin`)

**So hängt alles zusammen:**

Instagram-Konto (Business) → verbunden mit einer Facebook-Seite →
beide in deinem Business-Portfolio → dort auch eine Meta-App →
ein Systemnutzer darf Seite, Instagram und App nutzen → sein Schlüssel
kommt in Vercel.

---

## Teil 1 · Instagram auf „Unternehmen“ umstellen (iPhone, 5 Min.)

1. Instagram-App öffnen → unten rechts dein Profilbild.
2. Oben rechts die drei Striche **☰** → **Einstellungen und
   Aktivitäten** (Settings and activity).
3. **Kontoart und Tools** (Account type and tools) antippen. Heißt es
   bei dir anders, such nach „Kontoart“ oder „professionell“.
4. **Zu professionellem Konto wechseln** (Switch to professional
   account) → Kategorie wählen, zum Beispiel „Webdesigner“.
5. Bei der Frage nach der Art: **Unternehmen** (Business) wählen,
   **nicht Creator**.
6. Kontaktdaten kannst du überspringen. Fertig.

Warum nicht Creator: Mit einem Creator-Konto lehnt Instagram Stories
über die Schnittstelle ab. Mehrere Dienste berichten das. Meta schreibt
es nicht ausdrücklich, mit einem Unternehmenskonto klappt es.

**Schon professionell?** Schau unter **Kontoart und Tools**. Steht dort
**„Zu Unternehmenskonto wechseln“**, ist es noch ein Creator-Konto:
antippen und wechseln.

Gut zu wissen: Beiträge und Follower bleiben. Ein Unternehmenskonto ist
immer öffentlich.

---

## Teil 2 · Mit einer Facebook-Seite verbinden (10 Min.)

Die Website findet dein Instagram-Konto über eine Facebook-Seite. Ohne
Seite geht es nicht. Die Seite muss nicht schön sein und niemand muss
ihr folgen.

**Noch keine Facebook-Seite für Sitalo?**

1. Facebook öffnen (App oder facebook.com) → Menü → **Seiten** (Pages)
   → **Neue Seite erstellen** (Create new Page).
2. Name: `Sitalo Webdesign`, Kategorie: „Webdesigner“ → **Seite
   erstellen**. Alles Weitere kannst du überspringen.

**Instagram mit der Seite verbinden.** Einer der beiden Wege reicht:

- **In der Instagram-App:** Profil → **Profil bearbeiten** → unter
  „Öffentliche Unternehmensinformationen“ auf **Seite** → deine Seite
  wählen oder **Verbinden**. Instagram fragt nach deiner
  Facebook-Anmeldung.
- **Auf Facebook am Computer:** oben rechts dein Profilbild → zu deiner
  Seite wechseln → **Einstellungen** → **Verknüpfte Konten** (Linked
  accounts, manchmal nur „Instagram“) → bei Instagram **Konto
  verbinden** (Connect account) → bei Instagram anmelden.

**Prüfen:** In der Instagram-App unter **Profil bearbeiten → Seite**
steht jetzt der Name deiner Facebook-Seite.

Ein Instagram-Konto kann nur mit einer Seite verbunden sein. Die
„Kontenübersicht“ (Accounts Center) ist etwas anderes: Dort verbindest
du Profile zum gemeinsamen Anmelden und Teilen. Das reicht hier nicht.

---

## Teil 3 · Business-Portfolio vorbereiten (Computer, 10 Min.)

Meta nennt das heute **Business-Portfolio**. Früher hieß es Business
Manager. Gemeint ist dasselbe: der Ordner, in dem deine Seite, dein
Instagram-Konto und gleich auch die App liegen.

1. **business.facebook.com** öffnen und mit Facebook anmelden. Du
   landest in der Meta Business Suite.
2. **Noch kein Portfolio?** Meta bietet an, eins zu erstellen
   („Business-Portfolio erstellen“, Create a business portfolio). Name
   `Sitalo`, dein Name, deine geschäftliche E-Mail. Verifizieren musst
   du es nicht.
   **Schon eins da?** Oben links prüfen, dass das richtige gewählt ist.
3. Links unten das Zahnrad **Einstellungen** (Settings). Manche
   Anleitungen nennen es noch „Unternehmenseinstellungen“ (Business
   settings). Das ist derselbe Bereich.
4. **Konten → Seiten** (Accounts → Pages) → **Hinzufügen** (Add) →
   „Bestehende Seite hinzufügen“ → deine Facebook-Seite wählen.
5. **Konten → Instagram-Konten** (Instagram accounts) →
   **Hinzufügen** → bei Instagram anmelden. Danach steht dein Konto in
   der Liste.
6. Dein Instagram-Konto in der Liste anklicken. Bei den verbundenen
   Konten (Connected assets) sollte deine Facebook-Seite stehen. Fehlt
   sie, Teil 2 noch einmal machen.
7. Sieh nach, ob du selbst Zugriff hast: beim Instagram-Konto und bei
   der Seite unter **Personen** (People) solltest du mit **voller
   Kontrolle** (Full control) stehen. Wenn nicht: **Personen
   zuweisen** → du → volle Kontrolle → **Zuweisen**.

---

## Teil 4 · Meta-App anlegen (Computer, 15 Min.)

Die App ist nur die Tür, durch die die Website mit Instagram spricht.
Sie bleibt privat. Niemand sonst sieht sie.

1. **developers.facebook.com** öffnen → mit Facebook anmelden. Fragt
   Meta, ob du dich als Entwickler registrieren willst: ja, Telefonnummer
   bestätigen. Das ist kostenlos.
2. **Meine Apps** (My Apps) → **App erstellen** (Create app).
3. **App-Name:** `Sitalo Website`. Wörter wie „Instagram“, „Insta“ oder
   „Facebook“ lehnt Meta im Namen ab. Kontakt-E-Mail: deine.
4. **Anwendungsfall** (Use case): Meta fragt, was die App tun soll.
   Wähl **„Nachrichten und Inhalte auf Instagram verwalten“** (Manage
   messaging & content on Instagram). Hilft der Filter
   „Inhaltsverwaltung“ (Content management), nutz ihn.
   Ältere Ansicht ohne Anwendungsfälle: App-Typ **Business** wählen und
   danach das Produkt **Instagram** hinzufügen (früher hieß es
   „Instagram Graph API“).
5. **Business-Portfolio:** dein Portfolio aus Teil 3 wählen. Wichtig:
   Nur dann kann der Systemnutzer in Teil 5 die App benutzen.
6. **App erstellen** → Meta fragt noch einmal nach deinem
   Facebook-Passwort.
7. Im Dashboard der App beim Anwendungsfall Instagram auf **Anpassen**
   (Customize). Links stehen Varianten der Einrichtung. Nimm **„API-
   Einrichtung mit Facebook-Login“** (API setup with Facebook login).
   Die Variante „mit Instagram-Login“ gibt es für neue Apps nicht mehr.
   Gibt es bei dir nur „Unified Login“, lies den Kasten unten.
8. Unter **Berechtigungen und Funktionen** (Permissions and features)
   bei diesen Einträgen auf **Hinzufügen** (Add) klicken, soweit sie
   noch fehlen:
   - `instagram_basic`
   - `instagram_content_publish`
   - `pages_show_list`
   - `pages_read_engagement`
   - `business_management`

   Der Status **„Bereit zum Testen“** (Ready for testing) reicht.
   „Erweiterter Zugriff“ (Advanced access) ist nicht nötig.
9. Die App bleibt im **Entwicklungsmodus** (Development, manchmal
   „Unveröffentlicht“). Nicht auf „Live“ stellen. Für dein eigenes
   Konto reicht das.

> **Kasten: Bei dir gibt es nur „Unified Login“?**
> Meta stellt gerade um. Gibt es keine Variante mit Facebook-Login,
> nimm „API-Einrichtung mit Unified Login“ und hak in Schritt 8 an, was
> von der Liste angeboten wird. Mach dann mit Teil 5 weiter. Auf diesem
> Weg findet der Server dein Konto vielleicht nicht von selbst. Dann
> brauchst du in Teil 6 auch `INSTAGRAM_KONTO_ID`. Die Nummer zeigt Meta
> bei Unified Login in der Liste zum Erzeugen von Schlüsseln neben
> deinem Instagram-Konto (lange Zahl, meist mit `1784` vorne). Dieser
> Weg ist noch nicht ausprobiert.

---

## Teil 5 · Systemnutzer und Zugangsschlüssel (Computer, 15 Min.)

Ein Systemnutzer ist ein Mitarbeiter ohne Gesicht in deinem
Portfolio. Sein Schlüssel läuft nicht ab und hängt nicht an deinem
privaten Facebook-Passwort.

Halte für Schritt 9 schon einen zweiten Tab mit Vercel offen (Teil 6).

1. business.facebook.com → **Einstellungen** → **Nutzer →
   Systemnutzer** (Users → System users).
2. **Hinzufügen** (Add) → Name `sitalo-website` → Rolle **Admin** →
   **Systemnutzer erstellen**. Bedingungen von Meta bestätigen.
3. Den neuen Systemnutzer anklicken → **Assets zuweisen** (Assign
   assets). Nacheinander:
   - **Seiten** → deine Facebook-Seite → **volle Kontrolle** (Full
     control) → **Zuweisen**
   - **Instagram-Konten** → dein Konto → **volle Kontrolle** →
     **Zuweisen**
   - **Apps** → deine App aus Teil 4 → **App verwalten** bzw. volle
     Kontrolle (Manage app) → **Zuweisen**

   Steht etwas schon da (Admins bekommen manches automatisch), ist das
   in Ordnung.
4. **Token generieren** (Generate new token) klicken.
5. **App:** deine App aus Teil 4 wählen.
6. **Ablauf des Tokens** (Token expiration): **Nie** (Never). Nicht
   „60 Tage“. Fragt Meta gar nicht nach dem Ablauf, ist das in
   Ordnung: Ohne Auswahl läuft der Schlüssel eines Systemnutzers nicht
   ab.
7. **Berechtigungen** anhaken:
   - `instagram_basic`
   - `instagram_content_publish`
   - `pages_show_list`
   - `pages_read_engagement`
   - `business_management`

   Steht `ads_read` in der Liste, hak es mit an. Meta nennt es für den
   Zugriff über ein Business-Portfolio, es schadet nicht. Fehlt einer
   der fünf Einträge oben, zurück zu Teil 4, Schritt 8.
8. **Token generieren** klicken. Meta zeigt den Schlüssel: eine lange
   Zeichenkette, meist mit `EAA` vorne. **Nur dieses eine Mal.**
9. **Kopieren** und sofort in Vercel einfügen (Teil 6). Nicht
   zwischenspeichern.

Schlüssel verloren oder Tab zu früh geschlossen? Kein Problem: Schritte
4 bis 9 wiederholen, du bekommst einen neuen.

---

## Teil 6 · In Vercel eintragen (5 Min.)

1. vercel.com → Projekt **webseite-webdesign** → **Settings →
   Environment Variables**.
2. Neuer Eintrag:
   - **Key:** `INSTAGRAM_TOKEN`
   - **Value:** der kopierte Schlüssel. Ohne Leerzeichen, ohne
     Anführungszeichen.
   - **Environments:** nur **Production** anhaken. So kann eine
     Vorschau-Version (Preview) nie aus Versehen auf Instagram posten.
   - Bietet Vercel den Schalter **Sensitive** an: einschalten.
   - **Save**.
3. **Optional** `INSTAGRAM_KONTO_ID`: Normalerweise leer lassen. Der
   Server sucht dein Konto selbst über die Facebook-Seite. Nur nötig,
   wenn `/admin/instagram` später kein Konto findet oder du den Weg mit
   Unified Login gehen musstest. Die richtige Nummer ist lang und
   beginnt meist mit `1784`. Zeigt dir Meta irgendwo eine andere Nummer
   für das Konto, trag sie nicht ein: Sie gehört zu etwas anderem.
4. **Optional** `INSTAGRAM_API_VERSION`: leer lassen. Dann gilt
   `v26.0`. Nur ändern, wenn Meta diese Version abschaltet; das kündigt
   Meta lange vorher an.
5. Neu veröffentlichen, wie in `docs/vercel-einrichtung.md`, Teil 5:
   **Deployments** → oberster Eintrag → **⋯** → **Redeploy**. Warten,
   bis „Ready“ erscheint.

---

## Teil 7 · Datenbank-Update „Posten auf Instagram“ (3 Min.)

Das Update legt den Speicher an, in dem die Bilder kurz liegen, bis
Instagram sie abgeholt hat. Der Speicher ist privat. Nach jedem Post
löscht die Website die Bilder wieder.

1. **www.sitalo.de/admin** öffnen und anmelden.
2. Oben steht der gold umrandete Hinweis **„Datenbank-Update
   ausstehend“**. Unter „Bis dahin aus“ steht „Posten auf Instagram“.
3. **SQL kopieren** → **SQL Editor öffnen** (Supabase) → dort einfügen
   → **Run**.
4. Zurück im Mitgliederbereich **Erneut prüfen** tippen. Der Hinweis
   verschwindet.

Kein Hinweis zu sehen? Dann ist das Update schon drin.

---

## Teil 8 · Verbindung prüfen (2 Min.)

1. **www.sitalo.de/admin/instagram** öffnen. Du kommst auch aus dem
   Story-Studio dorthin.
2. Dort muss stehen: **Verbunden als @deinkonto**. Darunter steht, wie
   viele Beiträge heute schon gepostet sind, zum Beispiel „0 von 100“.

Steht dort etwas anderes:

- **„Noch nicht verbunden“** → `INSTAGRAM_TOKEN` fehlt in Vercel oder
  der Redeploy fehlt (Teil 6).
- **„Fast fertig … der Speicher für die Bilder fehlt noch“** → Teil 7.
- **Verbunden, aber mit gelbem Hinweis** → den Satz lesen und unten
  unter „Wenn etwas nicht klappt“ nachsehen.

---

## Teil 9 · Erster Test: eine Story (5 Min.)

1. **www.sitalo.de/admin/story** öffnen und einen Post des Tages
   wählen.
2. **Auf Instagram posten** → **Story** → bestätigen.
3. Das Studio zeigt, wie weit es ist: Verbindung prüfen → Bilder an
   Instagram geben → Veröffentlichen. Meist dauert das unter einer
   Minute.
4. Am iPhone in Instagram nachsehen: Dein Profilbild hat einen bunten
   Ring, die Story ist da.
5. Lass kurz jemanden mit einem anderen Konto draufschauen, ob die
   Story auch für andere sichtbar ist (siehe „Story nur für dich
   sichtbar“ unten).
6. War es nur ein Test: Story öffnen → **⋯** (Mehr) → **Löschen**.

Klappt das, geht auch der Rest: eine Story-Serie als Stories oder als
Karussell und ein Post als Beitrag im Feed.

---

## Gut zu wissen

- **Tagesgrenze:** Instagram erlaubt über die Schnittstelle eine feste
  Zahl Veröffentlichungen in 24 Stunden (meist 100, manchmal 50).
  `/admin/instagram` zeigt den echten Wert. Jede Story zählt einzeln,
  ein Karussell zählt als ein Beitrag.
- **Stories ohne Text:** Bei Stories schickt das Studio keine
  Bildunterschrift mit. Was wichtig ist, steht im Bild.
- **Keine Sticker:** Link-, Umfrage- oder Ort-Sticker gehen über die
  Schnittstelle nicht. Brauchst du einen, teil diese Story wie bisher
  von Hand („Bild teilen“) und setz den Sticker in Instagram.
- **Der Schlüssel läuft nicht ab.** Er hört nur auf, wenn du den
  Systemnutzer löschst, ihm Seite oder Instagram-Konto wegnimmst, das
  Instagram-Konto in ein anderes Portfolio verschiebst, die App löschst
  oder Meta ihn sperrt.
- **Schlüssel austauschen:** neuen erzeugen (Teil 5, Schritte 4 bis 9),
  in Vercel beim Eintrag `INSTAGRAM_TOKEN` den Wert ersetzen (Edit),
  Redeploy. Den alten Schlüssel kannst du beim Systemnutzer widerrufen
  (Revoke tokens).
- **Verdacht, dass jemand den Schlüssel kennt?** Sofort beim
  Systemnutzer widerrufen und einen neuen erzeugen.
- **Nie nötig:** dein Instagram-Passwort irgendwo eintragen, ein
  Werbekonto, App Review, eine Unternehmensverifizierung.

---

## Wenn etwas nicht klappt

### „Kein Instagram-Konto gefunden“ oder kein Konto in `/admin/instagram`

1. Ist Instagram mit der Seite verbunden? (Teil 2, „Prüfen“)
2. Hat der Systemnutzer die Seite **und** das Instagram-Konto mit
   voller Kontrolle? (Teil 5, Schritt 3)
3. Hat der Schlüssel `pages_show_list`? Wenn du unsicher bist: neuen
   Schlüssel erzeugen und in Vercel ersetzen.
4. Hilft das alles nicht: `INSTAGRAM_KONTO_ID` eintragen (Teil 6,
   Schritt 3) und neu veröffentlichen.

### „Zugang abgelaufen“ oder „Zugang fehlt“

Der Schlüssel wurde widerrufen, ist ungültig oder ihm fehlen Rechte.
Neuen Schlüssel mit allen fünf Rechten erzeugen (Teil 5, Schritte 4 bis
9), in Vercel ersetzen, Redeploy. Meldet Instagram danach immer noch
fehlende Rechte: Schlüssel noch einmal erzeugen und zusätzlich
`ads_read` anhaken (wenn angeboten).

### „Tageslimit erreicht“

Instagram zählt die letzten 24 Stunden. Warte ein paar Stunden und
versuch es dann noch einmal. Bei einer Story-Serie sagt dir das Studio,
welche Stories schon draußen sind. Poste die nicht noch einmal.

### „Kein Business-Konto“, Creator-Konto oder Konto eingeschränkt

Teil 1: auf **Unternehmen** umstellen. Ist das Konto eingeschränkt oder
gesperrt, steht der Grund in der Instagram-App unter **Einstellungen
und Aktivitäten → Kontostatus** (Account status).

### Bild abgelehnt

Meist konnte Instagram das Bild kurz nicht laden. Einfach noch einmal
posten. Kommt es wieder, nimm ein anderes Bild oder teil dieses von
Hand. Das Studio liefert die Bilder im passenden Format (JPEG, Story
1080 × 1920, Beitrag 1080 × 1350, unter 8 MB).

### Im Token-Fenster fehlen Rechte

Die Rechte zeigt Meta nur, wenn sie in der App hinzugefügt sind (Teil 4,
Schritt 8). Danach das Fenster schließen, Seite neu laden, noch einmal
**Token generieren**.

### Kein Knopf „Systemnutzer hinzufügen“

- Die App gehört nicht zum Portfolio (Teil 4, Schritt 5). In den
  Einstellungen unter **Konten → Apps** prüfen.
- Du bist nicht Admin im Portfolio.
- Meta verlangt Zwei-Faktor-Schutz im Facebook-Konto. Einschalten und
  neu anmelden.

### Meldung „Unzureichende Entwicklerrolle“ (Insufficient Developer Role)

Das kommt eher auf dem Weg mit Unified Login. Dann braucht dein
Instagram-Konto eine Rolle in der App:

1. developers.facebook.com → deine App → **App-Rollen → Rollen** (App
   roles → Roles) → **Personen hinzufügen** → **Instagram-Tester** →
   dein Instagram-Name → **Hinzufügen**.
2. Auf Instagram annehmen, am einfachsten am Computer: instagram.com →
   **Einstellungen** → **Website-Berechtigungen → Apps und Websites**
   (Website permissions → Apps and websites) → **Tester-Einladungen**
   (Tester invites) → **Annehmen**. In der App liegt derselbe Punkt
   unter **Einstellungen und Aktivitäten**; such dort nach „Apps und
   Websites“.

### Story nur für dich sichtbar

Bisher nicht beobachtet, nur für den Fall: Sehen andere deine per
Studio gepostete Story nicht, stell die App auf **Live**.
developers.facebook.com → deine App → **App-Einstellungen →
Allgemeines** (App settings → Basic): Datenschutzrichtlinie
`https://www.sitalo.de/datenschutz`, eine Kategorie und ein App-Symbol
eintragen → speichern → oben den Schalter von „Entwicklung“ auf
**Live** (oder **Veröffentlichen**, Publish). Eine Prüfung durch Meta
sollte dafür nicht nötig sein, weil nur du die App benutzt.

### Etwas anderes („Instagram hat einen Fehler gemeldet“)

Ein paar Minuten warten und noch einmal versuchen. Bleibt es dabei: In
Vercel → **Logs** nach `instagram` suchen. Dort stehen die Fehlernummer
von Instagram und eine Kennung (`fbtrace_id`), nie der Schlüssel. Mit
beiden kann ein Entwickler nachsehen.

---

**Bis alles läuft:** Du kannst jederzeit wie bisher posten: im
Story-Studio „Bild teilen“ oder „Alle Bilder teilen“ antippen und in
Instagram veröffentlichen.
