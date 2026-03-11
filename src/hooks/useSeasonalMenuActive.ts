import { SEASONAL_MENUS, type SeasonalMenuConfig } from '@/config/seasonalMenus';

/**
 * Prüft den Status eines saisonalen Events anhand der Config.
 * Wird in Standalone-SEO-Seiten verwendet.
 */
export const useSeasonalMenuActive = (eventKey: string): {
  isActive: boolean;
  menuSlug: string | null;
  config: SeasonalMenuConfig | undefined;
} => {
  const config = SEASONAL_MENUS.find(m => m.key === eventKey);
  return {
    isActive: config?.isActive ?? false,
    menuSlug: config?.slugs.de ?? null,
    config,
  };
};
