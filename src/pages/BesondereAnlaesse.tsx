import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { usePublishedSpecialMenus } from "@/hooks/useSpecialMenus";
import { usePrerenderReady } from "@/hooks/usePrerenderReady";
import { useLanguage } from "@/contexts/LanguageContext";
import { getLocalizedPath } from "@/config/routes";

// Parent slug mapping for each language (same as BesondererAnlass.tsx)
const PARENT_SLUGS = {
  de: 'besondere-anlaesse',
  en: 'special-occasions',
  it: 'occasioni-speciali',
  fr: 'occasions-speciales',
} as const;

const BesondereAnlaesse = () => {
  const navigate = useNavigate();
  const { data: specialMenus, isLoading } = usePublishedSpecialMenus();
  const { language } = useLanguage();
  usePrerenderReady(!isLoading);

  useEffect(() => {
    if (isLoading) return;

    if (specialMenus && specialMenus.length > 0) {
      // Zum ersten veröffentlichten Special-Menü weiterleiten
      const firstMenu = specialMenus[0] as any;

      // Get localized slug based on current language
      const getLocalizedMenuSlug = () => {
        if (language === 'en' && firstMenu.slug_en) return firstMenu.slug_en;
        if (language === 'it' && firstMenu.slug_it) return firstMenu.slug_it;
        if (language === 'fr' && firstMenu.slug_fr) return firstMenu.slug_fr;
        return firstMenu.slug || firstMenu.id;
      };

      const menuSlug = getLocalizedMenuSlug();
      const parentSlug = PARENT_SLUGS[language as keyof typeof PARENT_SLUGS];
      const basePath = language === "de" ? "" : `/${language}`;

      navigate(`${basePath}/${parentSlug}/${menuSlug}`, { replace: true });
    } else {
      // Keine Special-Menüs → zur Speisekarte
      navigate(getLocalizedPath("speisekarte", language), { replace: true });
    }
  }, [specialMenus, isLoading, navigate, language]);

  // Loading-State anzeigen während Redirect vorbereitet wird
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-4 w-32 mx-auto" />
      </div>
    </div>
  );
};

export default BesondereAnlaesse;
