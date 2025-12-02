-- Add English translation fields for special menu titles
ALTER TABLE public.menus 
ADD COLUMN title_en TEXT,
ADD COLUMN subtitle_en TEXT;