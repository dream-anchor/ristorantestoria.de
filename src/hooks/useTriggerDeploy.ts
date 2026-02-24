import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

/**
 * Löst einen GitHub-Deploy aus, der die SEO-Inhalte aktualisiert
 */
export const triggerGitHubDeploy = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.functions.invoke('trigger-github-deploy');

    if (error) {
      toast.error("SEO-Update konnte nicht ausgelöst werden");
      return false;
    }

    if (data?.success) {
      toast.success("SEO-Update wird im Hintergrund ausgeführt");
      return true;
    } else {
      toast.error(`SEO-Update fehlgeschlagen: ${data?.error || 'Unbekannter Fehler'}`);
      return false;
    }
  } catch {
    toast.error("Fehler beim Auslösen des SEO-Updates");
    return false;
  }
};
