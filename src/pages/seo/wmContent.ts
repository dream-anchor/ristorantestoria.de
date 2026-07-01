import type { Language } from "@/contexts/LanguageContext";

/** Turnierphase: phase + zeit (Monatsnamen) werden übersetzt. */
interface TurnierText {
  phase: string;
  zeit: string;
}

interface FaqItem {
  question: string;
  answer: string;
}

export interface WmContent {
  seo: { title: string; description: string };
  nav: {
    angebot: string;
    spiele: string;
    turnier: string;
    reservieren: string;
  };
  hero: {
    eyebrow: string;
    h1: { pre: string; em: string; post: string };
    sub: string;
    ctaReserve: string;
    ctaWhatsapp: string;
  };
  angebot: {
    eyebrow: string;
    h2: string;
    items: string[];
    /** Exakte Teilzeichenkette in items, die als Link auf die Speisekarte gerendert wird. */
    menuPhrase: string;
  };
  /** Temporärer Cross-Link zur Filmfest-Seite – nur im Überschneidungszeitraum sichtbar. */
  crossFilmfest: { pre: string; anchor: string; post: string };
  /** Long-Tail-Prosa (public viewing maxvorstadt + Spieltag-Intent) – optional, derzeit nur DE. */
  longtail?: {
    eyebrow: string;
    h2: string;
    blocks: { lead: string; body: string }[];
  };
  /** Spiel-Daten (Teams, Termine, Orte) liegen in wmSpiele.ts – hier nur Rahmentexte. */
  spiele: {
    eyebrow: string;
    h2: string;
    vs: string;
    mesz: string;
    note: string;
    /** Label auf offenen K.-o.-Slot-Karten, wenn Gegner/Teams noch nicht feststehen. */
    offen: string;
  };
  turnier: {
    eyebrow: string;
    h2: string;
    items: TurnierText[];
  };
  reservieren: {
    eyebrow: string;
    h2: string;
    lead: string;
    ctaReserve: string;
    ctaWhatsapp: string;
  };
  anfahrt: {
    eyebrow: string;
    h2: string;
    lead: string;
    callLabel: string;
    callSub: string;
    whatsappLabel: string;
    whatsappSub: string;
    directionsLabel: string;
    directionsSub: string;
    restaurantLabel: string;
    restaurantSub: string;
  };
  faq: {
    eyebrow: string;
    h2: string;
    items: FaqItem[];
    disclaimer: string;
  };
}

