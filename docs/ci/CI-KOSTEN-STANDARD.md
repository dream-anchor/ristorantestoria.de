# CI-Kosten-Standard

**Lies diese Datei, BEVOR du einen Workflow unter `.github/workflows/` anfasst.**

Anlass: der GitHub-Usage-Report 01.–11.08.2026 wies dieses Repo mit 864 Minuten aus, davon
753 für `uptime-monitor.yml`. Der Audit dazu steht in `ci-audit-2026-08-12.md` (Repo-Wurzel,
bewusst nicht versioniert).

---

## Die zehn Punkte (Antoines Wortlaut, projektübergreifend für alle Repos)

> 1.  Vor jeder Optimierung messen — GitHub-Usage-Report-CSV nach Repo/Workflow
>     aggregieren, nie nach Vermutung optimieren; Vergleiche gegen vergleichbare
>     Zeiträume, nicht gegen Monatsschnitte.
> 2.  Jeder Job braucht timeout-minutes (GitHub-Default sonst 360 Min).
> 3.  concurrency mit group je Ref, cancel-in-progress für pull_request.
> 4.  Kein voller Nachlauf auf main nach Squash-Merge, wenn der Tree identisch ist:
>     push auf main fährt nur Smoke (filter + typecheck), volle Suite über
>     nächtlichen Cron.
> 5.  Jeder Job kostet ca. 1,5 Min Fixkosten (Rüstzeit + Aufrundung auf ganze
>     Minuten) — Sharding nur so weit, wie Wall-Clock es zwingend braucht.
> 6.  Doku-/Asset-Pfade per paths-ignore ausnehmen — aber nicht, wenn dadurch eine
>     Check-Zeile entfällt, auf die Loops pollen; dann stattdessen ein Filter-Job,
>     der in Sekunden durchläuft und die Zeile grün setzt.
> 7.  Cron-Monitoring (Uptime, Health, Pings) gehört NICHT in Actions, sondern zu
>     Cloudflare Health Checks o. ä.
> 8.  Self-hosted Runner nur mit Online-Check und Auto-Fallback auf ubuntu-latest
>     (offline Runner lassen Jobs bis 22 h in der Queue hängen statt zu scheitern)
>     und nie für pull_request, solange Fork-PRs möglich sind.
> 9.  Budget-Alert aktiv halten.
> 10. CI-Änderungen immer in EINEM PR, keine Fixup-Serie (jeder Push kostet einen
>     Volllauf); Check-Zeilen, auf die Loops pollen, müssen weiter entstehen und
>     grün werden.

---

## Wie dieses Repo dasteht (Stand 12.08.2026)

| # | Stand | Beleg |
|---|---|---|
| 1 | erfüllt | Zahlen aus `gh api .../runs` + `/jobs`, 14-Tage-Fenster, `ceil`-Rundung je Job |
| 2 | erfüllt | alle sieben Workflows tragen `timeout-minutes`; `upload-root-htaccess.yml` hat seinen seit 12.08.2026 |
| 3 | nicht anwendbar | **kein Workflow hat einen `pull_request`-Auslöser.** `deploy-ionos.yml` hat `concurrency: deploy-ionos` — für einen Deploy ist eine feste Gruppe richtig, nicht eine je Ref |
| 4 | nicht anwendbar | es gibt keine Testsuite und keinen PR-Lauf |
| 5 | erfüllt | kein Sharding, ein Job je Workflow |
| 6 | erfüllt | `deploy-ionos.yml` nimmt seit 12.08.2026 `**/*.md`, `docs/**` aus. Der Vorbehalt des Standardpunkts greift hier nicht: es gibt keine Check-Zeile, auf die etwas pollt |
| 7 | **verletzt, Umzug vorbereitet** | `uptime-monitor.yml` läuft weiter — **bis der Ersatz nachweislich alarmiert.** Siehe unten |
| 8 | nicht anwendbar | 0 self-hosted Runner. **Achtung:** das Repo ist öffentlich mit `allow_forking: true` — käme je einer dazu, wäre er sofort über Fork-PRs erreichbar |
| 9 | Konto-Ebene | nicht aus dem Repo prüfbar; der Billing-Endpunkt braucht den `user`-Scope |
| 10 | erfüllt | alle Änderungen dieses Audits in einem PR |

