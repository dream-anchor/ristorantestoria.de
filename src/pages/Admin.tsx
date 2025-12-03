import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminMenus } from "@/hooks/useAdminMenus";
import { useUpdateMenuOrder } from "@/hooks/useUpdateMenuOrder";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import storiaLogo from "@/assets/storia-logo.webp";
import MenuUploader from "@/components/admin/MenuUploader";
import MenuStatusCard from "@/components/admin/MenuStatusCard";
import CollapsibleMenuCard from "@/components/admin/CollapsibleMenuCard";
import SortableMenuCard from "@/components/admin/SortableMenuCard";
import { LogOut, ExternalLink } from "lucide-react";
import SpecialOccasionsManager from "@/components/admin/SpecialOccasionsManager";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading, signOut } = useAdminAuth();
  const { data: menus } = useAdminMenus();
  const updateOrderMutation = useUpdateMenuOrder();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Separate standard and special menus, sorted by sort_order
  const standardMenus = menus?.filter((m) => 
    m.menu_type === "lunch" || m.menu_type === "food" || m.menu_type === "drinks"
  ) || [];

  const lunchMenu = menus?.find((m) => m.menu_type === "lunch");
  const foodMenu = menus?.find((m) => m.menu_type === "food");
  const drinksMenu = menus?.find((m) => m.menu_type === "drinks");

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = standardMenus.findIndex((m) => m.id === active.id);
      const newIndex = standardMenus.findIndex((m) => m.id === over.id);

      const reorderedMenus = arrayMove(standardMenus, oldIndex, newIndex);
      
      const updates = reorderedMenus.map((menu, index) => ({
        id: menu.id,
        sort_order: index + 1,
      }));

      try {
        await updateOrderMutation.mutateAsync(updates);
        toast.success("Reihenfolge gespeichert");
      } catch (error) {
        toast.error("Fehler beim Speichern der Reihenfolge");
        console.error(error);
      }
    }
  };

  const getMenuLabel = (menuType: string) => {
    switch (menuType) {
      case "lunch": return "Mittagsmenü";
      case "food": return "Speisekarte";
      case "drinks": return "Getränkekarte";
      default: return menuType;
    }
  };

  const getMenuViewPath = (menuType: string) => {
    switch (menuType) {
      case "lunch": return "/mittagsmenu";
      case "food": return "/speisekarte";
      case "drinks": return "/getraenke";
      default: return "/";
    }
  };

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      navigate("/admin/login");
    }
  }, [user, isAdmin, loading, navigate]);

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error("Fehler beim Abmelden");
    } else {
      toast.success("Erfolgreich abgemeldet");
      navigate("/admin/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Laden...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <img src={storiaLogo} alt="STORIA" className="h-10 hover:opacity-80 transition-opacity cursor-pointer" />
            </Link>
            <div>
              <h1 className="font-serif font-semibold">Admin-Dashboard</h1>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">
                <ExternalLink className="h-4 w-4 mr-2" />
                Zur Webseite
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Abmelden
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-serif font-semibold mb-2">Menü-Verwaltung</h2>
          <p className="text-muted-foreground">
            Laden Sie PDF-Dateien hoch, um die Menükarten zu aktualisieren.
          </p>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={standardMenus.map((m) => m.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid gap-4">
              {standardMenus.map((menu) => (
                <SortableMenuCard key={menu.id} id={menu.id}>
                  <CollapsibleMenuCard
                    title={getMenuLabel(menu.menu_type)}
                    menuId={menu.id}
                    isPublished={menu.is_published}
                  >
                    <MenuStatusCard 
                      menuType={menu.menu_type} 
                      menuLabel={getMenuLabel(menu.menu_type)} 
                      viewPath={getMenuViewPath(menu.menu_type)} 
                    />
                    <MenuUploader 
                      menuType={menu.menu_type} 
                      menuLabel={getMenuLabel(menu.menu_type)} 
                    />
                  </CollapsibleMenuCard>
                </SortableMenuCard>
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Besondere Anlässe Section */}
        <SpecialOccasionsManager />
      </main>
    </div>
  );
};

export default Admin;
