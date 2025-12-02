import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { FileText, ExternalLink, Calendar, Trash2, Layers, UtensilsCrossed } from "lucide-react";
import { SpecialMenu } from "@/hooks/useSpecialMenus";
import MenuUploader from "./MenuUploader";

interface SpecialMenuCardProps {
  menu: SpecialMenu;
  onDelete: (menuId: string) => void;
  isDeleting: boolean;
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return "—";
  return new Date(dateString).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const SpecialMenuCard = ({ menu, onDelete, isDeleting }: SpecialMenuCardProps) => {
  const hasContent = menu.category_count > 0 || menu.item_count > 0;

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          <FileText className="h-5 w-5 text-primary" />
          <div>
            <h3 className="text-lg font-serif font-semibold">
              {menu.title || "Neuer Anlass"}
            </h3>
            {menu.subtitle && (
              <p className="text-sm text-muted-foreground">{menu.subtitle}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={menu.is_published ? "default" : "secondary"}>
            {menu.is_published ? "Veröffentlicht" : "Entwurf"}
          </Badge>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Anlass-Menü löschen?</AlertDialogTitle>
                <AlertDialogDescription>
                  Möchten Sie "{menu.title || 'Neuer Anlass'}" wirklich löschen? 
                  Diese Aktion kann nicht rückgängig gemacht werden.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(menu.id)}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Löschen..." : "Löschen"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Stats */}
      {hasContent && (
        <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Kategorien</p>
              <p className="font-medium">{menu.category_count}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <UtensilsCrossed className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Gerichte</p>
              <p className="font-medium">{menu.item_count}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-sm text-muted-foreground">Aktualisiert</p>
              <p className="font-medium text-xs">{formatDate(menu.updated_at)}</p>
            </div>
          </div>
        </div>
      )}

      {/* View Link */}
      {menu.is_published && (
        <div className="mb-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/besondere-anlaesse">
              <ExternalLink className="h-4 w-4 mr-2" />
              Auf Website ansehen
            </Link>
          </Button>
        </div>
      )}

      {/* Uploader */}
      <MenuUploader 
        menuType="special" 
        menuLabel={menu.title || "Anlass-Menü"} 
        existingMenuId={menu.id}
      />
    </div>
  );
};

export default SpecialMenuCard;