**Wichtig für jede Kostenrechnung in diesem Repo:** es ist **öffentlich**
(`private: false`, geprüft 12.08.2026), und alle Jobs laufen auf Standard-Runnern. GitHub
rechnet Actions-Minuten in öffentlichen Repos auf Standard-Runnern **nicht** ab. Die Minuten
des Usage-Reports sind hier sehr wahrscheinlich eine Mengenangabe ohne Kostenwirkung — wer
hier „spart", spart Rauschen, nicht Geld. **Der Grund, hier trotzdem aufzuräumen, ist die
Verlässlichkeit der Melder, nicht die Rechnung.**

---

## Der Alarmkanal ist Discord

Korrigiert am 12.08.2026 in allen vier alarmierenden Workflows (`uptime-monitor`,
`deploy-ionos`, `fetch-reviews`, `sync-gbp-menu`). **Vorher ging jeder Alarm nach Telegram —
ein Kanal, der nicht mehr gelesen wird.** Ein Melder, der in einen toten Kanal meldet, ist
schlimmer als keiner: er erzeugt das Gefühl, überwacht zu sein.

Benötigtes Secret: **`DISCORD_WEBHOOK_URL`**. Fehlt es, wird der Alarmschritt **laut rot**
(`::error::` + `exit 1`) statt still zu verpuffen.

```bash
gh secret set DISCORD_WEBHOOK_URL --repo dream-anchor/ristorantestoria.de
```

---

## Punkt 7: der Umzug des Uptime-Monitors

### Warum Actions dafür der falsche Ort ist — gemessen, nicht behauptet

`uptime-monitor.yml` ist auf **alle 30 Minuten** eingestellt. Gemessen an 100 `schedule`-Läufen
vom 08.–12.08.2026:

```
Abstände: min 26 Min | Median 55 Min | max 137 Min
39 von 99 Abständen liegen über 60 Minuten
```

GitHub-Actions-Zeitpläne sind ausdrücklich „best effort". **Ein Uptime-Monitor mit Lücken bis
137 Minuten überwacht nichts** — er bemerkt einen zweistündigen Ausfall unter Umständen gar
nicht. Dasselbe Argument hat in `maestro-cloud` am 07.08.2026 dazu geführt, die Sweeps von
Actions auf Cloudflare-Cron umzustellen (dort gemessen: konfiguriert stündlich, tatsächlich im
Mittel 2 h 29).

### Was der Monitor prüft (und damit die Messlatte für den Ersatz)

Ausschließlich den **HTTP-Statuscode** der Startseite von sieben Adressen; Erfolg = 200–399.
Kein Inhaltsvergleich, keine Zertifikatsprüfung, keine einzelnen Endpunkte, keine
Antwortzeit-Schwelle. Bei Fehlschlag einmal 3 Minuten warten und erneut prüfen.
**Jeder Uptime-Dienst kann mehr als das** — der Ersatz ist keine Kompromisslösung.

### Cloudflare Health Checks: geprüft und verworfen

Zwei der sieben Adressen (`ristorantestoria.de`, `events-storia.de`) liegen bei **IONOS**, nicht
bei Cloudflare — dafür lassen sich keine Cloudflare-Health-Checks anlegen. Eigenständige Health
Checks sind zudem nicht Teil des kostenlosen Tarifs. **Kein 1:1-Ersatz, nur eine Teilmenge.**

### UptimeRobot: der gewählte Weg (Tarif am 12.08.2026 verifiziert)

| | UptimeRobot Free | Better Stack Free |
|---|---|---|
| Monitore | **50** | 10 |
| Intervall | **5 Minuten** | nicht ausgewiesen |
| Discord | **enthalten** (eine der 5 Integrationen) | **nicht** aufgeführt |
| E-Mail | enthalten | enthalten |

