

# Dynamische Landingpage-Inhalte aus Datenbank mit KI-Aufbereitung

## Uebersicht

Alle 8 SEO-Landingpages werden mit einem einheitlichen System ausgestattet, das Menue-Daten aus der Datenbank liest und mit KI aufbereitet. Jede Seite ist ganzjaehrig sichtbar. Das Kernprinzip lautet: **"Nur aktualisieren, niemals loeschen"** – wenn keine passenden Gerichte in der DB gefunden werden, bleiben die zuletzt gespeicherten Inhalte bestehen.

## Architektur

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                        NAECHTLICHER CRON-JOB (3:00 Uhr)                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌──────────────┐    ┌───────────────────┐    ┌────────────────────┐   │
│  │   Supabase   │───►│ Edge Function:    │───►│    Lovable AI      │   │
│  │   pg_cron    │    │ update-landingpage│    │ (Gemini Flash)     │   │
│  │              │    │ -content          │    │                    │   │
│  └──────────────┘    └───────────────────┘    └────────────────────┘   │
│                              │                          │               │
│                              ▼                          ▼               │
│                      ┌────────────────────────────────────┐             │
│                      │     landingpage_content Tabelle    │             │
│                      │  (Alle 8 Seiten, 4 Sprachen)       │             │
│                      │                                    │             │
│                      │  REGEL: Nur UPDATE wenn neue       │             │
│                      │  Gerichte gefunden, sonst SKIP     │             │
│                      └────────────────────────────────────┘             │
│                                       │                                  │
└───────────────────────────────────────┼──────────────────────────────────┘
                                        │
                                        ▼
              ┌─────────────────────────────────────────────────┐
              │              FRONTEND (React)                   │
              │  useLandingpageContent(page_slug) Hook          │
              │       │                                         │
              │       ▼                                         │
              │  8 Landingpages (ALLE GANZJAEHRIG)              │
              │  - NeapolitanischePizza                         │
              │  - AperitivoMuenchen                            │
              │  - WildEssenMuenchen                            │
              │  - LunchMuenchen                                │
              │  - FirmenfeierMuenchen                          │
              │  - GeburtstagsfeierMuenchen                     │
              │  - RomantischesDinner                           │
              │  - EventlocationMuenchen                        │
              └─────────────────────────────────────────────────┘
```

## Einheitliches Mapping fuer alle 8 Landingpages

| Landingpage | Menue-Typ | Keyword-Filter | Sichtbarkeit | Update-Regel |
|-------------|-----------|----------------|--------------|--------------|
| NeapolitanischePizza | food | Pizza-Kategorie | Ganzjaehrig | Nur bei neuen Pizzen |
| AperitivoMuenchen | drinks | Spritz, Cocktails, Aperitif | Ganzjaehrig | Nur bei neuen Drinks |
| WildEssenMuenchen | food + special | Wild, Reh, Hirsch, Ente | Ganzjaehrig | Nur bei neuen Wild-Gerichten |
| LunchMuenchen | lunch | Alle Lunch-Items | Ganzjaehrig | Nur bei neuen Lunch-Gerichten |
| FirmenfeierMuenchen | food + drinks | Premium-Auswahl | Ganzjaehrig | Nur bei Aenderungen |
| GeburtstagsfeierMuenchen | food + drinks | Premium-Auswahl | Ganzjaehrig | Nur bei Aenderungen |
| RomantischesDinner | food + drinks | Premium-Auswahl | Ganzjaehrig | Nur bei Aenderungen |
| EventlocationMuenchen | food + drinks | Premium-Auswahl | Ganzjaehrig | Nur bei Aenderungen |

**Wichtig**: Alle Seiten folgen derselben Logik – keine Sonderbehandlung. Wild ist nur ein Beispiel, bei dem saisonale Inhalte vorkommen koennen.

## Update-Logik (gilt fuer ALLE Seiten identisch)

```text
┌─────────────────────────────────────────────────────────────────┐
│                    EINHEITLICHE UPDATE-LOGIK                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Fuer JEDE der 8 Landingpages:                                 │
│                                                                 │
│  1. Relevante Gerichte aus DB filtern (per Keyword/Kategorie)  │
│                                                                 │
│  2. Gerichte gefunden?                                         │
│     ┌─────────────────┐     ┌─────────────────────────────┐    │
│     │      JA         │     │           NEIN              │    │
│     │                 │     │                             │    │
│     │  Hash berechnen │     │  NICHTS TUN                 │    │
│     │       │         │     │  Vorherige Inhalte          │    │
│     │       ▼         │     │  bleiben erhalten           │    │
│     │  Hash geaendert?│     │                             │    │
│     │   │         │   │     │  Status: "skipped"          │    │
│     │  JA        NEIN │     └─────────────────────────────┘    │
│     │   │         │   │                                        │
│     │   ▼         ▼   │                                        │
│     │ UPDATE   SKIP   │                                        │
│     │ mit KI   (keine │                                        │
│     │          Aend.) │                                        │
│     └─────────────────┘                                        │
│                                                                 │
│  Ergebnis: Inhalte werden NIE geloescht, nur aktualisiert     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Implementierungsschritte

