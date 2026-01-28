import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Send, CheckCircle, Loader2 } from 'lucide-react';

const formSchema = z.object({
  company_name: z.string().min(2, 'Bitte Firmennamen eingeben').max(100),
  contact_name: z.string().min(2, 'Bitte Namen eingeben').max(100),
  email: z.string().email('Bitte gültige E-Mail eingeben').max(255),
  phone: z.string().max(30).optional(),
  guest_count: z.string().min(1, 'Bitte Personenanzahl wählen'),
  event_type: z.string().min(1, 'Bitte Veranstaltungsart wählen'),
  preferred_date: z.string().optional(),
  message: z.string().max(1000).optional(),
});

type FormData = z.infer<typeof formSchema>;

export const EventInquiryForm = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      company_name: '',
      contact_name: '',
      email: '',
      phone: '',
      guest_count: '',
      event_type: '',
      preferred_date: '',
      message: '',
    },
  });

  const guestCountOptions = [
    { value: '6-20', label: t.eventForm.guestCount6_20 },
    { value: '21-50', label: t.eventForm.guestCount21_50 },
    { value: '51-100', label: t.eventForm.guestCount51_100 },
    { value: '100+', label: t.eventForm.guestCount100plus },
  ];

  const eventTypeOptions = [
    { value: 'weihnachtsfeier', label: t.eventForm.eventTypeChristmas },
    { value: 'sommerfest', label: t.eventForm.eventTypeSummer },
    { value: 'team-building', label: 'Team-Building' },
    { value: 'business-dinner', label: 'Business-Dinner' },
    { value: 'firmenfeier', label: t.eventForm.eventTypeCorporate },
    { value: 'sonstiges', label: t.eventForm.eventTypeOther },
  ];

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Send to Events & Catering project's edge function
      const EVENTS_PROJECT_URL = 'https://sovlfqncotxcjqseeawp.supabase.co/functions/v1/receive-event-inquiry';
      
      const response = await fetch(EVENTS_PROJECT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          company_name: data.company_name.trim(),
          contact_name: data.contact_name.trim(),
          email: data.email.trim().toLowerCase(),
          phone: data.phone?.trim() || null,
          guest_count: data.guest_count,
          event_type: data.event_type,
          preferred_date: data.preferred_date || null,
          message: data.message?.trim() || null,
          source: 'ristorante-website', // Track where the inquiry came from
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to submit inquiry');
      }

      setIsSubmitted(true);
      toast({
        title: t.eventForm.successTitle,
        description: t.eventForm.successMessage,
      });
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast({
        title: t.eventForm.errorTitle,
        description: t.eventForm.errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-serif font-semibold mb-2">
          {t.eventForm.successTitle}
        </h3>
        <p className="text-muted-foreground">
          {t.eventForm.successMessage}
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="company_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.eventForm.companyLabel} *</FormLabel>
                <FormControl>
                  <Input placeholder={t.eventForm.companyPlaceholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contact_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.eventForm.contactLabel} *</FormLabel>
                <FormControl>
                  <Input placeholder={t.eventForm.contactPlaceholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.eventForm.emailLabel} *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder={t.eventForm.emailPlaceholder} {...field} />
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
                <FormLabel>{t.eventForm.phoneLabel}</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder={t.eventForm.phonePlaceholder} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="guest_count"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.eventForm.guestCountLabel} *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t.eventForm.guestCountPlaceholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {guestCountOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
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
            name="event_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t.eventForm.eventTypeLabel} *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t.eventForm.eventTypePlaceholder} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {eventTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="preferred_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.eventForm.dateLabel}</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.eventForm.messageLabel}</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={t.eventForm.messagePlaceholder} 
                  rows={3}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {t.eventForm.submitting}
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              {t.eventForm.submitButton}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};