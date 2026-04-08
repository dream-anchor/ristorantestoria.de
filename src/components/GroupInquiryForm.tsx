import { useState, useEffect, useRef } from "react";
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
import { CheckCircle, Loader2, Send } from "lucide-react";
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
  preferred_menu: z.string().min(1),
  message: z.string().max(1500).optional(),
  privacy: z.literal(true, { errorMap: () => ({ message: "Bitte Datenschutzerklärung akzeptieren" }) }),
});

type FormData = z.infer<typeof schema>;

// ── Component ─────────────────────────────────────────────────────────────────

export const GroupInquiryForm = () => {
  const { t, language } = useLanguage();
  const f = t.groupInquiryForm;
  const { menus } = useGroupMenus();

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Timestamp spam check: form must be open ≥ 3 seconds before submit
  const openedAt = useRef<number>(Date.now());

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

  // Menu options: dynamic from Supabase if available, else fallback
  const menuOptions =
    menus.length > 0
      ? [
          ...menus.map((m) => ({
            value: m.menu_key,
            label: getLocalizedText(m.title, language),
          })),
          { value: "custom", label: f.menuCustom },
        ]
      : [
          { value: "A", label: f.menuA },
          { value: "B", label: f.menuB },
          { value: "C", label: f.menuC },
          { value: "custom", label: f.menuCustom },
        ];

  const onSubmit = async (data: FormData) => {
    // Honeypot check
    if (data._hp) return;

    // Timing check: reject if < 3 seconds
    if (Date.now() - openedAt.current < 3000) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(EVENTS_FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company_name: data.company_name?.trim() || null,
          contact_name: data.contact_name.trim(),
          email: data.email.trim().toLowerCase(),
          phone: data.phone?.trim() || null,
          group_size: data.group_size,
          preferred_date: data.preferred_date || null,
          preferred_date_flexible: data.preferred_date_flexible ?? false,
          arrival_time: data.arrival_time?.trim() || null,
          preferred_menu: data.preferred_menu,
          message: data.message?.trim() || null,
          language,
          source: "ristorantestoria-reisegruppen",
        }),
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error((err as Record<string, string>).error ?? "Submit failed");
      }

      setIsSubmitted(true);
    } catch {
      setSubmitError(f.errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-10">
        <CheckCircle className="w-14 h-14 text-green-400 mx-auto mb-4" />
        <h3 className="text-xl font-serif font-semibold text-primary-foreground mb-2">
          {f.successTitle}
        </h3>
        <p className="text-primary-foreground/80">{f.successMessage}</p>
      </div>
    );
  }

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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              name="preferred_menu"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-primary-foreground/90">{f.menuLabel} *</FormLabel>
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
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
              <FormField
                control={form.control}
                name="preferred_date_flexible"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2 mt-2">
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
            </div>
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

          <Button
            type="submit"
            size="lg"
            variant="secondary"
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <><Loader2 className="w-5 h-5 mr-2 animate-spin" />{f.submitting}</>
            ) : (
              <><Send className="w-5 h-5 mr-2" />{f.submitButton}</>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default GroupInquiryForm;
