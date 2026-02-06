/**
 * Admin SEO Operations Page
 * SEO monitoring and management dashboard for administrators
 */
import { useEffect, Component, type ReactNode } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, LogOut, BarChart3, AlertTriangle } from "lucide-react";
import { SEODashboard } from "@/components/admin/seo-ops";
import SEO from "@/components/SEO";
import storiaLogo from "@/assets/storia-logo.webp";
import { toast } from "sonner";

// Error Boundary for catching render errors
class SEOErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("SEO Dashboard Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md text-center">
            <div className="rounded-full bg-red-100 dark:bg-red-900/50 p-4 mx-auto w-fit mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">Dashboard-Fehler</h2>
            <p className="text-muted-foreground mb-4">
              Ein Fehler ist aufgetreten beim Laden des SEO Dashboards.
            </p>
            <pre className="text-xs text-left bg-muted p-3 rounded-lg overflow-auto max-h-40 mb-4">
              {this.state.error?.message || "Unbekannter Fehler"}
            </pre>
            <Button onClick={() => window.location.reload()}>
              Seite neu laden
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function AdminSEO() {
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
        title="SEO Operations - Admin"
        canonical="/admin/seo"
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
            <Button variant="ghost" size="sm" asChild className="hidden md:flex">
              <Link to="/admin/gsc">
                <BarChart3 className="h-4 w-4 mr-1" />
                GSC
              </Link>
            </Button>
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
        <SEOErrorBoundary>
          <SEODashboard />
        </SEOErrorBoundary>
      </main>
    </>
  );
}
