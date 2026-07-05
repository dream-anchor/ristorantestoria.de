# Deploy-Hinweise: Speisekarten-Fix

Nach dem Merge dieses Branches sind folgende manuelle Schritte nötig.

## 1. Neue Migrationen einspielen

```bash
supabase db push
```

Enthalten:
- `20260705120000_menu_i18n_kein_de_kopieren.sql` – Cleanup-Trigger kopiert kein
  Deutsch mehr nach `name_it`; bereinigt zusätzlich vorhandene deutsche Kopien
  in `menu_items.name_it` (nur eindeutig deutsche Texte, Eigennamen bleiben).
- `20260705120100_publish_menu_atomic.sql` – neue RPC `publish_menu_atomic`
  für atomisches Veröffentlichen (Karte bleibt während des Publish online).

## 2. Edge Function deployen

```bash
supabase functions deploy parse-menu-pdf
```

Neu: Validierungs- und Nachübersetzungs-Runde (EN/IT/FR) nach der Extraktion.
Benötigt weiterhin nur das vorhandene Secret `LOVABLE_API_KEY`.

## 3. Frontend deployen

Normaler Build/Deploy (GitHub-Workflow). Danach im Admin einmal testweise eine
Karte hochladen und prüfen, dass Allergene/Vegetarisch/Vegan in der Vorschau
erscheinen und nach dem Veröffentlichen in `menu_items` gespeichert sind.

## 4. Bestandsdaten: Re-Übersetzung empfohlen

Bereits gespeicherte Karten können weiterhin fehlende bzw. geleerte
IT/FR/EN-Felder haben (die Seite zeigt dann Deutsch als Fallback – nichts ist
kaputt). Für echte Übersetzungen die betroffenen Karten im Admin einmal neu
hochladen (PDF erneut analysieren + veröffentlichen) oder im Editor
„Alle Sprachen übersetzen" nutzen.

Prüf-Query für verbleibende Lücken:

```sql
SELECT id, name, name_it, name_fr, name_en
FROM menu_items
WHERE name_it IS NULL OR name_it = '' OR name_fr IS NULL OR name_fr = '';
```

## 5. Types regenerieren (optional, empfohlen)

`publish_menu_atomic` wurde manuell in `src/integrations/supabase/types.ts`
ergänzt. Nach dem `db push` einmal regenerieren, damit alles konsistent ist:

```bash
supabase gen types typescript --project-id <PROJECT_ID> > src/integrations/supabase/types.ts
```

## Bekannte, bewusst NICHT angefasste Punkte

- In `supabase/functions/parse-menu-pdf/index.ts` (Funktion `reportEdgeError`)
  ist ein `shared_secret` hartkodiert – das war schon vorher so und sollte
  separat in ein Supabase-Secret verschoben werden.
- Im Trigger `notify_classify_seasonal_menu` (Migration 20260207164624) ist ein
  Anon-JWT hartkodiert – ebenfalls Bestand, separat behandeln.
