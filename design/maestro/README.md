# MAESTRO — Backoffice Design-Prototyp

Vollständiger, klickbarer Design-Prototyp für das MAESTRO SaaS-Backoffice
(Gastronomie- & Catering-Betriebe). Eine einzige self-contained HTML-Datei ohne
Abhängigkeiten — `index.html` einfach im Browser öffnen.

## Enthaltene Screens

| # | Screen | Aufruf |
|---|--------|--------|
| 1 | Login (E-Mail/Passwort + Google, Inline-Validierung) | `#login` |
| 2 | Übersicht: KPI-Kacheln mit Sparklines, „Zu erledigen“, Event-Timeline, Umsatz-Chart, Anfragen-Funnel | `#dashboard` |
| 3 | Anfragen-Liste (Status-Tabs, Filter, Suche) + Detail-Drawer mit Aktivitäts-Timeline | `#anfragen` |
| 4 | Angebots-Builder: 3 Spalten, Varianten A/B/C, Positionen mit MwSt., Live-Vorschau, Versionen | `#angebote` |
| 5 | Öffentliche Angebotsseite (Kundenansicht ohne Login, Optionswahl, Annehmen) | `#public` |
| 6 | Veranstaltungen: Liste + Detailseite mit Status-Stepper, Checkliste, Zahlungen, Dokumenten | `#veranstaltungen`, `#event-detail` |
| 7 | Kalender (Monatsansicht, Status-Chips, Legende) | `#kalender` |
| 8 | Kunden: Liste + Detail mit Kennzahlen, Historie, Notizen | `#kunden`, `#kunde-detail` |
| 9 | Zahlungen: KPI-Kacheln, Liste + Detail-Drawer (Aufschlüsselung, Stripe-Referenz) | `#zahlungen` |
| 10 | Einstellungen: Betrieb, Team & Rollen, Zahlungen/Stripe, Module, Branding | `#einstellungen` |

## Prototyp-Steuerung (unten rechts)

- **Login / Kundenansicht** — die beiden Vollbild-Screens außerhalb der App-Shell
- **Daten / Laden / Leer / Fehler** — simuliert die Listen-Zustände (Skeleton, Empty-State, Error-State)
- **Mond/Sonne** — Hell-/Dunkelmodus (folgt sonst der System-Einstellung)

## Design-System

- **Farben:** warmes Off-White `#FAF7F2`, Anthrazit `#2A2521`, Akzent Terracotta `#C2410C`
  (als Token austauschbar → Branding). Semantik: Grün = bezahlt/gewonnen, Amber = offen/wartend,
  Rot = Fehler/abgelehnt, Blau = Info.
- **Typografie:** Inter/System-Sans für UI, Serif (Fraunces/Georgia-Fallback) für große Überschriften.
- **Komponenten:** Status-Pills, KPI-Kacheln, Datentabellen (Hover, Sortier-Header), Drawer,
  Status-Stepper, Checklisten, Switches, Toasts, Skeletons, Empty-/Error-States.
- **Dark Mode:** eigene Token-Ableitung (warmes Anthrazit, hellere Akzente), kein Invertieren.
- **Responsive:** unter 960px wird die Sidebar zur unteren Tab-Bar, Tabellen werden zu Karten.

Alle Farben, Radien und Schatten liegen als CSS Custom Properties in `:root` —
die Akzentfarbe ist an einer Stelle austauschbar (Mandanten-Branding).
