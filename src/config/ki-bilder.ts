import type { Language } from "@/contexts/language-context";

/**
 * Register aller KI-generierten und KI-bearbeiteten Bilder/Videos der Website.
 * Regel: docs/KI-BILDER-KENNZEICHNUNG.md. Jedes neue Bild wird VOR dem Einbau eingestuft;
 * steht es hier, wird es nur über <KiBild>/<KiHinweis> eingebaut (Badge + Caption + alt).
 * Schlüssel = Dateiname (ohne -600w-Variante, die zählt zum selben Bild).
 */
export type KiKategorie = "ki-generiert" | "ki-bearbeitet";

type Texte = Record<Language, string>;

export interface KiBildEintrag {
  kategorie: KiKategorie;
  caption: Texte;
  alt: Texte;
}

export const KI_BADGE: Record<KiKategorie, Texte> = {
  "ki-generiert": { de: "KI-generiert", en: "AI-generated", it: "Generato con IA", fr: "Généré par IA" },
  "ki-bearbeitet": { de: "KI-bearbeitet", en: "AI-edited", it: "Modificato con IA", fr: "Modifié par IA" },
};

export const KI_BILDER = {
  "wm-2026-fussball-uebertragung-innen-storia-muenchen.webp": {
    kategorie: "ki-bearbeitet",
    caption: {
      de: "Visualisierung: Die Leinwand für die Fußballübertragung wurde zur Veranschaulichung per KI in das Foto eingefügt.",
      en: "Visualisation: the screen for the football broadcast was added to this photo using AI for illustration purposes.",
      it: "Visualizzazione: lo schermo per la trasmissione delle partite è stato inserito nella foto con l'IA a scopo illustrativo.",
      fr: "Visualisation : l'écran pour la retransmission des matchs a été ajouté à la photo par IA à titre d'illustration.",
    },
    alt: {
      de: "Innenraum des Restaurants. Eine Leinwand für Fußballübertragungen wurde zur Veranschaulichung per KI in das Foto montiert.",
      en: "Interior of the restaurant. A screen for football broadcasts was added to the photo using AI for illustration purposes.",
      it: "Sala interna del ristorante. Uno schermo per le partite di calcio è stato inserito nella foto con l'IA a scopo illustrativo.",
      fr: "Salle intérieure du restaurant. Un écran pour les matchs de football a été intégré à la photo par IA à titre d'illustration.",
    },
  },
  // Auch public/wm-2026-public-viewing-muenchen-og.jpg (og:image, gleiche Montage) — Hinweis siehe Doku.
  "wm-2026-public-viewing-terrasse-storia-muenchen.webp": {
    kategorie: "ki-bearbeitet",
    caption: {
      de: "Visualisierung: Die Leinwand für die Fußballübertragung wurde zur Veranschaulichung per KI in das Foto der Terrasse eingefügt.",
      en: "Visualisation: the screen for the football broadcast was added to this photo of the terrace using AI for illustration purposes.",
      it: "Visualizzazione: lo schermo per la trasmissione delle partite è stato inserito con l'IA nella foto della terrazza a scopo illustrativo.",
      fr: "Visualisation : l'écran pour la retransmission des matchs a été ajouté par IA à la photo de la terrasse à titre d'illustration.",
    },
    alt: {
      de: "Überdachte Terrasse des STORIA in der Karlstraße. Eine Leinwand für Fußballübertragungen wurde zur Veranschaulichung per KI in das Foto montiert.",
      en: "Covered terrace at STORIA on Karlstraße. A screen for football broadcasts was added to the photo using AI for illustration purposes.",
      it: "Terrazza coperta dello STORIA in Karlstraße. Uno schermo per le partite di calcio è stato inserito nella foto con l'IA a scopo illustrativo.",
      fr: "Terrasse couverte du STORIA, Karlstraße. Un écran pour les matchs de football a été intégré à la photo par IA à titre d'illustration.",
    },
  },
  "tiramisu.webp": {
    kategorie: "ki-bearbeitet",
    caption: {
      de: "Echtes Foto unseres Tiramisu, die Anordnung auf der Platte wurde per KI bearbeitet.",
      en: "Real photo of our tiramisu; the arrangement on the plate was edited using AI.",
      it: "Foto reale del nostro tiramisù; la disposizione sul piatto è stata modificata con l'IA.",
      fr: "Vraie photo de notre tiramisu ; la disposition sur l'assiette a été retouchée par IA.",
    },
    alt: {
      de: "Tiramisu des STORIA München. Echtes Foto, die Anordnung auf der Platte wurde per KI bearbeitet.",
      en: "Tiramisu at STORIA Munich. Real photo, the arrangement on the plate was edited using AI.",
      it: "Tiramisù dello STORIA Monaco. Foto reale, la disposizione sul piatto è stata modificata con l'IA.",
      fr: "Tiramisu du STORIA Munich. Vraie photo, la disposition sur l'assiette a été retouchée par IA.",
    },
  },
  "neapolitan-pizza-hero.webp": {
    kategorie: "ki-generiert",
    caption: {
      de: "Symbolbild: Neapolitanische Pizza, mit KI erstellt. Kein Foto aus unserer Küche.",
      en: "Illustrative image: Neapolitan pizza, created with AI. Not a photo from our kitchen.",
      it: "Immagine illustrativa: pizza napoletana, creata con l'IA. Non è una foto della nostra cucina.",
      fr: "Image d'illustration : pizza napolitaine créée par IA. Ce n'est pas une photo de notre cuisine.",
    },
    alt: {
      de: "Neapolitanische Pizza aus dem Steinofen, KI-generiertes Symbolbild.",
      en: "Neapolitan stone-oven pizza, AI-generated illustrative image.",
      it: "Pizza napoletana dal forno a legna, immagine illustrativa generata con l'IA.",
      fr: "Pizza napolitaine au four à pierre, image d'illustration générée par IA.",
    },
  },
  "cocktails.webp": {
    kategorie: "ki-generiert",
    caption: {
      de: "Symbolbild: Cocktails, mit KI erstellt. Kein Foto unserer Bar.",
      en: "Illustrative image: cocktails, created with AI. Not a photo of our bar.",
      it: "Immagine illustrativa: cocktail, creata con l'IA. Non è una foto del nostro bar.",
      fr: "Image d'illustration : cocktails créés par IA. Ce n'est pas une photo de notre bar.",
    },
    alt: {
      de: "Cocktails und Aperitivo, KI-generiertes Symbolbild.",
      en: "Cocktails and aperitivo, AI-generated illustrative image.",
      it: "Cocktail e aperitivo, immagine illustrativa generata con l'IA.",
      fr: "Cocktails et apéritif, image d'illustration générée par IA.",
    },
  },
  "sommerfest-event.webp": {
    kategorie: "ki-generiert",
    caption: {
      de: "Symbolbild: Sommerfest mit Catering, mit KI erstellt. Kein Foto einer echten STORIA-Veranstaltung.",
      en: "Illustrative image: summer party with catering, created with AI. Not a photo of a real STORIA event.",
      it: "Immagine illustrativa: festa estiva con catering, creata con l'IA. Non è una foto di un vero evento STORIA.",
      fr: "Image d'illustration : fête d'été avec traiteur, créée par IA. Ce n'est pas une photo d'un véritable événement STORIA.",
    },
    alt: {
      de: "Sommerfest mit italienischem Catering, KI-generiertes Symbolbild.",
      en: "Summer party with Italian catering, AI-generated illustrative image.",
      it: "Festa estiva con catering italiano, immagine illustrativa generata con l'IA.",
      fr: "Fête d'été avec traiteur italien, image d'illustration générée par IA.",
    },
  },
  "pizza-burrata-steinofen-storia-muenchen.mp4": {
    kategorie: "ki-generiert",
    caption: {
      de: "Symbolvideo: Pizza mit Burrata, mit KI erstellt. Keine Aufnahme aus unserer Küche.",
      en: "Illustrative video: pizza with burrata, created with AI. Not footage from our kitchen.",
      it: "Video illustrativo: pizza con burrata, creato con l'IA. Non è una ripresa della nostra cucina.",
      fr: "Vidéo d'illustration : pizza à la burrata créée par IA. Ce n'est pas une prise de vue de notre cuisine.",
    },
    alt: {
      de: "Pizza mit Burrata, KI-generiertes Symbolvideo.",
      en: "Pizza with burrata, AI-generated illustrative video.",
      it: "Pizza con burrata, video illustrativo generato con l'IA.",
      fr: "Pizza à la burrata, vidéo d'illustration générée par IA.",
    },
  },
  // Bytegleiche Kopie, nicht eingebunden: src/assets/romantisches-dinner-hero.webp.
  "romantisches-dinner-kerzenlicht-storia-muenchen.webp": {
    kategorie: "ki-generiert",
    caption: {
      de: "Symbolbild: Tisch bei Kerzenlicht, mit KI erstellt. Kein Foto aus unserem Restaurant.",
      en: "Illustrative image: candlelit table, created with AI. Not a photo of our restaurant.",
      it: "Immagine illustrativa: tavolo a lume di candela, creata con l'IA. Non è una foto del nostro ristorante.",
      fr: "Image d'illustration : table aux chandelles créée par IA. Ce n'est pas une photo de notre restaurant.",
    },
    alt: {
      de: "Gedeckter Tisch für zwei mit Kerze, Rotwein und Rosen, KI-generiertes Symbolbild.",
      en: "Table for two with candle, red wine and roses, AI-generated illustrative image.",
      it: "Tavolo per due con candela, vino rosso e rose, immagine illustrativa generata con l'IA.",
      fr: "Table pour deux avec bougie, vin rouge et roses, image d'illustration générée par IA.",
    },
  },
  "wild-venison-hero.webp": {
    kategorie: "ki-generiert",
    caption: {
      de: "Symbolbild: Wildgericht, mit KI erstellt. Kein Foto aus unserer Küche.",
      en: "Illustrative image: game dish, created with AI. Not a photo from our kitchen.",
      it: "Immagine illustrativa: piatto di selvaggina, creata con l'IA. Non è una foto della nostra cucina.",
      fr: "Image d'illustration : plat de gibier créé par IA. Ce n'est pas une photo de notre cuisine.",
    },
    alt: {
      de: "Rehrücken mit Wurzelgemüse und Rotweinjus, KI-generiertes Symbolbild.",
      en: "Saddle of venison with root vegetables and red wine jus, AI-generated illustrative image.",
      it: "Sella di capriolo con verdure e salsa al vino rosso, immagine illustrativa generata con l'IA.",
      fr: "Selle de chevreuil, légumes racines et jus au vin rouge, image d'illustration générée par IA.",
    },
  },
  "silvester-dinner-gala-storia-muenchen.webp": {
    kategorie: "ki-generiert",
    caption: {
      de: "Symbolbild: Silvester-Dinner, mit KI erstellt. Kein Foto einer echten STORIA-Veranstaltung.",
      en: "Illustrative image: New Year's Eve dinner, created with AI. Not a photo of a real STORIA event.",
      it: "Immagine illustrativa: cena di Capodanno, creata con l'IA. Non è una foto di un vero evento STORIA.",
      fr: "Image d'illustration : dîner du Nouvel An créé par IA. Ce n'est pas une photo d'un véritable événement STORIA.",
    },
    alt: {
      de: "Festlich gedeckter Tisch mit Champagner und Partyhüten zu Silvester, KI-generiertes Symbolbild.",
      en: "Festive table with champagne and party hats for New Year's Eve, AI-generated illustrative image.",
      it: "Tavola festiva con champagne e cappellini per Capodanno, immagine illustrativa generata con l'IA.",
      fr: "Table festive avec champagne et chapeaux de fête pour le Nouvel An, image d'illustration générée par IA.",
    },
  },
  // Derzeit nicht eingebunden; beim Einbau gilt diese Kennzeichnung.
  "chefs.webp": {
    kategorie: "ki-generiert",
    caption: {
      de: "Symbolbild: Köche, mit KI erstellt. Kein Foto unseres Teams.",
      en: "Illustrative image: chefs, created with AI. Not a photo of our team.",
      it: "Immagine illustrativa: cuochi, creata con l'IA. Non è una foto del nostro team.",
      fr: "Image d'illustration : cuisiniers créés par IA. Ce n'est pas une photo de notre équipe.",
    },
    alt: {
      de: "Köche in der Küche, KI-generiertes Symbolbild.",
      en: "Chefs in the kitchen, AI-generated illustrative image.",
      it: "Cuochi in cucina, immagine illustrativa generata con l'IA.",
      fr: "Cuisiniers en cuisine, image d'illustration générée par IA.",
    },
  },
} satisfies Record<string, KiBildEintrag>;

export type KiBildDatei = keyof typeof KI_BILDER;
