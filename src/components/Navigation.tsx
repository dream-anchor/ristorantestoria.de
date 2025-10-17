import { Link, useLocation } from "react-router-dom";

const Navigation = () => {
  const location = useLocation();
  
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
        <div className="flex items-center overflow-x-auto scrollbar-hide">
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
