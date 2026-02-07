import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { CheckCircle, Loader2, Mail } from 'lucide-react';
import LocalizedLink from '@/components/LocalizedLink';

interface SeasonalSignupFormProps {
  seasonalEvent: string;
}

const signupSchema = z.object({
  email: z.string().email('Bitte gültige E-Mail eingeben').max(255),
  privacyConsent: z.literal(true, {
    errorMap: () => ({ message: 'Bitte stimmen Sie der Datenschutzerklärung zu.' }),
  }),
});

type SignupFormData = z.infer<typeof signupSchema>;

const SeasonalSignupForm = ({ seasonalEvent }: SeasonalSignupFormProps) => {
  const { t, language } = useLanguage();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      privacyConsent: false as unknown as true,
    },
  });

  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('seasonal_signups')
        .insert({
          email: data.email.trim().toLowerCase(),
          seasonal_event: seasonalEvent,
          language: language,
        });

      if (error) {
        if (error.code === '23505') {
          toast.info(t.seasonalSignup.duplicateMessage);
        } else {
          toast.error(t.seasonalSignup.errorMessage);
          console.error('Signup error:', error);
        }
        return;
      }

      toast.success(t.seasonalSignup.successTitle);
      setIsSubmitted(true);
    } catch (err) {
      toast.error(t.seasonalSignup.errorMessage);
      console.error('Signup error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-serif font-semibold mb-2">
          {t.seasonalSignup.successTitle}
        </h3>
        <p className="text-muted-foreground">
          {t.seasonalSignup.successMessage}
        </p>
      </div>
    );
  }

  // Build privacy checkbox label with link
  const privacyParts = t.seasonalSignup.privacyCheckbox.split('{link}');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.seasonalSignup.emailLabel}</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder={t.seasonalSignup.emailPlaceholder}
                    className="pl-10"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="privacyConsent"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-normal text-muted-foreground">
                  {privacyParts[0]}
                  <LocalizedLink
                    to="datenschutz"
                    className="text-primary underline hover:no-underline"
                  >
                    {t.seasonalSignup.privacyLinkText}
                  </LocalizedLink>
                  {privacyParts[1]}
                </FormLabel>
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              {t.seasonalSignup.submitting}
            </>
          ) : (
            <>
              <Mail className="w-5 h-5 mr-2" />
              {t.seasonalSignup.submitButton}
            </>
          )}
        </Button>
      </form>
    </Form>
  );
};

export default SeasonalSignupForm;
