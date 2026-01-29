
# Plan: Grid-Zentrierung für unvollständige Zeilen auf allen Landingpages

## Problem
Auf Landingpages gibt es Grids mit z.B. 4 Spalten (auf Desktop), bei denen die letzte Zeile nur 3, 2 oder 1 Element enthält. Diese unvollständigen Zeilen werden standardmäßig links ausgerichtet, statt zentriert dargestellt zu werden.

## Lösung
Anstatt `grid` verwenden wir `flex flex-wrap justify-center` für alle betroffenen Grids, damit weniger Elemente automatisch zentriert werden.

## Analyse aller Landingpages und betroffener Stellen

### 1. FirmenfeierMuenchen.tsx
| Section | Grid-Klasse | Items | Betroffen |
|---------|-------------|-------|-----------|
| Event Types | `grid md:grid-cols-2 lg:grid-cols-3` | 6 Items | ✅ Perfekt (3x2) |
| Why STORIA | `grid md:grid-cols-2 lg:grid-cols-4` | 8 Items | ✅ Perfekt (4x2) |
| Packages | `grid md:grid-cols-2` | 4 Items | ✅ Perfekt (2x2) |
| Process | `grid md:grid-cols-2 lg:grid-cols-3` | 6 Items | ✅ Perfekt (3x2) |
| Testimonials | `grid md:grid-cols-2` | 4 Items | ✅ Perfekt (2x2) |
| Location | `grid md:grid-cols-2 lg:grid-cols-4` | 4 Items | ✅ Perfekt (4x1) |
| Related | `grid md:grid-cols-2 lg:grid-cols-4` | 4 Items | ✅ Perfekt (4x1) |

**Keine Änderung erforderlich**

### 2. RomantischesDinner.tsx
| Section | Grid-Klasse | Items | Betroffen |
|---------|-------------|-------|-----------|
| Why STORIA | `grid md:grid-cols-2 lg:grid-cols-3` | 6 Items | ✅ Perfekt (3x2) |
| Menus | `grid lg:grid-cols-3` | 3 Items | ✅ Perfekt (3x1) |
| Valentinstag Courses | `grid md:grid-cols-2` | 4 Items | ✅ Perfekt (2x2) |
| Occasions | `grid md:grid-cols-2 lg:grid-cols-3` | 6 Items | ✅ Perfekt (3x2) |
| Tips | `grid md:grid-cols-2 lg:grid-cols-3` | 6 Items | ✅ Perfekt (3x2) |
| Location | `grid md:grid-cols-2 lg:grid-cols-4` | 4 Items | ✅ Perfekt (4x1) |
| Related | `grid md:grid-cols-2 lg:grid-cols-4` | 4 Items | ✅ Perfekt (4x1) |

**Keine Änderung erforderlich**

### 3. GeburtstagsfeierMuenchen.tsx
| Section | Grid-Klasse | Items | Betroffen |
|---------|-------------|-------|-----------|
| Why STORIA | `grid md:grid-cols-2 lg:grid-cols-3` | 6 Items | ✅ Perfekt (3x2) |
| Packages | `grid md:grid-cols-3` | 3 Items | ✅ Perfekt (3x1) |
| Occasions | `grid md:grid-cols-2 lg:grid-cols-3` | 6 Items | ✅ Perfekt (3x2) |
| Process | `grid md:grid-cols-2 lg:grid-cols-5` | 5 Items | ⚠️ **BETROFFEN** (md: 2+2+1) |
| Related | `grid md:grid-cols-2 lg:grid-cols-4` | 4 Items | ✅ Perfekt (4x1) |

**1 Änderung erforderlich: Process Section**

### 4. EventlocationMuenchen.tsx
| Section | Grid-Klasse | Items | Betroffen |
|---------|-------------|-------|-----------|
| Event Types | `grid md:grid-cols-2 lg:grid-cols-3` | 6 Items | ✅ Perfekt (3x2) |
| Rooms | `grid md:grid-cols-3` | 3 Items | ✅ Perfekt (3x1) |
| Why STORIA | `grid md:grid-cols-2 lg:grid-cols-4` | 8 Items | ✅ Perfekt (4x2) |
| Process | `grid md:grid-cols-2 lg:grid-cols-3` | 6 Items | ✅ Perfekt (3x2) |
| Testimonials | `grid md:grid-cols-3` | 3 Items | ✅ Perfekt (3x1) |
| Location | `grid md:grid-cols-2 lg:grid-cols-4` | 4 Items | ✅ Perfekt (4x1) |
| Related | `grid md:grid-cols-2 lg:grid-cols-4` | 4 Items | ✅ Perfekt (4x1) |

**Keine Änderung erforderlich**

### 5. LunchMuenchen.tsx
| Section | Grid-Klasse | Items | Betroffen |
|---------|-------------|-------|-----------|
| Business Benefits | `grid grid-cols-2 md:grid-cols-4` | 4 Items | ✅ Perfekt (4x1) |
| Benefits | `grid grid-cols-2 md:grid-cols-4` | 4 Items | ✅ Perfekt (4x1) |
| Lunch Offers | `grid md:grid-cols-3` | 3 Items | ✅ Perfekt (3x1) |
| Cross-Sell | `grid md:grid-cols-2` | 2 Items | ✅ Perfekt (2x1) |

**Keine Änderung erforderlich**

