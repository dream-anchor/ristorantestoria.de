import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const InternalLinks = () => {
  const { t } = useLanguage();

  const links = [
    { href: "/lunch-muenchen-maxvorstadt", label: t.internalLinks.lunchMunich },
    { href: "/aperitivo-muenchen", label: t.internalLinks.aperitivoMunich },
    { href: "/neapolitanische-pizza-muenchen", label: t.internalLinks.neapolitanPizza },
    { href: "/romantisches-dinner-muenchen", label: t.internalLinks.romanticDinner },
    { href: "/eventlocation-muenchen-maxvorstadt", label: t.internalLinks.eventLocation },
    { href: "/firmenfeier-muenchen", label: t.internalLinks.corporateEvent },
    { href: "/geburtstagsfeier-muenchen", label: t.internalLinks.birthdayParty },
  ];

  return (
    <section className="bg-secondary/30 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-serif font-semibold text-center mb-8">
          {t.internalLinks.title}
        </h2>
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="px-4 py-2 bg-background border border-border rounded-full text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InternalLinks;