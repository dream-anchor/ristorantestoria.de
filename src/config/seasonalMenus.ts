/**
 * Seasonal Menu Configuration
 *
 * Defines permanent URLs for recurring events (Christmas, NYE, Valentine's, etc.).
 * These pages always exist and remain indexed, even when the event is not active.
 *
 * - isActive=true  → Full menu content from Supabase
 * - isActive=false → Placeholder page ("Coming soon — contact us")
 *
 * IMPORTANT: Never add noindex for inactive seasonal pages!
 * Only the prominent internal linking (navigation highlight, homepage banner)
 * is toggled dynamically based on isActive.
 */

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
