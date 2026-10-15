import { useRef, useState, type FormEvent } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { CheckCircle, Loader2 } from 'lucide-react';
import LocalizedLink from '@/components/LocalizedLink';

export const WAITLIST_GUESTS = ['2', '3', '4', '5', '6', '7-10', '10+'] as const;
export const WAITLIST_TIMES = ['egal', 'frueh', 'spaet'] as const;

const selectClass =
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

/** Warteliste Silvester: direkter anonymer INSERT in silvester_waitlist (RLS: nur INSERT, Status 'wartet').
 *  Keine Bestätigungsmail — das Team meldet sich per mailto aus dem Admin, wenn ein Platz frei wird. */
const SilvesterWaitlistForm = () => {
  const { t, language } = useLanguage();
  const w = t.seo.silvester.waitlist;
  const [form, setForm] = useState({ name: '', email: '', phone: '', guests: '2', time_pref: 'egal', message: '' });
  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const lock = useRef(false);

  const set = (k: keyof typeof form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (lock.current) return;
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.trim();
    if (!email && !phone) return void toast.error(w.contactRequired);
    if (!consent) return void toast.error(w.consentRequired);
    lock.current = true;
    setSubmitting(true);
    try {
      const { error } = await supabase.from('silvester_waitlist').insert({
        name: form.name.trim(),
        email: email || null,
        phone: phone || null,
        guests: form.guests,
        time_pref: form.time_pref,
        message: form.message.trim() || null,
        language,
        consent_text: w.consent.replace('{link}', w.consentLink),
        consent_at: new Date().toISOString(),
      });
      if (error) throw error;
      setDone(true);
    } catch (err) {
      console.error('Waitlist error:', err);
      toast.error(w.error);
    } finally {
      setSubmitting(false);
      lock.current = false;
    }
  };

  if (done) {
    return (
      <div className="text-center py-8" role="status">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-serif font-semibold mb-2">{w.successTitle}</h3>
        <p className="text-muted-foreground">{w.successText}</p>
      </div>
    );
  }

  const [consentBefore, consentAfter] = w.consent.split('{link}');
  const timeLabels: Record<string, string> = { egal: w.timeAny, frueh: w.timeEarly, spaet: w.timeLate };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="wl-name">{w.name}</Label>
        <Input id="wl-name" required maxLength={200} autoComplete="name" value={form.name} onChange={set('name')} />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="wl-email">{w.email}</Label>
          <Input id="wl-email" type="email" maxLength={255} autoComplete="email" value={form.email} onChange={set('email')} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="wl-phone">{w.phone}</Label>
          <Input id="wl-phone" type="tel" maxLength={50} autoComplete="tel" value={form.phone} onChange={set('phone')} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="wl-guests">{w.guests}</Label>
          <select id="wl-guests" className={selectClass} value={form.guests} onChange={set('guests')}>
            {WAITLIST_GUESTS.map((g) => (
              <option key={g} value={g}>{g === '10+' ? w.guestsMore : g.replace('-', '–')}</option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="wl-time">{w.time}</Label>
          <select id="wl-time" className={selectClass} value={form.time_pref} onChange={set('time_pref')}>
            {WAITLIST_TIMES.map((v) => <option key={v} value={v}>{timeLabels[v]}</option>)}
          </select>
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="wl-message">{w.message}</Label>
        <Textarea id="wl-message" maxLength={2000} value={form.message} onChange={set('message')} />
      </div>
      <div className="flex items-start gap-3">
        <Checkbox id="wl-consent" checked={consent} onCheckedChange={(c) => setConsent(c === true)} />
        <Label htmlFor="wl-consent" className="text-sm font-normal text-muted-foreground leading-snug">
          {consentBefore}
          <LocalizedLink to="datenschutz" className="text-primary underline hover:no-underline">{w.consentLink}</LocalizedLink>
          {consentAfter}
        </Label>
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />{w.submitting}</> : w.submit}
      </Button>
    </form>
  );
};

export default SilvesterWaitlistForm;
