import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { z } from "zod";
import storiaLogo from "@/assets/storia-logo.webp";
import SEO from "@/components/SEO";

const passwordSchema = z.string().min(8, "Passwort muss mindestens 8 Zeichen haben");

const AdminResetPassword = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Supabase parses the recovery token from the URL hash and emits PASSWORD_RECOVERY
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || session) {
        setHasSession(true);
        setChecking(false);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setHasSession(true);
      setChecking(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = passwordSchema.safeParse(password);
    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }
    if (password !== confirm) {
      toast.error("Die Passwörter stimmen nicht überein");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Passwort erfolgreich geändert. Du wirst weitergeleitet.");
        setTimeout(() => navigate("/admin"), 1200);
      }
    } catch {
      toast.error("Ein Fehler ist aufgetreten");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <SEO title="Passwort zurücksetzen" canonical="/admin/reset-password" noIndex={true} />
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <img src={storiaLogo} alt="STORIA" className="h-16 w-auto mx-auto mb-4" />
            <h1 className="text-2xl font-serif font-semibold">Neues Passwort festlegen</h1>
          </div>

          {checking ? (
            <div className="text-center text-muted-foreground">Laden...</div>
          ) : !hasSession ? (
            <div className="bg-card p-8 rounded-lg border border-border text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Dieser Link ist ungültig oder abgelaufen. Bitte fordere eine neue E-Mail zum
                Zurücksetzen des Passworts an.
              </p>
              <Button onClick={() => navigate("/admin/login")} className="w-full">
                Zurück zum Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 bg-card p-8 rounded-lg border border-border">
              <div className="space-y-2">
                <Label htmlFor="new-password">Neues Passwort</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Passwort bestätigen</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Speichern..." : "Passwort speichern"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminResetPassword;