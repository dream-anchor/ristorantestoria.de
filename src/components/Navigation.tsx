import { Link, useLocation } from "react-router-dom";
import { Menu, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useLanguage } from "@/contexts/LanguageContext";

interface NavChild {
  label: string;
  path: string;
}

interface NavItem {
  label: string;
  path?: string;
  children?: NavChild[];
}

const Navigation = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const { t } = useLanguage();

  const navItems: NavItem[] = [
    { label: t.nav.reservation, path: "/reservierung" },
    {
      label: t.nav.menu,
      children: [
        { label: t.nav.lunchMenu, path: "/mittagsmenu" },
        { label: t.nav.foodMenu, path: "/speisekarte" },
        { label: t.nav.drinks, path: "/getraenke" },
      ],
    },
    {
      label: t.nav.specialOccasions,
      children: [{ label: t.nav.christmasMenus, path: "/weihnachtsmenues" }],
    },
    { label: t.nav.catering, path: "/catering" },
    { label: t.nav.contact, path: "/kontakt" },
  ];

  const toggleMobileMenu = (label: string) => {
    setOpenMenus((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );
  };

  const isActive = (item: NavItem) => {
    if (item.path) return location.pathname === item.path;
    if (item.children) {
      return item.children.some((child) => location.pathname === child.path);
    }
    return false;
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
                          <Link
                            key={child.path}
                            to={child.path}
                            onClick={() => setIsOpen(false)}
                            className={`block px-4 py-2 text-sm tracking-wider rounded-md transition-colors ${
                              location.pathname === child.path
                                ? "bg-accent text-accent-foreground"
                                : "hover:bg-accent/50 hover:text-accent-foreground"
                            }`}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <Link
                      key={item.path}
                      to={item.path!}
                      onClick={() => setIsOpen(false)}
                      className={`px-4 py-3 text-sm font-medium tracking-wider rounded-md transition-colors ${
                        location.pathname === item.path
                          ? "bg-accent text-accent-foreground"
                          : "hover:bg-accent/50 hover:text-accent-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                  )
                )}
              </div>
            </SheetContent>
          </Sheet>
          <Link
            to="/"
            className="font-serif text-xl font-bold hover:text-accent-foreground transition-colors"
          >
            STORIA
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center justify-center">
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
                      <Link
                        key={child.path}
                        to={child.path}
                        className={`block px-5 py-3 text-sm tracking-wider hover:bg-primary-foreground/10 transition-colors first:rounded-t-sm last:rounded-b-sm ${
                          location.pathname === child.path
                            ? "bg-primary-foreground/10"
                            : ""
                        }`}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.path}
                to={item.path!}
                className={`group whitespace-nowrap px-5 py-4 text-sm font-medium tracking-wider transition-colors relative`}
              >
                <span className="relative">
                  {item.label}
                  <span className={`absolute -bottom-1 left-0 w-full h-0.5 bg-primary-foreground transform transition-transform duration-300 origin-left ${
                    location.pathname === item.path ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                  }`} />
                </span>
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
