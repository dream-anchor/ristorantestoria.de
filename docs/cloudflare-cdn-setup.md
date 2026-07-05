# Cloudflare CDN vor IONOS – Anleitung (TTFB-Fix)

**Problem:** Der IONOS-Server (Apache) antwortet mit **TTFB ≈ 0,88 s** (ungedrosselt gemessen)
selbst für statische HTML. Das ist der Flaschenhals hinter den PageSpeed-Werten
(FCP 5,0 s / LCP 7,1 s im gedrosselten Labortest) — **nicht** der Seiten-Code.
Caching der Assets ist bereits optimal (`immutable`, 1 Jahr); das Problem ist die
**Server-Antwortzeit der HTML-Dokumente**.

**Lösung:** Cloudflare (kostenloser Tarif) als CDN/Reverse-Proxy davorschalten. Die
HTML-Seiten werden dann aus dem Edge-Cache nahe am Nutzer ausgeliefert → **TTFB
fällt auf ~30–80 ms** → FCP/LCP brechen ein, Performance-Score steigt deutlich.

> Diese Schritte erfordern Zugriff auf (a) den **Domain-Registrar** von
> `ristorantestoria.de` (Nameserver ändern) und (b) ein **Cloudflare-Konto**.
> Reiner Infrastruktur-Task, keine Code-Änderung.

---

## 1. Cloudflare einrichten

1. Kostenloses Konto auf https://dash.cloudflare.com erstellen.
2. **„Add a site"** → `ristorantestoria.de` eingeben → Plan **Free** wählen.
3. Cloudflare scannt die bestehenden DNS-Records. **Prüfen**, dass die A-/AAAA-/CNAME-
   Einträge auf die IONOS-Server zeigen (mit denen von IONOS abgleichen). `www`
   und Root (`@`) müssen vorhanden sein; „Proxy status" auf **Proxied** (orange Wolke).

## 2. Nameserver umstellen

4. Cloudflare zeigt zwei Nameserver (z. B. `xxx.ns.cloudflare.com`).
5. Beim **Registrar** von `ristorantestoria.de` die Nameserver auf diese beiden
   ändern. (Falls die Domain bei IONOS registriert ist: IONOS-Kundenkonto →
   Domain → Nameserver → „andere Nameserver verwenden".)
6. Aktivierung dauert i. d. R. Minuten bis wenige Stunden. Cloudflare mailt bei „Active".

## 3. SSL & Grundeinstellungen

7. **SSL/TLS → Overview → „Full (strict)"** wählen (IONOS liefert ein gültiges Zertifikat).
8. **Speed → Optimization:** Brotli **an**. (Auto-Minify ist deprecated/unnötig, da
   der Build bereits minifiziert.)
9. **Caching → Configuration:** „Caching Level: Standard", „Browser Cache TTL:
   Respect Existing Headers" (unsere `immutable`-Header bleiben so erhalten).

## 4. HTML am Edge cachen (der eigentliche TTFB-Gewinn)

Unsere HTML-Dokumente senden `Cache-Control: max-age=0, must-revalidate` — Cloudflare
cacht sie deshalb standardmäßig **nicht**. Für den TTFB-Sprung eine **Cache Rule** anlegen:

10. **Caching → Cache Rules → „Create rule"**
    - **Name:** `Edge-cache HTML (SSG)`
    - **When incoming requests match:** `Hostname equals www.ristorantestoria.de`
      **AND** `URI Path does not start with /admin`
    - **Then:**
      - *Cache eligibility:* **Eligible for cache**
      - *Edge TTL:* **Override origin → z. B. 1 hour** (oder länger; Purge beim Deploy, s. u.)
      - *Browser TTL:* **Respect origin** (HTML bleibt clientseitig `must-revalidate`)
11. **Wichtig – nicht cachen:** `/admin*` (Backend) ausschließen (oben schon getan).
    Supabase/OpenTable/Analytics laufen über eigene Hosts und sind nicht betroffen.

## 5. Cache beim Deploy leeren (empfohlen)

Da HTML jetzt am Edge liegt, sehen Nutzer nach einem Deploy sonst bis zu 1 h die alte
Version. Deshalb den bestehenden GitHub-Deploy-Workflow um einen **Purge-Schritt**
ergänzen (`.github/workflows/deploy-ionos.yml`, nach dem LFTP-Upload):

```yaml
      - name: Purge Cloudflare cache
        run: |
          curl -sS -X POST \
            "https://api.cloudflare.com/client/v4/zones/${{ secrets.CF_ZONE_ID }}/purge_cache" \
            -H "Authorization: Bearer ${{ secrets.CF_API_TOKEN }}" \
            -H "Content-Type: application/json" \
            --data '{"purge_everything":true}'
```

Dafür in den **GitHub-Repo-Secrets** hinterlegen:
- `CF_ZONE_ID` — Cloudflare → Domain → Overview (rechts, „Zone ID").
- `CF_API_TOKEN` — Cloudflare → My Profile → API Tokens → Template **„Edit zone → Cache Purge"**,
  auf diese Zone beschränkt.

## 6. Verifizieren

Nach Aktivierung:

```bash
# TTFB sollte deutlich fallen; cf-cache-status sollte HIT zeigen (nach 1. Aufruf)
curl -sS -o /dev/null -w "TTFB %{time_starttransfer}s\n" https://www.ristorantestoria.de/oktoberfest-muenchen/
curl -sSI https://www.ristorantestoria.de/oktoberfest-muenchen/ | grep -i "cf-cache-status\|server\|cf-ray"
```

Erwartung: `server: cloudflare`, `cf-cache-status: HIT`, TTFB < 100 ms.
Danach **frische PageSpeed-Messung** (Mobil) — FCP/LCP sollten deutlich sinken.

---

## Hinweise / Alternativen

- **Reihenfolge:** Erst DNS/Proxy (Schritte 1–3) live und stabil, **dann** die Cache-Rule
  (Schritt 4). So lässt sich sauber testen.
- **Rollback:** Jederzeit möglich — Nameserver zurück auf IONOS stellen.
- **Alternative ohne Nameserver-Wechsel:** IONOS bietet je nach Tarif ein eigenes
  CDN-Feature; das ist einfacher, aber meist weniger wirksam als Cloudflare-Edge-Caching.
- **Kein Code-Hebel:** Solange kein CDN davor ist, ist die Server-Antwortzeit die
  Deckelung — weitere JS/CSS-Mikro-Optimierungen bewegen den Score kaum.
