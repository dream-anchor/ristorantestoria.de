import { useLocation } from "react-router-dom";
import LocalizedLink from "@/components/LocalizedLink";
import { Menu, ChevronDown, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useLanguage } from "@/contexts/LanguageContext";
import { usePublishedSpecialMenus } from "@/hooks/useSpecialMenus";
import { usePublishedStandardMenus } from "@/hooks/usePublishedStandardMenus";
import { useScrolled } from "@/hooks/useScrolled";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { getLocalizedPath } from "@/config/routes";

interface NavChild {
  label: string;
  baseSlug: string;
}

interface NavItem {
  label: string;
  baseSlug?: string;
  externalUrl?: string;
  external?: boolean;
  children?: NavChild[];
}

// Mapping von menu_type zu baseSlug
const menuTypeConfig: Record<string, { baseSlug: string }> = {
  lunch: { baseSlug: 'mittags-menu' },
  food: { baseSlug: 'speisekarte' },
  drinks: { baseSlug: 'getraenke' },
};

const Navigation = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const { t, language } = useLanguage();

  // Mobile: Alle Untermenüs standardmäßig aufklappen
  useEffect(() => {
    setOpenMenus([t.nav.menu, t.nav.specialOccasions]);
  }, [t.nav.menu, t.nav.specialOccasions]);
  const { data: specialMenus } = usePublishedSpecialMenus();
  const { data: standardMenus } = usePublishedStandardMenus();
  const isScrolled = useScrolled();

  // Helper für lokalisierte Menü-Titel
  const getLocalizedMenuTitle = (menu: any) => {
    if (language === 'it' && menu.title_it) return menu.title_it;
    if (language === 'fr' && menu.title_fr) return menu.title_fr;
    if (language === 'en' && menu.title_en) return menu.title_en;
    return menu.title || '';
  };

  // Dynamische Kinder für "Besondere Anlässe" basierend auf veröffentlichten Menüs
  // Note: Dynamic slugs like "/besondere-anlaesse/weihnachtsmenues" need special handling
  const specialOccasionsChildren: NavChild[] = specialMenus && specialMenus.length > 0
    ? specialMenus.map(menu => ({
        label: getLocalizedMenuTitle(menu).toUpperCase() || 'MENÜ',
        baseSlug: `besondere-anlaesse/${(menu as any).slug || menu.id}`
      }))
    : [{ label: t.nav.specialOccasions, baseSlug: "besondere-anlaesse" }];

  // Mapping von menu_type zu Label (Translation-basiert)
  const menuTypeLabels: Record<string, string> = {
    lunch: t.nav.lunchMenu,
    food: t.nav.foodMenu,
    drinks: t.nav.drinks,
  };

  // Dynamische Kinder für "Menü" basierend auf sort_order aus der Datenbank
  const menuChildren: NavChild[] = standardMenus && standardMenus.length > 0
    ? standardMenus.map(menu => ({
        label: menuTypeLabels[menu.menu_type] || menu.title || 'MENÜ',
        baseSlug: menuTypeConfig[menu.menu_type]?.baseSlug || 'speisekarte',
      }))
      : [
        // Fallback während des Ladens
        { label: t.nav.lunchMenu, baseSlug: "mittags-menu" },
        { label: t.nav.foodMenu, baseSlug: "speisekarte" },
        { label: t.nav.drinks, baseSlug: "getraenke" },
      ];

  const navItems: NavItem[] = [
    { label: t.nav.reservation, baseSlug: "reservierung" },
    {
      label: t.nav.menu,
      children: menuChildren,
    },
    {
      label: t.nav.specialOccasions,
      children: specialOccasionsChildren,
    },
    { label: t.nav.contact, baseSlug: "kontakt" },
    // Externer Link am Ende mit visueller Unterscheidung
    { label: t.nav.catering, externalUrl: "https://www.events-storia.de/", external: true },
  ];

  const toggleMobileMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  // Check if current path matches this nav item
  const isActive = (item: NavItem) => {
    if (item.baseSlug) {
      const localizedPath = getLocalizedPath(item.baseSlug, language);
      return location.pathname === localizedPath;
    }
    if (item.children) {
      return item.children.some((child) => {
        const localizedPath = getLocalizedPath(child.baseSlug, language);
        return location.pathname === localizedPath || location.pathname.startsWith(localizedPath + "/");
      });
    }
    return false;
  };

  const isChildActive = (baseSlug: string) => {
    const localizedPath = getLocalizedPath(baseSlug, language);
    return location.pathname === localizedPath || location.pathname.startsWith(localizedPath + "/");
  };

  return (
    <nav className="bg-primary text-primary-foreground sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Mobile Navigation */}
        <div className="flex lg:hidden items-center justify-between py-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[280px] bg-primary text-primary-foreground border-r-accent"
            >
              <div className="flex flex-col gap-2 mt-8">
                {navItems.map((item) =>
                  item.children ? (
                    <Collapsible
                      key={item.label}
                      open={openMenus.includes(item.label)}
                      onOpenChange={() => toggleMobileMenu(item.label)}
                    >
                      <CollapsibleTrigger
                        className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium tracking-wider rounded-md transition-colors ${
                          isActive(item)
                            ? "bg-accent text-accent-foreground"
                            : "hover:bg-accent/50 hover:text-accent-foreground"
                        }`}
                      >
                        {item.label}
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            openMenus.includes(item.label) ? "rotate-180" : ""
                          }`}
                        />
                      </CollapsibleTrigger>
                      <CollapsibleContent className="pl-4">
                        {item.children.map((child) => (
                          <LocalizedLink
                            key={child.baseSlug}
                            to={child.baseSlug}
                            onClick={() => setIsOpen(false)}
                            className={`block px-4 py-2 text-sm tracking-wider rounded-md transition-colors ${
                              isChildActive(child.baseSlug)
                                ? "bg-accent text-accent-foreground"
                                : "hover:bg-accent/50 hover:text-accent-foreground"
                            }`}
                          >
                            {child.label}
                          </LocalizedLink>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  ) : item.externalUrl ? (
                    <div key={item.label}>
                      {/* Horizontale Trennlinie für externe Links (Mobile) */}
                      {item.external && (
                        <div className="mx-4 my-2 border-t border-primary-foreground/30" />
                      )}
                      <a
                        href={item.externalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center justify-between px-4 py-3 text-sm font-medium tracking-wider rounded-md transition-colors ${
                          item.external 
                            ? "text-primary-foreground/70 hover:text-primary-foreground hover:bg-accent/50" 
                            : "hover:bg-accent/50 hover:text-accent-foreground"
                        }`}
                      >
                        <span>{item.label}</span>
                        {item.external && <ExternalLink className="h-4 w-4" />}
                      </a>
                    </div>
                  ) : (
                    <LocalizedLink
                      key={item.baseSlug}
                      to={item.baseSlug!}
                      onClick={() => setIsOpen(false)}
                      className={`px-4 py-3 text-sm font-medium tracking-wider rounded-md transition-colors ${
                        isActive(item)
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent/50 hover:text-accent-foreground"
                      }`}
                    >
                      {item.label}
                    </LocalizedLink>
                  )
                )}
                {/* Language Switcher im Mobile Menu */}
                <div className="mt-4 px-4">
                  <LanguageSwitcher />
                </div>
              </div>
            </SheetContent>
          </Sheet>
          {/* Language Switcher Mobile (außerhalb Sheet) */}
          <div className={`transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <LanguageSwitcher />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-between">
          <div className="w-24" /> {/* Spacer für Balance */}
          <div className="flex items-center justify-center">
          {navItems.map((item) =>
            item.children ? (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setHoveredMenu(item.label)}
                onMouseLeave={() => setHoveredMenu(null)}
              >
                <button
                  className={`group flex items-center gap-1 whitespace-nowrap px-5 py-4 text-sm font-medium tracking-wider transition-colors relative ${
                    isActive(item) ? "text-accent-foreground" : ""
                  }`}
                >
                  <span className="relative">
                    {item.label}
                    <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-primary-foreground transform transition-transform duration-300 origin-left ${
                      isActive(item) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`} />
                  </span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${hoveredMenu === item.label ? "rotate-180" : ""}`} />
                </button>
                
                {hoveredMenu === item.label && (
                  <div className="absolute top-full left-0 bg-primary text-primary-foreground border border-primary-foreground/20 rounded-sm shadow-lg min-w-[200px] z-50 animate-fade-in">
                    {item.children.map((child) => (
                      <LocalizedLink
                        key={child.baseSlug}
                        to={child.baseSlug}
                        className={`block px-5 py-3 text-sm tracking-wider hover:bg-primary-foreground/10 transition-colors first:rounded-t-sm last:rounded-b-sm ${
                          isChildActive(child.baseSlug)
                            ? "bg-primary-foreground/10"
                            : ""
                        }`}
                      >
                        {child.label}
                      </LocalizedLink>
                    ))}
                  </div>
                )}
              </div>
            ) : item.externalUrl ? (
              <div key={item.label} className="flex items-center">
                {/* Vertikaler Separator für externe Links (Desktop) */}
                {item.external && (
                  <span className="text-primary-foreground/30 px-1">|</span>
                )}
                <a
                  href={item.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center gap-1.5 whitespace-nowrap px-5 py-4 text-sm font-medium tracking-wider transition-colors relative ${
                    item.external ? "text-primary-foreground/70 hover:text-primary-foreground" : ""
                  }`}
                >
                  <span className="relative">
                    {item.label}
                    <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary-foreground transform transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100" />
                  </span>
                  {item.external && <ExternalLink className="h-3.5 w-3.5" />}
                </a>
              </div>
            ) : (
              <LocalizedLink
                key={item.baseSlug}
                to={item.baseSlug!}
                className={`group whitespace-nowrap px-5 py-4 text-sm font-medium tracking-wider transition-colors relative`}
              >
                <span className="relative">
                  {item.label}
                  <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-primary-foreground transform transition-transform duration-300 origin-left ${
                    isActive(item) ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`} />
                </span>
              </LocalizedLink>
            )
          )}
          </div>
          {/* Language Switcher Desktop - rechts */}
          <div className={`w-24 flex justify-end transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
