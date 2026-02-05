import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { slugify, generateUniqueSlug } from "@/lib/slugify";
import { triggerGitHubDeploy } from "@/hooks/useTriggerDeploy";
import { generateAllSlugVariants, getRecurringMenuSlugs } from "@/lib/slugTranslations";

export interface ParsedMenuItem {
  name: string;
  name_en: string;
  name_it: string;
  name_fr: string;
  description: string;
  description_en: string;
  description_it: string;
  description_fr: string;
  price: number | null;
  price_display: string;
  price_display_en: string;
  price_display_it: string;
  price_display_fr: string;
  sort_order: number;
}

export interface ParsedMenuCategory {
  name: string;
  name_en: string;
  name_it: string;
  name_fr: string;
  description: string;
  description_en: string;
  description_it: string;
  description_fr: string;
  sort_order: number;
  items: ParsedMenuItem[];
}

export interface ParsedMenu {
  title: string;
  title_en: string;
  title_it: string;
  title_fr: string;
  subtitle: string;
  subtitle_en: string;
  subtitle_it: string;
  subtitle_fr: string;
  categories: ParsedMenuCategory[];
}

export interface SpecialMenu {
  id: string;
  title: string | null;
  title_en: string | null;
  title_it: string | null;
  title_fr: string | null;
  subtitle: string | null;
  subtitle_en: string | null;
  subtitle_it: string | null;
  subtitle_fr: string | null;
  slug: string | null;
  slug_en: string | null;
  slug_it: string | null;
  slug_fr: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string | null;
  updated_at: string | null;
  sort_order: number;
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
        .order('sort_order', { ascending: true });

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
          title_en: menu.title_en,
          title_it: menu.title_it,
          title_fr: menu.title_fr,
          subtitle: menu.subtitle,
          subtitle_en: menu.subtitle_en,
          subtitle_it: menu.subtitle_it,
          subtitle_fr: menu.subtitle_fr,
          slug: (menu as any).slug || null,
          slug_en: (menu as any).slug_en || null,
          slug_it: (menu as any).slug_it || null,
          slug_fr: (menu as any).slug_fr || null,
          is_published: menu.is_published || false,
          published_at: menu.published_at,
          created_at: menu.created_at,
          updated_at: menu.updated_at,
          sort_order: menu.sort_order || 0,
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
        .order('sort_order', { ascending: true });

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
      // Get the highest sort_order of existing special menus
      const { data: existingMenus } = await supabase
        .from('menus')
        .select('sort_order')
        .eq('menu_type', 'special')
        .order('sort_order', { ascending: false })
        .limit(1);

      const nextSortOrder = existingMenus && existingMenus.length > 0 
        ? (existingMenus[0].sort_order || 99) + 1 
        : 100;

      // Generate unique slug
      const baseSlug = slugify('Neuer Anlass');
      const uniqueSlug = await generateUniqueSlug(baseSlug, async (slug) => {
        const { data } = await supabase
          .from('menus')
          .select('id')
          .eq('slug', slug)
          .maybeSingle();
        return !!data;
      });

      // Generate translated slugs for all languages
      const slugVariants = generateAllSlugVariants(uniqueSlug);