export const wmContent: Record<Language, WmContent> = {
  de: {
    seo: {
      title: "WM 2026 Public Viewing München – alle Spiele live | STORIA",
      description:
        "Alle Spiele der WM 2026 live auf der überdachten Terrasse in der Maxvorstadt. Süditalienische Küche, Aperitivo, bei schlechtem Wetter drinnen. Tisch reservieren.",
    },
    nav: {
      angebot: "Was läuft",
      spiele: "Die größten Spiele",
      turnier: "Turnier",
      reservieren: "Tisch reservieren",
    },
    hero: {
      eyebrow: "WM 2026 · 11. Juni – 19. Juli · Maxvorstadt",
      h1: {
        pre: "WM 2026 Public Viewing in der Maxvorstadt – alle Spiele im ",
        em: "STORIA",
        post: "",
      },
      sub: "Italien ist 2026 nicht dabei, zum dritten Mal in Folge. Bei uns läuft die WM trotzdem – von der Eröffnung am 11. Juni bis zum Finale am 19. Juli. Alle Spiele, auf der überdachten Terrasse in der Karlstraße. Dazu süditalienische Küche, ein Glas Wein, ein Aperitivo. An Spieltagen wird es voll, reserviert also besser vorher.",
      ctaReserve: "Tisch reservieren →",
      ctaWhatsapp: "WhatsApp",
    },
    angebot: {
      eyebrow: "Was bei uns läuft",
      h2: "Fußball schauen, italienisch genießen.",
      items: [
        "Alle Spiele der WM 2026, von der Gruppenphase bis zum Finale.",
        "Übertragung auf der überdachten Terrasse. Bei schlechtem Wetter zeigen wir drinnen weiter.",
        "Keine Sportkneipe: süditalienische Küche, eigene Weinkarte, Aperitivo zum Anstoß.",
        "Reservierung empfohlen, gerade an den Abenden mit deutscher Beteiligung.",
      ],
      menuPhrase: "süditalienische Küche",
    },
    crossFilmfest: {
      pre: "Mehr als Fußball – vom 26. Juni bis 5. Juli läuft bei uns das ",
      anchor: "Filmfest München zeitgleich",
      post: ". Premierendinner und Branchenabende im selben Haus.",
    },
    longtail: {
      eyebrow: "Public Viewing · Maxvorstadt",
      h2: "Mitten in der Stadt, mit Tisch statt Gedränge.",
      blocks: [
        {
          lead: "Public Viewing in der Maxvorstadt.",
          body: "Mitten zwischen Königsplatz und Hauptbahnhof zeigen wir alle Spiele der WM 2026 – auf der überdachten Terrasse und drinnen. Wenige Gehminuten von Stiglmaierplatz und Theresienwiese, mit Tisch statt Gedränge. Wer das Spiel mit echter italienischer Küche statt Stadionwurst sehen will, sitzt bei uns richtig.",
        },
        {
          lead: "An den großen Spieltagen vorher reservieren.",
          body: "Wenn Deutschland, Italien oder ein Achtel- bzw. Viertelfinale läuft, ist die Terrasse schnell voll. Sichern Sie sich Ihren Tisch vorab – dann bleibt vor dem Anpfiff noch Zeit für einen Aperitivo.",
        },
      ],
    },
    spiele: {
      eyebrow: "Die größten Spiele · K.-o.-Phase",
      h2: "Von Deutschland bis zum Finale – live bei uns.",
      vs: "gegen",
      mesz: "MESZ",
      note: "Alle Zeiten in MESZ. Die Gegner der K.-o.-Spiele stehen erst nach den jeweiligen Runden fest – wir tragen sie laufend nach.",
      offen: "Gegner stehen noch nicht fest",
    },
    turnier: {
      eyebrow: "So läuft das Turnier",
      h2: "Von Mexiko-Stadt bis New Jersey.",
      items: [
        { phase: "Eröffnung", zeit: "11. Juni · 21:00" },
        { phase: "Gruppenphase", zeit: "11. – 27. Juni" },
        { phase: "Sechzehntelfinale", zeit: "28.6. – 3.7." },
        { phase: "Achtelfinale", zeit: "4. – 7. Juli" },
        { phase: "Viertelfinale", zeit: "9. – 11. Juli" },
        { phase: "Halbfinale", zeit: "14. / 15. Juli" },
        { phase: "Finale", zeit: "19. Juli · 21:00" },
      ],
    },
    reservieren: {
      eyebrow: "Platz sichern",
      h2: "Reservieren",
      lead: "An Spieltagen sind die Tische schnell vergeben, bei den deutschen Spielen besonders. Sichert euch euren Platz auf der Terrasse oder drinnen – eine kurze Reservierung genügt.",
      ctaReserve: "Tisch reservieren →",
      ctaWhatsapp: "WhatsApp",
    },
    anfahrt: {
      eyebrow: "Anfahrt",
      h2: "Mitten in der Maxvorstadt.",
      lead: "STORIA, Karlstraße 47A, 80333 München. Telefon +49 89 51519696. Die Tram 20 und 21 hält an der Karlstraße direkt vor der Tür.",
      callLabel: "Direkt anrufen",
      callSub: "+49 89 51519696",
      whatsappLabel: "WhatsApp",
      whatsappSub: "Schnelle Reservierungsanfrage",
      directionsLabel: "Anfahrt",
      directionsSub: "Karlstraße 47A · 80333 München",
      restaurantLabel: "Restaurant",
      restaurantSub: "ristorantestoria.de",
    },
    faq: {
      eyebrow: "Häufige Fragen",
      h2: "WM 2026 im STORIA – kurz erklärt.",
      items: [
        {
          question: "Werden alle Spiele gezeigt?",
          answer: "Ja. Wir übertragen alle Spiele der WM 2026, von der Gruppenphase bis zum Finale.",
        },
        {
          question: "Muss ich reservieren?",
          answer:
            "Empfohlen, vor allem an Spieltagen und bei den deutschen Spielen. Reservieren geht über das Formular oder per WhatsApp.",
        },
        {
          question: "Was passiert bei schlechtem Wetter?",
          answer: "Die Terrasse ist überdacht. Wird es zu ungemütlich, zeigen wir die Spiele drinnen.",
        },
        {
          question: "Zeigt ihr auch die Deutschland-Spiele?",
          answer: "Ja, alle drei Gruppenspiele. Kommt Deutschland weiter, auch die K.-o.-Runde.",
        },
        {
          question: "Kann ich auch nur etwas trinken kommen?",
          answer:
            "Ja. Aperitivo, Wein oder ein Bier zum Spiel sind kein Problem. Plätze sind an Spieltagen gefragt, darum besser kurz reservieren.",
        },
        {
          question: "Wo genau ist STORIA?",
          answer:
            "In der Maxvorstadt, Karlstraße 47A, 80333 München. Tram 20 und 21, Haltestelle Karlstraße, direkt vor dem Restaurant.",
        },
      ],
      disclaimer:
        "Eine Sonderseite zur Fußball-Weltmeisterschaft 2026 (11. Juni – 19. Juli). Diese Seite steht in keiner offiziellen Verbindung zur FIFA. Spielzeiten und Übertragungen ohne Gewähr.",
    },
  },
  en: {
    seo: {
      title: "World Cup 2026 Public Viewing Munich – live at STORIA",
      description:
        "Every World Cup 2026 match live on our covered terrace in Maxvorstadt. Southern Italian food, aperitivo, indoors if the weather turns. Book a table.",
    },
    nav: {
      angebot: "What's on",
      spiele: "The biggest matches",
      turnier: "Tournament",
      reservieren: "Book a table",
    },
    hero: {
      eyebrow: "World Cup 2026 · 11 June – 19 July · Maxvorstadt",
      h1: {
        pre: "World Cup 2026 public viewing in Maxvorstadt – every match at ",
        em: "STORIA",
        post: "",
      },
      sub: "Italy aren't in it in 2026, for the third time running. We're showing the World Cup anyway – from the opening match on 11 June to the final on 19 July. Every game, on the covered terrace on Karlstraße. Plus southern Italian food, a glass of wine, an aperitivo. Match days get busy, so it's best to book ahead.",
      ctaReserve: "Book a table →",
      ctaWhatsapp: "WhatsApp",
    },
    angebot: {
      eyebrow: "What's on here",
      h2: "Watch the football, enjoy the Italian.",
      items: [
        "Every World Cup 2026 match, from the group stage to the final.",
        "Shown on the covered terrace. If the weather turns, we carry on inside.",
        "Not a sports bar: southern Italian cooking, our own wine list, an aperitivo at kick-off.",
        "Booking recommended, especially on the evenings Germany are playing.",
      ],
      menuPhrase: "southern Italian cooking",
    },
    crossFilmfest: {
      pre: "More than football – from 26 June to 5 July we also host ",
      anchor: "Filmfest München at the same time",
      post: ". Premiere dinners and industry evenings under one roof.",
    },
    spiele: {
      eyebrow: "The biggest matches · Knockout stage",
      h2: "From Germany to the final – live with us.",
      vs: "vs",
      mesz: "CEST",
      note: "All times in CEST. Opponents in the knockout matches are confirmed only after each round – we add them as we go.",
      offen: "Opponents to be confirmed",
    },
    turnier: {
      eyebrow: "How the tournament runs",
      h2: "From Mexico City to New Jersey.",
      items: [
        { phase: "Opening", zeit: "11 June · 21:00" },
        { phase: "Group stage", zeit: "11 – 27 June" },
        { phase: "Round of 32", zeit: "28 June – 3 July" },
        { phase: "Round of 16", zeit: "4 – 7 July" },
        { phase: "Quarter-finals", zeit: "9 – 11 July" },
        { phase: "Semi-finals", zeit: "14 / 15 July" },
        { phase: "Final", zeit: "19 July · 21:00" },
      ],
    },
    reservieren: {
      eyebrow: "Secure your spot",
      h2: "Book a table",
      lead: "On match days tables go fast, especially for Germany's games. Grab your spot on the terrace or inside – a quick booking is all it takes.",
      ctaReserve: "Book a table →",
      ctaWhatsapp: "WhatsApp",
    },
    anfahrt: {
      eyebrow: "Getting here",
      h2: "Right in the heart of Maxvorstadt.",
      lead: "STORIA, Karlstraße 47A, 80333 Munich. Phone +49 89 51519696. Trams 20 and 21 stop on Karlstraße right outside the door.",
      callLabel: "Call us directly",
      callSub: "+49 89 51519696",
      whatsappLabel: "WhatsApp",
      whatsappSub: "Quick booking enquiry",
      directionsLabel: "Directions",
      directionsSub: "Karlstraße 47A · 80333 Munich",
      restaurantLabel: "Restaurant",
      restaurantSub: "ristorantestoria.de",
    },
    faq: {
      eyebrow: "Frequently asked",
      h2: "World Cup 2026 at STORIA – the short version.",
      items: [
        {
          question: "Do you show every match?",
          answer: "Yes. We show every match of the World Cup 2026, from the group stage to the final.",
        },
        {
          question: "Do I need to book?",
          answer:
            "Recommended, especially on match days and for Germany's games. Book via the form or over WhatsApp.",
        },
        {
          question: "What happens if the weather turns?",
          answer: "The terrace is covered. If it gets too uncomfortable, we show the matches inside.",
        },
        {
          question: "Do you show Germany's matches too?",
          answer: "Yes, all three group games. If Germany go through, the knockout rounds as well.",
        },
        {
          question: "Can I just come for a drink?",
          answer:
            "Of course. An aperitivo, a wine or a beer with the game is no problem. Seats are in demand on match days, so it's best to book briefly.",
        },
        {
          question: "Where exactly is STORIA?",
          answer:
            "In Maxvorstadt, Karlstraße 47A, 80333 Munich. Trams 20 and 21, Karlstraße stop, right outside the restaurant.",
        },
      ],
      disclaimer:
        "A special page for the 2026 FIFA World Cup (11 June – 19 July). This page has no official connection to FIFA. Kick-off times and broadcasts subject to change.",
    },
  },
  it: {
    seo: {
      title: "Mondiali 2026 in diretta a Monaco di Baviera | STORIA",
      description:
        "Tutte le partite dei Mondiali 2026 in diretta sulla terrazza coperta in Maxvorstadt. Cucina del Sud Italia, aperitivo, al chiuso se piove. Prenota un tavolo.",
    },
    nav: {
      angebot: "Cosa c'è",
      spiele: "Le partite più grandi",
      turnier: "Torneo",
      reservieren: "Prenota un tavolo",
    },
    hero: {
      eyebrow: "Mondiali 2026 · 11 giugno – 19 luglio · Maxvorstadt",
      h1: {
        pre: "Mondiali 2026 in diretta in Maxvorstadt – tutte le partite allo ",
        em: "STORIA",
        post: "",
      },
      sub: "L'Italia non c'è nel 2026, per la terza volta di fila. Da noi i Mondiali si vedono lo stesso – dalla partita inaugurale dell'11 giugno fino alla finale del 19 luglio. Tutte le partite, sulla terrazza coperta in Karlstraße. E poi cucina del Sud Italia, un bicchiere di vino, un aperitivo. Nei giorni di partita si riempie, quindi meglio prenotare prima.",
      ctaReserve: "Prenota un tavolo →",
      ctaWhatsapp: "WhatsApp",
    },
    angebot: {
      eyebrow: "Cosa offriamo",
      h2: "Guardare il calcio, gustare l'Italia.",
      items: [
        "Tutte le partite dei Mondiali 2026, dalla fase a gironi alla finale.",
        "Trasmissione sulla terrazza coperta. Se il tempo peggiora, continuiamo al chiuso.",
        "Non un pub sportivo: cucina del Sud Italia, carta dei vini nostra, aperitivo al fischio d'inizio.",
        "Prenotazione consigliata, soprattutto nelle serate in cui gioca la Germania.",
      ],
      menuPhrase: "cucina del Sud Italia",
    },
    crossFilmfest: {
      pre: "Più del calcio – dal 26 giugno al 5 luglio da noi c'è anche il ",
      anchor: "Filmfest München in contemporanea",
      post: ". Cene di premiere e serate di settore nella stessa casa.",
    },
    spiele: {
      eyebrow: "Le partite più grandi · Fase a eliminazione",
      h2: "Dalla Germania alla finale – in diretta da noi.",
      vs: "contro",
      mesz: "ora di Roma",
      note: "Tutti gli orari sono ora di Roma. Gli avversari delle partite a eliminazione si conoscono solo dopo ogni turno – li aggiungiamo man mano.",
      offen: "Avversari da definire",
    },
    turnier: {
      eyebrow: "Come si svolge il torneo",
      h2: "Da Città del Messico al New Jersey.",
      items: [
        { phase: "Inaugurazione", zeit: "11 giugno · 21:00" },
        { phase: "Fase a gironi", zeit: "11 – 27 giugno" },
        { phase: "Sedicesimi", zeit: "28 giugno – 3 luglio" },
        { phase: "Ottavi", zeit: "4 – 7 luglio" },
        { phase: "Quarti", zeit: "9 – 11 luglio" },
        { phase: "Semifinali", zeit: "14 / 15 luglio" },
        { phase: "Finale", zeit: "19 luglio · 21:00" },
      ],
    },
    reservieren: {
      eyebrow: "Assicurati il posto",
      h2: "Prenota",
      lead: "Nei giorni di partita i tavoli si esauriscono in fretta, ancora di più per le gare della Germania. Assicurati il tuo posto in terrazza o al chiuso – basta una breve prenotazione.",
      ctaReserve: "Prenota un tavolo →",
      ctaWhatsapp: "WhatsApp",
    },
    anfahrt: {
      eyebrow: "Come arrivare",
      h2: "Nel cuore di Maxvorstadt.",
      lead: "STORIA, Karlstraße 47A, 80333 Monaco di Baviera. Telefono +49 89 51519696. I tram 20 e 21 fermano in Karlstraße proprio davanti all'ingresso.",
      callLabel: "Chiama subito",
      callSub: "+49 89 51519696",
      whatsappLabel: "WhatsApp",
      whatsappSub: "Richiesta rapida di prenotazione",
      directionsLabel: "Come arrivare",
      directionsSub: "Karlstraße 47A · 80333 Monaco di Baviera",
      restaurantLabel: "Ristorante",
      restaurantSub: "ristorantestoria.de",
    },
    faq: {
      eyebrow: "Domande frequenti",
      h2: "Mondiali 2026 allo STORIA – in breve.",
      items: [
        {
          question: "Trasmettete tutte le partite?",
          answer: "Sì. Trasmettiamo tutte le partite dei Mondiali 2026, dalla fase a gironi alla finale.",
        },
        {
          question: "Devo prenotare?",
          answer:
            "Consigliato, soprattutto nei giorni di partita e per le gare della Germania. Si prenota dal modulo o via WhatsApp.",
        },
        {
          question: "Cosa succede se il tempo peggiora?",
          answer: "La terrazza è coperta. Se diventa troppo scomodo, mostriamo le partite al chiuso.",
        },
        {
          question: "Mostrate anche le partite della Germania?",
          answer: "Sì, tutte e tre le gare del girone. Se la Germania passa, anche la fase a eliminazione diretta.",
        },
        {
          question: "Posso venire solo per bere qualcosa?",
          answer:
            "Certo. Un aperitivo, un vino o una birra durante la partita non sono un problema. Nei giorni di partita i posti vanno a ruba, quindi meglio prenotare un attimo.",
        },
        {
          question: "Dove si trova esattamente lo STORIA?",
          answer:
            "In Maxvorstadt, Karlstraße 47A, 80333 Monaco di Baviera. Tram 20 e 21, fermata Karlstraße, proprio davanti al ristorante.",
        },
      ],
      disclaimer:
        "Una pagina speciale dedicata ai Mondiali di calcio 2026 (11 giugno – 19 luglio). Questa pagina non ha alcun legame ufficiale con la FIFA. Orari delle partite e trasmissioni salvo modifiche.",
    },
  },
  fr: {
    seo: {
      title: "Coupe du monde 2026 en direct à Munich | STORIA",
      description:
        "Tous les matchs de la Coupe du monde 2026 en direct sur la terrasse couverte à Maxvorstadt. Cuisine du sud de l'Italie, apéritif, à l'intérieur s'il pleut.",
    },
    nav: {
      angebot: "Au programme",
      spiele: "Les plus grands matchs",
      turnier: "Tournoi",
      reservieren: "Réserver une table",
    },
    hero: {
      eyebrow: "Coupe du monde 2026 · 11 juin – 19 juillet · Maxvorstadt",
      h1: {
        pre: "Coupe du monde 2026 en direct à Maxvorstadt – tous les matchs au ",
        em: "STORIA",
        post: "",
      },
      sub: "L'Italie n'y est pas en 2026, pour la troisième fois d'affilée. Chez nous, la Coupe du monde passe quand même – du match d'ouverture le 11 juin jusqu'à la finale le 19 juillet. Tous les matchs, sur la terrasse couverte de la Karlstraße. Avec une cuisine du sud de l'Italie, un verre de vin, un apéritif. Les jours de match, c'est plein, alors mieux vaut réserver avant.",
      ctaReserve: "Réserver une table →",
      ctaWhatsapp: "WhatsApp",
    },
    angebot: {
      eyebrow: "Ce qu'on propose",
      h2: "Regarder le foot, savourer l'Italie.",
      items: [
        "Tous les matchs de la Coupe du monde 2026, de la phase de groupes à la finale.",
        "Diffusion sur la terrasse couverte. Si le temps se gâte, on continue à l'intérieur.",
        "Pas un bar à sport : cuisine du sud de l'Italie, notre propre carte des vins, un apéritif au coup d'envoi.",
        "Réservation conseillée, surtout les soirs où joue l'Allemagne.",
      ],
      menuPhrase: "cuisine du sud de l'Italie",
    },
    crossFilmfest: {
      pre: "Plus que le football – du 26 juin au 5 juillet, c'est aussi le ",
      anchor: "Filmfest München en parallèle",
      post: ". Dîners de première et soirées de l'industrie sous le même toit.",
    },
    spiele: {
      eyebrow: "Les plus grands matchs · Phase à élimination",
      h2: "De l'Allemagne à la finale – en direct chez nous.",
      vs: "contre",
      mesz: "heure de Paris",
      note: "Tous les horaires à l'heure de Paris. Les adversaires des matchs à élimination ne sont connus qu'après chaque tour – nous les ajoutons au fur et à mesure.",
      offen: "Adversaires à définir",
    },
    turnier: {
      eyebrow: "Comment se déroule le tournoi",
      h2: "De Mexico au New Jersey.",
      items: [
        { phase: "Ouverture", zeit: "11 juin · 21:00" },
        { phase: "Phase de groupes", zeit: "11 – 27 juin" },
        { phase: "Seizièmes", zeit: "28 juin – 3 juillet" },
        { phase: "Huitièmes", zeit: "4 – 7 juillet" },
        { phase: "Quarts", zeit: "9 – 11 juillet" },
        { phase: "Demi-finales", zeit: "14 / 15 juillet" },
        { phase: "Finale", zeit: "19 juillet · 21:00" },
      ],
    },
    reservieren: {
      eyebrow: "Réservez votre place",
      h2: "Réserver",
      lead: "Les jours de match, les tables partent vite, surtout pour les matchs de l'Allemagne. Réservez votre place sur la terrasse ou à l'intérieur – une courte réservation suffit.",
      ctaReserve: "Réserver une table →",
      ctaWhatsapp: "WhatsApp",
    },
    anfahrt: {
      eyebrow: "Accès",
      h2: "En plein cœur de Maxvorstadt.",
      lead: "STORIA, Karlstraße 47A, 80333 Munich. Téléphone +49 89 51519696. Les trams 20 et 21 s'arrêtent sur la Karlstraße, juste devant la porte.",
      callLabel: "Appeler directement",
      callSub: "+49 89 51519696",
      whatsappLabel: "WhatsApp",
      whatsappSub: "Demande de réservation rapide",
      directionsLabel: "Accès",
      directionsSub: "Karlstraße 47A · 80333 Munich",
      restaurantLabel: "Restaurant",
      restaurantSub: "ristorantestoria.de",
    },
    faq: {
      eyebrow: "Questions fréquentes",
      h2: "Coupe du monde 2026 au STORIA – en bref.",
      items: [
        {
          question: "Diffusez-vous tous les matchs ?",
          answer: "Oui. Nous diffusons tous les matchs de la Coupe du monde 2026, de la phase de groupes à la finale.",
        },
        {
          question: "Dois-je réserver ?",
          answer:
            "Conseillé, surtout les jours de match et pour les matchs de l'Allemagne. La réservation se fait via le formulaire ou par WhatsApp.",
        },
        {
          question: "Que se passe-t-il s'il pleut ?",
          answer: "La terrasse est couverte. Si ça devient trop inconfortable, nous diffusons les matchs à l'intérieur.",
        },
        {
          question: "Diffusez-vous aussi les matchs de l'Allemagne ?",
          answer: "Oui, les trois matchs de groupe. Si l'Allemagne passe, les phases à élimination directe aussi.",
        },
        {
          question: "Puis-je venir juste pour boire un verre ?",
          answer:
            "Bien sûr. Un apéritif, un vin ou une bière pendant le match, pas de souci. Les places sont prisées les jours de match, alors mieux vaut réserver un instant.",
        },
        {
          question: "Où se trouve exactement le STORIA ?",
          answer:
            "À Maxvorstadt, Karlstraße 47A, 80333 Munich. Trams 20 et 21, arrêt Karlstraße, juste devant le restaurant.",
        },
      ],
      disclaimer:
        "Une page spéciale consacrée à la Coupe du monde de football 2026 (11 juin – 19 juillet). Cette page n'a aucun lien officiel avec la FIFA. Horaires des matchs et diffusions sous réserve de modifications.",
    },
  },
};
