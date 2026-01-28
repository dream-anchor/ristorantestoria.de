-- Add notification_sent column to track email status
ALTER TABLE public.event_inquiries 
ADD COLUMN notification_sent boolean DEFAULT false,
ADD COLUMN notification_error text DEFAULT NULL,
ADD COLUMN notification_attempts integer DEFAULT 0;