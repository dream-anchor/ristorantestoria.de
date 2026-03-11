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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Send, ArrowLeft, Loader2, CheckCircle2, XCircle, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import {
  useSeasonalNotifications,
  useSeasonalNotificationRecipients,
  useNotifySeasonalSignups,
  type SeasonalNotification,
  type NotifyPreviewResult,
} from "@/hooks/useSeasonalNotifications";

const EVENT_LABELS: Record<string, string> = {
  valentinstag: "Valentinstag",
  weihnachten: "Weihnachten",
  silvester: "Silvester",
  ostermontag: "Ostermontag",
};

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  completed: { label: "Gesendet", className: "bg-green-100 text-green-800" },
  sending: { label: "Wird gesendet", className: "bg-blue-100 text-blue-800" },
  partial: { label: "Teilweise", className: "bg-yellow-100 text-yellow-800" },
  failed: { label: "Fehlgeschlagen", className: "bg-red-100 text-red-800" },
  pending: { label: "Ausstehend", className: "" },
};

const LANG_FLAGS: Record<string, string> = { de: "DE", en: "EN", it: "IT", fr: "FR" };

// ─── Detail View ────────────────────────────────────────────────────────────

const NotificationDetail = ({
  notification,
  onBack,
}: {
  notification: SeasonalNotification;
  onBack: () => void;
}) => {
  const { data: recipients, isLoading } = useSeasonalNotificationRecipients(notification.id);
  const subjects = notification.subjects ?? {};
  const langs = Object.keys(subjects).filter((l) => subjects[l]);

  const sentCount = recipients?.filter((r) => r.status === "sent").length ?? 0;
  const failedCount = recipients?.filter((r) => r.status === "failed").length ?? 0;

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Zurück
        </Button>
        <div>
          <h3 className="font-semibold">
            {EVENT_LABELS[notification.seasonal_event] ?? notification.seasonal_event} —{" "}
            {new Date(notification.created_at).toLocaleDateString("de-DE")}
          </h3>
          <p className="text-sm text-muted-foreground">
            {sentCount} gesendet · {failedCount} Fehler · {notification.trigger_type === "auto" ? "Automatisch" : "Manuell"}
          </p>
        </div>
      </div>

      {/* Subject Preview per Language */}
      {langs.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold mb-3">E-Mail-Betreff pro Sprache</h4>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Sprache</TableHead>
                  <TableHead>Betreff</TableHead>
                  <TableHead className="w-20 text-right">Empfänger</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {langs.map((lang) => (
                  <TableRow key={lang}>
                    <TableCell>
                      <Badge variant="secondary">{LANG_FLAGS[lang] ?? lang.toUpperCase()}</Badge>
                    </TableCell>
                    <TableCell className="text-sm">{subjects[lang]}</TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {recipients?.filter((r) => r.language === lang).length ?? "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}

      {/* Recipients Table */}
      <h4 className="text-sm font-semibold mb-3">Empfänger</h4>
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      ) : recipients && recipients.length > 0 ? (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>E-Mail</TableHead>
                <TableHead>Sprache</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Gesendet</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recipients.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                      {r.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{LANG_FLAGS[r.language] ?? r.language.toUpperCase()}</Badge>
                  </TableCell>
                  <TableCell>
                    {r.status === "sent" ? (
                      <div className="flex items-center gap-1 text-green-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span className="text-xs">Gesendet</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-red-700" title={r.error ?? ""}>
                        <XCircle className="h-3.5 w-3.5" />
                        <span className="text-xs">Fehler</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {r.sent_at ? new Date(r.sent_at).toLocaleDateString("de-DE") : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Keine Empfänger gefunden.</p>
      )}
    </div>
  );
};

// ─── Send Dialog ─────────────────────────────────────────────────────────────

const SendDialog = ({
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
    } catch (err) {
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
        toast.success(`${result.sent} E-Mails gesendet${result.failed ? `, ${result.failed} Fehler` : ""}`);
        setStep("done");
      }
    } catch (err) {
      toast.error("Fehler beim Senden");
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
          <DialogTitle>Benachrichtigung senden</DialogTitle>
          <DialogDescription>
            {eventLabel}-Vormerkungen per E-Mail benachrichtigen
          </DialogDescription>
        </DialogHeader>

        {step === "preview" && (
          <>
            <p className="text-sm text-muted-foreground">
              Vorschau laden: Claude generiert Betreffzeilen je Sprache. Die E-Mails werden dabei noch nicht gesendet.
            </p>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>Abbrechen</Button>
              <Button onClick={loadPreview} disabled={notifyMutation.isPending}>
                {notifyMutation.isPending ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Wird geladen…</>
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
                        <TableCell className="text-right text-sm">{previewData.counts_by_lang[lang] ?? 0}</TableCell>
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
              <p className="text-sm text-center">E-Mails wurden erfolgreich versendet.</p>
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

const SeasonalNotificationsManager = () => {
  const { data: notifications, isLoading } = useSeasonalNotifications();
  const [selectedNotification, setSelectedNotification] = useState<SeasonalNotification | null>(null);
  const [sendDialogEvent, setSendDialogEvent] = useState<string | null>(null);

  if (selectedNotification) {
    return (
      <div className="mt-8 md:mt-12">
        <NotificationDetail
          notification={selectedNotification}
          onBack={() => setSelectedNotification(null)}
        />
      </div>
    );
  }

  return (
    <div className="mt-8 md:mt-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Send className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            <h2 className="text-xl md:text-2xl font-serif font-semibold">Benachrichtigungen</h2>
            {notifications && notifications.length > 0 && (
              <Badge variant="secondary">{notifications.length}</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            Versandhistorie saisonaler E-Mail-Benachrichtigungen.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSendDialogEvent("valentinstag")}
        >
          <Send className="h-4 w-4 mr-2" />
          Manuell senden
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-10 w-full" />)}
        </div>
      ) : notifications && notifications.length > 0 ? (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Event</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead>Auslöser</TableHead>
                <TableHead>Empfänger</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {notifications.map((n) => {
                const statusInfo = STATUS_BADGE[n.status] ?? STATUS_BADGE.pending;
                return (
                  <TableRow
                    key={n.id}
                    className="cursor-pointer hover:bg-muted/40"
                    onClick={() => setSelectedNotification(n)}
                  >
                    <TableCell>
                      <Badge variant="outline">{EVENT_LABELS[n.seasonal_event] ?? n.seasonal_event}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(n.created_at).toLocaleDateString("de-DE")}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {n.trigger_type === "auto" ? "Automatisch" : "Manuell"}
                    </TableCell>
                    <TableCell className="text-sm">{n.total_recipients}</TableCell>
                    <TableCell>
                      <Badge className={statusInfo.className}>{statusInfo.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="bg-card rounded-lg border border-border p-6 text-center">
          <Send className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-serif font-semibold mb-2">Keine Benachrichtigungen</h3>
          <p className="text-sm text-muted-foreground">
            Noch keine saisonalen E-Mails gesendet.
          </p>
        </div>
      )}

      {sendDialogEvent && (
        <SendDialog
          open={!!sendDialogEvent}
          onClose={() => setSendDialogEvent(null)}
          eventKey={sendDialogEvent}
        />
      )}
    </div>
  );
};

export default SeasonalNotificationsManager;
