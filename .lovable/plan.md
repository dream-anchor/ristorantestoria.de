# Newsletter-Konformität (seasonal_signups) + Doku-Korrektur Menüdaten — UMGESETZT

## TEIL 1 — Newsletter Double-Opt-In (erledigt)
- Migration: status/confirm_token/confirmed_at/consent_ip/consent_text/consent_at/consent_version; Status-Validierungstrigger; anon-INSERT entzogen (RLS-Policy entfernt).
- Edge Function `subscribe-seasonal` (Service-Role): schreibt status='pending', speichert IP + Einwilligungstext/-version, sendet DOI-Mail (nur Bestätigung, keine Werbung).
- `SeasonalSignupForm.tsx` ruft jetzt `subscribe-seasonal` statt Direct-Insert; zeigt DOI-Hinweis (doiTitle/doiMessage in 4 Sprachen).
- `confirm-seasonal` + Seite `NewsletterBestaetigung.tsx` (Routen DE/EN/IT/FR, noindex).
- `notify-seasonal-signups`: nur status='confirmed'; jede Mail mit Abmeldelink + List-Unsubscribe (one-click).
- `unsubscribe-seasonal`: setzt status='unsubscribed' (GET=HTML-Seite, POST=one-click).
- `Datenschutz.tsx`: Newsletter-Abschnitt + Resend als Auftragsverarbeiter (DPF + SCC).
- KEIN Lösch-/Purge-Job — bestätigte Abonnenten bleiben.

## TEIL 2 — Menüdaten (bestätigt)
- Keine 60-Tage-Purge-/Soft-Delete-Logik vorhanden. Klarstellung in Projekt-Memory aufgenommen.
