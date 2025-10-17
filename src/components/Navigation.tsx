import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Navigation = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const navItems = [
    { label: "FRONT PAGE", path: "/" },
    { label: "RESERVIERUNG", path: "/reservierung" },
    { label: "VERANSTALTUNGEN & CATERING", path: "/catering" },
    { label: "MENÜ", path: "/menu" },
    { label: "EVENTS", path: "/events" },
    { label: "UNSERE PHILOSOPHIE", path: "/philosophie" },
    { label: "KONTAKT", path: "/kontakt" },
  ];

  return (
    <nav className="bg-primary text-primary-foreground sticky top-0 z-50">
      <div className="container mx-auto px-4">
        {/* Mobile Navigation */}
        <div className="flex lg:hidden items-center justify-between py-4">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-accent hover:text-accent-foreground">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] bg-primary text-primary-foreground border-r-accent">
              <div className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                      location.pathname === item.path 
                        ? 'bg-accent text-accent-foreground' 
                        : 'hover:bg-accent/50 hover:text-accent-foreground'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
          <span className="font-serif text-xl font-bold">STORIA</span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center overflow-x-auto scrollbar-hide">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`whitespace-nowrap px-4 py-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors ${
                location.pathname === item.path ? 'bg-accent text-accent-foreground' : ''
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
