# Angebote erstellen und senden

Im Mitgliederbereich erstellst du zu jeder Anfrage ein Angebot per
Knopfdruck, passt es an und schickst es als Link. Der Kunde nimmt es
auf seinem Handy an oder lehnt ab. Du bekommst sofort Bescheid.

Alles geht am iPhone.

---

## Einmalig: Datenbank erweitern (2 Min.)

1. Mitgliederbereich öffnen. Oben steht „Datenbank-Update ausstehend“.
2. **SQL kopieren** antippen, dann **SQL Editor öffnen** (Supabase).
3. Im Editor einfügen und **Run** antippen.
4. Zurück im Mitgliederbereich **Erneut prüfen** antippen.

Danach erscheint bei jeder Anfrage der Knopf **Angebot erstellen**.
Das Update ist rein additiv: Anfragen, Notizen und Verlauf bleiben
unverändert, und es schadet nicht, es zweimal auszuführen.

---

## Ein Angebot, Schritt für Schritt

1. **Anfrage öffnen → Angebot erstellen.** Der Entwurf ist schon
   ausgefüllt: Paket aus der Anfrage, Preise, Einleitung, Hinweise,
   30 Tage gültig. Er bekommt eine fortlaufende Nummer (A-2026-0001).
2. **Anpassen.** Leistungen ändern, hinzufügen oder entfernen, Mengen
   und Preise eintragen, Hinweise ergänzen. Die Summen rechnen live
   mit. Dann **Speichern**.
   - Preise netto eingeben, zum Beispiel `1.299` oder `1.299,50`.
     Ein Tippfehler wie `1,299` wird markiert und nicht übernommen.
   - Der Steuersatz ist fest (siehe unten) und steht nur zur Anzeige.
3. **Senden → Freigeben.** Erst nach der Freigabe funktioniert der
   Link für den Kunden. So bekommt niemand einen Link ins Leere.
4. **Verschicken.** Per Mail (öffnet dein Mail-Programm mit fertigem
   Text), über **Teilen** (WhatsApp, SMS) oder **Link kopieren**.
   Danach **Fertig**.
5. **Warten.** Öffnet der Kunde den Link, steht „vom Kunden geöffnet“
   im Verlauf. Nimmt er an oder lehnt ab, bekommst du eine Mail und
   die Karte zeigt es an.

Solange niemand angenommen hat, kannst du ein gesendetes Angebot
weiter bearbeiten. Der Kunde sieht dann „Geändert am …“. Hatte er die
alte Fassung noch offen, kann er sie nicht mehr annehmen; die Seite
zeigt ihm den neuen Stand.

**Weitere Knöpfe auf der Karte:** Erneut senden, Zurückziehen (Kunde
sieht „nicht mehr gültig“), Als abgelehnt markieren (nach einem
Anruf), Weiteres Angebot erstellen, Entwurf verwerfen.

---

## Was der Kunde sieht

Ein gesetztes Angebot mit Briefkopf, Positionen, Summen (netto, USt,
brutto) und deinen Hinweisen. Er kann es als PDF speichern, dich
anrufen oder schreiben, annehmen oder ablehnen.

Beim Annehmen gibt er seinen Namen ein, setzt ein Häkchen und tippt
**Angebot zahlungspflichtig annehmen**. Direkt darüber stehen die
Beträge. Die Angebote richten sich an Betriebe und Selbstständige
(§ 14 BGB); so steht es auch auf der Seite. Nach der Annahme bekommt
er automatisch eine Bestätigung per Mail mit allen Positionen.

Die Angebotsseiten sind nicht bei Google zu finden, werden in der
Besucherstatistik nicht gezählt und zeigen ein Jahr nach dem
Abschluss nur noch die Nummer.

---

## Einstellungen in Vercel (Settings → Environment Variables)

| Name | Wofür | Beispiel |
| --- | --- | --- |
| `ANGEBOT_UST_SATZ` | Steuersatz für alle Angebote: `19` oder `0` (Kleinunternehmer nach § 19 UStG). Ohne Eintrag 19. | `19` |
| `LEAD_MAIL_FROM` | Absender der Bestätigungs-Mail an Kunden. Muss eine bei Resend bestätigte Adresse deiner Domain sein, sonst geht die Mail nicht raus. | `Sitalo Webdesign <angebote@sitalo.de>` |
| `ANGEBOT_ABSENDER_ADRESSE` | Deine Anschrift im Briefkopf, Zeilen mit `\|` getrennt. Ohne Eintrag steht nur „Hamburg“. | `Musterweg 1 \| 20095 Hamburg` |

Nach jeder Änderung: Deployments → oberster Eintrag → drei Punkte →
**Redeploy**.

Geht die Bestätigung an den Kunden nicht raus (steht dann im Verlauf
als „fehlgeschlagen“), schick ihm die PDF einfach selbst.

---

## Aufbewahrung

Angenommene Angebote gehören zu deinen Geschäftsunterlagen und sind in
der Regel sechs Jahre aufzubewahren (§ 257 HGB, § 147 AO). Deshalb
lässt sich eine Anfrage mit angenommenem Angebot nicht endgültig
löschen; lass sie archiviert. Nicht angenommene Angebote verschwinden
mit der Anfrage.
