import { Helmet } from '@/lib/helmetAsync';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMenu, useMenuById, MenuType } from '@/hooks/useMenu';
import { STORIA } from '@/config/storia-entity';
import allSlugs from '@/config/slugs.json';

interface MenuStructuredDataProps {
  menuType?: MenuType;
  menuId?: string;
}

// schema.org inLanguage-Codes für alle unterstützten Sprachen
const IN_LANGUAGE: Record<string, string> = {
  de: 'de-DE',
  en: 'en-US',
  it: 'it-IT',
  fr: 'fr-FR',
};

// Basis-Slug (DE) je Menü-Typ – wird über slugs.json lokalisiert
const MENU_TYPE_BASE_SLUG: Record<string, string> = {
  food: 'speisekarte',
  lunch: 'mittags-menu',
  drinks: 'getraenke',
};

/**
 * Preis für schema.org: numerischer Wert mit Punkt-Dezimal, ohne
 * Währungssymbol. Liefert null, wenn kein numerischer Preis ermittelbar ist –
 * dann wird offers komplett weggelassen statt invalide gesetzt.
 */
const toSchemaPrice = (
  price: number | null | undefined,
  priceDisplay: string | null | undefined
): string | null => {
  if (typeof price === 'number' && Number.isFinite(price)) {
    return price.toFixed(2);
  }
  if (priceDisplay) {
    // z. B. "15,90 €" oder "€12.50" → "15.90" / "12.50"
    const cleaned = priceDisplay.replace(/[^\d,.]/g, '').replace(',', '.');
    const parsed = parseFloat(cleaned);
    if (Number.isFinite(parsed) && parsed > 0) {
      return parsed.toFixed(2);
    }
  }
  return null;
};

const MenuStructuredData = ({ menuType, menuId }: MenuStructuredDataProps) => {
  const { language } = useLanguage();

  // Fetch menu data based on type or id
  const { data: menuByType } = useMenu(menuType || 'food');
  const { data: menuById } = useMenuById(menuId);

  const menu = menuId ? menuById : menuByType;

  if (!menu || !menu.categories || menu.categories.length === 0) {
    return null;
  }

  // Lokalisierter Text für die aktive Sprache mit Fallback auf Deutsch –
  // kein Mehr-Sprachen-Gemisch innerhalb eines JSON-LD-Blocks
  const localized = (
    de: string | null,
    en: string | null,
    it: string | null,
    fr: string | null
  ): string | null => {
    if (language === 'en' && en) return en;
    if (language === 'it' && it) return it;
    if (language === 'fr' && fr) return fr;
    return de;
  };

  const menuName = localized(menu.title, menu.title_en, menu.title_it, menu.title_fr)
    || (menuType === 'food' ? 'Speisekarte' : menuType === 'lunch' ? 'Mittagsmenü' : 'Getränkekarte');

  const menuDescription = localized(menu.subtitle, menu.subtitle_en, menu.subtitle_it, menu.subtitle_fr) || '';

  // Build MenuSection array from categories
  const menuSections = menu.categories.map(category => {
    const categoryName = localized(category.name, category.name_en, category.name_it, category.name_fr);
    const categoryDescription = localized(
      category.description,
      category.description_en,
      category.description_it,
      category.description_fr
    );

    // Build MenuItem array
    const menuItems = category.items.map(item => {
      const itemName = localized(item.name, item.name_en, item.name_it, item.name_fr);
      const itemDescription = localized(
        item.description,
        item.description_en,
        item.description_it,
        item.description_fr
      );

      const menuItem: Record<string, unknown> = {
        '@type': 'MenuItem',
        name: itemName,
      };

      if (itemDescription) {
        menuItem.description = itemDescription;
      }

      // Preis nur setzen, wenn ein valider numerischer Wert ermittelbar ist
      const schemaPrice = toSchemaPrice(item.price, item.price_display);
      if (schemaPrice !== null) {
        menuItem.offers = {
          '@type': 'Offer',
          price: schemaPrice,
          priceCurrency: 'EUR',
        };
      }

      return menuItem;
    });

    const section: Record<string, unknown> = {
      '@type': 'MenuSection',
      name: categoryName,
      hasMenuItem: menuItems,
    };

    if (categoryDescription) {
      section.description = categoryDescription;
    }

    return section;
  });

  // Seiten-URL aus zentraler Konfiguration + lokalisiertem Slug bauen
  const baseSlug = MENU_TYPE_BASE_SLUG[menuType || ''] || 'besondere-anlaesse';
  const localizedSlug = (allSlugs as Record<string, Record<string, string>>)[language]?.[baseSlug] || baseSlug;
  const pagePath = language === 'de' ? `/${localizedSlug}/` : `/${language}/${localizedSlug}/`;

  const menuSchema = {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: menuName,
    description: menuDescription || undefined,
    inLanguage: IN_LANGUAGE[language] || 'de-DE',
    hasMenuSection: menuSections,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${STORIA.url}${pagePath}`,
    },
  };

  // Clean up undefined values
  if (!menuSchema.description) {
    delete menuSchema.description;
  }

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(menuSchema)}
      </script>
    </Helmet>
  );
};

export default MenuStructuredData;
