import { useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, FileText } from "lucide-react";

interface CollapsibleMenuCardProps {
  title: string;
  isPublished?: boolean;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const CollapsibleMenuCard = ({
  title,
  isPublished,
  defaultOpen = false,
  children,
}: CollapsibleMenuCardProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="bg-card rounded-lg border border-border">
        <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors rounded-lg cursor-pointer">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-serif font-semibold">{title}</h3>
          </div>
          <div className="flex items-center gap-3">
            {isPublished !== undefined && (
              <Badge variant={isPublished ? "default" : "secondary"}>
                {isPublished ? "Veröffentlicht" : "Entwurf"}
              </Badge>
            )}
            <ChevronDown
              className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="px-6 pb-6 pt-2 border-t border-border">
            {children}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default CollapsibleMenuCard;
