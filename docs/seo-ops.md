# SEO Operations System

Automatisiertes SEO-Monitoring und Handlungsempfehlungen für ristorantestoria.de.

## Übersicht

Das SEO Operations System analysiert täglich die Google Search Console Daten und:

1. **Berechnet Baselines** - Normwerte für alle wichtigen Metriken
2. **Erkennt Probleme** - Automatische Alert-Generierung bei Abweichungen
3. **Erstellt Tasks** - Konkrete Aufgaben für SEO-Optimierungen
4. **Generiert Prompts** - Copy/Paste-Prompts für Claude Code

## Architektur

```
┌─────────────────────────────────────────────────────────────────┐
│                        Admin Dashboard                           │
│   /admin/seo → SEODashboard.tsx                                 │
├─────────────────────────────────────────────────────────────────┤
│                     React Query Hooks                            │
│   useSEOOps.ts → useSEOBriefing, useSEOAlerts, useSEOTasks...  │
├─────────────────────────────────────────────────────────────────┤
│                    Supabase Edge Functions                       │
│   seo-api     → REST API für Alerts, Tasks, Prompts            │
│   seo-pipeline → Tägliche Analyse-Pipeline                      │
├─────────────────────────────────────────────────────────────────┤
│                    PostgreSQL Tabellen                           │
│   seo_alert_event, seo_task, seo_prompt_pack, ...              │
└─────────────────────────────────────────────────────────────────┘
```

## Datenbank-Schema

### Haupt-Tabellen

| Tabelle | Beschreibung |
|---------|--------------|
| `seo_page_catalog` | Katalog aller wichtigen Seiten mit Seitentyp und Keywords |
| `seo_alert_rule` | Konfigurierbare Regeln für Alert-Erkennung |
| `seo_alert_event` | Erkannte SEO-Probleme/Chancen |
| `seo_task` | Aufgaben aus Alerts generiert |
| `seo_prompt_pack` | Claude Code Prompts für Fixes |
| `seo_daily_briefing` | Tägliche Zusammenfassung |
| `seo_baseline_cache` | Berechnete Normwerte |
| `seo_pipeline_run` | Pipeline-Ausführungsprotokoll |

### Seitentypen (Page Types)

| Typ | Beschreibung | Severity Boost |
|-----|--------------|----------------|
| `money` | Hauptseiten mit Conversion-Ziel | +2 |
| `pillar` | Hauptthemen-Seiten | +1 |
| `cluster` | Unterthemen-Seiten | 0 |
| `trust` | Vertrauens-Seiten (Über uns, Team) | +1 |
| `legal` | Rechtliche Seiten (Impressum, AGB) | 0 |
| `legacy` | Alte CMS-Seiten (zum Entfernen) | 0 |

### Alert-Fenster (Windows)

| Fenster | Berechnung | Verwendung |
|---------|------------|------------|
| `daily` | Heute vs. 7-Tage-Durchschnitt | Schnelle Erkennung |
| `wow` | Diese 7 Tage vs. letzte 7 Tage | Wochenvergleich |
| `mom` | Diese 28 Tage vs. letzte 28 Tage | Monatsvergleich |

## Alert-Regeln

### Konfigurierte Regeln

| Regel | Beschreibung | Standard-Schwelle |
|-------|--------------|-------------------|
| `drop_clicks_site` | Gesamtseiten-Klicks fallen | -20% |
| `drop_clicks_page` | Seiten-Klicks fallen | -30% |
| `drop_impressions_page` | Seiten-Impressionen fallen | -40% |
| `position_drop` | Ranking-Position verschlechtert sich | +3 Positionen |
| `ctr_drop_stable_position` | CTR fällt bei stabiler Position | -25% |
| `duplicate_variants` | URL-Varianten erkannt | >1 Variante |
| `legacy_cms_traffic` | Traffic auf alten CMS-Seiten | >10 Klicks |
| `cannibalization` | Keywords auf mehreren Seiten | >2 Seiten |
| `appearance_loss` | Rich Results verschwinden | Verlust |
| `mobile_gap` | Mobile-Performance schlechter | -30% vs Desktop |
| `rising_query` | Wachsende Suchanfrage | +50% |
| `striking_distance` | Keywords kurz vor Top 10 | Position 11-20 |

### Severity-Stufen

| Stufe | Beschreibung | Reaktionszeit |
|-------|--------------|---------------|
| `critical` | Schwerwiegendes Problem | Sofort |
| `high` | Wichtiges Problem | Heute |
| `medium` | Mittleres Problem | Diese Woche |
| `low` | Kleine Chance/Verbesserung | Bei Gelegenheit |

