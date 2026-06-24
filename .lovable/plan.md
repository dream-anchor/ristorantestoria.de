## Statusbericht — Anlass-/Saison-Seiten-Set

### Schritt 1 — Bestandsaufnahme (alles bereits vorhanden)

| Route | Status | Nav | Footer „Anlässe & Gruppen" | Eigenes Hero + CTA/Formular |
|---|---|---|---|---|
| `/weihnachtsfeier-muenchen` | existiert | – | ✅ | ✅ Hero + Events-Anfrage |
| `/terrasse-muenchen` | existiert | ✅ | – | ✅ Hero + Reservieren |
| `/firmenfeier-muenchen` | existiert | – | ✅ | ✅ Hero + Anfrage |
| `/geburtstagsfeier-muenchen` | existiert | – | ✅ | ✅ Hero + Anfrage |
| `/hochzeitsfeier-muenchen` | existiert | – | ✅ | ✅ Hero + Anfrage |
| `/aperitivo-muenchen` | existiert | – | – | ✅ Hero + Reservieren |
| `/romantisches-dinner-muenchen` | existiert | – | – | ✅ Hero + Reservieren |
| `/reisegruppen` | existiert | – | ✅ | ✅ Hero + Gruppen-Anfrage |
| `/besondere-anlaesse/*` | existiert (Pillar + dyn. Saison-Menüs) | ✅ | – | dynamisch |
| `/catering` | existiert | ✅ | – | ✅ → events-storia.de |

Footer „Anlässe & Gruppen" aktuell: WM 2026, Filmfest, Reisegruppen, Firmenfeier, Geburtstagsfeier, Hochzeitsfeier, Weihnachtsfeier.

### Schritt 2 — Lücken

**A) Geschenkgutschein → ERLEDIGT (kein offener Bedarf).**
Der Kaufweg liegt drüben auf `events-storia.de/gutschein/` (live). Der sichtbare Cross-Sell-CTA ist hier bereits eingebaut:
- `InlineVoucherCTA` auf `/speisekarte` und `/besondere-anlaesse`
- Externer Link über `VOUCHER_SHOP_URL` (`target="_blank" rel="noopener"`)
- Tracking `voucher_click` mit `location:'<seite>'`, genau einmal je Klick
- Übersetzungen DE/EN/IT/FR vorhanden
→ **Keine eigene Verkaufsseite hier nötig.** Einzige optionale Restarbeit: Footer-Eintrag „Geschenkgutschein" (siehe unten).

**B) Brunch / Wochenend-Brunch → ECHTE LÜCKE, weiterhin OFFEN.**
Existiert nirgends (keine Route, kein Footer-Eintrag, keine Translation). Auf deine frühere Ansage hin zurückgestellt. Bleibt zurückgestellt bis zu deiner expliziten Freigabe.

---

## Vorschläge für die offenen Punkte (erst nach Einzel-Freigabe)

### Optional A2 — Footer-Eintrag „Geschenkgutschein"
Externer Link auf `VOUCHER_SHOP_URL` in „Anlässe & Gruppen", visuell wie die anderen externen Verweise (Catering/Events) gekennzeichnet, `voucher_click` mit `location:'footer'`. Keine neue Route.

### B — Brunch-Seite `/brunch-muenchen` (nur falls freigegeben)
Aufbau im Stil der bestehenden Anlass-Seiten:
- **Hero + H1:** „Brunch in München – Italienischer Wochenend-Brunch im STORIA" + Sofort-CTA „Tisch reservieren" (`reservation_click`, `location:'brunch'`).
- **Abschnitt 1 — Angebot:** TODO (Wochentage/Uhrzeiten, Preis, à la carte vs. Buffet).
- **Abschnitt 2 — Highlights:** Cornetti, Eier, Antipasti, Kaffee (TODO konkrete Speisen).
- **Abschnitt 3 — Ambiente/Lage:** Maxvorstadt, interner Link `/terrasse-muenchen`.
- **Abschnitt 4 — Praktisches/FAQ:** Reservierung empfohlen, Gruppen (TODO).
- Interne Links zu `/speisekarte` und `/reservierung`. Abschluss-CTA „Brunch-Tisch sichern".
- **Title:** „Brunch München – Italienischer Wochenend-Brunch | STORIA"
- **Meta:** „Genießen Sie italienischen Brunch in München-Maxvorstadt im STORIA. Frische Cornetti, Antipasti & Kaffee. Jetzt Tisch reservieren." (TODO Fakten bestätigen)
- Route + Slug in `slugs.json` (de/en/it/fr) + Translation-Dateien, eager import in `App.tsx`, hreflang, JSON-LD — wie bei den anderen Seiten.
- Footer-Eintrag „Brunch München" in „Anlässe & Gruppen".
- Pre-Render-Checkliste (kein `lazy()`, echter Content in `dist/`).

### Technik-Leitplanken (beide Punkte)
- Kein Eingriff in `analytics.ts`/GA4/Consent; nur bestehendes `trackEvent`.
- Keine mobilen Floating-Buttons; eine Quelle je Key-Event pro Seite/Viewport.
- Branding/Header/Footer konsistent zu bestehenden Anlass-Seiten.

---

## Offene Frage
Gutschein (A) ist abgeschlossen. Zu entscheiden:
1. Soll Brunch jetzt aus der Zurückstellung geholt und als `/brunch-muenchen` gebaut werden — oder bleibt es zurückgestellt?
2. Soll ich den optionalen Footer-Eintrag „Geschenkgutschein" ergänzen?