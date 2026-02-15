import { useLanguage } from "@/contexts/LanguageContext";
import LocalizedLink from "@/components/LocalizedLink";

const HomeAbout = () => {
  const { t } = useLanguage();

  return (
    <section className="py-12 md:py-16 bg-secondary/20">
      <div className="container mx-auto px-4 max-w-3xl">
        <h2 className="font-serif text-2xl md:text-3xl tracking-wide mb-6 text-foreground text-center">
          {t.homeAbout.title}
        </h2>
        <div className="space-y-6 text-[#444] text-base md:text-lg leading-[1.8]">
          <p>{t.homeAbout.p1}</p>

          <h3 className="font-serif text-xl md:text-2xl text-foreground !mb-2">
            {t.homeAbout.subtitle1}
          </h3>
          <p>{t.homeAbout.p2}</p>
          <p>{t.homeAbout.p3}</p>

          <h3 className="font-serif text-xl md:text-2xl text-foreground !mb-2">
            {t.homeAbout.subtitle2}
          </h3>
          <p>{t.homeAbout.p4}</p>
          <p>{t.homeAbout.p5}</p>

          <h3 className="font-serif text-xl md:text-2xl text-foreground !mb-2">
            {t.homeAbout.subtitle3}
          </h3>
          <p>{t.homeAbout.p6}</p>
          <p className="font-medium text-foreground">
            {t.homeAbout.p7}
          </p>
        </div>
        <div className="text-center mt-8">
          <LocalizedLink
            to="reservierung"
            className="inline-block px-8 py-3 bg-[#8b0000] text-white rounded-full shadow-[0_4px_15px_rgba(139,0,0,0.3)] hover:shadow-[0_8px_25px_rgba(139,0,0,0.4)] hover:-translate-y-0.5 transition-all text-sm font-medium"
          >
            {t.reservationCta.reserveButton}
          </LocalizedLink>
        </div>
      </div>
    </section>
  );
};

export default HomeAbout;
