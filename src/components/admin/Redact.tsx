import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useDemoMode } from "@/contexts/DemoModeContext";

interface RedactProps {
  children: ReactNode;
  /** Render as block element instead of inline-flex span */
  block?: boolean;
  /** Blur strength: default "sm" */
  strength?: "sm" | "md" | "lg";
  className?: string;
}

const STRENGTH: Record<NonNullable<RedactProps["strength"]>, string> = {
  sm: "blur-sm",
  md: "blur",
  lg: "blur-md",
};

/**
 * Wraps sensitive content (numbers, customer data). When the admin demo mode is
 * active, the content is blurred and made non-selectable/non-interactive so it
 * can be shown in presentations without exposing details. Layout is preserved.
 */
const Redact = ({ children, block, strength = "sm", className }: RedactProps) => {
  const { hidden } = useDemoMode();

  return (
    <span
      className={cn(
        block ? "block" : "inline-flex items-center",
        hidden && `${STRENGTH[strength]} select-none pointer-events-none`,
        hidden && "transition-[filter] duration-200",
        className,
      )}
      aria-hidden={hidden || undefined}
    >
      {children}
    </span>
  );
};

export default Redact;