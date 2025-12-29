import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { CalendarIcon, Clock, Users, ExternalLink, Phone, MessageCircle } from "lucide-react";
import { format, addDays, isSameDay, isToday, startOfDay } from "date-fns";
import { de, enUS, it, fr } from "date-fns/locale";

// Calculate Easter Sunday using the Anonymous Gregorian algorithm
const getEasterSunday = (year: number): Date => {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1; // 0-indexed month
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(year, month, day);
};

// Get all closed days (Ruhetage) for a given year
const getClosedDays = (year: number): Date[] => {
  const easterSunday = getEasterSunday(year);
  const easterMonday = addDays(easterSunday, 1);
  
  return [
    new Date(year, 11, 24), // 24. Dezember
    new Date(year, 11, 25), // 25. Dezember
    easterSunday,
    easterMonday,
  ];
};

// Check if a date is a closed day
const isClosedDay = (date: Date): boolean => {
  const year = date.getFullYear();
  const closedDays = getClosedDays(year);
  return closedDays.some(closedDay => isSameDay(date, closedDay));
};

const ReservationBooking = () => {
  const { t, language } = useLanguage();
  const isMobile = useIsMobile();
  const [date, setDate] = useState<Date | undefined>(new Date()); // Default to today
  const [time, setTime] = useState("19:00");
  const [guests, setGuests] = useState("2");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const getLocale = () => {
    switch (language) {
      case 'de': return de;
      case 'it': return it;
      case 'fr': return fr;
      default: return enUS;
    }
  };

  const allTimeSlots = [
    // Mittagszeit
    "11:30", "11:45", "12:00", "12:15", "12:30", "12:45", "13:00", "13:15", "13:30", "13:45", "14:00",
    // Abendzeit
    "18:00", "18:15", "18:30", "18:45", "19:00", "19:15", "19:30", "19:45", "20:00", "20:15", "20:30", "20:45", "21:00", "21:15", "21:30", "21:45", "22:00", "22:15", "22:30"
  ];

  // Filter time slots: if selected date is today, only show future times
  const getAvailableTimeSlots = () => {
    if (!date || !isToday(date)) {
      return allTimeSlots;
    }
    
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    return allTimeSlots.filter(slot => {
      const [slotHour, slotMinute] = slot.split(':').map(Number);
      const slotTotalMinutes = slotHour * 60 + slotMinute;
      const currentTotalMinutes = currentHour * 60 + currentMinute;
      // Can book until the exact time (22:30 bookable until 22:30, not at 22:31)
      return slotTotalMinutes >= currentTotalMinutes;
    });
  };

  const timeSlots = getAvailableTimeSlots();

  const guestOptions = ["1", "2", "3", "4", "5", "6", "7", "8"];

  const buildOpenTableUrl = () => {
    const baseUrl = "https://www.opentable.de/restref/client/";
    const params = new URLSearchParams({
      rid: "115809",
      restref: "115809",
      lang: language === 'de' ? 'de-DE' : language === 'it' ? 'it-IT' : language === 'fr' ? 'fr-FR' : 'en-GB',
      partysize: guests,
      ot_source: "Restaurant website"
    });
    
    if (date) {
      params.append("datetime", `${format(date, "yyyy-MM-dd")}T${time}`);
    }
    
    return `${baseUrl}?${params.toString()}`;
  };

  const handleOpenTable = () => {
    window.open(buildOpenTableUrl(), "_blank", "noopener,noreferrer");
    setIsConfirmOpen(false);
  };

  const handleBookClick = () => {
    setIsConfirmOpen(true);
  };

  const formattedDate = date ? format(date, "EEEE, d. MMMM yyyy", { locale: getLocale() }) : "";

  const ConfirmationContent = () => (
    <div className="space-y-6">
      {/* Reservation Summary */}
      <div className="bg-secondary/50 rounded-xl p-4 space-y-3">
        <div className="flex items-center gap-3">
          <CalendarIcon className="h-5 w-5 text-primary" />
          <span className="font-medium">{formattedDate}</span>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="h-5 w-5 text-primary" />
          <span className="font-medium">{time} {t.reservationBooking.clock}</span>
        </div>
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-primary" />
          <span className="font-medium">
            {guests} {parseInt(guests) === 1 ? t.reservationBooking.person : t.reservationBooking.persons}
          </span>
        </div>
      </div>

      {/* Continue Button */}
      <Button 
        onClick={handleOpenTable}
        className="w-full h-12 text-base font-semibold gap-2"
        size="lg"
      >
        {t.reservationBooking.confirmButton}
        <ExternalLink className="h-4 w-4" />
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        {t.reservationBooking.confirmDescription}
      </p>

      {/* Alternative Contact */}
      <div className="border-t border-border pt-4">
        <p className="text-sm text-muted-foreground text-center mb-3">
          {t.reservationBooking.alternativeTitle}
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <a 
            href="tel:+498951519696"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-secondary/50 transition-colors text-sm font-medium"
          >
            <Phone className="h-4 w-4 text-primary" />
            +49 89 51519696
          </a>
          <a 
            href="https://wa.me/491636033912"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-secondary/50 transition-colors text-sm font-medium"
          >
            <MessageCircle className="h-4 w-4 text-[#25D366]" />
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-primary/5 px-6 py-5 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground text-center">
              {t.reservationBooking.title}
            </h2>
            <p className="text-sm text-muted-foreground text-center mt-1">
              {t.reservationBooking.subtitle}
            </p>
          </div>

        {/* Booking Form */}
        <div className="p-6 space-y-5">
          {/* Selection Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Date Picker */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-primary" />
                {t.reservationBooking.date}
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal h-11"
                  >
                    {date ? format(date, "dd.MM.yyyy", { locale: getLocale() }) : t.reservationBooking.selectDate}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => startOfDay(date) < startOfDay(new Date()) || isClosedDay(date)}
                    locale={getLocale()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Picker */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Clock className="h-4 w-4 text-primary" />
                {t.reservationBooking.time}
              </label>
              <Select value={time} onValueChange={setTime}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot} value={slot}>
                      {slot} {t.reservationBooking.clock}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Guests Picker */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                {t.reservationBooking.guests}
              </label>
              <Select value={guests} onValueChange={setGuests}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {guestOptions.map((num) => (
                    <SelectItem key={num} value={num}>
                      {num} {parseInt(num) === 1 ? t.reservationBooking.person : t.reservationBooking.persons}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* OpenTable Button */}
          <Button 
            onClick={handleBookClick}
            className="w-full h-12 text-base font-semibold gap-2"
            size="lg"
          >
            {t.reservationBooking.bookNow}
            <ExternalLink className="h-4 w-4" />
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            {t.reservationBooking.openTableNote}
          </p>
        </div>

        {/* Alternative Contact */}
        <div className="bg-secondary/30 px-6 py-5 border-t border-border">
          <p className="text-sm text-muted-foreground text-center mb-4">
            {t.reservationBooking.alternativeTitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a 
              href="tel:+498951519696"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-background hover:bg-secondary/50 transition-colors text-sm font-medium"
            >
              <Phone className="h-4 w-4 text-primary" />
              +49 89 51519696
            </a>
            <a 
              href="https://wa.me/491636033912"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-border bg-background hover:bg-secondary/50 transition-colors text-sm font-medium"
            >
              <MessageCircle className="h-4 w-4 text-[#25D366]" />
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>

    {/* Desktop: Dialog */}
    {!isMobile && (
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t.reservationBooking.confirmTitle}</DialogTitle>
            <DialogDescription>
              {t.reservationBooking.confirmSubtitle}
            </DialogDescription>
          </DialogHeader>
          <ConfirmationContent />
        </DialogContent>
      </Dialog>
    )}

    {/* Mobile: Drawer */}
    {isMobile && (
      <Drawer open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>{t.reservationBooking.confirmTitle}</DrawerTitle>
            <DrawerDescription>
              {t.reservationBooking.confirmSubtitle}
            </DrawerDescription>
          </DrawerHeader>
          <div className="px-4 pb-6">
            <ConfirmationContent />
          </div>
        </DrawerContent>
      </Drawer>
    )}
  </>
  );
};

export default ReservationBooking;
