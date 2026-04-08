import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { UtensilsCrossed, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  useAllGroupMenus,
  useUpsertGroupMenu,
  useDeleteGroupMenu,
  type GroupMenu,
} from "@/hooks/useGroupMenus";

const LANGS = ["de", "en", "it", "fr"] as const;
type Lang = typeof LANGS[number];

// ── Empty menu template ──────────────────────────────────────────────────────

const emptyMenu = (): Partial<GroupMenu> => ({
  menu_key: "",
  title: { de: "", en: "", it: "", fr: "" },
  subtitle: { de: "", en: "", it: "", fr: "" },
  badge: null,
  items: { de: "", en: "", it: "", fr: "" } as unknown as Record<string, string[]>,
  duration: { de: "", en: "", it: "", fr: "" },
  price_label: { de: "", en: "", it: "", fr: "" },
  price_note: { de: "", en: "", it: "", fr: "" },
  price_amount: 0,
  sort_order: 99,
  is_active: true,
});

// ── Helpers for items (stored as arrays, edited as textarea) ─────────────────

function itemsToText(items: Record<string, string[]> | undefined, lang: Lang): string {
  if (!items) return "";
  const arr = items[lang] ?? items["de"] ?? [];
  return Array.isArray(arr) ? arr.join("\n") : String(arr);
}

function textToItems(text: string): string[] {
  return text.split("\n").map((s) => s.trim()).filter(Boolean);
}

// ── Edit Modal ───────────────────────────────────────────────────────────────

interface EditModalProps {
  menu: Partial<GroupMenu> & { id?: string };
  onClose: () => void;
}

