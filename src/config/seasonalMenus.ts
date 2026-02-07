/**
 * Seasonal Menu Configuration
 *
 * Defines permanent URLs for recurring events (Christmas, NYE, Valentine's, etc.).
 * These pages always exist and remain indexed, even when the event is not active.
 *
 * - isActive=true  → Full menu content from Supabase
 * - isActive=false → Enhanced placeholder page with signup form + archived menu
 *
 * IMPORTANT: Never add noindex for inactive seasonal pages!
 * Only the prominent internal linking (navigation highlight, homepage banner)
 * is toggled dynamically based on isActive.
 */

export interface SeasonalFAQ {
  question: string;
  answer: string;
}

export interface SeasonalMenuConfig {
  /** Unique key for this event */
  key: string;
  /** Whether the event is currently active (live content available) */
  isActive: boolean;
  /** Permanent SEO slugs per language */
  slugs: Record<string, string>;
  /** Display titles per language */
  titles: Record<string, string>;
  /** Placeholder text per language (shown when isActive=false) */
  placeholder: Record<string, string>;
  /** Path to hero image asset (imported) */
  heroImage?: string;
  /** Month when menu is typically published, per language */
  expectedMonth: Record<string, string>;
  /** 2-3 descriptive paragraphs per language for the placeholder page */
  descriptions: Record<string, string[]>;
  /** FAQ entries per language (shown on placeholder page) */
  faq: Record<string, SeasonalFAQ[]>;
}

