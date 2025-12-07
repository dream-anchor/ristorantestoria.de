import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
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
  const { language } = useLanguage();
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
    { value: '6-20', label: '6-20' },
    { value: '21-50', label: '21-50' },
    { value: '51-100', label: '51-100' },
    { value: '100+', label: '100+' },
  ];

  const eventTypeOptions = [
    { value: 'weihnachtsfeier', label: language === 'de' ? 'Weihnachtsfeier' : 'Christmas Party' },
    { value: 'sommerfest', label: language === 'de' ? 'Sommerfest' : 'Summer Party' },
    { value: 'team-building', label: 'Team-Building' },
    { value: 'business-dinner', label: 'Business-Dinner' },
    { value: 'jubilaeum', label: language === 'de' ? 'Firmenjubiläum' : 'Company Anniversary' },
    { value: 'sonstiges', label: language === 'de' ? 'Sonstiges' : 'Other' },
  ];

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // @ts-ignore - table exists but types not yet regenerated
      const { error } = await supabase.from('event_inquiries').insert({
        company_name: data.company_name.trim(),
        contact_name: data.contact_name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone?.trim() || null,
        guest_count: data.guest_count,
        event_type: data.event_type,
        preferred_date: data.preferred_date || null,
        message: data.message?.trim() || null,
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast({
        title: language === 'de' ? 'Anfrage gesendet!' : 'Inquiry sent!',
        description: language === 'de' 
          ? 'Wir melden uns schnellstmöglich bei Ihnen.' 
          : 'We will get back to you as soon as possible.',
      });
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      toast({
        title: language === 'de' ? 'Fehler' : 'Error',
        description: language === 'de' 
          ? 'Bitte versuchen Sie es erneut oder rufen Sie uns an.' 
          : 'Please try again or give us a call.',
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
          {language === 'de' ? 'Vielen Dank!' : 'Thank you!'}
        </h3>
        <p className="text-muted-foreground">
          {language === 'de' 
            ? 'Wir haben Ihre Anfrage erhalten und melden uns innerhalb von 24 Stunden.'
            : 'We received your inquiry and will get back to you within 24 hours.'}
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
                <FormLabel>{language === 'de' ? 'Firma *' : 'Company *'}</FormLabel>
                <FormControl>
                  <Input placeholder={language === 'de' ? 'Firmenname' : 'Company name'} {...field} />
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
                <FormLabel>{language === 'de' ? 'Ansprechpartner *' : 'Contact person *'}</FormLabel>
                <FormControl>
                  <Input placeholder={language === 'de' ? 'Ihr Name' : 'Your name'} {...field} />
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
                <FormLabel>E-Mail *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@firma.de" {...field} />
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
                <FormLabel>{language === 'de' ? 'Telefon (optional)' : 'Phone (optional)'}</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+49 89 ..." {...field} />
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
                <FormLabel>{language === 'de' ? 'Personenanzahl *' : 'Number of guests *'}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'de' ? 'Bitte wählen' : 'Please select'} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {guestCountOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label} {language === 'de' ? 'Personen' : 'guests'}
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
                <FormLabel>{language === 'de' ? 'Veranstaltungsart *' : 'Event type *'}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={language === 'de' ? 'Bitte wählen' : 'Please select'} />
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
              <FormLabel>{language === 'de' ? 'Wunschtermin (optional)' : 'Preferred date (optional)'}</FormLabel>
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
              <FormLabel>{language === 'de' ? 'Nachricht (optional)' : 'Message (optional)'}</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={language === 'de' 
                    ? 'Besondere Wünsche, Fragen, Anmerkungen...' 
                    : 'Special requests, questions, comments...'} 
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
              {language === 'de' ? 'Wird gesendet...' : 'Sending...'}
            </>
          ) : (
            <>
              <Send className="w-5 h-5 mr-2" />
              {language === 'de' ? 'Unverbindlich anfragen' : 'Send inquiry'}
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          {language === 'de' 
            ? '* Pflichtfelder. Wir melden uns innerhalb von 24 Stunden.'
            : '* Required fields. We will respond within 24 hours.'}
        </p>
      </form>
    </Form>
  );
};
