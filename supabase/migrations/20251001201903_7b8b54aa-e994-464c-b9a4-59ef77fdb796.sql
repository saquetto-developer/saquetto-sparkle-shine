-- Create table for base64 storage of invoices
CREATE TABLE IF NOT EXISTS public.saquetto_notafiscal_base64 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  saquetto_id INTEGER NOT NULL UNIQUE,
  base64 TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create table for invoice storage metadata
CREATE TABLE IF NOT EXISTS public.saquetto_invoices_storage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  saquetto_id INTEGER NOT NULL UNIQUE,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  content_type TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.saquetto_notafiscal_base64 ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saquetto_invoices_storage ENABLE ROW LEVEL SECURITY;

-- Create policies for single user access (allowing all operations)
CREATE POLICY "Allow all operations on base64" 
ON public.saquetto_notafiscal_base64 
FOR ALL 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Allow all operations on storage metadata" 
ON public.saquetto_invoices_storage 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_base64_saquetto_id ON public.saquetto_notafiscal_base64(saquetto_id);
CREATE INDEX IF NOT EXISTS idx_storage_saquetto_id ON public.saquetto_invoices_storage(saquetto_id);

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_base64_updated_at
  BEFORE UPDATE ON public.saquetto_notafiscal_base64
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_storage_updated_at
  BEFORE UPDATE ON public.saquetto_invoices_storage
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();