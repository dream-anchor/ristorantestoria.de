# MAESTRO-Widgets mit korrigierter Embed-URL live schalten

## Verifizierter Stand
- Die neue Adresse `https://storia.schrittmacher.ai/api/public/widgets/v1/maestro.js` antwortet mit Status 200 als JavaScript (ca. 27 KB).
- Das Skript enthält die erwartete Logik: es liest `data-maestro-widget`, rendert per Shadow DOM und feuert `MAESTRO_INQUIRY_SUBMITTED`.
- Die bisher eingetragene Adresse (`api.maestro.cloud`) ist live nicht auflösbar — das war die Ursache für die leeren Formularbereiche.
- Beide Widget-IDs sind bereits korrekt in den Seiten hinterlegt (Reisegruppen, Filmfest).

## Umsetzung
1. **Skript-URL korrigieren**
   - In der Widget-Komponente die Quelle auf `https://storia.schrittmacher.ai/api/public/widgets/v1/maestro.js` umstellen, weiterhin `defer` und nur einmal pro Seite geladen.

2. **Widgets wieder als aktiven Weg schalten**
   - Reisegruppen: Widget im Anfragebereich aktiv, sichtbar überschrieben mit der bestehenden Überschrift.
   - Filmfest: Widget im Kontaktbereich aktiv.
   - Kein Wiederherstellen der alten internen Formulare, solange das Widget nachweislich lädt.

3. **Roten Hero-CTA reparieren**
   - „Gruppenanfrage senden" auf `/reisegruppen/` verweist derzeit auf einen E-Mail-Link und öffnet dadurch das Mailprogramm. Der Button springt künftig zum Formularbereich auf derselben Seite.
   - Der primäre CTA im unteren Kontaktblock führt ebenfalls zum Formular; Telefon, WhatsApp und die separate E-Mail-Angabe bleiben unverändert bestehen.

4. **Sicherheitsnetz beibehalten**
   - Lädt das Skript nicht oder bleibt der Widget-Container leer, wird nach kurzer Wartezeit ein sichtbarer Hinweis mit Telefon, WhatsApp und E-Mail als Ersatzweg angezeigt, damit nie ein leerer Bereich entsteht.

5. **Tracking**
   - Die bestehende Brücke bleibt: `generate_lead` (1500 EUR) beim Absenden, danach Weiterleitung auf `/danke` mit Namensparameter — einmalig, keine Doppelmessung.

## Prüfung vor Abschluss
- Reisegruppen und Filmfest in Desktop- und Mobilansicht: Widget rendert echte Formularfelder.
- Roter Hero-CTA öffnet kein Mailprogramm, sondern führt zum Formular.
- Skript wird nur einmal geladen, keine Konsolenfehler durch das Widget.
- Typecheck ausführen. Kein Test-Lead an das Restaurant senden.

## Hinweis zum Datenschutz
Die Datenschutzerklärung führt MAESTRO noch nicht als Auftragsverarbeiter mit dieser Domain. Das ist getrennt zu ergänzen, sobald Auftragsverarbeitungsvertrag und Angaben zum Anbieter vorliegen.