const EditModal = ({ menu: initial, onClose }: EditModalProps) => {
  const [form, setForm] = useState<Partial<GroupMenu> & { id?: string }>(initial);
  const [itemsText, setItemsText] = useState<Record<Lang, string>>({
    de: itemsToText(initial.items as Record<string, string[]>, "de"),
    en: itemsToText(initial.items as Record<string, string[]>, "en"),
    it: itemsToText(initial.items as Record<string, string[]>, "it"),
    fr: itemsToText(initial.items as Record<string, string[]>, "fr"),
  });
  const [hasBadge, setHasBadge] = useState(!!initial.badge);
  const [badgeText, setBadgeText] = useState<Record<Lang, string>>({
    de: (initial.badge as Record<string, string>)?.de ?? "",
    en: (initial.badge as Record<string, string>)?.en ?? "",
    it: (initial.badge as Record<string, string>)?.it ?? "",
    fr: (initial.badge as Record<string, string>)?.fr ?? "",
  });

  const upsert = useUpsertGroupMenu();

  const setLangField = (
    field: "title" | "subtitle" | "duration" | "price_label" | "price_note",
    lang: Lang,
    value: string
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: { ...(prev[field] as Record<string, string>), [lang]: value },
    }));
  };

  const handleSave = async () => {
    const builtItems: Record<Lang, string[]> = {
      de: textToItems(itemsText.de),
      en: textToItems(itemsText.en),
      it: textToItems(itemsText.it),
      fr: textToItems(itemsText.fr),
    };

    const payload: Partial<GroupMenu> & { id?: string } = {
      ...form,
      items: builtItems as unknown as Record<string, string[]>,
      badge: hasBadge ? badgeText : null,
    };

    try {
      await upsert.mutateAsync(payload);
      toast.success(form.id ? "Menü gespeichert" : "Menü erstellt");
      onClose();
    } catch {
      toast.error("Fehler beim Speichern");
    }
  };

  const isNew = !form.id;

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isNew ? "Neues Gruppenmenü" : `Menü ${form.menu_key} bearbeiten`}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Meta fields */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Menü-Key</Label>
              <Input
                value={form.menu_key ?? ""}
                onChange={(e) => setForm((p) => ({ ...p, menu_key: e.target.value }))}
                placeholder="A"
              />
            </div>
            <div>
              <Label>Sort-Order</Label>
              <Input
                type="number"
                value={form.sort_order ?? 0}
                onChange={(e) => setForm((p) => ({ ...p, sort_order: Number(e.target.value) }))}
              />
            </div>
            <div>
              <Label>Preis (€, für Schema.org)</Label>
              <Input
                type="number"
                value={form.price_amount ?? 0}
                onChange={(e) => setForm((p) => ({ ...p, price_amount: Number(e.target.value) }))}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Switch
              checked={!!form.is_active}
              onCheckedChange={(v) => setForm((p) => ({ ...p, is_active: v }))}
            />
            <Label>Aktiv (auf /reisegruppen/ anzeigen)</Label>
          </div>

          <div className="flex items-center gap-3">
            <Switch checked={hasBadge} onCheckedChange={setHasBadge} />
            <Label>Featured-Badge anzeigen (hebt Menü hervor)</Label>
          </div>

          {/* Language tabs */}
          <Tabs defaultValue="de">
            <TabsList>
              {LANGS.map((lang) => (
                <TabsTrigger key={lang} value={lang}>{lang.toUpperCase()}</TabsTrigger>
              ))}
            </TabsList>

            {LANGS.map((lang) => (
              <TabsContent key={lang} value={lang} className="space-y-4 mt-4">
                <div>
                  <Label>Titel</Label>
                  <Input
                    value={(form.title as Record<string, string>)?.[lang] ?? ""}
                    onChange={(e) => setLangField("title", lang, e.target.value)}
                  />
                </div>
                <div>
                  <Label>Subtitle</Label>
                  <Input
                    value={(form.subtitle as Record<string, string>)?.[lang] ?? ""}
                    onChange={(e) => setLangField("subtitle", lang, e.target.value)}
                  />
                </div>
                {hasBadge && (
                  <div>
                    <Label>Badge-Text (z.B. "Beliebt")</Label>
                    <Input
                      value={badgeText[lang]}
                      onChange={(e) => setBadgeText((p) => ({ ...p, [lang]: e.target.value }))}
                    />
                  </div>
                )}
                <div>
                  <Label>Items (ein Item pro Zeile)</Label>
                  <Textarea
                    rows={5}
                    value={itemsText[lang]}
                    onChange={(e) => setItemsText((p) => ({ ...p, [lang]: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Dauer (z.B. "Ca. 45–60 Min.")</Label>
                  <Input
                    value={(form.duration as Record<string, string>)?.[lang] ?? ""}
                    onChange={(e) => setLangField("duration", lang, e.target.value)}
                  />
                </div>
                <div>
                  <Label>Preis-Anzeige (z.B. "25 € / Person")</Label>
                  <Input
                    value={(form.price_label as Record<string, string>)?.[lang] ?? ""}
                    onChange={(e) => setLangField("price_label", lang, e.target.value)}
                  />
                </div>
                <div>
                  <Label>Preis-Hinweis (z.B. "inkl. Getränke")</Label>
                  <Input
                    value={(form.price_note as Record<string, string>)?.[lang] ?? ""}
                    onChange={(e) => setLangField("price_note", lang, e.target.value)}
                  />
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Abbrechen</Button>
          <Button onClick={handleSave} disabled={upsert.isPending}>
            {upsert.isPending ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Speichern…</>
            ) : "Speichern"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ── Main Component ───────────────────────────────────────────────────────────

const GroupMenusManager = () => {
  const { data: menus, isLoading } = useAllGroupMenus();
  const deleteMenu = useDeleteGroupMenu();
  const [editMenu, setEditMenu] = useState<(Partial<GroupMenu> & { id?: string }) | null>(null);

  const handleDelete = async (id: string) => {
    try {
      await deleteMenu.mutateAsync(id);
      toast.success("Menü gelöscht");
    } catch {
      toast.error("Fehler beim Löschen");
    }
  };

  return (
    <div className="mt-8 md:mt-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <UtensilsCrossed className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            <h2 className="text-xl md:text-2xl font-serif font-semibold">Gruppenmenüs</h2>
            {menus && <Badge variant="secondary">{menus.length}</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">Menüs auf /reisegruppen/ verwalten.</p>
        </div>
        <Button onClick={() => setEditMenu(emptyMenu())} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Neues Menü
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : menus && menus.length > 0 ? (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-16">Key</TableHead>
                <TableHead>Titel (DE)</TableHead>
                <TableHead className="w-24">Preis</TableHead>
                <TableHead className="w-20">Sort</TableHead>
                <TableHead className="w-20">Aktiv</TableHead>
                <TableHead className="w-24">Badge</TableHead>
                <TableHead className="w-24 text-right">Aktionen</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {menus.map((menu) => (
                <TableRow
                  key={menu.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setEditMenu(menu)}
                >
                  <TableCell className="font-mono font-medium">{menu.menu_key}</TableCell>
                  <TableCell>
                    {(menu.title as Record<string, string>)?.de ?? "—"}
                  </TableCell>
                  <TableCell>{menu.price_amount} €</TableCell>
                  <TableCell>{menu.sort_order}</TableCell>
                  <TableCell>
                    {menu.is_active ? (
                      <Badge className="bg-green-100 text-green-800">Aktiv</Badge>
                    ) : (
                      <Badge variant="secondary">Inaktiv</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {menu.badge ? (
                      <Badge variant="outline">
                        {(menu.badge as Record<string, string>)?.de ?? "✓"}
                      </Badge>
                    ) : "—"}
                  </TableCell>
                  <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditMenu(menu)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Menü löschen?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Menü „{(menu.title as Record<string, string>)?.de}" wird unwiderruflich gelöscht.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(menu.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Löschen
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border p-6 text-center">
          <UtensilsCrossed className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">Noch keine Gruppenmenüs vorhanden.</p>
        </div>
      )}

      {editMenu !== null && (
        <EditModal menu={editMenu} onClose={() => setEditMenu(null)} />
      )}
    </div>
  );
};

export default GroupMenusManager;
