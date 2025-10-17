import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import ImageGrid from "@/components/ImageGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Navigation />
      <ImageGrid />
      
      <footer className="bg-muted border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p className="mb-2">STORIA - Ristorante · Pizzeria · Bar</p>
          <p>Im Herzen von München</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
