-- Entferne die Unique Constraint auf menu_type um mehrere 'special' Menüs zu erlauben
ALTER TABLE menus DROP CONSTRAINT IF EXISTS menus_menu_type_key;