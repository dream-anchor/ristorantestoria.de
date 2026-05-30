## Problem

Der E-Mail-/Anfragenversand schlägt fehl ("Etwas ist schiefgelaufen"). Ursache liegt **nicht** am E-Mail-Versand selbst, sondern am Anfrage-Endpoint, der die E-Mails auslöst.

Der Filmfest-Anfrage-Endpoint (`receive-event-inquiry`, läuft im separaten Projekt **events-storia.de**) erwartet die Felder in **camelCase** (`contactName`, `companyName`, `guestCount`, `eventType`, `preferredDate`). Unsere Formulare senden sie aber in **snake_case** (`contact_name`, `company_name`, …). Dadurch greift die Validierung `if (!data.contactName || !data.email)` und der Server antwortet mit HTTP 400 „Name und E-Mail sind erforderlich". Es wird keine E-Mail versendet.

Bestätigt per Direkttest:
- snake_case Payload → `{"error":"Name und E-Mail sind erforderlich"}`
- camelCase Payload → `{"success":true, ...}` (E-Mail wird versendet)

Betroffen sind **zwei** Formulare in diesem Projekt:
- `src/components/FilmfestInquiryForm.tsx`
- `src/components/EventInquiryForm.tsx`

(`GroupInquiryForm.tsx` ist korrekt — sendet bereits camelCase an einen anderen Endpoint.)

## Fix (in diesem Projekt)

**1. `FilmfestInquiryForm.tsx`** — Payload im `fetch`-Body von snake_case auf camelCase umstellen:
- `company_name` → `companyName`
- `contact_name` → `contactName`
- `phone` bleibt `phone`
- `guest_count` → `guestCount`
- `event_type` → `eventType`
- `preferred_date` → `preferredDate`
- `message`, `source` bleiben gleich

**2. `EventInquiryForm.tsx`** — gleiche Umstellung der Payload-Keys auf camelCase.

Die Formularfelder/Zod-Schemata bleiben unverändert; nur das gesendete JSON-Objekt wird angepasst.

## Wichtiger Hinweis: CORS auf der Produktivdomain

Der Endpoint im Projekt events-storia.de erlaubt aktuell per CORS nur:
`events-storia.de`, `localhost` und Lovable-Preview-Domains (`*.lovable.app`, `*.lovableproject.com`).

`https://www.ristorantestoria.de` ist **nicht** in der Allowlist. Das bedeutet:
- In der **Lovable-Vorschau** funktioniert das Formular nach dem Fix sofort.
- Auf der **Live-Domain** `www.ristorantestoria.de` wird die Anfrage weiterhin vom Browser per CORS blockiert.

Um den Live-Versand zu ermöglichen, muss im **separaten Projekt events-storia.de** in `supabase/functions/_shared/cors.ts` die Allowlist erweitert werden um:
```
/^https:\/\/(www\.)?ristorantestoria\.de$/,
```
Das kann ich von hier aus nicht ändern (anderes Projekt). Diese Anpassung muss im events-storia.de-Projekt vorgenommen und die Edge Function neu deployed werden.

## Verifikation
- Nach dem Fix in der Vorschau eine Testanfrage absenden → Erfolgsmeldung statt Fehler.
- Nach CORS-Anpassung im events-Projekt auf der Live-Domain testen.
