import { useState, useRef, useEffect } from "react";
import { PhoneText } from "@/lib/linkifyPhone";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Send, CheckCircle, Loader2 } from "lucide-react";
import LocalizedLink from "@/components/LocalizedLink";
import { useLanguage } from "@/contexts/LanguageContext";

/**
 * Endpunkt-URL kommt ausschließlich aus der Build-Env (Muster aus AnlassAnfrageForm).
 * Fehlt die Variable, läuft der Submit in die vorhandene Fehlermeldung des Formulars.
 */
const INTAKE_URL = (import.meta.env.VITE_MAESTRO_INTAKE_URL || "").trim();

/** Der Endpunkt akzeptiert für `language` ausschließlich `"de"` oder `"en"`. */
const toApiLanguage = (language: string): "de" | "en" => (language === "de" ? "de" : "en");

/**
 * `<input type="date">` liefert `"2026-12-31"`; der Endpunkt verlangt ein VOLLES
 * ISO-8601-Datetime. Uhrzeit 12:00 Ortszeit, damit die UTC-Umrechnung nicht auf den
 * Vortag kippt.
 */
const toIsoDateTime = (value?: string): string | undefined => {
  if (!value) return undefined;
  const parsed = new Date(`${value}T12:00:00`);
  return Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString();
};

const FORMAT_OPTIONS = [
  "Premierendinner",
  "Verleiher- / Sales-Empfang",
  "Cast & Crew Dinner",
  "Presse-Lunch / Junket",
  "Branchen-Networking",
  "Exklusiv-Anmietung",
  "Noch offen — bitte beraten",
];

const formSchema = z.object({
  name: z.string().min(2, "Bitte Name / Firma eingeben").max(120),
  email: z.string().email("Bitte gültige E-Mail eingeben").max(255),
  phone: z.string().max(40).optional(),
  preferred_date: z.string().optional(),
  guest_count: z.string().max(20).optional(),
  format: z.string().min(1, "Bitte Format wählen"),
  message: z.string().max(1000).optional(),
});

type FormData = z.infer<typeof formSchema>;

