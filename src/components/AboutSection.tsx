import { useLanguage } from "@/contexts/LanguageContext";

const AboutSection = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-background py-16 md:py-24">
      <div className="container mx-auto px-6 md:px-8 max-w-4xl">
        <h2 className="font-serif text-3xl md:text-4xl font-semibold text-foreground text-center mb-10 md:mb-14">
          {t.about.title}
        </h2>
        
        <div className="space-y-6 text-muted-foreground font-sans text-base leading-relaxed">
          <p>{t.about.p1}</p>
          <p>{t.about.p2}</p>
          <p>{t.about.p3}</p>
          <p>{t.about.p4}</p>
          <p>{t.about.p5}</p>
          <p>{t.about.p6}</p>
          <p>{t.about.p7}</p>
          <p>{t.about.p8}</p>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
