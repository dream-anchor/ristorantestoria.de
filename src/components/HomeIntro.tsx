import { useLanguage } from "@/contexts/LanguageContext";
import LocalizedLink from "@/components/LocalizedLink";

const HomeIntro = () => {
  const { t } = useLanguage();

  return (
    <section className="py-10 md:py-14 bg-secondary/30">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        <h2 className="text-xl md:text-2xl font-serif font-semibold mb-4">
          {t.homeIntro.title}
        </h2>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-3">
          {t.homeIntro.p1pre}
          <LocalizedLink
            to="neapolitanische-pizza-muenchen"
            className="font-semibold italic text-foreground hover:text-primary transition-colors"
          >
            {t.homeIntro.link1}
          </LocalizedLink>
          {t.homeIntro.p1mid}
          <LocalizedLink
            to="getraenke"
            className="font-semibold italic text-foreground hover:text-primary transition-colors"
          >
            {t.homeIntro.link2}
          </LocalizedLink>
          {t.homeIntro.p1post}
        </p>
        <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
          {t.homeIntro.p2pre}
          <LocalizedLink
            to="lunch-muenchen-maxvorstadt"
            className="font-semibold italic text-foreground hover:text-primary transition-colors"
          >
            {t.homeIntro.link3}
          </LocalizedLink>
          {t.homeIntro.p2mid}
          <LocalizedLink
            to="aperitivo-muenchen"
            className="font-semibold italic text-foreground hover:text-primary transition-colors"
          >
            {t.homeIntro.link4}
          </LocalizedLink>
          {t.homeIntro.p2post}
        </p>
        <LocalizedLink
          to="ueber-uns"
          className="text-sm font-medium text-foreground underline decoration-primary/40 underline-offset-4 hover:decoration-primary transition-colors"
        >
          {t.homeIntro.cta}
        </LocalizedLink>
      </div>
    </section>
  );
};

export default HomeIntro;
