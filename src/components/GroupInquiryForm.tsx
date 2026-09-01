import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useUtmParams } from "@/hooks/useUtmParams";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Send, ChevronDown, MessageCircle } from "lucide-react";
import { useGroupMenus, getLocalizedText } from "@/hooks/useGroupMenus";
import LocalizedLink from "@/components/LocalizedLink";

const EVENTS_FUNCTION_URL =
  "https://sovlfqncotxcjqseeawp.supabase.co/functions/v1/receive-group-inquiry";

// ── Schema ───────────────────────────────────────────────────────────────────

const schema = z.object({
  // Honeypot — must stay empty
  _hp: z.string().max(0),
  company_name: z.string().max(100).optional(),
  contact_name: z.string().min(2).max(100),
  email: z.string().email().max(255),
  phone: z.string().max(30).optional(),
  group_size: z.number({ invalid_type_error: "Bitte Zahl eingeben" }).int().min(10).max(500),
  preferred_date: z.string().optional(),
  preferred_date_flexible: z.boolean().optional(),
  arrival_time: z.string().max(20).optional(),
  preferred_menu: z.string().optional(),
  message: z.string().max(1500).optional(),
  privacy: z.literal(true, { errorMap: () => ({ message: "Bitte Datenschutzerklärung akzeptieren" }) }),
});

type FormData = z.infer<typeof schema>;

// ── Component ─────────────────────────────────────────────────────────────────