      const { data, error } = await supabase
        .from('menus')
        .insert({
          menu_type: 'special',
          title: 'Neuer Anlass',
          slug: uniqueSlug,
          slug_en: slugVariants.en,
          slug_it: slugVariants.it,
          slug_fr: slugVariants.fr,
          is_published: false,
          sort_order: nextSortOrder,
        } as any)
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

export const useMenuContent = (menuId: string | undefined) => {
  return useQuery({
    queryKey: ['menu-content', menuId],
    queryFn: async (): Promise<ParsedMenu | null> => {
      if (!menuId) return null;
      
      // Load menu data
      const { data: menu, error: menuError } = await supabase
        .from('menus')
        .select('*')
        .eq('id', menuId)
        .maybeSingle();
      
      if (menuError) throw menuError;
      if (!menu) return null;

      // Load categories
      const { data: categories, error: catError } = await supabase
        .from('menu_categories')
        .select('*')
        .eq('menu_id', menuId)
        .order('sort_order');
      
      if (catError) throw catError;

      // Load items for all categories
      const categoryIds = categories?.map(c => c.id) || [];
      let items: any[] = [];
      
      if (categoryIds.length > 0) {
        const { data: itemsData, error: itemsError } = await supabase
          .from('menu_items')
          .select('*')
          .in('category_id', categoryIds)
          .order('sort_order');
        
        if (itemsError) throw itemsError;
        items = itemsData || [];
      }

      // Convert to ParsedMenu format
      return {
        title: menu.title || '',
        title_en: menu.title_en || '',
        title_it: menu.title_it || '',
        title_fr: menu.title_fr || '',
        subtitle: menu.subtitle || '',
        subtitle_en: menu.subtitle_en || '',
        subtitle_it: menu.subtitle_it || '',
        subtitle_fr: menu.subtitle_fr || '',
        categories: categories?.map(cat => ({
          name: cat.name,
          name_en: cat.name_en || '',
          name_it: cat.name_it || '',
          name_fr: cat.name_fr || '',
          description: cat.description || '',
          description_en: cat.description_en || '',
          description_it: cat.description_it || '',
          description_fr: cat.description_fr || '',
          sort_order: cat.sort_order || 0,
          items: items
            .filter(item => item.category_id === cat.id)
            .map(item => ({
              name: item.name,
              name_en: item.name_en || '',
              name_it: item.name_it || '',
              name_fr: item.name_fr || '',
              description: item.description || '',
              description_en: item.description_en || '',
              description_it: item.description_it || '',
              description_fr: item.description_fr || '',
              price: item.price,
              price_display: item.price_display || '',
              price_display_en: (item as any).price_display_en || '',
              price_display_it: (item as any).price_display_it || '',
              price_display_fr: (item as any).price_display_fr || '',
              sort_order: item.sort_order || 0,
            })),
        })) || [],
      };
    },
    enabled: !!menuId,
    staleTime: 0,
  });
};

export const useSaveMenuContent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ menuId, data }: { menuId: string; data: ParsedMenu }) => {
      try {
        console.log('[SaveMenuContent] Starting save for menu:', menuId, 'title:', data.title);

        // Check if this is a recurring menu theme (Valentinstag, Weihnachten, etc.)
        // If so, use predefined SEO-permanent slugs
        const recurringMenuSlugs = getRecurringMenuSlugs(data.title);
        console.log('[SaveMenuContent] Recurring slugs:', recurringMenuSlugs);

      let slugVariants: { de: string; en: string; it: string; fr: string };

      if (recurringMenuSlugs) {
        // Use predefined slugs for recurring themes (SEO-important!)
        slugVariants = recurringMenuSlugs;
      } else {
        // Generate new slug from title for non-recurring menus
        const baseSlug = slugify(data.title);
        const uniqueSlug = await generateUniqueSlug(baseSlug, async (slug) => {
          const { data: existing } = await supabase
            .from('menus')
            .select('id')
            .eq('slug', slug)
            .neq('id', menuId)
            .maybeSingle();
          return !!existing;
        });

        // Generate translated slugs for all languages
        slugVariants = generateAllSlugVariants(uniqueSlug);
      }

      // Update menu title/subtitle/slug (including translated slugs)
      const { error: menuError } = await supabase
        .from('menus')
        .update({
          title: data.title,
          title_en: data.title_en,
          title_it: data.title_it,
          title_fr: data.title_fr,
          subtitle: data.subtitle,
          subtitle_en: data.subtitle_en,
          subtitle_it: data.subtitle_it,
          subtitle_fr: data.subtitle_fr,
          slug: slugVariants.de,
          slug_en: slugVariants.en,
          slug_it: slugVariants.it,
          slug_fr: slugVariants.fr,
          updated_at: new Date().toISOString(),
        } as any)
        .eq('id', menuId);

      if (menuError) {
        console.error('[SaveMenuContent] Error updating menu:', menuError);
        throw new Error(`Fehler beim Aktualisieren des Menüs: ${menuError.message}`);
      }
      console.log('[SaveMenuContent] Menu updated successfully');

      // Get existing categories to delete them
      const { data: existingCategories } = await supabase
        .from('menu_categories')
        .select('id')
        .eq('menu_id', menuId);

      console.log('[SaveMenuContent] Existing categories:', existingCategories?.length || 0);

      if (existingCategories && existingCategories.length > 0) {
        const categoryIds = existingCategories.map(c => c.id);
        console.log('[SaveMenuContent] Deleting items from categories:', categoryIds);

        // Delete existing items first (due to foreign key constraint)
        const { error: itemsDeleteError } = await supabase
          .from('menu_items')
          .delete()
          .in('category_id', categoryIds);

        if (itemsDeleteError) {
          console.error('Error deleting menu items:', itemsDeleteError);
          throw new Error(`Fehler beim Löschen der Gerichte: ${itemsDeleteError.message}`);
        }

        // Delete existing categories
        const { error: categoriesDeleteError } = await supabase
          .from('menu_categories')
          .delete()
          .eq('menu_id', menuId);

        if (categoriesDeleteError) {
          console.error('[SaveMenuContent] Error deleting menu categories:', categoriesDeleteError);
          throw new Error(`Fehler beim Löschen der Kategorien: ${categoriesDeleteError.message}`);
        }
        console.log('[SaveMenuContent] Old categories deleted successfully');
      }

      console.log('[SaveMenuContent] Inserting', data.categories.length, 'new categories');
      // Insert new categories and items
      for (let catIndex = 0; catIndex < data.categories.length; catIndex++) {
        const category = data.categories[catIndex];
        
        const { data: newCategory, error: catError } = await supabase
          .from('menu_categories')
          .insert({
            menu_id: menuId,
            name: category.name,
            name_en: category.name_en || null,
            name_it: category.name_it || null,
            name_fr: category.name_fr || null,
            description: category.description || null,
            description_en: category.description_en || null,
            description_it: category.description_it || null,
            description_fr: category.description_fr || null,
            sort_order: catIndex,
          })
          .select()
          .single();

        if (catError) {
          console.error('Error inserting category:', catError);
          throw new Error(`Fehler beim Erstellen der Kategorie "${category.name}": ${catError.message}`);
        }

        // Insert items for this category
        if (category.items.length > 0) {
          const itemsToInsert = category.items.map((item, itemIndex) => ({
            category_id: newCategory.id,
            name: item.name,
            name_en: item.name_en || null,
            name_it: item.name_it || null,
            name_fr: item.name_fr || null,
            description: item.description || null,
            description_en: item.description_en || null,
            description_it: item.description_it || null,
            description_fr: item.description_fr || null,
            price: item.price,
            price_display: item.price_display || null,
            price_display_en: item.price_display_en || null,
            price_display_it: item.price_display_it || null,
            price_display_fr: item.price_display_fr || null,
            sort_order: itemIndex,
          }));

          const { error: itemsError } = await supabase
            .from('menu_items')
            .insert(itemsToInsert);

          if (itemsError) {
            console.error('Error inserting items:', itemsError);
            throw new Error(`Fehler beim Erstellen der Gerichte in "${category.name}": ${itemsError.message}`);
          }
        }
      }

        console.log('[SaveMenuContent] Save completed successfully');
        return { success: true };
      } catch (error) {
        console.error('[SaveMenuContent] Unexpected error:', error);
        // Re-throw with proper Error object
        if (error instanceof Error) {
          throw error;
        }
        throw new Error(`Unerwarteter Fehler: ${JSON.stringify(error)}`);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['special-menus'] });
      queryClient.invalidateQueries({ queryKey: ['menu-content'] });
      queryClient.invalidateQueries({ queryKey: ['admin-menus'] });
      queryClient.invalidateQueries({ queryKey: ['published-special-menus'] });
      queryClient.invalidateQueries({ queryKey: ['special-menu'] });
      
      // Trigger GitHub deploy for SEO update
      triggerGitHubDeploy();
    },
  });
};

export const useSpecialMenuBySlug = (slug: string, language?: string) => {
  return useQuery({
    queryKey: ['special-menu', slug, language],
    queryFn: async () => {
      // Search across all slug columns (de, en, it, fr)
      // This enables URLs like /en/special-occasions/valentines-menu to work
      const { data, error } = await supabase
        .from('menus')
        .select('*')
        .eq('is_published', true)
        .or(`slug.eq.${slug},slug_en.eq.${slug},slug_it.eq.${slug},slug_fr.eq.${slug}`)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });
};
