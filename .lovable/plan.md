## Ziel

Den hochwertigen HTML-Entwurf „STORIA × Filmfest München 2026" in eine echte, gepflegte Seite der Website überführen — als **Hybrid**: der cineastische Look (warmes Tiefschwarz, Amber/Terrakotta) bleibt erhalten, aber die Seite wird sauber in die Site-Architektur eingebettet (globaler Footer, SEO-/Cookie-Komponenten, Pre-Render-Konformität). **Nur Deutsch.** Route: **`/filmfest-muenchen`**.

### Warum `/filmfest-muenchen`?
Konsistent mit der bestehenden SEO-Slug-Konvention (`firmenfeier-muenchen`, `aperitivo-muenchen` …), gut für lokale Suche. Zusätzlich richte ich `/filmfest` als 301-Weiterleitung dorthin ein, damit die kurze, merkbare URL ebenfalls funktioniert.

## Was ich aus dem Entwurf übernehme
- **1:1 Inhalt & Sektionsstruktur**: Hero, Stat-Leiste, Formate (6 Karten), Lage (Wegezeiten + stilisierte Karte), Räume & Kapazitäten (+ Szenario-Tabelle), Catering, Ablauf (4 Schritte), Kontakt + Anfrageformular.
- **Cineastisches Design**: dunkles Warmschwarz, Amber/Terrakotta-Akzente, Filmstreifen-Perforation, Grain-Overlay, Scroll-Reveal-Animationen (via framer-motion statt IntersectionObserver-Script).
- **Texte**: alle deutschen Texte aus dem Entwurf.

## Anpassungen für den Hybrid-Ansatz
1. **Fonts**: Statt extern geladenem Fraunces/Archivo (verstößt gegen die „keine externen Google-Fonts"-Regel) verwende ich die bereits self-hosteten Schriften der Site (Cormorant Garamond für Display, Inter für Body). Der Charakter bleibt elegant-editorial.
2. **Styling**: Scoped auf die Seite (kein Eingriff in globale Design-Tokens), umgesetzt mit Tailwind + lokalem CSS-Block für die cineastischen Spezialeffekte. Globale Tokens bleiben unverändert.
3. **Bilder**: Die Platzhalter-Slots fülle ich mit vorhandenen, authentischen STORIA-Fotos aus `src/assets` (Innenraum, Terrasse/Loggia, Event-Setups — wie auf der Firmenfeier-Seite) inkl. `srcSet`/`alt`/Lazy-Loading.
4. **Footer**: globaler `<Footer />` der Site statt eigenem Mini-Footer (Hinweis „keine offizielle Verbindung zum Festival" bleibt als kleiner Disclaimer in der Seite).
5. **SEO/Cookie/Analytics**: `<SEO>` (mit `noHreflang`, da DE-only), `<StructuredData type="restaurant" />` + Breadcrumb-Schema, automatische Einbindung in Cookie-Banner/Analytics über das App-Layout.

## Anfrageformular (echte Backend-Übermittlung)
- Eigene Komponente **`FilmfestInquiryForm`** (react-hook-form + zod), Felder wie im Entwurf: Name/Firma, E-Mail, Telefon, Wunschtermin (eingeschränkt auf 26.06.–05.07.2026), Gästezahl, Format (Premierendinner, Verleiher-/Sales-Empfang, Cast & Crew, Presse-Lunch, Networking, Exklusiv-Anmietung), Anmerkungen.
- **Versand** über die bereits etablierte Events-Anbindung (dieselbe externe Edge Function `receive-event-inquiry`, die das bestehende `EventInquiryForm` nutzt) mit `source: 'filmfest-landingpage'` und `event_type: 'filmfest'`. Das entspricht der Architektur-Vorgabe, dass Event-/Catering-Anfragen extern verarbeitet werden — kein mailto-Fallback, zuverlässige Übermittlung + Erfolg/Fehler-Toast.
- Direktkontakte (Telefon, E-Mail, Maps, events-storia.de) bleiben als zusätzliche Kontaktwege erhalten.

## Pre-Render-Konformität (MANDATORY)
- **Eager Import** in `App.tsx` (kein `lazy()`), Seite registriert wie die anderen SEO-Pages.
- Inhalt server-renderbar (statischer Content, keine client-only Daten).
- `usePrerenderReady(true)`.

## Technische Umsetzung (Dateien)

```text
src/pages/seo/FilmfestMuenchen.tsx     (neu) — die Landingpage
src/components/FilmfestInquiryForm.tsx (neu) — Anfrageformular
src/App.tsx                            — Route-Komponente + /filmfest Redirect
src/translations/{de,en,it,fr}.ts      — Slug 'filmfest-muenchen' (DE-only-Verhalten)
```

Schritte:
1. `FilmfestMuenchen.tsx` bauen: alle Sektionen aus dem Entwurf als React/Tailwind, cineastisches Styling, framer-motion-Reveals, echte Fotos, globaler Footer, SEO mit `noHreflang`.
2. `FilmfestInquiryForm.tsx` bauen und in die Kontaktsektion einsetzen.
3. Slug `"filmfest-muenchen"` in den vier Translation-Slug-Objekten ergänzen und in die `LEGAL_ONLY_DE`-Logik (DE-only, Fremdsprachen → DE-Redirect) aufnehmen.
4. In `App.tsx`: `routeComponents["filmfest-muenchen"] = FilmfestMuenchen` + eager import + DE-only-Set + `<Route path="/filmfest" element={<Navigate to="/filmfest-muenchen/" replace />} />`.
5. Verifizieren: Build/Pre-Render ok, Seite zeigt echten Content (kein „Laden…"), Formular sendet erfolgreich (Test gegen Events-Endpoint), responsive & dunkles Design sauber.

## Offene Annahmen
- Kein Eintrag in Haupt-Navigation/Sitemap der regulären Landing Pages (Kampagnenseite, organisch/Direktlink) — sag Bescheid, falls sie verlinkt werden soll.
- Telefonnummer auf der Seite: ich verwende die im Entwurf genannte **+49 89 51519696** (entspricht der STORIA-Entity-Konfiguration).