Better Stack führt auf der Preisseite für den kostenlosen Tarif nur „Slack & e-mail alerts" —
damit fällt es für die Discord-Anforderung aus. UptimeRobot deckt mit 7 von 50 Monitoren und
5-Minuten-Intervall alles ab, was hier gebraucht wird, und prüft von mehreren Standorten aus
(das behebt zugleich den Runner-Artefakt-Fehlalarm, siehe unten).

### Was beim Anlegen einzutragen ist

**Diese sieben Adressen**, Typ jeweils HTTP(s), Intervall **5 Minuten**:

```
https://www.ristorantestoria.de/
https://events-storia.de/
https://www.paterbrown.com/
https://www.franzmeiller.com/
https://www.stefaniesick.com/
https://www.trauworte.com/
https://schrittmacher.ai/
```

**Alarmkanäle:** Discord-Webhook (derselbe wie `DISCORD_WEBHOOK_URL`) **plus E-Mail als
Rückfall**. Zwei Kanäle, weil ein Webhook stillschweigend ablaufen kann.

**Nicht eintragen:** `https://www.schrittmacher.ai/` — dieser Host ist nicht eingerichtet und
antwortet dauerhaft mit HTTP 530. Richtig ist `https://schrittmacher.ai/` (geprüft: 200).

### Die Abschaltbedingung — nicht verhandelbar

`uptime-monitor.yml` bleibt in Betrieb, **bis der Ersatz nachweislich alarmiert hat**. Nachweis =
ein Discord-Alarm von UptimeRobot ist tatsächlich angekommen (Testmonitor auf eine garantiert
tote Adresse genügt). Erst danach wird die Datei entfernt. Ein blinder Monitor ist teurer als
die gesparten Minuten.

---

## Zwei Fehlalarme, die vorher weg mussten

Von den letzten **40 Läufen nahmen 40 den Retry-Pfad** — der Monitor meldete bei praktisch jedem
Lauf einen Ausfall. Keiner davon war einer:

| Adresse | Monitor | von außen geprüft (12.08.2026) |
|---|---|---|
| `www.schrittmacher.ai` | HTTP 530 | 530 — aber `schrittmacher.ai` = 200, `storia.schrittmacher.ai` = 200. **Falsche Adresse in der Liste** |
| `www.franzmeiller.com` | HTTP 000 (Verbindung scheitert) | **HTTP 200 in 0,15 s.** Runner-seitiges Netzproblem, kein Ausfall. Ursache nicht geklärt — behoben wird das endgültig durch die Prüfung von mehreren Standorten |

Gegenmaßnahmen im Workflow: Adresse korrigiert, `--max-time` 15 → 30, `--retry 2`, und der
Fehler `|| echo 000` entfernt (er hängte ein zweites „000" an, daher „HTTP 000000" in den Logs).

---

## Pausierte und gedrosselte Workflows

- **`sync-gbp-menu.yml` — Zeitplan abgeschaltet.** 14 von 14 Läufen scheiterten an
  `invalid_grant` (abgelaufenes Google-OAuth-Refresh-Token), also täglich ein Fehlalarm ohne
  eine einzige Synchronisierung. `workflow_dispatch` bleibt erhalten. Reaktivierung nur in der
  im Workflow beschriebenen Reihenfolge: Token erneuern → EINEN Lauf von Hand grün sehen →
  dann erst den Zeitplan einkommentieren.
- **`update-wm-fixtures.yml` — von 2× auf 1× täglich.** Es läuft kein Turnier (WM endete
  19.07.2026; 2. Bundesliga ab 07.08., DFB-Pokal 21.–24.08., Bundesliga ab 28.08.). Außerhalb
  des Turnierfensters ist das Script ohnehin ein No-Op. **Ab 20.08.2026 sind zwei Läufe wieder
  sinnvoll** — dazu genügt es, die `cron`-Zeile auf `'0 7,15 * * *'` zurückzusetzen.
