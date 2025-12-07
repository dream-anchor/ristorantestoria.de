-- Create event_inquiries table for corporate event inquiries
CREATE TABLE public.event_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  guest_count TEXT NOT NULL,
  preferred_date DATE,
  event_type TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.event_inquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an inquiry (public form)
CREATE POLICY "Anyone can submit inquiries"
ON public.event_inquiries
FOR INSERT
WITH CHECK (true);

-- Only admins can view inquiries
CREATE POLICY "Admins can view all inquiries"
ON public.event_inquiries
FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete inquiries
CREATE POLICY "Admins can delete inquiries"
ON public.event_inquiries
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));