export const SEASONAL_MENUS: SeasonalMenuConfig[] = [
  {
    key: 'valentinstag',
    isActive: true,
    slugs: {
      de: 'valentinstag-menue',
      en: 'valentines-menu',
      it: 'san-valentino-menu',
      fr: 'saint-valentin-menu',
    },
    titles: {
      de: 'Valentinstag-Menü',
      en: "Valentine's Day Menu",
      it: 'Menù di San Valentino',
      fr: 'Menu de la Saint-Valentin',
    },
    placeholder: {
      de: 'Unser Valentinstag-Menü wird bald veröffentlicht. Kontaktieren Sie uns für Reservierungen.',
      en: "Our Valentine's Day menu will be published soon. Contact us for reservations.",
      it: 'Il nostro menù di San Valentino sarà pubblicato a breve. Contattateci per prenotazioni.',
      fr: 'Notre menu de la Saint-Valentin sera bientôt publié. Contactez-nous pour réserver.',
    },
    expectedMonth: {
      de: 'Januar',
      en: 'January',
      it: 'gennaio',
      fr: 'janvier',
    },
    descriptions: {
      de: [
        'Feiern Sie den Tag der Liebe im STORIA – Ihrem italienischen Restaurant im Herzen von München Maxvorstadt. In romantischer Atmosphäre bei Kerzenschein und ausgewählten Weinen erleben Sie einen unvergesslichen Abend zu zweit.',
        'Unser Küchenchef kreiert jedes Jahr ein besonderes Valentinstag-Menü mit den besten saisonalen Zutaten der italienischen Küche. Von hausgemachter Pasta bis hin zu raffinierten Desserts – jeder Gang ist eine Liebeserklärung an die kulinarische Kunst Italiens.',
        'Reservieren Sie frühzeitig, da die Plätze für den Valentinstag begrenzt sind. Für Reservierungen und Sonderwünsche stehen wir Ihnen gerne persönlich zur Verfügung.',
      ],
      en: [
        "Celebrate the day of love at STORIA – your Italian restaurant in the heart of Munich Maxvorstadt. In a romantic atmosphere with candlelight and selected wines, enjoy an unforgettable evening for two.",
        "Our chef creates a special Valentine's Day menu each year featuring the finest seasonal ingredients of Italian cuisine. From handmade pasta to refined desserts – every course is a declaration of love for Italy's culinary art.",
        "Book early as seating for Valentine's Day is limited. For reservations and special requests, we are happy to assist you personally.",
      ],
      it: [
        "Celebrate il giorno dell'amore al STORIA – il vostro ristorante italiano nel cuore di Monaco Maxvorstadt. In un'atmosfera romantica a lume di candela e con vini selezionati, godetevi una serata indimenticabile per due.",
        "Il nostro chef crea ogni anno un menù speciale per San Valentino con i migliori ingredienti stagionali della cucina italiana. Dalla pasta fatta in casa ai dessert raffinati – ogni portata è una dichiarazione d'amore per l'arte culinaria italiana.",
        'Prenotate in anticipo poiché i posti per San Valentino sono limitati. Per prenotazioni e richieste speciali, siamo a vostra disposizione.',
      ],
      fr: [
        "Célébrez la fête de l'amour au STORIA – votre restaurant italien au cœur de Munich Maxvorstadt. Dans une atmosphère romantique aux chandelles et avec des vins sélectionnés, savourez une soirée inoubliable à deux.",
        "Notre chef crée chaque année un menu spécial Saint-Valentin avec les meilleurs ingrédients de saison de la cuisine italienne. Des pâtes artisanales aux desserts raffinés – chaque plat est une déclaration d'amour à l'art culinaire italien.",
        'Réservez tôt car les places pour la Saint-Valentin sont limitées. Pour les réservations et demandes spéciales, nous sommes à votre disposition.',
      ],
    },
    faq: {
      de: [
        { question: 'Wann wird das Valentinstag-Menü veröffentlicht?', answer: 'Unser Valentinstag-Menü wird in der Regel Anfang Januar veröffentlicht. Lassen Sie sich vormerken, um als Erster informiert zu werden.' },
        { question: 'Wie kann ich für den Valentinstag reservieren?', answer: 'Sobald das Menü veröffentlicht ist, können Sie telefonisch unter +49 89 51519696 oder per E-Mail an info@ristorantestoria.de reservieren.' },
        { question: 'Für wie viele Personen ist das Valentinstag-Menü gedacht?', answer: 'Das Menü ist als Dinner für zwei Personen konzipiert. Größere Gruppen sind auf Anfrage möglich.' },
        { question: 'Was kostet das Valentinstag-Menü ungefähr?', answer: 'Die Preise variieren je nach Menü. Orientieren Sie sich gerne an unserem Vorjahresmenü als Referenz.' },
      ],
      en: [
        { question: "When will the Valentine's Day menu be published?", answer: "Our Valentine's Day menu is typically published in early January. Sign up to be the first to know." },
        { question: "How can I reserve for Valentine's Day?", answer: 'Once the menu is published, you can reserve by phone at +49 89 51519696 or by email at info@ristorantestoria.de.' },
        { question: "How many people is the Valentine's menu designed for?", answer: 'The menu is designed as a dinner for two. Larger groups are available upon request.' },
        { question: "What does the Valentine's Day menu cost approximately?", answer: "Prices vary by menu. Feel free to use last year's menu as a reference." },
      ],
      it: [
        { question: 'Quando verrà pubblicato il menù di San Valentino?', answer: 'Il nostro menù di San Valentino viene solitamente pubblicato all\'inizio di gennaio. Registratevi per essere i primi a saperlo.' },
        { question: 'Come posso prenotare per San Valentino?', answer: 'Una volta pubblicato il menù, potete prenotare telefonicamente al +49 89 51519696 o via email a info@ristorantestoria.de.' },
        { question: 'Per quante persone è pensato il menù di San Valentino?', answer: 'Il menù è pensato come cena per due persone. Gruppi più numerosi sono disponibili su richiesta.' },
        { question: 'Quanto costa approssimativamente il menù di San Valentino?', answer: "I prezzi variano in base al menù. Consultate il menù dell'anno scorso come riferimento." },
      ],
      fr: [
        { question: 'Quand le menu de la Saint-Valentin sera-t-il publié ?', answer: 'Notre menu de la Saint-Valentin est généralement publié début janvier. Inscrivez-vous pour être le premier informé.' },
        { question: 'Comment puis-je réserver pour la Saint-Valentin ?', answer: 'Dès la publication du menu, vous pouvez réserver par téléphone au +49 89 51519696 ou par e-mail à info@ristorantestoria.de.' },
        { question: 'Pour combien de personnes le menu est-il conçu ?', answer: 'Le menu est conçu comme un dîner pour deux personnes. Des groupes plus importants sont possibles sur demande.' },
        { question: 'Quel est le prix approximatif du menu ?', answer: "Les prix varient selon le menu. N'hésitez pas à consulter le menu de l'année dernière comme référence." },
      ],
    },
  },
  {
    key: 'weihnachten',
    isActive: false,
    slugs: {
      de: 'weihnachtsmenue',
      en: 'christmas-menu',
      it: 'natale-menu',
      fr: 'noel-menu',
    },
    titles: {
      de: 'Weihnachtsmenü',
      en: 'Christmas Menu',
      it: 'Menù di Natale',
      fr: 'Menu de Noël',
    },
    placeholder: {
      de: 'Unser Weihnachtsmenü wird bald veröffentlicht. Kontaktieren Sie uns für Reservierungen.',
      en: 'Our Christmas menu will be published soon. Contact us for reservations.',
      it: 'Il nostro menù di Natale sarà pubblicato a breve. Contattateci per prenotazioni.',
      fr: 'Notre menu de Noël sera bientôt publié. Contactez-nous pour réserver.',
    },
    expectedMonth: {
      de: 'November',
      en: 'November',
      it: 'novembre',
      fr: 'novembre',
    },
    descriptions: {
      de: [
        'Erleben Sie die Weihnachtszeit im STORIA – Ihrem italienischen Restaurant in München Maxvorstadt. Ob Firmenweihnachtsfeier, Familienessen oder ein festliches Dinner mit Freunden – in unserem stilvollen Ambiente feiern Sie die schönste Zeit des Jahres auf italienische Art.',
        'Unser Küchenchef verwöhnt Sie mit einem festlichen Weihnachtsmenü, das die Traditionen der italienischen Küche mit saisonalen Spezialitäten vereint. Genießen Sie erlesene Gänge, begleitet von ausgewählten italienischen Weinen.',
        'Reservieren Sie frühzeitig für Ihre Weihnachtsfeier – besonders für größere Gruppen empfehlen wir eine rechtzeitige Anfrage. Wir beraten Sie gerne bei der Planung Ihres Events.',
      ],
      en: [
        "Experience the Christmas season at STORIA – your Italian restaurant in Munich Maxvorstadt. Whether corporate Christmas dinner, family gathering, or a festive dinner with friends – celebrate the most wonderful time of the year Italian-style in our stylish setting.",
        'Our chef pampers you with a festive Christmas menu that combines the traditions of Italian cuisine with seasonal specialties. Enjoy exquisite courses accompanied by selected Italian wines.',
        'Book early for your Christmas celebration – we especially recommend advance booking for larger groups. We are happy to help you plan your event.',
      ],
      it: [
        "Vivete il periodo natalizio al STORIA – il vostro ristorante italiano a Monaco Maxvorstadt. Che si tratti di una cena aziendale di Natale, un pranzo in famiglia o una cena festiva con amici – celebrate il periodo più bello dell'anno all'italiana nel nostro ambiente elegante.",
        'Il nostro chef vi vizia con un menù natalizio festivo che unisce le tradizioni della cucina italiana con specialità stagionali. Gustate portate squisite accompagnate da vini italiani selezionati.',
        'Prenotate in anticipo per la vostra celebrazione natalizia – raccomandiamo soprattutto una prenotazione anticipata per gruppi numerosi. Saremo lieti di aiutarvi nella pianificazione del vostro evento.',
      ],
      fr: [
        "Vivez la période de Noël au STORIA – votre restaurant italien à Munich Maxvorstadt. Que ce soit un dîner de Noël d'entreprise, un repas en famille ou un dîner festif entre amis – célébrez la plus belle période de l'année à l'italienne dans notre cadre élégant.",
        'Notre chef vous gâte avec un menu de Noël festif qui allie les traditions de la cuisine italienne aux spécialités de saison. Dégustez des plats exquis accompagnés de vins italiens sélectionnés.',
        'Réservez tôt pour votre fête de Noël – nous recommandons particulièrement une réservation anticipée pour les grands groupes. Nous serons ravis de vous aider à planifier votre événement.',
      ],
    },
    faq: {
      de: [
        { question: 'Wann wird das Weihnachtsmenü veröffentlicht?', answer: 'Unser Weihnachtsmenü wird in der Regel Anfang November veröffentlicht. Lassen Sie sich vormerken, um als Erster informiert zu werden.' },
        { question: 'Wie kann ich für die Weihnachtsfeier reservieren?', answer: 'Sobald das Menü veröffentlicht ist, können Sie telefonisch unter +49 89 51519696 oder per E-Mail an info@ristorantestoria.de reservieren. Für größere Gruppen empfehlen wir eine frühzeitige Anfrage.' },
        { question: 'Für wie viele Personen eignet sich das Restaurant?', answer: 'Wir bieten Platz für Gruppen von 2 bis 120 Personen. Für Firmen-Events und größere Feiern ist auch eine exklusive Nutzung möglich.' },
        { question: 'Was kostet das Weihnachtsmenü ungefähr?', answer: 'Die Preise variieren je nach gewähltem Menü. Orientieren Sie sich gerne an unserem Vorjahresmenü als Referenz oder kontaktieren Sie uns für ein individuelles Angebot.' },
      ],
      en: [
        { question: 'When will the Christmas menu be published?', answer: 'Our Christmas menu is typically published in early November. Sign up to be the first to know.' },
        { question: 'How can I reserve for the Christmas dinner?', answer: 'Once the menu is published, you can reserve by phone at +49 89 51519696 or by email at info@ristorantestoria.de. For larger groups, we recommend booking early.' },
        { question: 'How many people can the restaurant accommodate?', answer: 'We accommodate groups from 2 to 120 guests. Exclusive use of the restaurant is also available for corporate events and larger celebrations.' },
        { question: 'What does the Christmas menu cost approximately?', answer: "Prices vary by menu selection. Feel free to use last year's menu as a reference or contact us for a custom offer." },
      ],
      it: [
        { question: 'Quando verrà pubblicato il menù di Natale?', answer: 'Il nostro menù di Natale viene solitamente pubblicato all\'inizio di novembre. Registratevi per essere i primi a saperlo.' },
        { question: 'Come posso prenotare per la cena di Natale?', answer: 'Una volta pubblicato il menù, potete prenotare telefonicamente al +49 89 51519696 o via email a info@ristorantestoria.de. Per gruppi numerosi, consigliamo una prenotazione anticipata.' },
        { question: 'Quante persone può ospitare il ristorante?', answer: "Ospitiamo gruppi da 2 a 120 persone. Per eventi aziendali e grandi celebrazioni è disponibile anche l'uso esclusivo del ristorante." },
        { question: 'Quanto costa approssimativamente il menù di Natale?', answer: "I prezzi variano in base al menù scelto. Consultate il menù dell'anno scorso come riferimento o contattateci per un'offerta personalizzata." },
      ],
      fr: [
        { question: 'Quand le menu de Noël sera-t-il publié ?', answer: 'Notre menu de Noël est généralement publié début novembre. Inscrivez-vous pour être le premier informé.' },
        { question: 'Comment puis-je réserver pour le dîner de Noël ?', answer: 'Dès la publication du menu, vous pouvez réserver par téléphone au +49 89 51519696 ou par e-mail à info@ristorantestoria.de. Pour les grands groupes, nous recommandons une réservation anticipée.' },
        { question: 'Combien de personnes le restaurant peut-il accueillir ?', answer: "Nous accueillons des groupes de 2 à 120 personnes. L'utilisation exclusive du restaurant est également possible pour les événements d'entreprise et grandes célébrations." },
        { question: 'Quel est le prix approximatif du menu de Noël ?', answer: "Les prix varient selon le menu choisi. N'hésitez pas à consulter le menu de l'année dernière comme référence ou contactez-nous pour une offre personnalisée." },
      ],
    },
  },
  {
    key: 'silvester',
    isActive: false,
    slugs: {
      de: 'silvester',
      en: 'new-years-eve',
      it: 'capodanno',
      fr: 'nouvel-an',
    },
    titles: {
      de: 'Silvester',
      en: "New Year's Eve",
      it: 'Capodanno',
      fr: 'Nouvel An',
    },
    placeholder: {
      de: 'Unser Silvester-Programm wird bald veröffentlicht. Kontaktieren Sie uns für Reservierungen.',
      en: "Our New Year's Eve program will be published soon. Contact us for reservations.",
      it: 'Il nostro programma di Capodanno sarà pubblicato a breve. Contattateci per prenotazioni.',
      fr: 'Notre programme du Nouvel An sera bientôt publié. Contactez-nous pour réserver.',
    },
    expectedMonth: {
      de: 'November',
      en: 'November',
      it: 'novembre',
      fr: 'novembre',
    },
    descriptions: {
      de: [
        'Begrüßen Sie das neue Jahr im STORIA – Ihrem italienischen Restaurant in München Maxvorstadt. Feiern Sie den Jahreswechsel mit einem exklusiven Silvester-Menü, Live-Musik und einem Mitternachts-Prosecco in unserem festlich geschmückten Restaurant.',
        'Unser Küchenchef kreiert für den letzten Abend des Jahres ein besonderes Gala-Menü, das die besten Aromen der italienischen Küche vereint. Genießen Sie einen unvergesslichen Abend mit feinen Gängen, erlesenen Weinen und dem Countdown ins neue Jahr.',
        'Die Plätze für unsere Silvesterfeier sind sehr begrenzt. Sichern Sie sich frühzeitig Ihren Tisch und starten Sie stilvoll ins neue Jahr.',
      ],
      en: [
        "Welcome the new year at STORIA – your Italian restaurant in Munich Maxvorstadt. Celebrate the turn of the year with an exclusive New Year's Eve menu, live music, and a midnight Prosecco toast in our festively decorated restaurant.",
        "Our chef creates a special gala menu for the last evening of the year, combining the finest flavors of Italian cuisine. Enjoy an unforgettable evening with exquisite courses, selected wines, and the countdown to the new year.",
        "Seating for our New Year's Eve celebration is very limited. Secure your table early and start the new year in style.",
      ],
      it: [
        "Date il benvenuto al nuovo anno al STORIA – il vostro ristorante italiano a Monaco Maxvorstadt. Celebrate il cambio dell'anno con un esclusivo menù di Capodanno, musica dal vivo e un brindisi di mezzanotte con Prosecco nel nostro ristorante addobbato a festa.",
        "Il nostro chef crea un menù gala speciale per l'ultima sera dell'anno, combinando i migliori sapori della cucina italiana. Godetevi una serata indimenticabile con portate squisite, vini selezionati e il conto alla rovescia verso il nuovo anno.",
        'I posti per la nostra festa di Capodanno sono molto limitati. Assicuratevi il vostro tavolo in anticipo e iniziate il nuovo anno con stile.',
      ],
      fr: [
        "Accueillez la nouvelle année au STORIA – votre restaurant italien à Munich Maxvorstadt. Célébrez le passage à la nouvelle année avec un menu exclusif du Nouvel An, de la musique live et un toast au Prosecco à minuit dans notre restaurant festif.",
        "Notre chef crée un menu gala spécial pour la dernière soirée de l'année, alliant les meilleures saveurs de la cuisine italienne. Profitez d'une soirée inoubliable avec des plats exquis, des vins sélectionnés et le compte à rebours vers la nouvelle année.",
        'Les places pour notre célébration du Nouvel An sont très limitées. Réservez votre table tôt et commencez la nouvelle année avec style.',
      ],
    },
    faq: {
      de: [
        { question: 'Wann wird das Silvester-Programm veröffentlicht?', answer: 'Unser Silvester-Programm wird in der Regel im November veröffentlicht. Lassen Sie sich vormerken, um als Erster informiert zu werden.' },
        { question: 'Wie kann ich für Silvester reservieren?', answer: 'Sobald das Programm veröffentlicht ist, können Sie telefonisch unter +49 89 51519696 oder per E-Mail an info@ristorantestoria.de reservieren.' },
        { question: 'Für wie viele Personen eignet sich die Silvesterfeier?', answer: 'Unsere Silvesterfeier bietet Platz für Paare, Freundesgruppen und Firmen. Für größere Gruppen erstellen wir gerne ein individuelles Angebot.' },
        { question: 'Was kostet die Silvesterfeier ungefähr?', answer: 'Die Preise variieren je nach Programm und beinhalten in der Regel das Menü, Getränke und Unterhaltung. Orientieren Sie sich gerne an unserem Vorjahresprogramm als Referenz.' },
      ],
      en: [
        { question: "When will the New Year's Eve program be published?", answer: "Our New Year's Eve program is typically published in November. Sign up to be the first to know." },
        { question: "How can I reserve for New Year's Eve?", answer: 'Once the program is published, you can reserve by phone at +49 89 51519696 or by email at info@ristorantestoria.de.' },
        { question: "How many people can attend the New Year's Eve celebration?", answer: "Our New Year's Eve celebration accommodates couples, friend groups, and corporate events. For larger groups, we are happy to create a custom offer." },
        { question: "What does the New Year's Eve celebration cost approximately?", answer: "Prices vary by program and typically include the menu, drinks, and entertainment. Feel free to use last year's program as a reference." },
      ],
      it: [
        { question: 'Quando verrà pubblicato il programma di Capodanno?', answer: 'Il nostro programma di Capodanno viene solitamente pubblicato a novembre. Registratevi per essere i primi a saperlo.' },
        { question: 'Come posso prenotare per Capodanno?', answer: 'Una volta pubblicato il programma, potete prenotare telefonicamente al +49 89 51519696 o via email a info@ristorantestoria.de.' },
        { question: 'Per quante persone è adatta la festa di Capodanno?', answer: 'La nostra festa di Capodanno accoglie coppie, gruppi di amici ed eventi aziendali. Per gruppi più numerosi, siamo lieti di creare un\'offerta personalizzata.' },
        { question: 'Quanto costa approssimativamente la festa di Capodanno?', answer: "I prezzi variano in base al programma e generalmente includono il menù, le bevande e l'intrattenimento. Consultate il programma dell'anno scorso come riferimento." },
      ],
      fr: [
        { question: 'Quand le programme du Nouvel An sera-t-il publié ?', answer: 'Notre programme du Nouvel An est généralement publié en novembre. Inscrivez-vous pour être le premier informé.' },
        { question: 'Comment puis-je réserver pour le Nouvel An ?', answer: 'Dès la publication du programme, vous pouvez réserver par téléphone au +49 89 51519696 ou par e-mail à info@ristorantestoria.de.' },
        { question: 'Pour combien de personnes la fête du Nouvel An est-elle adaptée ?', answer: "Notre célébration du Nouvel An accueille les couples, groupes d'amis et événements d'entreprise. Pour les grands groupes, nous créons volontiers une offre personnalisée." },
        { question: 'Quel est le prix approximatif de la fête du Nouvel An ?', answer: "Les prix varient selon le programme et incluent généralement le menu, les boissons et l'animation. N'hésitez pas à consulter le programme de l'année dernière comme référence." },
      ],
    },
  },
];

/** Parent slugs for special occasions per language */
export const PARENT_SLUGS: Record<string, string> = {
  de: 'besondere-anlaesse',
  en: 'special-occasions',
  it: 'occasioni-speciali',
  fr: 'occasions-speciales',
};

/**
 * Find a seasonal menu config by URL slug (checks all languages)
 */
export const findSeasonalMenuBySlug = (slug: string): SeasonalMenuConfig | undefined => {
  return SEASONAL_MENUS.find((menu) =>
    Object.values(menu.slugs).includes(slug)
  );
};

/**
 * Get all seasonal routes for prerendering (all languages)
 */
export const getSeasonalRoutes = (): string[] => {
  const routes: string[] = [];
  const langs = ['de', 'en', 'it', 'fr'];

  for (const menu of SEASONAL_MENUS) {
    for (const lang of langs) {
      const parentSlug = PARENT_SLUGS[lang];
      const menuSlug = menu.slugs[lang];
      const path = lang === 'de'
        ? `/${parentSlug}/${menuSlug}`
        : `/${lang}/${parentSlug}/${menuSlug}`;
      routes.push(path);
    }
  }

  return routes;
};
