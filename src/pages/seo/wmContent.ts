import type { Language } from "@/contexts/LanguageContext";

interface FaqItem {
  question: string;
  answer: string;
}

export interface WmContent {
  seo: { title: string; description: string };
  nav: {
    rueckblick: string;
    ausblick: string;
    reservieren: string;
  };
  hero: {
    eyebrow: string;
    h1: { pre: string; em: string; post: string };
    intro: string;
    ctaReserve: string;
  };
  rueckblick: {
    eyebrow: string;
    h2: string;
    body: string;
  };
  ausblick: {
    eyebrow: string;
    h2: string;
    body: string;
    ganzjahr: string;
    ctaReserve: string;
  };
  newsletter: {
    h2: string;
    body: string;
  };
  gruppen: {
    h2: string;
    body: string;
    linkLabel: string;
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
    /** Interner Cross-Link zur Hauptbahnhof-Landingpage. */
    hauptbahnhof: { pre: string; anchor: string; post: string };
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
      title: "Public Viewing München – Fußball live im STORIA (Maxvorstadt)",
      description:
        "Public Viewing in München: Fußball live auf der überdachten Terrasse im STORIA, Maxvorstadt am Königsplatz. EM, WM, Champions League & Pokal – jetzt Tisch reservieren.",
    },
    nav: {
      rueckblick: "Rückblick WM 2026",
      ausblick: "Ausblick EM 2028",
      reservieren: "Tisch reservieren",
    },
    hero: {
      eyebrow: "Public Viewing · Maxvorstadt · Königsplatz",
      h1: {
        pre: "Public Viewing in München – Fußball live im ",
        em: "STORIA",
        post: " (Maxvorstadt, am Königsplatz)",
      },
      intro:
        "Große Spiele schaut man nicht allein zu Hause. Im STORIA läuft jedes wichtige Spiel auf der überdachten Terrasse – mitten in der Maxvorstadt, wenige Gehminuten vom Königsplatz. Die Tramhaltestelle Karlstraße hält direkt vor der Tür, nur eine Station vom Hauptbahnhof entfernt – du kommst ohne Auto bequem hin und wieder weg. Dazu Aperitivo, Pizza aus dem 400-Grad-Steinofen und die Stimmung eines Abends in Italien. Ob EM, WM, Champions-League-Finale oder DFB-Pokal: Bei uns sitzt du mittendrin.",
      ctaReserve: "Tisch für den nächsten Spieltag reservieren",
    },
    rueckblick: {
      eyebrow: "Rückblick",
      h2: "Die WM 2026",
      body: "Der erste WM-Sommer in Nordamerika ist Geschichte – und was für einer. 48 Mannschaften, 104 Spiele, und am Ende hob Spanien zum zweiten Mal den Pokal: 1:0 gegen Argentinien, entschieden erst in der Verlängerung durch Ferran Torres. Für Spanien der zweite Titel nach 2010, für Lionel Messi wohl die letzte WM. Bei uns liefen alle Spiele auf der Terrasse, vom frühen Anpfiff bis zum späten Grappa. Danke an alle, die mitgefiebert haben.",
    },
    ausblick: {
      eyebrow: "Ausblick",
      h2: "Die EM 2028",
      body: "Nach der WM ist vor der EM. Vom 9. Juni bis 9. Juli 2028 spielen 24 Nationen die Europameisterschaft aus – Gastgeber sind England, Schottland, Wales und Irland, das Finale steigt im Londoner Wembley-Stadion. Schon am 6. Dezember 2026 wird die Qualifikation ausgelost. Im STORIA ist längst klar: Wir zeigen wieder jedes Spiel auf der Terrasse. Wer früh dran ist, sichert sich den besten Platz.",
      ganzjahr:
        "Bis dahin ist immer Fußball: Champions-League-Abende, Pokalfinale, Frauen-EM – die großen Spiele laufen bei uns das ganze Jahr.",
      ctaReserve: "Tisch reservieren",
    },
    newsletter: {
      h2: "Bleib dran",
      body: "Sobald der EM-Spielplan steht und die Tisch-Vorreservierung öffnet, sagen wir dir Bescheid – rechtzeitig und ohne Spam.",
    },
    gruppen: {
      h2: "Für Gruppen & Firmen",
      body: "Ihr wollt zusammen schauen? Private Public-Viewing-Runden und Catering über",
      linkLabel: "events-storia.de",
    },
    reservieren: {
      eyebrow: "Platz sichern",
      h2: "Reservieren",
      lead: "An großen Spieltagen sind die Tische schnell vergeben. Sichert euch euren Platz auf der Terrasse oder drinnen – eine kurze Reservierung genügt.",
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
      hauptbahnhof: {
        pre: "Nur eine Tramstation vom Hauptbahnhof entfernt – auch praktisch, wenn du direkt vom Bahnhof kommst: unser ",
        anchor: "Italiener am Hauptbahnhof",
        post: ".",
      },
    },
    faq: {
      eyebrow: "Häufige Fragen",
      h2: "Public Viewing im STORIA – kurz erklärt.",
      items: [
        {
          question: "Wo kann man in München Public Viewing schauen?",
          answer:
            "Im STORIA in der Maxvorstadt, Karlstraße 47a – wenige Gehminuten vom Königsplatz, auf der überdachten Terrasse.",
        },
        {
          question: "Wie kommt man zum STORIA?",
          answer:
            "Die Tramhaltestelle Karlstraße liegt direkt vor der Tür – nur eine Station vom Hauptbahnhof entfernt.",
        },
        {
          question: "Kann man einen Tisch fürs Public Viewing reservieren?",
          answer: "Ja, über unsere Reservierung. Für Gruppen empfehlen wir eine frühzeitige Anfrage.",
        },
        {
          question: "Welche Spiele werden gezeigt?",
          answer:
            "Die großen Turniere (EM, WM) sowie Champions-League- und Pokal-Höhepunkte. Termine geben wir vor jedem Anlass bekannt.",
        },
        {
          question: "Was passiert bei schlechtem Wetter?",
          answer:
            "Die Terrasse ist wirklich überdacht – nicht mit einer Markise oder einem Sonnensegel, sondern fest ins Gebäude integriert: Das Haus setzt sich über ihr fort wie ein richtiges Dach. Ein kurzer Schauer ist bei uns also kein Problem, und ist es warm, merkt man davon kaum etwas – drinnen und draußen zugleich zu sitzen, ist in München eine Seltenheit.",
        },
      ],
      disclaimer:
        "Diese Seite steht in keiner offiziellen Verbindung zur FIFA oder UEFA. Angaben zu Turnieren und Terminen ohne Gewähr.",
    },
  },
  en: {
    seo: {
      title: "Public Viewing Munich – Football Live at STORIA (Maxvorstadt)",
      description:
        "Public viewing in Munich: football live on the covered terrace at STORIA, Maxvorstadt by Königsplatz. Euros, World Cup, Champions League & cup finals – book your table.",
    },
    nav: {
      rueckblick: "2026 World Cup",
      ausblick: "Euro 2028",
      reservieren: "Book a table",
    },
    hero: {
      eyebrow: "Public Viewing · Maxvorstadt · Königsplatz",
      h1: {
        pre: "Public viewing in Munich – football live at ",
        em: "STORIA",
        post: " (Maxvorstadt, by Königsplatz)",
      },
      intro:
        "Big matches aren't meant to be watched alone at home. At STORIA, every important match is shown live on our covered terrace – right in Maxvorstadt, a few minutes' walk from Königsplatz. The Karlstraße tram stop is right outside the door, just one stop from the main station – no car needed, coming or going. Add an aperitivo, pizza from our 400°C stone oven, and the atmosphere of an evening in Italy. Euros, World Cup, Champions League final or cup final: with us, you're right in the middle of it.",
      ctaReserve: "Book a table for the next match day",
    },
    rueckblick: {
      eyebrow: "Looking back",
      h2: "The 2026 World Cup",
      body: "The first World Cup summer in North America is history now – and what a one. 48 teams, 104 matches, and in the end Spain lifted the trophy for the second time: 1-0 against Argentina, decided only in extra time by Ferran Torres. Spain's second title after 2010, and likely Lionel Messi's last World Cup. Every match ran on our terrace, from the early kick-offs to the late-night grappa. Thanks to everyone who watched with us.",
    },
    ausblick: {
      eyebrow: "Looking ahead",
      h2: "Euro 2028",
      body: "After the World Cup comes the Euros. From 9 June to 9 July 2028, 24 nations will contest the European Championship – hosted by England, Scotland, Wales and Ireland, with the final at Wembley in London. The qualifying draw already takes place on 6 December 2026. At STORIA, one thing is already clear: we'll show every match on the terrace again. Get in early to secure the best seat.",
      ganzjahr:
        "Until then, there's always football: Champions League nights, cup finals, the Women's Euros – the big matches run at our place all year round.",
      ctaReserve: "Book a table",
    },
    newsletter: {
      h2: "Stay in the loop",
      body: "As soon as the Euro schedule is out and table pre-booking opens, we'll let you know – in good time, and without spam.",
    },
    gruppen: {
      h2: "For groups & companies",
      body: "Want to watch together? Private public viewing gatherings and catering via",
      linkLabel: "events-storia.de",
    },
    reservieren: {
      eyebrow: "Secure your spot",
      h2: "Book a table",
      lead: "On big match days tables go fast. Grab your spot on the terrace or inside – a quick booking is all it takes.",
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
      hauptbahnhof: {
        pre: "Just one tram stop from the main station – handy if you're coming straight off the train: our ",
        anchor: "Italian restaurant near the main station",
        post: ".",
      },
    },
    faq: {
      eyebrow: "Frequently asked",
      h2: "Public viewing at STORIA – the short version.",
      items: [
        {
          question: "Where can you watch public viewing in Munich?",
          answer:
            "At STORIA in Maxvorstadt, Karlstraße 47a – a few minutes' walk from Königsplatz, on our covered terrace.",
        },
        {
          question: "How do you get to STORIA?",
          answer: "The Karlstraße tram stop is right outside the door – just one stop from the main station.",
        },
        {
          question: "Can you book a table for public viewing?",
          answer: "Yes, through our booking form. For groups, we recommend enquiring early.",
        },
        {
          question: "Which matches do you show?",
          answer:
            "The major tournaments (Euros, World Cup) as well as Champions League and cup highlights. We announce dates ahead of each occasion.",
        },
        {
          question: "What happens if the weather turns?",
          answer:
            "The terrace is genuinely covered — not by an awning or a sail canopy, but built right into the building: the house continues over it like a proper roof. A short rain shower is no problem at all, and on a warm evening you'll barely notice it's raining — sitting outside under a real roof is a rarity in Munich.",
        },
      ],
      disclaimer:
        "This page has no official connection to FIFA or UEFA. Tournament details and dates subject to change.",
    },
  },
  it: {
    seo: {
      title: "Public Viewing Monaco di Baviera – Calcio dal Vivo allo STORIA",
      description:
        "Public viewing a Monaco: calcio dal vivo sulla terrazza coperta dello STORIA, Maxvorstadt vicino a Königsplatz. Europei, Mondiali, Champions League e coppe – prenota il tuo tavolo.",
    },
    nav: {
      rueckblick: "Mondiali 2026",
      ausblick: "Euro 2028",
      reservieren: "Prenota un tavolo",
    },
    hero: {
      eyebrow: "Public Viewing · Maxvorstadt · Königsplatz",
      h1: {
        pre: "Public viewing a Monaco – calcio dal vivo allo ",
        em: "STORIA",
        post: " (Maxvorstadt, vicino a Königsplatz)",
      },
      intro:
        "Le grandi partite non si guardano da soli a casa. Allo STORIA ogni partita importante va in onda sulla terrazza coperta – nel cuore di Maxvorstadt, a pochi minuti a piedi da Königsplatz. La fermata del tram Karlstraße è proprio davanti alla porta, a una sola fermata dalla stazione centrale – ci arrivi comodamente senza auto, andata e ritorno. Il tutto con aperitivo, pizza dal forno a pietra a 400 gradi e l'atmosfera di una serata in Italia. Europei, Mondiali, finale di Champions League o di coppa: da noi sei nel vivo dell'azione.",
      ctaReserve: "Prenota un tavolo per la prossima partita",
    },
    rueckblick: {
      eyebrow: "Uno sguardo indietro",
      h2: "I Mondiali 2026",
      body: "La prima estate mondiale in Nord America è già storia – e che storia. 48 squadre, 104 partite, e alla fine la Spagna ha alzato la coppa per la seconda volta: 1-0 contro l'Argentina, deciso solo ai supplementari da Ferran Torres. Per la Spagna il secondo titolo dopo il 2010, per Lionel Messi probabilmente l'ultimo Mondiale. Da noi tutte le partite sono andate in onda in terrazza, dai primi fischi d'inizio fino alla grappa di mezzanotte. Grazie a tutti quelli che hanno tifato con noi.",
    },
    ausblick: {
      eyebrow: "Uno sguardo avanti",
      h2: "Euro 2028",
      body: "Dopo i Mondiali arrivano gli Europei. Dal 9 giugno al 9 luglio 2028, 24 nazionali si contenderanno il titolo continentale – ospitanti sono Inghilterra, Scozia, Galles e Irlanda, con la finale al Wembley di Londra. Il sorteggio delle qualificazioni è già fissato per il 6 dicembre 2026. Allo STORIA una cosa è già certa: torneremo a trasmettere ogni partita in terrazza. Chi prenota prima, si assicura il posto migliore.",
      ganzjahr:
        "Fino ad allora il calcio non si ferma mai: serate di Champions League, finali di coppa, gli Europei femminili – le grandi partite le vediamo da noi tutto l'anno.",
      ctaReserve: "Prenota un tavolo",
    },
    newsletter: {
      h2: "Resta aggiornato",
      body: "Appena sarà pronto il calendario degli Europei e apriranno le prenotazioni anticipate dei tavoli, te lo faremo sapere – per tempo e senza spam.",
    },
    gruppen: {
      h2: "Per gruppi e aziende",
      body: "Volete guardare insieme? Serate private di public viewing e catering su",
      linkLabel: "events-storia.de",
    },
    reservieren: {
      eyebrow: "Assicurati il posto",
      h2: "Prenota",
      lead: "Nei giorni delle grandi partite i tavoli si esauriscono in fretta. Assicurati il tuo posto in terrazza o al chiuso – basta una breve prenotazione.",
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
      hauptbahnhof: {
        pre: "A una sola fermata di tram dalla stazione centrale – comodo anche se arrivi direttamente in treno: il nostro ",
        anchor: "ristorante italiano vicino alla stazione centrale",
        post: ".",
      },
    },
    faq: {
      eyebrow: "Domande frequenti",
      h2: "Public viewing allo STORIA – in breve.",
      items: [
        {
          question: "Dove si può guardare il public viewing a Monaco?",
          answer:
            "Allo STORIA, in Maxvorstadt, Karlstraße 47a – a pochi minuti a piedi da Königsplatz, sulla terrazza coperta.",
        },
        {
          question: "Come si arriva allo STORIA?",
          answer: "La fermata del tram Karlstraße è proprio davanti alla porta – a una sola fermata dalla stazione centrale.",
        },
        {
          question: "Si può prenotare un tavolo per il public viewing?",
          answer: "Sì, tramite la nostra prenotazione. Per i gruppi consigliamo di richiedere per tempo.",
        },
        {
          question: "Quali partite trasmettete?",
          answer:
            "I grandi tornei (Europei, Mondiali) e i momenti clou di Champions League e coppe. Comunichiamo le date prima di ogni occasione.",
        },
        {
          question: "Cosa succede se il tempo peggiora?",
          answer:
            "La terrazza è davvero coperta – non con una tenda o un telo parasole, ma integrata nell'edificio stesso: la casa si prolunga sopra di essa come un vero tetto. Un breve acquazzone non è un problema, e se fa caldo non ve ne accorgerete quasi. Sedersi all'aperto sotto un tetto vero è una rarità a Monaco di Baviera.",
        },
      ],
      disclaimer:
        "Questa pagina non ha alcun legame ufficiale con la FIFA o la UEFA. Dettagli su tornei e date salvo modifiche.",
    },
  },
  fr: {
    seo: {
      title: "Public Viewing Munich – Football en Direct au STORIA",
      description:
        "Public viewing à Munich : le foot en direct sur la terrasse couverte du STORIA, Maxvorstadt près de Königsplatz. Euro, Coupe du monde, Ligue des champions et coupes – réservez votre table.",
    },
    nav: {
      rueckblick: "Coupe du monde 2026",
      ausblick: "Euro 2028",
      reservieren: "Réserver une table",
    },
    hero: {
      eyebrow: "Public Viewing · Maxvorstadt · Königsplatz",
      h1: {
        pre: "Public viewing à Munich – le foot en direct au ",
        em: "STORIA",
        post: " (Maxvorstadt, près de Königsplatz)",
      },
      intro:
        "Les grands matchs ne se regardent pas seul chez soi. Au STORIA, chaque match important est diffusé sur la terrasse couverte – en plein Maxvorstadt, à quelques minutes à pied de Königsplatz. L'arrêt de tram Karlstraße est juste devant la porte, à un seul arrêt de la gare centrale – tu y viens et en repars sans voiture, en toute simplicité. Avec ça, un apéritif, une pizza sortie du four à pierre à 400°C et l'ambiance d'une soirée en Italie. Euro, Coupe du monde, finale de Ligue des champions ou de coupe : chez nous, tu es en plein cœur de l'action.",
      ctaReserve: "Réserver une table pour le prochain match",
    },
    rueckblick: {
      eyebrow: "Rétrospective",
      h2: "La Coupe du monde 2026",
      body: "Le premier été de Coupe du monde en Amérique du Nord appartient déjà à l'histoire – et quelle histoire. 48 équipes, 104 matchs, et au final l'Espagne a soulevé le trophée pour la deuxième fois : 1-0 face à l'Argentine, décidé seulement en prolongation par Ferran Torres. Le deuxième titre pour l'Espagne après 2010, et sans doute la dernière Coupe du monde de Lionel Messi. Chez nous, tous les matchs sont passés sur la terrasse, du coup d'envoi matinal jusqu'à la grappa tardive. Merci à tous ceux qui ont vibré avec nous.",
    },
    ausblick: {
      eyebrow: "En perspective",
      h2: "L'Euro 2028",
      body: "Après la Coupe du monde vient l'Euro. Du 9 juin au 9 juillet 2028, 24 nations disputeront le championnat d'Europe – organisé par l'Angleterre, l'Écosse, le Pays de Galles et l'Irlande, avec la finale à Wembley à Londres. Le tirage au sort des qualifications a déjà lieu le 6 décembre 2026. Au STORIA, une chose est sûre : nous rouvrirons la terrasse pour chaque match. Les plus rapides s'assurent la meilleure place.",
      ganzjahr:
        "D'ici là, le foot ne s'arrête jamais : soirées de Ligue des champions, finales de coupe, l'Euro féminin – les grands matchs passent chez nous toute l'année.",
      ctaReserve: "Réserver une table",
    },
    newsletter: {
      h2: "Reste informé",
      body: "Dès que le calendrier de l'Euro sera connu et que les préréservations de tables ouvriront, on te le fera savoir – à temps, et sans spam.",
    },
    gruppen: {
      h2: "Pour les groupes et entreprises",
      body: "Vous voulez regarder ensemble ? Soirées privées de public viewing et traiteur via",
      linkLabel: "events-storia.de",
    },
    reservieren: {
      eyebrow: "Réservez votre place",
      h2: "Réserver",
      lead: "Les jours de grands matchs, les tables partent vite. Réservez votre place sur la terrasse ou à l'intérieur – une courte réservation suffit.",
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
      hauptbahnhof: {
        pre: "À un seul arrêt de tram de la gare centrale – pratique aussi si tu arrives directement de la gare : notre ",
        anchor: "restaurant italien près de la gare centrale",
        post: ".",
      },
    },
    faq: {
      eyebrow: "Questions fréquentes",
      h2: "Public viewing au STORIA – en bref.",
      items: [
        {
          question: "Où regarder le public viewing à Munich ?",
          answer:
            "Au STORIA, dans le quartier de Maxvorstadt, Karlstraße 47a – à quelques minutes à pied de Königsplatz, sur la terrasse couverte.",
        },
        {
          question: "Comment se rendre au STORIA ?",
          answer: "L'arrêt de tram Karlstraße se trouve juste devant la porte – à un seul arrêt de la gare centrale.",
        },
        {
          question: "Peut-on réserver une table pour le public viewing ?",
          answer: "Oui, via notre formulaire de réservation. Pour les groupes, nous recommandons de réserver tôt.",
        },
        {
          question: "Quels matchs diffusez-vous ?",
          answer:
            "Les grands tournois (Euro, Coupe du monde) ainsi que les temps forts de la Ligue des champions et des coupes. Nous annonçons les dates avant chaque occasion.",
        },
        {
          question: "Que se passe-t-il s'il pleut ?",
          answer:
            "La terrasse est vraiment couverte – pas par un store ou une voile d'ombrage, mais intégrée directement au bâtiment : la maison se prolonge au-dessus comme un vrai toit. Une petite averse n'est donc pas un problème, et s'il fait chaud, on ne s'en aperçoit presque pas – s'asseoir dehors sous un vrai toit est une rareté à Munich.",
        },
      ],
      disclaimer:
        "Cette page n'a aucun lien officiel avec la FIFA ou l'UEFA. Détails des tournois et dates sous réserve de modifications.",
    },
  },
};
