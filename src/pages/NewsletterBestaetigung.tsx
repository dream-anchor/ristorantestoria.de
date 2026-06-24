import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle, Loader2, XCircle } from "lucide-react";

type Lang = "de" | "en" | "it" | "fr";
type State = "loading" | "confirmed" | "already" | "invalid";

const COPY: Record<Lang, {
  metaTitle: string;
  loading: string;
  confirmedTitle: string;
  confirmedMsg: string;
  alreadyTitle: string;
  alreadyMsg: string;
  invalidTitle: string;
  invalidMsg: string;
}> = {
  de: {
    metaTitle: "Newsletter-Bestätigung | Ristorante STORIA München",
    loading: "Ihre Anmeldung wird bestätigt …",
    confirmedTitle: "Anmeldung bestätigt",
    confirmedMsg: "Vielen Dank! Sie sind nun für unsere Menü-Benachrichtigung angemeldet.",
    alreadyTitle: "Bereits bestätigt",
    alreadyMsg: "Ihre Anmeldung war bereits bestätigt. Es ist nichts weiter zu tun.",
    invalidTitle: "Link ungültig",
    invalidMsg: "Dieser Bestätigungslink ist ungültig oder abgelaufen. Bitte melden Sie sich erneut an.",
  },
  en: {
    metaTitle: "Newsletter Confirmation | Ristorante STORIA Munich",
    loading: "Confirming your subscription …",
    confirmedTitle: "Subscription confirmed",
    confirmedMsg: "Thank you! You are now subscribed to our menu notification.",
    alreadyTitle: "Already confirmed",
    alreadyMsg: "Your subscription was already confirmed. Nothing else to do.",
    invalidTitle: "Invalid link",
    invalidMsg: "This confirmation link is invalid or has expired. Please sign up again.",
  },
  it: {
    metaTitle: "Conferma Newsletter | Ristorante STORIA Monaco",
    loading: "Conferma dell'iscrizione in corso …",
    confirmedTitle: "Iscrizione confermata",
    confirmedMsg: "Grazie! Ora sei iscritto alla notifica del nostro menù.",
    alreadyTitle: "Già confermata",
    alreadyMsg: "La tua iscrizione era già stata confermata. Non devi fare altro.",
    invalidTitle: "Link non valido",
    invalidMsg: "Questo link di conferma non è valido o è scaduto. Effettua nuovamente l'iscrizione.",
  },
  fr: {
    metaTitle: "Confirmation Newsletter | Ristorante STORIA Munich",
    loading: "Confirmation de votre inscription …",
    confirmedTitle: "Inscription confirmée",
    confirmedMsg: "Merci ! Vous êtes maintenant inscrit(e) à notre notification de menu.",
    alreadyTitle: "Déjà confirmée",
    alreadyMsg: "Votre inscription était déjà confirmée. Rien d'autre à faire.",
    invalidTitle: "Lien invalide",
    invalidMsg: "Ce lien de confirmation est invalide ou a expiré. Veuillez vous réinscrire.",
  },
};

const CANONICAL: Record<Lang, string> = {
  de: "/newsletter-bestaetigen",
  en: "/en/confirm-newsletter",
  it: "/it/conferma-newsletter",
  fr: "/fr/confirmation-newsletter",
};

interface Props {
  lang?: Lang;
}

const NewsletterBestaetigung = ({ lang = "de" }: Props) => {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<State>("loading");
  const c = COPY[lang];

  useEffect(() => {
    const token = searchParams.get("token") ?? "";
    if (!token) {
      setState("invalid");
      return;
    }
    let active = true;
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("confirm-seasonal", {
          body: { token },
        });
        if (!active) return;
        if (error || !data) {
          setState("invalid");
          return;
        }
        if (data.status === "confirmed") setState("confirmed");
        else if (data.status === "already_confirmed") setState("already");
        else setState("invalid");
      } catch {
        if (active) setState("invalid");
      }
    })();
    return () => {
      active = false;
    };
  }, [searchParams]);

  return (
    <>
      <SEO title={c.metaTitle} description={c.confirmedMsg} canonical={CANONICAL[lang]} noHreflang noindex />

      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center py-20">
          <div className="container mx-auto px-4 max-w-xl text-center">
            {state === "loading" && (
              <>
                <Loader2 className="w-14 h-14 mx-auto mb-6 text-primary animate-spin" />
                <p className="text-muted-foreground">{c.loading}</p>
              </>
            )}
            {(state === "confirmed" || state === "already") && (
              <>
                <CheckCircle className="w-16 h-16 mx-auto mb-6 text-green-500" />
                <h1 className="text-2xl md:text-3xl font-serif font-bold mb-3">
                  {state === "confirmed" ? c.confirmedTitle : c.alreadyTitle}
                </h1>
                <p className="text-muted-foreground">
                  {state === "confirmed" ? c.confirmedMsg : c.alreadyMsg}
                </p>
              </>
            )}
            {state === "invalid" && (
              <>
                <XCircle className="w-16 h-16 mx-auto mb-6 text-destructive" />
                <h1 className="text-2xl md:text-3xl font-serif font-bold mb-3">{c.invalidTitle}</h1>
                <p className="text-muted-foreground">{c.invalidMsg}</p>
              </>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default NewsletterBestaetigung;