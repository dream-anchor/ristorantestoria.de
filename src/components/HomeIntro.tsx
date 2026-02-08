import { useLanguage } from "@/contexts/LanguageContext";
import LocalizedLink from "@/components/LocalizedLink";

const HomeIntro = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <h2 className="text-2xl md:text-3xl font-serif font-medium mb-6 tracking-wide">
          {t.homeIntro.title}
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          {t.homeIntro.p1pre}
          <LocalizedLink
            to="neapolitanische-pizza-muenchen"
            className="text-foreground hover:text-primary transition-colors underline decoration-primary/30 underline-offset-2"
          >
            {t.homeIntro.link1}
          </LocalizedLink>
          {t.homeIntro.p1mid}
          <LocalizedLink
            to="getraenke"
            className="text-foreground hover:text-primary transition-colors underline decoration-primary/30 underline-offset-2"
          >
            {t.homeIntro.link2}
          </LocalizedLink>
          {t.homeIntro.p1post}
        </p>
        <p className="text-muted-foreground leading-relaxed mb-8">
          {t.homeIntro.p2pre}
          <LocalizedLink
            to="lunch-muenchen-maxvorstadt"
            className="text-foreground hover:text-primary transition-colors underline decoration-primary/30 underline-offset-2"
          >
            {t.homeIntro.link3}
          </LocalizedLink>
          {t.homeIntro.p2mid}
          <LocalizedLink
            to="aperitivo-muenchen"
            className="text-foreground hover:text-primary transition-colors underline decoration-primary/30 underline-offset-2"
          >
            {t.homeIntro.link4}
          </LocalizedLink>
          {t.homeIntro.p2post}
        </p>
        <LocalizedLink
          to="ueber-uns"
          className="inline-flex items-center gap-2 text-base font-serif italic text-primary/80 hover:text-primary transition-colors"
        >
          {t.homeIntro.cta} →
        </LocalizedLink>
      </div>
    </section>
  );
};

export default HomeIntro;
