## Ziel

Die Filmfest-München-Seite so umbauen, dass **alle Inhalte im Quelltext** stehen (statisches HTML) und die Seite nach **SEO- und GEO-Best-Practices** (laut `docs/geo-content-guidelines.md`) optimiert ist.

## Kernbefund (Ursache)

Die Seite rendert zur Laufzeit (Slug liegt in `src/translations/de.ts`), wird aber **nicht prerendert**. Grund: `prerender.js` und `scripts/generate-sitemap.mjs` lesen ihre Routen aus `src/config/slugs.json` — und dort fehlt `filmfest-muenchen` komplett. Dadurch existiert kein statisches `dist/filmfest-muenchen/index.html`; Crawler/KI-Bots ohne JS sehen keinen Inhalt. Das ist der eigentliche Hebel für die Anforderung „alles im Quelltext".

Die Komponente selbst ist bereits SSR-sicher (`Reveal` hält Inhalte immer im DOM, kein `React.lazy`), es fehlt also nur die Registrierung im Prerender-/Sitemap-Pfad plus inhaltliche GEO/SEO-Tiefe.

## Schritt 1 — Prerendering aktivieren (Quelltext-Inhalt)

1. **`src/config/slugs.json`**: Eintrag `"filmfest-muenchen": "filmfest-muenchen"` nur im `de`-Block ergänzen (Seite ist DE-only, daher kein en/it/fr-Eintrag → Prerender erzeugt nur die DE-Route).
2. **`scripts/generate-sitemap.mjs`**: `"filmfest-muenchen"` zur `LEGAL_ONLY_DE`-Liste hinzufügen. So wird nur die deutsche URL ohne hreflang emittiert (verhindert kaputte URLs durch fehlende Übersetzungsslugs) — konsistent zur bereits vorhandenen `LEGAL_ONLY_DE`-Eintragung in `App.tsx`.
3. Verifizieren: Build + Prerender laufen lassen und prüfen, dass `dist/filmfest-muenchen/index.html` echten Inhalt enthält (kein „Laden…"), inkl. `<title>`, Meta-Description, JSON-LD.

## Schritt 2 — GEO-Optimierung (Inhalt im Quelltext, KI-Zitierbarkeit)

Bearbeitung in `src/pages/seo/FilmfestMuenchen.tsx` — alle neuen Inhalte bleiben statisch im DOM (kein client-only Rendering):

1. **Definition-Lead** (GEO Regel 1): Einen knappen, eigenständigen Einleitungs-Absatz direkt unter H1 bzw. als erste Section ergänzen nach Muster „Das Ristorante STORIA ist ein familiengeführtes italienisches Restaurant in der Karlstraße 47a, München Maxvorstadt, sechs Gehminuten vom Festivalzentrum Amerikahaus — Eventlocation für Premierendinner und Branchenempfänge während des Filmfest München 2026 (26. Juni – 5. Juli)."
2. **FAQ-Sektion** (GEO Regel 5, Pflicht): Neue sichtbare Sektion mit 5–6 eigenständig lesbaren Q&As, z. B.:
   - „Wo finde ich eine Eventlocation in der Nähe des Filmfest-Festivalzentrums?"
   - „Welche Veranstaltungsformate richtet das STORIA während des Filmfest München aus?"
   - „Für wie viele Gäste ist das STORIA geeignet?"
   - „Bietet das STORIA Catering für Cast-&-Crew-Dinner an?"
   - „Wie kurzfristig kann ich einen Termin im Festivalzeitraum anfragen?"
   - „Wann findet das Filmfest München 2026 statt?"
   Jede Antwort nennt die Entity explizit und enthält konkrete Zahlen.
3. **FAQPage-Schema**: `<StructuredData faqItems={...} />` mit denselben Q&As (Komponente unterstützt das bereits).
4. **FoodEvent-Schema**: `<StructuredData type="event" eventData={...} />` für „Filmfest München 2026" (startDate 2026-06-26, endDate 2026-07-05) — passt zum Schema-Typ „Event-Seiten" der GEO-Guidelines.
5. **Externe autoritative Citation** (GEO Regel 3): mindestens einen Outbound-Link auf eine autoritative Quelle einbauen (offizielle Festivalseite `filmfest-muenchen.de`), mit `rel="noopener noreferrer"` — im Disclaimer/FAQ-Kontext, da bereits ein neutraler Hinweis zur fehlenden offiziellen Verbindung existiert.
6. **Statistiken** sind bereits ausreichend vorhanden (6 Min., bis 180 Gäste, seit 2015, 4,5★/780+) — beibehalten und in FAQ-Antworten wiederverwenden.

## Schritt 3 — SEO-Feinschliff

- `<title>` (~ aktuell knapp über 60 Zeichen) auf < 60 Zeichen straffen, Meta-Description < 160 Zeichen prüfen/kürzen.
- Genau ein H1 (vorhanden), saubere H2/H3-Hierarchie (FAQ-Fragen als H3 unter einer FAQ-H2) — kein Heading-Skipping.
- `dateModified` ist im Restaurant-Schema bereits dynamisch gesetzt — bleibt.
- Canonical `/filmfest-muenchen` + `noHreflang` (DE-only) bleiben.

## Schritt 4 — Verifikation

- Production-Build + Prerender ausführen.
- `dist/filmfest-muenchen/index.html` prüfen: enthält Hero-Text, Formate, Lage, Räume, Catering, **FAQ-Text** und JSON-LD (`FAQPage`, `FoodEvent`, `Restaurant`, `BreadcrumbList`) — alles ohne „Laden…".
- Sitemap-Generierung prüfen: `/filmfest-muenchen/` ist als DE-only-Eintrag enthalten.

## Technische Notizen

- Zwei getrennte Slug-Quellen existieren: `translations/de.ts` (Laufzeit-Routing, hat den Slug) und `src/config/slugs.json` (Prerender + Sitemap + hreflang, fehlt der Slug). Diese Diskrepanz ist die Ursache und wird in Schritt 1 behoben.
- `slugs.json` wird nicht automatisch generiert (kein Generator gefunden) → manuelle Ergänzung ist sicher.
- Keine Übersetzungsdateien nötig (DE-only Seite, hartkodierter deutscher Text).
- `StructuredData` rendert `faqItems`/`eventData` unabhängig vom `type`-Guard, daher genügen zusätzliche `<StructuredData>`-Instanzen.
