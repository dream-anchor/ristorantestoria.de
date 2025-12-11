import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, CheckCheck, XCircle, SpellCheck, ArrowRight } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export interface SpellingError {
  id: string;
  location: {
    type: 'title' | 'subtitle' | 'category' | 'item';
    categoryIndex?: number;
    itemIndex?: number;
    field: 'name' | 'description' | 'title' | 'subtitle';
    language: 'de' | 'en' | 'it' | 'fr';
  };
  originalText: string;
  suggestion: string;
  errorType: 'spelling' | 'grammar' | 'punctuation';
  context: string;
}

interface SpellCheckResultsProps {
  errors: SpellingError[];
  onAccept: (error: SpellingError) => void;
  onReject: (errorId: string) => void;
  onAcceptAll: () => void;
  onRejectAll: () => void;
  onClose: () => void;
}

const languageFlags: Record<string, string> = {
  de: '🇩🇪',
  en: '🇬🇧',
  it: '🇮🇹',
  fr: '🇫🇷',
};

const languageNames: Record<string, Record<string, string>> = {
  de: { de: 'Deutsch', en: 'German', it: 'Tedesco', fr: 'Allemand' },
  en: { de: 'Englisch', en: 'English', it: 'Inglese', fr: 'Anglais' },
  it: { de: 'Italienisch', en: 'Italian', it: 'Italiano', fr: 'Italien' },
  fr: { de: 'Französisch', en: 'French', it: 'Francese', fr: 'Français' },
};

const SpellCheckResults = ({
  errors,
  onAccept,
  onReject,
  onAcceptAll,
  onRejectAll,
  onClose,
}: SpellCheckResultsProps) => {
  const { t, language } = useLanguage();
  const [processedIds, setProcessedIds] = useState<Set<string>>(new Set());

  const remainingErrors = useMemo(() => 
    errors.filter(e => !processedIds.has(e.id)),
    [errors, processedIds]
  );

  const handleAccept = (error: SpellingError) => {
    onAccept(error);
    setProcessedIds(prev => new Set([...prev, error.id]));
  };

  const handleReject = (errorId: string) => {
    onReject(errorId);
    setProcessedIds(prev => new Set([...prev, errorId]));
  };

  const handleAcceptAll = () => {
    onAcceptAll();
    setProcessedIds(new Set(errors.map(e => e.id)));
  };

  const handleRejectAll = () => {
    onRejectAll();
    setProcessedIds(new Set(errors.map(e => e.id)));
  };

  const getErrorTypeLabel = (type: string) => {
    const labels: Record<string, Record<string, string>> = {
      spelling: { de: 'Rechtschreibung', en: 'Spelling', it: 'Ortografia', fr: 'Orthographe' },
      grammar: { de: 'Grammatik', en: 'Grammar', it: 'Grammatica', fr: 'Grammaire' },
      punctuation: { de: 'Zeichensetzung', en: 'Punctuation', it: 'Punteggiatura', fr: 'Ponctuation' },
    };
    return labels[type]?.[language] || type;
  };

  if (errors.length === 0) {
    return (
      <div className="border border-green-200 bg-green-50 rounded-lg p-6 text-center">
        <CheckCheck className="h-12 w-12 text-green-500 mx-auto mb-3" />
        <h3 className="font-semibold text-green-800 text-lg">{t.spellCheck?.noErrors || 'Keine Fehler gefunden!'}</h3>
        <p className="text-green-600 text-sm mt-1">{t.spellCheck?.allCorrect || 'Alle Texte sind korrekt.'}</p>
        <Button onClick={onClose} className="mt-4">
          {t.spellCheck?.continueToPreview || 'Weiter zur Vorschau'}
        </Button>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg bg-secondary/30 overflow-hidden">
      {/* Header */}
      <div className="bg-background border-b border-border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <SpellCheck className="h-5 w-5 text-primary" />
          <div>
            <h3 className="font-semibold">{t.spellCheck?.title || 'Rechtschreibprüfung'}</h3>
            <p className="text-sm text-muted-foreground">
              {remainingErrors.length} {t.spellCheck?.errorsRemaining || 'Fehler übrig'} 
              {processedIds.size > 0 && ` (${processedIds.size} ${t.spellCheck?.processed || 'bearbeitet'})`}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAcceptAll}
            disabled={remainingErrors.length === 0}
            className="gap-1"
          >
            <CheckCheck className="h-4 w-4" />
            <span className="hidden sm:inline">{t.spellCheck?.acceptAll || 'Alle annehmen'}</span>
            <span className="sm:hidden">{t.spellCheck?.all || 'Alle'}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRejectAll}
            disabled={remainingErrors.length === 0}
            className="gap-1"
          >
            <XCircle className="h-4 w-4" />
            <span className="hidden sm:inline">{t.spellCheck?.rejectAll || 'Alle ablehnen'}</span>
            <span className="sm:hidden">{t.spellCheck?.none || 'Keine'}</span>
          </Button>
        </div>
      </div>

      {/* Error List */}
      <div className="max-h-[400px] overflow-y-auto divide-y divide-border">
        {errors.map((error) => {
          const isProcessed = processedIds.has(error.id);
          
          return (
            <div
              key={error.id}
              className={`p-4 transition-opacity ${isProcessed ? 'opacity-40 bg-muted/50' : 'bg-background'}`}
            >
              {/* Context & Language */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-lg">{languageFlags[error.location.language]}</span>
                <span className="text-xs text-muted-foreground">
                  {languageNames[error.location.language]?.[language]}
                </span>
                <Badge variant="outline" className="text-xs">
                  {getErrorTypeLabel(error.errorType)}
                </Badge>
              </div>

              {/* Context Path */}
              <p className="text-xs text-muted-foreground mb-2">{error.context}</p>

              {/* Error Display */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-3 bg-secondary/50 rounded-lg p-3">
                <span className="text-destructive line-through break-all">{error.originalText}</span>
                <ArrowRight className="h-4 w-4 text-muted-foreground hidden sm:block flex-shrink-0" />
                <span className="text-green-600 font-medium break-all">{error.suggestion}</span>
              </div>

              {/* Actions */}
              {!isProcessed && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAccept(error)}
                    className="gap-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                  >
                    <Check className="h-4 w-4" />
                    {t.spellCheck?.accept || 'Annehmen'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleReject(error.id)}
                    className="gap-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                  >
                    <X className="h-4 w-4" />
                    {t.spellCheck?.reject || 'Ablehnen'}
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="bg-background border-t border-border p-4 flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          {t.spellCheck?.skipCheck || 'Überspringen'}
        </Button>
        <Button onClick={onClose}>
          {t.spellCheck?.continueToPreview || 'Weiter zur Vorschau'}
        </Button>
      </div>
    </div>
  );
};

export default SpellCheckResults;
