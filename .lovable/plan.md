

## Problem: Lovable-Favicon statt STORIA "S" Logo

### Ursache

Im `public`-Ordner existieren **zwei Favicon-Dateien**:
- `favicon.png` – Das korrekte STORIA "S" Logo (in index.html referenziert)
- `favicon.ico` – Das alte Lovable-Icon (wird von Browsern automatisch geladen)

**Browser-Verhalten:** Viele Browser suchen automatisch nach `/favicon.ico` im Root-Verzeichnis, unabhaengig von der HTML-Konfiguration. Da diese Datei existiert, wird sie bevorzugt verwendet.

---

### Loesung

**Schritt 1: `favicon.ico` ersetzen oder loeschen**

Die Datei `public/favicon.ico` muss durch das STORIA "S" Logo ersetzt werden. Dafuer gibt es zwei Optionen:

**Option A (Empfohlen):** Neue `favicon.ico` aus dem "S" Logo generieren
- Das bestehende Logo (`favicon.png`) in ICO-Format konvertieren (z.B. via realfavicongenerator.net)
- Die neue `favicon.ico` im `public`-Ordner ablegen

**Option B:** Die alte `favicon.ico` loeschen
- Browser fallen dann auf die in index.html definierte `favicon.png` zurueck
- Weniger kompatibel mit aelteren Browsern

---

### Technische Umsetzung

```
public/
├── favicon.ico      ← ERSETZEN mit STORIA "S" Logo
├── favicon.png      ← Bereits korrekt (STORIA Logo)
├── apple-touch-icon.png
├── icon-192.png
├── icon-512.png
└── ...
```

**Nach der Aenderung:**
1. Neuen Build triggern (GitHub Actions)
2. Browser-Cache leeren (`Ctrl+Shift+R`) oder Inkognito-Modus testen

---

### Zusaetzliche Verbesserung (Optional)

Die Favicon-Konfiguration in `index.html` kann erweitert werden fuer bessere Browser-Kompatibilitaet:

```html
<!-- Explizite ICO-Referenz fuer alte Browser -->
<link rel="icon" href="/favicon.ico" sizes="48x48" />
<!-- PNG fuer moderne Browser -->
<link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
<!-- SVG fuer beste Qualitaet (falls vorhanden) -->
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
```

---

### Zusammenfassung

| Datei | Aktion |
|-------|--------|
| `public/favicon.ico` | **Ersetzen** mit STORIA "S" Logo im ICO-Format |
| `public/favicon.png` | Keine Aenderung noetig |
| `index.html` | Optional: Zusaetzliche Icon-Referenzen hinzufuegen |

### Naechster Schritt

Du musst mir das STORIA "S" Logo als ICO-Datei bereitstellen, oder ich kann die bestehende `favicon.ico` loeschen, damit der Browser auf `favicon.png` zurueckfaellt.

