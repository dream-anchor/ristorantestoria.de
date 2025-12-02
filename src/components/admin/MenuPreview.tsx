import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, GripVertical } from "lucide-react";

interface MenuItem {
  name: string;
  name_en: string;
  description: string;
  description_en: string;
  price: number | null;
  price_display: string;
  sort_order: number;
}

interface MenuCategory {
  name: string;
  name_en: string;
  description: string;
  description_en: string;
  sort_order: number;
  items: MenuItem[];
}

interface ParsedMenu {
  title: string;
  subtitle: string;
  categories: MenuCategory[];
}

interface MenuPreviewProps {
  data: ParsedMenu;
  onUpdate: (data: ParsedMenu) => void;
}

const MenuPreview = ({ data, onUpdate }: MenuPreviewProps) => {
  const updateTitle = (value: string) => {
    onUpdate({ ...data, title: value });
  };

  const updateSubtitle = (value: string) => {
    onUpdate({ ...data, subtitle: value });
  };

  const updateCategory = (catIndex: number, field: keyof MenuCategory, value: string) => {
    const newCategories = [...data.categories];
    newCategories[catIndex] = { ...newCategories[catIndex], [field]: value };
    onUpdate({ ...data, categories: newCategories });
  };

  const updateItem = (catIndex: number, itemIndex: number, field: keyof MenuItem, value: string | number | null) => {
    const newCategories = [...data.categories];
    const newItems = [...newCategories[catIndex].items];
    newItems[itemIndex] = { ...newItems[itemIndex], [field]: value };
    newCategories[catIndex] = { ...newCategories[catIndex], items: newItems };
    onUpdate({ ...data, categories: newCategories });
  };

  const deleteItem = (catIndex: number, itemIndex: number) => {
    const newCategories = [...data.categories];
    const newItems = newCategories[catIndex].items.filter((_, i) => i !== itemIndex);
    newCategories[catIndex] = { ...newCategories[catIndex], items: newItems };
    onUpdate({ ...data, categories: newCategories });
  };

  const addItem = (catIndex: number) => {
    const newCategories = [...data.categories];
    const newItem: MenuItem = {
      name: 'Neues Gericht',
      name_en: '',
      description: '',
      description_en: '',
      price: 0,
      price_display: '€0,00',
      sort_order: newCategories[catIndex].items.length,
    };
    newCategories[catIndex] = {
      ...newCategories[catIndex],
      items: [...newCategories[catIndex].items, newItem],
    };
    onUpdate({ ...data, categories: newCategories });
  };

  const deleteCategory = (catIndex: number) => {
    const newCategories = data.categories.filter((_, i) => i !== catIndex);
    onUpdate({ ...data, categories: newCategories });
  };

  const addCategory = () => {
    const newCategory: MenuCategory = {
      name: 'Neue Kategorie',
      name_en: '',
      description: '',
      description_en: '',
      sort_order: data.categories.length,
      items: [],
    };
    onUpdate({ ...data, categories: [...data.categories, newCategory] });
  };

  return (
    <div className="border border-border rounded-lg p-6 space-y-6 bg-secondary/30">
      <div className="space-y-4">
        <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">
          Vorschau & Bearbeitung
        </h4>

        {/* Title & Subtitle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Titel</label>
            <Input
              value={data.title || ''}
              onChange={(e) => updateTitle(e.target.value)}
              placeholder="Menü-Titel"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Untertitel</label>
            <Input
              value={data.subtitle || ''}
              onChange={(e) => updateSubtitle(e.target.value)}
              placeholder="Zusätzliche Info"
            />
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-6">
        {data.categories.map((category, catIndex) => (
          <div key={catIndex} className="border border-border rounded-lg p-4 bg-background">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <Input
                  value={category.name}
                  onChange={(e) => updateCategory(catIndex, 'name', e.target.value)}
                  className="font-semibold w-auto"
                  placeholder="Kategoriename"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteCategory(catIndex)}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Items */}
            <div className="space-y-3 ml-6">
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-start gap-3 p-3 bg-secondary/50 rounded">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                    <Input
                      value={item.name}
                      onChange={(e) => updateItem(catIndex, itemIndex, 'name', e.target.value)}
                      placeholder="Gericht"
                      className="md:col-span-2"
                    />
                    <Input
                      value={item.price_display}
                      onChange={(e) => updateItem(catIndex, itemIndex, 'price_display', e.target.value)}
                      placeholder="Preis"
                    />
                    <Textarea
                      value={item.description || ''}
                      onChange={(e) => updateItem(catIndex, itemIndex, 'description', e.target.value)}
                      placeholder="Beschreibung (optional)"
                      className="md:col-span-3 min-h-[60px] resize-y"
                      rows={2}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteItem(catIndex, itemIndex)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              <Button
                variant="outline"
                size="sm"
                onClick={() => addItem(catIndex)}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Gericht hinzufügen
              </Button>
            </div>
          </div>
        ))}

        <Button
          variant="outline"
          onClick={addCategory}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Kategorie hinzufügen
        </Button>
      </div>

      {/* Summary */}
      <div className="text-sm text-muted-foreground border-t border-border pt-4">
        {data.categories.length} Kategorien, {data.categories.reduce((sum, cat) => sum + cat.items.length, 0)} Gerichte
      </div>
    </div>
  );
};

export default MenuPreview;
