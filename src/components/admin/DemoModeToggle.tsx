import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { cn } from "@/lib/utils";

interface DemoModeToggleProps {
  /** "icon" = quadratischer Icon-Button, "sm" = mit Label (Desktop) */
  variant?: "icon" | "sm";
  className?: string;
}

const DemoModeToggle = ({ variant = "icon", className }: DemoModeToggleProps) => {
  const { hidden, toggle } = useDemoMode();
  const label = hidden ? "Sensible Daten anzeigen" : "Sensible Daten verbergen";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={hidden ? "default" : "outline"}
          size={variant === "icon" ? "icon" : "sm"}
          onClick={toggle}
          aria-pressed={hidden}
          aria-label={label}
          className={cn(variant === "icon" && "h-10 w-10", className)}
        >
          {hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {variant === "sm" && <span className="ml-2">{hidden ? "Verborgen" : "Demo"}</span>}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
};

export default DemoModeToggle;