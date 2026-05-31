## Ziel
Alle Steh-/Empfangskapazitäts-Angaben auf der gesamten Website und allen Landingpages auf **300 Plätze stehend** vereinheitlichen. Aktuell stehen dort uneinheitlich **180** (Steh-/Gästekapazität) und **350** (Filmfest-Stat).

Keine optischen/strukturellen Änderungen außer den genannten Zahlen/Formulierungen.

## Änderungen

### 1. Zentrale Config
`src/config/storia-entity.ts`
- `capacity.indoor.standing: 180` → `300`
- (`events.max: 300` bleibt unverändert — passt bereits)

### 2. Übersetzungen (alle 4 Sprachen)
`src/translations/de.ts`, `en.ts`, `it.ts`, `fr.ts`
- Alle `180` (Steh-/Gästekapazität: „bis 180 Gäste", „180 standing", „180 posti in piedi", „180 invités" usw.) → `300`
- Geprüft: In den Translation-Dateien sind **alle** „180" Kapazitätsangaben — keine Preise/Jahre/IDs betroffen.

### 3. Saison-FAQ
`src/config/seasonalMenus.ts`
- `180` (Stehempfang-FAQ in DE/EN/IT/FR) → `300`

### 4. AI-Kontextdatei
`public/llms-full.txt`
- `180` (Stehempfang-Angaben) → `300`

### 5. Filmfest-Seite (Landingpage)
`src/pages/seo/FilmfestMuenchen.tsx`
- Stat-Kachel: „bis 350" → „bis 300", Label angepasst auf „**Plätze stehend** · 200 Sitzplätze gesamt (Innen und außen)"
- Tabelle: „bis 180 Gäste" → „bis 300 Gäste"; „bis 200 sitzend / 180+ stehend" → „bis 200 sitzend / 300 stehend"
- Fließtext: „180 beim Stehempfang" → „300 beim Stehempfang"
- FAQ-JSON-LD: „bis zu 180 Gäste möglich" → „300"
- SEO-Description: „Bis 180 Gäste" → „Bis 300 Gäste"

### 6. „pro Bereich" / „per area" Formulierungen
Wo „180 … pro Bereich / per area / par zone / per area" steht, wird die Zahl auf 300 gesetzt **und** „pro Bereich" entfernt, damit 300 als Gesamt-Stehkapazität gelesen wird (sonst würde „300 pro Bereich" = 600 implizieren).

## Nicht anfassen
- `src/data/menu-drinks-fallback.json` — enthält eine UUID mit „4180", keine Kapazitätsangabe.
- „200 Sitzplätze", „100 Sitzplätze innen/Terrasse" — bleiben.

## Verifikation
- `npm run build` fehlerfrei (105+ Routen)
- Kein verbliebenes „180" als Kapazität: `rg "180" src/translations src/config public/llms-full.txt src/pages/seo/FilmfestMuenchen.tsx` (nur erlaubte Treffer)
- JSON-LD valide, Filmfest-Seite visuell unverändert außer den Zahlen.</content>
<summary>Alle Steh-Kapazitätsangaben (180) und die Filmfest-Stat (350) sitewide & auf allen Landingpages auf „300 Plätze stehend" vereinheitlichen.</summary>
</invoke>
