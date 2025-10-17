const Navigation = () => {
  const navItems = [
    "FRONT PAGE",
    "RESERVIERUNG",
    "VERANSTALTUNGEN & CATERING",
    "MENÜ",
    "EVENTS",
    "DIE FRATELLI",
    "UNSERE PHILOSOPHIE",
    "KONTAKT",
    "NEWS",
    "IMPRESSUM"
  ];

  return (
    <nav className="bg-primary text-primary-foreground sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center overflow-x-auto scrollbar-hide">
          {navItems.map((item, index) => (
            <a
              key={index}
              href={`#${item.toLowerCase().replace(/\s+/g, '-')}`}
              className="whitespace-nowrap px-4 py-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
