import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Bell, Download, Mail, Send, Loader2, CheckCircle2, Copy, RotateCcw, Save, MailPlus } from "lucide-react";
import { toast } from "sonner";
import { useSeasonalSignups, useSeasonalSignupCounts } from "@/hooks/useSeasonalSignups";
import { useNotifySeasonalSignups, type NotifyPreviewResult } from "@/hooks/useSeasonalNotifications";
import type { SeasonalSignup } from "@/hooks/useSeasonalSignups";
import {
  useSeasonalMailtoTemplates,
  useSaveSeasonalMailtoTemplate,
  useMarkSignupsNotified,
} from "@/hooks/useSeasonalMailtoTemplates";
import { fillSeasonalMailtoTemplate, buildSeasonalMailtoUrl } from "@/lib/seasonalMailto";
import Redact from "@/components/admin/Redact";

const EVENT_LABELS: Record<string, string> = {
  valentinstag: "Valentinstag",
  weihnachten: "Weihnachten",
  silvester: "Silvester",
};

const LANG_FLAGS: Record<string, string> = { de: "DE", en: "EN", it: "IT", fr: "FR" };

const DEFAULT_MAILTO_TEMPLATE = { subject: "", body: "" };

// ─── Manuelle Mailto-Vorlage (Ergänzung zum KI-Versand oben) ─────────────────
//
// Öffnet ein vorausgefülltes mailto:-Compose-Fenster statt eines automatischen
// Server-Sendevorgangs — der Admin sieht die Mail vor dem Absenden im eigenen
// Mail-Client und kann sie von Hand anpassen. Eine Vorlage pro Event (nicht
// pro Sprache): {{EVENT}} wird beim Öffnen automatisch ersetzt.
const MailtoTemplateEditor = ({ eventKey }: { eventKey: string }) => {
  const { data: templates, isLoading } = useSeasonalMailtoTemplates();
  const saveMutation = useSaveSeasonalMailtoTemplate();
  const stored = templates?.[eventKey];
  const [draft, setDraft] = useState(DEFAULT_MAILTO_TEMPLATE);

  useEffect(() => {
    setDraft({ subject: stored?.subject ?? "", body: stored?.body ?? "" });
  }, [stored?.subject, stored?.body, eventKey]);

  const isDirty = draft.subject !== (stored?.subject ?? "") || draft.body !== (stored?.body ?? "");

  const handleSave = async () => {
    try {
      await saveMutation.mutateAsync({ seasonal_event: eventKey, ...draft });
      toast.success("Vorlage gespeichert");
    } catch {
      toast.error("Fehler beim Speichern der Vorlage");
    }
  };

  const handleReset = () => setDraft({ subject: stored?.subject ?? "", body: stored?.body ?? "" });

  if (isLoading) {
    return <Skeleton className="h-40 w-full mb-6" />;
  }

  return (
    <Card className="p-4 space-y-3 mb-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h3 className="text-sm font-semibold">Mailto-Vorlage — {EVENT_LABELS[eventKey] ?? eventKey}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            <code className="text-[11px] bg-muted px-1 py-0.5 rounded">{"{{EVENT}}"}</code> wird
            beim Öffnen automatisch ersetzt. Gilt für alle, die diese Seite öffnen.
          </p>
        </div>
        <Badge
          variant="outline"
          className={isDirty ? "border-amber-400 text-amber-700 bg-amber-50" : "border-emerald-300 text-emerald-700 bg-emerald-50"}
        >
          {isDirty ? "Ungespeicherte Änderungen" : "Gespeichert"}
        </Badge>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground" htmlFor="mailto-subject">Betreff</label>
        <Input
          id="mailto-subject"
          value={draft.subject}
          onChange={(e) => setDraft((d) => ({ ...d, subject: e.target.value }))}
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium uppercase tracking-wide text-muted-foreground" htmlFor="mailto-body">Text</label>
        <Textarea
          id="mailto-body"
          value={draft.body}
          onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
          className="min-h-[180px] font-mono text-sm leading-relaxed"
        />
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" onClick={handleSave} disabled={saveMutation.isPending || !isDirty}>
          {saveMutation.isPending ? <Loader2 className="w-4 h-4 mr-1.5 animate-spin" /> : <Save className="w-4 h-4 mr-1.5" />}
          Vorlage speichern
        </Button>
        <Button size="sm" variant="outline" onClick={handleReset} disabled={!isDirty}>
          <RotateCcw className="w-4 h-4 mr-1.5" />
          Änderungen verwerfen
        </Button>
      </div>
    </Card>
  );
};

