import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import storiaLogo from "@/assets/storia-logo.webp";

const Reservierung = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-8 text-center">
          <img src={storiaLogo} alt="STORIA" className="h-24 md:h-32 mx-auto mb-4" />
          <p className="text-lg text-muted-foreground tracking-wide font-sans">
            RISTORANTE · PIZZERIA · BAR
          </p>
        </div>
      </div>
      <Navigation />
      
      <main className="container mx-auto px-4 py-12 flex-grow">
        <h1 className="text-4xl font-bold mb-4 text-center">Tisch reservieren</h1>
        <p className="text-muted-foreground mb-8 text-center max-w-2xl mx-auto">
          Reservieren Sie bequem online oder rufen Sie uns an unter{' '}
          <a href="tel:+4989515196" className="text-primary hover:underline font-medium">089 51519696</a>
        </p>
        
        <div className="max-w-4xl mx-auto bg-card rounded-lg border border-border shadow-lg overflow-hidden">
          <iframe 
            src="https://www.opentable.de/booking/restref/availability?rid=115809&restref=115809&lang=de-DE&color=1&r3uid=cfe&dark=false&partysize=2&ot_source=Restaurant%20website"
            className="w-full h-[700px] border-0"
            title="OpenTable Reservierung"
            allow="geolocation"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Reservierung;
