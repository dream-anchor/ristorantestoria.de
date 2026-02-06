/**
 * Admin GSC Page
 * Google Search Console monitoring dashboard for administrators
 */
import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, LogOut } from "lucide-react";
import { GSCDashboard } from "@/components/admin/gsc";
import SEO from "@/components/SEO";
import storiaLogo from "@/assets/storia-logo.webp";
import { toast } from "sonner";

export default function AdminGSC() {
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
    <>
      <SEO
        title="Search Console - Admin"
        canonical="/admin/gsc"
        noIndex={true}
      />

      {/* Minimal Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Admin
              </Link>
            </Button>
            <div className="hidden sm:block h-6 w-px bg-border" />
            <Link to="/" className="hidden sm:block">
              <img
                src={storiaLogo}
                alt="STORIA"
                className="h-6 hover:opacity-80 transition-opacity"
              />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden md:block">
              {user.email}
            </span>
            <Button variant="ghost" size="icon" asChild className="h-8 w-8">
              <Link to="/" target="_blank">
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="h-8 w-8"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-12">
        <GSCDashboard />
      </main>
    </>
  );
}
