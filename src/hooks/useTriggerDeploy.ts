import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Löst einen GitHub-Deploy aus, der die SEO-Inhalte aktualisiert
 */
export const triggerGitHubDeploy = async (): Promise<boolean> => {
  try {
    console.log("Triggering GitHub deploy for SEO update...");
    
    const { data, error } = await supabase.functions.invoke('trigger-github-deploy');
    
    if (error) {
      console.error("Error triggering deploy:", error);
      toast.error("SEO-Update konnte nicht ausgelöst werden");
      return false;
    }
    
    if (data?.success) {
      console.log("GitHub deploy triggered successfully");
      toast.success("SEO-Update wird im Hintergrund ausgeführt");
      return true;
    } else {
      console.error("Deploy trigger failed:", data?.error);
      toast.error(`SEO-Update fehlgeschlagen: ${data?.error || 'Unbekannter Fehler'}`);
      return false;
    }
  } catch (err) {
    console.error("Unexpected error triggering deploy:", err);
    toast.error("Fehler beim Auslösen des SEO-Updates");
    return false;
  }
};