### 6. AperitivoMuenchen.tsx
| Section | Grid-Klasse | Items | Betroffen |
|---------|-------------|-------|-----------|
| Explained | `grid md:grid-cols-2` | 4 Items | ✅ Perfekt (2x2) |
| Spritz Drinks | `grid md:grid-cols-2 lg:grid-cols-3` | 10 Items | ⚠️ **BETROFFEN** (3+3+3+1) |
| Cocktails | `grid md:grid-cols-3` | 3 Items | ✅ Perfekt (3x1) |
| Wines | `grid md:grid-cols-2 lg:grid-cols-4` | 7 Items | ⚠️ **BETROFFEN** (4+3) |
| Non-Alcoholic | `grid md:grid-cols-2 lg:grid-cols-4` | 4 Items | ✅ Perfekt (4x1) |
| Why STORIA | `grid md:grid-cols-2 lg:grid-cols-3` | 5 Items | ⚠️ **BETROFFEN** (3+2) |
| Occasions | `grid md:grid-cols-2 lg:grid-cols-3` | 6 Items | ✅ Perfekt (3x2) |
| Related | `grid md:grid-cols-2 lg:grid-cols-4` | 4 Items | ✅ Perfekt (4x1) |

**3 Änderungen erforderlich: Spritz Drinks, Wines, Why STORIA**

### 7. NeapolitanischePizza.tsx
| Section | Grid-Klasse | Items | Betroffen |
|---------|-------------|-------|-----------|
| Explained | `grid md:grid-cols-2` | 4 Items | ✅ Perfekt (2x2) |
| Pizza Highlights | `grid md:grid-cols-2` | 4 Items | ✅ Perfekt (2x2) |
| Why STORIA | `grid md:grid-cols-2 lg:grid-cols-3` | 6 Items | ✅ Perfekt (3x2) |
| Occasions | `grid md:grid-cols-2 lg:grid-cols-3` | 6 Items | ✅ Perfekt (3x2) |
| Location | `grid md:grid-cols-3` | 3 Items | ✅ Perfekt (3x1) |
| Related | `grid md:grid-cols-2 lg:grid-cols-4` | 4 Items | ✅ Perfekt (4x1) |

**Keine Änderung erforderlich**

### 8. WildEssenMuenchen.tsx
| Section | Grid-Klasse | Items | Betroffen |
|---------|-------------|-------|-----------|
| Wild Dishes | `grid md:grid-cols-2` | 4 Items | ✅ Perfekt (2x2) |
| Why STORIA Features | `grid md:grid-cols-2 lg:grid-cols-4` | 4 Items | ✅ Perfekt (4x1) |
| Season Calendar | `grid md:grid-cols-2` | 2 Items | ✅ Perfekt (2x1) |
| Wine Recommendations | `grid md:grid-cols-2 lg:grid-cols-4` | 4 Items | ✅ Perfekt (4x1) |
| Related | `grid md:grid-cols-2 lg:grid-cols-4` | 4 Items | ✅ Perfekt (4x1) |

**Keine Änderung erforderlich**

---

## Zusammenfassung der Änderungen

| Datei | Section | Aktuelle Items | Änderung |
|-------|---------|----------------|----------|
| `GeburtstagsfeierMuenchen.tsx` | Process (5 Items) | `grid md:grid-cols-2 lg:grid-cols-5` | → `flex flex-wrap justify-center` mit festen Breiten |
| `AperitivoMuenchen.tsx` | Spritz Drinks (10 Items) | `grid md:grid-cols-2 lg:grid-cols-3` | → `flex flex-wrap justify-center` |
| `AperitivoMuenchen.tsx` | Wines (7 Items) | `grid md:grid-cols-2 lg:grid-cols-4` | → `flex flex-wrap justify-center` |
| `AperitivoMuenchen.tsx` | Why Features (5 Items) | `grid md:grid-cols-2 lg:grid-cols-3` | → `flex flex-wrap justify-center` |

---

## Technische Umsetzung

Für jede betroffene Stelle ersetzen wir:

```text
grid md:grid-cols-X lg:grid-cols-Y gap-6
```

durch:

```text
flex flex-wrap justify-center gap-6
```

Und fügen feste Breiten zu den Kind-Elementen hinzu:

```text
w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]
```

(Die Werte variieren je nach gewünschter Spaltenanzahl)

---

## Änderungsliste

### Datei 1: `src/pages/seo/GeburtstagsfeierMuenchen.tsx`
**Zeile ~156-158 (Process Section)**:
- Container-Klasse von `grid md:grid-cols-2 lg:grid-cols-5 gap-6` zu `flex flex-wrap justify-center gap-6`
- Kinder bekommen `w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(20%-0.96rem)]`

### Datei 2: `src/pages/seo/AperitivoMuenchen.tsx`
**Zeile ~310 (Spritz Drinks)**:
- Container-Klasse von `grid md:grid-cols-2 lg:grid-cols-3 gap-4` zu `flex flex-wrap justify-center gap-4`
- Kinder bekommen `w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.67rem)]`

**Zeile ~347 (Wines)**:
- Container-Klasse von `grid md:grid-cols-2 lg:grid-cols-4 gap-4` zu `flex flex-wrap justify-center gap-4`
- Kinder bekommen `w-full md:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]`

**Zeile ~Occasions (5 whyFeatures)**:
- Suche nach dem Grid mit 5 `whyFeatures`
- Container-Klasse ändern und Kinder-Breiten anpassen
