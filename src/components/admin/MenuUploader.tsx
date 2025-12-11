import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Upload, Loader2, Check, Eye, SpellCheck } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import MenuPreview from "./MenuPreview";
import SpellCheckResults, { SpellingError } from "./SpellCheckResults";
import type { MenuType } from "@/hooks/useMenu";
import { triggerGitHubDeploy } from "@/hooks/useTriggerDeploy";
import { useLanguage } from "@/contexts/LanguageContext";

interface MenuUploaderProps {
  menuType: MenuType;
  menuLabel: string;
  existingMenuId?: string;
}

interface ParsedCategory {
  name: string;
  name_en: string;
  name_it: string;
  name_fr: string;
  description: string;
  description_en: string;
  description_it: string;
  description_fr: string;
  sort_order: number;
  items: ParsedItem[];
}

interface ParsedItem {
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
  sort_order: number;
}

interface ParsedMenu {
  title: string;
  title_en: string;
  title_it: string;
  title_fr: string;
  subtitle: string;
  subtitle_en: string;
  subtitle_it: string;
  subtitle_fr: string;
  categories: ParsedCategory[];
}

const MenuUploader = ({ menuType, menuLabel, existingMenuId }: MenuUploaderProps) => {
  const { t } = useLanguage();
  const queryClient = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [parsedData, setParsedData] = useState<ParsedMenu | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  // Spell check state
  const [isSpellChecking, setIsSpellChecking] = useState(false);
  const [spellCheckErrors, setSpellCheckErrors] = useState<SpellingError[]>([]);
  const [showSpellCheck, setShowSpellCheck] = useState(false);
  const [spellCheckComplete, setSpellCheckComplete] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        toast.error('Bitte wählen Sie eine PDF-Datei');
        return;
      }
      setFile(selectedFile);
      setParsedData(null);
      setShowPreview(false);
      setShowSpellCheck(false);
      setSpellCheckComplete(false);
      setSpellCheckErrors([]);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Check for missing IT/FR translations
  const detectMissingTranslations = (menuData: ParsedMenu): { it: boolean; fr: boolean } => {
    let missingIt = false;
    let missingFr = false;

    // Check title/subtitle
    if (!menuData.title_it) missingIt = true;
    if (!menuData.title_fr) missingFr = true;

    // Check categories and items
    for (const cat of menuData.categories) {
      if (!cat.name_it) missingIt = true;
      if (!cat.name_fr) missingFr = true;
      for (const item of cat.items) {
        if (!item.name_it) missingIt = true;
        if (!item.name_fr) missingFr = true;
      }
      if (missingIt && missingFr) break;
    }

    return { it: missingIt, fr: missingFr };
  };

  const runSpellCheck = async (menuData: ParsedMenu) => {
    setIsSpellChecking(true);
    try {
      const { data, error } = await supabase.functions.invoke('spell-check-menu', {
        body: { menuData }
      });

      if (error) {
        console.error('Spell check error:', error);
        toast.error(t.spellCheck?.errorRunning || 'Fehler bei der Rechtschreibprüfung');
        return;
      }

      const errors = data?.errors || [];
      setSpellCheckErrors(errors);
      setSpellCheckComplete(true);
      
      if (errors.length > 0) {
        setShowSpellCheck(true);
        toast.info(`${errors.length} ${t.spellCheck?.errorsFound || 'Fehler gefunden'}`);
      } else {
        toast.success(t.spellCheck?.noErrors || 'Keine Rechtschreibfehler gefunden!');
        setShowPreview(true);
      }
    } catch (err) {
      console.error('Spell check failed:', err);
      toast.error(t.spellCheck?.errorRunning || 'Fehler bei der Rechtschreibprüfung');
    } finally {
      setIsSpellChecking(false);
    }
  };

  const handleParse = async () => {
    if (!file) {
      toast.error('Bitte wählen Sie zuerst eine Datei');
      return;
    }

    setIsParsing(true);
    try {
      const pdfBase64 = await convertToBase64(file);
      const { data, error } = await supabase.functions.invoke('parse-menu-pdf', {
        body: { pdfBase64, menuType }
      });

      if (error) throw error;
      if (data.error) throw new Error(data.error);

      setParsedData(data.data);
      toast.success('Menü erfolgreich analysiert! Starte Rechtschreibprüfung...');
      
      // Automatically run spell check after parsing
      await runSpellCheck(data.data);
    } catch (err) {
      console.error('Parse error:', err);
      toast.error(err instanceof Error ? err.message : 'Fehler beim Analysieren der PDF');
    } finally {
      setIsParsing(false);
    }
  };

  const handleUpdateParsedData = (updatedData: ParsedMenu) => {
    setParsedData(updatedData);
  };

  const applySpellingCorrection = (error: SpellingError) => {
    if (!parsedData) return;

    const newData = { ...parsedData };
    const { location, suggestion } = error;
    
    // Helper to get language-specific field name
    const getFieldKey = (baseField: string, lang: string): string => {
      if (lang === 'de') return baseField;
      return `${baseField}_${lang}`;
    };

    if (location.type === 'title') {
      const key = getFieldKey('title', location.language) as keyof ParsedMenu;
      (newData as any)[key] = suggestion;
    } else if (location.type === 'subtitle') {
      const key = getFieldKey('subtitle', location.language) as keyof ParsedMenu;
      (newData as any)[key] = suggestion;
    } else if (location.type === 'category' && location.categoryIndex !== undefined) {
      const cat = { ...newData.categories[location.categoryIndex] };
      const key = getFieldKey(location.field, location.language) as keyof ParsedCategory;
      (cat as any)[key] = suggestion;
      newData.categories[location.categoryIndex] = cat;
    } else if (location.type === 'item' && location.categoryIndex !== undefined && location.itemIndex !== undefined) {
      const cat = { ...newData.categories[location.categoryIndex] };
      const item = { ...cat.items[location.itemIndex] };
      const key = getFieldKey(location.field, location.language) as keyof ParsedItem;
      (item as any)[key] = suggestion;
      cat.items[location.itemIndex] = item;
      newData.categories[location.categoryIndex] = cat;
    }

    setParsedData(newData);
  };

  const handleAcceptError = (error: SpellingError) => {
    applySpellingCorrection(error);
    toast.success(t.spellCheck?.correctionApplied || 'Korrektur angewendet');
  };

  const handleRejectError = (errorId: string) => {
    // Just mark as processed, don't apply correction
  };

  const handleAcceptAll = () => {
    spellCheckErrors.forEach(error => applySpellingCorrection(error));
    toast.success(t.spellCheck?.allCorrectionsApplied || 'Alle Korrekturen angewendet');
  };

  const handleRejectAll = () => {
    // Just close spell check without applying any corrections
  };

  const handleSpellCheckClose = () => {
    setShowSpellCheck(false);
    setShowPreview(true);
  };

  const handlePublish = async () => {
    if (!parsedData) return;

    setIsSaving(true);
    try {
      let menuId: string;

      if (existingMenuId) {
        const { error: updateError } = await supabase
          .from('menus')
          .update({
            title: parsedData.title,
            title_en: parsedData.title_en,
            title_it: parsedData.title_it,
            title_fr: parsedData.title_fr,
            subtitle: parsedData.subtitle,
            subtitle_en: parsedData.subtitle_en,
            subtitle_it: parsedData.subtitle_it,
            subtitle_fr: parsedData.subtitle_fr,
            is_published: false,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingMenuId);

        if (updateError) throw updateError;
        menuId = existingMenuId;

        await supabase
          .from('menu_categories')
          .delete()
          .eq('menu_id', menuId);
      } else {
        const { data: existingMenu } = await supabase
          .from('menus')
          .select('id')
          .eq('menu_type', menuType)
          .maybeSingle();

        if (existingMenu) {
          const { error: updateError } = await supabase
            .from('menus')
            .update({
              title: parsedData.title,
              title_en: parsedData.title_en,
              title_it: parsedData.title_it,
              title_fr: parsedData.title_fr,
              subtitle: parsedData.subtitle,
              subtitle_en: parsedData.subtitle_en,
              subtitle_it: parsedData.subtitle_it,
              subtitle_fr: parsedData.subtitle_fr,
              is_published: false,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingMenu.id);

          if (updateError) throw updateError;
          menuId = existingMenu.id;

          await supabase
            .from('menu_categories')
            .delete()
            .eq('menu_id', menuId);
        } else {
          const { data: newMenu, error: insertError } = await supabase
            .from('menus')
            .insert({
              menu_type: menuType,
              title: parsedData.title,
              title_en: parsedData.title_en,
              title_it: parsedData.title_it,
              title_fr: parsedData.title_fr,
              subtitle: parsedData.subtitle,
              subtitle_en: parsedData.subtitle_en,
              subtitle_it: parsedData.subtitle_it,
              subtitle_fr: parsedData.subtitle_fr,
              is_published: false,
            })
            .select()
            .single();

          if (insertError) throw insertError;
          menuId = newMenu.id;
        }
      }

      for (const category of parsedData.categories) {
        const { data: newCat, error: catError } = await supabase
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
            sort_order: Math.floor(category.sort_order),
          })
          .select()
          .single();

        if (catError) throw catError;

        for (const item of category.items) {
          const { error: itemError } = await supabase
            .from('menu_items')
            .insert({
              category_id: newCat.id,
              name: item.name,
              name_en: item.name_en || null,
              name_it: item.name_it || null,
              name_fr: item.name_fr || null,
              description: item.description || null,
              description_en: item.description_en || null,
              description_it: item.description_it || null,
              description_fr: item.description_fr || null,
              price: item.price,
              price_display: item.price_display,
              sort_order: Math.floor(item.sort_order),
            });

          if (itemError) throw itemError;
        }
      }

      const { error: publishError } = await supabase
        .from('menus')
        .update({
          is_published: true,
          published_at: new Date().toISOString(),
        })
        .eq('id', menuId);

      if (publishError) throw publishError;

      queryClient.invalidateQueries({ queryKey: ['special-menus'] });
      queryClient.invalidateQueries({ queryKey: ['published-special-menus'] });
      queryClient.invalidateQueries({ queryKey: ['admin-menus'] });
      queryClient.invalidateQueries({ queryKey: ['menu', menuType] });
      if (existingMenuId) {
        queryClient.invalidateQueries({ queryKey: ['menu-by-id', existingMenuId] });
      }

      toast.success(`${menuLabel} erfolgreich veröffentlicht!`);
      setFile(null);
      setParsedData(null);
      setShowPreview(false);
      setShowSpellCheck(false);
      setSpellCheckComplete(false);
      setSpellCheckErrors([]);
      
      triggerGitHubDeploy();
    } catch (err) {
      console.error('Save error:', err);
      toast.error('Fehler beim Speichern des Menüs');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Upload Section */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="flex-1 h-12 text-base"
        />
        <Button
          onClick={handleParse}
          disabled={!file || isParsing || isSpellChecking}
          className="w-full sm:w-auto h-12 sm:h-10 touch-manipulation"
        >
          {isParsing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analysieren...
            </>
          ) : isSpellChecking ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              {t.spellCheck?.checking || 'Prüfe...'}
            </>
          ) : (
            <>
              <Upload className="h-4 w-4 mr-2" />
              Analysieren
            </>
          )}
        </Button>
      </div>

      {file && (
        <p className="text-xs md:text-sm text-muted-foreground truncate">
          Ausgewählt: {file.name}
        </p>
      )}

      {/* Spell Check Results */}
      {showSpellCheck && parsedData && (
        <SpellCheckResults
          errors={spellCheckErrors}
          onAccept={handleAcceptError}
          onReject={handleRejectError}
          onAcceptAll={handleAcceptAll}
          onRejectAll={handleRejectAll}
          onClose={handleSpellCheckClose}
          missingTranslations={detectMissingTranslations(parsedData)}
        />
      )}

      {/* Preview Toggle & Publish */}
      {parsedData && !showSpellCheck && (
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="w-full sm:w-auto h-12 sm:h-10 touch-manipulation"
          >
            <Eye className="h-4 w-4 mr-2" />
            {showPreview ? 'Vorschau ausblenden' : 'Vorschau anzeigen'}
          </Button>
          {spellCheckComplete && (
            <Button
              variant="outline"
              onClick={() => runSpellCheck(parsedData)}
              disabled={isSpellChecking}
              className="w-full sm:w-auto h-12 sm:h-10 touch-manipulation"
            >
              <SpellCheck className="h-4 w-4 mr-2" />
              {t.spellCheck?.runAgain || 'Erneut prüfen'}
            </Button>
          )}
          <Button
            onClick={handlePublish}
            disabled={isSaving}
            className="w-full sm:w-auto h-12 sm:h-10 touch-manipulation"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Speichern...
              </>
            ) : (
              <>
                <Check className="h-4 w-4 mr-2" />
                Veröffentlichen
              </>
            )}
          </Button>
        </div>
      )}

      {/* Preview */}
      {showPreview && parsedData && !showSpellCheck && (
        <MenuPreview
          data={parsedData}
          onUpdate={handleUpdateParsedData}
        />
      )}
    </div>
  );
};

export default MenuUploader;
