import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Bot, ChevronDown, ChevronUp, Check, AlertTriangle, Minus } from "lucide-react";
import { useSlugClassifications } from "@/hooks/useSlugClassifications";

const EVENT_LABELS: Record<string, string> = {
  valentinstag: 'Valentinstag',
  weihnachten: 'Weihnachten',
  silvester: 'Silvester',
};

const ClassificationLog = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: classifications, isLoading } = useSlugClassifications();

  if (isLoading) {
    return (
      <div className="mt-8">
        <Skeleton className="h-10 w-64 mb-4" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  if (!classifications || classifications.length === 0) return null;

  return (
    <div className="mt-8 md:mt-12">
      <Button
        variant="ghost"
        className="flex items-center gap-3 mb-4 px-0 hover:bg-transparent"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <Bot className="h-5 w-5 md:h-6 md:w-6 text-primary" />
        <h2 className="text-xl md:text-2xl font-serif font-semibold">Slug-Klassifikationen</h2>
        <Badge variant="secondary">{classifications.length}</Badge>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </Button>

      {isExpanded && (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titel</TableHead>
                <TableHead>Erkannt als</TableHead>
                <TableHead>Slugs</TableHead>
                <TableHead>Konflikt</TableHead>
                <TableHead>Datum</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {classifications.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium max-w-[200px] truncate">
                    {item.original_title}
                  </TableCell>
                  <TableCell>
                    {item.classified_as ? (
                      <Badge variant="outline">
                        {EVENT_LABELS[item.classified_as] || item.classified_as}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {item.slugs_updated ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Minus className="h-4 w-4 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell>
                    {item.conflict ? (
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                    ) : (
                      <Minus className="h-4 w-4 text-muted-foreground" />
                    )}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(item.created_at).toLocaleDateString('de-DE')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ClassificationLog;
