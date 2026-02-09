# Claude Code: Senior Developer Protocol

## Project Identity & Philosophy
- **Role:** Senior Full-Stack Engineer & Systems Architect.
- **Stack:** Vite, TypeScript, React, shadcn-ui, Tailwind CSS.
- **Environment:** Local Development (VS Code + Claude Code CLI)
- **Philosophy:** Reliability > Cleverness. Autonomy > Constant Intervention.
- **Strict Rule:** ALWAYS output FULL files. Never provide snippets or placeholders.

---

## Workspace Structure
- **/apps/[name]/** - Individual web applications.
- **/scripts/** - Automation and utility scripts.
- **/.claude/agents/** - Specialized Sub-Agent definitions.
- **/.planning/** - Project-specific GSD artifacts (PROJECT.md, ROADMAP.md).
- **/docs/** - SEO strategy, keyword mapping, and documentation.

---

## Sub-Agent Strategy (Orchestration)

To preserve context and maximize "eloquence," delegate tasks to these specialized agents:

| Agent | Model | Purpose |
|-------|-------|---------|
| `architect` | sonnet | High-level design, interface definitions, structural consistency |
| `reviewer` | sonnet | Code quality, TS types, security audits (Read-only) |
| `researcher` | haiku | Fast codebase exploration, pattern discovery (Read-only) |

### Built-in Sub-Agents
- **Explore:** Use for codebase discovery and high-volume file analysis.
- **Plan:** Always invoke `/plan` for complex features before writing any code.

**Rule:** If a task produces high-volume output or requires deep analysis, use a sub-agent to keep the main conversation lean.

---

## The GSD Workflow Protocol (MANDATORY)

### 1. Planning First
No code without a spec. For non-trivial tasks:
1. **Discovery:** Explore the codebase using the `researcher` agent.
2. **Spec:** Create/Update `.planning/PROJECT.md` with requirements.
3. **Plan:** Enter `/plan` mode to design the approach and identify dependencies.
4. **Approve:** Get user approval before writing code.

### 2. Implementation Standards
- **Naming:** PascalCase for components, camelCase for functions/variables.
- **Styling:** Tailwind CSS exclusively. Prioritize `shadcn` components.
- **Types:** Strict TypeScript. No `any`. Clear separation of concerns.
- **Atomic Commits:** Structure work so it can be committed in logical units.

### 3. Execution & Verification
- Provide complete, ready-to-use files.
- Verify changes against the plan before declaring a task complete.
- Ensure no unused imports or console logs remain.

---

## Orchestration Patterns

### Planning a Feature
```
1. Use `researcher` to explore existing patterns and dependencies
2. Use `architect` to design the implementation approach
3. Implement the feature
4. Use `reviewer` to validate code quality and security
```

### Code Review Workflow
```
1. Use `reviewer` for comprehensive code analysis
2. Address critical issues first
3. Re-run `reviewer` to verify fixes
```

### Codebase Exploration
```
1. Use `researcher` for quick lookups and pattern matching
2. Escalate to `architect` for structural analysis if needed
```

---

## Development Commands
- `npm run dev` - Local development server
- `npm run build` - Production build
- `npm run lint` - Code quality check
- `/agents` - Manage and configure sub-agents

---

## Project Conventions
- Use TypeScript for all new code
- Follow existing naming conventions in the codebase
- Maintain WCAG accessibility compliance
- Keep components modular and reusable

---

## Instructions for Claude
> When a user request involves cross-module changes or deep codebase analysis, explicitly state: *"I will delegate the [Research/Review] to a sub-agent to preserve context."*

> Always prioritize the integrity of the existing architecture.

### Supabase / Lovable.dev Workflow (MANDATORY)
> Wenn eine Änderung Supabase-Daten betrifft (Titel, Slugs, Felder, Schema, RLS-Policies etc.) und Claude keinen direkten Schreibzugriff hat (RLS blockiert Anon-Key), **IMMER** einen fertigen Lovable.dev-Prompt ausgeben, den der User direkt kopieren und einfügen kann. Format: klar, präzise, mit Tabellen-/Feldnamen und exakten Werten.

---

## SEO Ground Rules (Binding)

### URL Architecture
- **Canonical Domain:** `https://www.ristorantestoria.de` (mit www)
- **Trailing Slash:** IMMER mit `/` am Ende (außer Dateien)
- **Slugs:** Definiert in `src/config/slugs.json` (4 Sprachen)
- **Parent Slugs:** Landing Pages unter `/besondere-anlaesse/[slug]/`

### Meta & Structured Data
- **Title Management:** NUR via React Helmet (kein statischer Title in index.html)
- **Canonical URLs:** Immer absolute URLs mit `https://www.ristorantestoria.de`
- **hreflang:** Alle 4 Sprachen (de, en, it, fr) + x-default → de
- **JSON-LD:** Restaurant, FAQPage (max 10), Menu, BreadcrumbList

### Content Rendering für SEO
- **Accordion/Collapse:** IMMER `forceMount` + `data-[state=closed]:hidden`
- **Dynamic Content:** SSG-prerendered, nicht client-only
- **Video:** `preload="none"` für Lazy Loading

### Pre-Render-Pflicht (MANDATORY)

**Hintergrund:** `ReactDOMServer.renderToString()` ist synchron und kann `React.lazy()` nicht auflösen. Lazy-Komponenten rendern nur den Suspense-Fallback ("Laden...") statt echtem Content. Google sieht dann keinen Inhalt.

**Regeln:**
- **KEIN `React.lazy()`** für Seiten die pre-rendered werden (alle außer Admin)
- Nur Admin-Seiten (mit schwerem Recharts) dürfen `lazy()` verwenden (werden nie pre-rendered)
- Alle anderen Seiten-Imports in `App.tsx` MÜSSEN eager imports sein (`import X from "..."`)

**Checkliste für jede neue/geänderte Seite:**
1. Route in `App.tsx` angelegt (alle 4 Sprachen über `routeComponents` + `slugs.json`)
2. Slug in `src/config/slugs.json` eingetragen (de, en, it, fr)
3. Import in `App.tsx` ist ein **eager import** (kein `lazy()`)
4. `npm run build` erfolgreich (128+ Routen, 0 Errors)
5. HTML in `dist/` enthält echten Content (kein "Laden...")
6. `<title>`, `<meta description>`, hreflang und JSON-LD vorhanden
7. Translations in allen 4 Sprachen vorhanden (de.ts, en.ts, it.ts, fr.ts)

**Verifikation nach Build:**
```bash
# Prüfe ob echte Inhalte vorhanden sind (kein "Laden...")
find dist -name "index.html" -exec grep -l "Laden\.\.\." {} \;
# Ergebnis muss leer sein!
```

### Rechtliche Seiten — Nur Deutsch (MANDATORY)

Rechtliche Seiten werden **NICHT übersetzt** und existieren nur unter der deutschen URL:
- `impressum`, `datenschutz`, `cookie-richtlinie`
- `agb-restaurant`, `agb-gutscheine`, `widerrufsbelehrung`
- `zahlungsinformationen`, `lebensmittelhinweise`, `haftungsausschluss`

**Regeln:**
- **Keine übersetzten Slugs** in `slugs.json` für EN/IT/FR
- **`noHreflang`** auf jeder Legal-Seite im `<SEO>`-Tag
- **`LEGAL_ONLY_DE`** in `routes.ts`, `App.tsx`, `generate-sitemap.mjs` — alle konsistent halten
- **`.htaccess`** Section 1i: 301-Redirects von alten übersetzten URLs auf DE-Version
- `LocalizedLink to="impressum"` zeigt immer `/impressum/` — egal welche Sprache aktiv ist
- In der Sitemap nur deutsche URLs, keine hreflang-Tags für Legal-Seiten

---

## Content Architecture (Pillar & Cluster Model)

### Pillar Pages (Hauptseiten)
| Pillar | URL | Cluster Topics |
|--------|-----|----------------|
| Besondere Anlässe | `/besondere-anlaesse/` | 6 Landing Pages |
| Speisekarte | `/speisekarte/` | Menu-Kategorien |
| Über Uns | `/ueber-uns/` | Geschichte, Team |

### Landing Page Cluster (unter /besondere-anlaesse/)
- `lunch-muenchen-maxvorstadt/` - Business Lunch
- `aperitivo-muenchen/` - After-Work
- `romantisches-dinner-muenchen/` - Date Night
- `eventlocation-muenchen-maxvorstadt/` - Firmenfeiern
- `firmenfeier-muenchen/` - Corporate Events
- `geburtstagsfeier-muenchen/` - Private Feiern
- `neapolitanische-pizza-muenchen/` - Pizza-Spezialisierung
- `wild-essen-muenchen/` - Saisonale Spezialitäten

---

## Keyword Mapping Reference

Vollständige Keyword-Strategie siehe: **`docs/seo-strategy.md`**

### Primary Keywords (Fokus)
- "italienisches restaurant münchen" (Hauptkeyword)
- "pizza münchen maxvorstadt"
- "restaurant maxvorstadt"
- "neapolitanische pizza münchen"

### Local Modifiers
- München, Maxvorstadt, Schwabing, Uni-Viertel
- "in der Nähe", "nahe Königsplatz"

---

## Local SEO Focus

### Google Business Profile
- Kategorie: Italian Restaurant (Primary)
- Sekundär: Pizza Restaurant, Wine Bar
- Fotos: Minimum 10 pro Kategorie

### NAP Konsistenz (Name, Address, Phone)
```
Ristorante STORIA
Theresienstraße 56
80333 München
+49 89 28806855
```

### Review Strategy
- Google Reviews priorisieren
- Antworten innerhalb 24h
- AggregateRating Schema erst nach Cookie-Consent-Lösung
