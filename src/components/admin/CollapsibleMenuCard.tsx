import { useState, useEffect } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, FileText, Pencil, Save, X } from "lucide-react";
import { useMenuContent, useSaveMenuContent, ParsedMenu } from "@/hooks/useSpecialMenus";
import MenuPreview from "./MenuPreview";
import { toast } from "sonner";

interface CollapsibleMenuCardProps {
  title: string;
  menuId?: string;
  isPublished?: boolean;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

const CollapsibleMenuCard = ({
  title,
  menuId,
  isPublished,
  defaultOpen = false,
  children,
}: CollapsibleMenuCardProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<ParsedMenu | null>(null);

  const { data: menuContent, isLoading } = useMenuContent(isEditing ? menuId : undefined);
  const saveMenuContent = useSaveMenuContent();

  useEffect(() => {
    if (menuContent && isEditing) {
      setEditData(menuContent);
    }
  }, [menuContent, isEditing]);

  const handleStartEdit = () => {
    setIsEditing(true);
    setIsOpen(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData(null);
  };

  const handleSaveEdit = async () => {
    if (!editData || !menuId) return;
    
    try {
      await saveMenuContent.mutateAsync({ menuId, data: editData });
      toast.success("Änderungen gespeichert");
      setIsEditing(false);
      setEditData(null);
    } catch (error) {
      toast.error("Fehler beim Speichern");
    }
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="bg-card rounded-lg border border-border">
        <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-muted/50 transition-colors rounded-lg cursor-pointer">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-serif font-semibold">{title}</h3>
          </div>
          <div className="flex items-center gap-3">
            {menuId && !isEditing && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartEdit();
                }}
                className="h-8 w-8 p-0"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
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
            {isEditing ? (
              <div className="space-y-4">
                {isLoading ? (
                  <div className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                ) : editData ? (
                  <MenuPreview data={editData} onUpdate={setEditData} />
                ) : (
                  <p className="text-muted-foreground">Keine Daten vorhanden</p>
                )}
                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleSaveEdit}
                    disabled={saveMenuContent.isPending || !editData}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {saveMenuContent.isPending ? "Speichern..." : "Änderungen speichern"}
                  </Button>
                  <Button variant="outline" onClick={handleCancelEdit}>
                    <X className="h-4 w-4 mr-2" />
                    Abbrechen
                  </Button>
                </div>
              </div>
            ) : (
              children
            )}
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
};

export default CollapsibleMenuCard;
