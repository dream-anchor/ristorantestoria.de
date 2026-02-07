import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bell, Download, Mail, BellRing } from "lucide-react";
import { toast } from "sonner";
import { useSeasonalSignups, useSeasonalSignupCounts, useMarkAllNotified } from "@/hooks/useSeasonalSignups";
import type { SeasonalSignup } from "@/hooks/useSeasonalSignups";

const EVENT_LABELS: Record<string, string> = {
  valentinstag: 'Valentinstag',
  weihnachten: 'Weihnachten',
  silvester: 'Silvester',
};

const SeasonalSignupsManager = () => {
  const [selectedEvent, setSelectedEvent] = useState<string | undefined>(undefined);
  const { data: signups, isLoading } = useSeasonalSignups(selectedEvent);
  const { data: counts } = useSeasonalSignupCounts();
  const markNotified = useMarkAllNotified();

  const eventKeys = ['valentinstag', 'weihnachten', 'silvester'];

  const handleMarkAllNotified = async (eventKey: string) => {
    try {
      await markNotified.mutateAsync(eventKey);
      toast.success(`Alle ${EVENT_LABELS[eventKey]}-Vormerkungen als benachrichtigt markiert`);
    } catch {
      toast.error("Fehler beim Markieren");
    }
  };

  const exportCSV = (data: SeasonalSignup[], eventName: string) => {
    const headers = 'Email,Event,Sprache,Anmeldedatum,Benachrichtigt\n';
    const rows = data.map(s =>
      `${s.email},${s.seasonal_event},${s.language},${new Date(s.created_at).toLocaleDateString('de-DE')},${s.notified_at ? new Date(s.notified_at).toLocaleDateString('de-DE') : ''}`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vormerkungen-${eventName}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const totalCount = counts
    ? Object.values(counts).reduce((sum, c) => sum + c.total, 0)
    : 0;

  return (
    <div className="mt-8 md:mt-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Bell className="h-5 w-5 md:h-6 md:w-6 text-primary" />
            <h2 className="text-xl md:text-2xl font-serif font-semibold">Saisonale Vormerkungen</h2>
            {totalCount > 0 && (
              <Badge variant="secondary">{totalCount}</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            E-Mail-Vormerkungen für saisonale Events.
          </p>
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => exportCSV(signups, selectedEvent)}
          >
            <Download className="h-4 w-4 mr-2" />
            CSV Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleMarkAllNotified(selectedEvent)}
            disabled={markNotified.isPending}
          >
            <BellRing className="h-4 w-4 mr-2" />
            {markNotified.isPending ? "Wird markiert..." : "Alle benachrichtigen"}
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
                <TableHead>E-Mail</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>Sprache</TableHead>
                <TableHead>Datum</TableHead>
                <TableHead>Status</TableHead>
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
                    <Badge variant="outline">{EVENT_LABELS[signup.seasonal_event] || signup.seasonal_event}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{signup.language.toUpperCase()}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {new Date(signup.created_at).toLocaleDateString('de-DE')}
                  </TableCell>
                  <TableCell>
                    {signup.notified_at ? (
                      <Badge className="bg-green-100 text-green-800">
                        Benachrichtigt
                      </Badge>
                    ) : (
                      <Badge variant="secondary">Ausstehend</Badge>
                    )}
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
              ? `Noch keine Vormerkungen für ${EVENT_LABELS[selectedEvent]}.`
              : 'Noch keine Vormerkungen vorhanden.'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default SeasonalSignupsManager;