// ─── Send Preview Dialog ──────────────────────────────────────────────────────

const SendPreviewDialog = ({
  open,
  onClose,
  eventKey,
}: {
  open: boolean;
  onClose: () => void;
  eventKey: string;
}) => {
  const [step, setStep] = useState<"preview" | "confirm" | "done">("preview");
  const [previewData, setPreviewData] = useState<NotifyPreviewResult | null>(null);
  const notifyMutation = useNotifySeasonalSignups();

  const loadPreview = async () => {
    try {
      const result = await notifyMutation.mutateAsync({
        seasonal_event: eventKey,
        trigger_type: "manual",
        preview: true,
      });
      if ("preview" in result && result.preview) {
        setPreviewData(result as NotifyPreviewResult);
        setStep("confirm");
      }
    } catch {
      toast.error("Vorschau konnte nicht geladen werden");
    }
  };

  const handleSend = async () => {
    try {
      const result = await notifyMutation.mutateAsync({
        seasonal_event: eventKey,
        trigger_type: "manual",
      });
      if ("sent" in result) {
        toast.success(
          `${result.sent} E-Mails gesendet${result.failed ? `, ${result.failed} fehlgeschlagen` : ""}`
        );
        setStep("done");
      }
    } catch {
      toast.error("Fehler beim Senden der Benachrichtigungen");
    }
  };

  const handleClose = () => {
    setStep("preview");
    setPreviewData(null);
    onClose();
  };

  const eventLabel = EVENT_LABELS[eventKey] ?? eventKey;

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) handleClose(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>E-Mail-Benachrichtigung senden</DialogTitle>
          <DialogDescription>
            Alle vorgemerkten {eventLabel}-Abonnenten benachrichtigen
          </DialogDescription>
        </DialogHeader>

        {step === "preview" && (
          <>
            <p className="text-sm text-muted-foreground">
              Claude erstellt eine personalisierte E-Mail je Sprache.
              Bitte Vorschau laden, um Betreffzeilen zu prüfen.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>Abbrechen</Button>
              <Button onClick={loadPreview} disabled={notifyMutation.isPending}>
                {notifyMutation.isPending ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Wird generiert…</>
                ) : (
                  "Vorschau laden"
                )}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "confirm" && previewData && (
          <>
            <div className="space-y-3">
              <p className="text-sm font-medium">
                <Redact>{previewData.total}</Redact> Empfänger werden benachrichtigt:
              </p>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Sprache</TableHead>
                      <TableHead>Betreff</TableHead>
                      <TableHead className="w-16 text-right">Anz.</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(previewData.previews).map(([lang, p]) => (
                      <TableRow key={lang}>
                        <TableCell>
                          <Badge variant="secondary">{LANG_FLAGS[lang] ?? lang.toUpperCase()}</Badge>
                        </TableCell>
                        <TableCell className="text-xs">{p.subject}</TableCell>
                        <TableCell className="text-right text-sm">
                          <Redact>{previewData.counts_by_lang[lang] ?? 0}</Redact>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setStep("preview")}>Zurück</Button>
              <Button onClick={handleSend} disabled={notifyMutation.isPending}>
                {notifyMutation.isPending ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Wird gesendet…</>
                ) : (
                  <><Send className="h-4 w-4 mr-2" /> Jetzt senden</>
                )}
              </Button>
            </DialogFooter>
          </>
        )}

        {step === "done" && (
          <>
            <div className="flex flex-col items-center gap-3 py-4">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
              <p className="text-sm text-center text-muted-foreground">
                Benachrichtigungen wurden erfolgreich gesendet.
                <br />
                Details finden Sie im Abschnitt «Benachrichtigungen» unten.
              </p>
            </div>
            <DialogFooter>
              <Button onClick={handleClose}>Schließen</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const SeasonalSignupsManager = () => {
  const [selectedEvent, setSelectedEvent] = useState<string | undefined>(undefined);
  const [sendDialogEvent, setSendDialogEvent] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { data: signups, isLoading } = useSeasonalSignups(selectedEvent);
  const { data: counts } = useSeasonalSignupCounts();
  const { data: mailtoTemplates } = useSeasonalMailtoTemplates();
  const markNotifiedMutation = useMarkSignupsNotified();

  const eventKeys = ["valentinstag", "weihnachten", "silvester"];

  const toggleSelected = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (checked) next.add(id); else next.delete(id);
      return next;
    });
  };

  const toggleAllSelected = (rows: SeasonalSignup[], checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      for (const s of rows) {
        if (checked) next.add(s.id); else next.delete(s.id);
      }
      return next;
    });
  };

  // mailto: statt Server-Versand — öffnet ein sendebereites Compose-Fenster im
  // eigenen Mail-Client, verschickt selbst nichts. Muss synchron im Click-Handler
  // laufen (kein await davor), sonst blockieren Browser den Protokoll-Handoff.
  const openMailtoFor = (signup: SeasonalSignup) => {
    const template = mailtoTemplates?.[signup.seasonal_event];
    if (!template) {
      toast.error("Keine Mailto-Vorlage für dieses Event hinterlegt");
      return;
    }
    const eventLabel = EVENT_LABELS[signup.seasonal_event] ?? signup.seasonal_event;
    const subject = fillSeasonalMailtoTemplate(template.subject, eventLabel);
    const body = fillSeasonalMailtoTemplate(template.body, eventLabel);
    const url = buildSeasonalMailtoUrl(signup.email, subject, body);
    const link = document.createElement("a");
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleMailtoSend = (signup: SeasonalSignup) => {
    openMailtoFor(signup);
    toast.success(`${signup.email}: E-Mail-Programm geöffnet`);
    markNotifiedMutation.mutate([signup.id]);
  };

  const handleMailtoCopy = async (signup: SeasonalSignup) => {
    const template = mailtoTemplates?.[signup.seasonal_event];
    if (!template) {
      toast.error("Keine Mailto-Vorlage für dieses Event hinterlegt");
      return;
    }
    const eventLabel = EVENT_LABELS[signup.seasonal_event] ?? signup.seasonal_event;
    const subject = fillSeasonalMailtoTemplate(template.subject, eventLabel);
    const body = fillSeasonalMailtoTemplate(template.body, eventLabel);
    const text = `An: ${signup.email}\nBetreff: ${subject}\n\n${body}`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Text kopiert");
    } catch {
      toast.error("Kopieren nicht möglich — bitte Text manuell markieren.");
    }
  };

  const handleBulkMailtoSend = () => {
    const selected = (signups ?? []).filter((s) => selectedIds.has(s.id));
    if (!selected.length) return;
    // Alle Compose-Fenster synchron hintereinander öffnen, kein await dazwischen
    // (gleicher Grund wie oben: Browser-Popup-Blocker).
    for (const signup of selected) {
      openMailtoFor(signup);
    }
    markNotifiedMutation.mutate(selected.map((s) => s.id));
    toast.success(`${selected.length} E-Mail-Fenster geöffnet`);
    setSelectedIds(new Set());
  };

  const exportCSV = (data: SeasonalSignup[], eventName: string) => {
    const headers = "Email,Event,Sprache,Anmeldedatum,Benachrichtigt\n";
    const rows = data
      .map(
        (s) =>
          `${s.email},${s.seasonal_event},${s.language},${new Date(s.created_at).toLocaleDateString("de-DE")},${s.notified_at ? new Date(s.notified_at).toLocaleDateString("de-DE") : ""}`
      )
      .join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vormerkungen-${eventName}-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalCount = counts ? Object.values(counts).reduce((sum, c) => sum + c.total, 0) : 0;

  const unnotifiedCount =
    selectedEvent && signups ? signups.filter((s) => !s.notified_at).length : 0;

  return (
    <div className="mt-8 md:mt-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Bell className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            <h2 className="text-xl md:text-2xl font-serif font-semibold">Saisonale Vormerkungen</h2>
            {totalCount > 0 && <Badge variant="secondary"><Redact>{totalCount}</Redact></Badge>}
          </div>
          <p className="text-sm text-muted-foreground">E-Mail-Vormerkungen für saisonale Events.</p>
        </div>
      </div>

      {/* Event Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={selectedEvent === undefined ? "default" : "outline"}
          size="sm"
          onClick={() => { setSelectedEvent(undefined); setSelectedIds(new Set()); }}
        >
          Alle
          {totalCount > 0 && <Badge variant="secondary" className="ml-2"><Redact>{totalCount}</Redact></Badge>}
        </Button>
        {eventKeys.map((key) => (
          <Button
            key={key}
            variant={selectedEvent === key ? "default" : "outline"}
            size="sm"
            onClick={() => { setSelectedEvent(key); setSelectedIds(new Set()); }}
          >
            {EVENT_LABELS[key]}
            {counts?.[key] && (
              <Badge variant="secondary" className="ml-2"><Redact>{counts[key].total}</Redact></Badge>
            )}
          </Button>
        ))}
      </div>

      {/* Manuelle Mailto-Vorlage — nur sinnvoll pro Event, da Text/Betreff je Event unterschiedlich sind */}
      {selectedEvent && <MailtoTemplateEditor eventKey={selectedEvent} />}

      {/* Action Buttons */}
      {selectedEvent && signups && signups.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={() => exportCSV(signups, selectedEvent)}>
            <Download className="h-4 w-4 mr-2" />
            CSV Export
          </Button>
          {unnotifiedCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSendDialogEvent(selectedEvent)}
            >
              <Send className="h-4 w-4 mr-2" />
                <Redact>{unnotifiedCount}</Redact>&nbsp;Benachrichtigen
            </Button>
          )}
        </div>
      )}

      {/* Bulk-Mailto-Leiste */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-1.5 mb-4">
          <span className="text-xs text-muted-foreground">{selectedIds.size} ausgewählt</span>
          <Button size="sm" className="h-7 px-2 text-xs" onClick={handleBulkMailtoSend}>
            <MailPlus className="w-3.5 h-3.5 mr-1.5" />
            Mailto senden
          </Button>
          <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => setSelectedIds(new Set())}>
            Auswahl aufheben
          </Button>
        </div>
      )}

      {/* Signups Table */}
      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : signups && signups.length > 0 ? (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <Checkbox
                    checked={signups.every((s) => selectedIds.has(s.id))}
                    onCheckedChange={(checked) => toggleAllSelected(signups, checked === true)}
                    aria-label="Alle sichtbaren Vormerkungen auswählen"
                  />
                </TableHead>
                <TableHead>E-Mail</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Sprache</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Benachrichtigt</TableHead>
                <TableHead className="text-right">Mailto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {signups.map((signup) => (
                <TableRow key={signup.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedIds.has(signup.id)}
                      onCheckedChange={(checked) => toggleSelected(signup.id, checked === true)}
                      aria-label={`${signup.email} auswählen`}
                    />
                  </TableCell>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <Redact>{signup.email}</Redact>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {EVENT_LABELS[signup.seasonal_event] ?? signup.seasonal_event}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{signup.language.toUpperCase()}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(signup.created_at).toLocaleDateString("de-DE")}
                  </TableCell>
                  <TableCell>
                    {signup.notified_at ? (
                      <Badge className="bg-green-100 text-green-800">Benachrichtigt</Badge>
                    ) : (
                      <Badge variant="secondary">Ausstehend</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {signup.notified_at
                      ? new Date(signup.notified_at).toLocaleDateString("de-DE")
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-xs"
                        onClick={() => handleMailtoSend(signup)}
                        title="mailto: öffnen"
                      >
                        <Send className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 px-2 text-xs"
                        onClick={() => handleMailtoCopy(signup)}
                        title="Text kopieren"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border p-6 text-center">
          <Bell className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-serif font-semibold mb-2">Keine Vormerkungen</h3>
          <p className="text-sm text-muted-foreground">
            {selectedEvent
              ? `Noch keine Vormerkungen für ${EVENT_LABELS[selectedEvent] ?? selectedEvent}.`
              : "Noch keine Vormerkungen vorhanden."}
          </p>
        </div>
      )}

      {sendDialogEvent && (
        <SendPreviewDialog
          open={!!sendDialogEvent}
          onClose={() => setSendDialogEvent(null)}
          eventKey={sendDialogEvent}
        />
      )}
    </div>
  );
};

export default SeasonalSignupsManager;
