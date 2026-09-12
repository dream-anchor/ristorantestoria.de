import { useLanguage } from "@/contexts/LanguageContext";
import { useSpecialMenuBySlug } from "@/hooks/useSpecialMenus";
import { useArchivedSeasonalMenu } from "@/hooks/useArchivedSeasonalMenu";
import { SEASONAL_MENUS, type SeasonalMenuConfig } from "@/config/seasonalMenus";

/**
 * Lädt Menü/Archiv-Menü/Config für ein saisonales Event (Weihnachten, Valentinstag, ...)
 * anhand seines SEASONAL_MENUS-Keys — unabhängig von einem `:slug`-Routenparameter.
 *
 * Wiederverwendet dieselben drei Bausteine, die `BesondererAnlass.tsx` (Zeilen 49-60) für die
 * Pillar-Route (`besondere-anlaesse/:slug`) nutzt — `findSeasonalMenuBySlug`-Äquivalent,
 * `useSpecialMenuBySlug`, `useArchivedSeasonalMenu` — hier aber ohne URL-Parameter aufgerufen,
 * für Standalone-Mount-Punkte in `src/App.tsx` (z. B. `weihnachten-muenchen`). Seit der
 * K2-Konsolidierung (siehe docs/KONZEPT-SILVESTER-WEIHNACHTEN-KONSOLIDIERUNG.md § 3b) braucht
 * die Standalone-Route dieselbe Ausstattung (Event/Menu-JSON-LD, Live-Menü), die zuvor nur die
 * Pillar-Route über `BesondererAnlass.tsx` bekam.
 *
 * `lookupSlug` verwendet den lokalisierten Slug aus `SEASONAL_MENUS` (Fallback: DE-Slug), weil
 * `useSpecialMenuBySlug` intern per OR-Filter über alle vier Slug-Spalten (slug/slug_en/slug_it/
 * slug_fr) sucht — der übergebene String muss nur EINE davon treffen, exakt wie beim
 * URL-Parameter der Pillar-Route.
 */
export const useSeasonalMenuData = (eventKey: string) => {
  const { language } = useLanguage();
  const seasonalConfig: SeasonalMenuConfig | undefined = SEASONAL_MENUS.find((m) => m.key === eventKey);

  const lookupSlug = seasonalConfig
    ? seasonalConfig.supabaseSlug || seasonalConfig.slugs[language] || seasonalConfig.slugs.de
    : '';

  const { data: menu, isLoading, error } = useSpecialMenuBySlug(lookupSlug);

  // Hook muss unconditional aufgerufen werden (React Rules of Hooks) — Gleiches Muster wie
  // BesondererAnlass.tsx.
  const { data: archivedMenu } = useArchivedSeasonalMenu(
    !menu && seasonalConfig ? seasonalConfig.key : undefined
  );

  return { menu, archivedMenu, seasonalConfig, isLoading, error };
};
