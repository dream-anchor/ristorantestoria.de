import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Download, ListOrdered, Plus } from "lucide-react";
import { toast } from "sonner";
import { MailtoTemplateEditor } from "@/components/admin/SeasonalSignupsManager";
import { useSeasonalMailtoTemplates } from "@/hooks/useSeasonalMailtoTemplates";
import { buildSeasonalMailtoUrl, fillSeasonalMailtoTemplate } from "@/lib/seasonalMailto";
import { WAITLIST_GUESTS } from "@/components/SilvesterWaitlistForm";
import Redact from "@/components/admin/Redact";

type Entry = Tables<"silvester_waitlist">;
type Status = "wartet" | "angeboten" | "bestaetigt" | "abgesagt";

const TEMPLATE_KEY = "silvester_warteliste";
const STATUS_LABELS: Record<Status, string> = {
  wartet: "wartet",
  angeboten: "angeboten",
  bestaetigt: "bestätigt",
  abgesagt: "abgesagt",
};
const TIME_LABELS: Record<string, string> = { egal: "egal", frueh: "früher Abend", spaet: "später Abend" };
/** Personen-Auswahl → Zahl für den Zähler (Spannen mit Untergrenze). */
const guestsMin = (g: string) => parseInt(g, 10) || 0;
const isActive = (e: Entry) => e.status === "wartet" || e.status === "angeboten";

