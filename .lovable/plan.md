
# Plan: Italienische Übersetzung korrigieren ("al STORIA" → "in STORIA")

## Übersicht

In der italienischen Übersetzungsdatei muss die Präposition "al" vor "STORIA" durch "in" ersetzt werden. Dies ist eine rein sprachliche Korrektur, die **nur** die italienische Datei betrifft – die anderen Sprachen (DE, EN, FR) bleiben unverändert.

---

## Betroffene Datei

`src/translations/it.ts`

---

## Zu ersetzende Muster

| Suchen | Ersetzen |
|--------|----------|
| `al STORIA` | `in STORIA` |
| `Al STORIA` | `In STORIA` |
| `al ristorante STORIA` | `nel ristorante STORIA` |

---

## Betroffene Stellen (ca. 50+ Instanzen)

Die Korrekturen betreffen folgende Bereiche der Datei:

- **imageGrid** (Zeilen 15-17): Bild-Alt-Texte
- **seo.firmenfeier** (Zeilen 370-484): Firmenfeier-Landingpage
- **seo.aperitivo** (Zeilen 581-711): Aperitivo-Landingpage
- **seo.romanticDinner** (Zeilen 738-885): Romantisches Dinner
- **seo.eventlocation** (Zeilen 1075-1110): Eventlocation
- **seo.birthday** (Zeilen 1151-1183): Geburtstagsfeiern
- **seo.neapolitanPizza** (Zeilen 1211-1329): Pizza-Landingpage
- **seo.wild** (Zeilen 1386-1464): Wild-essen-Landingpage

---

## Beispiele

**Vorher:**
```
altWine: "Servizio vini al ristorante STORIA",
altPasta: "Pasta fatta in casa al STORIA Monaco",
faq3Question: "Quali eventi posso festeggiare al STORIA?",
ctaTitle: "Pianificate Ora il Vostro Evento al STORIA",
```

**Nachher:**
```
altWine: "Servizio vini nel ristorante STORIA",
altPasta: "Pasta fatta in casa in STORIA Monaco",
faq3Question: "Quali eventi posso festeggiare in STORIA?",
ctaTitle: "Pianificate Ora il Vostro Evento in STORIA",
```

---

## Technischer Ablauf

1. Öffne `src/translations/it.ts`
2. Führe globale Suche & Ersetzung durch:
   - `al STORIA` → `in STORIA`
   - `Al STORIA` → `In STORIA`
   - `al ristorante STORIA` → `nel ristorante STORIA`
   - `Al ristorante STORIA` → `Nel ristorante STORIA`
3. Keine Änderungen an `de.ts`, `en.ts` oder `fr.ts`

---

## Erwartetes Ergebnis

Alle italienischen Texte verwenden die grammatikalisch korrekte Präposition "in" (bzw. "nel" vor "ristorante") vor dem Restaurantnamen STORIA.
