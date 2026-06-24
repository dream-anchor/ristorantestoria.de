## Merker (laufende Aufgabe, nicht vergessen)
Gutschein-Shop wird gerade **drüben auf events-storia.de unter `/gutschein` gebaut**. Sobald live: hier Teil B = sichtbarer Gutschein-CTA + `voucher_click`-Tracking via bereits angelegtem `VOUCHER_SHOP_URL` (`src/lib/eventsLinks.ts`). Dieser Plan hier blockiert das nicht.

---

## Schritt 1 — Bestandsaufnahme Anlass-/Saison-/Angebotsseiten

| Route | Status | Nav | Footer „Anlässe & Gruppen" | Eigenes Hero/Formular |
|---|---|---|---|---|
| `/weihnachtsfeier-muenchen` | existiert | – | ✅ | ✅ Hero + Events-Anfrage |
| `/terrasse-muenchen` | existiert (kürzlich überarbeitet) | ✅ | – | ✅ Hero + Reservieren-CTA |
| `/firmenfeier-muenchen` | existiert | – | ✅ | ✅ Hero + Anfrage |
| `/geburtstagsfeier-muenchen` | existiert | – | ✅ | ✅ Hero + Anfrage |
| `/hochzeitsfeier-muenchen` | existiert | – | ✅ | ✅ Hero + Anfrage |
| `/aperitivo-muenchen` | existiert | – | – | ✅ Hero + Reservieren |
| `/romantisches-dinner-muenchen` | existiert | – | – | ✅ Hero + Reservieren |
| `/reisegruppen` (slug `reisegruppen-muenchen`) | existiert | – | ✅ | ✅ Hero + Gruppen-Anfrage |
| `/besondere-anlaesse/*` | existiert (Pillar + dynamische Saison-Menüs) | ✅ | – | dynamisch |
| `/catering` | existiert | ✅ | – | ✅ verlinkt auf events-storia.de |
| weitere im Set | `wm-2026-public-viewing`, `filmfest`, `silvester`, `valentinstag`, `weihnachten`, `wild-essen`, div. SEO-Seiten — alle vorhanden | | teilw. | ✅ |

Footer „Anlässe & Gruppen" enthält aktuell: WM 2026, Filmfest, Reisegruppen, Firmenfeier, Geburtstagsfeier, Hochzeitsfeier, Weihnachtsfeier.

## Schritt 2 — Echte Lücken

**A) Geschenkgutschein** — Es gibt **keine** Gutschein-Verkaufsseite hier. Nur juristische Seite `/agb-gutscheine` (kein Kaufweg). Der Kaufweg entsteht gerade **drüben** unter `events-storia.de/gutschein`; `VOUCHER_SHOP_URL` ist hier schon hinterlegt. → **Lücke = nur noch der CTA-Einbau hier**, sobald der Shop live ist. Keine eigene neue Verkaufsseite hier nötig.

**B) Brunch / Wochenend-Brunch** — Existiert **nirgends** (keine Route, kein Footer, keine Translation). Echte, vollständige Lücke. Auf deine frühere Ansage hin war Brunch **zurückgestellt** — bleibt zurückgestellt, bis du es explizit freigibst.

---

## Vorschlag Seitenaufbau (erst nach Einzel-Freigabe, eine Seite nach der anderen)

### A) Geschenkgutschein-CTA hier (kein neuer Seitenbaum)
- Gutschein-Cross-Sell-Block auf `/speisekarte` und `/besondere-anlaesse` (Stil der bestehenden Inline-CTAs).
- Externer Link → `VOUCHER_SHOP_URL`, `target="_blank" rel="noopener"`.
- Tracking: `voucher_click` mit `location:'<seitenname>'`, genau einmal je CTA/Viewport.
- Optional Footer-Eintrag „Geschenkgutschein" in „Anlässe & Gruppen".
- Keine mobilen Floating-Buttons. Keine Änderung an `analytics.ts`/GA4/Consent.

### B) Brunch-Seite `/brunch-muenchen` (nur falls freigegeben)
Aufbau im Stil der bestehenden Anlass-Seiten:
- **Hero + H1:** „Brunch in München – Italienischer Wochenend-Brunch im STORIA" + Sofort-CTA „Tisch reservieren" (`reservation_click`, `location:'brunch'`).
- **Abschnitt 1 — Angebot:** TODO-Platzhalter (Wochentage/Uhrzeiten, Preis, à la carte vs. Buffet).
- **Abschnitt 2 — Highlights:** Cornetti, Eier, Antipasti, Kaffee usw. (TODO konkrete Speisen).
- **Abschnitt 3 — Ambiente/Lage:** Maxvorstadt, Terrasse-Verweis, interner Link `/terrasse-muenchen`.
- **Abschnitt 4 — Praktisches/FAQ:** Reservierung empfohlen, Gruppen, TODO.
- Interne Links zu `/speisekarte` und `/reservierung`. Abschluss-CTA „Brunch-Tisch sichern".
- **Title:** „Brunch München – Italienischer Wochenend-Brunch | STORIA" · **Meta:** „Genießen Sie italienischen Brunch in München-Maxvorstadt im STORIA. Frische Cornetti, Antipasti & Kaffee. Jetzt Tisch reservieren." (TODO Fakten bestätigen)
- Route + Slug in `slugs.json` (de/en/it/fr) + Translation-Dateien, eager import in `App.tsx`, hreflang, JSON-LD — wie bei den anderen Seiten.
- Footer-Eintrag „Brunch München" in „Anlässe & Gruppen".
- Pre-Render-Checkliste (kein `lazy()`, echter Content in `dist/`).

---

## Empfohlene Reihenfolge
1. **Jetzt nichts Neues bauen** — Gutschein-Shop drüben abwarten, dann hier nur den CTA (Lücke A) einbauen.
2. **Brunch** nur, wenn du es jetzt doch freigibst — dann als eigene Seite, einzeln.

## Nächster Schritt / offene Frage
Soll Brunch jetzt aus der Zurückstellung geholt und als `/brunch-muenchen` gebaut werden, oder bleibt es zurückgestellt und wir beschränken uns auf den Gutschein-CTA (sobald der Shop live ist)?