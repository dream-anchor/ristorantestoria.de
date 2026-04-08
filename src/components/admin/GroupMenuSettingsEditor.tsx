import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings2, Loader2, Languages } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAllGroupMenuSettings, useUpsertGroupMenuSetting } from "@/hooks/useGroupMenus";

const LANGS = ["de", "en", "it", "fr"] as const;
type Lang = typeof LANGS[number];

const NUMERIC_KEYS = ["min_group_size", "free_leader_threshold", "free_driver_threshold", "advance_booking_days"] as const;

const SETTING_LABELS: Record<string, string> = {
  general_note: "Allgemeiner Hinweis (unter den Menükarten)",
  min_group_size: "Mindestgruppengröße (Personen)",
  free_leader_threshold: "Ab X Personen: Reiseleiter frei",
  free_driver_threshold: "Ab X Personen: Fahrer frei",
  advance_booking_days: "Vorausbuchung (Tage)",
};

const GroupMenuSettingsEditor = () => {
  const { data: settings, isLoading } = useAllGroupMenuSettings();
  const upsert = useUpsertGroupMenuSetting();

  const [noteText, setNoteText] = useState<Record<Lang, string>>({ de: "", en: "", it: "", fr: "" });
  const [numericValues, setNumericValues] = useState<Record<string, number>>({
    min_group_size: 20,
    free_leader_threshold: 20,
    free_driver_threshold: 40,
    advance_booking_days: 7,
  });
  const [isDirty, setIsDirty] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);

  const handleAutoTranslateNote = async () => {
    setIsTranslating(true);
    try {
      const { data, error } = await supabase.functions.invoke("translate-group-menu", {
        body: { source_language: "de", fields: { general_note: noteText.de } },
      });

      if (error || data?.error) {
        toast.error(`Übersetzung fehlgeschlagen: ${data?.error ?? error?.message}`);
        return;
      }

      const { translations } = data as { translations: Record<string, Record<string, string>> };
      const targetLangs: Lang[] = ["en", "it", "fr"];

      for (const lang of targetLangs) {
        const t = translations[lang];
        if (t?.general_note) {
          setNoteText((p) => ({ ...p, [lang]: t.general_note }));
        }
      }

      setIsDirty(true);
      toast.success("EN, IT, FR wurden aktualisiert");
    } catch (err) {
      toast.error("Übersetzung fehlgeschlagen");
      console.error("[translate-note] error:", err);
    } finally {
      setIsTranslating(false);
    }
  };

  // Initialize form from loaded settings
  useEffect(() => {
    if (!settings) return;
    for (const setting of settings) {
      if (setting.setting_key === "general_note") {
        const val = setting.setting_value as Record<Lang, string>;
        setNoteText({
          de: val?.de ?? "",
          en: val?.en ?? "",
          it: val?.it ?? "",
          fr: val?.fr ?? "",
        });
      } else if (NUMERIC_KEYS.includes(setting.setting_key as typeof NUMERIC_KEYS[number])) {
        setNumericValues((prev) => ({
          ...prev,
          [setting.setting_key]: Number(setting.setting_value) || 0,
        }));
      }
    }
  }, [settings]);

  const handleSave = async () => {
    try {
      await upsert.mutateAsync({ key: "general_note", value: noteText });
      for (const key of NUMERIC_KEYS) {
        await upsert.mutateAsync({ key, value: numericValues[key] });
      }
      toast.success("Einstellungen gespeichert");
      setIsDirty(false);
    } catch {
      toast.error("Fehler beim Speichern");
    }
  };

  return (
    <div className="mt-8 md:mt-10">
      <div className="flex items-center gap-3 mb-2">
        <Settings2 className="h-5 w-5 md:h-6 md:w-6 text-primary" />
        <h2 className="text-xl md:text-2xl font-serif font-semibold">Gruppenmenü-Einstellungen</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        Globale Einstellungen für die Reisegruppen-Seite.
      </p>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : (
        <div className="space-y-6 max-w-2xl">
          {/* Numeric settings */}
          <div className="grid grid-cols-2 gap-4">
            {NUMERIC_KEYS.map((key) => (
              <div key={key}>
                <Label className="text-xs">{SETTING_LABELS[key]}</Label>
                <Input
                  type="number"
                  value={numericValues[key] ?? 0}
                  onChange={(e) => {
                    setNumericValues((p) => ({ ...p, [key]: Number(e.target.value) }));
                    setIsDirty(true);
                  }}
                  className="mt-1"
                />
              </div>
            ))}
          </div>

          {/* general_note – multilingual */}
          <div>
            <Label className="text-xs mb-2 block">{SETTING_LABELS["general_note"]}</Label>
            <Tabs defaultValue="de">
              <TabsList>
                {LANGS.map((lang) => (
                  <TabsTrigger key={lang} value={lang}>{lang.toUpperCase()}</TabsTrigger>
                ))}
              </TabsList>
              {LANGS.map((lang) => (
                <TabsContent key={lang} value={lang} className="mt-2 space-y-2">
                  <Textarea
                    rows={4}
                    value={noteText[lang]}
                    onChange={(e) => {
                      setNoteText((p) => ({ ...p, [lang]: e.target.value }));
                      setIsDirty(true);
                    }}
                  />
                  {lang === "de" && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAutoTranslateNote}
                      disabled={isTranslating || !noteText.de.trim()}
                    >
                      {isTranslating ? (
                        <><Loader2 className="h-3 w-3 mr-2 animate-spin" /> Übersetze in 3 Sprachen…</>
                      ) : (
                        <><Languages className="h-3 w-3 mr-2" /> Automatisch übersetzen</>
                      )}
                    </Button>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>

          <Button onClick={handleSave} disabled={upsert.isPending || !isDirty}>
            {upsert.isPending ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Speichern…</>
            ) : "Einstellungen speichern"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default GroupMenuSettingsEditor;
