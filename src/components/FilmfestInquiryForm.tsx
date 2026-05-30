import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Send, CheckCircle, Loader2 } from "lucide-react";

const EVENTS_PROJECT_URL =
  "https://sovlfqncotxcjqseeawp.supabase.co/functions/v1/receive-event-inquiry";

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
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsSubmitting(true);
    try {
      const response = await fetch(EVENTS_PROJECT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: data.name.trim(),
          contactName: data.name.trim(),
          email: data.email.trim().toLowerCase(),
          phone: data.phone?.trim() || null,
          guestCount: data.guest_count?.trim() || null,
          eventType: "filmfest",
          preferredDate: data.preferred_date || null,
          message:
            `Format: ${data.format}` +
            (data.message?.trim() ? `\n\n${data.message.trim()}` : ""),
          source: "filmfest-landingpage",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to submit inquiry");
      }

      setIsSubmitted(true);
      toast({
        title: "Anfrage gesendet",
        description: "Vielen Dank! Wir melden uns im Festivalzeitraum kurzfristig zurück.",
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
          Vielen Dank! Wir melden uns im Festivalzeitraum besonders schnell zurück.
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
        Alternativ erreichen Sie uns direkt unter +49 89 51519696.
      </p>
    </form>
  );
};

export default FilmfestInquiryForm;