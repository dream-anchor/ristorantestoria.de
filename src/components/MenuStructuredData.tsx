import { Helmet } from 'react-helmet-async';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMenu, useMenuById, MenuType } from '@/hooks/useMenu';

interface MenuStructuredDataProps {
  menuType?: MenuType;
  menuId?: string;
}

const MenuStructuredData = ({ menuType, menuId }: MenuStructuredDataProps) => {
  const { language } = useLanguage();
  
  // Fetch menu data based on type or id
  const { data: menuByType } = useMenu(menuType || 'food');
  const { data: menuById } = useMenuById(menuId);
  
  const menu = menuId ? menuById : menuByType;

  if (!menu || !menu.categories || menu.categories.length === 0) {
    return null;
  }

  // Get menu name in current language
  const menuName = language === 'en' && menu.title_en 
    ? menu.title_en 
    : menu.title || (menuType === 'food' ? 'Speisekarte' : menuType === 'lunch' ? 'Mittagsmenü' : 'Getränkekarte');

  const menuDescription = language === 'en' && menu.subtitle_en
    ? menu.subtitle_en
    : menu.subtitle || '';

  // Build MenuSection array from categories
  const menuSections = menu.categories.map(category => {
    const categoryName = language === 'en' && category.name_en 
      ? category.name_en 
      : category.name;
    
    const categoryDescription = language === 'en' && category.description_en
      ? category.description_en
      : category.description;

    // Build MenuItem array
    const menuItems = category.items.map(item => {
      const itemName = language === 'en' && item.name_en 
        ? item.name_en 
        : item.name;
      
      const itemDescription = language === 'en' && item.description_en
        ? item.description_en
        : item.description;

      const menuItem: Record<string, unknown> = {
        '@type': 'MenuItem',
        name: itemName,
      };

      if (itemDescription) {
        menuItem.description = itemDescription;
      }

      // Add price if available
      if (item.price !== null && item.price !== undefined) {
        menuItem.offers = {
          '@type': 'Offer',
          price: item.price.toFixed(2),
          priceCurrency: 'EUR',
        };
      } else if (item.price_display) {
        menuItem.offers = {
          '@type': 'Offer',
          price: item.price_display,
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

  const menuSchema = {
    '@context': 'https://schema.org',
    '@type': 'Menu',
    name: menuName,
    description: menuDescription || undefined,
    inLanguage: language === 'en' ? 'en-US' : 'de-DE',
    hasMenuSection: menuSections,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.ristorantestoria.de${menuType === 'food' ? '/speisekarte' : menuType === 'lunch' ? '/mittags-menu' : menuType === 'drinks' ? '/getraenke' : '/besondere-anlaesse'}`,
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
