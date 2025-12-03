-- Add sort_order column to menus table
ALTER TABLE public.menus ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Set initial sort_order for standard menus
UPDATE public.menus SET sort_order = 1 WHERE menu_type = 'lunch' AND sort_order = 0;
UPDATE public.menus SET sort_order = 2 WHERE menu_type = 'food' AND sort_order = 0;
UPDATE public.menus SET sort_order = 3 WHERE menu_type = 'drinks' AND sort_order = 0;

-- Set sort_order for special menus based on creation order (starting at 100 to separate from standard menus)
WITH ranked AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as rn
  FROM public.menus
  WHERE menu_type = 'special' AND sort_order = 0
)
UPDATE public.menus m
SET sort_order = r.rn + 99
FROM ranked r
WHERE m.id = r.id;