import { useMenu, useMenuById, MenuType } from "@/hooks/useMenu";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { MaestroSpeisekarte } from "@/components/MaestroWidget";
import { Fragment, ReactNode, useEffect, useState } from "react";
import type { Menu } from "@/hooks/useMenu";

/**
 * Reiter aus der MAESTRO-Kartenliste (Name/Reihenfolge aus MAESTRO). Alle Karten stehen im
 * vorgerenderten HTML (SEO), nur die gewählte ist sichtbar. #<slug> in der Adresse wählt eine Karte vor.
 */
const MaestroKartenReiter = ({ karten, lang }: { karten: NonNullable<Menu["maestro"]>["karten"]; lang: string }) => {
  const [aktiv, setAktiv] = useState(karten[0]?.slug);
  useEffect(() => {
    const h = decodeURIComponent(window.location.hash.slice(1));
    if (karten.some((k) => k.slug === h)) setAktiv(h);
  }, [karten]);
  return (
    <div className="max-w-3xl mx-auto">
      {karten.length > 1 && (
        <div role="tablist" className="flex flex-wrap justify-center gap-2 mb-8">
          {karten.map((k) => (
            <button
              key={k.slug}
              role="tab"
              type="button"
              id={`reiter-${k.slug}`}
              aria-selected={aktiv === k.slug}
              aria-controls={`karte-${k.slug}`}
              onClick={() => setAktiv(k.slug)}
              className={`px-5 py-2 rounded-full border text-sm font-medium transition-colors ${aktiv === k.slug ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-secondary"}`}
            >
              {k.name}
            </button>
          ))}
        </div>
      )}
      {karten.map((k) => (
        <div key={k.slug} id={`karte-${k.slug}`} role="tabpanel" aria-labelledby={`reiter-${k.slug}`} hidden={aktiv !== k.slug}>
          <MaestroSpeisekarte slug={k.slug} lang={lang} html={k.html[lang] ?? k.html.de} />
        </div>
      ))}
    </div>
  );
};

interface MenuDisplayProps {
  menuType: MenuType;
  menuId?: string; // Optional: for fetching specific menu by ID (used for special occasions)
  showTitle?: boolean; // Optional: hide title when H1 is rendered externally (default: true)
  interstitialCta?: ReactNode; // Optional: CTA rendered between categories
  interstitialEvery?: number; // How many categories between each CTA (default 3)
}

