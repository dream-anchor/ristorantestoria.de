# Aufräumen: verwaister Clarity-Kommentar

## Kontext
Die Prüfung ist abgeschlossen. Alle bestätigten Punkte sind OK; einzige reale Abweichung gegenüber dem behaupteten Stand war der fehlende Microsoft-Clarity-Datenschutzabschnitt. Da Clarity **nirgends** im Code integriert ist (keine `ClarityTracking.tsx`, kein Lade-Code, kein Datenschutz-Abschnitt), ist datenschutzrechtlich nichts zu ergänzen oder funktional zu entfernen.

Übrig bleibt nur ein irreführender Kommentar.

## Änderung
- `index.html` (Z.41): Kommentar `<!-- Microsoft Clarity — consent-gated via ClarityTracking.tsx -->` entfernen, da er auf eine nicht existierende Komponente verweist.

## Kein Handlungsbedarf
- Punkt 1–3 & 5: bestätigt OK, keine Änderungen.
- Punkt 4 (events-storia-DB): anon → 401 für alle 5 Tabellen bestätigt; keine Änderung in diesem Projekt.
- Kein Datenschutz-Clarity-Abschnitt nötig (Clarity wird nicht eingesetzt).

## Hinweis
Falls du `security_invoker`/RPC-only für die events-DB-Views verbindlich verifizieren willst, brauche ich DB-Owner-Zugang zum events-Projekt (separat).
