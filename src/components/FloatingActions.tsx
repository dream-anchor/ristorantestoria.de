import { useState, useEffect } from "react";
import { Phone, UtensilsCrossed, Copy, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";

const FloatingActions = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText("+49 89 515196");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isVisible) return null;

  const buttonClasses = "bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-4 shadow-lg transition-all hover:scale-105";

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 animate-fade-in">
      {/* Telefon Button */}
      {isMobile ? (
        <a
          href="tel:+4989515196"
          className={buttonClasses}
          title="Anrufen"
        >
          <Phone className="h-6 w-6" />
        </a>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <button
              className={buttonClasses}
              title="Telefonnummer"
            >
              <Phone className="h-6 w-6" />
            </button>
          </PopoverTrigger>
          <PopoverContent side="left" className="w-auto p-3">
            <div className="flex items-center gap-3">
              <span className="font-medium whitespace-nowrap">+49 89 515196</span>
              <Button
                size="sm"
                variant="outline"
                onClick={copyToClipboard}
                className="h-8 px-2"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
      
      {/* Reservierung Button */}
      <Link
        to="/reservierung"
        className={buttonClasses}
        title="Reservieren"
      >
        <UtensilsCrossed className="h-6 w-6" />
      </Link>
    </div>
  );
};

export default FloatingActions;