## Edge Functions

### seo-pipeline

Hauptpipeline für tägliche SEO-Analyse.

**Trigger:**
- Cron-Job: Täglich nach GSC-Sync (06:15 UTC)
- Manuell: Admin-Dashboard "Pipeline ausführen"

**Ablauf:**
1. GSC-Daten aus letzten 28 Tagen laden
2. Baselines für Site/Page/Query berechnen
3. Alle Alert-Regeln prüfen
4. Erkannte Alerts speichern
5. Tasks für kritische Alerts erstellen
6. PromptPacks generieren
7. Daily Briefing erstellen

**Aufruf:**
```bash
curl -X POST \
  https://[PROJECT].supabase.co/functions/v1/seo-pipeline \
  -H "Authorization: Bearer [ANON_KEY]" \
  -H "Content-Type: application/json" \
  -d '{"date": "2026-02-06"}'
```

### seo-api

REST API für alle SEO-Daten.

**Endpunkte:**

| Methode | Pfad | Beschreibung |
|---------|------|--------------|
| GET | `/briefing` | Aktuelles/spezifisches Briefing |
| GET | `/alerts` | Alerts mit Filtern |
| PATCH | `/alerts/:id` | Alert-Status aktualisieren |
| GET | `/tasks` | Tasks mit Filtern |
| PATCH | `/tasks/:id` | Task-Status aktualisieren |
| GET | `/prompts` | Prompts mit Filtern |
| PATCH | `/prompts/:id/mark-used` | Prompt als verwendet markieren |
| GET | `/duplicates` | Erkannte URL-Duplikate |
| GET | `/cannibalization` | Keyword-Kannibalisierung |
| GET | `/catalog` | Seiten-Katalog |
| POST | `/catalog` | Seite hinzufügen |
| PATCH | `/catalog/:id` | Seite aktualisieren |
| GET | `/stats` | Übersichts-Statistiken |

## React Komponenten

### SEODashboard

Hauptkomponente mit 60/40 Split-View:
- Linke Seite: Briefing, Alerts, Tasks
- Rechte Seite: Prompts, Pipeline-Status, Quick Actions

### SEOBriefingCard

Zeigt tägliches Briefing mit:
- Executive Summary
- Klick/Impressionen-Highlights
- Top Gewinner/Verlierer
- Kritische Probleme
- Empfehlungen

### SEOAlertsPanel

Alert-Liste mit:
- Severity-Indikatoren
- Filterung nach Status/Severity/Scope
- Status-Updates (bestätigen, lösen, Fehlalarm)
- Verknüpfung zu Prompts

### SEOTasksPanel

Task-Management mit:
- Prioritäts-Sortierung
- Status-Tracking
- Due-Date-Anzeige
- Verknüpfung zu Alerts

### SEOPromptsPanel

Prompt-Viewer mit:
- Copy-to-Clipboard Funktion
- Syntax-Highlighting
- Akzeptanzkriterien
- Datei-Referenzen

## Hooks

```typescript
// Briefing laden
const { data: briefing } = useSEOBriefing();

// Alerts laden und filtern
const { data: alertsData } = useSEOAlerts({
  status: 'open',
  severity: 'critical'
});

// Tasks laden
const { data: tasksData } = useSEOTasks({ status: 'open' });

// Prompts laden
const { data: promptsData } = useSEOPrompts({ used: false });

// Statistiken
const { data: stats } = useSEOStats();

// Alert aktualisieren
const updateAlert = useUpdateSEOAlert();
await updateAlert.mutateAsync({
  alertId: '...',
  updates: { status: 'resolved' }
});

// Task aktualisieren
const updateTask = useUpdateSEOTask();
await updateTask.mutateAsync({
  taskId: '...',
  updates: { status: 'done' }
});

// Prompt als verwendet markieren
const markUsed = useMarkPromptUsed();
await markUsed.mutateAsync(promptId);

// Pipeline manuell starten
const triggerPipeline = useTriggerSEOPipeline();
await triggerPipeline.mutateAsync();
```

## PromptPacks

PromptPacks sind vorgefertigte Prompts für Claude Code, um SEO-Probleme zu beheben.

### Target Areas

| Bereich | Beschreibung |
|---------|--------------|
| `redirects` | .htaccess Redirects hinzufügen |
| `titles` | Title-Tags optimieren |
| `content` | Content verbessern/erweitern |
| `schema` | Structured Data hinzufügen |
| `internal_linking` | Interne Verlinkung verbessern |
| `new_page` | Neue Landing Page erstellen |
| `canonicalization` | Canonical-Tags setzen |
| `technical` | Technische SEO-Fixes |

