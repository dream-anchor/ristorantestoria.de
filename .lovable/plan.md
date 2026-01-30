
# Plan: GitHub Actions Deployment-Fix (Concurrency + SFTP-Optimierung)

## Problem-Analyse

Im Screenshot sind **6 Workflows gleichzeitig aktiv**. Das verursacht:
- IONOS SFTP-Server blockiert parallele Verbindungen
- Workflows warten aufeinander und erreichen nie den Server
- Keine automatische Abbruch-Logik für veraltete Deployments

## Lösung

### 1. Concurrency-Block hinzufügen
Verhindert parallele Deployments - neue Builds brechen alte ab:

```yaml
jobs:
  deploy:
    runs-on: ubuntu-latest
    concurrency:
      group: deploy-ionos
      cancel-in-progress: true
```

### 2. SFTP-Action Konfiguration optimieren

```yaml
- name: Deploy via SFTP to IONOS
  uses: SamKirkland/FTP-Deploy-Action@v4.3.5
  with:
    server: ${{ secrets.IONOS_SFTP_HOST }}
    username: ${{ secrets.IONOS_SFTP_USER }}
    password: ${{ secrets.IONOS_SFTP_PASSWORD }}
    protocol: sftp
    local-dir: ./dist/
    server-dir: ${{ secrets.IONOS_SFTP_TARGET_DIR }}/
    dangerous-clean-slate: false
    state-name: .deployment-state.json
    exclude: |
      **/.git*
      **/*.map
      .deployment-state.json
    log-level: verbose
    timeout: 120000
```

Änderungen:
- **`state-name`**: Expliziter Name für die Sync-State-Datei
- **`timeout: 120000`**: Erhöht auf 2 Minuten (IONOS kann langsam sein)
- **Exclude erweitert**: State-Datei wird nicht hochgeladen

### 3. Sofortmaßnahme: Laufende Workflows abbrechen

Du musst manuell alle "In progress" Workflows in GitHub abbrechen:
1. Gehe zu jedem gelben Workflow
2. Klicke oben rechts "Cancel workflow"
3. Warte bis alle gestoppt sind
4. Dann wird der nächste Push sauber durchlaufen

## Technische Details

### Vollständige Änderungen an `.github/workflows/deploy-ionos.yml`

```text
jobs:
  deploy:
    runs-on: ubuntu-latest
+   concurrency:
+     group: deploy-ionos
+     cancel-in-progress: true
```

Und im Deploy-Step:
```text
        timeout: 60000
+       state-name: .deployment-state.json
+   timeout-minutes: 10
```

### Warum das hilft

| Problem | Lösung |
|---------|--------|
| 6 parallele Workflows | `concurrency` bricht alte ab |
| SFTP-Verbindung blockiert | Nur 1 aktive Verbindung |
| Timeout zu kurz | 120s statt 60s |
| Kein Job-Timeout | `timeout-minutes: 10` als Fallback |

## Empfohlene Reihenfolge

1. Alle laufenden Workflows manuell abbrechen
2. Änderungen implementieren
3. Push auslösen
4. Nur ein Workflow läuft - sollte durchgehen
