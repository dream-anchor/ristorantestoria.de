import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { CheckCircle, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import EmailLink, { EmailAddress } from "@/components/EmailLink";
import LocalizedLink from "@/components/LocalizedLink";
import { PhoneText } from "@/lib/linkifyPhone";
import { useLanguage } from "@/contexts/LanguageContext";
import { fireLead } from "@/lib/analytics";

/**
 * Anfrageformular für die Anlass-Seiten (E2.2) — sendet per `fetch` direkt an den
 * MAESTRO-Intake-Endpunkt `POST /api/public/inquiries`.
 *
 * Bewusst KEIN MAESTRO-Widget (Festlegung Antoine, 13.09.2026: Widgets haben Probleme
 * gemacht und bleiben deaktiviert). Der vollständige Endpunkt-Vertrag steht in
 * `docs/KONZEPT-SAISONSEITEN-AUSBAU.md` § „MAESTRO-Endpunkt — verifizierter Vertrag";
 * im maestro-cloud-Repo gibt es für diesen Weg KEINE Einbau-Doku.
 *
 * Aufbau übernommen vom Bestandsmuster `FilmfestInquiryForm.tsx`
 * (react-hook-form + Zod + synchroner Submit-Riegel), Optik von den Anlass-Seiten
 * (shadcn `Form`/`Input`/`Textarea` wie in `SeasonalSignupForm.tsx`).
 */

/**
 * Endpunkt-URL kommt ausschließlich aus der Build-Env — KEIN hartkodierter
 * Produktions-Fallback (Muster aus `maestro-cloud/docs/storia-migration/
 * P2-CUTOVER-EXECUTION.md`). Fehlt die Variable, wird bewusst gar kein Formular
 * angeboten, statt Anfragen stillschweigend ins Leere zu schicken.
 *
 * ACHTUNG beim Deploy: Der Produktionsbuild läuft in GitHub Actions
 * (`.github/workflows/deploy-ionos.yml`), die Variable muss also DORT im `env:`-Block
 * des Build-Schritts ankommen — eine Eintragung nur in der lokalen `.env` wirkt sich
 * auf die Live-Seite nicht aus.
 */
const INTAKE_URL = (import.meta.env.VITE_MAESTRO_INTAKE_URL || "").trim();

// E4.2: `weihnachtsfeier` ergänzt (eigener Wert statt `weihnachten` mitzubenutzen) — die
// Kannibalisierungs-Auflösung (docs/LOOP-SAISONSEITEN-AUSBAU.md § E4) trennt den privaten
// à-la-carte-Weg (weihnachten-muenchen) vom Firmen-/Gruppen-Weg (weihnachtsfeier-muenchen).
// Damit die Lead-Attribution unterscheidbar bleibt, braucht der Gruppen-Weg ein eigenes
// `sourceDetail` statt weiterhin `ristorante_weihnachten` mitzubenutzen.
type Anlass = "silvester" | "weihnachten" | "weihnachtsfeier";

/** `sourceDetail` muss `^[a-zA-Z0-9_-]{1,100}$` erfüllen; `ristorante_*` ist die Konvention im System. */
const SOURCE_DETAIL: Record<Anlass, string> = {
  silvester: "ristorante_silvester",
  weihnachten: "ristorante_weihnachten",
  weihnachtsfeier: "ristorante_weihnachtsfeier",
};

/** Freitextfeld des Endpunkts (≤ 120 Zeichen) — grobe Einordnung der Anfrage für die Bearbeitung. */
const EVENT_TYPE: Record<Anlass, string> = {
  silvester: "Silvester Gala-Dinner",
  weihnachten: "Weihnachtsmenü für Gruppen",
  weihnachtsfeier: "Weihnachtsfeier für Firmen & Gruppen",
};

/**
 * Der Endpunkt akzeptiert für `language` ausschließlich `"de"` oder `"en"`.
 *
 * Entscheidung: Deutsch bleibt Deutsch, alles andere (en/it/fr) wird auf `"en"`
 * abgebildet. Das Feld steuert die Sprache der automatischen Eingangsbestätigung —
 * für italienische und französische Gäste ist Englisch die deutlich bessere Näherung
 * als Deutsch. Das Feld wegzulassen wäre die schlechtere Variante, weil dann der
 * serverseitige Default greift, auf den die Website keinen Einfluss hat.
 */
const toApiLanguage = (language: string): "de" | "en" => (language === "de" ? "de" : "en");

/**
 * `<input type="date">` liefert `"2026-12-31"`; der Endpunkt verlangt ein VOLLES
 * ISO-8601-Datetime und antwortet auf ein reines Datum mit 422.
 *
 * Als Uhrzeit wird bewusst 12:00 Ortszeit gesetzt, nicht Mitternacht: `toISOString()`
 * rechnet nach UTC um, und 00:00 mitteleuropäischer Zeit ist dort bereits der VORTAG —
 * der Wunschtermin käme im System um einen Tag verschoben an.
 */
const toIsoDateTime = (value?: string): string | undefined => {
  if (!value) return undefined;
  const parsed = new Date(`${value}T12:00:00`);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
};

interface AnlassAnfrageFormProps {
  /** Anlass — bestimmt `sourceDetail`, `eventType` und das GA4-Eventlabel. */
  anlass: Anlass;
  /**
   * Optional vorbelegter Wunschtermin im Format `yyyy-MM-dd`.
   * Wird erst NACH dem Mount gesetzt (siehe Effekt unten), damit prerendertes HTML und
   * erster Client-Render identisch bleiben.
   */
  defaultEventDate?: string;
  /** `min`-Attribut des Gästefelds — reiner Hinweis, keine harte Validierung. */
  minGuests?: number;
}

const AnlassAnfrageForm = ({ anlass, defaultEventDate, minGuests }: AnlassAnfrageFormProps) => {
  const { t, language } = useLanguage();
  const f = t.anlassInquiry;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  // Anti-Doppelklick: synchroner Riegel (State-Updates sind async) — Muster aus
  // FilmfestInquiryForm. Serverseitig fängt die Idempotenz (2 Minuten) den Rest ab.
  const submitLock = useRef(false);
  const initialEventDateRef = useRef(defaultEventDate);

  // Aufruf-Zählung MAESTRO: einmal pro Seitenaufruf, feuert nie blockierend.
  // Nur die beiden Anfrage-Formulare laut Vorgabe (weihnachten bleibt außen vor).
  useEffect(() => {
    if (anlass !== "silvester" && anlass !== "weihnachtsfeier") return;
    try {
      navigator.sendBeacon(
        "https://storia.schrittmacher.ai/api/public/formular-aufruf",
        new Blob([JSON.stringify({ eingang: SOURCE_DETAIL[anlass] })], { type: "text/plain" }),
      );
    } catch {
      /* Zählung darf das Formular nie blockieren */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Schema im Komponentenkörper, damit die Fehlermeldungen aus den Übersetzungen kommen
  // und nicht — wie in den älteren Formularen — fest auf Deutsch im Schema stehen.
  const formSchema = useMemo(
    () =>
      z.object({
        customerName: z.string().trim().min(2, f.errorName).max(200),
        customerEmail: z.string().trim().email(f.errorEmail).max(320),
        phone: z.string().trim().max(60).optional(),
        eventDate: z.string().trim().max(20).optional(),
        guests: z
          .string()
          .trim()
          .max(10)
          .optional()
          .refine((v) => !v || (/^\d{1,4}$/.test(v) && Number(v) > 0), f.errorGuests),
        // Fachliche Vorgabe Antoine (13.09.2026): Pflichtfeld, und nicht nur Leerzeichen.
        // Das Server-Schema ist an dieser Stelle lockerer (`.optional()`) — hier wird
        // bewusst strenger validiert, siehe KONZEPT § „Pflichtfelder".
        message: z.string().trim().min(2, f.errorMessageRequired).max(5000),
        website: z.string().max(2000).optional(),
      }),
    [f],
  );

  type FormData = z.infer<typeof formSchema>;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      customerEmail: "",
      phone: "",
      eventDate: "",
      guests: "",
      message: "",
      website: "",
    },
  });

  const { setValue } = form;
  // Vorbelegung erst nach dem Mount: im prerenderten HTML steht das Feld leer, sonst
  // könnte ein zur Build-Zeit berechnetes Datum vom Client-Render abweichen
  // (Hydration-Mismatch — dieselbe Überlegung wie in ReservationBooking).
  useEffect(() => {
    const initial = initialEventDateRef.current;
    if (initial) setValue("eventDate", initial);
  }, [setValue]);

  const fail = (message: string) => {
    setErrorText(message);
    toast.error(message);
  };

  const onSubmit = async (data: FormData) => {
    if (submitLock.current) return;
    submitLock.current = true;
    setIsSubmitting(true);
    setErrorText(null);

    try {
      const payload: Record<string, unknown> = {
        customerName: data.customerName.trim(),
        customerEmail: data.customerEmail.trim().toLowerCase(),
        message: data.message.trim(),
        sourceDetail: SOURCE_DETAIL[anlass],
        eventType: EVENT_TYPE[anlass],
        serviceKind: "event",
        language: toApiLanguage(language),
      };

      if (data.phone?.trim()) payload.phone = data.phone.trim();

      // `guests` MUSS als Zahl gesendet werden — ein String liefert 422.
      const guests = data.guests?.trim() ? Number.parseInt(data.guests.trim(), 10) : undefined;
      if (typeof guests === "number" && Number.isFinite(guests) && guests > 0) {
        payload.guests = guests;
      }

      const eventDate = toIsoDateTime(data.eventDate?.trim());
      if (eventDate) payload.eventDate = eventDate;

      // Honeypot nur mitschicken, wenn er tatsächlich befüllt wurde: ein leeres Feld
      // könnte serverseitig sonst fälschlich als „ausgefüllt" gewertet werden (202 statt 201).
      if (data.website?.trim()) payload.website = data.website.trim();

      if (typeof window !== "undefined") {
        payload.details = {
          originalPage: window.location.pathname,
          referrer: document.referrer || undefined,
        };
      }

      const response = await fetch(INTAKE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      let body: unknown = null;
      try {
        body = await response.json();
      } catch {
        // Antwort ohne JSON-Body — unten wird ohnehin nur der Status ausgewertet.
      }

      if (response.ok) {
        // 201 UND 202 sind beide `response.ok === true`. 201 = echter Lead (Body enthält
        // `data.id`), 202 = Honeypot ausgelöst, stilles Verwerfen (Body OHNE `id`).
        // Nach außen ist beides ein Erfolg; als Lead gezählt wird nur der Fall mit `id`.
        const id = (body as { data?: { id?: string } } | null)?.data?.id;
        if (typeof id === "string" && id.length > 0) {
          fireLead(`${anlass}_anfrage`, 1500);
        }
        setIsSubmitted(true);
        toast.success(f.successTitle);
        return;
      }

      if (response.status === 422) {
        fail(f.errorValidation);
        return;
      }
      if (response.status === 429) {
        fail(f.errorRateLimit);
        return;
      }
      fail(f.errorGeneric);
    } catch (error) {
      // Netzwerk-/CORS-Fehler: `fetch` wirft, bevor es je einen Status gibt.
      console.error("AnlassAnfrageForm: Anfrage konnte nicht gesendet werden", error);
      fail(f.errorNetwork);
    } finally {
      setIsSubmitting(false);
      submitLock.current = false;
    }
  };

  const idPrefix = `anfrage-${anlass}`;

  const directContact = (
    <p className="text-xs text-muted-foreground mt-4 text-center">
      <PhoneText>{f.altContact}</PhoneText>{" "}
      <EmailLink className="underline hover:no-underline">
        <EmailAddress />
      </EmailLink>
    </p>
  );

  // Ohne konfigurierten Endpunkt wird KEIN Formular angeboten (siehe INTAKE_URL oben).
  // Der Block steht bewusst nach allen Hooks, damit die Hook-Reihenfolge stabil bleibt.
  if (!INTAKE_URL) {
    return (
      <div className="bg-card border border-border rounded-2xl p-6 md:p-8 text-center">
        <h3 className="text-xl font-serif font-bold mb-2">{f.unavailableTitle}</h3>
        <p className="text-muted-foreground">
          <PhoneText>{f.unavailableText}</PhoneText>
        </p>
        {directContact}
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="bg-card border border-border rounded-2xl p-8 md:p-12 text-center">
        <CheckCircle className="w-14 h-14 mx-auto mb-4 text-primary" />
        <h3 className="text-2xl font-serif font-bold mb-2">{f.successTitle}</h3>
        <p className="text-muted-foreground">{f.successMessage}</p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <FormField
            control={form.control}
            name="customerName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{f.nameLabel}</FormLabel>
                <FormControl>
                  <Input
                    id={`${idPrefix}-name`}
                    type="text"
                    autoComplete="name"
                    placeholder={f.namePlaceholder}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid sm:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="customerEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{f.emailLabel}</FormLabel>
                  <FormControl>
                    <Input
                      id={`${idPrefix}-email`}
                      type="email"
                      autoComplete="email"
                      placeholder={f.emailPlaceholder}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{`${f.phoneLabel} (${f.optionalSuffix})`}</FormLabel>
                  <FormControl>
                    <Input
                      id={`${idPrefix}-phone`}
                      type="tel"
                      autoComplete="tel"
                      placeholder={f.phonePlaceholder}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="eventDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{`${f.dateLabel} (${f.optionalSuffix})`}</FormLabel>
                  <FormControl>
                    <Input id={`${idPrefix}-date`} type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="guests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{`${f.guestsLabel} (${f.optionalSuffix})`}</FormLabel>
                  <FormControl>
                    <Input
                      id={`${idPrefix}-guests`}
                      type="number"
                      inputMode="numeric"
                      min={minGuests ?? 1}
                      placeholder={f.guestsPlaceholder}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{f.messageLabel}</FormLabel>
                <FormControl>
                  <Textarea
                    id={`${idPrefix}-message`}
                    rows={4}
                    placeholder={f.messagePlaceholder}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Honeypot `website` — muss im Markup existieren, darf aber NICHT
              `type="hidden"` sein: Bots füllen hidden-Felder trotzdem aus (Hinweis
              Antoine, 13.09.2026). Versteckt wird deshalb ausschließlich per CSS
              (`.hp-field` in `src/index.css`: absolut positioniert, aus dem Viewport
              geschoben, 1×1 px, `opacity: 0`, nicht klickbar). `tabindex={-1}` hält das
              Feld aus der Tastaturreihenfolge, `aria-hidden` aus dem Screenreader.
              Füllt ein Bot es aus, antwortet der Endpunkt mit 202 und verwirft still. */}
          <div className="hp-field" aria-hidden="true">
            <label htmlFor={`${idPrefix}-website`}>{f.honeypotLabel}</label>
            <input
              id={`${idPrefix}-website`}
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...form.register("website")}
            />
          </div>

          {errorText && (
            <p role="alert" className="text-sm text-destructive bg-destructive/10 rounded-lg p-3">
              <PhoneText>{errorText}</PhoneText>
            </p>
          )}

          <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {f.submitting}
              </>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                {f.submitButton}
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            {f.privacyNotePre}
            <LocalizedLink to="datenschutz" className="underline hover:no-underline">
              {f.privacyNoteLink}
            </LocalizedLink>
            {f.privacyNotePost}
          </p>
        </form>
      </Form>
      {directContact}
    </div>
  );
};

export default AnlassAnfrageForm;
