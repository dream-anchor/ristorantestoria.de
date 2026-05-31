## Ziel
Das Filmfest-Formular auf `/filmfest-muenchen#kontakt` soll wieder erfolgreich absenden, ohne sichtbare Layout- oder Inhaltsänderungen an der Seite.

## Umsetzung
1. **Fehler an der empfangenden Anfrage-Funktion beheben**
   - Die externe Funktion `receive-event-inquiry` im Projekt `events-storia.de` reparieren, da das Formular dorthin postet.
   - Reale Fehlerursache per Funktions-Logs eingrenzen und gezielt beheben.

2. **Backend robuster machen**
   - Sicherstellen, dass eine gültige Anfrage nicht mit 500 fehlschlägt, nur weil ein nachgelagerter Schritt scheitert.
   - Anfrage zuerst zuverlässig speichern.
   - Mailversand, Logeinträge und Nebenbenachrichtigungen so absichern, dass sie den gesamten Submit nicht unnötig abbrechen.

3. **Payload-Vertrag für Filmfest stabilisieren**
   - Prüfen, ob die Filmfest-Werte (`eventType: "filmfest"`, `source: "filmfest-landingpage"`, Nachricht mit Format-Präfix) in der externen Funktion korrekt verarbeitet werden.
   - Falls nötig: minimale Normalisierung in der Funktion oder ein kleiner, nicht sichtbarer Payload-Fix im Filmfest-Formular.

4. **Ende-zu-Ende verifizieren**
   - Formular im Preview erneut absenden.
   - Netzwerkantwort und Funktionsverhalten prüfen.
   - Bestätigen, dass die Seite visuell unverändert bleibt und nur das Absenden wieder funktioniert.

## Technische Details
- Betroffene Frontend-Datei: `src/components/FilmfestInquiryForm.tsx`
- Betroffene Gegenstelle: externes Projekt `events-storia.de`, Funktion `supabase/functions/receive-event-inquiry/index.ts`
- Wahrscheinlicher Fehlerbereich: serverseitiger Insert-/Mail-/Logging-Pfad nach dem erfolgreichen POST vom Frontend
- Keine Änderung an sichtbarer Filmfest-Struktur, Copy oder SEO-Content

## Validierung
- Erfolgreicher Submit ohne rotes Fehler-Toast
- HTTP-Erfolg von der Anfrage-Funktion
- Anfrage wird im externen Event-System gespeichert
- Seite bleibt visuell unverändert