const MenuDisplay = ({ menuType, menuId, showTitle = true, interstitialCta, interstitialEvery = 3 }: MenuDisplayProps) => {
  // Use menuId if provided (for special menus), otherwise fetch by type
  const menuByType = useMenu(menuType);
  const menuById = useMenuById(menuId);
  
  const { data: menu, isLoading, error } = menuId ? menuById : menuByType;
  const { language, t } = useLanguage();

  // Helper to get localized text with fallback chain
  const getLocalizedText = (de: string | null, en: string | null, it: string | null, fr: string | null): string | null => {
    if (language === 'it' && it) return it;
    if (language === 'fr' && fr) return fr;
    if (language === 'en' && en) return en;
    return de; // Fallback to German
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <Skeleton className="h-8 w-64 mx-auto" />
          <Skeleton className="h-4 w-48 mx-auto" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-6 w-40 mx-auto" />
            <div className="space-y-3">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !menu) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-secondary/50 p-8 rounded-sm text-center border border-border">
          <p className="text-muted-foreground">
            {t.menuDisplay?.noMenu || "Das aktuelle Menü ist derzeit nicht verfügbar."}
          </p>
          <a 
            href="tel:+498951519696" 
            className="text-primary hover:underline mt-3 inline-block font-medium"
          >
            {t.menuDisplay?.callForMenu || "Rufen Sie uns an: 089 51519696"}
          </a>
        </div>
      </div>
    );
  }

  // P8: alle veröffentlichten MAESTRO-Karten als Reiter, je Karte das fertige HTML-Fragment des Speisekarten-Widgets.
  if (menu.maestro) return <MaestroKartenReiter karten={menu.maestro.karten} lang={language} />;

  // Get localized title and subtitle
  const menuTitle = getLocalizedText(menu.title, menu.title_en, menu.title_it, menu.title_fr);
  const menuSubtitle = getLocalizedText(menu.subtitle, menu.subtitle_en, menu.subtitle_it, menu.subtitle_fr);

  return (
    <div className="max-w-3xl mx-auto">
      {/* Menu Header */}
      {showTitle && (menuTitle || menuSubtitle) && (
        <div className="text-center mb-12">
          {menuTitle && (
            <h2 className="text-3xl md:text-4xl font-serif font-semibold tracking-wide mb-2">
              {menuTitle}
            </h2>
          )}
          {menuSubtitle && (
            <p className="text-lg text-muted-foreground italic">{menuSubtitle}</p>
          )}
          <div className="w-24 h-px bg-primary/30 mx-auto mt-6" />
        </div>
      )}

      {/* Categories */}
      <div className="space-y-12">
        {(() => { let pizzaAnchorPlaced = false; const lastIndex = menu.categories.length - 1; return menu.categories.map((category, index) => {
          const categoryName = getLocalizedText(category.name, category.name_en, category.name_it, category.name_fr);
          const categoryDescription = getLocalizedText(category.description, category.description_en, category.description_it, category.description_fr);
          const isPizza = (category.name || '').toLowerCase().includes('pizz');
          const needsPizzaAnchor = isPizza && !pizzaAnchorPlaced;
          if (needsPizzaAnchor) pizzaAnchorPlaced = true;

          const showCta = interstitialCta && index < lastIndex && (index + 1) % interstitialEvery === 0;

          return (
            <Fragment key={category.id}>
            <div key={category.id} id={needsPizzaAnchor ? 'pizza' : undefined} className="space-y-6">
              {/* Category Header */}
              <div className="text-center">
                <h3 className="text-2xl font-serif font-medium tracking-[0.15em] uppercase text-primary">
                  ~ {categoryName} ~
                </h3>
                {categoryDescription && (
                  <p className="text-base text-muted-foreground mt-2 italic">
                    {categoryDescription}
                  </p>
                )}
              </div>

              {/* Items */}
              <div className="space-y-4">
              {category.items.map((item) => {
                  const itemName = getLocalizedText(item.name, item.name_en, item.name_it, item.name_fr);
                  const itemDescription = getLocalizedText(item.description, item.description_en, item.description_it, item.description_fr);
                  // Use localized price_display with fallback to German
                  const localizedPriceDisplay = getLocalizedText(
                    item.price_display,
                    (item as any).price_display_en,
                    (item as any).price_display_it,
                    (item as any).price_display_fr
                  );
                  const priceDisplay = localizedPriceDisplay || (item.price ? `€${item.price.toFixed(2).replace('.', ',')}` : null);

                  return (
                    <div key={item.id} className="group">
                      <div className="flex justify-between items-baseline gap-4">
                        <span className="font-serif font-medium text-lg text-foreground leading-snug">
                          {itemName}
                        </span>
                        <span className="flex-shrink-0 border-b border-dotted border-border flex-grow mx-2" />
                        {priceDisplay && (
                          <span className="font-medium text-lg text-foreground whitespace-nowrap">
                            {priceDisplay}
                          </span>
                        )}
                      </div>
                      {itemDescription && (
                        <p className="text-base text-muted-foreground mt-1 leading-relaxed">
                          {itemDescription}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            {showCta && interstitialCta}
            </Fragment>
          );
        }); })()}
      </div>

      {/* Footer note */}
      {menu.categories.length > 0 && (
        <div className="mt-12 pt-8 border-t border-border/50 text-center">
          <p className="text-sm text-muted-foreground italic">
            {t.menuDisplay?.allergenNote || "Allergene und Zusatzstoffe auf Anfrage"}
          </p>
        </div>
      )}
    </div>
  );
};

export default MenuDisplay;
