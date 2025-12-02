import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SpecialMenu {
  id: string;
  title: string | null;
  subtitle: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  category_count: number;
  item_count: number;
}

export const useSpecialMenus = () => {
  return useQuery({
    queryKey: ['special-menus'],
    queryFn: async (): Promise<SpecialMenu[]> => {
      const { data: menus, error } = await supabase
        .from('menus')
        .select('*')
        .eq('menu_type', 'special')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (!menus || menus.length === 0) return [];

      // Get categories and items counts for each menu
      const menuIds = menus.map(m => m.id);
      
      const { data: categories } = await supabase
        .from('menu_categories')
        .select('id, menu_id')
        .in('menu_id', menuIds);

      const categoryIds = categories?.map(c => c.id) || [];
      
      const { data: items } = await supabase
        .from('menu_items')
        .select('id, category_id')
        .in('category_id', categoryIds);

      return menus.map(menu => {
        const menuCategories = categories?.filter(c => c.menu_id === menu.id) || [];
        const menuCategoryIds = menuCategories.map(c => c.id);
        const menuItems = items?.filter(i => menuCategoryIds.includes(i.category_id)) || [];

        return {
          id: menu.id,
          title: menu.title,
          subtitle: menu.subtitle,
          is_published: menu.is_published || false,
          published_at: menu.published_at,
          created_at: menu.created_at,
          updated_at: menu.updated_at,
          category_count: menuCategories.length,
          item_count: menuItems.length,
        };
      });
    },
    staleTime: 30 * 1000,
  });
};

export const usePublishedSpecialMenus = () => {
  return useQuery({
    queryKey: ['published-special-menus'],
    queryFn: async () => {
      const { data: menus, error } = await supabase
        .from('menus')
        .select('*')
        .eq('menu_type', 'special')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return menus || [];
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateSpecialMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase
        .from('menus')
        .insert({
          menu_type: 'special',
          title: 'Neuer Anlass',
          is_published: false,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['special-menus'] });
    },
  });
};

export const useDeleteSpecialMenu = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (menuId: string) => {
      // First get all categories for this menu
      const { data: categories } = await supabase
        .from('menu_categories')
        .select('id')
        .eq('menu_id', menuId);

      if (categories && categories.length > 0) {
        const categoryIds = categories.map(c => c.id);
        
        // Delete all items in these categories
        await supabase
          .from('menu_items')
          .delete()
          .in('category_id', categoryIds);

        // Delete all categories
        await supabase
          .from('menu_categories')
          .delete()
          .eq('menu_id', menuId);
      }

      // Delete the menu
      const { error } = await supabase
        .from('menus')
        .delete()
        .eq('id', menuId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['special-menus'] });
    },
  });
};
