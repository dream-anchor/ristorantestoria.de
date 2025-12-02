import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import storiaLogo from "@/assets/storia-logo.webp";
import MenuUploader from "@/components/admin/MenuUploader";
import MenuStatusCard from "@/components/admin/MenuStatusCard";
import { LogOut, FileText, ExternalLink } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const { user, isAdmin, loading, signOut } = useAdminAuth();

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

        <div className="grid gap-8">
          {/* Mittagsmenü */}
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-serif font-semibold">Mittagsmenü</h3>
            </div>
            <MenuStatusCard menuType="lunch" menuLabel="Mittagsmenü" viewPath="/mittagsmenu" />
            <MenuUploader menuType="lunch" menuLabel="Mittagsmenü" />
          </div>

          {/* Speisekarte */}
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-serif font-semibold">Speisekarte</h3>
            </div>
            <MenuStatusCard menuType="food" menuLabel="Speisekarte" viewPath="/speisekarte" />
            <MenuUploader menuType="food" menuLabel="Speisekarte" />
          </div>

          {/* Getränkekarte */}
          <div className="bg-card rounded-lg border border-border p-6">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-serif font-semibold">Getränkekarte</h3>
            </div>
            <MenuStatusCard menuType="drinks" menuLabel="Getränkekarte" viewPath="/getraenke" />
            <MenuUploader menuType="drinks" menuLabel="Getränkekarte" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
