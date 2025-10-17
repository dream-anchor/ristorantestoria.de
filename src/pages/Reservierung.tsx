import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
import { toast } from "sonner";

const Reservierung = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [persons, setPersons] = useState("2");
  const [requests, setRequests] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Vielen Dank für Ihre Reservierung. Wir freuen uns auf Ihren Besuch.");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="bg-background border-b border-border">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="font-serif text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            STORIA
          </h1>
          <p className="text-lg text-muted-foreground tracking-wide">
            RISTORANTE · PIZZERIA · BAR
          </p>
        </div>
      </div>
      <Navigation />
      
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Reservierung</h1>
        
        <div className="max-w-3xl mx-auto bg-card p-8 rounded-lg border border-border">
          <h2 className="text-2xl font-semibold mb-6">Bequem online reservieren</h2>
          <p className="text-muted-foreground mb-8">
            Bitte reservieren Sie hier oder unter der Nummer <a href="tel:08951519696" className="text-primary hover:underline">089 51519696</a>. 
            Bei kurzfristigen Reservierungen oder Reservierungen für mehr als 6 Personen empfehlen wir Ihnen anzurufen.
          </p>
          <p className="text-muted-foreground mb-8">
            Bei einer Reservierung über unser Reservierungstool erhalten Sie eine Bestätigung via E-Mail.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="text-lg mb-4 block">Bitte wählen Sie ein Datum aus</Label>
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input 
                  id="name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="phone">Telephone</Label>
                <Input 
                  id="phone" 
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="persons">Anzahl Personen</Label>
                <Select value={persons} onValueChange={setPersons}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="requests">Special requests</Label>
              <Textarea 
                id="requests"
                value={requests}
                onChange={(e) => setRequests(e.target.value)}
                rows={4}
              />
            </div>

            <Button type="submit" size="lg" className="w-full">
              Reservierung abschicken
            </Button>
          </form>

          <div className="mt-8 text-center">
            <a href="/events" className="text-primary hover:underline">
              Zum Eventkalender
            </a>
          </div>
        </div>
      </main>

      <footer className="bg-muted border-t border-border py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-sm">
          <p className="mb-2">STORIA - Ristorante · Pizzeria · Bar</p>
          <p>Im Herzen von München</p>
        </div>
      </footer>
    </div>
  );
};

export default Reservierung;
