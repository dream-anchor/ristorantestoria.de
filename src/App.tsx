import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import Reservierung from "./pages/Reservierung";
import Menu from "./pages/Menu";
import Mittagsmenu from "./pages/Mittagsmenu";
import Speisekarte from "./pages/Speisekarte";
import Getraenke from "./pages/Getraenke";
import BesondereAnlaesse from "./pages/BesondereAnlaesse";
import Weihnachtsmenues from "./pages/Weihnachtsmenues";
import Kontakt from "./pages/Kontakt";
import Catering from "./pages/Catering";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import AdminLogin from "./pages/AdminLogin";
import FloatingActions from "./components/FloatingActions";

const queryClient = new QueryClient();

// Root App component
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <FloatingActions />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/reservierung" element={<Reservierung />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/mittagsmenu" element={<Mittagsmenu />} />
            <Route path="/speisekarte" element={<Speisekarte />} />
            <Route path="/getraenke" element={<Getraenke />} />
            <Route path="/besondere-anlaesse" element={<BesondereAnlaesse />} />
            <Route path="/weihnachtsmenues" element={<Weihnachtsmenues />} />
            <Route path="/kontakt" element={<Kontakt />} />
            <Route path="/catering" element={<Catering />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
