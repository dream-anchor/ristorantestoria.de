# Notfallplan: Anfrageformulare im Live-Betrieb wiederherstellen

## Bestätigte Ursache
- Auf `/reisegruppen/` ist der rote Hero-CTA weiterhin ein E-Mail-Link. Deshalb öffnet der Klick IONOS/Webmail statt eines Formulars.
- Das Reisegruppen-MAESTRO-Widget steht nur im Kontaktbereich am Seitenende, sein Container bleibt live jedoch leer.
- Das geladene MAESTRO-Skript `https://api.maestro.cloud/api/public/widgets/v1/maestro.js` scheitert live aktuell an der DNS-Auflösung (`ERR_NAME_NOT_RESOLVED`). Das betrifft grundsätzlich beide eingebauten MAESTRO-Widgets.
- Die vorherigen internen Komponenten `GroupInquiryForm` und `FilmfestInquiryForm` wurden gelöscht, sind aber vollständig aus der Versionshistorie wiederherstellbar.

## Sofortmaßnahme
1. **Die beiden zuletzt funktionierenden internen Formulare wiederherstellen**
   - Reisegruppenformular mit allen bisherigen Feldern, Validierung, Dateiupload, Spam-Schutz, UTM-Daten und Weiterleitung.
   - Filmfestformular mit bisherigen Feldern, Validierung und Versandlogik.
   - Das ungenutzte `EventInquiryForm` bleibt gelöscht.

2. **Formulare wieder an ihren bisherigen sichtbaren Positionen einsetzen**
   - `/reisegruppen/`: internes Reisegruppenformular zurück in den Anfragebereich.
   - `/filmfest-muenchen/`: internes Filmfestformular zurück in den Kontaktbereich.
   - Leere MAESTRO-Container auf diesen Seiten entfernen, damit kein unsichtbarer/formloser Bereich bleibt.

3. **Alle Anfrage-CTAs korrekt mit dem Formular verbinden**
   - Der rote Reisegruppen-Hero-CTA wird vom E-Mail-Link zu einem Sprung auf den Formularbereich geändert.
   - Der CTA im unteren Reisegruppen-Kontaktblock führt ebenfalls zum Formular; Telefon, WhatsApp und separate E-Mail-Kontaktmöglichkeiten bleiben erhalten.
   - Bestehende CTA-Texte, Seiteninhalte, Menüs und Layout bleiben unverändert.

4. **Tracking und Erfolgspfad absichern**
   - Das bisherige Tracking der wiederhergestellten Formulare erhalten.
   - Keine doppelte `generate_lead`-Messung durch die globale MAESTRO-Brücke zulassen.
   - Bestehende Danke-/Erfolgslogik der internen Formulare beibehalten.

## Prüfung vor Abschluss
- Desktop und Mobile für Reisegruppen und Filmfest prüfen.
- Sicherstellen, dass jeder primäre Anfrage-CTA das sichtbare Formular erreicht und kein Mailprogramm öffnet.
- Formularvalidierung, Datenschutz-Checkbox, Dateiupload und Submit-Zustände prüfen.
- Versand-Endpunkte ohne echte Kundenanfrage auf Erreichbarkeit prüfen; keinen Test-Lead an das Restaurant senden.
- Typecheck und relevante Tests ausführen.

## Danach
MAESTRO erst erneut aktivieren, wenn dessen Skript unter der gelieferten URL zuverlässig öffentlich erreichbar ist und beide Widgets in einer Live-nahen Prüfung tatsächlich Shadow-DOM-Inhalt rendern. Die internen Formulare bleiben bis dahin der sichere Produktions-Fallback.
