import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface GroupMenuOrderUpdate {
  id: string;
  sort_order: number;
}

export const useUpdateGroupMenuOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (updates: GroupMenuOrderUpdate[]) => {
      for (const update of updates) {
        const { error } = await supabase
          .from("group_menus")
          .update({ sort_order: update.sort_order })
          .eq("id", update.id);

        if (error) throw error;
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["group-menus"] });
      queryClient.invalidateQueries({ queryKey: ["group-menus-all"] });
    },
  });
};
