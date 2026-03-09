import { useMenu, useMenuById, MenuType } from '@/hooks/useMenu';
import { useLanguage } from '@/contexts/LanguageContext';

interface BotContentProps {
  menuType?: MenuType;
  menuId?: string;
}

/**
 * BotContent renders full menu content as noscript fallback for crawlers without JS.
 * Content is dynamically fetched from database - no manual updates needed.
 */
const BotContent = ({ menuType, menuId }: BotContentProps) => {
  const { data: menuByType, isLoading: loadingByType } = useMenu(menuType!);
  const { data: menuById, isLoading: loadingById } = useMenuById(menuId);
  const { language } = useLanguage();

  const menu = menuId ? menuById : menuByType;
  const isLoading = menuId ? loadingById : loadingByType;

  if (isLoading || !menu) {
    return null;
  }

  const getLocalizedText = (de: string | null | undefined, en: string | null | undefined) => {
    if (language === 'en' && en) return en;
    return de || '';
  };

  const formatPrice = (price: number | null | undefined, priceDisplay: string | null | undefined) => {
    if (priceDisplay) return priceDisplay;
    if (price !== null && price !== undefined) return `€${price.toFixed(2)}`;
    return '';
  };

  const content = (
    <article>
      <h2>{getLocalizedText(menu.title, menu.title_en)}</h2>
      {menu.subtitle && <p>{getLocalizedText(menu.subtitle, menu.subtitle_en)}</p>}
      
      {menu.categories.map((category) => (
        <section key={category.id}>
          <h2>{getLocalizedText(category.name, category.name_en)}</h2>
          {category.description && (
            <p>{getLocalizedText(category.description, category.description_en)}</p>
          )}
          
          <ul>
            {category.items.map((item) => (
              <li key={item.id}>
                <strong>{getLocalizedText(item.name, item.name_en)}</strong>
                {item.description && (
                  <span> – {getLocalizedText(item.description, item.description_en)}</span>
                )}
                {(item.price || item.price_display) && (
                  <span> – {formatPrice(item.price, item.price_display)}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
      
      <footer>
        <p>STORIA – Ristorante • Pizzeria • Bar</p>
        <p>Karlstraße 47a, 80333 München</p>
        <p>Tel: +49 89 51519696</p>
      </footer>
    </article>
  );

  return (
    <noscript>{content}</noscript>
  );
};

export default BotContent;
