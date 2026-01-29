
# Favicon-Fix für alle Seiten

## Problem-Analyse

Die FAQ-Seite (und potenziell andere Seiten) zeigt das falsche Lovable-Favicon statt des STORIA "S" Favicons.

### Ursache
- `index.html` (Zeile 56) enthält das korrekte Favicon: `<link rel="icon" href="/favicon.png" type="image/png" />`
- Die `SEO`-Komponente (`src/components/SEO.tsx`) wird auf allen Seiten verwendet, aber enthält **keine Favicon-Tags**
- `react-helmet` kann bei clientseitigem Routing die `<head>`-Tags dynamisch überschreiben
- Wenn das Favicon nicht explizit bei jeder Seitennavigation neu gesetzt wird, kann der Browser auf gecachte oder Standard-Werte zurückfallen

### Betroffene Dateien
- `public/favicon.ico` wurde bereits früher gelöscht (siehe Memory `design/favicon-priority-fix`)
- `public/favicon.png` existiert und enthält das korrekte STORIA "S" Logo

---

## Lösung

### Änderung in `src/components/SEO.tsx`

Favicon- und Apple-Touch-Icon-Tags zur `<Helmet>`-Komponente hinzufügen. Dadurch werden diese Tags bei jeder Seitennavigation explizit gesetzt – für alle Seiten, alle Sprachen, automatisch.

**Vorher (Zeile 57-63):**
```tsx
return (
  <Helmet>
    {/* Primary Meta Tags */}
    <html lang={language} />
    <title>{fullTitle}</title>
    <meta name="description" content={metaDescription} />
    <meta name="author" content="Ristorante STORIA" />
```

**Nachher:**
```tsx
return (
  <Helmet>
    {/* Favicon - explizit setzen für alle Seiten */}
    <link rel="icon" href="/favicon.png" type="image/png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
    
    {/* Primary Meta Tags */}
    <html lang={language} />
    <title>{fullTitle}</title>
    <meta name="description" content={metaDescription} />
    <meta name="author" content="Ristorante STORIA" />
```

---

## Warum diese Lösung funktioniert

1. **Zentrale Komponente**: Die `SEO`-Komponente wird auf **allen Seiten** verwendet (Index, FAQ, Kontakt, Speisekarte, etc.)
2. **Automatisch für neue Seiten**: Jede neue Seite, die die `SEO`-Komponente nutzt, erhält automatisch das korrekte Favicon
3. **Alle Sprachen abgedeckt**: Da die SEO-Komponente sprachunabhängig ist, gilt dies für DE, EN, IT und FR
4. **react-helmet Priorität**: `Helmet`-Tags haben Vorrang vor den statischen `index.html`-Tags und werden bei jeder Navigation aktualisiert
5. **Keine Duplikate**: `react-helmet` ist intelligent genug, doppelte `<link rel="icon">` Tags zu verhindern

---

## Betroffene Seiten (alle nutzen SEO-Komponente)

- Index (Startseite)
- FAQ ← aktuell betroffen
- Speisekarte, Mittagsmenü, Getränke
- Reservierung, Kontakt
- Über Uns, Impressum, Datenschutz
- Alle SEO-Landingpages (Aperitivo, Firmenfeier, etc.)
- Alle Sprachvarianten (/en/..., /it/..., /fr/...)

---

## Änderungsumfang

| Datei | Änderung |
|-------|----------|
| `src/components/SEO.tsx` | 2 Zeilen hinzufügen (Favicon + Apple-Touch-Icon) |

**Minimale Änderung, maximale Wirkung** – eine zentrale Stelle, alle Seiten profitieren.