const SilvesterWaitlistManager = () => {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<Status | "alle">("alle");
  const [addOpen, setAddOpen] = useState(false);
  const [draft, setDraft] = useState({ name: "", email: "", phone: "", guests: "2", message: "" });
  const { data: templates } = useSeasonalMailtoTemplates();

  const { data: entries, isLoading } = useQuery({
    queryKey: ["silvester-waitlist"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("silvester_waitlist")
        .select("*")
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const invalidate = () => qc.invalidateQueries({ queryKey: ["silvester-waitlist"] });

  const setStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Status }) => {
      const { error } = await supabase.from("silvester_waitlist").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: invalidate,
    onError: () => toast.error("Status konnte nicht gespeichert werden"),
  });

  const addEntry = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("silvester_waitlist").insert({
        name: draft.name.trim(),
        email: draft.email.trim().toLowerCase() || null,
        phone: draft.phone.trim() || null,
        guests: draft.guests,
        message: draft.message.trim() || null,
        consent_text: "Telefonisch aufgenommen (Admin)",
        consent_at: new Date().toISOString(),
      });
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      setAddOpen(false);
      setDraft({ name: "", email: "", phone: "", guests: "2", message: "" });
      toast.success("Eintrag hinzugefügt");
    },
    onError: () => toast.error("Eintrag konnte nicht gespeichert werden"),
  });

  // Wie „Vormerken“: mailto nur mit An/Betreff, Text in die Zwischenablage, synchron im
  // Click-Handler und mit eindeutigem Fensternamen (IONOS/OX-Handler, Fund 13./14.10.2026).
  const offerPlace = (e: Entry) => {
    const tpl = templates?.[TEMPLATE_KEY];
    if (!tpl) return void toast.error("Keine Mailto-Vorlage für die Warteliste hinterlegt");
    if (!e.email) return void toast.error("Keine E-Mail hinterlegt – bitte anrufen");
    navigator.clipboard.writeText(fillSeasonalMailtoTemplate(tpl.body, "Silvester")).catch(() => {});
    window.open(
      buildSeasonalMailtoUrl(e.email, fillSeasonalMailtoTemplate(tpl.subject, "Silvester")),
      `storia-mailto-${e.id}-${Date.now()}`,
      "noopener,noreferrer",
    );
    toast.success(`${e.email}: E-Mail-Programm geöffnet, Text in Zwischenablage — bitte einfügen`);
    setStatus.mutate({ id: e.id, status: "angeboten" });
  };

  const exportCSV = (rows: Entry[]) => {
    const esc = (v: string | null) => `"${(v ?? "").replace(/"/g, '""')}"`;
    const head = "Nr,Name,E-Mail,Telefon,Personen,Uhrzeit,Nachricht,Status,Eingetragen\n";
    const body = rows
      .map((e, i) =>
        [i + 1, esc(e.name), esc(e.email), esc(e.phone), esc(e.guests), esc(TIME_LABELS[e.time_pref] ?? e.time_pref), esc(e.message), e.status, new Date(e.created_at).toLocaleString("de-DE")].join(","),
      )
      .join("\n");
    const url = URL.createObjectURL(new Blob(["﻿" + head + body], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `warteliste-silvester-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const all = entries ?? [];
  const position = new Map(all.map((e, i) => [e.id, i + 1]));
  const shown = filter === "alle" ? all : all.filter((e) => e.status === filter);
  const active = all.filter(isActive);
  const activeGuests = active.reduce((sum, e) => sum + guestsMin(e.guests), 0);
  const count = (s: Status) => all.filter((e) => e.status === s).length;

  return (
    <div className="mt-8 md:mt-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <ListOrdered className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            <h2 className="text-xl md:text-2xl font-serif font-semibold">Warteliste Silvester</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            <Redact>{active.length}</Redact> aktive Einträge · <Redact>{activeGuests}</Redact> Personen · Reihenfolge nach Eintragszeit
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => exportCSV(shown)} disabled={!shown.length}>
            <Download className="h-4 w-4 mr-1.5" /> CSV
          </Button>
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus className="h-4 w-4 mr-1.5" /> Eintrag hinzufügen
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {(["alle", "wartet", "angeboten", "bestaetigt", "abgesagt"] as const).map((s) => (
          <Button key={s} size="sm" variant={filter === s ? "default" : "outline"} onClick={() => setFilter(s)}>
            {s === "alle" ? "Alle" : STATUS_LABELS[s]}
            <Badge variant="secondary" className="ml-2"><Redact>{s === "alle" ? all.length : count(s)}</Redact></Badge>
          </Button>
        ))}
      </div>

      {isLoading ? (
        <Skeleton className="h-40 w-full" />
      ) : !shown.length ? (
        <p className="text-sm text-muted-foreground py-8 text-center">Keine Einträge.</p>
      ) : (
        <div className="rounded-md border overflow-x-auto mb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">#</TableHead>
                <TableHead>Name / Notiz</TableHead>
                <TableHead>Pers.</TableHead>
                <TableHead>Kontakt</TableHead>
                <TableHead>Uhrzeit</TableHead>
                <TableHead>Eingetragen</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aktion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shown.map((e) => (
                <TableRow key={e.id}>
                  <TableCell className="text-muted-foreground">{position.get(e.id)}</TableCell>
                  <TableCell>
                    <div className="font-medium"><Redact>{e.name}</Redact></div>
                    {e.message && <div className="text-xs text-muted-foreground max-w-xs"><Redact>{e.message}</Redact></div>}
                  </TableCell>
                  <TableCell>{e.guests === "10+" ? "> 10" : e.guests.replace("-", "–")}</TableCell>
                  <TableCell className="text-xs">
                    {e.email && <div><Redact>{e.email}</Redact></div>}
                    {e.phone && <div><Redact>{e.phone}</Redact></div>}
                  </TableCell>
                  <TableCell className="text-xs">{TIME_LABELS[e.time_pref] ?? e.time_pref}</TableCell>
                  <TableCell className="text-xs">{new Date(e.created_at).toLocaleString("de-DE", { dateStyle: "short", timeStyle: "short" })}</TableCell>
                  <TableCell><Badge variant={e.status === "wartet" ? "secondary" : "outline"}>{STATUS_LABELS[e.status as Status] ?? e.status}</Badge></TableCell>
                  <TableCell className="text-right whitespace-nowrap space-x-1">
                    {e.status === "wartet" && (
                      <Button size="sm" onClick={() => offerPlace(e)}>Platz anbieten</Button>
                    )}
                    {e.status === "angeboten" && (
                      <Button size="sm" variant="outline" onClick={() => setStatus.mutate({ id: e.id, status: "bestaetigt" })}>Bestätigt</Button>
                    )}
                    {isActive(e) && (
                      <Button size="sm" variant="ghost" onClick={() => setStatus.mutate({ id: e.id, status: "abgesagt" })}>Absagen</Button>
                    )}
                    {!isActive(e) && (
                      <Button size="sm" variant="ghost" onClick={() => setStatus.mutate({ id: e.id, status: "wartet" })}>Zurücksetzen</Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <MailtoTemplateEditor eventKey={TEMPLATE_KEY} />

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader><DialogTitle>Eintrag hinzufügen (z. B. telefonisch)</DialogTitle></DialogHeader>
          <form
            id="wl-add"
            className="space-y-3"
            onSubmit={(ev) => {
              ev.preventDefault();
              if (!draft.email.trim() && !draft.phone.trim()) return void toast.error("E-Mail oder Telefon angeben");
              addEntry.mutate();
            }}
          >
            <Input required placeholder="Name" value={draft.name} onChange={(ev) => setDraft((d) => ({ ...d, name: ev.target.value }))} />
            <Input type="email" placeholder="E-Mail" value={draft.email} onChange={(ev) => setDraft((d) => ({ ...d, email: ev.target.value }))} />
            <Input type="tel" placeholder="Telefon" value={draft.phone} onChange={(ev) => setDraft((d) => ({ ...d, phone: ev.target.value }))} />
            <select
              aria-label="Personen"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={draft.guests}
              onChange={(ev) => setDraft((d) => ({ ...d, guests: ev.target.value }))}
            >
              {WAITLIST_GUESTS.map((g) => <option key={g} value={g}>{g === "10+" ? "mehr als 10" : g.replace("-", "–")} Personen</option>)}
            </select>
            <Input placeholder="Notiz" value={draft.message} onChange={(ev) => setDraft((d) => ({ ...d, message: ev.target.value }))} />
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>Abbrechen</Button>
            <Button type="submit" form="wl-add" disabled={addEntry.isPending}>Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SilvesterWaitlistManager;
