
# Umfassendes Optimierungskonzept für die FAQ-Seite

## Analyse des Problems

Die FAQ-Seite verwendet aktuell kleinere Schriftgrößen und engere Abstände als vergleichbare Seiten im Projekt:

| Element | FAQ (aktuell) | Andere Seiten | Problem |
|---------|---------------|---------------|---------|
| H1 | `text-3xl md:text-4xl` | `text-4xl md:text-5xl` | Zu klein |
| H2 Kategorien | `text-2xl` | `text-2xl` | OK |
| Accordion Fragen | Standard (text-base) | - | Zu klein |
| Accordion Antworten | `text-sm` (Komponente) | `text-base` | Deutlich zu klein |
| Intro-Text | keine Größenangabe | `text-lg` | Zu klein |
| Quick Links | `p-3` mit Standard-Text | - | Zu klein |
| CTA Box | `p-6 md:p-8` | `p-8` | Etwas eng |
| Container-Padding | `py-12` | `py-16 md:py-24` | Weniger Luft |

## Optimierungsplan

### 1. Hauptüberschrift (H1) vergrößern
**Vorher:** `text-3xl md:text-4xl`
**Nachher:** `text-4xl md:text-5xl`

Damit konsistent mit Impressum, Datenschutz und anderen Hauptseiten.

---

### 2. Container-Abstände erhöhen
**Vorher:** `py-12`
**Nachher:** `py-16 md:py-20`

Mehr vertikaler Weißraum für eleganteres Erscheinungsbild.

---

### 3. Intro-Box vergrößern
**Vorher:**
```text
<div className="bg-secondary/50 p-6 rounded-lg mb-10">
  <p className="text-muted-foreground leading-relaxed">
```

**Nachher:**
```text
<div className="bg-secondary/50 p-6 md:p-8 rounded-lg mb-12">
  <p className="text-lg text-muted-foreground leading-relaxed">
```

---

### 4. Accordion-Komponente anpassen
Die AccordionContent-Komponente verwendet standardmäßig `text-sm`. Dies muss auf Seitenebene überschrieben werden:

**AccordionTrigger (Fragen):**
**Vorher:** `className="text-left font-medium hover:no-underline py-4"`
**Nachher:** `className="text-left text-base md:text-lg font-medium hover:no-underline py-5"`

**AccordionContent (Antworten):**
**Vorher:** `className="text-muted-foreground pb-4"`
**Nachher:** `className="text-base text-muted-foreground pb-5 leading-relaxed"`

---

### 5. Kategorie-Überschriften optimieren
**Vorher:** `text-2xl font-serif font-semibold mb-4 pb-2`
**Nachher:** `text-2xl md:text-3xl font-serif font-semibold mb-6 pb-3`

Mehr Abstand nach unten für bessere visuelle Trennung.

---

### 6. Accordion-Items Abstände
**Vorher:** `className="space-y-2"`
**Nachher:** `className="space-y-3"`

**AccordionItem Padding:**
**Vorher:** `className="bg-card border border-border rounded-lg px-4"`
**Nachher:** `className="bg-card border border-border rounded-lg px-5 md:px-6"`

---

### 7. CTA-Box vergrößern
**Vorher:**
```text
<div className="bg-primary/5 border border-primary/20 rounded-lg p-6 md:p-8 text-center mt-12">
  <h3 className="text-xl font-serif font-semibold mb-3">
  <p className="text-muted-foreground mb-6">
```

**Nachher:**
```text
<div className="bg-primary/5 border border-primary/20 rounded-lg p-8 md:p-10 text-center mt-16">
  <h3 className="text-xl md:text-2xl font-serif font-semibold mb-4">
  <p className="text-lg text-muted-foreground mb-8">
```

---

### 8. Quick Links optimieren
**Vorher:** `className="p-3 bg-card border..."`
**Nachher:** `className="p-4 md:p-5 bg-card border... text-base font-medium"`

Größere Touch-Targets und bessere Lesbarkeit.

---

### 9. Kategorie-Sektionen Abstände
**Vorher:** `className="mb-10"`
**Nachher:** `className="mb-12 md:mb-14"`

---

### 10. Quick Links Sektion
**Vorher:** `className="mt-12"` und `className="text-xl"`
**Nachher:** `className="mt-14 md:mt-16"` und `className="text-xl md:text-2xl"`

---

## Technische Details

### Datei: `src/pages/FAQ.tsx`

