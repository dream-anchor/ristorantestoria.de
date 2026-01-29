import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

interface FeaturedPackage {
  id: string;
  name: string;
  name_en: string | null;
  price: number | null;
  price_per_person: boolean;
  min_guests: number | null;
  max_guests: number | null;
  includes: string[] | null;
}

interface MenuHighlight {
  name: string;
  name_en: string | null;
  description: string | null;
  description_en: string | null;
  price_display: string | null;
  category: string;
}

interface PricesSummary {
  min_package_price: number | null;
  max_package_price: number | null;
  packages_count: number;
  catering_items_count: number;
}

interface SeasonInfo {
  is_seasonal?: boolean;
  season_name?: string;
  season_start?: string;
  season_end?: string;
}

interface LandingpageContentRow {
  id: string;
  page_slug: string;
  intro_de: string | null;
  intro_en: string | null;
  intro_it: string | null;
  intro_fr: string | null;
  highlights_text_de: string | null;
  highlights_text_en: string | null;
  highlights_text_it: string | null;
  highlights_text_fr: string | null;
  featured_items: FeaturedPackage[];
  menu_highlights: MenuHighlight[];
  prices_summary: PricesSummary;
  season_info: SeasonInfo;
  last_successful_update: string | null;
  update_status: string | null;
  items_found_count: number;
}

export interface LandingpageContent {
  intro: string | null;
  highlightsText: string | null;
  featuredPackages: FeaturedPackage[];
  menuHighlights: MenuHighlight[];
  pricesSummary: PricesSummary;
  seasonInfo: SeasonInfo;
  lastUpdated: string | null;
  status: string | null;
  itemsCount: number;
}

export function useLandingpageContent(pageSlug: string) {
  const { language } = useLanguage();

  return useQuery({
    queryKey: ['landingpage-content', pageSlug, language],
    queryFn: async (): Promise<LandingpageContent | null> => {
      const { data, error } = await supabase
        .from('landingpage_content')
        .select('*')
        .eq('page_slug', pageSlug)
        .maybeSingle();

      if (error) {
        console.error('Error fetching landingpage content:', error);
        return null;
      }

      if (!data) {
        return null;
      }

      // Cast the data to our known structure
      const row = data as unknown as LandingpageContentRow;

      // Get localized intro text
      const introKey = `intro_${language}` as keyof LandingpageContentRow;
      const intro = (row[introKey] as string | null) || row.intro_de;

      // Get localized highlights text
      const highlightsKey = `highlights_text_${language}` as keyof LandingpageContentRow;
      const highlightsText = (row[highlightsKey] as string | null) || row.highlights_text_de;

      // Transform featured packages with localized names
      const featuredPackages: FeaturedPackage[] = (row.featured_items || []).map(pkg => ({
        ...pkg,
        name: language === 'en' && pkg.name_en ? pkg.name_en : pkg.name
      }));

      // Transform menu highlights with localized content
      const menuHighlights: MenuHighlight[] = (row.menu_highlights || []).map(item => ({
        ...item,
        name: language === 'en' && item.name_en ? item.name_en : item.name,
        description: language === 'en' && item.description_en ? item.description_en : item.description
      }));

      return {
        intro,
        highlightsText,
        featuredPackages,
        menuHighlights,
        pricesSummary: row.prices_summary || { min_package_price: null, max_package_price: null, packages_count: 0, catering_items_count: 0 },
        seasonInfo: row.season_info || {},
        lastUpdated: row.last_successful_update,
        status: row.update_status,
        itemsCount: row.items_found_count || 0
      };
    },
    staleTime: 1000 * 60 * 60, // 1 hour cache
    gcTime: 1000 * 60 * 60 * 24, // 24 hour garbage collection
  });
}
