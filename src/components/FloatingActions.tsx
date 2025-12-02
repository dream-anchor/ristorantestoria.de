import { useState, useEffect } from "react";
import { Phone, Calendar } from "lucide-react";
import { Link } from "react-router-dom";

const FloatingActions = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 animate-fade-in">
      {/* Telefon Button */}
      <a
        href="tel:+4989515196"
        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-4 shadow-lg transition-all hover:scale-105"
        title="Anrufen"
      >
        <Phone className="h-6 w-6" />
      </a>
      
      {/* Reservierung Button */}
      <Link
        to="/reservierung"
        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-4 shadow-lg transition-all hover:scale-105"
        title="Reservieren"
      >
        <Calendar className="h-6 w-6" />
      </Link>
    </div>
  );
};

export default FloatingActions;
