import { useState } from 'react';
import { useEventInquiries, useDeleteEventInquiry, EventInquiry } from '@/hooks/useEventInquiries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { 
  CalendarDays, 
  Users, 
  Mail, 
  Phone, 
  Building2, 
  Trash2, 
  Eye,
  PartyPopper,
  Clock,
  AlertTriangle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const eventTypeLabels: Record<string, string> = {
  'weihnachtsfeier': 'Weihnachtsfeier',
  'sommerfest': 'Sommerfest',
  'team-building': 'Team-Building',
  'business-dinner': 'Business-Dinner',
  'jubilaeum': 'Firmenjubiläum',
  'firmenfeier': 'Firmenfeier',
  'sonstiges': 'Sonstiges',
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const formatPreferredDate = (dateString: string | null): string => {
  if (!dateString) return 'Nicht angegeben';
  const date = new Date(dateString);
  return date.toLocaleDateString('de-DE', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const EventInquiriesManager = () => {
  const { data: inquiries, isLoading, error } = useEventInquiries();
  const deleteMutation = useDeleteEventInquiry();
  const [selectedInquiry, setSelectedInquiry] = useState<EventInquiry | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMutation.mutateAsync(deleteId);
      toast.success('Anfrage gelöscht');
      setDeleteId(null);
    } catch (err) {
      toast.error('Fehler beim Löschen');
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PartyPopper className="h-5 w-5" />
            Event-Anfragen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse text-muted-foreground">Laden...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PartyPopper className="h-5 w-5" />
            Event-Anfragen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-destructive">Fehler beim Laden der Anfragen.</p>
        </CardContent>
      </Card>
    );
  }

  // Count failed notifications
  const failedNotifications = inquiries?.filter(
    (i) => i.notification_sent === false && i.notification_attempts !== null && i.notification_attempts > 0
  ) || [];
  
  // Count pending notifications (not yet attempted)
  const pendingNotifications = inquiries?.filter(
    (i) => i.notification_sent !== true && (i.notification_attempts === null || i.notification_attempts === 0)
  ) || [];

  return (
    <>
      {/* Warning for failed notifications */}
      {failedNotifications.length > 0 && (
        <Alert variant="destructive" className="mt-8 mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>E-Mail-Benachrichtigung fehlgeschlagen!</AlertTitle>
          <AlertDescription>
            {failedNotifications.length === 1 
              ? `1 Anfrage konnte nicht per E-Mail weitergeleitet werden.`
              : `${failedNotifications.length} Anfragen konnten nicht per E-Mail weitergeleitet werden.`
            }
            {' '}Bitte manuell bearbeiten.
          </AlertDescription>
        </Alert>
      )}
      
      <Card className="mt-8">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <PartyPopper className="h-5 w-5" />
              Event-Anfragen
              {inquiries && inquiries.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {inquiries.length}
                </Badge>
              )}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {!inquiries || inquiries.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Noch keine Event-Anfragen vorhanden.
            </p>
          ) : (
            <div className="space-y-3">
              {inquiries.map((inquiry) => {
                const notificationFailed = inquiry.notification_sent === false && 
                  inquiry.notification_attempts !== null && inquiry.notification_attempts > 0;
                const notificationSuccess = inquiry.notification_sent === true;
                
                return (
                  <div
                    key={inquiry.id}
                    className={`border rounded-lg p-4 bg-card hover:bg-muted/50 transition-colors ${
                      notificationFailed ? 'border-destructive' : 'border-border'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      {/* Left: Main info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="font-semibold truncate">{inquiry.company_name}</span>
                          <Badge variant="outline" className="flex-shrink-0">
                            {eventTypeLabels[inquiry.event_type] || inquiry.event_type}
                          </Badge>
                          {/* Notification status indicator */}
                          {notificationFailed && (
                            <span className="flex items-center gap-1 text-xs text-destructive">
                              <AlertTriangle className="h-3 w-3" />
                              <span className="hidden sm:inline">E-Mail fehlgeschlagen</span>
                            </span>
                          )}
                          {notificationSuccess && (
                            <span className="flex items-center gap-1 text-xs text-green-600">
                              <CheckCircle2 className="h-3 w-3" />
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Users className="h-3.5 w-3.5" />
                            <span>{inquiry.guest_count} Personen</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <CalendarDays className="h-3.5 w-3.5" />
                            <span>{formatPreferredDate(inquiry.preferred_date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5" />
                            <a href={`mailto:${inquiry.email}`} className="hover:underline truncate">
                              {inquiry.email}
                            </a>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5" />
                            <span>{formatDate(inquiry.created_at)}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedInquiry(inquiry)}
                          className="h-9 w-9 p-0 sm:w-auto sm:px-3"
                        >
                          <Eye className="h-4 w-4" />
                          <span className="hidden sm:inline ml-2">Details</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeleteId(inquiry.id)}
                          className="h-9 w-9 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {selectedInquiry?.company_name}
            </DialogTitle>
            <DialogDescription>
              Anfrage vom {selectedInquiry && formatDate(selectedInquiry.created_at)}
            </DialogDescription>
          </DialogHeader>
          
          {selectedInquiry && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Ansprechpartner</p>
                  <p className="font-medium">{selectedInquiry.contact_name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Veranstaltungsart</p>
                  <Badge>{eventTypeLabels[selectedInquiry.event_type] || selectedInquiry.event_type}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Personenanzahl</p>
                  <p className="font-medium">{selectedInquiry.guest_count} Personen</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Wunschtermin</p>
                  <p className="font-medium">{formatPreferredDate(selectedInquiry.preferred_date)}</p>
                </div>
              </div>
              
              <div className="space-y-2 pt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href={`mailto:${selectedInquiry.email}`} className="hover:underline text-primary">
                    {selectedInquiry.email}
                  </a>
                </div>
                {selectedInquiry.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <a href={`tel:${selectedInquiry.phone}`} className="hover:underline">
                      {selectedInquiry.phone}
                    </a>
                  </div>
                )}
              </div>
              
              {selectedInquiry.message && (
                <div className="pt-2 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Nachricht</p>
                  <div className="bg-muted/50 p-3 rounded-md text-sm whitespace-pre-wrap">
                    {selectedInquiry.message}
                  </div>
                </div>
              )}
              
              <div className="flex gap-2 pt-4">
                <Button asChild className="flex-1">
                  <a href={`mailto:${selectedInquiry.email}?subject=Re: Ihre Event-Anfrage bei STORIA`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Antworten
                  </a>
                </Button>
                {selectedInquiry.phone && (
                  <Button variant="outline" asChild>
                    <a href={`tel:${selectedInquiry.phone}`}>
                      <Phone className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Anfrage löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Diese Aktion kann nicht rückgängig gemacht werden. Die Anfrage wird dauerhaft gelöscht.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EventInquiriesManager;
