
# Plan: GitHub Actions SFTP Deployment Fix

## Problem-Analyse

Der SFTP-Upload zu IONOS hängt sich auf, obwohl der Build erfolgreich durchläuft. Die Hauptursachen:

1. **Heredoc-Einrückung**: Die YAML-Einrückung wird ins lftp-Script geschrieben, was zu ungültigen Befehlen führt
2. **IONOS Connection Limits**: Shared Hosting hat strikte Verbindungslimits
3. **Keine robuste Fehlerbehandlung**: Der Workflow erkennt nicht, wenn lftp hängt

---

## Lösung: Wechsel zu dediziertem SFTP-Action

Anstatt `lftp` manuell zu konfigurieren, verwenden wir eine bewährte GitHub Action, die speziell für SFTP-Deployments entwickelt wurde.

### Änderungen an `.github/workflows/deploy-ionos.yml`

```yaml
# Ersetze den gesamten "Deploy via SFTP to IONOS" Step mit:

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
    exclude: |
      **/.git*
      **/*.map
    log-level: verbose
    timeout: 60000
```

### Vorteile dieser Lösung

| Aspekt | Vorher (lftp) | Nachher (FTP-Deploy-Action) |
|--------|---------------|----------------------------|
| Konfiguration | Komplexes Shell-Script | Einfache YAML-Parameter |
| Fehlerbehandlung | Manuell, unzuverlässig | Eingebaut, robust |
| Verbindung | Kann hängen bleiben | Automatische Timeouts |
| Debugging | Schwer nachvollziehbar | Verbose Logging |
| Maintenance | Eigener Code | Community-maintained |

---

## Alternative: lftp-Fix (falls Action nicht gewünscht)

Falls du bei `lftp` bleiben möchtest, hier die korrigierte Version:

```yaml
- name: Deploy via SFTP to IONOS
  timeout-minutes: 15
  run: |
    sudo apt-get update && sudo apt-get install -y lftp
    
    TARGET_DIR="${{ secrets.IONOS_SFTP_TARGET_DIR }}"
    
    # Sicherheits-Check
    if [[ "$TARGET_DIR" != *"ristorantestoria-de"* ]]; then
      echo "Security Stop: Target Directory looks wrong!"
      exit 1
    fi

    # Script OHNE führende Leerzeichen erstellen
    cat > /tmp/lftp_commands.txt <<'EOF'
set sftp:auto-confirm yes
set sftp:connect-program "ssh -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null"
set net:timeout 60
set net:max-retries 3
set net:reconnect-interval-base 5
set cmd:fail-exit yes
set xfer:clobber on
EOF
    
    # Dynamische Befehle anhängen
    echo "cd \"$TARGET_DIR\"" >> /tmp/lftp_commands.txt
    echo "lcd ./dist" >> /tmp/lftp_commands.txt
    echo "mirror -R --verbose --only-newer --no-perms --no-symlinks --exclude-glob .git* --exclude-glob *.map" >> /tmp/lftp_commands.txt
    echo "bye" >> /tmp/lftp_commands.txt
    
    echo "=== LFTP Script ==="
    cat /tmp/lftp_commands.txt
    
    echo "=== Starting Upload ==="
    lftp -u "$SFTP_USER,$SFTP_PASS" "sftp://$SFTP_HOST" -f /tmp/lftp_commands.txt
    
    echo "=== Upload Complete ==="
  env:
    SFTP_HOST: ${{ secrets.IONOS_SFTP_HOST }}
    SFTP_USER: ${{ secrets.IONOS_SFTP_USER }}
    SFTP_PASS: ${{ secrets.IONOS_SFTP_PASSWORD }}
```

**Wichtigste Änderung**: Das Heredoc beginnt direkt am Zeilenanfang (`<<'EOF'` ohne Einrückung), sodass keine führenden Leerzeichen in die Befehle geschrieben werden.

---

## Empfehlung

Ich empfehle **Option 1 (FTP-Deploy-Action)**, da:
- Weniger fehleranfällig
- Bessere Timeouts und Retry-Logik
- Aktiv maintained von der Community
- Einfacher zu debuggen