### Phase 1: Datenbank-Tabelle

Neue Tabelle `landingpage_content` mit:
- `page_slug` (unique) fuer alle 8 Seiten
- `menu_highlights` (JSONB) – Array der Gerichte mit Namen, Beschreibung, Preis
- `intro_de/en/it/fr` – KI-generierte Intro-Texte in 4 Sprachen
- `highlights_text_de/en/it/fr` – KI-generierte Highlight-Beschreibungen
- `season_info` (JSONB, optional) – Nur wenn eine Seite saisonale Info braucht
- `last_menu_hash` – Hash zur Aenderungserkennung
- `last_successful_update` – Wann zuletzt aktualisiert
- `update_status` – "updated", "unchanged", "skipped_no_items"

RLS: Oeffentlich lesbar, nur Service Role kann schreiben.

### Phase 2: Edge Function

Eine einzige Edge Function `update-landingpage-content` die:
1. Alle 8 Landingpages durchlauft
2. Pro Seite: Relevante Menue-Items aus DB filtert
3. Hash vergleicht mit gespeichertem Hash
4. Bei Aenderung: Lovable AI (Gemini Flash) aufruft fuer Content-Generierung
5. Ergebnis in 4 Sprachen speichert
6. Bei keine Gerichte gefunden: SKIP (vorherige Inhalte bleiben)

Konfiguration pro Seite:
```typescript
const LANDINGPAGE_CONFIGS = {
  'neapolitanische-pizza-muenchen': {
    menuTypes: ['food'],
    keywords: ['pizza'],
    categoryMatch: 'pizz',
  },
  'aperitivo-muenchen': {
    menuTypes: ['drinks'],
    keywords: ['spritz', 'aperol', 'negroni', 'cocktail'],
    categoryMatch: 'aperitif|cocktail|spritz',
  },
  'wild-essen-muenchen': {
    menuTypes: ['food', 'special'],
    keywords: ['wild', 'reh', 'hirsch', 'wildschwein', 'ente'],
    categoryMatch: 'wild',
  },
  // ... alle 8 Seiten
};
```

### Phase 3: Cron-Job

pg_cron Job der taeglich um 3:00 Uhr die Edge Function aufruft.

### Phase 4: Frontend-Hook

Neuer Hook `useLandingpageContent(pageSlug)`:
- Liest aus `landingpage_content` Tabelle
- Waehlt sprachspezifische Felder (DE/EN/IT/FR)
- Fallback auf statische Uebersetzungs-Keys wenn keine DB-Daten
- 1 Stunde Cache (staleTime)

### Phase 5: Landingpage-Anpassungen

Alle 8 Seiten werden angepasst:
- Import des neuen Hooks
- Dynamische Daten fuer Gerichte/Drinks/Highlights
- Fallback auf bestehende statische Texte

Beispiel:
```typescript
const { data: dynamicContent } = useLandingpageContent('neapolitanische-pizza-muenchen');

const pizzaHighlights = dynamicContent?.highlights?.length > 0
  ? dynamicContent.highlights
  : staticFallbackFromTranslations;
```

### Phase 6: Admin-Status-Anzeige

Neuer Bereich im Admin-Panel der fuer alle 8 Seiten zeigt:
- Letzte Pruefung
- Letztes erfolgreiches Update
- Anzahl gefundener Gerichte
- Status (Aktuell / Unveraendert / Uebersprungen)
- Manueller Trigger-Button

## Optionale Saison-Info

Falls eine Seite saisonale Hinweise benoetigt (z.B. Wild), kann `season_info` befuellt werden:
```json
{
  "label_de": "Wildsaison: September bis Januar",
  "label_en": "Game season: September to January",
  "start_month": 9,
  "end_month": 1
}
```

Der Frontend-Hook berechnet dann `isInSeason` und zeigt entsprechende Badges. Dies ist OPTIONAL und aendert nichts an der ganzjaehrigen Sichtbarkeit.

## Zeitplan

| Phase | Aufwand | Beschreibung |
|-------|---------|--------------|
| Phase 1 | 1 Nachricht | Datenbank-Tabelle erstellen |
| Phase 2 | 2-3 Nachrichten | Edge Function mit KI-Integration |
| Phase 3 | 1 Nachricht | Cron-Job einrichten |
| Phase 4 | 1 Nachricht | Frontend-Hook erstellen |
| Phase 5 | 3-4 Nachrichten | Alle 8 Landingpages anpassen |
| Phase 6 | 1 Nachricht | Admin-Status-Anzeige |

**Gesamt: ca. 10-12 Nachrichten**

