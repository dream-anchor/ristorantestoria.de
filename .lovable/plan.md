# Demo-Modus (Augen-Button) fürs Admin

Ein global umschaltbarer "Demo-/Präsentationsmodus", der alle Zahlen und Kundendaten im gesamten Admin-Bereich unkenntlich macht (Blur), während alle Funktionen voll bedienbar bleiben. Zustand wird pro Gerät gemerkt.

## Konzept (CX-Sicht)

- Ein **Augen-Icon-Button** oben rechts in jedem Admin-Header (Dashboard, GSC, SEO-Ops).
- Aktiv = "verborgen": Auge durchgestrichen (`EyeOff`), sensible Werte sind weichgezeichnet und nicht markierbar/kopierbar.
- Inaktiv = "sichtbar": normales Auge (`Eye`), alles normal.
- Visuelles Feedback: dezenter Hinweis-Streifen "Demo-Modus aktiv – sensible Daten verborgen", damit man beim Vorführen nie versehentlich denkt, es sei aus.
- Layout bleibt exakt gleich (kein Springen): nur `filter: blur()` + Platzhalter-Breite, keine Inhalte entfernt.

## Architektur

```text
DemoModeProvider (localStorage: storia-demo-mode)
        │  useDemoMode() -> { hidden, toggle }
        ├── DemoModeToggle      (Augen-Button, in allen Admin-Headern)
        ├── DemoModeBanner      (Hinweisstreifen wenn aktiv)
        └── <Redact>            (Wrapper, blurrt Kinder wenn hidden)
```

1. **`src/contexts/DemoModeContext.tsx`** – Context + Provider. Initialwert aus `localStorage` (`storia-demo-mode` = "1"/"0"), `toggle()` schreibt zurück. Hook `useDemoMode()`.

2. **Provider einhängen** – in `App.tsx` nur um die Admin-Routen (`/admin`, `/admin/gsc`, `/admin/seo`) legen, damit öffentliche Seiten unberührt und pre-rendering-sicher bleiben.

3. **`src/components/admin/DemoModeToggle.tsx`** – Icon-Button (`Eye`/`EyeOff`), Tooltip "Sensible Daten verbergen/anzeigen". Wird in den Header-Button-Gruppen platziert:
   - `Admin.tsx`: in beide Button-Reihen (Desktop + Mobile), als erster Eintrag der rechten Gruppe.
   - `AdminSEO.tsx` und `AdminGSC.tsx`: in die rechte Header-Gruppe.

4. **`src/components/admin/Redact.tsx`** – kleiner Wrapper:
   ```tsx
   const { hidden } = useDemoMode();
   return <span className={hidden ? "blur-sm select-none pointer-events-none" : ""}>{children}</span>
   ```
   Variante `block` für Karten/Tabellenzeilen.

5. **`DemoModeBanner.tsx`** – schmaler Hinweis unter dem Header, nur sichtbar wenn aktiv.

## Wo `<Redact>` angewendet wird (komplettes Admin)

- **Saisonale Vormerkungen** (`SeasonalSignupsManager.tsx`): Name, E-Mail, Telefon, Personenzahl, Anzahl-Counter.
- **Saisonale Benachrichtigungen / Empfänger** (`SeasonalNotificationsManager.tsx`, `seasonal_notification_recipients`): Empfänger-E-Mails, Zählerstände.
- **GSC-Dashboard** (`src/components/admin/gsc/*`): alle Metrik-Zahlen (Klicks, Impressionen, CTR, Position), Such-Queries (können Personennamen/Marken enthalten → ebenfalls blurren).
- **SEO-Ops-Dashboard** (`src/components/admin/seo-ops/*`): Kennzahlen, Traffic-/Score-Werte.
- **Gruppenmenüs** (`GroupMenusManager.tsx`): falls Kundenangaben/Preise enthalten → blurren.
- **Benachrichtigungs-Banner** (`AdminNotificationsBanner.tsx`): Nachrichtentext kann Kundendaten enthalten → blurren.

Speisekarten-/Menü-Verwaltung selbst bleibt sichtbar (keine personenbezogenen Daten), nur reine Preis-/Kundenzahlen werden umfasst.

## Technische Details

- Reines Frontend, keine DB-/Backend-Änderung. Daten werden weiterhin geladen (Funktionsprüfung möglich), nur visuell verdeckt.
- `blur-sm`/`blur` über Tailwind; `select-none` + `pointer-events-none` verhindert Markieren/Kopieren der verborgenen Werte.
- Persistenz via `localStorage` (pro Gerät). SSR-sicher: `typeof window` Guard im Provider, da Admin ohnehin nur clientseitig läuft.
- Kein `React.lazy`-Konflikt: Provider liegt um bereits lazy geladene Admin-Seiten.

## Hinweis zur Sicherheit

Der Blur ist eine **Präsentations-Maßnahme**, kein Zugriffsschutz – die Werte sind im DOM weiterhin vorhanden. Für reines "über die Schulter zeigen" ist das genau richtig; soll es echten Schutz vor technisch versierten Betrachtern bieten, müssten Daten serverseitig maskiert werden (größerer Umbau). Empfehlung: aktuelle Frontend-Lösung, da sie dem genannten Zweck ("System zeigen ohne Details") optimal entspricht.
