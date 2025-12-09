import { useMenu, useMenuById, MenuType } from '@/hooks/useMenu';
import { useLanguage } from '@/contexts/LanguageContext';

interface BotContentProps {
  menuType?: MenuType;
  menuId?: string;
}

/**
 * BotContent renders full menu content for search engine crawlers.
 * - <noscript> block for bots that don't execute JavaScript
 * - sr-only div for JS-enabled crawlers like Googlebot
 * Content is dynamically fetched from database - no manual updates needed.
 */
const BotContent = ({ menuType, menuId }: BotContentProps) => {
  const { data: menuByType, isLoading: loadingByType } = useMenu(menuType!);
  const { data: menuById, isLoading: loadingById } = useMenuById(menuId);
  const { language } = useLanguage();

  const menu = menuId ? menuById : menuByType;
  const isLoading = menuId ? loadingById : loadingByType;

  if (isLoading || !menu) return null;

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
    <article itemScope itemType="https://schema.org/Menu">
      <h1 itemProp="name">{getLocalizedText(menu.title, menu.title_en)}</h1>
      {menu.subtitle && <p itemProp="description">{getLocalizedText(menu.subtitle, menu.subtitle_en)}</p>}
      
      {menu.categories.map((category) => (
        <section key={category.id} itemScope itemType="https://schema.org/MenuSection">
          <h2 itemProp="name">{getLocalizedText(category.name, category.name_en)}</h2>
          {category.description && (
            <p itemProp="description">{getLocalizedText(category.description, category.description_en)}</p>
          )}
          
          <ul>
            {category.items.map((item) => (
              <li key={item.id} itemScope itemType="https://schema.org/MenuItem">
                <span itemProp="name">{getLocalizedText(item.name, item.name_en)}</span>
                {item.description && (
                  <span itemProp="description"> – {getLocalizedText(item.description, item.description_en)}</span>
                )}
                {(item.price || item.price_display) && (
                  <span itemProp="offers" itemScope itemType="https://schema.org/Offer">
                    <span itemProp="price"> – {formatPrice(item.price, item.price_display)}</span>
                    <meta itemProp="priceCurrency" content="EUR" />
                  </span>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
      
      <footer>
        <p>STORIA – Ristorante • Pizzeria • Bar</p>
        <p>Karlstraße 47a, 80333 München</p>
        <p>Tel: +49 89 515196</p>
      </footer>
    </article>
  );

  return (
    <>
      {/* For bots without JavaScript execution */}
      <noscript>{content}</noscript>
      
      {/* For JS-enabled crawlers like Googlebot - hidden from users */}
      <div className="sr-only" aria-hidden="true">
        {content}
      </div>
    </>
  );
};

export default BotContent;