const FilmfestInquiryForm = () => {
  const { toast } = useToast();
  // Datenschutzhinweis unter dem Absenden-Knopf: dieselben Texte wie im Anlass-Formular
  // (t.anlassInquiry.privacyNote*), in allen vier Sprachen vorhanden.
  const { t } = useLanguage();
  const f = t.anlassInquiry;
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Anti-Doppelklick: synchroner Riegel (State-Updates sind async)
  const submitLock = useRef(false);

  // Aufruf-Zählung MAESTRO: einmal pro Seitenaufruf, feuert nie blockierend
  useEffect(() => {
    try {
      navigator.sendBeacon(
        "https://storia.schrittmacher.ai/api/public/formular-aufruf",
        new Blob([JSON.stringify({ eingang: "ristorantestoria-filmfest" })], { type: "text/plain" }),
      );
    } catch {
      /* Zählung darf das Formular nie blockieren */
    }
  }, []);


  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      preferred_date: "",
      guest_count: "",
      format: FORMAT_OPTIONS[0],
      message: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    if (submitLock.current) return;
    submitLock.current = true;
    setIsSubmitting(true);
    try {
      // `guests` MUSS als Zahl gesendet werden — ein String liefert 422.
      const guests = data.guest_count?.trim()
        ? Number.parseInt(data.guest_count.trim(), 10)
        : undefined;
      const hasGuests =
        typeof guests === "number" && Number.isFinite(guests) && guests > 0;

      const payload: Record<string, unknown> = {
        customerName: data.name.trim(),
        company: data.name.trim(),
        customerEmail: data.email.trim().toLowerCase(),
        eventType: "Filmfest",
        message:
          `Format: ${data.format}` +
          (data.message?.trim() ? `\n\n${data.message.trim()}` : ""),
        sourceDetail: "ristorantestoria-filmfest",
        serviceKind: "event",
        language: "de",
      };

      if (data.phone?.trim()) payload.phone = data.phone.trim();

      const eventDate = toIsoDateTime(data.preferred_date);
      if (eventDate) payload.eventDate = eventDate;

      if (hasGuests) payload.guests = guests;

      payload.details = {
        format: data.format,
        ...(hasGuests ? { groupSize: guests } : {}),
        originalPage: window.location.pathname,
      };

      const response = await fetch(INTAKE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // 201 und 202 sind beide response.ok === true und gelten als Erfolg;
      // 422, 429 und alles andere (sowie Netzwerkfehler im catch) sind Fehler.
      if (!response.ok) {
        throw new Error(`Submit failed with status ${response.status}`);
      }

      // GA4 Conversion-Event: generate_lead (analog zum Reisegruppen-Formular)
      if (typeof window !== "undefined" && typeof (window as Window & { gtag?: (...args: unknown[]) => void }).gtag === "function") {
        (window as Window & { gtag: (...args: unknown[]) => void }).gtag("event", "generate_lead", {
          form_name: "filmfest_anfrage",
          page_path: window.location.pathname,
          value: 1500,
          currency: "EUR",
        });
      }

      setIsSubmitted(true);
      toast({
        title: "Anfrage gesendet",
        description: "Vielen Dank! Wir melden uns innerhalb von 24 Stunden zurück.",
      });
    } catch (error) {
      console.error("Error submitting filmfest inquiry:", error);
      toast({
        title: "Etwas ist schiefgelaufen",
        description:
          "Bitte versuchen Sie es erneut oder rufen Sie uns direkt an: +49 89 51519696.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      submitLock.current = false;
    }
  };

  if (isSubmitted) {
    return (
      <div className="ff-form text-center py-12">
        <CheckCircle className="w-14 h-14 mx-auto mb-4 text-[hsl(38_72%_60%)]" />
        <h3 className="font-display text-2xl mb-2 text-[hsl(36_38%_92%)]">
          Anfrage gesendet
        </h3>
        <p className="text-[hsl(36_25%_72%)]">
          Vielen Dank! Wir melden uns innerhalb von 24 Stunden zurück.
        </p>
      </div>
    );
  }

  return (
    <form className="ff-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <h3 className="font-display text-2xl mb-1 text-[hsl(36_38%_92%)]">
        Eventanfrage Filmfest 2026
      </h3>
      <p className="text-sm text-[hsl(36_22%_66%)] mb-6">
        Unverbindlich — wir melden uns kurzfristig zurück.
      </p>

      <div className="ff-field">
        <label htmlFor="ff-name">Name / Firma</label>
        <input
          id="ff-name"
          type="text"
          placeholder="Produktion, Verleih, Agentur …"
          {...register("name")}
        />
        {errors.name && <span className="ff-error">{errors.name.message}</span>}
      </div>

      <div className="ff-row">
        <div className="ff-field">
          <label htmlFor="ff-email">E-Mail</label>
          <input id="ff-email" type="email" placeholder="sie@firma.de" {...register("email")} />
          {errors.email && <span className="ff-error">{errors.email.message}</span>}
        </div>
        <div className="ff-field">
          <label htmlFor="ff-phone">Telefon</label>
          <input id="ff-phone" type="tel" placeholder="optional" {...register("phone")} />
        </div>
      </div>

      <div className="ff-row">
        <div className="ff-field">
          <label htmlFor="ff-date">Wunschtermin</label>
          <input
            id="ff-date"
            type="date"
            min="2026-06-26"
            max="2026-07-05"
            {...register("preferred_date")}
          />
        </div>
        <div className="ff-field">
          <label htmlFor="ff-guests">Gäste (ca.)</label>
          <input id="ff-guests" type="number" min={6} placeholder="z. B. 40" {...register("guest_count")} />
        </div>
      </div>

      <div className="ff-field">
        <label htmlFor="ff-format">Format</label>
        <select id="ff-format" {...register("format")}>
          {FORMAT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
        {errors.format && <span className="ff-error">{errors.format.message}</span>}
      </div>

      <div className="ff-field">
        <label htmlFor="ff-msg">Anmerkungen</label>
        <textarea
          id="ff-msg"
          rows={3}
          placeholder="Anlass, Film, besondere Wünsche …"
          {...register("message")}
        />
      </div>

      <Button type="submit" disabled={isSubmitting} className="ff-submit w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Wird gesendet …
          </>
        ) : (
          <>
            <Send className="w-5 h-5 mr-2" />
            Anfrage senden
          </>
        )}
      </Button>
      <p className="text-xs text-[hsl(36_18%_55%)] mt-3 text-center">
        {f.privacyNotePre}
        <LocalizedLink to="datenschutz" className="underline hover:no-underline">
          {f.privacyNoteLink}
        </LocalizedLink>
        {f.privacyNotePost}
      </p>
      <p className="text-xs text-[hsl(36_18%_55%)] mt-3 text-center">
        Alternativ erreichen Sie uns direkt unter <PhoneText>+49 89 51519696</PhoneText>.
      </p>
    </form>
  );
};

export default FilmfestInquiryForm;