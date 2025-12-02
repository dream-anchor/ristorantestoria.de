import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Gift, Plus } from "lucide-react";
import { useSpecialMenus, useCreateSpecialMenu, useDeleteSpecialMenu } from "@/hooks/useSpecialMenus";
import SpecialMenuCard from "./SpecialMenuCard";
import { toast } from "sonner";

const SpecialOccasionsManager = () => {
  const { data: specialMenus, isLoading } = useSpecialMenus();
  const createMutation = useCreateSpecialMenu();
  const deleteMutation = useDeleteSpecialMenu();

  const handleAddNew = async () => {
    try {
      await createMutation.mutateAsync();
      toast.success("Neuer Anlass erstellt");
    } catch (error) {
      toast.error("Fehler beim Erstellen");
      console.error(error);
    }
  };

  const handleDelete = async (menuId: string) => {
    try {
      await deleteMutation.mutateAsync(menuId);
      toast.success("Anlass-Menü gelöscht");
    } catch (error) {
      toast.error("Fehler beim Löschen");
      console.error(error);
    }
  };

  return (
    <div className="mt-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Gift className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-serif font-semibold">Besondere Anlässe</h2>
          </div>
          <p className="text-muted-foreground">
            Fügen Sie beliebig viele Anlass-Menüs hinzu – Weihnachten, Valentinstag, Ostern, Silvester oder andere besondere Events.
          </p>
        </div>
        <Button onClick={handleAddNew} disabled={createMutation.isPending}>
          <Plus className="h-4 w-4 mr-2" />
          {createMutation.isPending ? "Erstellen..." : "Hinzufügen"}
        </Button>
      </div>

      {/* Menu Cards */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2">
          <Skeleton className="h-64" />
          <Skeleton className="h-64" />
        </div>
      ) : specialMenus && specialMenus.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {specialMenus.map((menu) => (
            <SpecialMenuCard
              key={menu.id}
              menu={menu}
              onDelete={handleDelete}
              isDeleting={deleteMutation.isPending}
            />
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border p-8 text-center">
          <Gift className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-serif font-semibold mb-2">Keine Anlässe vorhanden</h3>
          <p className="text-muted-foreground mb-4">
            Klicken Sie auf "Hinzufügen", um Ihr erstes Anlass-Menü zu erstellen.
          </p>
          <Button onClick={handleAddNew} disabled={createMutation.isPending}>
            <Plus className="h-4 w-4 mr-2" />
            Ersten Anlass erstellen
          </Button>
        </div>
      )}
    </div>
  );
};

export default SpecialOccasionsManager;
