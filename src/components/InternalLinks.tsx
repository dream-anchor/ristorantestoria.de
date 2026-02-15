import LocalizedLink from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";

const InternalLinks = () => {
  const { t } = useLanguage();

  const links = [
    { baseSlug: "lunch-muenchen-maxvorstadt", label: t.internalLinks.lunchMunich },
    { baseSlug: "aperitivo-muenchen", label: t.internalLinks.aperitivoMunich },
    { baseSlug: "neapolitanische-pizza-muenchen", label: t.internalLinks.neapolitanPizza },
    { baseSlug: "romantisches-dinner-muenchen", label: t.internalLinks.romanticDinner },
    { baseSlug: "eventlocation-muenchen-maxvorstadt", label: t.internalLinks.eventLocation },
    { baseSlug: "firmenfeier-muenchen", label: t.internalLinks.corporateEvent },
    { baseSlug: "geburtstagsfeier-muenchen", label: t.internalLinks.birthdayParty },
    { baseSlug: "wild-essen-muenchen", label: t.internalLinks.gameDishesMunich },
    { baseSlug: "italiener-muenchen", label: t.internalLinks.italienerMuenchen },
    { baseSlug: "italiener-koenigsplatz", label: t.internalLinks.italienerKoenigsplatz },
  ];

  return (
    <section className="bg-secondary/30 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-serif font-semibold text-center mb-8">
          {t.internalLinks.title}
        </h2>
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {links.map((link) => (
            <LocalizedLink
              key={link.baseSlug}
              to={link.baseSlug}
              className="px-4 py-2 bg-background border border-border rounded-full text-sm text-muted-foreground hover:text-foreground hover:border-primary transition-colors"
            >
              {link.label}
            </LocalizedLink>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InternalLinks;
