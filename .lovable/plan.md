## Ausgangslage

`events-storia.de` ist ein eigenständiges Projekt mit Warenkorb + Stripe-Checkout + Supabase-Katalog. Aus dieser Session habe ich dort **nur Lesezugriff** — ich kann die Gutschein-Seite/den Artikel nicht von hier aus anlegen. Deshalb teilt sich die Umsetzung in zwei Teile:

- **Teil A** läuft im Projekt [events-storia.de](/projects/22114801-ce52-4c7e-be84-1945d60886fb) — dort gibst du den Build-Auftrag, ich setze ihn dort um.
- **Teil B** läuft hier (ristorantestoria.de) — sobald `/gutschein` drüben live ist.

---

## Teil A — Gutschein-Artikel auf events-storia.de

Route, Aufbau und Datenmodell orientieren sich an den bestehenden Catering-Artikeln (`useCateringMenus` → Cart → `/checkout` → Stripe).

**Route**
```text
/gutschein            (DE)
/en/voucher           (EN)
```

**Seitenaufbau** (analog `pages/catering/*`)
- Hero: „STORIA Geschenkgutschein – Italienischer Genuss zum Verschenken"
- Betrag wählbar: feste Stufen 25 / 50 / 75 / 100 € + optional Freibetrag
- Versandoptionen: digital (PDF per Mail) / postalisch (2,50 €) — wie in `AGBGutscheine` beschrieben
- „In den Warenkorb" → bestehender Cart → `/checkout` (Stripe ist schon eingebunden)
- Verlinkung auf bestehende `/agb-gutscheine` und `/widerrufsbelehrung`
- SEO-Tags + JSON-LD wie bei den anderen Seiten

**Artikel/Produkt-Anlage**
- Gutschein als Katalog-Item mit `category: 'voucher'` (neue Kategorie in `CartItem`)
- Cart-Logik: Gutschein wie normaler Artikel (kein Event-Paket, kein `min_order`)
- Checkout/Stripe: Gutschein-Position als reguläre Line-Item; nach Zahlung PDF-Versand bzw. Versand-Handling
- Footer/Navigation: Eintrag „Gutscheine" ergänzen

**Verifizierung drüben:** Build grün, `/gutschein` rendert, In-den-Warenkorb → Checkout funktioniert, AGB verlinkt.

---

## Teil B — Verlinkung hier (ristorantestoria.de)

Sobald `https://www.events-storia.de/gutschein` live ist:

1. **`src/lib/eventsLinks.ts`** — neuen Preset `gutschein` ergänzen, der auf `https://www.events-storia.de/gutschein` zeigt (mit `utm_source=ristorante&utm_campaign=gutschein`). Kein neuer Anfrage-Funnel, eigener fester Pfad.
2. **Gutschein-CTA platzieren** — als Cross-Sell-Link (z. B. auf der Speisekarte / besondere-Anlässe), kein eigener neuer Seitenbaum nötig, sofern du keine eigene Gutschein-Landingpage hier willst.
3. **Tracking** — Klick feuert `voucher_click` mit `location:'<seitenname>'`, genau einmal je CTA/Viewport. Keine Änderung an `analytics.ts`, GA4 oder Consent.
4. **`target="_blank" rel="noopener"`** für den externen Shop-Link, keine mobilen Floating-Buttons.

**Verifizierung hier:** `npm run build` grün, Playwright bestätigt `voucher_click` feuert genau einmal, Link öffnet `events-storia.de/gutschein`.

---

## Nicht im Scope
- Kein Stripe/Shop-Aufbau hier im Projekt (bleibt drüben).
- Keine Änderung an bestehenden Anlass-/Saison-Seiten außer dem CTA-Einbau.
- Brunch bleibt zurückgestellt.

## Nächster Schritt
Wechsle ins Projekt events-storia.de und gib dort frei „Gutschein-Artikel unter /gutschein bauen" — dann setze ich Teil A dort um. Danach erledige ich Teil B hier.