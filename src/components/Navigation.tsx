import { Link, useLocation } from "react-router-dom";
import { Menu, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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

  const navItems: NavItem[] = [
    { label: "STARTSEITE", path: "/" },
    { label: "RESERVIERUNG", path: "/reservierung" },
    {
      label: "MENÜ",
      children: [
        { label: "MITTAGSMENÜ", path: "/mittagsmenu" },
        { label: "SPEISEKARTE", path: "/speisekarte" },
        { label: "GETRÄNKE", path: "/getraenke" },
      ],
    },
    {
      label: "BESONDERE ANLÄSSE",
      children: [{ label: "WEIHNACHTSMENÜS", path: "/weihnachtsmenues" }],
    },
    { label: "CATERING & EVENTS", path: "/catering" },
    { label: "KONTAKT", path: "/kontakt" },
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
                        className={`flex items-center justify-between w-full px-4 py-3 text-sm font-medium rounded-md transition-colors ${
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
                            className={`block px-4 py-2 text-sm rounded-md transition-colors ${
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
                      className={`px-4 py-3 text-sm font-medium rounded-md transition-colors ${
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
        <div className="hidden lg:flex items-center">
          {navItems.map((item) =>
            item.children ? (
              <DropdownMenu key={item.label}>
                <DropdownMenuTrigger
                  className={`flex items-center gap-1 whitespace-nowrap px-4 py-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors outline-none ${
                    isActive(item) ? "bg-accent text-accent-foreground" : ""
                  }`}
                >
                  {item.label}
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-primary text-primary-foreground border-accent">
                  {item.children.map((child) => (
                    <DropdownMenuItem key={child.path} asChild>
                      <Link
                        to={child.path}
                        className={`w-full cursor-pointer ${
                          location.pathname === child.path
                            ? "bg-accent text-accent-foreground"
                            : ""
                        }`}
                      >
                        {child.label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={item.path}
                to={item.path!}
                className={`whitespace-nowrap px-4 py-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors ${
                  location.pathname === item.path
                    ? "bg-accent text-accent-foreground"
                    : ""
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