export const GroupInquiryForm = () => {
  const { t, language } = useLanguage();
  const f = t.groupInquiryForm;
  const { menus } = useGroupMenus();
  const utmParams = useUtmParams();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [travelPlanFile, setTravelPlanFile] = useState<File | null>(null);
  const [travelPlanError, setTravelPlanError] = useState<string | null>(null);
  // Toggle für sekundäre Felder (Conversion-Optimierung: nur 5 Pflichtfelder sichtbar)
  const [showMore, setShowMore] = useState(false);

  // Timestamp spam check: form must be open ≥ 3 seconds before submit
  const openedAt = useRef<number>(Date.now());
  // Anti-Doppelklick: synchroner Riegel (State-Updates sind async)
  const submitLock = useRef(false);


  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      _hp: "",
      company_name: "",
      contact_name: "",
      email: "",
      phone: "",
      group_size: undefined,
      preferred_date: "",
      preferred_date_flexible: false,
      arrival_time: "",
      preferred_menu: "",
      message: "",
      privacy: undefined,
    },
  });

  // Reset timer when form mounts
  useEffect(() => {
    openedAt.current = Date.now();
  }, []);

  // Menü-Vorauswahl per Klick auf "Jetzt anfragen" einer Menü-Karte
  useEffect(() => {
    const handler = (e: Event) => {
      const key = (e as CustomEvent<string>).detail;
      if (typeof key === "string" && key) {
        setShowMore(true);
        form.setValue("preferred_menu", key, { shouldDirty: true });
      }
    };
    window.addEventListener("storia:preselect-menu", handler);
    return () => window.removeEventListener("storia:preselect-menu", handler);
  }, [form]);

  // Menu options: dynamic from Supabase if available, else fallback
  const adviceOption = { value: "advice", label: f.menuAdvice };
  const menuOptions =
    menus.length > 0
      ? [
          adviceOption,
          ...menus.map((m) => ({
            value: m.menu_key,
            label: getLocalizedText(m.title, language),
          })),
          { value: "custom", label: f.menuCustom },
        ]
      : [
          adviceOption,
          { value: "A", label: f.menuA },
          { value: "B", label: f.menuB },
          { value: "C", label: f.menuC },
          { value: "custom", label: f.menuCustom },
        ];

  // Convert File to base64 string
  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const onSubmit = async (data: FormData) => {
    // Doppel-/Parallel-Submits sofort blockieren
    if (submitLock.current || isSubmitting) return;

    // Honeypot check
    if (data._hp) return;

    // Timing check: reject if < 3 seconds
    if (Date.now() - openedAt.current < 3000) return;

    submitLock.current = true;
    setIsSubmitting(true);
    setSubmitError(null);


    try {
      let travelPlanBase64: string | null = null;
      let travelPlanFilename: string | null = null;

      if (travelPlanFile) {
        travelPlanBase64 = await fileToBase64(travelPlanFile);
        travelPlanFilename = travelPlanFile.name;
      }

      const response = await fetch(EVENTS_FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: data.company_name?.trim() || null,
          contactName: data.contact_name.trim(),
          email: data.email.trim().toLowerCase(),
          phone: data.phone?.trim() || null,
          groupSize: data.group_size,
          preferredDate: data.preferred_date || null,
          preferredDateFlexible: data.preferred_date_flexible ?? false,
          arrivalTime: data.arrival_time?.trim() || null,
          preferredMenu: data.preferred_menu,
          message: data.message?.trim() || null,
          travelPlanBase64,
          travelPlanFilename,
          language,
          source: "ristorantestoria-reisegruppen",
          ...utmParams,
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error((err as Record<string, string>).error ?? "Submit failed");
      }

      // GA4 Conversion-Event: generate_lead
      if (typeof window !== "undefined" && typeof (window as Window & { gtag?: (...args: unknown[]) => void }).gtag === "function") {
        (window as Window & { gtag: (...args: unknown[]) => void }).gtag("event", "generate_lead", {
          form_name: "reisegruppen_anfrage",
          page_path: window.location.pathname,
          language,
          value: 1500,
          currency: "EUR",
          ...utmParams,
        });
      }

      // Redirect to thank-you page
      navigate("/reisegruppen/danke/");
    } catch {
      setSubmitError(f.errorMessage);
    } finally {
      setIsSubmitting(false);
      submitLock.current = false;
    }

  };

  // WhatsApp-Prefill aus aktuellen Formularwerten (Datum + Gruppengröße)
  const waSize = form.watch("group_size");
  const waDate = form.watch("preferred_date");
  const waDetails = [
    waSize ? `${f.groupSizeLabel}: ${waSize}` : "",
    waDate ? `${f.dateLabel.replace(/\s*\([^)]*\)/, "")}: ${waDate}` : "",
  ].filter(Boolean).join(", ");
  const waText = waDetails ? `${f.whatsappPrefill} ${waDetails}.` : f.whatsappPrefill;
  const waHref = `https://wa.me/491636033912?text=${encodeURIComponent(waText)}`;

  return (
    <div className="mt-10 pt-8 border-t border-primary-foreground/20">
      <h3 className="text-xl font-serif font-semibold text-primary-foreground mb-6">
        {f.title}
      </h3>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Honeypot - hidden from real users */}
          <input
            type="text"
            {...form.register("_hp")}
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
          />

          {/* ── Sichtbare Pflicht-/Kernfelder (max. 5) ─────────────────────── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="contact_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary-foreground/90">{f.contactLabel} *</FormLabel>
                  <FormControl>
                    <Input placeholder={f.contactPlaceholder} {...field} className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary-foreground/90">{f.emailLabel} *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder={f.emailPlaceholder} {...field} className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="group_size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary-foreground/90">{f.groupSizeLabel} *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={10}
                      placeholder={f.groupSizePlaceholder}
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                      className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="preferred_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary-foreground/90">{f.dateLabel}</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} className="bg-white/10 border-white/20 text-primary-foreground" />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-primary-foreground/90">{f.messageLabel}</FormLabel>
                <FormControl>
                  <Textarea
                    rows={3}
                    placeholder={f.messagePlaceholder}
                    {...field}
                    className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/50"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {/* ── Aufklapper: sekundäre Felder (optional) ────────────────────── */}
          <div>
            <button
              type="button"
              onClick={() => setShowMore((v) => !v)}
              aria-expanded={showMore}
              className="inline-flex items-center gap-2 text-sm font-medium text-primary-foreground/80 hover:text-primary-foreground transition-colors"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${showMore ? "rotate-180" : ""}`} />
              {f.moreDetailsToggle}
            </button>

            {showMore && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="company_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary-foreground/90">{f.companyLabel}</FormLabel>
                        <FormControl>
                          <Input placeholder={f.companyPlaceholder} {...field} className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/50" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary-foreground/90">{f.phoneLabel}</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder={f.phonePlaceholder} {...field} className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/50" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="preferred_menu"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary-foreground/90">{f.menuLabel}</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white/10 border-white/20 text-primary-foreground">
                              <SelectValue placeholder={f.menuPlaceholder} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {menuOptions.map((opt) => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="arrival_time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-primary-foreground/90">{f.arrivalTimeLabel}</FormLabel>
                        <FormControl>
                          <Input placeholder={f.arrivalTimePlaceholder} {...field} className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/50" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="preferred_date_flexible"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="border-white/40 data-[state=checked]:bg-white data-[state=checked]:text-primary"
                        />
                      </FormControl>
                      <FormLabel className="text-primary-foreground/80 text-sm font-normal cursor-pointer">
                        {f.dateFlexible}
                      </FormLabel>
                    </FormItem>
                  )}
                />

                {/* PDF Upload — optional travel plan */}
                <div className="space-y-1">
                  <label className="block text-sm text-primary-foreground/90 font-medium">
                    {f.travelPlanLabel}
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="block w-full text-sm text-primary-foreground/80 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-white/20 file:text-primary-foreground hover:file:bg-white/30 cursor-pointer"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      setTravelPlanError(null);
                      if (!file) { setTravelPlanFile(null); return; }
                      if (file.type !== "application/pdf") {
                        setTravelPlanError(f.travelPlanWrongType);
                        setTravelPlanFile(null);
                        e.target.value = "";
                        return;
                      }
                      if (file.size > 5 * 1024 * 1024) {
                        setTravelPlanError(f.travelPlanTooBig);
                        setTravelPlanFile(null);
                        e.target.value = "";
                        return;
                      }
                      setTravelPlanFile(file);
                    }}
                  />
                  {travelPlanError && (
                    <p className="text-sm text-red-300">{travelPlanError}</p>
                  )}
                  <p className="text-xs text-primary-foreground/60">{f.travelPlanHint}</p>
                </div>
              </div>
            )}
          </div>

          <FormField
            control={form.control}
            name="privacy"
            render={({ field }) => (
              <FormItem className="flex items-start gap-3">
                <FormControl>
                  <Checkbox
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                    className="mt-0.5 border-white/40 data-[state=checked]:bg-white data-[state=checked]:text-primary"
                  />
                </FormControl>
                <div className="space-y-1">
                  <FormLabel className="text-primary-foreground/80 text-sm font-normal cursor-pointer leading-relaxed">
                    {f.privacyText}{" "}
                    <LocalizedLink to="datenschutz" className="underline hover:text-primary-foreground">
                      {f.privacyLink}
                    </LocalizedLink>{" "}
                    {f.privacyTextAfter}
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          {submitError && (
            <p className="text-sm bg-red-500/20 text-red-200 rounded-lg px-4 py-3">
              {submitError}
            </p>
          )}

          <p className="text-sm text-primary-foreground/70 text-center sm:text-left">
            {f.replyHint}
          </p>

          {/* Absenden + WhatsApp gleichwertig (Gäste bevorzugen den direkten Draht) */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="submit"
              size="lg"
              variant="secondary"
              disabled={!form.watch("privacy") || isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" />{f.submitting}</>
              ) : (
                <><Send className="w-5 h-5 mr-2" />{f.submitButton}</>
              )}
            </Button>
            <Button
              type="button"
              size="lg"
              variant="outlineWhite"
              asChild
              className="w-full sm:w-auto"
            >
              <a href={waHref} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-5 h-5 mr-2" />
                {f.whatsappButton}
              </a>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default GroupInquiryForm;