**Zeile 80 (Container):**
```tsx
// Vorher
<main className="container mx-auto px-4 py-12 flex-grow">

// Nachher
<main className="container mx-auto px-4 py-16 md:py-20 flex-grow">
```

**Zeile 97 (H1):**
```tsx
// Vorher
<h1 className="text-3xl md:text-4xl font-serif font-bold mb-4">

// Nachher
<h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
```

**Zeile 100 (Untertitel):**
```tsx
// Vorher
<p className="text-lg text-muted-foreground max-w-2xl mx-auto">

// Nachher (bereits korrekt, aber mb erhöhen)
<p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
```

**Zeile 106-109 (Intro-Box):**
```tsx
// Vorher
<div className="bg-secondary/50 p-6 rounded-lg mb-10">
  <p className="text-muted-foreground leading-relaxed">

// Nachher
<div className="bg-secondary/50 p-6 md:p-8 rounded-lg mb-12">
  <p className="text-lg text-muted-foreground leading-relaxed">
```

**Zeile 114-115 (Kategorien):**
```tsx
// Vorher
<section key={catIndex} id={category.id} className="mb-10">
  <h2 className="text-2xl font-serif font-semibold mb-4 pb-2 border-b border-border">

// Nachher
<section key={catIndex} id={category.id} className="mb-12 md:mb-14">
  <h2 className="text-2xl md:text-3xl font-serif font-semibold mb-6 pb-3 border-b border-border">
```

**Zeile 119 (Accordion Container):**
```tsx
// Vorher
<Accordion type="multiple" className="space-y-2">

// Nachher
<Accordion type="multiple" className="space-y-3">
```

**Zeile 121-124 (AccordionItem):**
```tsx
// Vorher
<AccordionItem 
  key={itemIndex} 
  value={`${category.id}-${itemIndex}`}
  className="bg-card border border-border rounded-lg px-4"

// Nachher
<AccordionItem 
  key={itemIndex} 
  value={`${category.id}-${itemIndex}`}
  className="bg-card border border-border rounded-lg px-5 md:px-6"
```

**Zeile 126 (AccordionTrigger):**
```tsx
// Vorher
<AccordionTrigger className="text-left font-medium hover:no-underline py-4">

// Nachher
<AccordionTrigger className="text-left text-base md:text-lg font-medium hover:no-underline py-5">
```

**Zeile 129 (AccordionContent):**
```tsx
// Vorher
<AccordionContent className="text-muted-foreground pb-4">

// Nachher
<AccordionContent className="text-base text-muted-foreground pb-5 leading-relaxed">
```

**Zeile 158-164 (CTA Box):**
```tsx
// Vorher
<div className="bg-primary/5 border border-primary/20 rounded-lg p-6 md:p-8 text-center mt-12">
  <h3 className="text-xl font-serif font-semibold mb-3">
  <p className="text-muted-foreground mb-6">

// Nachher
<div className="bg-primary/5 border border-primary/20 rounded-lg p-8 md:p-10 text-center mt-16">
  <h3 className="text-xl md:text-2xl font-serif font-semibold mb-4">
  <p className="text-lg text-muted-foreground mb-8">
```

**Zeile 187-191 (Quick Links Sektion):**
```tsx
// Vorher
<section className="mt-12">
  <h2 className="text-xl font-serif font-semibold mb-4">
  <nav ... className="grid grid-cols-2 md:grid-cols-3 gap-3">

// Nachher
<section className="mt-14 md:mt-16">
  <h2 className="text-xl md:text-2xl font-serif font-semibold mb-6">
  <nav ... className="grid grid-cols-2 md:grid-cols-3 gap-4">
```

**Zeile 192-230 (Quick Link Items):**
```tsx
// Vorher (alle Quick Links)
className="p-3 bg-card border border-border rounded-lg hover:border-primary transition-colors text-center"

// Nachher (alle Quick Links)
className="p-4 md:p-5 bg-card border border-border rounded-lg hover:border-primary transition-colors text-center text-base font-medium"
```

---

## Erwartetes Ergebnis

Nach der Implementierung wird die FAQ-Seite:
- Größere, besser lesbare Überschriften haben (konsistent mit anderen Seiten)
- Mehr Weißraum und visuellen Atem bieten
- Accordion-Fragen und -Antworten in lesbarer Größe darstellen
- Mobile Touch-Targets für Quick Links optimieren
- Ein professionelleres, eleganteres Erscheinungsbild aufweisen

Die Änderungen betreffen nur eine Datei: `src/pages/FAQ.tsx`
