import { EyeOff } from "lucide-react";
import { useDemoMode } from "@/contexts/DemoModeContext";

const DemoModeBanner = () => {
  const { hidden } = useDemoMode();
  if (!hidden) return null;

  return (
    <div className="flex items-center justify-center gap-2 bg-primary/10 text-primary border-b border-primary/20 px-4 py-1.5 text-xs font-medium">
      <EyeOff className="h-3.5 w-3.5" />
      Demo-Modus aktiv – sensible Daten (Zahlen &amp; Kundendaten) sind verborgen.
    </div>
  );
};

export default DemoModeBanner;