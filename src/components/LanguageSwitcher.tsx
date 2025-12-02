import { useLanguage } from "@/contexts/LanguageContext";

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 text-base font-medium">
      <button
        onClick={() => setLanguage("de")}
        className={`px-2 py-1 rounded transition-colors ${
          language === "de"
            ? "text-foreground font-bold"
            : "text-foreground/50 hover:text-foreground/80"
        }`}
      >
        DE
      </button>
      <span className="text-foreground/30">|</span>
      <button
        onClick={() => setLanguage("en")}
        className={`px-2 py-1 rounded transition-colors ${
          language === "en"
            ? "text-foreground font-bold"
            : "text-foreground/50 hover:text-foreground/80"
        }`}
      >
        EN
      </button>
    </div>
  );
};

export default LanguageSwitcher;
