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
  /**
   * Evergreen-Abschnitt zum WM/EM-Zwei-Jahres-Rhythmus. Zahlt bewusst schon jetzt auf die
   * spätere Umwidmung dieser Seite zum SEO/GEO-Platzhalter für die EM 2028 ein (Content-Tiefe
   * statt Title/H1/URL-Änderung – die bleiben bis zum eigentlichen Umbau auf WM 2026 fokussiert).
   */
  zyklus: {
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
    /** Überschrift über der kompakten Liste bereits gespielter Spiele. */
    ergebnisseHead: string;
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
  /** Nach-Turnier-Abschluss – nur bei !isWmActive() sichtbar. Title/H1 der Seite bleiben. */
  abschluss: {
    eyebrow: string;
    h2: string;
    body: string;
    linksLead: string;
    linkOktoberfest: string;
    linkTerrasse: string;
  };
  /** Kompakter Hinweis, der nach dem Turnier den Spielplan-Block ersetzt. */
  spieleClosed: string;
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
        "Reservierung empfohlen, besonders an den K.-o.-Abenden ab dem Viertelfinale.",
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
          body: "Läuft ein Achtel-, Viertel- oder Halbfinale, ist die Terrasse schnell voll. Sichern Sie sich Ihren Tisch vorab – dann bleibt vor dem Anpfiff noch Zeit für einen Aperitivo.",
        },
      ],
    },
    zyklus: {
      eyebrow: "WM & EM · Der Rhythmus des Fußballs",
      h2: "Nach der WM ist vor der EM.",
      blocks: [
        {
          lead: "Alle zwei Jahre ein großes Turnier.",
          body: "Seit den 1960er-Jahren wechseln sich Fußball-Weltmeisterschaft und Fußball-Europameisterschaft im Zwei-Jahres-Rhythmus ab: WM 2022, EM 2024, WM 2026 – und im Sommer 2028 die nächste Europameisterschaft. Für uns ist Public Viewing deshalb kein einmaliges Ereignis, sondern gelebte Praxis: Läuft ein großes Turnier, läuft es auf unserer Terrasse.",
        },
        {
          lead: "Nach der WM: die EM 2028.",
          body: "Die nächste Europameisterschaft findet 2028 im Vereinigten Königreich und in Irland statt. Auch dafür öffnen wir wieder die Terrasse in der Karlstraße – Termine und Spielplan folgen, sobald die UEFA sie veröffentlicht. Bis dahin bleibt diese Seite unsere Adresse für jedes große Turnier.",
        },
      ],
    },
    spiele: {
      eyebrow: "Die größten Spiele · K.-o.-Phase",
      h2: "Vom Achtelfinale bis zum Finale – live bei uns.",
      vs: "gegen",
      mesz: "MESZ",
      note: "Alle Zeiten in MESZ. Alle Paarungen stehen fest – zum Abschluss zeigen wir das Spiel um Platz 3 und das Finale Spanien gegen Argentinien.",
      offen: "Gegner stehen noch nicht fest",
      ergebnisseHead: "Bereits gespielt",
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
      lead: "An Spieltagen sind die Tische schnell vergeben, bei den K.-o.-Spielen besonders. Sichert euch euren Platz auf der Terrasse oder drinnen – eine kurze Reservierung genügt.",
      ctaReserve: "Tisch reservieren →",
      ctaWhatsapp: "WhatsApp",
    },
    anfahrt: {
      eyebrow: "Anfahrt",
      h2: "Mitten in der Maxvorstadt.",
      lead: "STORIA, Karlstraße 47a, 80333 München. Telefon +49 89 51519696. Die Tram 20 und 21 hält an der Karlstraße direkt vor der Tür.",
      callLabel: "Direkt anrufen",
      callSub: "+49 89 51519696",
      whatsappLabel: "WhatsApp",
      whatsappSub: "Schnelle Reservierungsanfrage",
      directionsLabel: "Anfahrt",
      directionsSub: "Karlstraße 47a · 80333 München",
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
            "Empfohlen, vor allem an Spieltagen und bei den K.-o.-Spielen. Reservieren geht über das Formular oder per WhatsApp.",
        },
        {
          question: "Was passiert bei schlechtem Wetter?",
          answer:
            "Die Terrasse ist wirklich überdacht – nicht mit einer Markise oder einem Sonnensegel, sondern fest ins Gebäude integriert: Das Haus setzt sich über ihr fort wie ein richtiges Dach. Ein kurzer Schauer ist bei uns also kein Problem, und ist es warm, merkt man davon kaum etwas – drinnen und draußen zugleich zu sitzen, ist in München eine Seltenheit. Wird es doch zu ungemütlich, zeigen wir die Spiele drinnen.",
        },
        {
          question: "Zeigt ihr auch die Deutschland-Spiele?",
          answer:
            "Deutschland ist im Sechzehntelfinale gegen Paraguay ausgeschieden (3:4 n. E.). Alle Gruppenspiele und das Sechzehntelfinale haben wir natürlich gezeigt – und übertragen weiterhin jedes K.-o.-Spiel bis zum Finale.",
        },
        {
          question: "Was ist mit Spielen mitten in der Nacht?",
          answer:
            "Einige K.-o.-Spiele stoßen erst nach unserer Schließzeit an, z. B. um 2:00 oder 2:30 Uhr MESZ. Diese sind in der Spieletabelle mit dem Hinweis „Außerhalb unserer Öffnungszeiten\" markiert – die zeigen wir leider nicht live.",
        },
        {
          question: "Wann ist das nächste große Fußballturnier nach der WM 2026?",
          answer:
            "Die UEFA Euro 2028, ausgetragen im Vereinigten Königreich und in Irland, im Sommer 2028. Weltmeisterschaft und Europameisterschaft wechseln sich im Zwei-Jahres-Rhythmus ab – wir zeigen beide live im STORIA.",
        },
        {
          question: "Kann ich auch nur etwas trinken kommen?",
          answer:
            "Ja. Aperitivo, Wein oder ein Bier zum Spiel sind kein Problem. Plätze sind an Spieltagen gefragt, darum besser kurz reservieren.",
        },
        {
          question: "Wo genau ist STORIA?",
          answer:
            "In der Maxvorstadt, Karlstraße 47a, 80333 München. Tram 20 und 21, Haltestelle Karlstraße, direkt vor dem Restaurant.",
        },
      ],
      disclaimer:
        "Eine Sonderseite zur Fußball-Weltmeisterschaft 2026 (11. Juni – 19. Juli). Diese Seite steht in keiner offiziellen Verbindung zur FIFA. Spielzeiten und Übertragungen ohne Gewähr.",
    },
    abschluss: {
      eyebrow: "WM 2026 · Abpfiff",
      h2: "Das war die WM 2026 im STORIA – grazie!",
      body: "Vier Wochen Fußball auf der überdachten Terrasse, von der Eröffnung bis zum Finale – danke, dass ihr dabei wart. Es war laut, es war voll, es war ein Fest. Bis zum nächsten großen Turnier bleibt bei uns alles, was den Sommer ausmacht: Aperitivo, süditalienische Küche und ein Platz unter unserem echten Terrassendach.",
      linksLead: "Weiter im STORIA:",
      linkOktoberfest: "Oktoberfest im STORIA",
      linkTerrasse: "Unsere überdachte Terrasse",
    },
    spieleClosed:
      "Die WM 2026 ist vorbei – von der Eröffnung bis zum Finale liefen alle Spiele live auf unserer überdachten Terrasse. Der Spielplan ist damit abgeschlossen.",
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
        "Booking recommended, especially on knockout evenings from the quarter-finals on.",
      ],
      menuPhrase: "southern Italian cooking",
    },
    crossFilmfest: {
      pre: "More than football – from 26 June to 5 July we also host ",
      anchor: "Filmfest München at the same time",
      post: ". Premiere dinners and industry evenings under one roof.",
    },
    zyklus: {
      eyebrow: "World Cup & Euro · Football's two-year rhythm",
      h2: "Once the World Cup ends, the Euros are already on the horizon.",
      blocks: [
        {
          lead: "A major tournament every two years.",
          body: "The World Cup and the European Championship have alternated every two years since the 1960s: World Cup 2022, Euro 2024, World Cup 2026 – and the next Euro in summer 2028. For us, public viewing isn't a one-off event, it's a habit: whenever a major tournament is on, it's on at STORIA.",
        },
        {
          lead: "After the World Cup: Euro 2028.",
          body: "The next European Championship takes place in 2028 in the United Kingdom and Ireland. We'll open the terrace on Karlstraße for that too – dates and fixtures to follow once UEFA confirms them. Until then, this page stays our home for every major tournament.",
        },
      ],
    },
    spiele: {
      eyebrow: "The biggest matches · Knockout stage",
      h2: "From the round of 16 to the final – live with us.",
      vs: "vs",
      mesz: "CEST",
      note: "All times in CEST. All fixtures are confirmed – we round off the tournament with the third-place match and the Spain v Argentina final.",
      offen: "Opponents to be confirmed",
      ergebnisseHead: "Already played",
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
      lead: "On match days tables go fast, especially for the knockout games. Grab your spot on the terrace or inside – a quick booking is all it takes.",
      ctaReserve: "Book a table →",
      ctaWhatsapp: "WhatsApp",
    },
    anfahrt: {
      eyebrow: "Getting here",
      h2: "Right in the heart of Maxvorstadt.",
      lead: "STORIA, Karlstraße 47a, 80333 Munich. Phone +49 89 51519696. Trams 20 and 21 stop on Karlstraße right outside the door.",
      callLabel: "Call us directly",
      callSub: "+49 89 51519696",
      whatsappLabel: "WhatsApp",
      whatsappSub: "Quick booking enquiry",
      directionsLabel: "Directions",
      directionsSub: "Karlstraße 47a · 80333 Munich",
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
            "Recommended, especially on match days and for the knockout games. Book via the form or over WhatsApp.",
        },
        {
          question: "What happens if the weather turns?",
          answer:
            "The terrace is genuinely covered — not by an awning or a sail canopy, but built right into the building: the house continues over it like a proper roof. A short rain shower is no problem at all, and on a warm evening you'll barely notice it's raining — sitting outside under a real roof is a rarity in Munich. If it does get too much, we show the matches inside.",
        },
        {
          question: "Do you show Germany's matches too?",
          answer:
            "Germany were eliminated in the round of 32 against Paraguay (3-4 on penalties). We showed all three group games and that match, of course – and we're still showing every knockout game through to the final.",
        },
        {
          question: "What about matches in the middle of the night?",
          answer:
            "A few knockout matches kick off after we've closed, for example at 2:00 or 2:30 am CEST. These are marked in the match schedule with an \"Outside our opening hours\" note – we're not able to show those live.",
        },
        {
          question: "When's the next major tournament after the 2026 World Cup?",
          answer:
            "UEFA Euro 2028, held in the United Kingdom and Ireland, in summer 2028. The World Cup and the Euros alternate every two years – and we show both live at STORIA.",
        },
        {
          question: "Can I just come for a drink?",
          answer:
            "Of course. An aperitivo, a wine or a beer with the game is no problem. Seats are in demand on match days, so it's best to book briefly.",
        },
        {
          question: "Where exactly is STORIA?",
          answer:
            "In Maxvorstadt, Karlstraße 47a, 80333 Munich. Trams 20 and 21, Karlstraße stop, right outside the restaurant.",
        },
      ],
      disclaimer:
        "A special page for the 2026 FIFA World Cup (11 June – 19 July). This page has no official connection to FIFA. Kick-off times and broadcasts subject to change.",
    },
    abschluss: {
      eyebrow: "World Cup 2026 · Final whistle",
      h2: "That was the World Cup 2026 at STORIA – grazie!",
      body: "Four weeks of football on the covered terrace, from the opening match to the final – thank you for being part of it. It was loud, it was busy, it was a joy. Until the next big tournament, everything that makes summer here stays: aperitivo, southern Italian food and a seat under our real terrace roof.",
      linksLead: "More at STORIA:",
      linkOktoberfest: "Oktoberfest at STORIA",
      linkTerrasse: "Our covered terrace",
    },
    spieleClosed:
      "The World Cup 2026 is over – from the opening match to the final, every game was live on our covered terrace. The fixture list is now closed.",
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
        "Prenotazione consigliata, soprattutto nelle serate a eliminazione diretta dai quarti in poi.",
      ],
      menuPhrase: "cucina del Sud Italia",
    },
    crossFilmfest: {
      pre: "Più del calcio – dal 26 giugno al 5 luglio da noi c'è anche il ",
      anchor: "Filmfest München in contemporanea",
      post: ". Cene di premiere e serate di settore nella stessa casa.",
    },
    zyklus: {
      eyebrow: "Mondiali & Europei · Il ritmo del calcio",
      h2: "Finiti i Mondiali, si guarda già agli Europei.",
      blocks: [
        {
          lead: "Un grande torneo ogni due anni.",
          body: "Dagli anni '60, Mondiali ed Europei si alternano ogni due anni: Mondiali 2022, Europei 2024, Mondiali 2026 – e i prossimi Europei nell'estate 2028. Per noi il public viewing non è un evento isolato, ma un'abitudine: quando c'è un grande torneo, si vede allo STORIA.",
        },
        {
          lead: "Dopo i Mondiali: Euro 2028.",
          body: "I prossimi Campionati Europei si giocheranno nel 2028 nel Regno Unito e in Irlanda. Anche per quell'occasione riapriremo la terrazza in Karlstraße – date e calendario appena la UEFA li renderà noti. Fino ad allora, questa pagina resta il nostro punto di riferimento per ogni grande torneo.",
        },
      ],
    },
    spiele: {
      eyebrow: "Le partite più grandi · Fase a eliminazione",
      h2: "Dagli ottavi alla finale – in diretta da noi.",
      vs: "contro",
      mesz: "ora di Roma",
      note: "Tutti gli orari sono ora di Roma. Tutti gli accoppiamenti sono definiti – per chiudere trasmettiamo la finale per il 3º posto e la finale Spagna-Argentina.",
      offen: "Avversari da definire",
      ergebnisseHead: "Già giocate",
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
      lead: "Nei giorni di partita i tavoli si esauriscono in fretta, ancora di più per le gare a eliminazione diretta. Assicurati il tuo posto in terrazza o al chiuso – basta una breve prenotazione.",
      ctaReserve: "Prenota un tavolo →",
      ctaWhatsapp: "WhatsApp",
    },
    anfahrt: {
      eyebrow: "Come arrivare",
      h2: "Nel cuore di Maxvorstadt.",
      lead: "STORIA, Karlstraße 47a, 80333 Monaco di Baviera. Telefono +49 89 51519696. I tram 20 e 21 fermano in Karlstraße proprio davanti all'ingresso.",
      callLabel: "Chiama subito",
      callSub: "+49 89 51519696",
      whatsappLabel: "WhatsApp",
      whatsappSub: "Richiesta rapida di prenotazione",
      directionsLabel: "Come arrivare",
      directionsSub: "Karlstraße 47a · 80333 Monaco di Baviera",
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
            "Consigliato, soprattutto nei giorni di partita e per le gare a eliminazione diretta. Si prenota dal modulo o via WhatsApp.",
        },
        {
          question: "Cosa succede se il tempo peggiora?",
          answer:
            "La terrazza è davvero coperta – non con una tenda o un telo parasole, ma integrata nell'edificio stesso: la casa si prolunga sopra di essa come un vero tetto. Un breve acquazzone non è un problema, e se fa caldo non ve ne accorgerete quasi. Sedersi all'aperto sotto un tetto vero è una rarità a Monaco di Baviera. Se il tempo peggiora comunque, mostriamo le partite al chiuso.",
        },
        {
          question: "Mostrate anche le partite della Germania?",
          answer:
            "La Germania è stata eliminata nei sedicesimi contro il Paraguay (3-4 ai rigori). Abbiamo trasmesso tutte e tre le gare del girone e anche quella partita – e continuiamo a trasmettere ogni partita a eliminazione diretta fino alla finale.",
        },
        {
          question: "E le partite nel cuore della notte?",
          answer:
            "Alcune partite a eliminazione diretta iniziano dopo la nostra chiusura, ad esempio alle 2:00 o alle 2:30 (ora di Roma). Nel calendario sono contrassegnate con l'indicazione \"Fuori dai nostri orari di apertura\" – purtroppo non possiamo trasmetterle dal vivo.",
        },
        {
          question: "Quando si gioca il prossimo grande torneo dopo i Mondiali 2026?",
          answer:
            "Gli Europei UEFA 2028, che si disputeranno nel Regno Unito e in Irlanda nell'estate 2028. Mondiali ed Europei si alternano ogni due anni – e li trasmettiamo entrambi dal vivo allo STORIA.",
        },
        {
          question: "Posso venire solo per bere qualcosa?",
          answer:
            "Certo. Un aperitivo, un vino o una birra durante la partita non sono un problema. Nei giorni di partita i posti vanno a ruba, quindi meglio prenotare un attimo.",
        },
        {
          question: "Dove si trova esattamente lo STORIA?",
          answer:
            "In Maxvorstadt, Karlstraße 47a, 80333 Monaco di Baviera. Tram 20 e 21, fermata Karlstraße, proprio davanti al ristorante.",
        },
      ],
      disclaimer:
        "Una pagina speciale dedicata ai Mondiali di calcio 2026 (11 giugno – 19 luglio). Questa pagina non ha alcun legame ufficiale con la FIFA. Orari delle partite e trasmissioni salvo modifiche.",
    },
    abschluss: {
      eyebrow: "Mondiali 2026 · Fischio finale",
      h2: "Questi erano i Mondiali 2026 allo STORIA – grazie!",
      body: "Quattro settimane di calcio sulla terrazza coperta, dalla partita inaugurale alla finale – grazie di esserci stati. È stato rumoroso, pieno, una festa. Fino al prossimo grande torneo resta tutto ciò che rende l'estate da noi: aperitivo, cucina del Sud Italia e un posto sotto il nostro vero tetto in terrazza.",
      linksLead: "Continua allo STORIA:",
      linkOktoberfest: "Oktoberfest allo STORIA",
      linkTerrasse: "La nostra terrazza coperta",
    },
    spieleClosed:
      "I Mondiali 2026 sono finiti – dalla partita inaugurale alla finale, tutte le gare sono andate in diretta sulla nostra terrazza coperta. Il calendario è così concluso.",
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
        "Réservation conseillée, surtout les soirs de matchs à élimination directe à partir des quarts.",
      ],
      menuPhrase: "cuisine du sud de l'Italie",
    },
    crossFilmfest: {
      pre: "Plus que le football – du 26 juin au 5 juillet, c'est aussi le ",
      anchor: "Filmfest München en parallèle",
      post: ". Dîners de première et soirées de l'industrie sous le même toit.",
    },
    zyklus: {
      eyebrow: "Coupe du monde & Euro · Le rythme du football",
      h2: "La Coupe du monde à peine finie, l'Euro pointe déjà.",
      blocks: [
        {
          lead: "Un grand tournoi tous les deux ans.",
          body: "Depuis les années 1960, la Coupe du monde et l'Euro s'alternent tous les deux ans : Coupe du monde 2022, Euro 2024, Coupe du monde 2026 – puis le prochain Euro à l'été 2028. Chez nous, le public viewing n'est pas un événement isolé mais une habitude : dès qu'un grand tournoi a lieu, on le voit au STORIA.",
        },
        {
          lead: "Après la Coupe du monde : l'Euro 2028.",
          body: "Le prochain Championnat d'Europe se déroulera en 2028 au Royaume-Uni et en Irlande. Nous rouvrirons la terrasse de la Karlstraße pour l'occasion aussi – dates et calendrier suivront dès que l'UEFA les publiera. D'ici là, cette page reste notre adresse pour chaque grand tournoi.",
        },
      ],
    },
    spiele: {
      eyebrow: "Les plus grands matchs · Phase à élimination",
      h2: "Des huitièmes à la finale – en direct chez nous.",
      vs: "contre",
      mesz: "heure de Paris",
      note: "Tous les horaires à l'heure de Paris. Toutes les affiches sont connues – pour finir, nous diffusons le match pour la 3e place et la finale Espagne-Argentine.",
      offen: "Adversaires à définir",
      ergebnisseHead: "Déjà joués",
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
      lead: "Les jours de match, les tables partent vite, surtout pour les matchs à élimination directe. Réservez votre place sur la terrasse ou à l'intérieur – une courte réservation suffit.",
      ctaReserve: "Réserver une table →",
      ctaWhatsapp: "WhatsApp",
    },
    anfahrt: {
      eyebrow: "Accès",
      h2: "En plein cœur de Maxvorstadt.",
      lead: "STORIA, Karlstraße 47a, 80333 Munich. Téléphone +49 89 51519696. Les trams 20 et 21 s'arrêtent sur la Karlstraße, juste devant la porte.",
      callLabel: "Appeler directement",
      callSub: "+49 89 51519696",
      whatsappLabel: "WhatsApp",
      whatsappSub: "Demande de réservation rapide",
      directionsLabel: "Accès",
      directionsSub: "Karlstraße 47a · 80333 Munich",
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
            "Conseillé, surtout les jours de match et pour les matchs à élimination directe. La réservation se fait via le formulaire ou par WhatsApp.",
        },
        {
          question: "Que se passe-t-il s'il pleut ?",
          answer:
            "La terrasse est vraiment couverte – pas par un store ou une voile d'ombrage, mais intégrée directement au bâtiment : la maison se prolonge au-dessus comme un vrai toit. Une petite averse n'est donc pas un problème, et s'il fait chaud, on ne s'en aperçoit presque pas – s'asseoir dehors sous un vrai toit est une rareté à Munich. Si le temps devient vraiment désagréable, nous diffusons les matchs à l'intérieur.",
        },
        {
          question: "Diffusez-vous aussi les matchs de l'Allemagne ?",
          answer:
            "L'Allemagne a été éliminée en seizièmes de finale contre le Paraguay (3-4 aux tirs au but). Nous avons bien sûr diffusé les trois matchs de groupe et ce match-là – et nous continuons à diffuser chaque match à élimination directe jusqu'à la finale.",
        },
        {
          question: "Et les matchs en pleine nuit ?",
          answer:
            "Certains matchs à élimination directe débutent après notre fermeture, par exemple à 2h00 ou 2h30 (heure de Paris). Ils sont signalés dans le calendrier par la mention « En dehors de nos heures d'ouverture » – nous ne pouvons malheureusement pas les diffuser en direct.",
        },
        {
          question: "Quel est le prochain grand tournoi après la Coupe du monde 2026 ?",
          answer:
            "L'Euro UEFA 2028, organisé au Royaume-Uni et en Irlande, à l'été 2028. La Coupe du monde et l'Euro s'alternent tous les deux ans – nous diffusons les deux en direct au STORIA.",
        },
        {
          question: "Puis-je venir juste pour boire un verre ?",
          answer:
            "Bien sûr. Un apéritif, un vin ou une bière pendant le match, pas de souci. Les places sont prisées les jours de match, alors mieux vaut réserver un instant.",
        },
        {
          question: "Où se trouve exactement le STORIA ?",
          answer:
            "À Maxvorstadt, Karlstraße 47a, 80333 Munich. Trams 20 et 21, arrêt Karlstraße, juste devant le restaurant.",
        },
      ],
      disclaimer:
        "Une page spéciale consacrée à la Coupe du monde de football 2026 (11 juin – 19 juillet). Cette page n'a aucun lien officiel avec la FIFA. Horaires des matchs et diffusions sous réserve de modifications.",
    },
    abschluss: {
      eyebrow: "Coupe du monde 2026 · Coup de sifflet final",
      h2: "C'était la Coupe du monde 2026 au STORIA – grazie !",
      body: "Quatre semaines de football sur la terrasse couverte, du match d'ouverture à la finale – merci d'avoir été là. C'était bruyant, c'était plein, c'était une fête. Jusqu'au prochain grand tournoi, tout ce qui fait l'été chez nous reste : apéritif, cuisine du sud de l'Italie et une place sous notre vrai toit de terrasse.",
      linksLead: "À suivre au STORIA :",
      linkOktoberfest: "Oktoberfest au STORIA",
      linkTerrasse: "Notre terrasse couverte",
    },
    spieleClosed:
      "La Coupe du monde 2026 est terminée – du match d'ouverture à la finale, tous les matchs ont été diffusés en direct sur notre terrasse couverte. Le calendrier est désormais clos.",
  },
};
