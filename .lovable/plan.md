# Oktoberfest-Sondermenü in die Datenbank einspielen

## Ausgangslage
- Datei `supabase/migrations/20260701120000_seed_oktoberfest_menu.sql` enthält einen idempotenten `DO $$`-Block.
- DB-Check bestätigt: Slug `oktoberfest-menue` existiert **noch nicht** → der Insert läuft durch (keine Doppelanlage).
- Es sind ausschließlich `INSERT`-Statements in die bestehenden Tabellen `menus`, `menu_categories`, `menu_items`. Keine Schemaänderung, keine neuen Tabellen, keine Änderung/Löschung bestehender Menüs.

## Umsetzung
1. **SQL ausführen:** Den kompletten `DO $$ ... END $$;`-Block aus der Migrationsdatei über das Daten-Tool (`supabase--insert`) auf der verbundenen Datenbank ausführen. Der Block:
   - legt 1 Menü an (`menu_type='special'`, `slug='oktoberfest-menue'`, `is_published=true`, Titel „Oktoberfest – Speisen & Getränke", 4-sprachig),
   - 6 Kategorien (Wiesnbier vom Holzfass, Aperitivo-Brücke, Brotzeit & Brezn, Oktoberfest-Pizzen, Braten & Hauptgerichte, Gruppen-/Firmen-Pakete),
   - 23 Positionen, jeweils de/en/it/fr mit Preis.

2. **Verifikation nach dem Insert (read-only):**
   - `SELECT id, slug, menu_type, is_published, title FROM public.menus WHERE slug='oktoberfest-menue';` → genau 1 Zeile.
   - Anzahl Kategorien (= 6) und Items (= 23) über Joins gegenprüfen.

## Erwartetes Ergebnis
- Im Admin (`/admin`) → „Besondere Anlässe" erscheint „Oktoberfest – Speisen & Getränke", vollständig editierbar (Name/Beschreibung/Preis, 4-sprachig).
- `/oktoberfest-muenchen/` zeigt danach die DB-Daten.
- Anschließend kurze Bestätigung, dass die Migration lief und das Menü in `menus` (slug=`oktoberfest-menue`) vorhanden ist.

## Nicht-Ziele
- Keine Codeänderungen, keine Schemaänderungen, keine Anpassung anderer Menüs.