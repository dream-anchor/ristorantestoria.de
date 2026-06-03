# GBP Pipeline — Live-Checklist

**Live-Schaltung:** 2026-05-09  
**Bedingung:** is_dry_run=FALSE in gbp_settings

---

## Voraussetzungen (alle erfüllt)

- [x] Migrations 010+011 applied (IDs 14–19, 19 Posts total)
- [x] Migrations 012+013+014 applied (chefs.webp, gaeste-terrasse, pasta.webp deaktiviert)
- [x] 30 aktive Bilder, alle 12 Cluster ≥1 allyear-Bild
- [x] Phase 4: 9/10 ✅ (Ziel ≥9/10 erreicht)
- [x] Pool-C-Prompt gehärtet (HARDRULE 4 + HOOK-Pflicht)
- [x] Slack-Bericht funktioniert (Bilder sichtbar, Batches stabil)

---

## Erste Live-Woche (KW20 — 2026-05-11 bis 2026-05-15)

**Täglich beobachten:** Slack-Channel nach jedem Mo/Mi/Fr-Post

| Was zu prüfen | Erwartung | Aktion bei Abweichung |
|---|---|---|
| Post erscheint in Slack | ✅ mit Bild + Text | sofort an Antoine melden |
| Post erscheint auf GBP | binnen 24h sichtbar | GBP-Konsole prüfen |
| Bild-Qualität | authentisch, nicht KI | deaktivieren + ASSETS-BACKLOG.md |
| Skip-Alert in Slack | max. 1×/Woche (Pool B) | kein Eingriff nötig |
| Pool-C-HOOK-Fail | max. 1–2×/Woche | kein Eingriff (Skip-Toleranz) |

**Sofort eingreifen bei:**
- Post wird nicht publiziert (GBP-API-Fehler)
- Token abgelaufen (→ `npx tsx scripts/gbp-auth-test.ts`)
- Inhaltlich falscher Text erscheint live
- Dasselbe Bild 2× in einer Woche

---

## Rollback-Plan

```sql
-- Pause: Pipeline sofort stoppen
UPDATE gbp_settings SET is_dry_run = TRUE WHERE id = 1;

-- Sofortiger Check ob Stopp wirksam ist: nächster Cron-Lauf tut nichts
```

**Rollback-Trigger:**
- Mehr als 2 Fehler in einer Woche
- GBP-Konto meldet Policy-Verletzung
- Token-Erneuerung schlägt fehl

---

## Nach Woche 1 — Status-Bericht

- Wieviele Posts wurden live gestellt?
- Wie viele Skips/Fails?
- Pool-C-Performance (HOOK-Pass-Rate)?
- Bild-Repetition aufgetreten?
- → Entscheidung: weiter, Prompt-Adjust, oder Pool-C-Cluster-Update

---

## Post-Live-Backlog (nicht blockierend)

| Thema | Priorität | Beschreibung |
|---|---|---|
| `cilento_hintergrund` Hook-Fix | P1 | Cluster-Beispiele in DB auf München-First umschreiben |
| `chefs.webp` Ersatz | P0 | Echtes Team-Foto — Backlog für Domenico |
| `pasta.webp` Ersatz | P1 | Echtes Pasta-Foto (kein Stock/KI) |
| Phase 5 Re-Run | P2 | Nach 1 Monat Live: Forecast neu rechnen |
| Pool-B-Event nachfüllen | P2 | Nur 3 Event-Posts in Pool B |

---

## Live-Schaltung (Befehl)

```sql
UPDATE gbp_settings SET is_dry_run = FALSE WHERE id = 1;
-- Verify:
SELECT is_dry_run FROM gbp_settings WHERE id = 1;
```

Danach ersten Montag-Post (11:30 Uhr, Slot: lunch) in Slack beobachten.
