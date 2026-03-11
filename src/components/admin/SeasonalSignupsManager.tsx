import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Bell, Download, Mail, Send, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useSeasonalSignups, useSeasonalSignupCounts } from "@/hooks/useSeasonalSignups";
import { useNotifySeasonalSignups, type NotifyPreviewResult } from "@/hooks/useSeasonalNotifications";
import type { SeasonalSignup } from "@/hooks/useSeasonalSignups";

const EVENT_LABELS: Record<string, string> = {
  valentinstag: "Valentinstag",
  weihnachten: "Weihnachten",
  silvester: "Silvester",
  ostermontag: "Ostermontag",
};

const LANG_FLAGS: Record<string, string> = { de: "DE", en: "EN", it: "IT", fr: "FR" };

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
                {previewData.total} Empfänger werden benachrichtigt:
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
                          {previewData.counts_by_lang[lang] ?? 0}
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
  const { data: signups, isLoading } = useSeasonalSignups(selectedEvent);
  const { data: counts } = useSeasonalSignupCounts();

  const eventKeys = ["valentinstag", "weihnachten", "silvester", "ostermontag"];

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
            {totalCount > 0 && <Badge variant="secondary">{totalCount}</Badge>}
          </div>
          <p className="text-sm text-muted-foreground">E-Mail-Vormerkungen für saisonale Events.</p>
        </div>
      </div>

      {/* Event Filter Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={selectedEvent === undefined ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedEvent(undefined)}
        >
          Alle
          {totalCount > 0 && <Badge variant="secondary" className="ml-2">{totalCount}</Badge>}
        </Button>
        {eventKeys.map((key) => (
          <Button
            key={key}
            variant={selectedEvent === key ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedEvent(key)}
          >
            {EVENT_LABELS[key]}
            {counts?.[key] && (
              <Badge variant="secondary" className="ml-2">{counts[key].total}</Badge>
            )}
          </Button>
        ))}
      </div>

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
              {unnotifiedCount} Benachrichtigen
            </Button>
          )}
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
                <TableHead>E-Mail</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Sprache</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Benachrichtigt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {signups.map((signup) => (
                <TableRow key={signup.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      {signup.email}
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
