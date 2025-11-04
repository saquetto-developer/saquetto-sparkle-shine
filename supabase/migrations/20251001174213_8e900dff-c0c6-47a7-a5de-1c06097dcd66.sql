-- Create storage bucket for invoices
INSERT INTO storage.buckets (id, name, public) 
VALUES ('invoices', 'invoices', false);

-- Create table to track invoice files in storage
CREATE TABLE public.saquetto_invoices_storage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  saquetto_id INTEGER NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  mime_type TEXT DEFAULT 'application/xml',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_saquetto_invoices_storage_saquetto_id 
ON public.saquetto_invoices_storage(saquetto_id);

-- Create trigger for updated_at
CREATE TRIGGER update_saquetto_invoices_storage_updated_at
BEFORE UPDATE ON public.saquetto_invoices_storage
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();