### Beispiel-Prompt

```markdown
## SEO Fix: Title-Tag Optimierung

**Problem:** Die Seite /lunch-muenchen-maxvorstadt hat einen CTR-Drop
bei stabiler Position. Der aktuelle Title ist zu lang und wird abgeschnitten.

**Dateien prüfen:**
- src/pages/seo/LunchMuenchen.tsx
- src/components/SEO.tsx

**Akzeptanzkriterien:**
- [ ] Title unter 60 Zeichen
- [ ] Haupt-Keyword am Anfang
- [ ] Call-to-Action enthalten
- [ ] Meta-Description aktualisiert

**Anweisungen:**
1. Öffne src/pages/seo/LunchMuenchen.tsx
2. Finde die SEO-Komponente
3. Ändere den Title zu: "Lunch in Maxvorstadt | STORIA München"
4. Aktualisiere die Meta-Description
5. Teste mit npm run build
```

## Deployment

### Voraussetzungen

1. Supabase-Projekt mit aktivierten Edge Functions
2. GSC-Monitoring bereits eingerichtet
3. Admin-Rolle für RLS-Policies

### Schritte

1. **Migration anwenden:**
   ```bash
   supabase db push
   ```

2. **Edge Functions deployen:**
   ```bash
   supabase functions deploy seo-api
   supabase functions deploy seo-pipeline
   ```

3. **Cron-Job einrichten (Supabase Dashboard):**
   - Name: `seo-daily-pipeline`
   - Schedule: `15 6 * * *` (06:15 UTC, nach GSC-Sync)
   - Function: `seo-pipeline`
   - HTTP: POST mit CRON_SECRET Header

4. **Seiten-Katalog befüllen:**
   - Über Admin-Dashboard oder
   - Direkt in Supabase: `seo_page_catalog`

## Workflow

### Täglicher SEO-Workflow

1. **Morgens (automatisch):**
   - 06:00: GSC-Sync holt neue Daten
   - 06:15: SEO-Pipeline analysiert Daten
   - Alerts, Tasks, Prompts werden generiert

2. **Bei Bedarf (manuell):**
   - Admin öffnet `/admin/seo`
   - Prüft Daily Briefing
   - Bearbeitet kritische Alerts
   - Kopiert Prompts in Claude Code
   - Markiert erledigte Tasks

### Alert-Bearbeitung

1. **Alert prüfen:** Details und Evidenz ansehen
2. **Entscheiden:**
   - **Bestätigen:** Problem erkannt, wird bearbeitet
   - **Fehlalarm:** Kein echtes Problem
   - **Lösen:** Problem wurde behoben
3. **Prompt kopieren:** Falls vorhanden, in Claude Code einfügen
4. **Fix implementieren:** Claude Code führt Änderungen durch
5. **Verifizieren:** Build testen, deployen

## Monitoring

### Wichtige Metriken

- **Offene Alerts:** Sollte nicht >10 sein
- **Kritische Alerts:** Sollte 0 sein
- **Offene Tasks:** Backlog-Größe
- **Unbenutzte Prompts:** Noch umzusetzende Fixes

### Dashboard-Widgets

- Stats-Karten zeigen aktuelle Zahlen
- Pipeline-Status zeigt letzten Run
- Briefing fasst Situation zusammen

## Fehlerbehebung

### Pipeline läuft nicht

1. Prüfen: Edge Function Logs in Supabase
2. Prüfen: Cron-Job korrekt konfiguriert?
3. Prüfen: GSC-Daten vorhanden?

### Keine Alerts generiert

1. Prüfen: Alert-Regeln aktiv (`is_active = true`)?
2. Prüfen: Schwellenwerte anpassen?
3. Prüfen: Genug Daten für Baselines?

### Prompts fehlen

1. Prüfen: Task mit Alert verknüpft?
2. Prüfen: Prompt-Generierung in Pipeline aktiv?
3. Prüfen: `seo_prompt_pack` Tabelle

## Erweiterungen

### Neue Alert-Regel hinzufügen

1. SQL in `seo_alert_rule` einfügen
2. Regel-Logik in `seo-pipeline/index.ts` implementieren
3. Prompt-Template in Pipeline hinzufügen

### Neuen Seitentyp hinzufügen

1. ENUM in Migration erweitern
2. Severity-Boost in `boost_severity()` anpassen
3. Page-Catalog aktualisieren

---

**Letzte Aktualisierung:** 2026-02-06
