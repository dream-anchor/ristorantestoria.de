import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage, type Language } from "@/contexts/LanguageContext";
import { useAlternateLinks } from "@/contexts/AlternateLinksContext";
import { ChevronDown, Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages: { code: Language; label: string; flag: string }[] = [
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
];

const LanguageSwitcher = () => {
  const navigate = useNavigate();
  const { language, setLanguage, switchLanguage } = useLanguage();
  const { getAlternateUrl } = useAlternateLinks();

  const currentLang = languages.find(l => l.code === language) || languages[0];

  // Handle language switch - use alternate URL if available (for dynamic pages)
  const handleLanguageSwitch = useCallback((targetLang: Language) => {
    const alternateUrl = getAlternateUrl(targetLang);

    if (alternateUrl) {
      // Use alternate URL for pages with dynamic slugs (e.g., special occasions)
      setLanguage(targetLang);
      navigate(alternateUrl);
    } else {
      // Fall back to standard slug-based switching for static pages
      switchLanguage(targetLang);
    }
  }, [getAlternateUrl, setLanguage, navigate, switchLanguage]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-full bg-white/10 hover:bg-white/20 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <Globe className="h-4 w-4 opacity-70" />
        <span className="uppercase">{language}</span>
        <ChevronDown className="h-3 w-3 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageSwitch(lang.code)}
            className={`flex items-center gap-2 cursor-pointer ${
              language === lang.code ? "bg-primary/10 text-primary font-medium" : ""
            }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
