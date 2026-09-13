# KONZEPT — GEO/SEO-Lücken Weihnachtsfeier + Valentinstag

Datenbasierter Plan, entstanden aus einem GSC/GA4-Audit (13.09.2026) nach Abschluss des
Saisonseiten-Ausbaus (Silvester/Weihnachten). Vollständige Herleitung, Zahlen und Quellen im
approved Plan: `~/.claude/plans/die-silvester-seite-https-www-ristorante-encapsulated-firefly.md`
(dort nicht duplizieren — dieses Dokument fasst nur zusammen, was umzusetzen ist).

## Datenbasis (Zusammenfassung)

- Lokaler GSC-Export: 11.06.–10.09.2026
- GSC-Live-API (Composio): 11.06.–10.09.2026 · 01.10.–31.12.2025 · 15.01.–01.03.2026
- GA4 (Property 515836390): 01.03.–12.09.2026
- **Kein Vorjahresvergleich möglich** — beide Zielseiten existierten in ihrer jeweils letzten
  Saison noch nicht. Nov/Dez 2026 und Feb 2027 sind ihre jeweils erste echte Saison.

## Kernbefunde

1. **Weihnachts-B2B-Cluster kannibalisiert sich query-belegt:** ~57 % der Cluster-Impressionen
   gehen an `/firmenfeier-muenchen/` statt an `/weihnachtsfeier-muenchen/`. Bei
   „firmenweihnachtsfeier münchen" (109 Impr., Pos. 52) rankt ausschließlich Firmenfeier.
2. **Valentinstag: 1.100 Impr., 0 Klicks, CTR 0,00 %**, kandidiert bei drei Romantik-Queries
   gegen die eigene, deutlich stärkere Seite `/romantisches-dinner-muenchen/`.
3. **404 bei Position 5,5:** `/besondere-anlaesse/candlelight-menue/` rankt, liefert aber 404.
   Zusätzlich 2-Hop-Redirect-Kette bei `/besondere-anlaesse/weihnachtsmenues`.
4. **GEO-Lücken** auf beiden Seiten gegen `docs/geo-content-guidelines.md`: kein Definition-Lead,
   `tldr` ungenutzt, kein Outbound-Link, kein „Auf einen Blick", Valentinstag zusätzlich `Event`
   statt `FoodEvent` mit kaputter `image`-URL.
5. **facts.ts-Abdeckung lückenhaft:** Valentinstag nutzt `facts.ts` gar nicht (Preise 4× hart
   kodiert), Weihnachtsfeier nur teilweise (`FACTS.capacity.*` vorhanden, aber ungenutzt).

## Entscheidungen (Antoine, 13.09.2026)

- **Weihnachts-B2B-Cluster:** `weihnachtsfeier-muenchen` gewinnt. `firmenfeier-muenchen` gibt
  Weihnachtsbegriffe ab und verlinkt saisonal dorthin.
- **Valentinstag:** bleibt eigenständig, wird auf reine Valentins-Intention zugespitzt und gibt
  Romantik-Generika an `romantisches-dinner-muenchen` ab.

## Einheiten

- **V1** — Sofortfixes: 404-Redirect, Redirect-Kette
- **V2** — Weihnachtsfeier gewinnt den B2B-Cluster (Begriffs-Transfer, GEO, facts.ts)
- **V3** — Valentinstag schärfen (Romantik-Generika abgeben, Conversion ergänzen, GEO, FoodEvent-Fix)
- **V4** — Baseline in `docs/seo-log.md` einfrieren, Review-Termine setzen

Details, Zahlen, Dateien je Einheit: siehe Plan-Datei (oben verlinkt) und `docs/LOOP-GEO-LUECKEN.md`.

## Offene Fragen (blockieren Teilschritte, siehe LOOP-Dokument § BLOCKED-Log)

| Offen | Wofür |
|---|---|
| Valentinstag-Preise 55 € / 85 € — noch aktuell? | Faktenbestätigung, SSoT-Migration kann trotzdem vorbereitet werden |
| Gibt es am 14.02. à la carte, oder nur Menü? | V3.3 (OpenTable-Reservierungsstrecke) |
| Weihnachtsfeier „ab 45 €" — betrieblich bestätigt? | Bereits als offene Randfrage in `facts.ts` dokumentiert, nicht neu |

## Nicht in diesem Konzept

Konsolidierung von `weihnachtsfeier-muenchen`/`valentinstag-muenchen` per 301 (beide bleiben
eigenständig) · sprachabhängiges JSON-LD · Listicle-Outreach · Umbau weiterer Landingpages
(`geburtstagsfeier`, `hochzeitsfeier`, `eventlocation`) — keine Datenevidenz für akuten Bedarf.
